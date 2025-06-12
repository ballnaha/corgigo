'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Fade,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

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

const FullScreenContainer = styled(Box)(() => ({
  minHeight: '100dvh', // เปลี่ยนเป็น minHeight
  width: '100vw',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  background: `linear-gradient(135deg, ${theme.background} 0%, ${theme.surface} 100%)`,
  padding: 0,
  margin: 0,
  overflowX: 'hidden', // ป้องกัน horizontal scroll เท่านั้น
  position: 'relative',
}));

const ContentWrapper = styled(Box)(() => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  width: '100%',
  maxWidth: '480px',
  padding: '1rem',
  position: 'relative',
  minHeight: '100dvh', // ใช้ minHeight แทน height
}));

const IconContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'backgroundColor',
})<{ backgroundColor: string }>(({ backgroundColor }) => ({
  width: '80px',
  height: '80px',
  margin: '0 auto 1.5rem', // ลด size และ margin
  background: `linear-gradient(135deg, ${backgroundColor}20 0%, ${backgroundColor}35 100%)`,
  borderRadius: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '32px', // ลด font size
  border: `2px solid ${backgroundColor}30`,
  boxShadow: `0 4px 20px ${backgroundColor}20`,
  backdropFilter: 'blur(10px)',
}));

const ProgressContainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '6px',
  margin: '2rem 0 1.5rem', // ลด margin
}));

const ProgressDot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>(({ isActive }) => ({
  width: isActive ? '32px' : '8px',
  height: '4px',
  borderRadius: '2px',
  backgroundColor: isActive ? theme.accent : theme.border,
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
}));

const BottomNavigation = styled(Box)(() => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: '1rem 1.5rem 2rem',
  background: `linear-gradient(to top, ${theme.background} 80%, transparent)`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: 'max(2rem, env(safe-area-inset-bottom) + 1rem)',
}));

const slides = [
  {
    title: 'CorgiGo',
    subtitle: 'แพลตฟอร์มสั่งอาหารที่ทันสมัย\nสำหรับยุคดิจิทัล',
    icon: '🐶',
    color: theme.accent,
  },
  {
    title: 'ค้นพบร้านดัง',
    subtitle: 'เลือกจากร้านอาหารคุณภาพสูง\nที่คัดสรรมาเป็นพิเศษ',
    icon: '⭐',
    color: theme.secondary,
  },
  {
    title: 'ส่งเร็ว ส่งไว',
    subtitle: 'ระบบจัดส่งอัจฉริยะ\nที่รับประกันความสด',
    icon: '⚡',
    color: theme.accent,
  },
  {
    title: 'พร้อมเริ่มต้น',
    subtitle: 'มาสัมผัสประสบการณ์\nการสั่งอาหารแบบใหม่',
    icon: '🚀',
    color: theme.primary,
  },
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  const handleNext = () => {
    if (currentSlide === slides.length - 1) {
      router.push('/auth/login');
    } else {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleSkip = () => {
    router.push('/auth/login');
  };

  const currentSlideData = slides[currentSlide];

  return (
    <FullScreenContainer>
      <ContentWrapper>
        <Fade in={true} timeout={500} key={currentSlide}>
          <Box sx={{ width: '100%' }}>
            {/* Icon */}
            <IconContainer backgroundColor={currentSlideData.color}>
              {currentSlideData.icon}
            </IconContainer>

            {/* Content */}
            <Typography
              variant="h3"
              fontWeight="800"
              color={theme.text}
              mb={1}
              sx={{
                fontFamily: '"Prompt", sans-serif',
                lineHeight: 1.1,
                fontSize: { xs: '1.75rem', sm: '2rem' }, // ลด font size
                letterSpacing: '-0.04em',
                background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {currentSlideData.title}
            </Typography>
            
            <Typography
              variant="body1"
              color={theme.textSecondary}
              sx={{
                fontFamily: '"Prompt", sans-serif',
                lineHeight: 1.5,
                fontSize: { xs: '0.95rem', sm: '1rem' }, // ลด font size
                fontWeight: 400,
                maxWidth: '300px',
                margin: '0 auto',
                whiteSpace: 'pre-line',
              }}
            >
              {currentSlideData.subtitle}
            </Typography>
          </Box>
        </Fade>

        {/* Progress Dots */}
        <ProgressContainer>
          {slides.map((_, index) => (
            <ProgressDot
              key={index}
              isActive={index === currentSlide}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </ProgressContainer>

        {/* Main Action Button */}
        <Button
          variant="contained"
          onClick={handleNext}
          size="large"
          sx={{
            bgcolor: currentSlideData.color,
            color: '#fff',
            borderRadius: '16px',
            py: { xs: 1.5, sm: 1.75 },
            px: { xs: 3, sm: 4 },
            fontFamily: '"Prompt", sans-serif',
            fontWeight: 600,
            fontSize: { xs: '0.95rem', sm: '1rem' },
            textTransform: 'none',
            boxShadow: `0 8px 32px ${currentSlideData.color}25`,
            border: 'none',
            minWidth: { xs: '180px', sm: '200px' },
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
              bgcolor: currentSlideData.color,
              boxShadow: `0 12px 40px ${currentSlideData.color}35`,
              transform: 'translateY(-2px)',
              '&::before': {
                left: '100%',
              },
            },
            '&:active': {
              transform: 'translateY(0)',
            },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {currentSlide === slides.length - 1 ? 'เริ่มต้นใช้งาน' : 'ถัดไป'}
        </Button>
      </ContentWrapper>

      {/* Bottom Navigation */}
      <BottomNavigation>
        <Button
          onClick={handleSkip}
          sx={{
            color: theme.textLight,
            fontFamily: '"Prompt", sans-serif',
            textTransform: 'none',
            fontSize: '0.9rem',
            fontWeight: 500,
            '&:hover': {
              bgcolor: 'transparent',
              color: theme.textSecondary,
            },
          }}
        >
          ข้าม
        </Button>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {currentSlide > 0 && (
            <IconButton
              onClick={handleBack}
              sx={{
                bgcolor: theme.surface,
                width: 48,
                height: 48,
                border: `1px solid ${theme.border}`,
                '&:hover': { 
                  bgcolor: theme.border,
                  transform: 'translateY(-1px)',
                  boxShadow: `0 4px 12px ${theme.secondary}20`,
                },
                transition: 'all 0.2s ease',
              }}
            >
              <ArrowBackIcon sx={{ fontSize: 20, color: theme.textSecondary }} />
            </IconButton>
          )}
          
          {currentSlide < slides.length - 1 && (
            <IconButton
              onClick={handleNext}
              sx={{
                bgcolor: currentSlideData.color,
                width: 48,
                height: 48,
                boxShadow: `0 4px 16px ${currentSlideData.color}30`,
                '&:hover': { 
                  bgcolor: currentSlideData.color,
                  transform: 'translateY(-1px)',
                  boxShadow: `0 6px 20px ${currentSlideData.color}40`,
                },
                transition: 'all 0.2s ease',
              }}
            >
              <ArrowForwardIcon sx={{ fontSize: 20, color: '#fff' }} />
            </IconButton>
          )}
        </Box>
      </BottomNavigation>
    </FullScreenContainer>
  );
} 