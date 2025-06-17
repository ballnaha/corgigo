const { PrismaClient } = require('@prisma/client');

async function testProfileAPI() {
  try {
    console.log('🧪 ทดสอบ Profile API...\n');

    // สำหรับการทดสอบ เราจะใช้ mock session หรือ test user
    const testUserId = 'cmc09xx2k000h9hx8wj0aw3uh'; // User ที่มีเบอร์โทร

    console.log(`🎯 ทดสอบกับ User ID: ${testUserId}`);
    console.log('📱 Expected Phone: 0862061354\n');

    // ในสถานการณ์จริงจะต้องมี session token
    // แต่สำหรับการ debug ให้เราดูข้อมูลจาก database โดยตรง
    const prisma = new PrismaClient();

    const user = await prisma.user.findUnique({
      where: { id: testUserId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        primaryRole: true,
        status: true,
        latitude: true,
        longitude: true,
        customer: {
          select: {
            addresses: {
              where: { isDefault: true },
              select: {
                address: true,
              },
              take: 1,
            }
          }
        }
      }
    });

    if (!user) {
      console.log('❌ ไม่พบ User');
      return;
    }

    const defaultAddress = user.customer?.addresses?.[0]?.address || '';

    const apiResponse = {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone || '',
        avatar: user.avatar,
        primaryRole: user.primaryRole,
        status: user.status,
        latitude: user.latitude,
        longitude: user.longitude,
        address: defaultAddress,
      }
    };

    console.log('📊 ข้อมูลจาก Database:');
    console.log(`   📧 Email: ${user.email}`);
    console.log(`   🏷️  Name: ${user.firstName} ${user.lastName}`);
    console.log(`   📱 Raw Phone: ${JSON.stringify(user.phone)}`);
    console.log(`   📱 Phone Type: ${typeof user.phone}`);
    console.log(`   📱 Phone Length: ${user.phone ? user.phone.length : 'null'}`);
    console.log(`   📱 Phone || '': ${user.phone || ''}`);
    console.log('\n🔄 ข้อมูลที่ API จะส่งกลับ:');
    console.log(JSON.stringify(apiResponse, null, 2));

    await prisma.$disconnect();

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error);
  }
}

// เรียกใช้ function
testProfileAPI(); 