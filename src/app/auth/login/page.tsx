'use client';

import { useState } from 'react';
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
  minHeight: '100dvh', // เปลี่ยนเป็น minHeight
  width: '100vw',
  display: 'flex',
  flexDirection: 'column',
  background: `linear-gradient(135deg, ${theme.background} 0%, ${theme.surface} 100%)`,
  margin: 0,
  padding: 0,
  overflowX: 'hidden', // ป้องกัน horizontal scroll เท่านั้น
  position: 'relative',
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
  padding: '5rem 1.5rem 2rem', // เพิ่ม top padding สำหรับ header
  paddingBottom: 'max(2rem, env(safe-area-inset-bottom) + 1rem)',
  position: 'relative',
  width: '100%',
  maxWidth: '400px',
  margin: '0 auto',
  minHeight: '100dvh', // ใช้ minHeight แทน height
}));

const BrandContainer = styled(Box)(() => ({
  textAlign: 'center',
  marginBottom: '2rem',
  position: 'relative',
}));

const StyledTextField = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px',
    backgroundColor: theme.background,
    fontSize: '1rem',
    height: '56px',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.border,
      borderWidth: '2px',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.accent,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.accent,
      borderWidth: '2px',
    },
  },
  '& .MuiInputLabel-root': {
    fontFamily: '"Prompt", sans-serif',
    color: theme.textSecondary,
    fontSize: '1rem',
    transform: 'translate(14px, 16px) scale(1)',
    '&.MuiInputLabel-shrink': {
      transform: 'translate(14px, -9px) scale(0.75)',
      backgroundColor: theme.background,
      padding: '0 8px',
    },
    '&.Mui-focused': {
      color: theme.accent,
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '16px 14px',
  },
}));

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

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
        {/* Header with Back Button */}
        <HeaderContainer>
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
            <ArrowBack sx={{ fontSize: 20, color: theme.textSecondary }} />
          </IconButton>
        </HeaderContainer>

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
      `}</style>
    </NoSSR>
  );
} 