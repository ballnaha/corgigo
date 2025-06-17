import RestaurantPendingClient from './client';
import RestaurantStatusChecker from '@/components/RestaurantStatusChecker';

export default function RestaurantPendingPage() {
  return (
    <RestaurantStatusChecker 
      requiredStatus="ANY" 
      loadingMessage="กำลังตรวจสอบสถานะคำขอร้านอาหาร..."
    >
      <RestaurantPendingClient />
    </RestaurantStatusChecker>
  );
} 