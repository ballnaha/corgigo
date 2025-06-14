'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { useSocket } from '@/hooks/useSocket';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'delivery' | 'system';
  timestamp: string;
  read: boolean;
  orderId?: string;
  data?: any;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  removeNotification: (notificationId: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Mock user data for Socket.IO
  const mockUser = session?.user ? {
    id: session.user.id || 'user-id',
    name: session.user.name || 'User',
    email: session.user.email || 'user@example.com',
    role: (session.user.currentRole || session.user.primaryRole) as 'CUSTOMER' | 'RESTAURANT' | 'RIDER' | 'ADMIN',
    restaurantId: session.user.restaurant?.id
  } : undefined;

  // Connect to Socket.IO
  const {
    isConnected,
    isAuthenticated,
    testMessages,
    newOrders,
    orderUpdates,
  } = useSocket({ user: mockUser, autoConnect: !!session?.user });

  // Add notification function
  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const notification: Notification = {
      ...notificationData,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setNotifications(prev => [notification, ...prev]);

    // Show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id,
      });
    }
  };

  // Mark notification as read
  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  // Remove specific notification
  const removeNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  // Calculate unread count
  const unreadCount = notifications.filter(notif => !notif.read).length;

  // Listen to Socket.IO events and create notifications
  useEffect(() => {
    if (!isAuthenticated) return;

    // Handle test messages
    testMessages.forEach(message => {
      if (message.senderRole !== mockUser?.role) {
        addNotification({
          title: 'ข้อความทดสอบ',
          message: `${message.sender}: ${message.message}`,
          type: 'system',
        });
      }
    });
  }, [testMessages, isAuthenticated, mockUser?.role]);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Handle new orders (for restaurants)
    newOrders.forEach(order => {
      if (mockUser?.role === 'RESTAURANT' && order.restaurantId === mockUser.restaurantId) {
        addNotification({
          title: 'ออเดอร์ใหม่!',
          message: `ออเดอร์จาก ${order.customerName} มูลค่า ฿${order.totalAmount}`,
          type: 'order',
          orderId: order.orderId,
          data: order,
        });
      } else if (mockUser?.role === 'RIDER') {
        addNotification({
          title: 'งานส่งอาหารใหม่',
          message: `มีงานส่งอาหารจาก ${order.restaurantName}`,
          type: 'delivery',
          orderId: order.orderId,
          data: order,
        });
      } else if (mockUser?.role === 'ADMIN') {
        addNotification({
          title: 'ออเดอร์ใหม่ในระบบ',
          message: `ออเดอร์ ${order.orderId} จาก ${order.customerName}`,
          type: 'order',
          orderId: order.orderId,
          data: order,
        });
      }
    });
  }, [newOrders, isAuthenticated, mockUser?.role, mockUser?.restaurantId]);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Handle order status updates
    orderUpdates.forEach(update => {
      if (mockUser?.role === 'CUSTOMER') {
        // Notify customers about their order updates
        addNotification({
          title: 'อัปเดตสถานะออเดอร์',
          message: `ออเดอร์ ${update.orderId} ${getStatusText(update.status)}`,
          type: 'order',
          orderId: update.orderId,
          data: update,
        });
      } else if (mockUser?.role === 'RESTAURANT' || mockUser?.role === 'RIDER') {
        // Notify restaurants and riders about order updates
        addNotification({
          title: 'อัปเดตสถานะออเดอร์',
          message: `ออเดอร์ ${update.orderId} ถูกอัปเดตเป็น ${update.status}`,
          type: 'order',
          orderId: update.orderId,
          data: update,
        });
      }
    });
  }, [orderUpdates, isAuthenticated, mockUser?.role]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Helper function to get status text in Thai
  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'รอการยืนยัน';
      case 'CONFIRMED': return 'ยืนยันแล้ว';
      case 'PREPARING': return 'กำลังเตรียม';
      case 'READY': return 'พร้อมส่ง';
      case 'DELIVERING': return 'กำลังส่ง';
      case 'DELIVERED': return 'ส่งแล้ว';
      case 'CANCELLED': return 'ยกเลิกแล้ว';
      default: return status;
    }
  };

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    removeNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 