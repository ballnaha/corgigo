'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, Box, 
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  Tab,
  Tabs,
  Badge,
  Alert,
  Stack,
  IconButton,
  Paper,
  Avatar,
  useMediaQuery,
  useTheme,
 } from '@mui/material';
import {
  Schedule,
  CheckCircle,
  LocalShipping,
  Assignment,
  Print,
  Phone,
  LocationOn,
  AccessTime,
  Person,
  Restaurant,
  Close,
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

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  items: OrderItem[];
  total: number;
  status: 'new' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled';
  orderTime: string;
  estimatedTime?: string;
  paymentMethod: string;
  deliveryType: 'delivery' | 'pickup';
  notes?: string;
  rider?: {
    name: string;
    phone: string;
  };
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'CG001',
    customer: {
      name: 'คุณสมชาย ใจดี',
      phone: '089-123-4567',
      address: '123 ถนนสุขุมวิท แขวงคลองตัน เขตวัฒนา กรุงเทพฯ 10110',
    },
    items: [
      { id: '1', name: 'ส้มตำไทย', quantity: 1, price: 60 },
      { id: '2', name: 'ไก่ย่าง', quantity: 1, price: 120 },
    ],
    total: 180,
    status: 'new',
    orderTime: '14:30',
    paymentMethod: 'เงินสด',
    deliveryType: 'delivery',
    notes: 'ขอเผ็ดน้อย',
  },
  {
    id: '2',
    orderNumber: 'CG002',
    customer: {
      name: 'คุณสมหญิง รักดี',
      phone: '089-234-5678',
      address: '456 ถนนพหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900',
    },
    items: [
      { id: '3', name: 'แกงเขียวหวานไก่', quantity: 1, price: 80 },
      { id: '4', name: 'ข้าวผัดปู', quantity: 1, price: 170 },
    ],
    total: 250,
    status: 'confirmed',
    orderTime: '14:45',
    estimatedTime: '15:15',
    paymentMethod: 'โอนเงิน',
    deliveryType: 'delivery',
  },
  {
    id: '3',
    orderNumber: 'CG003',
    customer: {
      name: 'คุณดำรง ทำดี',
      phone: '089-345-6789',
      address: 'มารับเอง',
    },
    items: [
      { id: '5', name: 'ผัดไทย', quantity: 2, price: 140 },
      { id: '6', name: 'ส้มตำปู', quantity: 1, price: 180 },
    ],
    total: 320,
    status: 'preparing',
    orderTime: '15:00',
    estimatedTime: '15:20',
    paymentMethod: 'เงินสด',
    deliveryType: 'pickup',
  },
  {
    id: '4',
    orderNumber: 'CG004',
    customer: {
      name: 'คุณศิริ ดีใจ',
      phone: '089-456-7890',
      address: '789 ถนนรัชดาภิเษก แขวงดินแดง เขตดินแดง กรุงเทพฯ 10400',
    },
    items: [
      { id: '7', name: 'ต้มยำกุ้ง', quantity: 1, price: 120 },
      { id: '8', name: 'ข้าวเหนียวหวาน', quantity: 2, price: 80 },
    ],
    total: 200,
    status: 'ready',
    orderTime: '14:15',
    estimatedTime: '14:45',
    paymentMethod: 'บัตรเครดิต',
    deliveryType: 'delivery',
    rider: {
      name: 'คุณสมศักดิ์',
      phone: '089-567-8901',
    },
  },
];

