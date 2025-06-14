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
  TextField,
  InputAdornment,
  alpha,
} from '@mui/material';
import {
  ArrowBack,
  NotificationsOutlined,
  Notifications,
  Person,
  Settings,
  Logout,
  FavoriteOutlined,
  ShoppingCartOutlined,
  RestaurantOutlined,
  ReceiptOutlined,
  Menu as MenuIcon,
  Search,
  ShoppingCart,
  KeyboardArrowDown,
  ShoppingBag,
  Circle,
} from '@mui/icons-material';

interface AppHeaderProps {
  onSidebarToggle?: () => void;
  notificationCount?: number;
  cartCount?: number;
  onSearchChange?: (query: string) => void;
  deliveryAddress?: string;
  onNotificationClick?: () => void;
  notifications?: Array<{
    id: string;
    title: string;
    message: string;
    type: 'order' | 'delivery' | 'system';
    timestamp: string;
    read: boolean;
  }>;
}

const AppHeader = ({ 
  onSidebarToggle, 
  notificationCount = 0, 
  cartCount = 0,
  onSearchChange,
  deliveryAddress = "No Location",
  onNotificationClick,
  notifications = []
}: AppHeaderProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotifAnchorEl(event.currentTarget);
    onNotificationClick?.();
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    onSearchChange?.(query);
  };

  const handleCartClick = () => {
    router.push('/cart');
  };

  const handleLogoClick = () => {
    router.push('/');
  };

  // Check if we should show back button (not on main pages)
  const showBackButton = pathname !== '/' && pathname !== '/dashboard' && pathname !== '/home';

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        bgcolor: '#FFFFFF',
        borderBottom: '1px solid #F0F0F0',
        color: '#1A1A1A',
        zIndex: 1200,
      }}
    >
      <Toolbar sx={{ 
        px: { xs: 2, sm: 3 },
        minHeight: '64px !important',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
      }}>
        {/* Left Side - Menu + Delivery Address */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          flexShrink: 0,
          gap: 1,
        }}>
          {/* Hamburger Menu */}
          <IconButton
            onClick={onSidebarToggle}
            sx={{
              width: 44,
              height: 44,
              bgcolor: '#F5F5F5',
              color: '#666',
              borderRadius: 10,
              '&:hover': {
                bgcolor: '#E8E8E8',
              },
            }}
          >
            <MenuIcon sx={{ fontSize: 24 }} />
          </IconButton>

          {/* Delivery Address */}
        <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            ml: 1,
            maxWidth: { xs: '180px', sm: '250px', md: '300px' },
            overflow: 'hidden',
        }}>
            <Typography
              variant="caption"
            sx={{
                color: '#F8A66E',
                fontFamily: 'Prompt, sans-serif',
                fontWeight: 600,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                lineHeight: 1,
                whiteSpace: 'nowrap',
              }}
            >
              จัดส่งไปที่
            </Typography>
            <Box sx={{ 
              display: 'flex',
              alignItems: 'flex-start',
              gap: 0.5,
              mt: 0.5,
              width: '100%',
            }}>
              <Typography
                variant="body2"
                sx={{
                  color: '#666',
                  fontFamily: 'Prompt, sans-serif',
                  fontWeight: 500,
                  fontSize: '0.85rem',
                  lineHeight: 1.2,
                  flex: 1,
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  wordBreak: 'break-word',
                  hyphens: 'auto',
            }}
                title={deliveryAddress} // แสดง tooltip เมื่อ hover
              >
                {deliveryAddress}
              </Typography>

            </Box>
          </Box>
        </Box>

        {/* Right Side - Notifications + Shopping Bag */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          flexShrink: 0,
          gap: 1,
        }}>
          {/* Notification Icon */}
          <IconButton
            onClick={handleNotificationClick}
            sx={{
              width: 44,
              height: 44,
              bgcolor: '#F8F8F8',
              color: '#666',
              borderRadius: '50%',
              position: 'relative',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: '#E8E8E8',
                transform: 'scale(1.05)',
              },
            }}
          >
            <Notifications sx={{ fontSize: 22 }} />
            {notificationCount > 0 && (
              <Box
              sx={{
                  position: 'absolute',
                  top: -2,
                  right: -2,
                  width: 18,
                  height: 18,
                  bgcolor: '#FF4444',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontFamily: 'Prompt, sans-serif',
                  fontWeight: 600,
                  border: '2px solid white',
                }}
              >
                {notificationCount > 99 ? '99+' : notificationCount}
              </Box>
            )}
          </IconButton>

          {/* Shopping Bag */}
          <IconButton
            onClick={handleCartClick}
            sx={{
              width: 48,
              height: 48,
              bgcolor: '#2C2C2C',
              color: 'white',
              borderRadius: '50%',
              position: 'relative',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: '#1A1A1A',
                transform: 'scale(1.05)',
                },
              }}
            >
            <ShoppingBag sx={{ fontSize: 24 }} />
            {cartCount > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  width: 20,
                  height: 20,
                  bgcolor: '#F8A66E',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontFamily: 'Prompt, sans-serif',
                  fontWeight: 600,
                  border: '2px solid white',
                }}
              >
                {cartCount}
              </Box>
            )}
          </IconButton>
        </Box>

        {/* Notification Menu */}
        <Menu
          anchorEl={notifAnchorEl}
          open={Boolean(notifAnchorEl)}
          onClose={handleClose}
          PaperProps={{
            sx: {
              width: 350,
              maxHeight: 400,
              mt: 1,
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              border: '1px solid #F0F0F0',
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid #F0F0F0' }}>
            <Typography variant="h6" sx={{ fontFamily: 'Prompt, sans-serif', fontWeight: 600 }}>
              การแจ้งเตือน
            </Typography>
            {notificationCount > 0 && (
              <Typography variant="caption" color="text.secondary">
                {notificationCount} การแจ้งเตือนใหม่
              </Typography>
            )}
          </Box>
          
          {notifications.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <NotificationsOutlined sx={{ fontSize: 48, color: '#E0E0E0', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                ไม่มีการแจ้งเตือน
              </Typography>
            </Box>
          ) : (
            <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
              {notifications.map((notification) => (
                <MenuItem
                  key={notification.id}
                  onClick={handleClose}
                  sx={{
                    p: 2,
                    borderBottom: '1px solid #F8F8F8',
                    alignItems: 'flex-start',
                    '&:hover': {
                      bgcolor: '#F8F8F8',
                    },
                    ...(notification.read ? {} : {
                      bgcolor: '#FFF8F0',
                      '&:hover': {
                        bgcolor: '#FFF0E0',
                      },
                    }),
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, width: '100%' }}>
                    {/* Notification Icon */}
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        bgcolor: notification.type === 'order' ? '#E8F5E8' : 
                                notification.type === 'delivery' ? '#E8F0FF' : '#F0F0F0',
                        color: notification.type === 'order' ? '#4CAF50' : 
                               notification.type === 'delivery' ? '#2196F3' : '#666',
                      }}
                    >
                      {notification.type === 'order' && <RestaurantOutlined sx={{ fontSize: 20 }} />}
                      {notification.type === 'delivery' && <ShoppingBag sx={{ fontSize: 20 }} />}
                      {notification.type === 'system' && <NotificationsOutlined sx={{ fontSize: 20 }} />}
                    </Box>

                    {/* Notification Content */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: 'Prompt, sans-serif',
                          fontWeight: notification.read ? 400 : 600,
                          color: notification.read ? '#666' : '#1A1A1A',
                          mb: 0.5,
                        }}
                      >
                        {notification.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#999',
                          display: 'block',
                          mb: 0.5,
                        }}
                      >
                        {notification.message}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#BBB',
                          fontSize: '0.7rem',
                        }}
                      >
                        {new Date(notification.timestamp).toLocaleString('th-TH', {
                          hour: '2-digit',
                          minute: '2-digit',
                          day: '2-digit',
                          month: '2-digit',
                        })}
                      </Typography>
                    </Box>

                    {/* Unread Indicator */}
                    {!notification.read && (
                      <Circle
                        sx={{
                          fontSize: 8,
                          color: '#F8A66E',
                          mt: 0.5,
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </Box>
                </MenuItem>
              ))}
            </Box>
          )}
          
          {notifications.length > 0 && (
            <Box sx={{ p: 1, borderTop: '1px solid #F0F0F0', textAlign: 'center' }}>
              <Typography
                variant="caption"
                sx={{
                  color: '#F8A66E',
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
                onClick={() => {
                  // Navigate to notifications page
                  router.push('/notifications');
                  handleClose();
                }}
              >
                ดูการแจ้งเตือนทั้งหมด
              </Typography>
            </Box>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader; 