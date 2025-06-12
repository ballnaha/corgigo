import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'กรุณาเข้าสู่ระบบ' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      name,
      description,
      address,
      phone,
      openTime,
      closeTime,
      latitude,
      longitude,
    } = body;

    // Validation
    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'กรุณากรอกชื่อร้าน' },
        { status: 400 }
      );
    }

    if (!address?.trim()) {
      return NextResponse.json(
        { error: 'กรุณากรอกที่อยู่ร้าน' },
        { status: 400 }
      );
    }

    if (!phone?.trim()) {
      return NextResponse.json(
        { error: 'กรุณากรอกเบอร์โทรศัพท์' },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // ตรวจสอบว่าผู้ใช้มี restaurant role อยู่แล้วหรือไม่
    const existingRestaurantRole = await prisma.userRoles.findFirst({
      where: {
        userId,
        role: 'RESTAURANT',
      },
    });

    if (existingRestaurantRole) {
      return NextResponse.json(
        { error: 'คุณมีร้านอาหารอยู่แล้ว' },
        { status: 400 }
      );
    }

    // สร้าง restaurant role และ restaurant profile
    const result = await prisma.$transaction(async (tx) => {
      // เพิ่ม restaurant role
      await tx.userRoles.create({
        data: {
          userId,
          role: 'RESTAURANT',
        },
      });

      // สร้าง restaurant profile
      const restaurant = await tx.restaurant.create({
        data: {
          userId,
          name: name.trim(),
          description: description?.trim() || null,
          address: address.trim(),
          phone: phone.trim(),
          openTime: openTime || '09:00',
          closeTime: closeTime || '21:00',
          latitude: latitude || null,
          longitude: longitude || null,
          isOpen: true,
          rating: 5.0,
        },
      });

      // อัพเดท primaryRole เป็น RESTAURANT
      await tx.user.update({
        where: { id: userId },
        data: { primaryRole: 'RESTAURANT' },
      });

      return restaurant;
    });

    return NextResponse.json({
      success: true,
      message: 'สมัครเปิดร้านอาหารสำเร็จ! เรากำลังตรวจสอบข้อมูลร้านของคุณ จะแจ้งผลภายใน 2-3 วันทำการ',
      restaurant: {
        id: result.id,
        name: result.name,
        address: result.address,
        phone: result.phone,
      },
    });

  } catch (error: any) {
    console.error('Restaurant registration error:', error);
    
    return NextResponse.json(
      { error: error.message || 'เกิดข้อผิดพลาดในการสมัครเปิดร้านอาหาร' },
      { status: 500 }
    );
  }
} 