'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  Avatar,
  Container,
  Tabs,
  Tab,
  Divider,
  LinearProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  ArrowBack,
  LocalFireDepartment,
  FitnessCenter,
  Star,
  ShoppingCart,
  CheckCircle,
} from '@mui/icons-material';
import NutritionDrawer from '../../../components/NutritionDrawer';
import OrderDrawer from '../../../components/OrderDrawer';

interface MealPlanDetail {
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
  restaurant: {
    name: string;
    rating: number;
    image?: string;
  };
  dailyMenus: DailyMenu[];
  features: string[];
  nutrition: NutritionSummary;
}

interface DailyMenu {
  day: number;
  date?: string;
  meals: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

interface Meal {
  type: string;
  name: string;
  description: string;
  image?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
}

interface NutritionSummary {
  avgCalories: number;
  avgProtein: number;
  avgCarbs: number;
  avgFat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

export default function MealPlanDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [mealPlan, setMealPlan] = useState<MealPlanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  
  // Drawer states
  const [nutritionDrawerOpen, setNutritionDrawerOpen] = useState(false);
  const [orderDrawerOpen, setOrderDrawerOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const [orderSuccessOpen, setOrderSuccessOpen] = useState(false);

  useEffect(() => {
    if (params?.id) {
      loadMealPlanDetail();
    }
  }, [params?.id]);

  const loadMealPlanDetail = async () => {
    setLoading(true);
    try {
      if (!params?.id) return;
      
      // Simulate API call - ใช้ข้อมูลจำลอง
      const demoMealPlan: MealPlanDetail = {
        id: params.id as string,
        name: '7-Day Keto Challenge',
        description: 'โปรแกรมอาหารคีโตเจนิค 7 วัน ช่วยเผาผลาญไขมัน เข้าสู่ภาวะ Ketosis อย่างรวดเร็ว พร้อมคำแนะนำจากนักโภชนาการมืออาชีพ',
        type: 'KETO',
        duration: 'SEVEN_DAYS',
        price: 2100,
        originalPrice: 2500,
        totalMeals: 21,
        mealsPerDay: 3,
        includesSnacks: true,
        image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=300&fit=crop',
        tags: ['Low Carb', 'High Fat', 'Weight Loss', 'Ketogenic'],
        restaurant: {
          name: 'Healthy Kitchen',
          rating: 4.8,
          image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=100&h=100&fit=crop'
        },
        features: [
          'คำนวณแคลอรี่และโภชนาการที่เหมาะสม',
          'วัตถุดิบสดใหม่ทุกวัน',
          'ปรุงในครัวมาตรฐาน HACCP',
          'จัดส่งถึงบ้านทุกเช้า',
          'คำแนะนำจากนักโภชนาการ',
          'รับประกันผลลัพธ์ หรือคืนเงิน',
        ],
        nutrition: {
          avgCalories: 1200,
          avgProtein: 80,
          avgCarbs: 20,
          avgFat: 90,
          fiber: 25,
          sugar: 15,
          sodium: 1800,
        },
        dailyMenus: [
          {
            day: 1,
            totalCalories: 1180,
            totalProtein: 82,
            totalCarbs: 18,
            totalFat: 88,
            meals: [
              {
                type: 'BREAKFAST',
                name: 'Avocado Egg Bowl',
                description: 'ไข่ลูกเขยใส่อะโวคาโด เสิร์ฟกับเบคอนกรอบและผักสลัด',
                image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=300&h=200&fit=crop',
                calories: 420,
                protein: 28,
                carbs: 8,
                fat: 32,
                ingredients: ['ไข่ไก่ 2 ฟอง', 'อะโวคาโด 1/2 ลูก', 'เบคอน 2 แผ่น', 'ผักสลัดผสม', 'น้ำมันมะกอก']
              },
              {
                type: 'LUNCH',
                name: 'Grilled Salmon with Asparagus',
                description: 'แซลมอนย่างเสิร์ฟกับหน่อไผ่ฝรั่งและซอสมะนาว',
                image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&h=200&fit=crop',
                calories: 380,
                protein: 32,
                carbs: 6,
                fat: 28,
                ingredients: ['แซลมอน 150g', 'หน่อไผ่ฝรั่ง', 'มะนาว', 'เนย', 'เกลือ', 'พริกไทย']
              },
              {
                type: 'DINNER',
                name: 'Beef Stir-fry with Broccoli',
                description: 'เนื้อวัวผัดบร็อกโคลี่ในน้ำมันมะกอกและเครื่องเทศ',
                image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=300&h=200&fit=crop',
                calories: 380,
                protein: 22,
                carbs: 4,
                fat: 28,
                ingredients: ['เนื้อวัว 120g', 'บร็อกโคลี่', 'น้ำมันมะกอก', 'กระเทียม', 'ซีอิ๊วบาง']
              }
            ]
          },
          {
            day: 2,
            totalCalories: 1220,
            totalProtein: 85,
            totalCarbs: 22,
            totalFat: 92,
            meals: [
              {
                type: 'BREAKFAST',
                name: 'Keto Pancakes',
                description: 'แพนเค้กคีโตโดยใช้แป้งอัลมอนด์ เสิร์ฟกับเนยและเบอร์รี่',
                image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=300&h=200&fit=crop',
                calories: 380,
                protein: 25,
                carbs: 8,
                fat: 30,
                ingredients: ['แป้งอัลมอนด์', 'ไข่', 'เนย', 'สตรอเบอร์รี่', 'ครีมสด']
              },
              {
                type: 'LUNCH',
                name: 'Chicken Caesar Salad',
                description: 'สลัดไก่ซีซาร์ โรยด้วยชีสพาร์เมซานและแครกเกอร์คีโต',
                image: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=300&h=200&fit=crop',
                calories: 420,
                protein: 35,
                carbs: 8,
                fat: 32,
                ingredients: ['เนื้อไก่ย่าง', 'ผักสลัดโรมัน', 'ชีสพาร์เมซาน', 'ซอสซีซาร์', 'แครกเกอร์คีโต']
              },
              {
                type: 'DINNER',
                name: 'Pork Belly with Vegetables',
                description: 'หมูสามชั้นย่างกับผักโขมและเห็ด',
                image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&h=200&fit=crop',
                calories: 420,
                protein: 25,
                carbs: 6,
                fat: 30,
                ingredients: ['หมูสามชั้น', 'ผักโขม', 'เห็ดแชมปิญง', 'กระเทียม', 'น้ำมันมะกอก']
              }
            ]
          },
          // เพิ่มวันอื่นๆ ในแบบเดียวกัน...
        ]
      };

      setMealPlan(demoMealPlan);
    } catch (error) {
      console.error('Error loading meal plan detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMealTypeIcon = (type: string) => {
    switch (type) {
      case 'BREAKFAST': return '🌅';
      case 'LUNCH': return '☀️';
      case 'DINNER': return '🌙';
      case 'SNACK': return '🍎';
      default: return '🍽️';
    }
  };

  const getMealTypeName = (type: string) => {
    switch (type) {
      case 'BREAKFAST': return 'อาหารเช้า';
      case 'LUNCH': return 'อาหารกลางวัน';
      case 'DINNER': return 'อาหารเย็น';
      case 'SNACK': return 'ขนม';
      default: return type;
    }
  };

  // Handle meal click to show nutrition drawer
  const handleMealClick = (meal: Meal) => {
    if (!mealPlan) return;
    
    const mealInfo = {
      id: `${mealPlan.id}-${meal.name}`,
      name: meal.name,
      description: meal.description,
      image: meal.image,
      price: Math.round(mealPlan.price / mealPlan.totalMeals), // Calculate per meal price
      estimatedTime: '15-20 นาที',
      nutrition: {
        calories: meal.calories,
        protein: meal.protein,
        carbohydrates: meal.carbs,
        fat: meal.fat,
        fiber: 8,
        sugar: 5,
        sodium: 600,
        servingSize: '1 จาน',
        ingredients: meal.ingredients,
        allergens: ['กลูเตน', 'นม'],
        isVegan: meal.type === 'BREAKFAST' ? false : true,
        isVegetarian: true,
        isKeto: mealPlan.type === 'KETO',
        isLowCarb: mealPlan.type === 'KETO' || mealPlan.type === 'LOW_CARB',
        isGlutenFree: false,
        isDairyFree: meal.type === 'DINNER',
      }
    };

    setSelectedMeal(mealInfo);
    setNutritionDrawerOpen(true);
  };

  // Handle order
  const handleOrderClick = () => {
    if (!mealPlan) return;
    setOrderDrawerOpen(true);
  };

  // Handle order complete
  const handleOrderComplete = (orderData: any) => {
    console.log('Order completed:', orderData);
    setOrderSuccessOpen(true);
    // Here you would typically save to database or send to API
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Box sx={{ bgcolor: 'white', p: 2, borderBottom: '1px solid #F0F0F0' }}>
          <LinearProgress />
        </Box>
        <Box sx={{ flex: 1, p: 2 }}>
          {[1, 2, 3].map((n) => (
            <Card key={n} sx={{ mb: 2, p: 2 }}>
              <LinearProgress sx={{ mb: 2 }} />
              <Box sx={{ height: 100 }} />
            </Card>
          ))}
        </Box>
      </Box>
    );
  }

  if (!mealPlan) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" sx={{ fontFamily: 'Prompt, sans-serif', color: '#666' }}>
          ไม่พบคอร์สอาหารนี้
        </Typography>
        <Button onClick={() => router.back()} sx={{ mt: 2 }}>
          กลับไป
        </Button>
      </Box>
    );
  }

