'use client';

import React, { useCallback } from 'react';
import { Box, Button, IconButton, CircularProgress, Typography } from '@mui/material';
import { MyLocation, OpenInNew, LocationOn, AddLocation } from '@mui/icons-material';

interface MiniMapProps {
  latitude?: number;
  longitude?: number;
  address?: string;
  onLocationUpdate?: (lat: number, lng: number) => void;
  onUseCurrentLocation?: () => void;
  width?: number | string;
  height?: number | string;
  showCoordinates?: boolean;
  showRefresh?: boolean;
}

const MiniMap: React.FC<MiniMapProps> = ({
  latitude,
  longitude,
  address,
  onLocationUpdate,
  onUseCurrentLocation,
  width = '100%',
  height = '100%',
  showCoordinates = true,
  showRefresh = false,
}) => {
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefreshLocation = useCallback(() => {
    if (!navigator.geolocation) return;

    setIsRefreshing(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        onLocationUpdate?.(lat, lng);
        setIsRefreshing(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setIsRefreshing(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  }, [onLocationUpdate]);

  const handleOpenInGoogleMaps = () => {
    if (latitude && longitude) {
      const url = `https://www.google.com/maps?q=${latitude},${longitude}&z=15`;
      window.open(url, '_blank');
    }
  };

  const handleUseCurrentLocation = () => {
    if (onUseCurrentLocation) {
      onUseCurrentLocation();
    } else {
      handleRefreshLocation();
    }
  };

  const hasLocation = latitude && longitude;

  // Generate Google Maps Embed URL (No API Key needed)
  const getGoogleMapsEmbedUrl = () => {
    if (!hasLocation) return '';
    
    // Use basic Google Maps embed without API key
    // This method works but may have some limitations on styling and features
    return `https://maps.google.com/maps?q=${latitude},${longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  };

  return (
    <Box
      sx={{
        width,
        height,
        position: 'relative',
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: '#F8F9FA',
        border: '1px solid #E8E8E8',
        fontFamily: 'Prompt, sans-serif',
        minHeight: height === '100%' ? '300px' : height,
      }}
    >
      {hasLocation ? (
        <>
          {/* Google Maps Embed - No API Key */}
          <iframe
            src={getGoogleMapsEmbedUrl()}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps Location"
          />

          {/* Control Overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            {/* Refresh Location */}
            {showRefresh && (
              <IconButton
                onClick={handleRefreshLocation}
                disabled={isRefreshing}
                size="small"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.95)',
                  color: '#5F6368',
                  width: 36,
                  height: 36,
                  border: '1px solid #DADCE0',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                  '&:hover': {
                    bgcolor: '#FFFFFF',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  },
                }}
              >
                {isRefreshing ? (
                  <CircularProgress size={18} sx={{ color: '#5F6368' }} />
                ) : (
                  <MyLocation sx={{ fontSize: 18 }} />
                )}
              </IconButton>
            )}
            
            {/* Open in Google Maps */}
            <IconButton
              onClick={handleOpenInGoogleMaps}
              size="small"
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.95)',
                color: '#5F6368',
                width: 36,
                height: 36,
                border: '1px solid #DADCE0',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                '&:hover': {
                  bgcolor: '#FFFFFF',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                },
              }}
            >
              <OpenInNew sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          {/* Coordinates Display */}
          {showCoordinates && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 12,
                left: 12,
                right: 12,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                gap: 2,
              }}
            >


            </Box>
          )}
        </>
      ) : (
        // No Location State
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#F8F9FA',
            color: '#5F6368',
            textAlign: 'center',
            fontFamily: 'Prompt, sans-serif',
            background: `
              repeating-linear-gradient(
                45deg,
                #F8F9FA 0px,
                #F8F9FA 20px,
                #F1F3F4 20px,
                #F1F3F4 40px
              )
            `,
          }}
        >
          <Box
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: 3,
              p: 4,
              border: '1px solid #DADCE0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            <LocationOn sx={{ fontSize: 64, color: '#DADCE0', mb: 2 }} />
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: 'Prompt, sans-serif',
                color: '#5F6368', 
                fontSize: '1rem',
                fontWeight: 500,
                mb: 1,
              }}
            >
              ไม่พบข้อมูลตำแหน่ง
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontFamily: 'Prompt, sans-serif',
                color: '#9AA0A6', 
                fontSize: '0.875rem',
                lineHeight: 1.5,
                mb: 2,
              }}
            >
              กดปุ่ม GPS เพื่อดึงตำแหน่งปัจจุบัน<br />
              หรือระบุที่อยู่ในฟอร์มด้านบน
            </Typography>
            
            {/* Get Location Button */}
            <Button
              variant="contained"
              onClick={handleUseCurrentLocation}
              startIcon={<MyLocation sx={{ fontSize: 18 }} />}
              sx={{
                fontFamily: 'Prompt, sans-serif',
                bgcolor: '#4285F4',
                color: '#FFFFFF',
                borderRadius: '20px',
                px: 3,
                py: 1,
                fontSize: '0.875rem',
                fontWeight: 500,
                textTransform: 'none',
                boxShadow: '0 2px 6px rgba(66, 133, 244, 0.3)',
                '&:hover': {
                  bgcolor: '#3367D6',
                  boxShadow: '0 4px 8px rgba(66, 133, 244, 0.4)',
                },
              }}
            >
              ดึงตำแหน่งปัจจุบัน
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MiniMap; 