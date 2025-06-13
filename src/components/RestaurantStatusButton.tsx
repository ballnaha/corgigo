'use client';

import { useState, useEffect } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { Restaurant, Add, Visibility, Edit } from '@mui/icons-material';

interface RestaurantStatusButtonProps {
  session: any;
  router: any;
}

export default function RestaurantStatusButton({ session, router }: RestaurantStatusButtonProps) {
  const [restaurantStatus, setRestaurantStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRestaurantStatus = async () => {
      try {
        const response = await fetch('/api/restaurant/status');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.restaurant) {
            setRestaurantStatus(result.restaurant.status);
            
            // Auto redirect if approved
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
      router.push('/restaurant/register');
    } else if (restaurantStatus === 'PENDING') {
      router.push('/restaurant/pending');
    } else if (restaurantStatus === 'APPROVED') {
      router.push('/restaurant');
    } else if (restaurantStatus === 'REJECTED') {
      router.push('/restaurant/register');
    }
  };

  const getButtonProps = () => {
    switch (restaurantStatus) {
      case 'PENDING':
        return {
          icon: <Visibility />,
          text: 'ดูสถานะการสมัคร',
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