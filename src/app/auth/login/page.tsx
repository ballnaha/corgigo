'use client';

import { useState, useEffect } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import NoSSR from '@/components/NoSSR';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
  Fade,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  ArrowBack,
  Email,
  Lock,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const theme = {
  primary: '#382c30',
  secondary: '#F35C76',
  accent: '#F8A66E',
  background: '#FFFFFF',
  surface: '#FEFEFE',
  text: '#382c30',
  textSecondary: '#6B5B5D',
  textLight: '#A0969A',
  border: '#F0E6E2',
  success: '#10B981',
};

const FullScreenContainer = styled(Box)(() => ({
  minHeight: '100dvh',
  width: '100vw',
  display: 'flex',
  flexDirection: 'column',
  background: `linear-gradient(135deg, ${theme.background} 0%, ${theme.surface} 100%)`,
  margin: 0,
  padding: 0,
  overflowX: 'hidden',
  position: 'relative',
  '@media (max-width: 768px)': {
    minHeight: '100vh',
    height: '100vh',
    maxHeight: '100vh',
  },
}));

const HeaderContainer = styled(Box)(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  padding: '1rem',
  paddingTop: 'max(1rem, env(safe-area-inset-top) + 0.5rem)',
  zIndex: 10,
}));

const ContentWrapper = styled(Box)(() => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem 1.5rem 2rem',
  paddingBottom: 'max(2rem, env(safe-area-inset-bottom) + 1rem)',
  position: 'relative',
  width: '100%',
  maxWidth: '400px',
  margin: '0 auto',
  minHeight: '100dvh',
  '@media (max-width: 768px)': {
    minHeight: '100vh',
    height: '100vh',
    justifyContent: 'flex-start',
    paddingTop: '10vh',
  },
}));

const BrandContainer = styled(Box)(() => ({
  textAlign: 'center',
  marginBottom: '2rem',
  position: 'relative',
  '@media (max-width: 768px)': {
    marginBottom: '1.5rem',
  },
}));

