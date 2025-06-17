'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Breadcrumbs,
  Link,
  useMediaQuery,
  useTheme,
  Container,
  createTheme,
  ThemeProvider,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  Restaurant,
  ShoppingCart,
  LocalOffer,
  Settings,
  NavigateNext,
  AccountCircle,
  ExitToApp,
  AdminPanelSettings,
} from '@mui/icons-material';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import AdminSidebar from '@/components/AdminSidebar';
import NoSSR from '@/components/NoSSR';

// Create admin theme with Prompt font
const adminTheme = createTheme({
  typography: {
    fontFamily: '"Prompt", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: { fontFamily: '"Prompt", sans-serif' },
    h2: { fontFamily: '"Prompt", sans-serif' },
    h3: { fontFamily: '"Prompt", sans-serif' },
    h4: { fontFamily: '"Prompt", sans-serif' },
    h5: { fontFamily: '"Prompt", sans-serif' },
    h6: { fontFamily: '"Prompt", sans-serif' },
    body1: { fontFamily: '"Prompt", sans-serif' },
    body2: { fontFamily: '"Prompt", sans-serif' },
    button: { fontFamily: '"Prompt", sans-serif' },
    caption: { fontFamily: '"Prompt", sans-serif' },
    overline: { fontFamily: '"Prompt", sans-serif' },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: '"Prompt", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Prompt", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          fontFamily: '"Prompt", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
      },
    },
  },
});

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

// Breadcrumb mapping
const breadcrumbMap: { [key: string]: { label: string; icon: React.ReactNode } } = {
  '/admin': { label: 'แอดมิน', icon: <Dashboard /> },
  '/admin/dashboard': { label: 'แดชบอร์ด', icon: <Dashboard /> },
  '/admin/dashboard/sales': { label: 'สถิติการขาย', icon: <Dashboard /> },
  '/admin/dashboard/financial': { label: 'รายงานการเงิน', icon: <Dashboard /> },
  '/admin/dashboard/trends': { label: 'แนวโน้ม', icon: <Dashboard /> },
  '/admin/users': { label: 'จัดการผู้ใช้', icon: <People /> },
  '/admin/users/customers': { label: 'ลูกค้า', icon: <People /> },
  '/admin/users/riders': { label: 'ไรเดอร์', icon: <People /> },
  '/admin/users/owners': { label: 'เจ้าของร้าน', icon: <People /> },
  '/admin/restaurants': { label: 'จัดการร้านอาหาร', icon: <Restaurant /> },
  '/admin/restaurants/menus': { label: 'เมนูอาหาร', icon: <Restaurant /> },
  '/admin/restaurants/categories': { label: 'หมวดหมู่', icon: <Restaurant /> },
  '/admin/restaurants/pending': { label: 'ร้านรอการอนุมัติ', icon: <Restaurant /> },
  '/admin/orders': { label: 'จัดการออเดอร์', icon: <ShoppingCart /> },
  '/admin/orders/pending': { label: 'ออเดอร์รอยืนยัน', icon: <ShoppingCart /> },
  '/admin/orders/delivery': { label: 'การจัดส่ง', icon: <ShoppingCart /> },
  '/admin/marketing': { label: 'การตลาด', icon: <LocalOffer /> },
  '/admin/marketing/promotions': { label: 'โปรโมชั่น', icon: <LocalOffer /> },
  '/admin/marketing/campaigns': { label: 'แคมเปญ', icon: <LocalOffer /> },
  '/admin/settings': { label: 'การตั้งค่า', icon: <Settings /> },
  '/admin/reports': { label: 'รายงาน', icon: <Settings /> },
  '/admin/notifications': { label: 'การแจ้งเตือน', icon: <Settings /> },
  '/admin/security': { label: 'ความปลอดภัย', icon: <Settings /> },
  '/admin/support': { label: 'ฝ่ายสนับสนุน', icon: <Settings /> },
};

