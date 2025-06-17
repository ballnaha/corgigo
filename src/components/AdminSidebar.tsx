'use client';

import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Collapse,
  Typography,
  Badge,
  useTheme,
  useMediaQuery,
  Button,
  Divider,
} from '@mui/material';
import {
  Dashboard,
  BarChart,
  Analytics,
  AttachMoney,
  TrendingUp,
  People,
  Restaurant,
  TwoWheeler,
  ShoppingCart,
  Settings,
  Assessment,
  Notifications,
  Store,
  MenuBook,
  Category,
  Assignment,
  PendingActions,
  DeliveryDining,
  Storefront,
  Groups,
  RestaurantMenu,
  LocalOffer,
  Campaign,
  Security,
  NotificationsActive,
  Email,
  SupportAgent,
  ExpandLess,
  ExpandMore,
  ExitToApp,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

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

const SIDEBAR_WIDTH = 280;

interface MenuItemType {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  badge?: number;
  children?: MenuItemType[];
}

interface AdminSidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
  pathname: string;
  badgeCounts?: {
    pendingRestaurants?: number;
    pendingOrders?: number;
  };
}

export default function AdminSidebar({ mobileOpen, onMobileClose, pathname, badgeCounts }: AdminSidebarProps) {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expandedItems, setExpandedItems] = useState<string[]>(['dashboard', 'restaurants']);

  const menuItems: MenuItemType[] = [
    {
      id: 'dashboard',
      label: 'แดชบอร์ด',
      icon: <Dashboard />,
      children: [
        { id: 'overview', label: 'ภาพรวม', icon: <BarChart />, path: '/admin/dashboard' },
        { id: 'sales-stats', label: 'สถิติการขาย', icon: <Analytics />, path: '/admin/dashboard/sales' },
        { id: 'financial', label: 'รายงานการเงิน', icon: <AttachMoney />, path: '/admin/dashboard/financial' },
        { id: 'trends', label: 'แนวโน้ม', icon: <TrendingUp />, path: '/admin/dashboard/trends' },
      ]
    },
    {
      id: 'users',
      label: 'จัดการผู้ใช้',
      icon: <People />,
      children: [
        { id: 'customers', label: 'ลูกค้า', icon: <Groups />, path: '/admin/users/customers' },
        { id: 'riders', label: 'ไรเดอร์', icon: <TwoWheeler />, path: '/admin/users/riders' },
        { id: 'owners', label: 'เจ้าของร้าน', icon: <Storefront />, path: '/admin/users/owners' },
      ]
    },
    {
      id: 'restaurants',
      label: 'จัดการร้านอาหาร',
      icon: <Restaurant />,
      children: [
        { id: 'all-restaurants', label: 'ร้านอาหาร', icon: <Store />, path: '/admin/restaurants' },
        { id: 'menus', label: 'เมนูอาหาร', icon: <MenuBook />, path: '/admin/restaurants/menus' },
        { id: 'categories', label: 'หมวดหมู่', icon: <Category />, path: '/admin/restaurants/categories' },
        { 
          id: 'pending', 
          label: 'ร้านรอการอนุมัติ', 
          icon: <PendingActions />, 
          path: '/admin/restaurants/pending', 
          badge: badgeCounts?.pendingRestaurants || 0
        },
      ]
    },
    {
      id: 'orders',
      label: 'จัดการออเดอร์',
      icon: <ShoppingCart />,
      children: [
        { id: 'all-orders', label: 'ออเดอร์ทั้งหมด', icon: <Assignment />, path: '/admin/orders' },
        { 
          id: 'pending-orders', 
          label: 'ออเดอร์รอยืนยัน', 
          icon: <PendingActions />, 
          path: '/admin/orders/pending', 
          badge: badgeCounts?.pendingOrders || 0
        },
        { id: 'delivery', label: 'การจัดส่ง', icon: <DeliveryDining />, path: '/admin/orders/delivery' },
      ]
    },
    {
      id: 'marketing',
      label: 'การตลาด',
      icon: <LocalOffer />,
      children: [
        { id: 'promotions', label: 'โปรโมชั่น', icon: <LocalOffer />, path: '/admin/marketing/promotions' },
        { id: 'campaigns', label: 'แคมเปญ', icon: <Campaign />, path: '/admin/marketing/campaigns' },
      ]
    },
    {
      id: 'system',
      label: 'ระบบ',
      icon: <Settings />,
      children: [
        { id: 'settings', label: 'การตั้งค่า', icon: <Settings />, path: '/admin/settings' },
        { id: 'reports', label: 'รายงาน', icon: <Assessment />, path: '/admin/reports' },
        { id: 'notifications', label: 'การแจ้งเตือน', icon: <NotificationsActive />, path: '/admin/notifications' },
        { id: 'security', label: 'ความปลอดภัย', icon: <Security />, path: '/admin/security' },
        { id: 'support', label: 'ฝ่ายสนับสนุน', icon: <SupportAgent />, path: '/admin/support' },
      ]
    },
  ];

  const handleItemClick = (item: MenuItemType) => {
    if (item.children) {
      // Toggle expand/collapse
      setExpandedItems(prev =>
        prev.includes(item.id)
          ? prev.filter(id => id !== item.id)
          : [...prev, item.id]
      );
    } else if (item.path) {
      // Navigate to page
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

  const isActive = (itemPath?: string) => {
    if (!itemPath) return false;
    return pathname === itemPath;
  };

  const isParentActive = (children?: MenuItemType[]) => {
    if (!children) return false;
    return children.some(child => isActive(child.path));
  };

  const renderMenuItem = (item: MenuItemType, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const isItemActive = isActive(item.path);
    const isParentOfActive = isParentActive(item.children);

    return (
      <React.Fragment key={item.id}>
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            onClick={() => handleItemClick(item)}
            sx={{
              pl: level === 0 ? 3 : 5,
              pr: 3,
              py: 1.5,
              mb: 0.5,
              mx: 1,
              borderRadius: 2,
              bgcolor: isItemActive ? `${vristoTheme.primary}15` : 'transparent',
              color: isItemActive ? vristoTheme.primary : vristoTheme.text.primary,
              '&:hover': {
                bgcolor: isItemActive ? `${vristoTheme.primary}20` : `${vristoTheme.primary}08`,
                transform: 'translateX(2px)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: isItemActive ? vristoTheme.primary : vristoTheme.text.secondary,
              }}
            >
              {item.badge && item.badge > 0 ? (
                <Badge
                  badgeContent={item.badge}
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
              primary={item.label}
              sx={{
                '& .MuiListItemText-primary': {
                  fontSize: '0.875rem',
                  fontWeight: isItemActive ? 600 : 400,
                }
              }}
            />
            {hasChildren && (
              isExpanded ? <ExpandLess /> : <ExpandMore />
            )}
          </ListItemButton>
        </ListItem>

        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children!.map(child => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
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
        flexShrink: 0, // Prevent shrinking
      }}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            textAlign: 'center'
          }}
        >
          CorgiGo
        </Box>
        <Typography
          variant="caption"
          sx={{
            color: vristoTheme.text.secondary,
            textAlign: 'center',
            display: 'block',
            mt: 0.5
          }}
        >
          ระบบจัดการแอดมิน
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
          sx={{ px: { xs: 1, sm: 1 } }}
        >
          {menuItems.map(item => renderMenuItem(item))}
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
          CorgiGo Admin Management
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
              width: SIDEBAR_WIDTH,
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
            width: SIDEBAR_WIDTH,
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