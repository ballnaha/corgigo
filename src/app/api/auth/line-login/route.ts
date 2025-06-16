import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lineToken, lineUser } = body;

    console.log('🔄 LINE Login API called:', {
      hasToken: !!lineToken,
      hasUserData: !!lineUser,
      userId: lineUser?.userId,
      timestamp: new Date().toISOString()
    });

    if (!lineToken) {
      return NextResponse.json(
        { error: 'กรุณาระบุ LINE Access Token' },
        { status: 400 }
      );
    }

    let userData = lineUser;

    // ถ้าไม่มีข้อมูล user ให้ดึงจาก LINE API
    if (!userData) {
      console.log('🔄 Fetching user data from LINE API...');
      const lineUserResponse = await fetch('https://api.line.me/v2/profile', {
        headers: {
          'Authorization': `Bearer ${lineToken}`,
        },
      });

      if (!lineUserResponse.ok) {
        return NextResponse.json(
          { error: 'ไม่สามารถตรวจสอบ LINE Token ได้' },
          { status: 400 }
        );
      }

      userData = await lineUserResponse.json();
    }

    // ใช้ raw query เพื่อค้นหา user ที่มี lineId
    console.log('🔄 Checking for existing user with LINE ID:', userData.userId);
    const existingUser = await prisma.$queryRaw`
      SELECT * FROM users WHERE lineId = ${userData.userId} LIMIT 1
    ` as any[];

    let user;

    if (existingUser.length > 0) {
      // User มีอยู่แล้ว - อัปเดตข้อมูล
      console.log('✅ Existing user found, updating data...');
      user = await prisma.user.update({
        where: { id: existingUser[0].id },
        data: {
          avatar: userData.pictureUrl || existingUser[0].avatar,
        },
        include: {
          customer: true,
          rider: true,
          restaurant: true,
          userRoles: true,
        },
      });
    } else {
      // สร้าง user ใหม่
      console.log('🔄 Creating new user from LINE data...');
      const tempEmail = `line_${userData.userId}@line.temp`;
      
      user = await prisma.user.create({
        data: {
          email: tempEmail,
          password: '',
          firstName: userData.displayName.split(' ')[0] || 'ผู้ใช้',
          lastName: userData.displayName.split(' ').slice(1).join(' ') || 'LINE',
          avatar: userData.pictureUrl,
          primaryRole: 'CUSTOMER',
          status: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      console.log('✅ User created with ID:', user.id);

      // อัปเดต lineId ด้วย raw query
      await prisma.$executeRaw`
        UPDATE users SET lineId = ${userData.userId} WHERE id = ${user.id}
      `;

      // สร้าง UserRole
      await prisma.userRoles.create({
        data: {
          userId: user.id,
          role: 'CUSTOMER',
          createdAt: new Date(),
        },
      });

      // สร้าง Customer profile
      await prisma.customer.create({
        data: {
          userId: user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // ดึงข้อมูล user ใหม่พร้อม relations
      user = await prisma.user.findUnique({
        where: { id: user.id },
        include: {
          customer: true,
          rider: true,
          restaurant: true,
          userRoles: true,
        },
      });
    }

    if (!user) {
      return NextResponse.json(
        { error: 'ไม่สามารถสร้างหรือดึงข้อมูลผู้ใช้ได้' },
        { status: 500 }
      );
    }

    // ส่งข้อมูล user กลับ
    const userRoles = user.userRoles.map((ur: any) => ur.role);
    const availableRoles = userRoles.length > 0 ? userRoles : [user.primaryRole];

    const userResult = {
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      primaryRole: user.primaryRole,
      roles: availableRoles,
      currentRole: user.primaryRole,
      status: user.status,
      avatar: user.avatar,
      customer: user.customer,
      rider: user.rider,
      restaurant: user.restaurant,
      lineId: userData.userId,
    };

    console.log('✅ LINE login complete for:', userResult.email);

    return NextResponse.json({ 
      success: true, 
      user: userResult,
      message: existingUser.length > 0 ? 'เข้าสู่ระบบด้วย LINE สำเร็จ' : 'สร้างบัญชีใหม่ด้วย LINE สำเร็จ'
    });

  } catch (error) {
    console.error('LINE Login error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย LINE' },
      { status: 500 }
    );
  }
} 