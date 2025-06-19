'use client';

import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
  Divider,
  Badge,
  Collapse,
  Button,
} from '@mui/material';
import {
  Dashboard,
  Restaurant,
  MenuBook,
  ShoppingCart,
  Assessment,
  LocalOffer,
  Settings,
  ExpandLess,
  ExpandMore,
  Inventory,
  RateReview,
  Notifications,
  AttachMoney,
  TrendingUp,
  Schedule,
  Fastfood,
  Category,
  Store,
  Receipt,
  Discount,
  CampaignOutlined,
  ExitToApp,
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Image from 'next/image';

const vristoTheme = {
  primary: '#4361ee',
  secondary: '#f39c12',
  success: '#1abc9c',
  danger: '#e74c3c',
  warning: '#f39c12',
  info: '#3498db',
  light: '#f8f9fa',
  dark: '#2c3e50',
  background: {
    main: '#f8fafc',
    paper: '#ffffff',
    sidebar: '#ffffff',
  },
  text: {
    primary: '#1e293b',
    secondary: '#64748b',
  },
  shadow: {
    card: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    elevated: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  font: {
    family: '"Prompt", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  }
};

interface RestaurantSidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
  pathname: string;
  restaurantName?: string;
  badgeCounts?: {
    pendingOrders: number;
    lowStock: number;
    newReviews: number;
  };
}

const drawerWidth = 280;

const menuItems = [
  {
    text: 'แดชบอร์ด',
    icon: <Dashboard />,
    path: '/restaurant',
    color: vristoTheme.primary,
  },
  {
    text: 'จัดการเมนู',
    icon: <MenuBook />,
    path: '/restaurant/menus',
    color: vristoTheme.secondary,
    children: [
      { text: 'รายการเมนู', icon: <Fastfood />, path: '/restaurant/menus' },
      { text: 'หมวดหมู่', icon: <Category />, path: '/restaurant/menus/categories' },
      { text: 'สต็อกสินค้า', icon: <Inventory />, path: '/restaurant/menus/inventory' },
    ]
  },
  {
    text: 'ออเดอร์',
    icon: <ShoppingCart />,
    path: '/restaurant/orders',
    color: vristoTheme.success,
    badge: 'pendingOrders',
    children: [
      { text: 'ออเดอร์ใหม่', icon: <Notifications />, path: '/restaurant/orders/new' },
      { text: 'กำลังทำ', icon: <Schedule />, path: '/restaurant/orders/preparing' },
      { text: 'พร้อมส่ง', icon: <Store />, path: '/restaurant/orders/ready' },
      { text: 'ประวัติออเดอร์', icon: <Receipt />, path: '/restaurant/orders/history' },
    ]
  },
  {
    text: 'การเงิน',
    icon: <AttachMoney />,
    path: '/restaurant/finance',
    color: vristoTheme.info,
    children: [
      { text: 'รายได้วันนี้', icon: <TrendingUp />, path: '/restaurant/finance/daily' },
      { text: 'รายงานการเงิน', icon: <Assessment />, path: '/restaurant/finance/reports' },
      { text: 'การชำระเงิน', icon: <AttachMoney />, path: '/restaurant/finance/payments' },
    ]
  },
  {
    text: 'โปรโมชั่น',
    icon: <LocalOffer />,
    path: '/restaurant/promotions',
    color: vristoTheme.warning,
    children: [
      { text: 'โปรโมชั่นปัจจุบัน', icon: <Discount />, path: '/restaurant/promotions' },
      { text: 'สร้างโปรโมชั่น', icon: <CampaignOutlined />, path: '/restaurant/promotions/create' },
    ]
  },
  {
    text: 'รีวิวและคะแนน',
    icon: <RateReview />,
    path: '/restaurant/reviews',
    color: vristoTheme.secondary,
    badge: 'newReviews',
  },
  {
    text: 'การตั้งค่า',
    icon: <Settings />,
    path: '/restaurant/settings',
    color: vristoTheme.dark,
    children: [
      { text: 'ข้อมูลร้าน', icon: <Restaurant />, path: '/restaurant/settings/profile' },
      { text: 'เวลาเปิด-ปิด', icon: <Schedule />, path: '/restaurant/settings/hours' },
      { text: 'การแจ้งเตือน', icon: <Notifications />, path: '/restaurant/settings/notifications' },
    ]
  },
];

export default function RestaurantSidebar({ mobileOpen, onMobileClose, pathname, restaurantName, badgeCounts }: RestaurantSidebarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const [openMenus, setOpenMenus] = React.useState<{ [key: string]: boolean }>({});

  const handleMenuClick = (item: { children?: any[]; path: string; text: string }) => {
    if (item.children) {
      setOpenMenus(prev => ({
        ...prev,
        [item.text]: !prev[item.text]
      }));
    } else {
      router.push(item.path);
      if (isMobile) {
        onMobileClose();
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isSelected = (path: string) => {
    if (path === '/restaurant' && pathname === '/restaurant') return true;
    if (path !== '/restaurant' && pathname?.startsWith(path)) return true;
    return false;
  };

  const getBadgeCount = (badgeKey?: string) => {
    if (!badgeKey || !badgeCounts) return 0;
    return badgeCounts[badgeKey as keyof typeof badgeCounts] || 0;
  };

  const drawerContent = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      fontFamily: vristoTheme.font.family,
    }}>
      {/* Header - Fixed */}
      <Box sx={{ 
        p: { xs: 2, sm: 3 }, 
        borderBottom: `1px solid ${theme.palette.divider}`,
        textAlign: 'center',
        flexShrink: 0, // Prevent shrinking
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
          <Image
            src="/images/corgigo-logo.webp"
            alt="CorgiGo"
            width={32}
            height={32}
            style={{ marginRight: 8 }}
          />
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 'bold',
              color: vristoTheme.primary,
              fontFamily: vristoTheme.font.family,
            }}
          >
            {restaurantName || 'CorgiGo'}
          </Typography>
        </Box>
        <Typography 
          variant="body2" 
          sx={{ 
            color: vristoTheme.text.secondary,
            fontFamily: vristoTheme.font.family,
          }}
        >
          {restaurantName ? 'ระบบจัดการร้านอาหาร' : 'ระบบจัดการร้านอาหาร'}
        </Typography>
      </Box>

      {/* Navigation Menu - Scrollable */}
      <Box sx={{ 
        flexGrow: 1, 
        overflowY: 'auto',
        overflowX: 'hidden',
        py: 2,
        // Custom scrollbar styling
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: vristoTheme.text.secondary + '40',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: vristoTheme.text.secondary + '60',
        },
        // Smooth scrolling
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch',
      }}>
        <List 
          component="nav" 
          disablePadding
          sx={{ px: { xs: 1, sm: 2 } }}
        >
          {menuItems.map((item) => (
            <Box key={item.text}>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleMenuClick(item)}
                  selected={isSelected(item.path)}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    py: 1.5,
                    transition: 'all 0.2s ease',
                    '&.Mui-selected': {
                      bgcolor: `${item.color}15`,
                      color: item.color,
                      '& .MuiListItemIcon-root': {
                        color: item.color,
                      },
                      '&:hover': {
                        bgcolor: `${item.color}20`,
                      },
                    },
                    '&:hover': {
                      bgcolor: `${item.color}08`,
                      transform: 'translateX(2px)',
                    },
                    fontFamily: vristoTheme.font.family,
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: isSelected(item.path) ? item.color : vristoTheme.text.secondary,
                    minWidth: 40,
                  }}>
                    {item.badge && getBadgeCount(item.badge) > 0 ? (
                      <Badge 
                        badgeContent={getBadgeCount(item.badge)} 
                        color="error"
                        sx={{
                          '& .MuiBadge-badge': {
                            fontSize: '0.7rem',
                            height: 16,
                            minWidth: 16,
                          }
                        }}
                      >
                        {item.icon}
                      </Badge>
                    ) : (
                      item.icon
                    )}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: isSelected(item.path) ? 600 : 400,
                      fontFamily: vristoTheme.font.family,
                    }}
                  />
                  {item.children && (
                    openMenus[item.text] ? <ExpandLess /> : <ExpandMore />
                  )}
                </ListItemButton>
              </ListItem>

              {/* Submenu */}
              {item.children && (
                <Collapse in={openMenus[item.text]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding sx={{ pl: 2 }}>
                    {item.children.map((child) => (
                      <ListItem key={child.text} disablePadding sx={{ mb: 0.5 }}>
                        <ListItemButton
                          onClick={() => {
                            router.push(child.path);
                            if (isMobile) onMobileClose();
                          }}
                          selected={isSelected(child.path)}
                          sx={{
                            borderRadius: 2,
                            py: 1,
                            transition: 'all 0.2s ease',
                            '&.Mui-selected': {
                              bgcolor: `${item.color}15`,
                              color: item.color,
                              '& .MuiListItemIcon-root': {
                                color: item.color,
                              },
                            },
                            '&:hover': {
                              bgcolor: `${item.color}08`,
                              transform: 'translateX(2px)',
                            },
                            fontFamily: vristoTheme.font.family,
                          }}
                        >
                          <ListItemIcon sx={{ 
                            color: isSelected(child.path) ? item.color : vristoTheme.text.secondary,
                            minWidth: 36,
                          }}>
                            {child.icon}
                          </ListItemIcon>
                          <ListItemText 
                            primary={child.text}
                            primaryTypographyProps={{
                              fontSize: '0.8rem',
                              fontWeight: isSelected(child.path) ? 600 : 400,
                              fontFamily: vristoTheme.font.family,
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </Box>
          ))}
        </List>
      </Box>

      {/* Footer with Logout - Fixed */}
      <Box sx={{ 
        flexShrink: 0, // Prevent shrinking
        borderTop: `1px solid ${theme.palette.divider}`,
        p: { xs: 1, sm: 2 }, 
        bgcolor: vristoTheme.background.sidebar,
      }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<ExitToApp />}
          onClick={handleLogout}
          sx={{
            mb: 1,
            color: vristoTheme.danger,
            borderColor: vristoTheme.danger + '40',
            fontFamily: vristoTheme.font.family,
            '&:hover': {
              borderColor: vristoTheme.danger,
              bgcolor: vristoTheme.danger + '10',
            },
          }}
        >
          ออกจากระบบ
        </Button>
        <Typography 
          variant="caption" 
          sx={{ 
            color: vristoTheme.text.secondary,
            fontFamily: vristoTheme.font.family,
            textAlign: 'center',
            display: 'block',
          }}
        >
          CorgiGo Restaurant Management
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onMobileClose}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: vristoTheme.background.sidebar,
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <Box
          sx={{
            width: drawerWidth,
            height: '100vh',
            bgcolor: vristoTheme.background.sidebar,
            borderRight: `1px solid ${theme.palette.divider}`,
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: theme.zIndex.drawer,
            boxShadow: vristoTheme.shadow.card,
          }}
        >
          {drawerContent}
        </Box>
      )}
    </>
  );
} 