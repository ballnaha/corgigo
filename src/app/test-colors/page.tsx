'use client';

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Paper,
  IconButton,
  Stack,
} from '@mui/material';
import {
  ContentCopy,
  CheckCircle,
} from '@mui/icons-material';
import { colors, themes } from '@/config/colors';

export default function TestColorsPage() {
  const [copiedColor, setCopiedColor] = useState<string>('');

  const copyToClipboard = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedColor(color);
      setTimeout(() => setCopiedColor(''), 2000);
    } catch (err) {
      console.error('Failed to copy color:', err);
    }
  };

  const ColorCard = ({ 
    color, 
    name, 
    description 
  }: { 
    color: string; 
    name: string; 
    description?: string;
  }) => (
    <Card 
      sx={{ 
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        minWidth: 250,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        }
      }}
    >
      <Box
        sx={{
          height: 120,
          backgroundColor: color,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <IconButton
          onClick={() => copyToClipboard(color)}
          sx={{
            backgroundColor: 'rgba(255,255,255,0.9)',
            color: colors.neutral.darkGray,
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,1)',
            }
          }}
        >
          {copiedColor === color ? <CheckCircle /> : <ContentCopy />}
        </IconButton>
      </Box>
      <CardContent sx={{ p: 2 }}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Prompt, sans-serif',
            fontWeight: 600,
            fontSize: '0.9rem',
            mb: 0.5,
          }}
        >
          {name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: colors.neutral.gray,
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            mb: 1,
          }}
        >
          {color}
        </Typography>
        {description && (
          <Typography
            variant="caption"
            sx={{
              color: colors.neutral.gray,
              fontSize: '0.75rem',
            }}
          >
            {description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontFamily: 'Prompt, sans-serif',
            fontWeight: 700,
            background: colors.gradients.nature,
            backgroundClip: 'text',
            color: 'transparent',
            mb: 2,
          }}
        >
          🎨 CorgiGo Color Palette
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: colors.neutral.gray,
            fontFamily: 'Prompt, sans-serif',
            mb: 1,
          }}
        >
          แรงบันดาลใจจากผักผลไม้สดใหม่
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: colors.neutral.gray,
            maxWidth: 600,
            margin: '0 auto',
          }}
        >
          สี 3 สีหลักจากภาพ: สีเหลือง/ทอง (ดอก/ใบ), สีเขียว (ลำต้น), สีแดง/ส้ม (ผลไม้)
        </Typography>
      </Box>

      {/* Color Display */}
      <Stack spacing={4}>
        {/* Primary Colors */}
        <Box>
          <Typography variant="h5" sx={{ fontFamily: 'Prompt, sans-serif', mb: 2, color: colors.primary.golden }}>
            🌻 Primary Colors (เหลือง/ทอง)
          </Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <ColorCard color={colors.primary.golden} name="Golden" description="สีทองหลัก" />
            <ColorCard color={colors.primary.lightGolden} name="Light Golden" description="สีทองอ่อน" />
            <ColorCard color={colors.primary.darkGolden} name="Dark Golden" description="สีทองเข้ม" />
          </Stack>
        </Box>

        {/* Secondary Colors */}
        <Box>
          <Typography variant="h5" sx={{ fontFamily: 'Prompt, sans-serif', mb: 2, color: colors.secondary.fresh }}>
            🌿 Secondary Colors (เขียว)
          </Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <ColorCard color={colors.secondary.fresh} name="Fresh Green" description="สีเขียวสด" />
            <ColorCard color={colors.secondary.lightFresh} name="Light Fresh" description="สีเขียวอ่อน" />
            <ColorCard color={colors.secondary.darkFresh} name="Dark Fresh" description="สีเขียวเข้ม" />
          </Stack>
        </Box>

        {/* Accent Colors */}
        <Box>
          <Typography variant="h5" sx={{ fontFamily: 'Prompt, sans-serif', mb: 2, color: colors.accent.warm }}>
            🥕 Accent Colors (แดง/ส้ม)
          </Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <ColorCard color={colors.accent.warm} name="Warm Orange" description="สีส้มอุ่น" />
            <ColorCard color={colors.accent.lightWarm} name="Light Warm" description="สีส้มอ่อน" />
            <ColorCard color={colors.accent.darkWarm} name="Dark Warm" description="สีส้มเข้ม" />
          </Stack>
        </Box>
      </Stack>

      {/* Demo Section */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" sx={{ fontFamily: 'Prompt, sans-serif', mb: 3, textAlign: 'center' }}>
          🎨 Color Demonstration
        </Typography>
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            background: colors.gradients.warm,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontFamily: 'Prompt, sans-serif',
              fontWeight: 700,
              color: colors.neutral.white,
              textAlign: 'center',
              mb: 3,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            CorgiGo Food Delivery
          </Typography>
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              sx={{
                backgroundColor: colors.primary.golden,
                color: colors.neutral.white,
                fontFamily: 'Prompt, sans-serif',
                px: 3,
                py: 1,
                '&:hover': {
                  backgroundColor: colors.primary.darkGolden,
                }
              }}
            >
              สั่งอาหาร
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: colors.secondary.fresh,
                color: colors.neutral.white,
                fontFamily: 'Prompt, sans-serif',
                px: 3,
                py: 1,
                '&:hover': {
                  backgroundColor: colors.secondary.darkFresh,
                }
              }}
            >
              ร้านอาหาร
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: colors.accent.warm,
                color: colors.neutral.white,
                fontFamily: 'Prompt, sans-serif',
                px: 3,
                py: 1,
                '&:hover': {
                  backgroundColor: colors.accent.darkWarm,
                }
              }}
            >
              โปรโมชั่น
            </Button>
          </Stack>
        </Paper>
      </Box>

      {/* Footer */}
      <Box sx={{ textAlign: 'center', mt: 6, p: 3, backgroundColor: colors.neutral.lightGray, borderRadius: 3 }}>
        <Typography
          variant="body2"
          sx={{
            color: colors.neutral.gray,
            fontFamily: 'Prompt, sans-serif',
          }}
        >
          🎨 Color Palette สำหรับ CorgiGo - แรงบันดาลใจจากธรรมชาติ
        </Typography>
      </Box>
    </Container>
  );
} 