'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
  type: 'MEAL_PLAN' | 'MENU_ITEM';
  specialInstructions?: string;
  // เพิ่ม add-ons ตาม DB structure
  addOns?: Array<{
    id: string;
    name: string;
    price: number;
  }>;
}

export interface CartContextType {
  items: CartItem[];
  itemCount: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  notificationCount: number;
  clearNotifications: () => void;
  isLoaded: boolean; // เพิ่ม state เพื่อบอกว่า cart โหลดเสร็จแล้ว
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on mount - one time only
  useEffect(() => {
    // ตรวจสอบว่าเป็น client-side ก่อน
    if (typeof window === 'undefined') return;
    
    try {
      const savedCart = localStorage.getItem('corgigo_cart');
      const savedNotifications = localStorage.getItem('corgigo_notifications');
      
      if (savedCart && savedCart !== 'undefined' && savedCart !== 'null') {
        const parsedCart = JSON.parse(savedCart);
        // ตรวจสอบว่าเป็น array และมีข้อมูลถูกต้อง
        if (Array.isArray(parsedCart)) {
          setItems(parsedCart);
        }
      }
      
      if (savedNotifications && savedNotifications !== 'undefined' && savedNotifications !== 'null') {
        const parsedNotifications = JSON.parse(savedNotifications);
        if (typeof parsedNotifications === 'number' && !isNaN(parsedNotifications)) {
          setNotificationCount(parsedNotifications);
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      // ถ้าเกิดข้อผิดพลาด ให้ clear localStorage และเริ่มใหม่
      try {
        localStorage.removeItem('corgigo_cart');
        localStorage.removeItem('corgigo_notifications');
      } catch (e) {
        console.error('Error clearing corrupted localStorage:', e);
      }
    } finally {
      // Mark as hydrated regardless of success/failure
      setIsHydrated(true);
    }
  }, []);

  // Save cart to localStorage whenever items change (but only after hydration)
  useEffect(() => {
    // ตรวจสอบว่าเป็น client-side และ hydrated แล้ว
    if (typeof window === 'undefined' || !isHydrated) return;
    
    try {
      localStorage.setItem('corgigo_cart', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [items, isHydrated]);

  // Save notification count to localStorage (but only after hydration)
  useEffect(() => {
    // ตรวจสอบว่าเป็น client-side และ hydrated แล้ว
    if (typeof window === 'undefined' || !isHydrated) return;
    
    try {
      localStorage.setItem('corgigo_notifications', JSON.stringify(notificationCount));
    } catch (error) {
      console.error('Error saving notifications to localStorage:', error);
    }
  }, [notificationCount, isHydrated]);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => {
    const basePrice = item.price;
    const addOnsPrice = item.addOns?.reduce((sum, addOn) => sum + addOn.price, 0) || 0;
    return total + ((basePrice + addOnsPrice) * item.quantity);
  }, 0);

  const addItem = (newItem: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setItems(currentItems => {
      // สร้าง unique key ที่รวม id + add-ons + special instructions
      const createItemKey = (item: any) => {
        const addOnsKey = item.addOns ? 
          item.addOns.map((a: any) => a.id).sort().join(',') : '';
        const instructionsKey = item.specialInstructions || '';
        return `${item.id}_${addOnsKey}_${instructionsKey}`;
      };

      const newItemKey = createItemKey(newItem);
      const existingItem = currentItems.find(item => 
        createItemKey(item) === newItemKey
      );
      
      if (existingItem) {
        // Update quantity of existing item with same configuration
        return currentItems.map(item =>
          createItemKey(item) === newItemKey
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item with unique configuration
        const uniqueId = `${newItem.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return [...currentItems, { ...newItem, id: uniqueId, quantity }];
      }
    });
    
    // Increase notification count when item is added
    setNotificationCount(prev => prev + 1);
  };

  const removeItem = (itemId: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const clearNotifications = () => {
    setNotificationCount(0);
  };

  const value: CartContextType = {
    items,
    itemCount,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    notificationCount,
    clearNotifications,
    isLoaded: isHydrated, // ใช้ isHydrated เป็น isLoaded
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 