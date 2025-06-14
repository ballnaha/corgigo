import { Server as NetServer } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as ServerIO } from 'socket.io';
import { SocketEvents } from '@/types';

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: ServerIO;
    };
  };
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export interface SocketUser {
  id: string;
  name: string;
  role: 'CUSTOMER' | 'RESTAURANT' | 'RIDER' | 'ADMIN';
  email: string;
  socketId: string;
  restaurantId?: string;
}

export interface OrderNotification {
  orderId: string;
  customerId: string;
  customerName: string;
  restaurantId: string;
  restaurantName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  deliveryAddress: string;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERING' | 'DELIVERED';
  createdAt: string;
}

export interface RiderNotification {
  orderId: string;
  restaurantName: string;
  restaurantAddress: string;
  customerName: string;
  deliveryAddress: string;
  estimatedDistance: string;
  deliveryFee: number;
  status: 'READY_FOR_PICKUP' | 'ASSIGNED' | 'PICKED_UP' | 'DELIVERING';
}

// Store connected users
export const connectedUsers = new Map<string, SocketUser>();

// Store users by role for easy filtering
export const usersByRole = {
  CUSTOMER: new Map<string, SocketUser>(),
  RESTAURANT: new Map<string, SocketUser>(),
  RIDER: new Map<string, SocketUser>(),
  ADMIN: new Map<string, SocketUser>(),
};

// Store restaurant owners by restaurant ID
export const restaurantOwners = new Map<string, SocketUser[]>();

// Socket.io server initialization
export function initSocket(server: NetServer) {
  const io = new ServerIO(server, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Join user to their specific room
    socket.on('join:user', (userId: string) => {
      socket.join(`user:${userId}`);
      console.log(`User ${userId} joined their room`);
    });

    // Join rider to riders room
    socket.on('join:riders', () => {
      socket.join('riders');
      console.log('Rider joined riders room');
    });

    // Join restaurant to their specific room
    socket.on('join:restaurant', (restaurantId: string) => {
      socket.join(`restaurant:${restaurantId}`);
      console.log(`Restaurant ${restaurantId} joined their room`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}

// Utility functions for emitting events
export class SocketService {
  private io: ServerIO;

  constructor(io: ServerIO) {
    this.io = io;
  }

  // Notify specific user
  notifyUser(userId: string, event: keyof SocketEvents, data: any) {
    this.io.to(`user:${userId}`).emit(event, data);
  }

  // Notify all riders
  notifyRiders(event: keyof SocketEvents, data: any) {
    this.io.to('riders').emit(event, data);
  }

  // Notify specific restaurant
  notifyRestaurant(restaurantId: string, event: keyof SocketEvents, data: any) {
    this.io.to(`restaurant:${restaurantId}`).emit(event, data);
  }

  // Broadcast to all connected clients
  broadcast(event: keyof SocketEvents, data: any) {
    this.io.emit(event, data);
  }

  // Order related notifications
  orderCreated(order: any) {
    // Notify customer
    this.notifyUser(order.customerId, 'order:created', order);
    
    // Notify restaurant
    this.notifyRestaurant(order.restaurantId, 'order:created', order);
    
    // Notify available riders
    this.notifyRiders('order:created', order);
  }

  orderUpdated(order: any) {
    // Notify customer
    this.notifyUser(order.customerId, 'order:updated', order);
    
    // Notify restaurant
    this.notifyRestaurant(order.restaurantId, 'order:updated', order);
    
    // Notify assigned rider if any
    if (order.riderId) {
      this.notifyUser(order.riderId, 'order:updated', order);
    }
  }

  orderStatusChanged(order: any) {
    this.notifyUser(order.customerId, 'order:status_changed', {
      orderId: order.id,
      status: order.status,
    });
  }

  riderLocationUpdated(riderId: string, location: any) {
    // Notify customers with active orders from this rider
    this.broadcast('rider:location_updated', { riderId, location });
  }

  sendNotification(userId: string, notification: any) {
    this.notifyUser(userId, 'notification:new', notification);
  }
}

// Client-side socket utilities
export function createSocketConnection() {
  if (typeof window !== 'undefined') {
    const socket = require('socket.io-client')();
    
    const connect = () => {
      return socket.connect();
    };

    const disconnect = () => {
      return socket.disconnect();
    };

    const joinUserRoom = (userId: string) => {
      socket.emit('join:user', userId);
    };

    const joinRidersRoom = () => {
      socket.emit('join:riders');
    };

    const joinRestaurantRoom = (restaurantId: string) => {
      socket.emit('join:restaurant', restaurantId);
    };

    const on = (event: keyof SocketEvents, callback: Function) => {
      socket.on(event, callback);
    };

    const off = (event: keyof SocketEvents, callback?: Function) => {
      socket.off(event, callback);
    };

    return {
      socket,
      connect,
      disconnect,
      joinUserRoom,
      joinRidersRoom,
      joinRestaurantRoom,
      on,
      off,
    };
  }

  return null;
} 