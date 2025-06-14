'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  List,
  ListItem,
  IconButton,
  Chip,
  Button,
  Divider,
  Card,
  CardContent,
  Container,
} from '@mui/material';
import {
  RestaurantOutlined,
  ShoppingBag,
  NotificationsOutlined,
  Delete,
  MarkEmailRead,
  Circle,
} from '@mui/icons-material';
import { useNotifications } from '@/contexts/NotificationContext';
import AppLayout from '@/components/AppLayout';

export default function NotificationsPage() {
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    removeNotification,
  } = useNotifications();

  const handleBack = () => {
    router.back();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <RestaurantOutlined sx={{ fontSize: 24, color: '#4CAF50' }} />;
      case 'delivery':
        return <ShoppingBag sx={{ fontSize: 24, color: '#2196F3' }} />;
      case 'system':
        return <NotificationsOutlined sx={{ fontSize: 24, color: '#666' }} />;
      default:
        return <NotificationsOutlined sx={{ fontSize: 24, color: '#666' }} />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'order': return 'ออเดอร์';
      case 'delivery': return 'การส่ง';
      case 'system': return 'ระบบ';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'order': return 'success';
      case 'delivery': return 'info';
      case 'system': return 'default';
      default: return 'default';
    }
  };

  return (
    <AppLayout
      showBackOnly={true}
      backTitle="การแจ้งเตือน"
      onBackClick={handleBack}
      hideFooter={true}
    >
      <Container maxWidth="md" sx={{ py: 2 }}>
        {/* Header Actions */}
        {notifications.length > 0 && (
          <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {unreadCount > 0 && (
              <Button
                variant="outlined"
                startIcon={<MarkEmailRead />}
                onClick={markAllAsRead}
                size="small"
              >
                อ่านทั้งหมด ({unreadCount})
              </Button>
            )}
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={clearNotifications}
              size="small"
            >
              ลบทั้งหมด
            </Button>
          </Box>
        )}

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 6 }}>
            <CardContent>
              <NotificationsOutlined sx={{ fontSize: 64, color: '#E0E0E0', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                ไม่มีการแจ้งเตือน
              </Typography>
              <Typography variant="body2" color="text.secondary">
                การแจ้งเตือนจะปรากฏที่นี่เมื่อมีกิจกรรมใหม่
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <List sx={{ p: 0 }}>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  sx={{
                    p: 0,
                    mb: 1,
                  }}
                >
                  <Card
                    sx={{
                      width: '100%',
                      ...(notification.read ? {} : {
                        bgcolor: '#FFF8F0',
                        border: '1px solid #F8A66E',
                      }),
                    }}
                  >
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        {/* Notification Icon */}
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            bgcolor: notification.type === 'order' ? '#E8F5E8' : 
                                    notification.type === 'delivery' ? '#E8F0FF' : '#F0F0F0',
                          }}
                        >
                          {getNotificationIcon(notification.type)}
                        </Box>

                        {/* Notification Content */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                            <Typography
                              variant="body1"
                              sx={{
                                fontFamily: 'Prompt, sans-serif',
                                fontWeight: notification.read ? 400 : 600,
                                color: notification.read ? '#666' : '#1A1A1A',
                                flex: 1,
                              }}
                            >
                              {notification.title}
                            </Typography>
                            
                            {/* Unread Indicator */}
                            {!notification.read && (
                              <Circle
                                sx={{
                                  fontSize: 10,
                                  color: '#F8A66E',
                                  ml: 1,
                                  flexShrink: 0,
                                }}
                              />
                            )}
                          </Box>

                          <Typography
                            variant="body2"
                            sx={{
                              color: '#999',
                              mb: 1,
                              lineHeight: 1.4,
                            }}
                          >
                            {notification.message}
                          </Typography>

                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip
                                label={getTypeLabel(notification.type)}
                                size="small"
                                color={getTypeColor(notification.type) as any}
                                variant="outlined"
                              />
                              <Typography
                                variant="caption"
                                sx={{
                                  color: '#BBB',
                                  fontSize: '0.75rem',
                                }}
                              >
                                {new Date(notification.timestamp).toLocaleString('th-TH', {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {!notification.read && (
                                <IconButton
                                  size="small"
                                  onClick={() => markAsRead(notification.id)}
                                  sx={{ color: '#F8A66E' }}
                                >
                                  <MarkEmailRead sx={{ fontSize: 18 }} />
                                </IconButton>
                              )}
                              <IconButton
                                size="small"
                                onClick={() => removeNotification(notification.id)}
                                sx={{ color: '#999' }}
                              >
                                <Delete sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Box>
                          </Box>

                          {/* Order ID if available */}
                          {notification.orderId && (
                            <Typography
                              variant="caption"
                              sx={{
                                color: '#F8A66E',
                                fontFamily: 'monospace',
                                mt: 1,
                                display: 'block',
                              }}
                            >
                              Order: {notification.orderId}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </ListItem>
                {index < notifications.length - 1 && <Divider sx={{ my: 1 }} />}
              </React.Fragment>
            ))}
          </List>
        )}

        {/* Summary */}
        {notifications.length > 0 && (
          <Box sx={{ mt: 3, p: 2, bgcolor: '#F8F8F8', borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary" align="center">
              ทั้งหมด {notifications.length} การแจ้งเตือน
              {unreadCount > 0 && ` • ${unreadCount} ยังไม่ได้อ่าน`}
            </Typography>
          </Box>
        )}
      </Container>
    </AppLayout>
  );
} 