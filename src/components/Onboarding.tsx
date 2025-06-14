'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';
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

const slides = [
  {
    id: 1,
    title: 'สั่งง่าย แค่ปลายนิ้ว',
    subtitle: 'ช้อปสะดวกทุกที่ทุกเวลาผ่านแอปของเรา',
    image: '/images/onboarding-1.png',
    buttonText: 'ถัดไป',
  },
  {
    id: 2,
    title: 'ทุกตัวเลือก ที่คุณต้องการ',
    subtitle: 'ค้นหาสินค้าและร้านค้าที่ใช่ในสไตล์ที่เป็นคุณ',
    image: '/images/onboarding-2.png',
    buttonText: 'ถัดไป',
  },
  {
    id: 3,
    title: 'ส่งไวถึงหน้าบ้าน',
    subtitle: 'รอรับของได้เลย เราพร้อมส่งตรงถึงมือคุณอย่างรวดเร็ว',
    image: '/images/onboarding-3.png',
    buttonText: 'เริ่มเลย',
  },
];

const FullScreenContainer = styled(Box)(() => ({
  height: '100dvh',
  width: '100vw',
  display: 'flex',
  flexDirection: 'column',
  background: '#FFFFFF',
  margin: 0,
  padding: 0,
  overflowX: 'hidden',
  overflowY: 'hidden',
  position: 'relative',
}));

const SlidesContainer = styled(Box)(() => ({
  flex: 1,
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
}));

const SlideWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'slideIndex' && prop !== 'currentSlide',
})<{ slideIndex: number; currentSlide: number }>(({ slideIndex, currentSlide }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  textAlign: 'center',
  padding: '2rem 1.5rem 1.5rem',
  transform: `translateX(${(slideIndex - currentSlide) * 100}%)`,
  transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  touchAction: 'pan-y',
  opacity: slideIndex === currentSlide ? 1 : 0.3,
  pointerEvents: slideIndex === currentSlide ? 'auto' : 'none',
}));

const IllustrationContainer = styled(Box)(() => ({
  width: '100%',
  maxWidth: '320px',
  height: '320px',
  margin: '0 auto',
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  flexShrink: 0,
  transform: 'scale(1)',
  transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  '&.active': {
    transform: 'scale(1.02)',
  },
}));

const TextContent = styled(Box)(() => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  maxWidth: '320px',
  margin: '0 auto',
  padding: '1rem 0',
  transform: 'translateY(0)',
  transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.5s ease',
}));

const ProgressDots = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  gap: '8px',
  margin: '1rem 0',
}));

const Dot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>(({ isActive }) => ({
  width: isActive ? '24px' : '8px',
  height: '8px',
  borderRadius: '4px',
  backgroundColor: isActive ? theme.accent : '#E2E8F0',
  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  cursor: 'pointer',
  transform: isActive ? 'scale(1.1)' : 'scale(1)',
  '&:hover': {
    transform: 'scale(1.2)',
    backgroundColor: isActive ? theme.accent : '#CBD5E0',
  },
}));

