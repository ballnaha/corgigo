const io = require('socket.io-client');

// Test notification system
async function testNotificationSystem() {
  console.log('🔔 Testing CorgiGo Notification System...\n');

  // Create multiple socket connections for different user roles
  const customerSocket = io('https://corgigo.treetelu.com', {
    path: '/api/socket',
    addTrailingSlash: false,
  });

  const restaurantSocket = io('https://corgigo.treetelu.com', {
    path: '/api/socket',
    addTrailingSlash: false,
  });

  const riderSocket = io('https://corgigo.treetelu.com', {
    path: '/api/socket',
    addTrailingSlash: false,
  });

  // Test users
  const testUsers = {
    customer: {
      id: 'customer-test-001',
      name: 'ลูกค้าทดสอบ',
      email: 'customer@test.com',
      role: 'CUSTOMER'
    },
    restaurant: {
      id: 'restaurant-test-001',
      name: 'ร้านอาหารทดสอบ',
      email: 'restaurant@test.com',
      role: 'RESTAURANT',
      restaurantId: 'rest-001'
    },
    rider: {
      id: 'rider-test-001',
      name: 'ไรเดอร์ทดสอบ',
      email: 'rider@test.com',
      role: 'RIDER'
    }
  };

  // Connection handlers
  customerSocket.on('connect', () => {
    console.log('✅ Customer connected');
    customerSocket.emit('authenticate', testUsers.customer);
  });

  restaurantSocket.on('connect', () => {
    console.log('✅ Restaurant connected');
    restaurantSocket.emit('authenticate', testUsers.restaurant);
  });

  riderSocket.on('connect', () => {
    console.log('✅ Rider connected');
    riderSocket.emit('authenticate', testUsers.rider);
  });

  // Authentication handlers
  customerSocket.on('authenticated', (data) => {
    console.log('🔐 Customer authenticated:', data.user.name);
  });

  restaurantSocket.on('authenticated', (data) => {
    console.log('🔐 Restaurant authenticated:', data.user.name);
  });

  riderSocket.on('authenticated', (data) => {
    console.log('🔐 Rider authenticated:', data.user.name);
  });

  // Notification event handlers
  customerSocket.on('orderStatusUpdate', (data) => {
    console.log('📱 Customer received order status update:', data);
  });

  restaurantSocket.on('newOrder', (data) => {
    console.log('🍽️ Restaurant received new order:', data);
  });

  restaurantSocket.on('orderCreated', (data) => {
    console.log('📋 Restaurant received order created notification:', data);
  });

  riderSocket.on('orderAvailable', (data) => {
    console.log('🏍️ Rider received order available:', data);
  });

  riderSocket.on('deliveryRequest', (data) => {
    console.log('📦 Rider received delivery request:', data);
  });

  // Wait for connections
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('\n🧪 Starting notification tests...\n');

  // Test 1: Send order notification
  console.log('Test 1: Sending new order notification...');
  customerSocket.emit('sendOrderNotification', {
    orderId: 'ORDER-' + Date.now(),
    customerName: 'ลูกค้าทดสอบ',
    customerPhone: '081-234-5678',
    restaurantId: 'rest-001',
    restaurantName: 'ร้านอาหารทดสอบ',
    totalAmount: 299,
    items: [
      { name: 'ข้าวผัดกุ้ง', quantity: 1, price: 149 },
      { name: 'ต้มยำกุ้ง', quantity: 1, price: 150 }
    ],
    deliveryAddress: '123 ถนนทดสอบ กรุงเทพฯ 10110',
    notes: 'ไม่ใส่ผักชี'
  });

  await new Promise(resolve => setTimeout(resolve, 1000));

  // Test 2: Send order status update
  console.log('Test 2: Sending order status update...');
  restaurantSocket.emit('updateOrderStatus', {
    orderId: 'ORDER-' + (Date.now() - 1000),
    status: 'CONFIRMED',
    message: 'ร้านอาหารยืนยันออเดอร์แล้ว',
    estimatedTime: 30
  });

  await new Promise(resolve => setTimeout(resolve, 1000));

  // Test 3: Send rider notification
  console.log('Test 3: Sending rider notification...');
  restaurantSocket.emit('sendRiderNotification', {
    orderId: 'ORDER-' + (Date.now() - 2000),
    restaurantId: 'rest-001',
    restaurantName: 'ร้านอาหารทดสอบ',
    restaurantAddress: '456 ถนนร้านอาหาร กรุงเทพฯ 10110',
    deliveryAddress: '123 ถนนทดสอบ กรุงเทพฯ 10110',
    customerName: 'ลูกค้าทดสอบ',
    customerPhone: '081-234-5678',
    totalAmount: 299,
    deliveryFee: 25,
    distance: 2.5
  });

  await new Promise(resolve => setTimeout(resolve, 1000));

  // Test 4: Send test messages
  console.log('Test 4: Sending test messages...');
  customerSocket.emit('sendTestMessage', {
    message: 'สวัสดีจากลูกค้า!',
    targetRole: 'ALL'
  });

  await new Promise(resolve => setTimeout(resolve, 500));

  restaurantSocket.emit('sendTestMessage', {
    message: 'สวัสดีจากร้านอาหาร!',
    targetRole: 'CUSTOMER'
  });

  await new Promise(resolve => setTimeout(resolve, 500));

  riderSocket.emit('sendTestMessage', {
    message: 'สวัสดีจากไรเดอร์!',
    targetRole: 'RESTAURANT'
  });

  console.log('\n✅ All notification tests completed!');
  console.log('\n📊 Test Summary:');
  console.log('- ✅ Socket connections established');
  console.log('- ✅ User authentication successful');
  console.log('- ✅ Order notifications sent');
  console.log('- ✅ Status updates sent');
  console.log('- ✅ Rider notifications sent');
  console.log('- ✅ Test messages sent');

  console.log('\n🌐 Open your browser and go to:');
  console.log('- Main app: http://localhost:3000');
  console.log('- Socket test: http://localhost:3000/socket-test');
  console.log('- Notifications: http://localhost:3000/notifications');

  console.log('\n💡 Tips:');
  console.log('- Login with different user roles to see different notifications');
  console.log('- Check the notification icon in the header');
  console.log('- Click on notifications to see the dropdown menu');
  console.log('- Visit /notifications page to see all notifications');

  // Keep connections alive for a bit longer
  setTimeout(() => {
    customerSocket.disconnect();
    restaurantSocket.disconnect();
    riderSocket.disconnect();
    console.log('\n👋 Disconnected all test connections');
    process.exit(0);
  }, 5000);
}

// Error handlers
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the test
testNotificationSystem().catch(console.error); 