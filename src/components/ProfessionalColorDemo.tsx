'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Badge,
  Alert,
  LinearProgress,
  Avatar,
  Stack,
  Divider,
  Container,
  Paper,
  Rating,
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  Share,
  Add,
  Remove,
  Star,
  LocalOffer,
  Delivery,
  AccessTime,
  CheckCircle,
  Warning,
  Info,
  Error,
  Restaurant,
  Location,
  Phone,
} from '@mui/icons-material';
import { colors } from '@/config/colors';

export default function ProfessionalColorDemo() {
  const [cartCount, setCartCount] = useState(2);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: 'Prompt, sans-serif',
            fontWeight: 700,
            color: colors.neutral.darkGray,
            mb: 2,
          }}
        >
          🎨 Professional Color Usage Demo
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: colors.neutral.gray,
            maxWidth: 600,
            margin: '0 auto',
          }}
        >
          การใช้ 3 สีหลักอย่างมืออาชีพใน UI Components ต่างๆ
        </Typography>
      </Box>

      <Stack spacing={4}>
        {/* 1. Primary Color - Golden (Actions, CTAs) */}
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontFamily: 'Prompt, sans-serif',
              fontWeight: 600,
              color: colors.primary.golden,
              mb: 3,
            }}
          >
            🌻 Primary Color - Golden (การกระทำหลัก)
          </Typography>
          
          <Stack spacing={3}>
            {/* Main Action Buttons */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Prompt, sans-serif' }}>
                Primary Action Buttons
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: colors.primary.golden,
                    color: colors.neutral.white,
                    fontFamily: 'Prompt, sans-serif',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: colors.primary.darkGolden,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 24px ${colors.primary.golden}40`,
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  สั่งอาหารเลย
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: colors.primary.golden,
                    color: colors.primary.golden,
                    fontFamily: 'Prompt, sans-serif',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: colors.primary.golden,
                      color: colors.neutral.white,
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  ดูเมนู
                </Button>
              </Stack>
            </Box>

            {/* Badges with Golden */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Prompt, sans-serif' }}>
                Badges & Notifications
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <IconButton
                  sx={{
                    position: 'relative',
                    bgcolor: colors.neutral.lightGray,
                    '&:hover': { bgcolor: colors.primary.golden, color: colors.neutral.white },
                  }}
                >
                  <ShoppingCart />
                  <Badge
                    badgeContent={cartCount}
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: colors.primary.golden,
                        color: colors.neutral.white,
                        fontFamily: 'Prompt, sans-serif',
                        fontWeight: 600,
                      }
                    }}
                  />
                </IconButton>

                <Chip
                  icon={<LocalOffer />}
                  label="โปรโมชั่นพิเศษ"
                  sx={{
                    backgroundColor: colors.primary.golden,
                    color: colors.neutral.white,
                    fontFamily: 'Prompt, sans-serif',
                    fontWeight: 600,
                    '& .MuiChip-icon': {
                      color: colors.neutral.white,
                    }
                  }}
                />

                <Chip
                  label="ขายดี #1"
                  variant="outlined"
                  sx={{
                    borderColor: colors.primary.golden,
                    color: colors.primary.golden,
                    fontFamily: 'Prompt, sans-serif',
                    fontWeight: 600,
                  }}
                />
              </Stack>
            </Box>
          </Stack>
        </Paper>

        {/* 2. Secondary Color - Green (Success, Navigation) */}
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontFamily: 'Prompt, sans-serif',
              fontWeight: 600,
              color: colors.secondary.fresh,
              mb: 3,
            }}
          >
            🌿 Secondary Color - Green (สำเร็จ, การนำทาง)
          </Typography>
          
          <Stack spacing={3}>
            {/* Success States */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Prompt, sans-serif' }}>
                Success States & Progress
              </Typography>
              <Stack spacing={2}>
                <Alert 
                  icon={<CheckCircle />}
                  severity="success"
                  sx={{
                    backgroundColor: `${colors.secondary.fresh}10`,
                    color: colors.secondary.darkFresh,
                    '& .MuiAlert-icon': {
                      color: colors.secondary.fresh,
                    }
                  }}
                >
                  สั่งอาหารสำเร็จแล้ว! กำลังเตรียมอาหารให้คุณ
                </Alert>

                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontFamily: 'Prompt, sans-serif' }}>
                    กำลังจัดเตรียมอาหาร (75%)
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={75}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: `${colors.secondary.fresh}20`,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: colors.secondary.fresh,
                      }
                    }}
                  />
                </Box>
              </Stack>
            </Box>

            {/* Navigation Elements */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Prompt, sans-serif' }}>
                Navigation & Secondary Actions
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<Restaurant />}
                  sx={{
                    backgroundColor: colors.secondary.fresh,
                    color: colors.neutral.white,
                    fontFamily: 'Prompt, sans-serif',
                    '&:hover': {
                      backgroundColor: colors.secondary.darkFresh,
                    }
                  }}
                >
                  ค้นหาร้านอาหาร
                </Button>

                <IconButton
                  sx={{
                    bgcolor: colors.secondary.lightFresh,
                    color: colors.secondary.darkFresh,
                    '&:hover': {
                      bgcolor: colors.secondary.fresh,
                      color: colors.neutral.white,
                    }
                  }}
                >
                  <Location />
                </IconButton>

                <IconButton
                  sx={{
                    bgcolor: colors.secondary.lightFresh,
                    color: colors.secondary.darkFresh,
                    '&:hover': {
                      bgcolor: colors.secondary.fresh,
                      color: colors.neutral.white,
                    }
                  }}
                >
                  <Phone />
                </IconButton>
              </Stack>
            </Box>
          </Stack>
        </Paper>

        {/* 3. Accent Color - Orange (Warnings, Special Features) */}
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontFamily: 'Prompt, sans-serif',
              fontWeight: 600,
              color: colors.accent.warm,
              mb: 3,
            }}
          >
            🥕 Accent Color - Orange (คำเตือน, ฟีเจอร์พิเศษ)
          </Typography>
          
          <Stack spacing={3}>
            {/* Warning & Info States */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Prompt, sans-serif' }}>
                Warnings & Special Alerts
              </Typography>
              <Stack spacing={2}>
                <Alert 
                  icon={<Warning />}
                  severity="warning"
                  sx={{
                    backgroundColor: `${colors.accent.warm}10`,
                    color: colors.accent.darkWarm,
                    '& .MuiAlert-icon': {
                      color: colors.accent.warm,
                    }
                  }}
                >
                  ร้านอาหารปิดในอีก 30 นาที - รีบสั่งเลย!
                </Alert>

                <Alert 
                  icon={<AccessTime />}
                  severity="info"
                  sx={{
                    backgroundColor: `${colors.accent.lightWarm}15`,
                    color: colors.accent.darkWarm,
                    '& .MuiAlert-icon': {
                      color: colors.accent.warm,
                    }
                  }}
                >
                  เวลาจัดส่ง: 25-35 นาที
                </Alert>
              </Stack>
            </Box>

            {/* Special Features */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Prompt, sans-serif' }}>
                Special Features & Interactive Elements
              </Typography>
              <Stack spacing={2}>
                {/* Quantity Selector */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography sx={{ fontFamily: 'Prompt, sans-serif' }}>จำนวน:</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      sx={{
                        bgcolor: colors.accent.lightWarm,
                        color: colors.accent.darkWarm,
                        '&:hover': {
                          bgcolor: colors.accent.warm,
                          color: colors.neutral.white,
                        }
                      }}
                    >
                      <Remove />
                    </IconButton>
                    <Typography
                      sx={{
                        minWidth: 40,
                        textAlign: 'center',
                        fontFamily: 'Prompt, sans-serif',
                        fontWeight: 600,
                      }}
                    >
                      {quantity}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => setQuantity(quantity + 1)}
                      sx={{
                        bgcolor: colors.accent.lightWarm,
                        color: colors.accent.darkWarm,
                        '&:hover': {
                          bgcolor: colors.accent.warm,
                          color: colors.neutral.white,
                        }
                      }}
                    >
                      <Add />
                    </IconButton>
                  </Box>
                </Box>

                {/* Favorite & Share */}
                <Stack direction="row" spacing={2}>
                  <IconButton
                    onClick={() => setIsFavorite(!isFavorite)}
                    sx={{
                      color: isFavorite ? colors.accent.warm : colors.neutral.gray,
                      '&:hover': {
                        bgcolor: `${colors.accent.warm}15`,
                        color: colors.accent.warm,
                      }
                    }}
                  >
                    <Favorite />
                  </IconButton>

                  <IconButton
                    sx={{
                      color: colors.neutral.gray,
                      '&:hover': {
                        bgcolor: `${colors.accent.warm}15`,
                        color: colors.accent.warm,
                      }
                    }}
                  >
                    <Share />
                  </IconButton>

                  <Chip
                    icon={<Delivery />}
                    label="จัดส่งฟรี"
                    sx={{
                      backgroundColor: colors.accent.warm,
                      color: colors.neutral.white,
                      fontFamily: 'Prompt, sans-serif',
                      fontWeight: 600,
                      '& .MuiChip-icon': {
                        color: colors.neutral.white,
                      }
                    }}
                  />
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Paper>

        {/* Real Food Card Example */}
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontFamily: 'Prompt, sans-serif',
              fontWeight: 600,
              color: colors.neutral.darkGray,
              mb: 3,
            }}
          >
            🍜 ตัวอย่างการใช้งานจริง - Food Card
          </Typography>
          
          <Card
            sx={{
              maxWidth: 400,
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <Box
              sx={{
                height: 200,
                background: 'linear-gradient(45deg, #FF6B6B, #FFE66D)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <Typography
                variant="h4"
                sx={{ color: colors.neutral.white, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
              >
                🍜
              </Typography>
              
              {/* Favorite Button */}
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  bgcolor: colors.neutral.white,
                  color: colors.accent.warm,
                  '&:hover': {
                    bgcolor: colors.accent.warm,
                    color: colors.neutral.white,
                  }
                }}
              >
                <Favorite />
              </IconButton>

              {/* Promotion Badge */}
              <Chip
                label="ลด 20%"
                sx={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  backgroundColor: colors.primary.golden,
                  color: colors.neutral.white,
                  fontFamily: 'Prompt, sans-serif',
                  fontWeight: 600,
                }}
              />
            </Box>

            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'Prompt, sans-serif',
                  fontWeight: 600,
                  color: colors.neutral.darkGray,
                  mb: 1,
                }}
              >
                ก๋วยเตี๋ยวต้มยำกุ้ง
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Rating value={4.5} precision={0.5} size="small" readOnly />
                <Typography
                  variant="body2"
                  sx={{ color: colors.neutral.gray, fontFamily: 'Prompt, sans-serif' }}
                >
                  (128 รีวิว)
                </Typography>
              </Box>

              <Typography
                variant="body2"
                sx={{
                  color: colors.neutral.gray,
                  mb: 2,
                  fontFamily: 'Prompt, sans-serif',
                }}
              >
                ก๋วยเตี๋ยวต้มยำรสจัดจ้าน กุ้งสดใหม่ เส้นเหนียวนุ่ม
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: colors.accent.warm,
                    fontFamily: 'Prompt, sans-serif',
                    fontWeight: 700,
                  }}
                >
                  ฿89
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: colors.neutral.gray,
                    textDecoration: 'line-through',
                    fontFamily: 'Prompt, sans-serif',
                  }}
                >
                  ฿112
                </Typography>
                <Chip
                  label="จัดส่งฟรี"
                  size="small"
                  sx={{
                    backgroundColor: colors.secondary.fresh,
                    color: colors.neutral.white,
                    fontFamily: 'Prompt, sans-serif',
                    fontSize: '0.7rem',
                  }}
                />
              </Box>
            </CardContent>

            <CardActions sx={{ p: 3, pt: 0 }}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: colors.primary.golden,
                  color: colors.neutral.white,
                  fontFamily: 'Prompt, sans-serif',
                  fontWeight: 600,
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: colors.primary.darkGolden,
                  }
                }}
              >
                เพิ่มลงตะกร้า
              </Button>
            </CardActions>
          </Card>
        </Paper>
      </Stack>
    </Container>
  );
} 