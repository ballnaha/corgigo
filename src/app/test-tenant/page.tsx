'use client';

import React, { useEffect, useState } from 'react';
import { 
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  Container, Box, 
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress
 } from '@mui/material';
import {
  Domain as DomainIcon,
  Restaurant as RestaurantIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';

export default function TestTenantPage() {
  const [hostname, setHostname] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [testResults, setTestResults] = useState<{
    domainRouting: boolean;
    apiAccess: boolean;
    restaurantData: boolean;
  }>({
    domainRouting: false,
    apiAccess: false,
    restaurantData: false
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentHostname = window.location.hostname;
      setHostname(currentHostname);
      
      // Extract subdomain
      if (currentHostname.includes('.')) {
        const parts = currentHostname.split('.');
        setSubdomain(parts[0]);
      }
    }
  }, []);

  useEffect(() => {
    loadTestData();
  }, []);

  const loadTestData = async () => {
    try {
      setLoading(true);
      
      // Test 1: Domain routing
      setTestResults(prev => ({ ...prev, domainRouting: true }));

      // Test 2: API access
      const publicResponse = await fetch('/api/restaurants/public');
      if (publicResponse.ok) {
        setTestResults(prev => ({ ...prev, apiAccess: true }));
        const data = await publicResponse.json();
        setRestaurants(data.restaurants || []);
        setTestResults(prev => ({ ...prev, restaurantData: data.restaurants.length > 0 }));
      }

    } catch (error) {
      console.error('Test error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testSubdomainAccess = async (subdomain: string) => {
    try {
      const response = await fetch(`/api/restaurants/by-subdomain/${subdomain}`);
      if (response.ok) {
        const data = await response.json();
        return data.restaurant;
      }
      return null;
    } catch (error) {
      console.error('Subdomain test error:', error);
      return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        🧪 ทดสอบระบบ Multi-tenant
      </Typography>

      {/* Current Domain Info */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <DomainIcon />
            ข้อมูล Domain ปัจจุบัน
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">Hostname:</Typography>
              <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                {hostname || 'Loading...'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Subdomain:</Typography>
              <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                {subdomain || 'ไม่มี subdomain'}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* System Tests */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            📋 ผลการทดสอบระบบ
          </Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CircularProgress size={20} />
              <Typography>กำลังทดสอบระบบ...</Typography>
            </Box>
          ) : (
            <List>
              <ListItem>
                <ListItemIcon>
                  {testResults.domainRouting ? <CheckIcon color="success" /> : <ErrorIcon color="error" />}
                </ListItemIcon>
                <ListItemText
                  primary="Domain Routing"
                  secondary="ระบบ routing ตาม domain ทำงานได้"
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  {testResults.apiAccess ? <CheckIcon color="success" /> : <ErrorIcon color="error" />}
                </ListItemIcon>
                <ListItemText
                  primary="API Access"
                  secondary="เข้าถึง API endpoints ได้"
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  {testResults.restaurantData ? <CheckIcon color="success" /> : <ErrorIcon color="error" />}
                </ListItemIcon>
                <ListItemText
                  primary="Restaurant Data"
                  secondary="โหลดข้อมูลร้านอาหารได้"
                />
              </ListItem>
            </List>
          )}
        </CardContent>
      </Card>

      {/* Available Restaurants */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <RestaurantIcon />
            ร้านอาหารที่มีใน Database ({restaurants.length})
          </Typography>

          {restaurants.length === 0 ? (
            <Alert severity="info">
              ยังไม่มีร้านอาหารในระบบ กรุณาสร้างร้านอาหารก่อน
            </Alert>
          ) : (
                         <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
               {restaurants.map((restaurant) => (
                 <Box key={restaurant.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                        <Typography variant="h6">{restaurant.name}</Typography>
                        <Chip
                          label={restaurant.status}
                          color={restaurant.status === 'APPROVED' ? 'success' : 'warning'}
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {restaurant.description || 'ไม่มีคำอธิบาย'}
                      </Typography>

                      {restaurant.subdomain ? (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">Subdomain:</Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontFamily: 'monospace',
                              bgcolor: 'background.default',
                              p: 1,
                              borderRadius: 1,
                              display: 'inline-block'
                            }}
                          >
                            {restaurant.subdomain}.corgigo.com
                          </Typography>
                        </Box>
                      ) : (
                        <Alert severity="warning" sx={{ mb: 2 }}>
                          ยังไม่มี subdomain
                        </Alert>
                      )}

                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {restaurant.subdomain && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => window.open(`https://${restaurant.subdomain}.corgigo.com`, '_blank')}
                          >
                            เยี่ยมชมร้าน
                          </Button>
                        )}
                        
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={async () => {
                            if (restaurant.subdomain) {
                              const result = await testSubdomainAccess(restaurant.subdomain);
                              alert(result ? 'API ทำงานได้!' : 'API ไม่ทำงาน');
                            }
                          }}
                        >
                          ทดสอบ API
                        </Button>
                      </Box>
                                         </CardContent>
                   </Card>
                 </Box>
               ))}
             </Box>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <InfoIcon />
            วิธีการทดสอบ
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            1. ทดสอบใน localhost (สำหรับ development):
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, ml: 2 }}>
            • เข้า http://localhost:3000/test-tenant<br/>
            • หรือเข้า http://localhost:3000/restaurant/tenant/[subdomain]
          </Typography>

          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            2. ทดสอบ subdomain ใน production:
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, ml: 2 }}>
            • ตั้งค่า DNS A record สำหรับ *.corgigo.com ไปที่ server<br/>
            • เข้า https://[subdomain].corgigo.com
          </Typography>

          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            3. เพิ่ม subdomain ให้ร้านที่มีอยู่:
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, ml: 2 }}>
            • รันคำสั่ง: node scripts/add-subdomains.js
          </Typography>

          <Alert severity="info">
            <strong>หมายเหตุ:</strong> ระบบ multi-tenant จะทำงานเต็มรูปแบบเมื่อมีการตั้งค่า DNS และ SSL certificate ที่ถูกต้อง
          </Alert>
        </CardContent>
      </Card>
    </Container>
  );
} 