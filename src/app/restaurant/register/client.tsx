'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  alpha,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  ArrowBack,
  Store,
  LocationOn,
  Phone,
  MyLocation,
  Description,
  AccessTime,
  AttachFile,
  Delete,
  CloudUpload,
  InsertDriveFile,
  PictureAsPdf,
  Visibility,
  GetApp,
} from '@mui/icons-material';
import AppHeader from '@/components/AppHeader';
import MiniMap from '@/components/MiniMap';
import { useSnackbar } from '@/contexts/SnackbarContext';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  createdAt?: string;
  file?: File;
}

export default function RegisterRestaurantClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEdit = searchParams.get('edit') === 'true';
  const { data: session, status, update: updateSession } = useSession();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    openTime: '09:00',
    closeTime: '21:00',
  });
  
  const [location, setLocation] = useState<{lat: number; lng: number} | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [justUpdated, setJustUpdated] = useState(false); // แสดงสถานะที่เพิ่งอัพเดท

  // โหลดข้อมูลเดิมถ้าเป็นการแก้ไข
  useEffect(() => {
    if (isEdit && session?.user) {
      loadExistingData();
    }
  }, [isEdit, session]);

  const loadExistingData = async () => {
    try {
      setLoadingData(true);
      
      // โหลดข้อมูลร้านอาหาร
      const restaurantResponse = await fetch('/api/restaurant/register');
      const restaurantResult = await restaurantResponse.json();

      if (restaurantResponse.ok && restaurantResult.success) {
        const restaurant = restaurantResult.restaurant;
        setFormData({
          name: restaurant.name || '',
          description: restaurant.description || '',
          address: restaurant.address || '',
          phone: restaurant.phone || '',
          openTime: restaurant.openTime || '09:00',
          closeTime: restaurant.closeTime || '21:00',
        });

        if (restaurant.latitude && restaurant.longitude) {
          setLocation({
            lat: restaurant.latitude,
            lng: restaurant.longitude,
          });
        }
      } else {
        showSnackbar(restaurantResult.error || 'ไม่สามารถโหลดข้อมูลได้', 'error');
        return;
      }

      // โหลดไฟล์เอกสาร
      const filesResponse = await fetch('/api/restaurant/upload');
      const filesResult = await filesResponse.json();

      if (filesResponse.ok && filesResult.success) {
        setUploadedFiles(filesResult.files || []);
      }

    } catch (error) {
      console.error('Error loading restaurant data:', error);
      showSnackbar('เกิดข้อผิดพลาดในการโหลดข้อมูล', 'error');
    } finally {
      setLoadingData(false);
    }
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // ตรวจสอบไฟล์ก่อนเพิ่มเข้า state
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // ตรวจสอบขนาดไฟล์ (ไม่เกิน 15MB)
      if (file.size > 15 * 1024 * 1024) {
        invalidFiles.push(`${file.name} (ขนาดใหญ่เกินไป)`);
        continue;
      }

      // ตรวจสอบประเภทไฟล์
      const allowedTypes = [
        'image/jpeg', 
        'image/png', 
        'image/jpg', 
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        // เพิ่ม MIME types ที่อาจเกิดขึ้น
        'application/excel',
        'application/x-excel',
        'application/x-msexcel',
        'application/vnd.ms-office'
      ];
      
      // ตรวจสอบจากนามสกุลไฟล์เป็นทางเลือก
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'xls', 'xlsx'];
      
      const isValidType = allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension || '');
      
      if (!isValidType) {
        invalidFiles.push(`${file.name} (ประเภทไฟล์ไม่รองรับ)`);
        continue;
      }

      validFiles.push(file);
    }

    // แสดง error เฉพาะเมื่อมีไฟล์ที่ไม่ถูกต้อง
    if (invalidFiles.length > 0) {
      showSnackbar(`ไฟล์ที่ไม่สามารถใช้ได้: ${invalidFiles.join(', ')}`, 'error');
    }

    if (validFiles.length === 0) {
      return;
    }

    // เพิ่มไฟล์เข้า state สำหรับแสดงผล (ไม่อัพโหลดทันที)
    const newFiles: UploadedFile[] = validFiles.map((file, i) => ({
      id: Date.now().toString() + i,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      file: file,
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    // เก็บไฟล์ไว้สำหรับอัพโหลดตอนบันทึก (ทั้งโหมดใหม่และแก้ไข)
    setSelectedFiles(prev => [...prev, ...validFiles]);

    // รีเซ็ต input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = async (fileId: string) => {
    const fileToRemove = uploadedFiles.find(f => f.id === fileId);
    if (!fileToRemove) return;

    // ถ้าเป็นไฟล์ที่อัพโหลดแล้ว (มี URL ที่ขึ้นต้นด้วย /uploads) ให้ลบจากเซิร์ฟเวอร์
    if (isEdit && fileToRemove.url?.startsWith('/uploads')) {
      try {
        const response = await fetch(`/api/restaurant/upload?id=${fileId}`, {
          method: 'DELETE',
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          showSnackbar('ไม่สามารถลบไฟล์ได้', 'error');
          return; // ไม่ลบจาก state ถ้าลบจากเซิร์ฟเวอร์ไม่สำเร็จ
        }
      } catch (error) {
        console.error('Error deleting file:', error);
        showSnackbar('เกิดข้อผิดพลาดในการลบไฟล์', 'error');
        return;
      }
    } else {
      // ถ้าเป็นไฟล์ที่ยังไม่ได้อัพโหลด ให้ revoke URL และลบจาก selectedFiles
      if (fileToRemove.url && !fileToRemove.url.startsWith('/uploads')) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      
      // ลบจาก selectedFiles ด้วย
      if (fileToRemove.file) {
        setSelectedFiles(prev => prev.filter(f => f !== fileToRemove.file));
      }
    }

    // ลบจาก state
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handlePreviewFile = (file: UploadedFile) => {
    if (file.url) {
      window.open(file.url, '_blank');
    }
  };

  const handleDownloadFile = (file: UploadedFile) => {
    if (file.url) {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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
            
          } catch (error: any) {
            console.error('Geocoding error:', error);
            // Fallback to coordinates
            const { latitude, longitude } = position.coords;
            setFormData(prev => ({ ...prev, address: `${latitude}, ${longitude}` }));
            setLocation({ lat: latitude, lng: longitude });
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
          maximumAge: 60000
        }
      );
    } else {
      showSnackbar('เบราว์เซอร์ไม่รองรับการระบุตำแหน่ง', 'error');
      setIsGettingLocation(false);
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
      showSnackbar('กรุณากรอกชื่อร้าน', 'error');
      return;
    }
    
    if (!formData.address.trim()) {
      showSnackbar('กรุณากรอกที่อยู่ร้าน', 'error');
      return;
    }
    
    if (!formData.phone.trim()) {
      showSnackbar('กรุณากรอกเบอร์โทรศัพท์', 'error');
      return;
    }

    setLoading(true);
    
    try {
      // สร้าง FormData สำหรับส่งข้อมูลและไฟล์
      const submitFormData = new FormData();
      
      // เพิ่มข้อมูลร้านอาหาร
      submitFormData.append('name', formData.name);
      submitFormData.append('description', formData.description);
      submitFormData.append('address', formData.address);
      submitFormData.append('phone', formData.phone);
      submitFormData.append('openTime', formData.openTime);
      submitFormData.append('closeTime', formData.closeTime);
      
      if (location?.lat && location?.lng) {
        submitFormData.append('latitude', location.lat.toString());
        submitFormData.append('longitude', location.lng.toString());
      }
      
      // เพิ่มไฟล์ใหม่ที่เลือก (ทั้งโหมดใหม่และแก้ไข)
      if (selectedFiles.length > 0) {
        selectedFiles.forEach(file => {
          submitFormData.append('files', file);
        });
      }

      const method = isEdit ? 'PUT' : 'POST';
      const response = await fetch('/api/restaurant/register', {
        method,
        body: submitFormData, // ใช้ FormData แทน JSON
      });

      const result = await response.json();

      if (response.ok) {
        // รีเซ็ต selectedFiles หลังจากบันทึกสำเร็จ
        setSelectedFiles([]);
        
        // ถ้าเป็นการแก้ไข ให้อัพเดทข้อมูลทันทีจาก response
        if (isEdit && result.restaurant) {
          // อัพเดท formData ด้วยข้อมูลใหม่จาก response
          setFormData({
            name: result.restaurant.name || '',
            description: result.restaurant.description || '',
            address: result.restaurant.address || '',
            phone: result.restaurant.phone || '',
            openTime: result.restaurant.openTime || '09:00',
            closeTime: result.restaurant.closeTime || '21:00',
          });
          
          // อัพเดท location ถ้ามี
          if (result.restaurant.latitude && result.restaurant.longitude) {
            setLocation({
              lat: result.restaurant.latitude,
              lng: result.restaurant.longitude,
            });
          }
          
          // อัพเดทรายการไฟล์ทั้งหมดจาก response
          if (result.files) {
            setUploadedFiles(result.files);
          }
          
          // แสดงสถานะที่เพิ่งอัพเดท
          setJustUpdated(true);
          
          // เด้งไปด้านบนสุดและแสดง snackbar
          setTimeout(() => {
            console.log('🚀 Attempting to scroll to top...');
            
            // ลองหลายวิธีเพื่อให้แน่ใจว่า scroll ทำงาน
            if (topRef.current) {
              console.log('📍 Scrolling via topRef');
              topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            
            console.log('🌐 Scrolling via window');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
            
            console.log('✅ Scroll commands executed');
            showSnackbar('บันทึกสำเร็จ', 'success');
          }, 200); // เพิ่มเวลาให้มากขึ้น
          
          // ซ่อนสถานะอัพเดทหลังจาก 3 วินาที
          setTimeout(() => {
            setJustUpdated(false);
          }, 3000);
        } else {
          // สำหรับการสมัครใหม่ ให้แสดงข้อความและ refresh session
          showSnackbar('สมัครสำเร็จ', 'success');
          
          await updateSession();
          
          setTimeout(() => {
            router.push('/restaurant/pending');
          }, 2000);
        }
      } else {
        showSnackbar(result.error || (isEdit ? 'ไม่สามารถอัพเดทได้' : 'ไม่สามารถสมัครได้'), 'error');
      }
    } catch (error) {
      showSnackbar('เกิดข้อผิดพลาด', 'error');
    } finally {
      setLoading(false);
    }
  };



  // รอให้ session loading เสร็จก่อน
  if (status === 'loading') {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#FAFAFA',
      }}>
        <CircularProgress sx={{ color: '#F8A66E' }} size={40} />
      </Box>
    );
  }

  if (!session) {
    router.push('/auth/login');
    return null;
  }

  if (loadingData) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#FAFAFA',
      }}>
        <CircularProgress sx={{ color: '#F8A66E' }} size={40} />
      </Box>
    );
  }

  return (
    <Box 
      ref={topRef}
      sx={{ 
        backgroundColor: '#FFFFFF',
        minHeight: '100vh',
        paddingBottom: '20px', // ลดลงเพราะ Snackbar ย้ายไปด้านบนแล้ว
        fontFamily: 'Prompt, sans-serif',
      }}
    >
      <AppHeader />
      
      <Container maxWidth="sm" sx={{ py: 2, px: 2 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: 'Prompt, sans-serif',
                fontWeight: 600,
                color: '#1A1A1A',
              }}
            >
              {isEdit ? 'แก้ไขข้อมูลร้านอาหาร' : 'สมัครเปิดร้านอาหาร'}
            </Typography>
            {justUpdated && (
              <Chip
                label="อัพเดทแล้ว"
                size="small"
                sx={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  fontFamily: 'Prompt, sans-serif',
                  fontSize: '0.75rem',
                  animation: 'pulse 1s ease-in-out infinite alternate',
                  '@keyframes pulse': {
                    '0%': { opacity: 0.7 },
                    '100%': { opacity: 1 },
                  },
                }}
              />
            )}
          </Box>
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

                {/* การแนบไฟล์ */}
                <Box>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      fontFamily: 'Prompt, sans-serif',
                      fontWeight: 600,
                      color: '#1A1A1A',
                      mb: 2,
                    }}
                  >
                    เอกสารประกอบการสมัคร {uploadedFiles.length > 0 && `(${uploadedFiles.length} ไฟล์)`}
                    
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'Prompt, sans-serif',
                      color: '#666',
                      marginBottom: 2,
                    }}
                  >
                    
                    <p>1. สำเนาบัตรประชาชน </p>
                    <p>2. สำเนาสมุดบัญชีธนาคาร (ชื่อเจ้าของต้องตรงกับชื่อผู้สมัคร)</p>
                  </Typography>
                  
                  <Button
                    variant="outlined"
                    startIcon={uploadingFiles ? <CircularProgress size={16} /> : <CloudUpload />}
                    onClick={handleFileSelect}
                    disabled={uploadingFiles}
                    sx={{
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
                    {uploadingFiles ? 'กำลังอัพโหลด...' : 'เลือกไฟล์'}
                  </Button>
                  
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      display: 'block',
                      mt: 1,
                      color: '#666',
                      fontFamily: 'Prompt, sans-serif',
                    }}
                  >
                    รองรับไฟล์: JPG, PNG, PDF, DOC, DOCX, XLS, XLSX (ไม่เกิน 15MB ต่อไฟล์)
                  </Typography>

                  {/* สรุปเอกสารที่อัพโหลด */}
                  {uploadedFiles.length > 0 && (
                    <Box sx={{ 
                      mt: 2, 
                      mb: 2,
                      p: 2,
                      bgcolor: alpha('#2196F3', 0.05),
                      border: `1px solid ${alpha('#2196F3', 0.2)}`,
                      borderRadius: 2
                    }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, fontFamily: 'Prompt, sans-serif' }}>
                        เอกสารที่แนบแล้ว:
                      </Typography>
                      <Box component="ul" sx={{ m: 0, pl: 2 }}>
                        {uploadedFiles.map((file, index) => (
                          <Typography 
                            key={file.id}
                            component="li" 
                            variant="body2" 
                            sx={{ mb: 0.5, fontFamily: 'Prompt, sans-serif' }}
                          >
                            {file.name} ({formatFileSize(file.size)})
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  )}

                  {/* รายการไฟล์ที่อัพโหลด */}
                  {uploadedFiles.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: 'Prompt, sans-serif',
                          fontWeight: 600,
                          color: '#1A1A1A',
                          mb: 1,
                        }}
                      >
                        จัดการไฟล์ ({uploadedFiles.length})
                      </Typography>
                      <List dense>
                        {uploadedFiles.map((file) => {
                          const isImage = file.type.startsWith('image/');
                          const isPdf = file.type === 'application/pdf';
                          const isWord = file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                          const isExcel = file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                          
                          return (
                            <ListItem 
                              key={file.id}
                              sx={{
                                bgcolor: alpha('#F8A66E', 0.05),
                                borderRadius: 2,
                                mb: 1,
                                border: `1px solid ${alpha('#F8A66E', 0.2)}`,
                                alignItems: 'flex-start',
                                py: 1.5,
                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
                                <ListItemIcon sx={{ minWidth: 60, mt: 0.5 }}>
                                  {isImage ? (
                                    <Box
                                      component="img"
                                      src={file.url}
                                      alt={file.name}
                                      sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 1,
                                        objectFit: 'cover',
                                        border: `2px solid ${alpha('#F8A66E', 0.3)}`,
                                      }}
                                    />
                                  ) : isPdf ? (
                                    <PictureAsPdf sx={{ color: '#F35C76', fontSize: 32 }} />
                                  ) : isWord ? (
                                    <Box
                                      sx={{
                                        width: 48,
                                        height: 48,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: '#2B579A',
                                        borderRadius: 1,
                                        color: 'white',
                                        fontSize: '10px',
                                        fontWeight: 'bold',
                                      }}
                                    >
                                      DOC
                                    </Box>
                                  ) : isExcel ? (
                                    <Box
                                      sx={{
                                        width: 48,
                                        height: 48,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: '#217346',
                                        borderRadius: 1,
                                        color: 'white',
                                        fontSize: '10px',
                                        fontWeight: 'bold',
                                      }}
                                    >
                                      XLS
                                    </Box>
                                  ) : (
                                    <InsertDriveFile sx={{ color: '#F8A66E', fontSize: 32 }} />
                                  )}
                                </ListItemIcon>
                                <ListItemText
                                  primary={
                                    <Typography 
                                      variant="body2" 
                                      sx={{ 
                                        fontFamily: 'Prompt, sans-serif',
                                        fontWeight: 500,
                                      }}
                                    >
                                      {file.name}
                                    </Typography>
                                  }
                                  secondary={
                                    <Stack direction="column" spacing={0.5}>
                                      <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography 
                                          variant="caption" 
                                          sx={{ 
                                            fontFamily: 'Prompt, sans-serif',
                                            color: '#666',
                                          }}
                                        >
                                          {formatFileSize(file.size)}
                                        </Typography>
                                        {file.createdAt && (
                                          <Typography 
                                            variant="caption" 
                                            sx={{ 
                                              fontFamily: 'Prompt, sans-serif',
                                              color: '#999',
                                            }}
                                          >
                                            • {new Date(file.createdAt).toLocaleDateString('th-TH')}
                                          </Typography>
                                        )}
                                      </Stack>
                                      <Stack direction="row" spacing={1} alignItems="center">
                                        {isImage && (
                                          <Chip
                                            label="รูปภาพ"
                                            size="small"
                                            sx={{
                                              height: 20,
                                              fontSize: '0.7rem',
                                              bgcolor: alpha('#4CAF50', 0.1),
                                              color: '#4CAF50',
                                              fontFamily: 'Prompt, sans-serif',
                                            }}
                                          />
                                        )}
                                        {isPdf && (
                                          <Chip
                                            label="PDF"
                                            size="small"
                                            sx={{
                                              height: 20,
                                              fontSize: '0.7rem',
                                              bgcolor: alpha('#F35C76', 0.1),
                                              color: '#F35C76',
                                              fontFamily: 'Prompt, sans-serif',
                                            }}
                                          />
                                        )}
                                        {isWord && (
                                          <Chip
                                            label="DOC"
                                            size="small"
                                            sx={{
                                              height: 20,
                                              fontSize: '0.7rem',
                                              bgcolor: alpha('#2B579A', 0.1),
                                              color: '#2B579A',
                                              fontFamily: 'Prompt, sans-serif',
                                            }}
                                          />
                                        )}
                                        {isExcel && (
                                          <Chip
                                            label="XLS"
                                            size="small"
                                            sx={{
                                              height: 20,
                                              fontSize: '0.7rem',
                                              bgcolor: alpha('#217346', 0.1),
                                              color: '#217346',
                                              fontFamily: 'Prompt, sans-serif',
                                            }}
                                          />
                                        )}
                                      </Stack>
                                    </Stack>
                                  }
                                />
                              </Box>
                              <Stack direction="row" spacing={0.5} sx={{ ml: 1 }}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDownloadFile(file)}
                                  sx={{ 
                                    color: '#4CAF50',
                                    '&:hover': { bgcolor: alpha('#4CAF50', 0.1) }
                                  }}
                                  title="ดาวน์โหลด"
                                >
                                  <GetApp fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleRemoveFile(file.id)}
                                  sx={{ 
                                    color: '#F35C76',
                                    '&:hover': { bgcolor: alpha('#F35C76', 0.1) }
                                  }}
                                  title="ลบไฟล์"
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Stack>
                            </ListItem>
                          );
                        })}
                      </List>
                    </Box>
                  )}
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
                    isEdit ? 'อัพเดทข้อมูลร้าน' : 'สมัครเปิดร้านอาหาร'
                  )}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/jpg,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        multiple
        style={{ display: 'none' }}
      />


    </Box>
  );
} 