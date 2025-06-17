'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Typography,
  Avatar,
  Button,
  TextField,
  IconButton,
  CircularProgress,
  Chip,
  Box,
  alpha,
} from '@mui/material';
import MiniMap from '@/components/MiniMap';
import {
  PhotoCamera,
  Person,
  Email,
  Phone,
  LocationOn,
  Logout,
  MyLocation,
  ArrowBack,
} from '@mui/icons-material';
import RestaurantStatusButton from '@/components/RestaurantStatusButton';
import { useSnackbar } from '@/contexts/SnackbarContext';
import FooterNavbar from '@/components/FooterNavbar';
import LoadingScreen from '@/components/LoadingScreen';
import { isLineUser } from '@/utils/userUtils';


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
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [currentLocation, setCurrentLocation] = useState<{lat: number; lng: number} | null>(null);
  const [cartCount, setCartCount] = useState(0);
  
  // ตรวจสอบว่าเป็น LINE user หรือไม่
  const isUserFromLine = isLineUser(session?.user?.email);

  // โหลด cart count จาก localStorage
  useEffect(() => {
    const loadCartCount = () => {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const cartItems = JSON.parse(savedCart);
          const totalCount = cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
          setCartCount(totalCount);
        }
      } catch (error) {
        console.error('Error loading cart count:', error);
      }
    };

    loadCartCount();
    
    // Listen for cart updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cart') {
        loadCartCount();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // โหลดข้อมูล profile จาก API
  useEffect(() => {
    const loadProfileData = async () => {
      // รอให้ session โหลดเสร็จก่อน
      if (status === 'loading') return;
      
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
            // ถ้าไม่มีข้อมูลใน API ให้ใช้ข้อมูลจาก session
            console.log('⚠️ API response not OK, using session data. Status:', response.status);
            setProfileData({
              firstName: session.user.name?.split(' ')[0] || '',
              lastName: session.user.name?.split(' ')[1] || '',
              email: session.user.email || '',
              phone: '', // Session ไม่มีข้อมูลเบอร์โทร
              address: '',
            });
            setAvatarPreview(session.user.avatar || null);
          }
        } catch (error) {
          console.error('Error loading profile:', error);
          console.log('⚠️ API call failed, using session data as fallback');
          // ใช้ข้อมูลจาก session เป็น fallback
          setProfileData({
            firstName: session.user.name?.split(' ')[0] || '',
            lastName: session.user.name?.split(' ')[1] || '',
            email: session.user.email || '',
            phone: '', // Session ไม่มีข้อมูลเบอร์โทร
            address: '',
          });
          setAvatarPreview(session.user.avatar || null);
        }
      }
      
      // เสร็จสิ้นการโหลดข้อมูลเริ่มต้น
      setIsInitialLoading(false);
    };

    loadProfileData();
  }, [session, status]);

  if (isInitialLoading) {
    return (
             <LoadingScreen
         step={status === 'loading' ? 'auth' : 'data'}
         showProgress={true}
         currentStep={status === 'loading' ? 1 : 2}
         totalSteps={2}
         customMessage={status === 'loading' ? undefined : 'กำลังโหลดข้อมูลโปรไฟล์...'}
         subtitle="เตรียมข้อมูลส่วนตัวของคุณ"
       />
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
            } else {
              setCurrentLocation(null);
            }
            
            setAvatarPreview(result.user.avatar || null);
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        showSnackbar('เกิดข้อผิดพลาดในการโหลดข้อมูล', 'error');
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

    // ตรวจสอบขนาดไฟล์ (จำกัดที่ 5MB)
    if (file.size > 15 * 1024 * 1024) {
      showSnackbar('ไฟล์รูปภาพต้องมีขนาดไม่เกิน 15MB', 'error');
      return;
    }

    // ตรวจสอบประเภทไฟล์
    if (!file.type.startsWith('image/')) {
      showSnackbar('กรุณาเลือกไฟล์รูปภาพเท่านั้น', 'error');
      return;
    }

    try {
    setIsUploading(true);

      // Resize image
      const resizedBlob = await resizeImage(file);
      
      // Create FormData
      const formData = new FormData();
      formData.append('avatar', resizedBlob, 'avatar.jpg');

      // Upload to server
      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setAvatarPreview(result.avatarUrl);
        
        // Update session
        await updateSession({
          ...session,
          user: {
            ...session.user,
            avatar: result.avatarUrl,
          },
        });

        showSnackbar('อัปโหลดรูปโปรไฟล์สำเร็จ!', 'success');
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      showSnackbar('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ', 'error');
    } finally {
      setIsUploading(false);
      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      showSnackbar('เบราว์เซอร์ของคุณไม่รองรับการระบุตำแหน่ง', 'error');
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
          const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
          
        // Reverse geocoding to get address
        fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=th`)
          .then(response => response.json())
          .then(data => {
            if (data.locality || data.city) {
              const address = [
                data.locality,
                data.city,
                data.principalSubdivision,
                data.countryName
              ].filter(Boolean).join(', ');
              
              setProfileData(prev => ({ ...prev, address }));
            }
          })
          .catch(error => {
            console.error('Error getting address:', error);
          })
          .finally(() => {
          setIsGettingLocation(false);
          });
      },
      (error) => {
        console.error('Error getting location:', error);
        let errorMessage = 'ไม่สามารถระบุตำแหน่งได้';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'กรุณาอนุญาตให้เข้าถึงตำแหน่งในเบราว์เซอร์';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'ไม่สามารถระบุตำแหน่งได้ในขณะนี้';
            break;
          case error.TIMEOUT:
            errorMessage = 'หมดเวลาในการระบุตำแหน่ง';
            break;
        }
        
        showSnackbar(errorMessage, 'error');
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...profileData,
          latitude: currentLocation?.lat,
          longitude: currentLocation?.lng,
        }),
      });

      const result = await response.json();

      if (result.success) {
        showSnackbar('บันทึกข้อมูลสำเร็จ!', 'success');
        setIsEditing(false);
        
        // เด้งขึ้นด้านบนสุดแบบเดียวกับ restaurant/pending
        const scrollToTop = () => {
          // ใช้หลายวิธีเพื่อให้แน่ใจว่า scroll ได้
          if (typeof window !== 'undefined') {
            // วิธีที่ 1: window.scrollTo
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // วิธีที่ 2: document element scroll
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
            
            // วิธีที่ 3: ใช้ requestAnimationFrame เพื่อให้แน่ใจ
            requestAnimationFrame(() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            });
          }
        };
        
        // เรียกใช้ทันทีและหลังจาก UI อัปเดต
        scrollToTop();
        setTimeout(scrollToTop, 50);
        setTimeout(scrollToTop, 200);
        
        // Update session if name changed
        if (profileData.firstName || profileData.lastName) {
        await updateSession({
          ...session,
          user: {
            ...session.user,
            name: `${profileData.firstName} ${profileData.lastName}`.trim(),
            },
          });
        }
      } else {
        throw new Error(result.error || 'Save failed');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      showSnackbar('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth/login' });
  };

  const handleLocationUpdateFromMap = (lat: number, lng: number) => {
    setCurrentLocation({ lat, lng });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Box className="app-container">
      {/* Custom Header */}
      <Box sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        bgcolor: '#FFFFFF',
        borderBottom: '1px solid #E8E8E8',
        px: 2,
        py: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
        minHeight: 64,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={handleBack}
            sx={{
              color: '#1A1A1A',
              '&:hover': {
                bgcolor: '#F5F5F5',
              },
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'Prompt, sans-serif',
              fontWeight: 600,
              color: '#1A1A1A',
              fontSize: '1.1rem',
            }}
          >
            โปรไฟล์
          </Typography>
        </Box>
        
        <Button
          onClick={isEditing ? handleSaveProfile : handleEditToggle}
          variant="text"
          sx={{
            color: '#F8A66E',
            fontFamily: 'Prompt, sans-serif',
            fontWeight: 600,
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            minWidth: 'auto',
            px: 1,
            '&:hover': {
              bgcolor: 'transparent',
              color: '#E8956E',
            },
          }}
        >
          {isEditing ? 'บันทึก' : 'แก้ไข'}
        </Button>
      </Box>

      {/* Profile Content */}
      <Box className="app-content" sx={{ bgcolor: '#F5F5F5' , marginBottom: '64px' }}>
        <Box sx={{ px: 2, py: 3 }}>
        {/* Profile Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 3, 
          mb: 4,
          bgcolor: '#FFFFFF',
          borderRadius: 2,
          p: 3,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={avatarPreview || session.user?.avatar || undefined}
              sx={{ 
                width: 80, 
                height: 80,
                cursor: isEditing ? 'pointer' : 'default',
                '&:hover': isEditing ? {
                  opacity: 0.8,
                } : {},
                transition: 'all 0.2s ease',
              }}
              onClick={isEditing ? handleAvatarClick : undefined}
            >
              {!avatarPreview && !session.user?.avatar && (
                <Person sx={{ fontSize: 40, color: '#999' }} />
              )}
            </Avatar>
            
            {isEditing ? (
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: -5,
                  right: -5,
                  bgcolor: '#F8A66E',
                  color: '#FFFFFF',
                  width: 28,
                  height: 28,
                  '&:hover': {
                    bgcolor: '#E8956E',
                  },
                }}
                onClick={handleAvatarClick}
                disabled={isUploading}
              >
                {isUploading ? (
                  <CircularProgress size={14} sx={{ color: '#1a1a1a' }} />
                ) : (
                  <PhotoCamera sx={{ fontSize: 14 }} />
                )}
              </IconButton>
            ) : (
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: -5,
                  right: -5,
                  bgcolor: '#F5F5F5',
                  color: '#999',
                  width: 28,
                  height: 28,
                  '&:hover': {
                    bgcolor: '#F5F5F5',
                    color: '#999',
                  },
                }}
                
              >
                <PhotoCamera sx={{ fontSize: 14 }} />
              </IconButton>
            )}
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: 'Prompt, sans-serif',
                fontWeight: 600,
                color: '#1A1A1A',
                fontSize: '1.3rem',
                mb: 0.5,
              }}
            >
              {profileData.firstName || profileData.lastName 
                ? `${profileData.firstName} ${profileData.lastName}`.trim()
                : session.user?.name || 'ผู้ใช้งาน'
              }
            </Typography>
            
          </Box>
        </Box>

        {/* Profile Info List */}
        <Box sx={{ bgcolor: '#FFFFFF', borderRadius: 2, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          {/* Full Name */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            p: 3, 
            borderBottom: '1px solid #F5F5F5',
          }}>
            <Box sx={{ 
              width: 40, 
              height: 40, 
              borderRadius: '50%', 
              bgcolor: '#FFF3E0', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mr: 3,
            }}>
              <Person sx={{ color: '#F8A66E', fontSize: 20 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  fontFamily: 'Prompt, sans-serif',
                  color: '#999',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  display: 'block',
                  mb: 0.5,
                }}
              >
                FULL NAME
              </Typography>
              {isEditing ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <TextField
                    size="small"
                    placeholder="ชื่อ"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                    variant="outlined"
                    sx={{
                      width: '100%',
                      '& .MuiOutlinedInput-root': {
                        fontFamily: 'Prompt, sans-serif',
                        fontSize: '0.9rem',
                        borderRadius: 2,
                        backgroundColor: '#FAFAFA',
                        '&:hover': {
                          backgroundColor: '#F5F5F5',
                        },
                        '&.Mui-focused': {
                          backgroundColor: '#FFFFFF',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#F8A66E',
                            borderWidth: 2,
                          },
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#E0E0E0',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#BDBDBD',
                        },
                      },
                      '& .MuiInputBase-input': {
                        fontFamily: 'Prompt, sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        color: '#1A1A1A',
                        '&::placeholder': {
                          color: '#999',
                          opacity: 1,
                        },
                      },
                    }}
                  />
                  <TextField
                    size="small"
                    placeholder="นามสกุล"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                    variant="outlined"
                    sx={{
                      width: '100%',
                      '& .MuiOutlinedInput-root': {
                        fontFamily: 'Prompt, sans-serif',
                        fontSize: '0.9rem',
                        borderRadius: 2,
                        backgroundColor: '#FAFAFA',
                        '&:hover': {
                          backgroundColor: '#F5F5F5',
                        },
                        '&.Mui-focused': {
                          backgroundColor: '#FFFFFF',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#F8A66E',
                            borderWidth: 2,
                          },
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#E0E0E0',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#BDBDBD',
                        },
                      },
                      '& .MuiInputBase-input': {
                        fontFamily: 'Prompt, sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        color: '#1A1A1A',
                        '&::placeholder': {
                          color: '#999',
                          opacity: 1,
                        },
                      },
                    }}
                  />
                </Box>
              ) : (
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontFamily: 'Prompt, sans-serif',
                    color: '#1A1A1A',
                    fontWeight: 500,
                  }}
                >
                  {profileData.firstName || profileData.lastName 
                    ? `${profileData.firstName} ${profileData.lastName}`.trim()
                    : session.user?.name || 'ไม่ระบุ'
                  }
                </Typography>
              )}
            </Box>
          </Box>

          {/* Email - ซ่อนสำหรับ LINE users */}
          {!isUserFromLine && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            p: 3, 
            borderBottom: '1px solid #F5F5F5',
          }}>
            <Box sx={{ 
              width: 40, 
              height: 40, 
              borderRadius: '50%', 
              bgcolor: '#E3F2FD', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mr: 3,
            }}>
              <Email sx={{ color: '#2196F3', fontSize: 20 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  fontFamily: 'Prompt, sans-serif',
                  color: '#999',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  display: 'block',
                  mb: 0.5,
                }}
              >
                EMAIL
              </Typography>
              {isEditing ? (
                <TextField
                  size="small"
                  type="email"
                  placeholder="อีเมล"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  variant="outlined"
                  sx={{
                    width: '100%',
                    '& .MuiOutlinedInput-root': {
                      fontFamily: 'Prompt, sans-serif',
                      fontSize: '0.9rem',
                      borderRadius: 2,
                      backgroundColor: '#FAFAFA',
                      '&:hover': {
                        backgroundColor: '#F5F5F5',
                      },
                      '&.Mui-focused': {
                        backgroundColor: '#FFFFFF',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#F8A66E',
                          borderWidth: 2,
                        },
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#E0E0E0',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#BDBDBD',
                      },
                    },
                    '& .MuiInputBase-input': {
                      fontFamily: 'Prompt, sans-serif',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      color: '#1A1A1A',
                      '&::placeholder': {
                        color: '#999',
                        opacity: 1,
                      },
                    },
                  }}
                />
              ) : (
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontFamily: 'Prompt, sans-serif',
                    color: '#1A1A1A',
                    fontWeight: 500,
                  }}
                >
                  {profileData.email || session.user?.email || 'ไม่ระบุ'}
                </Typography>
              )}
            </Box>
          </Box>
          )}

          {/* Phone Number */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            p: 3,
            borderBottom: '1px solid #F5F5F5',
          }}>
            <Box sx={{ 
              width: 40, 
              height: 40, 
              borderRadius: '50%', 
              bgcolor: '#E8F5E8', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mr: 3,
            }}>
              <Phone sx={{ color: '#4CAF50', fontSize: 20 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  fontFamily: 'Prompt, sans-serif',
                  color: '#999',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  display: 'block',
                  mb: 0.5,
                }}
              >
                PHONE NUMBER
              </Typography>
              {isEditing ? (
                <TextField
                  size="small"
                  type="tel"
                  placeholder="เบอร์โทรศัพท์"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  variant="outlined"
                  sx={{
                    width: '100%',
                    '& .MuiOutlinedInput-root': {
                      fontFamily: 'Prompt, sans-serif',
                      fontSize: '0.9rem',
                      borderRadius: 2,
                      backgroundColor: '#FAFAFA',
                      '&:hover': {
                        backgroundColor: '#F5F5F5',
                      },
                      '&.Mui-focused': {
                        backgroundColor: '#FFFFFF',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#F8A66E',
                          borderWidth: 2,
                        },
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#E0E0E0',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#BDBDBD',
                      },
                    },
                    '& .MuiInputBase-input': {
                      fontFamily: 'Prompt, sans-serif',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      color: '#1A1A1A',
                      '&::placeholder': {
                        color: '#999',
                        opacity: 1,
                      },
                    },
                  }}
                />
              ) : (
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontFamily: 'Prompt, sans-serif',
                    color: '#1A1A1A',
                    fontWeight: 500,
                  }}
                >
                  {profileData.phone || 'ไม่ระบุ'}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Address - แสดงทั้งในโหมด view และ edit */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            p: 3,
          }}>
            <Box sx={{ 
              width: 40, 
              height: 40, 
              borderRadius: '50%', 
              bgcolor: '#FFF3E0', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mr: 3,
              mt: 0.5,
            }}>
              <LocationOn sx={{ color: '#FF9800', fontSize: 20 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  fontFamily: 'Prompt, sans-serif',
                  color: '#999',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  display: 'block',
                  mb: 0.5,
                }}
              >
                ADDRESS
              </Typography>
              {isEditing ? (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                  <TextField
                    size="small"
                    multiline
                    rows={5}
                    placeholder="ที่อยู่"
                    value={profileData.address}
                    onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                    variant="outlined"
                    sx={{
                      flex: 1,
                      '& .MuiOutlinedInput-root': {
                        fontFamily: 'Prompt, sans-serif',
                        fontSize: '0.9rem',
                        borderRadius: 2,
                        backgroundColor: '#FAFAFA',
                        '&:hover': {
                          backgroundColor: '#F5F5F5',
                        },
                        '&.Mui-focused': {
                          backgroundColor: '#FFFFFF',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#F8A66E',
                            borderWidth: 2,
                          },
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#E0E0E0',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#BDBDBD',
                        },
                      },
                      '& .MuiInputBase-input': {
                        fontFamily: 'Prompt, sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        color: '#1A1A1A',
                        '&::placeholder': {
                          color: '#999',
                          opacity: 1,
                        },
                      },
                    }}
                  />
                  <IconButton
                    onClick={handleGetCurrentLocation}
                    disabled={isGettingLocation}
                    sx={{
                      color: '#F8A66E',
                      mt: 0.5,
                      '&:hover': {
                        bgcolor: alpha('#F8A66E', 0.1),
                      },
                    }}
                    title="ใช้ตำแหน่งปัจจุบัน"
                  >
                    {isGettingLocation ? (
                      <CircularProgress size={20} sx={{ color: '#F8A66E' }} />
                    ) : (
                      <MyLocation sx={{ fontSize: 20 }} />
                    )}
                  </IconButton>
                </Box>
              ) : (
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontFamily: 'Prompt, sans-serif',
                    color: '#1A1A1A',
                    fontWeight: 500,
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {profileData.address || 'ไม่ระบุ'}
                </Typography>
              )}
            </Box>
          </Box>

          
        </Box>

        {/* Current Location Display - แสดงเฉพาะเมื่อมี location */}
        {currentLocation && (
          <Box sx={{ 
            bgcolor: '#FFFFFF', 
            borderRadius: 2, 
            p: 3, 
            mt: 2,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}>
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
          </Box>
        )}

        {/* Mini Map - แสดงเฉพาะเมื่อมี location */}
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

        {/* Restaurant Status */}
        <Box sx={{ mt: 3 }}>
          <RestaurantStatusButton session={session} router={router} />
        </Box>

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
      </Box>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {/* Footer Navigation */}
      <FooterNavbar cartCount={cartCount} />
    </Box>

  );
} 