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
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Skeleton,
  FormControl,
  Select,
  MenuItem,
  Avatar,
  Pagination,
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
  Menu as MenuIcon,
  Close as CloseIcon,
  Search,
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

interface ApprovedRestaurant {
  id: string;
  name: string;
  description?: string;
  address: string;
  phone: string;
  rating: number;
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
  owner: string;
  ownerEmail: string;
  ownerPhone?: string;
  approvedAt: Date;
  approvedAtThai?: string;
  stats: {
    totalOrders: number;
    totalMenuItems: number;
    availableMenuItems: number;
    totalRevenue: number;
  };
  createdAt: Date;
}

export default function AdminPage() {
  const { showSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [tabValue, setTabValue] = useState(0);
  const [pendingRestaurants, setPendingRestaurants] = useState<PendingRestaurant[]>([]);
  const [approvedRestaurants, setApprovedRestaurants] = useState<ApprovedRestaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<PendingRestaurant | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [previewFileOpen, setPreviewFileOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<RestaurantDocument | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // User management states
  const [users, setUsers] = useState<any[]>([]);
  const [userPage, setUserPage] = useState(1);
  const [userSearch, setUserSearch] = useState('');
  const [userRole, setUserRole] = useState('all');
  const [userTotal, setUserTotal] = useState(0);
  const [userEditDialog, setUserEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(false);
  
  // Restaurant management states  
  const [managedRestaurants, setManagedRestaurants] = useState<any[]>([]);
  const [restaurantPage, setRestaurantPage] = useState(1);
  const [restaurantSearch, setRestaurantSearch] = useState('');
  const [restaurantStatus, setRestaurantStatus] = useState('all');
  const [restaurantTotal, setRestaurantTotal] = useState(0);
  const [restaurantEditDialog, setRestaurantEditDialog] = useState(false);
  const [selectedRestaurantForEdit, setSelectedRestaurantForEdit] = useState<any>(null);
  const [restaurantLoading, setRestaurantLoading] = useState(false);

  // Calculate real stats
  const stats = {
    totalUsers: 15420, // TODO: Get from API
    totalRestaurants: approvedRestaurants.length,
    totalRiders: 156, // TODO: Get from API
    totalOrders: approvedRestaurants.reduce((sum, r) => sum + r.stats.totalOrders, 0),
    pendingRestaurants: pendingRestaurants.length,
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

  // Load data
  useEffect(() => {
    const loadPendingRestaurants = async () => {
      try {
        const response = await fetch('/api/admin/restaurants/pending');
        const result = await response.json();

        if (response.ok && result.success) {
          setPendingRestaurants(result.restaurants);
        } else {
          console.error('Error loading pending restaurants:', result.error);
          setPendingRestaurants([]);
        }
      } catch (error) {
        console.error('Error loading pending restaurants:', error);
        setPendingRestaurants([]);
              }
    };

    const loadApprovedRestaurants = async () => {
      try {
        const response = await fetch('/api/admin/restaurants/approved');
        const result = await response.json();

        if (response.ok && result.success) {
          setApprovedRestaurants(result.restaurants);
        } else {
          console.error('Error loading approved restaurants:', result.error);
          setApprovedRestaurants([]);
        }
      } catch (error) {
        console.error('Error loading approved restaurants:', error);
        setApprovedRestaurants([]);
              }
    };

    const loadData = async () => {
      await Promise.all([
        loadPendingRestaurants(),
        loadApprovedRestaurants()
      ]);
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Load users data
  const loadUsers = async () => {
    setUserLoading(true);
    try {
      const params = new URLSearchParams({
        page: userPage.toString(),
        limit: '10',
        search: userSearch,
        role: userRole
      });

      const response = await fetch(`/api/admin/users?${params}`);
      const result = await response.json();

      if (response.ok && result.success) {
        setUsers(result.users);
        setUserTotal(result.pagination.total);
      } else {
        console.error('Error loading users:', result.error);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    } finally {
      setUserLoading(false);
    }
  };

  // Load managed restaurants data
  const loadManagedRestaurants = async () => {
    setRestaurantLoading(true);
    try {
      const params = new URLSearchParams({
        page: restaurantPage.toString(),
        limit: '10',
        search: restaurantSearch,
        status: restaurantStatus
      });

      const response = await fetch(`/api/admin/restaurants/manage?${params}`);
      const result = await response.json();

      if (response.ok && result.success) {
        setManagedRestaurants(result.restaurants);
        setRestaurantTotal(result.pagination.total);
      } else {
        console.error('Error loading managed restaurants:', result.error);
        setManagedRestaurants([]);
      }
    } catch (error) {
      console.error('Error loading managed restaurants:', error);
      setManagedRestaurants([]);
    } finally {
      setRestaurantLoading(false);
    }
  };

  // Load users when tab changes to users or search/filter changes
  useEffect(() => {
    if (tabValue === 1) {
      loadUsers();
    }
  }, [tabValue, userPage, userSearch, userRole]);

  // Load managed restaurants when tab changes or search/filter changes
  useEffect(() => {
    if (tabValue === 2) {
      loadManagedRestaurants();
    }
  }, [tabValue, restaurantPage, restaurantSearch, restaurantStatus]);

  // User management functions
  const handleToggleUserStatus = async (user: any) => {
    setUserLoading(true);
    try {
      const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          action: 'toggle_status',
          data: { status: newStatus }
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        await loadUsers(); // Reload users
        showSnackbar(
          newStatus === 'ACTIVE' ? 'เปิดใช้งานผู้ใช้สำเร็จ' : 'ปิดใช้งานผู้ใช้สำเร็จ', 
          'success'
        );
      } else {
        showSnackbar(result.error || 'ไม่สามารถเปลี่ยนสถานะผู้ใช้ได้', 'error');
      }
    } catch (error) {
      showSnackbar('เกิดข้อผิดพลาดในการเปลี่ยนสถานะผู้ใช้', 'error');
    } finally {
      setUserLoading(false);
    }
  };

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
        
        // Reload approved restaurants
        const approvedResponse = await fetch('/api/admin/restaurants/approved');
        const approvedResult = await approvedResponse.json();
        if (approvedResponse.ok && approvedResult.success) {
          setApprovedRestaurants(approvedResult.restaurants);
        }
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

  // Responsive table rendering function
  const renderResponsiveTable = (data: any[], columns: string[], renderRow: (item: any) => React.ReactNode) => {
    if (isMobile) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {data.map((item) => (
            <Box key={item.id}>
              {renderRow(item)}
            </Box>
          ))}
        </Box>
      );
    }
    
    return (
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
              {columns.map((column) => (
                <TableCell key={column} sx={{ fontFamily: '"Prompt", sans-serif', fontWeight: 600 }}>
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => renderRow(item))}
          </TableBody>
        </Table>
      </TableContainer>
    );
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

  if (!mounted || isLoading) {
    return (
      <NoSSR>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh',
          bgcolor: '#fafbfc',
        }}>
          {/* Loading Header */}
          <AppBar 
            position="static" 
            elevation={0}
            sx={{ 
              bgcolor: '#ffffff',
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            <Toolbar>
              <Dashboard sx={{ mr: 2, color: '#111827' }} />
              <Typography 
                variant="h6" 
                sx={{ 
                  flexGrow: 1,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  fontWeight: 600,
                  color: '#111827',
                }}
              >
                CorgiGo Admin
              </Typography>
            </Toolbar>
          </AppBar>

          {/* Loading Content */}
          <Container maxWidth="xl" sx={{ flex: 1, py: 4 }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              minHeight: '60vh',
              gap: 3
            }}>
              <Box sx={{ 
                width: 48, 
                height: 48, 
                borderRadius: '50%',
                bgcolor: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { opacity: 1 },
                  '50%': { opacity: 0.5 },
                  '100%': { opacity: 1 },
                }
              }}>
                <Dashboard sx={{ fontSize: 24, color: '#111827' }} />
              </Box>
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    fontWeight: 600,
                    color: '#111827',
                    mb: 1
                  }}
                >
                  กำลังโหลด
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    color: '#6b7280'
                  }}
                >
                  กรุณารอสักครู่...
                </Typography>
              </Box>

              <Box sx={{ 
                display: 'flex', 
                gap: 1,
                '& > div': {
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: '#d1d5db',
                  animation: 'bounce 1.4s infinite ease-in-out both',
                },
                '& > div:nth-of-type(1)': { animationDelay: '-0.32s' },
                '& > div:nth-of-type(2)': { animationDelay: '-0.16s' },
                '@keyframes bounce': {
                  '0%, 80%, 100%': { transform: 'scale(0)' },
                  '40%': { transform: 'scale(1)' },
                }
              }}>
                <Box />
                <Box />
                <Box />
              </Box>
            </Box>
          </Container>
        </Box>
      </NoSSR>
    );
  }

  return (
    <NoSSR>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        bgcolor: '#fafbfc',
      }}>
        {/* Header */}
        <AppBar 
          position="static" 
          elevation={0}
          sx={{ 
            bgcolor: '#ffffff',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <Toolbar>
            {isMobile && (
              <IconButton 
                edge="start" 
                sx={{ mr: 2, color: '#111827' }}
                onClick={() => setMobileMenuOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Dashboard sx={{ mr: 2, color: '#111827' }} />
            <Typography 
              variant={isMobile ? "subtitle1" : "h6"} 
              sx={{ 
                flexGrow: 1,
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontWeight: 600,
                color: '#111827',
                letterSpacing: '-0.025em',
              }}
            >
              {isMobile ? "Admin" : "CorgiGo Admin"}
            </Typography>
            {!isMobile && (
              <>
                <IconButton 
                  sx={{ 
                    color: '#6b7280', 
                    '&:hover': { 
                      bgcolor: '#f9fafb',
                      color: '#111827',
                    }
                  }}
                >
                  <Settings />
                </IconButton>
                <IconButton 
                  sx={{ 
                    color: '#6b7280',
                    '&:hover': { 
                      bgcolor: '#f9fafb',
                      color: '#111827',
                    }
                  }}
                >
                  <AccountCircle />
                </IconButton>
              </>
            )}
          </Toolbar>
        </AppBar>

        {/* Mobile Navigation Drawer */}
        <Drawer
          anchor="left"
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          PaperProps={{
            sx: {
              width: 280,
              bgcolor: '#ffffff',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }
          }}
        >
          <Box sx={{ 
            p: 3, 
            bgcolor: '#ffffff',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <Typography variant="h6" sx={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 600, color: '#111827' }}>
              เมนูหลัก
            </Typography>
            <IconButton 
              onClick={() => setMobileMenuOpen(false)}
              sx={{ 
                color: '#6b7280',
                '&:hover': { 
                  bgcolor: '#f9fafb',
                  color: '#111827',
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <List sx={{ py: 0 }}>
            {[
              { label: 'แดชบอร์ด', icon: <Dashboard />, index: 0 },
              { label: 'ผู้ใช้งาน', icon: <People />, index: 1 },
              { label: `ร้านอาหาร (${approvedRestaurants.length})`, icon: <Restaurant />, index: 2 },
              { label: 'ไรเดอร์', icon: <TwoWheeler />, index: 3 },
              { label: `ร้านรอการอนุมัติ (${pendingRestaurants.length})`, icon: <BarChart />, index: 4 },
            ].map((item) => (
              <ListItem key={item.index} disablePadding>
                <ListItemButton
                  selected={tabValue === item.index}
                  onClick={() => {
                    setTabValue(item.index);
                    setMobileMenuOpen(false);
                  }}
                  sx={{
                    py: 2,
                    px: 3,
                    mx: 1,
                    my: 0.5,
                    borderRadius: 1,
                    '&.Mui-selected': {
                      bgcolor: '#f9fafb',
                      borderLeft: '3px solid #111827',
                      '&:hover': {
                        bgcolor: '#f3f4f6',
                      }
                    },
                    '&:hover': {
                      bgcolor: '#f9fafb',
                    }
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      color: tabValue === item.index ? '#111827' : '#6b7280',
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        fontWeight: tabValue === item.index ? 600 : 500,
                        color: tabValue === item.index ? '#111827' : '#374151',
                        fontSize: '0.875rem',
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>

        {/* Main Content */}
        <Container 
          maxWidth={isMobile ? false : "xl"} 
          sx={{ 
            flex: 1, 
            py: isMobile ? 3 : 4,
            px: isMobile ? 2 : 4,
          }}
        >
          {/* Tabs - Hidden on mobile */}
          {!isMobile && (
            <Paper 
              sx={{ 
                mb: 4,
                bgcolor: '#ffffff',
                borderRadius: '8px',
                boxShadow: 'none',
                border: '1px solid #e5e7eb',
              }}
            >
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                variant={isMobile ? "scrollable" : "standard"}
                scrollButtons={isMobile ? "auto" : false}
                sx={{
                  minHeight: 52,
                  '& .MuiTabs-flexContainer': {
                    px: 2,
                  },
                  '& .MuiTab-root': {
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    fontWeight: 500,
                    textTransform: 'none',
                    fontSize: '0.875rem',
                    minWidth: isMobile ? 'auto' : 140,
                    minHeight: 52,
                    color: '#6b7280',
                    px: 3,
                    py: 2,
                    '&:hover': {
                      color: '#374151',
                      bgcolor: '#f9fafb',
                    },
                    '&.Mui-selected': {
                      color: '#111827',
                      bgcolor: '#f3f4f6',
                      fontWeight: 600,
                    },
                    '& .MuiSvgIcon-root': {
                      fontSize: '1.25rem',
                      mb: 0.5,
                    }
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#111827',
                    height: 2,
                  },
                }}
              >
                <Tab 
                  icon={<Dashboard />} 
                  label="แดชบอร์ด" 
                  iconPosition="top"
                />
                <Tab 
                  icon={<People />} 
                  label="ผู้ใช้งาน" 
                  iconPosition="top"
                />
                <Tab 
                  icon={<Restaurant />} 
                  label={`ร้านอาหาร (${approvedRestaurants.length})`} 
                  iconPosition="top"
                />
                <Tab 
                  icon={<TwoWheeler />} 
                  label="ไรเดอร์" 
                  iconPosition="top"
                />
                <Tab 
                  icon={<BarChart />} 
                  label={`ร้านรอการอนุมัติ (${pendingRestaurants.length})`} 
                  iconPosition="top"
                />
              </Tabs>
            </Paper>
          )}

          {/* Mobile Page Title */}
          {isMobile && (
            <Paper sx={{ 
              mb: 3, 
              p: 3, 
              bgcolor: '#ffffff',
              borderRadius: '8px',
              boxShadow: 'none',
              border: '1px solid #e5e7eb',
            }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  color: '#111827',
                }}
              >
                {[
                  'แดชบอร์ด',
                  'ผู้ใช้งาน', 
                  `ร้านอาหาร (${approvedRestaurants.length})`,
                  'ไรเดอร์',
                  `ร้านรอการอนุมัติ (${pendingRestaurants.length})`
                ][tabValue]}
              </Typography>
            </Paper>
          )}

          {/* Content Container */}
          <Paper 
            sx={{ 
              bgcolor: '#ffffff',
              borderRadius: '8px',
              boxShadow: 'none',
              border: '1px solid #e5e7eb',
              minHeight: '60vh',
            }}
          >

            {/* Dashboard Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ p: isMobile ? 3 : 4 }}>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 600,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    color: '#111827',
                    mb: 4,
                    textAlign: isMobile ? 'center' : 'left',
                  }}
                >
                  สถิติภาพรวม
                </Typography>
                
                {/* Stats Cards */}
                <Box sx={{ 
                  display: 'grid', 
                  gap: isMobile ? 2 : 3, 
                  gridTemplateColumns: { 
                    xs: '1fr', 
                    sm: 'repeat(2, 1fr)', 
                    md: 'repeat(2, 1fr)',
                    lg: 'repeat(4, 1fr)' 
                  }, 
                  mb: 5 
                }}>
                  <Card sx={{ 
                    bgcolor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: 'none',
                    '&:hover': {
                      bgcolor: '#f9fafb',
                    }
                  }}>
                    <CardContent sx={{ 
                      p: isMobile ? 3 : 4,
                      textAlign: 'center',
                    }}>
                      <Typography 
                        variant={isMobile ? "h4" : "h3"} 
                        sx={{ 
                          color: '#111827', 
                          fontWeight: 700,
                          mb: 2,
                          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        }}
                      >
                        {stats.totalUsers.toLocaleString()}
                      </Typography>
                      <Typography sx={{ 
                        color: '#6b7280', 
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        fontSize: isMobile ? '0.875rem' : '1rem',
                        fontWeight: 500,
                      }}>
                        ผู้ใช้งานทั้งหมด
                      </Typography>
                    </CardContent>
                  </Card>

                  <Card sx={{ 
                    bgcolor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: 'none',
                    '&:hover': {
                      bgcolor: '#f9fafb',
                    }
                  }}>
                    <CardContent sx={{ 
                      p: isMobile ? 3 : 4,
                      textAlign: 'center',
                    }}>
                      <Typography 
                        variant={isMobile ? "h4" : "h3"} 
                        sx={{ 
                          color: '#111827', 
                          fontWeight: 700,
                          mb: 2,
                          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        }}
                      >
                        {stats.totalRestaurants}
                      </Typography>
                      <Typography sx={{ 
                        color: '#6b7280', 
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        fontSize: isMobile ? '0.875rem' : '1rem',
                        fontWeight: 500,
                      }}>
                        ร้านอาหารที่ให้บริการ
                      </Typography>
                    </CardContent>
                  </Card>

                  <Card sx={{ 
                    bgcolor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: 'none',
                    '&:hover': {
                      bgcolor: '#f9fafb',
                    }
                  }}>
                    <CardContent sx={{ 
                      p: isMobile ? 3 : 4,
                      textAlign: 'center',
                    }}>
                      <Typography 
                        variant={isMobile ? "h4" : "h3"} 
                        sx={{ 
                          color: '#111827', 
                          fontWeight: 700,
                          mb: 2,
                          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        }}
                      >
                        {pendingRestaurants.length}
                      </Typography>
                      <Typography sx={{ 
                        color: '#6b7280', 
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        fontSize: isMobile ? '0.875rem' : '1rem',
                        fontWeight: 500,
                      }}>
                        ร้านรอการอนุมัติ
                      </Typography>
                    </CardContent>
                  </Card>

                  <Card sx={{ 
                    bgcolor: `${colors.accent.lightWarm}15`,
                    border: `1px solid ${colors.accent.lightWarm}30`,
                    borderRadius: '16px',
                    boxShadow: '0 8px 25px -5px rgba(251, 188, 52, 0.25)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px -10px rgba(251, 188, 52, 0.35)',
                    }
                  }}>
                    <CardContent sx={{ 
                      p: isMobile ? 3 : 4,
                      textAlign: 'center',
                    }}>
                      <Typography 
                        variant={isMobile ? "h4" : "h3"} 
                        sx={{ 
                          color: '#111827', 
                          fontWeight: 700,
                          mb: 2,
                          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        }}
                      >
                        {stats.totalOrders.toLocaleString()}
                      </Typography>
                      <Typography sx={{ 
                        color: '#6b7280', 
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        fontSize: isMobile ? '0.875rem' : '1rem',
                        fontWeight: 500,
                      }}>
                        คำสั่งซื้อทั้งหมด
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>

                {/* Quick Actions Section */}
                <Paper sx={{
                  p: isMobile ? 3 : 4,
                  borderRadius: '8px',
                  bgcolor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  boxShadow: 'none',
                  mb: 4,
                }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      color: '#111827',
                      mb: 3,
                    }}
                  >
                    การดำเนินการด่วน
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'grid', 
                    gap: 2, 
                    gridTemplateColumns: { 
                      xs: '1fr', 
                      sm: 'repeat(2, 1fr)', 
                      md: 'repeat(3, 1fr)' 
                    }
                  }}>
                    <Button
                      variant="contained"
                      startIcon={<BarChart />}
                      onClick={() => setTabValue(4)}
                      sx={{
                        py: 2,
                        px: 3,
                        borderRadius: '6px',
                        bgcolor: '#111827',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        fontWeight: 500,
                        boxShadow: 'none',
                        '&:hover': {
                          bgcolor: '#374151',
                        }
                      }}
                    >
                      ตรวจสอบร้านรอการอนุมัติ ({pendingRestaurants.length})
                    </Button>
                    
                    <Button
                      variant="outlined"
                      startIcon={<Restaurant />}
                      onClick={() => setTabValue(2)}
                      sx={{
                        py: 2,
                        px: 3,
                        borderRadius: '6px',
                        borderColor: '#d1d5db',
                        color: '#374151',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        fontWeight: 500,
                        '&:hover': {
                          borderColor: '#9ca3af',
                          bgcolor: '#f9fafb',
                        }
                      }}
                    >
                      จัดการร้านอาหาร ({approvedRestaurants.length})
                    </Button>
                    
                    <Button
                      variant="outlined"
                      startIcon={<People />}
                      onClick={() => setTabValue(1)}
                      sx={{
                        py: 2,
                        px: 3,
                        borderRadius: '6px',
                        borderColor: '#d1d5db',
                        color: '#374151',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        fontWeight: 500,
                        '&:hover': {
                          borderColor: '#9ca3af',
                          bgcolor: '#f9fafb',
                        }
                      }}
                    >
                      จัดการผู้ใช้งาน
                    </Button>
                  </Box>
                </Paper>
              </Box>
            </TabPanel>

            {/* ร้านรอการอนุมัติ Tab */}
            <TabPanel value={tabValue} index={4}>
              <Box sx={{ p: isMobile ? 3 : 4 }}>
                <Typography 
                  variant="h4" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 700,
                    fontFamily: '"Prompt", sans-serif',
                    color: '#1e293b',
                    mb: 4,
                    background: `linear-gradient(135deg, ${colors.primary.golden} 0%, ${colors.secondary.fresh} 100%)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textAlign: isMobile ? 'center' : 'left',
                  }}
                >
                  ⏳ ร้านรอการอนุมัติ ({pendingRestaurants.length})
                </Typography>

                {isLoading ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {[...Array(2)].map((_, index) => (
                      <Paper key={index} sx={{ 
                        p: 4, 
                        borderRadius: '20px',
                        bgcolor: '#ffffff',
                        border: '1px solid #f1f5f9',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                          <Skeleton variant="text" width="50%" height={40} />
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 2 }} />
                            <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 2 }} />
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
                          <Box>
                            <Skeleton variant="text" width="30%" height={24} />
                            <Skeleton variant="text" width="80%" height={20} />
                            <Skeleton variant="text" width="60%" height={20} />
                          </Box>
                          <Box>
                            <Skeleton variant="text" width="30%" height={24} />
                            <Skeleton variant="text" width="90%" height={20} />
                          </Box>
                        </Box>

                        <Skeleton variant="text" width="25%" height={24} sx={{ mb: 2 }} />
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                          {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} variant="rectangular" height={60} sx={{ borderRadius: 2 }} />
                          ))}
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                ) : pendingRestaurants.length === 0 ? (
                  <Paper sx={{
                    p: 4,
                    borderRadius: '20px',
                    bgcolor: '#ffffff',
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    textAlign: 'center',
                    minHeight: '400px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Box>
                      <CheckCircle sx={{ fontSize: 80, color: colors.secondary.fresh, mb: 2 }} />
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontFamily: '"Prompt", sans-serif',
                          color: '#64748b',
                          mb: 1,
                        }}
                      >
                        🎉 ยอดเยี่ยม! ไม่มีร้านที่รอการอนุมัติ
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: '"Prompt", sans-serif',
                          color: '#94a3b8',
                        }}
                      >
                        ร้านอาหารทั้งหมดได้รับการพิจารณาแล้ว
                      </Typography>
                    </Box>
                  </Paper>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {pendingRestaurants.map((restaurant) => (
                      <Paper 
                        key={restaurant.id} 
                        sx={{ 
                          p: 4,
                          borderRadius: '20px',
                          bgcolor: '#ffffff',
                          border: '1px solid #f1f5f9',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                          transition: 'all 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15)',
                          }
                        }}
                      >
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'flex-start', 
                          mb: 3,
                          flexDirection: isMobile ? 'column' : 'row',
                          gap: isMobile ? 2 : 0,
                        }}>
                          <Typography 
                            variant="h5" 
                            sx={{ 
                              fontWeight: 700,
                              fontFamily: '"Prompt", sans-serif',
                              color: '#1e293b',
                              background: `linear-gradient(135deg, ${colors.primary.golden} 0%, ${colors.secondary.fresh} 100%)`,
                              backgroundClip: 'text',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }}
                          >
                            🏪 {restaurant.name}
                          </Typography>
                          
                          <Box sx={{ 
                            display: 'flex', 
                            gap: 1,
                            flexDirection: isMobile ? 'column' : 'row',
                            width: isMobile ? '100%' : 'auto',
                          }}>
                            <Button
                              variant="contained"
                              onClick={() => handleViewRestaurant(restaurant)}
                              disabled={loading}
                              startIcon={<Visibility />}
                              sx={{
                                bgcolor: colors.primary.golden,
                                color: colors.neutral.white,
                                fontFamily: '"Prompt", sans-serif',
                                fontWeight: 600,
                                borderRadius: '12px',
                                px: 3,
                                py: 1.5,
                                flex: isMobile ? 1 : 'auto',
                                '&:hover': {
                                  bgcolor: colors.primary.darkGolden,
                                  transform: 'scale(1.02)',
                                },
                                transition: 'all 0.2s ease-in-out'
                              }}
                            >
                              ดูรายละเอียด
                            </Button>
                            
                            <Button
                              variant="contained"
                              onClick={() => handleApproveRestaurant(restaurant.id)}
                              disabled={loading}
                              startIcon={<CheckCircle />}
                              sx={{
                                background: `linear-gradient(135deg, ${colors.secondary.fresh} 0%, ${colors.secondary.darkFresh} 100%)`,
                                color: colors.neutral.white,
                                fontFamily: '"Prompt", sans-serif',
                                fontWeight: 600,
                                borderRadius: '12px',
                                px: 3,
                                py: 1.5,
                                flex: isMobile ? 1 : 'auto',
                                boxShadow: '0 4px 12px rgba(139, 197, 63, 0.3)',
                                '&:hover': {
                                  transform: 'scale(1.02)',
                                  boxShadow: '0 6px 16px rgba(139, 197, 63, 0.4)',
                                },
                                transition: 'all 0.2s ease-in-out'
                              }}
                            >
                              อนุมัติ
                            </Button>
                          </Box>
                        </Box>
                        
                        <Box sx={{ 
                          display: 'grid', 
                          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
                          gap: 3,
                          mb: 3 
                        }}>
                          <Box>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ 
                                fontWeight: 700, 
                                color: '#64748b',
                                fontFamily: '"Prompt", sans-serif',
                                mb: 1,
                                textTransform: 'uppercase',
                                fontSize: '0.8rem',
                                letterSpacing: '0.5px'
                              }}
                            >
                              📍 ข้อมูลร้าน
                            </Typography>
                            <Typography sx={{ 
                              fontFamily: '"Prompt", sans-serif', 
                              color: '#1e293b', 
                              mb: 0.5,
                              fontSize: '0.95rem'
                            }}>
                              <strong>เจ้าของ:</strong> {restaurant.owner}
                            </Typography>
                            <Typography sx={{ 
                              fontFamily: '"Prompt", sans-serif', 
                              color: '#64748b', 
                              mb: 0.5,
                              fontSize: '0.9rem'
                            }}>
                              📞 {restaurant.phone}
                            </Typography>
                            <Typography sx={{ 
                              fontFamily: '"Prompt", sans-serif', 
                              color: '#64748b',
                              fontSize: '0.9rem'
                            }}>
                              📧 {restaurant.email}
                            </Typography>
                          </Box>
                          
                          <Box>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ 
                                fontWeight: 700, 
                                color: '#64748b',
                                fontFamily: '"Prompt", sans-serif',
                                mb: 1,
                                textTransform: 'uppercase',
                                fontSize: '0.8rem',
                                letterSpacing: '0.5px'
                              }}
                            >
                              🏠 ที่อยู่
                            </Typography>
                            <Typography sx={{ 
                              fontFamily: '"Prompt", sans-serif', 
                              color: '#1e293b',
                              fontSize: '0.95rem',
                              lineHeight: 1.5
                            }}>
                              {restaurant.address}
                            </Typography>
                          </Box>
                        </Box>

                        {restaurant.description && (
                          <Box sx={{ mb: 3 }}>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ 
                                fontWeight: 700, 
                                color: '#64748b',
                                fontFamily: '"Prompt", sans-serif',
                                mb: 1,
                                textTransform: 'uppercase',
                                fontSize: '0.8rem',
                                letterSpacing: '0.5px'
                              }}
                            >
                              📝 รายละเอียด
                            </Typography>
                            <Typography sx={{ 
                              fontFamily: '"Prompt", sans-serif', 
                              color: '#64748b',
                              fontStyle: 'italic',
                              fontSize: '0.95rem',
                              lineHeight: 1.6,
                              p: 2,
                              bgcolor: '#f8fafc',
                              borderRadius: '12px',
                              border: '1px solid #f1f5f9'
                            }}>
                              "{restaurant.description}"
                            </Typography>
                          </Box>
                        )}

                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: 700, 
                            color: '#64748b',
                            fontFamily: '"Prompt", sans-serif',
                            mb: 2,
                            textTransform: 'uppercase',
                            fontSize: '0.8rem',
                            letterSpacing: '0.5px'
                          }}
                        >
                          📎 เอกสารประกอบ ({restaurant.documents.length} ไฟล์)
                        </Typography>
                        
                        <Box sx={{ 
                          display: 'grid', 
                          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                          gap: 2 
                        }}>
                          {restaurant.documents.map((doc) => (
                            <Paper
                              key={doc.id}
                              sx={{
                                p: 2,
                                bgcolor: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                  bgcolor: '#f1f5f9',
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                }
                              }}
                              onClick={() => handlePreviewFile(doc)}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ 
                                  fontSize: '2rem',
                                  color: getFileTypeColor(doc.type),
                                }}>
                                  {getFileIcon(doc.type)}
                                </Box>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                  <Typography sx={{ 
                                    fontFamily: '"Prompt", sans-serif', 
                                    fontWeight: 600,
                                    color: '#1e293b',
                                    fontSize: '0.9rem',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}>
                                    {doc.name}
                                  </Typography>
                                  <Typography sx={{ 
                                    fontFamily: '"Prompt", sans-serif', 
                                    color: '#64748b',
                                    fontSize: '0.8rem'
                                  }}>
                                    {formatFileSize(doc.size)}
                                  </Typography>
                                </Box>
                                <Box sx={{ 
                                  fontSize: '1.2rem',
                                  color: '#94a3b8'
                                }}>
                                  👁️
                                </Box>
                              </Box>
                            </Paper>
                          ))}
                        </Box>

                        <Box sx={{ 
                          mt: 3, 
                          pt: 3, 
                          borderTop: '1px solid #f1f5f9',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexDirection: isMobile ? 'column' : 'row',
                          gap: isMobile ? 2 : 0,
                        }}>
                          <Typography sx={{ 
                            fontFamily: '"Prompt", sans-serif', 
                            color: '#94a3b8',
                            fontSize: '0.85rem'
                          }}>
                            📅 ส่งคำขอเมื่อ: {formatDate(restaurant.submittedAt)}
                          </Typography>
                          
                          <Button
                            variant="outlined"
                            onClick={() => {
                              setSelectedRestaurant(restaurant);
                              setRejectDialogOpen(true);
                            }}
                            disabled={loading}
                            startIcon={<Cancel />}
                            sx={{
                              borderColor: colors.accent.warm,
                              color: colors.accent.warm,
                              fontFamily: '"Prompt", sans-serif',
                              fontWeight: 600,
                              borderRadius: '12px',
                              px: 3,
                              py: 1,
                              '&:hover': {
                                borderColor: colors.accent.darkWarm,
                                bgcolor: `${colors.accent.warm}10`,
                                transform: 'scale(1.02)',
                              },
                              transition: 'all 0.2s ease-in-out'
                            }}
                          >
                            ปฏิเสธ
                          </Button>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                )}
              </Box>
            </TabPanel>

            {/* Users Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ p: isMobile ? 3 : 4 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 4,
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: isMobile ? 2 : 0,
                }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700,
                      fontFamily: '"Prompt", sans-serif',
                      color: '#1e293b',
                      background: `linear-gradient(135deg, ${colors.primary.golden} 0%, ${colors.secondary.fresh} 100%)`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    👥 จัดการผู้ใช้งาน ({userTotal.toLocaleString()})
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2,
                    flexDirection: isMobile ? 'column' : 'row',
                    width: isMobile ? '100%' : 'auto',
                  }}>
                    <TextField
                      placeholder="ค้นหาผู้ใช้..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      size="small"
                      sx={{
                        minWidth: 200,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          bgcolor: '#ffffff',
                        }
                      }}
                      InputProps={{
                        startAdornment: <Search sx={{ color: '#94a3b8', mr: 1 }} />
                      }}
                    />
                    
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={userRole}
                        onChange={(e) => setUserRole(e.target.value)}
                        sx={{ borderRadius: '12px', bgcolor: '#ffffff' }}
                      >
                        <MenuItem value="all">ทุกบทบาท</MenuItem>
                        <MenuItem value="CUSTOMER">ลูกค้า</MenuItem>
                        <MenuItem value="RESTAURANT">ร้านอาหาร</MenuItem>
                        <MenuItem value="RIDER">ไรเดอร์</MenuItem>
                        <MenuItem value="ADMIN">ผู้ดูแลระบบ</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>

                {userLoading ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {[...Array(5)].map((_, index) => (
                      <Paper key={index} sx={{ 
                        p: 3, 
                        borderRadius: '16px',
                        bgcolor: '#ffffff',
                        border: '1px solid #f1f5f9',
                      }}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                          <Skeleton variant="circular" width={60} height={60} />
                          <Box sx={{ flex: 1 }}>
                            <Skeleton variant="text" width="40%" height={28} />
                            <Skeleton variant="text" width="60%" height={20} />
                            <Skeleton variant="text" width="30%" height={20} />
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
                            <Skeleton variant="rectangular" width={60} height={32} sx={{ borderRadius: 1 }} />
                          </Box>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                ) : users.length === 0 ? (
                  <Paper sx={{
                    p: 4,
                    borderRadius: '20px',
                    bgcolor: '#ffffff',
                    border: '1px solid #f1f5f9',
                    textAlign: 'center',
                    minHeight: '300px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Box>
                      <People sx={{ fontSize: 80, color: '#cbd5e1', mb: 2 }} />
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontFamily: '"Prompt", sans-serif',
                          color: '#64748b',
                          mb: 1,
                        }}
                      >
                        ไม่พบผู้ใช้งาน
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: '"Prompt", sans-serif',
                          color: '#94a3b8',
                        }}
                      >
                        ลองเปลี่ยนคำค้นหาหรือตัวกรอง
                      </Typography>
                    </Box>
                  </Paper>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {users.map((user) => (
                      <Paper 
                        key={user.id} 
                        sx={{ 
                          p: 3,
                          borderRadius: '16px',
                          bgcolor: '#ffffff',
                          border: '1px solid #f1f5f9',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                          }
                        }}
                      >
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          flexDirection: isMobile ? 'column' : 'row',
                          gap: isMobile ? 2 : 0,
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                            <Avatar 
                              src={user.avatar} 
                              sx={{ 
                                width: 60, 
                                height: 60,
                                bgcolor: colors.primary.golden 
                              }}
                            >
                              {user.fullName.charAt(0)}
                            </Avatar>
                            
                            <Box sx={{ flex: 1 }}>
                              <Typography sx={{ 
                                fontFamily: '"Prompt", sans-serif', 
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                color: '#1e293b',
                              }}>
                                {user.fullName}
                              </Typography>
                              
                              <Typography sx={{ 
                                fontFamily: '"Prompt", sans-serif', 
                                color: '#64748b', 
                                fontSize: '0.9rem',
                              }}>
                                📧 {user.email}
                              </Typography>
                              
                              {user.phone && (
                                <Typography sx={{ 
                                  fontFamily: '"Prompt", sans-serif', 
                                  color: '#64748b', 
                                  fontSize: '0.9rem',
                                }}>
                                  📞 {user.phone}
                                </Typography>
                              )}

                              <Box sx={{ display: 'flex', gap: 1, mt: 1, alignItems: 'center' }}>
                                <Chip 
                                  label={user.primaryRole === 'CUSTOMER' ? 'ลูกค้า' : 
                                        user.primaryRole === 'RESTAURANT' ? 'ร้านอาหาร' :
                                        user.primaryRole === 'RIDER' ? 'ไรเดอร์' : 'ผู้ดูแลระบบ'} 
                                  color={user.primaryRole === 'ADMIN' ? 'error' : 'primary'}
                                  size="small"
                                  sx={{ fontFamily: '"Prompt", sans-serif', fontWeight: 500 }}
                                />
                                
                                <Chip 
                                  label={user.status === 'ACTIVE' ? 'ใช้งาน' : 'ปิดใช้งาน'} 
                                  color={user.status === 'ACTIVE' ? 'success' : 'default'}
                                  size="small"
                                  sx={{ fontFamily: '"Prompt", sans-serif', fontWeight: 500 }}
                                />

                                {user.orderCount > 0 && (
                                  <Chip 
                                    label={`${user.orderCount} ออเดอร์`} 
                                    color="secondary"
                                    size="small"
                                    sx={{ fontFamily: '"Prompt", sans-serif', fontWeight: 500 }}
                                  />
                                )}
                              </Box>
                            </Box>
                          </Box>
                          
                          <Box sx={{ 
                            display: 'flex', 
                            gap: 1,
                            flexDirection: isMobile ? 'row' : 'row',
                            width: isMobile ? '100%' : 'auto',
                          }}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => {
                                setSelectedUser(user);
                                setUserEditDialog(true);
                              }}
                              sx={{
                                borderColor: colors.primary.golden,
                                color: colors.primary.golden,
                                fontFamily: '"Prompt", sans-serif',
                                fontWeight: 600,
                                borderRadius: '8px',
                                flex: isMobile ? 1 : 'auto',
                                '&:hover': {
                                  borderColor: colors.primary.golden,
                                  bgcolor: `${colors.primary.golden}10`,
                                },
                              }}
                            >
                              แก้ไข
                            </Button>
                            
                            <Button
                              variant={user.status === 'ACTIVE' ? 'outlined' : 'contained'}
                              size="small"
                              color={user.status === 'ACTIVE' ? 'error' : 'success'}
                              onClick={() => handleToggleUserStatus(user)}
                              disabled={userLoading}
                              sx={{
                                fontFamily: '"Prompt", sans-serif',
                                fontWeight: 600,
                                borderRadius: '8px',
                                flex: isMobile ? 1 : 'auto',
                              }}
                            >
                              {user.status === 'ACTIVE' ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}
                            </Button>
                          </Box>
                        </Box>
                      </Paper>
                    ))}
                    
                    {/* Pagination */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                      <Pagination 
                        count={Math.ceil(userTotal / 10)}
                        page={userPage}
                        onChange={(_, page) => setUserPage(page)}
                        color="primary"
                        sx={{
                          '& .MuiPaginationItem-root': {
                            fontFamily: '"Prompt", sans-serif',
                          }
                        }}
                      />
                    </Box>
                  </Box>
                )}
              </Box>
            </TabPanel>

            {/* Restaurant Management Tab */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ p: isMobile ? 3 : 4 }}>
                <Typography 
                  variant="h4" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 700,
                    fontFamily: '"Prompt", sans-serif',
                    color: '#1e293b',
                    mb: 4,
                    background: `linear-gradient(135deg, ${colors.primary.golden} 0%, ${colors.secondary.fresh} 100%)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textAlign: isMobile ? 'center' : 'left',
                  }}
                >
                  🏪 ร้านอาหารที่ให้บริการ ({approvedRestaurants.length})
                </Typography>

                {isLoading ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {[...Array(3)].map((_, index) => (
                      <Paper key={index} sx={{ 
                        p: 3, 
                        borderRadius: '16px',
                        bgcolor: '#ffffff',
                        border: '1px solid #f1f5f9',
                      }}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                          <Skeleton variant="circular" width={60} height={60} />
                          <Box sx={{ flex: 1 }}>
                            <Skeleton variant="text" width="60%" height={32} />
                            <Skeleton variant="text" width="40%" height={24} />
                            <Skeleton variant="text" width="80%" height={20} />
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
                            <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
                          </Box>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                ) : (
                  renderResponsiveTable(
                    approvedRestaurants,
                    ['ร้านอาหาร', 'เจ้าของ', 'สถานะ', 'คะแนน', 'ยอดขาย'],
                    (restaurant) => {
                      if (isMobile) {
                        return (
                          <Card sx={{ 
                            mb: 2,
                            borderRadius: '16px',
                            border: '1px solid #f1f5f9',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                            }
                          }}>
                            <CardContent sx={{ p: 3 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Typography sx={{ 
                                  fontFamily: '"Prompt", sans-serif', 
                                  fontWeight: 700,
                                  fontSize: '1.1rem',
                                  color: '#1e293b',
                                }}>
                                  🏪 {restaurant.name}
                                </Typography>
                                <Chip 
                                  label={restaurant.isOpen ? 'เปิดให้บริการ' : 'ปิดชั่วคราว'} 
                                  color={restaurant.isOpen ? 'success' : 'default'}
                                  size="small"
                                  sx={{ fontFamily: '"Prompt", sans-serif', fontWeight: 500 }}
                                />
                              </Box>
                              
                              <Typography sx={{ 
                                fontFamily: '"Prompt", sans-serif', 
                                color: '#64748b', 
                                mb: 1,
                                fontSize: '0.9rem',
                              }}>
                                👤 เจ้าของ: {restaurant.owner}
                              </Typography>
                              
                              <Typography sx={{ 
                                fontFamily: '"Prompt", sans-serif', 
                                color: '#64748b', 
                                mb: 2,
                                fontSize: '0.9rem',
                              }}>
                                📧 {restaurant.ownerEmail}
                              </Typography>

                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Typography sx={{ fontWeight: 600, color: colors.primary.golden }}>
                                    ⭐ {restaurant.rating.toFixed(1)}
                                  </Typography>
                                </Box>
                                <Typography sx={{ 
                                  fontFamily: '"Prompt", sans-serif', 
                                  fontWeight: 600, 
                                  color: colors.secondary.fresh,
                                  fontSize: '0.9rem',
                                }}>
                                  💰 ฿{restaurant.stats.totalRevenue.toLocaleString()}
                                </Typography>
                              </Box>
                              
                              <Box sx={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(3, 1fr)', 
                                gap: 1, 
                                mt: 2,
                                p: 2,
                                bgcolor: '#f8fafc',
                                borderRadius: '12px',
                              }}>
                                <Box sx={{ textAlign: 'center' }}>
                                  <Typography sx={{ fontWeight: 700, color: colors.primary.golden, fontSize: '1rem' }}>
                                    {restaurant.stats.totalOrders}
                                  </Typography>
                                  <Typography sx={{ fontSize: '0.75rem', color: '#64748b', fontFamily: '"Prompt", sans-serif' }}>
                                    ออเดอร์
                                  </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'center' }}>
                                  <Typography sx={{ fontWeight: 700, color: colors.secondary.fresh, fontSize: '1rem' }}>
                                    {restaurant.stats.totalMenuItems}
                                  </Typography>
                                  <Typography sx={{ fontSize: '0.75rem', color: '#64748b', fontFamily: '"Prompt", sans-serif' }}>
                                    เมนู
                                  </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'center' }}>
                                  <Typography sx={{ fontWeight: 700, color: colors.accent.warm, fontSize: '1rem' }}>
                                    {restaurant.stats.availableMenuItems}
                                  </Typography>
                                  <Typography sx={{ fontSize: '0.75rem', color: '#64748b', fontFamily: '"Prompt", sans-serif' }}>
                                    พร้อมขาย
                                  </Typography>
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        );
                      }
                      
                      return (
                        <TableRow 
                          key={restaurant.id}
                          sx={{
                            '&:hover': {
                              bgcolor: '#f8fafc',
                            }
                          }}
                        >
                          <TableCell sx={{ fontFamily: '"Prompt", sans-serif', borderBottom: '1px solid #f1f5f9' }}>
                            <Box>
                              <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>
                                {restaurant.name}
                              </Typography>
                              <Typography sx={{ fontSize: '0.875rem', color: '#64748b' }}>
                                {restaurant.address}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ fontFamily: '"Prompt", sans-serif', borderBottom: '1px solid #f1f5f9' }}>
                            <Box>
                              <Typography sx={{ fontWeight: 500, color: '#1e293b' }}>
                                {restaurant.owner}
                              </Typography>
                              <Typography sx={{ fontSize: '0.875rem', color: '#64748b' }}>
                                {restaurant.ownerEmail}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>
                            <Chip 
                              label={restaurant.isOpen ? 'เปิดให้บริการ' : 'ปิดชั่วคราว'} 
                              color={restaurant.isOpen ? 'success' : 'default'}
                              size="small"
                              sx={{ fontFamily: '"Prompt", sans-serif', fontWeight: 500 }}
                            />
                          </TableCell>
                          <TableCell sx={{ fontFamily: '"Prompt", sans-serif', borderBottom: '1px solid #f1f5f9' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Typography sx={{ fontWeight: 600, color: colors.primary.golden }}>
                                ⭐ {restaurant.rating.toFixed(1)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ fontFamily: '"Prompt", sans-serif', borderBottom: '1px solid #f1f5f9' }}>
                            <Typography sx={{ fontWeight: 600, color: colors.secondary.fresh }}>
                              ฿{restaurant.stats.totalRevenue.toLocaleString()}
                            </Typography>
                            <Typography sx={{ fontSize: '0.875rem', color: '#64748b' }}>
                              ({restaurant.stats.totalOrders} ออเดอร์)
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )
                )}
              </Box>
            </TabPanel>

            {/* Riders Tab */}
            <TabPanel value={tabValue} index={3}>
              <Box sx={{ p: isMobile ? 3 : 4 }}>
                <Typography 
                  variant="h4" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 700,
                    fontFamily: '"Prompt", sans-serif',
                    color: '#1e293b',
                    mb: 4,
                    background: `linear-gradient(135deg, ${colors.primary.golden} 0%, ${colors.secondary.fresh} 100%)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textAlign: isMobile ? 'center' : 'left',
                  }}
                >
                  🚲 จัดการไรเดอร์
                </Typography>
                
                <Paper sx={{
                  p: 4,
                  borderRadius: '20px',
                  bgcolor: '#ffffff',
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  textAlign: 'center',
                  minHeight: '400px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Box>
                    <TwoWheeler sx={{ fontSize: 80, color: '#cbd5e1', mb: 2 }} />
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontFamily: '"Prompt", sans-serif',
                        color: '#64748b',
                        mb: 1,
                      }}
                    >
                      ระบบจัดการไรเดอร์
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: '"Prompt", sans-serif',
                        color: '#94a3b8',
                      }}
                    >
                      ฟีเจอร์นี้กำลังพัฒนา
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </TabPanel>
          </Paper>
        </Container>

        {/* Dialogs */}
        <Dialog 
          open={dialogOpen} 
          onClose={() => setDialogOpen(false)}
          maxWidth={isMobile ? false : "md"}
          fullWidth={!isMobile}
          fullScreen={isMobile}
          PaperProps={{
            sx: {
              borderRadius: isMobile ? 0 : 3,
              boxShadow: `0 8px 32px ${colors.neutral.gray}20`,
            }
          }}
        >
          {selectedRestaurant && (
            <>
              <DialogTitle sx={{ 
                bgcolor: colors.neutral.lightGray,
                borderBottom: `1px solid ${colors.neutral.lightGray}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                pr: 1,
              }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 'bold',
                    fontFamily: '"Prompt", sans-serif',
                    color: colors.neutral.darkGray,
                  }}
                >
                  รายละเอียด: {selectedRestaurant.name}
                </Typography>
                <IconButton 
                  onClick={() => setDialogOpen(false)}
                  sx={{ 
                    color: colors.neutral.gray,
                    '&:hover': {
                      bgcolor: `${colors.neutral.gray}10`,
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>
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
                          <Box sx={{ 
                            display: 'flex', 
                            flexDirection: isMobile ? 'column' : 'row',
                            gap: isMobile ? 2 : 3, 
                            alignItems: isMobile ? 'center' : 'flex-start' 
                          }}>
                            {/* File Preview */}
                            {renderFilePreview(doc)}
                            
                            {/* File Info */}
                            <Box sx={{ flex: 1, width: isMobile ? '100%' : 'auto' }}>
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
                              <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'row',
                                gap: 2,
                                width: '100%',
                              }}>
                                                                  {/* Preview Button for Images */}
                                  {doc.type.startsWith('image/') && (
                                    <Button
                                      variant="outlined"
                                      size={isMobile ? "medium" : "small"}
                                      onClick={() => handlePreviewFile(doc)}
                                      sx={{
                                        flex: 1,
                                        borderColor: colors.secondary.fresh,
                                        color: colors.secondary.fresh,
                                        fontFamily: '"Prompt", sans-serif',
                                        textTransform: 'none',
                                        borderRadius: 2,
                                        px: 2,
                                        py: isMobile ? 1.5 : undefined,
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
                                    size={isMobile ? "medium" : "small"}
                                    onClick={() => handleDownloadFile(doc)}
                                    sx={{
                                      flex: 1,
                                      borderColor: colors.primary.golden,
                                      color: colors.primary.golden,
                                      fontFamily: '"Prompt", sans-serif',
                                      textTransform: 'none',
                                      borderRadius: 2,
                                      px: 2,
                                      py: isMobile ? 1.5 : undefined,
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
              <DialogActions sx={{ 
                p: 3, 
                bgcolor: colors.neutral.lightGray,
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? 2 : 1,
              }}>
                <Button 
                  onClick={() => setRejectDialogOpen(true)}
                  variant="outlined"
                  fullWidth={isMobile}
                  sx={{
                    borderColor: colors.accent.warm,
                    color: colors.accent.warm,
                    fontFamily: '"Prompt", sans-serif',
                    py: isMobile ? 1.5 : undefined,
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
                  fullWidth={isMobile}
                  sx={{
                    bgcolor: colors.secondary.fresh,
                    color: colors.neutral.white,
                    fontFamily: '"Prompt", sans-serif',
                    py: isMobile ? 1.5 : undefined,
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
          maxWidth={isMobile ? false : "sm"}
          fullWidth={!isMobile}
          fullScreen={isMobile}
          PaperProps={{
            sx: {
              borderRadius: isMobile ? 0 : 3,
              boxShadow: `0 8px 32px ${colors.neutral.gray}20`,
            }
          }}
        >
          <DialogTitle sx={{ 
            bgcolor: colors.neutral.lightGray,
            borderBottom: `1px solid ${colors.neutral.lightGray}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pr: 1,
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
            <IconButton 
              onClick={() => setRejectDialogOpen(false)}
              sx={{ 
                color: colors.neutral.gray,
                '&:hover': {
                  bgcolor: `${colors.neutral.gray}10`,
                },
              }}
            >
              <CloseIcon />
            </IconButton>
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
          <DialogActions sx={{ 
            p: 3, 
            bgcolor: colors.neutral.lightGray,
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 2 : 1,
          }}>
            <Button 
              onClick={() => setRejectDialogOpen(false)}
              fullWidth={isMobile}
              sx={{
                color: colors.neutral.gray,
                fontFamily: '"Prompt", sans-serif',
                py: isMobile ? 1.5 : undefined,
              }}
              disabled={loading}
            >
              ยกเลิก
            </Button>
            <Button 
              onClick={handleRejectRestaurant}
              variant="contained"
              fullWidth={isMobile}
              sx={{
                bgcolor: colors.accent.warm,
                color: colors.neutral.white,
                fontFamily: '"Prompt", sans-serif',
                py: isMobile ? 1.5 : undefined,
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
          maxWidth={isMobile ? false : "md"}
          fullWidth={!isMobile}
          fullScreen={isMobile}
          PaperProps={{
            sx: {
              borderRadius: isMobile ? 0 : 3,
              boxShadow: `0 8px 32px ${colors.neutral.gray}20`,
              maxHeight: isMobile ? '100vh' : '90vh',
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
                      onClick={() => selectedFile && handleDownloadFile(selectedFile)}
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