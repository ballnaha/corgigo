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
      role,
      // Restaurant specific fields
      restaurantName,
      restaurantDescription,
      restaurantAddress,
      restaurantPhone,
      openTime,
      closeTime,
      // Rider specific fields
      licenseNumber,
      vehicleType,
      vehicleNumber,
      bankAccount,
      bankName,
    } = body;

    // Validation
    if (!email || !password || !firstName || !lastName || !role) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    if (!['CUSTOMER', 'RIDER', 'RESTAURANT', 'ADMIN'].includes(role)) {
      return NextResponse.json(
        { error: 'ประเภทผู้ใช้ไม่ถูกต้อง' },
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
    const result = await prisma.$transaction(async (tx: any) => {
      // Create base user
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          phone,
          role,
          status: 'ACTIVE',
        },
      });

      // Create role-specific records
      switch (role) {
        case 'CUSTOMER':
          await tx.customer.create({
            data: {
              userId: user.id,
            },
          });
          break;

        case 'RIDER':
          await tx.rider.create({
            data: {
              userId: user.id,
              licenseNumber,
              vehicleType,
              vehicleNumber,
              bankAccount,
              bankName,
              status: 'OFFLINE',
            },
          });
          break;

        case 'RESTAURANT':
          if (!restaurantName || !restaurantAddress) {
            throw new Error('กรุณากรอกชื่อร้านและที่อยู่ร้าน');
          }
          
          await tx.restaurant.create({
            data: {
              userId: user.id,
              name: restaurantName,
              description: restaurantDescription,
              address: restaurantAddress,
              phone: restaurantPhone || phone,
              openTime,
              closeTime,
              isOpen: false, // ต้องรออนุมัติก่อน
            },
          });
          break;

        case 'ADMIN':
          // Admin ไม่ต้องสร้าง record เพิ่มเติม
          break;
      }

      return user;
    });

    return NextResponse.json(
      { 
        message: 'สมัครสมาชิกสำเร็จ',
        user: {
          id: result.id,
          email: result.email,
          firstName: result.firstName,
          lastName: result.lastName,
          role: result.role,
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