// Utility functions for user operations

// ตรวจสอบว่าผู้ใช้ login ด้วย LINE หรือไม่
export const isLineUser = (email?: string | null): boolean => {
  if (!email) return false;
  
  // ตรวจสอบว่า email มี pattern ของ LINE user หรือไม่
  // LINE users มี email format: line_<userId>@line.temp
  return email.startsWith('line_') && email.endsWith('@line.temp');
};

// ดึง LINE User ID จาก email
export const getLineUserIdFromEmail = (email?: string | null): string | null => {
  if (!email || !isLineUser(email)) return null;
  
  // Extract USER_ID from line_USER_ID@line.temp
  const match = email.match(/^line_(.+)@line\.temp$/);
  return match ? match[1] : null;
};

// สร้าง display name สำหรับ LINE user
export const getLineDisplayInfo = (user: any): {
  shouldHideEmail: boolean;
  displayName: string;
  userType: 'line' | 'normal';
} => {
  const shouldHideEmail = isLineUser(user?.email);
  
  return {
    shouldHideEmail,
    displayName: shouldHideEmail ? 'ผู้ใช้ LINE' : 'ผู้ใช้ทั่วไป',
    userType: shouldHideEmail ? 'line' : 'normal'
  };
}; 