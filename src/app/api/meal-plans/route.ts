import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Demo meal plans data
    const demoMealPlans = [
      {
        id: '1',
        name: '7-Day Keto Challenge',
        description: 'โปรแกรมอาหารคีโตเจนิค 7 วัน ช่วยเผาผลาญไขมัน เข้าสู่ภาวะ Ketosis อย่างรวดเร็ว',
        type: 'KETO',
        duration: 'SEVEN_DAYS',
        price: 2100,
        originalPrice: 2500,
        totalMeals: 21,
        mealsPerDay: 3,
        includesSnacks: true,
        avgCaloriesPerDay: 1200,
        avgProteinPerDay: 80,
        avgCarbsPerDay: 20,
        avgFatPerDay: 90,
        image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=300&fit=crop',
        tags: ['Low Carb', 'High Fat', 'Weight Loss'],
        isPopular: true,
        isRecommended: false,
        restaurant: {
          name: 'Healthy Kitchen',
          rating: 4.8,
          image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=100&h=100&fit=crop'
        },
        subscriptionCount: 45
      },
      {
        id: '2',
        name: '14-Day Clean Eating Program',
        description: 'อาหารคลีนสำหรับ 14 วัน ไม่มีน้ำตาลเติม ไม่มีของแปรรูป เน้นอาหารธรรมชาติ 100%',
        type: 'CLEAN_EATING',
        duration: 'FOURTEEN_DAYS',
        price: 3800,
        originalPrice: 4200,
        totalMeals: 42,
        mealsPerDay: 3,
        includesSnacks: true,
        avgCaloriesPerDay: 1400,
        avgProteinPerDay: 100,
        avgCarbsPerDay: 120,
        avgFatPerDay: 50,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
        tags: ['Natural', 'No Processed', 'Organic'],
        isPopular: false,
        isRecommended: true,
        restaurant: {
          name: 'Green Garden',
          rating: 4.9,
          image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=100&h=100&fit=crop'
        },
        subscriptionCount: 32
      },
      {
        id: '3',
        name: '30-Day Muscle Building Plan',
        description: 'โปรแกรมเพิ่มกล้ามเนื้อ 30 วัน โปรตีนสูง คาร์บดี เหมาะสำหรับคนออกกำลังกาย',
        type: 'MUSCLE_GAIN',
        duration: 'THIRTY_DAYS',
        price: 7200,
        originalPrice: 8000,
        totalMeals: 90,
        mealsPerDay: 3,
        includesSnacks: true,
        avgCaloriesPerDay: 2200,
        avgProteinPerDay: 150,
        avgCarbsPerDay: 200,
        avgFatPerDay: 80,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
        tags: ['High Protein', 'Muscle Building', 'Pre/Post Workout'],
        isPopular: true,
        isRecommended: true,
        restaurant: {
          name: 'Power Nutrition',
          rating: 4.7,
          image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=100&h=100&fit=crop'
        },
        subscriptionCount: 28
      },
      {
        id: '4',
        name: '7-Day Vegan Detox',
        description: 'ดีท็อกซ์ด้วยอาหารวีแกน 7 วัน ล้างสารพิษ เพิ่มพลังงาน ผิวพรรณดีขึ้น',
        type: 'VEGAN',
        duration: 'SEVEN_DAYS',
        price: 1800,
        totalMeals: 21,
        mealsPerDay: 3,
        includesSnacks: true,
        avgCaloriesPerDay: 1300,
        avgProteinPerDay: 60,
        avgCarbsPerDay: 150,
        avgFatPerDay: 45,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
        tags: ['Plant-Based', 'Detox', 'Antioxidants'],
        isPopular: false,
        isRecommended: false,
        restaurant: {
          name: 'Pure Plant',
          rating: 4.6,
          image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=100&h=100&fit=crop'
        },
        subscriptionCount: 15
      },
      {
        id: '5',
        name: '14-Day Weight Loss Accelerator',
        description: 'โปรแกรมลดน้ำหนักเร่งด่วน 14 วัน ควบคุมแคลอรี่ เพิ่มเมแทบอลิซึม',
        type: 'WEIGHT_LOSS',
        duration: 'FOURTEEN_DAYS',
        price: 3200,
        originalPrice: 3600,
        totalMeals: 42,
        mealsPerDay: 3,
        includesSnacks: false,
        avgCaloriesPerDay: 1000,
        avgProteinPerDay: 80,
        avgCarbsPerDay: 80,
        avgFatPerDay: 40,
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop',
        tags: ['Low Calorie', 'Fat Burning', 'Metabolism Boost'],
        isPopular: true,
        isRecommended: false,
        restaurant: {
          name: 'Slim & Fit',
          rating: 4.5,
          image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=100&h=100&fit=crop'
        },
        subscriptionCount: 38
      },
      {
        id: '6',
        name: '7-Day Low Carb Starter',
        description: 'เริ่มต้นลดคาร์บอย่างถูกวิธี 7 วัน เมนูง่าย อร่อย ไม่หิว',
        type: 'LOW_CARB',
        duration: 'SEVEN_DAYS',
        price: 1900,
        totalMeals: 21,
        mealsPerDay: 3,
        includesSnacks: true,
        avgCaloriesPerDay: 1350,
        avgProteinPerDay: 90,
        avgCarbsPerDay: 50,
        avgFatPerDay: 75,
        image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop',
        tags: ['Beginner Friendly', 'Low Carb', 'Easy to Follow'],
        isPopular: false,
        isRecommended: true,
        restaurant: {
          name: 'Low Carb Kitchen',
          rating: 4.4,
          image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=100&h=100&fit=crop'
        },
        subscriptionCount: 22
      }
    ];

    // Filter by type
    let filteredPlans = demoMealPlans;
    if (type && type !== 'ALL') {
      filteredPlans = demoMealPlans.filter(plan => plan.type === type);
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPlans = filteredPlans.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedPlans,
      pagination: {
        page,
        limit,
        total: filteredPlans.length,
        totalPages: Math.ceil(filteredPlans.length / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching meal plans:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

