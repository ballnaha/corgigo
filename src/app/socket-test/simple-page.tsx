'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useSocket } from '@/hooks/useSocket';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  Alert,
  Badge,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Send as SendIcon,
  Clear as ClearIcon,
  Restaurant as RestaurantIcon,
  DeliveryDining as RiderIcon,
  Person as CustomerIcon,
  AdminPanelSettings as AdminIcon,
  Notifications as NotificationIcon,
} from '@mui/icons-material';
import { OrderNotification, RiderNotification } from '@/lib/socket';

export default function SimpleSocketTestPage() {
  const { data: session } = useSession();
  const [testMessage, setTestMessage] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [showOrderDialog, setShowOrderDialog] = useState(false);

  // Mock user data for testing
  const mockUser = session?.user ? {
    id: session.user.id || 'test-user-id',
    name: session.user.name || 'Test User',
    email: session.user.email || 'test@example.com',
    role: (session.user.currentRole || session.user.primaryRole) as 'CUSTOMER' | 'RESTAURANT' | 'RIDER' | 'ADMIN',
    restaurantId: session.user.restaurant?.id
  } : {
    id: 'guest-user',
    name: 'Guest User',
    email: 'guest@example.com',
    role: 'CUSTOMER' as const
  };

  const {
    isConnected,
    isAuthenticated,
    userCounts,
    testMessages,
    newOrders,
    orderUpdates,
    connect,
    disconnect,
    sendTestMessage,
    sendOrderNotification,
    updateOrderStatus,
    clearTestMessages,
    clearNewOrders,
    clearOrderUpdates,
  } = useSocket({ user: mockUser });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'CUSTOMER': return <CustomerIcon />;
      case 'RESTAURANT': return <RestaurantIcon />;
      case 'RIDER': return <RiderIcon />;
      case 'ADMIN': return <AdminIcon />;
      default: return <CustomerIcon />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'CUSTOMER': return 'primary';
      case 'RESTAURANT': return 'success';
      case 'RIDER': return 'warning';
      case 'ADMIN': return 'error';
      default: return 'default';
    }
  };

  const handleSendTestMessage = () => {
    if (!testMessage.trim()) return;
    sendTestMessage(testMessage, targetRole || undefined);
    setTestMessage('');
  };

  const handleSendOrderNotification = () => {
    const mockOrder: OrderNotification = {
      orderId: `ORDER-${Date.now()}`,
      customerId: mockUser.id,
      customerName: mockUser.name,
      restaurantId: 'restaurant-123',
      restaurantName: 'Rose Garden Restaurant',
      items: [
        { name: 'Pad Thai', quantity: 2, price: 120 },
        { name: 'Tom Yum Soup', quantity: 1, price: 80 }
      ],
      totalAmount: 320,
      deliveryAddress: '123 Test Street, Bangkok',
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    sendOrderNotification(mockOrder);
    setShowOrderDialog(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        🔌 Socket.IO Test Dashboard
      </Typography>

      {/* Connection Status */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Chip
                label={isConnected ? 'เชื่อมต่อแล้ว' : 'ไม่ได้เชื่อมต่อ'}
                color={isConnected ? 'success' : 'error'}
                variant="filled"
              />
              <Chip
                label={isAuthenticated ? 'ยืนยันตัวตนแล้ว' : 'ยังไม่ยืนยันตัวตน'}
                color={isAuthenticated ? 'success' : 'warning'}
                variant="outlined"
              />
            </Box>
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                onClick={connect}
                disabled={isConnected}
                size="small"
              >
                เชื่อมต่อ
              </Button>
              <Button
                variant="outlined"
                onClick={disconnect}
                disabled={!isConnected}
                size="small"
                color="error"
              >
                ตัดการเชื่อมต่อ
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* User Info & Stats */}
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3} mb={3}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              ข้อมูลผู้ใช้ปัจจุบัน
            </Typography>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              {getRoleIcon(mockUser.role)}
              <Box>
                <Typography variant="body1" fontWeight="bold">
                  {mockUser.name}
                </Typography>
                <Chip
                  label={mockUser.role}
                  color={getRoleColor(mockUser.role) as any}
                  size="small"
                />
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Email: {mockUser.email}
            </Typography>
            {mockUser.restaurantId && (
              <Typography variant="body2" color="text.secondary">
                Restaurant ID: {mockUser.restaurantId}
              </Typography>
            )}
          </CardContent>
        </Card>
        
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              ผู้ใช้ที่เชื่อมต่ออยู่
            </Typography>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="h4" color="primary">
                {userCounts.total}
              </Typography>
              <Typography variant="body2">ทั้งหมด</Typography>
            </Box>
            <Box display="flex" flexDirection="column" gap={0.5}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">ลูกค้า:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {userCounts.customers}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">ร้านค้า:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {userCounts.restaurants}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">ไรเดอร์:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {userCounts.riders}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">แอดมิน:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {userCounts.admins}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Test Controls */}
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3} mb={3}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              ส่งข้อความทดสอบ
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                fullWidth
                label="ข้อความ"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendTestMessage()}
                disabled={!isAuthenticated}
              />
              <FormControl fullWidth>
                <InputLabel>ส่งถึงกลุ่ม (ว่างไว้ = ทุกคน)</InputLabel>
                <Select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  disabled={!isAuthenticated}
                >
                  <MenuItem value="">ทุกคน</MenuItem>
                  <MenuItem value="CUSTOMER">ลูกค้า</MenuItem>
                  <MenuItem value="RESTAURANT">ร้านค้า</MenuItem>
                  <MenuItem value="RIDER">ไรเดอร์</MenuItem>
                  <MenuItem value="ADMIN">แอดมิน</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                onClick={handleSendTestMessage}
                disabled={!isAuthenticated || !testMessage.trim()}
                startIcon={<SendIcon />}
              >
                ส่งข้อความ
              </Button>
            </Box>
          </CardContent>
        </Card>
        
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              ทดสอบการแจ้งเตือน
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <Button
                variant="outlined"
                onClick={() => setShowOrderDialog(true)}
                disabled={!isAuthenticated}
                startIcon={<RestaurantIcon />}
                fullWidth
              >
                ส่งการแจ้งเตือนออเดอร์ใหม่
              </Button>
              <Button
                variant="outlined"
                onClick={() => updateOrderStatus('ORDER-123', 'CONFIRMED', 'Order confirmed by restaurant')}
                disabled={!isAuthenticated}
                startIcon={<NotificationIcon />}
                fullWidth
              >
                อัปเดตสถานะออเดอร์
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Messages Display */}
      <Box display="flex" flexDirection={{ xs: 'column', lg: 'row' }} gap={3}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                ข้อความทดสอบ
                <Badge badgeContent={testMessages.length} color="primary" sx={{ ml: 1 }} />
              </Typography>
              <IconButton onClick={clearTestMessages} size="small">
                <ClearIcon />
              </IconButton>
            </Box>
            <Paper sx={{ maxHeight: 300, overflow: 'auto' }}>
              <List dense>
                {testMessages.length === 0 ? (
                  <ListItem>
                    <ListItemText secondary="ยังไม่มีข้อความ" />
                  </ListItem>
                ) : (
                  testMessages.map((msg) => (
                    <ListItem key={msg.id}>
                      <ListItemText
                        primary={msg.message}
                        secondary={
                          <Box>
                            <Chip
                              label={msg.senderRole}
                              size="small"
                              color={getRoleColor(msg.senderRole) as any}
                              sx={{ mr: 1 }}
                            />
                            {msg.sender} - {new Date(msg.timestamp).toLocaleTimeString('th-TH')}
                          </Box>
                        }
                      />
                    </ListItem>
                  ))
                )}
              </List>
            </Paper>
          </CardContent>
        </Card>
        
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                ออเดอร์ใหม่
                <Badge badgeContent={newOrders.length} color="success" sx={{ ml: 1 }} />
              </Typography>
              <IconButton onClick={clearNewOrders} size="small">
                <ClearIcon />
              </IconButton>
            </Box>
            <Paper sx={{ maxHeight: 300, overflow: 'auto' }}>
              <List dense>
                {newOrders.length === 0 ? (
                  <ListItem>
                    <ListItemText secondary="ยังไม่มีออเดอร์ใหม่" />
                  </ListItem>
                ) : (
                  newOrders.map((order) => (
                    <ListItem key={order.orderId}>
                      <ListItemText
                        primary={`${order.orderId} - ฿${order.totalAmount}`}
                        secondary={
                          <Box>
                            <Typography variant="body2">
                              {order.customerName} → {order.restaurantName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(order.createdAt).toLocaleString('th-TH')}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))
                )}
              </List>
            </Paper>
          </CardContent>
        </Card>
        
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                อัปเดตสถานะ
                <Badge badgeContent={orderUpdates.length} color="warning" sx={{ ml: 1 }} />
              </Typography>
              <IconButton onClick={clearOrderUpdates} size="small">
                <ClearIcon />
              </IconButton>
            </Box>
            <Paper sx={{ maxHeight: 300, overflow: 'auto' }}>
              <List dense>
                {orderUpdates.length === 0 ? (
                  <ListItem>
                    <ListItemText secondary="ยังไม่มีการอัปเดต" />
                  </ListItem>
                ) : (
                  orderUpdates.map((update, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={`${update.orderId}: ${update.status}`}
                        secondary={
                          <Box>
                            <Typography variant="body2">
                              โดย {update.updatedBy} ({update.updatedByRole})
                            </Typography>
                            {update.message && (
                              <Typography variant="caption">
                                {update.message}
                              </Typography>
                            )}
                            <Typography variant="caption" color="text.secondary" display="block">
                              {new Date(update.timestamp).toLocaleString('th-TH')}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))
                )}
              </List>
            </Paper>
          </CardContent>
        </Card>
      </Box>

      {/* Order Dialog */}
      <Dialog open={showOrderDialog} onClose={() => setShowOrderDialog(false)}>
        <DialogTitle>ส่งการแจ้งเตือนออเดอร์ใหม่</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            จะส่งออเดอร์จำลองไปยังร้านค้า, ไรเดอร์, และแอดมิน
          </Alert>
          <Typography variant="body2">
            ออเดอร์จำลอง: Pad Thai x2, Tom Yum Soup x1<br />
            ยอดรวม: ฿320<br />
            ร้านค้า: Rose Garden Restaurant
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowOrderDialog(false)}>ยกเลิก</Button>
          <Button onClick={handleSendOrderNotification} variant="contained">
            ส่งการแจ้งเตือน
          </Button>
        </DialogActions>
      </Dialog>

      {!isConnected && (
        <Alert severity="warning" sx={{ mt: 3 }}>
          กรุณาเชื่อมต่อ Socket.IO เพื่อทดสอบฟีเจอร์ต่างๆ
        </Alert>
      )}
    </Container>
  );
} 