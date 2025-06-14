'use client';

import { useNavigation } from '@/contexts/NavigationContext';

export function useAppNavigation() {
  const navigation = useNavigation();

  // ฟังก์ชันสำหรับ navigate ไปหน้าต่างๆ พร้อม title ที่เหมาะสม
  const navigateToHome = () => {
    navigation.push('/', 'หน้าหลัก');
  };

  const navigateToSearch = () => {
    navigation.push('/search', 'ค้นหา');
  };

  const navigateToFavorites = () => {
    navigation.push('/favorites', 'รายการโปรด');
  };

  const navigateToCart = () => {
    navigation.push('/cart', 'ตะกร้า');
  };

  const navigateToProfile = () => {
    navigation.push('/profile', 'โปรไฟล์');
  };

  const navigateToRestaurantRegister = () => {
    navigation.push('/restaurant/register', 'สมัครเปิดร้านอาหาร');
  };

  const navigateToRestaurantPending = () => {
    navigation.push('/restaurant/pending', 'สถานะการสมัคร');
  };

  const navigateToRestaurant = () => {
    navigation.push('/restaurant', 'จัดการร้านอาหาร');
  };

  const navigateToOrders = () => {
    navigation.push('/orders', 'ประวัติคำสั่งซื้อ');
  };

  const navigateToSettings = () => {
    navigation.push('/settings', 'การตั้งค่า');
  };

  // ฟังก์ชัน replace สำหรับกรณีที่ไม่ต้องการเก็บ history
  const replaceToHome = () => {
    navigation.replace('/', 'หน้าหลัก');
  };

  const replaceToLogin = () => {
    navigation.replace('/auth/login', 'เข้าสู่ระบบ');
  };

  return {
    // Navigation functions
    navigateToHome,
    navigateToSearch,
    navigateToFavorites,
    navigateToCart,
    navigateToProfile,
    navigateToRestaurantRegister,
    navigateToRestaurantPending,
    navigateToRestaurant,
    navigateToOrders,
    navigateToSettings,
    
    // Replace functions
    replaceToHome,
    replaceToLogin,
    
    // Core navigation functions
    goBack: navigation.goBack,
    push: navigation.push,
    replace: navigation.replace,
    clearStack: navigation.clearStack,
    
    // Navigation state
    canGoBack: navigation.canGoBack,
    navigationStack: navigation.navigationStack,
    getCurrentTitle: navigation.getCurrentTitle,
    getPreviousTitle: navigation.getPreviousTitle,
  };
} 