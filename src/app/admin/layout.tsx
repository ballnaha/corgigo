import React from 'react';
import { Metadata } from 'next';
import AdminClientLayout from './AdminClientLayout';

export const metadata: Metadata = {
  title: 'ผู้ดูแลระบบ - CorgiGo',
  description: 'หน้าสำหรับผู้ดูแลระบบ จัดการผู้ใช้ ร้านอาหาร และไรเดอร์',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminClientLayout>
      {children}
    </AdminClientLayout>
  );
} 