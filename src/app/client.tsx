import React, { useState } from 'react';
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

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Fast Food');
  const [bottomNavValue, setBottomNavValue] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Mock data
  const foodItems = [
    {
      id: '1',
      name: 'Grilled skewers',
      description: 'Spicy chicken',
      price: 6.00,
      image: '/api/placeholder/150/150',
      category: 'Fast Food',
    },
    {
      id: '2',
      name: 'Thai Spaghetti',
      description: 'Fresh Tomato',
      price: 12.00,
      image: '/api/placeholder/150/150',
      category: 'Fast Food',
    },
    {
      id: '3',
      name: 'Mexican Bowl',
      description: 'Spicy mix',
      price: 25.00,
      image: '/api/placeholder/150/150',
      category: 'Fast Food',
    },
    {
      id: '4',
      name: 'Fresh Orange',
      description: 'Vitamin C',
      price: 3.50,
      image: '/api/placeholder/150/150',
      category: 'Fruites',
    },
    {
      id: '5',
      name: 'Apple Juice',
      description: 'Fresh blend',
      price: 4.00,
      image: '/api/placeholder/150/150',
      category: 'Drinks',
    },
  ];

  const restaurants = [
    {
      id: '1',
      name: 'Foodcove Restaurant',
      location: 'New York, Australia',
      rating: 4.5,
      image: '/api/placeholder/80/80',
    },
    {
      id: '2',
      name: 'Domino Pizza',
      location: 'New York, Australia',
      rating: 4.8,
      image: '/api/placeholder/80/80',
    },
  ];

  const categories = [
    { name: 'Fast Food', icon: '🍔', active: selectedCategory === 'Fast Food' },
    { name: 'Fruites', icon: '🍎', active: selectedCategory === 'Fruites' },
    { name: 'Drinks', icon: '🥤', active: selectedCategory === 'Drinks' },
    { name: 'Pizza', icon: '🍕', active: selectedCategory === 'Pizza' },
    { name: 'Dessert', icon: '🍰', active: selectedCategory === 'Dessert' },
  ];

  // Functions
  const handleAddToCart = (item: { name: string; price: number }) => {
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

  const filteredFoodItems = foodItems.filter(item => 
    item.category === selectedCategory
  );

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
    <Box sx={{ bgcolor: '#FEFEFE', minHeight: '100vh', pb: 8, margin: 0, padding: 0 }}>
      {/* Header */}
      <AppHeader 
        onSidebarToggle={() => setSidebarOpen(true)}
        notificationCount={3}
      />

      <Container maxWidth="sm" sx={{ px: 1, py: 1, margin: 0, maxWidth: '100% !important' }}>
        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Healty Food"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: 'gray' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <FilterList />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              bgcolor: 'white',
              border: 'none',
              '& fieldset': {
                border: 'none',
              },
            },
          }}
        />

        {/* Category Swiper */}
        <CategorySwiper
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Food Grid */}
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: 2, 
            mb: 4 
          }}
        >
          {filteredFoodItems.map((item) => (
            <Card
              key={item.id}
              sx={{
                borderRadius: 4,
                boxShadow: 'none',
                bgcolor: 'white',
                border: '1px solid #f0f0f0',
                position: 'relative',
                overflow: 'visible',
              }}
            >
              <Box sx={{ position: 'relative', p: 2 }}>
                {/* Food Image */}
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    background: 'linear-gradient(45deg, #F35C76, #F8A66E)',
                  }}
                >
                  <Typography variant="h4">🍖</Typography>
                </Box>
                
                {/* Heart Icon */}
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'white',
                    width: 24,
                    height: 24,
                    boxShadow: 1,
                  }}
                >
                  <FavoriteBorder sx={{ fontSize: 14, color: '#F35C76' }} />
                </IconButton>

                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ fontWeight: 600, mb: 0.5, fontSize: '0.9rem' }}
                  >
                    {item.name}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ color: 'gray', mb: 1, display: 'block' }}
                  >
                    {item.description}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ fontWeight: 700, color: '#F8A66E' }}
                  >
                    ${item.price.toFixed(2)}
                  </Typography>
                </CardContent>

                                  {/* Add Button */}
                  <IconButton
                    onClick={() => handleAddToCart(item)}
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                                              bgcolor: '#F8A66E',
                      width: 24,
                      height: 24,
                      '&:hover': {
                        bgcolor: '#F35C76',
                      },
                    }}
                  >
                    <Add sx={{ fontSize: 16, color: 'black' }} />
                  </IconButton>
              </Box>
            </Card>
          ))}
        </Box>

        {/* Favorite Restaurants */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Favorite Restaurants
          </Typography>
                        <Typography variant="body2" sx={{ color: '#F8A66E', fontWeight: 500 }}>
            See all
          </Typography>
        </Box>

        {/* Restaurant Cards */}
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
          {restaurants.map((restaurant) => (
            <Card
              key={restaurant.id}
              sx={{
                minWidth: 280,
                borderRadius: 4,
                boxShadow: 'none',
                bgcolor: 'white',
                border: '1px solid #f0f0f0',
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 2,
                      bgcolor: '#f5f5f5',
                      background: 'linear-gradient(45deg, #F35C76, #F8A66E)',
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {restaurant.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'gray', mb: 1, display: 'block' }}>
                      {restaurant.location}
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
                      <Typography variant="caption" sx={{ ml: 0.5, color: 'gray' }}>
                        {restaurant.rating}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Bottom Navigation */}
      <BottomNavigation
        value={bottomNavValue}
        onChange={handleBottomNavChange}
                  sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: '#382c30',
            borderRadius: 0,
            height: 70,
            margin: 0,
            padding: 0,
            '& .MuiBottomNavigationAction-root': {
              color: '#A0969A',
              minWidth: 'auto',
              '&.Mui-selected': {
                color: '#F8A66E',
              },
            },
          }}
      >
        <BottomNavigationAction icon={<Home />} label="หน้าแรก" />
        <BottomNavigationAction icon={<Person />} label="โปรไฟล์" />
        <BottomNavigationAction icon={<Favorite />} label="รายการโปรด" />
        <BottomNavigationAction 
          icon={
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCart />
            </Badge>
          } 
          label="ตะกร้า" 
        />
      </BottomNavigation>

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