'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface NavigationStackItem {
  path: string;
  title?: string;
  timestamp: number;
}

interface NavigationContextType {
  navigationStack: NavigationStackItem[];
  canGoBack: boolean;
  goBack: () => void;
  push: (path: string, title?: string) => void;
  replace: (path: string, title?: string) => void;
  getCurrentTitle: () => string | undefined;
  getPreviousTitle: () => string | undefined;
  clearStack: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
  children: ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [navigationStack, setNavigationStack] = useState<NavigationStackItem[]>([]);

  // Initialize stack on mount
  useEffect(() => {
    if (navigationStack.length === 0) {
      setNavigationStack([{
        path: pathname,
        title: getDefaultTitle(pathname),
        timestamp: Date.now(),
      }]);
    }
  }, [pathname, navigationStack.length]);

  // ฟังก์ชันสำหรับหา title เริ่มต้นตาม path
  const getDefaultTitle = (path: string): string => {
    const titleMap: Record<string, string> = {
      '/': 'หน้าหลัก',
      '/profile': 'โปรไฟล์',
      '/cart': 'ตรขวด',
      '/favorites': 'รายการโปรด',
      '/restaurant/register': 'สมัครเปิดร้านอาหาร',
      '/restaurant/pending': 'สถานะการสมัคร',
      '/restaurant': 'จัดการร้านอาหาร',
      '/orders': 'ประวัติคำสั่งซื้อ',
      '/settings': 'การตั้งค่า',
    };

    return titleMap[path] || 'CorgiGo';
  };

  const canGoBack = navigationStack.length > 1;

  const goBack = () => {
    if (canGoBack) {
      setNavigationStack(prev => {
        const newStack = [...prev];
        newStack.pop(); // ลบหน้าปัจจุบัน
        const previousPage = newStack[newStack.length - 1];
        
        if (previousPage) {
          router.push(previousPage.path);
        } else {
          router.push('/'); // fallback ไปหน้าหลัก
        }
        
        return newStack;
      });
    } else {
      // ถ้าไม่มีหน้าก่อนหน้า ให้ไปหน้าหลัก
      router.push('/');
    }
  };

  const push = (path: string, title?: string) => {
    const newItem: NavigationStackItem = {
      path,
      title: title || getDefaultTitle(path),
      timestamp: Date.now(),
    };

    setNavigationStack(prev => {
      // ตรวจสอบว่าหน้าปัจจุบันเป็นหน้าเดียวกันกับที่จะ push หรือไม่
      const currentItem = prev[prev.length - 1];
      if (currentItem && currentItem.path === path) {
        return prev; // ไม่เพิ่มซ้ำ
      }

      // เพิ่มหน้าใหม่เข้า stack
      return [...prev, newItem];
    });

    router.push(path);
  };

  const replace = (path: string, title?: string) => {
    const newItem: NavigationStackItem = {
      path,
      title: title || getDefaultTitle(path),
      timestamp: Date.now(),
    };

    setNavigationStack(prev => {
      const newStack = [...prev];
      newStack[newStack.length - 1] = newItem; // แทนที่หน้าปัจจุบัน
      return newStack;
    });

    router.push(path);
  };

  const getCurrentTitle = (): string | undefined => {
    const current = navigationStack[navigationStack.length - 1];
    return current?.title;
  };

  const getPreviousTitle = (): string | undefined => {
    if (navigationStack.length < 2) return undefined;
    return navigationStack[navigationStack.length - 2]?.title;
  };

  const clearStack = () => {
    setNavigationStack([{
      path: '/',
      title: 'หน้าหลัก',
      timestamp: Date.now(),
    }]);
  };

  const value: NavigationContextType = {
    navigationStack,
    canGoBack,
    goBack,
    push,
    replace,
    getCurrentTitle,
    getPreviousTitle,
    clearStack,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
} 