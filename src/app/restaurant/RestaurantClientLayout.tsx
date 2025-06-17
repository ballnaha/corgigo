'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useTheme, useMediaQuery } from '@mui/material';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Divider,
  Switch,
  FormControlLabel,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications,
  Store,
  NavigateNext,
  AccountCircle,
  Settings,
  ExitToApp,
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import RestaurantSidebar from '@/components/RestaurantSidebar';
import RestaurantStatusChecker from '@/components/RestaurantStatusChecker';
import NoSSR from '@/components/NoSSR';

// Vristo Theme Colors
const vristoTheme = {
  primary: '#4361ee',
  secondary: '#805dca',
  success: '#00ab55',
  danger: '#e7515a',
  warning: '#e2a03f',
  info: '#2196f3',
  light: '#ebedf2',
  dark: '#0e1726',
  background: {
    main: '#f1f2f3',
    paper: '#ffffff',
  },
  text: {
    primary: '#3b3f5c',
    secondary: '#5c5f7a',
    disabled: '#bfc9d4',
  },
  font: {
    family: '"Nunito", sans-serif',
  },
};

// Restaurant specific theme - สร้างด้วย createTheme
const restaurantTheme = createTheme({
  palette: {
    primary: {
      main: vristoTheme.primary,
    },
    secondary: {
      main: vristoTheme.secondary,
    },
    success: {
      main: vristoTheme.success,
    },
    error: {
      main: vristoTheme.danger,
    },
    warning: {
      main: vristoTheme.warning,
    },
    info: {
      main: vristoTheme.info,
    },
    background: {
      default: vristoTheme.background.main,
      paper: vristoTheme.background.paper,
    },
    text: {
      primary: vristoTheme.text.primary,
      secondary: vristoTheme.text.secondary,
    },
  },
  typography: {
    fontFamily: vristoTheme.font.family,
  },
});

// Breadcrumb mapping
const breadcrumbMap: { [key: string]: { label: string; icon: React.ReactElement } } = {
  '/restaurant': { label: 'แดชบอร์ด', icon: <Store sx={{ fontSize: 16, mr: 0.5 }} /> },
  '/restaurant/register': { label: 'สมัครเปิดร้านอาหาร', icon: <Store sx={{ fontSize: 16, mr: 0.5 }} /> },
  '/restaurant/pending': { label: 'สถานะการสมัคร', icon: <Store sx={{ fontSize: 16, mr: 0.5 }} /> },
  '/restaurant/menus': { label: 'จัดการเมนู', icon: <Store sx={{ fontSize: 16, mr: 0.5 }} /> },
  '/restaurant/orders': { label: 'ออเดอร์', icon: <Store sx={{ fontSize: 16, mr: 0.5 }} /> },
  '/restaurant/finance': { label: 'การเงิน', icon: <Store sx={{ fontSize: 16, mr: 0.5 }} /> },
  '/restaurant/promotions': { label: 'โปรโมชั่น', icon: <Store sx={{ fontSize: 16, mr: 0.5 }} /> },
  '/restaurant/reviews': { label: 'รีวิว', icon: <Store sx={{ fontSize: 16, mr: 0.5 }} /> },
  '/restaurant/settings': { label: 'การตั้งค่า', icon: <Store sx={{ fontSize: 16, mr: 0.5 }} /> },
};

interface BadgeCounts {
  pendingOrders: number;
  lowStock: number;
  newReviews: number;
}

