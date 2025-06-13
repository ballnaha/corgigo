'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  BottomNavigation,
  BottomNavigationAction,
  Badge,
  Box,
} from '@mui/material';
import {
  Home,
  Search,
  FavoriteOutlined,
  ShoppingCartOutlined,
  Person,
} from '@mui/icons-material';

interface FooterNavbarProps {
  cartCount?: number;
}

const FooterNavbar = ({ cartCount = 0 }: FooterNavbarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  // กำหนดเส้นทางที่ไม่ควรแสดง FooterNavbar
  const hiddenPaths = ['/auth/login', '/auth/register', '/admin', '/onboarding'];
  const shouldHide = hiddenPaths.some(path => pathname?.startsWith(path));

  if (shouldHide) {
    return null;
  }

  // กำหนดค่า active tab ตาม pathname
  const getActiveTab = () => {
    if (pathname === '/') return 0;
    if (pathname?.startsWith('/search')) return 1;
    if (pathname?.startsWith('/cart')) return 2;
    if (pathname?.startsWith('/profile')) return 3;
    return 0; // default to home
  };

  const handleNavigation = (event: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        router.push('/');
        break;
      case 1:
        router.push('/search');
        break;
      case 2:
        router.push('/cart');
        break;
      case 3:
        router.push('/profile');
        break;
    }
  };

  return (
    <Box
      sx={{
        position: 'sticky',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        borderRadius: '20px 20px 0 0',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #F0F0F0',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        // เอา shadow ออกหมด
        boxShadow: 'none',
        // Sticky positioning เหมือน AppHeader
        marginTop: 'auto',
      }}
    >
      <BottomNavigation
        value={getActiveTab()}
        onChange={handleNavigation}
        sx={{
          backgroundColor: 'transparent',
          borderRadius: '20px 20px 0 0',
          height: 80,
          paddingTop: 1,
          paddingBottom: 1,
          // เอาเงาสีเหลืองออกหมด
          boxShadow: 'none !important',
          border: 'none',
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            padding: '12px 4px',
            margin: '0',
            transition: 'all 0.25s ease',
            color: '#1A1A1A',
            backgroundColor: 'transparent !important',
            boxShadow: 'none !important',
            display: 'flex',
            flexDirection: 'column',
            '&.Mui-selected': {
              color: '#F8A66E',
              backgroundColor: 'transparent !important',
              boxShadow: 'none !important',
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.8rem',
                fontWeight: 600,
                fontFamily: 'Prompt, sans-serif',
                marginTop: 1,
                color: '#F8A66E',
                display: 'block !important',
                opacity: '1 !important',
              },
            },
            '&:hover:not(.Mui-selected)': {
              color: '#F8A66E',
              opacity: 0.7,
              backgroundColor: 'transparent !important',
              boxShadow: 'none !important',
              
            },
            '&:hover': {
              backgroundColor: 'transparent !important',
              boxShadow: 'none !important',
            },
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.8rem',
              fontWeight: 500,
              fontFamily: 'Prompt, sans-serif',
              marginTop: 1,
              transition: 'all 0.25s ease',
              color: '#1A1A1A',
              display: 'block !important',
              opacity: '1 !important',
              visibility: 'visible !important',
            },
          },
        }}
      >
        <BottomNavigationAction
          label="หน้าแรก"
          icon={<Home sx={{ fontSize: 22 }} />}
        />
        
        <BottomNavigationAction
          label="ค้นหา"
          icon={<Search sx={{ fontSize: 22 }} />}
        />
    
        
        <BottomNavigationAction
          label="ตะกร้า"
          icon={
            cartCount > 0 ? (
              <Badge 
                badgeContent={cartCount} 
                color="secondary"
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: '#F35C76',
                    color: 'white',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    minWidth: 16,
                    height: 16,
                  },
                }}
              >
                <ShoppingCartOutlined sx={{ fontSize: 22 }} />
              </Badge>
            ) : (
              <ShoppingCartOutlined sx={{ fontSize: 22 }} />
            )
          }
        />
        
        <BottomNavigationAction
          label="โปรไฟล์"
          icon={<Person sx={{ fontSize: 22 }} />}
        />
      </BottomNavigation>
    </Box>
  );
};

export default FooterNavbar; 