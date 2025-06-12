'use client';

import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '../lib/emotion';
import theme from '../theme';

// Create emotion cache for client-side only
const clientSideEmotionCache = createEmotionCache();

interface ThemeClientProviderProps {
  children: React.ReactNode;
}

export default function ThemeClientProvider({ children }: ThemeClientProviderProps) {
  return (
    <CacheProvider value={clientSideEmotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
} 