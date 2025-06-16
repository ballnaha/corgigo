'use client';

import { useState } from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import Image from 'next/image';

export default function TestLineLoginPage() {
  const [isLineLogin, setIsLineLogin] = useState(false);

  return (
    <Box sx={{ p: 3, maxWidth: '400px', mx: 'auto', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontFamily: '"Prompt", sans-serif' }}>
        🧪 ทดสอบ LINE Login UI
      </Typography>

      {/* Normal Login Mode */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: '#333' }}>
            📝 โหมดปกติ (แสดง Email & Password)
          </Typography>
          <Button
            variant="contained"
            onClick={() => setIsLineLogin(false)}
            sx={{ 
              mb: 2,
              backgroundColor: isLineLogin ? '#ccc' : '#1976d2'
            }}
          >
            เปลี่ยนเป็นโหมดปกติ
          </Button>
        </CardContent>
      </Card>

      {/* LINE Login Mode */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: '#06C755' }}>
            🟢 โหมด LINE Login (ซ่อน Email & Password)
          </Typography>
          <Button
            variant="contained"
            onClick={() => setIsLineLogin(true)}
            sx={{ 
              mb: 2,
              backgroundColor: isLineLogin ? '#06C755' : '#ccc'
            }}
          >
            เปลี่ยนเป็นโหมด LINE
          </Button>
        </CardContent>
      </Card>

      {/* Simulated Login Form */}
      <Card>
        <CardContent>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Image src="/images/header-logo.png" alt="logo" width={150} height={45} />
            <Typography variant="body1" sx={{ color: '#666', mt: 1 }}>
              เข้าสู่ระบบ
            </Typography>
          </Box>

          {/* Show form fields only when not in LINE login mode */}
          {!isLineLogin && (
            <>
              {/* Email Field */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  EMAIL
                </Typography>
                <Box
                  sx={{
                    height: '56px',
                    backgroundColor: '#F5F5F5',
                    borderRadius: '12px',
                    border: '1px solid #E0E0E0',
                    display: 'flex',
                    alignItems: 'center',
                    px: 2,
                    color: '#999',
                  }}
                >
                  example@gmail.com
                </Box>
              </Box>

              {/* Password Field */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  PASSWORD
                </Typography>
                <Box
                  sx={{
                    height: '56px',
                    backgroundColor: '#F5F5F5',
                    borderRadius: '12px',
                    border: '1px solid #E0E0E0',
                    display: 'flex',
                    alignItems: 'center',
                    px: 2,
                    color: '#999',
                  }}
                >
                  ••••••••••••
                </Box>
              </Box>

              {/* Remember & Forgot */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  ☑️ Remember me
                </Typography>
                <Typography variant="body2" sx={{ color: '#F8A66E' }}>
                  Forgot Password?
                </Typography>
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
                backgroundColor: '#F0FFF4',
                borderRadius: '16px',
                border: '2px solid #06C755',
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
                  color: '#06C755',
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
                  color: '#666666',
                  mb: 2,
                }}
              >
                กรุณารอสักครู่...
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  height: '4px',
                  backgroundColor: '#E0E0E0',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    width: '30%',
                    height: '100%',
                    backgroundColor: '#06C755',
                    borderRadius: '2px',
                    animation: 'loading 1.5s ease-in-out infinite',
                  }}
                />
              </Box>
              
              {/* Cancel Button */}
              <Button
                variant="outlined"
                onClick={() => setIsLineLogin(false)}
                sx={{
                  mt: 2,
                  color: '#06C755',
                  borderColor: '#06C755',
                  fontFamily: '"Prompt", sans-serif',
                  '&:hover': {
                    borderColor: '#05A847',
                    backgroundColor: 'rgba(6, 199, 85, 0.04)',
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
              fullWidth
              variant="contained"
              sx={{
                bgcolor: '#F8A66E',
                color: '#fff',
                borderRadius: '12px',
                py: 2,
                fontWeight: 600,
                mb: 3,
                '&:hover': {
                  bgcolor: '#E8956E',
                },
              }}
            >
              LOG IN
            </Button>
          )}

          {/* Register Link - Show only for normal login */}
          {!isLineLogin && (
            <Box textAlign="center" sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ color: '#666', display: 'inline' }}>
                ยังไม่มีบัญชี?{' '}
              </Typography>
              <Typography variant="body1" sx={{ color: '#F8A66E', display: 'inline', fontWeight: 600 }}>
                สมัครสมาชิก
              </Typography>
            </Box>
          )}

          {/* Or divider - Show only for normal login */}
          {!isLineLogin && (
            <Box textAlign="center" sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ color: '#666' }}>
                หรือ
              </Typography>
            </Box>
          )}

          {/* Social Media Login */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => setIsLineLogin(true)}
              sx={{
                bgcolor: '#06C755',
                color: '#fff',
                minWidth: '60px',
                height: '50px',
                borderRadius: '50%',
                '&:hover': {
                  bgcolor: '#05A847',
                },
              }}
            >
              LINE
            </Button>
            
            <Button
              variant="contained"
              sx={{
                bgcolor: '#DB4437',
                color: '#fff',
                minWidth: '60px',
                height: '50px',
                borderRadius: '50%',
                '&:hover': {
                  bgcolor: '#C23321',
                },
              }}
            >
              G
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Status */}
      <Box sx={{ mt: 3, p: 2, backgroundColor: 'white', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          📊 สถานะปัจจุบัน:
        </Typography>
        <Typography variant="body1">
          <strong>โหมด:</strong> {isLineLogin ? '🟢 LINE Login' : '📝 ปกติ'}
        </Typography>
        <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
          {isLineLogin 
            ? 'ซ่อน Email & Password fields, แสดง loading status'
            : 'แสดง Email & Password fields, แสดงปุ่ม register'
          }
        </Typography>
      </Box>

      {/* CSS Animation */}
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
      `}</style>
    </Box>
  );
} 