import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

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

      // Restaurant routes (except register page)
      if (path.startsWith('/restaurant') && 
          path !== '/restaurant/register' && 
          path !== '/restaurant/pending' &&
          userRole !== 'RESTAURANT' && !userRoles.includes('RESTAURANT')) {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
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