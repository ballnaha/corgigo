# Rich Menu Auto Login Configuration

## 🎯 **Overview**

ผู้ใช้สามารถกดจาก **Rich Menu** เพื่อ **Auto Login** เข้าเว็บไซต์ผ่าน LIFF ได้โดยตรง

**Flow:** Rich Menu → LIFF → Auto Login → เข้าเว็บ

---

## 🔧 **Setup Steps**

### 1. **Environment Variables**

เพิ่มใน `.env.local`:
```env
NEXT_PUBLIC_LIFF_ID="2007547134-GD56wM6Z"
```

### 2. **LIFF App URLs**

- **LIFF URL:** `https://liff.line.me/2007547134-GD56wM6Z`
- **Target URL:** `https://corgigo.treetelu.com/liff-login`

---

## 📱 **Rich Menu Configuration**

### Option 1: LINE Official Account Manager
1. ไปที่ [LINE Official Account Manager](https://manager.line.biz/)
2. เลือก Account ของคุณ
3. ไปที่ **Rich menus** → **Create**
4. สร้าง Rich Menu ตามตัวอย่างด้านล่าง

### Option 2: LINE Messaging API
```json
{
  "size": {
    "width": 2500,
    "height": 1686
  },
  "selected": true,
  "name": "CorgiGo Main Menu",
  "chatBarText": "เมนู",
  "areas": [
    {
      "bounds": {
        "x": 0,
        "y": 0,
        "width": 1250,
        "height": 843
      },
      "action": {
        "type": "uri",
        "uri": "https://liff.line.me/2007547134-GD56wM6Z"
      }
    },
    {
      "bounds": {
        "x": 1250,
        "y": 0,
        "width": 1250,
        "height": 843
      },
      "action": {
        "type": "message",
        "text": "ติดต่อเรา"
      }
    },
    {
      "bounds": {
        "x": 0,
        "y": 843,
        "width": 1250,
        "height": 843
      },
      "action": {
        "type": "message",
        "text": "ดูเมนู"
      }
    },
    {
      "bounds": {
        "x": 1250,
        "y": 843,
        "width": 1250,
        "height": 843
      },
      "action": {
        "type": "message",
        "text": "สถานที่ใกล้ฉัน"
      }
    }
  ]
}
```

---

## 🎨 **Rich Menu Design Template**

### Layout (2500x1686px)

```
┌─────────────────┬─────────────────┐
│   🍕 CorgiGo    │   📞 ติดต่อเรา   │
│   เข้าใช้งาน     │                 │
│   (LIFF URL)    │   (Message)     │
├─────────────────┼─────────────────┤
│   🍜 ดูเมนู      │  📍 ร้านใกล้ฉัน  │
│                 │                 │
│   (Message)     │   (Message)     │
└─────────────────┴─────────────────┘
```

### Action Types:
- **ปุ่ม "เข้าใช้งาน"**: URI → LIFF URL
- **ปุ่มอื่น ๆ**: Message หรือ Postback

---

## 🔄 **Auto Login Flow**

### Step-by-Step Process:

1. **User กดปุ่มใน Rich Menu**
   ```
   Rich Menu Button → LIFF URL
   ```

2. **เปิด LIFF App**
   ```
   https://liff.line.me/2007547134-GD56wM6Z
   → Redirect to: https://corgigo.treetelu.com/liff-login
   ```

3. **LIFF Auto Login**
   ```javascript
   // /liff-login page
   1. Load LIFF SDK
   2. liff.init()
   3. Check liff.isLoggedIn()
   4. Get liff.getAccessToken()
   5. Get liff.getProfile()
   ```

4. **API Call**
   ```
   POST /api/auth/line-callback
   Body: { accessToken, fromLiff: true, liffProfile }
   ```

5. **NextAuth Session**
   ```javascript
   signIn('credentials', {
     email: result.user.email,
     password: 'line_login'
   })
   ```

6. **Redirect to Main App**
   ```
   router.push('/') → เข้าเว็บหลัก
   ```

---

## 📊 **Monitoring & Logs**

### Development Logs:
```
🔄 LIFF Profile: { userId: 'xxx', displayName: 'xxx' }
🔄 LIFF Login request: { hasToken: true, fromLiff: true }
✅ Using LIFF profile data
🔄 Processing LINE login...
✅ LINE login successful for user: line_xxx@line.temp
```

### Production Analytics:
- Track LIFF จาก Rich Menu vs Web Login
- Monitor auto login success rate
- User experience metrics

---

## 🎯 **Rich Menu Best Practices**

### 1. **Button Design**
- ใช้สีสันที่สะดุดตา สำหรับปุ่ม "เข้าใช้งาน"
- เพิ่ม icon อาหาร/ส่งอาหาร
- ข้อความกระชับ เข้าใจง่าย

### 2. **User Experience**
- ปุ่ม "เข้าใช้งาน" ควรอยู่ตำแหน่งบนซ้าย (สำคัญที่สุด)
- Loading animation ใน LIFF page
- Error handling และ retry mechanism

### 3. **Performance**
- LIFF SDK โหลดเร็ว (CDN)
- API response time < 2 วินาที
- Smooth transition ระหว่างหน้า

---

## 🚨 **Troubleshooting**

### **ปัญหาที่พบบ่อย:**

**1. LIFF ไม่เปิด**
```bash
# ตรวจสอบ LIFF URL
curl https://liff.line.me/2007547134-GD56wM6Z
```

**2. Auto Login ล้มเหลว**
```javascript
// ตรวจสอบ console logs
🔄 LIFF Profile: { userId: 'xxx' } ✅
❌ LIFF Login request: { hasToken: false } ❌
```

**3. Session ไม่ถูกต้อง**
```bash
# ตรวจสอบ NextAuth
GET /api/auth/session
```

### **Solutions:**

**LIFF Configuration:**
- ตรวจสอบ LIFF ID ใน LINE Developers Console
- ตรวจสอบ Endpoint URL
- ตรวจสอบ Channel settings

**Rich Menu:**
- ตรวจสอบ Action Type = "uri"
- ตรวจสอบ URI = LIFF URL
- ตรวจสอบ Rich Menu active status

---

## 🎉 **Testing**

### 1. **Manual Test**
1. เพิ่มเพื่อน LINE Official Account
2. กดปุ่ม Rich Menu "เข้าใช้งาน"
3. ตรวจสอบ Auto Login
4. ตรวจสอบ Redirect ไปหน้าหลัก

### 2. **Automated Test**
```javascript
// LIFF Mock for Testing
window.liff = {
  init: jest.fn(),
  isLoggedIn: () => true,
  getAccessToken: () => 'mock_token',
  getProfile: () => ({ userId: 'test123', displayName: 'Test User' })
};
```

---

## 📈 **Analytics Setup**

### Track Events:
- `rich_menu_click` - คลิกปุ่ม Rich Menu
- `liff_auto_login_start` - เริ่ม Auto Login
- `liff_auto_login_success` - Auto Login สำเร็จ  
- `liff_auto_login_error` - Auto Login ล้มเหลว

### Metrics:
- Rich Menu → Web conversion rate
- Auto Login success rate
- Time to login completion
- Error rate by step

---

**🎯 Result: ผู้ใช้กดปุ่มเดียวใน Rich Menu → เข้าเว็บโดยตรง!** 