'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  LinearProgress,
  TextField,
  InputAdornment,
  Button,
} from '@mui/material';
import {
  Search,
  Edit,
  Delete,
  Add,
  Restaurant,
  AttachMoney,
  Image,
  Visibility,
  MenuBook,
} from '@mui/icons-material';

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
    sidebar: '#ffffff',
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

export default function MenusPage() {
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [menus, setMenus] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);

  // Fetch restaurants and generate mock menu data
  const fetchMenusData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/restaurants/manage');
      const data = await response.json();
      
      if (data.success) {
        const restaurantsList = data.restaurants || [];
        setRestaurants(restaurantsList);
        
        // Fetch real menu data from all restaurants
        const allMenus: any[] = [];
        for (const restaurant of restaurantsList) {
          try {
            const menuResponse = await fetch(`/api/admin/restaurants/${restaurant.id}/menus`);
            const menuData = await menuResponse.json();
            if (menuData.success && menuData.menus) {
              const menusWithRestaurant = menuData.menus.map((menu: any) => ({
                ...menu,
                restaurant: {
                  id: restaurant.id,
                  name: restaurant.name,
                  image: restaurant.avatarUrl || restaurant.image
                }
              }));
              allMenus.push(...menusWithRestaurant);
            }
          } catch (err) {
            console.error(`Error fetching menus for restaurant ${restaurant.id}:`, err);
          }
        }
        
        setMenus(allMenus);
      } else {
        setError('ไม่สามารถโหลดข้อมูลเมนูได้');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      console.error('Error fetching menus:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenusData();
  }, []);

  // Filter menus based on search term and selected restaurant
  const filteredMenus = menus.filter(menu => {
    const matchesSearch = menu.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         menu.restaurant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         menu.category?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRestaurant = selectedRestaurant === 'all' || menu.restaurant.id === selectedRestaurant;
    
    return matchesSearch && matchesRestaurant;
  });

  if (loading) {
    return (
      <Box sx={{ fontFamily: vristoTheme.font.family }}>
        <Typography variant="h4" fontWeight="600" gutterBottom>
          จัดการเมนูอาหาร
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ fontFamily: vristoTheme.font.family }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="600">
          จัดการเมนูอาหาร ({filteredMenus.length} รายการ)
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ bgcolor: vristoTheme.primary }}
        >
          เพิ่มเมนูใหม่
        </Button>
      </Box>

      <Card sx={{ boxShadow: vristoTheme.shadow.card, borderRadius: 2 }}>
        <CardContent>
          {/* Search and Filter */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 3 }}>
            <Box sx={{ flex: { xs: 1, md: 2 } }}>
              <TextField
                fullWidth
                placeholder="ค้นหาเมนู, ร้านอาหาร, หมวดหมู่..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box sx={{ flex: { xs: 1, md: 1 } }}>
              <TextField
                fullWidth
                select
                label="เลือกร้านอาหาร"
                value={selectedRestaurant}
                onChange={(e) => setSelectedRestaurant(e.target.value)}
                SelectProps={{ native: true }}
              >
                <option value="all">ร้านอาหารทั้งหมด</option>
                {restaurants.map((restaurant) => (
                  <option key={restaurant.id} value={restaurant.id}>
                    {restaurant.name}
                  </option>
                ))}
              </TextField>
            </Box>
          </Box>

          {/* 4 Columns Menu Cards */}
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: 3
          }}>
            {filteredMenus.map((menu) => (
              <Box 
                key={menu.id}
                sx={{ 
                  flex: { 
                    xs: '1 1 100%', 
                    sm: '1 1 calc(50% - 12px)', 
                    md: '1 1 calc(33.333% - 16px)',
                    lg: '1 1 calc(25% - 18px)' 
                  } 
                }}
              >
                <Card sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: vristoTheme.shadow.elevated,
                    transform: 'translateY(-2px)'
                  }
                }}>
                  {/* Menu Image */}
                  <Box sx={{ position: 'relative', paddingTop: '60%' }}>
                    <Box
                      component="img"
                      src={menu.image || '/images/CorgiGo (5).png'}
                      alt={menu.name}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    {/* Status Badge */}
                    <Chip
                      label={menu.isAvailable ? 'พร้อมขาย' : 'หมด'}
                      color={menu.isAvailable ? 'success' : 'error'}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: menu.isAvailable ? vristoTheme.success : vristoTheme.danger,
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>

                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Menu Name */}
                    <Typography variant="h6" fontWeight="600" sx={{ mb: 1 }}>
                      {menu.name}
                    </Typography>

                    {/* Restaurant & Category */}
                    <Box sx={{ mb: 1.5 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {menu.restaurant.name}
                      </Typography>
                      {menu.category && (
                        <Chip
                          label={menu.category.name}
                          color="primary"
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>

                    {/* Description */}
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        flexGrow: 1
                      }}
                    >
                      {menu.description || 'ไม่มีคำอธิบาย'}
                    </Typography>

                    {/* Price Section */}
                    <Box sx={{ mb: 2 }}>
                      {menu.originalPrice && menu.originalPrice > menu.price ? (
                        <Box>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              textDecoration: 'line-through',
                              color: 'text.secondary' 
                            }}
                          >
                            ฿{menu.originalPrice.toLocaleString()}
                          </Typography>
                          <Typography 
                            variant="h6" 
                            fontWeight="bold" 
                            color="error.main"
                            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                          >
                            ฿{menu.price.toLocaleString()}
                            <Chip 
                              label={`-${Math.round(((menu.originalPrice - menu.price) / menu.originalPrice) * 100)}%`}
                              color="error"
                              size="small"
                            />
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="h6" fontWeight="bold" color="primary">
                          ฿{menu.price.toLocaleString()}
                        </Typography>
                      )}
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <IconButton 
                        size="small" 
                        color="primary"
                        sx={{ 
                          bgcolor: `${vristoTheme.primary}10`,
                          '&:hover': { bgcolor: vristoTheme.primary, color: 'white' }
                        }}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="primary"
                        sx={{ 
                          bgcolor: `${vristoTheme.secondary}10`,
                          '&:hover': { bgcolor: vristoTheme.secondary, color: 'white' }
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        sx={{ 
                          bgcolor: `${vristoTheme.danger}10`,
                          '&:hover': { bgcolor: vristoTheme.danger, color: 'white' }
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>

          {filteredMenus.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                {searchTerm || selectedRestaurant !== 'all' 
                  ? 'ไม่พบเมนูที่ค้นหา' 
                  : 'ยังไม่มีเมนูในระบบ'
                }
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
} 