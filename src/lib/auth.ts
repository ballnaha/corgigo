import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' },
      },
      async authorize(credentials) {
        try {
          console.log('🔐 NextAuth authorize attempt:', { 
            email: credentials?.email,
            hasPassword: !!credentials?.password,
            role: credentials?.role 
          });

          if (!credentials?.email || !credentials?.password) {
            console.log('❌ Missing credentials');
            return null;
          }

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
            include: {
              customer: true,
              rider: true,
              restaurant: true,
              userRoles: true,
            },
          });

          if (!user) {
            console.log('❌ User not found:', credentials.email);
            return null;
          }

          console.log('✅ User found:', { 
            id: user.id, 
            email: user.email, 
            primaryRole: user.primaryRole,
            status: user.status,
            userRoles: user.userRoles?.length || 0
          });

          // สำหรับ LINE login ไม่ต้องตรวจสอบรหัสผ่าน
          if (credentials.password === 'line_login' && (user as any).lineId) {
            // LINE login - ข้ามการตรวจสอบรหัสผ่าน
          } else {
            const isPasswordValid = await bcrypt.compare(credentials.password, user.password || '');
            
            if (!isPasswordValid) {
              console.log('❌ Invalid password for:', credentials.email);
              return null;
            }
          }

          if (user.status !== 'ACTIVE') {
            console.log('❌ User account not active:', credentials.email, 'Status:', user.status);
            return null;
          }

          // ใช้ primaryRole และ userRoles จาก schema ใหม่
          const userRoles = user.userRoles.map(ur => ur.role);
          // ถ้าไม่มี roles ใน userRoles table ให้ใช้ primaryRole
          const availableRoles = userRoles.length > 0 ? userRoles : [user.primaryRole];
          
          const requestedRole = credentials.role;
          // ตรวจสอบ role ที่ request มา
          if (requestedRole && !availableRoles.includes(requestedRole as any)) {
            return null;
          }

          const currentRole = requestedRole || user.primaryRole;

          const userResult = {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            primaryRole: user.primaryRole,
            roles: availableRoles,
            currentRole: currentRole as any,
            status: user.status,
            avatar: user.avatar || undefined,
            customer: user.customer || undefined,
            rider: user.rider || undefined,
            restaurant: user.restaurant || undefined,
          };

          console.log('✅ Authentication successful:', {
            email: userResult.email,
            primaryRole: userResult.primaryRole,
            roles: userResult.roles,
            currentRole: userResult.currentRole
          });

          return userResult;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: parseInt(process.env.NEXTAUTH_SESSION_MAX_AGE || '2592000'), // 30 days default
    updateAge: 24 * 60 * 60, // Update session every 24 hours
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: parseInt(process.env.NEXTAUTH_SESSION_MAX_AGE || '2592000'), // 30 days default
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Add user info to token on sign in
      if (user) {
        token.primaryRole = (user as any).primaryRole;
        token.roles = (user as any).roles;
        token.currentRole = (user as any).currentRole;
        token.status = (user as any).status;
        token.avatar = (user as any).avatar;
        token.customer = (user as any).customer;
        token.rider = (user as any).rider;
        token.restaurant = (user as any).restaurant;
        token.lastRefresh = Date.now();
      }

      // Auto-refresh user data periodically (every 24 hours)
      const shouldRefresh = trigger === 'update' || 
        (token.lastRefresh && Date.now() - (token.lastRefresh as number) > 24 * 60 * 60 * 1000);

      if (shouldRefresh && token.sub) {
        try {
          console.log('🔄 Refreshing user data from database...');
          const refreshedUser = await prisma.user.findUnique({
            where: { id: token.sub },
            include: {
              customer: true,
              rider: true,
              restaurant: true,
              userRoles: true,
            },
          });

          if (refreshedUser && refreshedUser.status === 'ACTIVE') {
            // Update token with fresh user data
            const refreshedUserRoles = refreshedUser.userRoles.map(ur => ur.role);
            const refreshedAvailableRoles = refreshedUserRoles.length > 0 ? refreshedUserRoles : [refreshedUser.primaryRole];
            
            token.primaryRole = refreshedUser.primaryRole;
            token.roles = refreshedAvailableRoles;
            token.status = refreshedUser.status;
            token.avatar = refreshedUser.avatar;
            token.customer = refreshedUser.customer || undefined;
            token.rider = refreshedUser.rider || undefined;
            token.restaurant = refreshedUser.restaurant || undefined;
            token.lastRefresh = Date.now();
          } else if (refreshedUser?.status !== 'ACTIVE') {
            // If user is no longer active, invalidate token
            console.log('❌ User status changed to inactive, invalidating token');
            throw new Error('User account is no longer active');
          }
        } catch (error) {
          console.error('Error refreshing user data:', error);
          // Return existing token if refresh fails
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub as string;
        session.user.primaryRole = token.primaryRole as 'CUSTOMER' | 'RIDER' | 'RESTAURANT' | 'ADMIN';
        session.user.roles = token.roles as ('CUSTOMER' | 'RIDER' | 'RESTAURANT' | 'ADMIN')[];
        session.user.currentRole = token.currentRole as 'CUSTOMER' | 'RIDER' | 'RESTAURANT' | 'ADMIN';
        session.user.status = token.status as string;
        session.user.avatar = token.avatar as string;
        session.user.customer = token.customer as any;
        session.user.rider = token.rider as any;
        session.user.restaurant = token.restaurant as any;
        
        // Add refresh indicator to session for debugging
        session.lastRefresh = token.lastRefresh as number;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 