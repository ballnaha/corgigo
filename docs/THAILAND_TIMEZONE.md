# Thailand Timezone Utilities

ระบบจัดการเวลาประเทศไทย (UTC+7) สำหรับ CorgiGo โดยใช้ `date-fns-tz`

## 📦 การติดตั้ง

```bash
npm install date-fns date-fns-tz
```

## 🚀 การใช้งาน

### Import Functions

```typescript
import { 
  getThailandNow,
  toThailandTime,
  formatThailandTime,
  createThailandDate,
  THAI_DATE_FORMAT,
  THAI_TIME_FORMAT,
  THAI_DATETIME_FORMAT 
} from '@/lib/timezone';
```

### 1. สร้างข้อมูลใหม่ (Middleware จัดการอัตโนมัติ)

```typescript
// Prisma Middleware จัดการ createdAt และ updatedAt อัตโนมัติ
await prisma.user.create({
  data: {
    firstName: 'John',
    lastName: 'Doe'
    // ไม่ต้องระบุ createdAt และ updatedAt
    // Middleware จะใส่เวลาไทยให้อัตโนมัติ
  }
});
```

### 2. แปลงเวลาจากฐานข้อมูลเป็นเวลาไทย

```typescript
// ข้อมูลจากฐานข้อมูล
const user = await prisma.user.findFirst();

// แปลงเป็นเวลาไทย
const thaiCreatedAt = toThailandTime(user.createdAt);
```

### 3. แสดงเวลาในรูปแบบไทย

```typescript
// รูปแบบต่างๆ
const date = new Date();

formatThailandTime(date, THAI_DATE_FORMAT);      // "14/06/2025"
formatThailandTime(date, THAI_TIME_FORMAT);      // "10:30"
formatThailandTime(date, THAI_DATETIME_FORMAT);  // "14/06/2025 10:30"
formatThailandTime(date);                        // "14/06/2025 10:30:45" (default)
```

### 4. สร้างเวลาเฉพาะในเวลาไทย

```typescript
// สร้างเวลา 14 มิถุนายน 2025 เวลา 14:30:00
const specificTime = createThailandDate(2025, 5, 14, 14, 30, 0); // เดือนเริ่มจาก 0

// ใช้กับ Prisma
await prisma.restaurant.update({
  where: { id: restaurantId },
  data: {
    approvedAt: specificTime
  }
});
```

## 🎨 React Component

### ThaiDateDisplay Component

```tsx
import ThaiDateDisplay from '@/components/ThaiDateDisplay';

// ในหน้า JSX
<ThaiDateDisplay 
  date={user.createdAt} 
  format="datetime" 
  className="text-gray-600" 
/>

// รูปแบบต่างๆ
<ThaiDateDisplay date={order.createdAt} format="date" />     // แสดงแค่วันที่
<ThaiDateDisplay date={order.createdAt} format="time" />     // แสดงแค่เวลา
<ThaiDateDisplay date={order.createdAt} format="datetime" /> // วันที่และเวลา
<ThaiDateDisplay date={order.createdAt} format="full" />     // แบบเต็มพร้อมวินาที
```

## 📊 ตัวอย่างการใช้งานใน API Routes

### 1. การสร้างข้อมูลใหม่

```typescript
// src/app/api/restaurant/approve/route.ts
import { getThailandNow } from '@/lib/timezone';

export async function POST(request: NextRequest) {
  // ...
  
  const updateData = {
    status: 'APPROVED',
    approvedAt: getThailandNow(), // ใช้เวลาไทย
    approvedBy: session.user.id
  };
  
  await prisma.restaurant.update({
    where: { id: restaurantId },
    data: updateData
  });
}
```

### 2. การคำนวณสถิติรายวัน/รายเดือน

```typescript
// src/app/api/restaurant/dashboard/route.ts
import { getThailandNow, toThailandTime } from '@/lib/timezone';

export async function GET() {
  // ใช้เวลาไทยสำหรับการคำนวณ
  const thaiNow = getThailandNow();
  const today = new Date(thaiNow);
  today.setHours(0, 0, 0, 0);
  
  // กรองออเดอร์วันนี้
  const todayOrders = orders.filter(order => {
    const orderDate = toThailandTime(order.createdAt);
    return orderDate >= today && orderDate < tomorrow;
  });
}
```

