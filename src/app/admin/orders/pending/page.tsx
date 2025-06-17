'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  LinearProgress,
  TextField,
  InputAdornment,
  Stack,
  useTheme,
  useMediaQuery,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';
import {
  Search,
  Visibility,
  Check,
  Close,
  AccessTime,
  Restaurant,
  Person,
  Phone,
  LocationOn,
  AttachMoney,
} from '@mui/icons-material';

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

export default function PendingOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Generate mock pending orders data
  const generatePendingOrders = () => {
    const customerNames = ['สมชาย มานะดี', 'สุดา ใจดี', 'นิรันดร์ สวยงาม', 'อรุณี แสงแก้ว', 'ประเสริฐ ดีมาก'];
    const restaurantNames = ['ร้านข้าวผัดป้าหนู', 'ส้มตำลาบอีสาน', 'ก๋วยเตี๋ยวเรือ', 'ไก่ทอดแม่นาง', 'ข้าวหมูแดงป๊ะป๋า'];
    const menuItems = ['ผัดไทยกุ้งใหญ่', 'ต้มยำกุ้งน้ำข้น', 'แกงเขียวหวานไก่', 'ส้มตำไทย', 'ลาบหมูสับ'];
    
    const orders = [];
    for (let i = 1; i <= 12; i++) {
      const orderTime = new Date(Date.now() - Math.random() * 3600000).toISOString(); // Within last hour
      const itemCount = Math.floor(Math.random() * 4) + 1; // 1-4 items
      const totalAmount = Math.floor(Math.random() * 300) + 150; // 150-450 baht
      
      orders.push({
        id: `ORDER-${Date.now()}-${i}`,
        orderNumber: `#${String(12340 + i).padStart(6, '0')}`,
        customer: {
          name: customerNames[i % customerNames.length],
          phone: `08${String(Math.floor(Math.random() * 90000000) + 10000000)}`,
          address: `${Math.floor(Math.random() * 999) + 1} หมู่ ${Math.floor(Math.random() * 12) + 1} ต.ในเมือง อ.เมือง จ.ขอนแก่น 40000`
        },
        restaurant: {
          name: restaurantNames[i % restaurantNames.length],
          phone: `08${String(Math.floor(Math.random() * 90000000) + 10000000)}`,
          image: null
        },
        items: Array.from({ length: itemCount }, (_, j) => ({
          name: menuItems[(i + j) % menuItems.length],
          quantity: Math.floor(Math.random() * 3) + 1,
          price: Math.floor(Math.random() * 100) + 50
        })),
        totalAmount,
        orderTime,
        waitingTime: Math.floor((Date.now() - new Date(orderTime).getTime()) / 60000), // minutes
        paymentMethod: Math.random() > 0.5 ? 'โอนเงิน' : 'เงินสด',
        notes: Math.random() > 0.7 ? 'ไม่ใส่ผักชี, เผ็ดน้อย' : '',
        urgency: Math.random() > 0.8 ? 'ด่วน' : 'ปกติ'
      });
    }
    
    return orders.sort((a, b) => new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime());
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setPendingOrders(generatePendingOrders());
      setLoading(false);
    }, 500);
  }, []);

  // Filter orders based on search term
  const filteredOrders = pendingOrders.filter(order => 
    order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.restaurant?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleApproveOrder = (orderId: string) => {
    setPendingOrders(prev => prev.filter(order => order.id !== orderId));
  };

  const handleRejectOrder = (orderId: string) => {
    setPendingOrders(prev => prev.filter(order => order.id !== orderId));
  };

  if (loading) {
    return (
      <Box sx={{ fontFamily: vristoTheme.font.family }}>
        <Typography variant="h4" fontWeight="600" gutterBottom>
          ออเดอร์รอยืนยัน
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ fontFamily: vristoTheme.font.family }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="600">
          ออเดอร์รอยืนยัน ({filteredOrders.length} รายการ)
        </Typography>
        <Chip
          icon={<AccessTime />}
          label={`รอดำเนินการ ${filteredOrders.length} รายการ`}
          color="warning"
          variant="outlined"
        />
      </Box>

      <Card sx={{ boxShadow: vristoTheme.shadow.card, borderRadius: 2 }}>
        <CardContent>
          {/* Search */}
          <TextField
            fullWidth
            placeholder="ค้นหาเลขออเดอร์, ชื่อลูกค้า, ร้านอาหาร..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          {/* Table / Mobile Cards */}
          {isMobile ? (
            /* Mobile Card Layout */
            <Box sx={{ display: 'grid', gap: 2 }}>
              {filteredOrders.map((order) => (
                <Card key={order.id} variant="outlined" sx={{ 
                  p: 2,
                  transition: 'all 0.2s ease',
                  border: order.urgency === 'ด่วน' ? `2px solid ${vristoTheme.danger}` : undefined,
                  '&:hover': {
                    boxShadow: vristoTheme.shadow.elevated,
                    transform: 'translateY(-1px)'
                  }
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                      <Typography variant="body1" fontWeight="600">
                        {order.orderNumber}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.waitingTime} นาทีที่แล้ว
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {order.urgency === 'ด่วน' && (
                        <Chip label="ด่วน" color="error" size="small" />
                      )}
                      <Chip
                        label={order.paymentMethod}
                        color="info"
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                  
                  <Stack spacing={1.5}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="600">ลูกค้า</Typography>
                      <Typography variant="body2">{order.customer.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{order.customer.phone}</Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="600">ร้านอาหาร</Typography>
                      <Typography variant="body2">{order.restaurant.name}</Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="600">รายการ</Typography>
                      <Typography variant="body2">
                        {order.items.length} รายการ - ฿{order.totalAmount.toLocaleString()}
                      </Typography>
                    </Box>
                  </Stack>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    gap: 1, 
                    mt: 2,
                    pt: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider'
                  }}>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => handleViewOrder(order)}
                      sx={{ 
                        bgcolor: 'primary.light',
                        '&:hover': { bgcolor: 'primary.main', color: 'white' }
                      }}
                    >
                      <Visibility />
                    </IconButton>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        startIcon={<Check />}
                        onClick={() => handleApproveOrder(order.id)}
                      >
                        อนุมัติ
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<Close />}
                        onClick={() => handleRejectOrder(order.id)}
                      >
                        ปฏิเสธ
                      </Button>
                    </Box>
                  </Box>
                </Card>
              ))}
            </Box>
          ) : (
            /* Desktop Table Layout */
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>เลขออเดอร์</TableCell>
                    <TableCell>ลูกค้า</TableCell>
                    <TableCell>ร้านอาหาร</TableCell>
                    <TableCell align="center">รายการ</TableCell>
                    <TableCell align="right">ยอดรวม</TableCell>
                    <TableCell>เวลารอ</TableCell>
                    <TableCell>การชำระ</TableCell>
                    <TableCell align="center">การจัดการ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow 
                      key={order.id}
                      sx={{
                        bgcolor: order.urgency === 'ด่วน' ? `${vristoTheme.danger}08` : 'transparent'
                      }}
                    >
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="600">
                            {order.orderNumber}
                          </Typography>
                          {order.urgency === 'ด่วน' && (
                            <Chip label="ด่วน" color="error" size="small" />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="600">
                            {order.customer.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {order.customer.phone}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{order.restaurant.name}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight="600">
                          {order.items.length} รายการ
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="600" color="primary">
                          ฿{order.totalAmount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${order.waitingTime} นาที`}
                          color={order.waitingTime > 30 ? 'error' : order.waitingTime > 15 ? 'warning' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={order.paymentMethod}
                          color="info"
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="success"
                          onClick={() => handleApproveOrder(order.id)}
                        >
                          <Check />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleRejectOrder(order.id)}
                        >
                          <Close />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {filteredOrders.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                {searchTerm ? 'ไม่พบออเดอร์ที่ค้นหา' : 'ไม่มีออเดอร์รอยืนยัน'}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>รายละเอียดออเดอร์</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Stack spacing={3}>
              {/* Order Info */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight="600">
                    {selectedOrder.orderNumber}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {selectedOrder.urgency === 'ด่วน' && (
                      <Chip label="ออเดอร์ด่วน" color="error" />
                    )}
                    <Chip
                      label={`รอ ${selectedOrder.waitingTime} นาที`}
                      color="warning"
                    />
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  สั่งเมื่อ: {new Date(selectedOrder.orderTime).toLocaleString('th-TH')}
                </Typography>
              </Box>

              <Divider />

              {/* Customer Info */}
              <Box>
                <Typography variant="subtitle1" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person /> ข้อมูลลูกค้า
                </Typography>
                <Box sx={{ pl: 4 }}>
                  <Typography variant="body2" fontWeight="600">{selectedOrder.customer.name}</Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Phone sx={{ fontSize: 16 }} /> {selectedOrder.customer.phone}
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mt: 0.5 }}>
                    <LocationOn sx={{ fontSize: 16, mt: 0.2 }} /> {selectedOrder.customer.address}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              {/* Restaurant Info */}
              <Box>
                <Typography variant="subtitle1" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Restaurant /> ข้อมูลร้านอาหาร
                </Typography>
                <Box sx={{ pl: 4 }}>
                  <Typography variant="body2" fontWeight="600">{selectedOrder.restaurant.name}</Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Phone sx={{ fontSize: 16 }} /> {selectedOrder.restaurant.phone}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              {/* Order Items */}
              <Box>
                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                  รายการอาหาร
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>รายการ</TableCell>
                        <TableCell align="center">จำนวน</TableCell>
                        <TableCell align="right">ราคา</TableCell>
                        <TableCell align="right">รวม</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedOrder.items.map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell align="center">{item.quantity}</TableCell>
                          <TableCell align="right">฿{item.price}</TableCell>
                          <TableCell align="right">฿{(item.quantity * item.price).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} sx={{ fontWeight: 600 }}>ยอดรวมทั้งหมด</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, color: 'primary.main' }}>
                          ฿{selectedOrder.totalAmount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              {/* Payment & Notes */}
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" fontWeight="600">การชำระเงิน</Typography>
                    <Typography variant="body2">{selectedOrder.paymentMethod}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" fontWeight="600">หมายเหตุ</Typography>
                    <Typography variant="body2">{selectedOrder.notes || 'ไม่มี'}</Typography>
                  </Grid>
                </Grid>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>ปิด</Button>
          <Button 
            variant="outlined" 
            color="error" 
            startIcon={<Close />}
            onClick={() => {
              if (selectedOrder) {
                handleRejectOrder(selectedOrder.id);
                setOpenDialog(false);
              }
            }}
          >
            ปฏิเสธ
          </Button>
          <Button 
            variant="contained" 
            color="success" 
            startIcon={<Check />}
            onClick={() => {
              if (selectedOrder) {
                handleApproveOrder(selectedOrder.id);
                setOpenDialog(false);
              }
            }}
          >
            อนุมัติออเดอร์
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 