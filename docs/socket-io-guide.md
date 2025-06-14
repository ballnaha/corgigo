# Socket.IO Implementation Guide

## 📋 ภาพรวม

ระบบ Socket.IO ถูกพัฒนาขึ้นเพื่อรองรับการสื่อสารแบบ real-time ระหว่าง:
- **ลูกค้า (Customer)** - รับการแจ้งเตือนสถานะออเดอร์
- **ร้านค้า (Restaurant)** - รับออเดอร์ใหม่และอัปเดตสถานะ
- **ไรเดอร์ (Rider)** - รับงานส่งอาหารและอัปเดตตำแหน่ง
- **แอดมิน (Admin)** - ติดตามระบบทั้งหมด

## 🏗️ สถาปัตยกรรม

### ไฟล์หลัก
```
src/
├── lib/socket.ts              # Socket.IO configuration และ types
├── pages/api/socket.ts        # Socket.IO server endpoint
├── hooks/useSocket.ts         # React hook สำหรับ client
└── app/socket-test/page.tsx   # หน้าทดสอบ Socket.IO
```

### Components
- **Socket Server**: `/api/socket` - จัดการการเชื่อมต่อและ events
- **useSocket Hook**: Custom React hook สำหรับ client-side
- **Test Dashboard**: หน้าทดสอบฟีเจอร์ต่างๆ

## 🚀 การใช้งาน

### 1. เริ่มต้นใช้งาน

```typescript
import { useSocket } from '@/hooks/useSocket';

const MyComponent = () => {
  const user = {
    id: 'user-123',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'CUSTOMER' as const,
    restaurantId: 'restaurant-456' // สำหรับ RESTAURANT role
  };

  const {
    isConnected,
    isAuthenticated,
    userCounts,
    testMessages,
    newOrders,
    orderUpdates,
    sendTestMessage,
    sendOrderNotification,
    updateOrderStatus
  } = useSocket({ user });

  return (
    <div>
      <p>สถานะ: {isConnected ? 'เชื่อมต่อแล้ว' : 'ไม่ได้เชื่อมต่อ'}</p>
      <p>ผู้ใช้ออนไลน์: {userCounts.total} คน</p>
    </div>
  );
};
```

### 2. ส่งข้อความทดสอบ

```typescript
// ส่งให้ทุกคน
sendTestMessage('Hello everyone!');

// ส่งให้กลุ่มเฉพาะ
sendTestMessage('Hello restaurants!', 'RESTAURANT');
```

### 3. ส่งการแจ้งเตือนออเดอร์

```typescript
const orderData = {
  orderId: 'ORDER-123',
  customerId: 'customer-456',
  customerName: 'Jane Doe',
  restaurantId: 'restaurant-789',
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

sendOrderNotification(orderData);
```

### 4. อัปเดตสถานะออเดอร์

```typescript
updateOrderStatus('ORDER-123', 'CONFIRMED', 'Order confirmed by restaurant');
```

## 📡 Socket Events

### Client → Server Events

| Event | Description | Data |
|-------|-------------|------|
| `authenticate` | ยืนยันตัวตนผู้ใช้ | `SocketUser` |
| `sendTestMessage` | ส่งข้อความทดสอบ | `{ message: string, targetRole?: string }` |
| `sendOrderNotification` | ส่งการแจ้งเตือนออเดอร์ | `OrderNotification` |
| `sendRiderNotification` | ส่งการแจ้งเตือนไรเดอร์ | `RiderNotification` |
| `updateOrderStatus` | อัปเดตสถานะออเดอร์ | `{ orderId: string, status: string, message?: string }` |

### Server → Client Events

| Event | Description | Target | Data |
|-------|-------------|--------|------|
| `authenticated` | ยืนยันการเชื่อมต่อ | Sender | `{ success: boolean, user: SocketUser }` |
| `userCountUpdate` | อัปเดตจำนวนผู้ใช้ | All | `UserCounts` |
| `testMessage` | ข้อความทดสอบ | Target Role/All | `TestMessage` |
| `newOrder` | ออเดอร์ใหม่ | Restaurant | `OrderNotification` |
| `orderAvailable` | ออเดอร์พร้อมส่ง | Riders | `OrderInfo` |
| `deliveryRequest` | คำขอส่งอาหาร | Riders | `RiderNotification` |
| `orderStatusUpdate` | อัปเดตสถานะ | All | `OrderStatusUpdate` |
| `orderCreated` | ออเดอร์ใหม่ (แอดมิน) | Admins | `OrderNotification` |
| `deliveryAssignment` | มอบหมายงานส่ง | Admins | `RiderNotification` |

## 🎯 Use Cases

### สำหรับลูกค้า (Customer)
```typescript
const { orderUpdates } = useSocket({ user: customerUser });

// ติดตามสถานะออเดอร์
useEffect(() => {
  const myOrderUpdates = orderUpdates.filter(
    update => update.orderId === myOrderId
  );
  // แสดงการแจ้งเตือน
}, [orderUpdates]);
```

### สำหรับร้านค้า (Restaurant)
```typescript
const { newOrders, updateOrderStatus } = useSocket({ 
  user: restaurantUser 
});

// รับออเดอร์ใหม่
useEffect(() => {
  if (newOrders.length > 0) {
    // แสดงการแจ้งเตือนออเดอร์ใหม่
    playNotificationSound();
  }
}, [newOrders]);

// ยืนยันออเดอร์
const confirmOrder = (orderId: string) => {
  updateOrderStatus(orderId, 'CONFIRMED', 'Order confirmed by restaurant');
};
```

