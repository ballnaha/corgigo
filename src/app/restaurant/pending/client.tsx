'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Stack,
  CircularProgress,
  Chip,
  Button,
  alpha,
} from '@mui/material';
import {
  HourglassEmpty,
  CheckCircle,
  Cancel,
  Store,
  ArrowBack,
  Refresh,
} from '@mui/icons-material';
import AppHeader from '@/components/AppHeader';
import NoSSR from '@/components/NoSSR';

interface RestaurantStatus {
  id: string;
  name: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  submittedAt: string;
  rejectReason?: string;
}

export default function RestaurantPendingClient() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [restaurant, setRestaurant] = useState<RestaurantStatus | null>(null);
  const [formattedDate, setFormattedDate] = useState<string>('');

  const loadRestaurantStatus = async () => {
    try {
      const response = await fetch('/api/restaurant/status');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setRestaurant(result.restaurant);
          
          // Format date on client side to avoid hydration mismatch
          if (result.restaurant.submittedAt) {
            const date = new Date(result.restaurant.submittedAt);
            const formatted = date.toLocaleDateString('th-TH', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });
            setFormattedDate(formatted);
          }
          
          // ถ้าได้รับการอนุมัติแล้ว ให้ไปหน้าร้านอาหาร
          if (result.restaurant.status === 'APPROVED') {
            router.push('/restaurant');
            return;
          }
        }
      }
    } catch (error) {
      console.error('Error loading restaurant status:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      loadRestaurantStatus();
    }
  }, [session]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRestaurantStatus();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <HourglassEmpty sx={{ fontSize: 48, color: '#F8A66E' }} />;
      case 'APPROVED':
        return <CheckCircle sx={{ fontSize: 48, color: '#4CAF50' }} />;
      case 'REJECTED':
        return <Cancel sx={{ fontSize: 48, color: '#F44336' }} />;
      default:
        return <HourglassEmpty sx={{ fontSize: 48, color: '#999' }} />;
    }
  };

  const getStatusChip = (status: string) => {
    const config = {
      PENDING: { label: 'รอการตรวจสอบ', color: '#F8A66E' },
      APPROVED: { label: 'อนุมัติแล้ว', color: '#4CAF50' },
      REJECTED: { label: 'ไม่อนุมัติ', color: '#F44336' },
      SUSPENDED: { label: 'ระงับการใช้งาน', color: '#999' },
    };

    const statusConfig = config[status as keyof typeof config] || config.PENDING;

    return (
      <Chip
        label={statusConfig.label}
        sx={{
          bgcolor: alpha(statusConfig.color, 0.1),
          color: statusConfig.color,
          fontFamily: 'Prompt, sans-serif',
          fontWeight: 600,
          borderRadius: 2,
        }}
      />
    );
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'เรากำลังตรวจสอบข้อมูลร้านของคุณ จะแจ้งผลภายใน 2-3 วันทำการ';
      case 'APPROVED':
        return 'ยินดีด้วย! ร้านของคุณได้รับการอนุมัติแล้ว สามารถเริ่มรับออเดอร์ได้เลย';
      case 'REJECTED':
        return 'ขออภัย ร้านของคุณไม่ผ่านการตรวจสอบ กรุณาตรวจสอบเหตุผลและแก้ไข';
      case 'SUSPENDED':
        return 'ร้านของคุณถูกระงับการใช้งาน กรุณาติดต่อฝ่ายสนับสนุน';
      default:
        return 'ไม่สามารถโหลดสถานะได้';
    }
  };

  if (!session) {
    router.push('/auth/login');
    return null;
  }

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        bgcolor: '#FAFAFA',
      }}>
        <CircularProgress sx={{ color: '#F8A66E' }} size={40} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      backgroundColor: '#FAFAFA',
      minHeight: '100vh',
      paddingBottom: '20px',
      fontFamily: 'Prompt, sans-serif',
    }}>
      <AppHeader />
      
      <Container maxWidth="sm" sx={{ py: 4, px: 2 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.push('/profile')}
            sx={{
              color: '#666',
              fontFamily: 'Prompt, sans-serif',
              textTransform: 'none',
            }}
          >
            กลับ
          </Button>
        </Box>

        {/* Status Card */}
        <Card
          elevation={0}
          sx={{ 
            borderRadius: 3,
            border: '1px solid #E8E8E8',
            bgcolor: '#FFFFFF',
            overflow: 'visible',
          }}
        >
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            {/* Status Icon */}
            <Box sx={{ mb: 3 }}>
              {restaurant ? getStatusIcon(restaurant.status) : <Store sx={{ fontSize: 48, color: '#999' }} />}
            </Box>

            {/* Restaurant Name */}
            {restaurant && (
              <Typography 
                variant="h5" 
                sx={{ 
                  fontFamily: 'Prompt, sans-serif',
                  fontWeight: 600,
                  color: '#1A1A1A',
                  mb: 2,
                }}
              >
                {restaurant.name}
              </Typography>
            )}

            {/* Status Chip */}
            {restaurant && (
              <Box sx={{ mb: 3 }}>
                {getStatusChip(restaurant.status)}
              </Box>
            )}

            {/* Status Message */}
            <Typography 
              variant="body1" 
              sx={{ 
                fontFamily: 'Prompt, sans-serif',
                color: '#666',
                lineHeight: 1.6,
                mb: 3,
              }}
            >
              {restaurant ? getStatusMessage(restaurant.status) : 'ไม่พบข้อมูลร้านอาหาร'}
            </Typography>

            {/* Reject Reason */}
            {restaurant?.status === 'REJECTED' && restaurant.rejectReason && (
              <Box 
                sx={{ 
                  bgcolor: alpha('#F44336', 0.1),
                  border: `1px solid ${alpha('#F44336', 0.2)}`,
                  borderRadius: 2,
                  p: 2,
                  mb: 3,
                }}
              >
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontFamily: 'Prompt, sans-serif',
                    fontWeight: 600,
                    color: '#F44336',
                    mb: 1,
                  }}
                >
                  เหตุผลที่ไม่อนุมัติ:
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: 'Prompt, sans-serif',
                    color: '#F44336',
                  }}
                >
                  {restaurant.rejectReason}
                </Typography>
              </Box>
            )}

            {/* Submitted Date */}
            {restaurant && formattedDate && (
              <NoSSR>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: 'Prompt, sans-serif',
                    color: '#999',
                    mb: 3,
                  }}
                >
                  ส่งคำขอเมื่อ: {formattedDate}
                </Typography>
              </NoSSR>
            )}

            {/* Action Buttons */}
            <Stack spacing={2}>
              <Button
                variant="outlined"
                startIcon={refreshing ? <CircularProgress size={16} /> : <Refresh />}
                onClick={handleRefresh}
                disabled={refreshing}
                sx={{
                  borderColor: '#F8A66E',
                  color: '#F8A66E',
                  fontFamily: 'Prompt, sans-serif',
                  fontWeight: 500,
                  borderRadius: 2,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: alpha('#F8A66E', 0.1),
                    borderColor: '#F8A66E',
                  },
                }}
              >
                {refreshing ? 'กำลังโหลด...' : 'รีเฟรชสถานะ'}
              </Button>

              {restaurant?.status === 'REJECTED' && (
                <Button
                  variant="contained"
                  onClick={() => router.push('/restaurant/register')}
                  sx={{
                    bgcolor: '#F8A66E',
                    color: '#FFFFFF',
                    fontFamily: 'Prompt, sans-serif',
                    fontWeight: 500,
                    borderRadius: 2,
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: '#E8956E',
                    },
                  }}
                >
                  สมัครใหม่
                </Button>
              )}

              {restaurant?.status === 'APPROVED' && (
                <Button
                  variant="contained"
                  onClick={() => router.push('/restaurant')}
                  sx={{
                    bgcolor: '#4CAF50',
                    color: '#FFFFFF',
                    fontFamily: 'Prompt, sans-serif',
                    fontWeight: 500,
                    borderRadius: 2,
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: '#45A049',
                    },
                  }}
                >
                  ไปหน้าจัดการร้าน
                </Button>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
} 