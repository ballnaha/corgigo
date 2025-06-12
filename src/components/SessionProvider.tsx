'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function SessionProvider({ children }: Props) {
  return (
    <NextAuthSessionProvider
      refetchInterval={30 * 60} // Refetch session every 30 minutes
      refetchOnWindowFocus={true} // Refetch when window gains focus
      refetchWhenOffline={false} // Don't refetch when offline
    >
      {children}
    </NextAuthSessionProvider>
  );
} 