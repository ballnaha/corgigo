# Stack Navigation System

## ภาพรวม

ระบบ Stack Navigation ที่เราได้สร้างขึ้นใน CorgiGo ทำให้เราสามารถมี navigation behavior ที่คล้ายกับ mobile app ใน Next.js web application

## คุณสมบัติหลัก

### 1. **NavigationContext** 
- เก็บ navigation stack ในรูปแบบ array
- ติดตาม title และ timestamp ของแต่ละหน้า
- จัดการ push, replace, และ goBack operations

### 2. **AppLayout Integration**
- รองรับ `showBackOnly` mode สำหรับ minimal header
- แสดง title อัตโนมัติจาก navigation stack
- ใช้ stack navigation แทน browser history

### 3. **useAppNavigation Hook**
- ให้ฟังก์ชัน navigation ที่ type-safe
- รองรับ title สำหรับแต่ละหน้า
- มี methods สำหรับหน้าต่างๆ ในแอป

## การใช้งาน

### เบื้องต้น

```tsx
// ใน layout.tsx หรือ root component
import { NavigationProvider } from '@/contexts/NavigationContext';

export default function RootLayout({ children }) {
  return (
    <NavigationProvider>
      {children}
    </NavigationProvider>
  );
}
```

### AppLayout กับ Stack Navigation

```tsx
// สำหรับหน้าที่ต้องการ minimal header
<AppLayout 
  showBackOnly 
  backTitle="ชื่อหน้า" // optional, จะใช้ title จาก stack ถ้าไม่ระบุ
  hideFooter
>
  {/* content */}
</AppLayout>

// สำหรับหน้าปกติ
<AppLayout>
  {/* content จะใช้ AppHeader ปกติ */}
</AppLayout>
```

### useAppNavigation Hook

```tsx
import { useAppNavigation } from '@/hooks/useAppNavigation';

function MyComponent() {
  const { 
    navigateToHome,
    navigateToProfile,
    goBack,
    canGoBack,
    getCurrentTitle,
    push
  } = useAppNavigation();

  return (
    <div>
      <button onClick={navigateToHome}>หน้าหลัก</button>
      <button onClick={navigateToProfile}>โปรไฟล์</button>
      
      {canGoBack && (
        <button onClick={goBack}>ย้อนกลับ</button>
      )}
      
      <button onClick={() => push('/custom', 'หน้า Custom')}>
        ไปหน้า Custom
      </button>
    </div>
  );
}
```

## API Reference

### NavigationContext Methods

#### `push(path: string, title?: string)`
เพิ่มหน้าใหม่เข้า navigation stack

```tsx
navigation.push('/restaurant/register', 'สมัครเปิดร้านอาหาร');
```

#### `replace(path: string, title?: string)`
แทนที่หน้าปัจจุบันใน stack (ไม่เพิ่ม history)

```tsx
navigation.replace('/login', 'เข้าสู่ระบบ');
```

#### `goBack()`
ย้อนกลับไปหน้าก่อนหน้าใน stack

```tsx
navigation.goBack();
```

#### `clearStack()`
ล้าง navigation stack และกลับไปหน้าหลัก

```tsx
navigation.clearStack();
```

### useAppNavigation Methods

```tsx
// Navigation functions
navigateToHome()
navigateToSearch()
navigateToFavorites()
navigateToCart()
navigateToProfile()
navigateToRestaurantRegister()
navigateToRestaurantPending()
navigateToRestaurant()
navigateToOrders()
navigateToSettings()

// Replace functions
replaceToHome()
replaceToLogin()

// Core functions
push(path, title?)
replace(path, title?)
goBack()
clearStack()

// State
canGoBack: boolean
navigationStack: NavigationStackItem[]
getCurrentTitle(): string | undefined
getPreviousTitle(): string | undefined
```

## ตัวอย่างการใช้งาน

### 1. Restaurant Registration Flow

```tsx
// จากหน้า Profile
const { navigateToRestaurantRegister } = useAppNavigation();

// ไปหน้าสมัครร้าน
<button onClick={navigateToRestaurantRegister}>
  สมัครเปิดร้านอาหาร
</button>

// ใน restaurant/register/client.tsx
<AppLayout 
  showBackOnly 
  backTitle="สมัครเปิดร้านอาหาร"
  hideFooter
>
  {/* ฟอร์มสมัคร */}
</AppLayout>
```

### 2. Status Checking Flow

```tsx
// จาก RestaurantStatusButton
const { navigateToRestaurantPending } = useAppNavigation();

// ไปหน้าตรวจสอบสถานะ
<button onClick={navigateToRestaurantPending}>
  ดูสถานะการสมัคร
</button>

// ใน restaurant/pending/client.tsx
<AppLayout 
  showBackOnly 
  backTitle="สถานะการสมัคร"
  hideFooter
>
  {/* แสดงสถานะ */}
</AppLayout>
```

### 3. Footer Navigation

```tsx
// ใน FooterNavbar
const { navigateToHome, navigateToProfile } = useAppNavigation();

// การ navigate จะเพิ่ม proper title เข้า stack
<BottomNavigationAction 
  onClick={navigateToHome}
  label="หน้าแรก" 
/>
```

## ข้อดี

1. **Stack Navigation**: ทำงานเหมือน mobile app navigation
2. **Title Management**: จัดการ title อัตโนมัติ
3. **Type Safety**: มี TypeScript support เต็มรูปแบบ
4. **Consistent UX**: ประสบการณ์การใช้งานที่สม่ำเสมอ
5. **Easy Integration**: ใช้งานง่ายกับ components ที่มีอยู่

## หมายเหตุ

- ระบบนี้ยังคงใช้ Next.js router เป็นฐาน
- สามารถใช้ร่วมกับ browser back/forward ได้
- รองรับ deep linking และ URL sharing
- เหมาะสำหรับ mobile-first applications 