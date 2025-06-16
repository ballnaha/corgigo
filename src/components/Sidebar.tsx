'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { isLineUser } from '@/utils/userUtils';
import { colors } from '@/config/colors';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Home,
  Restaurant,
  Favorite,
  Person,
  Settings,
  Help,
  Logout,
  LocalOffer,
  History,
  LocationOn,
} from '@mui/icons-material';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const router = useRouter();
  const { data: session } = useSession();
  
  // ตรวจสอบว่าเป็น LINE user หรือไม่
  const isUserFromLine = isLineUser(session?.user?.email);
  const menuItems = [
    { text: 'หน้าแรก', icon: <Home />, path: '/' },
    { text: 'ร้านอาหาร', icon: <Restaurant />, path: '/restaurants' },
    { text: 'รายการโปรด', icon: <Favorite />, path: '/favorites' },
    { text: 'ประวัติการสั่ง', icon: <History />, path: '/history' },
    { text: 'โปรโมชั่น', icon: <LocalOffer />, path: '/promotions' },
    { text: 'ที่อยู่', icon: <LocationOn />, path: '/addresses' },
  ];

  const bottomItems = [
    { text: 'โปรไฟล์', icon: <Person />, path: '/profile' },
    { text: 'การตั้งค่า', icon: <Settings />, path: '/settings' },
    { text: 'ช่วยเหลือ', icon: <Help />, path: '/help' },
    { text: 'ออกจากระบบ', icon: <Logout />, path: '/logout' },
  ];

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          bgcolor: colors.neutral.white,
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
          color: colors.neutral.darkGray,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <Box sx={{ 
        p: 3, 
        bgcolor: colors.neutral.lightGray,
        borderBottom: `1px solid ${colors.neutral.lightGray}`,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            src={session?.user?.avatar ? `/api/${session.user.avatar}` : undefined}
            sx={{ 
              width: 50, 
              height: 50,
              bgcolor: colors.primary.golden,
              color: colors.neutral.white,
              fontFamily: 'Prompt, sans-serif',
              fontWeight: 600,
              border: `2px solid ${colors.neutral.white}`,
              boxShadow: `0 2px 8px ${colors.primary.golden}30`,
            }}
          >
            {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: colors.neutral.darkGray,
                fontFamily: 'Prompt, sans-serif',
                fontSize: '1rem',
              }}
            >
              สวัสดี{session?.user?.name ? ` ${session.user.name}` : ''}!
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: colors.neutral.gray,
                fontFamily: 'Prompt, sans-serif',
                fontSize: '0.85rem',
              }}
            >
              {isUserFromLine ? 'ผู้ใช้ LINE' : (session?.user?.email || 'ผู้ใช้ CorgiGo')}
            </Typography>
          </Box>
        </Box>
      </Box>

      <List sx={{ flex: 1, px: 1, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => {
                router.push(item.path);
                onClose();
              }}
              sx={{
                borderRadius: 3,
                mx: 1,
                my: 0.5,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: `${colors.secondary.fresh}15`,
                  transform: 'translateX(4px)',
                  boxShadow: `0 2px 8px ${colors.secondary.fresh}20`,
                },
              }}
            >
              <ListItemIcon sx={{ 
                color: colors.secondary.fresh, 
                minWidth: 40,
                transition: 'all 0.2s ease',
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  color: colors.neutral.darkGray,
                  fontFamily: 'Prompt, sans-serif',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ borderColor: colors.neutral.lightGray }} />

      <List sx={{ px: 1, py: 1 }}>
        {bottomItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => {
                router.push(item.path);
                onClose();
              }}
              sx={{
                borderRadius: 3,
                mx: 1,
                my: 0.5,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: `${colors.accent.warm}15`,
                  transform: 'translateX(4px)',
                  boxShadow: `0 2px 8px ${colors.accent.warm}20`,
                },
              }}
            >
              <ListItemIcon sx={{ 
                color: colors.accent.warm, 
                minWidth: 40,
                transition: 'all 0.2s ease',
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  color: '#1A1A1A',
                  fontFamily: 'Prompt, sans-serif',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
} 