import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { SocketUser, OrderNotification, RiderNotification } from '@/lib/socket';

interface UseSocketProps {
  user?: {
    id: string;
    name: string;
    email: string;
    role: 'CUSTOMER' | 'RESTAURANT' | 'RIDER' | 'ADMIN';
    restaurantId?: string;
  };
  autoConnect?: boolean;
}

interface TestMessage {
  id: string;
  message: string;
  sender: string;
  senderRole: string;
  timestamp: string;
}

interface UserCounts {
  total: number;
  customers: number;
  restaurants: number;
  riders: number;
  admins: number;
}

interface OrderStatusUpdate {
  orderId: string;
  status: string;
  message?: string;
  updatedBy: string;
  updatedByRole: string;
  timestamp: string;
}

export function useSocket({ user, autoConnect = true }: UseSocketProps = {}) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userCounts, setUserCounts] = useState<UserCounts>({
    total: 0,
    customers: 0,
    restaurants: 0,
    riders: 0,
    admins: 0
  });
  const [testMessages, setTestMessages] = useState<TestMessage[]>([]);
  const [newOrders, setNewOrders] = useState<OrderNotification[]>([]);
  const [orderUpdates, setOrderUpdates] = useState<OrderStatusUpdate[]>([]);

  // Connect to socket
  const connect = () => {
    if (socketRef.current?.connected) return;

    socketRef.current = io(process.env.NODE_ENV === 'production' ? '' : 'https://corgigo.treetelu.com', {
      path: '/api/socket',
      addTrailingSlash: false,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      setIsConnected(true);

      // Auto-authenticate if user data is provided
      if (user) {
        authenticate(user);
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
      setIsAuthenticated(false);
    });

    socket.on('authenticated', (data) => {
      console.log('Socket authenticated:', data);
      setIsAuthenticated(true);
    });

    socket.on('userCountUpdate', (counts: UserCounts) => {
      setUserCounts(counts);
    });

    socket.on('testMessage', (message: TestMessage) => {
      console.log('Test message received:', message);
      setTestMessages(prev => [...prev, message]);
    });

    socket.on('newOrder', (order: OrderNotification) => {
      console.log('New order received:', order);
      setNewOrders(prev => [...prev, order]);
    });

    socket.on('orderAvailable', (orderInfo) => {
      console.log('Order available for delivery:', orderInfo);
    });

    socket.on('deliveryRequest', (riderData: RiderNotification) => {
      console.log('Delivery request received:', riderData);
    });

    socket.on('orderStatusUpdate', (update: OrderStatusUpdate) => {
      console.log('Order status update:', update);
      setOrderUpdates(prev => [...prev, update]);
    });

    socket.on('orderCreated', (order: OrderNotification) => {
      console.log('Order created (admin notification):', order);
    });

    socket.on('deliveryAssignment', (assignment) => {
      console.log('Delivery assignment (admin notification):', assignment);
    });
  };

  // Disconnect from socket
  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      setIsAuthenticated(false);
    }
  };

  // Authenticate user
  const authenticate = (userData: UseSocketProps['user']) => {
    if (!socketRef.current || !userData) return;

    const socketUser: Omit<SocketUser, 'socketId'> = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      restaurantId: userData.restaurantId
    };

    socketRef.current.emit('authenticate', socketUser);
  };

  // Send test message
  const sendTestMessage = (message: string, targetRole?: string) => {
    if (!socketRef.current || !isAuthenticated) return;

    socketRef.current.emit('sendTestMessage', { message, targetRole });
  };

  // Send order notification (for testing)
  const sendOrderNotification = (orderData: OrderNotification) => {
    if (!socketRef.current || !isAuthenticated) return;

    socketRef.current.emit('sendOrderNotification', orderData);
  };

  // Send rider notification (for testing)
  const sendRiderNotification = (riderData: RiderNotification) => {
    if (!socketRef.current || !isAuthenticated) return;

    socketRef.current.emit('sendRiderNotification', riderData);
  };

  // Update order status
  const updateOrderStatus = (orderId: string, status: string, message?: string) => {
    if (!socketRef.current || !isAuthenticated) return;

    socketRef.current.emit('updateOrderStatus', { orderId, status, message });
  };

  // Clear messages
  const clearTestMessages = () => setTestMessages([]);
  const clearNewOrders = () => setNewOrders([]);
  const clearOrderUpdates = () => setOrderUpdates([]);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect]);

  // Re-authenticate when user changes
  useEffect(() => {
    if (user && isConnected && !isAuthenticated) {
      authenticate(user);
    }
  }, [user, isConnected, isAuthenticated]);

  return {
    // Connection state
    isConnected,
    isAuthenticated,
    userCounts,
    
    // Data
    testMessages,
    newOrders,
    orderUpdates,
    
    // Actions
    connect,
    disconnect,
    authenticate,
    sendTestMessage,
    sendOrderNotification,
    sendRiderNotification,
    updateOrderStatus,
    
    // Utilities
    clearTestMessages,
    clearNewOrders,
    clearOrderUpdates,
    
    // Socket instance (for advanced usage)
    socket: socketRef.current
  };
}

export function useOrderTracking(orderId: string) {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleOrderUpdate = (order: any) => {
      if (order.id === orderId) {
        // Handle order update
        console.log('Order updated:', order);
      }
    };

    const handleStatusChange = (data: { orderId: string; status: string }) => {
      if (data.orderId === orderId) {
        // Handle status change
        console.log('Order status changed:', data);
      }
    };

    socket.on('order:updated', handleOrderUpdate);
    socket.on('order:status_changed', handleStatusChange);

    return () => {
      socket.off('order:updated', handleOrderUpdate);
      socket.off('order:status_changed', handleStatusChange);
    };
  }, [orderId, socket]);
}

export function useRiderLocation(riderId?: string) {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket || !riderId) return;

    const handleLocationUpdate = (data: { riderId: string; location: any }) => {
      if (data.riderId === riderId) {
        // Handle rider location update
        console.log('Rider location updated:', data);
      }
    };

    socket.on('rider:location_updated', handleLocationUpdate);

    return () => {
      socket.off('rider:location_updated', handleLocationUpdate);
    };
  }, [riderId, socket]);
}

export function useNotifications(userId: string) {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification: any) => {
      // Handle new notification
      console.log('New notification:', notification);
      
      // You can integrate with a notification library here
      // e.g., react-toastify, or your custom notification system
    };

    socket.on('notification:new', handleNewNotification);

    return () => {
      socket.off('notification:new', handleNewNotification);
    };
  }, [userId, socket]);
} 