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
import LoadingScreen from '@/components/LoadingScreen';

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

// Utility function to resize image (เอามาจากที่มีอยู่แล้วในโปรเจค)
const resizeImage = (file: File, maxWidth: number = 800, maxHeight: number = 800, quality: number = 0.8): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('ไม่สามารถสร้าง canvas context ได้'));
      return;
    }
    
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    // ตั้ง timeout เพื่อป้องกันการติดค้าง
    const timeout = setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Timeout: ไม่สามารถ resize รูปภาพ ${file.name} ได้ภายใน 10 วินาที`));
    }, 10000);

    img.onload = () => {
      clearTimeout(timeout);
      try {
        let { width, height } = img;
        
        // คำนวณขนาดใหม่
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
          URL.revokeObjectURL(objectUrl);
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error(`ไม่สามารถแปลง canvas เป็น blob สำหรับ ${file.name}`));
          }
        }, 'image/jpeg', quality);
      } catch (error) {
        clearTimeout(timeout);
        URL.revokeObjectURL(objectUrl);
        reject(error);
      }
    };

    img.onerror = () => {
      clearTimeout(timeout);
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`ไม่สามารถโหลดรูปภาพ ${file.name} ได้`));
    };

    img.src = objectUrl;
  });
};

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
  const [deletedFileIds, setDeletedFileIds] = useState<string[]>([]);

  // โหลดข้อมูลเดิมถ้าเป็นการแก้ไข
  useEffect(() => {
    if (isEdit && session?.user && !justUpdated) {
      console.log('🔄 Loading existing data from useEffect...');
      // ล้างรายการไฟล์ที่ลบแล้วเมื่อโหลดหน้าใหม่
      setDeletedFileIds([]);
      loadExistingData();
    }
  }, [isEdit, session, justUpdated]);



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

  // Cleanup object URLs เมื่อ component unmount หรือ files เปลี่ยน
  useEffect(() => {
    return () => {
      // Cleanup object URLs เมื่อ component unmount
      uploadedFiles.forEach(file => {
        if (file.url && !file.url.startsWith('/uploads') && !file.url.startsWith('data:')) {
          try {
            URL.revokeObjectURL(file.url);
          } catch (error) {
            console.error('Error revoking object URL:', error);
          }
        }
      });
    };
  }, []); // ลบ uploadedFiles ออกจาก dependency array เพื่อป้องกันการ cleanup ที่ไม่จำเป็น

  // เพิ่มการจัดการสำหรับมือถือ
  useEffect(() => {
    // ตรวจสอบว่าเป็นมือถือหรือไม่
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // เพิ่มการจัดการ memory สำหรับมือถือ
      const handleVisibilityChange = () => {
        if (document.hidden) {
          // เมื่อแอปถูกซ่อน ให้ cleanup URLs ชั่วคราว
          console.log('App hidden, cleaning up temporary URLs');
        } else {
          // เมื่อแอปกลับมาแสดง ให้ตรวจสอบ URLs
          console.log('App visible, checking URLs');
        }
      };

      const handleBeforeUnload = () => {
        // เมื่อปิดหน้าเว็บ ให้ cleanup URLs
        uploadedFiles.forEach(file => {
          if (file.url && !file.url.startsWith('/uploads') && !file.url.startsWith('data:')) {
            try {
              URL.revokeObjectURL(file.url);
            } catch (error) {
              console.error('Error revoking object URL:', error);
            }
          }
        });
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [uploadedFiles]);

  const loadExistingData = async () => {
    try {
      setLoadingData(true);
      console.log('📊 Starting to load existing data...');
      
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
        console.log('✅ Restaurant data loaded successfully');
      } else {
        showSnackbar(restaurantResult.error || 'ไม่สามารถโหลดข้อมูลได้', 'error');
        return;
      }

      // โหลดไฟล์เอกสาร - เฉพาะถ้ายังไม่มีไฟล์ในหน่วยความจำ
      if (uploadedFiles.length === 0) {
        console.log('📁 Loading files since none exist...');
        const filesResponse = await fetch('/api/restaurant/upload');
        const filesResult = await filesResponse.json();

        if (filesResponse.ok && filesResult.success && filesResult.files) {
          // ตรวจสอบและแก้ไข URL ของไฟล์ + กรองไฟล์ที่ลบแล้วออก
          const validFiles = filesResult.files
            .filter((file: any) => !deletedFileIds.includes(file.id))
            .map((file: any) => ({
              ...file,
              // ใช้ URL ที่ได้จาก API โดยตรง
              url: file.url
            }));
          
          console.log('📁 Loaded existing files:', validFiles.length, 'filtered out:', deletedFileIds.length);
          setUploadedFiles(validFiles);
        } else {
          console.log('📁 No existing files found');
          setUploadedFiles([]);
        }
      } else {
        console.log('📁 Files already exist, skipping reload');
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

  const handleFileChange = async (newFiles: File[]) => {
    // ตรวจสอบจำนวนไฟล์ก่อนอื่น
    const currentFilesCount = uploadedFiles.length;
    const remainingSlots = 10 - currentFilesCount;
    
    // ถ้าไม่มีช่องเหลือ
    if (remainingSlots <= 0) {
      console.log('🚨 Showing max files error...');
      console.log('🚨 DEBUG: remainingSlots =', remainingSlots, 'currentFilesCount =', currentFilesCount);
      showSnackbar('ไม่สามารถเพิ่มไฟล์ได้อีก เนื่องจากมีไฟล์ครบ 10 ไฟล์แล้ว', 'error');
      // เพิ่ม timeout เพื่อให้แน่ใจว่า snackbar จะแสดง
      setTimeout(() => {
        console.log('🔔 Snackbar should be visible now');
      }, 100);
      return;
    }
    
    // ถ้าเลือกไฟล์เกินจำนวนที่เหลือ
    let filesToProcess = newFiles;
    let droppedFilesCount = 0;
    
    if (newFiles.length > remainingSlots) {
      filesToProcess = Array.from(newFiles).slice(0, remainingSlots);
      droppedFilesCount = newFiles.length - remainingSlots;
      console.log('📝 Showing file limit warning...');
      console.log('📝 DEBUG: newFiles.length =', newFiles.length, 'remainingSlots =', remainingSlots);
      showSnackbar(
        `⚠️ เลือกไฟล์ ${newFiles.length} ไฟล์ แต่สามารถเพิ่มได้เพียง ${remainingSlots} ไฟล์เท่านั้น จึงเลือกเฉพาะ ${remainingSlots} ไฟล์แรก`,
        'info'
      );
      // เพิ่ม timeout เพื่อให้แน่ใจว่า snackbar จะแสดง
      setTimeout(() => {
        console.log('🔔 File limit warning snackbar should be visible now');
      }, 100);
    }
    
    // ตรวจสอบไฟล์ก่อนเพิ่มเข้า state
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];
    
    for (let i = 0; i < filesToProcess.length; i++) {
      const file = filesToProcess[i];
      
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
      console.log('🚨 Showing invalid files error...');
      showSnackbar(`ไฟล์ที่ไม่สามารถใช้ได้: ${invalidFiles.join(', ')}`, 'error');
    }

    if (validFiles.length === 0) {
      return;
    }

    // แสดงสถานะการ resize รูปภาพ (เฉพาะเมื่อมีรูปภาพ)
    const imageFiles = validFiles.filter(file => file.type.startsWith('image/'));
    const hasImages = imageFiles.length > 0;
    
    if (hasImages) {
      showSnackbar(`🖼️ กำลัง resize รูปภาพ ${imageFiles.length} ไฟล์...`, 'info');
    }

    // เพิ่มไฟล์เข้า state สำหรับแสดงผล (ไม่อัพโหลดทันที)
    const newUploadedFiles: UploadedFile[] = [];
    
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const fileId = Date.now().toString() + i;
      
      let processedFile = file;
      let previewUrl = '';
      
      // ถ้าเป็นรูปภาพ ให้ resize ก่อน
      if (file.type.startsWith('image/')) {
        try {
          console.log(`🖼️ Resizing image: ${file.name}`);
          const resizedBlob = await resizeImage(file, 1200, 1200, 0.8);
          
          // สร้าง File object ใหม่จาก resized blob
          processedFile = new File([resizedBlob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          
          console.log(`✅ Image resized: ${file.name}, original: ${file.size}b, resized: ${processedFile.size}b`);
        } catch (error) {
          console.error(`❌ Error resizing image ${file.name}:`, error);
          // ถ้า resize ไม่ได้ ให้ใช้ไฟล์เดิม
        }
      }
      
      // สร้าง preview URL
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile && processedFile.type.startsWith('image/')) {
        // ใช้ FileReader สำหรับมือถือ
        console.log(`📱 Using FileReader for mobile image: ${file.name}`);
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          if (result) {
            console.log(`✅ FileReader success for ${file.name}`);
            setUploadedFiles(prev => prev.map(f => 
              f.id === fileId ? { ...f, url: result } : f
            ));
          }
        };
        reader.readAsDataURL(processedFile);
        
        // ใช้ placeholder URL ชั่วคราว
        previewUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjhBNjZFIiBmaWxsLW9wYWNpdHk9IjAuMSIgcng9IjQiLz4KPHN2ZyB4PSIxMCIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjRjhBNjZFIiBmaWxsLW9wYWNpdHk9IjAuNyI+CjxwYXRoIGQ9Ik0yMSAxOVY1YzAtMS4xLS45LTItMi0ySDVjLTEuMSAwLTIgLjktMiAydjE0YzAgMS4xLjkgMiAyIDJoMTRjMS4xIDAgMi0uOSAyLTJ6TTguNSAxMy41bDIuNSAzLjAxTDE0LjUgMTJsNC41IDZINWwzLjUtNC1eiIvPgo8L3N2Zz4KPC9zdmc+';
      } else {
        try {
          // ใช้ URL.createObjectURL สำหรับ desktop หรือไฟล์ที่ไม่ใช่รูปภาพ
          previewUrl = URL.createObjectURL(processedFile);
          console.log(`💻 Created object URL for ${file.name}: ${previewUrl.substring(0, 50)}...`);
        } catch (error) {
          console.error(`❌ Error creating object URL for ${file.name}:`, error);
          // ถ้าสร้าง URL ไม่ได้ ให้ใช้ placeholder
          previewUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjhBNjZFIiBmaWxsLW9wYWNpdHk9IjAuMSIgcng9IjQiLz4KPHN2ZyB4PSIxMCIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjRjhBNjZFIiBmaWxsLW9wYWNpdHk9IjAuNyI+CjxwYXRoIGQ9Ik0yMSAxOVY1YzAtMS4xLS45LTItMi0ySDVjLTEuMSAwLTIgLjktMiAydjE0YzAgMS4xLjkgMiAyIDJoMTRjMS4xIDAgMi0uOSAyLTJ6TTguNSAxMy41bDIuNSAzLjAxTDE0LjUgMTJsNC41IDZINWwzLjUtNC01eiIvPgo8L3N2Zz4KPC9zdmc+';
        }
      }
      
      newUploadedFiles.push({
        id: fileId,
        name: file.name,
        size: processedFile.size, // ใช้ขนาดหลัง resize
        type: processedFile.type,
        url: previewUrl,
        file: processedFile, // ใช้ไฟล์ที่ผ่านการ resize แล้ว
      });
    }

    // อัปเดต state ทั้งสองพร้อมกัน
    setUploadedFiles(prev => {
      // เก็บไฟล์เก่าทั้งหมด (ทั้งที่อัปโหลดแล้วและที่ยังไม่ได้อัปโหลด)
      const existingFiles = prev;
      // รวมกับไฟล์ใหม่
      const combined = [...existingFiles, ...newUploadedFiles];
      console.log(`📁 Updated files list: existing=${existingFiles.length}, new=${newUploadedFiles.length}, total=${combined.length}`);
      return combined;
    });

    // อัปเดต selectedFiles
    setSelectedFiles(prev => {
      const updated = [...prev, ...validFiles];
      console.log(`📄 Updated selected files: ${updated.length} files`);
      return updated;
    });

    // แสดงข้อความสำเร็จรวม (ไม่แยก resize และเพิ่มไฟล์)
    console.log('✅ Showing success message...');
    if (hasImages) {
      showSnackbar(`✅ เพิ่มไฟล์ ${validFiles.length} ไฟล์แล้ว (resize รูปภาพ ${imageFiles.length} ไฟล์เสร็จ)`, 'success');
    } else {
      showSnackbar(`✅ เพิ่มไฟล์ ${validFiles.length} ไฟล์แล้ว`, 'success');
    }
  };

  const handleRemoveFile = async (fileId: string) => {
    const fileToRemove = uploadedFiles.find(f => f.id === fileId);
    if (!fileToRemove) return;

    console.log(`🗑️ Removing file: ${fileToRemove.name} (${fileId})`);
    showSnackbar(`กำลังลบไฟล์ "${fileToRemove.name}"...`, 'info');

    // ถ้าเป็นไฟล์ที่อัพโหลดแล้ว (มี URL ที่ขึ้นต้นด้วย /uploads) ให้ลบจากเซิร์ฟเวอร์
    if (isEdit && fileToRemove.url?.startsWith('/uploads')) {
      try {
        const response = await fetch(`/api/restaurant/upload?id=${fileId}`, {
          method: 'DELETE',
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          showSnackbar('❌ ไม่สามารถลบไฟล์ได้', 'error');
          return; // ไม่ลบจาก state ถ้าลบจากเซิร์ฟเวอร์ไม่สำเร็จ
        }
        
        console.log(`✅ File deleted from server: ${fileId}`);
        showSnackbar(`ลบไฟล์ "${fileToRemove.name}" สำเร็จ!`, 'success');
        // เพิ่มไฟล์ที่ลบแล้วเข้า list
        setDeletedFileIds(prev => [...prev, fileId]);
      } catch (error) {
        console.error('Error deleting file:', error);
        showSnackbar('เกิดข้อผิดพลาดในการลบไฟล์', 'error');
        return;
      }
    } else {
      // ถ้าเป็นไฟล์ที่ยังไม่ได้อัปโหลด ให้ revoke URL และลบจาก selectedFiles
      if (fileToRemove.url && !fileToRemove.url.startsWith('/uploads') && !fileToRemove.url.startsWith('data:')) {
        try {
          URL.revokeObjectURL(fileToRemove.url);
          console.log(`🗑️ Revoked object URL for: ${fileToRemove.name}`);
        } catch (error) {
          console.error('Error revoking object URL:', error);
        }
      }
      
      // ลบจาก selectedFiles ด้วย  
      if (fileToRemove.file) {
        setSelectedFiles(prev => prev.filter(f => f !== fileToRemove.file));
        console.log(`🗑️ Removed from selectedFiles: ${fileToRemove.name}`);
      }
      
      showSnackbar(`ลบไฟล์ "${fileToRemove.name}" สำเร็จ!`, 'success');
    }

    // ลบจาก state
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    console.log(`Removed from uploadedFiles: ${fileToRemove.name}`);
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
      console.log('🚨 Validation error: name required');
      showSnackbar('กรุณากรอกชื่อร้าน', 'error');
      return;
    }
    
    if (!formData.address.trim()) {
      console.log('🚨 Validation error: address required');
      showSnackbar('กรุณากรอกที่อยู่ร้าน', 'error');
      return;
    }
    
    if (!formData.phone.trim()) {
      console.log('🚨 Validation error: phone required');
      showSnackbar('กรุณากรอกเบอร์โทรศัพท์', 'error');
      return;
    }

    setLoading(true);
    
    // แจ้งเตือนเริ่มการบันทึก
    if (selectedFiles.length > 0) {
      console.log('📤 Starting file upload...');
      showSnackbar(`📤 กำลังอัปโหลดไฟล์ ${selectedFiles.length} ไฟล์...`, 'info');
    } else {
      console.log('💾 Saving data...');
      showSnackbar('💾 กำลังบันทึกข้อมูล...', 'info');
    }
    
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
        console.log(`📁 Adding ${selectedFiles.length} files to upload...`);
        
        // หาไฟล์ที่ได้ resize แล้วใน uploadedFiles
        const newUploadedFilesToSubmit = uploadedFiles.filter(uploadedFile => 
          uploadedFile.file && selectedFiles.some(selectedFile => 
            selectedFile.name === uploadedFile.name && selectedFile.size !== uploadedFile.size // ขนาดไม่เท่ากันแสดงว่า resize แล้ว
          )
        );

        // ถ้ามีไฟล์ที่ resize แล้ว ให้ใช้ไฟล์เหล่านั้น
        if (newUploadedFilesToSubmit.length > 0) {
          console.log(`📁 Using pre-resized files: ${newUploadedFilesToSubmit.length} files`);
          newUploadedFilesToSubmit.forEach(uploadedFile => {
            if (uploadedFile.file) {
              console.log(`✅ Adding resized file: ${uploadedFile.name} (${uploadedFile.size} bytes)`);
              submitFormData.append('files', uploadedFile.file);
            }
          });
        } else {
          // fallback ใช้ selectedFiles
          console.log(`📁 Fallback to selected files: ${selectedFiles.length} files`);
          selectedFiles.forEach(file => {
            submitFormData.append('files', file);
          });
        }
      }

      const method = isEdit ? 'PUT' : 'POST';
      const response = await fetch('/api/restaurant/register', {
        method,
        body: submitFormData, // ใช้ FormData แทน JSON
      });

      const result = await response.json();

      if (response.ok) {
        // แจ้งเตือนความสำเร็จ
        if (selectedFiles.length > 0) {
          console.log('✅ Files uploaded successfully!');
          showSnackbar(`✅ อัปโหลดไฟล์สำเร็จ ${selectedFiles.length} ไฟล์!`, 'success');
        }
        
        // ถ้าเป็นการแก้ไข ให้อัพเดทข้อมูลทันทีจาก response
        if (isEdit && result.restaurant) {
          // อัปเดต formData ด้วยข้อมูลใหม่จาก response
          setFormData({
            name: result.restaurant.name || '',
            description: result.restaurant.description || '',
            address: result.restaurant.address || '',
            phone: result.restaurant.phone || '',
            openTime: result.restaurant.openTime || '09:00',
            closeTime: result.restaurant.closeTime || '21:00',
          });
          
          // อัปเดต location ถ้ามี
          if (result.restaurant.latitude && result.restaurant.longitude) {
            setLocation({
              lat: result.restaurant.latitude,
              lng: result.restaurant.longitude,
            });
          }
          
          // จัดการไฟล์หลังจาก submit สำเร็จ
          console.log('🔄 Managing files after submit success...');
          console.log('📊 Current state:', {
            uploadedFilesCount: uploadedFiles.length,
            selectedFilesCount: selectedFiles.length,
            hasResponseFiles: !!result.files,
            responseFilesCount: result.files?.length || 0
          });
          
          // ถ้ามีไฟล์ใหม่ที่อัปโหลด
          if (selectedFiles.length > 0) {
            console.log('📁 Processing newly uploaded files...');
            
            // ล้าง URL.createObjectURL ของไฟล์ที่ยังไม่ได้อัปโหลด
            uploadedFiles.forEach(file => {
              if (file.url && !file.url.startsWith('/uploads') && !file.url.startsWith('data:')) {
                try {
                  URL.revokeObjectURL(file.url);
                  console.log(`🗑️ Revoked URL for ${file.name}`);
                } catch (error) {
                  console.error('Error revoking object URL:', error);
                }
              }
            });
            
            // โหลดไฟล์ใหม่จาก API แทนการใช้ response
            console.log('🔄 Reloading all files from API...');
            try {
              const filesResponse = await fetch('/api/restaurant/upload');
              const filesResult = await filesResponse.json();
              
              if (filesResponse.ok && filesResult.success && filesResult.files) {
                // กรองไฟล์ที่ลบแล้วออก
                const filteredFiles = filesResult.files.filter((file: any) => !deletedFileIds.includes(file.id));
                setUploadedFiles(filteredFiles);
                console.log('✅ All files reloaded successfully:', filteredFiles.length, 'total from API:', filesResult.files.length, 'deleted:', deletedFileIds.length);
              } else {
                console.log('⚠️ Failed to reload files, keeping current files');
                // ไม่อัปเดตอะไร ให้ไฟล์เดิมอยู่
              }
            } catch (error) {
              console.error('Error reloading files:', error);
              // ไม่อัปเดตอะไร ให้ไฟล์เดิมอยู่
            }
          } else {
            console.log('ℹ️ No new files uploaded, keeping current files unchanged');
            // ไม่มีไฟล์ใหม่ ไม่ต้องทำอะไร
          }
          
          // ล้าง selectedFiles ในทุกกรณี
          setSelectedFiles([]);
          console.log('🧹 Cleared selected files');
          
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
            
            console.log('✅ Scroll commands executed');
            console.log('🎉 Showing success message...');
            showSnackbar('🎉 บันทึกสำเร็จ!', 'success');
          }, 200);
          
          // ซ่อนสถานะอัพเดทหลังจาก 3 วินาที
          setTimeout(() => {
            console.log('🔄 Clearing justUpdated flag');
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
        // แจ้งเตือนเมื่อเกิดข้อผิดพลาด
        if (selectedFiles.length > 0) {
          console.log('❌ File upload failed!');
          showSnackbar('❌ อัปโหลดไฟล์ไม่สำเร็จ!', 'error');
        }
        showSnackbar(result.error || (isEdit ? 'ไม่สามารถอัพเดทได้' : 'ไม่สามารถสมัครได้'), 'error');
      }
    } catch (error) {
      console.error('Error during upload:', error);
      if (selectedFiles.length > 0) {
        showSnackbar('❌ เกิดข้อผิดพลาดในการอัปโหลดไฟล์', 'error');
      } else {
        showSnackbar('เกิดข้อผิดพลาด', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  // รวม loading states ให้ดูเนียนตา
  const isInitialLoading = status === 'loading' || loadingData;

  if (isInitialLoading) {
    return (
      <LoadingScreen
        step={status === 'loading' ? 'auth' : 'data'}
        showProgress={true}
        currentStep={status === 'loading' ? 1 : 2}
        totalSteps={2}
        subtitle={isEdit ? 'เตรียมข้อมูลสำหรับแก้ไข' : 'เตรียมฟอร์มสมัคร'}
      />
    );
  }

  if (!session) {
    router.push('/auth/login');
    return null;
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
          opacity: 0,
          animation: 'fadeIn 0.6s ease-out forwards',
          '@keyframes fadeIn': {
            '0%': { 
              opacity: 0, 
              transform: 'translateY(20px)' 
            },
            '100%': { 
              opacity: 1, 
              transform: 'translateY(0)' 
            },
          },
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