# ระบบการป้องกันการเข้าถึง Restaurant

## ภาพรวม

ระบบได้รับการอัปเดตเพื่อป้องกันการเข้าถึงหน้า restaurant สำหรับร้านอาหารที่ยังไม่ได้รับการอนุมัติจาก admin

## สถานะ Restaurant

Restaurant สามารถมีสถานะดังนี้:
- `PENDING` - รอการอนุมัติ
- `APPROVED` - ได้รับการอนุมัติแล้ว (สามารถใช้งานได้)
- `REJECTED` - ถูกปฏิเสธ
- `SUSPENDED` - ถูกระงับการใช้งาน

## กฎการเข้าถึง

### 1. หน้าที่เข้าได้โดยไม่เช็คสถานะ
- `/restaurant/register` - หน้าสมัครสมาชิก
- `/restaurant/pending` - หน้าแสดงสถานะรอการอนุมัติ

### 2. หน้าที่ต้องมีสถานะ APPROVED เท่านั้น
- `/restaurant` - แดชบอร์ดหลัก
- `/restaurant/menus` - จัดการเมนู
- `/restaurant/orders` - จัดการออเดอร์
- `/restaurant/finance` - การเงิน
- `/restaurant/promotions` - โปรโมชั่น
- `/restaurant/reviews` - รีวิว
- `/restaurant/settings` - การตั้งค่า

## การทำงานของระบบ

### 1. Middleware Level
```typescript
// src/middleware.ts
- ตรวจสอบ authentication และ restaurant role
- อนุญาตให้เข้า register และ pending page
- หน้าอื่นๆ จะผ่านไปยัง client-side checking
```

### 2. Component Level
```typescript
// src/components/RestaurantStatusChecker.tsx
- ตรวจสอบสถานะ restaurant จาก API
- Redirect ไปหน้าที่เหมาะสมตามสถานะ
- แสดง loading screen ระหว่างตรวจสอบ
```

### 3. Layout Level
```typescript
// src/app/restaurant/RestaurantClientLayout.tsx
- ใช้ RestaurantStatusChecker เพื่อป้องกันการเข้าถึง
- รับประกันว่าเฉพาะ restaurant ที่ APPROVED เท่านั้นจะเห็นเนื้อหา
```

## Flow การทำงาน

1. **ผู้ใช้เข้าสู่ระบบ**
   - ตรวจสอบ authentication
   - ตรวจสอบ restaurant role

2. **การเข้าหน้า restaurant**
   - ถ้าไม่มีข้อมูล restaurant → redirect ไป `/restaurant/register`
   - ถ้าสถานะ `PENDING/REJECTED/SUSPENDED` → redirect ไป `/restaurant/pending`
   - ถ้าสถานะ `APPROVED` → เข้าใช้งานได้

3. **การ redirect แบบ smart**
   - ถ้าสถานะ `APPROVED` แต่อยู่หน้า pending → redirect ไป `/restaurant`
   - ถ้าสถานะ `PENDING` แต่พยายามเข้าหน้าอื่น → redirect ไป `/restaurant/pending`

## API Endpoints

### GET /api/restaurant/status
ตรวจสอบสถานะ restaurant ของผู้ใช้ปัจจุบัน

**Response:**
```json
{
  "success": true,
  "restaurant": {
    "id": "string",
    "name": "string",
    "status": "PENDING|APPROVED|REJECTED|SUSPENDED",
    "submittedAt": "ISO date",
    "approvedAt": "ISO date",
    "rejectedAt": "ISO date",
    "rejectReason": "string"
  }
}
```

## การใช้งาน RestaurantStatusChecker

```tsx
import RestaurantStatusChecker from '@/components/RestaurantStatusChecker';

// สำหรับหน้าที่ต้องการสถานะ APPROVED
<RestaurantStatusChecker requiredStatus="APPROVED">
  <YourComponent />
</RestaurantStatusChecker>

// สำหรับหน้าที่รับทุกสถานะ
<RestaurantStatusChecker requiredStatus="ANY">
  <YourComponent />
</RestaurantStatusChecker>

// สำหรับหน้าที่ต้องการ PENDING เท่านั้น
<RestaurantStatusChecker requiredStatus="PENDING">
  <YourComponent />
</RestaurantStatusChecker>
```

## Security Features

1. **Double Protection**: ป้องกันทั้งใน middleware และ client component
2. **Automatic Redirect**: redirect ไปหน้าที่เหมาะสมตามสถานะ
3. **Loading States**: แสดง loading ระหว่างตรวจสอบ
4. **Error Handling**: จัดการ error และ redirect ไป pending page เพื่อความปลอดภัย

## การทดสอบ

1. **Restaurant ใหม่**: ควร redirect ไป register page
2. **Restaurant PENDING**: ควร redirect ไป pending page
3. **Restaurant APPROVED**: สามารถเข้าใช้งานได้ปกติ
4. **Restaurant REJECTED**: ควร redirect ไป pending page

## Notes

- ระบบใช้ session storage สำหรับ authentication
- การตรวจสอบสถานะทำทุกครั้งที่โหลดหน้า
- Error handling จะ redirect ไป pending page เพื่อความปลอดภัย 