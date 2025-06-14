'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
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
import { styled } from '@mui/material/styles';
import AppLayout from '@/components/AppLayout';
import MiniMap from '@/components/MiniMap';
import { useSnackbar } from '@/contexts/SnackbarContext';
import FileDropzone from '@/components/FileDropzone';

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

const StyledTextField = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: theme.background,
    fontSize: '1rem',
    fontFamily: 'Prompt, sans-serif',
    position: 'relative',
    overflow: 'hidden',
    '@media (max-width: 768px)': {
      fontSize: '16px !important',
      transition: 'none !important',
      transform: 'none !important',
      willChange: 'auto',
      backfaceVisibility: 'hidden',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#E0E0E0',
      borderWidth: '1px',
      transition: 'border-color 0.2s ease',
      '@media (max-width: 768px)': {
        transition: 'none !important',
      },
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.accent,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.accent,
      borderWidth: '2px',
    },
    '&.Mui-focused': {
      backgroundColor: theme.background,
      transform: 'none !important',
      '@media (max-width: 768px)': {
        transform: 'none !important',
        transition: 'none !important',
      },
    },
  },
  '& .MuiInputLabel-root': {
    fontFamily: 'Prompt, sans-serif',
    color: '#666',
    fontSize: '1rem',
    transform: 'translate(14px, 16px) scale(1)',
    transition: 'all 0.2s ease',
    '@media (max-width: 768px)': {
      fontSize: '16px !important',
      transition: 'none !important',
      transform: 'translate(14px, 16px) scale(1) !important',
      willChange: 'auto',
    },
    '&.MuiInputLabel-shrink': {
      transform: 'translate(14px, -9px) scale(0.75)',
      backgroundColor: theme.background,
      padding: '0 8px',
      '@media (max-width: 768px)': {
        transform: 'translate(14px, -9px) scale(0.75) !important',
        transition: 'none !important',
        
      },
    },
    '&.Mui-focused': {
      color: theme.accent,
      '@media (max-width: 768px)': {
        transition: 'none !important',
      },
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '16px 14px',
    fontFamily: 'Prompt, sans-serif',
    '@media (max-width: 768px)': {
      fontSize: '16px !important',
      transition: 'none !important',
      transform: 'none !important',
      willChange: 'auto',
      '-webkit-appearance': 'none',
      '-webkit-tap-highlight-color': 'transparent',
    },
    '&:focus': {
      outline: 'none !important',
      backgroundColor: 'transparent !important',
      transform: 'none !important',
      '@media (max-width: 768px)': {
        fontSize: '16px !important',
        zoom: '1 !important',
      },
    },
  },
  // สำหรับ multiline TextField
  '& .MuiOutlinedInput-inputMultiline': {
    padding: '16px 14px',
    fontFamily: 'Prompt, sans-serif',
    '@media (max-width: 768px)': {
      fontSize: '16px !important',
      transition: 'none !important',
      transform: 'none !important',
      willChange: 'auto',
      '-webkit-appearance': 'none',
      '-webkit-tap-highlight-color': 'transparent',
    },
  },
}));

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
  const isEdit = searchParams?.get('edit') === 'true';
  const { data: session, status, update: updateSession } = useSession();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [justUpdated, setJustUpdated] = useState(false);
  
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

  // โหลดข้อมูลเดิมถ้าเป็นการแก้ไข
  useEffect(() => {
    if (isEdit && session?.user) {
      loadExistingData();
    }
  }, [isEdit, session]);

  // ป้องกันการกระพริบเมื่อ keyboard ขึ้นมาใน mobile
  useEffect(() => {
    // ตรวจสอบว่าเป็น mobile หรือไม่
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (!isMobile) return;

    // เก็บค่า viewport เดิม
    const originalViewportHeight = window.innerHeight;
    const originalBodyHeight = document.body.style.height;
    const originalHtmlHeight = document.documentElement.style.height;
    
    // ตั้งค่า viewport meta tag เพื่อป้องกัน zoom
    const viewport = document.querySelector('meta[name=viewport]') as HTMLMetaElement;
    const originalViewportContent = viewport?.content || '';
    
    if (viewport) {
      viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
    }

    const handleFocus = (e: FocusEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        // ป้องกันการ scroll และ zoom
        e.target.scrollIntoView = () => {}; // ปิด scrollIntoView
        
        // ป้องกัน iOS Safari zoom
        if (isIOS && viewport) {
          viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
        }
        
        setTimeout(() => {
          window.scrollTo(0, 0);
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
        }, 50);
      }
    };

    const handleBlur = () => {
      // รีเซ็ต viewport เมื่อ blur
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }, 100);
    };

    // เพิ่ม event listeners
    document.addEventListener('focusin', handleFocus, { passive: false });
    document.addEventListener('focusout', handleBlur, { passive: false });

    return () => {
      // รีเซ็ต viewport
      if (viewport && originalViewportContent) {
        viewport.content = originalViewportContent;
      }
      
      // ลบ event listeners
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
    };
  }, []);

  // Cleanup object URLs เมื่อ component unmount
  useEffect(() => {
    return () => {
      // ล้าง object URLs ทั้งหมดเมื่อ component unmount
      uploadedFiles.forEach(file => {
        if (file.url && !file.url.startsWith('/uploads') && file.file) {
          try {
            URL.revokeObjectURL(file.url);
          } catch (error) {
            console.error('Error revoking object URL:', error);
          }
        }
      });
    };
  }, [uploadedFiles]);

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

  const handleFileChange = (newFiles: File[]) => {
    // ตรวจสอบไฟล์ก่อนเพิ่มเข้า state
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];
    
    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      
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
    const newUploadedFiles: UploadedFile[] = validFiles.map((file, i) => {
      // สร้าง object URL สำหรับ preview
      let previewUrl = '';
      try {
        previewUrl = URL.createObjectURL(file);
      } catch (error) {
        console.error('Error creating object URL:', error);
        // ถ้าสร้าง URL ไม่ได้ ให้ใช้ placeholder
        previewUrl = '';
      }
      
      return {
        id: Date.now().toString() + i,
        name: file.name,
        size: file.size,
        type: file.type,
        url: previewUrl,
        file: file,
      };
    });

    setUploadedFiles(prev => [...prev, ...newUploadedFiles]);
    
    // เก็บไฟล์ไว้สำหรับอัพโหลดตอนบันทึก (ทั้งโหมดใหม่และแก้ไข)
    setSelectedFiles(prev => [...prev, ...validFiles]);

    // แสดงข้อความสำเร็จ
    showSnackbar(`เพิ่มไฟล์ ${validFiles.length} ไฟล์แล้ว`, 'success');
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
            // ล้าง URL.createObjectURL ของไฟล์เก่าที่ยังไม่ได้อัปโหลด
            uploadedFiles.forEach(file => {
              if (file.url && !file.url.startsWith('/uploads') && file.file) {
                URL.revokeObjectURL(file.url);
              }
            });
            
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
    <AppLayout 
      hideFooter 
      showBackOnly
      backTitle={isEdit ? 'แก้ไขข้อมูลร้านอาหาร' : 'สมัครเปิดร้านอาหาร'}
    >
      <Box 
        ref={topRef}
        sx={{ 
          py: 2, 
          px: 2,
          fontFamily: 'Prompt, sans-serif',
          
        }}
      >
        {/* Status Chip */}
        {justUpdated && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
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
          </Box>
        )}

        {/* Form */}
        <Card 
          elevation={0}
          sx={{ 
            borderRadius: 3,            
            bgcolor: '#FFFFFF',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {/* ชื่อร้าน */}
                <StyledTextField
                  fullWidth
                  label="ชื่อร้านอาหาร *"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Store sx={{ mr: 1.5, color: '#999', fontSize: 18 }} />,
                  }}
                />

                {/* คำอธิบายร้าน */}
                <StyledTextField
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
                />

                {/* ที่อยู่ร้าน */}
                <StyledTextField
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
                          <MyLocation sx={{ fontSize: 24 }} />
                        )}
                      </IconButton>
                    ),
                  }}
                />

                {/* เบอร์โทรศัพท์ */}
                <StyledTextField
                  fullWidth
                  label="เบอร์โทรศัพท์ร้าน *"
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Phone sx={{ mr: 1.5, color: '#999', fontSize: 18 }} />,
                  }}
                />

                {/* เวลาเปิด-ปิด */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <StyledTextField
                    fullWidth
                    label="เวลาเปิด"
                    type="time"
                    value={formData.openTime}
                    onChange={handleInputChange('openTime')}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <AccessTime sx={{ mr: 1.5, color: '#999', fontSize: 18 }} />,
                    }}
                  />
                  <StyledTextField
                    fullWidth
                    label="เวลาปิด"
                    type="time"
                    value={formData.closeTime}
                    onChange={handleInputChange('closeTime')}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <AccessTime sx={{ mr: 1.5, color: '#999', fontSize: 18 }} />,
                    }}
                  />
                </Box>

                {/* เอกสารประกอบการสมัคร */}
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
                  
                  <FileDropzone
                    files={uploadedFiles}
                    onFilesChange={handleFileChange}
                    onRemoveFile={handleRemoveFile}
                    onDownloadFile={handleDownloadFile}
                    loading={uploadingFiles}
                    disabled={loading}
                    maxFiles={10}
                  />
                </Box>

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
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Box>
    </AppLayout>
  );
} 