import NextAuth from 'next-auth';
import type { Customer, Rider, Restaurant } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: 'CUSTOMER' | 'RIDER' | 'RESTAURANT' | 'ADMIN';
      status: string;
      avatar?: string;
      customer?: Customer;
      rider?: Rider;
      restaurant?: Restaurant;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: 'CUSTOMER' | 'RIDER' | 'RESTAURANT' | 'ADMIN';
    status: string;
    avatar?: string;
    customer?: Customer;
    rider?: Rider;
    restaurant?: Restaurant;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: 'CUSTOMER' | 'RIDER' | 'RESTAURANT' | 'ADMIN';
    status: string;
    customer?: Customer;
    rider?: Rider;
    restaurant?: Restaurant;
  }
} 