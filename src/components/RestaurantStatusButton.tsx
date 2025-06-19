'use client';

import { useState, useEffect } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { Restaurant, Add, Visibility, Edit } from '@mui/icons-material';
import { useNavigation } from '@/contexts/NavigationContext';

interface RestaurantStatusButtonProps {
  session: any;
  router: any;
}

export default function RestaurantStatusButton({ session, router }: RestaurantStatusButtonProps) {
  const [restaurantStatus, setRestaurantStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const loadRestaurantStatus = async () => {
      try {
        const response = await fetch('/api/restaurant/status');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.restaurant) {
            setRestaurantStatus(result.restaurant.status);
            
            // ไม่ auto redirect แล้ว - ให้ผู้ใช้คลิกเอง
          }
        } else if (response.status === 404) {
          // ไม่พบข้อมูลร้านอาหาร = ยังไม่ได้สมัคร
          setRestaurantStatus(null);
        } else if (response.status === 401) {
          // ไม่ได้รับการยืนยันตัวตน = ต้อง login ก่อน
          console.log('⚠️ Authentication required for restaurant status');
          setRestaurantStatus(null);
        } else {
          console.error('API error:', response.status);
          setRestaurantStatus(null);
        }
      } catch (error) {
        console.error('Error loading restaurant status:', error);
        setRestaurantStatus(null);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      loadRestaurantStatus();
    } else {
      setLoading(false);
    }
  }, [session, router]);

  if (loading) {
    return (
      <Button
        disabled
        startIcon={<CircularProgress size={16} />}
        sx={{
          fontFamily: 'Prompt, sans-serif',
          textTransform: 'none',
          borderRadius: 2,
        }}
      >
        กำลังโหลด...
      </Button>
    );
  }

  const handleClick = () => {
    if (!restaurantStatus) {
      navigation.push('/restaurant/register', 'สมัครเปิดร้านอาหาร');
    } else if (restaurantStatus === 'PENDING') {
      navigation.push('/restaurant/pending', 'สถานะการสมัคร');
    } else if (restaurantStatus === 'APPROVED') {
      navigation.push('/restaurant', 'จัดการร้านอาหาร');
    } else if (restaurantStatus === 'REJECTED') {
      navigation.push('/restaurant/register', 'สมัครใหม่อีกครั้ง');
    }
  };

  const getButtonProps = () => {
    switch (restaurantStatus) {
      case 'PENDING':
        return {
          icon: <Visibility />,
          text: 'ดูสถานะการสมัครร้านอาหาร',
          color: '#FF9800',
        };
      case 'APPROVED':
        return {
          icon: <Restaurant />,
          text: 'จัดการร้านอาหาร',
          color: '#4CAF50',
        };
      case 'REJECTED':
        return {
          icon: <Edit />,
          text: 'สมัครใหม่อีกครั้ง',
          color: '#F44336',
        };
      default:
        return {
          icon: <Add />,
          text: 'สมัครเปิดร้านอาหาร',
          color: '#F8A66E',
        };
    }
  };

  const buttonProps = getButtonProps();

  return (
    <Button
      variant="outlined"
      startIcon={buttonProps.icon}
      onClick={handleClick}
      sx={{
        borderColor: buttonProps.color,
        color: buttonProps.color,
        fontFamily: 'Prompt, sans-serif',
        fontWeight: 500,
        borderRadius: 2,
        textTransform: 'none',
        '&:hover': {
          borderColor: buttonProps.color,
          bgcolor: `${buttonProps.color}10`,
        },
      }}
    >
      {buttonProps.text}
    </Button>
  );
} 