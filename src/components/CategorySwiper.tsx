'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import { Chip, Box } from '@mui/material';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';

interface Category {
  name: string;
  icon: string;
  active: boolean;
}

interface CategorySwiperProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategorySwiper({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}: CategorySwiperProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Swiper
        slidesPerView="auto"
        spaceBetween={8}
        freeMode={true}
        modules={[FreeMode]}
        className="category-swiper"
        style={{
          paddingLeft: '16px',
          paddingRight: '16px',
        }}
      >
        {categories.map((category) => (
          <SwiperSlide key={category.name} style={{ width: 'auto' }}>
            <Chip
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </Box>
              }
              onClick={() => onCategoryChange(category.name)}
              sx={{
                bgcolor: selectedCategory === category.name ? '#FFD700' : 'white',
                color: selectedCategory === category.name ? 'black' : 'gray',
                fontWeight: selectedCategory === category.name ? 600 : 400,
                borderRadius: 6,
                px: 2,
                py: 1,
                height: 'auto',
                minWidth: 'fit-content',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: selectedCategory === category.name ? '2px solid #E6C200' : '1px solid #e0e0e0',
                '&:hover': {
                  bgcolor: selectedCategory === category.name ? '#FFD700' : '#f5f5f5',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                },
                '& .MuiChip-label': {
                  px: 0,
                },
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
} 