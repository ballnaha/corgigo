'use client';

import React, { useEffect, useState, Suspense } from 'react';

interface NoSSRProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  defer?: boolean;
}

export default function NoSSR({ 
  children, 
  fallback = null, 
  defer = false 
}: NoSSRProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (defer) {
      // เลื่อนการ mount เพื่อให้ critical content load ก่อน
      const timer = setTimeout(() => setIsMounted(true), 0);
      return () => clearTimeout(timer);
    } else {
      setIsMounted(true);
    }
  }, [defer]);

  if (!isMounted) {
    return <>{fallback}</>;
  }

  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
} 