'use client';

import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  Box,
  alpha,
} from '@mui/material';
import {
  ArrowBack,
  NotificationsOutlined,
  Person,
  Settings,
  Logout,
  FavoriteOutlined,
  ShoppingCartOutlined,
  RestaurantOutlined,
  ReceiptOutlined,
} from '@mui/icons-material';

const AppHeader = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotifAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setNotifAnchorEl(null);
  };

  const handleMenuClick = (path: string) => {
    router.push(path);
    handleClose();
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth/login' });
    handleClose();
  };

  const handleBackClick = () => {
    router.back();
  };

  // Check if we should show back button (not on main pages)
  const showBackButton = pathname !== '/' && pathname !== '/dashboard' && pathname !== '/home';

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        bgcolor: '#FFFFFF',
        borderBottom: '1px solid #E8E8E8',
        color: '#1A1A1A',
      }}
    >
      <Toolbar sx={{ 
        px: 2,
        minHeight: '64px !important',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Left Side - Back Button or Empty Space */}
        <Box sx={{ width: '48px', display: 'flex', justifyContent: 'flex-start' }}>
          {showBackButton && (
            <IconButton
              onClick={handleBackClick}
              sx={{
                color: '#5F6368',
                width: 40,
                height: 40,
                '&:hover': {
                  bgcolor: alpha('#000', 0.04),
                },
              }}
            >
              <ArrowBack sx={{ fontSize: 24 }} />
            </IconButton>
          )}
        </Box>

        {/* Center - Logo */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
        }}>
        <img src="/images/header-logo.png" alt="logo" width={150}/>
        </Box>

        {/* Right Side - Notifications & Avatar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Notifications */}
          <IconButton
            onClick={handleNotificationClick}
            sx={{
              color: '#5F6368',
              width: 40,
              height: 40,
              '&:hover': {
                bgcolor: alpha('#000', 0.04),
              },
            }}
          >
            <Badge 
              badgeContent={3} 
              sx={{
                '& .MuiBadge-badge': {
                  bgcolor: '#F35C76',
                  color: '#FFFFFF',
                  fontSize: '0.7rem',
                  fontFamily: 'Prompt, sans-serif',
                  fontWeight: 600,
                  minWidth: '18px',
                  height: '18px',
                },
              }}
            >
              <NotificationsOutlined sx={{ fontSize: 24 }} />
            </Badge>
          </IconButton>

          {/* User Avatar */}
          <IconButton
            onClick={handleAvatarClick}
            sx={{
              p: 0,
              ml: 1,
              '&:hover': {
                '& .MuiAvatar-root': {
                  boxShadow: '0 0 0 3px rgba(248, 166, 110, 0.2)',
                },
              },
            }}
          >
            <Avatar
              src={session?.user?.avatar || undefined}
              sx={{
                width: 36,
                height: 36,
                bgcolor: '#F8A66E',
                color: '#FFFFFF',
                fontFamily: 'Prompt, sans-serif',
                fontWeight: 600,
                fontSize: '0.9rem',
                transition: 'all 0.2s ease',
                border: '2px solid #FFFFFF',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              {session?.user?.name?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>
        </Box>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notifAnchorEl}
          open={Boolean(notifAnchorEl)}
          onClose={handleClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 280,
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              border: '1px solid #E8E8E8',
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid #F0F0F0' }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontFamily: 'Prompt, sans-serif',
                fontWeight: 600,
                color: '#1A1A1A',
                fontSize: '1rem',
              }}
            >
              การแจ้งเตือน
            </Typography>
          </Box>
          <MenuItem onClick={handleClose} sx={{ py: 1.5, px: 2 }}>
            <Box>
              <Typography
                sx={{
                  fontFamily: 'Prompt, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#1A1A1A',
                  mb: 0.5,
                }}
              >
                คำสั่งซื้อของคุณเสร็จสิ้นแล้ว
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'Prompt, sans-serif',
                  fontSize: '0.75rem',
                  color: '#666',
                }}
              >
                2 นาทีที่แล้ว
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleClose} sx={{ py: 1.5, px: 2 }}>
            <Box>
              <Typography
                sx={{
                  fontFamily: 'Prompt, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#1A1A1A',
                  mb: 0.5,
                }}
              >
                โปรโมชั่นใหม่สำหรับคุณ
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'Prompt, sans-serif',
                  fontSize: '0.75rem',
                  color: '#666',
                }}
              >
                1 ชั่วโมงที่แล้ว
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleClose} sx={{ py: 1.5, px: 2 }}>
            <Box>
              <Typography
                sx={{
                  fontFamily: 'Prompt, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#1A1A1A',
                  mb: 0.5,
                }}
              >
                อาหารที่คุณสั่งกำลังเตรียม
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'Prompt, sans-serif',
                  fontSize: '0.75rem',
                  color: '#666',
                }}
              >
                3 ชั่วโมงที่แล้ว
              </Typography>
            </Box>
          </MenuItem>
        </Menu>

        {/* User Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 240,
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              border: '1px solid #E8E8E8',
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {/* User Info Header */}
          <Box sx={{ p: 2, borderBottom: '1px solid #F0F0F0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={session?.user?.avatar || undefined}
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: '#F8A66E',
                  color: '#FFFFFF',
                  fontFamily: 'Prompt, sans-serif',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                }}
              >
                {session?.user?.name?.charAt(0) || 'U'}
              </Avatar>
              <Box>
                <Typography
                  sx={{
                    fontFamily: 'Prompt, sans-serif',
                    fontWeight: 600,
                    color: '#1A1A1A',
                    fontSize: '0.9rem',
                    lineHeight: 1.2,
                  }}
                >
                  {session?.user?.name || 'ผู้ใช้งาน'}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'Prompt, sans-serif',
                    color: '#666',
                    fontSize: '0.75rem',
                    lineHeight: 1.2,
                  }}
                >
                  {session?.user?.email}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Menu Items */}
          <MenuItem onClick={() => handleMenuClick('/profile')} sx={{ py: 1.5, px: 2 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <Person sx={{ fontSize: 20, color: '#5F6368' }} />
            </ListItemIcon>
            <ListItemText>
              <Typography
                sx={{
                  fontFamily: 'Prompt, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#1A1A1A',
                }}
              >
                โปรไฟล์
              </Typography>
            </ListItemText>
          </MenuItem>

          <MenuItem onClick={() => handleMenuClick('/favorites')} sx={{ py: 1.5, px: 2 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <FavoriteOutlined sx={{ fontSize: 20, color: '#F35C76' }} />
            </ListItemIcon>
            <ListItemText>
              <Typography
                sx={{
                  fontFamily: 'Prompt, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#1A1A1A',
                }}
              >
                รายการโปรด
              </Typography>
            </ListItemText>
          </MenuItem>

          <MenuItem onClick={() => handleMenuClick('/cart')} sx={{ py: 1.5, px: 2 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <ShoppingCartOutlined sx={{ fontSize: 20, color: '#F8A66E' }} />
            </ListItemIcon>
            <ListItemText>
              <Typography
                sx={{
                  fontFamily: 'Prompt, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#1A1A1A',
                }}
              >
                ตะกร้าสินค้า
              </Typography>
            </ListItemText>
          </MenuItem>

          <MenuItem onClick={() => handleMenuClick('/orders')} sx={{ py: 1.5, px: 2 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <ReceiptOutlined sx={{ fontSize: 20, color: '#4CAF50' }} />
            </ListItemIcon>
            <ListItemText>
              <Typography
                sx={{
                  fontFamily: 'Prompt, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#1A1A1A',
                }}
              >
                คำสั่งซื้อ
              </Typography>
            </ListItemText>
          </MenuItem>

          <MenuItem onClick={() => handleMenuClick('/restaurants')} sx={{ py: 1.5, px: 2 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <RestaurantOutlined sx={{ fontSize: 20, color: '#FF9800' }} />
            </ListItemIcon>
            <ListItemText>
              <Typography
                sx={{
                  fontFamily: 'Prompt, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#1A1A1A',
                }}
              >
                ร้านอาหาร
              </Typography>
            </ListItemText>
          </MenuItem>

          <MenuItem onClick={() => handleMenuClick('/settings')} sx={{ py: 1.5, px: 2 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <Settings sx={{ fontSize: 20, color: '#5F6368' }} />
            </ListItemIcon>
            <ListItemText>
              <Typography
                sx={{
                  fontFamily: 'Prompt, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#1A1A1A',
                }}
              >
                ตั้งค่า
              </Typography>
            </ListItemText>
          </MenuItem>

          <Divider sx={{ mx: 1, my: 1 }} />

          <MenuItem onClick={handleLogout} sx={{ py: 1.5, px: 2 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <Logout sx={{ fontSize: 20, color: '#F44336' }} />
            </ListItemIcon>
            <ListItemText>
              <Typography
                sx={{
                  fontFamily: 'Prompt, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#F44336',
                }}
              >
                ออกจากระบบ
              </Typography>
            </ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader; 