import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
  BottomNavigation,
  BottomNavigationAction,
  AppBar,
  Toolbar,
  Badge,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Search,
  Menu,
  FilterList,
  GridView,
  Person,
  Favorite,
  CalendarMonth,
  FavoriteBorder,
  Star,
  Add,
  ShoppingCart,
  Home,
  Notifications,
} from '@mui/icons-material';
import Sidebar from '../components/Sidebar';
import CategorySwiper from '../components/CategorySwiper';

export default function HomePage() {
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
  const handleAddToCart = (item: any) => {
    setCartCount(prev => prev + 1);
    setSnackbarMessage(`เพิ่ม ${item.name} ลงในตะกร้าแล้ว!`);
    setSnackbarOpen(true);
  };

  const handleBottomNavChange = (event: React.SyntheticEvent, newValue: number) => {
    setBottomNavValue(newValue);
    // Handle navigation based on newValue
    switch (newValue) {
      case 0:
        console.log('Navigate to Home');
        break;
      case 1:
        console.log('Navigate to Profile');
        break;
      case 2:
        console.log('Navigate to Favorites');
        break;
      case 3:
        console.log('Navigate to Cart');
        break;
    }
  };

  const filteredFoodItems = foodItems.filter(item => 
    item.category === selectedCategory
  );

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', pb: 8 }}>
      {/* Header */}
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          bgcolor: 'white', 
          color: 'black',
          borderRadius: { xs: 0, sm: '20px 20px 0 0' }
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <IconButton onClick={() => setSidebarOpen(true)}>
            <Menu />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Search Food
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton>
              <Badge badgeContent={3} color="error">
                <Notifications />
              </Badge>
            </IconButton>
            <Avatar 
              src="/api/placeholder/40/40" 
              sx={{ width: 40, height: 40 }}
            />
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ px: 2, py: 2 }}>
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
                    background: 'linear-gradient(45deg, #ff6b6b, #ffd93d)',
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
                  <FavoriteBorder sx={{ fontSize: 14, color: '#ff6b6b' }} />
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
                    sx={{ fontWeight: 700, color: '#FFD700' }}
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
                      bgcolor: '#FFD700',
                      width: 24,
                      height: 24,
                      '&:hover': {
                        bgcolor: '#E6C200',
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
          <Typography variant="body2" sx={{ color: '#FFD700', fontWeight: 500 }}>
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
                      background: 'linear-gradient(45deg, #ff9a9e, #fecfef)',
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
                            color: i < Math.floor(restaurant.rating) ? '#FFD700' : '#e0e0e0',
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
          bgcolor: 'black',
          borderRadius: '20px 20px 0 0',
          height: 70,
          '& .MuiBottomNavigationAction-root': {
            color: 'gray',
            minWidth: 'auto',
            '&.Mui-selected': {
              color: '#FFD700',
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
            bgcolor: '#FFD700',
            color: 'black',
            '& .MuiAlert-icon': {
              color: 'black',
            },
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
} 