import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { getThailandNow } from '../src/lib/timezone'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data
  console.log('🗑️ Clearing existing data...')
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.menuItem.deleteMany()
  await prisma.category.deleteMany()
  await prisma.restaurant.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.rider.deleteMany()
  await prisma.userRoles.deleteMany()
  await prisma.user.deleteMany()

  // Create Admin User
  console.log('👨‍💼 Creating admin user...')
  const adminPassword = await bcrypt.hash('admin123', 12)
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@corgigo.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'CorgiGo',
      primaryRole: 'ADMIN',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  })

  await prisma.userRoles.create({
    data: {
      userId: adminUser.id,
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  })

  // Create Restaurant Users and Restaurants
  console.log('🏪 Creating restaurants...')
  const restaurantData = [
    {
      email: 'lacasa@restaurant.com',
      name: 'La Casa Restaurant',
      description: 'ร้านอาหารซีฟู้ดและเบอร์เกอร์คุณภาพสูง บรรยากาศดี เหมาะสำหรับครอบครัว',
      address: '123 ถนนสุขุมวิท เขตวัฒนา กรุงเทพฯ 10110',
      phone: '02-123-4567',
      rating: 4.9,
    },
    {
      email: 'barbaras@cafe.com',
      name: 'Barbaras Café',
      description: 'คาเฟ่สุดชิคในใจกลองเมือง เสิร์ฟอาหารเช้าและกาแฟคุณภาพระดับพรีเมียม',
      address: '456 ถนนสีลม เขตบางรัก กรุงเทพฯ 10500',
      phone: '02-234-5678',
      rating: 4.7,
    },
    {
      email: 'sushizen@restaurant.com',
      name: 'Sushi Zen',
      description: 'ร้านซูชิแท้จากญี่ปุ่น วัตถุดิบสดใหม่ทุกวัน โดยเชฟญี่ปุ่นแท้',
      address: '789 ถนนเพลินจิต เขตปทุมวัน กรุงเทพฯ 10330',
      phone: '02-345-6789',
      rating: 4.8,
    },
    {
      email: 'thaiheritage@restaurant.com',
      name: 'Thai Heritage',
      description: 'อาหารไทยต้นตำรับ รสชาติเข้มข้น เหมือนทำที่บ้าน',
      address: '321 ถนนราชดำริ เขตปทุมวัน กรุงเทพฯ 10330',
      phone: '02-456-7890',
      rating: 4.6,
    },
    {
      email: 'marios@pizzeria.com',
      name: 'Mario\'s Pizzeria',
      description: 'พิซซ่าอิตาเลียนแท้ เตาถ่านดั้งเดิม พาสต้าโฮมเมด',
      address: '654 ถนนทองหล่อ เขตวัฒนา กรุงเทพฯ 10110',
      phone: '02-567-8901',
      rating: 4.5,
    },
    {
      email: 'sweetdreams@bakery.com',
      name: 'Sweet Dreams Bakery',
      description: 'เบเกอรี่และของหวานสไตล์ยุโรป เค้กสั่งทำพิเศษ',
      address: '987 ถนนพระราม 4 เขตปทุมวัน กรุงเทพฯ 10330',
      phone: '02-678-9012',
      rating: 4.4,
    }
  ]

  const restaurants = []
  
  for (const restaurant of restaurantData) {
    const password = await bcrypt.hash('restaurant123', 12)
    
    const user = await prisma.user.create({
      data: {
        email: restaurant.email,
        password: password,
        firstName: restaurant.name.split(' ')[0],
        lastName: restaurant.name.split(' ').slice(1).join(' '),
        primaryRole: 'RESTAURANT',
        status: 'ACTIVE',
      }
    })

    await prisma.userRoles.create({
      data: {
        userId: user.id,
        role: 'RESTAURANT'
      }
    })

    const restaurantRecord = await prisma.restaurant.create({
      data: {
        userId: user.id,
        name: restaurant.name,
        description: restaurant.description,
        address: restaurant.address,
        phone: restaurant.phone,
        rating: restaurant.rating,
        isOpen: true,
        openTime: '08:00',
        closeTime: '22:00',
        status: 'APPROVED',
        approvedAt: getThailandNow(),
        approvedBy: adminUser.id,
      }
    })

    restaurants.push(restaurantRecord)
    console.log(`✅ Created restaurant: ${restaurant.name}`)
  }

  // Create Categories and Menu Items for each restaurant
  console.log('📂 Creating categories and menu items...')
  
  const menuData = [
    // La Casa Restaurant
    {
      restaurantIndex: 0,
      categories: [
        {
          name: 'Seafood',
          description: 'อาหารทะเลสดใหม่',
          items: [
            { name: 'Grilled Salmon', description: 'แซลมอนย่างสไตล์เมดิเตอร์เรเนียน', price: 350 },
            { name: 'Seafood Platter', description: 'จานรวมอาหารทะเลสด', price: 650 },
            { name: 'Fish & Chips', description: 'ปลาทอดกรอบกับมันฝรั่งทอด', price: 220 },
          ]
        },
        {
          name: 'Fast Food',
          description: 'อาหารจานด่วน',
          items: [
            { name: 'Classic Burger', description: 'เบอร์เกอร์เนื้อแท้ 100%', price: 180 },
          ]
        }
      ]
    },
    // Barbaras Café
    {
      restaurantIndex: 1,
      categories: [
        {
          name: 'Drinks',
          description: 'เครื่องดื่มและกาแฟ',
          items: [
            { name: 'Espresso', description: 'กาแฟเอสเปรสโซ่เข้มข้น', price: 80 },
            { name: 'Cappuccino', description: 'คาปูชิโน่หอมนุ่ม', price: 120 },
          ]
        },
        {
          name: 'Dessert',
          description: 'ของหวานและเค้ก',
          items: [
            { name: 'Chocolate Cake', description: 'เค้กช็อกโกแลตเข้มข้น', price: 150 },
            { name: 'Tiramisu', description: 'ทิรามิสุต้นตำรับอิตาเลียน', price: 180 },
          ]
        }
      ]
    },
    // Sushi Zen
    {
      restaurantIndex: 2,
      categories: [
        {
          name: 'Japanese',
          description: 'อาหารญี่ปุ่นแท้',
          items: [
            { name: 'Salmon Sashimi', description: 'ซาชิมิแซลมอนสดใหม่', price: 280 },
            { name: 'California Roll', description: 'แคลิฟอร์เนียโรลคลาสสิค', price: 220 },
            { name: 'Ramen Tonkotsu', description: 'ราเมนน้ำซุปกระดูกหมู', price: 350 },
            { name: 'Chirashi Don', description: 'ข้าวหน้าปลาดิบรวม', price: 450 },
          ]
        }
      ]
    },
    // Thai Heritage
    {
      restaurantIndex: 3,
      categories: [
        {
          name: 'Thai Food',
          description: 'อาหารไทยต้นตำรับ',
          items: [
            { name: 'Pad Thai', description: 'ผัดไทยกุ้งสดรสชาติต้นตำรับ', price: 120 },
            { name: 'Green Curry', description: 'แกงเขียวหวานไก่', price: 150 },
            { name: 'Tom Yum Goong', description: 'ต้มยำกุ้งน้ำข้น', price: 180 },
            { name: 'Massaman Curry', description: 'แกงมัสมั่นเนื้อ', price: 200 },
          ]
        }
      ]
    },
    // Mario's Pizzeria
    {
      restaurantIndex: 4,
      categories: [
        {
          name: 'Italian',
          description: 'อาหารอิตาเลียนแท้',
          items: [
            { name: 'Margherita Pizza', description: 'พิซซ่ามาร์เกอริต้าคลาสสิค', price: 320 },
            { name: 'Carbonara Pasta', description: 'พาสต้าคาร์โบนาร่าครีมเข้มข้น', price: 280 },
            { name: 'Pepperoni Pizza', description: 'พิซซ่าเปปเปอโรนี่', price: 380 },
            { name: 'Bolognese Pasta', description: 'พาสต้าโบโลเนส', price: 300 },
          ]
        }
      ]
    },
    // Sweet Dreams Bakery
    {
      restaurantIndex: 5,
      categories: [
        {
          name: 'Dessert',
          description: 'ของหวานและเบเกอรี่',
          items: [
            { name: 'Croissant', description: 'ครัวซองต์เนยสดฝรั่งเศส', price: 60 },
            { name: 'Cheesecake', description: 'ชีสเค้กนิวยอร์ก', price: 180 },
            { name: 'Macarons', description: 'มาการองหลากสี 6 ชิ้น', price: 240 },
            { name: 'Red Velvet Cake', description: 'เค้กเรดเวลเวท', price: 200 },
          ]
        }
      ]
    }
  ]

  for (const restaurantMenu of menuData) {
    const restaurant = restaurants[restaurantMenu.restaurantIndex]
    
    for (const categoryData of restaurantMenu.categories) {
      const category = await prisma.category.create({
        data: {
          restaurantId: restaurant.id,
          name: categoryData.name,
          description: categoryData.description,
        }
      })

      for (const item of categoryData.items) {
        await prisma.menuItem.create({
          data: {
            name: item.name,
            description: item.description,
            price: item.price,
            isAvailable: true,
            restaurantId: restaurant.id,
            categoryId: category.id,
          }
        })
      }

      console.log(`✅ Created category "${categoryData.name}" with ${categoryData.items.length} items for ${restaurant.name}`)
    }
  }

  // Create Customer Users
  console.log('👥 Creating customer users...')
  const customerData = [
    {
      email: 'john@customer.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '0812345678'
    },
    {
      email: 'jane@customer.com',
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '0823456789'
    },
    {
      email: 'david@customer.com',
      firstName: 'David',
      lastName: 'Wilson',
      phone: '0834567890'
    }
  ]

  for (const customerInfo of customerData) {
    const password = await bcrypt.hash('customer123', 12)
    
    const user = await prisma.user.create({
      data: {
        email: customerInfo.email,
        password: password,
        firstName: customerInfo.firstName,
        lastName: customerInfo.lastName,
        phone: customerInfo.phone,
        primaryRole: 'CUSTOMER',
        status: 'ACTIVE',
      }
    })

    await prisma.userRoles.create({
      data: {
        userId: user.id,
        role: 'CUSTOMER'
      }
    })

    await prisma.customer.create({
      data: {
        userId: user.id,
      }
    })

    console.log(`✅ Created customer: ${customerInfo.firstName} ${customerInfo.lastName}`)
  }

  // Create Rider Users
  console.log('🛵 Creating riders...')
  const riderData = [
    {
      email: 'rider1@corgigo.com',
      firstName: 'สมชาย',
      lastName: 'ใจดี',
      phone: '0845678901',
      licenseNumber: 'ABC123456',
      vehicleType: 'รถจักรยานยนต์',
      vehicleNumber: '1กท-1234'
    },
    {
      email: 'rider2@corgigo.com',
      firstName: 'สมหญิง',
      lastName: 'เร็วไว',
      phone: '0856789012',
      licenseNumber: 'DEF789012',
      vehicleType: 'รถจักรยานยนต์',
      vehicleNumber: '2กท-5678'
    }
  ]

  for (const riderInfo of riderData) {
    const password = await bcrypt.hash('rider123', 12)
    
    const user = await prisma.user.create({
      data: {
        email: riderInfo.email,
        password: password,
        firstName: riderInfo.firstName,
        lastName: riderInfo.lastName,
        phone: riderInfo.phone,
        primaryRole: 'RIDER',
        status: 'ACTIVE',
      }
    })

    await prisma.userRoles.create({
      data: {
        userId: user.id,
        role: 'RIDER'
      }
    })

    await prisma.rider.create({
      data: {
        userId: user.id,
        licenseNumber: riderInfo.licenseNumber,
        vehicleType: riderInfo.vehicleType,
        vehicleNumber: riderInfo.vehicleNumber,
        status: 'ONLINE',
        rating: 4.8,
        totalRides: Math.floor(Math.random() * 100) + 50,
      }
    })

    console.log(`✅ Created rider: ${riderInfo.firstName} ${riderInfo.lastName}`)
  }

  console.log('🎉 Database seeding completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`- Restaurants: ${restaurants.length}`)
  console.log(`- Categories: ${menuData.reduce((total, restaurant) => total + restaurant.categories.length, 0)}`)
  console.log(`- Menu Items: ${menuData.reduce((total, restaurant) => total + restaurant.categories.reduce((catTotal, cat) => catTotal + cat.items.length, 0), 0)}`)
  console.log(`- Customers: ${customerData.length}`)
  console.log(`- Riders: ${riderData.length}`)
  console.log('\n🔑 Login Credentials:')
  console.log('Admin: admin@corgigo.com / admin123')
  console.log('Restaurant: lacasa@restaurant.com / restaurant123')
  console.log('Customer: john@customer.com / customer123')
  console.log('Rider: rider1@corgigo.com / rider123')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 