'use client';

import { Box, Typography, Button, Container, Card, CardContent, Stack, Chip } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  Block, 
  ArrowBack, 
  Login, 
  Logout, 
  Restaurant, 
  LocalOffer,
  Fastfood 
} from '@mui/icons-material';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const featuredFoods = [
    { name: 'ข้าวผัดกุ้ง', price: '฿89', emoji: '🍤' },
    { name: 'ส้มตำไทย', price: '฿59', emoji: '🥗' },
    { name: 'ต้มยำกุ้ง', price: '฿129', emoji: '🍲' },
  ];

  return (
    <Box sx={{ 
      backgroundColor: '#FAFAFA',
      minHeight: '100vh',
      fontFamily: 'Prompt, sans-serif',
    }}>
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="90vh"
          textAlign="center"
        >
          {/* Error Icon & Code */}
          <Box sx={{ mb: 3 }}>
            <Block sx={{ 
              fontSize: 80, 
              color: '#F8A66E',
              mb: 2,
              opacity: 0.8 
            }} />
            <Typography 
              variant="h1" 
              sx={{ 
                fontSize: '4rem',
                fontWeight: 700,
                color: '#F8A66E',
                fontFamily: 'Prompt, sans-serif',
                mb: 1,
              }}
            >
              403
            </Typography>
          </Box>

          {/* Error Message */}
          <Typography 
            variant="h5" 
            sx={{ 
              fontFamily: 'Prompt, sans-serif',
              fontWeight: 600,
              color: '#1A1A1A',
              mb: 1,
            }}
          >
            ไม่ได้รับอนุญาต
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              fontFamily: 'Prompt, sans-serif',
              color: '#666',
              mb: 4,
              maxWidth: '400px',
            }}
          >
            คุณไม่มีสิทธิ์เข้าถึงหน้านี้ ลองสั่งอาหารอร่อยๆ แทนไหม?
          </Typography>

          {/* Featured Foods */}
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: 3,
              border: '1px solid #E8E8E8',
              bgcolor: '#FFFFFF',
              mb: 4,
              width: '100%',
              maxWidth: '400px',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Fastfood sx={{ color: '#F8A66E', mr: 1, fontSize: 20 }} />
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontFamily: 'Prompt, sans-serif',
                    fontWeight: 600,
                    color: '#1A1A1A',
                  }}
                >
                  อาหารแนะนำวันนี้
                </Typography>
                <Chip
                  label="HOT"
                  size="small"
                  sx={{
                    ml: 1,
                    bgcolor: '#FF6B6B',
                    color: 'white',
                    fontFamily: 'Prompt, sans-serif',
                    fontSize: '0.7rem',
                  }}
                />
              </Box>
              
              <Stack spacing={2}>
                {featuredFoods.map((food, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      p: 2,
                      bgcolor: '#FAFAFA',
                      borderRadius: 2,
                      border: '1px solid #F0F0F0',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ fontSize: '1.5rem', mr: 1.5 }}>
                        {food.emoji}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: 'Prompt, sans-serif',
                          fontWeight: 500,
                          color: '#1A1A1A',
                        }}
                      >
                        {food.name}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: 'Prompt, sans-serif',
                        fontWeight: 600,
                        color: '#F8A66E',
                      }}
                    >
                      {food.price}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
          
          {/* Action Buttons */}
          <Stack direction="column" spacing={2} sx={{ width: '100%', maxWidth: '300px' }}>
            <Button
              variant="contained"
              startIcon={<Restaurant />}
              onClick={() => router.push('/')}
              sx={{
                bgcolor: '#F8A66E',
                color: '#FFFFFF',
                fontFamily: 'Prompt, sans-serif',
                fontWeight: 500,
                borderRadius: 2,
                py: 1.5,
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#E8956E',
                },
              }}
            >
              สั่งอาหารเลย
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => router.back()}
              sx={{
                borderColor: '#E8E8E8',
                color: '#666',
                fontFamily: 'Prompt, sans-serif',
                fontWeight: 500,
                borderRadius: 2,
                py: 1.5,
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#D0D0D0',
                  bgcolor: '#FAFAFA',
                },
              }}
            >
              กลับไปหน้าที่แล้ว
            </Button>
            
            {session ? (
              <Button
                variant="text"
                startIcon={<Logout />}
                onClick={() => signOut({ callbackUrl: '/auth/login' })}
                sx={{
                  color: '#999',
                  fontFamily: 'Prompt, sans-serif',
                  fontWeight: 500,
                  textTransform: 'none',
                  '&:hover': {
                    color: '#FF6B6B',
                    bgcolor: 'transparent',
                  },
                }}
              >
                ออกจากระบบ
              </Button>
            ) : (
              <Button
                variant="text"
                startIcon={<Login />}
                onClick={() => router.push('/auth/login')}
                sx={{
                  color: '#999',
                  fontFamily: 'Prompt, sans-serif',
                  fontWeight: 500,
                  textTransform: 'none',
                  '&:hover': {
                    color: '#F8A66E',
                    bgcolor: 'transparent',
                  },
                }}
              >
                เข้าสู่ระบบ
              </Button>
            )}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
} 