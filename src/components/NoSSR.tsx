'use client';

import { useEffect, useState } from 'react';
import { CircularProgress, Box } from '@mui/material';
import LoadingScreen from './LoadingScreen';

interface NoSSRProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function NoSSR({ children, fallback }: NoSSRProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return fallback || (
      <LoadingScreen
        step="processing"
        showProgress={true}
        currentStep={1}
        totalSteps={2}
        customMessage="กำลังเตรียมหน้าเว็บ..."
        subtitle="โหลดข้อมูลเริ่มต้น"
      />
    );
  }

  return <>{children}</>;
} 