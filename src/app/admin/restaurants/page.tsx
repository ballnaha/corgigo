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
  Rating,
  Stack,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  Search,
  Edit,
  Visibility,
  Store,
  LocationOn,
  Close,
  Map,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import MiniMap from '@/components/MiniMap';

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

export default function RestaurantsPage() {
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [mapDialog, setMapDialog] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();

  // Fetch restaurants data
  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/restaurants/manage');
      const data = await response.json();
      
      if (data.success) {
        setRestaurants(data.restaurants || []);
      } else {
        setError('ไม่สามารถโหลดข้อมูลร้านอาหารได้');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      console.error('Error fetching restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleShowMap = (restaurant: any) => {
    setSelectedRestaurant(restaurant);
    setMapDialog(true);
  };

  const handleCloseMap = () => {
    setMapDialog(false);
    setSelectedRestaurant(null);
  };

  // Filter restaurants based on search term
  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (restaurant.user && (
      restaurant.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  const getStatusChip = (status: string, isOpen: boolean) => {
    if (status === 'APPROVED') {
      return (
        <Chip
          label={isOpen ? 'เปิดให้บริการ' : 'ปิดให้บริการ'}
          color={isOpen ? 'success' : 'default'}
          size="small"
        />
      );
    }
    return (
      <Chip
        label={status === 'PENDING' ? 'รอการอนุมัติ' : 'ถูกปฏิเสธ'}
        color={status === 'PENDING' ? 'warning' : 'error'}
        size="small"
      />
    );
  };

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" fontWeight="600" gutterBottom>
          จัดการร้านอาหาร
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ fontFamily: vristoTheme.font.family }}>
      <Typography variant="h4" fontWeight="600" gutterBottom>
        จัดการร้านอาหาร ({restaurants.length} ร้าน)
      </Typography>

      <Card sx={{ boxShadow: vristoTheme.shadow.card, borderRadius: 2 }}>
        <CardContent>
          {/* Search */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="ค้นหาร้านอาหาร..."
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

          {/* Table / Mobile Cards */}
          {isMobile ? (
            /* Mobile Card Layout */
            <Box sx={{ display: 'grid', gap: 2 }}>
              {filteredRestaurants.map((restaurant) => (
                <Card key={restaurant.id} variant="outlined" sx={{ 
                  p: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: vristoTheme.shadow.elevated,
                    transform: 'translateY(-1px)'
                  }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar 
                      src={restaurant.image} 
                      sx={{ width: 48, height: 48 }}
                    >
                      <Store />
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body1" fontWeight="600" sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {restaurant.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {restaurant.id.slice(-8)}
                      </Typography>
                    </Box>
                    {getStatusChip(restaurant.status, restaurant.isOpen)}
                  </Box>
                  
                  <Stack spacing={1.5}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="600">เจ้าของร้าน</Typography>
                      <Typography variant="body2">
                        {restaurant.user ? 
                          `${restaurant.user.firstName} ${restaurant.user.lastName}` : 
                          'ไม่ระบุ'
                        }
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="600">ที่อยู่</Typography>
                      <Typography variant="body2" sx={{ 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        gap: 1,
                        lineHeight: 1.4
                      }}>
                        <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mt: 0.1 }} />
                        <span style={{ wordBreak: 'break-word' }}>{restaurant.address}</span>
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="600">พิกัด</Typography>
                      {restaurant.latitude && restaurant.longitude ? (
                        <Box>
                          <Typography variant="body2" sx={{ fontSize: '0.875rem', fontFamily: 'monospace' }}>
                            Lat: {parseFloat(restaurant.latitude).toFixed(6)}
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: '0.875rem', fontFamily: 'monospace' }}>
                            Lng: {parseFloat(restaurant.longitude).toFixed(6)}
                          </Typography>
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleShowMap(restaurant)}
                            sx={{ mt: 0.5, p: 0.5 }}
                          >
                            <Map fontSize="small" />
                          </IconButton>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.disabled">
                          ไม่มีพิกัด
                        </Typography>
                      )}
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="600">เรตติ้ง</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Rating 
                          value={restaurant.rating || 0} 
                          readOnly 
                          size="small" 
                          precision={0.1}
                        />
                        <Typography variant="caption" color="text.secondary">
                          ({restaurant.rating?.toFixed(1) || '0.0'})
                        </Typography>
                      </Box>
                    </Box>
                    
                    {restaurant.approvedAt && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight="600">วันที่อนุมัติ</Typography>
                        <Typography variant="body2">
                          {new Date(restaurant.approvedAt).toLocaleDateString('th-TH', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </Typography>
                      </Box>
                    )}
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
                      sx={{ 
                        bgcolor: 'primary.light',
                        '&:hover': { bgcolor: 'primary.main', color: 'white' }
                      }}
                      onClick={() => router.push(`/admin/restaurants/${restaurant.id}`)}
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton size="small" color="primary" sx={{ 
                      bgcolor: 'primary.light',
                      '&:hover': { bgcolor: 'primary.main', color: 'white' }
                    }}>
                      <Edit />
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
                    <TableCell>ร้านอาหาร</TableCell>
                    <TableCell>เจ้าของ</TableCell>
                    <TableCell>ที่อยู่</TableCell>
                    <TableCell>พิกัด</TableCell>
                    <TableCell>เรตติ้ง</TableCell>
                    <TableCell>สถานะ</TableCell>
                    <TableCell>วันที่อนุมัติ</TableCell>
                    <TableCell align="center">การจัดการ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRestaurants.map((restaurant) => (
                    <TableRow key={restaurant.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar 
                            src={restaurant.image} 
                            sx={{ width: 40, height: 40 }}
                          >
                            <Store />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="600">
                              {restaurant.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {restaurant.id.slice(-8)}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {restaurant.user ? 
                            `${restaurant.user.firstName} ${restaurant.user.lastName}` : 
                            'ไม่ระบุ'
                          }
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, maxWidth: 200 }}>
                          <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {restaurant.address}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ minWidth: 120 }}>
                          {restaurant.latitude && restaurant.longitude ? (
                            <Box>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                Lat: {parseFloat(restaurant.latitude).toFixed(6)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                Lng: {parseFloat(restaurant.longitude).toFixed(6)}
                              </Typography>
                              <IconButton 
                                size="small" 
                                color="primary"
                                onClick={() => handleShowMap(restaurant)}
                                sx={{ mt: 0.5 }}
                              >
                                <Map fontSize="small" />
                              </IconButton>
                            </Box>
                          ) : (
                            <Typography variant="caption" color="text.disabled">
                              ไม่มีพิกัด
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Rating 
                            value={restaurant.rating || 0} 
                            readOnly 
                            size="small" 
                            precision={0.1}
                          />
                          <Typography variant="caption" color="text.secondary">
                            ({restaurant.rating?.toFixed(1) || '0.0'})
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {getStatusChip(restaurant.status, restaurant.isOpen)}
                      </TableCell>
                      <TableCell>
                        {restaurant.approvedAt ? 
                          new Date(restaurant.approvedAt).toLocaleDateString('th-TH') : 
                          '-'
                        }
                      </TableCell>
                      <TableCell align="center">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => router.push(`/admin/restaurants/${restaurant.id}`)}
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton size="small" color="primary">
                          <Edit />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {filteredRestaurants.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                {searchTerm ? 'ไม่พบร้านอาหารที่ค้นหา' : 'ยังไม่มีร้านอาหารในระบบ'}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Map Dialog */}
      <Dialog
        open={mapDialog}
        onClose={handleCloseMap}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: 'hidden',
          }
        }}
      >
        <DialogTitle sx={{ 
          fontFamily: vristoTheme.font.family,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Map color="primary" />
            <Typography variant="h6" sx={{ fontFamily: vristoTheme.font.family }}>
              ตำแหน่งร้านอาหาร
            </Typography>
          </Box>
          <IconButton onClick={handleCloseMap}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {selectedRestaurant && (
            <Box>
              {/* Restaurant Info */}
              <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar 
                    src={selectedRestaurant.image} 
                    sx={{ width: 50, height: 50 }}
                  >
                    <Store />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="600" sx={{ fontFamily: vristoTheme.font.family }}>
                      {selectedRestaurant.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedRestaurant.address}
                    </Typography>
                  </Box>
                </Box>
                
                {/* Coordinates */}
                <Box sx={{ display: 'flex', gap: 3 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight="600">
                      Latitude
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {selectedRestaurant.latitude ? parseFloat(selectedRestaurant.latitude).toFixed(6) : 'ไม่ระบุ'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight="600">
                      Longitude
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {selectedRestaurant.longitude ? parseFloat(selectedRestaurant.longitude).toFixed(6) : 'ไม่ระบุ'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              {/* Map */}
              <Box sx={{ height: 400 }}>
                {selectedRestaurant.latitude && selectedRestaurant.longitude ? (
                  <MiniMap
                    latitude={parseFloat(selectedRestaurant.latitude)}
                    longitude={parseFloat(selectedRestaurant.longitude)}
                    address={selectedRestaurant.address}
                    width="100%"
                    height="400px"
                    showCoordinates={false}
                    showRefresh={false}
                  />
                ) : (
                  <Box sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    bgcolor: '#f5f5f5',
                    color: 'text.secondary'
                  }}>
                    <Typography>ไม่มีข้อมูลพิกัดสำหรับร้านนี้</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseMap} color="primary">
            ปิด
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 