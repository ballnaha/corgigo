'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  LinearProgress,
  TextField,
  InputAdornment,
  Stack,
  useTheme,
  useMediaQuery,
  Button,
  Grid,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Fetch restaurants and generate mock menu data
  const fetchMenusData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/restaurants/manage');
      const data = await response.json();
      
      if (data.success) {
        const restaurantsList = data.restaurants || [];
        setRestaurants(restaurantsList);
        
        // Generate mock menu items for each restaurant
        const mockMenus: any[] = [];
        restaurantsList.forEach((restaurant: any) => {
          const menuCount = Math.floor(Math.random() * 8) + 3; // 3-10 items per restaurant
          for (let i = 0; i < menuCount; i++) {
            const categories = ['อาหารจานหลัก', 'ของทานเล่น', 'เครื่องดื่ม', 'ของหวาน'];
            const menuNames = [
              'ผัดไทย', 'ต้มยำกุ้ง', 'แกงเขียวหวานไก่', 'ข้าวผัดกุ้ง', 'สมตำ',
              'ลาบหมู', 'ส้มตำไทย', 'ไก่ย่าง', 'หมูกรอบ', 'ปลาทอด',
              'น้ำส้มโอ', 'ชาเขียว', 'กาแฟเย็น', 'น้ำมะนาว', 'น้ำแตงโม',
              'ไอศกรีม', 'ข้าวเหนียวมะม่วง', 'ทองหยิบ', 'ฟักทองแกง'
            ];
            
            mockMenus.push({
              id: `menu_${restaurant.id}_${i}`,
              name: menuNames[Math.floor(Math.random() * menuNames.length)],
              description: 'เมนูอร่อยจากเชฟมากประสบการณ์',
              price: Math.floor(Math.random() * 200) + 50,
              category: categories[Math.floor(Math.random() * categories.length)],
              image: null,
              available: Math.random() > 0.2, // 80% available
              restaurant: {
                id: restaurant.id,
                name: restaurant.name,
                image: restaurant.image
              },
              createdAt: new Date().toISOString(),
            });
          }
        });
        
        setMenus(mockMenus);
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
                         menu.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
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
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={8}>
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
            </Grid>
            <Grid item xs={12} md={4}>
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
            </Grid>
          </Grid>

          {/* Table / Mobile Cards */}
          {isMobile ? (
            /* Mobile Card Layout */
            <Box sx={{ display: 'grid', gap: 2 }}>
              {filteredMenus.map((menu) => (
                <Card key={menu.id} variant="outlined" sx={{ 
                  p: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: vristoTheme.shadow.elevated,
                    transform: 'translateY(-1px)'
                  }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar 
                      src={menu.image} 
                      sx={{ width: 48, height: 48, bgcolor: vristoTheme.secondary }}
                    >
                      <MenuBook />
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body1" fontWeight="600" sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {menu.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {menu.restaurant.name}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" fontWeight="600" color="primary">
                        ฿{menu.price.toLocaleString()}
                      </Typography>
                      <Chip
                        label={menu.available ? 'มีในสต็อก' : 'หมด'}
                        color={menu.available ? 'success' : 'error'}
                        size="small"
                      />
                    </Box>
                  </Box>
                  
                  <Stack spacing={1.5}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="600">หมวดหมู่</Typography>
                      <Typography variant="body2">{menu.category}</Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="600">รายละเอียด</Typography>
                      <Typography variant="body2">{menu.description}</Typography>
                    </Box>
                  </Stack>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    gap: 1, 
                    mt: 2,
                    pt: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider'
                  }}>
                    <IconButton size="small" color="primary" sx={{ 
                      bgcolor: 'primary.light',
                      '&:hover': { bgcolor: 'primary.main', color: 'white' }
                    }}>
                      <Visibility />
                    </IconButton>
                    <IconButton size="small" color="primary" sx={{ 
                      bgcolor: 'primary.light',
                      '&:hover': { bgcolor: 'primary.main', color: 'white' }
                    }}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error" sx={{ 
                      bgcolor: 'error.light',
                      '&:hover': { bgcolor: 'error.main', color: 'white' }
                    }}>
                      <Delete />
                    </IconButton>
                  </Box>
                </Card>
              ))}
            </Box>
          ) : (
            /* Desktop Table Layout */
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>เมนู</TableCell>
                    <TableCell>ร้านอาหาร</TableCell>
                    <TableCell>หมวดหมู่</TableCell>
                    <TableCell align="right">ราคา</TableCell>
                    <TableCell>สถานะ</TableCell>
                    <TableCell>รายละเอียด</TableCell>
                    <TableCell align="center">การจัดการ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredMenus.map((menu) => (
                    <TableRow key={menu.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar 
                            src={menu.image} 
                            sx={{ width: 40, height: 40, bgcolor: vristoTheme.secondary }}
                          >
                            <MenuBook />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="600">
                              {menu.name}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{menu.restaurant.name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={menu.category}
                          color="primary"
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="600" color="primary">
                          ฿{menu.price.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={menu.available ? 'มีในสต็อก' : 'หมด'}
                          color={menu.available ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{
                          maxWidth: 200,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {menu.description}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" color="primary">
                          <Visibility />
                        </IconButton>
                        <IconButton size="small" color="primary">
                          <Edit />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

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