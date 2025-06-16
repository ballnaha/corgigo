# LoadingScreen Component

คอมโพเนนต์ Loading Screen ที่สวยงามและใช้งานร่วมกันได้ทั้งเว็บไซต์

## ✨ Features

- 🎨 **Modern Design**: Animation ที่เนียนตาและทันสมัย
- 📱 **Responsive**: รองรับทุกขนาดหน้าจอ
- 🔄 **Flexible**: ปรับแต่งได้หลากหลาย
- 📊 **Progress Tracking**: แสดงความคืบหน้าแบบขั้นตอน
- 🌍 **Thai Language**: รองรับภาษาไทยโดยเฉพาะ

## 🎯 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `step` | `'auth' \| 'data' \| 'processing' \| 'custom'` | `'processing'` | ประเภทขั้นตอนการโหลด |
| `customMessage` | `string` | `undefined` | ข้อความแสดงแทนข้อความเริ่มต้น |
| `subtitle` | `string` | `undefined` | ข้อความรอง |
| `showProgress` | `boolean` | `false` | แสดง progress indicators |
| `currentStep` | `number` | `1` | ขั้นตอนปัจจุบัน (เริ่มต้นที่ 1) |
| `totalSteps` | `number` | `2` | จำนวนขั้นตอนทั้งหมด |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | ขนาดของ component |
| `fullHeight` | `boolean` | `true` | ใช้ความสูงเต็มหน้าจอ |

## 📝 การใช้งาน

### 1. Basic Loading
```tsx
import LoadingScreen from '@/components/LoadingScreen';

// Loading พื้นฐาน
<LoadingScreen />
```

### 2. Authentication Loading
```tsx
// ตรวจสอบสิทธิ์
<LoadingScreen 
  step="auth"
  subtitle="กำลังเข้าสู่ระบบ"
/>
```

### 3. Data Loading
```tsx
// โหลดข้อมูล
<LoadingScreen 
  step="data"
  subtitle="กำลังเตรียมข้อมูลของคุณ"
/>
```

### 4. Custom Message
```tsx
// ข้อความที่กำหนดเอง
<LoadingScreen 
  step="custom"
  customMessage="กำลังอัปโหลดรูปภาพ..."
  subtitle="โปรดรอสักครู่"
/>
```

### 5. Progress Steps
```tsx
// แสดงความคืบหน้าแบบขั้นตอน
<LoadingScreen 
  step={currentStep === 1 ? 'auth' : 'data'}
  showProgress={true}
  currentStep={currentStep}
  totalSteps={2}
  subtitle="กำลังดำเนินการขั้นตอน"
/>
```

### 6. Different Sizes
```tsx
// ขนาดเล็ก
<LoadingScreen size="small" fullHeight={false} />

// ขนาดใหญ่
<LoadingScreen size="large" />
```

## 🎬 ตัวอย่างการใช้งานในแอป

### Restaurant Register Page
```tsx
const isInitialLoading = status === 'loading' || loadingData;

if (isInitialLoading) {
  return (
    <LoadingScreen
      step={status === 'loading' ? 'auth' : 'data'}
      showProgress={true}
      currentStep={status === 'loading' ? 1 : 2}
      totalSteps={2}
      subtitle={isEdit ? 'เตรียมข้อมูลสำหรับแก้ไข' : 'เตรียมฟอร์มสมัคร'}
    />
  );
}
```

### Profile Page
```tsx
if (isInitialLoading) {
  return (
    <LoadingScreen
      step={status === 'loading' ? 'auth' : 'data'}
      customMessage={status === 'loading' ? undefined : 'กำลังโหลดข้อมูลโปรไฟล์...'}
      subtitle="เตรียมข้อมูลส่วนตัวของคุณ"
    />
  );
}
```

### Pending Status Page
```tsx
if (sessionStatus === 'loading' || loading) {
  return (
    <LoadingScreen
      step={sessionStatus === 'loading' ? 'auth' : 'data'}
      customMessage={sessionStatus === 'loading' ? undefined : 'กำลังโหลดสถานะการสมัคร...'}
      subtitle="ตรวจสอบสถานะการสมัครร้านอาหาร"
    />
  );
}
```

## 🎨 Step Messages

| Step | Default Message |
|------|----------------|
| `auth` | กำลังตรวจสอบสิทธิ์... |
| `data` | กำลังโหลดข้อมูล... |
| `processing` | กำลังดำเนินการ... |
| `custom` | ใช้ `customMessage` |

## 🔧 Sizes

| Size | Circle | Inner Dot | Font Size |
|------|--------|-----------|-----------|
| `small` | 35px | 6px | 0.8rem |
| `medium` | 50px | 8px | 0.9rem |
| `large` | 60px | 10px | 1rem |

## 💡 Best Practices

1. **ใช้ step ที่เหมาะสม**: `auth` สำหรับการตรวจสอบสิทธิ์, `data` สำหรับโหลดข้อมูล
2. **เพิ่ม subtitle**: ให้ข้อมูลเพิ่มเติมเพื่อความชัดเจน
3. **ใช้ progress steps**: เมื่อมีหลายขั้นตอนที่ชัดเจน
4. **Custom message**: เมื่อต้องการข้อความเฉพาะ
5. **Size ที่เหมาะสม**: `small` สำหรับ modal, `medium` สำหรับ page, `large` สำหรับ splash screen

## 🎯 Animation Features

- **Smooth Circle**: CircularProgress ที่หมุนนุ่มนวล
- **Pulsing Dot**: จุดกลางที่ pulse สวยงาม
- **Fade Text**: ข้อความที่ fade in/out
- **Step Transitions**: การเปลี่ยนสี progress steps อย่างนุ่มนวล
- **Page Transition**: Fade in เมื่อโหลดเสร็จ 