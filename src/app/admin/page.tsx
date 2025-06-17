'use client';

import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

const vristoTheme = {
  font: {
    family: '"Prompt", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  }
};

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/admin/dashboard');
  }, [router]);

  return (
    <Box sx={{ fontFamily: vristoTheme.font.family }}>
      <Typography variant="h4" fontWeight="600" gutterBottom>
        แอดมิน CorgiGo
      </Typography>
      <Typography variant="body1" color="text.secondary">
        ยินดีต้อนรับสู่ระบบจัดการแอดมิน CorgiGo
      </Typography>
    </Box>
  );
} 