'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  List,
  ListItem,
  IconButton,
  Chip,
  Button,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import {
  RestaurantOutlined,
  ShoppingBag,
  NotificationsOutlined,
  Delete,
  MarkEmailRead,
  Circle,
  ArrowBack,
} from '@mui/icons-material';

interface Notification {
  id: string;
  type: 'order' | 'delivery' | 'system' | 'promotion';
  title: string;
  message: string;
  read: boolean;
  timestamp: Date;
  data?: any;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // โหลดข้อมูล notifications (สำหรับ demo)
  useEffect(() => {
    const loadNotifications = () => {
      try {
        const savedNotifications = localStorage.getItem('notifications');
        if (savedNotifications) {
          const parsed = JSON.parse(savedNotifications);
          const notificationsWithDates = parsed.map((notif: any) => ({
            ...notif,
            timestamp: new Date(notif.timestamp)
          }));
          setNotifications(notificationsWithDates);
        } else {
          // สร้างข้อมูล demo
          const demoNotifications: Notification[] = [
            {
              id: '1',
              type: 'order',
              title: 'ออเดอร์ของคุณพร้อมแล้ว!',
              message: 'ออเดอร์ #12345 จาก Rose Garden Restaurant พร้อมส่ง ไรเดอร์กำลังมารับออเดอร์',
              read: false,
              timestamp: new Date(Date.now() - 300000), // 5 minutes ago
            },
            {
              id: '2', 
              type: 'delivery',
              title: 'ไรเดอร์กำลังส่งออเดอร์',
              message: 'คุณกิต กำลังเดินทางไปส่งออเดอร์ของคุณ คาดว่าจะถึงใน 15 นาที',
              read: false,
              timestamp: new Date(Date.now() - 900000), // 15 minutes ago
            },
            {
              id: '3',
              type: 'promotion',
              title: 'โปรโมชั่นพิเศษ!',
              message: 'ลด 50% สำหรับออเดอร์แรก ใช้โค้ด WELCOME50 วันนี้เท่านั้น!',
              read: true,
              timestamp: new Date(Date.now() - 3600000), // 1 hour ago
            },
            {
              id: '4',
              type: 'system',
              title: 'อัพเดทแอปพลิเคชั่น',
              message: 'มีฟีเจอร์ใหม่ในแอป CorgiGo! อัพเดทเลยเพื่อใช้งานฟีเจอร์ล่าสุด',
              read: true,
              timestamp: new Date(Date.now() - 7200000), // 2 hours ago
            }
          ];
          setNotifications(demoNotifications);
          localStorage.setItem('notifications', JSON.stringify(demoNotifications));
        }
      } catch (error) {
        console.error('Error loading notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  // บันทึก notifications ลง localStorage
  const saveNotifications = (newNotifications: Notification[]) => {
    localStorage.setItem('notifications', JSON.stringify(newNotifications));
    setNotifications(newNotifications);
  };

  // จำนวน notifications ที่ยังไม่ได้อ่าน
  const unreadCount = notifications.filter(n => !n.read).length;

  // ทำเครื่องหมายว่าอ่านแล้ว
  const markAsRead = (id: string) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    saveNotifications(updated);
  };

  // ทำเครื่องหมายว่าอ่านทั้งหมดแล้ว
  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  // ลบการแจ้งเตือน
  const removeNotification = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    saveNotifications(updated);
  };

  // ลบทั้งหมด
  const clearNotifications = () => {
    saveNotifications([]);
  };

  const getNotificationIcon = (type: string) => {
    const iconProps = { fontSize: 24 };
    switch (type) {
      case 'order':
        return <RestaurantOutlined sx={{ ...iconProps, color: '#10B981' }} />;
      case 'delivery':
        return <ShoppingBag sx={{ ...iconProps, color: '#3B82F6' }} />;
      case 'promotion':
        return <NotificationsOutlined sx={{ ...iconProps, color: '#F59E0B' }} />;
      case 'system':
        return <NotificationsOutlined sx={{ ...iconProps, color: '#6B7280' }} />;
      default:
        return <NotificationsOutlined sx={{ ...iconProps, color: '#6B7280' }} />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'order': return 'ออเดอร์';
      case 'delivery': return 'การส่ง';
      case 'promotion': return 'โปรโมชั่น';
      case 'system': return 'ระบบ';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'order': return '#10B981';
      case 'delivery': return '#3B82F6';
      case 'promotion': return '#F59E0B';
      case 'system': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'เมื่อสักครู่';
    if (minutes < 60) return `${minutes} นาทีที่แล้ว`;
    if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
    return `${days} วันที่แล้ว`;
  };

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          bgcolor: 'white',
          borderBottom: '1px solid #F0F0F0',
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}>
          <IconButton onClick={() => router.back()}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ fontFamily: 'Prompt, sans-serif', fontWeight: 600 }}>
            การแจ้งเตือน
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <Box sx={{ 
        bgcolor: 'white',
        borderBottom: '1px solid #F0F0F0',
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}>
        <IconButton 
          onClick={() => router.back()}
          sx={{ color: '#1A1A1A' }}
        >
          <ArrowBack />
        </IconButton>
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Prompt, sans-serif',
            fontWeight: 600,
            color: '#1A1A1A',
            flex: 1
          }}
        >
          การแจ้งเตือน
        </Typography>
        {unreadCount > 0 && (
          <Chip 
            label={`${unreadCount} ใหม่`}
            size="small"
            sx={{
              bgcolor: '#EF4444',
              color: 'white',
              fontFamily: 'Prompt, sans-serif',
              fontWeight: 500
            }}
          />
        )}
      </Box>

