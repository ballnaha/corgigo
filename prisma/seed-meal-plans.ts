import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedMealPlans() {
  console.log('🥗 Seeding meal plans...');

  try {
    // Get existing restaurants
    const restaurants = await prisma.restaurant.findMany({
      where: { status: 'APPROVED' },
      take: 3,
    });

    if (restaurants.length === 0) {
      console.log('No approved restaurants found. Please seed restaurants first.');
      return;
    }

    const mealPlansData = [
      {
        restaurantId: restaurants[0].id,
        name: '7-Day Keto Challenge',
        description: 'โปรแกรมอาหารคีโตเจนิค 7 วัน ช่วยเผาผลาญไขมัน เข้าสู่ภาวะ Ketosis อย่างรวดเร็ว พร้อมคำแนะนำจากนักโภชนาการมืออาชีพ',
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
        tags: JSON.stringify(['Low Carb', 'High Fat', 'Weight Loss', 'Ketogenic']),
        isPopular: true,
        isRecommended: false,
        status: 'ACTIVE',
      },
      {
        restaurantId: restaurants[0].id,
        name: '14-Day Clean Eating Program',
        description: 'อาหารคลีนสำหรับ 14 วัน ไม่มีน้ำตาลเติม ไม่มีของแปรรูป เน้นอาหารธรรมชาติ 100% วัตถุดิบออร์แกนิค',
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
        tags: JSON.stringify(['Natural', 'No Processed', 'Organic', 'Clean']),
        isPopular: false,
        isRecommended: true,
        status: 'ACTIVE',
      },
      {
        restaurantId: restaurants[1]?.id || restaurants[0].id,
        name: '30-Day Muscle Building Plan',
        description: 'โปรแกรมเพิ่มกล้ามเนื้อ 30 วัน โปรตีนสูง คาร์บดี เหมาะสำหรับคนออกกำลังกาย พร้อมอาหารเสริมธรรมชาติ',
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
        tags: JSON.stringify(['High Protein', 'Muscle Building', 'Pre/Post Workout', 'Athletes']),
        isPopular: true,
        isRecommended: true,
        status: 'ACTIVE',
      },
      {
        restaurantId: restaurants[1]?.id || restaurants[0].id,
        name: '7-Day Vegan Detox',
        description: 'ดีท็อกซ์ด้วยอาหารวีแกน 7 วัน ล้างสารพิษ เพิ่มพลังงาน ผิวพรรณดีขึ้น เน้นผักใบเขียวและผลไม้ตามฤดูกาล',
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
        tags: JSON.stringify(['Plant-Based', 'Detox', 'Antioxidants', 'Eco-Friendly']),
        isPopular: false,
        isRecommended: false,
        status: 'ACTIVE',
      },
      {
        restaurantId: restaurants[2]?.id || restaurants[0].id,
        name: '14-Day Weight Loss Accelerator',
        description: 'โปรแกรมลดน้ำหนักเร่งด่วน 14 วัน ควบคุมแคลอรี่ เพิ่มเมแทบอลิซึม พร้อมคำแนะนำการออกกำลังกาย',
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
        tags: JSON.stringify(['Low Calorie', 'Fat Burning', 'Metabolism Boost', 'Quick Results']),
        isPopular: true,
        isRecommended: false,
        status: 'ACTIVE',
      },
      {
        restaurantId: restaurants[2]?.id || restaurants[0].id,
        name: '7-Day Low Carb Starter',
        description: 'เริ่มต้นลดคาร์บอย่างถูกวิธี 7 วัน เมนูง่าย อร่อย ไม่หิว เหมาะสำหรับมือใหม่ที่อยากลองลดคาร์บ',
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
        tags: JSON.stringify(['Beginner Friendly', 'Low Carb', 'Easy to Follow', 'Sustainable']),
        isPopular: false,
        isRecommended: true,
        status: 'ACTIVE',
      },
    ];

    for (const planData of mealPlansData) {
      const mealPlan = await prisma.mealPlan.create({
        data: planData,
      });
      console.log(`✅ Created meal plan: ${planData.name}`);

      // Create some sample meals for the first plan only (for demo)
      if (planData.name === '7-Day Keto Challenge') {
        const mealPlanMealsData = [
          // Day 1
          {
            mealPlanId: mealPlan.id,
            menuItemId: 'sample-menu-1', // Will need to create actual menu items
            dayNumber: 1,
            mealType: 'BREAKFAST',
            order: 1,
            portion: 1.0,
            notes: 'Avocado Egg Bowl - ไข่ลูกเขยใส่อะโวคาโด เสิร์ฟกับเบคอนกรอบ',
          },
          {
            mealPlanId: mealPlan.id,
            menuItemId: 'sample-menu-2',
            dayNumber: 1,
            mealType: 'LUNCH',
            order: 1,
            portion: 1.0,
            notes: 'Grilled Salmon with Asparagus - แซลมอนย่างเสิร์ฟกับหน่อไผ่ฝรั่ง',
          },
          {
            mealPlanId: mealPlan.id,
            menuItemId: 'sample-menu-3',
            dayNumber: 1,
            mealType: 'DINNER',
            order: 1,
            portion: 1.0,
            notes: 'Beef Stir-fry with Broccoli - เนื้อวัวผัดบร็อกโคลี่',
          },
        ];

        console.log(`📝 Sample meal plan meals created for ${planData.name}`);
      }
    }

    console.log('✅ Meal plans seeded successfully!');
  } catch (error) {
    console.error('Error seeding meal plans:', error);
    throw error;
  }
}

export default seedMealPlans;

// Run if called directly
if (require.main === module) {
  seedMealPlans()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
} 