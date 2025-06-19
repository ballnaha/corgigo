'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Avatar,
  IconButton,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Link
} from '@mui/material';
import {
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Restaurant as RestaurantIcon,
  Domain as DomainIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { ThaiDateDisplay } from '@/components/ThaiDateDisplay';

interface Restaurant {
  id: string;
  name: string;
  description?: string;
  address: string;
  phone?: string;
  avatarUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  subdomain?: string;
  customDomain?: string;
  isActive: boolean;
  isSuspended: boolean;
  suspendedAt?: string;
  suspendReason?: string;
  themePrimaryColor: string;
  createdAt: string;
  owner: {
    name: string;
    email: string;
  };
}

interface SuspendDialogProps {
  open: boolean;
  restaurant: Restaurant | null;
  onClose: () => void;
  onConfirm: (restaurantId: string, reason: string) => void;
}

function SuspendDialog({ open, restaurant, onClose, onConfirm }: SuspendDialogProps) {
  const [reason, setReason] = useState('');
  const [suspendType, setSuspendType] = useState('POLICY_VIOLATION');

  const suspendReasons = [
    { value: 'POLICY_VIOLATION', label: 'การละเมิดนโยบาย' },
    { value: 'PAYMENT_ISSUES', label: 'ปัญหาการชำระเงิน' },
    { value: 'QUALITY_CONCERNS', label: 'ปัญหาคุณภาพอาหาร' },
    { value: 'CUSTOMER_COMPLAINTS', label: 'ข้อร้องเรียนจากลูกค้า' },
    { value: 'LEGAL_ISSUES', label: 'ปัญหาทางกฎหมาย' },
    { value: 'ADMIN_REQUEST', label: 'คำสั่งจากผู้ดูแลระบบ' },
    { value: 'OTHER', label: 'อื่นๆ' }
  ];

  const handleSubmit = () => {
    if (!restaurant || !reason.trim()) return;
    onConfirm(restaurant.id, reason);
    setReason('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>ระงับร้านอาหาร: {restaurant?.name}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>ประเภทการระงับ</InputLabel>
            <Select
              value={suspendType}
              label="ประเภทการระงับ"
              onChange={(e) => setSuspendType(e.target.value)}
            >
              {suspendReasons.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="เหตุผลในการระงับ"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="โปรดระบุเหตุผลอย่างละเอียด..."
            required
          />

          <Alert severity="warning" sx={{ mt: 2 }}>
            การระงับร้านจะทำให้ลูกค้าไม่สามารถเข้าถึงหน้าร้านได้ และเจ้าของร้านจะได้รับการแจ้งเตือน
          </Alert>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>ยกเลิก</Button>
        <Button 
          onClick={handleSubmit} 
          color="error" 
          variant="contained"
          disabled={!reason.trim()}
        >
          ระงับร้าน
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function RestaurantManagement() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [suspendDialog, setSuspendDialog] = useState<{
    open: boolean;
    restaurant: Restaurant | null;
  }>({ open: false, restaurant: null });
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({ open: false, message: '', severity: 'success' });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Load restaurants
  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/restaurants/manage');
      if (response.ok) {
        const data = await response.json();
        setRestaurants(data.restaurants || []);
      }
    } catch (error) {
      console.error('Error loading restaurants:', error);
      showSnackbar('เกิดข้อผิดพลาดในการโหลดข้อมูลร้าน', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSuspendRestaurant = async (restaurantId: string, reason: string) => {
    try {
      const response = await fetch('/api/admin/restaurants/suspend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurantId, reason })
      });

      if (response.ok) {
        showSnackbar('ระงับร้านสำเร็จ', 'success');
        loadRestaurants(); // Reload data
      } else {
        const error = await response.json();
        showSnackbar(error.error || 'เกิดข้อผิดพลาดในการระงับร้าน', 'error');
      }
    } catch (error) {
      console.error('Error suspending restaurant:', error);
      showSnackbar('เกิดข้อผิดพลาดในการระงับร้าน', 'error');
    }
  };

  const handleUnsuspendRestaurant = async (restaurantId: string) => {
    try {
      const response = await fetch('/api/admin/restaurants/suspend', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurantId, note: 'เปิดใช้งานโดยผู้ดูแลระบบ' })
      });

      if (response.ok) {
        showSnackbar('เปิดใช้งานร้านสำเร็จ', 'success');
        loadRestaurants(); // Reload data
      } else {
        const error = await response.json();
        showSnackbar(error.error || 'เกิดข้อผิดพลาดในการเปิดใช้งานร้าน', 'error');
      }
    } catch (error) {
      console.error('Error unsuspending restaurant:', error);
      showSnackbar('เกิดข้อผิดพลาดในการเปิดใช้งานร้าน', 'error');
    }
  };

  // Filter restaurants based on tab, search, and status
  const filteredRestaurants = restaurants.filter(restaurant => {
    // Tab filter
    switch (selectedTab) {
      case 0: // All
        break;
      case 1: // Active
        if (!restaurant.isActive || restaurant.isSuspended) return false;
        break;
      case 2: // Suspended
        if (!restaurant.isSuspended) return false;
        break;
      case 3: // Pending
        if (restaurant.status !== 'PENDING') return false;
        break;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !restaurant.name.toLowerCase().includes(query) &&
        !restaurant.owner.email.toLowerCase().includes(query) &&
        !restaurant.subdomain?.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    // Status filter
    if (statusFilter !== 'ALL' && restaurant.status !== statusFilter) {
      return false;
    }

    return true;
  });

  const getStatusColor = (restaurant: Restaurant) => {
    if (restaurant.isSuspended) return 'error';
    switch (restaurant.status) {
      case 'APPROVED': return 'success';
      case 'PENDING': return 'warning';
      case 'REJECTED': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (restaurant: Restaurant) => {
    if (restaurant.isSuspended) return 'ระงับ';
    switch (restaurant.status) {
      case 'APPROVED': return 'อนุมัติ';
      case 'PENDING': return 'รออนุมัติ';
      case 'REJECTED': return 'ปฏิเสธ';
      default: return restaurant.status;
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        จัดการร้านอาหาร
      </Typography>

      {/* Search and Filter Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="ค้นหาร้าน, อีเมล, หรือ subdomain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>สถานะ</InputLabel>
                <Select
                  value={statusFilter}
                  label="สถานะ"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="ALL">ทั้งหมด</MenuItem>
                  <MenuItem value="PENDING">รออนุมัติ</MenuItem>
                  <MenuItem value="APPROVED">อนุมัติแล้ว</MenuItem>
                  <MenuItem value="REJECTED">ปฏิเสธ</MenuItem>
                  <MenuItem value="SUSPENDED">ระงับ</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={loadRestaurants}
                fullWidth
              >
                รีเฟรช
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Status Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
          <Tab label={`ทั้งหมด (${restaurants.length})`} />
          <Tab label={`ใช้งาน (${restaurants.filter(r => r.isActive && !r.isSuspended).length})`} />
          <Tab label={`ระงับ (${restaurants.filter(r => r.isSuspended).length})`} />
          <Tab label={`รออนุมัติ (${restaurants.filter(r => r.status === 'PENDING').length})`} />
        </Tabs>
      </Box>

      {/* Restaurants Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ร้านอาหาร</TableCell>
              <TableCell>เจ้าของ</TableCell>
              <TableCell>สถานะ</TableCell>
              <TableCell>Subdomain</TableCell>
              <TableCell>วันที่สร้าง</TableCell>
              <TableCell align="center">การจัดการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRestaurants.map((restaurant) => (
              <TableRow key={restaurant.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={restaurant.avatarUrl}
                      sx={{ bgcolor: restaurant.themePrimaryColor }}
                    >
                      <RestaurantIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {restaurant.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {restaurant.address}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Box>
                    <Typography variant="body2">{restaurant.owner.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {restaurant.owner.email}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>
                  <Chip
                    label={getStatusText(restaurant)}
                    color={getStatusColor(restaurant)}
                    size="small"
                  />
                  {restaurant.isSuspended && restaurant.suspendedAt && (
                    <Typography variant="caption" display="block" color="text.secondary">
                      <ThaiDateDisplay date={restaurant.suspendedAt} />
                    </Typography>
                  )}
                </TableCell>

                <TableCell>
                  {restaurant.subdomain ? (
                    <Link
                      href={`https://${restaurant.subdomain}.corgigo.com`}
                      target="_blank"
                      rel="noopener"
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                    >
                      <DomainIcon fontSize="small" />
                      {restaurant.subdomain}
                    </Link>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      ไม่มี subdomain
                    </Typography>
                  )}
                </TableCell>

                <TableCell>
                  <ThaiDateDisplay date={restaurant.createdAt} />
                </TableCell>

                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {/* View Restaurant Button */}
                    <IconButton
                      size="small"
                      title="ดูร้าน"
                      href={restaurant.subdomain ? `/restaurant/tenant/${restaurant.subdomain}` : '#'}
                      target="_blank"
                      disabled={!restaurant.subdomain || restaurant.isSuspended}
                    >
                      <VisibilityIcon />
                    </IconButton>

                    {/* Suspend/Unsuspend Button */}
                    {restaurant.isSuspended ? (
                      <IconButton
                        size="small"
                        color="success"
                        title="เปิดใช้งาน"
                        onClick={() => handleUnsuspendRestaurant(restaurant.id)}
                      >
                        <CheckCircleIcon />
                      </IconButton>
                    ) : (
                      <IconButton
                        size="small"
                        color="error"
                        title="ระงับร้าน"
                        onClick={() => setSuspendDialog({ open: true, restaurant })}
                        disabled={restaurant.status !== 'APPROVED'}
                      >
                        <BlockIcon />
                      </IconButton>
                    )}

                    {/* Edit Restaurant Button */}
                    <IconButton
                      size="small"
                      title="แก้ไข"
                      href={`/admin/restaurants/${restaurant.id}`}
                    >
                      <EditIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredRestaurants.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            ไม่พบร้านอาหารที่ตรงกับเงื่อนไข
          </Typography>
        </Box>
      )}

      {/* Suspend Dialog */}
      <SuspendDialog
        open={suspendDialog.open}
        restaurant={suspendDialog.restaurant}
        onClose={() => setSuspendDialog({ open: false, restaurant: null })}
        onConfirm={handleSuspendRestaurant}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 