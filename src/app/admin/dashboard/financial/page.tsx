'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box,
  Typography,
  Card,
  CardContent, Box, 
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  useTheme,
  useMediaQuery,
  TextField,
  MenuItem,
 } from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AttachMoney,
  AccountBalance,
  Receipt,
  Restaurant,
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

export default function FinancialPage() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('thisMonth');
  const [financialData, setFinancialData] = useState<any>({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const generateFinancialData = () => {
    const revenue = Math.floor(Math.random() * 500000) + 1000000; // 1M-1.5M
    const expenses = revenue * 0.7; // 70% of revenue
    const netProfit = revenue - expenses;
    const growthRate = (Math.random() * 30 + 5); // 5-35%
    
    return {
      totalRevenue: revenue,
      totalExpenses: expenses,
      netProfit,
      grossMargin: ((revenue - expenses * 0.6) / revenue) * 100,
      growthRate,
      commissionRevenue: revenue * 0.15,
      deliveryRevenue: revenue * 0.08,
      transactionCount: Math.floor(Math.random() * 5000) + 10000,
      avgTransactionValue: revenue / Math.floor(Math.random() * 5000 + 10000),
      topRestaurants: [
        { name: 'ร้านข้าวผัดป้าหนู', revenue: Math.floor(Math.random() * 100000) + 50000, commission: 15 },
        { name: 'ส้มตำลาบอีสาน', revenue: Math.floor(Math.random() * 80000) + 40000, commission: 15 },
        { name: 'ก๋วยเตี๋ยวเรือ', revenue: Math.floor(Math.random() * 70000) + 35000, commission: 15 },
        { name: 'ไก่ทอดแม่นาง', revenue: Math.floor(Math.random() * 60000) + 30000, commission: 15 },
        { name: 'ข้าวหมูแดงป๊ะป๋า', revenue: Math.floor(Math.random() * 50000) + 25000, commission: 15 },
      ]
    };
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setFinancialData(generateFinancialData());
      setLoading(false);
    }, 500);
  }, [period]);

  if (loading) {
    return (
      <Box sx={{ fontFamily: vristoTheme.font.family }}>
        <Typography variant="h4" fontWeight="600" gutterBottom>
          รายงานการเงิน
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ fontFamily: vristoTheme.font.family }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="600">
          รายงานการเงิน
        </Typography>
        <TextField
          select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="thisWeek">สัปดาห์นี้</MenuItem>
          <MenuItem value="thisMonth">เดือนนี้</MenuItem>
          <MenuItem value="lastMonth">เดือนที่แล้ว</MenuItem>
          <MenuItem value="thisQuarter">ไตรมาสนี้</MenuItem>
          <MenuItem value="thisYear">ปีนี้</MenuItem>
        </TextField>
      </Box>

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
                  ฿{financialData.totalRevenue?.toLocaleString()}
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
                +{financialData.growthRate?.toFixed(1)}%
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
                  ฿{financialData.totalExpenses?.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  ค่าใช้จ่าย
                </Typography>
              </Box>
              <Receipt sx={{ fontSize: 40, opacity: 0.8 }} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <TrendingDown sx={{ fontSize: 16, mr: 0.5 }} />
              <Typography variant="body2">
                -5.2%
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
                  ฿{financialData.netProfit?.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  กำไรสุทธิ
                </Typography>
              </Box>
              <AccountBalance sx={{ fontSize: 40, opacity: 0.8 }} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
              <Typography variant="body2">
                +12.8%
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
                  {financialData.grossMargin?.toFixed(1)}%
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  อัตรากำไรขั้นต้น
                </Typography>
              </Box>
              <TrendingUp sx={{ fontSize: 40, opacity: 0.8 }} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
              <Typography variant="body2">
                +2.1%
              </Typography>
            </Box>
          </Card>
        </Box>
      </Box>

      <Box sx={ display: 'grid', gap: 3 }>
        {/* Revenue Breakdown */}
        <Box>
          <Card sx={{ boxShadow: vristoTheme.shadow.card, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                แหล่งที่มาของรายได้
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">ค่าคอมมิชชั่นร้านอาหาร</Typography>
                  <Typography variant="body2" fontWeight="600">
                    ฿{financialData.commissionRevenue?.toLocaleString()}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(financialData.commissionRevenue / financialData.totalRevenue) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#f0f0f0',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      backgroundColor: vristoTheme.primary
                    }
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {((financialData.commissionRevenue / financialData.totalRevenue) * 100).toFixed(1)}% ของรายได้รวม
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">ค่าจัดส่ง</Typography>
                  <Typography variant="body2" fontWeight="600">
                    ฿{financialData.deliveryRevenue?.toLocaleString()}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(financialData.deliveryRevenue / financialData.totalRevenue) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#f0f0f0',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      backgroundColor: vristoTheme.success
                    }
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {((financialData.deliveryRevenue / financialData.totalRevenue) * 100).toFixed(1)}% ของรายได้รวม
                </Typography>
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">รายได้อื่นๆ</Typography>
                  <Typography variant="body2" fontWeight="600">
                    ฿{(financialData.totalRevenue - financialData.commissionRevenue - financialData.deliveryRevenue)?.toLocaleString()}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={((financialData.totalRevenue - financialData.commissionRevenue - financialData.deliveryRevenue) / financialData.totalRevenue) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#f0f0f0',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      backgroundColor: vristoTheme.warning
                    }
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {(((financialData.totalRevenue - financialData.commissionRevenue - financialData.deliveryRevenue) / financialData.totalRevenue) * 100).toFixed(1)}% ของรายได้รวม
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Top Revenue Restaurants */}
        <Box>
          <Card sx={{ boxShadow: vristoTheme.shadow.card, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                ร้านอาหารยอดรายได้สูงสุด
              </Typography>
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ร้านอาหาร</TableCell>
                      <TableCell align="right">รายได้</TableCell>
                      <TableCell align="right">คอมมิชชั่น</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {financialData.topRestaurants?.map((restaurant: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar
                              sx={{ width: 32, height: 32, bgcolor: vristoTheme.secondary }}
                            >
                              <Restaurant />
                            </Avatar>
                            <Typography variant="body2" fontWeight="600">
                              {restaurant.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="600" color="primary">
                            ฿{restaurant.revenue.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="600" color="success">
                            ฿{Math.floor(restaurant.revenue * restaurant.commission / 100).toLocaleString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>

        {/* Transaction Summary */}
        <Box>
          <Card sx={{ boxShadow: vristoTheme.shadow.card, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                สรุปการทำธุรกรรม
              </Typography>
              
              <Box sx={ display: 'grid', gap: 3 }>
                <Box>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" fontWeight="700" color="primary">
                      {financialData.transactionCount?.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      จำนวนธุรกรรม
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" fontWeight="700" color="success">
                      ฿{financialData.avgTransactionValue?.toFixed(0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      มูลค่าเฉลี่ยต่อธุรกรรม
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" fontWeight="700" color="warning">
                      {((financialData.netProfit / financialData.totalRevenue) * 100).toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      อัตรากำไรสุทธิ
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
} 