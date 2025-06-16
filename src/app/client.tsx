import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { colors, themes } from '@/config/colors';
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
  Chip,
} from '@mui/material';
import {
  Search,
  Star,
} from '@mui/icons-material';
import Sidebar from '../components/Sidebar';
import Onboarding from '../components/Onboarding';
import AppHeader from '../components/AppHeader';
import FooterNavbar from '../components/FooterNavbar';
import LoadingScreen from '../components/LoadingScreen';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartCount, setCartCount] = useState(2);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [userAddress, setUserAddress] = useState<string>('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Banner slides data
  const bannerSlides = [
    {
      id: 1,
      image: 'images/banner10percent.webp',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=400&fit=crop',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=400&fit=crop',
    },
  ];

  // โหลดข้อมูล profile เพื่อดึง address
  useEffect(() => {
    const loadUserProfile = async () => {
      // รอให้ session โหลดเสร็จก่อน
      if (status === 'loading') return;
      
      if (session?.user) {
      try {
          const response = await fetch('/api/profile');
          if (response.ok) {
            const result = await response.json();
            if (result.success && result.user?.address) {
              setUserAddress(result.user.address);
        }
          }
      } catch (error) {
          console.error('Error loading user profile:', error);
        }
      }
      
      // เสร็จสิ้นการโหลดข้อมูลเริ่มต้น
      setIsInitialLoading(false);
    };

    loadUserProfile();
  }, [session, status]);

  // Auto slide banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [bannerSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'สวัสดีตอนเช้า';
    if (hour < 17) return 'สวัสดีตอนบ่าย';
    return 'สวัสดีตอนเย็น';
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
    <Box className="app-container">
      <AppHeader 
        onSidebarToggle={() => setSidebarOpen(true)}
        notificationCount={3}
        cartCount={cartCount}
        onSearchChange={(query) => setSearchQuery(query)}
        deliveryAddress={userAddress || 'No Location'}
      />

      <Box className="app-content" sx={{ bgcolor: colors.neutral.white, minHeight: '100vh' }}>
        <Box sx={{ px: 2, py: 2 }}>
          <Box sx={{ mb: 3 }}>
          <Typography
              variant="h5"
            sx={{
              fontFamily: 'Prompt, sans-serif',
                fontWeight: 600,
              color: colors.neutral.darkGray,
                fontSize: '1rem',
                mb: 2,
            }}
          >
              {getGreeting()}, คุณ {session?.user?.name || 'ผู้ใช้'}!
          </Typography>

            
            <TextField
              fullWidth
              placeholder="Search dishes, restaurants"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="medium"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#999', fontSize: 20 }} />
                  </InputAdornment>
                ),
            }}
            sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  mb:1.5,
                  bgcolor: '#F8F8F8',
                  border: 'none',
                  '& fieldset': { border: 'none' },
                  '&:hover': { bgcolor: '#F0F0F0' },
                  '&.Mui-focused': {
                    bgcolor: 'white',
                    boxShadow: '0 0 0 2px rgba(248, 166, 110, 0.2)',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  py: 1.5,
                  fontSize: '0.95rem',
                  fontFamily: 'Prompt, sans-serif',
                  '&::placeholder': { color: '#999', opacity: 1 },
                },
              }}
            />

            {/* Banner Slider */}
            <Box sx={{ mb: 3, position: 'relative', borderRadius: 3, overflow: 'hidden' }}>
              <Box
                sx={{
                  height: 200,
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 3,
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {bannerSlides.map((slide, index) => (
              <Box
                    key={slide.id}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                      backgroundImage: `url(${slide.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                      transform: `translateX(${(index - currentSlide) * 100}%)`,
                      transition: 'transform 0.5s ease-in-out',
                }}
              />
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

          <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: 'Prompt, sans-serif',
                fontWeight: 600,
                color: '#1A1A1A',
                  fontSize: '1.2rem',
              }}
            >
                All Categories
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#F8A66E',
                fontFamily: 'Prompt, sans-serif',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
                See All
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex',
            gap: 1,
            overflowX: 'auto',
            pb: 1,
            '&::-webkit-scrollbar': { display: 'none' },
          }}>
              <Chip
                label="All"
                icon={<Box sx={{ fontSize: '16px' }}>🔥</Box>}
                onClick={() => setSelectedCategory('All')}
                sx={{
                  bgcolor: selectedCategory === 'All' ? '#F8A66E' : 'white',
                  color: selectedCategory === 'All' ? 'white' : '#666',
                  fontFamily: 'Prompt, sans-serif',
                  fontWeight: 500,
                  px: 2,
                  py: 1,
                  height: 40,
                  borderRadius: 20,
                  border: selectedCategory === 'All' ? 'none' : '1px solid #E8E8E8',
                  '&:hover': {
                    bgcolor: selectedCategory === 'All' ? '#E8956E' : '#F8F8F8',
                  },
                  '& .MuiChip-icon': {
                    color: selectedCategory === 'All' ? 'white' : '#666',
                  },
                }}
              />
              
              <Chip
                label="Hot Dog"
                icon={<Box sx={{ fontSize: '16px' }}>🌭</Box>}
                onClick={() => setSelectedCategory('Hot Dog')}
                sx={{
                  bgcolor: selectedCategory === 'Hot Dog' ? '#F8A66E' : 'white',
                  color: selectedCategory === 'Hot Dog' ? 'white' : '#666',
                  fontFamily: 'Prompt, sans-serif',
                  fontWeight: 500,
                  px: 2,
                  py: 1,
                  height: 40,
                  borderRadius: 20,
                  border: selectedCategory === 'Hot Dog' ? 'none' : '1px solid #E8E8E8',
                  '&:hover': {
                    bgcolor: selectedCategory === 'Hot Dog' ? '#E8956E' : '#F8F8F8',
                  },
                  '& .MuiChip-icon': {
                    color: selectedCategory === 'Hot Dog' ? 'white' : '#666',
                  },
                }}
              />
              
              <Chip
                label="Burger"
                icon={<Box sx={{ fontSize: '16px' }}>🍔</Box>}
                onClick={() => setSelectedCategory('Burger')}
                sx={{
                  bgcolor: selectedCategory === 'Burger' ? '#F8A66E' : 'white',
                  color: selectedCategory === 'Burger' ? 'white' : '#666',
                  fontFamily: 'Prompt, sans-serif',
                  fontWeight: 500,
                  px: 2,
                  py: 1,
                  height: 40,
                  borderRadius: 20,
                  border: selectedCategory === 'Burger' ? 'none' : '1px solid #E8E8E8',
                  '&:hover': {
                    bgcolor: selectedCategory === 'Burger' ? '#E8956E' : '#F8F8F8',
                  },
                  '& .MuiChip-icon': {
                    color: selectedCategory === 'Burger' ? 'white' : '#666',
                  },
                }}
              />
          </Box>
        </Box>

          <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: 'Prompt, sans-serif',
                fontWeight: 600,
                color: '#1A1A1A',
                  fontSize: '1.2rem',
              }}
            >
                Open Restaurants
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#F8A66E',
                fontFamily: 'Prompt, sans-serif',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
                See All
            </Typography>
          </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Card sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 'none', border: '1px solid #F0F0F0' }}>
                <Box
                  sx={{
                    height: 180,
                    backgroundImage: 'url(https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=200&fit=crop)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                
                <CardContent sx={{ p: 2 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: 'Prompt, sans-serif',
                      fontWeight: 600,
                      mb: 0.5,
                      fontSize: '1.1rem',
                    }}
                  >
                    Rose Garden Restaurant
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#999',
                      fontFamily: 'Prompt, sans-serif',
                      fontSize: '0.9rem',
                      mb: 1.5,
                    }}
                  >
                    Burger - Chicken - Riche - Wings
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Star sx={{ fontSize: 16, color: '#F8A66E' }} />
                    <Typography 
                        variant="body2" 
              sx={{ 
                fontFamily: 'Prompt, sans-serif',
                fontWeight: 600,
                color: '#1A1A1A',
                        }}
                      >
                        4.7
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ 
                        width: 16, 
                        height: 16, 
                        bgcolor: '#4CAF50', 
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Typography sx={{ color: 'white', fontSize: '10px', fontWeight: 'bold' }}>
                          ✓
            </Typography>
                      </Box>
            <Typography 
              variant="body2" 
              sx={{ 
                fontFamily: 'Prompt, sans-serif',
                          color: '#4CAF50',
                fontWeight: 500,
              }}
            >
                        Free
            </Typography>
          </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ 
                        width: 16, 
                        height: 16, 
                        bgcolor: '#FF9800', 
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Typography sx={{ color: 'white', fontSize: '10px', fontWeight: 'bold' }}>
                          ⏱
                        </Typography>
                      </Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: 'Prompt, sans-serif',
                          color: '#FF9800',
                          fontWeight: 500,
                        }}
                      >
                        20 min
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

              <Card sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 'none', border: '1px solid #F0F0F0' }}>
                <Box
                  sx={{
                    height: 180,
                    backgroundImage: 'url(https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=200&fit=crop)',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                
                <CardContent sx={{ p: 2 }}>
                        <Typography 
                    variant="h6" 
                          sx={{ 
                            fontFamily: 'Prompt, sans-serif',
                            fontWeight: 600, 
                            mb: 0.5,
                      fontSize: '1.1rem',
                          }}
                        >
                    Healthy Bowl
                        </Typography>
                        <Typography 
                    variant="body2" 
                          sx={{ 
                      color: '#999',
                            fontFamily: 'Prompt, sans-serif',
                      fontSize: '0.9rem',
                      mb: 1.5,
                          }}
                        >
                    Salad - Healthy - Vegetarian - Fresh
                        </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Star sx={{ fontSize: 16, color: '#F8A66E' }} />
                          <Typography 
                        variant="body2" 
                            sx={{ 
                              fontFamily: 'Prompt, sans-serif',
                          fontWeight: 600,
                          color: '#1A1A1A',
                            }}
                          >
                        4.5
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ 
                        width: 16, 
                        height: 16, 
                        bgcolor: '#4CAF50', 
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Typography sx={{ color: 'white', fontSize: '10px', fontWeight: 'bold' }}>
                          ✓
                          </Typography>
                      </Box>
                          <Typography 
                        variant="body2" 
                            sx={{ 
                              fontFamily: 'Prompt, sans-serif',
                          color: '#4CAF50',
                          fontWeight: 500,
                            }}
                          >
                        Free
                          </Typography>
                        </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ 
                        width: 16, 
                        height: 16, 
                        bgcolor: '#FF9800', 
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Typography sx={{ color: 'white', fontSize: '10px', fontWeight: 'bold' }}>
                          ⏱
                        </Typography>
                      </Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: 'Prompt, sans-serif',
                          color: '#FF9800',
                          fontWeight: 500,
                  }}
                >
                        15 min
                </Typography>
              </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>
      </Box>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <FooterNavbar cartCount={cartCount} />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success" 
          sx={{ 
            width: '100%',
                      bgcolor: '#F35C76',
          color: '#FFFFFF',
            '& .MuiAlert-icon': {
              color: '#382c30',
            },
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
} 