export default function RestaurantClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [badgeCounts, setBadgeCounts] = useState<BadgeCounts>({
    pendingOrders: 0,
    lowStock: 0,
    newReviews: 0,
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isRestaurantOpen, setIsRestaurantOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

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
      // Mock data - replace with actual API calls
      setBadgeCounts({
        pendingOrders: 5,
        lowStock: 3,
        newReviews: 2,
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

  // Generate breadcrumbs
  const pathSegments = (pathname || '').split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    const breadcrumb = breadcrumbMap[path];
    return breadcrumb ? { ...breadcrumb, path } : null;
  }).filter((crumb): crumb is NonNullable<typeof crumb> => crumb !== null);

  // เช็คสถานะเฉพาะหน้าที่ไม่ใช่ register และ pending
  const isRegisterOrPending = pathname === '/restaurant/register' || pathname === '/restaurant/pending';

  console.log('🔍 RestaurantClientLayout - pathname:', pathname, 'isRegisterOrPending:', isRegisterOrPending);

  return (
    <NoSSR>
      {isRegisterOrPending ? (
        // สำหรับหน้า register และ pending - ไม่ต้องเช็คสถานะ
        <ThemeProvider theme={restaurantTheme}>
          {children}
        </ThemeProvider>
      ) : (
        // สำหรับหน้าอื่นๆ - ต้องเช็คสถานะ APPROVED
        <RestaurantStatusChecker requiredStatus="APPROVED">
          <ThemeProvider theme={restaurantTheme}>
            <Box 
              className="restaurant-layout"
              sx={{ 
                display: 'flex', 
                minHeight: '100vh', 
                bgcolor: vristoTheme.background.main,
                fontFamily: vristoTheme.font.family,
              }}
            >
              {/* Restaurant Sidebar Component */}
              <RestaurantSidebar 
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
                            color: vristoTheme.text.secondary,
                          }
                        }}
                      >
                        {breadcrumbs.map((crumb, index) => {
                          const isLast = index === breadcrumbs.length - 1;
                          return isLast ? (
                            <Typography 
                              key={crumb.path} 
                              color={vristoTheme.primary}
                              sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                fontWeight: 600,
                                fontFamily: vristoTheme.font.family,
                              }}
                            >
                              {crumb.icon}
                              <Box component="span" sx={{ ml: 0.5 }}>
                                {crumb.label}
                              </Box>
                            </Typography>
                          ) : (
                            <Link
                              key={crumb.path}
                              underline="hover"
                              color={vristoTheme.text.secondary}
                              href={crumb.path}
                              onClick={(e) => {
                                e.preventDefault();
                                router.push(crumb.path);
                              }}
                              sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                fontFamily: vristoTheme.font.family,
                                '&:hover': {
                                  color: vristoTheme.primary,
                                }
                              }}
                            >
                              {crumb.icon}
                              <Box component="span" sx={{ ml: 0.5 }}>
                                {crumb.label}
                              </Box>
                            </Link>
                          );
                        })}
                      </Breadcrumbs>
                    </Box>

                    {/* Restaurant Status Toggle */}
                    <FormControlLabel
                      control={
                        <Switch
                          checked={isRestaurantOpen}
                          onChange={(e) => setIsRestaurantOpen(e.target.checked)}
                          color="success"
                        />
                      }
                      label={
                        <Typography sx={{ 
                          fontFamily: vristoTheme.font.family,
                          color: isRestaurantOpen ? vristoTheme.success : vristoTheme.danger,
                          fontWeight: 600,
                        }}>
                          {isRestaurantOpen ? 'เปิด' : 'ปิด'}
                        </Typography>
                      }
                      sx={{ mr: 2 }}
                    />

                    {/* Notifications */}
                    <IconButton 
                      color="inherit"
                      sx={{ mr: 1 }}
                    >
                      <Badge 
                        badgeContent={badgeCounts.pendingOrders + badgeCounts.newReviews} 
                        color="error"
                      >
                        <Notifications />
                      </Badge>
                    </IconButton>

                    {/* Profile Menu */}
                    <IconButton
                      color="inherit"
                      onClick={handleProfileMenuOpen}
                      sx={{ p: 0 }}
                    >
                      <Avatar sx={{ 
                        width: 32, 
                        height: 32, 
                        bgcolor: vristoTheme.primary 
                      }}>
                        <Store />
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
                      <MenuItem onClick={() => router.push('/restaurant/settings/profile')}>
                        <Avatar sx={{ bgcolor: vristoTheme.primary }}>
                          <AccountCircle />
                        </Avatar>
                        โปรไฟล์ร้าน
                      </MenuItem>
                      <MenuItem onClick={() => router.push('/restaurant/settings')}>
                        <Avatar sx={{ bgcolor: vristoTheme.secondary }}>
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
            </Box>
          </ThemeProvider>
        </RestaurantStatusChecker>
      )}
    </NoSSR>
  );
} 