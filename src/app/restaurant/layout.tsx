import React from 'react';
import { Metadata } from 'next';
import RestaurantClientLayout from './RestaurantClientLayout';

export const metadata: Metadata = {
  title: 'จัดการร้านอาหาร - CorgiGo',
  description: 'ระบบจัดการร้านอาหาร จัดการเมนู ออเดอร์ และโปรโมชั่น',
};

export default function RestaurantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RestaurantClientLayout>
      {children}
    </RestaurantClientLayout>
  );
} 