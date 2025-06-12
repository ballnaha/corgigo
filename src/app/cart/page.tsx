'use client';

import { Box, Container, Typography, Card, CardContent } from '@mui/material';
import AppHeader from '@/components/AppHeader';

export default function CartPage() {
  return (
    <Box sx={{ bgcolor: '#FEFEFE', minHeight: '100vh' }}>
      <AppHeader />
      <Container maxWidth="sm" sx={{ py: 3, px: 2 }}>
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>🛒</Typography>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              ตะกร้าสินค้า
            </Typography>
            <Typography variant="body1" color="textSecondary">
              รายการสินค้าที่คุณเลือก
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
} 