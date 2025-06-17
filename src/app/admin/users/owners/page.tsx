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
} from '@mui/material';
import {
  Search,
  Edit,
  Block,
  CheckCircle,
  Storefront,
  Restaurant,
  Visibility,
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

export default function OwnersPage() {
  const [loading, setLoading] = useState(true);
  const [owners, setOwners] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Fetch owners data  
  const fetchOwners = async () => {
    try {
      setLoading(true);
      const [usersRes, restaurantsRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/restaurants/manage'),
      ]);
      
      const [usersData, restaurantsData] = await Promise.all([
        usersRes.json(),
        restaurantsRes.json(),
      ]);
      
      if (usersData.success && restaurantsData.success) {
        // Filter only restaurant owners
        const ownerUsers = usersData.users?.filter((user: any) => 
          user.primaryRole === 'RESTAURANT_OWNER' || 
          user.userRoles?.some((role: any) => role.role === 'RESTAURANT_OWNER')
        ) || [];
        
        // Add restaurant count to each owner
        const ownersWithRestaurants = ownerUsers.map((owner: any) => {
          const ownerRestaurants = restaurantsData.restaurants?.filter((restaurant: any) => 
            restaurant.userId === owner.id
          ) || [];
          
          return {
            ...owner,
            restaurantCount: ownerRestaurants.length,
            restaurants: ownerRestaurants,
          };
        });
        
        setOwners(ownersWithRestaurants);
      } else {
        setError('ไม่สามารถโหลดข้อมูลเจ้าของร้านได้');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      console.error('Error fetching owners:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  // Filter owners based on search term
  const filteredOwners = owners.filter(owner =>
    owner.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.phone?.includes(searchTerm)
  );

  if (loading) {
    return (
      <Box sx={{ fontFamily: vristoTheme.font.family }}>
        <Typography variant="h4" fontWeight="600" gutterBottom>
          จัดการเจ้าของร้าน
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ fontFamily: vristoTheme.font.family }}>
      <Typography variant="h4" fontWeight="600" gutterBottom>
        จัดการเจ้าของร้าน ({owners.length} คน)
      </Typography>

      <Card sx={{ boxShadow: vristoTheme.shadow.card, borderRadius: 2 }}>
        <CardContent>
          {/* Search */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="ค้นหาเจ้าของร้าน..."
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
              {filteredOwners.map((owner) => (
                <Card key={owner.id} variant="outlined" sx={{ 
                  p: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: vristoTheme.shadow.elevated,
                    transform: 'translateY(-1px)'
                  }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar 
                      src={owner.avatar} 
                      sx={{ width: 48, height: 48, bgcolor: vristoTheme.secondary }}
                    >
                      {owner.firstName?.charAt(0) || <Storefront />}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body1" fontWeight="600" sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {owner.firstName} {owner.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {owner.id.slice(-8)}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Chip
                        label={`${owner.restaurantCount} ร้าน`}
                        color="primary"
                        size="small"
                        icon={<Restaurant />}
                      />
                    </Box>
                  </Box>
                  
                  <Stack spacing={1.5}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="600">อีเมล</Typography>
                      <Typography variant="body2" sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>{owner.email}</Typography>
                    </Box>
                    
                    {owner.phone && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight="600">เบอร์โทร</Typography>
                        <Typography variant="body2">{owner.phone}</Typography>
                      </Box>
                    )}
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="600">สถานะ</Typography>
                      <Chip
                        label={owner.status === 'ACTIVE' ? 'ใช้งาน' : 'ระงับ'}
                        color={owner.status === 'ACTIVE' ? 'success' : 'error'}
                        size="small"
                      />
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="600">วันที่สมัคร</Typography>
                      <Typography variant="body2">
                        {new Date(owner.createdAt).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </Typography>
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
                    <IconButton 
                      size="small" 
                      color={owner.status === 'ACTIVE' ? 'error' : 'success'}
                      sx={{ 
                        bgcolor: owner.status === 'ACTIVE' ? 'error.light' : 'success.light',
                        '&:hover': { 
                          bgcolor: owner.status === 'ACTIVE' ? 'error.main' : 'success.main',
                          color: 'white' 
                        }
                      }}
                    >
                      {owner.status === 'ACTIVE' ? <Block /> : <CheckCircle />}
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
                    <TableCell>เจ้าของร้าน</TableCell>
                    <TableCell>อีเมล</TableCell>
                    <TableCell>เบอร์โทร</TableCell>
                    <TableCell align="center">จำนวนร้าน</TableCell>
                    <TableCell>สถานะ</TableCell>
                    <TableCell>วันที่สมัคร</TableCell>
                    <TableCell align="center">การจัดการ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOwners.map((owner) => (
                    <TableRow key={owner.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar 
                            src={owner.avatar} 
                            sx={{ width: 40, height: 40, bgcolor: vristoTheme.secondary }}
                          >
                            {owner.firstName?.charAt(0) || <Storefront />}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="600">
                              {owner.firstName} {owner.lastName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {owner.id.slice(-8)}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{owner.email}</TableCell>
                      <TableCell>{owner.phone || '-'}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={owner.restaurantCount}
                          color="primary"
                          size="small"
                          icon={<Restaurant />}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={owner.status === 'ACTIVE' ? 'ใช้งาน' : 'ระงับ'}
                          color={owner.status === 'ACTIVE' ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(owner.createdAt).toLocaleDateString('th-TH')}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" color="primary">
                          <Visibility />
                        </IconButton>
                        <IconButton size="small" color="primary">
                          <Edit />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color={owner.status === 'ACTIVE' ? 'error' : 'success'}
                        >
                          {owner.status === 'ACTIVE' ? <Block /> : <CheckCircle />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {filteredOwners.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                {searchTerm ? 'ไม่พบเจ้าของร้านที่ค้นหา' : 'ยังไม่มีเจ้าของร้านในระบบ'}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
} 