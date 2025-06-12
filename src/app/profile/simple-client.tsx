'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  TextField,
  IconButton,
  CircularProgress,
  Stack,
  Chip,
  Snackbar,
  Alert,
  Box,
  alpha,
} from '@mui/material';
import AppHeader from '@/components/AppHeader';
import MiniMap from '@/components/MiniMap';
import FooterNavbar from '@/components/FooterNavbar';
import {
  PhotoCamera,
  Edit,
  Save,
  Cancel,
  Person,
  Email,
  Phone,
  LocationOn,
  Logout,
  MyLocation,
  VerifiedUser,
  Restaurant,
  Add,
} from '@mui/icons-material';

// Utility function to resize image
const resizeImage = (file: File, maxWidth: number = 400, maxHeight: number = 400, quality: number = 0.8): Promise<Blob> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();

    img.onload = () => {
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, 'image/jpeg', quality);
    };

    img.src = URL.createObjectURL(file);
  });
};

export default function SimpleProfileClient() {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [currentLocation, setCurrentLocation] = useState<{lat: number; lng: number} | null>(null);

  // โหลดข้อมูล profile จาก API
  useEffect(() => {
    const loadProfileData = async () => {
      if (session?.user) {
        try {
          const response = await fetch('/api/profile');
          if (response.ok) {
            const result = await response.json();
            if (result.success && result.user) {
              setProfileData({
                firstName: result.user.firstName || '',
                lastName: result.user.lastName || '',
                email: result.user.email || '',
                phone: result.user.phone || '',
                address: result.user.address || '',
              });
              
              // ตั้งค่า location หากมี
              if (result.user.latitude && result.user.longitude) {
                setCurrentLocation({
                  lat: result.user.latitude,
                  lng: result.user.longitude
                });
              }
              
              setAvatarPreview(result.user.avatar || null);
            }
          } else {
            setAvatarPreview(session.user.avatar || null);
          }
        } catch (error) {
          console.error('Error loading profile:', error);
          setProfileData({
            firstName: session.user.name?.split(' ')[0] || '',
            lastName: session.user.name?.split(' ')[1] || '',
            email: session.user.email || '',
            phone: '',
            address: '',
          });
          setAvatarPreview(session.user.avatar || null);
        }
      }
    };

    loadProfileData();
  }, [session]);

  if (status === 'loading') {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        bgcolor: '#FAFAFA',
      }}>
        <CircularProgress sx={{ color: '#F8A66E' }} size={40} />
      </Box>
    );
  }

  if (!session) {
    router.push('/auth/login');
    return null;
  }

  const handleEditToggle = async () => {
    if (isEditing) {
      // ถ้ากำลังแก้ไขอยู่และกดยกเลิก ให้โหลดข้อมูลเดิมจาก API
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.user) {
            setProfileData({
              firstName: result.user.firstName || '',
              lastName: result.user.lastName || '',
              email: result.user.email || '',
              phone: result.user.phone || '',
              address: result.user.address || '',
            });
            
            // ตั้งค่า location หากมี
            if (result.user.latitude && result.user.longitude) {
              setCurrentLocation({
                lat: result.user.latitude,
                lng: result.user.longitude
              });
            }
            
            setAvatarPreview(result.user.avatar || null);
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setSnackbar({ 
        open: true, 
        message: 'กรุณาเลือกไฟล์รูปภาพเท่านั้น', 
        severity: 'error' 
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setSnackbar({ 
        open: true, 
        message: 'ขนาดไฟล์ต้องไม่เกิน 10MB', 
        severity: 'error' 
      });
      return;
    }

    setIsUploading(true);

    try {
      // Resize image before upload
      const resizedImageBlob = await resizeImage(file, 400, 400, 0.8);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(resizedImageBlob);

      // Upload to server
      const formData = new FormData();
      formData.append('avatar', resizedImageBlob, file.name);

      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setAvatarPreview(result.avatarUrl);
        
        await updateSession({
          ...session,
          user: {
            ...session.user,
            avatar: result.avatarUrl,
          }
        });

        setSnackbar({ 
          open: true, 
          message: 'อัปโหลดรูปโปรไฟล์สำเร็จ', 
          severity: 'success' 
        });
      } else {
        throw new Error(result.error || 'อัปโหลดไม่สำเร็จ');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      setSnackbar({ 
        open: true, 
        message: error.message || 'เกิดข้อผิดพลาดในการอัปโหลด', 
        severity: 'error' 
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setSnackbar({ 
        open: true, 
        message: 'เบราว์เซอร์ไม่รองรับ GPS', 
        severity: 'error' 
      });
      return;
    }

    setIsGettingLocation(true);

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
          
          setProfileData(prev => ({ ...prev, address: address || `${position.coords.latitude}, ${position.coords.longitude}` }));
          setCurrentLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          setSnackbar({ 
            open: true, 
            message: 'ดึงตำแหน่งปัจจุบันสำเร็จ', 
            severity: 'success' 
          });
          
        } catch (error: any) {
          console.error('Geocoding error:', error);
          // Fallback to coordinates
          setProfileData(prev => ({ ...prev, address: `${position.coords.latitude}, ${position.coords.longitude}` }));
          setCurrentLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
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
        maximumAge: 300000
      }
    );
  };

  const handleSaveProfile = async () => {
    try {
      const saveData = {
        ...profileData,
        latitude: currentLocation?.lat || null,
        longitude: currentLocation?.lng || null,
      };

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saveData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        await updateSession({
          ...session,
          user: {
            ...session.user,
            name: `${result.user.firstName} ${result.user.lastName}`,
          }
        });

        // อัปเดต profileData และ location
        setProfileData({
          firstName: result.user.firstName || '',
          lastName: result.user.lastName || '',
          email: result.user.email || '',
          phone: result.user.phone || '',
          address: result.user.address || '',
        });

        if (result.user.latitude && result.user.longitude) {
          setCurrentLocation({
            lat: result.user.latitude,
            lng: result.user.longitude
          });
        }

        // แสดงข้อมูลที่เปลี่ยนแปลง
        const changes = [];
        if (result.user.firstName) changes.push(`ชื่อ: ${result.user.firstName}`);
        if (result.user.lastName) changes.push(`นามสกุล: ${result.user.lastName}`);
        if (result.user.phone) changes.push(`เบอร์โทร: ${result.user.phone}`);
        if (result.user.address) changes.push(`ที่อยู่: ${result.user.address}`);
        if (result.user.latitude && result.user.longitude) {
          changes.push(`ตำแหน่ง GPS: ${result.user.latitude.toFixed(6)}, ${result.user.longitude.toFixed(6)}`);
        }

        const changeMessage = changes.length > 0 
          ? `บันทึกสำเร็จ - ${changes.join(', ')}` 
          : 'บันทึกข้อมูลสำเร็จ';

        setSnackbar({ 
          open: true, 
          message: changeMessage, 
          severity: 'success' 
        });
        setIsEditing(false);
      } else {
        throw new Error(result.error || 'บันทึกข้อมูลไม่สำเร็จ');
      }
    } catch (error: any) {
      setSnackbar({ 
        open: true, 
        message: error.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง', 
        severity: 'error' 
      });
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth/login' });
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleLocationUpdateFromMap = (lat: number, lng: number) => {
    setCurrentLocation({ lat, lng });
    setProfileData(prev => ({ ...prev, address: `${lat.toFixed(6)}, ${lng.toFixed(6)}` }));
  };

  return (
    <Box sx={{ 
      backgroundColor: '#FAFAFA',
      minHeight: '100vh',
      paddingBottom: '80px',
      fontFamily: 'Prompt, sans-serif',
    }}>
      <AppHeader />
      
      <Container maxWidth="sm" sx={{ py: 0, px: 0 }}>
        {/* Profile Header */}
        <Box
          sx={{
            background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)',
            pt: 4,
            pb: 3,
            px: 3,
            textAlign: 'center',
            position: 'relative',
          }}
        >
          {/* Edit Button */}
          <IconButton 
            onClick={handleEditToggle}
            sx={{ 
              position: 'absolute',
              top: 16,
              right: 16,
              bgcolor: alpha('#000', 0.04),
              '&:hover': { bgcolor: alpha('#000', 0.08) },
              width: 40,
              height: 40,
            }}
          >
            {isEditing ? <Cancel sx={{ fontSize: 20, color: '#666' }} /> : <Edit sx={{ fontSize: 20, color: '#666' }} />}
          </IconButton>

          {/* Avatar Section */}
          <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
            <Avatar
              src={avatarPreview || session.user.avatar || undefined}
              sx={{ 
                width: 88, 
                height: 88, 
                mx: 'auto',
                bgcolor: '#F5F5F5',
                border: '3px solid #FFFFFF',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              }}
            >
              {!avatarPreview && !session.user.avatar && (
                <Person sx={{ fontSize: 40, color: '#999' }} />
              )}
            </Avatar>
            
            <IconButton
              onClick={handleAvatarClick}
              disabled={isUploading}
              sx={{
                position: 'absolute',
                bottom: -4,
                right: -4,
                bgcolor: '#FFFFFF',
                border: '2px solid #F5F5F5',
                width: 32,
                height: 32,
                '&:hover': { 
                  bgcolor: '#FAFAFA',
                  transform: 'scale(1.1)',
                },
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease',
              }}
            >
              {isUploading ? (
                <CircularProgress size={16} sx={{ color: '#666' }} />
              ) : (
                <PhotoCamera sx={{ fontSize: 16, color: '#666' }} />
              )}
            </IconButton>
          </Box>
          
          {/* User Info */}
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: 'Prompt, sans-serif',
              fontWeight: 600, 
              color: '#1A1A1A', 
              mb: 0.5, 
            }}
          >
            {session.user.name || 'ผู้ใช้งาน'}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              fontFamily: 'Prompt, sans-serif',
              color: '#666', 
              mb: 2, 
            }}
          >
            {session.user.email}
          </Typography>
          
          {/* Role Badge */}
          <Chip 
            icon={<VerifiedUser sx={{ fontSize: 16 }} />}
            label={session.user.primaryRole || 'CUSTOMER'} 
            size="small"
            sx={{
              fontFamily: 'Prompt, sans-serif',
              bgcolor: alpha('#F8A66E', 0.1),
              color: '#F8A66E',
              fontWeight: 500,
              height: 28,
              '& .MuiChip-icon': { color: '#F8A66E' },
              border: `1px solid ${alpha('#F8A66E', 0.2)}`,
            }}
          />

          {/* Restaurant Link */}
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={session.user.restaurant ? <Restaurant /> : <Add />}
              onClick={() => {
                if (session.user.restaurant) {
                  router.push('/restaurant');
                } else {
                  router.push('/restaurant/register');
                }
              }}
              sx={{
                borderColor: '#F8A66E',
                color: '#F8A66E',
                fontFamily: 'Prompt, sans-serif',
                fontWeight: 500,
                borderRadius: 2,
                px: 3,
                py: 1,
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#E8956E',
                  bgcolor: alpha('#F8A66E', 0.04),
                },
              }}
            >
              {session.user.restaurant ? 'ร้านอาหารของฉัน' : 'สมัครเปิดร้านอาหาร'}
            </Button>
          </Box>
        </Box>

        {/* Profile Form */}
        <Box sx={{ px: 3, pb: 3 }}>
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: 3,
              border: '1px solid #E8E8E8',
              bgcolor: '#FFFFFF',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Person sx={{ color: '#666', mr: 1.5, fontSize: 20 }} />
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontFamily: 'Prompt, sans-serif',
                    fontWeight: 600, 
                    color: '#1A1A1A', 
                  }}
                >
                  ข้อมูลส่วนตัว
                </Typography>
              </Box>
              
              <Stack spacing={2.5}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="ชื่อ"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                    disabled={!isEditing}
                    variant="outlined"
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: isEditing ? '#FFFFFF' : '#FAFAFA',
                        fontFamily: 'Prompt, sans-serif',
                      },
                      '& .MuiInputLabel-root': { 
                        fontFamily: 'Prompt, sans-serif',
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="นามสกุล"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                    disabled={!isEditing}
                    variant="outlined"
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: isEditing ? '#FFFFFF' : '#FAFAFA',
                        fontFamily: 'Prompt, sans-serif',
                      },
                      '& .MuiInputLabel-root': { 
                        fontFamily: 'Prompt, sans-serif',
                      },
                    }}
                  />
                </Box>
                
                <TextField
                  fullWidth
                  label="อีเมล"
                  value={profileData.email}
                  disabled
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: <Email sx={{ mr: 1.5, color: '#999', fontSize: 18 }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: '#FAFAFA',
                      fontFamily: 'Prompt, sans-serif',
                    },
                    '& .MuiInputLabel-root': { 
                      fontFamily: 'Prompt, sans-serif',
                    },
                  }}
                />
                
                <TextField
                  fullWidth
                  label="หมายเลขโทรศัพท์"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  disabled={!isEditing}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: <Phone sx={{ mr: 1.5, color: '#999', fontSize: 18 }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: isEditing ? '#FFFFFF' : '#FAFAFA',
                      fontFamily: 'Prompt, sans-serif',
                    },
                    '& .MuiInputLabel-root': { 
                      fontFamily: 'Prompt, sans-serif',
                    },
                  }}
                />
                
                <TextField
                  fullWidth
                  label="ที่อยู่"
                  value={profileData.address}
                  onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                  disabled={!isEditing}
                  variant="outlined"
                  multiline
                  rows={2}
                  InputProps={{
                    startAdornment: <LocationOn sx={{ mr: 1.5, color: '#999', fontSize: 18, alignSelf: 'flex-start', mt: 0.5 }} />,
                    endAdornment: isEditing && (
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
                      bgcolor: isEditing ? '#FFFFFF' : '#FAFAFA',
                      fontFamily: 'Prompt, sans-serif',
                    },
                    '& .MuiInputLabel-root': { 
                      fontFamily: 'Prompt, sans-serif',
                    },
                  }}
                />
              </Stack>

              {/* Action Buttons */}
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                {isEditing ? (
                  <>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSaveProfile}
                      sx={{
                        flex: 1,
                        bgcolor: '#F8A66E',
                        color: '#FFFFFF',
                        fontFamily: 'Prompt, sans-serif',
                        fontWeight: 500,
                        borderRadius: 2,
                        py: 1,
                        textTransform: 'none',
                        '&:hover': {
                          bgcolor: '#E8956E',
                        },
                      }}
                    >
                      บันทึกข้อมูล
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={handleEditToggle}
                      sx={{
                        flex: 1,
                        borderColor: '#E8E8E8',
                        color: '#666',
                        fontFamily: 'Prompt, sans-serif',
                        fontWeight: 500,
                        borderRadius: 2,
                        py: 1,
                        textTransform: 'none',
                        '&:hover': {
                          borderColor: '#D0D0D0',
                          bgcolor: '#FAFAFA',
                        },
                      }}
                    >
                      ยกเลิก
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={handleEditToggle}
                    sx={{
                      flex: 1,
                      borderColor: '#F8A66E',
                      color: '#F8A66E',
                      fontFamily: 'Prompt, sans-serif',
                      fontWeight: 500,
                      borderRadius: 2,
                      py: 1,
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: '#E8956E',
                        bgcolor: alpha('#F8A66E', 0.04),
                      },
                    }}
                  >
                    แก้ไขข้อมูล
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* GPS Coordinates Display */}
          {currentLocation && (
            <Card 
              elevation={0}
              sx={{ 
                borderRadius: 3,
                border: '1px solid #E8E8E8',
                bgcolor: '#FFFFFF',
                mt: 2,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MyLocation sx={{ color: '#F8A66E', mr: 1.5, fontSize: 20 }} />
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontFamily: 'Prompt, sans-serif',
                      fontWeight: 600, 
                      color: '#1A1A1A', 
                    }}
                  >
                    พิกัด GPS
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={`ละติจูด: ${currentLocation.lat.toFixed(6)}`}
                    size="small"
                    sx={{
                      fontFamily: 'Prompt, sans-serif',
                      bgcolor: alpha('#F8A66E', 0.1),
                      color: '#F8A66E',
                      border: `1px solid ${alpha('#F8A66E', 0.2)}`,
                    }}
                  />
                  <Chip
                    label={`ลองจิจูด: ${currentLocation.lng.toFixed(6)}`}
                    size="small"
                    sx={{
                      fontFamily: 'Prompt, sans-serif',
                      bgcolor: alpha('#F8A66E', 0.1),
                      color: '#F8A66E',
                      border: `1px solid ${alpha('#F8A66E', 0.2)}`,
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Mini Map */}
          {currentLocation && (
            <Box sx={{ mt: 2 }}>
              <MiniMap
                latitude={currentLocation.lat}
                longitude={currentLocation.lng}
                onLocationUpdate={handleLocationUpdateFromMap}
                showCoordinates={false}
                showRefresh={isEditing}
                height={200}
              />
            </Box>
          )}

          {/* Logout Button */}
          <Box sx={{ mt: 3 }}>
            <Button
              variant="outlined"
              startIcon={<Logout />}
              onClick={handleLogout}
              fullWidth
              sx={{
                borderColor: '#E8E8E8',
                color: '#999',
                fontFamily: 'Prompt, sans-serif',
                fontWeight: 500,
                borderRadius: 2,
                py: 1.5,
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#FF6B6B',
                  color: '#FF6B6B',
                  bgcolor: alpha('#FF6B6B', 0.04),
                },
              }}
            >
              ออกจากระบบ
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        style={{ display: 'none' }}
      />

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

      <FooterNavbar />
    </Box>
  );
} 