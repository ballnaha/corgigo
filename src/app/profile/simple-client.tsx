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
import RestaurantStatusButton from '@/components/RestaurantStatusButton';
import { useSnackbar } from '@/contexts/SnackbarContext';

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
  const { showSnackbar } = useSnackbar();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
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
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showSnackbar('กรุณาเลือกไฟล์รูปภาพเท่านั้น', 'error');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      showSnackbar('ขนาดไฟล์ต้องไม่เกิน 15MB', 'error');
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

        showSnackbar('อัปโหลดรูปโปรไฟล์สำเร็จ', 'success');
      } else {
        throw new Error(result.error || 'อัปโหลดไม่สำเร็จ');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      showSnackbar(error.message || 'เกิดข้อผิดพลาดในการอัปโหลด', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      showSnackbar('เบราว์เซอร์ไม่รองรับ GPS', 'error');
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
          showSnackbar('ดึงตำแหน่งปัจจุบันสำเร็จ', 'success');
          
        } catch (error: any) {
          console.error('Geocoding error:', error);
          // Fallback to coordinates
          setProfileData(prev => ({ ...prev, address: `${position.coords.latitude}, ${position.coords.longitude}` }));
          setCurrentLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          showSnackbar('ใช้พิกัดแทนที่อยู่', 'info');
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
        
        showSnackbar(message, 'error');
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
            name: `${profileData.firstName} ${profileData.lastName}`.trim(),
            email: profileData.email,
            phone: profileData.phone,
            address: profileData.address,
          }
        });

        setIsEditing(false);
        
        // เด้งไปด้านบนสุดและแสดง snackbar
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showSnackbar('บันทึกข้อมูลสำเร็จ', 'success');
      } else {
        throw new Error(result.error || 'บันทึกไม่สำเร็จ');
      }
    } catch (error: any) {
      console.error('Save error:', error);
      showSnackbar(error.message || 'เกิดข้อผิดพลาดในการบันทึก', 'error');
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth/login' });
  };

  const handleLocationUpdateFromMap = (lat: number, lng: number) => {
    setCurrentLocation({ lat, lng });
  };

  return (
    <Box sx={{ 
      backgroundColor: '#FFFFFF',
      minHeight: '100vh',
      paddingBottom: '80px',
      fontFamily: 'Prompt, sans-serif',
    }}>
      <AppHeader />
      
      <Container maxWidth="xl" sx={{ py: 2, px: 2 }}>
        <Box sx={{ mb: 10 }}>
          {/* Profile Card */}
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: 3,
              border: '1px solid #E8E8E8',
              bgcolor: '#FFFFFF',
              mb: 2,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              {/* Avatar Section */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Box sx={{ position: 'relative', mb: 2 }}>
                  <Avatar
                    src={avatarPreview || session.user?.avatar || undefined}
                    sx={{ 
                      width: 100, 
                      height: 100,
                      cursor: 'pointer', // เปลี่ยนให้คลิกได้เสมอ
                      border: '3px solid #F8A66E',
                      '&:hover': {
                        opacity: 0.8,
                        transform: 'scale(1.05)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                    onClick={handleAvatarClick}
                  >
                    {!avatarPreview && !session.user?.avatar && (
                      <Person sx={{ fontSize: 50, color: '#999' }} />
                    )}
                  </Avatar>
                  
                  {/* แสดงปุ่มกล้องเสมอ แต่ disable เมื่อไม่ได้แก้ไข */}
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: -5,
                      right: -5,
                      bgcolor: isEditing ? '#F8A66E' : '#999',
                      color: '#FFFFFF',
                      width: 32,
                      height: 32,
                      '&:hover': {
                        bgcolor: isEditing ? '#E8956E' : '#777',
                      },
                      opacity: isEditing ? 1 : 0.6,
                    }}
                    onClick={handleAvatarClick}
                    disabled={isUploading || !isEditing}
                    title={isEditing ? 'เปลี่ยนรูปโปรไฟล์' : 'กดแก้ไขข้อมูลเพื่อเปลี่ยนรูป'}
                  >
                    {isUploading ? (
                      <CircularProgress size={16} sx={{ color: '#FFFFFF' }} />
                    ) : (
                      <PhotoCamera sx={{ fontSize: 16 }} />
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
                    textAlign: 'center',
                  }}
                >
                  {profileData.firstName || profileData.lastName 
                    ? `${profileData.firstName} ${profileData.lastName}`.trim()
                    : session.user?.name || 'ผู้ใช้งาน'
                  }
                </Typography>
                
                {/* Avatar Upload Hint */}
                {isEditing && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontFamily: 'Prompt, sans-serif',
                      color: '#666',
                      textAlign: 'center',
                      mt: 0.5,
                    }}
                  >
                    คลิกที่รูปภาพเพื่อเปลี่ยนรูปโปรไฟล์
                  </Typography>
                )}
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Email sx={{ color: '#999', fontSize: 16 }} />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: 'Prompt, sans-serif',
                      color: '#666',
                    }}
                  >
                    {profileData.email || session.user?.email}
                  </Typography>
                </Box>

                {/* Restaurant Status */}
                <Box sx={{ mt: 2 }}>
                  <RestaurantStatusButton session={session} router={router} />
                </Box>
              </Box>

              {/* Form Fields */}
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="ชื่อ"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                    disabled={!isEditing}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <Person sx={{ mr: 1.5, color: '#999', fontSize: 18 }} />,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        fontFamily: 'Prompt, sans-serif',
                        bgcolor: isEditing ? '#FFFFFF' : '#F8F8F8',
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
                    InputProps={{
                      startAdornment: <Person sx={{ mr: 1.5, color: '#999', fontSize: 18 }} />,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        fontFamily: 'Prompt, sans-serif',
                        bgcolor: isEditing ? '#FFFFFF' : '#F8F8F8',
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
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Email sx={{ mr: 1.5, color: '#999', fontSize: 18 }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      fontFamily: 'Prompt, sans-serif',
                      bgcolor: isEditing ? '#FFFFFF' : '#F8F8F8',
                    },
                    '& .MuiInputLabel-root': { 
                      fontFamily: 'Prompt, sans-serif',
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="เบอร์โทรศัพท์"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  disabled={!isEditing}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Phone sx={{ mr: 1.5, color: '#999', fontSize: 18 }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      fontFamily: 'Prompt, sans-serif',
                      bgcolor: isEditing ? '#FFFFFF' : '#F8F8F8',
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
                    endAdornment: isEditing ? (
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
                    ) : null,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      fontFamily: 'Prompt, sans-serif',
                      bgcolor: isEditing ? '#FFFFFF' : '#F8F8F8',
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

      <FooterNavbar />
    </Box>
  );
} 