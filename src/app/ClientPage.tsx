'use client';

import ThemeClientProvider from '../components/ThemeClientProvider';
import HomePage from './client';

export default function ClientPage() {
  return (
    <ThemeClientProvider>
      <HomePage />
    </ThemeClientProvider>
  );
} 