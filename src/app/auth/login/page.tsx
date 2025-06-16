'use client';

import { useState, useEffect } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import NoSSR from '@/components/NoSSR';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { colors } from '@/config/colors';
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Fade,
  Checkbox,
  FormControlLabel,
  Link,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  ArrowBack,
  Email,
  Lock,
  Facebook,
  Twitter,
  Apple,
  Chat,
  Google,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { getLineRedirectUri } from '@/config/urls';

const theme = {
  primary: colors.secondary.fresh,      // Green สำหรับ primary
  secondary: colors.accent.warm,        // Orange สำหรับ secondary
  accent: colors.primary.golden,        // Golden สำหรับ accent/CTA
  background: colors.neutral.white,     // White background
  surface: colors.neutral.lightGray,    // Light gray surface
  text: colors.neutral.darkGray,        // Dark gray text
  textSecondary: colors.neutral.gray,   // Gray secondary text
  textLight: colors.neutral.gray,       // Gray light text
  border: colors.neutral.lightGray,     // Light gray borders
  success: colors.secondary.fresh,      // Green for success
};

const FullScreenContainer = styled(Box)(() => ({
  minHeight: '100dvh',
  width: '100vw',
  display: 'flex',
  flexDirection: 'column',
  background: `linear-gradient(135deg, ${theme.background} 0%, ${theme.surface} 100%)`,
  position: 'relative',
  margin: 0,
  padding: 0,
  overflowX: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '300px',
    background: `
      radial-gradient(ellipse at top left, rgba(248, 166, 110, 0.1) 0%, transparent 50%),
      linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.02) 50%, transparent 100%)
    `,
    zIndex: 1,
  },
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
  zIndex: 2,
  '@media (max-width: 768px)': {
    minHeight: '100vh',
    height: '100vh',
    justifyContent: 'flex-start',
    paddingTop: '8vh',
  },
}));

const CardContainer = styled(Box)(() => ({
  backgroundColor: '#FFFFFF',
  borderRadius: '24px 24px 0 0',
  minHeight: '100dvh',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '3rem 2rem 2rem',
  paddingBottom: 'max(2rem, env(safe-area-inset-bottom) + 1rem)',
  position: 'relative',
  maxWidth: '100%',
  margin: '0 auto',
  marginTop: '10vh',
  zIndex: 2,
  boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)',
  '@media (max-width: 768px)': {
    minHeight: '90vh',
    marginTop: '10vh',
    borderRadius: '24px 24px 0 0',
    padding: '2rem 1.5rem 2rem',
  },
}));

const BrandContainer = styled(Box)(() => ({
  textAlign: 'center',
  marginBottom: '3rem',
  position: 'relative',
  '@media (max-width: 768px)': {
    marginBottom: '2rem',
  },
}));

