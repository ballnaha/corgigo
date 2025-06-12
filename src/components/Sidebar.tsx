'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
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
          bgcolor: '#382c30',
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
          color: 'white',
        },
      }}
    >
      <Box sx={{ p: 3, bgcolor: 'linear-gradient(135deg, #F8A66E 0%, #F35C76 100%)', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            src="/api/placeholder/50/50" 
            sx={{ width: 50, height: 50 }}
          />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              สวัสดี! 
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              ผู้ใช้ CorgiGo
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
                borderRadius: 2,
                mx: 1,
                my: 0.5,
                '&:hover': {
                  bgcolor: 'rgba(248, 166, 110, 0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#F8A66E', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  color: 'white',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      <List sx={{ px: 1, py: 1 }}>
        {bottomItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => {
                router.push(item.path);
                onClose();
              }}
              sx={{
                borderRadius: 2,
                mx: 1,
                my: 0.5,
                '&:hover': {
                  bgcolor: 'rgba(248, 166, 110, 0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#F35C76', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  color: 'white',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
} 