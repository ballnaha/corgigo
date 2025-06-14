import { NextApiRequest } from 'next';
import { Server as ServerIO } from 'socket.io';
import { Server as NetServer } from 'http';
import { 
  NextApiResponseServerIO, 
  SocketUser, 
  connectedUsers, 
  usersByRole, 
  restaurantOwners,
  OrderNotification,
  RiderNotification
} from '@/lib/socket';

export default function SocketHandler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (res.socket.server.io) {
    console.log('Socket.IO already running');
  } else {
    console.log('Socket.IO starting...');
    
    const io = new ServerIO(res.socket.server as NetServer, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
    
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log(`Socket connected: ${socket.id}`);

      // Handle user authentication and registration
      socket.on('authenticate', (userData: Omit<SocketUser, 'socketId'>) => {
        const user: SocketUser = {
          ...userData,
          socketId: socket.id
        };

        // Store user in connected users
        connectedUsers.set(socket.id, user);
        usersByRole[user.role].set(user.id, user);

        // If user is restaurant owner, store by restaurant ID
        if (user.role === 'RESTAURANT' && user.restaurantId) {
          if (!restaurantOwners.has(user.restaurantId)) {
            restaurantOwners.set(user.restaurantId, []);
          }
          restaurantOwners.get(user.restaurantId)?.push(user);
        }

        // Join role-based rooms
        socket.join(`role:${user.role}`);
        if (user.restaurantId) {
          socket.join(`restaurant:${user.restaurantId}`);
        }

        console.log(`User authenticated: ${user.name} (${user.role}) - Socket: ${socket.id}`);
        
        // Send confirmation
        socket.emit('authenticated', {
          success: true,
          user: user,
          connectedUsers: Array.from(connectedUsers.values()).length
        });

        // Broadcast user count update
        io.emit('userCountUpdate', {
          total: connectedUsers.size,
          customers: usersByRole.CUSTOMER.size,
          restaurants: usersByRole.RESTAURANT.size,
          riders: usersByRole.RIDER.size,
          admins: usersByRole.ADMIN.size
        });
      });

      // Handle test message broadcasting
      socket.on('sendTestMessage', (data: { message: string; targetRole?: string }) => {
        const user = connectedUsers.get(socket.id);
        if (!user) return;

        const messageData = {
          id: Date.now().toString(),
          message: data.message,
          sender: user.name,
          senderRole: user.role,
          timestamp: new Date().toISOString()
        };

        if (data.targetRole) {
          // Send to specific role
          io.to(`role:${data.targetRole}`).emit('testMessage', messageData);
          console.log(`Test message sent to ${data.targetRole}: ${data.message}`);
        } else {
          // Broadcast to all
          io.emit('testMessage', messageData);
          console.log(`Test message broadcast: ${data.message}`);
        }

        // Send confirmation to sender
        socket.emit('messageSent', { success: true, messageData });
      });

      // Handle order notifications (for testing)
      socket.on('sendOrderNotification', (orderData: OrderNotification) => {
        const user = connectedUsers.get(socket.id);
        if (!user) return;

        console.log(`Order notification from ${user.name}: Order ${orderData.orderId}`);

        // Send to restaurant
        io.to(`restaurant:${orderData.restaurantId}`).emit('newOrder', orderData);
        
        // Send to all riders
        io.to('role:RIDER').emit('orderAvailable', {
          orderId: orderData.orderId,
          restaurantName: orderData.restaurantName,
          deliveryAddress: orderData.deliveryAddress,
          totalAmount: orderData.totalAmount
        });

        // Send to admins
        io.to('role:ADMIN').emit('orderCreated', orderData);

        socket.emit('orderNotificationSent', { success: true, orderId: orderData.orderId });
      });

      // Handle rider notifications (for testing)
      socket.on('sendRiderNotification', (riderData: RiderNotification) => {
        const user = connectedUsers.get(socket.id);
        if (!user) return;

        console.log(`Rider notification from ${user.name}: Order ${riderData.orderId}`);

        // Send to all available riders
        io.to('role:RIDER').emit('deliveryRequest', riderData);

        // Send to admins
        io.to('role:ADMIN').emit('deliveryAssignment', riderData);

        socket.emit('riderNotificationSent', { success: true, orderId: riderData.orderId });
      });

      // Handle status updates
      socket.on('updateOrderStatus', (data: { orderId: string; status: string; message?: string }) => {
        const user = connectedUsers.get(socket.id);
        if (!user) return;

        const statusUpdate = {
          orderId: data.orderId,
          status: data.status,
          message: data.message,
          updatedBy: user.name,
          updatedByRole: user.role,
          timestamp: new Date().toISOString()
        };

        // Broadcast status update to all relevant parties
        io.emit('orderStatusUpdate', statusUpdate);
        
        console.log(`Order ${data.orderId} status updated to ${data.status} by ${user.name}`);
        
        socket.emit('statusUpdateSent', { success: true, statusUpdate });
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        const user = connectedUsers.get(socket.id);
        if (user) {
          console.log(`User disconnected: ${user.name} (${user.role})`);
          
          // Remove from all stores
          connectedUsers.delete(socket.id);
          usersByRole[user.role].delete(user.id);
          
          if (user.role === 'RESTAURANT' && user.restaurantId) {
            const owners = restaurantOwners.get(user.restaurantId);
            if (owners) {
              const index = owners.findIndex(owner => owner.socketId === socket.id);
              if (index > -1) {
                owners.splice(index, 1);
                if (owners.length === 0) {
                  restaurantOwners.delete(user.restaurantId);
                }
              }
            }
          }

          // Broadcast updated user count
          io.emit('userCountUpdate', {
            total: connectedUsers.size,
            customers: usersByRole.CUSTOMER.size,
            restaurants: usersByRole.RESTAURANT.size,
            riders: usersByRole.RIDER.size,
            admins: usersByRole.ADMIN.size
          });
        }
        
        console.log(`Socket disconnected: ${socket.id}`);
      });
    });
  }
  
  res.end();
}

export const config = {
  api: {
    bodyParser: false,
  },
}; 