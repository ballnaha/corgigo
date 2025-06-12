'use client';

import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';
import createEmotionCache from '@/lib/emotionCache';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

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
  },
});

interface ThemeProviderProps {
  children: React.ReactNode;
  emotionCache?: typeof clientSideEmotionCache;
}

export default function ThemeProvider({ 
  children, 
  emotionCache = clientSideEmotionCache 
}: ThemeProviderProps) {
  return (
    <CacheProvider value={emotionCache}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </CacheProvider>
  );
} 