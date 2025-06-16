// CorgiGo Color Palette - Inspired by Fresh Vegetables & Fruits
// วิเคราะห์จากภาพ: สีเหลือง (ดอก/ใบ), สีเขียว (ลำต้น), สีแดง/ส้ม (ผลไม้)

export const colors = {
  // Primary Palette - สีหลักจากภาพ
  primary: {
    // สีเหลือง/ทอง - จากส่วนบนของภาพ (ดอกไผ่/ใบ)
    golden: '#FFC324',      // Ripe Mango
    lightGolden: '#FFF000', // Yellow Rose
    darkGolden: '#ED9121',  // Carrot Orange
  },
  
  // Secondary - สีเขียว - จากส่วนกลางของภาพ (ลำต้น)
  secondary: {
    fresh: '#66B447',       // Apple Green
    lightFresh: '#8EE53F',  // Kiwi Green
    darkFresh: '#4A7C59',   // Dark Forest Green
  },
  
  // Accent - สีแดง/ส้ม - จากส่วนล่างของภาพ (หัวไชเท้า/ผลไม้)
  accent: {
    warm: '#E9692C',        // Deep Carrot Orange
    lightWarm: '#F58025',   // Light Carrot
    darkWarm: '#CC5000',    // Burnt Orange
  },
  
  // Supporting Colors - สีเสริมที่เข้ากัน
  neutral: {
    white: '#FFFFFF',
    lightGray: '#F8F9FA',
    gray: '#6C757D',
    darkGray: '#343A40',
    black: '#000000',
  },
  
  // Semantic Colors - สีตามความหมาย
  semantic: {
    success: '#66B447',     // ใช้สีเขียวจาก palette
    warning: '#FFC324',     // ใช้สีเหลืองจาก palette
    error: '#E9692C',       // ใช้สีส้มจาก palette
    info: '#17A2B8',        // สีฟ้าเสริม
  },
  
  // Background Gradients - การไล่สี
  gradients: {
    sunset: 'linear-gradient(135deg, #FFC324 0%, #E9692C 50%, #CC5000 100%)',
    forest: 'linear-gradient(135deg, #8EE53F 0%, #66B447 50%, #4A7C59 100%)',
    nature: 'linear-gradient(135deg, #FFF000 0%, #66B447 50%, #E9692C 100%)',
    warm: 'linear-gradient(45deg, #FFC324 0%, #F58025 100%)',
    cool: 'linear-gradient(45deg, #8EE53F 0%, #66B447 100%)',
  }
};

// Theme Variants - ธีมแบบต่างๆ
export const themes = {
  // Light Theme - ธีมสว่าง
  light: {
    primary: colors.primary.golden,
    secondary: colors.secondary.fresh,
    accent: colors.accent.warm,
    background: colors.neutral.white,
    surface: colors.neutral.lightGray,
    text: colors.neutral.darkGray,
    textSecondary: colors.neutral.gray,
  },
  
  // Dark Theme - ธีมมืด
  dark: {
    primary: colors.primary.lightGolden,
    secondary: colors.secondary.lightFresh,
    accent: colors.accent.lightWarm,
    background: colors.neutral.darkGray,
    surface: colors.neutral.black,
    text: colors.neutral.white,
    textSecondary: colors.neutral.lightGray,
  },
  
  // Nature Theme - ธีมธรรมชาติ
  nature: {
    primary: colors.secondary.fresh,
    secondary: colors.primary.golden,
    accent: colors.accent.warm,
    background: '#F5F8F5',
    surface: '#E8F5E8',
    text: colors.secondary.darkFresh,
    textSecondary: colors.neutral.gray,
  },
  
  // Warm Theme - ธีมอบอุ่น
  warm: {
    primary: colors.accent.warm,
    secondary: colors.primary.golden,
    accent: colors.secondary.fresh,
    background: '#FFF8F5',
    surface: '#FFF0E8',
    text: colors.accent.darkWarm,
    textSecondary: colors.neutral.gray,
  }
};

// Color Usage Guidelines - แนวทางการใช้สี
export const colorUsage = {
  // Primary Actions - การกระทำหลัก
  primaryButton: colors.primary.golden,
  primaryButtonHover: colors.primary.darkGolden,
  
  // Secondary Actions - การกระทำรอง
  secondaryButton: colors.secondary.fresh,
  secondaryButtonHover: colors.secondary.darkFresh,
  
  // Call to Action - เรียกให้ทำ
  cta: colors.accent.warm,
  ctaHover: colors.accent.darkWarm,
  
  // Navigation - การนำทาง
  navBackground: colors.neutral.white,
  navText: colors.neutral.darkGray,
  navActive: colors.primary.golden,
  
  // Cards & Surfaces - การ์ดและพื้นผิว
  cardBackground: colors.neutral.white,
  cardBorder: colors.neutral.lightGray,
  cardShadow: 'rgba(0, 0, 0, 0.1)',
  
  // Text - ข้อความ
  headingText: colors.neutral.darkGray,
  bodyText: colors.neutral.gray,
  linkText: colors.secondary.fresh,
  linkHover: colors.secondary.darkFresh,
};

// Export default theme
export const defaultTheme = themes.light; 