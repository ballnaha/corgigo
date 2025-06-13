import { Metadata } from 'next';
import RestaurantPageWrapper from './RestaurantPageWrapper';

export const metadata: Metadata = {
  title: 'ร้านอาหาร - CorgiGo',
  description: 'หน้าสำหรับร้านอาหาร จัดการคำสั่งซื้อ เมนูอาหาร',
};

export default function Page() {
  return <RestaurantPageWrapper />;
} 