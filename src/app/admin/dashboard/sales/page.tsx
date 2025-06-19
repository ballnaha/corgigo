'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box,
  Typography,
  Card,
  CardContent, Box, 
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  useTheme,
  useMediaQuery,
 } from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AttachMoney,
  Restaurant,
  ShoppingCart,
  Group,
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

export default function SalesStatsPage() {
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<any>({});
  const [topRestaurants, setTopRestaurants] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      
      // Fetch restaurants and users data in parallel
      const [restaurantsResponse, usersResponse] = await Promise.all([
        fetch('/api/admin/restaurants/manage'),
        fetch('/api/admin/users')
      ]);

      const restaurantsData = await restaurantsResponse.json();
      const usersData = await usersResponse.json();

      if (restaurantsData.success && usersData.success) {
        const restaurants = restaurantsData.restaurants || [];
        const users = usersData.users || [];

        // Generate mock sales statistics
        const totalRevenue = Math.floor(Math.random() * 500000) + 1000000; // 1M-1.5M
        const totalOrders = Math.floor(Math.random() * 5000) + 10000; // 10K-15K
        const avgOrderValue = totalRevenue / totalOrders;
        
        const salesStats = {
          totalRevenue,
          totalOrders,
          avgOrderValue,
          growthRate: (Math.random() * 30 + 5), // 5-35%
          topCategories: [
            { name: 'อาหารไทย', revenue: totalRevenue * 0.35, orders: Math.floor(totalOrders * 0.35) },
            { name: 'อาหารญี่ปุ่น', revenue: totalRevenue * 0.25, orders: Math.floor(totalOrders * 0.25) },
            { name: 'อาหารจีน', revenue: totalRevenue * 0.20, orders: Math.floor(totalOrders * 0.20) },
            { name: 'อาหารตะวันตก', revenue: totalRevenue * 0.20, orders: Math.floor(totalOrders * 0.20) },
          ],
          totalCustomers: users.filter(u => u.role === 'CUSTOMER').length,
          activeRestaurants: restaurants.filter(r => r.status === 'APPROVED').length,
          conversionRate: Math.random() * 10 + 15, // 15-25%
        };

        // Generate top performing restaurants
        const topPerformers = restaurants
          .map((restaurant: any) => ({
            ...restaurant,
            revenue: Math.floor(Math.random() * 100000) + 20000,
            orders: Math.floor(Math.random() * 500) + 100,
            rating: (Math.random() * 2 + 3).toFixed(1), // 3.0-5.0
            growthRate: (Math.random() * 40 - 10), // -10% to +30%
          }))
          .sort((a: any, b: any) => b.revenue - a.revenue)
          .slice(0, 10);

        setSalesData(salesStats);
        setTopRestaurants(topPerformers);
      } else {
        setError('ไม่สามารถโหลดข้อมูลได้');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      console.error('Error fetching sales data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ fontFamily: vristoTheme.font.family }}>
        <Typography variant="h4" fontWeight="600" gutterBottom>
          สถิติการขาย
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ fontFamily: vristoTheme.font.family }}>
        <Typography variant="h4" fontWeight="600" gutterBottom>
          สถิติการขาย
        </Typography>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ fontFamily: vristoTheme.font.family }}>
      <Typography variant="h4" fontWeight="600" gutterBottom>
        สถิติการขาย
      </Typography>

      {/* Summary Cards */}
      <Box sx={ display: 'grid', gap: 3, { mb: 4  }>
        <Box>
          <Card sx={{ 
            p: 3, 
            boxShadow: vristoTheme.shadow.card,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #4361ee 0%, #5a72f0 100%)',
            color: 'white'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" fontWeight="700">
                  ฿{salesData.totalRevenue?.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  รายได้รวม
                </Typography>
              </Box>
              <AttachMoney sx={{ fontSize: 40, opacity: 0.8 }} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
              <Typography variant="body2">
                +{salesData.growthRate?.toFixed(1)}% จากเดือนที่แล้ว
              </Typography>
            </Box>
          </Card>
        </Box>

        <Box>
          <Card sx={{ 
            p: 3, 
            boxShadow: vristoTheme.shadow.card,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #1abc9c 0%, #16a085 100%)',
            color: 'white'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" fontWeight="700">
                  {salesData.totalOrders?.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  ออเดอร์ทั้งหมด
                </Typography>
              </Box>
              <ShoppingCart sx={{ fontSize: 40, opacity: 0.8 }} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
              <Typography variant="body2">
                +12.5% จากเดือนที่แล้ว
              </Typography>
            </Box>
          </Card>
        </Box>

        <Box>
          <Card sx={{ 
            p: 3, 
            boxShadow: vristoTheme.shadow.card,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
            color: 'white'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" fontWeight="700">
                  ฿{salesData.avgOrderValue?.toFixed(0)}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  ค่าเฉลี่ยต่อออเดอร์
                </Typography>
              </Box>
              <TrendingUp sx={{ fontSize: 40, opacity: 0.8 }} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
              <Typography variant="body2">
                +8.3% จากเดือนที่แล้ว
              </Typography>
            </Box>
          </Card>
        </Box>

        <Box>
          <Card sx={{ 
            p: 3, 
            boxShadow: vristoTheme.shadow.card,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
            color: 'white'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" fontWeight="700">
                  {salesData.conversionRate?.toFixed(1)}%
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  อัตราการแปลง
                </Typography>
              </Box>
              <Group sx={{ fontSize: 40, opacity: 0.8 }} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
              <Typography variant="body2">
                +3.2% จากเดือนที่แล้ว
              </Typography>
            </Box>
          </Card>
        </Box>
      </Box>

      <Box sx={ display: 'grid', gap: 3 }>
        {/* Top Categories */}
        <Box>
          <Card sx={{ boxShadow: vristoTheme.shadow.card, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                หมวดหมู่ยอดนิยม
              </Typography>
              
              {salesData.topCategories?.map((category: any, index: number) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" fontWeight="600">
                      {category.name}
                    </Typography>
                    <Typography variant="body2" color="primary" fontWeight="600">
                      ฿{category.revenue.toLocaleString()}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(category.revenue / salesData.totalRevenue) * 100}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#f0f0f0',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        backgroundColor: index === 0 ? vristoTheme.primary : 
                                      index === 1 ? vristoTheme.success : 
                                      index === 2 ? vristoTheme.warning : vristoTheme.info
                      }
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {category.orders.toLocaleString()} ออเดอร์ ({((category.revenue / salesData.totalRevenue) * 100).toFixed(1)}%)
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Box>

        {/* Top Restaurants */}
        <Box>
          <Card sx={{ boxShadow: vristoTheme.shadow.card, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                ร้านอาหารยอดนิยม (Top 5)
              </Typography>
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ร้านอาหาร</TableCell>
                      <TableCell align="right">รายได้</TableCell>
                      <TableCell align="center">เติบโต</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topRestaurants.slice(0, 5).map((restaurant, index) => (
                      <TableRow key={restaurant.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar
                              src={restaurant.image}
                              sx={{ width: 32, height: 32, bgcolor: vristoTheme.secondary }}
                            >
                              <Restaurant />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="600">
                                {restaurant.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {restaurant.orders} ออเดอร์
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="600" color="primary">
                            ฿{restaurant.revenue.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            icon={restaurant.growthRate >= 0 ? <TrendingUp /> : <TrendingDown />}
                            label={`${restaurant.growthRate >= 0 ? '+' : ''}${restaurant.growthRate.toFixed(1)}%`}
                            color={restaurant.growthRate >= 0 ? 'success' : 'error'}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
} 