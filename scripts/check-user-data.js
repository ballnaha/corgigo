const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUserData() {
  try {
    console.log('🔍 ตรวจสอบข้อมูล User ใน Database...\n');

    // ดึงข้อมูล users ทั้งหมด
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        primaryRole: true,
        status: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (users.length === 0) {
      console.log('❌ ไม่พบข้อมูล User ใน Database');
      return;
    }

    console.log(`📊 พบ User ทั้งหมด: ${users.length} คน\n`);

    users.forEach((user, index) => {
      console.log(`👤 User ${index + 1}:`);
      console.log(`   🆔 ID: ${user.id}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🏷️  Name: ${user.firstName} ${user.lastName}`);
      console.log(`   📱 Phone: ${user.phone || 'ไม่มีข้อมูล'}`);
      console.log(`   🎭 Role: ${user.primaryRole}`);
      console.log(`   🔘 Status: ${user.status}`);
      console.log(`   📅 Created: ${user.createdAt.toLocaleString('th-TH')}`);
      console.log('');
    });

    // เช็คข้อมูล admin user ที่เพิ่งสร้าง
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@corgigo.com' },
      include: {
        userRoles: true
      }
    });

    if (adminUser) {
      console.log('🛡️  Admin User Details:');
      console.log(`   🆔 ID: ${adminUser.id}`);
      console.log(`   📧 Email: ${adminUser.email}`);
      console.log(`   🏷️  Name: ${adminUser.firstName} ${adminUser.lastName}`);
      console.log(`   📱 Phone: ${adminUser.phone || 'ไม่มีข้อมูล'}`);
      console.log(`   🎭 Primary Role: ${adminUser.primaryRole}`);
      console.log(`   📜 Roles: ${adminUser.userRoles.map(r => r.role).join(', ')}`);
      console.log(`   📅 Created: ${adminUser.createdAt.toLocaleString('th-TH')}`);
    }

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// เรียกใช้ function
checkUserData(); 