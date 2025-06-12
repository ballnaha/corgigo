import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth(requiredRole?: string) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    if (!session) {
      router.push('/auth/login');
      return;
    }

    if (requiredRole && session.user.role !== requiredRole) {
      router.push('/unauthorized');
      return;
    }
  }, [session, status, requiredRole, router]);

  return {
    user: session?.user,
    isLoading: status === 'loading',
    isAuthenticated: !!session,
    hasRole: (role: string) => session?.user.role === role,
  };
}

// Role-specific hooks
export function useAdminAuth() {
  return useAuth('ADMIN');
}

export function useRiderAuth() {
  return useAuth('RIDER');
}

export function useRestaurantAuth() {
  return useAuth('RESTAURANT');
}

export function useCustomerAuth() {
  return useAuth('CUSTOMER');
} 