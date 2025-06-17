const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('🔄 กำลังสร้าง Admin User...');

    // ข้อมูล admin
    const adminData = {
      email: 'admin@corgigo.com',
      password: 'admin123456', // จะถูก hash
      firstName: 'Admin',
      lastName: 'CorgiGo',
      primaryRole: 'ADMIN',
    };

    // ตรวจสอบว่ามี admin user อยู่แล้วหรือไม่
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminData.email }
    });

    if (existingAdmin) {
      console.log('⚠️  Admin user มีอยู่แล้ว:', adminData.email);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminData.password, 12);

    // สร้าง admin user
    const adminUser = await prisma.user.create({
      data: {
        email: adminData.email,
        password: hashedPassword,
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        primaryRole: adminData.primaryRole,
        status: 'ACTIVE',
      }
    });

    // เพิ่ม ADMIN role ใน UserRoles table
    await prisma.userRoles.create({
      data: {
        userId: adminUser.id,
        role: 'ADMIN',
      }
    });

    console.log('✅ สร้าง Admin User สำเร็จ!');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Password:', adminData.password);
    console.log('👤 Name:', `${adminData.firstName} ${adminData.lastName}`);
    console.log('🏷️  Role:', adminData.primaryRole);
    console.log('🆔 User ID:', adminUser.id);

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการสร้าง Admin User:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// เรียกใช้ function
createAdminUser(); 