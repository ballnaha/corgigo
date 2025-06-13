import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  IconButton,
  BottomNavigation,
  BottomNavigationAction,
  Badge,
  Snackbar,
  Alert,
  CircularProgress,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Search,
  FilterList,
  Person,
  Favorite,
  FavoriteBorder,
  Star,
  Add,
  ShoppingCart,
  Home,
} from '@mui/icons-material';
import Sidebar from '../components/Sidebar';
import CategorySwiper from '../components/CategorySwiper';
import Onboarding from '../components/Onboarding';
import AppHeader from '../components/AppHeader';
import FooterNavbar from '../components/FooterNavbar';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [bottomNavValue, setBottomNavValue] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  // States for API data
  const [categories, setCategories] = useState<any[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Banner images - เพียงแค่รูปภาพ
  const banners = [
    {
      backgroundImage: '/images/banner10percent.webp', // รูปที่มีอยู่แล้ว
      alt: 'โปรโมชั่นส่วนลด 10%'
    },
    {
      backgroundImage: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // รูปอาหารไทย
      alt: 'เมนูอาหารไทย'
    },
    {
      backgroundImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // รูปพิซซ่า
      alt: 'เมนูพิซซ่า'
    }
  ];

  // Auto slide banner
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isDragging) { // Don't auto-slide while user is dragging
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }
    }, 4000); // Change slide every 4 seconds (slower for minimal feel)

    return () => clearInterval(timer);
  }, [isDragging]);

  // Cleanup mouse events
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('mouseleave', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mouseleave', handleGlobalMouseUp);
    };
  }, [isDragging]);

  // Load data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories');
        const categoriesData = await categoriesResponse.json();
        
        // Fetch restaurants
        const restaurantsResponse = await fetch('/api/restaurants?featured=true&limit=10');
        const restaurantsData = await restaurantsResponse.json();
        
        if (categoriesData.success) {
          const mappedCategories = categoriesData.data.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            icon: getCategoryIcon(cat.name),
            active: selectedCategory === cat.name,
            count: cat._count?.menuItems || 0
          }));
          setCategories(mappedCategories);
          
          // Set first category as default if none selected
          if (!selectedCategory && mappedCategories.length > 0) {
            setSelectedCategory(mappedCategories[0].name);
          }
        }
        
        if (restaurantsData.success) {
          setRestaurants(restaurantsData.data);
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to get category icons
  const getCategoryIcon = (categoryName: string) => {
    const iconMap: { [key: string]: string } = {
      'Fast Food': '🍔',
      'Thai Food': '🍜',
      'Italian': '🍝',
      'Japanese': '🍣',
      'Dessert': '🍰',
      'Drinks': '🥤',
      'Pizza': '🍕',
      'Seafood': '🦐',
      'Vegetarian': '🥗',
      'BBQ': '🍖'
    };
    return iconMap[categoryName] || '🍽️';
  };

  // Functions
  const handleAddToCart = (item: { name: string; price?: number }) => {
    setCartCount(prev => prev + 1);
    setSnackbarMessage(`เพิ่ม ${item.name} ลงในตะกร้าแล้ว!`);
    setSnackbarOpen(true);
  };

  const handleBottomNavChange = (event: React.SyntheticEvent, newValue: number) => {
    setBottomNavValue(newValue);
    // Handle navigation based on newValue
    switch (newValue) {
      case 0:
        router.push('/');
        break;
      case 1:
        router.push('/profile');
        break;
      case 2:
        router.push('/favorites');
        break;
      case 3:
        router.push('/cart');
        break;
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    // Update categories active state
    setCategories(prev => prev.map(cat => ({
      ...cat,
      active: cat.name === categoryName
    })));
  };

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setIsDragging(false);

    const endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;
    const threshold = 50; // minimum distance for swipe

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        // Swipe left - next slide
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      } else {
        // Swipe right - previous slide
        setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
      }
    }
  };

  // Mouse handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setIsDragging(false);

    const endX = e.clientX;
    const diffX = startX - endX;
    const threshold = 50;

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      } else {
        setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
      }
    }
  };

  // Show loading while checking session
  if (status === 'loading') {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Show Onboarding if user is not authenticated
  if (!session) {
    return <Onboarding />;
  }

  return (
    <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh', pb: 8 }}>
      {/* Header */}
      <AppHeader 
        onSidebarToggle={() => setSidebarOpen(true)}
        notificationCount={3}
        cartCount={cartCount}
        onSearchChange={(query) => setSearchQuery(query)}
      />

      {/* ใช้ Box แทน Container เพื่อใช้พื้นที่เต็มหน้าจอ */}
      <Box sx={{ px: { xs: 1, sm: 2 }, py: 1 }}>
        {/* Welcome Section - Minimal */}
        <Box sx={{ 
          px: 2, 
          py: 2,
          mb: 2,
        }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'Prompt, sans-serif',
              fontWeight: 500,
              color: '#1A1A1A',
              fontSize: '1.1rem',
            }}
          >
            สวัสดี{session?.user?.name ? ` คุณ${session.user.name}` : ''}! 👋
          </Typography>
        </Box>

        {/* Banner Slider - Fade Effect */}
        <Box sx={{ px: 2, mb: 3 }}>
          <Box 
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClick={(e) => {
              if (!isDragging) {
                console.log('Banner clicked:', banners[currentSlide].alt);
              }
            }}
            sx={{ 
              position: 'relative',
              borderRadius: 2,
              overflow: 'hidden',
              height: 150,
              backgroundColor: '#F8F8F8',
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
              '&:active': {
                cursor: 'grabbing',
              }
            }}
          >
            {/* Background Images with Fade */}
            {banners.map((banner, index) => (
              <Box
                key={index}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${banner.backgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  opacity: index === currentSlide ? 1 : 0,
                  transition: 'opacity 0.5s ease-in-out',
                  zIndex: index === currentSlide ? 2 : 1,
                  visibility: Math.abs(index - currentSlide) <= 1 ? 'visible' : 'hidden', // Optimize rendering
                }}
              />
            ))}
            {/* Minimal Slide Indicators */}
            <Box sx={{
              position: 'absolute',
              bottom: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 0.5,
              zIndex: 10,
            }}>
              {banners.map((_, index) => (
                <Box
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide(index);
                  }}
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: index === currentSlide ? 'white' : 'rgba(255,255,255,0.5)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'white',
                    }
                  }}
                />
              ))}
            </Box>

            {/* Subtle Navigation Hints */}
            <Box
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
              }}
              sx={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '25%',
                height: '100%',
                cursor: 'pointer',
                zIndex: 5,
                display: { xs: 'none', sm: 'block' }, // Hide on mobile (use swipe instead)
              }}
            />
            <Box
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide((prev) => (prev + 1) % banners.length);
              }}
              sx={{
                position: 'absolute',
                right: 0,
                top: 0,
                width: '25%',
                height: '100%',
                cursor: 'pointer',
                zIndex: 5,
                display: { xs: 'none', sm: 'block' }, // Hide on mobile (use swipe instead)
              }}
            />
          </Box>
        </Box>

        {/* Top Categories */}
        <Box sx={{ px: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: 'Prompt, sans-serif',
                fontWeight: 600,
                color: '#1A1A1A',
                fontSize: '1.1rem',
              }}
            >
              Top Categories
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
              Show All
            </Typography>
          </Box>

          {/* Categories Grid */}
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 2,
          }}>
            {loading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 2,
                    bgcolor: 'white',
                    borderRadius: 3,
                    border: '1px solid #F0F0F0',
                  }}
                >
                  <CircularProgress size={24} sx={{ mb: 1 }} />
                  <Typography variant="caption" sx={{ color: '#999' }}>
                    กำลังโหลด...
                  </Typography>
                </Box>
              ))
            ) : (
              categories.slice(0, 4).map((category) => (
                <Box
                  key={category.id}
                  onClick={() => handleCategoryClick(category.name)}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 2,
                    bgcolor: 'white',
                    borderRadius: 3,
                    cursor: 'pointer',
                    border: category.active ? '2px solid #F8A66E' : '1px solid #F0F0F0',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: category.active ? '#F8A66E15' : '#F8F8F8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 1,
                      fontSize: '1.5rem',
                    }}
                  >
                    {category.icon}
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'Prompt, sans-serif',
                      fontWeight: 600,
                      color: '#1A1A1A',
                      fontSize: '0.8rem',
                      textAlign: 'center',
                      mb: 0.5,
                    }}
                  >
                    {category.name}
                  </Typography>

                </Box>
              ))
            )}
          </Box>

          {/* Filter Tags */}
          <Box sx={{ 
            display: 'flex',
            gap: 1,
            mt: 3,
            overflowX: 'auto',
            pb: 1,
            '&::-webkit-scrollbar': { display: 'none' },
          }}>
            {[
              { label: 'Over 4.5', active: true, color: '#F8A66E' },
              { label: 'Nearby', active: false, color: '#E8E8E8' },
              { label: 'Under 30 min', active: false, color: '#E8E8E8' },
              { label: 'Promo', active: false, color: '#E8E8E8' },
            ].map((filter, index) => (
              <Chip
                key={index}
                label={filter.label}
                sx={{
                  bgcolor: filter.active ? filter.color : 'white',
                  color: filter.active ? 'white' : '#666',
                  fontFamily: 'Prompt, sans-serif',
                  fontWeight: 500,
                  fontSize: '0.8rem',
                  border: filter.active ? 'none' : '1px solid #E8E8E8',
                  '&:hover': {
                    bgcolor: filter.active ? filter.color : '#F5F5F5',
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* FooDoor Deals */}
        <Box sx={{ px: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: 'Prompt, sans-serif',
                fontWeight: 600,
                color: '#1A1A1A',
                fontSize: '1.1rem',
              }}
            >
              FooDoor Deals
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
              Show All
            </Typography>
          </Box>

          {/* Deals Carousel */}
          <Box sx={{ 
            display: 'flex',
            gap: 2,
            overflowX: 'auto',
            pb: 1,
            '&::-webkit-scrollbar': { display: 'none' },
          }}>
            {[
              {
                name: 'La Casa',
                rating: 4.9,
                category: 'Seafood, Burgers, Coffee',
                deliveryTime: '31 min',
                deliveryFee: '$3.49',
                image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=200&fit=crop'
              },
              {
                name: 'Barbaras Café',
                rating: 4.7,
                category: 'Breakfast, Café',
                deliveryTime: '25 min',
                deliveryFee: '$2.99',
                image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300&h=200&fit=crop'
              },
            ].map((deal, index) => (
              <Card
                key={index}
                sx={{
                  minWidth: 280,
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: 'none',
                  border: '1px solid #F0F0F0',
                }}
              >
                <Box
                  sx={{
                    height: 140,
                    backgroundImage: `url(${deal.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      left: 8,
                      bgcolor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <Star sx={{ fontSize: 14, color: '#F8A66E' }} />
                    <Typography variant="caption" sx={{ fontFamily: 'Prompt, sans-serif', fontWeight: 500 }}>
                      {deal.rating}
                    </Typography>
                  </Box>
                </Box>
                
                <CardContent sx={{ p: 2 }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontFamily: 'Prompt, sans-serif',
                      fontWeight: 600,
                      mb: 0.5,
                      fontSize: '0.95rem',
                    }}
                  >
                    {deal.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#666',
                      fontFamily: 'Prompt, sans-serif',
                      fontSize: '0.8rem',
                      mb: 1,
                    }}
                  >
                    {deal.category}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#999',
                        fontFamily: 'Prompt, sans-serif',
                      }}
                    >
                      {deal.deliveryTime}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#F8A66E',
                        fontFamily: 'Prompt, sans-serif',
                        fontWeight: 600,
                      }}
                    >
                      Delivery {deal.deliveryFee}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Local Favorites */}
        <Box sx={{ px: 2, mb: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: 'Prompt, sans-serif',
                fontWeight: 600,
                color: '#1A1A1A',
                fontSize: '1.1rem',
              }}
            >
              Local Favorites
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
              Show All
            </Typography>
          </Box>

          {/* Restaurant List */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <Card
                  key={index}
                  sx={{
                    borderRadius: 4,
                    boxShadow: 'none',
                    bgcolor: 'white',
                    border: '1px solid #f0f0f0',
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <CircularProgress size={40} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" sx={{ color: '#999' }}>
                          กำลังโหลดร้านอาหาร...
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))
            ) : restaurants.length > 0 ? (
              restaurants
                .filter(restaurant => 
                  searchQuery === '' || 
                  restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  restaurant.address.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((restaurant) => (
                <Card
                  key={restaurant.id}
                  sx={{
                    borderRadius: 4,
                    boxShadow: 'none',
                    bgcolor: 'white',
                    border: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    },
                  }}
                  onClick={() => router.push(`/restaurant/${restaurant.id}`)}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: 2,
                          backgroundImage: restaurant.image 
                            ? `url(/api/uploads/restaurants/${restaurant.image})`
                            : 'linear-gradient(45deg, #F35C76, #F8A66E)',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontFamily: 'Prompt, sans-serif',
                            fontWeight: 600, 
                            mb: 0.5,
                            color: '#1A1A1A',
                          }}
                        >
                          {restaurant.name}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: '#666', 
                            mb: 1, 
                            display: 'block',
                            fontFamily: 'Prompt, sans-serif',
                          }}
                        >
                          {restaurant.address}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              sx={{
                                fontSize: 12,
                                color: i < Math.floor(restaurant.rating) ? '#F8A66E' : '#e0e0e0',
                              }}
                            />
                          ))}
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              ml: 0.5, 
                              color: '#666',
                              fontFamily: 'Prompt, sans-serif',
                              fontWeight: 500,
                            }}
                          >
                            {restaurant.rating}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              ml: 1, 
                              color: '#999',
                              fontFamily: 'Prompt, sans-serif',
                            }}
                          >
                            ({restaurant._count?.orders || 0} orders)
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#999',
                    fontFamily: 'Prompt, sans-serif',
                  }}
                >
                  ไม่มีร้านอาหารในขณะนี้
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <FooterNavbar cartCount={cartCount} />

      {/* Snackbar for notifications */}
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