'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  Button,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp,
  ShoppingCart,
  AttachMoney,
  Restaurant,
  Star,
  Visibility,
  CheckCircle,
  Schedule,
  Warning,
  People,
  MenuBook,
  LocalOffer,
  Assessment,
} from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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

// Mock data
const statsData = {
  todayOrders: 24,
  todayRevenue: 8750,
  monthlyRevenue: 125400,
  rating: 4.6,
  totalMenuItems: 48,
  activePromotions: 3,
};

const recentOrders = [
  {
    id: 'CG001',
    customer: 'คุณสมชาย ใจดี',
    items: ['ส้มตำไทย', 'ไก่ย่าง'],
    total: 180,
    status: 'กำลังทำ',
    time: '13:45',
    statusColor: vristoTheme.warning,
  },
  {
    id: 'CG002',
    customer: 'คุณสมหญิง รักดี',
    items: ['แกงเขียวหวาน', 'ข้าวผัดปู'],
    total: 250,
    status: 'พร้อมส่ง',
    time: '13:30',
    statusColor: vristoTheme.success,
  },
  {
    id: 'CG003',
    customer: 'คุณดำรง ทำดี',
    items: ['ผัดไทย', 'ส้มตำปู'],
    total: 320,
    status: 'เสร็จสิ้น',
    time: '13:15',
    statusColor: vristoTheme.info,
  },
];

const topMenuItems = [
  { name: 'ส้มตำไทย', orders: 15, revenue: 900 },
  { name: 'ไก่ย่าง', orders: 12, revenue: 1440 },
  { name: 'แกงเขียวหวาน', orders: 10, revenue: 1200 },
  { name: 'ผัดไทย', orders: 8, revenue: 640 },
];

const salesData = [
  { day: 'จ', orders: 18, revenue: 5400 },
  { day: 'อ', orders: 22, revenue: 6600 },
  { day: 'พ', orders: 25, revenue: 7500 },
  { day: 'พฤ', orders: 20, revenue: 6000 },
  { day: 'ศ', orders: 28, revenue: 8400 },
  { day: 'ส', orders: 35, revenue: 10500 },
  { day: 'อา', orders: 24, revenue: 8750 },
];

const orderStatusData = [
  { name: 'เสร็จสิ้น', value: 18, color: vristoTheme.success },
  { name: 'กำลังทำ', value: 4, color: vristoTheme.warning },
  { name: 'พร้อมส่ง', value: 2, color: vristoTheme.info },
];

