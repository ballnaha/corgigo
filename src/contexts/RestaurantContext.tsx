'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
interface RestaurantTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl?: string;
  bannerUrl?: string;
}

interface Restaurant {
  id: string;
  name: string;
  description?: string;
  address: string;
  phone?: string;
  avatarUrl?: string;
  coverUrl?: string;
  logoUrl?: string;
  bannerUrl?: string;
  rating: number;
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  subdomain?: string;
  customDomain?: string;
  isActive: boolean;
  isSuspended: boolean;
  suspendedAt?: string;
  suspendReason?: string;
  themePrimaryColor: string;
  themeSecondaryColor: string;
  themeAccentColor: string;
  createdAt: string;
  updatedAt: string;
}

interface RestaurantContextType {
  restaurant: Restaurant | null;
  theme: RestaurantTheme;
  isLoading: boolean;
  isSuspended: boolean;
  subdomain: string;
  error: string | null;
  refreshRestaurant: () => Promise<void>;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

interface RestaurantProviderProps {
  children: ReactNode;
  subdomain?: string; // Optional - can be extracted from URL
}

export function RestaurantProvider({ children, subdomain: propSubdomain }: RestaurantProviderProps) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subdomain, setSubdomain] = useState<string>(propSubdomain || '');

  // Extract subdomain from window.location if not provided
  useEffect(() => {
    if (!propSubdomain && typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname.includes('.')) {
        const extractedSubdomain = hostname.split('.')[0];
        if (extractedSubdomain !== 'www' && extractedSubdomain !== 'corgigo' && extractedSubdomain !== 'localhost') {
          setSubdomain(extractedSubdomain);
        }
      }
    }
  }, [propSubdomain]);

  // Load restaurant data by subdomain
  const loadRestaurant = async () => {
    if (!subdomain) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/restaurants/by-subdomain/${subdomain}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('ไม่พบร้านอาหารนี้');
        } else if (response.status === 403) {
          setError('ร้านอาหารนี้ถูกระงับการใช้งาน');
        } else {
          setError('เกิดข้อผิดพลาดในการโหลดข้อมูลร้าน');
        }
        setRestaurant(null);
        return;
      }

      const data = await response.json();
      setRestaurant(data.restaurant);
      
    } catch (error) {
      console.error('Error loading restaurant:', error);
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
      setRestaurant(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Load restaurant on subdomain change
  useEffect(() => {
    loadRestaurant();
  }, [subdomain]);

  // Generate theme from restaurant data
  const theme: RestaurantTheme = {
    primaryColor: restaurant?.themePrimaryColor || '#10B981',
    secondaryColor: restaurant?.themeSecondaryColor || '#F59E0B',
    accentColor: restaurant?.themeAccentColor || '#EF4444',
    logoUrl: restaurant?.logoUrl,
    bannerUrl: restaurant?.bannerUrl,
  };

  // Check if restaurant is suspended
  const isSuspended = restaurant?.isSuspended || restaurant?.status === 'SUSPENDED' || false;

  const contextValue: RestaurantContextType = {
    restaurant,
    theme,
    isLoading,
    isSuspended,
    subdomain,
    error,
    refreshRestaurant: loadRestaurant,
  };

  return (
    <RestaurantContext.Provider value={contextValue}>
      {children}
    </RestaurantContext.Provider>
  );
}

// Hook to use restaurant context
export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
}

// Theme hook for easier access
export function useRestaurantTheme() {
  const { theme } = useRestaurant();
  return theme;
}

export default RestaurantContext; 