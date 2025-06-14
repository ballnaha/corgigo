'use client';

import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import AppHeader from './AppHeader';
import FooterNavbar from './FooterNavbar';
import { useNavigation } from '@/contexts/NavigationContext';
import { useNotifications } from '@/contexts/NotificationContext';

interface AppLayoutProps {
  children: React.ReactNode;
  hideHeader?: boolean;
  hideFooter?: boolean;
  customHeader?: React.ReactNode;
  cartCount?: number;
  onSidebarToggle?: () => void;
  onSearchChange?: (query: string) => void;
  contentSx?: React.CSSProperties | object;
  showBackOnly?: boolean;
  backTitle?: string;
  onBackClick?: () => void;
  deliveryAddress?: string;
}

export default function AppLayout({
  children,
  hideHeader = false,
  hideFooter = false,
  customHeader,
  cartCount = 0,
  onSidebarToggle,
  onSearchChange,
  contentSx,
  showBackOnly = false,
  backTitle,
  onBackClick,
  deliveryAddress,
}: AppLayoutProps) {
  const navigation = useNavigation();
  const { notifications, unreadCount, markAsRead } = useNotifications();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      // ใช้ stack navigation แทน router.back()
      navigation.goBack();
    }
  };

  return (
    <Box className="app-container">
      {/* Header */}
      {!hideHeader && (
        showBackOnly ? (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              height: '64px',
              borderBottom: '1px solid #E8E8E8',
              display: 'flex',
              alignItems: 'center',
              px: 2,
              zIndex: 1100,
              backdropFilter: 'blur(20px)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
            }}
          >
            <IconButton
              onClick={handleBackClick}
              sx={{ 
                color: '#382c30',
                mr: 1,
                '&:hover': { 
                  backgroundColor: 'rgba(56, 44, 48, 0.1)' 
                }
              }}
            >
              <ArrowBack />
            </IconButton>
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Prompt, sans-serif',
                fontWeight: 600,
                color: '#1A1A1A',
                fontSize: '1.1rem',
              }}
            >
              {backTitle || navigation.getCurrentTitle() || 'CorgiGo'}
            </Typography>
          </Box>
        ) : (
          customHeader || (
            <AppHeader 
              onSidebarToggle={onSidebarToggle}
              cartCount={cartCount}
              onSearchChange={onSearchChange}
              deliveryAddress={deliveryAddress}
              notificationCount={unreadCount}
              notifications={notifications}
              onNotificationClick={() => {
                // Mark notifications as read when clicked
                notifications.filter(n => !n.read).forEach(n => markAsRead(n.id));
              }}
            />
          )
        )
      )}

      {/* Scrollable Content */}
      <Box 
        className="app-content"
        sx={{
          backgroundColor: '#FFFFFF',
          // เพิ่ม marginTop เมื่อใช้ showBackOnly เพื่อหลีกเลี่ยงการทับซ้อนกับ fixed header
          ...(showBackOnly && !hideHeader && {
            marginTop: '64px',
          }),
          ...contentSx,
        }}
      >
        {children}
      </Box>

      {/* Fixed Footer */}
      {!hideFooter && (
        <FooterNavbar cartCount={cartCount} />
      )}
    </Box>
  );
} 