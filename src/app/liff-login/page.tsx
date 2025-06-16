'use client';

import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Box, Typography, LinearProgress, Fade, Slide } from '@mui/material';
import { getBaseUrl } from '@/config/urls';

declare global {
  interface Window {
    liff: any;
  }
}

export default function LiffLoginPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('กำลังตรวจสอบการเข้าสู่ระบบ...');
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(1);
  const router = useRouter();

  // Progress animation
  useEffect(() => {
    if (status === 'loading') {
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          const diff = Math.random() * 10;
          return Math.min(oldProgress + diff, 90);
        });
      }, 500);

      return () => {
        clearInterval(timer);
      };
    }
  }, [status]);

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        // ตรวจสอบว่า LIFF SDK โหลดแล้วหรือยัง
        if (typeof window !== 'undefined' && window.liff) {
          await handleLiffLogin();
        } else {
          // โหลด LIFF SDK
          setMessage('กำลังโหลด LINE SDK...');
          setStep(1);
          const script = document.createElement('script');
          script.src = 'https://static.line-scdn.net/liff/edge/2/sdk.js';
          script.onload = () => handleLiffLogin();
          script.onerror = () => {
            setStatus('error');
            setMessage('ไม่สามารถโหลด LINE SDK ได้');
          };
          document.head.appendChild(script);
        }
      } catch (error) {
        console.error('LIFF initialization error:', error);
        setStatus('error');
        setMessage('เกิดข้อผิดพลาดในการเตรียมระบบ');
      }
    };

    const handleLiffLogin = async () => {
      try {
        setMessage('กำลังเตรียมระบบ LINE...');
        setStep(2);
        
        // Initialize LIFF
        await window.liff.init({ 
          liffId: process.env.NEXT_PUBLIC_LIFF_ID || '2007547134-GD56wM6Z'
        });

        if (!window.liff.isLoggedIn()) {
          setMessage('กำลังเข้าสู่ระบบ LINE...');
          setStep(3);
          window.liff.login();
          return;
        }

        setMessage('กำลังดึงข้อมูลผู้ใช้...');
        setStep(4);
        
        // ได้ access token แล้ว
        const accessToken = window.liff.getAccessToken();
        const profile = await window.liff.getProfile();
        
        console.log('🔄 LIFF Profile:', {
          userId: profile.userId,
          displayName: profile.displayName,
          hasToken: !!accessToken
        });

        // เรียก API เพื่อ login
        setMessage('กำลังเข้าสู่ระบบเว็บไซต์...');
        setStep(5);
        
        const response = await fetch('/api/auth/line-callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            accessToken,
            fromLiff: true,
            liffProfile: profile
          }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          setMessage('กำลังสร้าง session...');
          setStep(6);
          
          // Sign in with NextAuth
          const signInResult = await signIn('credentials', {
            email: result.user.email,
            password: 'line_login',
            redirect: false,
          });

          if (!signInResult?.error) {
            setProgress(100);
            setStatus('success');
            setMessage('เข้าสู่ระบบสำเร็จ! กำลังเปลี่ยนหน้า...');
            setStep(7);
            
            // รอ 1.5 วินาทีแล้ว redirect
            setTimeout(() => {
              router.push('/');
            }, 1500);
          } else {
            throw new Error('การสร้าง session ล้มเหลว');
          }
        } else {
          throw new Error(result.error || 'การเข้าสู่ระบบล้มเหลว');
        }

      } catch (error: any) {
        console.error('LIFF Login error:', error);
        setStatus('error');
        setMessage(error.message || 'เกิดข้อผิดพลาดไม่ทราบสาเหตุ');
        
        // รอ 3 วินาทีแล้วลองใหม่
        setTimeout(() => {
          setStatus('loading');
          setProgress(0);
          setStep(1);
          setMessage('กำลังลองใหม่...');
          handleLiffLogin();
        }, 3000);
      }
    };

    initializeLiff();
  }, [router]);

  const getStepMessage = () => {
    const steps = [
      'เริ่มต้นการเชื่อมต่อ',
      'โหลด LINE SDK',
      'เตรียมระบบ LINE',
      'ตรวจสอบการเข้าสู่ระบบ',
      'ดึงข้อมูลผู้ใช้',
      'เข้าสู่ระบบเว็บไซต์',
      'สร้าง session',
      'เสร็จสิ้น'
    ];
    return steps[step - 1] || steps[0];
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #06C755 0%, #00B751 50%, #009A46 100%)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background Circles */}
      <Box
        sx={{
          position: 'absolute',
          top: '-50%',
          left: '-10%',
          width: '120%',
          height: '120%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          animation: 'float 20s ease-in-out infinite',
          zIndex: 1,
        }}
      />
      
      {/* Header */}
      <Box
        sx={{
          padding: '20px 0',
          textAlign: 'center',
          zIndex: 2,
        }}
      >
        <Slide direction="down" in={true} timeout={800}>
          <Box>
            {/* LINE Logo Style */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' , borderRadius: '50%', overflow: 'hidden', width: 75, height: 75 , margin:'0 auto' }}>
              <img src="/images/favicon_bg.png" alt="CorgiGo" width={75} height={75} style={{ objectFit: 'cover' }} />
            </Box>
            
            <Typography
              variant="h4"
              sx={{
                color: 'white',
                fontWeight: 700,
                fontFamily: '"Prompt", sans-serif',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                mb: 1,
              }}
            >
              CorgiGo
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                fontFamily: '"Prompt", sans-serif',
                fontWeight: 400,
              }}
            >
              เชื่อมต่อกับ LINE
            </Typography>
          </Box>
        </Slide>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 20px',
          zIndex: 2,
        }}
      >
        <Fade in={true} timeout={1000}>
          <Box
            sx={{
              backgroundColor: 'white',
              borderRadius: '24px',
              padding: '40px 32px',
              boxShadow: '0 16px 64px rgba(0,0,0,0.2)',
              maxWidth: '380px',
              width: '100%',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Status Animation */}
            <Box sx={{ mb: 4 }}>
              {status === 'loading' && (
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    margin: '0 auto',
                    position: 'relative',
                    mb: 3,
                  }}
                >
                  {/* Outer spinning circle */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: '3px solid #E8F8EC',
                      borderTop: '3px solid #06C755',
                      borderRadius: '50%',
                      animation: 'spin 1.5s linear infinite',
                    }}
                  />
                  
                  {/* Inner dot */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 60,
                      height: 60,
                      backgroundColor: '#06C755',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      animation: 'heartbeat 2s ease-in-out infinite',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '1.8rem',
                        color: 'white',
                      }}
                    >
                      💬
                    </Typography>
                  </Box>
                </Box>
              )}

              {status === 'success' && (
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    margin: '0 auto',
                    backgroundColor: '#10B981',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'successBounce 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                    mb: 3,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '3rem',
                      color: 'white',
                    }}
                  >
                    ✓
                  </Typography>
                </Box>
              )}

              {status === 'error' && (
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    margin: '0 auto',
                    backgroundColor: '#EF4444',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'shake 0.5s ease-in-out',
                    mb: 3,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '3rem',
                      color: 'white',
                    }}
                  >
                    ⚠️
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Progress Bar */}
            {status === 'loading' && (
              <Box sx={{ mb: 3 }}>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: '#E8F8EC',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#06C755',
                      borderRadius: 3,
                    },
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: '#06C755',
                    fontFamily: '"Prompt", sans-serif',
                    fontWeight: 500,
                    mt: 1,
                    fontSize: '0.875rem',
                  }}
                >
                  ขั้นตอนที่ {step}/7: {getStepMessage()}
                </Typography>
              </Box>
            )}

            {/* Status Message */}
            <Typography
              variant="h6"
              sx={{
                color: status === 'error' ? '#EF4444' : '#1A1A1A',
                fontFamily: '"Prompt", sans-serif',
                fontWeight: 600,
                mb: 2,
                fontSize: '1.25rem',
              }}
            >
              {status === 'loading' && 'กำลังเชื่อมต่อ...'}
              {status === 'success' && 'เข้าสู่ระบบสำเร็จ!'}
              {status === 'error' && 'เกิดข้อผิดพลาด'}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: '#666',
                fontFamily: '"Prompt", sans-serif',
                lineHeight: 1.6,
                fontSize: '0.95rem',
              }}
            >
              {message}
            </Typography>

            {/* Retry Info for Error */}
            {status === 'error' && (
              <Box sx={{ mt: 3 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#999',
                    fontFamily: '"Prompt", sans-serif',
                    fontSize: '0.8rem',
                  }}
                >
                  ระบบจะลองใหม่อีกครั้งใน 3 วินาที...
                </Typography>
              </Box>
            )}
          </Box>
        </Fade>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          padding: '20px',
          textAlign: 'center',
          zIndex: 2,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255,255,255,0.8)',
            fontFamily: '"Prompt", sans-serif',
            fontSize: '0.8rem',
          }}
        >
          Powered by CorgiGo × LINE Platform
        </Typography>
      </Box>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes heartbeat {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.1); }
        }
        
        @keyframes successBounce {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </Box>
  );
} 