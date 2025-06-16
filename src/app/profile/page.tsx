'use client';

import { useState, useEffect } from 'react';
import { CircularProgress, Box } from '@mui/material';
import SimpleProfileClient from './simple-client';
import LoadingScreen from '@/components/LoadingScreen';

export default function ProfilePage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <LoadingScreen
        step="processing"
        showProgress={true}
        currentStep={1}
        totalSteps={2}
        customMessage="กำลังเตรียมหน้าโปรไฟล์..."
        subtitle="โหลดข้อมูลผู้ใช้"
      />
    );
  }

  return <SimpleProfileClient />;
} 