const ButtonContainer = styled(Box)(() => ({
  width: '100%',
  maxWidth: '320px',
  padding: '0 0 env(safe-area-inset-bottom, 1rem)',
  flexShrink: 0,
  transform: 'translateY(0)',
  transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
}));

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  // Swipe detection
  const minSwipeDistance = 50;

  const changeSlide = (newSlide: number) => {
    if (isTransitioning || newSlide === currentSlide) return;
    
    setIsTransitioning(true);
    setCurrentSlide(newSlide);
    
    // Reset transition lock after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 400);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (isTransitioning) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (isTransitioning) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || isTransitioning) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentSlide < slides.length - 1) {
      changeSlide(currentSlide + 1);
    }
    
    if (isRightSwipe && currentSlide > 0) {
      changeSlide(currentSlide - 1);
    }
  };

  const handleNext = () => {
    if (isTransitioning) return;
    
    console.log('handleNext called, currentSlide:', currentSlide, 'slides.length:', slides.length);
    
    if (currentSlide === slides.length - 1) {
      console.log('Navigating to login page...');
      router.push('/auth/login');
    } else {
      changeSlide(currentSlide + 1);
    }
  };

  const handleSkip = () => {
    router.push('/auth/login');
  };

  const handleDotClick = (index: number) => {
    if (isTransitioning) return;
    changeSlide(index);
  };

  return (
    <FullScreenContainer>
      <SlidesContainer
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {slides.map((slide, index) => (
          <SlideWrapper
            key={slide.id}
            slideIndex={index}
            currentSlide={currentSlide}
          >
            {/* Illustration */}
            <IllustrationContainer
              className={index === currentSlide ? 'active' : ''}
              sx={{
                backgroundImage: `url("${slide.image}")`,
              }}
            />

            {/* Text Content */}
            <TextContent>
              {/* Title */}
              <Typography
                variant="h4"
                sx={{
                  fontFamily: 'Prompt, sans-serif',
                  fontWeight: 700,
                  color: '#2D3748',
                  fontSize: { xs: '1.5rem', sm: '1.75rem' },
                  marginBottom: '0.75rem',
                  lineHeight: 1.3,
                  transform: index === currentSlide ? 'translateY(0)' : 'translateY(20px)',
                  opacity: index === currentSlide ? 1 : 0,
                  transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  transitionDelay: index === currentSlide ? '0.2s' : '0s',
                }}
              >
                {slide.title}
              </Typography>

              {/* Subtitle */}
              <Typography
                variant="body1"
                sx={{
                  fontFamily: 'Prompt, sans-serif',
                  color: '#718096',
                  fontSize: { xs: '0.95rem', sm: '1rem' },
                  lineHeight: 1.5,
                  marginBottom: '1.5rem',
                  textAlign: 'center',
                  transform: index === currentSlide ? 'translateY(0)' : 'translateY(20px)',
                  opacity: index === currentSlide ? 1 : 0,
                  transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  transitionDelay: index === currentSlide ? '0.3s' : '0s',
                }}
              >
                {slide.subtitle}
              </Typography>

              {/* Progress Dots */}
              <ProgressDots>
                {slides.map((_, dotIndex) => (
                  <Dot
                    key={dotIndex}
                    isActive={dotIndex === currentSlide}
                    onClick={() => handleDotClick(dotIndex)}
                  />
                ))}
              </ProgressDots>

              {/* Swipe Indicator */}
              <Typography
                variant="caption"
                sx={{
                  fontFamily: 'Prompt, sans-serif',
                  color: '#CBD5E0',
                  fontSize: '0.75rem',
                  marginTop: '0.5rem',
                  fontStyle: 'italic',
                  transform: index === currentSlide ? 'translateY(0)' : 'translateY(10px)',
                  opacity: index === currentSlide ? 1 : 0,
                  transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  transitionDelay: index === currentSlide ? '0.4s' : '0s',
                }}
              >
                {currentSlide === 0 ? 'Swipe left to continue' : 
                 currentSlide === slides.length - 1 ? 'Swipe right to go back' : 
                 'Swipe left or right to navigate'}
              </Typography>
            </TextContent>

            {/* Button Container */}
            <ButtonContainer
              sx={{
                transform: index === currentSlide ? 'translateY(0)' : 'translateY(30px)',
                opacity: index === currentSlide ? 1 : 0,
                transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                transitionDelay: index === currentSlide ? '0.5s' : '0s',
              }}
            >
              {/* Main Button */}
              <Button
                variant="contained"
                onClick={handleNext}
                fullWidth
                disabled={isTransitioning}
                sx={{
                  backgroundColor: theme.accent,
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '1rem 2rem',
                  fontFamily: 'Prompt, sans-serif',
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                  boxShadow: 'none',
                  marginBottom: currentSlide < slides.length - 1 ? '1rem' : '0',
                  transform: 'scale(1)',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  '&:hover': {
                    backgroundColor: '#E8956E',
                    boxShadow: 'none',
                    transform: 'scale(1.02)',
                  },
                  '&:active': {
                    transform: 'scale(0.98)',
                  },
                  '&:disabled': {
                    backgroundColor: theme.accent,
                    color: '#FFFFFF',
                    opacity: 0.7,
                  },
                }}
              >
                {slide.buttonText}
              </Button>

              {/* Skip Button - แสดงเฉพาะ slide แรกและสอง */}
              {currentSlide < slides.length - 1 && (
                <Button
                  variant="text"
                  onClick={handleSkip}
                  disabled={isTransitioning}
                  sx={{
                    color: '#A0AEC0',
                    fontFamily: 'Prompt, sans-serif',
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    textTransform: 'none',
                    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: '#718096',
                      transform: 'scale(1.05)',
                    },
                    '&:disabled': {
                      color: '#A0AEC0',
                      opacity: 0.7,
                    },
                  }}
                >
                  Skip
                </Button>
              )}
            </ButtonContainer>
          </SlideWrapper>
        ))}
      </SlidesContainer>
    </FullScreenContainer>
  );
} 