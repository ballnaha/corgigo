import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedMenus() {
  console.log('🌱 เริ่มต้น Seed Menus...');

  try {
    // ค้นหา Restaurant ที่มีสถานะ APPROVED
    const restaurants = await prisma.restaurant.findMany({
      where: {
        status: 'APPROVED',
      },
      take: 3, // เอาแค่ 3 ร้านแรก
    });

    if (restaurants.length === 0) {
      console.log('❌ ไม่พบร้านอาหารที่อนุมัติแล้ว กรุณาสร้างร้านอาหารก่อน');
      return;
    }

    for (const restaurant of restaurants) {
      console.log(`🏪 สร้างเมนูสำหรับร้าน: ${restaurant.name}`);

      // สร้างหมวดหมู่อาหาร
      const categories = await Promise.all([
        prisma.category.create({
          data: {
            name: 'ส้มตำ',
            description: 'ส้มตำและอาหารอีสาน',
            order: 1,
            restaurantId: restaurant.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        }),
        prisma.category.create({
          data: {
            name: 'อาหารปิ้งย่าง',
            description: 'อาหารปิ้งย่างทุกชนิด',
            order: 2,
            restaurantId: restaurant.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        }),
        prisma.category.create({
          data: {
            name: 'แกง',
            description: 'แกงและอาหารจานร้อน',
            order: 3,
            restaurantId: restaurant.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        }),
        prisma.category.create({
          data: {
            name: 'ผัด',
            description: 'อาหารผัดทุกชนิด',
            order: 4,
            restaurantId: restaurant.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        }),
        prisma.category.create({
          data: {
            name: 'ของหวาน',
            description: 'ของหวานและเครื่องดื่ม',
            order: 5,
            restaurantId: restaurant.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        }),
      ]);

      console.log(`📂 สร้างหมวดหมู่เสร็จแล้ว: ${categories.length} หมวดหมู่`);

      // สร้างเมนูอาหาร
      const menuItems = [
        // ส้มตำ
        {
          name: 'ส้มตำไทย',
          description: 'ส้มตำรสแซ่บ ใส่ถั่วฝักยาว มะเขือเทศ กุ้งแห้ง',
          price: 60,
          categoryId: categories[0].id,
          isAvailable: true,
        },
        {
          name: 'ส้มตำปู',
          description: 'ส้มตำใส่ปูนา รสจัดจ้าน',
          price: 80,
          categoryId: categories[0].id,
          isAvailable: true,
        },
        {
          name: 'ส้มตำปลาร้า',
          description: 'ส้มตำปลาร้า รสชาติเข้มข้น',
          price: 70,
          categoryId: categories[0].id,
          isAvailable: true,
        },
        
        // อาหารปิ้งย่าง
        {
          name: 'ไก่ย่าง',
          description: 'ไก่ย่างเครื่องเทศ หอมกรุ่น เสิร์ฟพร้อมน้ำจิ้มแจ่ว',
          price: 120,
          categoryId: categories[1].id,
          isAvailable: true,
        },
        {
          name: 'หมูย่าง',
          description: 'หมูย่างหวาน เนื้อนุ่ม รสชาติกำลังดี',
          price: 100,
          categoryId: categories[1].id,
          isAvailable: true,
        },
        {
          name: 'ปลาเผา',
          description: 'ปลาเผาเกลือ สด หวาน เนื้อแน่น',
          price: 150,
          categoryId: categories[1].id,
          isAvailable: false, // หมด
        },
        
        // แกง
        {
          name: 'แกงเขียวหวานไก่',
          description: 'แกงเขียวหวานรสชาติเข้มข้น เสิร์ฟพร้อมข้าวสวย',
          price: 80,
          categoryId: categories[2].id,
          isAvailable: true,
        },
        {
          name: 'แกงส้มปลา',
          description: 'แกงส้มปลา รสเปรื้อง ใส่ผักสด',
          price: 90,
          categoryId: categories[2].id,
          isAvailable: true,
        },
        
        // ผัด
        {
          name: 'ผัดไทย',
          description: 'ผัดไทยรสชาติเป็นเอกลักษณ์ ใส่กุ้งสด ไข่ไก่',
          price: 70,
          categoryId: categories[3].id,
          isAvailable: true,
        },
        {
          name: 'ผัดซีอิ๊วหมู',
          description: 'ผัดซีอิ๊วหมูใส่ผักคะน้า รสชาติกำลังดี',
          price: 65,
          categoryId: categories[3].id,
          isAvailable: true,
        },
        {
          name: 'ผัดกะเพราไก่',
          description: 'ผัดกะเพราไก่ไข่ดาว เผ็ดร้อน อร่อย',
          price: 55,
          categoryId: categories[3].id,
          isAvailable: true,
        },
        
        // ของหวาน
        {
          name: 'ข้าวเหนียวหวาน',
          description: 'ข้าวเหนียวหวาน กะทิสด หวานมัน อร่อย',
          price: 40,
          categoryId: categories[4].id,
          isAvailable: true,
        },
        {
          name: 'ทับทิมกรอบ',
          description: 'ทับทิมกรอบน้ำแข็งใส เย็นชื่นใจ',
          price: 35,
          categoryId: categories[4].id,
          isAvailable: true,
        },
        {
          name: 'น้ำใส่มะนาว',
          description: 'น้ำมะนาวสด เปรื้อย หวาน เย็น',
          price: 25,
          categoryId: categories[4].id,
          isAvailable: true,
        },
      ];

      // บันทึกเมนูลงฐานข้อมูล
      for (const menuData of menuItems) {
        await prisma.menuItem.create({
          data: {
            ...menuData,
            restaurantId: restaurant.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }

      console.log(`🍽️  สร้างเมนูเสร็จแล้ว: ${menuItems.length} เมนู`);
      console.log('');
    }

    console.log('✅ Seed Menus เสร็จสิ้น!');

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการ Seed Menus:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// รันสคริปต์
if (require.main === module) {
  seedMenus()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default seedMenus; 