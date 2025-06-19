import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    
    // === MULTI-TENANT DOMAIN ROUTING ===
    const hostname = req.headers.get('host') || '';
    const url = req.nextUrl.clone();
    
    // Extract subdomain (works for both localhost:3000 and subdomain.corgigo.com)
    let subdomain = '';
    if (hostname.includes('.')) {
      subdomain = hostname.split('.')[0];
    }
    
    // Handle admin subdomain
    if (subdomain === 'admin' || path.startsWith('/admin')) {
      // Admin panel access - require ADMIN role
      if (token && (token.primaryRole === 'ADMIN' || (token.roles && token.roles.includes('ADMIN')))) {
        if (subdomain === 'admin' && !path.startsWith('/admin')) {
          url.pathname = `/admin${path}`;
          return NextResponse.rewrite(url);
        }
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL('/auth/login', req.url));
      }
    }
    
    // Handle restaurant subdomains (e.g., lacasa.corgigo.com)
    if (subdomain && subdomain !== 'www' && subdomain !== 'corgigo' && !hostname.includes('localhost')) {
      // This is a restaurant subdomain - route to restaurant-specific pages
      if (!path.startsWith('/restaurant/tenant/')) {
        url.pathname = `/restaurant/tenant/${subdomain}${path}`;
        return NextResponse.rewrite(url);
      }
    }

    // Let API routes pass through
    if (path.startsWith('/api/')) {
      return NextResponse.next();
    }

    // Redirect authenticated users away from auth pages
    if (token && (path.startsWith('/auth/login') || path.startsWith('/auth/register'))) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Role-based route protection
    if (token) {
      const userRole = token.primaryRole || token.currentRole;
      const userRoles = token.roles || [];

      // Admin routes
      if (path.startsWith('/admin') && userRole !== 'ADMIN' && !userRoles.includes('ADMIN')) {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }

      // Rider routes
      if (path.startsWith('/rider') && userRole !== 'RIDER' && !userRoles.includes('RIDER')) {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }

      // Restaurant routes - Enhanced protection
      if (path.startsWith('/restaurant')) {
        // อนุญาตให้ทุกคนเข้าหน้า register (สำหรับ customer ที่อยากสมัครเปิดร้าน)
        if (path === '/restaurant/register') {
          return NextResponse.next();
        }

        // สำหรับหน้าอื่นๆ ต้องมี RESTAURANT role
        if (userRole !== 'RESTAURANT' && !userRoles.includes('RESTAURANT')) {
          // ถ้าไม่มี restaurant role และไม่ใช่หน้า register ให้ redirect ไป register
          return NextResponse.redirect(new URL('/restaurant/register', req.url));
        }

        // อนุญาตให้เข้าหน้า pending เสมอสำหรับ restaurant owners
        if (path === '/restaurant/pending') {
          return NextResponse.next();
        }

        // สำหรับหน้าอื่นๆ ใน /restaurant จะต้องมีการตรวจสอบสถานะใน client component
        // ที่ RestaurantClientLayout แล้ว ดังนั้นให้ผ่านไปได้
        // แต่ client component จะ redirect ไปหน้า pending หากสถานะไม่ใช่ APPROVED
      }

      // Customer routes (most pages are accessible to customers)
      // Additional customer-specific logic can be added here
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // Always allow API routes
        if (path.startsWith('/api/')) {
          return true;
        }

        // Public paths that don't require authentication
        const publicPaths = [
          '/',
          '/auth/login',
          '/auth/register',
          '/auth/error',
          '/unauthorized',
        ];

        // Allow public paths
        if (publicPaths.some(publicPath => path.startsWith(publicPath))) {
          return true;
        }

        // Protected routes require authentication
        if (path.startsWith('/admin') || 
            path.startsWith('/rider') || 
            path.startsWith('/restaurant') ||
            path.startsWith('/profile') ||
            path.startsWith('/orders')) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 