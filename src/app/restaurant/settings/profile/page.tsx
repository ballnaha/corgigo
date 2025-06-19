'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Avatar,
  IconButton,
  Alert,
  Stack,
  Chip,
  CircularProgress,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  PhotoCamera,
  Save,
  Edit,
  Store,
  LocationOn,
  Phone,
  Email,
  AccessTime,
  Description,
  MyLocation,
  Business,
  Delete,
  Image,
} from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { styled } from '@mui/material/styles';
import MiniMap from '@/components/MiniMap';
import { formatThaiDateTime } from '@/lib/timezone';

// ธีมสี Vristo
const vristoTheme = {
  primary: '#4361ee',
  secondary: '#f39c12',
  success: '#1abc9c',
  danger: '#e74c3c',
  warning: '#f39c12',
  info: '#3498db',
  light: '#f8f9fa',
  dark: '#2c3e50',
  background: {
    main: '#f8fafc',
    paper: '#ffffff',
  },
  text: {
    primary: '#1e293b',
    secondary: '#64748b',
  },
  shadow: {
    card: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    elevated: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  font: {
    family: '"Prompt", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  }
};

// Styled components
const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    fontFamily: vristoTheme.font.family,
    '& fieldset': {
      borderColor: '#e2e8f0',
    },
    '&:hover fieldset': {
      borderColor: vristoTheme.primary,
    },
    '&.Mui-focused fieldset': {
      borderColor: vristoTheme.primary,
    },
  },
  '& .MuiInputLabel-root': {
    color: vristoTheme.text.secondary,
    fontFamily: vristoTheme.font.family,
    '&.Mui-focused': {
      color: vristoTheme.primary,
    },
  },
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  margin: '0 auto',
  border: `4px solid ${vristoTheme.light}`,
  boxShadow: vristoTheme.shadow.card,
}));

interface RestaurantProfile {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email?: string;
  openTime: string;
  closeTime: string;
  latitude?: number;
  longitude?: number;
  status: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectReason?: string;
  avatarUrl?: string;
  coverUrl?: string;
  // Name change fields
  pendingName?: string;
  nameChangeRequestedAt?: string;
  nameApprovedAt?: string;
  nameRejectedAt?: string;
  nameRejectReason?: string;
}

