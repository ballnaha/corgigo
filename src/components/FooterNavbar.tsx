'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Badge,
} from '@mui/material';
import {
  Home,
  Search,
  ShoppingCart,
  FavoriteOutlined,
  Person,
} from '@mui/icons-material';

const FooterNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    {
      label: 'หน้าหลัก',
      icon: <Home />,
      path: '/',
      value: 'home',
    },
    {
      label: 'ค้นหา',
      icon: <Search />,
      path: '/search',
      value: 'search',
    },
    {
      label: 'ตะกร้า',
      icon: (
        <Badge 
          badgeContent={2} 
          sx={{
            '& .MuiBadge-badge': {
              bgcolor: '#F35C76',
              color: '#FFFFFF',
              fontSize: '0.6rem',
              fontFamily: 'Prompt, sans-serif',
              fontWeight: 600,
              minWidth: '16px',
              height: '16px',
              top: -2,
              right: -2,
            },
          }}
        >
          <ShoppingCart />
        </Badge>
      ),
      path: '/cart',
      value: 'cart',
    },
    {
      label: 'รายการโปรด',
      icon: <FavoriteOutlined />,
      path: '/favorites',
      value: 'favorites',
    },
    {
      label: 'โปรไฟล์',
      icon: <Person />,
      path: '/profile',
      value: 'profile',
    },
  ];

  // Get current value based on pathname
  const getCurrentValue = () => {
    const item = navItems.find(item => item.path === pathname);
    return item ? item.value : 'home';
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    const item = navItems.find(item => item.value === newValue);
    if (item) {
      router.push(item.path);
    }
  };

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0,
        zIndex: 1000,
        borderTop: '1px solid #E8E8E8',
        borderRadius: 0,
      }} 
      elevation={3}
    >
      <BottomNavigation
        value={getCurrentValue()}
        onChange={handleChange}
        sx={{
          height: 64,
          bgcolor: '#FFFFFF',
          '& .MuiBottomNavigationAction-root': {
            fontFamily: 'Prompt, sans-serif',
            fontSize: '0.75rem',
            minWidth: 'auto',
            padding: '6px 12px 8px',
            '&.Mui-selected': {
              color: '#F8A66E',
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.75rem',
                fontWeight: 600,
              },
            },
            '&:not(.Mui-selected)': {
              color: '#9AA0A6',
            },
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.7rem',
              fontWeight: 500,
              marginTop: '4px',
            },
          },
          '& .MuiSvgIcon-root': {
            fontSize: '22px',
          },
        }}
      >
        {navItems.map((item) => (
          <BottomNavigationAction
            key={item.value}
            label={item.label}
            value={item.value}
            icon={item.icon}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default FooterNavbar; 