const statusConfig = {
  new: { label: 'ออเดอร์ใหม่', color: vristoTheme.info, icon: <Assignment /> },
  confirmed: { label: 'ยืนยันแล้ว', color: vristoTheme.primary, icon: <CheckCircle /> },
  preparing: { label: 'กำลังทำ', color: vristoTheme.warning, icon: <Schedule /> },
  ready: { label: 'พร้อมส่ง', color: vristoTheme.success, icon: <Restaurant /> },
  delivering: { label: 'กำลังส่ง', color: vristoTheme.secondary, icon: <LocalShipping /> },
  completed: { label: 'เสร็จสิ้น', color: vristoTheme.success, icon: <CheckCircle /> },
  cancelled: { label: 'ยกเลิก', color: vristoTheme.danger, icon: <Assignment /> },
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
      id={`orders-tabpanel-${index}`}
      aria-labelledby={`orders-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function OrderManagement() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus, estimatedTime: newStatus === 'confirmed' ? getEstimatedTime() : order.estimatedTime }
          : order
      )
    );
    setOpenDialog(false);
  };

  const getEstimatedTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 25);
    return now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  };

  const filterOrdersByTab = (status: string[]) => {
    return orders.filter(order => status.includes(order.status));
  };

  const getStatusChip = (status: Order['status']) => {
    const config = statusConfig[status];
    return (
      <Chip
        label={config.label}
        size="small"
        sx={{
          bgcolor: `${config.color}15`,
          color: config.color,
          fontFamily: vristoTheme.font.family,
        }}
        icon={config.icon}
      />
    );
  };

  const OrderCard = ({ order }: { order: Order }) => (
    <Card 
      sx={{ 
        boxShadow: vristoTheme.shadow.card,
        cursor: 'pointer',
        '&:hover': {
          boxShadow: vristoTheme.shadow.elevated,
        },
        borderLeft: `4px solid ${statusConfig[order.status].color}`,
      }}
      onClick={() => handleOrderClick(order)}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold',
                fontFamily: vristoTheme.font.family,
              }}
            >
              #{order.orderNumber}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: vristoTheme.text.secondary,
                fontFamily: vristoTheme.font.family,
              }}
            >
              {order.customer.name}
            </Typography>
          </Box>
          {getStatusChip(order.status)}
        </Box>

        <Box sx={{ mb: 2 }}>
          {order.items.map((item, index) => (
            <Typography 
              key={index}
              variant="body2" 
              sx={{ fontFamily: vristoTheme.font.family }}
            >
              {item.quantity}x {item.name}
            </Typography>
          ))}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: vristoTheme.primary,
              fontWeight: 'bold',
              fontFamily: vristoTheme.font.family,
            }}
          >
            ฿{order.total}
          </Typography>
          <Chip 
            label={order.deliveryType === 'delivery' ? 'จัดส่ง' : 'มารับ'} 
            size="small"
            variant="outlined"
            sx={{ fontFamily: vristoTheme.font.family }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography 
            variant="caption" 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              color: vristoTheme.text.secondary,
              fontFamily: vristoTheme.font.family,
            }}
          >
            <AccessTime sx={{ fontSize: 16, mr: 0.5 }} />
            {order.orderTime}
            {order.estimatedTime && ` → ${order.estimatedTime}`}
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              color: vristoTheme.text.secondary,
              fontFamily: vristoTheme.font.family,
            }}
          >
            {order.paymentMethod}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const tabData = [
    { label: 'ใหม่', statuses: ['new'], count: filterOrdersByTab(['new']).length },
    { label: 'ยืนยัน/ทำ', statuses: ['confirmed', 'preparing'], count: filterOrdersByTab(['confirmed', 'preparing']).length },
    { label: 'พร้อม/ส่ง', statuses: ['ready', 'delivering'], count: filterOrdersByTab(['ready', 'delivering']).length },
    { label: 'เสร็จสิ้น', statuses: ['completed'], count: filterOrdersByTab(['completed']).length },
  ];

  return (
    <Box sx={{ fontFamily: vristoTheme.font.family }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 'bold', 
            color: vristoTheme.text.primary,
            fontFamily: vristoTheme.font.family,
            mb: 1,
          }}
        >
          จัดการออเดอร์
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: vristoTheme.text.secondary,
            fontFamily: vristoTheme.font.family,
          }}
        >
          ติดตามและจัดการออเดอร์ของลูกค้า
        </Typography>
      </Box>

      {/* Status Tabs */}
      <Card sx={{ boxShadow: vristoTheme.shadow.card, mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant={isMobile ? 'scrollable' : 'fullWidth'}
            scrollButtons="auto"
          >
            {tabData.map((tab, index) => (
              <Tab
                key={index}
                label={
                  <Badge badgeContent={tab.count} color="error">
                    <Typography sx={{ fontFamily: vristoTheme.font.family }}>
                      {tab.label}
                    </Typography>
                  </Badge>
                }
                sx={{ fontFamily: vristoTheme.font.family }}
              />
            ))}
          </Tabs>
        </Box>

        {tabData.map((tab, index) => (
          <TabPanel key={index} value={tabValue} index={index}>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 3 
            }}>
              {filterOrdersByTab(tab.statuses).length > 0 ? (
                filterOrdersByTab(tab.statuses).map((order) => (
                  <Box 
                    key={order.id}
                    sx={{ 
                      flex: { 
                        xs: '1 1 100%', 
                        md: '1 1 calc(50% - 12px)', 
                        lg: '1 1 calc(33.333% - 16px)' 
                      } 
                    }}
                  >
                    <OrderCard order={order} />
                  </Box>
                ))
              ) : (
                <Box sx={{ width: '100%' }}>
                  <Alert 
                    severity="info"
                    sx={{ fontFamily: vristoTheme.font.family }}
                  >
                    ไม่มีออเดอร์ในสถานะนี้
                  </Alert>
                </Box>
              )}
            </Box>
          </TabPanel>
        ))}
      </Card>

      {/* Order Detail Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="md" 
        fullWidth
        fullScreen={isXsScreen}
        PaperProps={{
          sx: {
            m: { xs: 0, sm: 2 },
            maxHeight: { xs: '100vh', sm: 'none' },
            borderRadius: { xs: 0, sm: 2 },
          }
        }}
      >
        {selectedOrder && (
          <>
            <DialogTitle sx={{ 
              fontFamily: vristoTheme.font.family,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: { xs: 'center', sm: 'flex-start' },
            }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: { xs: 'center', sm: 'space-between' }, 
                alignItems: 'center',
                width: '100%',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1, sm: 0 },
              }}>
                <Typography variant="h6" sx={{ fontFamily: vristoTheme.font.family }}>
                  ออเดอร์ #{selectedOrder.orderNumber}
                </Typography>
                {getStatusChip(selectedOrder.status)}
              </Box>
              <IconButton
                onClick={() => setOpenDialog(false)}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: vristoTheme.text.secondary,
                  display: { xs: 'block', sm: 'none' },
                }}
              >
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {/* Customer Info */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                  <Paper sx={{ p: 2, bgcolor: vristoTheme.light }}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 'bold', 
                        mb: 2,
                        fontFamily: vristoTheme.font.family,
                      }}
                    >
                      ข้อมูลลูกค้า
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Person sx={{ mr: 1, color: vristoTheme.text.secondary }} />
                      <Typography sx={{ fontFamily: vristoTheme.font.family }}>
                        {selectedOrder.customer.name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Phone sx={{ mr: 1, color: vristoTheme.text.secondary }} />
                      <Typography sx={{ fontFamily: vristoTheme.font.family }}>
                        {selectedOrder.customer.phone}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <LocationOn sx={{ mr: 1, mt: 0.5, color: vristoTheme.text.secondary }} />
                      <Typography sx={{ fontFamily: vristoTheme.font.family }}>
                        {selectedOrder.customer.address}
                      </Typography>
                    </Box>
                  </Paper>
                </Box>

                {/* Order Info */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                  <Paper sx={{ p: 2, bgcolor: vristoTheme.light }}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 'bold', 
                        mb: 2,
                        fontFamily: vristoTheme.font.family,
                      }}
                    >
                      ข้อมูลออเดอร์
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 1,
                        fontFamily: vristoTheme.font.family,
                      }}
                    >
                      เวลาสั่ง: {selectedOrder.orderTime}
                    </Typography>
                    {selectedOrder.estimatedTime && (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mb: 1,
                          fontFamily: vristoTheme.font.family,
                        }}
                      >
                        เวลาโดยประมาณ: {selectedOrder.estimatedTime}
                      </Typography>
                    )}
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 1,
                        fontFamily: vristoTheme.font.family,
                      }}
                    >
                      การชำระเงิน: {selectedOrder.paymentMethod}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 1,
                        fontFamily: vristoTheme.font.family,
                      }}
                    >
                      ประเภท: {selectedOrder.deliveryType === 'delivery' ? 'จัดส่ง' : 'มารับเอง'}
                    </Typography>
                    {selectedOrder.rider && (
                      <Box sx={{ mt: 2 }}>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: 'bold',
                            fontFamily: vristoTheme.font.family,
                          }}
                        >
                          ไรเดอร์
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocalShipping sx={{ mr: 1, color: vristoTheme.text.secondary }} />
                          <Typography sx={{ fontFamily: vristoTheme.font.family }}>
                            {selectedOrder.rider.name} ({selectedOrder.rider.phone})
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Paper>
                </Box>

                {/* Order Items */}
                <Box sx={{ flex: '1 1 100%' }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 'bold', 
                      mb: 2,
                      fontFamily: vristoTheme.font.family,
                    }}
                  >
                    รายการอาหาร
                  </Typography>
                  <List>
                    {selectedOrder.items.map((item, index) => (
                      <React.Fragment key={index}>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography sx={{ fontFamily: vristoTheme.font.family }}>
                                  {item.quantity}x {item.name}
                                </Typography>
                                <Typography sx={{ fontFamily: vristoTheme.font.family }}>
                                  ฿{item.price}
                                </Typography>
                              </Box>
                            }
                            secondary={item.notes && (
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: vristoTheme.text.secondary,
                                  fontFamily: vristoTheme.font.family,
                                }}
                              >
                                หมายเหตุ: {item.notes}
                              </Typography>
                            )}
                          />
                        </ListItem>
                        {index < selectedOrder.items.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                    <Divider sx={{ my: 2 }} />
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontWeight: 'bold',
                                fontFamily: vristoTheme.font.family,
                              }}
                            >
                              ยอดรวม
                            </Typography>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontWeight: 'bold',
                                color: vristoTheme.primary,
                                fontFamily: vristoTheme.font.family,
                              }}
                            >
                              ฿{selectedOrder.total}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  </List>

                  {selectedOrder.notes && (
                    <Alert 
                      severity="info" 
                      sx={{ 
                        mt: 2,
                        fontFamily: vristoTheme.font.family,
                      }}
                    >
                      หมายเหตุ: {selectedOrder.notes}
                    </Alert>
                  )}
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Stack direction="row" spacing={1} sx={{ p: 1 }}>
                <IconButton sx={{ color: vristoTheme.info }}>
                  <Print />
                </IconButton>
                <IconButton sx={{ color: vristoTheme.success }}>
                  <Phone />
                </IconButton>
                
                {selectedOrder.status === 'new' && (
                  <>
                    <Button
                      variant="contained"
                      onClick={() => handleStatusChange(selectedOrder.id, 'confirmed')}
                      sx={{ 
                        bgcolor: vristoTheme.success,
                        fontFamily: vristoTheme.font.family,
                      }}
                    >
                      ยืนยันออเดอร์
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleStatusChange(selectedOrder.id, 'cancelled')}
                      sx={{ fontFamily: vristoTheme.font.family }}
                    >
                      ยกเลิก
                    </Button>
                  </>
                )}
                
                {selectedOrder.status === 'confirmed' && (
                  <Button
                    variant="contained"
                    onClick={() => handleStatusChange(selectedOrder.id, 'preparing')}
                    sx={{ 
                      bgcolor: vristoTheme.warning,
                      fontFamily: vristoTheme.font.family,
                    }}
                  >
                    เริ่มทำอาหาร
                  </Button>
                )}
                
                {selectedOrder.status === 'preparing' && (
                  <Button
                    variant="contained"
                    onClick={() => handleStatusChange(selectedOrder.id, 'ready')}
                    sx={{ 
                      bgcolor: vristoTheme.success,
                      fontFamily: vristoTheme.font.family,
                    }}
                  >
                    อาหารพร้อม
                  </Button>
                )}
                
                {selectedOrder.status === 'ready' && selectedOrder.deliveryType === 'delivery' && (
                  <Button
                    variant="contained"
                    onClick={() => handleStatusChange(selectedOrder.id, 'delivering')}
                    sx={{ 
                      bgcolor: vristoTheme.secondary,
                      fontFamily: vristoTheme.font.family,
                    }}
                  >
                    ส่งออกไป
                  </Button>
                )}
                
                {(selectedOrder.status === 'delivering' || 
                  (selectedOrder.status === 'ready' && selectedOrder.deliveryType === 'pickup')) && (
                  <Button
                    variant="contained"
                    onClick={() => handleStatusChange(selectedOrder.id, 'completed')}
                    sx={{ 
                      bgcolor: vristoTheme.success,
                      fontFamily: vristoTheme.font.family,
                    }}
                  >
                    เสร็จสิ้น
                  </Button>
                )}
                
                <Button 
                  onClick={() => setOpenDialog(false)}
                  sx={{ fontFamily: vristoTheme.font.family }}
                >
                  ปิด
                </Button>
              </Stack>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
} 