export default function RestaurantDashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        fontFamily: vristoTheme.font.family,
      }}>
        <Typography variant="h6">กำลังโหลด...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ fontFamily: vristoTheme.font.family }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 'bold', 
                color: vristoTheme.text.primary,
                fontFamily: vristoTheme.font.family,
                mb: 1,
              }}
            >
              แดชบอร์ดร้านอาหาร
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: vristoTheme.text.secondary,
                fontFamily: vristoTheme.font.family,
              }}
            >
              ภาพรวมการขายและการจัดการร้านของคุณ
            </Typography>
          </Box>
          
          {/* ปุ่มไปหน้าโปรไฟล์ */}
          <Button
            variant="outlined"
            startIcon={<Restaurant />}
            href="/restaurant/settings/profile"
            sx={{
              borderRadius: 2,
              borderColor: vristoTheme.primary,
              color: vristoTheme.primary,
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: `${vristoTheme.primary}10`,
              },
            }}
          >
            จัดการข้อมูลส่วนตัว
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 3, 
        mb: 4,
        '& > *': { flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }
      }}>
        <Card sx={{ 
          boxShadow: vristoTheme.shadow.card,
          borderLeft: `4px solid ${vristoTheme.primary}`,
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: vristoTheme.primary,
                    fontFamily: vristoTheme.font.family,
                  }}
                >
                  {statsData.todayOrders}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: vristoTheme.text.secondary,
                    fontFamily: vristoTheme.font.family,
                  }}
                >
                  ออเดอร์วันนี้
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: `${vristoTheme.primary}15`, color: vristoTheme.primary }}>
                <ShoppingCart />
              </Avatar>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ 
          boxShadow: vristoTheme.shadow.card,
          borderLeft: `4px solid ${vristoTheme.success}`,
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: vristoTheme.success,
                    fontFamily: vristoTheme.font.family,
                  }}
                >
                  ฿{statsData.todayRevenue.toLocaleString()}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: vristoTheme.text.secondary,
                    fontFamily: vristoTheme.font.family,
                  }}
                >
                  รายได้วันนี้
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: `${vristoTheme.success}15`, color: vristoTheme.success }}>
                <AttachMoney />
              </Avatar>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ 
          boxShadow: vristoTheme.shadow.card,
          borderLeft: `4px solid ${vristoTheme.secondary}`,
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: vristoTheme.secondary,
                    fontFamily: vristoTheme.font.family,
                  }}
                >
                  {statsData.rating}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: vristoTheme.text.secondary,
                    fontFamily: vristoTheme.font.family,
                  }}
                >
                  คะแนนเฉลี่ย
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: `${vristoTheme.secondary}15`, color: vristoTheme.secondary }}>
                <Star />
              </Avatar>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ 
          boxShadow: vristoTheme.shadow.card,
          borderLeft: `4px solid ${vristoTheme.info}`,
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: vristoTheme.info,
                    fontFamily: vristoTheme.font.family,
                  }}
                >
                  {statsData.totalMenuItems}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: vristoTheme.text.secondary,
                    fontFamily: vristoTheme.font.family,
                  }}
                >
                  เมนูทั้งหมด
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: `${vristoTheme.info}15`, color: vristoTheme.info }}>
                <MenuBook />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {/* Recent Orders */}
        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(66.666% - 12px)' } }}>
          <Card sx={{ boxShadow: vristoTheme.shadow.card, mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 'bold',
                    fontFamily: vristoTheme.font.family,
                  }}
                >
                  ออเดอร์ล่าสุด
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  sx={{ fontFamily: vristoTheme.font.family }}
                >
                  ดูทั้งหมด
                </Button>
              </Box>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontFamily: vristoTheme.font.family, fontWeight: 600 }}>
                        ออเดอร์
                      </TableCell>
                      <TableCell sx={{ fontFamily: vristoTheme.font.family, fontWeight: 600 }}>
                        ลูกค้า
                      </TableCell>
                      <TableCell sx={{ fontFamily: vristoTheme.font.family, fontWeight: 600 }}>
                        รายการ
                      </TableCell>
                      <TableCell sx={{ fontFamily: vristoTheme.font.family, fontWeight: 600 }}>
                        ยอดรวม
                      </TableCell>
                      <TableCell sx={{ fontFamily: vristoTheme.font.family, fontWeight: 600 }}>
                        สถานะ
                      </TableCell>
                      <TableCell sx={{ fontFamily: vristoTheme.font.family, fontWeight: 600 }}>
                        เวลา
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell sx={{ fontFamily: vristoTheme.font.family }}>
                          #{order.id}
                        </TableCell>
                        <TableCell sx={{ fontFamily: vristoTheme.font.family }}>
                          {order.customer}
                        </TableCell>
                        <TableCell sx={{ fontFamily: vristoTheme.font.family }}>
                          {order.items.join(', ')}
                        </TableCell>
                        <TableCell sx={{ fontFamily: vristoTheme.font.family }}>
                          ฿{order.total}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={order.status} 
                            size="small"
                            sx={{ 
                              bgcolor: `${order.statusColor}15`,
                              color: order.statusColor,
                              fontFamily: vristoTheme.font.family,
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontFamily: vristoTheme.font.family }}>
                          {order.time}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Sales Chart */}
          <Card sx={{ boxShadow: vristoTheme.shadow.card }}>
            <CardContent>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold', 
                  mb: 3,
                  fontFamily: vristoTheme.font.family,
                }}
              >
                ยอดขาย 7 วันล่าสุด
              </Typography>
              <Box sx={{ 
                width: '100%', 
                height: 300, 
                bgcolor: vristoTheme.light,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1,
              }}>
                <Typography sx={{ fontFamily: vristoTheme.font.family, color: vristoTheme.text.secondary }}>
                  📊 กราฟยอดขาย 7 วัน
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Sidebar */}
        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 calc(33.333% - 12px)' } }}>
          {/* Order Status */}
          <Card sx={{ boxShadow: vristoTheme.shadow.card, mb: 3 }}>
            <CardContent>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold', 
                  mb: 3,
                  fontFamily: vristoTheme.font.family,
                }}
              >
                สถานะออเดอร์วันนี้
              </Typography>
              <Box sx={{ 
                width: '100%', 
                height: 200, 
                bgcolor: vristoTheme.light,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1,
              }}>
                <Typography sx={{ fontFamily: vristoTheme.font.family, color: vristoTheme.text.secondary }}>
                  🥧 กราฟสถานะออเดอร์
                </Typography>
              </Box>
              <Box sx={{ mt: 2 }}>
                {orderStatusData.map((item) => (
                  <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box 
                      sx={{ 
                        width: 12, 
                        height: 12, 
                        bgcolor: item.color, 
                        borderRadius: '50%', 
                        mr: 1 
                      }} 
                    />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        flexGrow: 1,
                        fontFamily: vristoTheme.font.family,
                      }}
                    >
                      {item.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 'bold',
                        fontFamily: vristoTheme.font.family,
                      }}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Top Menu Items */}
          <Card sx={{ boxShadow: vristoTheme.shadow.card }}>
            <CardContent>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold', 
                  mb: 3,
                  fontFamily: vristoTheme.font.family,
                }}
              >
                เมนูขายดี
              </Typography>
              <List>
                {topMenuItems.map((item, index) => (
                  <React.Fragment key={item.name}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: vristoTheme.primary }}>
                          {index + 1}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography 
                            sx={{ 
                              fontWeight: 600,
                              fontFamily: vristoTheme.font.family,
                            }}
                          >
                            {item.name}
                          </Typography>
                        }
                        secondary={
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: vristoTheme.text.secondary,
                              fontFamily: vristoTheme.font.family,
                            }}
                          >
                            {item.orders} ออเดอร์ • ฿{item.revenue}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < topMenuItems.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
} 