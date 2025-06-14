'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import Image from 'next/image';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Fade,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  ArrowBack as ArrowBackIcon,
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Phone,
  Lock,
} from '@mui/icons-material';
import NoSSR from '@/components/NoSSR';
import { useSnackbar } from '@/contexts/SnackbarContext';

const theme = {
  primary: '#382c30', // Dark brown
  secondary: '#F35C76', // Pink
  accent: '#F8A66E', // Orange
  background: '#FFFFFF',
  surface: '#FEFEFE',
  text: '#382c30',
  textSecondary: '#6B5B5D',
  textLight: '#A0969A',
  border: '#F0E6E2',
  success: '#10B981',
};

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

const phoneRegex = /^(\+66[\s]?[6-9][\s]?[0-9]{4}[\s]?[0-9]{4}|0[6-9][0-9][\-\s]?[0-9]{3}[\-\s]?[0-9]{4})$/;

const customerSchema = z.object({
  firstName: z.string()
    .min(1, 'กรุณากรอกชื่อ')
    .min(2, 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร')
    .max(50, 'ชื่อต้องไม่เกิน 50 ตัวอักษร'),
  lastName: z.string()
    .min(1, 'กรุณากรอกนามสกุล')
    .min(2, 'นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร')
    .max(50, 'นามสกุลต้องไม่เกิน 50 ตัวอักษร'),
  email: z.string()
    .min(1, 'กรุณากรอกอีเมล')
    .email('รูปแบบอีเมลไม่ถูกต้อง'),
  phone: z.string()
    .regex(phoneRegex, 'รูปแบบเบอร์โทรไม่ถูกต้อง (ตัวอย่าง: 0812345678)'),
  password: z.string()
    .min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
    .max(100, 'รหัสผ่านต้องไม่เกิน 100 ตัวอักษร'),
  confirmPassword: z.string()
    .min(1, 'กรุณายืนยันรหัสผ่าน'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'รหัสผ่านไม่ตรงกัน',
  path: ['confirmPassword'],
});

export default function RegisterClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [targetRole, setTargetRole] = useState<'CUSTOMER' | 'RESTAURANT'>('CUSTOMER');

  useEffect(() => {
    const role = searchParams?.get('role');
    if (role === 'RESTAURANT') {
      setTargetRole('RESTAURANT');
    }
  }, [searchParams]);

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

  const handleChange = (field: string) => (e: any) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // ล้าง error ของ field นั้นๆ
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Real-time validation สำหรับ field สำคัญ
    if (field === 'confirmPassword' && formData.password && value && value !== formData.password) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: 'รหัสผ่านไม่ตรงกัน'
      }));
    }
  };

  const validateForm = () => {
    try {
      customerSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showSnackbar('กรุณาตรวจสอบข้อมูลและแก้ไขข้อผิดพลาด', 'error');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          role: targetRole,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
      }

      showSnackbar('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ', 'success');
      
      // รอ 1.5 วินาทีก่อน redirect เพื่อให้เห็น success message
      setTimeout(() => {
        router.push('/auth/login?message=register-success');
      }, 1500);
      
    } catch (error: any) {
      showSnackbar(error.message, 'error');
      setErrors({ submit: error.message }); // เก็บไว้สำหรับ UI fallback
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <NoSSR>
      <Box
        sx={{
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: `linear-gradient(135deg, ${theme.background} 0%, ${theme.surface} 100%)`,
          margin: 0,
          padding: 0,
          overflowX: 'hidden',
          overflowY: 'auto',
          position: 'relative',
          // ปรับปรุงสำหรับ mobile
          '@media (max-width: 768px)': {
            minHeight: '100vh',
            height: '100vh',
            maxHeight: '100vh',
          },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            padding: '1rem',
            paddingTop: 'max(1rem, env(safe-area-inset-top) + 0.5rem)',
            
            zIndex: 10,
          }}
        >
          <IconButton
            onClick={handleBack}
            sx={{
              bgcolor: theme.background,
              width: 48,
              height: 48,
              border: `1px solid ${theme.border}`,
              boxShadow: `0 4px 12px ${theme.accent}20`,
              '&:hover': { 
                bgcolor: theme.surface,
                transform: 'translateY(-1px)',
                boxShadow: `0 6px 16px ${theme.accent}30`,
              },
              transition: 'all 0.2s ease',
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 20, color: theme.textSecondary }} />
          </IconButton>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            padding: '5rem 1.5rem 2rem',
            paddingBottom: 'max(2rem, env(safe-area-inset-bottom) + 1rem)',
            position: 'relative',
            width: '100%',
            maxWidth: '400px',
            margin: '0 auto',
            minHeight: 'calc(100vh - 2rem)',
            // ปรับปรุงสำหรับ mobile
            '@media (max-width: 768px)': {
              minHeight: '100vh',
              height: '100vh',
              justifyContent: 'flex-start',
              paddingTop: '8vh',
              padding: '8vh 1.5rem 2rem',
              
            },
          }}
        >
          <Fade in={true} timeout={600}>
            <Box sx={{ width: '100%' }}>
              <Box
                sx={{
                  textAlign: 'center',
                  marginBottom: '1.5rem',
                  position: 'relative',
                  '@media (max-width: 768px)': {
                    marginBottom: '1rem',
                  },
                }}
              >

                <Image src="/images/corgigo-logo.webp" alt="CorgiGo" width={180} height={130} style={{ display: 'block' , marginLeft: 'auto' , marginRight: 'auto' , marginBottom: '1rem' }} />
                
                <Typography
                  variant="body1"
                  color={theme.textSecondary}
                  sx={{
                    fontFamily: '"Prompt", sans-serif',
                    fontWeight: 400,
                    fontSize: '1rem',
                  }}
                >
                  {targetRole === 'RESTAURANT' ? 'สมัครเปิดร้านอาหารกับ CorgiGo' : 'สมัครสมาชิกกับ CorgiGo'}
                </Typography>
              </Box>

              {errors.submit && (
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
                  {errors.submit}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                <StyledTextField
                  fullWidth
                  label="ชื่อ"
                  value={formData.firstName}
                  onChange={handleChange('firstName')}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: theme.textLight, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    mb: 3,
                    '@media (max-width: 768px)': {
                      mb: 2,
                    },
                  }}
                />

                <StyledTextField
                  fullWidth
                  label="นามสกุล"
                  value={formData.lastName}
                  onChange={handleChange('lastName')}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: theme.textLight, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    mb: 3,
                    '@media (max-width: 768px)': {
                      mb: 2,
                    },
                  }}
                />

                <StyledTextField
                  fullWidth
                  label="อีเมล"
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  error={!!errors.email}
                  helperText={errors.email}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: theme.textLight, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    mb: 3,
                    '@media (max-width: 768px)': {
                      mb: 2,
                    },
                  }}
                />

                <StyledTextField
                  fullWidth
                  label="เบอร์โทรศัพท์"
                  value={formData.phone}
                  onChange={handleChange('phone')}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  placeholder="0812345678"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ color: theme.textLight, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    mb: 3,
                    '@media (max-width: 768px)': {
                      mb: 2,
                    },
                  }}
                />

                <StyledTextField
                  fullWidth
                  label="รหัสผ่าน"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange('password')}
                  error={!!errors.password}
                  helperText={errors.password}
                  required
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
                  sx={{ 
                    mb: 3,
                    '@media (max-width: 768px)': {
                      mb: 2,
                    },
                  }}
                />

                <StyledTextField
                  fullWidth
                  label="ยืนยันรหัสผ่าน"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: theme.textLight, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          sx={{ color: theme.textLight }}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    mb: 3,
                    '@media (max-width: 768px)': {
                      mb: 2,
                    },
                  }}
                />

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
                    mb: 3,
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
                      <CircularProgress size={20} color="inherit" />
                      กำลังสมัครสมาชิก...
                    </Box>
                  ) : (
                    'สมัครสมาชิก'
                  )}
                </Button>

                <Box textAlign="center">
                  <Typography
                    variant="body1"
                    color={theme.textSecondary}
                    sx={{ fontFamily: '"Prompt", sans-serif', mb: 1 }}
                  >
                    มีบัญชีแล้ว?
                  </Typography>
                  <Button
                    onClick={() => router.push('/auth/login')}
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
                      marginBottom: 'max(1rem, env(safe-area-inset-bottom) + 0.5rem)',
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
                    เข้าสู่ระบบ
                  </Button>
                </Box>
              </Box>
            </Box>
          </Fade>
        </Box>
      </Box>
    </NoSSR>
  );
} 