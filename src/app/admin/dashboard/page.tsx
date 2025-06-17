'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  LinearProgress,
} from '@mui/material';
import {
  People,
  Restaurant,
  ShoppingCart,
  AttachMoney,
  TrendingUp,
  PendingActions,
} from '@mui/icons-material';
import { useSnackbar } from '@/contexts/SnackbarContext';

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

// Chart components (simplified versions)
const DonutChart = ({ percentage, label, color }: { percentage: number; label: string; color: string }) => (
  <Box sx={{ textAlign: 'center' }}>
    <Box sx={{ 
      width: 100, 
      height: 100, 
      borderRadius: '50%',
      background: `conic-gradient(${color} ${percentage * 3.6}deg, #e5e7eb 0deg)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      mx: 'auto',
      mb: 1,
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        width: 70,
        height: 70,
        borderRadius: '50%',
        bgcolor: 'white',
      }
    }}>
      <Typography variant="h6" fontWeight="600" sx={{ zIndex: 1 }}>
        {percentage}%
      </Typography>
    </Box>
    <Typography variant="body2" color="text.secondary">{label}</Typography>
  </Box>
);

const SimpleLineChart = ({ data, color }: { data: number[]; color: string }) => (
  <Box sx={{ height: 100, display: 'flex', alignItems: 'end', gap: 1 }}>
    {data.map((value, index) => (
      <Box 
        key={index}
        sx={{ 
          width: 8, 
          height: `${value}%`, 
          bgcolor: color,
          borderRadius: 1 
        }} 
      />
    ))}
  </Box>
);

const SimpleBarChart = ({ data }: { data: number[] }) => (
  <Box sx={{ height: 120, display: 'flex', alignItems: 'end', gap: 2, px: 2 }}>
    {data.map((value, index) => (
      <Box 
        key={index}
        sx={{ 
          width: 20, 
          height: `${value}%`, 
          bgcolor: vristoTheme.info,
          borderRadius: 1,
          position: 'relative'
        }}
      />
    ))}
  </Box>
);

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalUsers: 0,
      totalRestaurants: 0,
      totalOrders: 0,
      totalRevenue: 0,
      pendingRestaurants: 0,
      pendingOrders: 0,
      activeRiders: 0,
    },
    recentOrders: [] as any[],
    pendingRestaurants: [] as any[],
    salesData: [] as number[],
  });

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all required data in parallel using real APIs
      const [usersRes, restaurantsRes, pendingRes, approvedRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/restaurants/manage'),
        fetch('/api/admin/restaurants/pending'),
        fetch('/api/admin/restaurants/approved').catch(() => ({ json: () => ({ restaurants: [] }) })), // fallback
      ]);

      const [usersData, restaurantsData, pendingData, approvedData] = await Promise.all([
        usersRes.json(),
        restaurantsRes.json(),
        pendingRes.json(),
        approvedRes.json(),
      ]);

      // Calculate real statistics
      const totalUsers = usersData.users?.length || 0;
      const allRestaurants = restaurantsData.restaurants || [];
      const pendingRestaurants = pendingData.restaurants || [];
      const approvedRestaurants = approvedData.restaurants || allRestaurants.filter((r: any) => r.status === 'APPROVED');
      
      // Filter users by role
      const customers = usersData.users?.filter((user: any) => 
        user.primaryRole === 'CUSTOMER' || user.userRoles?.some((role: any) => role.role === 'CUSTOMER')
      ) || [];
      
      const riders = usersData.users?.filter((user: any) => 
        user.primaryRole === 'RIDER' || user.userRoles?.some((role: any) => role.role === 'RIDER')
      ) || [];

      // Mock some sales data for charts (these would come from order/payment APIs)
      const mockSalesData = [45, 65, 55, 75, 85, 95, 80, 70, 60, 65, 75, 85];
      const mockRecentOrders = [
        { id: '1', customer: 'สมชาย ใจดี', restaurant: 'ร้านอาหารไทย', total: 250, status: 'กำลังจัดส่ง' },
        { id: '2', customer: 'สมหญิง สวยงาม', restaurant: 'ร้านพิซซ่า', total: 420, status: 'เสร็จสิ้น' },
        { id: '3', customer: 'วิชาญ เก่งมาก', restaurant: 'ร้านซูชิ', total: 680, status: 'กำลังเตรียม' },
      ];

      setDashboardData({
        stats: {
          totalUsers: totalUsers,
          totalRestaurants: approvedRestaurants.length,
          totalOrders: 3192, // This would come from orders API
          totalRevenue: 125480, // This would come from payments API
          pendingRestaurants: pendingRestaurants.length,
          pendingOrders: 12, // This would come from orders API
          activeRiders: riders.filter((rider: any) => rider.status === 'ACTIVE').length,
        },
        recentOrders: mockRecentOrders,
        pendingRestaurants: pendingRestaurants,
        salesData: mockSalesData,
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      // Fallback data in case of error
      setDashboardData({
        stats: {
          totalUsers: 0,
          totalRestaurants: 0,
          totalOrders: 0,
          totalRevenue: 0,
          pendingRestaurants: 0,
          pendingOrders: 0,
          activeRiders: 0,
        },
        recentOrders: [],
        pendingRestaurants: [],
        salesData: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" fontWeight="600" gutterBottom>
          แดชบอร์ด
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ fontFamily: vristoTheme.font.family }}>
      <Typography variant="h4" fontWeight="600" gutterBottom>
        แดชบอร์ด
        </Typography>

      {/* Stats Cards */}
      <Box sx={{ 
        display: 'grid', 
        gap: 3, 
        mb: 4,
        gridTemplateColumns: { 
          xs: '1fr', 
          sm: 'repeat(2, 1fr)', 
          md: 'repeat(4, 1fr)' 
        } 
      }}>
        <Card sx={{ boxShadow: vristoTheme.shadow.card }}>
            <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="text.secondary" gutterBottom>
                ผู้ใช้ทั้งหมด
              </Typography>
                <Typography variant="h4" fontWeight="600">
                  {dashboardData.stats.totalUsers.toLocaleString()}
                </Typography>
              </Box>
              <People sx={{ fontSize: 40, color: vristoTheme.primary, opacity: 0.7 }} />
            </Box>
            </CardContent>
          </Card>
          
        <Card sx={{ boxShadow: vristoTheme.shadow.card }}>
            <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="text.secondary" gutterBottom>
                ร้านอาหาร
              </Typography>
                <Typography variant="h4" fontWeight="600">
                  {dashboardData.stats.totalRestaurants}
                </Typography>
              </Box>
              <Restaurant sx={{ fontSize: 40, color: vristoTheme.success, opacity: 0.7 }} />
            </Box>
            </CardContent>
          </Card>
          
        <Card sx={{ boxShadow: vristoTheme.shadow.card }}>
            <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  ออเดอร์ทั้งหมด
                </Typography>
                <Typography variant="h4" fontWeight="600">
                  {dashboardData.stats.totalOrders.toLocaleString()}
              </Typography>
              </Box>
              <ShoppingCart sx={{ fontSize: 40, color: vristoTheme.info, opacity: 0.7 }} />
            </Box>
            </CardContent>
          </Card>
          
        <Card sx={{ boxShadow: vristoTheme.shadow.card }}>
            <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  รายได้รวม
                </Typography>
                <Typography variant="h4" fontWeight="600">
                  ฿{dashboardData.stats.totalRevenue.toLocaleString()}
              </Typography>
              </Box>
              <AttachMoney sx={{ fontSize: 40, color: vristoTheme.secondary, opacity: 0.7 }} />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Charts and Data */}
      <Box sx={{ 
        display: 'grid', 
        gap: 3, 
        gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' } 
      }}>
        {/* Revenue Chart */}
        <Card sx={{ boxShadow: vristoTheme.shadow.card }}>
          <CardHeader 
            title="รายได้ประจำเดือน"
            subheader="฿10,840 กำไรรวม"
          />
          <CardContent>
            <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SimpleLineChart 
                data={dashboardData.salesData} 
                color={vristoTheme.primary} 
              />
            </Box>
          </CardContent>
        </Card>

        {/* Categories Chart */}
        <Card sx={{ boxShadow: vristoTheme.shadow.card }}>
          <CardHeader title="ยอดขายตามหมวดหมู่" />
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
              <DonutChart percentage={38} label="อาหารไทย" color={vristoTheme.primary} />
              <DonutChart percentage={30} label="อาหารญี่ปุ่น" color={vristoTheme.secondary} />
              <DonutChart percentage={32} label="อาหารจีน" color={vristoTheme.success} />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Additional Charts Row */}
      <Box sx={{ 
        display: 'grid', 
        gap: 3, 
        mt: 3,
        gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' } 
      }}>
        {/* Daily Sales */}
        <Card sx={{ boxShadow: vristoTheme.shadow.card }}>
          <CardHeader title="ยอดขายรายวัน" />
          <CardContent>
            <SimpleBarChart data={[60, 80, 45, 90, 70, 85, 95]} />
          </CardContent>
        </Card>

        {/* Total Orders */}
        <Card sx={{ boxShadow: vristoTheme.shadow.card }}>
          <CardHeader 
            title="ออเดอร์ทั้งหมด"
            subheader="3,192 ออเดอร์"
          />
          <CardContent>
            <Box sx={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SimpleLineChart 
                data={[55, 65, 75, 85, 95, 85, 75, 65, 70, 80, 90, 85]} 
                color={vristoTheme.success} 
              />
            </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
  );
} 