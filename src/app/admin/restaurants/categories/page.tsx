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
  Button, Box, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
 } from '@mui/material';
import {
  Search,
  Edit,
  Delete,
  Add,
  Category,
  Visibility,
  Store,
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

export default function CategoriesPage() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Fetch categories data
  const fetchCategoriesData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories');
      const data = await response.json();
      
      if (data.success) {
        const categoriesList = data.categories || [];
        
        // Add mock restaurant count and additional info
        const enhancedCategories = categoriesList.map((category: any) => ({
          ...category,
          restaurantCount: Math.floor(Math.random() * 25) + 5, // 5-30 restaurants
          orderCount: Math.floor(Math.random() * 500) + 100, // 100-600 orders
          popularityRank: Math.floor(Math.random() * 10) + 1,
          isActive: Math.random() > 0.1, // 90% active
          createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        }));
        
        setCategories(enhancedCategories);
      } else {
        setError('ไม่สามารถโหลดข้อมูลหมวดหมู่ได้');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesData();
  }, []);

  // Filter categories based on search term
  const filteredCategories = categories.filter(category => 
    category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewCategory = (category: any) => {
    setSelectedCategory(category);
    setOpenDialog(true);
  };

  if (loading) {
    return (
      <Box sx={{ fontFamily: vristoTheme.font.family }}>
        <Typography variant="h4" fontWeight="600" gutterBottom>
          จัดการหมวดหมู่
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ fontFamily: vristoTheme.font.family }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="600">
          จัดการหมวดหมู่ ({filteredCategories.length} หมวด)
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ bgcolor: vristoTheme.primary }}
        >
          เพิ่มหมวดหมู่ใหม่
        </Button>
      </Box>

      <Card sx={{ boxShadow: vristoTheme.shadow.card, borderRadius: 2 }}>
        <CardContent>
          {/* Search */}
          <TextField
            fullWidth
            placeholder="ค้นหาหมวดหมู่..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          {/* Table / Mobile Cards */}
          {isMobile ? (
            /* Mobile Card Layout */
            <Box sx={{ display: 'grid', gap: 2 }}>
              {filteredCategories.map((category) => (
                <Card key={category.id} variant="outlined" sx={{ 
                  p: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: vristoTheme.shadow.elevated,
                    transform: 'translateY(-1px)'
                  }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar 
                      src={category.image} 
                      sx={{ width: 48, height: 48, bgcolor: vristoTheme.secondary }}
                    >
                      <Category />
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body1" fontWeight="600" sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {category.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        อันดับความนิยม #{category.popularityRank}
                      </Typography>
                    </Box>
                    <Chip
                      label={category.isActive ? 'ใช้งาน' : 'ปิดใช้งาน'}
                      color={category.isActive ? 'success' : 'error'}
                      size="small"
                    />
                  </Box>
                  
                  <Stack spacing={1.5}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="600">รายละเอียด</Typography>
                      <Typography variant="body2">{category.description || 'ไม่มีรายละเอียด'}</Typography>
                    </Box>
                    
                    <Box sx={ display: 'grid', gap: 2 }>
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight="600">ร้านอาหาร</Typography>
                        <Typography variant="body2" fontWeight="600" color="primary">
                          {category.restaurantCount} ร้าน
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight="600">ออเดอร์ทั้งหมด</Typography>
                        <Typography variant="body2" fontWeight="600" color="success">
                          {category.orderCount.toLocaleString()} ออเดอร์
                        </Typography>
                      </Box>
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
                    <IconButton 
                      size="small" 
                      color="primary" 
                      onClick={() => handleViewCategory(category)}
                      sx={{ 
                        bgcolor: 'primary.light',
                        '&:hover': { bgcolor: 'primary.main', color: 'white' }
                      }}
                    >
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
                    <TableCell>หมวดหมู่</TableCell>
                    <TableCell>รายละเอียด</TableCell>
                    <TableCell align="center">จำนวนร้าน</TableCell>
                    <TableCell align="center">ยอดออเดอร์</TableCell>
                    <TableCell align="center">อันดับความนิยม</TableCell>
                    <TableCell>สถานะ</TableCell>
                    <TableCell align="center">การจัดการ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar 
                            src={category.image} 
                            sx={{ width: 40, height: 40, bgcolor: vristoTheme.secondary }}
                          >
                            <Category />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="600">
                              {category.name}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{
                          maxWidth: 200,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {category.description || 'ไม่มีรายละเอียด'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight="600" color="primary">
                          {category.restaurantCount}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight="600" color="success">
                          {category.orderCount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={`#${category.popularityRank}`}
                          color="info"
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={category.isActive ? 'ใช้งาน' : 'ปิดใช้งาน'}
                          color={category.isActive ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleViewCategory(category)}
                        >
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

          {filteredCategories.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                {searchTerm ? 'ไม่พบหมวดหมู่ที่ค้นหา' : 'ยังไม่มีหมวดหมู่ในระบบ'}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Category Detail Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>รายละเอียดหมวดหมู่</DialogTitle>
        <DialogContent>
          {selectedCategory && (
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar 
                  src={selectedCategory.image} 
                  sx={{ width: 60, height: 60, bgcolor: vristoTheme.secondary }}
                >
                  <Category />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="600">
                    {selectedCategory.name}
                  </Typography>
                  <Chip
                    label={selectedCategory.isActive ? 'ใช้งาน' : 'ปิดใช้งาน'}
                    color={selectedCategory.isActive ? 'success' : 'error'}
                    size="small"
                  />
                </Box>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                  รายละเอียด
                </Typography>
                <Typography variant="body2">
                  {selectedCategory.description || 'ไม่มีรายละเอียด'}
                </Typography>
              </Box>
              
              <Box sx={ display: 'grid', gap: 2 }>
                <Box>
                  <Typography variant="subtitle2" fontWeight="600">
                    จำนวนร้านอาหาร
                  </Typography>
                  <Typography variant="h5" color="primary" fontWeight="600">
                    {selectedCategory.restaurantCount}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight="600">
                    ยอดออเดอร์
                  </Typography>
                  <Typography variant="h5" color="success" fontWeight="600">
                    {selectedCategory.orderCount.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" fontWeight="600">
                  อันดับความนิยม
                </Typography>
                <Typography variant="h5" color="info" fontWeight="600">
                  #{selectedCategory.popularityRank}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" fontWeight="600">
                  วันที่สร้าง
                </Typography>
                <Typography variant="body2">
                  {new Date(selectedCategory.createdAt).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>ปิด</Button>
          <Button variant="contained" color="primary">แก้ไข</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 