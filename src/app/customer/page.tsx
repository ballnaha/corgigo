import { Metadata } from 'next';
import CustomerPage from './client';

export const metadata: Metadata = {
  title: 'ลูกค้า - CorgiGo',
  description: 'หน้าสำหรับลูกค้า สั่งอาหาร ติดตามคำสั่งซื้อ',
};

export default function Page() {
  return <CustomerPage />;
} 