# 🚀 คู่มือการติดตั้งและใช้งาน CorgiGo Food Delivery App

## 📋 สิ่งที่ได้สร้างไปแล้ว

### 🏗️ โครงสร้างโปรเจกต์
- ✅ **Next.js 15** พร้อม App Router
- ✅ **TypeScript** configuration
- ✅ **Material-UI (MUI)** สำหรับ UI components
- ✅ **Prisma ORM** พร้อม MySQL schema
- ✅ **Socket.io** สำหรับ real-time features
- ✅ แยก **Server Components** (page.tsx) และ **Client Components** (client.tsx)

### 👥 User Roles ที่สร้างแล้ว
- ✅ **Customer** (หน้าลูกค้า) - `/customer`
- ✅ **Rider** (หน้าไรเดอร์) - `/rider` 
- ✅ **Restaurant** (หน้าร้านอาหาร) - `/restaurant`
- ✅ **Admin** (หน้าแอดมิน) - `/admin`

### 📊 Database Schema
```
Users (ผู้ใช้หลัก)
├── Customers (ลูกค้า)
│   └── CustomerAddresses (ที่อยู่)
├── Riders (ไรเดอร์)
├── Restaurants (ร้านอาหาร)
│   ├── Categories (หมวดหมู่)
│   └── MenuItems (เมนู)
└── Orders (คำสั่งซื้อ)
    ├── OrderItems (รายการ)
    └── Notifications (แจ้งเตือน)
```

### 🎨 UI Components ที่พร้อมใช้
- Home page ที่สวยงาม
- Customer dashboard
- Rider management system
- Restaurant order management
- Admin control panel

## 🛠️ การติดตั้งและรัน

### 1. สร้าง Database
```bash
# สร้าง database ชื่อ corgigo_food_delivery ใน MySQL
# หรือแก้ไข DATABASE_URL ใน .env
```

### 2. ตั้งค่า Environment Variables
สร้างไฟล์ `.env` ใน root directory:
```env
DATABASE_URL="mysql://username:password@localhost:3306/corgigo_food_delivery"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
JWT_SECRET="your-jwt-secret-here"
SOCKET_PORT=3001
UPLOAD_DIR="public/uploads"
```

### 3. Generate Database Schema
```bash
npm run db:push
npm run db:generate
```

### 4. รันโปรเจกต์
```bash
npm run dev
```

เปิดเบราว์เซอร์ไปที่: http://localhost:3000

## 📱 หน้าต่างๆ ที่สามารถเข้าดูได้

### 🏠 หน้าแรก - `/`
- แสดงร้านอาหารแนะนำ
- หมวดหมู่อาหาร
- ช่องค้นหา
- Design สวยงามด้วย MUI

### 👤 หน้าลูกค้า - `/customer`
- Dashboard พร้อมคำสั่งซื้อปัจจุบัน
- ร้านอาหารใกล้เคียง
- ประวัติการสั่งซื้อ
- จัดการโปรไฟล์และที่อยู่

### 🏍️ หน้าไรเดอร์ - `/rider`
- สลับสถานะ ออนไลน์/ออฟไลน์
- รับงานส่งอาหาร
- ติดตามงานปัจจุบัน
- สถิติรายได้และการทำงาน

### 🍽️ หน้าร้านอาหาร - `/restaurant`
- จัดการคำสั่งซื้อ
- จัดการเมนูอาหาร
- รายงานยอดขาย
- เปิด/ปิดร้าน

### 👨‍💼 หน้าแอดมิน - `/admin`
- ภาพรวมระบบ
- จัดการผู้ใช้ทั้งหมด
- จัดการร้านอาหารและไรเดอร์
- รายงานและสถิติ

## 🔧 Features ที่พร้อมใช้

### ✅ ที่ทำเสร็จแล้ว
- 🎨 UI/UX สวยงามด้วย Material-UI
- 📱 Responsive design
- 🔐 Type-safe ด้วย TypeScript
- 💾 Database schema ครบถ้วน
- 🚀 SSR/CSR optimization
- 🔄 Socket.io setup สำหรับ real-time

### 🔨 ที่ยังต้องพัฒนาต่อ
- 🔐 Authentication system
- 🗺️ Google Maps integration
- 💳 Payment gateway
- 📤 File upload สำหรับรูปภาพ
- 📧 Email notifications
- 🧪 Unit tests

## 📁 Files ที่สำคัญ

```
src/
├── app/
│   ├── layout.tsx          # Layout หลักพร้อม MUI theme
│   ├── page.tsx           # หน้าแรก (Server)
│   ├── client.tsx         # หน้าแรก (Client)
│   ├── customer/          # ระบบลูกค้า
│   ├── rider/             # ระบบไรเดอร์
│   ├── restaurant/        # ระบบร้านอาหาร
│   └── admin/             # ระบบแอดมิน
├── types/index.ts         # TypeScript definitions
├── lib/
│   ├── prisma.ts          # Database client
│   └── socket.ts          # Socket.io setup
├── utils/auth.ts          # Authentication utils
├── hooks/useSocket.ts     # Socket.io hooks
└── prisma/schema.prisma   # Database schema
```

## 🎯 Next Steps (ขั้นตอนต่อไป)

1. **Authentication**: เพิ่มระบบ login/register
2. **API Routes**: สร้าง API endpoints
3. **Real-time Integration**: เชื่อมต่อ Socket.io กับ UI
4. **File Upload**: ระบบอัปโหลดรูปภาพ
5. **Maps Integration**: เพิ่ม Google Maps
6. **Payment**: เชื่อมต่อระบบชำระเงิน
7. **Testing**: เพิ่ม unit tests

## 🐛 หากมีปัญหา

### Database Connection
```bash
# ตรวจสอบว่า MySQL service รันอยู่
# ตรวจสอบ DATABASE_URL ใน .env
# ลองรัน: npm run db:push
```

### Dependencies Issues
```bash
# ลบ node_modules และติดตั้งใหม่
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
# Re-generate Prisma client
npm run db:generate
```

## 📞 สำหรับผู้พัฒนา

โครงสร้างนี้พร้อมสำหรับการพัฒนาต่อ มีการแยก concerns ชัดเจน และใช้ best practices ของ Next.js 15

- **Server Components** สำหรับ SEO และ performance
- **Client Components** สำหรับ interactivity
- **TypeScript** สำหรับ type safety
- **Prisma** สำหรับ database operations
- **Socket.io** สำหรับ real-time features

Happy coding! 🚀 