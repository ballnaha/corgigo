const { PrismaClient } = require('@prisma/client');
const { formatInTimeZone } = require('date-fns-tz');

const THAILAND_TIMEZONE = 'Asia/Bangkok';

async function checkDatabaseTimestamps() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Checking database timestamps...');
    
    // ดึงข้อมูลผู้ใช้ที่อัปเดตล่าสุด
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 3
    });
    
    console.log('\n📊 Latest 3 users (by updatedAt):');
    console.log('='.repeat(80));
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.firstName} ${user.lastName})`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Created: ${user.createdAt.toISOString()}`);
      console.log(`   Updated: ${user.updatedAt.toISOString()}`);
      
      // แสดงเวลาในรูปแบบไทย
      const thaiCreated = formatInTimeZone(user.createdAt, THAILAND_TIMEZONE, 'yyyy-MM-dd HH:mm:ss zzz');
      const thaiUpdated = formatInTimeZone(user.updatedAt, THAILAND_TIMEZONE, 'yyyy-MM-dd HH:mm:ss zzz');
      
      console.log(`   🇹🇭 Created (Thai): ${thaiCreated}`);
      console.log(`   🇹🇭 Updated (Thai): ${thaiUpdated}`);
      
      // คำนวณความแตกต่างเวลา
      const now = new Date();
      const diffMinutes = Math.floor((now.getTime() - user.updatedAt.getTime()) / (1000 * 60));
      console.log(`   ⏰ Updated ${diffMinutes} minutes ago`);
      console.log('');
    });
    
    // ตรวจสอบ customer addresses ที่อัปเดตล่าสุด
    console.log('📍 Latest customer addresses:');
    console.log('='.repeat(80));
    
    const addresses = await prisma.customerAddress.findMany({
      select: {
        id: true,
        address: true,
        createdAt: true,
        updatedAt: true,
        customer: {
          select: {
            user: {
              select: {
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 3
    });
    
    addresses.forEach((addr, index) => {
      console.log(`${index + 1}. ${addr.customer.user.email}`);
      console.log(`   Address: ${addr.address}`);
      console.log(`   Created: ${addr.createdAt.toISOString()}`);
      console.log(`   Updated: ${addr.updatedAt.toISOString()}`);
      
      // แสดงเวลาในรูปแบบไทย
      const thaiCreated = formatInTimeZone(addr.createdAt, THAILAND_TIMEZONE, 'yyyy-MM-dd HH:mm:ss zzz');
      const thaiUpdated = formatInTimeZone(addr.updatedAt, THAILAND_TIMEZONE, 'yyyy-MM-dd HH:mm:ss zzz');
      
      console.log(`   🇹🇭 Created (Thai): ${thaiCreated}`);
      console.log(`   🇹🇭 Updated (Thai): ${thaiUpdated}`);
      
      // คำนวณความแตกต่างเวลา
      const now = new Date();
      const diffMinutes = Math.floor((now.getTime() - addr.updatedAt.getTime()) / (1000 * 60));
      console.log(`   ⏰ Updated ${diffMinutes} minutes ago`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseTimestamps(); 