const StyledTextField = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px',
    backgroundColor: theme.background,
    fontSize: '1rem',
    height: '56px',
    position: 'relative',
    overflow: 'hidden',
    '@media (max-width: 768px)': {
      fontSize: '16px !important',
      transition: 'none !important',
      transform: 'none !important',
      willChange: 'auto',
      backfaceVisibility: 'hidden',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.border,
      borderWidth: '2px',
      transition: 'border-color 0.2s ease',
      '@media (max-width: 768px)': {
        transition: 'none !important',
      },
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.accent,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.accent,
      borderWidth: '2px',
    },
    '&.Mui-focused': {
      backgroundColor: theme.background,
      transform: 'none !important',
      '@media (max-width: 768px)': {
        transform: 'none !important',
        transition: 'none !important',
      },
    },
  },
  '& .MuiInputLabel-root': {
    fontFamily: '"Prompt", sans-serif',
    color: theme.textSecondary,
    fontSize: '1rem',
    transform: 'translate(14px, 16px) scale(1)',
    transition: 'all 0.2s ease',
    '@media (max-width: 768px)': {
      fontSize: '16px !important',
      transition: 'none !important',
      transform: 'translate(14px, 16px) scale(1) !important',
      willChange: 'auto',
    },
    '&.MuiInputLabel-shrink': {
      transform: 'translate(14px, -9px) scale(0.75)',
      backgroundColor: theme.background,
      padding: '0 8px',
      '@media (max-width: 768px)': {
        transform: 'translate(14px, -9px) scale(0.75) !important',
        transition: 'none !important',
      },
    },
    '&.Mui-focused': {
      color: theme.accent,
      '@media (max-width: 768px)': {
        transition: 'none !important',
      },
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '16px 14px',
    '@media (max-width: 768px)': {
      fontSize: '16px !important',
      transition: 'none !important',
      transform: 'none !important',
      willChange: 'auto',
      '-webkit-appearance': 'none',
      '-webkit-tap-highlight-color': 'transparent',
    },
    '&:focus': {
      outline: 'none !important',
      backgroundColor: 'transparent !important',
      transform: 'none !important',
      '@media (max-width: 768px)': {
        fontSize: '16px !important',
        zoom: '1 !important',
      },
    },
  },
}));

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // ป้องกันการกระพริบเมื่อ keyboard ขึ้นมาใน mobile
  useEffect(() => {
    // ตรวจสอบว่าเป็น mobile หรือไม่
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (!isMobile) return;

    // เก็บค่า viewport เดิม
    const originalViewportHeight = window.innerHeight;
    const originalBodyHeight = document.body.style.height;
    const originalHtmlHeight = document.documentElement.style.height;
    
    // ตั้งค่า viewport meta tag เพื่อป้องกัน zoom
    const viewport = document.querySelector('meta[name=viewport]') as HTMLMetaElement;
    const originalViewportContent = viewport?.content || '';
    
    if (viewport) {
      viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
    }
    
    // ตั้งค่า initial state สำหรับ mobile
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100vh';
    document.documentElement.style.height = '100vh';
    
    // เพิ่ม CSS เพื่อป้องกันการกระพริบ
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 768px) {
        * {
          -webkit-backface-visibility: hidden !important;
          backface-visibility: hidden !important;
          -webkit-perspective: 1000px !important;
          perspective: 1000px !important;
        }
        
        input, textarea {
          -webkit-user-select: text !important;
          user-select: text !important;
          -webkit-appearance: none !important;
          appearance: none !important;
          font-size: 16px !important;
          transform: translateZ(0) !important;
        }
        
        .MuiOutlinedInput-root {
          transform: translateZ(0) !important;
        }
      }
    `;
    document.head.appendChild(style);

    const handleResize = () => {
      // ป้องกัน viewport jumping เมื่อ keyboard ขึ้นมา
      const currentHeight = window.innerHeight;
      const heightDifference = originalViewportHeight - currentHeight;
      
      if (heightDifference > 150) { // keyboard is likely open
        document.body.style.height = `${originalViewportHeight}px`;
        document.documentElement.style.height = `${originalViewportHeight}px`;
      } else {
        document.body.style.height = '100vh';
        document.documentElement.style.height = '100vh';
      }
    };

    const handleFocus = (e: FocusEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        // ป้องกันการ scroll และ zoom
        e.target.scrollIntoView = () => {}; // ปิด scrollIntoView
        
        // ป้องกัน iOS Safari zoom
        if (isIOS && viewport) {
          viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
        }
        
        setTimeout(() => {
          window.scrollTo(0, 0);
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
        }, 50);
      }
    };

    const handleBlur = () => {
      // รีเซ็ต viewport เมื่อ blur
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        
        // รีเซ็ต height
        document.body.style.height = '100vh';
        document.documentElement.style.height = '100vh';
      }, 100);
    };

    const handleTouchStart = (e: TouchEvent) => {
      // ป้องกัน pinch zoom
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      // ป้องกัน scroll เมื่อ keyboard เปิด
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // เพิ่ม event listeners
    window.addEventListener('resize', handleResize, { passive: false });
    document.addEventListener('focusin', handleFocus, { passive: false });
    document.addEventListener('focusout', handleBlur, { passive: false });
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      // รีเซ็ตค่าเดิม
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = originalBodyHeight;
      document.documentElement.style.height = originalHtmlHeight;
      
      // รีเซ็ต viewport
      if (viewport && originalViewportContent) {
        viewport.content = originalViewportContent;
      }
      
      // ลบ style ที่เพิ่มเข้าไป
      document.head.removeChild(style);
      
      // ลบ event listeners
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        role: 'CUSTOMER',
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        const session = await getSession();
        if (session?.user) {
          router.push('/');
        }
      }
    } catch (error: any) {
      setError(error.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <NoSSR>
      <FullScreenContainer>
        <ContentWrapper>
          <Fade in={true} timeout={600}>
            <Box sx={{ width: '100%' }}>
              {/* Brand */}
              <BrandContainer>
                <Image src="/images/corgigo-logo.webp" alt="CorgiGo" width={180} height={130} style={{ display: 'block' , marginLeft: 'auto' , marginRight: 'auto' , marginBottom: '1rem' }} />
                
                <Typography
                  variant="h6"
                  color={theme.textSecondary}
                  sx={{
                    fontFamily: '"Prompt", sans-serif',
                    fontWeight: 400,
                    fontSize: '1.1rem',
                  }}
                >
                  เข้าสู่ระบบบัญชีของคุณ
                </Typography>
              </BrandContainer>

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3,
                    borderRadius: '16px',
                    border: 'none',
                    bgcolor: '#FFF5F5',
                    color: theme.accent,
                    boxShadow: `0 4px 12px ${theme.accent}15`,
                  }}
                >
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                {/* Email Field */}
                <StyledTextField
                  fullWidth
                  label="อีเมล"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: theme.textLight, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }} // ลด spacing
                />

                {/* Password Field */}
                <StyledTextField
                  fullWidth
                  label="รหัสผ่าน"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: theme.textLight, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: theme.textLight }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }} // ลด spacing
                />

                {/* Login Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    bgcolor: theme.accent,
                    color: '#fff',
                    borderRadius: '16px',
                    py: 2,
                    fontFamily: '"Prompt", sans-serif',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    boxShadow: `0 8px 32px ${theme.accent}30`,
                    mb: 4,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                      transition: 'left 0.5s',
                    },
                    '&:hover': {
                      bgcolor: theme.accent,
                      boxShadow: `0 12px 40px ${theme.accent}40`,
                      transform: 'translateY(-2px)',
                      '&::before': {
                        left: '100%',
                      },
                    },
                    '&:disabled': {
                      bgcolor: theme.border,
                      color: theme.textLight,
                      transform: 'none',
                      boxShadow: 'none',
                    },
                    '&:active': {
                      transform: loading ? 'none' : 'translateY(0)',
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  {loading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          border: '2px solid transparent',
                          borderTop: '2px solid currentColor',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite',
                        }}
                      />
                      กำลังเข้าสู่ระบบ...
                    </Box>
                  ) : (
                    'เข้าสู่ระบบ'
                  )}
                </Button>

                {/* Register Link */}
                <Box textAlign="center">
                  <Typography
                    variant="body1"
                    color={theme.textSecondary}
                    sx={{ fontFamily: '"Prompt", sans-serif', mb: 1 }}
                  >
                    ยังไม่มีบัญชี?
                  </Typography>
                  <Button
                    onClick={() => router.push('/auth/register')}
                    variant="outlined"
                    fullWidth
                    sx={{
                      borderColor: theme.secondary,
                      color: theme.secondary,
                      borderRadius: '16px',
                      py: 1.5,
                      textTransform: 'none',
                      fontFamily: '"Prompt", sans-serif',
                      fontWeight: 500,
                      fontSize: '1rem',
                      '&:hover': {
                        borderColor: theme.secondary,
                        color: '#fff',
                        bgcolor: theme.secondary,
                        transform: 'translateY(-1px)',
                        boxShadow: `0 4px 12px ${theme.secondary}30`,
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    สมัครสมาชิก
                  </Button>
                </Box>

                {/* Forgot Password */}
                <Box textAlign="center" mt={3}>
                  <Button
                    onClick={() => router.push('/auth/forgot-password')}
                    sx={{
                      color: theme.textLight,
                      fontFamily: '"Prompt", sans-serif',
                      fontSize: '0.9rem',
                      textTransform: 'none',
                      '&:hover': {
                        color: theme.accent,
                        bgcolor: 'transparent',
                      },
                      transition: 'color 0.2s ease',
                    }}
                  >
                    ลืมรหัสผ่าน?
                  </Button>
                </Box>
              </Box>
            </Box>
          </Fade>
        </ContentWrapper>
      </FullScreenContainer>

      {/* Custom CSS for loading animation */}
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* ป้องกันการกระพริบใน mobile */
        @media (max-width: 768px) {
          html {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            height: 100%;
            overflow-x: hidden;
          }
          
          body {
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            overscroll-behavior: none;
            height: 100%;
            overflow-x: hidden;
            position: fixed;
            width: 100%;
          }
          
          input, textarea {
            -webkit-user-select: text;
            -khtml-user-select: text;
            -moz-user-select: text;
            -ms-user-select: text;
            user-select: text;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            border-radius: 0;
            background-color: transparent !important;
          }
          
          /* ปิด transition ทั้งหมดใน mobile */
          * {
            -webkit-transition: none !important;
            -moz-transition: none !important;
            -o-transition: none !important;
            transition: none !important;
          }
          
          /* ยกเว้น animation ที่จำเป็น */
          .MuiCircularProgress-root,
          .MuiCircularProgress-svg,
          [class*="spin"] {
            -webkit-transition: all 0.3s ease !important;
            -moz-transition: all 0.3s ease !important;
            -o-transition: all 0.3s ease !important;
            transition: all 0.3s ease !important;
          }
          
          /* ป้องกัน viewport jumping */
          .MuiOutlinedInput-root {
            transition: none !important;
            transform: none !important;
            will-change: auto !important;
          }
          
          .MuiInputLabel-root {
            transition: none !important;
            transform: translate(14px, 16px) scale(1) !important;
            will-change: auto !important;
          }
          
          .MuiInputLabel-shrink {
            transform: translate(14px, -9px) scale(0.75) !important;
          }
          
          /* ป้องกัน flash of content */
          .MuiOutlinedInput-notchedOutline {
            transition: none !important;
            will-change: auto !important;
          }
          
          /* ป้องกัน focus effects */
          .MuiOutlinedInput-root.Mui-focused {
            transform: none !important;
            box-shadow: none !important;
          }
          
          /* ป้องกัน input zoom */
          input:focus {
            transform: none !important;
            zoom: 1 !important;
          }
        }
        
        /* ป้องกัน iOS Safari zoom */
        @supports (-webkit-touch-callout: none) {
          input[type="email"],
          input[type="password"],
          input[type="text"],
          textarea {
            font-size: 16px !important;
            transform: none !important;
          }
          
          /* ป้องกัน Safari viewport bug */
          body {
            position: fixed;
            overflow: hidden;
            width: 100%;
            height: 100%;
          }
          
          #__next {
            height: 100%;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
          }
        }
      `}</style>
    </NoSSR>
  );
} 