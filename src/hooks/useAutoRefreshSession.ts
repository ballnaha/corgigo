import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';

export function useAutoRefreshSession() {
  const { data: session, update } = useSession();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only setup auto-refresh if user is logged in
    if (!session?.user) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Auto-refresh session every 30 minutes to keep it active
    const refreshSession = async () => {
      try {
        console.log('🔄 Auto-refreshing session...');
        await update();
      } catch (error) {
        console.error('❌ Failed to refresh session:', error);
      }
    };

    // Initial refresh after 5 seconds to ensure fresh data
    const initialTimeout = setTimeout(refreshSession, 5000);

    // Set up periodic refresh every 30 minutes
    intervalRef.current = setInterval(refreshSession, 30 * 60 * 1000);

    return () => {
      clearTimeout(initialTimeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [session?.user, update]);

  return {
    session,
    isAuthenticated: !!session?.user,
    lastRefresh: session?.lastRefresh,
    refreshSession: update,
  };
} 