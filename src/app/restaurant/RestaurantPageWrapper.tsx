'use client';

import dynamic from 'next/dynamic';

const RestaurantPage = dynamic(() => import('./client'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '18px'
    }}>
      กำลังโหลด...
    </div>
  )
});

export default function RestaurantPageWrapper() {
  return <RestaurantPage />;
} 