export default function AdminClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [badgeCounts, setBadgeCounts] = useState({
    pendingRestaurants: 0,
    pendingOrders: 0,
  });
  const pathname = usePathname();
  const router = useRouter();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      handleProfileMenuClose();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Fetch badge counts
  const fetchBadgeCounts = async () => {
    try {
      const [pendingRes] = await Promise.all([
        fetch('/api/admin/restaurants/pending').catch(() => ({ json: () => ({ restaurants: [] }) })),
        // Add more API calls for other pending items as needed
      ]);

      const [pendingData] = await Promise.all([
        pendingRes.json(),
      ]);

      setBadgeCounts({
        pendingRestaurants: pendingData.restaurants?.length || 0,
        pendingOrders: 12, // This would come from orders API when available
      });
    } catch (error) {
      console.error('Error fetching badge counts:', error);
    }
  };

  // Fetch badge counts on mount and periodically
  useEffect(() => {
    fetchBadgeCounts();
    
    // Refresh badge counts every 30 seconds
    const interval = setInterval(fetchBadgeCounts, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Generate breadcrumbs - handle null pathname
  const pathSegments = (pathname || '').split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    const breadcrumb = breadcrumbMap[path];
    return breadcrumb ? { ...breadcrumb, path } : null;
  }).filter(Boolean);

  return (
    <NoSSR>
      <ThemeProvider theme={adminTheme}>
        <Box 
          className="admin-layout"
          sx={{ 
            display: 'flex', 
            minHeight: '100vh', 
            bgcolor: vristoTheme.background.main,
            fontFamily: vristoTheme.font.family,
          }}
        >
          {/* Admin Sidebar Component */}
          <AdminSidebar 
            mobileOpen={mobileOpen}
            onMobileClose={() => setMobileOpen(false)}
            pathname={pathname || ''}
            badgeCounts={badgeCounts}
          />

          {/* Main Content */}
          <Box sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column',
            minWidth: 0,
            ml: { xs: 0, md: '280px' }, // Margin left for desktop sidebar
            height: '100vh', // Full viewport height
            overflow: 'hidden', // Prevent main container scroll
          }}>
            {/* Top App Bar - Fixed */}
            <AppBar 
              position="static"
              elevation={0}
              sx={{ 
                bgcolor: 'white',
                borderBottom: '1px solid #e2e8f0',
                color: vristoTheme.text.primary,
                height: 64,
                flexShrink: 0, // Prevent shrinking
                zIndex: theme.zIndex.appBar,
              }}
            >
              <Toolbar sx={{ minHeight: '64px !important' }}>
                {/* Mobile Menu Button */}
                {isMobile && (
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { md: 'none' } }}
                  >
                    <MenuIcon />
                  </IconButton>
                )}

                {/* Breadcrumbs */}
                <Box sx={{ flexGrow: 1 }}>
                  <Breadcrumbs 
                    separator={<NavigateNext fontSize="small" />}
                    aria-label="breadcrumb"
                    sx={{
                      '& .MuiBreadcrumbs-ol': {
                        flexWrap: 'wrap',
                      },
                      '& .MuiBreadcrumbs-separator': {
                        margin: { xs: '0 0.3rem', sm: '0 0.5rem' },
                      }
                    }}
                  >
                    {breadcrumbs
                      .filter((crumb): crumb is { label: string; icon: React.ReactElement; path: string } => crumb !== null)
                      .map((crumb, index) => {
                        const isLast = index === breadcrumbs.filter(c => c !== null).length - 1;
                        
                        return isLast ? (
                          <Typography 
                            key={crumb.path} 
                            color="text.primary" 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 0.5,
                              fontSize: { xs: '0.7rem', sm: '0.875rem' },
                              fontWeight: 600,
                              maxWidth: { xs: '80px', sm: 'none' },
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            <Box sx={{ fontSize: { xs: 14, sm: 16 }, display: 'flex', alignItems: 'center' }}>
                              {crumb.icon}
                            </Box>
                            {crumb.label}
                          </Typography>
                        ) : (
                          <Link
                            key={crumb.path}
                            color="inherit"
                            href={crumb.path}
                            onClick={(e) => {
                              e.preventDefault();
                              router.push(crumb.path);
                            }}
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 0.5,
                              textDecoration: 'none',
                              fontSize: { xs: '0.7rem', sm: '0.875rem' },
                              maxWidth: { xs: '80px', sm: 'none' },
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              '&:hover': {
                                textDecoration: 'underline'
                              }
                            }}
                          >
                            <Box sx={{ fontSize: { xs: 14, sm: 16 }, display: 'flex', alignItems: 'center' }}>
                              {crumb.icon}
                            </Box>
                            {crumb.label}
                          </Link>
                        );
                      })}
                  </Breadcrumbs>
                </Box>

                {/* Profile Menu */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                  >
                    ผู้ดูแลระบบ
                  </Typography>
                  <IconButton
                    color="inherit"
                    onClick={handleProfileMenuOpen}
                    sx={{ p: 0 }}
                  >
                    <Avatar 
                      sx={{ 
                        width: 32, 
                        height: 32,
                        bgcolor: vristoTheme.primary,
                        fontSize: '0.875rem'
                      }}
                    >
                      <AdminPanelSettings />
                    </Avatar>
                  </IconButton>

                  {/* Profile Menu Dropdown */}
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleProfileMenuClose}
                    onClick={handleProfileMenuClose}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        '&:before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem onClick={() => router.push('/admin/settings')}>
                      <Avatar sx={{ bgcolor: vristoTheme.primary }}>
                        <Settings />
                      </Avatar>
                      การตั้งค่า
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <Avatar sx={{ bgcolor: vristoTheme.danger }}>
                        <ExitToApp />
                      </Avatar>
                      ออกจากระบบ
                    </MenuItem>
                  </Menu>
                </Box>
              </Toolbar>
            </AppBar>

            {/* Page Content - Scrollable */}
            <Box 
              component="main"
              sx={{ 
                flexGrow: 1,
                overflow: 'hidden', // Prevent this container from scrolling
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box
                sx={{
                  flexGrow: 1,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  bgcolor: vristoTheme.background.main,
                  p: { xs: 2, sm: 3 },
                  pb: { 
                    xs: 'calc(1rem + env(safe-area-inset-bottom, 0px))', 
                    sm: 3 
                  },
                  fontFamily: vristoTheme.font.family,
                  // Custom scrollbar styling
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'transparent',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: vristoTheme.text.secondary + '30',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    background: vristoTheme.text.secondary + '50',
                  },
                  // Smooth scrolling
                  scrollBehavior: 'smooth',
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                {children}
              </Box>
            </Box>
          </Box>

          {/* CSS Injection for admin-specific font styling */}
          <style jsx global>{`
            .admin-layout * {
              font-family: "Prompt", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
            }
            
            .admin-layout .MuiTypography-root,
            .admin-layout .MuiButton-root,
            .admin-layout .MuiTextField-root,
            .admin-layout .MuiFormControl-root,
            .admin-layout .MuiInputLabel-root,
            .admin-layout .MuiInputBase-root,
            .admin-layout .MuiTableCell-root,
            .admin-layout .MuiChip-root,
            .admin-layout .MuiTab-root,
            .admin-layout .MuiMenuItem-root {
              font-family: "Prompt", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
            }
          `}</style>
        </Box>
      </ThemeProvider>
    </NoSSR>
  );
} 