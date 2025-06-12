import { useEffect, useRef } from 'react';
import { createSocketConnection } from '@/lib/socket';
import { SocketEvents } from '@/types';

export function useSocket() {
  const socketRef = useRef<ReturnType<typeof createSocketConnection>>(null);

  useEffect(() => {
    socketRef.current = createSocketConnection();
    
    if (socketRef.current) {
      socketRef.current.connect();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const joinUserRoom = (userId: string) => {
    socketRef.current?.joinUserRoom(userId);
  };

  const joinRidersRoom = () => {
    socketRef.current?.joinRidersRoom();
  };

  const joinRestaurantRoom = (restaurantId: string) => {
    socketRef.current?.joinRestaurantRoom(restaurantId);
  };

  const on = (event: keyof SocketEvents, callback: Function) => {
    socketRef.current?.on(event, callback);
  };

  const off = (event: keyof SocketEvents, callback?: Function) => {
    socketRef.current?.off(event, callback);
  };

  return {
    socket: socketRef.current?.socket,
    joinUserRoom,
    joinRidersRoom,
    joinRestaurantRoom,
    on,
    off,
  };
}

export function useOrderTracking(orderId: string) {
  const { on, off } = useSocket();

  useEffect(() => {
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

    on('order:updated', handleOrderUpdate);
    on('order:status_changed', handleStatusChange);

    return () => {
      off('order:updated', handleOrderUpdate);
      off('order:status_changed', handleStatusChange);
    };
  }, [orderId, on, off]);
}

export function useRiderLocation(riderId?: string) {
  const { on, off } = useSocket();

  useEffect(() => {
    if (!riderId) return;

    const handleLocationUpdate = (data: { riderId: string; location: any }) => {
      if (data.riderId === riderId) {
        // Handle rider location update
        console.log('Rider location updated:', data);
      }
    };

    on('rider:location_updated', handleLocationUpdate);

    return () => {
      off('rider:location_updated', handleLocationUpdate);
    };
  }, [riderId, on, off]);
}

export function useNotifications(userId: string) {
  const { on, off, joinUserRoom } = useSocket();

  useEffect(() => {
    if (userId) {
      joinUserRoom(userId);
    }

    const handleNewNotification = (notification: any) => {
      // Handle new notification
      console.log('New notification:', notification);
      
      // You can integrate with a notification library here
      // e.g., react-toastify, or your custom notification system
    };

    on('notification:new', handleNewNotification);

    return () => {
      off('notification:new', handleNewNotification);
    };
  }, [userId, on, off, joinUserRoom]);
} 