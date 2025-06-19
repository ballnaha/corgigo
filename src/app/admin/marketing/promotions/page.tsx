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
 } from '@mui/material';
import {
  Search,
  Edit,
  Delete,
  Add,
  LocalOffer,
  Visibility,
  Percent,
  Event,
  TrendingUp,
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

export default function PromotionsPage() {
  const [loading, setLoading] = useState(true);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Generate mock promotions data
  const generatePromotions = () => {
    const promotionTypes = ['ส่วนลดเปอร์เซ็นต์', 'ส่วนลดตายตัว', 'ฟรีค่าส่ง', 'ซื้อ 1 แถม 1'];
    const promotionNames = [
      'ลด 10% ทุกเมนู',
      'ฟรีค่าส่งออเดอร์แรก',
      'ส่วนลด 50 บาท เมื่อสั่งครบ 300',
      'ซื้อ 1 แถม 1 เครื่องดื่ม',
      'ลด 20% สำหรับสมาชิกใหม่',
      'ส่วนลด 100 บาท วันเกิด',
      'ฟรีของหวาน เมื่อสั่งครบ 500',
      'ลด 15% ทุกวันอาทิตย์'
    ];
    
    const promotionList = [];
    for (let i = 0; i < 8; i++) {
      const startDate = new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000);
      const endDate = new Date(startDate.getTime() + (Math.random() * 60 + 7) * 24 * 60 * 60 * 1000);
      const isActive = startDate <= new Date() && new Date() <= endDate;
      
      promotionList.push({
        id: `promo_${i + 1}`,
        name: promotionNames[i],
        type: promotionTypes[Math.floor(Math.random() * promotionTypes.length)],
        discount: Math.floor(Math.random() * 30) + 5, // 5-35%
        minOrder: Math.floor(Math.random() * 300) + 100, // 100-400 baht
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        isActive,
        usageCount: Math.floor(Math.random() * 500) + 50,
        maxUsage: Math.floor(Math.random() * 1000) + 500,
        revenue: Math.floor(Math.random() * 100000) + 10000,
        description: 'โปรโมชั่นพิเศษสำหรับลูกค้า CorgiGo',
        code: `CORGI${String(i + 1).padStart(2, '0')}`,
        status: isActive ? 'ใช้งาน' : (startDate > new Date() ? 'รอเริ่ม' : 'หมดอายุ')
      });
    }
    
    return promotionList;
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setPromotions(generatePromotions());
      setLoading(false);
    }, 500);
  }, []);

  // Filter promotions based on search term
  const filteredPromotions = promotions.filter(promotion => 
    promotion.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    promotion.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    promotion.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ fontFamily: vristoTheme.font.family }}>
        <Typography variant="h4" fontWeight="600" gutterBottom>
          จัดการโปรโมชั่น
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ fontFamily: vristoTheme.font.family }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="600">
          จัดการโปรโมชั่น ({filteredPromotions.length} รายการ)
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ bgcolor: vristoTheme.primary }}
        >
          เพิ่มโปรโมชั่น
        </Button>
      </Box>

      {/* Summary Cards */}
      <Box sx={ display: 'grid', gap: 3, { mb: 4  }>
        <Box>
          <Card sx={{ 
            p: 2, 
            boxShadow: vristoTheme.shadow.card,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #4361ee 0%, #5a72f0 100%)',
            color: 'white'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" fontWeight="700">
                  {promotions.filter(p => p.isActive).length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  โปรโมชั่นที่ใช้งาน
                </Typography>
              </Box>
              <LocalOffer sx={{ fontSize: 32, opacity: 0.8 }} />
            </Box>
          </Card>
        </Box>

        <Box>
          <Card sx={{ 
            p: 2, 
            boxShadow: vristoTheme.shadow.card,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #1abc9c 0%, #16a085 100%)',
            color: 'white'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" fontWeight="700">
                  {promotions.reduce((sum, p) => sum + p.usageCount, 0).toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  ครั้งที่ใช้งาน
                </Typography>
              </Box>
              <TrendingUp sx={{ fontSize: 32, opacity: 0.8 }} />
            </Box>
          </Card>
        </Box>

        <Box>
          <Card sx={{ 
            p: 2, 
            boxShadow: vristoTheme.shadow.card,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
            color: 'white'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" fontWeight="700">
                  ฿{promotions.reduce((sum, p) => sum + p.revenue, 0).toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  รายได้จากโปรโมชั่น
                </Typography>
              </Box>
              <Percent sx={{ fontSize: 32, opacity: 0.8 }} />
            </Box>
          </Card>
        </Box>

        <Box>
          <Card sx={{ 
            p: 2, 
            boxShadow: vristoTheme.shadow.card,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
            color: 'white'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" fontWeight="700">
                  {promotions.filter(p => p.status === 'รอเริ่ม').length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  รอเริ่มใช้งาน
                </Typography>
              </Box>
              <Event sx={{ fontSize: 32, opacity: 0.8 }} />
            </Box>
          </Card>
        </Box>
      </Box>

      <Card sx={{ boxShadow: vristoTheme.shadow.card, borderRadius: 2 }}>
        <CardContent>
          {/* Search */}
          <TextField
            fullWidth
            placeholder="ค้นหาโปรโมชั่น, รหัส, ประเภท..."
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
              {filteredPromotions.map((promotion) => (
                <Card key={promotion.id} variant="outlined" sx={{ 
                  p: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: vristoTheme.shadow.elevated,
                    transform: 'translateY(-1px)'
                  }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ width: 48, height: 48, bgcolor: vristoTheme.secondary }}>
                      <LocalOffer />
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body1" fontWeight="600" sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {promotion.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        รหัส: {promotion.code}
                      </Typography>
                    </Box>
                    <Chip
                      label={promotion.status}
                      color={promotion.status === 'ใช้งาน' ? 'success' : 
                             promotion.status === 'รอเริ่ม' ? 'warning' : 'error'}
                      size="small"
                    />
                  </Box>
                  
                  <Stack spacing={1.5}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="600">ประเภท</Typography>
                      <Typography variant="body2">{promotion.type}</Typography>
                    </Box>
                    
                    <Box sx={ display: 'grid', gap: 2 }>
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight="600">ส่วนลด</Typography>
                        <Typography variant="body2" fontWeight="600" color="primary">
                          {promotion.discount}%
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight="600">ใช้งานแล้ว</Typography>
                        <Typography variant="body2" fontWeight="600" color="success">
                          {promotion.usageCount}/{promotion.maxUsage}
                        </Typography>
                      </Box>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="600">ระยะเวลา</Typography>
                      <Typography variant="body2">
                        {new Date(promotion.startDate).toLocaleDateString('th-TH')} - {new Date(promotion.endDate).toLocaleDateString('th-TH')}
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
                    <TableCell>โปรโมชั่น</TableCell>
                    <TableCell>ประเภท</TableCell>
                    <TableCell align="center">ส่วนลด</TableCell>
                    <TableCell align="center">การใช้งาน</TableCell>
                    <TableCell>ระยะเวลา</TableCell>
                    <TableCell>สถานะ</TableCell>
                    <TableCell align="center">การจัดการ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPromotions.map((promotion) => (
                    <TableRow key={promotion.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ width: 40, height: 40, bgcolor: vristoTheme.secondary }}>
                            <LocalOffer />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="600">
                              {promotion.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              รหัส: {promotion.code}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={promotion.type}
                          color="primary"
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight="600" color="primary">
                          {promotion.discount}%
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">
                          {promotion.usageCount}/{promotion.maxUsage}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={(promotion.usageCount / promotion.maxUsage) * 100}
                          sx={{ mt: 0.5, height: 4, borderRadius: 2 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(promotion.startDate).toLocaleDateString('th-TH')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ถึง {new Date(promotion.endDate).toLocaleDateString('th-TH')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={promotion.status}
                          color={promotion.status === 'ใช้งาน' ? 'success' : 
                                 promotion.status === 'รอเริ่ม' ? 'warning' : 'error'}
                          size="small"
                        />
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

          {filteredPromotions.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                {searchTerm ? 'ไม่พบโปรโมชั่นที่ค้นหา' : 'ยังไม่มีโปรโมชั่นในระบบ'}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
} 