### สำหรับไรเดอร์ (Rider)
```typescript
const { socket } = useSocket({ user: riderUser });

// รับงานส่งอาหาร
useEffect(() => {
  if (!socket) return;

  const handleDeliveryRequest = (data: RiderNotification) => {
    // แสดงงานส่งอาหารใหม่
    showDeliveryRequest(data);
  };

  socket.on('deliveryRequest', handleDeliveryRequest);
  
  return () => {
    socket.off('deliveryRequest', handleDeliveryRequest);
  };
}, [socket]);
```

## 🧪 การทดสอบ

### 1. เข้าหน้าทดสอบ
```
http://localhost:3000/socket-test
```

### 2. ฟีเจอร์ที่ทดสอบได้
- ✅ การเชื่อมต่อ Socket.IO
- ✅ การยืนยันตัวตน
- ✅ การส่งข้อความทดสอบ
- ✅ การส่งการแจ้งเตือนออเดอร์
- ✅ การอัปเดตสถานะออเดอร์
- ✅ การนับจำนวนผู้ใช้ออนไลน์
- ✅ การแยกกลุ่มตาม Role

### 3. การทดสอบหลายผู้ใช้
1. เปิดหลาย browser tabs
2. Login ด้วย role ต่างกันในแต่ละ tab
3. ทดสอบการส่งข้อความระหว่างกัน
4. ทดสอบการแจ้งเตือนออเดอร์

## 🔧 Configuration

### Environment Variables
```env
# ไม่จำเป็นต้องตั้งค่าเพิ่มเติม
# Socket.IO จะใช้ port เดียวกับ Next.js
```

### Socket.IO Options
```typescript
// src/pages/api/socket.ts
const io = new ServerIO(res.socket.server as NetServer, {
  path: '/api/socket',
  addTrailingSlash: false,
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
```

## 🚨 การแก้ไขปัญหา

### ปัญหาที่พบบ่อย

1. **Socket ไม่เชื่อมต่อ**
   ```typescript
   // ตรวจสอบ path และ port
   const socket = io('http://localhost:3000', {
     path: '/api/socket'
   });
   ```

2. **ไม่ได้รับ Events**
   ```typescript
   // ตรวจสอบการ authenticate
   useEffect(() => {
     if (isConnected && !isAuthenticated && user) {
       authenticate(user);
     }
   }, [isConnected, isAuthenticated, user]);
   ```

3. **Memory Leaks**
   ```typescript
   // ใช้ cleanup ใน useEffect
   useEffect(() => {
     return () => {
       socket?.off('eventName', handler);
     };
   }, [socket]);
   ```

## 📈 การขยายระบบ

### 1. เพิ่ม Events ใหม่
```typescript
// src/lib/socket.ts
export interface NewEventData {
  // กำหนด structure
}

// src/pages/api/socket.ts
socket.on('newEvent', (data: NewEventData) => {
  // จัดการ event
});
```

### 2. เพิ่ม Rooms
```typescript
// Join room ตาม criteria
socket.join(`city:${userCity}`);
socket.join(`zone:${deliveryZone}`);

// ส่งข้อความไปยัง room
io.to(`city:bangkok`).emit('cityUpdate', data);
```

### 3. Persistence
```typescript
// บันทึกข้อมูลลง Database
socket.on('orderCreated', async (orderData) => {
  await prisma.order.create({ data: orderData });
  io.to(`restaurant:${orderData.restaurantId}`).emit('newOrder', orderData);
});
```

## 🔐 Security

### 1. Authentication
```typescript
// ตรวจสอบ JWT token
socket.on('authenticate', async (userData, token) => {
  const isValid = await verifyJWT(token);
  if (!isValid) {
    socket.disconnect();
    return;
  }
  // Continue with authentication
});
```

### 2. Rate Limiting
```typescript
// จำกัดจำนวน requests
const rateLimiter = new Map();

socket.on('sendMessage', (data) => {
  const userId = connectedUsers.get(socket.id)?.id;
  const now = Date.now();
  const userRequests = rateLimiter.get(userId) || [];
  
  // ตรวจสอบ rate limit
  const recentRequests = userRequests.filter(time => now - time < 60000);
  if (recentRequests.length >= 10) {
    socket.emit('rateLimitExceeded');
    return;
  }
  
  rateLimiter.set(userId, [...recentRequests, now]);
  // Process message
});
```

## 📊 Monitoring

### 1. Connection Stats
```typescript
// ติดตาม connections
setInterval(() => {
  console.log('Connected users:', connectedUsers.size);
  console.log('By role:', {
    customers: usersByRole.CUSTOMER.size,
    restaurants: usersByRole.RESTAURANT.size,
    riders: usersByRole.RIDER.size,
    admins: usersByRole.ADMIN.size
  });
}, 30000);
```

### 2. Event Logging
```typescript
// Log events สำคัญ
socket.on('orderCreated', (data) => {
  console.log(`[${new Date().toISOString()}] Order created:`, data.orderId);
  // Send to logging service
});
```

---

## 🎉 สรุป

ระบบ Socket.IO พร้อมใช้งานแล้วสำหรับ:
- ✅ การแจ้งเตือนออเดอร์แบบ real-time
- ✅ การสื่อสารระหว่างลูกค้า, ร้านค้า, และไรเดอร์
- ✅ การติดตามสถานะออเดอร์
- ✅ ระบบทดสอบที่ครบถ้วน

สามารถขยายระบบเพิ่มเติมได้ตามความต้องการ เช่น การแจ้งเตือนผ่าน push notifications, การติดตามตำแหน่ง GPS แบบ real-time, หรือระบบแชทระหว่างผู้ใช้ 