  const currentDayMenu = mealPlan.dailyMenus.find(menu => menu.day === selectedDay);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #F0F0F0', p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => router.back()} sx={{ color: '#1A1A1A' }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" sx={{ fontFamily: 'Prompt, sans-serif', fontWeight: 600, color: '#1A1A1A', flex: 1 }}>
          {mealPlan.name}
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto', bgcolor: '#F8F9FA' }}>
        <Container maxWidth="md" sx={{ py: 2, px: { xs: 1, sm: 2 } }}>
          {/* Hero Section */}
          <Card sx={{ mb: 3, borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
            <Box
              sx={{
                height: 200,
                backgroundImage: `url(${mealPlan.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 100%)',
                }
              }}
            >
              <Box sx={{ position: 'absolute', bottom: 16, left: 16, color: 'white', zIndex: 1 }}>
                <Typography variant="h5" sx={{ fontFamily: 'Prompt, sans-serif', fontWeight: 700, mb: 1 }}>
                  {mealPlan.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip label={`${mealPlan.totalMeals} มื้อ`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                  <Chip label={`${mealPlan.nutrition.avgCalories} kcal/วัน`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                </Box>
              </Box>
            </Box>
          </Card>

          {/* Price and Action */}
          <Card sx={{ mb: 3, p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: '#10B981', fontFamily: 'Prompt, sans-serif' }}>
                    ฿{mealPlan.price.toLocaleString()}
                  </Typography>
                  {mealPlan.originalPrice && (
                    <Typography sx={{ fontSize: '1.2rem', color: '#9CA3AF', textDecoration: 'line-through', fontFamily: 'Prompt, sans-serif' }}>
                      ฿{mealPlan.originalPrice.toLocaleString()}
                    </Typography>
                  )}
                </Box>
                <Typography sx={{ color: '#6B7280', fontFamily: 'Prompt, sans-serif' }}>
                  {mealPlan.mealsPerDay} มื้อต่อวัน • {mealPlan.totalMeals} มื้อรวม
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                onClick={handleOrderClick}
                sx={{
                  bgcolor: '#10B981',
                  color: 'white',
                  fontFamily: 'Prompt, sans-serif',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#059669' },
                }}
              >
                สั่งซื้อเลย
              </Button>
            </Box>
          </Card>

          {/* Tabs */}
          <Card sx={{ mb: 3, borderRadius: 3 }}>
            <Tabs
              value={activeTab}
              onChange={(_, value) => setActiveTab(value)}
              sx={{
                '& .MuiTab-root': {
                  fontFamily: 'Prompt, sans-serif',
                  fontWeight: 500,
                  textTransform: 'none',
                  flex: 1,
                },
                '& .Mui-selected': {
                  color: '#10B981 !important',
                  fontWeight: 600,
                },
                '& .MuiTabs-indicator': {
                  bgcolor: '#10B981',
                },
              }}
            >
              <Tab label="เมนูรายวัน" />
              <Tab label="ข้อมูลโภชนาการ" />
              <Tab label="รายละเอียด" />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {activeTab === 0 && (
                <>
                  {/* Day Selector */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontFamily: 'Prompt, sans-serif', fontWeight: 600, mb: 2 }}>
                      เลือกวัน
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {mealPlan.dailyMenus.map((menu) => (
                        <Chip
                          key={menu.day}
                          label={`วันที่ ${menu.day}`}
                          onClick={() => setSelectedDay(menu.day)}
                          variant={selectedDay === menu.day ? 'filled' : 'outlined'}
                          sx={{
                            bgcolor: selectedDay === menu.day ? '#10B981' : 'transparent',
                            color: selectedDay === menu.day ? 'white' : '#6B7280',
                            fontFamily: 'Prompt, sans-serif',
                            '&:hover': {
                              bgcolor: selectedDay === menu.day ? '#059669' : '#F3F4F6',
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Current Day Menu */}
                  {currentDayMenu && (
                    <>
                      <Typography variant="h6" sx={{ fontFamily: 'Prompt, sans-serif', fontWeight: 600, mb: 2 }}>
                        เมนูวันที่ {selectedDay}
                      </Typography>
                      
                      {/* Daily Summary */}
                      <Card sx={{ mb: 3, p: 2, bgcolor: '#F8F9FA' }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography sx={{ fontSize: '1.2rem', fontWeight: 600, color: '#EF4444' }}>
                              {currentDayMenu.totalCalories}
                            </Typography>
                            <Typography sx={{ fontSize: '0.8rem', color: '#6B7280' }}>kcal</Typography>
                          </Box>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography sx={{ fontSize: '1.2rem', fontWeight: 600, color: '#3B82F6' }}>
                              {currentDayMenu.totalProtein}g
                            </Typography>
                            <Typography sx={{ fontSize: '0.8rem', color: '#6B7280' }}>โปรตีน</Typography>
                          </Box>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography sx={{ fontSize: '1.2rem', fontWeight: 600, color: '#F59E0B' }}>
                              {currentDayMenu.totalCarbs}g
                            </Typography>
                            <Typography sx={{ fontSize: '0.8rem', color: '#6B7280' }}>คาร์บ</Typography>
                          </Box>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography sx={{ fontSize: '1.2rem', fontWeight: 600, color: '#10B981' }}>
                              {currentDayMenu.totalFat}g
                            </Typography>
                            <Typography sx={{ fontSize: '0.8rem', color: '#6B7280' }}>ไขมัน</Typography>
                          </Box>
                        </Box>
                      </Card>

                      {/* Meals */}
                      {currentDayMenu.meals.map((meal, index) => (
                        <Card key={index} sx={{ mb: 2, borderRadius: 2 }}>
                          <CardContent sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                              <Box
                                component="img"
                                src={meal.image}
                                onClick={() => handleMealClick(meal)}
                                sx={{ 
                                  width: 80, 
                                  height: 80, 
                                  borderRadius: 2, 
                                  objectFit: 'cover',
                                  cursor: 'pointer',
                                  transition: 'transform 0.2s',
                                  '&:hover': {
                                    transform: 'scale(1.05)',
                                  }
                                }}
                              />
                              <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  <Typography sx={{ fontSize: '1rem' }}>
                                    {getMealTypeIcon(meal.type)}
                                  </Typography>
                                  <Typography sx={{ fontSize: '0.8rem', color: '#6B7280', fontFamily: 'Prompt, sans-serif' }}>
                                    {getMealTypeName(meal.type)}
                                  </Typography>
                                </Box>
                                <Typography sx={{ fontWeight: 600, fontFamily: 'Prompt, sans-serif', mb: 0.5 }}>
                                  {meal.name}
                                </Typography>
                                <Typography sx={{ fontSize: '0.8rem', color: '#6B7280', fontFamily: 'Prompt, sans-serif', mb: 1 }}>
                                  {meal.description}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, fontSize: '0.7rem' }}>
                                  <span>{meal.calories} kcal</span>
                                  <span>P: {meal.protein}g</span>
                                  <span>C: {meal.carbs}g</span>
                                  <span>F: {meal.fat}g</span>
                                </Box>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </>
                  )}
                </>
              )}

              {activeTab === 1 && (
                <Box>
                  <Typography variant="h6" sx={{ fontFamily: 'Prompt, sans-serif', fontWeight: 600, mb: 2 }}>
                    ข้อมูลโภชนาการเฉลี่ยต่อวัน
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                    <Card sx={{ p: 2, textAlign: 'center' }}>
                      <LocalFireDepartment sx={{ fontSize: 40, color: '#EF4444', mb: 1 }} />
                      <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, color: '#EF4444' }}>
                        {mealPlan.nutrition.avgCalories}
                      </Typography>
                      <Typography sx={{ fontSize: '0.8rem', color: '#6B7280' }}>แคลอรี่ (kcal)</Typography>
                    </Card>
                    <Card sx={{ p: 2, textAlign: 'center' }}>
                      <FitnessCenter sx={{ fontSize: 40, color: '#3B82F6', mb: 1 }} />
                      <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, color: '#3B82F6' }}>
                        {mealPlan.nutrition.avgProtein}g
                      </Typography>
                      <Typography sx={{ fontSize: '0.8rem', color: '#6B7280' }}>โปรตีน</Typography>
                    </Card>
                    <Card sx={{ p: 2, textAlign: 'center' }}>
                      <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, color: '#F59E0B' }}>
                        {mealPlan.nutrition.avgCarbs}g
                      </Typography>
                      <Typography sx={{ fontSize: '0.8rem', color: '#6B7280' }}>คาร์โบไฮเดรต</Typography>
                    </Card>
                    <Card sx={{ p: 2, textAlign: 'center' }}>
                      <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, color: '#10B981' }}>
                        {mealPlan.nutrition.avgFat}g
                      </Typography>
                      <Typography sx={{ fontSize: '0.8rem', color: '#6B7280' }}>ไขมัน</Typography>
                    </Card>
                  </Box>
                </Box>
              )}

              {activeTab === 2 && (
                <Box>
                  <Typography variant="h6" sx={{ fontFamily: 'Prompt, sans-serif', fontWeight: 600, mb: 2 }}>
                    จุดเด่นของคอร์ส
                  </Typography>
                  {mealPlan.features.map((feature, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <CheckCircle sx={{ color: '#10B981', fontSize: 20 }} />
                      <Typography sx={{ fontFamily: 'Prompt, sans-serif' }}>{feature}</Typography>
                    </Box>
                  ))}
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="h6" sx={{ fontFamily: 'Prompt, sans-serif', fontWeight: 600, mb: 2 }}>
                    เกี่ยวกับร้าน
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={mealPlan.restaurant.image} sx={{ width: 50, height: 50 }} />
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontFamily: 'Prompt, sans-serif' }}>
                        {mealPlan.restaurant.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Star sx={{ fontSize: 16, color: '#F59E0B' }} />
                        <Typography sx={{ fontSize: '0.9rem', color: '#6B7280' }}>
                          {mealPlan.restaurant.rating}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Card>

          <Box sx={{ height: 20 }} />
        </Container>
      </Box>

      {/* Nutrition Drawer */}
      <NutritionDrawer
        open={nutritionDrawerOpen}
        onClose={() => setNutritionDrawerOpen(false)}
        mealInfo={selectedMeal}
      />

      {/* Order Drawer */}
      <OrderDrawer
        open={orderDrawerOpen}
        onClose={() => setOrderDrawerOpen(false)}
        mealPlan={mealPlan ? {
          id: mealPlan.id,
          name: mealPlan.name,
          description: mealPlan.description,
          image: mealPlan.image,
          price: mealPlan.price,
          originalPrice: mealPlan.originalPrice,
          duration: mealPlan.duration,
          totalMeals: mealPlan.totalMeals,
          mealsPerDay: mealPlan.mealsPerDay,
          includesSnacks: mealPlan.includesSnacks,
          restaurant: mealPlan.restaurant,
        } : null}
        onOrderComplete={handleOrderComplete}
      />

      {/* Success Snackbar */}
      <Snackbar 
        open={orderSuccessOpen} 
        autoHideDuration={6000} 
        onClose={() => setOrderSuccessOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setOrderSuccessOpen(false)} severity="success" sx={{ width: '100%' }}>
          🎉 สั่งซื้อคอร์สอาหารเรียบร้อยแล้ว! เราจะติดต่อกลับไปเร็วๆ นี้
        </Alert>
      </Snackbar>
    </Box>
  );
} 