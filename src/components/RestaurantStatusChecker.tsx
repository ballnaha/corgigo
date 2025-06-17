'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';

const vristoTheme = {
  primary: '#4361ee',
  background: {
    main: '#f8fafc',
  },
  text: {
    secondary: '#64748b',
  },
  font: {
    family: '"Prompt", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  }
};

interface RestaurantStatusCheckerProps {
  children: React.ReactNode;
  requiredStatus?: 'APPROVED' | 'PENDING' | 'ANY';
  redirectTo?: string;
  loadingMessage?: string;
}

export default function RestaurantStatusChecker({
  children,
  requiredStatus = 'APPROVED',
  redirectTo,
  loadingMessage = 'กำลังตรวจสอบสถานะร้านอาหาร...',
}: RestaurantStatusCheckerProps) {
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  // เช็คสถานะ restaurant
  const checkRestaurantStatus = async () => {
    try {
      const response = await fetch('/api/restaurant/status');
      const result = await response.json();

      if (response.ok && result.success) {
        const status = result.restaurant.status;
        
        // ตรวจสอบสถานะตามที่กำหนด
        if (requiredStatus === 'ANY') {
          setHasAccess(true);
        } else if (requiredStatus === 'APPROVED' && status === 'APPROVED') {
          setHasAccess(true);
        } else if (requiredStatus === 'PENDING' && status === 'PENDING') {
          setHasAccess(true);
        } else {
          // สถานะไม่ตรงตามที่ต้องการ
          if (status === 'APPROVED') {
            router.push('/restaurant');
          } else if (status === 'PENDING' || status === 'REJECTED' || status === 'SUSPENDED') {
            router.push('/restaurant/pending');
          } else {
            router.push(redirectTo || '/restaurant/register');
          }
          return;
        }
      } else {
        // ถ้าไม่พบข้อมูลร้านอาหาร
        if (response.status === 404) {
          router.push('/restaurant/register');
          return;
        }
        // กรณีอื่นๆ ให้ไปหน้า pending
        router.push('/restaurant/pending');
        return;
      }
    } catch (error) {
      console.error('Error checking restaurant status:', error);
      // ในกรณีเกิดข้อผิดพลาด ให้ไปหน้า pending เพื่อความปลอดภัย
      router.push('/restaurant/pending');
      return;
    } finally {
      setIsCheckingStatus(false);
    }
  };

  useEffect(() => {
    // รอให้ session โหลดเสร็จก่อน
    if (sessionStatus === 'loading') return;

    if (!session?.user) {
      router.push('/auth/login');
      return;
    }

    // ตรวจสอบว่าผู้ใช้มี restaurant role หรือไม่
    const userRoles = session.user.roles || [];
    if (!userRoles.includes('RESTAURANT')) {
      router.push('/restaurant/register');
      return;
    }

    // เช็คสถานะ restaurant
    checkRestaurantStatus();
  }, [session, sessionStatus, router, requiredStatus, redirectTo]);

  // ถ้ากำลังเช็คสถานะ ให้แสดง loading
  if (sessionStatus === 'loading' || isCheckingStatus) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        bgcolor: vristoTheme.background.main,
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ color: vristoTheme.primary }} />
          <Typography 
            variant="h6" 
            sx={{ 
              mt: 2, 
              color: vristoTheme.text.secondary,
              fontFamily: vristoTheme.font.family,
            }}
          >
            {loadingMessage}
          </Typography>
        </Box>
      </Box>
    );
  }

  // ถ้าไม่มีสิทธิ์เข้าถึง ให้ return null
  if (!hasAccess) {
    return null;
  }

  // ถ้าผ่านการตรวจสอบแล้ว ให้แสดง children
  return <>{children}</>;
} 