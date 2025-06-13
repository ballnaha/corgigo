'use client';

import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';
import createEmotionCache from '@/lib/emotionCache';
import { useState, useEffect } from 'react';

// Create MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#382c30',
    },
    secondary: {
      main: '#F35C76',
    },
  },
  spacing: 8, // Base spacing unit (8px)
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          fontFamily: '"Prompt", sans-serif',
        },
      },
    },
    // Global Container สำหรับ mobile-first
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '8px !important', // Mobile: padding น้อย
          paddingRight: '8px !important',
          '@media (min-width: 600px)': {
            paddingLeft: '16px !important', // Desktop: padding ปกติ
            paddingRight: '16px !important',
          },
        },
      },
    },
    // Card สำหรับ mobile-first  
    MuiCard: {
      styleOverrides: {
        root: {
          '@media (max-width: 599px)': {
            borderRadius: '0px !important', // Mobile: ไม่มี border radius
            marginLeft: 0,
            marginRight: 0,
            borderLeft: 'none',
            borderRight: 'none',
          },
        },
      },
    },
    // CardContent สำหรับ mobile-first
    MuiCardContent: {
      styleOverrides: {
        root: {
          '@media (max-width: 599px)': {
            padding: '12px !important', // Mobile: padding น้อย
          },
          '@media (min-width: 600px)': {
            padding: '16px !important', // Desktop: padding ปกติ
          },
          '&:last-child': {
            '@media (max-width: 599px)': {
              paddingBottom: '12px !important',
            },
            '@media (min-width: 600px)': {
              paddingBottom: '16px !important',
            },
          },
        },
      },
    },
  },
});

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Create emotion cache only on client side
  const emotionCache = createEmotionCache();

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <CacheProvider value={emotionCache}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </CacheProvider>
  );
} 