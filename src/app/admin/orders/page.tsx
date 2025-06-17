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
} from '@mui/material';
import {
  Search,
  Visibility,
  LocalShipping,
  CheckCircle,
  Cancel,
  Pending,
  Restaurant,
  Person,
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

export default function OrdersPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Mock orders data (replace with real API when available)
  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API call
      const mockOrders = [
        {
          id: 'ord_001',
          orderNumber: '#ORD001',
          customer: { name: 'สมชาย ใจดี', email: 'somchai@email.com', avatar: null },
          restaurant: { name: 'ร้านอาหารไทยโบราณ', image: null },
          rider: { name: 'วิชาญ ขับดี', phone: '098-765-4321' },
          items: ['ผัดไทย', 'ต้มยำกุ้ง'],
          total: 245,
          status: 'DELIVERING',
          paymentStatus: 'PAID',
          createdAt: new Date().toISOString(),
          deliveryTime: '30-45 นาที'
        },
        {
          id: 'ord_002',
          orderNumber: '#ORD002',
          customer: { name: 'สมหญิง สวยงาม', email: 'somying@email.com', avatar: null },
          restaurant: { name: 'ร้านพิซซ่าอิตาเลียน', image: null },
          rider: null,
          items: ['พิซซ่าฮาวายเอี้ยน', 'สปาเก็ตตี้'],
          total: 420,
          status: 'PENDING',
          paymentStatus: 'PENDING',
          createdAt: new Date().toISOString(),
          deliveryTime: '45-60 นาที'
        },
        {
          id: 'ord_003',
          orderNumber: '#ORD003',
          customer: { name: 'นายหนึ่ง ชอบกิน', email: 'neung@email.com', avatar: null },
          restaurant: { name: 'ร้านซูชิญี่ปุ่น', image: null },
          rider: { name: 'สมศักดิ์ เร็วมาก', phone: '087-654-3210' },
          items: ['ซูชิเซ็ต', 'ซาชิมิ'],
          total: 680,
          status: 'COMPLETED',
          paymentStatus: 'PAID',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          deliveryTime: '20-30 นาที'
        }
      ];
      
      setOrders(mockOrders);
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders based on search term
  const filteredOrders = orders.filter(order =>
    order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.restaurant?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusChip = (status: string) => {
    const statusConfig = {
      PENDING: { label: 'รอยืนยัน', color: 'warning' as const, icon: <Pending /> },
      CONFIRMED: { label: 'ยืนยันแล้ว', color: 'info' as const, icon: <CheckCircle /> },
      PREPARING: { label: 'กำลังเตรียม', color: 'primary' as const, icon: <Restaurant /> },
      DELIVERING: { label: 'กำลังจัดส่ง', color: 'secondary' as const, icon: <LocalShipping /> },
      COMPLETED: { label: 'เสร็จสิ้น', color: 'success' as const, icon: <CheckCircle /> },
      CANCELLED: { label: 'ยกเลิก', color: 'error' as const, icon: <Cancel /> }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        icon={config.icon}
      />
    );
  };

  const getPaymentStatusChip = (status: string) => {
    return (
      <Chip
        label={status === 'PAID' ? 'ชำระแล้ว' : 'รอชำระ'}
        color={status === 'PAID' ? 'success' : 'warning'}
        size="small"
        variant="outlined"
      />
    );
  };

  if (loading) {
    return (
      <Box sx={{ fontFamily: vristoTheme.font.family }}>
        <Typography variant="h4" fontWeight="600" gutterBottom>
          จัดการออเดอร์
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ fontFamily: vristoTheme.font.family }}>
      <Typography variant="h4" fontWeight="600" gutterBottom>
        จัดการออเดอร์ ({orders.length} ออเดอร์)
      </Typography>

      <Card sx={{ boxShadow: vristoTheme.shadow.card, borderRadius: 2 }}>
        <CardContent>
          {/* Search */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="ค้นหาออเดอร์..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Table / Mobile Cards */}
          {isMobile ? (
            /* Mobile Card Layout */
            <Box sx={{ display: 'grid', gap: 2 }}>
              {filteredOrders.map((order) => (
                <Card key={order.id} variant="outlined" sx={{ 
                  p: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: vristoTheme.shadow.elevated,
                    transform: 'translateY(-1px)'
                  }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar 
                      src={order.customer.avatar} 
                      sx={{ width: 48, height: 48, bgcolor: vristoTheme.primary }}
                    >
                      {order.customer.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body1" fontWeight="600" sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {order.orderNumber}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.customer.name}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      {getStatusChip(order.status)}
                      <Typography variant="h6" fontWeight="600" color="primary" sx={{ mt: 0.5 }}>
                        ฿{order.total.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Stack spacing={1.5}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="600">ร้านอาหาร</Typography>
                      <Typography variant="body2">{order.restaurant.name}</Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="600">รายการอาหาร</Typography>
                      <Typography variant="body2">{order.items.join(', ')}</Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="600">การชำระเงิน</Typography>
                      {getPaymentStatusChip(order.paymentStatus)}
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="600">เวลาจัดส่ง</Typography>
                      <Typography variant="body2">{order.deliveryTime}</Typography>
                    </Box>
                  </Stack>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    gap: 1, 
                    mt: 2,
                    pt: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider'
                  }}>
                    <IconButton size="small" color="primary" sx={{ 
                      bgcolor: 'primary.light',
                      '&:hover': { bgcolor: 'primary.main', color: 'white' }
                    }}>
                      <Visibility />
                    </IconButton>
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
                    <TableCell>ออเดอร์</TableCell>
                    <TableCell>ลูกค้า</TableCell>
                    <TableCell>ร้านอาหาร</TableCell>
                    <TableCell>รายการ</TableCell>
                    <TableCell align="right">ยอดรวม</TableCell>
                    <TableCell>สถานะ</TableCell>
                    <TableCell>การชำระเงิน</TableCell>
                    <TableCell>เวลา</TableCell>
                    <TableCell align="center">การจัดการ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="600">
                          {order.orderNumber}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(order.createdAt).toLocaleDateString('th-TH')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar 
                            src={order.customer.avatar} 
                            sx={{ width: 32, height: 32 }}
                          >
                            {order.customer.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="600">
                              {order.customer.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {order.customer.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{order.restaurant.name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{
                          maxWidth: 150,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {order.items.join(', ')}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="600" color="primary">
                          ฿{order.total.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {getStatusChip(order.status)}
                      </TableCell>
                      <TableCell>
                        {getPaymentStatusChip(order.paymentStatus)}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{order.deliveryTime}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" color="primary">
                          <Visibility />
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
                {searchTerm ? 'ไม่พบออเดอร์ที่ค้นหา' : 'ยังไม่มีออเดอร์ในระบบ'}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
} 