const { PrismaClient } = require('@prisma/client');
const { toZonedTime, formatInTimeZone } = require('date-fns-tz');

const THAILAND_TIMEZONE = 'Asia/Bangkok';

async function testLiveProfileUpdate() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🧪 Testing live profile update...');
    
    // หาผู้ใช้ที่จะทดสอบ
    const user = await prisma.user.findFirst({
      where: { email: 'admin@corgigo.com' }
    });
    
    if (!user) {
      console.log('❌ Admin user not found');
      return;
    }
    
    console.log(`👤 Testing with user: ${user.email}`);
    console.log(`📅 Current updatedAt: ${user.updatedAt.toISOString()}`);
    
    const currentThaiTime = formatInTimeZone(user.updatedAt, THAILAND_TIMEZONE, 'yyyy-MM-dd HH:mm:ss zzz');
    console.log(`🇹🇭 Current Thai time: ${currentThaiTime}`);
    
    console.log('\n⏰ Waiting for profile update...');
    console.log('👉 Please update profile in the web app now!');
    console.log('   1. Go to http://localhost:3000/profile');
    console.log('   2. Click "แก้ไขข้อมูล"');
    console.log('   3. Change name or other data');
    console.log('   4. Click "บันทึก"');
    console.log('   5. Come back here and press Enter');
    
    // รอให้ผู้ใช้กด Enter
    await new Promise(resolve => {
      process.stdin.once('data', () => resolve());
    });
    
    // ตรวจสอบข้อมูลใหม่
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id }
    });
    
    if (!updatedUser) {
      console.log('❌ User not found after update');
      return;
    }
    
    console.log('\n📊 Results:');
    console.log('='.repeat(50));
    console.log(`📅 Old updatedAt: ${user.updatedAt.toISOString()}`);
    console.log(`📅 New updatedAt: ${updatedUser.updatedAt.toISOString()}`);
    
    const oldThaiTime = formatInTimeZone(user.updatedAt, THAILAND_TIMEZONE, 'yyyy-MM-dd HH:mm:ss zzz');
    const newThaiTime = formatInTimeZone(updatedUser.updatedAt, THAILAND_TIMEZONE, 'yyyy-MM-dd HH:mm:ss zzz');
    
    console.log(`🇹🇭 Old Thai time: ${oldThaiTime}`);
    console.log(`🇹🇭 New Thai time: ${newThaiTime}`);
    
    // ตรวจสอบว่าเวลาเปลี่ยนแปลงหรือไม่
    if (updatedUser.updatedAt.getTime() !== user.updatedAt.getTime()) {
      console.log('✅ updatedAt was changed!');
      
      // ตรวจสอบว่าเป็นเวลาไทยหรือไม่
      const now = new Date();
      const thaiNow = toZonedTime(now, THAILAND_TIMEZONE);
      const diffMinutes = Math.abs(thaiNow.getTime() - updatedUser.updatedAt.getTime()) / (1000 * 60);
      
      console.log(`⏰ Time difference from now: ${diffMinutes.toFixed(1)} minutes`);
      
      if (diffMinutes < 5) {
        console.log('✅ Timestamp appears to be in Thai timezone (UTC+7)');
      } else {
        console.log('❌ Timestamp might not be in Thai timezone');
      }
    } else {
      console.log('❌ updatedAt was NOT changed - middleware might not be working');
    }
    
    // ตรวจสอบ customer address ถ้ามี
    const customer = await prisma.customer.findFirst({
      where: { userId: user.id },
      include: { addresses: true }
    });
    
    if (customer && customer.addresses.length > 0) {
      const address = customer.addresses[0];
      console.log('\n📍 Customer Address:');
      console.log(`   Address: ${address.address}`);
      console.log(`   Updated: ${address.updatedAt.toISOString()}`);
      
      const addressThaiTime = formatInTimeZone(address.updatedAt, THAILAND_TIMEZONE, 'yyyy-MM-dd HH:mm:ss zzz');
      console.log(`   🇹🇭 Thai time: ${addressThaiTime}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

testLiveProfileUpdate(); 