import { Metadata } from 'next';
import AdminPage from './client';

export const metadata: Metadata = {
  title: 'ผู้ดูแลระบบ - CorgiGo',
  description: 'หน้าสำหรับผู้ดูแลระบบ จัดการผู้ใช้ ร้านอาหาร และไรเดอร์',
};

export default function Page() {
  return <AdminPage />;
} 