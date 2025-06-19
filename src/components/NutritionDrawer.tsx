'use client';

import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Chip,
  Card,
  CardContent,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  Close,
  LocalFireDepartment,
  FitnessCenter,
  Grain,
  WaterDrop,
  Schedule,
  Restaurant,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';

interface NutritionInfo {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  vitaminA?: number;
  vitaminC?: number;
  calcium?: number;
  iron?: number;
  servingSize?: string;
  ingredients?: string[];
  allergens?: string[];
  isGlutenFree?: boolean;
  isDairyFree?: boolean;
  isVegan?: boolean;
  isVegetarian?: boolean;
  isKeto?: boolean;
  isLowCarb?: boolean;
}

interface MealInfo {
  id: string;
  name: string;
  description: string;
  image?: string;
  price: number;
  estimatedTime?: string; // เช่น "15-20 นาที"
  nutrition: NutritionInfo;
}

interface NutritionDrawerProps {
  open: boolean;
  onClose: () => void;
  mealInfo: MealInfo | null;
}

export default function NutritionDrawer({ open, onClose, mealInfo }: NutritionDrawerProps) {
  if (!mealInfo) return null;

  const { nutrition } = mealInfo;

  // Calculate daily value percentages (based on 2000 kcal diet)
  const getDailyValuePercent = (nutrient: string, value: number) => {
    const dailyValues: { [key: string]: number } = {
      calories: 2000,
      protein: 50,
      carbohydrates: 300,
      fat: 65,
      fiber: 25,
      sodium: 2300,
    };
    
    const dailyValue = dailyValues[nutrient];
    if (!dailyValue) return 0;
    
    return Math.min((value / dailyValue) * 100, 100);
  };

  const getNutrientColor = (nutrient: string) => {
    const colors: { [key: string]: string } = {
      calories: '#EF4444',
      protein: '#3B82F6',
      carbohydrates: '#F59E0B',
      fat: '#10B981',
      fiber: '#8B5CF6',
      sodium: '#F97316',
    };
    return colors[nutrient] || '#6B7280';
  };

  const dietaryFlags = [
    { key: 'isVegan', label: 'วีแกน', icon: '🌱', active: nutrition.isVegan },
    { key: 'isVegetarian', label: 'มังสวิรัติ', icon: '🥬', active: nutrition.isVegetarian },
    { key: 'isKeto', label: 'คีโต', icon: '🥑', active: nutrition.isKeto },
    { key: 'isLowCarb', label: 'คาร์บต่ำ', icon: '🥩', active: nutrition.isLowCarb },
    { key: 'isGlutenFree', label: 'ไม่มีกลูเตน', icon: '🌾', active: nutrition.isGlutenFree },
    { key: 'isDairyFree', label: 'ไม่มีนม', icon: '🥛', active: nutrition.isDairyFree },
  ].filter(flag => flag.active);

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          maxHeight: '80vh',
          minHeight: '60vh',
        }
      }}
    >
      <Box sx={{ p: 3, pb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontFamily: 'Prompt, sans-serif', fontWeight: 600 }}>
            ข้อมูลโภชนาการ
          </Typography>
          <IconButton onClick={onClose} sx={{ color: '#6B7280' }}>
            <Close />
          </IconButton>
        </Box>

        {/* Meal Info */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          {mealInfo.image && (
            <Box
              component="img"
              src={mealInfo.image}
              sx={{
                width: 80,
                height: 80,
                borderRadius: 2,
                objectFit: 'cover'
              }}
            />
          )}
          <Box sx={{ flex: 1 }}>
            <Typography sx={{
              fontWeight: 600,
              fontSize: '1.1rem',
              fontFamily: 'Prompt, sans-serif',
              mb: 0.5
            }}>
              {mealInfo.name}
            </Typography>
            <Typography sx={{
              fontSize: '0.85rem',
              color: '#6B7280',
              fontFamily: 'Prompt, sans-serif',
              mb: 1
            }}>
              {mealInfo.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Typography sx={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#10B981',
                fontFamily: 'Prompt, sans-serif'
              }}>
                ฿{mealInfo.price}
              </Typography>
              {mealInfo.estimatedTime && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Schedule sx={{ fontSize: 16, color: '#6B7280' }} />
                  <Typography sx={{ fontSize: '0.8rem', color: '#6B7280' }}>
                    {mealInfo.estimatedTime}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* Main Nutrients */}
        <Typography variant="h6" sx={{ 
          fontFamily: 'Prompt, sans-serif', 
          fontWeight: 600, 
          mb: 2,
          fontSize: '1rem'
        }}>
          สารอาหารหลัก
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
          <Card sx={{ p: 2, textAlign: 'center', bgcolor: '#FEF2F2' }}>
            <LocalFireDepartment sx={{ fontSize: 32, color: '#EF4444', mb: 1 }} />
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, color: '#EF4444' }}>
              {nutrition.calories}
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: '#6B7280' }}>
              แคลอรี่ (kcal)
            </Typography>
          </Card>
          <Card sx={{ p: 2, textAlign: 'center', bgcolor: '#EFF6FF' }}>
            <FitnessCenter sx={{ fontSize: 32, color: '#3B82F6', mb: 1 }} />
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, color: '#3B82F6' }}>
              {nutrition.protein}g
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: '#6B7280' }}>
              โปรตีน
            </Typography>
          </Card>
          <Card sx={{ p: 2, textAlign: 'center', bgcolor: '#FFFBEB' }}>
            <Grain sx={{ fontSize: 32, color: '#F59E0B', mb: 1 }} />
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, color: '#F59E0B' }}>
              {nutrition.carbohydrates}g
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: '#6B7280' }}>
              คาร์โบไฮเดรต
            </Typography>
          </Card>
          <Card sx={{ p: 2, textAlign: 'center', bgcolor: '#F0FDF4' }}>
            <WaterDrop sx={{ fontSize: 32, color: '#10B981', mb: 1 }} />
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, color: '#10B981' }}>
              {nutrition.fat}g
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: '#6B7280' }}>
              ไขมัน
            </Typography>
          </Card>
        </Box>

        {/* Detailed Nutrients */}
        {(nutrition.fiber || nutrition.sugar || nutrition.sodium) && (
          <>
            <Typography variant="h6" sx={{ 
              fontFamily: 'Prompt, sans-serif', 
              fontWeight: 600, 
              mb: 2,
              fontSize: '1rem'
            }}>
              สารอาหารรายละเอียด
            </Typography>

            <Box sx={{ mb: 3 }}>
              {nutrition.fiber && (
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography sx={{ fontSize: '0.9rem', fontFamily: 'Prompt, sans-serif' }}>
                      ใยอาหาร
                    </Typography>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                      {nutrition.fiber}g
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={getDailyValuePercent('fiber', nutrition.fiber)}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: '#F3F4F6',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getNutrientColor('fiber'),
                        borderRadius: 3,
                      }
                    }}
                  />
                </Box>
              )}

              {nutrition.sugar && (
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography sx={{ fontSize: '0.9rem', fontFamily: 'Prompt, sans-serif' }}>
                      น้ำตาล
                    </Typography>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                      {nutrition.sugar}g
                    </Typography>
                  </Box>
                </Box>
              )}

              {nutrition.sodium && (
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography sx={{ fontSize: '0.9rem', fontFamily: 'Prompt, sans-serif' }}>
                      โซเดียม
                    </Typography>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                      {nutrition.sodium}mg
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={getDailyValuePercent('sodium', nutrition.sodium)}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: '#F3F4F6',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getNutrientColor('sodium'),
                        borderRadius: 3,
                      }
                    }}
                  />
                </Box>
              )}
            </Box>
          </>
        )}

        {/* Dietary Flags */}
        {dietaryFlags.length > 0 && (
          <>
            <Typography variant="h6" sx={{ 
              fontFamily: 'Prompt, sans-serif', 
              fontWeight: 600, 
              mb: 2,
              fontSize: '1rem'
            }}>
              เหมาะสำหรับ
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
              {dietaryFlags.map((flag, index) => (
                <Chip
                  key={index}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <span style={{ fontSize: '0.8rem' }}>{flag.icon}</span>
                      <span>{flag.label}</span>
                    </Box>
                  }
                  sx={{
                    bgcolor: '#10B981',
                    color: 'white',
                    fontFamily: 'Prompt, sans-serif',
                    fontWeight: 500,
                    '& .MuiChip-label': {
                      px: 1
                    }
                  }}
                />
              ))}
            </Box>
          </>
        )}

        {/* Ingredients */}
        {nutrition.ingredients && nutrition.ingredients.length > 0 && (
          <>
            <Typography variant="h6" sx={{ 
              fontFamily: 'Prompt, sans-serif', 
              fontWeight: 600, 
              mb: 2,
              fontSize: '1rem'
            }}>
              ส่วนผสม
            </Typography>

            <Typography sx={{
              fontSize: '0.9rem',
              color: '#374151',
              fontFamily: 'Prompt, sans-serif',
              lineHeight: 1.6,
              mb: 3
            }}>
              {nutrition.ingredients.join(', ')}
            </Typography>
          </>
        )}

        {/* Allergens */}
        {nutrition.allergens && nutrition.allergens.length > 0 && (
          <>
            <Typography variant="h6" sx={{ 
              fontFamily: 'Prompt, sans-serif', 
              fontWeight: 600, 
              mb: 2,
              fontSize: '1rem',
              color: '#EF4444'
            }}>
              ⚠️ สารก่อภูมิแพ้
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
              {nutrition.allergens.map((allergen, index) => (
                <Chip
                  key={index}
                  label={allergen}
                  sx={{
                    bgcolor: '#FEF2F2',
                    color: '#EF4444',
                    border: '1px solid #FECACA',
                    fontFamily: 'Prompt, sans-serif',
                    fontWeight: 500
                  }}
                />
              ))}
            </Box>
          </>
        )}

        {/* Serving Size */}
        {nutrition.servingSize && (
          <Box sx={{ 
            bgcolor: '#F9FAFB', 
            p: 2, 
            borderRadius: 2,
            border: '1px solid #E5E7EB'
          }}>
            <Typography sx={{
              fontSize: '0.85rem',
              color: '#6B7280',
              fontFamily: 'Prompt, sans-serif',
              textAlign: 'center'
            }}>
              ข้อมูลโภชนาการต่อ: {nutrition.servingSize}
            </Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  );
} 