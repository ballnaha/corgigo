# Timezone Utilities

ฟังก์ชันสำหรับจัดการการแสดงเวลาในรูปแบบไทยให้ถูกต้อง

## ปัญหาที่แก้ไข

เมื่อดึงข้อมูลเวลาจาก database มักจะเจอปัญหา timezone conversion ทำให้เวลาที่แสดงไม่ตรงกับเวลาที่บันทึกไว้ เช่น:
- เวลาใน DB: 16:00
- เวลาที่แสดงผล: 23:00 (เพิ่ม +7 ชั่วโมง)

## วิธีใช้งาน

```typescript
import { 
  formatThaiDateTime, 
  formatThaiDate, 
  formatThaiDateShort,
  formatThaiTime,
  formatThaiRelativeTime 
} from '@/lib/timezone';

// แสดงวันที่และเวลาแบบเต็ม
const fullDateTime = formatThaiDateTime('2024-01-15T16:30:00Z');
// ผลลัพธ์: "15 มกราคม 2567 เวลา 16:30"

// แสดงเฉพาะวันที่
const dateOnly = formatThaiDate('2024-01-15T16:30:00Z');
// ผลลัพธ์: "15 มกราคม 2567"

// แสดงวันที่แบบสั้น
const shortDate = formatThaiDateShort('2024-01-15T16:30:00Z');
// ผลลัพธ์: "15 ม.ค. 67"

// แสดงเฉพาะเวลา
const timeOnly = formatThaiTime('2024-01-15T16:30:00Z');
// ผลลัพธ์: "16:30"

// แสดงเวลาแบบ relative
const relativeTime = formatThaiRelativeTime('2024-01-15T14:30:00Z');
// ผลลัพธ์: "2 ชั่วโมงที่แล้ว"
```

## Functions Available

### formatThaiDateTime(dateString)
แปลงเป็นรูปแบบวันที่และเวลาแบบเต็ม
- **Input**: `string | Date`
- **Output**: `"15 มกราคม 2567 เวลา 16:30"`

### formatThaiDate(dateString)
แปลงเป็นรูปแบบวันที่เท่านั้น
- **Input**: `string | Date`
- **Output**: `"15 มกราคม 2567"`

### formatThaiDateShort(dateString)
แปลงเป็นรูปแบบวันที่แบบสั้น
- **Input**: `string | Date`
- **Output**: `"15 ม.ค. 67"`

### formatThaiTime(dateString)
แปลงเป็นรูปแบบเวลาเท่านั้น
- **Input**: `string | Date`
- **Output**: `"16:30"`

### formatThaiRelativeTime(dateString)
แปลงเป็นรูปแบบเวลาแบบ relative
- **Input**: `string | Date`
- **Output**: `"2 ชั่วโมงที่แล้ว"`, `"3 วันที่แล้ว"`

### debugDateTime(dateString, label?)
สำหรับ debug การแปลงเวลา (พิมพ์ข้อมูลใน console)
- **Input**: `string | Date`, `string?`

### getDateRange(dateString)
ตรวจสอบว่าวันที่อยู่ในช่วงไหน
- **Input**: `string | Date`
- **Output**: `'today' | 'yesterday' | 'this_week' | 'this_month' | 'older'`

## ตัวอย่างการใช้ใน Component

```tsx
import { formatThaiDateTime, formatThaiDate } from '@/lib/timezone';

function RestaurantCard({ restaurant }) {
  return (
    <Card>
      <Typography>
        วันที่สมัคร: {formatThaiDate(restaurant.createdAt)}
      </Typography>
      <Typography>
        อัปเดตล่าสุด: {formatThaiDateTime(restaurant.updatedAt)}
      </Typography>
    </Card>
  );
}
```

## หมายเหตุสำคัญ

1. **ใช้ UTC Components**: Functions เหล่านี้ใช้ `getUTCFullYear()`, `getUTCMonth()` เป็นต้น เพื่อหลีกเลี่ยงปัญหา browser timezone
2. **ปี พ.ศ.**: วันที่จะแสดงเป็นปีพุทธศักราช (เพิ่ม 543 ปี)
3. **ภาษาไทย**: ชื่อเดือนและรูปแบบเป็นภาษาไทย
4. **ไม่ต้อง import moment.js**: ใช้ native JavaScript Date objects

## Migration Guide

หากมีโค้ดเก่าที่ใช้รูปแบบอื่น สามารถแก้ไขได้ดังนี้:

```typescript
// เก่า ❌
new Date(createdAt).toLocaleDateString('th-TH')

// ใหม่ ✅
formatThaiDate(createdAt)

// เก่า ❌  
new Date(createdAt).toLocaleString('th-TH', {
  year: 'numeric',
  month: 'long', 
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})

// ใหม่ ✅
formatThaiDateTime(createdAt)
```

## ทดสอบ

```typescript
// ทดสอบ timezone
debugDateTime('2024-01-15T16:30:00Z', 'Test DateTime');
// จะแสดงข้อมูล debug ใน console
``` 