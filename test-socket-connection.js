const { io } = require('socket.io-client');

// Test Socket.IO connection
async function testSocketConnection() {
  console.log('🔌 Testing Socket.IO Connection...\n');

  const socket = io('http://localhost:3000', {
    path: '/api/socket',
    addTrailingSlash: false,
  });

  // Connection events
  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket.id);
    
    // Test authentication
    const testUser = {
      id: 'test-user-123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'CUSTOMER'
    };

    console.log('🔐 Authenticating user...');
    socket.emit('authenticate', testUser);
  });

  socket.on('authenticated', (data) => {
    console.log('✅ User authenticated:', data);
    
    // Test sending message
    console.log('📤 Sending test message...');
    socket.emit('sendTestMessage', {
      message: 'Hello from Node.js test!',
      targetRole: 'CUSTOMER'
    });

    // Test order notification
    console.log('🍽️ Sending order notification...');
    const mockOrder = {
      orderId: `ORDER-${Date.now()}`,
      customerId: 'test-user-123',
      customerName: 'Test User',
      restaurantId: 'restaurant-456',
      restaurantName: 'Test Restaurant',
      items: [
        { name: 'Test Dish', quantity: 1, price: 100 }
      ],
      totalAmount: 100,
      deliveryAddress: 'Test Address',
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    socket.emit('sendOrderNotification', mockOrder);

    // Test status update
    setTimeout(() => {
      console.log('🔄 Updating order status...');
      socket.emit('updateOrderStatus', {
        orderId: mockOrder.orderId,
        status: 'CONFIRMED',
        message: 'Order confirmed by test'
      });
    }, 2000);
  });

  socket.on('userCountUpdate', (counts) => {
    console.log('👥 User count update:', counts);
  });

  socket.on('testMessage', (message) => {
    console.log('💬 Test message received:', message);
  });

  socket.on('newOrder', (order) => {
    console.log('🆕 New order received:', order.orderId);
  });

  socket.on('orderStatusUpdate', (update) => {
    console.log('📊 Order status update:', update);
  });

  socket.on('messageSent', (data) => {
    console.log('✅ Message sent confirmation:', data.success);
  });

  socket.on('orderNotificationSent', (data) => {
    console.log('✅ Order notification sent:', data.orderId);
  });

  socket.on('statusUpdateSent', (data) => {
    console.log('✅ Status update sent:', data.success);
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected');
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Connection error:', error.message);
  });

  // Disconnect after 10 seconds
  setTimeout(() => {
    console.log('\n🔌 Disconnecting...');
    socket.disconnect();
    process.exit(0);
  }, 10000);
}

// Run test
testSocketConnection().catch(console.error); 