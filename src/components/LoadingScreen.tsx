import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingScreenProps {
  step?: 'auth' | 'data' | 'processing' | 'custom';
  customMessage?: string;
  subtitle?: string;
  showProgress?: boolean;
  currentStep?: number;
  totalSteps?: number;
  size?: 'small' | 'medium' | 'large';
  fullHeight?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  step = 'processing',
  customMessage,
  subtitle,
  showProgress = false,
  currentStep = 1,
  totalSteps = 2,
  size = 'medium',
  fullHeight = true,
}) => {
  // ข้อความตามขั้นตอน
  const getStepMessage = () => {
    if (customMessage) return customMessage;
    
    switch (step) {
      case 'auth':
        return 'กำลังตรวจสอบสิทธิ์...';
      case 'data':
        return 'กำลังโหลดข้อมูล...';
      case 'processing':
        return 'กำลังดำเนินการ...';
      default:
        return 'กำลังโหลด...';
    }
  };

  // ขนาด component
  const getSizes = () => {
    switch (size) {
      case 'small':
        return { circle: 35, innerDot: 6, fontSize: '0.8rem', subtitleSize: '0.7rem' };
      case 'large':
        return { circle: 60, innerDot: 10, fontSize: '1rem', subtitleSize: '0.8rem' };
      default:
        return { circle: 50, innerDot: 8, fontSize: '0.9rem', subtitleSize: '0.75rem' };
    }
  };

  const sizes = getSizes();

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: fullHeight ? '100vh' : 'auto',
      backgroundColor: '#FAFAFA',
      transition: 'all 0.3s ease-in-out',
      py: fullHeight ? 0 : 4,
    }}>
      {/* Main Loading Circle */}
      <Box sx={{ 
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 3,
      }}>
        <CircularProgress 
          sx={{ 
            color: '#F8A66E',
            animationDuration: '1.5s',
          }} 
          size={sizes.circle} 
          thickness={4}
        />
        {/* Inner dot */}
        <Box
          sx={{
            position: 'absolute',
            width: sizes.innerDot,
            height: sizes.innerDot,
            borderRadius: '50%',
            backgroundColor: '#F8A66E',
            animation: 'pulse 1.5s ease-in-out infinite',
            '@keyframes pulse': {
              '0%': { opacity: 0.6, transform: 'scale(0.8)' },
              '50%': { opacity: 1, transform: 'scale(1.2)' },
              '100%': { opacity: 0.6, transform: 'scale(0.8)' },
            },
          }}
        />
      </Box>

      {/* Loading Text */}
      <Typography
        sx={{
          fontFamily: 'Prompt, sans-serif',
          fontSize: sizes.fontSize,
          color: '#666',
          mb: showProgress ? 2 : 1,
          opacity: 0.8,
          animation: 'fadeInOut 2s ease-in-out infinite',
          '@keyframes fadeInOut': {
            '0%': { opacity: 0.5 },
            '50%': { opacity: 1 },
            '100%': { opacity: 0.5 },
          },
        }}
      >
        {getStepMessage()}
      </Typography>

      {/* Progress Indicators */}
      {showProgress && totalSteps > 1 && (
        <Box sx={{ 
          display: 'flex', 
          gap: 1, 
          alignItems: 'center',
          mb: 2,
        }}>
          {Array.from({ length: totalSteps }, (_, index) => (
            <React.Fragment key={index}>
              {/* Step Circle */}
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: 
                    index < currentStep ? '#4CAF50' : 
                    index === currentStep - 1 ? '#F8A66E' : '#E0E0E0',
                  transition: 'all 0.5s ease',
                  animation: index === currentStep - 1 ? 'pulse 1s ease-in-out infinite' : 'none',
                }}
              />
              {/* Connection Line */}
              {index < totalSteps - 1 && (
                <Box
                  sx={{
                    width: 20,
                    height: 2,
                    backgroundColor: index < currentStep - 1 ? '#4CAF50' : '#E0E0E0',
                    borderRadius: 1,
                    transition: 'all 0.5s ease',
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </Box>
      )}

      {/* Subtitle */}
      {subtitle && (
        <Typography
          sx={{
            fontFamily: 'Prompt, sans-serif',
            fontSize: sizes.subtitleSize,
            color: '#999',
            opacity: 0.7,
            textAlign: 'center',
            maxWidth: '300px',
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingScreen; 