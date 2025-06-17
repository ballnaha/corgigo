'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  IconButton,
  Switch,
  FormControlLabel,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useMediaQuery,
  useTheme,
  Skeleton,
  CircularProgress,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Restaurant,
  Close,
  CloudUpload,
  Image as ImageIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useSnackbar } from '@/contexts/SnackbarContext';

// Types from database
interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  order: number;
  _count?: {
    menuItems: number;
  };
}

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  categoryId?: string;
  category?: Category;
  image?: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

interface MenuItemsResponse {
  items: MenuItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

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

export default function MenuManagement() {
  const theme = useTheme();
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  // State
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
  // Dialog state
  const [openMenuDialog, setOpenMenuDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  
  // Form state
  const [menuForm, setMenuForm] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    categoryId: '',
    image: '',
    isAvailable: true,
  });
  


  // Upload state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Check authentication
  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/login');
      return;
    }
  }, [session, status, router]);

  // Load initial data
  useEffect(() => {
    if (session && !initialLoadComplete) {
      const loadData = async () => {
        await Promise.all([loadCategories(), loadMenuItems()]);
        setInitialLoadComplete(true);
      };
      loadData();
    }
  }, [session, initialLoadComplete]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Memoized filtered items
  const filteredItems = useMemo(() => {
    let filtered = menuItems;
    
    if (debouncedSearchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(item => item.categoryId === selectedCategory);
    }
    
    return filtered;
  }, [menuItems, debouncedSearchTerm, selectedCategory]);

  // API Functions
  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await fetch('/api/restaurant/categories');
      const result: ApiResponse<Category[]> = await response.json();
      
      if (result.success) {
        setCategories(result.data);
      } else {
        showSnackbar(result.error || 'เกิดข้อผิดพลาดในการโหลดหมวดหมู่', 'error');
      }
    } catch (err) {
      showSnackbar('เกิดข้อผิดพลาดในการโหลดหมวดหมู่', 'error');
    } finally {
      setCategoriesLoading(false);
    }
  };

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/restaurant/menus?limit=100');
      const result: ApiResponse<MenuItemsResponse> = await response.json();
      
      if (result.success) {
        setMenuItems(result.data.items);
      } else {
        showSnackbar(result.error || 'เกิดข้อผิดพลาดในการโหลดเมนู', 'error');
      }
    } catch (err) {
      showSnackbar('เกิดข้อผิดพลาดในการโหลดเมนู', 'error');
    } finally {
      setLoading(false);
    }
  };

  const saveMenuItem = async () => {
    try {
      setSaving(true);

      let imageUrl = menuForm.image;

      // Upload new image if selected
      if (selectedFile) {
        const uploadedUrl = await uploadImage(selectedFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const url = selectedItem 
        ? `/api/restaurant/menus/${selectedItem.id}`
        : '/api/restaurant/menus';
      
      const method = selectedItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...menuForm,
          price: parseFloat(menuForm.price),
          originalPrice: menuForm.originalPrice ? parseFloat(menuForm.originalPrice) : null,
          categoryId: menuForm.categoryId || null,
          image: imageUrl || null,
        }),
      });

      const result: ApiResponse<MenuItem> = await response.json();

      if (result.success) {
        showSnackbar(result.message || 'บันทึกเมนูสำเร็จ', 'success');
        setOpenMenuDialog(false);
        resetMenuForm();
        loadMenuItems();
      } else {
        showSnackbar(result.error || 'เกิดข้อผิดพลาดในการบันทึกเมนู', 'error');
      }
    } catch {
      showSnackbar('เกิดข้อผิดพลาดในการบันทึกเมนู', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteMenuItem = async (id: string) => {
    if (!confirm('คุณต้องการลบเมนูนี้หรือไม่?')) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/restaurant/menus/${id}`, {
        method: 'DELETE',
      });

      const result: ApiResponse<any> = await response.json();

      if (result.success) {
        showSnackbar('ลบเมนูสำเร็จ', 'success');
        loadMenuItems();
      } else {
        showSnackbar(result.error || 'เกิดข้อผิดพลาดในการลบเมนู', 'error');
      }
    } catch (err) {
      showSnackbar('เกิดข้อผิดพลาดในการลบเมนู', 'error');
    } finally {
      setSaving(false);
    }
  };

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/restaurant/menus/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isAvailable: !currentStatus,
        }),
      });

      const result: ApiResponse<MenuItem> = await response.json();

      if (result.success) {
        loadMenuItems();
      } else {
        showSnackbar(result.error || 'เกิดข้อผิดพลาดในการเปลี่ยนสถานะ', 'error');
      }
    } catch (err) {
      showSnackbar('เกิดข้อผิดพลาดในการเปลี่ยนสถานะ', 'error');
    }
  };

  // Helper Functions
  const resetMenuForm = useCallback(() => {
    setMenuForm({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      categoryId: '',
      image: '',
      isAvailable: true,
    });
    setSelectedItem(null);
    setSelectedFile(null);
    setPreviewUrl('');
  }, []);

  const handleAddMenu = useCallback(() => {
    resetMenuForm();
    setOpenMenuDialog(true);
  }, [resetMenuForm]);

  const handleEditMenu = useCallback((item: MenuItem) => {
    setSelectedItem(item);
    setMenuForm({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      originalPrice: item.originalPrice?.toString() || '',
      categoryId: item.categoryId || '',
      image: item.image || '',
      isAvailable: item.isAvailable,
    });
    setPreviewUrl(item.image || '');
    setSelectedFile(null);
    setOpenMenuDialog(true);
  }, []);

  // Image upload functions
  const handleImageSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) { // 15MB limit
        showSnackbar('ไฟล์รูปภาพต้องมีขนาดไม่เกิน 15MB', 'error');
        return;
      }

      if (!file.type.startsWith('image/')) {
        showSnackbar('กรุณาเลือกไฟล์รูปภาพเท่านั้น', 'error');
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [showSnackbar]);

  const uploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Send old image URL if exists for deletion
    if (menuForm.image) {
      formData.append('oldImageUrl', menuForm.image);
    }

    try {
      setUploadingImage(true);
      const response = await fetch('/api/restaurant/upload/menu-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      if (data.success) {
        return data.url;
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showSnackbar('การอัปโหลดรูปภาพล้มเหลว', 'error');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = useCallback(async () => {
    if (menuForm.image) {
      try {
        // Delete image from server
        const response = await fetch(`/api/restaurant/upload/menu-image?imageUrl=${encodeURIComponent(menuForm.image)}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Delete failed');
        }

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || 'Delete failed');
        }

        showSnackbar('ลบรูปภาพเรียบร้อยแล้ว', 'success');
      } catch (error) {
        console.error('Delete error:', error);
        showSnackbar('การลบรูปภาพล้มเหลว', 'error');
      }
    }

    setSelectedFile(null);
    setPreviewUrl('');
    setMenuForm({ ...menuForm, image: '' });
  }, [menuForm, showSnackbar]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(price);
  };

  const calculateDiscountPercent = (originalPrice: number, discountedPrice: number) => {
    const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
    return Math.round(discount);
  };

  const renderPriceDisplay = (item: MenuItem) => {
    const hasDiscount = item.originalPrice && item.originalPrice > item.price;
    
    if (hasDiscount) {
      const discountPercent = calculateDiscountPercent(item.originalPrice!, item.price);
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {/* Original Price - Strikethrough */}
          <Typography 
            variant="body2" 
            sx={{ 
              textDecoration: 'line-through',
              color: '#999',
              fontFamily: vristoTheme.font.family,
              fontSize: { xs: '0.875rem', sm: '1rem' },
              fontWeight: 500,
              lineHeight: 1,
            }}
          >
            {formatPrice(item.originalPrice!)}
          </Typography>
          
          {/* Sale Price + Discount Badge */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                color: '#e74c3c',
                fontFamily: vristoTheme.font.family,
                fontSize: { xs: '1.25rem', sm: '1.375rem' },
                lineHeight: 1,
              }}
            >
              {formatPrice(item.price)}
            </Typography>
            <Chip
              label={`ลด ${discountPercent}%`}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.7rem',
                fontWeight: 700,
                backgroundColor: '#e74c3c',
                color: 'white',
                fontFamily: vristoTheme.font.family,
                '& .MuiChip-label': {
                  px: 1,
                  py: 0,
                },
              }}
            />
          </Box>
        </Box>
      );
    } else {
      return (
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 700,
            color: vristoTheme.primary,
            fontFamily: vristoTheme.font.family,
            fontSize: { xs: '1.125rem', sm: '1.25rem' },
          }}
        >
          {formatPrice(item.price)}
        </Typography>
      );
    }
  };

  const getStatusChip = (available: boolean) => (
    <Chip
      label={available ? 'พร้อมขาย' : 'หมด'}
      size="small"
      sx={{
        fontWeight: 600,
        fontFamily: vristoTheme.font.family,
        fontSize: '0.75rem',
        backgroundColor: available ? '#E8F5E8' : '#FFF0F0',
        color: available ? '#2E7D32' : '#D32F2F',
        border: `1px solid ${available ? '#4CAF50' : '#F44336'}30`,
        backdropFilter: 'blur(4px)',
        '& .MuiChip-label': {
          px: 1.5,
          py: 0.25,
        },
      }}
    />
  );

  // Loading state
  if (status === 'loading' || (loading && categoriesLoading)) {
    return (
      <Box sx={{ 
        mx: { xs: -2, sm: -3 },
        px: { xs: 2, sm: 3 },
        py: 2,
        bgcolor: vristoTheme.background.main,
        minHeight: '100vh',
      }}>
        {/* Header Skeleton */}
        <Box sx={{ 
          mb: { xs: 3, sm: 4 },
          backgroundColor: vristoTheme.background.paper,
          borderRadius: { xs: 0, sm: 2 },
          p: { xs: 3, sm: 4 },
          mx: { xs: -2, sm: 0 },
        }}>
          <Skeleton variant="text" width="40%" height={40} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="60%" height={20} sx={{ mb: 3 }} />
          <Box sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}>
            <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 2, width: { xs: '100%', sm: 120 } }} />
            <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 2, width: { xs: '100%', sm: 120 } }} />
          </Box>
        </Box>
        
        {/* Grid Skeleton */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: { xs: 2, sm: 3 },
        }}>
          {[...Array(8)].map((_, index) => (
            <Card key={index} sx={{ 
              borderRadius: { xs: 3, sm: 2 },
              overflow: 'hidden',
            }}>
              <Skeleton variant="rectangular" height={200} sx={{ height: { xs: 160, sm: 200 } }} />
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Skeleton variant="text" height={24} sx={{ mb: 1 }} />
                <Skeleton variant="text" height={28} width="40%" sx={{ mb: 2 }} />
                <Skeleton variant="text" height={20} />
                <Skeleton variant="text" height={20} width="80%" sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, borderTop: '1px solid #f0f0f0' }}>
                  <Skeleton variant="rectangular" width={60} height={20} sx={{ borderRadius: 1 }} />
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Skeleton variant="circular" width={32} height={32} />
                    <Skeleton variant="circular" width={32} height={32} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      mx: { xs: -2, sm: -3 }, // ขยายออกไปจาก layout padding
      px: { xs: 2, sm: 3 }, // เพิ่ม padding กลับเข้ามา
      py: 2,
      bgcolor: vristoTheme.background.main,
      minHeight: '100vh',
      fontFamily: vristoTheme.font.family,
    }}>
      {/* Header */}
      <Box sx={{ 
        mb: { xs: 3, sm: 4 },
        backgroundColor: vristoTheme.background.paper,
        borderRadius: { xs: 0, sm: 2 },
        p: { xs: 3, sm: 4 },
        mx: { xs: -2, sm: 0 },
        boxShadow: { xs: 'none', sm: vristoTheme.shadow.card },
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          mb: 3,
        }}>
          <Box>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                color: vristoTheme.text.primary,
                mb: 1,
                fontFamily: vristoTheme.font.family,
                fontSize: { xs: '1.5rem', sm: '2rem' },
              }}
            >
              จัดการเมนูอาหาร
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: vristoTheme.text.secondary,
                fontFamily: vristoTheme.font.family,
                mb: { xs: 3, sm: 0 },
              }}
            >
              เพิ่ม แก้ไข และจัดการเมนูอาหารของร้าน
            </Typography>
          </Box>
          
          {/* Action Buttons */}
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddMenu}
            sx={{ 
              bgcolor: vristoTheme.primary,
              fontFamily: vristoTheme.font.family,
              fontWeight: 600,
              px: { xs: 3, sm: 4 },
              py: { xs: 1.5, sm: 1.25 },
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                transform: 'translateY(-1px)',
              }
            }}
          >
            เพิ่มเมนูใหม่
          </Button>
        </Box>

        {/* Filters */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 3 },
        }}>
          <TextField
            placeholder="ค้นหาเมนู..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ color: vristoTheme.text.secondary, mr: 1 }} />,
            }}
            sx={{ 
              flex: { xs: 1, sm: '1 1 auto' },
              minWidth: { xs: '100%', sm: 250 },
              '& .MuiInputBase-root': {
                fontFamily: vristoTheme.font.family,
                borderRadius: 2,
              }
            }}
          />
          <FormControl sx={{ 
            flex: { xs: 1, sm: '0 0 auto' },
            minWidth: { xs: '100%', sm: 200 }
          }}>
            <InputLabel sx={{ fontFamily: vristoTheme.font.family }}>หมวดหมู่</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label="หมวดหมู่"
              sx={{ 
                fontFamily: vristoTheme.font.family,
                borderRadius: 2,
              }}
            >
              <MenuItem value="" sx={{ fontFamily: vristoTheme.font.family }}>ทั้งหมด</MenuItem>
              {categories.map((category) => (
                <MenuItem 
                  key={category.id} 
                  value={category.id}
                  sx={{ fontFamily: vristoTheme.font.family }}
                >
                  {category.name} ({category._count?.menuItems || 0})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Empty State */}
      {filteredItems.length === 0 && !loading && (
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: { xs: 6, sm: 8 },
            px: 3,
            bgcolor: vristoTheme.background.paper,
            borderRadius: { xs: 3, sm: 2 },
            boxShadow: { xs: '0 2px 8px rgba(0,0,0,0.08)', sm: vristoTheme.shadow.card },
            mx: { xs: -2, sm: 0 },
          }}
        >
          <Box sx={{
            width: { xs: 80, sm: 96 },
            height: { xs: 80, sm: 96 },
            borderRadius: '50%',
            backgroundColor: '#f8f9fa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
          }}>
            <Restaurant sx={{ 
              fontSize: { xs: 40, sm: 48 }, 
              color: vristoTheme.text.secondary 
            }} />
          </Box>
          <Typography 
            variant="h6" 
            sx={{ 
              color: vristoTheme.text.primary,
              mb: 1,
              fontFamily: vristoTheme.font.family,
              fontSize: { xs: '1.125rem', sm: '1.25rem' },
              fontWeight: 600,
            }}
          >
            {searchTerm || selectedCategory ? 'ไม่พบเมนูที่ต้องการ' : 'ยังไม่มีเมนูอาหาร'}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: vristoTheme.text.secondary,
              mb: 4,
              fontFamily: vristoTheme.font.family,
              maxWidth: 400,
              mx: 'auto',
            }}
          >
            {searchTerm || selectedCategory 
              ? 'ลองเปลี่ยนคำค้นหาหรือหมวดหมู่ดู'
              : 'เริ่มต้นสร้างเมนูอาหารแรกของคุณเพื่อเริ่มรับออเดอร์'
            }
          </Typography>
          {!searchTerm && !selectedCategory && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddMenu}
              sx={{ 
                bgcolor: vristoTheme.primary,
                fontFamily: vristoTheme.font.family,
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  transform: 'translateY(-1px)',
                }
              }}
            >
              เพิ่มเมนูแรก
            </Button>
          )}
        </Box>
      )}

             {/* Menu Items Grid */}
       {filteredItems.length > 0 && (
         <Box sx={{ 
           display: 'grid',
           gridTemplateColumns: {
             xs: '1fr',
             sm: 'repeat(2, 1fr)',
             md: 'repeat(3, 1fr)',
             lg: 'repeat(4, 1fr)',
           },
           gap: { xs: 2, sm: 3 },
         }}>
           {filteredItems.map((item) => (
             <Card key={item.id}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: { xs: 3, sm: 2 },
                  overflow: 'hidden',
                  boxShadow: { 
                    xs: '0 2px 8px rgba(0,0,0,0.08)',
                    sm: vristoTheme.shadow.card 
                  },
                  '&:hover': {
                    boxShadow: { 
                      xs: '0 4px 16px rgba(0,0,0,0.12)',
                      sm: vristoTheme.shadow.elevated 
                    },
                    transform: { xs: 'translateY(-1px)', sm: 'translateY(-2px)' },
                  },
                  transition: 'all 0.3s ease-in-out',
                  position: 'relative',
                }}
              >
                {/* Image Container */}
                <Box sx={{ 
                  position: 'relative',
                  height: { xs: 160, sm: 200 },
                  overflow: 'hidden',
                  backgroundColor: '#f5f5f5',
                }}>
                  {item.image ? (
                    <CardMedia
                      component="img"
                      height="100%"
                      image={item.image}
                      alt={item.name}
                      sx={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.parentElement) {
                          e.currentTarget.parentElement.style.backgroundColor = '#f0f0f0';
                        }
                      }}
                    />
                  ) : (
                    <Box sx={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f8f9fa',
                      color: '#adb5bd',
                    }}>
                      <Restaurant sx={{ fontSize: { xs: 40, sm: 48 } }} />
                    </Box>
                  )}
                  
                  {/* Discount Ribbon */}
                  {item.originalPrice && item.originalPrice > item.price && (
                    <Box sx={{
                      position: 'absolute',
                      top: 16,
                      left: -8,
                      zIndex: 2,
                      transform: 'rotate(-10deg)',
                    }}>
                      <Box sx={{
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        px: 3,
                        py: 0.5,
                        fontFamily: vristoTheme.font.family,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        fontWeight: 700,
                        borderRadius: '4px',
                        boxShadow: '0 2px 8px rgba(231, 76, 60, 0.4)',
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: -4,
                          left: 8,
                          width: 0,
                          height: 0,
                          borderLeft: '4px solid transparent',
                          borderRight: '4px solid transparent',
                          borderTop: '4px solid #c0392b',
                        },
                      }}>
                        ลด {calculateDiscountPercent(item.originalPrice, item.price)}%
                      </Box>
                    </Box>
                  )}

                  {/* Status Badge */}
                  <Box sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    zIndex: 1,
                  }}>
                    {getStatusChip(item.isAvailable)}
                  </Box>
                  
                  {/* Category Badge */}
                  {item.category && (
                    <Box sx={{
                      position: 'absolute',
                      bottom: 12,
                      left: 12,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(4px)',
                      borderRadius: '12px',
                      px: 2,
                      py: 0.5,
                    }}>
                      <Typography sx={{
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: vristoTheme.text.secondary,
                        fontFamily: vristoTheme.font.family,
                      }}>
                        {item.category.name}
                      </Typography>
                    </Box>
                  )}
                </Box>
                
                <CardContent sx={{ 
                  flexGrow: 1,
                  p: { xs: 2, sm: 3 },
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  {/* Title and Price */}
                  <Box sx={{ mb: 1 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600,
                        fontFamily: vristoTheme.font.family,
                        color: vristoTheme.text.primary,
                        fontSize: { xs: '1rem', sm: '1.125rem' },
                        lineHeight: 1.3,
                        mb: 0.5,
                      }}
                    >
                      {item.name}
                    </Typography>
                    {renderPriceDisplay(item)}
                  </Box>
                  
                  {/* Description */}
                  {item.description && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: vristoTheme.text.secondary,
                        mb: 2,
                        fontFamily: vristoTheme.font.family,
                        fontSize: { xs: '0.875rem', sm: '0.875rem' },
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        flexGrow: 1,
                      }}
                    >
                      {item.description}
                    </Typography>
                  )}
                  
                  {/* Actions */}
                  <Box sx={{ 
                    mt: 'auto',
                    pt: 2,
                    borderTop: '1px solid #f0f0f0',
                  }}>
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1,
                    }}>
                      {/* Availability Toggle */}
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: 1,
                      }}>
                        <Switch
                          checked={item.isAvailable}
                          onChange={() => toggleAvailability(item.id, item.isAvailable)}
                          size="small"
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: vristoTheme.primary,
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: vristoTheme.primary,
                            },
                          }}
                        />
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontFamily: vristoTheme.font.family,
                            fontSize: { xs: '0.75rem', sm: '0.8rem' },
                            color: item.isAvailable ? vristoTheme.primary : vristoTheme.text.secondary,
                            fontWeight: 500,
                          }}
                        >
                          {item.isAvailable ? 'พร้อมขาย' : 'หมด'}
                        </Typography>
                      </Box>
                      
                      {/* Action Buttons */}
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleEditMenu(item)}
                          sx={{ 
                            color: vristoTheme.info,
                            backgroundColor: 'rgba(33, 150, 243, 0.08)',
                            borderRadius: '8px',
                            width: { xs: 32, sm: 36 },
                            height: { xs: 32, sm: 36 },
                            '&:hover': {
                              backgroundColor: 'rgba(33, 150, 243, 0.12)',
                            }
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => deleteMenuItem(item.id)}
                          sx={{ 
                            color: vristoTheme.danger,
                            backgroundColor: 'rgba(244, 67, 54, 0.08)',
                            borderRadius: '8px',
                            width: { xs: 32, sm: 36 },
                            height: { xs: 32, sm: 36 },
                            '&:hover': {
                              backgroundColor: 'rgba(244, 67, 54, 0.12)',
                            }
                          }}
                          disabled={saving}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
      )}

      {/* Menu Dialog */}
      <Dialog 
        open={openMenuDialog} 
        onClose={() => setOpenMenuDialog(false)}
        maxWidth="sm" 
        fullWidth
        fullScreen={isXsScreen}
        PaperProps={{
          sx: {
            m: { xs: 0, sm: 2 },
            maxHeight: { xs: '100vh', sm: 'calc(100vh - 80px)' },
            borderRadius: { xs: 0, sm: 2 },
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }
        }}
      >
        <DialogTitle sx={{ 
          fontFamily: vristoTheme.font.family, 
          fontWeight: 600,
          fontSize: { xs: '1.1rem', sm: '1.25rem' },
          py: { xs: 2, sm: 2 },
          px: { xs: 3, sm: 3 },
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid #e0e6ed`,
          backgroundColor: { xs: vristoTheme.background.paper, sm: 'transparent' },
          minHeight: { xs: '56px', sm: 'auto' },
          flexShrink: 0,
        }}>
          <Typography sx={{
            fontFamily: vristoTheme.font.family,
            fontWeight: 600,
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            color: vristoTheme.text.primary,
          }}>
            {selectedItem ? 'แก้ไขเมนู' : 'เพิ่มเมนูใหม่'}
          </Typography>
          <IconButton
            onClick={() => setOpenMenuDialog(false)}
            sx={{
              color: vristoTheme.text.secondary,
              padding: { xs: '8px', sm: '12px' },
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <Close fontSize={isXsScreen ? 'small' : 'medium'} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ 
          px: { xs: 3, sm: 4 },
          py: { xs: 3, sm: 4 },
          flex: 1,
          overflowY: 'auto',
          backgroundColor: '#fafbfc',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#ddd',
            borderRadius: '3px',
          },
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Image Upload Section */}
            <Box>
              <Typography sx={{
                fontFamily: vristoTheme.font.family,
                fontWeight: 600,
                fontSize: '1rem',
                mb: 2,
                mt: 2,
                color: vristoTheme.text.primary,
              }}>
                รูปภาพเมนู
              </Typography>
              
              {(previewUrl || menuForm.image) ? (
                <Box sx={{ 
                  position: 'relative',
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: '2px dashed #e0e6ed',
                  mb: 2,
                }}>
                  <Box
                    component="img"
                    src={previewUrl || menuForm.image}
                    alt="Preview"
                    sx={{
                      width: '100%',
                      height: { xs: 200, sm: 250 },
                      objectFit: 'cover',
                      backgroundColor: '#f5f5f5',
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <IconButton
                    onClick={handleRemoveImage}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      color: vristoTheme.danger,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 1)',
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ) : (
                <Box sx={{
                  border: '2px dashed #e0e6ed',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  backgroundColor: '#f8f9fa',
                  mb: 2,
                }}>
                  <ImageIcon sx={{ 
                    fontSize: { xs: 48, sm: 64 },
                    color: '#adb5bd',
                    mb: 2,
                  }} />
                  <Typography sx={{
                    fontFamily: vristoTheme.font.family,
                    color: vristoTheme.text.secondary,
                    fontSize: '0.9rem',
                    mb: 1,
                  }}>
                    ยังไม่มีรูปภาพ
                  </Typography>
                </Box>
              )}

              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="image-upload"
                type="file"
                onChange={handleImageSelect}
              />
              <label htmlFor="image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={uploadingImage ? <CircularProgress size={16} /> : <CloudUpload />}
                  disabled={uploadingImage}
                  fullWidth
                  sx={{
                    borderColor: vristoTheme.primary,
                    color: vristoTheme.primary,
                    fontFamily: vristoTheme.font.family,
                    py: 1.5,
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: `${vristoTheme.primary}08`,
                    },
                  }}
                >
                  {uploadingImage ? 'กำลังอัปโหลด...' : 'เลือกรูปภาพ'}
                </Button>
              </label>
              
              <Typography sx={{
                fontFamily: vristoTheme.font.family,
                fontSize: '0.75rem',
                color: vristoTheme.text.secondary,
                textAlign: 'center',
                mt: 1,
              }}>
                รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 15MB
                <br />
                รูปภาพจะถูกปรับขนาดเป็น 800x600 พิกเซล
              </Typography>
            </Box>

            {/* Basic Information */}
            <Box>
              <Typography sx={{
                fontFamily: vristoTheme.font.family,
                fontWeight: 600,
                fontSize: '1rem',
                mb: 3,
                color: vristoTheme.text.primary,
              }}>
                ข้อมูลพื้นฐาน
              </Typography>

              <TextField
                  label="ชื่อเมนู"
                  value={menuForm.name}
                  onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                  fullWidth
                  required
                  InputLabelProps={{
                    shrink: menuForm.name !== '' || undefined,
                    sx: {
                      fontFamily: vristoTheme.font.family,
                      fontSize: { xs: '14px', sm: '16px' },
                      '&.Mui-focused': {
                        color: vristoTheme.primary,
                      },
                      // Fix mobile shrink behavior
                      '&.MuiInputLabel-shrink': {
                        fontSize: { xs: '12px', sm: '12px' },
                        transform: { 
                          xs: 'translate(14px, -6px) scale(1)',
                          sm: 'translate(14px, -9px) scale(0.75)'
                        },
                      },
                    }
                  }}
                  sx={{ 
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      fontFamily: vristoTheme.font.family,
                      fontSize: { xs: '14px', sm: '16px' },
                      '& fieldset': {
                        borderColor: '#e0e6ed',
                      },
                      '&:hover fieldset': {
                        borderColor: vristoTheme.primary,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: vristoTheme.primary,
                      },
                    },
                  }}
                />
                
                <TextField
                  label="คำอธิบาย"
                  value={menuForm.description}
                  onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                  fullWidth
                  multiline
                  rows={3}
                  InputLabelProps={{
                    shrink: menuForm.description !== '' || undefined,
                    sx: {
                      fontFamily: vristoTheme.font.family,
                      fontSize: { xs: '14px', sm: '16px' },
                      '&.Mui-focused': {
                        color: vristoTheme.primary,
                      },
                      // Fix mobile shrink behavior
                      '&.MuiInputLabel-shrink': {
                        fontSize: { xs: '12px', sm: '12px' },
                        transform: { 
                          xs: 'translate(14px, -6px) scale(1)',
                          sm: 'translate(14px, -9px) scale(0.75)'
                        },
                      },
                    }
                  }}
                  sx={{ 
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      fontFamily: vristoTheme.font.family,
                      fontSize: { xs: '14px', sm: '16px' },
                      '& fieldset': {
                        borderColor: '#e0e6ed',
                      },
                      '&:hover fieldset': {
                        borderColor: vristoTheme.primary,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: vristoTheme.primary,
                      },
                    },
                  }}
                />

                {/* Price Fields */}
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 2,
                  mb: 3,
                }}>
                  <TextField
                    label="ราคาก่อนลด (บาท)"
                    type="number"
                    value={menuForm.originalPrice}
                    onChange={(e) => setMenuForm({ ...menuForm, originalPrice: e.target.value })}
                    fullWidth
                    inputProps={{ min: 0, step: 0.01 }}
                    InputLabelProps={{
                      shrink: menuForm.originalPrice !== '' || undefined,
                      sx: {
                        fontFamily: vristoTheme.font.family,
                        fontSize: { xs: '14px', sm: '16px' },
                        '&.Mui-focused': {
                          color: vristoTheme.primary,
                        },
                        '&.MuiInputLabel-shrink': {
                          fontSize: { xs: '12px', sm: '12px' },
                          transform: { 
                            xs: 'translate(14px, -6px) scale(1)',
                            sm: 'translate(14px, -9px) scale(0.75)'
                          },
                        },
                      }
                    }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        fontFamily: vristoTheme.font.family,
                        fontSize: { xs: '14px', sm: '16px' },
                        '& fieldset': {
                          borderColor: '#e0e6ed',
                        },
                        '&:hover fieldset': {
                          borderColor: vristoTheme.primary,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: vristoTheme.primary,
                        },
                      },
                    }}
                  />

                  <TextField
                    label="ราคาขาย (บาท)"
                    type="number"
                    value={menuForm.price}
                    onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })}
                    required
                    fullWidth
                    inputProps={{ min: 0, step: 0.01 }}
                    InputLabelProps={{
                      shrink: menuForm.price !== '' || undefined,
                      sx: {
                        fontFamily: vristoTheme.font.family,
                        fontSize: { xs: '14px', sm: '16px' },
                        '&.Mui-focused': {
                          color: vristoTheme.primary,
                        },
                        '&.MuiInputLabel-shrink': {
                          fontSize: { xs: '12px', sm: '12px' },
                          transform: { 
                            xs: 'translate(14px, -6px) scale(1)',
                            sm: 'translate(14px, -9px) scale(0.75)'
                          },
                        },
                      }
                    }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        fontFamily: vristoTheme.font.family,
                        fontSize: { xs: '14px', sm: '16px' },
                        '& fieldset': {
                          borderColor: '#e0e6ed',
                        },
                        '&:hover fieldset': {
                          borderColor: vristoTheme.primary,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: vristoTheme.primary,
                        },
                      },
                    }}
                  />
                </Box>

                {/* Discount Preview */}
                {menuForm.originalPrice && menuForm.price && 
                 parseFloat(menuForm.originalPrice) > parseFloat(menuForm.price) && (
                  <Box sx={{
                    p: 2,
                    backgroundColor: '#FFF3E0',
                    borderRadius: 2,
                    border: '1px solid #FFB74D',
                    mb: 3,
                  }}>
                    <Typography sx={{
                      fontFamily: vristoTheme.font.family,
                      fontSize: '0.875rem',
                      color: '#F57C00',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}>
                      💰 ลดราคา {calculateDiscountPercent(parseFloat(menuForm.originalPrice), parseFloat(menuForm.price))}%
                      <span style={{ fontWeight: 400 }}>
                        (ประหยัด {formatPrice(parseFloat(menuForm.originalPrice) - parseFloat(menuForm.price))})
                      </span>
                    </Typography>
                  </Box>
                )}
                
                <FormControl 
                  fullWidth
                  sx={{ mb: 3 }}
                >
                  <InputLabel 
                    shrink={menuForm.categoryId !== '' || undefined}
                    sx={{ 
                      fontFamily: vristoTheme.font.family,
                      fontSize: { xs: '14px', sm: '16px' },
                      '&.Mui-focused': {
                        color: vristoTheme.primary,
                      },
                      // Fix mobile shrink behavior
                      '&.MuiInputLabel-shrink': {
                        fontSize: { xs: '12px', sm: '12px' },
                        transform: { 
                          xs: 'translate(14px, -6px) scale(1)',
                          sm: 'translate(14px, -9px) scale(0.75)'
                        },
                      },
                    }}
                  >
                    หมวดหมู่
                  </InputLabel>
                  <Select
                    value={menuForm.categoryId}
                    onChange={(e) => setMenuForm({ ...menuForm, categoryId: e.target.value })}
                    label="หมวดหมู่"
                    sx={{ 
                      borderRadius: 2,
                      fontFamily: vristoTheme.font.family,
                      fontSize: { xs: '14px', sm: '16px' },
                      '& fieldset': {
                        borderColor: '#e0e6ed',
                      },
                      '&:hover fieldset': {
                        borderColor: vristoTheme.primary,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: vristoTheme.primary,
                      },
                    }}
                  >
                    <MenuItem value="" sx={{ fontFamily: vristoTheme.font.family }}>
                      ไม่ระบุหมวดหมู่
                    </MenuItem>
                    {categories.map((category) => (
                      <MenuItem 
                        key={category.id} 
                        value={category.id}
                        sx={{ fontFamily: vristoTheme.font.family }}
                      >
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  backgroundColor: '#f8f9fa',
                  borderRadius: 2,
                }}>
                  <Box>
                    <Typography sx={{
                      fontFamily: vristoTheme.font.family,
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      color: vristoTheme.text.primary,
                    }}>
                      สถานะการขาย
                    </Typography>
                    <Typography sx={{
                      fontFamily: vristoTheme.font.family,
                      fontSize: '0.8rem',
                      color: vristoTheme.text.secondary,
                    }}>
                      {menuForm.isAvailable ? 'พร้อมให้ลูกค้าสั่งซื้อ' : 'ไม่พร้อมขาย'}
                    </Typography>
                  </Box>
                  <Switch
                    checked={menuForm.isAvailable}
                    onChange={(e) => setMenuForm({ ...menuForm, isAvailable: e.target.checked })}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: vristoTheme.primary,
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: vristoTheme.primary,
                      },
                    }}
                  />
                </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          px: { xs: 3, sm: 3 }, 
          py: { xs: 2, sm: 2 },
          gap: { xs: 2, sm: 2 },
          backgroundColor: { xs: '#f8f9fa', sm: 'transparent' },
          borderTop: { xs: '1px solid #e0e6ed', sm: 'none' },
          flexShrink: 0,
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
          <Button 
            onClick={() => setOpenMenuDialog(false)}
            variant="outlined"
            sx={{ 
              fontFamily: vristoTheme.font.family,
              fontSize: { xs: '0.9rem', sm: '0.9rem' },
              px: { xs: 3, sm: 3 },
              py: { xs: 1.5, sm: 1.5 },
              minHeight: { xs: '48px', sm: '44px' },
              borderColor: '#e0e6ed',
              color: vristoTheme.text.secondary,
              '&:hover': {
                borderColor: '#ccc',
                backgroundColor: 'transparent',
              },
            }}
            fullWidth={isXsScreen}
          >
            ยกเลิก
          </Button>
          <Button 
            onClick={saveMenuItem}
            variant="contained"
            disabled={saving || !menuForm.name || !menuForm.price}
            sx={{ 
              bgcolor: vristoTheme.primary,
              fontFamily: vristoTheme.font.family,
              fontWeight: 600,
              fontSize: { xs: '0.9rem', sm: '0.9rem' },
              px: { xs: 3, sm: 3 },
              py: { xs: 1.5, sm: 1.5 },
              minHeight: { xs: '48px', sm: '44px' },
              '&:hover': {
                bgcolor: vristoTheme.primary,
                opacity: 0.9,
              },
            }}
            fullWidth={isXsScreen}
          >
            {saving ? <CircularProgress size={18} color="inherit" /> : 'บันทึก'}
          </Button>
        </DialogActions>
      </Dialog>


    </Box>
  );
} 