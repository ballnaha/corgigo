import NextAuth from 'next-auth';
import type { Customer, Rider, Restaurant } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      primaryRole: 'CUSTOMER' | 'RIDER' | 'RESTAURANT' | 'ADMIN';
      roles: ('CUSTOMER' | 'RIDER' | 'RESTAURANT' | 'ADMIN')[];
      currentRole?: 'CUSTOMER' | 'RIDER' | 'RESTAURANT' | 'ADMIN';
      status: string;
      avatar?: string | null;
      customer?: Customer;
      rider?: Rider;
      restaurant?: Restaurant;
    };
    lastRefresh?: number;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    primaryRole: 'CUSTOMER' | 'RIDER' | 'RESTAURANT' | 'ADMIN';
    roles: ('CUSTOMER' | 'RIDER' | 'RESTAURANT' | 'ADMIN')[];
    status: string;
    avatar?: string | null;
    customer?: Customer;
    rider?: Rider;
    restaurant?: Restaurant;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    primaryRole: 'CUSTOMER' | 'RIDER' | 'RESTAURANT' | 'ADMIN';
    roles: ('CUSTOMER' | 'RIDER' | 'RESTAURANT' | 'ADMIN')[];
    currentRole?: 'CUSTOMER' | 'RIDER' | 'RESTAURANT' | 'ADMIN';
    status: string;
    customer?: Customer;
    rider?: Rider;
    restaurant?: Restaurant;
    lastRefresh?: number;
  }
} 