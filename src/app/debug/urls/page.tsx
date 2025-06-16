'use client';

import { Box, Typography, Card, CardContent } from '@mui/material';
import { getUrlInfo } from '@/config/urls';

export default function DebugUrlsPage() {
  const urlInfo = getUrlInfo();

  return (
    <Box sx={{ p: 3, maxWidth: '800px', mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3, fontFamily: '"Prompt", sans-serif' }}>
        🔧 URL Configuration Debug
      </Typography>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: '#06C755' }}>
            📍 Base URLs
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Base URL:</strong> {urlInfo.baseUrl}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Environment:</strong> {urlInfo.isProduction ? '🟢 Production' : '🟡 Development'}
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: '#06C755' }}>
            🔐 LINE Login URLs
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Redirect URI:</strong> {urlInfo.lineRedirectUri}
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
            * ใช้ใน LINE Developers Console
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: '#06C755' }}>
            📱 LIFF URLs
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>LIFF URL:</strong> {urlInfo.liffUrl}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>LIFF Login Page:</strong> {urlInfo.liffLoginUrl}
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
            * ใช้สำหรับ Rich Menu
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: '#06C755' }}>
            🎯 Environment Variables
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>NEXT_PUBLIC_BASE_URL:</strong> {process.env.NEXT_PUBLIC_BASE_URL || 'ไม่ได้ตั้งค่า (ใช้ default)'}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>NEXT_PUBLIC_LIFF_ID:</strong> {process.env.NEXT_PUBLIC_LIFF_ID || 'ไม่ได้ตั้งค่า (ใช้ default)'}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>NODE_ENV:</strong> {process.env.NODE_ENV}
          </Typography>
        </CardContent>
      </Card>

      <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          📋 Setup Checklist:
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          ✅ ตั้งค่า NEXT_PUBLIC_BASE_URL="https://corgigo.treetelu.com" ใน .env.local
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          ✅ ตั้งค่า NEXT_PUBLIC_LIFF_ID="2007547134-GD56wM6Z" ใน .env.local
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          ✅ ตั้งค่า Redirect URI ใน LINE Developers: {urlInfo.lineRedirectUri}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          ✅ ตั้งค่า LIFF Endpoint URL: {urlInfo.liffLoginUrl}
        </Typography>
        <Typography variant="body2">
          ✅ ตั้งค่า Rich Menu Button URI: {urlInfo.liffUrl}
        </Typography>
      </Box>
    </Box>
  );
} 