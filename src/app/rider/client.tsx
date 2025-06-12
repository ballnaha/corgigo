'use client';

import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
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
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  TwoWheeler,
  AccountCircle,
  Star,
  Schedule,
  AttachMoney,
  Navigation,
  Phone,
  CheckCircle,
  Assignment,
  TrendingUp,
} from '@mui/icons-material';

export default function RiderPage() {
  const [isOnline, setIsOnline] = useState(false);
  const [selectedTab, setSelectedTab] = useState('dashboard');

  // Mock data
  const riderStats = {
    rating: 4.8,
    totalDeliveries: 247,
    todayEarnings: 650,
    weeklyEarnings: 3200,
    completionRate: 95,
  };

  const availableJobs = [
    {
      id: '1',
      orderNumber: 'CG123456',
      restaurant: 'ร้านส้มตำป้าแดง',
      customer: 'คุณสมชาย',
      pickupAddress: '123 ถ.สุขุมวิท แขวงคลองตัน',
      deliveryAddress: '456 ถ.รามคำแหง แขวงหัวหมาก',
      distance: '3.2 กม.',
      deliveryFee: 25,
      estimatedTime: '30 นาที',
    },
    {
      id: '2',
      orderNumber: 'CG123457',
      restaurant: 'KFC สาขาเซ็นทรัล',
      customer: 'คุณสมหญิง',
      pickupAddress: '789 ถ.พหลโยธิน แขวงจตุจักร',
      deliveryAddress: '321 ถ.ลาดพร้าว แขวงวังทองหลาง',
      distance: '2.8 กม.',
      deliveryFee: 30,
      estimatedTime: '25 นาที',
    },
  ];

  const activeDelivery = {
    id: '3',
    orderNumber: 'CG123458',
    restaurant: 'ร้านข้าวผัดปูป้าหนิง',
    customer: 'คุณมาลี',
    customerPhone: '081-234-5678',
    pickupAddress: '111 ถ.สีลม แขวงสีลม',
    deliveryAddress: '222 ถ.สาทร แขวงยานนาวา',
    status: 'กำลังไปรับอาหาร',
    progress: 30,
    deliveryFee: 35,
  };

  const todayDeliveries = [
    {
      id: '4',
      orderNumber: 'CG123454',
      restaurant: 'McDonald\'s',
      deliveredAt: '14:30',
      fee: 25,
      rating: 5,
    },
    {
      id: '5',
      orderNumber: 'CG123453',
      restaurant: 'Burger King',
      deliveredAt: '13:15',
      fee: 30,
      rating: 4,
    },
    {
      id: '6',
      orderNumber: 'CG123452',
      restaurant: 'Pizza Hut',
      deliveredAt: '12:00',
      fee: 40,
      rating: 5,
    },
  ];

  const handleAcceptJob = (jobId: string) => {
    console.log('Accepted job:', jobId);
    // Logic to accept job
  };

  const handleCompleteDelivery = () => {
    console.log('Delivery completed');
    // Logic to complete delivery
  };

  return (
    <>
      {/* Header */}
      <AppBar position="fixed" sx={{ bgcolor: 'primary.main' }}>
        <Toolbar>
          <TwoWheeler sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            CorgiGo Rider
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={isOnline}
                onChange={(e) => setIsOnline(e.target.checked)}
                color="secondary"
              />
            }
            label={isOnline ? 'ออนไลน์' : 'ออฟไลน์'}
            sx={{ color: 'white', mr: 2 }}
          />
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ pt: 8, pb: 4 }}>
        <Container maxWidth="lg" sx={{ mt: 2 }}>
          {/* Status Card */}
          <Card sx={{ mb: 3, bgcolor: isOnline ? 'success.50' : 'grey.50' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    สถานะ: {isOnline ? 'พร้อมรับงาน' : 'ออฟไลน์'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {isOnline
                      ? 'คุณสามารถรับงานใหม่ได้'
                      : 'เปิดสถานะออนไลน์เพื่อรับงาน'
                    }
                  </Typography>
                </Box>
                <Chip
                  label={isOnline ? 'ออนไลน์' : 'ออฟไลน์'}
                  color={isOnline ? 'success' : 'default'}
                  size="large"
                />
              </Box>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Star sx={{ color: '#FFD700', fontSize: 30, mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {riderStats.rating}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  คะแนน
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Assignment sx={{ color: 'primary.main', fontSize: 30, mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {riderStats.totalDeliveries}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  งานที่ส่งแล้ว
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <AttachMoney sx={{ color: 'success.main', fontSize: 30, mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  ฿{riderStats.todayEarnings}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  รายได้วันนี้
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <TrendingUp sx={{ color: 'info.main', fontSize: 30, mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {riderStats.completionRate}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  อัตราสำเร็จ
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Active Delivery */}
          {activeDelivery && isOnline && (
            <Card sx={{ mb: 3, bgcolor: 'warning.50', border: 2, borderColor: 'warning.main' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  🚚 งานปัจจุบัน - {activeDelivery.orderNumber}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {activeDelivery.restaurant}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ลูกค้า: {activeDelivery.customer}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    สถานะ: {activeDelivery.status}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={activeDelivery.progress}
                    sx={{ mt: 1, height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      รับอาหาร: {activeDelivery.pickupAddress}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      ส่งที่: {activeDelivery.deliveryAddress}
                    </Typography>
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<Navigation />}
                    size="small"
                  >
                    นำทาง
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Phone />}
                    size="small"
                  >
                    โทรลูกค้า
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircle />}
                    onClick={handleCompleteDelivery}
                    size="small"
                  >
                    ส่งสำเร็จ
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Available Jobs */}
          {isOnline && !activeDelivery && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                งานที่รอรับ
              </Typography>
              {availableJobs.length > 0 ? (
                availableJobs.map((job) => (
                  <Card key={job.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {job.restaurant}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {job.orderNumber} • ลูกค้า: {job.customer}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                            ฿{job.deliveryFee}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {job.distance} • {job.estimatedTime}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          <strong>รับที่:</strong> {job.pickupAddress}
                        </Typography>
                        <Typography variant="body2">
                          <strong>ส่งที่:</strong> {job.deliveryAddress}
                        </Typography>
                      </Box>

                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleAcceptJob(job.id)}
                      >
                        รับงาน
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <Assignment sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    ไม่มีงานใหม่ในขณะนี้
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    รอสักครู่ งานใหม่จะมาเร็วๆ นี้
                  </Typography>
                </Paper>
              )}
            </Box>
          )}

          {/* Today's Deliveries */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              งานที่ส่งวันนี้
            </Typography>
            {todayDeliveries.length > 0 ? (
              <Card>
                <CardContent>
                  {todayDeliveries.map((delivery, index) => (
                    <Box key={delivery.id}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {delivery.restaurant}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {delivery.orderNumber} • {delivery.deliveredAt}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            ฿{delivery.fee}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Star sx={{ color: '#FFD700', mr: 0.5, fontSize: 16 }} />
                            <Typography variant="body2">{delivery.rating}</Typography>
                          </Box>
                        </Box>
                      </Box>
                      {index < todayDeliveries.length - 1 && <Divider />}
                    </Box>
                  ))}
                </CardContent>
              </Card>
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  ยังไม่มีงานที่ส่งวันนี้
                </Typography>
              </Paper>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
} 