'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  Tab,
  Tabs,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { colors } from '@/config/colors';
import NoSSR from '@/components/NoSSR';
import {
  Dashboard,
  AccountCircle,
  People,
  Restaurant,
  TwoWheeler,
  BarChart,
  Settings,
  CheckCircle,
  Cancel,
  Visibility,
} from '@mui/icons-material';

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
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface RestaurantDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  createdAt: string;
}

interface PendingRestaurant {
  id: string;
  name: string;
  owner: string;
  phone: string;
  email: string;
  address: string;
  description: string;
  submittedAt: string;
  documents: RestaurantDocument[];
}

export default function AdminPage() {
  const { showSnackbar } = useSnackbar();
  const [tabValue, setTabValue] = useState(0);
  const [pendingRestaurants, setPendingRestaurants] = useState<PendingRestaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<PendingRestaurant | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [previewFileOpen, setPreviewFileOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<RestaurantDocument | null>(null);

  // Mock data
  const stats = {
    totalUsers: 15420,
    totalRestaurants: 847,
    totalRiders: 156,
    totalOrders: 25680,
    pendingRestaurants: 12,
  };

  const recentOrders = [
    { id: '1', customer: 'คุณสมชาย', restaurant: 'ร้านส้มตำป้าแดง', status: 'กำลังส่ง', total: 180 },
    { id: '2', customer: 'คุณสมหญิง', restaurant: 'KFC', status: 'ส่งแล้ว', total: 299 },
    { id: '3', customer: 'คุณมาลี', restaurant: 'ร้านข้าวผัดปู', status: 'เตรียม', total: 150 },
  ];

  const restaurants = [
    { id: '1', name: 'ร้านส้มตำป้าแดง', owner: 'คุณแดง', status: 'เปิด', orders: 247 },
    { id: '2', name: 'KFC สาขาเซ็นทรัล', owner: 'KFC Thailand', status: 'เปิด', orders: 1547 },
    { id: '3', name: 'ร้านข้าวผัดปู', owner: 'คุณหนิง', status: 'ปิด', orders: 89 },
  ];

  const riders = [
    { id: '1', name: 'คุณสมศักดิ์', phone: '081-111-1111', status: 'ออนไลน์', deliveries: 52 },
    { id: '2', name: 'คุณวิชัย', phone: '081-222-2222', status: 'ออฟไลน์', deliveries: 38 },
    { id: '3', name: 'คุณมานะ', phone: '081-333-3333', status: 'กำลังส่ง', deliveries: 71 },
  ];

  // Load pending restaurants data
  useEffect(() => {
    const loadPendingRestaurants = async () => {
      try {
        const response = await fetch('/api/admin/restaurants/pending');
        const result = await response.json();

        if (response.ok && result.success) {
          setPendingRestaurants(result.restaurants);
        } else {
          console.error('Error loading pending restaurants:', result.error);
          // Fallback to mock data if API fails
          setPendingRestaurants([]);
        }
      } catch (error) {
        console.error('Error loading pending restaurants:', error);
        // Fallback to mock data if API fails
        setPendingRestaurants([]);
      }
    };

    loadPendingRestaurants();
  }, []);

  // ป้องกัน hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleViewRestaurant = (restaurant: PendingRestaurant) => {
    setSelectedRestaurant(restaurant);
    setDialogOpen(true);
  };

  const handleApproveRestaurant = async (restaurantId: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/restaurants/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          restaurantId,
          action: 'APPROVED'
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setPendingRestaurants(prev => prev.filter(r => r.id !== restaurantId));
        setDialogOpen(false);
        setSelectedRestaurant(null);
        showSnackbar('อนุมัติร้านอาหารสำเร็จ', 'success');
      } else {
        showSnackbar(result.error || 'ไม่สามารถอนุมัติร้านอาหารได้', 'error');
      }
    } catch (error) {
      showSnackbar('เกิดข้อผิดพลาดในการอนุมัติร้านอาหาร', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRestaurant = async () => {
    if (!selectedRestaurant || !rejectReason.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/admin/restaurants/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          restaurantId: selectedRestaurant.id,
          action: 'REJECTED',
          rejectReason: rejectReason.trim()
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setPendingRestaurants(prev => prev.filter(r => r.id !== selectedRestaurant.id));
        setRejectDialogOpen(false);
        setDialogOpen(false);
        setSelectedRestaurant(null);
        setRejectReason('');
        showSnackbar('ปฏิเสธร้านอาหารสำเร็จ', 'success');
      } else {
        showSnackbar(result.error || 'ไม่สามารถปฏิเสธร้านอาหารได้', 'error');
      }
    } catch (error) {
      showSnackbar('เกิดข้อผิดพลาดในการปฏิเสธร้านอาหาร', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string): 'success' | 'error' | 'warning' | 'default' => {
    switch (status) {
      case 'เปิด':
      case 'ออนไลน์':
      case 'ส่งแล้ว':
        return 'success';
      case 'ปิด':
      case 'ออฟไลน์':
        return 'error';
      case 'กำลังส่ง':
      case 'เตรียม':
      case 'กำลังส่ง':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Bangkok',
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return '🖼️';
    } else if (fileType === 'application/pdf') {
      return '📄';
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return '📝';
    } else if (fileType.includes('sheet') || fileType.includes('excel')) {
      return '📊';
    } else {
      return '📎';
    }
  };

  const getFileTypeColor = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return colors.secondary.fresh;
    } else if (fileType === 'application/pdf') {
      return colors.accent.warm;
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return colors.primary.golden;
    } else if (fileType.includes('sheet') || fileType.includes('excel')) {
      return colors.secondary.darkFresh;
    } else {
      return colors.neutral.gray;
    }
  };

  const handleDownloadFile = (doc: RestaurantDocument) => {
    const link = document.createElement('a');
    link.href = doc.url;
    link.download = doc.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreviewFile = (doc: RestaurantDocument) => {
    setSelectedFile(doc);
    setPreviewFileOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewFileOpen(false);
    setSelectedFile(null);
  };

  const renderFilePreview = (doc: RestaurantDocument) => {
    if (doc.type.startsWith('image/')) {
      return (
        <Box
          sx={{
            width: 120,
            height: 80,
            borderRadius: 2,
            overflow: 'hidden',
            border: `2px solid ${colors.neutral.lightGray}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: colors.neutral.lightGray,
          }}
        >
          <Box
            component="img"
            src={doc.url}
            alt={doc.name}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={(e) => {
              // ถ้าโหลดรูปไม่ได้ให้แสดง placeholder
              const target = e.target as HTMLImageElement;
              const nextElement = target.nextElementSibling as HTMLElement;
              target.style.display = 'none';
              if (nextElement) {
                nextElement.style.display = 'flex';
              }
            }}
          />
          <Box
            sx={{
              display: 'none',
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.neutral.gray,
              fontSize: '2rem',
            }}
          >
            🖼️
          </Box>
        </Box>
      );
    } else {
      return (
        <Box
          sx={{
            width: 120,
            height: 80,
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: `${getFileTypeColor(doc.type)}15`,
            border: `2px solid ${getFileTypeColor(doc.type)}30`,
          }}
        >
          <Typography sx={{ fontSize: '2rem', mb: 1 }}>
            {getFileIcon(doc.type)}
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              color: getFileTypeColor(doc.type),
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            {doc.type.includes('pdf') ? 'PDF' : 
             doc.type.includes('word') ? 'DOC' :
             doc.type.includes('sheet') ? 'XLS' : 'FILE'}
          </Typography>
        </Box>
      );
    }
  };

  if (!mounted) {
    return null; // ป้องกัน hydration mismatch
  }

  return (
    <NoSSR>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        bgcolor: colors.neutral.lightGray,
      }}>
        {/* Header */}
        <AppBar 
          position="static" 
          sx={{ 
            bgcolor: colors.neutral.white,
            boxShadow: `0 2px 8px ${colors.neutral.gray}20`,
            borderBottom: `1px solid ${colors.neutral.lightGray}`,
          }}
        >
          <Toolbar>
            <Dashboard sx={{ mr: 2, color: colors.primary.golden }} />
            <Typography 
              variant="h6" 
              sx={{ 
                flexGrow: 1,
                fontFamily: '"Prompt", sans-serif',
                fontWeight: 600,
                color: colors.neutral.darkGray,
              }}
            >
              ผู้ดูแลระบบ CorgiGo
            </Typography>
            <IconButton sx={{ color: colors.neutral.gray }}>
              <Settings />
            </IconButton>
            <IconButton sx={{ color: colors.neutral.gray }}>
              <AccountCircle />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ flex: 1, py: 3 }}>
          {/* Tabs */}
          <Paper 
            sx={{ 
              mb: 3,
              bgcolor: colors.neutral.white,
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: `0 4px 12px ${colors.neutral.gray}10`,
            }}
          >
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              sx={{
                borderBottom: `1px solid ${colors.neutral.lightGray}`,
                '& .MuiTab-root': {
                  fontFamily: '"Prompt", sans-serif',
                  fontWeight: 500,
                  textTransform: 'none',
                  fontSize: '1rem',
                  color: colors.neutral.gray,
                  '&.Mui-selected': {
                    color: colors.primary.golden,
                    fontWeight: 600,
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: colors.primary.golden,
                  height: 3,
                },
              }}
            >
              <Tab icon={<Dashboard />} label="แดชบอร์ด" />
              <Tab icon={<People />} label="ผู้ใช้งาน" />
              <Tab icon={<Restaurant />} label="ร้านอาหาร" />
              <Tab icon={<TwoWheeler />} label="ไรเดอร์" />
              <Tab icon={<BarChart />} label="ร้านรอการอนุมัติ" />
            </Tabs>

            {/* Dashboard Tab */}
            <TabPanel value={tabValue} index={0}>
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold',
                  fontFamily: '"Prompt", sans-serif',
                  color: colors.neutral.darkGray,
                  mb: 3,
                }}
              >
                สถิติภาพรวม
              </Typography>
              
              {/* Stats Cards */}
              <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, mb: 4 }}>
                <Card sx={{ 
                  bgcolor: `${colors.primary.golden}15`,
                  border: `1px solid ${colors.primary.golden}30`,
                  borderRadius: 3,
                  boxShadow: `0 4px 12px ${colors.primary.golden}10`,
                }}>
                  <CardContent>
                    <Typography variant="h4" sx={{ color: colors.primary.golden, fontWeight: 'bold' }}>
                      {stats.totalUsers.toLocaleString()}
                    </Typography>
                    <Typography sx={{ color: colors.neutral.gray, fontFamily: '"Prompt", sans-serif' }}>
                      ผู้ใช้งานทั้งหมด
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card sx={{ 
                  bgcolor: `${colors.secondary.fresh}15`,
                  border: `1px solid ${colors.secondary.fresh}30`,
                  borderRadius: 3,
                  boxShadow: `0 4px 12px ${colors.secondary.fresh}10`,
                }}>
                  <CardContent>
                    <Typography variant="h4" sx={{ color: colors.secondary.fresh, fontWeight: 'bold' }}>
                      {stats.totalRestaurants}
                    </Typography>
                    <Typography sx={{ color: colors.neutral.gray, fontFamily: '"Prompt", sans-serif' }}>
                      ร้านอาหาร
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card sx={{ 
                  bgcolor: `${colors.accent.warm}15`,
                  border: `1px solid ${colors.accent.warm}30`,
                  borderRadius: 3,
                  boxShadow: `0 4px 12px ${colors.accent.warm}10`,
                }}>
                  <CardContent>
                    <Typography variant="h4" sx={{ color: colors.accent.warm, fontWeight: 'bold' }}>
                      {stats.totalRiders}
                    </Typography>
                    <Typography sx={{ color: colors.neutral.gray, fontFamily: '"Prompt", sans-serif' }}>
                      ไรเดอร์
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card sx={{ 
                  bgcolor: `${colors.secondary.darkFresh}15`,
                  border: `1px solid ${colors.secondary.darkFresh}30`,
                  borderRadius: 3,
                  boxShadow: `0 4px 12px ${colors.secondary.darkFresh}10`,
                }}>
                  <CardContent>
                    <Typography variant="h4" sx={{ color: colors.secondary.darkFresh, fontWeight: 'bold' }}>
                      {stats.totalOrders.toLocaleString()}
                    </Typography>
                    <Typography sx={{ color: colors.neutral.gray, fontFamily: '"Prompt", sans-serif' }}>
                      ออเดอร์ทั้งหมด
                    </Typography>
                  </CardContent>
                </Card>
              </Box>

              {/* Recent Orders */}
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold',
                  fontFamily: '"Prompt", sans-serif',
                  color: colors.neutral.darkGray,
                  mb: 2,
                }}
              >
                ออเดอร์ล่าสุด
              </Typography>
              <TableContainer 
                component={Paper} 
                sx={{ 
                  borderRadius: 3,
                  boxShadow: `0 4px 12px ${colors.neutral.gray}10`,
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: colors.neutral.lightGray }}>
                      <TableCell sx={{ fontFamily: '"Prompt", sans-serif', fontWeight: 600 }}>ลูกค้า</TableCell>
                      <TableCell sx={{ fontFamily: '"Prompt", sans-serif', fontWeight: 600 }}>ร้านอาหาร</TableCell>
                      <TableCell sx={{ fontFamily: '"Prompt", sans-serif', fontWeight: 600 }}>สถานะ</TableCell>
                      <TableCell sx={{ fontFamily: '"Prompt", sans-serif', fontWeight: 600 }}>ยอดเงิน</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell sx={{ fontFamily: '"Prompt", sans-serif' }}>{order.customer}</TableCell>
                        <TableCell sx={{ fontFamily: '"Prompt", sans-serif' }}>{order.restaurant}</TableCell>
                        <TableCell>
                          <Chip 
                            label={order.status} 
                            color={getStatusColor(order.status)}
                            size="small"
                            sx={{ 
                              fontFamily: '"Prompt", sans-serif',
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontFamily: '"Prompt", sans-serif', fontWeight: 600 }}>
                          ฿{order.total}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            {/* ร้านรอการอนุมัติ Tab */}
            <TabPanel value={tabValue} index={4}>
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold',
                  fontFamily: '"Prompt", sans-serif',
                  color: colors.neutral.darkGray,
                }}
              >
                ร้านอาหารรอการอนุมัติ ({pendingRestaurants.length})
              </Typography>
              
              {pendingRestaurants.length === 0 ? (
                <Box sx={{ 
                  mt: 2, 
                  p: 3, 
                  bgcolor: `${colors.secondary.fresh}15`, 
                  borderRadius: 3, 
                  border: `1px solid ${colors.secondary.fresh}30`,
                  textAlign: 'center',
                }}>
                  <CheckCircle sx={{ fontSize: 48, color: colors.secondary.fresh, mb: 2 }} />
                  <Typography 
                    sx={{ 
                      color: colors.secondary.fresh,
                      fontFamily: '"Prompt", sans-serif',
                      fontWeight: 500,
                    }}
                  >
                    ไม่มีร้านอาหารที่รอการอนุมัติ
                  </Typography>
                </Box>
              ) : (
                <TableContainer 
                  component={Paper}
                  sx={{ 
                    borderRadius: 3,
                    boxShadow: `0 4px 12px ${colors.neutral.gray}10`,
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: colors.neutral.lightGray }}>
                        <TableCell sx={{ fontFamily: '"Prompt", sans-serif', fontWeight: 600 }}>ชื่อร้าน</TableCell>
                        <TableCell sx={{ fontFamily: '"Prompt", sans-serif', fontWeight: 600 }}>เจ้าของ</TableCell>
                        <TableCell sx={{ fontFamily: '"Prompt", sans-serif', fontWeight: 600 }}>เบอร์โทร</TableCell>
                        <TableCell sx={{ fontFamily: '"Prompt", sans-serif', fontWeight: 600 }}>วันที่สมัคร</TableCell>
                        <TableCell sx={{ fontFamily: '"Prompt", sans-serif', fontWeight: 600 }}>การดำเนินการ</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pendingRestaurants.map((restaurant) => (
                        <TableRow key={restaurant.id}>
                          <TableCell sx={{ fontFamily: '"Prompt", sans-serif', fontWeight: 500 }}>
                            {restaurant.name}
                          </TableCell>
                          <TableCell sx={{ fontFamily: '"Prompt", sans-serif' }}>
                            {restaurant.owner}
                          </TableCell>
                          <TableCell sx={{ fontFamily: '"Prompt", sans-serif' }}>
                            {restaurant.phone}
                          </TableCell>
                          <TableCell sx={{ fontFamily: '"Prompt", sans-serif' }}>
                            {formatDate(restaurant.submittedAt)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<Visibility />}
                              onClick={() => handleViewRestaurant(restaurant)}
                              sx={{
                                borderColor: colors.primary.golden,
                                color: colors.primary.golden,
                                fontFamily: '"Prompt", sans-serif',
                                textTransform: 'none',
                                '&:hover': {
                                  borderColor: colors.primary.darkGolden,
                                  bgcolor: `${colors.primary.golden}08`,
                                },
                              }}
                            >
                              ดูรายละเอียด
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </TabPanel>

            {/* อื่นๆ tabs */}
            <TabPanel value={tabValue} index={1}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', fontFamily: '"Prompt", sans-serif' }}>
                จัดการผู้ใช้งาน
              </Typography>
              {/* เนื้อหาการจัดการผู้ใช้งาน */}
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', fontFamily: '"Prompt", sans-serif' }}>
                จัดการร้านอาหาร
              </Typography>
              {/* เนื้อหาการจัดการร้านอาหาร */}
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', fontFamily: '"Prompt", sans-serif' }}>
                จัดการไรเดอร์
              </Typography>
              {/* เนื้อหาการจัดการไรเดอร์ */}
            </TabPanel>
          </Paper>
        </Container>

        {/* Dialogs */}
        <Dialog 
          open={dialogOpen} 
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: `0 8px 32px ${colors.neutral.gray}20`,
            }
          }}
        >
          {selectedRestaurant && (
            <>
              <DialogTitle sx={{ 
                bgcolor: colors.neutral.lightGray,
                borderBottom: `1px solid ${colors.neutral.lightGray}`,
              }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 'bold',
                    fontFamily: '"Prompt", sans-serif',
                    color: colors.neutral.darkGray,
                  }}
                >
                  รายละเอียดร้านอาหาร: {selectedRestaurant.name}
                </Typography>
              </DialogTitle>
              <DialogContent sx={{ p: 3 }}>
                {/* Restaurant Details */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, fontFamily: '"Prompt", sans-serif' }}>
                    ข้อมูลพื้นฐาน
                  </Typography>
                  <Typography sx={{ mb: 1, fontFamily: '"Prompt", sans-serif' }}>
                    <strong>เจ้าของ:</strong> {selectedRestaurant.owner}
                  </Typography>
                  <Typography sx={{ mb: 1, fontFamily: '"Prompt", sans-serif' }}>
                    <strong>อีเมล:</strong> {selectedRestaurant.email}
                  </Typography>
                  <Typography sx={{ mb: 1, fontFamily: '"Prompt", sans-serif' }}>
                    <strong>เบอร์โทร:</strong> {selectedRestaurant.phone}
                  </Typography>
                  <Typography sx={{ mb: 1, fontFamily: '"Prompt", sans-serif' }}>
                    <strong>ที่อยู่:</strong> {selectedRestaurant.address}
                  </Typography>
                  <Typography sx={{ mb: 1, fontFamily: '"Prompt", sans-serif' }}>
                    <strong>รายละเอียด:</strong> {selectedRestaurant.description}
                  </Typography>
                </Box>

                {/* Documents */}
                {selectedRestaurant.documents.length > 0 && (
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, fontFamily: '"Prompt", sans-serif' }}>
                      เอกสารประกอบ ({selectedRestaurant.documents.length} ไฟล์)
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {selectedRestaurant.documents.map((doc) => (
                        <Paper 
                          key={doc.id} 
                          sx={{ 
                            p: 3, 
                            bgcolor: colors.neutral.white,
                            borderRadius: 3,
                            border: `1px solid ${colors.neutral.lightGray}`,
                            boxShadow: `0 2px 8px ${colors.neutral.gray}10`,
                          }}
                        >
                          <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                            {/* File Preview */}
                            {renderFilePreview(doc)}
                            
                            {/* File Info */}
                            <Box sx={{ flex: 1 }}>
                              <Typography 
                                variant="subtitle1" 
                                sx={{ 
                                  fontWeight: 'bold', 
                                  fontFamily: '"Prompt", sans-serif',
                                  color: colors.neutral.darkGray,
                                  mb: 1,
                                  wordBreak: 'break-word',
                                }}
                              >
                                {doc.name}
                              </Typography>
                              
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 2 }}>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    color: colors.neutral.gray, 
                                    fontFamily: '"Prompt", sans-serif',
                                  }}
                                >
                                  <strong>ขนาด:</strong> {formatFileSize(doc.size)}
                                </Typography>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    color: colors.neutral.gray, 
                                    fontFamily: '"Prompt", sans-serif',
                                  }}
                                >
                                  <strong>ประเภท:</strong> {doc.type}
                                </Typography>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    color: colors.neutral.gray, 
                                    fontFamily: '"Prompt", sans-serif',
                                  }}
                                >
                                  <strong>อัพโหลดเมื่อ:</strong> {formatDate(doc.createdAt)}
                                </Typography>
                              </Box>

                              {/* File Type Badge */}
                              <Box sx={{ mb: 2 }}>
                                <Chip
                                  label={
                                    doc.type.startsWith('image/') ? 'รูปภาพ' :
                                    doc.type.includes('pdf') ? 'เอกสาร PDF' :
                                    doc.type.includes('word') ? 'เอกสาร Word' :
                                    doc.type.includes('sheet') ? 'ไฟล์ Excel' : 'ไฟล์เอกสาร'
                                  }
                                  size="small"
                                  sx={{
                                    bgcolor: `${getFileTypeColor(doc.type)}15`,
                                    color: getFileTypeColor(doc.type),
                                    fontFamily: '"Prompt", sans-serif',
                                    fontWeight: 500,
                                    border: `1px solid ${getFileTypeColor(doc.type)}30`,
                                  }}
                                />
                              </Box>

                              {/* Action Buttons */}
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                {/* Preview Button for Images */}
                                {doc.type.startsWith('image/') && (
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => handlePreviewFile(doc)}
                                    sx={{
                                      borderColor: colors.secondary.fresh,
                                      color: colors.secondary.fresh,
                                      fontFamily: '"Prompt", sans-serif',
                                      textTransform: 'none',
                                      borderRadius: 2,
                                      px: 2,
                                      '&:hover': {
                                        borderColor: colors.secondary.darkFresh,
                                        bgcolor: `${colors.secondary.fresh}08`,
                                      },
                                    }}
                                    startIcon={
                                      <Box sx={{ fontSize: '1.2rem' }}>👁️</Box>
                                    }
                                  >
                                    ดูภาพ
                                  </Button>
                                )}

                                {/* Download Button */}
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => handleDownloadFile(doc)}
                                  sx={{
                                    borderColor: colors.primary.golden,
                                    color: colors.primary.golden,
                                    fontFamily: '"Prompt", sans-serif',
                                    textTransform: 'none',
                                    borderRadius: 2,
                                    px: 2,
                                    '&:hover': {
                                      borderColor: colors.primary.darkGolden,
                                      bgcolor: `${colors.primary.golden}08`,
                                    },
                                  }}
                                  startIcon={
                                    <Box sx={{ fontSize: '1.2rem' }}>📥</Box>
                                  }
                                >
                                  ดาวน์โหลด
                                </Button>
                              </Box>
                            </Box>
                          </Box>
                        </Paper>
                      ))}
                    </Box>
                  </Box>
                )}
              </DialogContent>
              <DialogActions sx={{ p: 3, bgcolor: colors.neutral.lightGray }}>
                <Button 
                  onClick={() => setRejectDialogOpen(true)}
                  variant="outlined"
                  sx={{
                    borderColor: colors.accent.warm,
                    color: colors.accent.warm,
                    fontFamily: '"Prompt", sans-serif',
                    '&:hover': {
                      borderColor: colors.accent.darkWarm,
                      bgcolor: `${colors.accent.warm}08`,
                    },
                  }}
                  disabled={loading}
                >
                  ปฏิเสธ
                </Button>
                <Button 
                  onClick={() => handleApproveRestaurant(selectedRestaurant.id)}
                  variant="contained"
                  sx={{
                    bgcolor: colors.secondary.fresh,
                    color: colors.neutral.white,
                    fontFamily: '"Prompt", sans-serif',
                    '&:hover': {
                      bgcolor: colors.secondary.darkFresh,
                    },
                  }}
                  disabled={loading}
                  startIcon={<CheckCircle />}
                >
                  อนุมัติ
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Reject Reason Dialog */}
        <Dialog 
          open={rejectDialogOpen} 
          onClose={() => setRejectDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: `0 8px 32px ${colors.neutral.gray}20`,
            }
          }}
        >
          <DialogTitle sx={{ 
            bgcolor: colors.neutral.lightGray,
            borderBottom: `1px solid ${colors.neutral.lightGray}`,
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold',
                fontFamily: '"Prompt", sans-serif',
                color: colors.neutral.darkGray,
              }}
            >
              ระบุเหตุผลในการปฏิเสธ
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="ระบุเหตุผลในการปฏิเสธ..."
              sx={{ 
                mt: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontFamily: '"Prompt", sans-serif',
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.primary.golden,
                  },
                },
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, bgcolor: colors.neutral.lightGray }}>
            <Button 
              onClick={() => setRejectDialogOpen(false)}
              sx={{
                color: colors.neutral.gray,
                fontFamily: '"Prompt", sans-serif',
              }}
              disabled={loading}
            >
              ยกเลิก
            </Button>
            <Button 
              onClick={handleRejectRestaurant}
              variant="contained"
              sx={{
                bgcolor: colors.accent.warm,
                color: colors.neutral.white,
                fontFamily: '"Prompt", sans-serif',
                '&:hover': {
                  bgcolor: colors.accent.darkWarm,
                },
              }}
              disabled={loading || !rejectReason.trim()}
              startIcon={<Cancel />}
            >
              ปฏิเสธ
            </Button>
          </DialogActions>
        </Dialog>

        {/* File Preview Dialog */}
        <Dialog 
          open={previewFileOpen} 
          onClose={handleClosePreview}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: `0 8px 32px ${colors.neutral.gray}20`,
              maxHeight: '90vh',
            }
          }}
        >
          {selectedFile && (
            <>
              <DialogTitle sx={{ 
                bgcolor: colors.neutral.lightGray,
                borderBottom: `1px solid ${colors.neutral.lightGray}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 'bold',
                    fontFamily: '"Prompt", sans-serif',
                    color: colors.neutral.darkGray,
                  }}
                >
                  ตัวอย่างไฟล์: {selectedFile.name}
                </Typography>
                <IconButton 
                  onClick={handleClosePreview}
                  sx={{ color: colors.neutral.gray }}
                >
                  ✕
                </IconButton>
              </DialogTitle>
              <DialogContent sx={{ p: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {selectedFile.type.startsWith('image/') ? (
                  <Box
                    component="img"
                    src={selectedFile.url}
                    alt={selectedFile.name}
                    sx={{
                      maxWidth: '100%',
                      maxHeight: '70vh',
                      objectFit: 'contain',
                      borderRadius: 2,
                    }}
                  />
                ) : (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography 
                      sx={{ 
                        fontSize: '4rem', 
                        mb: 2,
                        color: getFileTypeColor(selectedFile.type),
                      }}
                    >
                      {getFileIcon(selectedFile.type)}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontFamily: '"Prompt", sans-serif',
                        color: colors.neutral.darkGray,
                        mb: 1,
                      }}
                    >
                      {selectedFile.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: colors.neutral.gray,
                        fontFamily: '"Prompt", sans-serif',
                        mb: 3,
                      }}
                    >
                      ขนาด: {formatFileSize(selectedFile.size)} | ประเภท: {selectedFile.type}
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => handleDownloadFile(selectedFile)}
                      sx={{
                        bgcolor: colors.primary.golden,
                        color: colors.neutral.white,
                        fontFamily: '"Prompt", sans-serif',
                        textTransform: 'none',
                        '&:hover': {
                          bgcolor: colors.primary.darkGolden,
                        },
                      }}
                      startIcon={
                        <Box sx={{ fontSize: '1.2rem' }}>📥</Box>
                      }
                    >
                      ดาวน์โหลดไฟล์
                    </Button>
                  </Box>
                )}
              </DialogContent>
            </>
          )}
        </Dialog>
      </Box>
    </NoSSR>
  );
} 