'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  IconButton,
  Avatar,
  Container,
  Tabs,
  Tab,
  Badge,
  LinearProgress,
} from '@mui/material';
import {
  ArrowBack,
  Schedule,
  Restaurant,
  LocalFireDepartment,
  FitnessCenter,
  Star,
  BookmarkBorder,
  Bookmark,
  Info,
} from '@mui/icons-material';

interface MealPlan {
  id: string;
  name: string;
  description: string;
  type: string;
  duration: string;
  price: number;
  originalPrice?: number;
  totalMeals: number;
  mealsPerDay: number;
  includesSnacks: boolean;
  avgCaloriesPerDay?: number;
  avgProteinPerDay?: number;
  avgCarbsPerDay?: number;
  avgFatPerDay?: number;
  image?: string;
  tags?: string[];
  isPopular: boolean;
  isRecommended: boolean;
  restaurant: {
    name: string;
    rating: number;
  };
}

const mealPlanTypes = [
  { value: 'ALL', label: 'ทั้งหมด', icon: '🍽️' },
  { value: 'KETO', label: 'คีโต', icon: '🥑' },
  { value: 'CLEAN_EATING', label: 'คลีน', icon: '🥗' },
  { value: 'LOW_CARB', label: 'คาร์บต่ำ', icon: '🥬' },
  { value: 'VEGAN', label: 'วีแกน', icon: '🌱' },
  { value: 'WEIGHT_LOSS', label: 'ลดน้ำหนัก', icon: '⚖️' },
  { value: 'MUSCLE_GAIN', label: 'เพิ่มกล้ามเนื้อ', icon: '💪' },
];

