'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { colors } from '@/config/colors';
import {
  BottomNavigation,
  BottomNavigationAction,
  Badge,
  Box,
} from '@mui/material';
import {
  Home,
  Search,
  ShoppingCartOutlined,
  Person,
  History,
  MoreVert,
  NotificationsOutlined,
} from '@mui/icons-material';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { useCart } from '@/contexts/CartContext';

interface FooterNavbarProps {}

const FooterNavbar = ({}: FooterNavbarProps) => {
  const pathname = usePathname();
  const { navigateToHome, navigateToOrders, navigateToSettings, navigateToProfile } = useAppNavigation();
  const { itemCount, notificationCount, clearNotifications, isLoaded } = useCart();

  // กำหนดเส้นทางที่ไม่ควรแสดง FooterNavbar
  const hiddenPaths = ['/auth/login', '/auth/register', '/admin', '/onboarding'];
  const shouldHide = hiddenPaths.some(path => pathname?.startsWith(path));

  if (shouldHide) {
    return null;
  }

  // กำหนดค่า active tab ตาม pathname
  const getActiveTab = () => {
    if (pathname === '/') return 0;
    if (pathname?.startsWith('/cart')) return 1;
    if (pathname?.startsWith('/notifications')) return 2;
    if (pathname?.startsWith('/orders')) return 3;
    if (pathname?.startsWith('/profile')) return 4;
    return 0; // default to home
  };

  const handleNavigation = (event: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        navigateToHome();
        break;
      case 1:
        window.location.href = '/cart';
        break;
      case 2:
        clearNotifications();
        window.location.href = '/notifications';
        break;
      case 3:
        navigateToOrders();
        break;
      case 4:
        navigateToProfile();
        break;
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        // Mobile app style - flat design
        borderRadius: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '0.5px solid rgba(0, 0, 0, 0.05)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        // Native mobile app shadow
        boxShadow: '0 -1px 3px rgba(0, 0, 0, 0.1)',
        // Hardware acceleration for smooth performance
        transform: 'translateZ(0)',
        WebkitTransform: 'translateZ(0)',
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
    >
      <BottomNavigation
        value={getActiveTab()}
        onChange={handleNavigation}
        sx={{
          backgroundColor: 'transparent',
          borderRadius: 0,
          height: 68,
          paddingTop: 0.5,
          paddingBottom: 0.5,
          // Native mobile app style
          boxShadow: 'none !important',
          border: 'none',
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            padding: '6px 8px',
            margin: '0',
            transition: 'all 0.2s ease',
            color: '#8E8E93',
            backgroundColor: 'transparent !important',
            boxShadow: 'none !important',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 0,
            '&.Mui-selected': {
              color: colors.primary.golden,
              backgroundColor: 'transparent !important',
              boxShadow: 'none !important',
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.65rem',
                fontWeight: 500,
                fontFamily: 'Prompt, sans-serif',
                marginTop: 0.5,
                color: colors.primary.golden,
                display: 'block !important',
                opacity: '1 !important',
                letterSpacing: '-0.01em',
              },
            },
            '&:hover:not(.Mui-selected)': {
              color: colors.primary.darkGolden,
              opacity: 0.7,
              backgroundColor: 'transparent !important',
              boxShadow: 'none !important',
              
            },
            '&:hover': {
              backgroundColor: 'transparent !important',
              boxShadow: 'none !important',
            },
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.65rem',
              fontWeight: 400,
              fontFamily: 'Prompt, sans-serif',
              marginTop: 0.5,
              transition: 'all 0.2s ease',
              color: '#8E8E93',
              display: 'block !important',
              opacity: '1 !important',
              visibility: 'visible !important',
              letterSpacing: '-0.01em',
            },
          },
        }}
      >
        <BottomNavigationAction
          label="หน้าแรก"
          icon={<Home sx={{ fontSize: 24 }} />}
        />
        
        <BottomNavigationAction
          label="ตะกร้า"
          icon={
            <Badge 
              badgeContent={isLoaded ? itemCount : 0} 
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.6rem',
                  height: 16,
                  minWidth: 16,
                  fontFamily: 'Prompt, sans-serif',
                  fontWeight: 600
                }
              }}
            >
              <ShoppingCartOutlined sx={{ fontSize: 24 }} />
            </Badge>
          }
        />

        <BottomNavigationAction
          label="แจ้งเตือน"
          icon={
            <Badge 
              badgeContent={isLoaded ? notificationCount : 0} 
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.6rem',
                  height: 16,
                  minWidth: 16,
                  fontFamily: 'Prompt, sans-serif',
                  fontWeight: 600
                }
              }}
            >
              <NotificationsOutlined sx={{ fontSize: 24 }} />
            </Badge>
          }
        />
        
        <BottomNavigationAction
          label="ประวัติ"
          icon={<History sx={{ fontSize: 24 }} />}
        />    

        <BottomNavigationAction
          label="โปรไฟล์"
          icon={<Person sx={{ fontSize: 24 }} />}
        />
      </BottomNavigation>
    </Box>
  );
};

export default FooterNavbar; 