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
} from '@mui/icons-material';
import { formatThaiDate } from '@/lib/timezone';

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

export default function CustomersPage() {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Fetch customers data  
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      
      if (data.success) {
        // Filter only customers
        const customerUsers = data.users?.filter((user: any) => 
          user.primaryRole === 'CUSTOMER' || 
          user.userRoles?.some((role: any) => role.role === 'CUSTOMER')
        ) || [];
        
        setCustomers(customerUsers);
      } else {
        setError('ไม่สามารถโหลดข้อมูลลูกค้าได้');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer =>
    customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.phone && customer.phone.includes(searchTerm))
  );

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" fontWeight="600" gutterBottom>
          จัดการลูกค้า
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ fontFamily: vristoTheme.font.family }}>
      <Typography variant="h4" fontWeight="600" gutterBottom>
        จัดการลูกค้า ({customers.length} คน)
      </Typography>

      <Card sx={{ boxShadow: vristoTheme.shadow.card, borderRadius: 2 }}>
        <CardContent>
          {/* Search */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="ค้นหาลูกค้า..."
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
              {filteredCustomers.map((customer) => (
                <Card key={customer.id} variant="outlined" sx={{ 
                  p: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: vristoTheme.shadow.elevated,
                    transform: 'translateY(-1px)'
                  }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar 
                      src={customer.avatar} 
                      sx={{ width: 48, height: 48 }}
                    >
                      {customer.firstName.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body1" fontWeight="600" sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {customer.firstName} {customer.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {customer.id.slice(-8)}
                      </Typography>
                    </Box>
                    <Chip
                      label={customer.status === 'ACTIVE' ? 'ใช้งาน' : 'ระงับ'}
                      color={customer.status === 'ACTIVE' ? 'success' : 'error'}
                      size="small"
                    />
                  </Box>
                  
                  <Stack spacing={1.5}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="600">อีเมล</Typography>
                      <Typography variant="body2" sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>{customer.email}</Typography>
                    </Box>
                    
                    {customer.phone && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight="600">เบอร์โทร</Typography>
                        <Typography variant="body2">{customer.phone}</Typography>
                      </Box>
                    )}
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="600">วันที่สมัคร</Typography>
                      <Typography variant="body2">
                        {formatThaiDate(customer.createdAt)}
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
                      <Edit />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color={customer.status === 'ACTIVE' ? 'error' : 'success'}
                      sx={{ 
                        bgcolor: customer.status === 'ACTIVE' ? 'error.light' : 'success.light',
                        '&:hover': { 
                          bgcolor: customer.status === 'ACTIVE' ? 'error.main' : 'success.main',
                          color: 'white' 
                        }
                      }}
                    >
                      {customer.status === 'ACTIVE' ? <Block /> : <CheckCircle />}
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
                    <TableCell>ลูกค้า</TableCell>
                    <TableCell>อีเมล</TableCell>
                    <TableCell>เบอร์โทร</TableCell>
                    <TableCell>สถานะ</TableCell>
                    <TableCell>วันที่สมัคร</TableCell>
                    <TableCell align="center">การจัดการ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar 
                            src={customer.avatar} 
                            sx={{ width: 40, height: 40 }}
                          >
                            {customer.firstName.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="600">
                              {customer.firstName} {customer.lastName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {customer.id.slice(-8)}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.phone || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          label={customer.status === 'ACTIVE' ? 'ใช้งาน' : 'ระงับ'}
                          color={customer.status === 'ACTIVE' ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {formatThaiDate(customer.createdAt)}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" color="primary">
                          <Edit />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color={customer.status === 'ACTIVE' ? 'error' : 'success'}
                        >
                          {customer.status === 'ACTIVE' ? <Block /> : <CheckCircle />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {filteredCustomers.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                {searchTerm ? 'ไม่พบลูกค้าที่ค้นหา' : 'ยังไม่มีลูกค้าในระบบ'}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
} 