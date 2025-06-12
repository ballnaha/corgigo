'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Stack,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  alpha,
} from '@mui/material';
import {
  ArrowBack,
  Store,
  LocationOn,
  Phone,
  MyLocation,
  Description,
  AccessTime,
} from '@mui/icons-material';
import AppHeader from '@/components/AppHeader';
import MiniMap from '@/components/MiniMap';

export default function RegisterRestaurantClient() {
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();
  const [loading, setLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    openTime: '09:00',
    closeTime: '21:00',
  });
  
  const [location, setLocation] = useState<{lat: number; lng: number} | null>(null);

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleGetCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // Use reverse geocoding to get address
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=th`
            );
            
            if (!response.ok) {
              throw new Error('ไม่สามารถดึงข้อมูลที่อยู่ได้');
            }
            
            const data = await response.json();
            
            // Format Thai address
            let address = '';
            if (data.address) {
              const parts = [];
              if (data.address.house_number) parts.push(data.address.house_number);
              if (data.address.road) parts.push(data.address.road);
              if (data.address.suburb) parts.push(data.address.suburb);
              if (data.address.district) parts.push(data.address.district);
              if (data.address.city || data.address.town) parts.push(data.address.city || data.address.town);
              if (data.address.state) parts.push(data.address.state);
              if (data.address.postcode) parts.push(data.address.postcode);
              
              address = parts.join(' ');
            }
            
            if (!address && data.display_name) {
              address = data.display_name;
            }
            
            // Update address in form and location
            setFormData(prev => ({ ...prev, address: address || `${latitude}, ${longitude}` }));
            setLocation({ lat: latitude, lng: longitude });
            setSnackbar({
              open: true,
              message: 'ดึงตำแหน่งและที่อยู่ปัจจุบันสำเร็จ',
              severity: 'success'
            });
            
          } catch (error: any) {
            console.error('Geocoding error:', error);
            // Fallback to coordinates
            const { latitude, longitude } = position.coords;
            setFormData(prev => ({ ...prev, address: `${latitude}, ${longitude}` }));
            setLocation({ lat: latitude, lng: longitude });
            setSnackbar({
              open: true,
              message: 'ใช้พิกัดแทนที่อยู่',
              severity: 'warning'
            });
          } finally {
            setIsGettingLocation(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          let message = 'ไม่สามารถดึงตำแหน่งได้';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = 'กรุณาอนุญาตการเข้าถึงตำแหน่ง';
              break;
            case error.POSITION_UNAVAILABLE:
              message = 'ไม่สามารถระบุตำแหน่งได้';
              break;
            case error.TIMEOUT:
              message = 'หมดเวลาในการระบุตำแหน่ง';
              break;
          }
          
          setSnackbar({
            open: true,
            message,
            severity: 'error'
          });
          setIsGettingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    } else {
      setIsGettingLocation(false);
      setSnackbar({
        open: true,
        message: 'เบราว์เซอร์ไม่รองรับการเข้าถึงตำแหน่ง',
        severity: 'error'
      });
    }
  };

  const handleLocationUpdateFromMap = async (lat: number, lng: number) => {
    setLocation({ lat, lng });
    
    // Update address when location changes from map
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=th`
      );
      
      if (response.ok) {
        const data = await response.json();
        
        // Format Thai address
        let address = '';
        if (data.address) {
          const parts = [];
          if (data.address.house_number) parts.push(data.address.house_number);
          if (data.address.road) parts.push(data.address.road);
          if (data.address.suburb) parts.push(data.address.suburb);
          if (data.address.district) parts.push(data.address.district);
          if (data.address.city || data.address.town) parts.push(data.address.city || data.address.town);
          if (data.address.state) parts.push(data.address.state);
          if (data.address.postcode) parts.push(data.address.postcode);
          
          address = parts.join(' ');
        }
        
        if (!address && data.display_name) {
          address = data.display_name;
        }
        
        // Update address in form
        setFormData(prev => ({ ...prev, address: address || `${lat}, ${lng}` }));
      } else {
        // Fallback to coordinates
        setFormData(prev => ({ ...prev, address: `${lat.toFixed(6)}, ${lng.toFixed(6)}` }));
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      // Fallback to coordinates
      setFormData(prev => ({ ...prev, address: `${lat.toFixed(6)}, ${lng.toFixed(6)}` }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      setSnackbar({
        open: true,
        message: 'กรุณากรอกชื่อร้าน',
        severity: 'error'
      });
      return;
    }
    
    if (!formData.address.trim()) {
      setSnackbar({
        open: true,
        message: 'กรุณากรอกที่อยู่ร้าน',
        severity: 'error'
      });
      return;
    }
    
    if (!formData.phone.trim()) {
      setSnackbar({
        open: true,
        message: 'กรุณากรอกเบอร์โทรศัพท์',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/restaurant/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          latitude: location?.lat,
          longitude: location?.lng,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSnackbar({
          open: true,
          message: result.message || 'สมัครเปิดร้านอาหารสำเร็จ!',
          severity: 'success'
        });
        
        // Refresh session เพื่อโหลดข้อมูล restaurant ใหม่
        await updateSession();
        
        // หน่วงเวลาเล็กน้อยแล้วไปหน้าร้านอาหาร
        setTimeout(() => {
          router.push('/restaurant');
        }, 2000);
      } else {
        setSnackbar({
          open: true,
          message: result.error || 'เกิดข้อผิดพลาดในการสมัครเปิดร้านอาหาร',
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'เกิดข้อผิดพลาดในการเชื่อมต่อ',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (!session) {
    router.push('/auth/login');
    return null;
  }

  return (
    <Box sx={{ 
      backgroundColor: '#FAFAFA',
      minHeight: '100vh',
      paddingBottom: '20px',
      fontFamily: 'Prompt, sans-serif',
    }}>
      <AppHeader />
      
      <Container maxWidth="sm" sx={{ py: 2, px: 2 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton 
            onClick={() => router.back()}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: 'Prompt, sans-serif',
              fontWeight: 600,
              color: '#1A1A1A',
            }}
          >
            สมัครเปิดร้านอาหาร
          </Typography>
        </Box>

        {/* Form */}
        <Card 
          elevation={0}
          sx={{ 
            borderRadius: 3,
            border: '1px solid #E8E8E8',
            bgcolor: '#FFFFFF',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {/* ชื่อร้าน */}
                <TextField
                  fullWidth
                  label="ชื่อร้านอาหาร *"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Store sx={{ mr: 1.5, color: '#999', fontSize: 18 }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      fontFamily: 'Prompt, sans-serif',
                    },
                    '& .MuiInputLabel-root': { 
                      fontFamily: 'Prompt, sans-serif',
                    },
                  }}
                />

                {/* คำอธิบายร้าน */}
                <TextField
                  fullWidth
                  label="คำอธิบายร้าน"
                  value={formData.description}
                  onChange={handleInputChange('description')}
                  variant="outlined"
                  multiline
                  rows={3}
                  InputProps={{
                    startAdornment: <Description sx={{ mr: 1.5, color: '#999', fontSize: 18, alignSelf: 'flex-start', mt: 0.5 }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      fontFamily: 'Prompt, sans-serif',
                    },
                    '& .MuiInputLabel-root': { 
                      fontFamily: 'Prompt, sans-serif',
                    },
                  }}
                />

                {/* ที่อยู่ร้าน */}
                <TextField
                  fullWidth
                  label="ที่อยู่ร้าน *"
                  value={formData.address}
                  onChange={handleInputChange('address')}
                  variant="outlined"
                  multiline
                  rows={2}
                  InputProps={{
                    startAdornment: <LocationOn sx={{ mr: 1.5, color: '#999', fontSize: 18, alignSelf: 'flex-start', mt: 0.5 }} />,
                    endAdornment: (
                      <IconButton
                        onClick={handleGetCurrentLocation}
                        disabled={isGettingLocation}
                        size="small"
                        sx={{
                          color: '#F8A66E',
                          alignSelf: 'flex-start',
                          mt: 0.5,
                        }}
                      >
                        {isGettingLocation ? (
                          <CircularProgress size={16} sx={{ color: '#F8A66E' }} />
                        ) : (
                          <MyLocation sx={{ fontSize: 16 }} />
                        )}
                      </IconButton>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      fontFamily: 'Prompt, sans-serif',
                    },
                    '& .MuiInputLabel-root': { 
                      fontFamily: 'Prompt, sans-serif',
                    },
                  }}
                />

                {/* เบอร์โทรศัพท์ */}
                <TextField
                  fullWidth
                  label="เบอร์โทรศัพท์ร้าน *"
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Phone sx={{ mr: 1.5, color: '#999', fontSize: 18 }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      fontFamily: 'Prompt, sans-serif',
                    },
                    '& .MuiInputLabel-root': { 
                      fontFamily: 'Prompt, sans-serif',
                    },
                  }}
                />

                {/* เวลาเปิด-ปิด */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="เวลาเปิด"
                    type="time"
                    value={formData.openTime}
                    onChange={handleInputChange('openTime')}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <AccessTime sx={{ mr: 1.5, color: '#999', fontSize: 18 }} />,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        fontFamily: 'Prompt, sans-serif',
                      },
                      '& .MuiInputLabel-root': { 
                        fontFamily: 'Prompt, sans-serif',
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="เวลาปิด"
                    type="time"
                    value={formData.closeTime}
                    onChange={handleInputChange('closeTime')}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <AccessTime sx={{ mr: 1.5, color: '#999', fontSize: 18 }} />,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        fontFamily: 'Prompt, sans-serif',
                      },
                      '& .MuiInputLabel-root': { 
                        fontFamily: 'Prompt, sans-serif',
                      },
                    }}
                  />
                </Box>
              </Stack>

              {/* Mini Map */}
              {location && (
                <Box sx={{ mt: 3 }}>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      fontFamily: 'Prompt, sans-serif',
                      fontWeight: 600,
                      color: '#1A1A1A',
                      mb: 2,
                    }}
                  >
                    ตำแหน่งร้าน
                  </Typography>
                  <MiniMap
                    latitude={location.lat}
                    longitude={location.lng}
                    onLocationUpdate={handleLocationUpdateFromMap}
                    showCoordinates={true}
                    showRefresh={true}
                    height={200}
                  />
                </Box>
              )}

              {/* Submit Button */}
              <Box sx={{ mt: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    bgcolor: '#F8A66E',
                    color: '#FFFFFF',
                    fontFamily: 'Prompt, sans-serif',
                    fontWeight: 500,
                    borderRadius: 2,
                    py: 1.5,
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: '#E8956E',
                    },
                    '&:disabled': {
                      bgcolor: '#ccc',
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: '#FFFFFF' }} />
                  ) : (
                    'สมัครเปิดร้านอาหาร'
                  )}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            fontFamily: 'Prompt, sans-serif',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 