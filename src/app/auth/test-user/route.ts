import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    // สร้างผู้ใช้ทดสอบ
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const user = await prisma.user.create({
      data: {
        email: 'test@test.com',
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
        primaryRole: 'CUSTOMER',
        status: 'ACTIVE',
        customer: {
          create: {}
        },
        userRoles: {
          create: {
            role: 'CUSTOMER'
          }
        }
      },
      include: {
        customer: true,
        userRoles: true,
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'ผู้ใช้ทดสอบถูกสร้างแล้ว',
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        primaryRole: user.primaryRole,
        roles: user.userRoles.map(ur => ur.role)
      }
    });

  } catch (error: any) {
    console.error('Error creating test user:', error);
    
    // ถ้าผู้ใช้มีอยู่แล้ว
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        success: false, 
        message: 'ผู้ใช้ทดสอบมีอยู่แล้ว',
        error: 'User already exists'
      }, { status: 409 });
    }

    return NextResponse.json({ 
      success: false, 
      message: 'เกิดข้อผิดพลาดในการสร้างผู้ใช้',
      error: error.message 
    }, { status: 500 });
  }
} 