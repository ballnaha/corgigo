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
  Switch,
  FormControlLabel,
  Chip,
  Avatar,
  Paper,
  Tab,
  Tabs,
  Badge,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Restaurant,
  AccountCircle,
  Star,
  Schedule,
  AttachMoney,
  Notifications,
  Assignment,
  MenuBook,
  ShoppingCart,
  BarChart,
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
      id={`restaurant-tabpanel-${index}`}
      aria-labelledby={`restaurant-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function RestaurantPage() {
  const [tabValue, setTabValue] = useState(0);
  const [isOpen, setIsOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock data
  const restaurantStats = {
    rating: 4.6,
    totalOrders: 1247,
    todayRevenue: 12500,
    monthlyRevenue: 285000,
    pendingOrders: 5,
  };

  const pendingOrders = [
    {
      id: '1',
      orderNumber: 'CG123456',
      customer: 'คุณสมชาย',
      items: ['ส้มตำไทย', 'ไก่ย่าง', 'ข้าวเหนียว'],
      total: 180,
      orderTime: '14:30',
      estimatedTime: '25 นาที',
    },
    {
      id: '2',
      orderNumber: 'CG123457',
      customer: 'คุณสมหญิง',
      items: ['แกงเขียวหวาน', 'ข้าวผัดปู'],
      total: 250,
      orderTime: '14:45',
      estimatedTime: '30 นาที',
    },
  ];

  const menuItems = [
    {
      id: '1',
      name: 'ส้มตำไทย',
      price: 60,
      category: 'ส้มตำ',
      available: true,
      description: 'ส้มตำรสแซ่บ ใส่ถั่วฝักยาว มะเขือเทศ',
    },
    {
      id: '2',
      name: 'ไก่ย่าง',
      price: 120,
      category: 'อาหารปิ้งย่าง',
      available: true,
      description: 'ไก่ย่างเครื่องเทศ หอมกรุ่น',
    },
    {
      id: '3',
      name: 'ข้าวเหนียวหวาน',
      price: 40,
      category: 'ของหวาน',
      available: false,
      description: 'ข้าวเหนียวหวาน กะทิสด',
    },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAcceptOrder = (orderId: string) => {
    console.log('Accept order:', orderId);
  };

  const handleRejectOrder = (orderId: string) => {
    console.log('Reject order:', orderId);
  };

  if (!mounted) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        กำลังโหลด...
      </Box>
    );
  }

  return (
    <>
      {/* Header */}
      <AppBar position="fixed" sx={{ bgcolor: 'primary.main' }}>
        <Toolbar>
          <Restaurant sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            CorgiGo Restaurant
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={isOpen}
                onChange={(e) => setIsOpen(e.target.checked)}
                color="secondary"
              />
            }
            label={isOpen ? 'เปิด' : 'ปิด'}
            sx={{ color: 'white', mr: 2 }}
          />
          <IconButton color="inherit">
            <Badge badgeContent={restaurantStats.pendingOrders} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          <IconButton color="inherit" sx={{ ml: 1 }}>
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ pt: 8, pb: 4 }}>
        <Container maxWidth="lg" sx={{ mt: 2 }}>
          {/* Status Card */}
          <Card sx={{ mb: 3, bgcolor: isOpen ? 'success.50' : 'grey.50' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    ร้านส้มตำป้าแดง
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    สถานะ: {isOpen ? 'เปิดให้บริการ' : 'ปิดชั่วคราว'}
                  </Typography>
                </Box>
                <Chip
                  label={isOpen ? 'เปิด' : 'ปิด'}
                  color={isOpen ? 'success' : 'default'}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Star sx={{ color: '#FFD700', fontSize: 30, mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {restaurantStats.rating}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  คะแนน
                </Typography>
              </Paper>
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Assignment sx={{ color: 'primary.main', fontSize: 30, mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {restaurantStats.totalOrders}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ออเดอร์ทั้งหมด
                </Typography>
              </Paper>
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <AttachMoney sx={{ color: 'success.main', fontSize: 30, mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  ฿{restaurantStats.todayRevenue.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  รายได้วันนี้
                </Typography>
              </Paper>
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <BarChart sx={{ color: 'info.main', fontSize: 30, mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  ฿{restaurantStats.monthlyRevenue.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  รายได้เดือนนี้
                </Typography>
              </Paper>
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <ShoppingCart sx={{ color: 'warning.main', fontSize: 30, mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {restaurantStats.pendingOrders}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  รอดำเนินการ
                </Typography>
              </Paper>
            </Box>
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="คำสั่งซื้อ" />
              <Tab label="เมนูอาหาร" />
              <Tab label="รายงาน" />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <TabPanel value={tabValue} index={0}>
            {/* Orders Tab */}
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              คำสั่งซื้อรอดำเนินการ
            </Typography>
            {pendingOrders.length > 0 ? (
              pendingOrders.map((order) => (
                <Card key={order.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {order.orderNumber}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ลูกค้า: {order.customer} • สั่งเมื่อ: {order.orderTime}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                          ฿{order.total}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          เวลาประมาณ: {order.estimatedTime}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      <strong>รายการ:</strong> {order.items.join(', ')}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleAcceptOrder(order.id)}
                        size="small"
                      >
                        รับออเดอร์
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleRejectOrder(order.id)}
                        size="small"
                      >
                        ปฏิเสธ
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Assignment sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  ไม่มีคำสั่งซื้อใหม่
                </Typography>
              </Paper>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {/* Menu Tab */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                เมนูอาหาร
              </Typography>
              <Button variant="contained" startIcon={<MenuBook />}>
                เพิ่มเมนู
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {menuItems.map((item) => (
                <Box key={item.id} sx={{ flex: '1 1 300px', minWidth: 0 }}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {item.name}
                        </Typography>
                        <Chip
                          label={item.available ? 'มีจำหน่าย' : 'หมด'}
                          color={item.available ? 'success' : 'error'}
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {item.category}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {item.description}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                          ฿{item.price}
                        </Typography>
                        <Button size="small">แก้ไข</Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            {/* Reports Tab */}
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              รายงานยอดขาย
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ flex: '1 1 400px', minWidth: 0 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      ยอดขายรายวัน
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                      ฿{restaurantStats.todayRevenue.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      เปรียบเทียบเมื่อวาน: +12%
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
              <Box sx={{ flex: '1 1 400px', minWidth: 0 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      จำนวนออเดอร์วันนี้
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      47
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      เฉลี่ยต่อออเดอร์: ฿{Math.round(restaurantStats.todayRevenue / 47)}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </TabPanel>
        </Container>
      </Box>
    </>
  );
} 