const SocialButton = styled(IconButton)(() => ({
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  margin: '0 8px',
  color: '#fff',
  '&:hover': {
    transform: 'translateY(-2px)',
    transition: 'all 0.2s ease',
  },
}));

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLineLogin, setIsLineLogin] = useState(false);
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  // ตรวจสอบ LINE callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const lineToken = urlParams.get('line_token');
    const success = urlParams.get('success');
    const error = urlParams.get('error');

    if (success === 'true' && lineToken) {
      // LINE login สำเร็จ
      setIsLineLogin(true);
      handleLineCallback(lineToken);
    } else if (error) {
      // LINE login ผิดพลาด
      const errorMessages: Record<string, string> = {
        'line_login_failed': 'การเข้าสู่ระบบ LINE ล้มเหลว',
        'no_code': 'ไม่ได้รับรหัสยืนยันจาก LINE',
        'token_exchange_failed': 'ไม่สามารถแลกเปลี่ยน token ได้',
        'profile_failed': 'ไม่สามารถดึงข้อมูลโปรไฟล์ได้',
        'login_failed': 'การเข้าสู่ระบบล้มเหลว',
        'callback_error': 'เกิดข้อผิดพลาดในการประมวลผล',
      };
      showSnackbar(errorMessages[error] || 'เกิดข้อผิดพลาดไม่ทราบสาเหตุ', 'error');
      
      // ลบ error parameters จาก URL
      window.history.replaceState({}, document.title, '/auth/login');
    }
  }, []);

  // ป้องกันการกระพริบเมื่อ keyboard ขึ้นมาใน mobile
  useEffect(() => {
    // ตรวจสอบว่าเป็น mobile หรือไม่
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (!isMobile) return;

    // สำหรับ iOS ใช้วิธีป้องกันที่แตกต่าง
    if (isIOS) {
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
    }

    let isKeyboardOpen = false;
    const initialHeight = window.innerHeight;
    let resizeTimeout: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const currentHeight = window.innerHeight;
        const heightDifference = initialHeight - currentHeight;
        
        if (heightDifference > 150) {
          if (!isKeyboardOpen) {
            isKeyboardOpen = true;
            document.body.style.height = `${currentHeight}px`;
            document.documentElement.style.height = `${currentHeight}px`;
          }
        } else {
          if (isKeyboardOpen) {
            isKeyboardOpen = false;
            document.body.style.height = '';
            document.documentElement.style.height = '';
          }
        }
      }, 100);
    };

    const handleFocus = (e: FocusEvent) => {
      if (e.target && e.target instanceof HTMLInputElement) {
        const target = e.target as HTMLInputElement;
        setTimeout(() => {
          target.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          });
        }, 300);
      }
    };

    const handleBlur = () => {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    };

    // ป้องกัน double-tap zoom
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Event listeners
    window.addEventListener('resize', handleResize);
    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleBlur);
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      
      // คืนค่าเดิม
      document.body.style.height = '';
      document.documentElement.style.height = '';
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        showSnackbar('อีเมลหรือรหัสผ่านไม่ถูกต้อง', 'error');
      } else {
        showSnackbar('เข้าสู่ระบบสำเร็จ', 'success');
        const session = await getSession();
        if (session?.user?.primaryRole === 'RESTAURANT') {
          router.push('/');
        } else {
          router.push('/');
        }
      }
    } catch (error) {
      showSnackbar('เกิดข้อผิดพลาดในการเข้าสู่ระบบ', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  // ฟังก์ชันสำหรับจัดการ LINE callback token
  const handleLineCallback = async (token: string) => {
    try {
      setLoading(true);
      showSnackbar('กำลังดำเนินการเข้าสู่ระบบ...', 'info');

      const tokenData = JSON.parse(Buffer.from(token, 'base64').toString());
      
      // ตรวจสอบความถูกต้องของ token (ไม่เก่าเกิน 5 นาที)
      if (Date.now() - tokenData.timestamp > 5 * 60 * 1000) {
        showSnackbar('Token หมดอายุ กรุณาลองใหม่อีกครั้ง', 'error');
        return;
      }

      // Sign in with NextAuth
      const signInResult = await signIn('credentials', {
        email: tokenData.email,
        password: 'line_login',
        redirect: false,
      });

      if (!signInResult?.error) {
        showSnackbar('เข้าสู่ระบบด้วย LINE สำเร็จ!', 'success');
        const session = await getSession();
        if (session?.user?.primaryRole === 'RESTAURANT') {
          router.push('/');
        } else {
          router.push('/');
        }
      } else {
        showSnackbar('เกิดข้อผิดพลาดในการเข้าสู่ระบบ', 'error');
      }
    } catch (error) {
      showSnackbar('Token ไม่ถูกต้อง', 'error');
    } finally {
      setLoading(false);
      // ลบ parameters จาก URL
      window.history.replaceState({}, document.title, '/auth/login');
    }
  };

  const handleLineLogin = async () => {
    try {
      setLoading(true);
      setIsLineLogin(true);
      showSnackbar('กำลังเปิดหน้า LINE Login...', 'info');
      
      // สร้าง LINE Login URL
      const lineLoginUrl = new URL('https://access.line.me/oauth2/v2.1/authorize');
      lineLoginUrl.searchParams.set('response_type', 'code');
      lineLoginUrl.searchParams.set('client_id', process.env.NEXT_PUBLIC_LINE_CHANNEL_ID || '');
      lineLoginUrl.searchParams.set('redirect_uri', getLineRedirectUri());
      
      lineLoginUrl.searchParams.set('state', Math.random().toString(36).substring(7));
      lineLoginUrl.searchParams.set('scope', 'profile openid');
      
      // เปิดหน้า LINE Login
      window.location.href = lineLoginUrl.toString();
      
    } catch (error) {
      showSnackbar('เกิดข้อผิดพลาดในการเปิดหน้า LINE Login', 'error');
      setLoading(false);
    }
  };

  // ฟังก์ชันสำหรับ LIFF (LINE Frontend Framework)
  const handleLiffLogin = async () => {
    try {
      setLoading(true);
      setIsLineLogin(true);
      showSnackbar('กำลังเข้าสู่ระบบด้วย LINE...', 'info');

      // เช็คว่าอยู่ใน LINE App หรือไม่
      if (typeof window !== 'undefined' && (window as any).liff) {
        const liff = (window as any).liff;
        
        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }
        
        const accessToken = liff.getAccessToken();
        
        const response = await fetch('/api/auth/line-callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ accessToken }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          showSnackbar(result.message, 'success');
          
          // Sign in with NextAuth
          const signInResult = await signIn('credentials', {
            email: result.user.email,
            password: 'line_login',
            redirect: false,
          });

          if (!signInResult?.error) {
            const session = await getSession();
            if (session?.user?.primaryRole === 'RESTAURANT') {
              router.push('/');
            } else {
              router.push('/');
            }
          } else {
            showSnackbar('เกิดข้อผิดพลาดในการเข้าสู่ระบบ', 'error');
          }
        } else {
          showSnackbar(result.error || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย LINE', 'error');
        }
      } else {
        // ถ้าไม่อยู่ใน LINE App ให้ใช้ Web Login
        handleLineLogin();
      }
    } catch (error) {
      showSnackbar('เกิดข้อผิดพลาดในการเชื่อมต่อ', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <NoSSR>
      <FullScreenContainer>
        <CardContainer>
          <Fade in={true} timeout={600}>
            <Box sx={{ width: '100%', maxWidth: '400px' }}>
              {/* Brand */}
              <BrandContainer>
                <Image src="/images/header-logo.png" alt="logo" width={200} height={60} />
                
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: '"Prompt", sans-serif',
                    fontWeight: 400,
                    fontSize: '1rem',
                    color: '#666666',
                  }}
                >
                  เข้าสู่ระบบ
                </Typography>
              </BrandContainer>

              <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                {/* Show form fields only when not in LINE login mode */}
                {!isLineLogin && (
                  <>
                    {/* Email Field */}
                    <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: '"Prompt", sans-serif',
                      color: theme.text,
                      mb: 1,
                      fontWeight: 500,
                    }}
                  >
                    EMAIL
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="example@gmail.com"
                    type="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: colors.neutral.lightGray,
                        fontSize: '1rem',
                        height: '56px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: colors.neutral.lightGray,
                          borderWidth: '1px',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.accent,
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.accent,
                          borderWidth: '2px',
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        padding: '16px 14px',
                        color: theme.text,
                        fontFamily: '"Prompt", sans-serif',
                        '@media (max-width: 768px)': {
                          fontSize: '16px !important',
                        },
                      },
                    }}
                  />
                </Box>

                {/* Password Field */}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: '"Prompt", sans-serif',
                      color: theme.text,
                      mb: 1,
                      fontWeight: 500,
                    }}
                  >
                    PASSWORD
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="••••••••••••"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: colors.neutral.lightGray,
                        fontSize: '1rem',
                        height: '56px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: colors.neutral.lightGray,
                          borderWidth: '1px',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.accent,
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.accent,
                          borderWidth: '2px',
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        padding: '16px 14px',
                        color: theme.text,
                        fontFamily: '"Prompt", sans-serif',
                        '@media (max-width: 768px)': {
                          fontSize: '16px !important',
                        },
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: theme.textSecondary }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                {/* Remember me & Forgot Password */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 3 
                }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        sx={{
                          color: theme.textSecondary,
                          '&.Mui-checked': {
                            color: theme.primary,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: '"Prompt", sans-serif',
                          color: theme.textSecondary,
                          fontSize: '0.9rem',
                        }}
                      >
                        Remember me
                      </Typography>
                    }
                  />
                  
                  <Link
                    component="button"
                    type="button"
                    onClick={() => router.push('/auth/forgot-password')}
                    sx={{
                      color: theme.secondary,
                      fontFamily: '"Prompt", sans-serif',
                      fontSize: '0.9rem',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Forgot Password?
                  </Link>
                </Box>
                  </>
                )}

                {/* Show login status for LINE mode */}
                {isLineLogin && (
                  <Box 
                    sx={{ 
                      textAlign: 'center', 
                      mb: 4,
                      p: 3,
                      backgroundColor: `${colors.secondary.lightFresh}20`,
                      borderRadius: '16px',
                      border: `2px solid ${colors.secondary.fresh}`,
                    }}
                  >
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="h2"
                        sx={{
                          fontSize: '3rem',
                          mb: 1,
                          animation: 'spin 2s linear infinite',
                        }}
                      >
                        🔄
                      </Typography>
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: '"Prompt", sans-serif',
                        color: colors.secondary.fresh,
                        fontWeight: 600,
                        mb: 1,
                      }}
                    >
                      กำลังเข้าสู่ระบบด้วย LINE
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: '"Prompt", sans-serif',
                        color: theme.textSecondary,
                        mb: 2,
                      }}
                    >
                      กรุณารอสักครู่...
                    </Typography>
                    <Box
                      sx={{
                        width: '100%',
                        height: '4px',
                        backgroundColor: colors.neutral.lightGray,
                        borderRadius: '2px',
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          width: '30%',
                          height: '100%',
                          backgroundColor: colors.secondary.fresh,
                          borderRadius: '2px',
                          animation: 'loading 1.5s ease-in-out infinite',
                        }}
                      />
                    </Box>
                    
                    {/* Cancel Button */}
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setIsLineLogin(false);
                        setLoading(false);
                        window.history.replaceState({}, document.title, '/auth/login');
                      }}
                      sx={{
                        mt: 2,
                        color: colors.secondary.fresh,
                        borderColor: colors.secondary.fresh,
                        fontFamily: '"Prompt", sans-serif',
                        '&:hover': {
                          borderColor: colors.secondary.darkFresh,
                          backgroundColor: `${colors.secondary.fresh}08`,
                        },
                      }}
                    >
                      ยกเลิก
                    </Button>
                  </Box>
                )}

                {/* Login Button - Show only for normal login */}
                {!isLineLogin && (
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    bgcolor: theme.accent,
                    color: colors.neutral.white,
                    borderRadius: '12px',
                    py: 2,
                    fontFamily: '"Prompt", sans-serif',
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'none',
                    mb: 3,
                    '&:hover': {
                      bgcolor: colors.primary.darkGolden,
                    },
                    '&:disabled': {
                      bgcolor: theme.border,
                      color: theme.textLight,
                    },
                  }}
                >
                  {loading ? 'กำลังเข้าสู่ระบบ...' : 'LOG IN'}
                </Button>
                )}

                {/* Register Link - Show only for normal login */}
                {!isLineLogin && (
                <Box textAlign="center" sx={{ mb: 3 }}>
                  <Typography
                    variant="body1"
                    sx={{ 
                      fontFamily: '"Prompt", sans-serif',
                      color: theme.textSecondary,
                      display: 'inline',
                    }}
                  >
                    ยังไม่มีบัญชี?{' '}
                  </Typography>
                  <Link
                    component="button"
                    type="button"
                    onClick={() => router.push('/auth/register')}
                    sx={{
                      color: theme.secondary,
                      fontFamily: '"Prompt", sans-serif',
                      fontWeight: 600,
                      textDecoration: 'none',
                      cursor: 'pointer',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    สมัครสมาชิก
                  </Link>
                </Box>
                )}
                
              </Box>
            </Box>
          </Fade>
        </CardContainer>
      </FullScreenContainer>

      {/* Custom CSS for loading animation */}
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(300%); }
          100% { transform: translateX(-100%); }
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
            font-size: 16px !important;
            transform: none !important;
            transition: none !important;
            -webkit-appearance: none;
            -webkit-tap-highlight-color: transparent;
          }
          
          .MuiTextField-root input {
            font-size: 16px !important;
            zoom: 1 !important;
          }
          
          .MuiTextField-root input:focus {
            font-size: 16px !important;
            zoom: 1 !important;
            transform: none !important;
          }
        }
        
        /* เอฟเฟคสำหรับปุ่ม */
        .MuiButton-root {
          position: relative;
          overflow: hidden;
        }
        
        .MuiButton-root::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        
        .MuiButton-root:active::before {
          width: 300px;
          height: 300px;
        }
      `}</style>
    </NoSSR>
  );
} 