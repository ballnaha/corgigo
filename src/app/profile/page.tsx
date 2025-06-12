'use client';

import { useState, useEffect } from 'react';
import { CircularProgress, Box } from '@mui/material';
import SimpleProfileClient from './simple-client';

export default function ProfilePage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        bgcolor: '#FEFEFE',
      }}>
        <CircularProgress sx={{ color: '#F8A66E' }} size={40} />
      </Box>
    );
  }

  return <SimpleProfileClient />;
} 