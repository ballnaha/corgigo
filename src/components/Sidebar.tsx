'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
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
          bgcolor: '#FFFFFF',
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
          color: '#1A1A1A',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <Box sx={{ 
        p: 3, 
        bgcolor: '#FAFAFA',
        borderBottom: '1px solid #F0F0F0',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            src={session?.user?.avatar ? `/api/${session.user.avatar}` : undefined}
            sx={{ 
              width: 50, 
              height: 50,
              bgcolor: '#F8A66E',
              color: 'white',
              fontFamily: 'Prompt, sans-serif',
              fontWeight: 600,
              border: '2px solid #FFFFFF',
              boxShadow: '0 2px 8px rgba(248, 166, 110, 0.3)',
            }}
          >
            {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: '#1A1A1A',
                fontFamily: 'Prompt, sans-serif',
                fontSize: '1rem',
              }}
            >
              สวัสดี{session?.user?.name ? ` ${session.user.name}` : ''}!
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#666',
                fontFamily: 'Prompt, sans-serif',
                fontSize: '0.85rem',
              }}
            >
              {session?.user?.email || 'ผู้ใช้ CorgiGo'}
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
                  bgcolor: '#F8A66E15',
                  transform: 'translateX(4px)',
                  boxShadow: '0 2px 8px rgba(248, 166, 110, 0.2)',
                },
              }}
            >
              <ListItemIcon sx={{ 
                color: '#F8A66E', 
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

      <Divider sx={{ borderColor: '#F0F0F0' }} />

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
                  bgcolor: '#F35C7615',
                  transform: 'translateX(4px)',
                  boxShadow: '0 2px 8px rgba(243, 92, 118, 0.2)',
                },
              }}
            >
              <ListItemIcon sx={{ 
                color: '#F35C76', 
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