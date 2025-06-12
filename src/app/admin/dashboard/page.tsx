'use client';

import { Box, Typography, Container, Card, CardContent, Button } from '@mui/material';
import { useAdminAuth } from '@/hooks/useAuth';
import { signOut } from 'next-auth/react';

export default function AdminDashboard() {
  const { user, isLoading } = useAdminAuth();

  if (isLoading) {
    return <div>กำลังโหลด...</div>;
  }

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" fontWeight="bold">
            แผงควบคุมผู้ดูแลระบบ
          </Typography>
          <Button
            variant="outlined"
            onClick={() => signOut({ callbackUrl: '/auth/login' })}
          >
            ออกจากระบบ
          </Button>
        </Box>

        <Typography variant="h6" gutterBottom>
          ยินดีต้อนรับ, {user?.name}
        </Typography>

        <Box 
          display="grid" 
          gridTemplateColumns={{ xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
          gap={3} 
          mt={2}
        >
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                ผู้ใช้ทั้งหมด
              </Typography>
              <Typography variant="h4">0</Typography>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                ร้านอาหาร
              </Typography>
              <Typography variant="h4">0</Typography>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                ไรเดอร์
              </Typography>
              <Typography variant="h4">0</Typography>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                ออเดอร์วันนี้
              </Typography>
              <Typography variant="h4">0</Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
} 