# LINE Login Configuration Guide

## 🔧 Environment Variables ที่ต้องตั้งค่า

เพิ่มในไฟล์ `.env.local`:

```env
# LINE Login Configuration
LINE_CHANNEL_ID="your-line-channel-id"
LINE_CHANNEL_SECRET="your-line-channel-secret"  
LINE_REDIRECT_URI="http://localhost:3000/api/auth/line-callback"
NEXT_PUBLIC_LINE_CHANNEL_ID="your-line-channel-id"

# LIFF Configuration (optional)
NEXT_PUBLIC_LIFF_ID="your-liff-id"
```

## 📱 LINE Developers Console Setup

### 1. สร้าง LINE Login Channel
1. ไปที่ [LINE Developers Console](https://developers.line.biz/)
2. สร้าง Provider ใหม่หรือเลือกที่มีอยู่
3. สร้าง Channel ใหม่ → เลือก "LINE Login"
4. กรอกข้อมูล Channel

### 2. ตั้งค่า Callback URL
```
http://localhost:3000/api/auth/line-callback (สำหรับ development)
https://yourdomain.com/api/auth/line-callback (สำหรับ production)
```

### 3. ตั้งค่า Scopes
- `profile` - ดึงข้อมูลโปรไฟล์พื้นฐาน
- `openid` - สำหรับ OpenID Connect

## 🔄 LINE Login Flow

### Web Login Flow
```
1. ผู้ใช้กดปุ่ม "เข้าสู่ระบบด้วย LINE"
2. redirect ไป LINE OAuth URL
3. ผู้ใช้ login ใน LINE
4. LINE redirect กลับมาที่ /api/auth/line-callback?code=xxx
5. Server แลก code เป็น access_token
6. ดึงข้อมูล profile จาก LINE API
7. สร้าง/อัปเดต user ในฐานข้อมูล
8. สร้าง secure token และ redirect กลับ login page
9. Client ทำ NextAuth sign in
10. เสร็จสิ้น
```

### LIFF Login Flow (สำหรับใน LINE App)
```
1. ตรวจสอบว่าอยู่ใน LINE App
2. ใช้ LIFF SDK เพื่อ login
3. ได้ access_token โดยตรง
4. ส่ง POST ไป /api/auth/line-callback
5. ทำ NextAuth sign in
6. เสร็จสิ้น
```

## 📁 Files ที่เกี่ยวข้อง

### API Routes
- `src/app/api/auth/line-login/route.ts` - จัดการข้อมูล user จาก LINE
- `src/app/api/auth/line-callback/route.ts` - รับ callback จาก LINE OAuth

### Frontend
- `src/app/auth/login/page.tsx` - หน้า login พร้อม LINE button
- `src/lib/auth.ts` - NextAuth configuration

### Database
- `prisma/schema.prisma` - User model มี lineId field

## 🧪 การทดสอบ

### Development Mode
```bash
npm run dev
```
ไปที่ `http://localhost:3000/auth/login` และทดสอบปุ่ม LINE

### Production Deployment
1. อัปเดต `LINE_REDIRECT_URI` ให้เป็น production URL
2. อัปเดต Callback URL ใน LINE Developers Console
3. Deploy และทดสอบ

## 🚨 Security Notes

1. **Environment Variables**: เก็บ `LINE_CHANNEL_SECRET` เป็นความลับ
2. **Token Validation**: Callback token มีอายุ 5 นาที
3. **State Parameter**: ใช้ random state ป้องกัน CSRF
4. **HTTPS**: ใช้ HTTPS ใน production เสมอ

## 🔧 Troubleshooting

### ปัญหาที่พบบ่อย

**1. "Invalid redirect_uri"**
- ตรวจสอบ `LINE_REDIRECT_URI` ใน .env
- ตรวจสอบ Callback URL ใน LINE Console

**2. "Invalid client_id"**
- ตรวจสอบ `LINE_CHANNEL_ID` ใน .env
- ตรวจสอบว่า Channel เปิดใช้งานแล้ว

**3. "Token exchange failed"**
- ตรวจสอบ `LINE_CHANNEL_SECRET`
- ตรวจสอบ network connectivity

**4. "Profile failed"**
- ตรวจสอบ scopes ใน LINE Console
- ตรวจสอบว่า access_token ยังไม่หมดอายุ

## 📊 Database Schema

User model มี fields เหล่านี้สำหรับ LINE Login:

```prisma
model User {
  // ... existing fields
  lineId      String?   @unique // LINE User ID
  googleId    String?   @unique // สำหรับอนาคต
  password    String?   // nullable สำหรับ social login
}
```

## 🎯 Next Steps

1. เพิ่ม LIFF support สำหรับ in-app experience
2. เพิ่ม LINE Messaging API integration
3. เพิ่ม Google OAuth provider
4. เพิ่มการ link/unlink social accounts 