      {/* Content */}
      <Box sx={{ 
        flex: 1,
        overflow: 'auto',
        bgcolor: '#F8F9FA',
        '&::-webkit-scrollbar': { display: 'none' },
        '-ms-overflow-style': 'none',
        'scrollbar-width': 'none'
      }}>
        {/* Header Actions */}
        {notifications.length > 0 && (
          <Box sx={{ p: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {unreadCount > 0 && (
              <Button
                variant="outlined"
                startIcon={<MarkEmailRead />}
                onClick={markAllAsRead}
                size="small"
                sx={{
                  fontFamily: 'Prompt, sans-serif',
                  textTransform: 'none'
                }}
              >
                อ่านทั้งหมด
              </Button>
            )}
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={clearNotifications}
              size="small"
              sx={{
                fontFamily: 'Prompt, sans-serif',
                textTransform: 'none'
              }}
            >
              ลบทั้งหมด
            </Button>
          </Box>
        )}

        {/* Notifications List */}
        {notifications.length === 0 ? (
          // Empty State
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            px: 3,
            textAlign: 'center'
          }}>
            <Box sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              bgcolor: '#F0F0F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3
            }}>
              <NotificationsOutlined sx={{ fontSize: 60, color: '#BDBDBD' }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Prompt, sans-serif',
                fontWeight: 600,
                color: '#666',
                mb: 1,
              }}
            >
              ไม่มีการแจ้งเตือน
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'Prompt, sans-serif',
                color: '#999',
                lineHeight: 1.6
              }}
            >
              การแจ้งเตือนจะปรากฏที่นี่{'\n'}เมื่อมีกิจกรรมใหม่
            </Typography>
          </Box>
        ) : (
          // Notifications List
          <Box sx={{ px: 2, pb: 2 }}>
            {notifications.map((notification) => (
              <Card 
                key={notification.id} 
                sx={{ 
                  mb: 2, 
                  borderRadius: 2, 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  ...(notification.read ? {} : {
                    bgcolor: '#FFF8F0',
                    border: '1px solid #F8A66E',
                  }),
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }
                }}
                onClick={() => {
                  if (!notification.read) {
                    markAsRead(notification.id);
                  }
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {/* Notification Icon */}
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        bgcolor: `${getTypeColor(notification.type)}15`,
                        flexShrink: 0,
                      }}
                    >
                      {getNotificationIcon(notification.type)}
                    </Avatar>

                    {/* Notification Content */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                        <Typography
                          sx={{
                            fontFamily: 'Prompt, sans-serif',
                            fontWeight: notification.read ? 500 : 600,
                            color: notification.read ? '#6B7280' : '#1F2937',
                            fontSize: '0.95rem',
                            flex: 1,
                          }}
                        >
                          {notification.title}
                        </Typography>
                        
                        {/* Unread Indicator & Actions */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
                          {!notification.read && (
                            <Circle sx={{ fontSize: 8, color: '#EF4444' }} />
                          )}
                          <IconButton 
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                            sx={{ 
                              color: '#9CA3AF',
                              '&:hover': { 
                                color: '#EF4444',
                                bgcolor: '#FEF2F2'
                              }
                            }}
                          >
                            <Delete sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Box>
                      </Box>

                      <Typography
                        sx={{
                          color: '#6B7280',
                          fontSize: '0.85rem',
                          mb: 1.5,
                          lineHeight: 1.4,
                          fontFamily: 'Prompt, sans-serif',
                        }}
                      >
                        {notification.message}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                        <Chip
                          label={getTypeLabel(notification.type)}
                          size="small"
                          sx={{
                            bgcolor: `${getTypeColor(notification.type)}15`,
                            color: getTypeColor(notification.type),
                            fontFamily: 'Prompt, sans-serif',
                            fontSize: '0.7rem',
                            height: 24,
                          }}
                        />
                        <Typography
                          sx={{
                            color: '#9CA3AF',
                            fontSize: '0.75rem',
                            fontFamily: 'Prompt, sans-serif',
                          }}
                        >
                          {formatTime(notification.timestamp)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}

            {/* Bottom Spacing */}
            <Box sx={{ height: 20 }} />
          </Box>
        )}
      </Box>
    </Box>
  );
} 