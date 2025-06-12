'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  CheckCircle as CheckIcon,
  Person as PersonIcon,
  DirectionsBike as BikeIcon,
  Restaurant as RestaurantIcon,
} from '@mui/icons-material';
import NoSSR from '@/components/NoSSR';

const theme = {
  primary: '#FFD700',
  secondary: '#1A1A1A',
  success: '#4CAF50',
  text: '#1A1A1A',
  textSecondary: '#6C757D',
};

const StyledContainer = styled(Container)(() => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
  background: `linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)`,
}));

const StyledCard = styled(Card)(() => ({
  maxWidth: 480,
  width: '100%',
  borderRadius: 20,
  boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
  border: '1px solid #E9ECEF',
}));

const StyledButton = styled(Button)({
  borderRadius: 12,
  textTransform: 'none',
  fontWeight: 600,
  padding: '12px 32px',
  boxShadow: 'none',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)',
  },
});

const roleInfo = {
  CUSTOMER: {
    label: 'ลูกค้า',
    icon: PersonIcon,
    color: '#4CAF50',
    message: 'คุณสามารถสั่งอาหารจากร้านต่างๆ ได้แล้ว',
  },
  RIDER: {
    label: 'ไรเดอร์',
    icon: BikeIcon,
    color: '#2196F3',
    message: 'เรากำลังตรวจสอบข้อมูลของคุณ จะแจ้งผลภายใน 1-2 วันทำการ',
  },
  RESTAURANT: {
    label: 'เจ้าของร้าน',
    icon: RestaurantIcon,
    color: '#FF9800',
    message: 'เรากำลังตรวจสอบข้อมูลร้านของคุณ จะแจ้งผลภายใน 2-3 วันทำการ',
  },
};

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(5);

  const role = searchParams?.get('role') || 'CUSTOMER';
  const firstName = searchParams?.get('firstName') || 'ผู้ใช้';
  
  const currentRole = roleInfo[role as keyof typeof roleInfo] || roleInfo.CUSTOMER;
  const IconComponent = currentRole.icon;

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push('/auth/simple-login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleGoToLogin = () => {
    router.push('/auth/simple-login');
  };

  return (
    <NoSSR>
      <StyledContainer maxWidth="sm">
        <StyledCard>
          <CardContent sx={{ p: 5, textAlign: 'center' }}>
            {/* Success Icon */}
            <Box mb={3}>
              <CheckIcon 
                sx={{ 
                  fontSize: 80, 
                  color: theme.success,
                  filter: 'drop-shadow(0 4px 8px rgba(76, 175, 80, 0.3))'
                }} 
              />
            </Box>

            {/* Welcome Message */}
            <Typography variant="h4" fontWeight="bold" color={theme.text} mb={2}>
              สมัครสมาชิกสำเร็จ!
            </Typography>
            
            <Typography variant="h6" color={theme.textSecondary} mb={4}>
              ยินดีต้อนรับ คุณ{firstName}
            </Typography>

            {/* Role Info */}
            <Box 
              display="flex" 
              alignItems="center" 
              justifyContent="center" 
              gap={2} 
              mb={3}
              p={2}
              bgcolor="#F8F9FA"
              borderRadius={2}
            >
              <Avatar
                sx={{
                  bgcolor: currentRole.color,
                  width: 48,
                  height: 48,
                }}
              >
                <IconComponent sx={{ fontSize: 24 }} />
              </Avatar>
              <Box textAlign="left">
                <Typography variant="h6" fontWeight="bold">
                  ประเภท: {currentRole.label}
                </Typography>
                <Typography variant="body2" color={theme.textSecondary}>
                  {currentRole.message}
                </Typography>
              </Box>
            </Box>

            {/* Additional Info */}
            {role !== 'CUSTOMER' && (
              <Box 
                p={2} 
                bgcolor="#FFF3CD" 
                borderRadius={2} 
                border="1px solid #FFEAA7"
                mb={4}
              >
                <Typography variant="body2" color="#856404">
                  📧 เราจะส่งอีเมลแจ้งผลการตรวจสอบให้คุณ
                </Typography>
              </Box>
            )}

            {/* Action Buttons */}
            <StyledButton
              fullWidth
              variant="contained"
              onClick={handleGoToLogin}
              sx={{
                bgcolor: theme.primary,
                color: theme.secondary,
                mb: 2,
                '&:hover': {
                  bgcolor: '#E6C200',
                },
              }}
            >
              เข้าสู่ระบบ ({countdown})
            </StyledButton>

            <Typography variant="body2" color={theme.textSecondary}>
              หน้านี้จะเปลี่ยนไปยังหน้าเข้าสู่ระบบโดยอัตโนมัติ
            </Typography>
          </CardContent>
        </StyledCard>
      </StyledContainer>
    </NoSSR>
  );
} 