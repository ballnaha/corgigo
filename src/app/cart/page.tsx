'use client';

import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { ArrowBack, ShoppingCart } from '@mui/icons-material';

export default function CartPage() {
  const router = useRouter();

  return (
    <Box className="app-container">
      {/* Header */}
      <Box sx={{ 
        bgcolor: 'white',
        borderBottom: '1px solid #F0F0F0',
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        position: 'sticky',
        top: 0,
        zIndex: 1100,
      }}>
        <Button
          onClick={() => router.back()}
          sx={{
            minWidth: 'auto',
            p: 1,
            color: '#1A1A1A',
          }}
        >
          <ArrowBack />
        </Button>
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Prompt, sans-serif',
            fontWeight: 600,
            color: '#1A1A1A',
          }}
        >
          ตะกร้าสินค้า
        </Typography>
      </Box>

      {/* Scrollable Content */}
      <Box 
        className="app-content"
        sx={{ bgcolor: '#FAFAFA' }}
      >
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ 
          textAlign: 'center',
          py: 8,
        }}>
          <ShoppingCart sx={{ 
            fontSize: 80,
            color: '#E8E8E8',
            mb: 2,
          }} />
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'Prompt, sans-serif',
              fontWeight: 500,
              color: '#666',
              mb: 1,
            }}
          >
            ตะกร้าสินค้าว่างเปล่า
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'Prompt, sans-serif',
              color: '#999',
              mb: 3,
            }}
          >
            เพิ่มอาหารที่คุณต้องการลงในตะกร้า
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push('/')}
            sx={{
              bgcolor: '#F8A66E',
              color: 'white',
              fontFamily: 'Prompt, sans-serif',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: 3,
              '&:hover': {
                bgcolor: '#F35C76',
              },
            }}
          >
            เลือกอาหาร
          </Button>
        </Box>
      </Container>
      </Box>
    </Box>
  );
} 