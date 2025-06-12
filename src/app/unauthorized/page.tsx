'use client';

import { Box, Typography, Button, Container } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        textAlign="center"
      >
        <Typography variant="h1" color="error" fontWeight="bold" mb={2}>
          403
        </Typography>
        <Typography variant="h4" gutterBottom>
          ไม่ได้รับอนุญาต
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          คุณไม่มีสิทธิ์เข้าถึงหน้านี้
        </Typography>
        
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            onClick={() => router.back()}
          >
            กลับไปหน้าที่แล้ว
          </Button>
          
          {session ? (
            <Button
              variant="outlined"
              onClick={() => signOut({ callbackUrl: '/auth/login' })}
            >
              ออกจากระบบ
            </Button>
          ) : (
            <Button
              variant="outlined"
              onClick={() => router.push('/auth/login')}
            >
              เข้าสู่ระบบ
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
} 