'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,

  Avatar,
  Chip,
  Button,
  Divider,
  Stack,
  LinearProgress,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Rating,
  Tabs,
  Tab,
  CircularProgress,
  Badge,
} from '@mui/material';
import {
  ArrowBack,
  Store,
  LocationOn,
  Phone,
  Email,
  AccessTime,
  TrendingUp,
  MonetizationOn,
  RestaurantMenu,
  Star,
  Edit,
  Check,
  Close,
  Visibility,
  People,
  ShoppingCart,
  Analytics,
  Receipt,
  Image,
  Business,
} from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { formatThaiDateTime } from '@/lib/timezone';

// ธีมสี Vristo
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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function RestaurantDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { showSnackbar } = useSnackbar();
  const restaurantId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [menus, setMenus] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [currentTab, setCurrentTab] = useState(0);
  
  // Name change dialog states
  const [nameChangeDialog, setNameChangeDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [processingNameChange, setProcessingNameChange] = useState(false);

  // Load restaurant data
  const loadRestaurantData = async () => {
    try {
      setLoading(true);
      const [restaurantRes, analyticsRes, menusRes, ordersRes] = await Promise.all([
        fetch(`/api/admin/restaurants/${restaurantId}`),
        fetch(`/api/admin/restaurants/${restaurantId}/analytics`),
        fetch(`/api/admin/restaurants/${restaurantId}/menus`),
        fetch(`/api/admin/restaurants/${restaurantId}/orders`)
      ]);

      const [restaurantData, analyticsData, menusData, ordersData] = await Promise.all([
        restaurantRes.json(),
        analyticsRes.json(),
        menusRes.json(),
        ordersRes.json()
      ]);

      if (restaurantData.success) {
        setRestaurant(restaurantData.restaurant);
      }
      if (analyticsData.success) {
        setAnalytics(analyticsData.analytics);
      }
      if (menusData.success) {
        setMenus(menusData.menus || []);
      }
      if (ordersData.success) {
        setOrders(ordersData.orders || []);
      }
    } catch (error) {
      console.error('Error loading restaurant data:', error);
      showSnackbar('ไม่สามารถโหลดข้อมูลร้านอาหารได้', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle name change approval/rejection
  const handleNameChangeAction = async (action: 'approve' | 'reject') => {
    try {
      setProcessingNameChange(true);
      const response = await fetch(`/api/admin/restaurants/${restaurantId}/name-change`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          rejectReason: action === 'reject' ? rejectReason : undefined,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showSnackbar(result.message, 'success');
        setNameChangeDialog(false);
        setRejectReason('');
        loadRestaurantData(); // Reload data
      } else {
        showSnackbar(result.error || 'เกิดข้อผิดพลาด', 'error');
      }
    } catch (error) {
      console.error('Name change action error:', error);
      showSnackbar('เกิดข้อผิดพลาดในการดำเนินการ', 'error');
    } finally {
      setProcessingNameChange(false);
    }
  };

  useEffect(() => {
    if (restaurantId) {
      loadRestaurantData();
    }
  }, [restaurantId]);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        fontFamily: vristoTheme.font.family,
      }}>
        <CircularProgress size={40} sx={{ color: vristoTheme.primary }} />
        <Typography variant="h6" sx={{ ml: 2, color: vristoTheme.text.primary }}>
          กำลังโหลดข้อมูล...
        </Typography>
      </Box>
    );
  }

  if (!restaurant) {
    return (
      <Box sx={{ fontFamily: vristoTheme.font.family, p: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.back()}
          sx={{ mb: 2 }}
        >
          กลับไปยังรายการร้านอาหาร
        </Button>
        <Alert severity="error">ไม่พบข้อมูลร้านอาหาร</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ fontFamily: vristoTheme.font.family, pb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.back()}
          sx={{ mb: 2, color: vristoTheme.text.secondary }}
        >
          กลับไปยังรายการร้านอาหาร
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Avatar
            src={restaurant.avatarUrl || restaurant.image}
            sx={{ width: 80, height: 80 }}
          >
            <Store sx={{ fontSize: 40 }} />
          </Avatar>
          
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 'bold',
                  color: vristoTheme.text.primary,
                }}
              >
                {restaurant.name}
              </Typography>
              <Chip
                label={restaurant.status === 'APPROVED' ? 'อนุมัติแล้ว' : 
                       restaurant.status === 'PENDING' ? 'รอการอนุมัติ' : 'ถูกปฏิเสธ'}
                color={restaurant.status === 'APPROVED' ? 'success' : 
                       restaurant.status === 'PENDING' ? 'warning' : 'error'}
              />
              {restaurant.isOpen && restaurant.status === 'APPROVED' && (
                <Chip label="เปิดให้บริการ" color="success" variant="outlined" />
              )}
            </Box>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              ID: {restaurant.id}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn sx={{ color: vristoTheme.primary, fontSize: 20 }} />
                <Typography variant="body2">{restaurant.address}</Typography>
              </Box>
              {restaurant.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone sx={{ color: vristoTheme.primary, fontSize: 20 }} />
                  <Typography variant="body2">{restaurant.phone}</Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Star sx={{ color: vristoTheme.warning, fontSize: 20 }} />
                <Typography variant="body2">{restaurant.rating.toFixed(1)}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Name change request alert */}
        {restaurant.pendingName && (
          <Alert 
            severity="info" 
            sx={{ mt: 3 }}
            action={
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => handleNameChangeAction('approve')}
                  disabled={processingNameChange}
                  startIcon={<Check />}
                >
                  อนุมัติ
                </Button>
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => setNameChangeDialog(true)}
                  disabled={processingNameChange}
                  startIcon={<Close />}
                >
                  ปฏิเสธ
                </Button>
              </Box>
            }
          >
            <Typography variant="body2">
              <strong>คำขอเปลี่ยนชื่อร้าน:</strong> "{restaurant.pendingName}"
              <br />
              <small>ร้องขอเมื่อ: {formatThaiDateTime(restaurant.nameChangeRequestedAt)}</small>
            </Typography>
          </Alert>
        )}
      </Box>

      {/* Analytics Cards */}
      {analytics && (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          flexWrap: 'wrap',
          gap: 3, 
          mb: 4 
        }}>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
            <Card sx={{ boxShadow: vristoTheme.shadow.card, borderRadius: 2, height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: `${vristoTheme.success}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <MonetizationOn sx={{ color: vristoTheme.success, fontSize: 32 }} />
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      ฿{analytics.totalRevenue?.toLocaleString() || '0'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      รายได้รวม
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
            <Card sx={{ boxShadow: vristoTheme.shadow.card, borderRadius: 2, height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: `${vristoTheme.primary}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ShoppingCart sx={{ color: vristoTheme.primary, fontSize: 32 }} />
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {analytics.totalOrders || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      คำสั่งซื้อทั้งหมด
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
            <Card sx={{ boxShadow: vristoTheme.shadow.card, borderRadius: 2, height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: `${vristoTheme.warning}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <RestaurantMenu sx={{ color: vristoTheme.warning, fontSize: 32 }} />
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {analytics.totalMenus || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      เมนูทั้งหมด
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
            <Card sx={{ boxShadow: vristoTheme.shadow.card, borderRadius: 2, height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: `${vristoTheme.info}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Receipt sx={{ color: vristoTheme.info, fontSize: 32 }} />
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      ฿{analytics.commission?.toLocaleString() || '0'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ค่าคอมมิชชั่น (3%)
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}

      {/* Tabs */}
      <Card sx={{ boxShadow: vristoTheme.shadow.card, borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={currentTab}
            onChange={(_, newValue) => setCurrentTab(newValue)}
            sx={{
              '& .MuiTab-root': {
                fontFamily: vristoTheme.font.family,
                fontWeight: 600,
              },
            }}
          >
            <Tab label="ข้อมูลทั่วไป" icon={<Business />} iconPosition="start" />
            <Tab label="เมนูอาหาร" icon={<RestaurantMenu />} iconPosition="start" />
            <Tab label="คำสั่งซื้อ" icon={<ShoppingCart />} iconPosition="start" />
            <Tab label="วิเคราะห์ยอดขาย" icon={<Analytics />} iconPosition="start" />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <TabPanel value={currentTab} index={0}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 3 
          }}>
            {/* Restaurant Info */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                ข้อมูลร้านอาหาร
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="600">ชื่อร้าน</Typography>
                  <Typography variant="body1">{restaurant.name}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="600">คำอธิบาย</Typography>
                  <Typography variant="body1">{restaurant.description || 'ไม่มีคำอธิบาย'}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="600">ที่อยู่</Typography>
                  <Typography variant="body1">{restaurant.address}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="600">เบอร์โทรศัพท์</Typography>
                  <Typography variant="body1">{restaurant.phone || 'ไม่ระบุ'}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="600">เวลาเปิด-ปิด</Typography>
                  <Typography variant="body1">{restaurant.openTime} - {restaurant.closeTime}</Typography>
                </Box>
                                  <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight="600">วันที่สมัคร</Typography>
                    <Typography variant="body1">
                      {formatThaiDateTime(restaurant.createdAt)}
                    </Typography>
                  </Box>
                  {restaurant.approvedAt && (
                    <Box>
                      <Typography variant="body2" color="text.secondary" fontWeight="600">วันที่อนุมัติ</Typography>
                      <Typography variant="body1">
                        {formatThaiDateTime(restaurant.approvedAt)}
                      </Typography>
                    </Box>
                  )}
              </Stack>
            </Box>

            {/* Owner Info */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                ข้อมูลเจ้าของร้าน
              </Typography>
              {restaurant.user && (
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={restaurant.user.avatarUrl} sx={{ width: 60, height: 60 }}>
                      <People />
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight="600">
                        {restaurant.user.firstName} {restaurant.user.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {restaurant.user.email}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight="600">User ID</Typography>
                    <Typography variant="body1">{restaurant.user.id}</Typography>
                  </Box>
                                      <Box>
                      <Typography variant="body2" color="text.secondary" fontWeight="600">วันที่สมัครสมาชิก</Typography>
                      <Typography variant="body1">
                        {formatThaiDateTime(restaurant.user.createdAt)}
                      </Typography>
                    </Box>
                </Stack>
              )}
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
            เมนูอาหาร ({menus.length} รายการ)
          </Typography>
          {menus.length > 0 ? (
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              gap: { xs: 2, sm: 3 },
            }}>
              {menus.map((menu) => (
                <Card 
                  key={menu.id}
                  variant="outlined" 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: vristoTheme.shadow.card,
                    borderRadius: 2,
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: vristoTheme.shadow.elevated,
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  {/* Menu Image */}
                  <Box sx={{ position: 'relative', paddingTop: '60%'}}>
                    <Box
                      component="img"
                      src={menu.image || '/images/CorgiGo (5).png'}
                      alt={menu.name}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    {/* Status Badge */}
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: 8, 
                        right: 8 
                      }}
                    >
                      <Chip
                        label={menu.isAvailable ? 'พร้อมขาย' : 'หมด'}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontFamily: vristoTheme.font.family,
                          fontSize: '0.75rem',
                          backgroundColor: menu.isAvailable ? '#E8F5E8' : '#FFF0F0',
                          color: menu.isAvailable ? '#2E7D32' : '#D32F2F',
                          border: `1px solid ${menu.isAvailable ? '#4CAF50' : '#F44336'}30`,
                          backdropFilter: 'blur(4px)',
                          '& .MuiChip-label': {
                            px: 1.5,
                            py: 0.25,
                          },
                        }}
                      />
                    </Box>
                  </Box>
                  
                  {/* Menu Content */}
                  <CardContent sx={{ 
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    p: 3,
                  }}>
                    {/* Menu Name */}
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600,
                        fontFamily: vristoTheme.font.family,
                        color: vristoTheme.text.primary,
                        fontSize: { xs: '1rem', sm: '1.125rem' },
                        lineHeight: 1.3,
                        mb: 1,
                      }}
                    >
                      {menu.name}
                    </Typography>
                    
                    {/* Price Display */}
                    <Box sx={{ mb: 2 }}>
                      {menu.originalPrice && menu.originalPrice > menu.price ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          {/* Original Price - Strikethrough */}
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              textDecoration: 'line-through',
                              color: '#999',
                              fontFamily: vristoTheme.font.family,
                              fontSize: { xs: '0.875rem', sm: '1rem' },
                              fontWeight: 500,
                              lineHeight: 1,
                            }}
                          >
                            ฿{menu.originalPrice.toLocaleString()}
                          </Typography>
                          
                          {/* Sale Price + Discount Badge */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontWeight: 700,
                                color: '#e74c3c',
                                fontFamily: vristoTheme.font.family,
                                fontSize: { xs: '1.25rem', sm: '1.375rem' },
                                lineHeight: 1,
                              }}
                            >
                              ฿{menu.price.toLocaleString()}
                            </Typography>
                            <Chip
                              label={`ลด ${Math.round(((menu.originalPrice - menu.price) / menu.originalPrice) * 100)}%`}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                backgroundColor: '#e74c3c',
                                color: 'white',
                                fontFamily: vristoTheme.font.family,
                                '& .MuiChip-label': {
                                  px: 1,
                                  py: 0,
                                },
                              }}
                            />
                          </Box>
                        </Box>
                      ) : (
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 700,
                            color: vristoTheme.primary,
                            fontFamily: vristoTheme.font.family,
                            fontSize: { xs: '1.125rem', sm: '1.25rem' },
                          }}
                        >
                          ฿{menu.price.toLocaleString()}
                        </Typography>
                      )}
                    </Box>
                    
                    {/* Description */}
                    {menu.description && (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: vristoTheme.text.secondary,
                          mb: 2,
                          fontFamily: vristoTheme.font.family,
                          fontSize: { xs: '0.875rem', sm: '0.875rem' },
                          lineHeight: 1.5,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          flexGrow: 1,
                        }}
                      >
                        {menu.description}
                      </Typography>
                    )}
                    
                    {/* Category */}
                    {menu.category && (
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: vristoTheme.text.secondary,
                          mb: 2,
                          fontFamily: vristoTheme.font.family,
                          fontSize: '0.75rem',
                        }}
                      >
                        หมวดหมู่: {menu.category.name}
                      </Typography>
                    )}
                    
                    {/* Actions */}
                    <Box sx={{ 
                      mt: 'auto',
                      pt: 2,
                      borderTop: '1px solid #f0f0f0',
                    }}>
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 1,
                      }}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontFamily: vristoTheme.font.family,
                            fontSize: '0.75rem',
                            color: vristoTheme.text.secondary,
                          }}
                        >
                          เมนู ID: {menu.id.slice(-8)}
                        </Typography>
                        
                        {/* Action Buttons */}
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton 
                            size="small" 
                            sx={{ 
                              color: vristoTheme.primary,
                              backgroundColor: 'rgba(67, 97, 238, 0.08)',
                              borderRadius: '8px',
                              width: 32,
                              height: 32,
                              '&:hover': {
                                backgroundColor: 'rgba(67, 97, 238, 0.12)',
                              }
                            }}
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            sx={{ 
                              color: vristoTheme.secondary,
                              backgroundColor: 'rgba(243, 156, 18, 0.08)',
                              borderRadius: '8px',
                              width: 32,
                              height: 32,
                              '&:hover': {
                                backgroundColor: 'rgba(243, 156, 18, 0.12)',
                              }
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Alert severity="info">ยังไม่มีเมนูอาหาร</Alert>
          )}
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
            คำสั่งซื้อล่าสุด
          </Typography>
          {orders.length > 0 ? (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>รหัสคำสั่งซื้อ</TableCell>
                    <TableCell>ลูกค้า</TableCell>
                    <TableCell>รายการ</TableCell>
                    <TableCell align="right">ยอดรวม</TableCell>
                    <TableCell>สถานะ</TableCell>
                    <TableCell>วันที่</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.slice(0, 10).map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id.slice(-8)}</TableCell>
                      <TableCell>
                        {order.user ? `${order.user.firstName} ${order.user.lastName}` : 'ไม่ระบุ'}
                      </TableCell>
                      <TableCell>{order.items?.length || 0} รายการ</TableCell>
                      <TableCell align="right">฿{order.total?.toLocaleString() || '0'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={order.status}
                          color={order.status === 'COMPLETED' ? 'success' : 'primary'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {formatThaiDateTime(order.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info">ยังไม่มีคำสั่งซื้อ</Alert>
          )}
        </TabPanel>

        <TabPanel value={currentTab} index={3}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
            วิเคราะห์ยอดขาย
          </Typography>
          {analytics && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Summary Cards */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' }, 
                gap: 3 
              }}>
                <Box sx={{ flex: 1 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                        สรุปรายได้
                      </Typography>
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography>รายได้รวม:</Typography>
                          <Typography fontWeight="bold" color="success.main">
                            ฿{analytics.totalRevenue?.toLocaleString() || '0'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography>ค่าคอมมิชชั่น (3%):</Typography>
                          <Typography fontWeight="bold" color="error.main">
                            -฿{analytics.commission?.toLocaleString() || '0'}
                          </Typography>
                        </Box>
                        <Divider />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography fontWeight="bold">รายได้สุทธิ:</Typography>
                          <Typography fontWeight="bold" color="primary">
                            ฿{(analytics.totalRevenue - analytics.commission)?.toLocaleString() || '0'}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                        สถิติอื่น ๆ
                      </Typography>
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography>ค่าเฉลี่ยต่อคำสั่งซื้อ:</Typography>
                          <Typography fontWeight="bold">
                            ฿{analytics.averageOrderValue?.toLocaleString() || '0'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography>เมนูขายดีที่สุด:</Typography>
                          <Typography fontWeight="bold">
                            {analytics.bestSellingItem || 'ไม่มีข้อมูล'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography>คะแนนเฉลี่ย:</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Rating value={restaurant.rating} precision={0.1} readOnly size="small" />
                            <Typography fontWeight="bold">{restaurant.rating.toFixed(1)}</Typography>
                          </Box>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Box>
              </Box>

              {/* Top Selling Items */}
              <Box sx={{ width: '100%' }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                      เมนูขายดี Top 5
                    </Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>ชื่อเมนู</TableCell>
                            <TableCell align="center">จำนวนที่ขาย</TableCell>
                            <TableCell align="right">รายได้</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {analytics.topSellingItems?.map((item: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography 
                                    sx={{ 
                                      backgroundColor: vristoTheme.primary,
                                      color: 'white',
                                      borderRadius: '50%',
                                      width: 24,
                                      height: 24,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '0.75rem',
                                      fontWeight: 'bold'
                                    }}
                                  >
                                    {index + 1}
                                  </Typography>
                                  {item.name}
                                </Box>
                              </TableCell>
                              <TableCell align="center">{item.quantity} รายการ</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 'bold', color: vristoTheme.success }}>
                                ฿{item.revenue.toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          )}
        </TabPanel>
      </Card>

      {/* Name Change Reject Dialog */}
      <Dialog open={nameChangeDialog} onClose={() => setNameChangeDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>ปฏิเสธการเปลี่ยนชื่อร้าน</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            คำขอเปลี่ยนชื่อจาก "{restaurant.name}" เป็น "{restaurant.pendingName}"
          </Typography>
          <TextField
            fullWidth
            label="เหตุผลในการปฏิเสธ *"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            multiline
            rows={3}
            placeholder="กรุณาระบุเหตุผลในการปฏิเสธ..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNameChangeDialog(false)} disabled={processingNameChange}>
            ยกเลิก
          </Button>
          <Button
            onClick={() => handleNameChangeAction('reject')}
            color="error"
            disabled={processingNameChange || !rejectReason.trim()}
          >
            {processingNameChange ? <CircularProgress size={20} /> : 'ปฏิเสธ'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 