export default function MealPlansPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState('ALL');
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedPlans, setSavedPlans] = useState<string[]>([]);

  useEffect(() => {
    loadMealPlans();
    loadSavedPlans();
  }, [selectedType]);

  const loadMealPlans = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedType !== 'ALL') {
        params.append('type', selectedType);
      }
      
      const response = await fetch(`/api/meal-plans?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setMealPlans(result.data || []);
      } else {
        console.error('Error loading meal plans:', result.error);
        setMealPlans([]);
      }
    } catch (error) {
      console.error('Error loading meal plans:', error);
      setMealPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedPlans = () => {
    try {
      const saved = localStorage.getItem('savedMealPlans');
      if (saved) {
        setSavedPlans(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading saved plans:', error);
    }
  };

  const toggleSavePlan = (planId: string) => {
    const newSavedPlans = savedPlans.includes(planId)
      ? savedPlans.filter(id => id !== planId)
      : [...savedPlans, planId];
    
    setSavedPlans(newSavedPlans);
    localStorage.setItem('savedMealPlans', JSON.stringify(newSavedPlans));
  };

  const getDurationText = (duration: string) => {
    switch (duration) {
      case 'SEVEN_DAYS': return '7 วัน';
      case 'FOURTEEN_DAYS': return '14 วัน';
      case 'THIRTY_DAYS': return '30 วัน';
      default: return duration;
    }
  };

  const getTypeText = (type: string) => {
    const typeObj = mealPlanTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  };

  const getDiscountPercent = (original?: number, current?: number) => {
    if (!original || !current) return 0;
    return Math.round(((original - current) / original) * 100);
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <Box sx={{ 
        bgcolor: 'white',
        borderBottom: '1px solid #F0F0F0',
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}>
        <IconButton 
          onClick={() => router.back()}
          sx={{ color: '#1A1A1A' }}
        >
          <ArrowBack />
        </IconButton>
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Prompt, sans-serif',
            fontWeight: 600,
            color: '#1A1A1A',
            flex: 1
          }}
        >
          คอร์สอาหารสุขภาพ
        </Typography>
        <Chip 
          label={`${mealPlans.length} คอร์ส`}
          size="small"
          sx={{
            bgcolor: '#10B981',
            color: 'white',
            fontFamily: 'Prompt, sans-serif',
            fontWeight: 500
          }}
        />
      </Box>

      {/* Content */}
      <Box sx={{ 
        flex: 1,
        overflow: 'auto',
        bgcolor: '#F8F9FA',
        '&::-webkit-scrollbar': { display: 'none' },
        '-ms-overflow-style': 'none',
        'scrollbar-width': 'none'
      }}>
        {/* Filter Tabs */}
        <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #F0F0F0' }}>
          <Container maxWidth="md" sx={{ px: { xs: 1, sm: 2 } }}>
            <Tabs
              value={selectedType}
              onChange={(_, value) => setSelectedType(value)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  fontFamily: 'Prompt, sans-serif',
                  fontWeight: 500,
                  textTransform: 'none',
                  minWidth: 'auto',
                  px: 2,
                  py: 1.5,
                },
                '& .Mui-selected': {
                  color: '#10B981 !important',
                  fontWeight: 600,
                },
                '& .MuiTabs-indicator': {
                  bgcolor: '#10B981',
                  height: 3,
                },
              }}
            >
              {mealPlanTypes.map((type) => (
                <Tab
                  key={type.value}
                  value={type.value}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <span>{type.icon}</span>
                      <span>{type.label}</span>
                    </Box>
                  }
                />
              ))}
            </Tabs>
          </Container>
        </Box>

        {/* Meal Plans List */}
        <Container maxWidth="md" sx={{ py: 2, px: { xs: 1, sm: 2 } }}>
          {loading ? (
            <Box sx={{ mt: 4 }}>
              {[1, 2, 3].map((n) => (
                <Card key={n} sx={{ mb: 2, p: 2 }}>
                  <LinearProgress sx={{ mb: 2 }} />
                  <Box sx={{ height: 100 }} />
                </Card>
              ))}
            </Box>
          ) : mealPlans.length === 0 ? (
            <Box sx={{ 
              textAlign: 'center',
              py: 8,
            }}>
              <Restaurant sx={{ fontSize: 80, color: '#E0E0E0', mb: 2 }} />
              <Typography variant="h6" sx={{ fontFamily: 'Prompt, sans-serif', color: '#666', mb: 1 }}>
                ไม่พบคอร์สอาหาร
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'Prompt, sans-serif', color: '#999' }}>
                ลองเปลี่ยนประเภทคอร์สดู
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {mealPlans.map((plan) => (
                  <Card sx={{ 
                    borderRadius: 3, 
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    position: 'relative',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.2s ease'
                  }}>
                    {/* Badges */}
                    <Box sx={{ position: 'absolute', top: 12, left: 12, zIndex: 2, display: 'flex', gap: 1 }}>
                      {plan.isPopular && (
                        <Chip
                          label="🔥 ยอดนิยม"
                          size="small"
                          sx={{
                            bgcolor: '#EF4444',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                          }}
                        />
                      )}
                      {plan.isRecommended && (
                        <Chip
                          label="⭐ แนะนำ"
                          size="small"
                          sx={{
                            bgcolor: '#F59E0B',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                          }}
                        />
                      )}
                      {plan.originalPrice && (
                        <Chip
                          label={`-${getDiscountPercent(plan.originalPrice, plan.price)}%`}
                          size="small"
                          sx={{
                            bgcolor: '#10B981',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                          }}
                        />
                      )}
                    </Box>

                    {/* Save Button */}
                    <IconButton
                      onClick={() => toggleSavePlan(plan.id)}
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        zIndex: 2,
                        bgcolor: 'rgba(255,255,255,0.9)',
                        '&:hover': { bgcolor: 'white' }
                      }}
                    >
                      {savedPlans.includes(plan.id) ? (
                        <Bookmark sx={{ color: '#EF4444' }} />
                      ) : (
                        <BookmarkBorder sx={{ color: '#6B7280' }} />
                      )}
                    </IconButton>

                    <Box sx={{ display: 'flex' }}>
                      {/* Image */}
                      <CardMedia
                        component="img"
                        sx={{ width: 120, height: 120, objectFit: 'cover' }}
                        image={plan.image}
                        alt={plan.name}
                      />

                      {/* Content */}
                      <CardContent sx={{ flex: 1, p: 2 }}>
                        {/* Restaurant Info */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Avatar sx={{ width: 20, height: 20, fontSize: '0.7rem' }}>
                            🏪
                          </Avatar>
                          <Typography sx={{
                            fontSize: '0.75rem',
                            color: '#6B7280',
                            fontFamily: 'Prompt, sans-serif'
                          }}>
                            {plan.restaurant.name}
                          </Typography>
                          <Star sx={{ fontSize: 12, color: '#F59E0B' }} />
                          <Typography sx={{
                            fontSize: '0.75rem',
                            color: '#6B7280',
                            fontFamily: 'Prompt, sans-serif'
                          }}>
                            {plan.restaurant.rating}
                          </Typography>
                        </Box>

                        {/* Plan Name */}
                        <Typography sx={{
                          fontWeight: 600,
                          fontSize: '1rem',
                          color: '#1F2937',
                          fontFamily: 'Prompt, sans-serif',
                          mb: 0.5,
                          lineHeight: 1.3
                        }}>
                          {plan.name}
                        </Typography>

                        {/* Description */}
                        <Typography sx={{
                          fontSize: '0.8rem',
                          color: '#6B7280',
                          fontFamily: 'Prompt, sans-serif',
                          mb: 1,
                          lineHeight: 1.4,
                          display: '-webkit-box',
                          '-webkit-line-clamp': 2,
                          '-webkit-box-orient': 'vertical',
                          overflow: 'hidden'
                        }}>
                          {plan.description}
                        </Typography>

                        {/* Plan Details */}
                        <Box sx={{ display: 'flex', gap: 2, mb: 1.5, flexWrap: 'wrap' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Schedule sx={{ fontSize: 14, color: '#10B981' }} />
                            <Typography sx={{ fontSize: '0.75rem', fontFamily: 'Prompt, sans-serif' }}>
                              {getDurationText(plan.duration)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Restaurant sx={{ fontSize: 14, color: '#10B981' }} />
                            <Typography sx={{ fontSize: '0.75rem', fontFamily: 'Prompt, sans-serif' }}>
                              {plan.totalMeals} มื้อ
                            </Typography>
                          </Box>
                          {plan.avgCaloriesPerDay && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <LocalFireDepartment sx={{ fontSize: 14, color: '#EF4444' }} />
                              <Typography sx={{ fontSize: '0.75rem', fontFamily: 'Prompt, sans-serif' }}>
                                {plan.avgCaloriesPerDay} kcal/วัน
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        {/* Tags */}
                        {plan.tags && plan.tags.length > 0 && (
                          <Box sx={{ display: 'flex', gap: 0.5, mb: 1.5, flexWrap: 'wrap' }}>
                            {plan.tags.slice(0, 3).map((tag, index) => (
                              <Chip
                                key={index}
                                label={tag}
                                size="small"
                                sx={{
                                  bgcolor: '#F3F4F6',
                                  color: '#374151',
                                  fontSize: '0.65rem',
                                  height: 20,
                                  fontFamily: 'Prompt, sans-serif'
                                }}
                              />
                            ))}
                          </Box>
                        )}

                        {/* Price and Action */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography sx={{
                                fontSize: '1.1rem',
                                fontWeight: 700,
                                color: '#10B981',
                                fontFamily: 'Prompt, sans-serif'
                              }}>
                                ฿{plan.price.toLocaleString()}
                              </Typography>
                              {plan.originalPrice && (
                                <Typography sx={{
                                  fontSize: '0.85rem',
                                  color: '#9CA3AF',
                                  textDecoration: 'line-through',
                                  fontFamily: 'Prompt, sans-serif'
                                }}>
                                  ฿{plan.originalPrice.toLocaleString()}
                                </Typography>
                              )}
                            </Box>
                            <Typography sx={{
                              fontSize: '0.7rem',
                              color: '#6B7280',
                              fontFamily: 'Prompt, sans-serif'
                            }}>
                              {getTypeText(plan.type)} • {plan.mealsPerDay} มื้อ/วัน
                            </Typography>
                          </Box>

                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => router.push(`/meal-plans/${plan.id}`)}
                            sx={{
                              bgcolor: '#10B981',
                              color: 'white',
                              fontFamily: 'Prompt, sans-serif',
                              fontWeight: 600,
                              px: 2,
                              py: 0.8,
                              borderRadius: 2,
                              textTransform: 'none',
                              '&:hover': {
                                bgcolor: '#059669',
                              },
                            }}
                          >
                            ดูรายละเอียด
                          </Button>
                        </Box>
                      </CardContent>
                    </Box>
                  </Card>
                ))}
            </Box>
          )}

          {/* Bottom Spacing */}
          <Box sx={{ height: 20 }} />
        </Container>
      </Box>
    </Box>
  );
} 