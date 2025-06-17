'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip,
  Avatar,
  useTheme,
  useMediaQuery,
  Stack,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Schedule,
  Restaurant,
  People,
  LocalOffer,
  Star,
  ShoppingCart,
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

export default function TrendsPage() {
  const [loading, setLoading] = useState(true);
  const [trendsData, setTrendsData] = useState<any>({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const generateTrendsData = () => {
    return {
      peakHours: [
        { time: '11:00-12:00', orders: 245, percentage: 18.5 },
        { time: '12:00-13:00', orders: 320, percentage: 24.2 },
        { time: '18:00-19:00', orders: 298, percentage: 22.5 },
        { time: '19:00-20:00', orders: 267, percentage: 20.2 },
        { time: '20:00-21:00', orders: 195, percentage: 14.6 },
      ],
      topCategories: [
        { name: 'อาหารไทย', growth: 15.2, orders: 1250, trend: 'up' },
        { name: 'อาหารญี่ปุ่น', growth: 8.7, orders: 890, trend: 'up' },
        { name: 'อาหารจีน', growth: -3.2, orders: 720, trend: 'down' },
        { name: 'อาหารตะวันตก', growth: 12.1, orders: 640, trend: 'up' },
        { name: 'เครื่องดื่ม', growth: 22.5, orders: 580, trend: 'up' },
      ],
      risingRestaurants: [
        { name: 'ร้านข้าวผัดป้าหนู', growth: 45.2, rating: 4.8, orders: 156 },
        { name: 'ส้มตำลาบอีสาน', growth: 38.7, rating: 4.6, orders: 142 },
        { name: 'ก๋วยเตี๋ยวเรือ', growth: 32.1, rating: 4.7, orders: 128 },
        { name: 'ไก่ทอดแม่นาง', growth: 28.9, rating: 4.5, orders: 115 },
        { name: 'ข้าวหมูแดงป๊ะป๋า', growth: 25.3, rating: 4.4, orders: 98 },
      ],
      customerBehavior: {
        averageOrderValue: 285,
        averageOrderValueGrowth: 8.5,
        repeatCustomers: 68.2,
        repeatCustomersGrowth: 12.1,
        newCustomers: 156,
        newCustomersGrowth: 22.8,
        customerSatisfaction: 4.3,
        customerSatisfactionGrowth: 5.2,
      },
      popularPromos: [
        { name: 'ฟรีค่าส่ง', usage: 1250, growth: 18.5 },
        { name: 'ลด 10%', usage: 890, growth: 12.2 },
        { name: 'ซื้อ 1 แถม 1', usage: 670, growth: 25.7 },
        { name: 'ลด 50 บาท', usage: 520, growth: 8.9 },
      ],
      seasonalTrends: [
        { period: 'เช้า (6-10 น.)', percentage: 15.2, color: vristoTheme.info },
        { period: 'กลางวัน (11-14 น.)', percentage: 42.8, color: vristoTheme.primary },
        { period: 'บ่าย (15-17 น.)', percentage: 18.5, color: vristoTheme.warning },
        { period: 'เย็น (18-22 น.)', percentage: 23.5, color: vristoTheme.success },
      ]
    };
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setTrendsData(generateTrendsData());
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <Box sx={{ fontFamily: vristoTheme.font.family }}>
        <Typography variant="h4" fontWeight="600" gutterBottom>
          แนวโน้มและการวิเคราะห์
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ fontFamily: vristoTheme.font.family }}>
      <Typography variant="h4" fontWeight="600" gutterBottom>
        แนวโน้มและการวิเคราะห์
      </Typography>

      <Grid container spacing={3}>
        {/* Customer Behavior Summary */}
        <Grid item xs={12}>
          <Card sx={{ boxShadow: vristoTheme.shadow.card, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                พฤติกรรมลูกค้า
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card variant="outlined" sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                    <Avatar sx={{ bgcolor: vristoTheme.primary, mx: 'auto', mb: 1 }}>
                      <ShoppingCart />
                    </Avatar>
                    <Typography variant="h5" fontWeight="700" color="primary">
                      ฿{trendsData.customerBehavior?.averageOrderValue}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      ค่าเฉลี่ยต่อออเดอร์
                    </Typography>
                    <Chip
                      icon={<TrendingUp />}
                      label={`+${trendsData.customerBehavior?.averageOrderValueGrowth}%`}
                      color="success"
                      size="small"
                    />
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card variant="outlined" sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                    <Avatar sx={{ bgcolor: vristoTheme.success, mx: 'auto', mb: 1 }}>
                      <People />
                    </Avatar>
                    <Typography variant="h5" fontWeight="700" color="success">
                      {trendsData.customerBehavior?.repeatCustomers}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      ลูกค้าประจำ
                    </Typography>
                    <Chip
                      icon={<TrendingUp />}
                      label={`+${trendsData.customerBehavior?.repeatCustomersGrowth}%`}
                      color="success"
                      size="small"
                    />
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card variant="outlined" sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                    <Avatar sx={{ bgcolor: vristoTheme.warning, mx: 'auto', mb: 1 }}>
                      <People />
                    </Avatar>
                    <Typography variant="h5" fontWeight="700" color="warning">
                      {trendsData.customerBehavior?.newCustomers}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      ลูกค้าใหม่ (สัปดาห์นี้)
                    </Typography>
                    <Chip
                      icon={<TrendingUp />}
                      label={`+${trendsData.customerBehavior?.newCustomersGrowth}%`}
                      color="success"
                      size="small"
                    />
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card variant="outlined" sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                    <Avatar sx={{ bgcolor: vristoTheme.info, mx: 'auto', mb: 1 }}>
                      <Star />
                    </Avatar>
                    <Typography variant="h5" fontWeight="700" color="info">
                      {trendsData.customerBehavior?.customerSatisfaction}/5
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      ความพึงพอใจ
                    </Typography>
                    <Chip
                      icon={<TrendingUp />}
                      label={`+${trendsData.customerBehavior?.customerSatisfactionGrowth}%`}
                      color="success"
                      size="small"
                    />
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Peak Hours */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ boxShadow: vristoTheme.shadow.card, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Schedule /> ช่วงเวลาสั่งซื้อมากที่สุด
              </Typography>
              
              {trendsData.peakHours?.map((hour: any, index: number) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" fontWeight="600">
                      {hour.time}
                    </Typography>
                    <Typography variant="body2" color="primary" fontWeight="600">
                      {hour.orders} ออเดอร์
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={hour.percentage}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#f0f0f0',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        backgroundColor: index === 1 ? vristoTheme.primary : vristoTheme.success
                      }
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {hour.percentage}% ของออเดอร์ทั้งหมด
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Top Categories Growth */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ boxShadow: vristoTheme.shadow.card, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Restaurant /> การเติบโตของหมวดหมู่
              </Typography>
              
              <Stack spacing={2}>
                {trendsData.topCategories?.map((category: any, index: number) => (
                  <Box key={index} sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'background.default'
                  }}>
                    <Box>
                      <Typography variant="body2" fontWeight="600">
                        {category.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {category.orders} ออเดอร์
                      </Typography>
                    </Box>
                    <Chip
                      icon={category.trend === 'up' ? <TrendingUp /> : <TrendingDown />}
                      label={`${category.growth >= 0 ? '+' : ''}${category.growth}%`}
                      color={category.trend === 'up' ? 'success' : 'error'}
                      size="small"
                    />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Rising Restaurants */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ boxShadow: vristoTheme.shadow.card, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                ร้านอาหารที่เติบโตเร็ว
              </Typography>
              
              <Stack spacing={2}>
                {trendsData.risingRestaurants?.map((restaurant: any, index: number) => (
                  <Box key={index} sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'background.default'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: vristoTheme.secondary }}>
                        <Restaurant />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="600">
                          {restaurant.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Star sx={{ fontSize: 14, color: vristoTheme.warning }} />
                          <Typography variant="caption">
                            {restaurant.rating} ({restaurant.orders} ออเดอร์)
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Chip
                      icon={<TrendingUp />}
                      label={`+${restaurant.growth}%`}
                      color="success"
                      size="small"
                    />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Popular Promotions */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ boxShadow: vristoTheme.shadow.card, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalOffer /> โปรโมชั่นยอดนิยม
              </Typography>
              
              <Stack spacing={2}>
                {trendsData.popularPromos?.map((promo: any, index: number) => (
                  <Box key={index} sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'background.default'
                  }}>
                    <Box>
                      <Typography variant="body2" fontWeight="600">
                        {promo.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ใช้งาน {promo.usage} ครั้ง
                      </Typography>
                    </Box>
                    <Chip
                      icon={<TrendingUp />}
                      label={`+${promo.growth}%`}
                      color="success"
                      size="small"
                    />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Seasonal Distribution */}
        <Grid item xs={12}>
          <Card sx={{ boxShadow: vristoTheme.shadow.card, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                การกระจายของออเดอร์ตามช่วงเวลา
              </Typography>
              
              <Grid container spacing={3}>
                {trendsData.seasonalTrends?.map((trend: any, index: number) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card variant="outlined" sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                      <Typography variant="h4" fontWeight="700" sx={{ color: trend.color }}>
                        {trend.percentage}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {trend.period}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={trend.percentage}
                        sx={{
                          mt: 1,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: '#f0f0f0',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 3,
                            backgroundColor: trend.color
                          }
                        }}
                      />
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
} 