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
} from '@mui/icons-material';

interface AppHeaderProps {
  onSidebarToggle?: () => void;
  notificationCount?: number;
  cartCount?: number;
  onSearchChange?: (query: string) => void;
}

const AppHeader = ({ 
  onSidebarToggle, 
  notificationCount = 0, 
  cartCount = 0,
  onSearchChange 
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
        {/* Left Side - Logo */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          flexShrink: 0,
        }}>
          <IconButton
            onClick={handleLogoClick}
            sx={{
              p: 0,
              borderRadius: 2,
              '&:hover': {
                bgcolor: alpha('#F8A66E', 0.1),
              },
            }}
          >
            <Box
              component="img"
              src="/images/favicon_bg.png"
              alt="CorgiGo Logo"
              sx={{
                height: 40,
                width: 40,
                objectFit: 'contain',
                borderRadius: 2,
              }}
            />
          </IconButton>
        </Box>

        {/* Center - Search Form */}
        <Box sx={{ 
          flex: 1,
          maxWidth: 500,
          mx: { xs: 1, sm: 2 },
        }}>
          <TextField
            fullWidth
            placeholder="ค้นหาอาหาร ร้านอาหาร..."
            value={searchQuery}
            onChange={handleSearchChange}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ 
                    color: '#999',
                    fontSize: 20,
                  }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: '#F8F8F8',
                border: 'none',
                '& fieldset': {
                  border: 'none',
                },
                '&:hover': {
                  bgcolor: '#F0F0F0',
                },
                '&.Mui-focused': {
                  bgcolor: 'white',
                  boxShadow: '0 0 0 2px rgba(248, 166, 110, 0.2)',
                },
              },
              '& .MuiOutlinedInput-input': {
                py: 1,
                fontSize: '0.9rem',
                fontFamily: 'Prompt, sans-serif',
                '&::placeholder': {
                  color: '#999',
                  opacity: 1,
                },
              },
            }}
          />
        </Box>

        {/* Right Side - Shopping Cart */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          flexShrink: 0,
        }}>
          <IconButton
            onClick={handleCartClick}
            sx={{
              width: 44,
              height: 44,
              bgcolor: alpha('#F8A66E', 0.1),
              color: '#F8A66E',
              border: '1px solid',
              borderColor: alpha('#F8A66E', 0.2),
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: '#F8A66E',
                color: 'white',
                borderColor: '#F8A66E',
                transform: 'scale(1.05)',
              },
            }}
          >
            <Badge 
              badgeContent={cartCount > 0 ? cartCount : null}
              sx={{
                '& .MuiBadge-badge': {
                  bgcolor: '#F35C76',
                  color: 'white',
                  fontSize: '0.7rem',
                  minWidth: '18px',
                  height: '18px',
                  top: -2,
                  right: -2,
                  fontFamily: 'Prompt, sans-serif',
                  fontWeight: 600,
                },
              }}
            >
              <ShoppingCart sx={{ fontSize: 22 }} />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader; 