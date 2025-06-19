import React from 'react';
import { Metadata } from 'next';
import { RestaurantProvider } from '@/contexts/RestaurantContext';
import { CartProvider } from '@/contexts/CartContext';

interface RestaurantTenantLayoutProps {
  children: React.ReactNode;
  params: { subdomain: string };
}

// Generate metadata dynamically based on restaurant
export async function generateMetadata(
  { params }: { params: { subdomain: string } }
): Promise<Metadata> {
  const { subdomain } = params;
  
  try {
    // Fetch restaurant data for metadata
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/restaurants/by-subdomain/${subdomain}`, {
      cache: 'no-store'
    });
    
    if (response.ok) {
      const data = await response.json();
      const restaurant = data.restaurant;
      
      return {
        title: `${restaurant.name} - สั่งอาหารออนไลน์`,
        description: restaurant.description || `สั่งอาหารจาก ${restaurant.name} ได้ที่นี่`,
        keywords: `อาหาร, ${restaurant.name}, สั่งอาหาร, เดลิเวอรี่, ${subdomain}`,
        openGraph: {
          title: `${restaurant.name} - สั่งอาหารออนไลน์`,
          description: restaurant.description || `สั่งอาหารจาก ${restaurant.name} ได้ที่นี่`,
          images: restaurant.bannerUrl || restaurant.coverUrl ? [
            {
              url: restaurant.bannerUrl || restaurant.coverUrl,
              width: 1200,
              height: 630,
              alt: restaurant.name
            }
          ] : [],
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title: `${restaurant.name} - สั่งอาหารออนไลน์`,
          description: restaurant.description || `สั่งอาหารจาก ${restaurant.name} ได้ที่นี่`,
          images: restaurant.bannerUrl || restaurant.coverUrl ? [restaurant.bannerUrl || restaurant.coverUrl] : [],
        },
        alternates: {
          canonical: `https://${subdomain}.corgigo.com`,
        },
        robots: {
          index: !restaurant.isSuspended && restaurant.status === 'APPROVED',
          follow: !restaurant.isSuspended && restaurant.status === 'APPROVED',
        }
      };
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }
  
  // Fallback metadata
  return {
    title: `${subdomain} - ร้านอาหาร`,
    description: 'ร้านอาหารออนไลน์',
    robots: {
      index: false,
      follow: false,
    }
  };
}

export default function RestaurantTenantLayout({
  children,
  params
}: RestaurantTenantLayoutProps) {
  const { subdomain } = params;

  return (
    <CartProvider>
      <RestaurantProvider subdomain={subdomain}>
        {children}
      </RestaurantProvider>
    </CartProvider>
  );
} 