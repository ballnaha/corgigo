'use client';

import { Box, Typography, Button, Container, Card, CardContent, Stack, Chip } from '@mui/material';
import { useRouter } from 'next/navigation';
import { 
  SearchOff, 
  Home, 
  Restaurant, 
  LocalOffer,
  Fastfood,
  TrendingUp 
} from '@mui/icons-material';

export default function NotFoundPage() {
  const router = useRouter();

  const popularFoods = [
    { name: 'ข้าวมันไก่', price: '฿79', emoji: '🍗', tag: 'ขายดี' },
    { name: 'ผัดไทย', price: '฿69', emoji: '🍜', tag: 'คลาสสิค' },
    { name: 'มาม่าต้มยำ', price: '฿49', emoji: '🍲', tag: 'ราคาดี' },
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
            <SearchOff sx={{ 
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
              404
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
            ไม่พบหน้าที่ค้นหา
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
            หน้าที่คุณกำลังมองหาไม่มีอยู่ แต่เรามีอาหารอร่อยๆ รออยู่!
          </Typography>

          {/* Popular Foods */}
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
                <TrendingUp sx={{ color: '#F8A66E', mr: 1, fontSize: 20 }} />
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontFamily: 'Prompt, sans-serif',
                    fontWeight: 600,
                    color: '#1A1A1A',
                  }}
                >
                  เมนูยอดนิยม
                </Typography>
                <Chip
                  label="TOP"
                  size="small"
                  sx={{
                    ml: 1,
                    bgcolor: '#4CAF50',
                    color: 'white',
                    fontFamily: 'Prompt, sans-serif',
                    fontSize: '0.7rem',
                  }}
                />
              </Box>
              
              <Stack spacing={2}>
                {popularFoods.map((food, index) => (
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
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: '#F0F0F0',
                        transform: 'translateY(-1px)',
                      },
                    }}
                    onClick={() => router.push('/')}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ fontSize: '1.5rem', mr: 1.5 }}>
                        {food.emoji}
                      </Typography>
                      <Box>
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
                        <Chip
                          label={food.tag}
                          size="small"
                          sx={{
                            height: 16,
                            fontSize: '0.65rem',
                            bgcolor: '#E3F2FD',
                            color: '#1976D2',
                            fontFamily: 'Prompt, sans-serif',
                            mt: 0.5,
                          }}
                        />
                      </Box>
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
              ดูเมนูทั้งหมด
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<Home />}
              onClick={() => router.push('/')}
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
              กลับหน้าหลัก
            </Button>
          </Stack>

          {/* Fun Message */}
          <Box sx={{ mt: 4, opacity: 0.7 }}>
            <Typography 
              variant="caption" 
              sx={{ 
                fontFamily: 'Prompt, sans-serif',
                color: '#999',
                fontStyle: 'italic',
              }}
            >
              🐕 CorgiGo - ส่งอาหารเร็วเหมือนคอร์กี้วิ่ง!
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
} 