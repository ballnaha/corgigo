import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      phone,
      role = 'CUSTOMER',
    } = body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'อีเมลนี้ถูกใช้งานแล้ว' },
        { status: 400 }
      );
    }

    // Check phone if provided
    if (phone) {
      const existingPhone = await prisma.user.findUnique({
        where: { phone },
      });

      if (existingPhone) {
        return NextResponse.json(
          { error: 'เบอร์โทรศัพท์นี้ถูกใช้งานแล้ว' },
          { status: 400 }
        );
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create base user with requested role as primary role
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          phone,
          primaryRole: role as any,
          status: 'ACTIVE',
        },
      });

      // สร้าง customer role เสมอ (ทุกคนเป็น customer ได้)
      await tx.userRoles.create({
        data: {
          userId: user.id,
          role: 'CUSTOMER',
        },
      });

      // สร้าง customer profile เสมอ
      await tx.customer.create({
        data: {
          userId: user.id,
        },
      });

      // ถ้า role เป็น RESTAURANT ให้สร้าง restaurant role และ profile ด้วย
      if (role === 'RESTAURANT') {
        await tx.userRoles.create({
          data: {
            userId: user.id,
            role: 'RESTAURANT',
          },
        });

        await tx.restaurant.create({
          data: {
            userId: user.id,
            name: `ร้าน${firstName} ${lastName}`, // ชื่อร้านเริ่มต้น
            description: 'ร้านอาหารใหม่',
            address: 'กรุณาอัพเดทที่อยู่ร้าน',
            phone: phone || '',
          },
        });
      }

      return user;
    });

    return NextResponse.json(
      { 
        message: role === 'RESTAURANT' ? 'สมัครเปิดร้านอาหารสำเร็จ! เรากำลังตรวจสอบข้อมูลร้านของคุณ' : 'สมัครสมาชิกสำเร็จ คุณสามารถเพิ่ม role อื่นๆ ได้ในภายหลัง',
        user: {
          id: result.id,
          email: result.email,
          firstName: result.firstName,
          lastName: result.lastName,
          primaryRole: result.primaryRole,
          roles: role === 'RESTAURANT' ? ['CUSTOMER', 'RESTAURANT'] : ['CUSTOMER'],
        }
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Register error:', error);
    
    return NextResponse.json(
      { error: error.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก' },
      { status: 500 }
    );
  }
} 