## 🔧 Utility Functions

### isToday()
```typescript
import { isToday } from '@/lib/timezone';

const order = await prisma.order.findFirst();
if (isToday(order.createdAt)) {
  console.log('ออเดอร์วันนี้');
}
```

### getMinutesDifference()
```typescript
import { getMinutesDifference } from '@/lib/timezone';

const timeDiff = getMinutesDifference(order.createdAt, new Date());
console.log(`ออเดอร์นี้สั่งมาแล้ว ${timeDiff} นาที`);
```

## 📝 Constants

```typescript
THAI_DATE_FORMAT = 'dd/MM/yyyy'           // 14/06/2025
THAI_TIME_FORMAT = 'HH:mm'                // 14:30
THAI_DATETIME_FORMAT = 'dd/MM/yyyy HH:mm' // 14/06/2025 14:30
THAI_FULL_DATETIME_FORMAT = 'dd/MM/yyyy HH:mm:ss' // 14/06/2025 14:30:45
```

## ⚠️ สิ่งที่ต้องระวัง

1. **Prisma Middleware จัดการอัตโนมัติ** - `createdAt` และ `updatedAt` จะใช้เวลาไทยโดยอัตโนมัติ
2. **ใช้ `formatThailandTime()`** เมื่อต้องการแสดงเวลาในรูปแบบไทย
3. **UserRoles model** ไม่มี `updatedAt` field (middleware จัดการให้แล้ว)
4. **ไม่ต้องใช้ `getThailandNow()` ใน Prisma operations** - middleware จัดการให้แล้ว

## 🧪 การทดสอบ

```bash
# รันไฟล์ทดสอบ timestamps
npx tsx test-thai-timestamps-fresh.js
```

## 🔧 Prisma Middleware

ระบบใช้ Prisma Middleware เพื่อจัดการ `createdAt` และ `updatedAt` อัตโนมัติ:

```typescript
// src/lib/prisma-middleware.ts
export function setupPrismaMiddleware(prisma: PrismaClient) {
  prisma.$use(async (params, next) => {
    const thaiNow = getThailandNow();

    // จัดการ createdAt และ updatedAt อัตโนมัติ
    if (params.action === 'create') {
      params.args.data.createdAt = thaiNow;
      if (params.model !== 'UserRoles') {
        params.args.data.updatedAt = thaiNow;
      }
    }

    if (['update', 'updateMany', 'upsert'].includes(params.action)) {
      params.args.data.updatedAt = thaiNow;
    }

    return next(params);
  });
}
```

## 📈 ประโยชน์

- ✅ **เวลาเก็บในฐานข้อมูลเป็นเวลาไทย** - ไม่ต้องแปลงเมื่อแสดงผล
- ✅ **Prisma Middleware จัดการอัตโนมัติ** - ไม่ต้องระบุ timestamps เอง
- ✅ **การคำนวณสถิติรายวัน/รายเดือนแม่นยำ** - ใช้เวลาไทยตั้งแต่ต้น
- ✅ **ผู้ใช้เห็นเวลาที่เข้าใจง่าย** - ตรงกับเวลาจริงในประเทศไทย
- ✅ **ระบบจัดการเวลาที่สอดคล้องกันทั้งแอป** - ทุก model ใช้เวลาไทย
- ✅ **รองรับการแสดงผลหลายรูปแบบ** - มี components และ utilities ครบ

## 🔄 Migration จากระบบเดิม

หากมีข้อมูลเก่าที่ใช้ UTC อยู่แล้ว:

1. **ไม่ต้องแปลงข้อมูลในฐานข้อมูล** - ให้เก็บเป็น UTC ต่อไป
2. **แปลงเฉพาะตอนแสดงผล** - ใช้ `toThailandTime()` และ `formatThailandTime()`
3. **ข้อมูลใหม่** - ใช้ `getThailandNow()` เพื่อเก็บเวลาไทย

นี่คือวิธีที่ดีที่สุดในการจัดการ timezone สำหรับแอปพลิเคชันในประเทศไทย! 🇹🇭 