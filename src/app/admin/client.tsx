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

  const getStatusColor = (status: string) => {
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
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      {/* Header */}
      <AppBar position="fixed" sx={{ bgcolor: 'primary.main' }}>
        <Toolbar>
          <Dashboard sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            CorgiGo Admin
          </Typography>
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ pt: 8, pb: 4 }}>
        <Container maxWidth="lg" sx={{ mt: 2 }}>
          {/* Welcome Card */}
          <Card sx={{ mb: 3, bgcolor: 'primary.50' }}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                ยินดีต้อนรับสู่ระบบจัดการ CorgiGo
              </Typography>
              <Typography variant="body1" color="text.secondary">
                จัดการผู้ใช้งาน ร้านอาหาร และไรเดอร์ของคุณได้ที่นี่
              </Typography>
            </CardContent>
          </Card>

          {/* Statistics Cards */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <Paper sx={{ p: 2, minWidth: 200, textAlign: 'center' }}>
              <People sx={{ color: 'primary.main', fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.totalUsers.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ผู้ใช้ทั้งหมด
              </Typography>
            </Paper>
            <Paper sx={{ p: 2, minWidth: 200, textAlign: 'center' }}>
              <Restaurant sx={{ color: 'success.main', fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.totalRestaurants.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ร้านอาหาร
              </Typography>
            </Paper>
            <Paper sx={{ p: 2, minWidth: 200, textAlign: 'center' }}>
              <TwoWheeler sx={{ color: 'warning.main', fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.totalRiders.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ไรเดอร์
              </Typography>
            </Paper>
            <Paper sx={{ p: 2, minWidth: 200, textAlign: 'center' }}>
              <BarChart sx={{ color: 'info.main', fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.totalOrders.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                คำสั่งซื้อทั้งหมด
              </Typography>
            </Paper>
            <Paper sx={{ p: 2, minWidth: 200, textAlign: 'center', bgcolor: 'warning.50' }}>
              <Restaurant sx={{ color: 'warning.main', fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                {stats.pendingRestaurants}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                รอการอนุมัติ
              </Typography>
            </Paper>
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="คำสั่งซื้อล่าสุด" />
              <Tab label="ร้านอาหาร" />
              <Tab label="ไรเดอร์" />
              <Tab label="รอการอนุมัติ" />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              คำสั่งซื้อล่าสุด
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ลูกค้า</TableCell>
                    <TableCell>ร้านอาหาร</TableCell>
                    <TableCell>สถานะ</TableCell>
                    <TableCell>ยอดรวม</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.restaurant}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.status}
                          color={getStatusColor(order.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>฿{order.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              ร้านอาหารทั้งหมด
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ชื่อร้าน</TableCell>
                    <TableCell>เจ้าของ</TableCell>
                    <TableCell>สถานะ</TableCell>
                    <TableCell>ออเดอร์</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {restaurants.map((restaurant) => (
                    <TableRow key={restaurant.id}>
                      <TableCell>{restaurant.name}</TableCell>
                      <TableCell>{restaurant.owner}</TableCell>
                      <TableCell>
                        <Chip
                          label={restaurant.status}
                          color={getStatusColor(restaurant.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{restaurant.orders}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              ไรเดอร์ทั้งหมด
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ชื่อ</TableCell>
                    <TableCell>เบอร์โทร</TableCell>
                    <TableCell>สถานะ</TableCell>
                    <TableCell>การส่ง</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {riders.map((rider) => (
                    <TableRow key={rider.id}>
                      <TableCell>{rider.name}</TableCell>
                      <TableCell>{rider.phone}</TableCell>
                      <TableCell>
                        <Chip
                          label={rider.status}
                          color={getStatusColor(rider.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{rider.deliveries}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              ร้านอาหารรอการอนุมัติ ({pendingRestaurants.length})
            </Typography>
            {pendingRestaurants.length === 0 ? (
              <Box sx={{ 
                mt: 2, 
                p: 2, 
                bgcolor: '#e3f2fd', 
                borderRadius: 2, 
                border: '1px solid #bbdefb' 
              }}>
                <Typography color="primary">
                  ไม่มีร้านอาหารที่รอการอนุมัติ
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ชื่อร้าน</TableCell>
                      <TableCell>เจ้าของ</TableCell>
                      <TableCell>เบอร์โทร</TableCell>
                      <TableCell>วันที่สมัคร</TableCell>
                      <TableCell>การดำเนินการ</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingRestaurants.map((restaurant) => (
                      <TableRow key={restaurant.id}>
                        <TableCell>{restaurant.name}</TableCell>
                        <TableCell>{restaurant.owner}</TableCell>
                        <TableCell>{restaurant.phone}</TableCell>
                        <TableCell>{formatDate(restaurant.submittedAt)}</TableCell>
                        <TableCell>
                          <Button
                            startIcon={<Visibility />}
                            size="small"
                            onClick={() => handleViewRestaurant(restaurant)}
                            sx={{ mr: 1 }}
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
        </Container>
      </Box>

      {/* Restaurant Detail Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedRestaurant && (
          <>
            <DialogTitle>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                รายละเอียดร้าน: {selectedRestaurant.name}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  ข้อมูลเจ้าของร้าน
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>ชื่อ:</strong> {selectedRestaurant.owner}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>เบอร์โทร:</strong> {selectedRestaurant.phone}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>อีเมล:</strong> {selectedRestaurant.email}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  <strong>ที่อยู่:</strong> {selectedRestaurant.address}
                </Typography>

                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  รายละเอียดร้าน
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {selectedRestaurant.description}
                </Typography>

                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  เอกสารแนบ ({selectedRestaurant.documents.length})
                </Typography>
                {selectedRestaurant.documents.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                    {selectedRestaurant.documents.map((doc) => {
                      const isImage = doc.type.startsWith('image/');
                      const isPdf = doc.type === 'application/pdf';
                      const isWord = doc.type === 'application/msword' || doc.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                      const isExcel = doc.type === 'application/vnd.ms-excel' || doc.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                      
                      return (
                        <Box 
                          key={doc.id}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            p: 2,
                            border: '1px solid #e0e0e0',
                            borderRadius: 2,
                            bgcolor: '#fafafa',
                          }}
                        >
                          {isImage ? (
                            <Box
                              component="img"
                              src={doc.url}
                              alt={doc.name}
                              sx={{
                                width: 60,
                                height: 60,
                                borderRadius: 1,
                                objectFit: 'cover',
                                border: '2px solid #ddd',
                              }}
                            />
                          ) : (
                            <Box
                              sx={{
                                width: 60,
                                height: 60,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: isPdf ? '#f44336' : isWord ? '#2B579A' : isExcel ? '#217346' : '#2196f3',
                                borderRadius: 1,
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: 'bold',
                              }}
                            >
                              {isPdf ? 'PDF' : isWord ? 'DOC' : isExcel ? 'XLS' : 'FILE'}
                            </Box>
                          )}
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {doc.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {(doc.size / 1024 / 1024).toFixed(2)} MB • {new Date(doc.createdAt).toLocaleDateString('th-TH')}
                            </Typography>
                            <Box sx={{ mt: 0.5 }}>
                              <Chip
                                label={isImage ? 'รูปภาพ' : isPdf ? 'PDF' : isWord ? 'DOC' : isExcel ? 'XLS' : 'ไฟล์'}
                                size="small"
                                color={isImage ? 'success' : isPdf ? 'error' : isWord ? 'primary' : isExcel ? 'success' : 'default'}
                                variant="outlined"
                              />
                            </Box>
                          </Box>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => window.open(doc.url, '_blank')}
                          >
                            ดู
                          </Button>
                        </Box>
                      );
                    })}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    ไม่มีเอกสารแนบ
                  </Typography>
                )}

                <Typography variant="body2" color="text.secondary">
                  <strong>วันที่สมัคร:</strong> {formatDate(selectedRestaurant.submittedAt)}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button 
                onClick={() => setRejectDialogOpen(true)}
                color="error"
                variant="outlined"
                disabled={loading}
              >
                ปฏิเสธ
              </Button>
              <Button 
                onClick={() => handleApproveRestaurant(selectedRestaurant.id)}
                color="success"
                variant="contained"
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
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            ระบุเหตุผลในการปฏิเสธ
          </Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="ระบุเหตุผลในการปฏิเสธ..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setRejectDialogOpen(false)}
            disabled={loading}
          >
            ยกเลิก
          </Button>
          <Button 
            onClick={handleRejectRestaurant}
            color="error"
            variant="contained"
            disabled={loading || !rejectReason.trim()}
            startIcon={<Cancel />}
          >
            ปฏิเสธ
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
} 