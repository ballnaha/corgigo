import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { colors, themes } from '@/config/colors';
import { useCart } from '@/contexts/CartContext';
import { 
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Snackbar,
  Alert,
  CircularProgress,
  Chip, Box, 
  IconButton,
  Avatar,
  Badge,
  Button,
 } from '@mui/material';
import {
  Search,
  Star,
  LocationOn,
  ShoppingCart,
  NotificationsNone,
  LocalDining,
  LocalPizza,
  RamenDining,
  SoupKitchen,
  Nature,
  Cake,
  LocalBar,
  MoreHoriz,
} from '@mui/icons-material';
import Sidebar from '../components/Sidebar';
import Onboarding from '../components/Onboarding';
import AppHeader from '../components/AppHeader';
import FooterNavbar from '../components/FooterNavbar';
import LoadingScreen from '../components/LoadingScreen';
import AddToCartDrawer from '../components/AddToCartDrawer';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { itemCount, notificationCount, isLoaded } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [userAddress, setUserAddress] = useState<string>('');
  const [userAvatar, setUserAvatar] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [restaurants, setRestaurants] = useState<any[]>([]);

  // AddToCart Drawer states
  const [addToCartDrawerOpen, setAddToCartDrawerOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<any>(null);

  // Banner slides data for Special Offers
  const bannerSlides = [
    {
      id: 1,
      title: '30%',
      subtitle: 'DISCOUNT ONLY\nVALID FOR TODAY!',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=300&fit=crop',
      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    },
    {
      id: 2,
      title: '50%',
      subtitle: 'FREE DELIVERY\nON FIRST ORDER!',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop',
      background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    },
    {
      id: 3,
      title: '25%',
      subtitle: 'WEEKEND SPECIAL\nALL RESTAURANTS!',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=300&fit=crop',
      background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    },
  ];

  // Categories data
  const categories = [
    { id: 1, name: 'Hamburger', icon: '🍔', iconComponent: LocalDining },
    { id: 2, name: 'Pizza', icon: '🍕', iconComponent: LocalPizza },
    { id: 3, name: 'Noodles', icon: '🍜', iconComponent: RamenDining },
    { id: 4, name: 'Meat', icon: '🥩', iconComponent: SoupKitchen },
    { id: 5, name: 'Vegetables', icon: '🥬', iconComponent: Nature },
    { id: 6, name: 'Dessert', icon: '🧁', iconComponent: Cake },
    { id: 7, name: 'Drink', icon: '🥤', iconComponent: LocalBar },
    { id: 8, name: 'More', icon: '⚡', iconComponent: MoreHoriz },
  ];

  // Expanded restaurants for discount section
  const discountRestaurants = [
    {
      id: 1,
      name: 'Green Salad Bowl',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop',
      discount: '20%',
      category: 'Healthy Food',
      rating: 4.8,
      deliveryTime: '15-25 min',
      deliveryFee: 'Free'
    },
    {
      id: 2,
      name: 'Burger Palace',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop',
      discount: '15%',
      category: 'Fast Food',
      rating: 4.6,
      deliveryTime: '20-30 min',
      deliveryFee: 'Free'
    },
    {
      id: 3,
      name: 'Pizza Corner',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
      discount: '25%',
      category: 'Italian',
      rating: 4.7,
      deliveryTime: '25-35 min',
      deliveryFee: '฿15'
    },
    {
      id: 4,
      name: 'Thai Kitchen',
      image: 'https://images.unsplash.com/photo-1559314809-0f31657778ef?w=300&h=200&fit=crop',
      discount: '30%',
      category: 'Thai Food',
      rating: 4.9,
      deliveryTime: '20-30 min',
      deliveryFee: 'Free'
    },
    {
      id: 5,
      name: 'Sushi Master',
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=200&fit=crop',
      discount: '18%',
      category: 'Japanese',
      rating: 4.8,
      deliveryTime: '30-40 min',
      deliveryFee: '฿20'
    },
    {
      id: 6,
      name: 'Coffee & Dessert',
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=200&fit=crop',
      discount: '22%',
      category: 'Cafe & Sweets',
      rating: 4.5,
      deliveryTime: '15-20 min',
      deliveryFee: 'Free'
    },
    {
      id: 7,
      name: 'Korean BBQ House',
      image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=300&h=200&fit=crop',
      discount: '35%',
      category: 'Korean BBQ',
      rating: 4.9,
      deliveryTime: '25-35 min',
      deliveryFee: '฿25'
    },
    {
      id: 8,
      name: 'Noodle Express',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop',
      discount: '28%',
      category: 'Asian Noodles',
      rating: 4.6,
      deliveryTime: '15-25 min',
      deliveryFee: 'Free'
    },
    {
      id: 9,
      name: 'Taco Fiesta',
      image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=300&h=200&fit=crop',
      discount: '24%',
      category: 'Mexican',
      rating: 4.7,
      deliveryTime: '20-30 min',
      deliveryFee: '฿18'
    },
    {
      id: 10,
      name: 'Seafood Paradise',
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=300&h=200&fit=crop',
      discount: '32%',
      category: 'Seafood',
      rating: 4.8,
      deliveryTime: '30-45 min',
      deliveryFee: '฿30'
    },
  ];

  // โหลดข้อมูล profile เพื่อดึงข้อมูลผู้ใช้
  useEffect(() => {
    const loadUserProfile = async () => {
      if (status === 'loading') return;
      
      if (session?.user) {
      try {
          const response = await fetch('/api/profile');
          if (response.ok) {
            const result = await response.json();
            if (result.success && result.user) {
              // ตั้งค่า address
              setUserAddress(result.user.address || 'ไม่ได้ระบุที่อยู่');
              
              // ตั้งค่า avatar จาก LINE
              setUserAvatar(result.user.avatar || '');
              
              // ตั้งค่าชื่อผู้ใช้
              const fullName = `${result.user.firstName || ''} ${result.user.lastName || ''}`.trim();
              setUserName(fullName || result.user.email || 'ผู้ใช้');
        }
          }
      } catch (error) {
          console.error('Error loading user profile:', error);
        }
      }
      
      setIsInitialLoading(false);
    };

    loadUserProfile();
    loadRestaurants();
  }, [session, status]);

  const loadRestaurants = async () => {
    try {
      const response = await fetch('/api/restaurants/public?limit=20');
      const data = await response.json();
      
      if (data.success) {
        setRestaurants(data.restaurants);
      }
    } catch (error) {
      console.error('Error loading restaurants:', error);
    }
  };

  // Auto slide banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [bannerSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
  };

  // ฟังก์ชันสำหรับเปิด AddToCart Drawer
  const handleAddToCartClick = (restaurant: any) => {
    // ใช้เมนูจริงจาก database หรือสร้างเมนูจำลอง
    const firstMenuItem = restaurant.menuItems?.[0];
    
    const menuItem = firstMenuItem ? {
      id: firstMenuItem.id,
      name: firstMenuItem.name,
      description: firstMenuItem.description || `เมนูขายดีจาก ${restaurant.name}`,
      price: firstMenuItem.price,
      originalPrice: firstMenuItem.originalPrice,
      image: firstMenuItem.image || restaurant.image,
      calories: firstMenuItem.calories,
      protein: firstMenuItem.protein,
      tags: firstMenuItem.tags || [restaurant.category, 'ยอดนิยม'],
      restaurant: firstMenuItem.restaurant,
      addOns: firstMenuItem.addOns || []
    } : {
      // สำรองกรณีไม่มีเมนู
      id: `item_${restaurant.id}`,
      name: `เมนูพิเศษจาก ${restaurant.name}`,
      description: `เมนูขายดีจาก ${restaurant.name} พร้อมส่วนลด ${restaurant.discount}`,
      price: Math.floor(Math.random() * 200) + 50,
      originalPrice: Math.floor(Math.random() * 100) + 250,
      image: restaurant.image,
      calories: Math.floor(Math.random() * 400) + 200,
      protein: Math.floor(Math.random() * 20) + 15,
      tags: [restaurant.category, 'ยอดนิยม', 'ส่วนลด'],
      restaurant: {
        id: restaurant.id.toString(),
        name: restaurant.name,
        rating: restaurant.rating
      },
      addOns: [
        {
          id: 'addon_extra_meat',
          name: 'เนื้อเพิ่ม',
          price: 25,
          description: 'เพิ่มเนื้อพอร์ชันพิเศษ'
        },
        {
          id: 'addon_extra_cheese',
          name: 'ชีสเพิ่ม',
          price: 15,
          description: 'ชีสมอซซาเรลล่าเพิ่ม'
        },
        {
          id: 'addon_spicy',
          name: 'เผ็ดพิเศษ',
          price: 5,
          description: 'เพิ่มพริกและซอสเผ็ด'
        },
        {
          id: 'addon_extra_veggies',
          name: 'ผักเพิ่ม',
          price: 10,
          description: 'ผักสดหลากหลาย'
        }
      ]
    };
    
    setSelectedMenuItem(menuItem);
    setAddToCartDrawerOpen(true);
  };

  if (isInitialLoading) {
    return (
             <LoadingScreen
         step={status === 'loading' ? 'auth' : 'data'}
         showProgress={true}
         currentStep={status === 'loading' ? 1 : 2}
         totalSteps={2}
         customMessage={status === 'loading' ? undefined : 'กำลังโหลดข้อมูล...'}
         subtitle="เตรียมหน้าหลักสำหรับคุณ"
       />
    );
  }

  if (!session) {
    return <Onboarding />;
  }

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden' // ป้องกัน scroll ที่ root level
    }}>
      {/* Custom Header */}
      <Box sx={{
        bgcolor: '#FFFFFF',
        px: 2,
        py: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        {/* Top Row - Avatar, Delivery Address, Icons */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar 
              src={userAvatar || ''} 
              sx={{ width: 32, height: 32 }}
            >
              {!userAvatar && userName ? userName.charAt(0).toUpperCase() : ''}
            </Avatar>
            <Box>
              <Typography sx={{ 
                fontSize: '0.75rem', 
                color: '#9CA3AF',
                fontFamily: 'Prompt, sans-serif'
              }}>
                Deliver to
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography sx={{ 
                  fontSize: '0.85rem', 
                  fontWeight: 600,
                  color: '#1F2937',
              fontFamily: 'Prompt, sans-serif',
                  maxWidth: '140px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {userAddress || 'ไม่ได้ระบุที่อยู่'}
          </Typography>
                <LocationOn sx={{ fontSize: 14, color: '#10B981' }} />
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton 
              size="small"
              onClick={() => router.push('/notifications')}
            >
              <Badge badgeContent={3} color="error" sx={{
                '& .MuiBadge-badge': { fontSize: '0.6rem', height: 16, minWidth: 16 }
              }}>
                <NotificationsNone sx={{ fontSize: 20, color: '#6B7280' }} />
              </Badge>
            </IconButton>
            <IconButton 
              size="small"
              onClick={() => router.push('/cart')}
            >
              <Badge badgeContent={isLoaded ? itemCount : 0} color="error" sx={{
                '& .MuiBadge-badge': { fontSize: '0.6rem', height: 16, minWidth: 16 }
              }}>
                <ShoppingCart sx={{ fontSize: 20, color: '#6B7280' }} />
              </Badge>
            </IconButton>
          </Box>
        </Box>

        {/* Search Bar */}
            <TextField
              fullWidth
          placeholder="What are you craving?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                <Search sx={{ color: '#9CA3AF', fontSize: 18 }} />
                  </InputAdornment>
                ),
            }}
            sx={{ 
                '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: '#F3F4F6',
                  border: 'none',
                  '& fieldset': { border: 'none' },
              '&:hover': { bgcolor: '#E5E7EB' },
                  '&.Mui-focused': {
                    bgcolor: 'white',
                boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.1)',
                  },
                },
                '& .MuiOutlinedInput-input': {
              py: 1,
              fontSize: '0.9rem',
                  fontFamily: 'Prompt, sans-serif',
              '&::placeholder': { 
                color: '#9CA3AF', 
                opacity: 1,
                fontWeight: 400
              },
                },
              }}
            />
      </Box>

      {/* Main Content - Scrollable Area */}
      <Box sx={{ 
        flex: 1,
        overflow: 'auto',
        bgcolor: '#F8F9FA',
        px: 2, 
        py: 2,
        paddingBottom: '88px', // เผื่อ space สำหรับ footer (68px + padding)
        '-webkit-overflow-scrolling': 'touch',
        // ซ่อน scrollbar
        '&::-webkit-scrollbar': {
          display: 'none'
        },
        '-ms-overflow-style': 'none',
        'scrollbar-width': 'none'
      }}>
        {/* Special Offers Section with Banner Slider */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ 
              fontSize: '1.1rem',
              fontWeight: 600,
              color: '#1F2937',
              fontFamily: 'Prompt, sans-serif'
            }}>
              Special Offers
            </Typography>
            <Typography sx={{ 
              fontSize: '0.85rem',
              color: '#10B981',
              fontWeight: 500,
              fontFamily: 'Prompt, sans-serif'
            }}>
              See All
            </Typography>
          </Box>

            {/* Banner Slider */}
            <Box sx={{ mb: 3, position: 'relative', borderRadius: 3, overflow: 'hidden' }}>
              <Box
                sx={{
                height: 120,
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 3,
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {bannerSlides.map((slide, index) => (
                <Card
                    key={slide.id}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                    background: slide.background,
                    color: 'white',
                    borderRadius: 3,
                    transform: `translateX(${(index - currentSlide) * 100}%)`,
                    transition: 'transform 0.5s ease-in-out',
                    overflow: 'hidden',
                  }}
                >
                  <CardContent sx={{ p: 2.5, position: 'relative', zIndex: 2 }}>
                    <Typography sx={{ 
                      fontSize: '1.8rem', 
                      fontWeight: 700,
                      fontFamily: 'Prompt, sans-serif',
                      mb: 0.5
                    }}>
                      {slide.title}
                    </Typography>
                    <Typography sx={{ 
                      fontSize: '0.9rem', 
                      fontWeight: 600,
                      fontFamily: 'Prompt, sans-serif',
                      opacity: 0.95,
                      lineHeight: 1.2,
                      whiteSpace: 'pre-line'
                    }}>
                      {slide.subtitle}
                    </Typography>
                  </CardContent>
                  
                  {/* Food Image */}
                  <Box sx={{
                    position: 'absolute',
                    right: -10,
                    top: -5,
                    width: 120,
                    height: 120,
                      backgroundImage: `url(${slide.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                    borderRadius: '50%',
                    opacity: 0.8
                  }} />
                </Card>
            ))}

                {/* Dots Indicator */}
                <Box
                  sx={{
              position: 'absolute',
                    bottom: 12,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
                    gap: 1,
                  }}
                >
                  {bannerSlides.map((_, index) => (
                <Box
                  key={index}
                      onClick={() => setCurrentSlide(index)}
                  sx={{
                        width: 8,
                        height: 8,
                    borderRadius: '50%',
                    bgcolor: index === currentSlide ? 'white' : 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                    '&:hover': {
                      bgcolor: 'white',
                        },
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
          </Box>

        {/* Meal Plans Section */}
          <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ 
                fontSize: '1.1rem',
                fontWeight: 600,
                color: '#1F2937',
                fontFamily: 'Prompt, sans-serif'
              }}>
                คอร์สอาหารสุขภาพ
            </Typography>
              <Typography sx={{ fontSize: '1rem' }}>🥗</Typography>
            </Box>
            <Typography 
              onClick={() => router.push('/meal-plans')}
              sx={{ 
                fontSize: '0.85rem',
                color: '#10B981',
                fontWeight: 500,
                fontFamily: 'Prompt, sans-serif',
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              ดูทั้งหมด
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { display: 'none' } }}>
            {[
              { name: 'Keto 7 วัน', type: 'คีโต', price: 2100, image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=200&h=120&fit=crop', calories: '1200 kcal/วัน' },
              { name: 'Clean Eating 14 วัน', type: 'คลีน', price: 3800, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=120&fit=crop', calories: '1400 kcal/วัน' },
              { name: 'Muscle Building 30 วัน', type: 'เพิ่มกล้ามเนื้อ', price: 7200, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=120&fit=crop', calories: '2200 kcal/วัน' },
            ].map((plan, index) => (
              <Card 
                key={index}
                onClick={() => router.push('/meal-plans')}
                sx={{
                  minWidth: 200,
                  borderRadius: 2,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <Box
                  sx={{
                    height: 100,
                    backgroundImage: `url(${plan.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative'
                  }}
                >
              <Chip
                    label={plan.type}
                    size="small"
                sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      bgcolor: '#10B981',
                      color: 'white',
                      fontSize: '0.65rem',
                      fontWeight: 600
                    }}
                  />
                </Box>
                <CardContent sx={{ p: 1.5 }}>
                  <Typography sx={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#1F2937',
                    fontFamily: 'Prompt, sans-serif',
                    mb: 0.5,
                    lineHeight: 1.2
                  }}>
                    {plan.name}
                  </Typography>
                  <Typography sx={{
                    fontSize: '0.7rem',
                    color: '#6B7280',
                    fontFamily: 'Prompt, sans-serif',
                    mb: 1
                  }}>
                    {plan.calories}
                  </Typography>
                  <Typography sx={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: '#10B981',
                    fontFamily: 'Prompt, sans-serif'
                  }}>
                    ฿{plan.price.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Categories Section */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 2
          }}>
            {categories.map((category) => (
              <Box key={category.id} sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'pointer',
                py: 1.5,
                '&:hover': {
                  '& .category-icon': {
                    transform: 'scale(1.1)',
                    bgcolor: '#F3F4F6'
                  }
                }
              }}>
                <Box className="category-icon" sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  bgcolor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  transition: 'all 0.2s ease',
                  fontSize: '1.5rem'
                }}>
                  {category.icon}
                </Box>
                <Typography sx={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: '#4B5563',
                  fontFamily: 'Prompt, sans-serif'
                }}>
                  {category.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Discount Guaranteed Section */}
          <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ 
                fontSize: '1.1rem',
                fontWeight: 600,
                color: '#1F2937',
                fontFamily: 'Prompt, sans-serif'
              }}>
                Discount Guaranteed!
            </Typography>
              <Typography sx={{ fontSize: '1rem' }}>👑</Typography>
            </Box>
            <Typography sx={{ 
              fontSize: '0.85rem',
              color: '#10B981',
                fontWeight: 500,
              fontFamily: 'Prompt, sans-serif'
            }}>
                See All
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 1.5
          }}>
            {(restaurants.length > 0 ? restaurants : discountRestaurants).map((restaurant) => (
              <Box key={restaurant.id}>
                <Card sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.2s ease'
                }}>
                  {/* PROMO Badge */}
                  <Box sx={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    bgcolor: '#10B981',
                    color: 'white',
                    px: 1,
                    py: 0.3,
                    borderRadius: 1,
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    fontFamily: 'Prompt, sans-serif',
                    zIndex: 2
                  }}>
                    {restaurant.discount} OFF
                  </Box>

                  <Box sx={{
                    height: 100,
                    backgroundImage: `url(${restaurant.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }} />
                  
                  <CardContent sx={{ p: 1.5 }}>
                    <Typography sx={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#1F2937',
                      fontFamily: 'Prompt, sans-serif',
                      mb: 0.5
                    }}>
                      {restaurant.name}
                  </Typography>
                    <Typography sx={{
                      fontSize: '0.7rem',
                      color: '#6B7280',
                fontFamily: 'Prompt, sans-serif',
                      mb: 1
                    }}>
                      {restaurant.category}
            </Typography>
                    
                    {/* Rating and Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                        <Star sx={{ fontSize: 12, color: '#F59E0B' }} />
                        <Typography sx={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          color: '#1F2937',
                          fontFamily: 'Prompt, sans-serif'
                        }}>
                          {restaurant.rating}
                        </Typography>
                      </Box>
                      
                      <Typography sx={{
                        fontSize: '0.65rem',
                        color: '#6B7280',
                        fontFamily: 'Prompt, sans-serif'
                      }}>
                        {restaurant.deliveryTime}
                      </Typography>
                    </Box>
                    
                    <Typography sx={{
                      fontSize: '0.65rem',
                      color: restaurant.deliveryFee === 'Free' ? '#10B981' : '#6B7280',
                      fontWeight: restaurant.deliveryFee === 'Free' ? 600 : 400,
                      fontFamily: 'Prompt, sans-serif',
                      mb: 1
                    }}>
                      Delivery: {restaurant.deliveryFee}
                          </Typography>
                    
                    {/* Add to Cart Button */}
                    <Button
                      size="small"
                      fullWidth
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCartClick(restaurant);
                      }}
                  sx={{ 
                        bgcolor: '#10B981',
                        color: 'white',
                    fontFamily: 'Prompt, sans-serif',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        py: 0.5,
                        borderRadius: 1,
                        textTransform: 'none',
                        '&:hover': {
                          bgcolor: '#059669',
                        },
                      }}
                    >
                      + เพิ่มลงตะกร้า
                    </Button>
                </CardContent>
              </Card>
            </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Footer Navigation - Fixed Position */}
      <FooterNavbar />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* AddToCart Drawer */}
      <AddToCartDrawer
        open={addToCartDrawerOpen}
        onClose={() => setAddToCartDrawerOpen(false)}
        item={selectedMenuItem}
      />
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
} 