export default function RestaurantProfilePage() {
  const { data: session } = useSession();
  const { showSnackbar } = useSnackbar();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [showMap, setShowMap] = useState(false);
  
  // Name change states
  const [showNameChangeDialog, setShowNameChangeDialog] = useState(false);
  const [newRestaurantName, setNewRestaurantName] = useState('');
  const [submittingNameChange, setSubmittingNameChange] = useState(false);
  
  const [profile, setProfile] = useState<RestaurantProfile>({
    id: '',
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    openTime: '09:00',
    closeTime: '21:00',
    status: 'PENDING',
  });

  const [location, setLocation] = useState<{lat: number; lng: number} | null>(null);

  // โหลดข้อมูลร้านอาหาร
  const loadRestaurantProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/restaurant/register');
      const result = await response.json();

      if (response.ok && result.success) {
        const restaurant = result.restaurant;
        setProfile({
          id: restaurant.id,
          name: restaurant.name || '',
          description: restaurant.description || '',
          address: restaurant.address || '',
          phone: restaurant.phone || '',
          email: session?.user?.email || '',
          openTime: restaurant.openTime || '09:00',
          closeTime: restaurant.closeTime || '21:00',
          status: restaurant.status,
          approvedAt: restaurant.approvedAt,
          rejectedAt: restaurant.rejectedAt,
          rejectReason: restaurant.rejectReason,
          avatarUrl: restaurant.avatarUrl || '',
          coverUrl: restaurant.coverUrl || '',
          // Name change fields
          pendingName: restaurant.pendingName,
          nameChangeRequestedAt: restaurant.nameChangeRequestedAt,
          nameApprovedAt: restaurant.nameApprovedAt,
          nameRejectedAt: restaurant.nameRejectedAt,
          nameRejectReason: restaurant.nameRejectReason,
        });

        if (restaurant.latitude && restaurant.longitude) {
          setLocation({
            lat: restaurant.latitude,
            lng: restaurant.longitude,
          });
        }
      } else {
        showSnackbar(result.error || 'ไม่สามารถโหลดข้อมูลได้', 'error');
      }
    } catch (error) {
      console.error('Error loading restaurant profile:', error);
      showSnackbar('เกิดข้อผิดพลาดในการโหลดข้อมูล', 'error');
    } finally {
      setLoading(false);
    }
  };

  // บันทึกข้อมูล
  const handleSave = async () => {
    try {
      setSaving(true);

      const formData = new FormData();
      formData.append('name', profile.name);
      formData.append('description', profile.description);
      formData.append('address', profile.address);
      formData.append('phone', profile.phone);
      formData.append('openTime', profile.openTime);
      formData.append('closeTime', profile.closeTime);
      
      if (location?.lat && location?.lng) {
        formData.append('latitude', location.lat.toString());
        formData.append('longitude', location.lng.toString());
      }

      const response = await fetch('/api/restaurant/register', {
        method: 'PUT',
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showSnackbar('บันทึกข้อมูลส่วนตัวร้านสำเร็จ!', 'success');
        setEditMode(false);
        await loadRestaurantProfile(); // โหลดข้อมูลใหม่
      } else {
        showSnackbar(result.error || 'ไม่สามารถบันทึกข้อมูลได้', 'error');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      showSnackbar('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
    } finally {
      setSaving(false);
    }
  };

  // รับตำแหน่งปัจจุบัน
  const handleGetCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // ใช้ reverse geocoding เพื่อได้ที่อยู่
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=th`
            );
            
            if (response.ok) {
              const data = await response.json();
              
              // จัดรูปแบบที่อยู่ภาษาไทย
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
              
              // อัพเดทที่อยู่และตำแหน่ง
              setProfile(prev => ({ ...prev, address: address || `${latitude}, ${longitude}` }));
              setLocation({ lat: latitude, lng: longitude });
              setShowMap(true); // แสดง MiniMap
              
              showSnackbar('ได้รับตำแหน่งปัจจุบันแล้ว', 'success');
            }
          } catch (error) {
            console.error('Geocoding error:', error);
            showSnackbar('ไม่สามารถแปลงตำแหน่งเป็นที่อยู่ได้', 'error');
          } finally {
            setIsGettingLocation(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          showSnackbar('ไม่สามารถรับตำแหน่งปัจจุบันได้', 'error');
          setIsGettingLocation(false);
        }
      );
    } else {
      showSnackbar('เบราว์เซอร์ไม่รองรับการรับตำแหน่ง', 'error');
      setIsGettingLocation(false);
    }
  };

  // อัพเดทตำแหน่งจาก MiniMap
  const handleLocationUpdateFromMap = async (lat: number, lng: number) => {
    try {
      // ใช้ reverse geocoding เพื่อได้ที่อยู่
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=th`
      );
      
      if (response.ok) {
        const data = await response.json();
        
        // จัดรูปแบบที่อยู่ภาษาไทย
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
        
        // อัพเดทที่อยู่และตำแหน่ง
        setProfile(prev => ({ ...prev, address: address || `${lat}, ${lng}` }));
        setLocation({ lat, lng });
        
        showSnackbar('อัพเดทตำแหน่งเรียบร้อย', 'success');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      showSnackbar('ไม่สามารถแปลงตำแหน่งเป็นที่อยู่ได้', 'error');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  // อัพโหลด Avatar
  const handleAvatarUpload = async (file: File) => {
    try {
      setUploadingAvatar(true);
      
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await fetch('/api/restaurant/upload/avatar', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setProfile(prev => ({ ...prev, avatarUrl: result.avatarUrl }));
        showSnackbar('อัพโหลด Avatar สำเร็จ!', 'success');
      } else {
        showSnackbar(result.error || 'ไม่สามารถอัพโหลด Avatar ได้', 'error');
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      showSnackbar('เกิดข้อผิดพลาดในการอัพโหลด Avatar', 'error');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // ลบ Avatar
  const handleAvatarDelete = async () => {
    try {
      setUploadingAvatar(true);
      
      const response = await fetch('/api/restaurant/upload/avatar', {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setProfile(prev => ({ ...prev, avatarUrl: '' }));
        showSnackbar('ลบ Avatar สำเร็จ!', 'success');
      } else {
        showSnackbar(result.error || 'ไม่สามารถลบ Avatar ได้', 'error');
      }
    } catch (error) {
      console.error('Avatar delete error:', error);
      showSnackbar('เกิดข้อผิดพลาดในการลบ Avatar', 'error');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // อัพโหลด Cover
  const handleCoverUpload = async (file: File) => {
    try {
      setUploadingCover(true);
      
      const formData = new FormData();
      formData.append('cover', file);
      
      const response = await fetch('/api/restaurant/upload/cover', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setProfile(prev => ({ ...prev, coverUrl: result.coverUrl }));
        showSnackbar('อัพโหลด Cover สำเร็จ!', 'success');
      } else {
        showSnackbar(result.error || 'ไม่สามารถอัพโหลด Cover ได้', 'error');
      }
    } catch (error) {
      console.error('Cover upload error:', error);
      showSnackbar('เกิดข้อผิดพลาดในการอัพโหลด Cover', 'error');
    } finally {
      setUploadingCover(false);
    }
  };

  // ลบ Cover
  const handleCoverDelete = async () => {
    try {
      setUploadingCover(true);
      
      const response = await fetch('/api/restaurant/upload/cover', {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setProfile(prev => ({ ...prev, coverUrl: '' }));
        showSnackbar('ลบ Cover สำเร็จ!', 'success');
      } else {
        showSnackbar(result.error || 'ไม่สามารถลบ Cover ได้', 'error');
      }
    } catch (error) {
      console.error('Cover delete error:', error);
      showSnackbar('เกิดข้อผิดพลาดในการลบ Cover', 'error');
    } finally {
      setUploadingCover(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return vristoTheme.success;
      case 'PENDING': return vristoTheme.warning;
      case 'REJECTED': return vristoTheme.danger;
      default: return vristoTheme.info;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'อนุมัติแล้ว';
      case 'PENDING': return 'รอการอนุมัติ';
      case 'REJECTED': return 'ถูกปฏิเสธ';
      default: return 'ไม่ทราบสถานะ';
    }
  };

  // ฟังก์ชันจัดการขอเปลี่ยนชื่อ
  const handleNameChangeRequest = async () => {
    if (!newRestaurantName.trim()) {
      showSnackbar('กรุณากรอกชื่อร้านอาหารใหม่', 'error');
      return;
    }

    try {
      setSubmittingNameChange(true);
      const response = await fetch('/api/restaurant/name-change', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newName: newRestaurantName.trim(),
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showSnackbar(result.message, 'success');
        setShowNameChangeDialog(false);
        setNewRestaurantName('');
        loadRestaurantProfile(); // รีโหลดข้อมูล
      } else {
        showSnackbar(result.error || 'เกิดข้อผิดพลาดในการขอเปลี่ยนชื่อ', 'error');
      }
    } catch (error) {
      console.error('Name change request error:', error);
      showSnackbar('เกิดข้อผิดพลาดในการขอเปลี่ยนชื่อ', 'error');
    } finally {
      setSubmittingNameChange(false);
    }
  };

  // ฟังก์ชันยกเลิกการขอเปลี่ยนชื่อ
  const handleCancelNameChange = async () => {
    try {
      setSubmittingNameChange(true);
      const response = await fetch('/api/restaurant/name-change', {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showSnackbar(result.message, 'success');
        loadRestaurantProfile(); // รีโหลดข้อมูล
      } else {
        showSnackbar(result.error || 'เกิดข้อผิดพลาดในการยกเลิก', 'error');
      }
    } catch (error) {
      console.error('Cancel name change error:', error);
      showSnackbar('เกิดข้อผิดพลาดในการยกเลิก', 'error');
    } finally {
      setSubmittingNameChange(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      loadRestaurantProfile();
    }
  }, [session]);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        fontFamily: vristoTheme.font.family,
      }}>
        <CircularProgress size={40} sx={{ color: vristoTheme.primary }} />
        <Typography variant="h6" sx={{ ml: 2, color: vristoTheme.text.primary }}>
          กำลังโหลดข้อมูล...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ fontFamily: vristoTheme.font.family, pb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 'bold', 
            color: vristoTheme.text.primary,
            fontFamily: vristoTheme.font.family,
            mb: 1,
          }}
        >
          ข้อมูลส่วนตัวร้านอาหาร
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: vristoTheme.text.secondary,
            fontFamily: vristoTheme.font.family,
            mb: 2,
          }}
        >
          จัดการข้อมูลพื้นฐานและที่ตั้งของร้านอาหารของคุณ
        </Typography>

        {/* สถานะร้าน */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Chip
            label={getStatusText(profile.status)}
            sx={{
              backgroundColor: getStatusColor(profile.status),
              color: '#ffffff',
              fontWeight: 'bold',
              fontSize: '0.85rem',
            }}
          />
          {profile.status === 'PENDING' && (
            <Typography variant="body2" sx={{ color: vristoTheme.text.secondary }}>
              เรากำลังตรวจสอบข้อมูลร้านของคุณ
            </Typography>
          )}
          {profile.status === 'REJECTED' && profile.rejectReason && (
            <Alert severity="error" sx={{ mt: 1 }}>
              <Typography variant="body2">
                <strong>เหตุผลที่ถูกปฏิเสธ:</strong> {profile.rejectReason}
              </Typography>
            </Alert>
          )}
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        gap: 4 
      }}>
        {/* ข้อมูลพื้นฐาน */}
        <Box sx={{ flex: { xs: 1, md: 2 } }}>
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: 3,
              boxShadow: vristoTheme.shadow.card,
              bgcolor: vristoTheme.background.paper,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: vristoTheme.text.primary,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Business sx={{ mr: 1, color: vristoTheme.primary }} />
                  ข้อมูลร้านอาหาร
                </Typography>
                <Button
                  variant={editMode ? "outlined" : "contained"}
                  onClick={() => setEditMode(!editMode)}
                  startIcon={<Edit />}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: editMode ? 'transparent' : vristoTheme.primary,
                    borderColor: vristoTheme.primary,
                    color: editMode ? vristoTheme.primary : '#ffffff',
                  }}
                >
                  {editMode ? 'ยกเลิก' : 'แก้ไข'}
                </Button>
              </Box>

              {/* ฟอร์มข้อมูล */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* ชื่อร้าน */}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: vristoTheme.text.primary }}>
                      ชื่อร้านอาหาร *
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setNewRestaurantName(profile.name);
                        setShowNameChangeDialog(true);
                      }}
                      startIcon={<Edit />}
                      sx={{
                        borderRadius: 2,
                        fontSize: '0.75rem',
                        px: 2,
                        py: 0.5,
                        borderColor: vristoTheme.primary,
                        color: vristoTheme.primary,
                      }}
                    >
                      แก้ไขชื่อ
                    </Button>
                  </Box>
                  
                  <StyledTextField
                    fullWidth
                    value={profile.name}
                    disabled
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Store sx={{ color: vristoTheme.primary }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  {/* แสดงสถานะการขอเปลี่ยนชื่อ */}
                  {profile.pendingName && (
                    <Alert 
                      severity="info" 
                      sx={{ mt: 1 }}
                      action={
                        <Button
                          color="inherit"
                          size="small"
                          onClick={handleCancelNameChange}
                          disabled={submittingNameChange}
                        >
                          ยกเลิก
                        </Button>
                      }
                    >
                      <Typography variant="body2">
                        <strong>คำขอเปลี่ยนชื่อเป็น:</strong> "{profile.pendingName}"
                        <br />
                        กำลังรอการอนุมัติจากผู้ดูแลระบบ
                        {profile.nameChangeRequestedAt && (
                          <><br />
                          <small>ส่งคำขอเมื่อ: {formatThaiDateTime(profile.nameChangeRequestedAt)}</small></>
                        )}
                      </Typography>
                    </Alert>
                  )}
                  
                  {profile.nameApprovedAt && (
                    <Alert severity="success" sx={{ mt: 1 }}>
                      <Typography variant="body2">
                        <strong>การเปลี่ยนชื่อร้านได้รับการอนุมัติแล้ว</strong>
                        <br />
                        <small>อนุมัติเมื่อ: {formatThaiDateTime(profile.nameApprovedAt)}</small>
                      </Typography>
                    </Alert>
                  )}
                  
                  {profile.nameRejectedAt && profile.nameRejectReason && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      <Typography variant="body2">
                        <strong>คำขอเปลี่ยนชื่อถูกปฏิเสธ:</strong> {profile.nameRejectReason}
                        <br />
                        <small>ปฏิเสธเมื่อ: {formatThaiDateTime(profile.nameRejectedAt)}</small>
                      </Typography>
                    </Alert>
                  )}
                </Box>

                {/* คำอธิบายร้าน */}
                <Box>
                  <StyledTextField
                    fullWidth
                    label="คำอธิบายร้าน"
                    value={profile.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    disabled={!editMode}
                    variant="outlined"
                    multiline
                    rows={3}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                          <Description sx={{ color: vristoTheme.primary }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                {/* เบอร์โทรศัพท์และอีเมล */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <StyledTextField
                      fullWidth
                      label="เบอร์โทรศัพท์ *"
                      value={profile.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!editMode}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone sx={{ color: vristoTheme.primary }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <StyledTextField
                      fullWidth
                      label="อีเมล"
                      value={profile.email}
                      disabled={true}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: vristoTheme.primary }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Box>

                {/* เวลาเปิด-ปิด */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <StyledTextField
                      fullWidth
                      label="เวลาเปิด"
                      type="time"
                      value={profile.openTime}
                      onChange={(e) => handleInputChange('openTime', e.target.value)}
                      disabled={!editMode}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccessTime sx={{ color: vristoTheme.primary }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <StyledTextField
                      fullWidth
                      label="เวลาปิด"
                      type="time"
                      value={profile.closeTime}
                      onChange={(e) => handleInputChange('closeTime', e.target.value)}
                      disabled={!editMode}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccessTime sx={{ color: vristoTheme.primary }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Box>

                {/* ที่อยู่ */}
                <Box>
                  <StyledTextField
                    fullWidth
                    label="ที่อยู่ร้าน *"
                    value={profile.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!editMode}
                    variant="outlined"
                    multiline
                    rows={2}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                          <LocationOn sx={{ color: vristoTheme.primary }} />
                        </InputAdornment>
                      ),
                      endAdornment: editMode && (
                        <InputAdornment position="end" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                          <IconButton
                            onClick={handleGetCurrentLocation}
                            disabled={isGettingLocation}
                            size="small"
                            sx={{ color: vristoTheme.secondary }}
                          >
                            {isGettingLocation ? (
                              <CircularProgress size={20} />
                            ) : (
                              <MyLocation />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                {/* ปุ่มบันทึก */}
                {editMode && (
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      onClick={() => setEditMode(false)}
                      sx={{
                        borderRadius: 2,
                        borderColor: vristoTheme.text.secondary,
                        color: vristoTheme.text.secondary,
                      }}
                    >
                      ยกเลิก
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleSave}
                      disabled={saving}
                      startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                      sx={{
                        borderRadius: 2,
                        backgroundColor: vristoTheme.success,
                        '&:hover': {
                          backgroundColor: vristoTheme.success,
                        },
                      }}
                    >
                      {saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                    </Button>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* รูปโปรไฟล์ร้าน */}
        <Box sx={{ flex: { xs: 1, md: 1 } }}>
          <Stack spacing={3}>
            {/* Cover Image */}
            <Card 
              elevation={0}
              sx={{ 
                borderRadius: 3,
                boxShadow: vristoTheme.shadow.card,
                bgcolor: vristoTheme.background.paper,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  height: 200,
                  backgroundImage: profile.coverUrl 
                    ? `url(${profile.coverUrl})` 
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {!profile.coverUrl && (
                  <Image sx={{ fontSize: 48, color: 'rgba(255,255,255,0.5)' }} />
                )}
                
                {editMode && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      display: 'flex',
                      gap: 1,
                    }}
                  >
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="cover-upload"
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleCoverUpload(file);
                      }}
                    />
                    <label htmlFor="cover-upload">
                      <IconButton
                        component="span"
                        disabled={uploadingCover}
                        sx={{
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          color: '#ffffff',
                          '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.7)',
                          },
                        }}
                        size="small"
                      >
                        {uploadingCover ? (
                          <CircularProgress size={20} sx={{ color: '#ffffff' }} />
                        ) : (
                          <PhotoCamera />
                        )}
                      </IconButton>
                    </label>
                    
                    {profile.coverUrl && (
                      <IconButton
                        onClick={handleCoverDelete}
                        disabled={uploadingCover}
                        sx={{
                          backgroundColor: 'rgba(255,0,0,0.5)',
                          color: '#ffffff',
                          '&:hover': {
                            backgroundColor: 'rgba(255,0,0,0.7)',
                          },
                        }}
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    )}
                  </Box>
                )}
              </Box>
            </Card>

            {/* Avatar และข้อมูลร้าน */}
            <Card 
              elevation={0}
              sx={{ 
                borderRadius: 3,
                boxShadow: vristoTheme.shadow.card,
                bgcolor: vristoTheme.background.paper,
              }}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: vristoTheme.text.primary,
                    mb: 3,
                  }}
                >
                  รูปโปรไฟล์ร้าน
                </Typography>
                
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <ProfileAvatar
                    alt={profile.name}
                    src={profile.avatarUrl || undefined}
                  >
                    {!profile.avatarUrl && (
                      <Store sx={{ fontSize: 48, color: vristoTheme.text.secondary }} />
                    )}
                  </ProfileAvatar>
                  
                  {editMode && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        display: 'flex',
                        gap: 0.5,
                      }}
                    >
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="avatar-upload"
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleAvatarUpload(file);
                        }}
                      />
                      <label htmlFor="avatar-upload">
                        <IconButton
                          component="span"
                          disabled={uploadingAvatar}
                          sx={{
                            backgroundColor: vristoTheme.primary,
                            color: '#ffffff',
                            '&:hover': {
                              backgroundColor: vristoTheme.primary,
                            },
                          }}
                          size="small"
                        >
                          {uploadingAvatar ? (
                            <CircularProgress size={16} sx={{ color: '#ffffff' }} />
                          ) : (
                            <PhotoCamera />
                          )}
                        </IconButton>
                      </label>
                      
                      {profile.avatarUrl && (
                        <IconButton
                          onClick={handleAvatarDelete}
                          disabled={uploadingAvatar}
                          sx={{
                            backgroundColor: vristoTheme.danger,
                            color: '#ffffff',
                            '&:hover': {
                              backgroundColor: vristoTheme.danger,
                            },
                          }}
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      )}
                    </Box>
                  )}
                </Box>
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mt: 2,
                    fontWeight: 'bold',
                    color: vristoTheme.text.primary,
                  }}
                >
                  {profile.name || 'ชื่อร้านอาหาร'}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: vristoTheme.text.secondary,
                    mt: 1,
                  }}
                >
                  {profile.description || 'ไม่มีคำอธิบาย'}
                </Typography>
              </CardContent>
            </Card>

            {/* แสดงตำแหน่งโดยไม่ใช้แผนที่ */}
            {location && (
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  boxShadow: vristoTheme.shadow.card,
                  bgcolor: vristoTheme.background.paper,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: vristoTheme.text.primary,
                      mb: 2,
                    }}
                  >
                    ตำแหน่งร้าน
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: vristoTheme.text.secondary,
                      fontSize: '0.85rem',
                    }}
                  >
                    📍 {profile.address}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mt: 1,
                      color: vristoTheme.text.secondary,
                      fontSize: '0.8rem',
                    }}
                  >
                    พิกัด: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Stack>
        </Box>
      </Box>

      {/* MiniMap Dialog */}
      <Dialog 
        open={showMap} 
        onClose={() => setShowMap(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 'bold',
              color: vristoTheme.text.primary,
              fontFamily: vristoTheme.font.family,
            }}
          >
            ตำแหน่งร้านอาหาร
          </Typography>
        </DialogTitle>
        <DialogContent>
          {location && (
            <Box sx={{ height: 400, width: '100%' }}>
              <MiniMap
                latitude={location.lat}
                longitude={location.lng}
                onLocationUpdate={handleLocationUpdateFromMap}
                showCoordinates={true}
                showRefresh={true}
                height={400}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowMap(false)}
            sx={{
              color: vristoTheme.text.secondary,
              fontFamily: vristoTheme.font.family,
            }}
          >
            ปิด
          </Button>
          <Button 
            onClick={() => setShowMap(false)}
            variant="contained"
            sx={{
              backgroundColor: vristoTheme.primary,
              fontFamily: vristoTheme.font.family,
            }}
          >
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>

      {/* Name Change Dialog */}
      <Dialog 
        open={showNameChangeDialog} 
        onClose={() => setShowNameChangeDialog(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 'bold',
              color: vristoTheme.text.primary,
              fontFamily: vristoTheme.font.family,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Edit sx={{ mr: 1, color: vristoTheme.primary }} />
            ขอเปลี่ยนชื่อร้านอาหาร
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: vristoTheme.text.secondary,
                mb: 3,
                fontFamily: vristoTheme.font.family,
              }}
            >
              กรุณากรอกชื่อร้านอาหารใหม่ที่คุณต้องการ ระบบจะส่งคำขอไปยังผู้ดูแลระบบเพื่อพิจารณาอนุมัติ
            </Typography>
            
            <StyledTextField
              fullWidth
              label="ชื่อร้านอาหารใหม่ *"
              value={newRestaurantName}
              onChange={(e) => setNewRestaurantName(e.target.value)}
              variant="outlined"
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Store sx={{ color: vristoTheme.primary }} />
                  </InputAdornment>
                ),
              }}
            />
            
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>หมายเหตุ:</strong> ระหว่างที่รอการอนุมัติ ชื่อร้านเดิมจะยังคงแสดงอยู่ และสถานะร้านอาหารจะไม่เปลี่ยนแปลง
              </Typography>
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => {
              setShowNameChangeDialog(false);
              setNewRestaurantName('');
            }}
            disabled={submittingNameChange}
            sx={{
              color: vristoTheme.text.secondary,
              fontFamily: vristoTheme.font.family,
            }}
          >
            ยกเลิก
          </Button>
          <Button 
            onClick={handleNameChangeRequest}
            variant="contained"
            disabled={submittingNameChange || !newRestaurantName.trim()}
            sx={{
              backgroundColor: vristoTheme.primary,
              fontFamily: vristoTheme.font.family,
              minWidth: 120,
            }}
          >
            {submittingNameChange ? (
              <CircularProgress size={20} sx={{ color: '#ffffff' }} />
            ) : (
              'ส่งคำขอ'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
