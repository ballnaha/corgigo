'use client';

import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Dashboard,
  AccountCircle,
  People,
  Restaurant,
  TwoWheeler,
  BarChart,
  Settings,
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

export default function AdminPage() {
  const [tabValue, setTabValue] = useState(0);

  // Mock data
  const stats = {
    totalUsers: 15420,
    totalRestaurants: 847,
    totalRiders: 156,
    totalOrders: 25680,
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="คำสั่งซื้อล่าสุด" />
              <Tab label="ร้านอาหาร" />
              <Tab label="ไรเดอร์" />
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
              ร้านอาหาร
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ชื่อร้าน</TableCell>
                    <TableCell>เจ้าของ</TableCell>
                    <TableCell>สถานะ</TableCell>
                    <TableCell>จำนวนออเดอร์</TableCell>
                    <TableCell>จัดการ</TableCell>
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
                      <TableCell>
                        <Button size="small">ดูรายละเอียด</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              ไรเดอร์
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ชื่อ</TableCell>
                    <TableCell>เบอร์โทร</TableCell>
                    <TableCell>สถานะ</TableCell>
                    <TableCell>จำนวนการส่ง</TableCell>
                    <TableCell>จัดการ</TableCell>
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
                      <TableCell>
                        <Button size="small">ดูรายละเอียด</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </Container>
      </Box>
    </>
  );
} 