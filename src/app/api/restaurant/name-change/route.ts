import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getThailandNow } from '@/lib/timezone';

// POST - ขอเปลี่ยนชื่อร้านอาหาร
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'กรุณาเข้าสู่ระบบ' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { newName } = await request.json();

    // Validation
    if (!newName?.trim()) {
      return NextResponse.json(
        { error: 'กรุณากรอกชื่อร้านอาหารใหม่' },
        { status: 400 }
      );
    }

    // ตรวจสอบว่ามีร้านอาหารหรือไม่
    const restaurant = await prisma.restaurant.findUnique({
      where: { userId },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลร้านอาหาร' },
        { status: 404 }
      );
    }

    // ตรวจสอบว่าชื่อใหม่ต่างจากชื่อเดิมหรือไม่
    if (newName.trim() === restaurant.name) {
      return NextResponse.json(
        { error: 'ชื่อใหม่ต้องแตกต่างจากชื่อเดิม' },
        { status: 400 }
      );
    }

    // อัพเดทข้อมูลการขอเปลี่ยนชื่อ
    const updatedRestaurant = await prisma.restaurant.update({
      where: { userId },
      data: {
        pendingName: newName.trim(),
        nameChangeRequestedAt: getThailandNow(), // ใช้เวลาไทย
        // รีเซ็ตสถานะการอนุมัติ/ปฏิเสธก่อนหน้า
        nameApprovedAt: null,
        nameRejectedAt: null,
        nameRejectReason: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'ส่งคำขอเปลี่ยนชื่อร้านอาหารสำเร็จ กรุณารอการอนุมัติจากผู้ดูแลระบบ',
      pendingName: updatedRestaurant.pendingName,
    });

  } catch (error: any) {
    console.error('Name change request error:', error);
    return NextResponse.json(
      { error: error.message || 'เกิดข้อผิดพลาดในการขอเปลี่ยนชื่อร้านอาหาร' },
      { status: 500 }
    );
  }
}

// DELETE - ยกเลิกการขอเปลี่ยนชื่อ
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'กรุณาเข้าสู่ระบบ' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // ตรวจสอบว่ามีร้านอาหารหรือไม่
    const restaurant = await prisma.restaurant.findUnique({
      where: { userId },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลร้านอาหาร' },
        { status: 404 }
      );
    }

    // ยกเลิกการขอเปลี่ยนชื่อ
    await prisma.restaurant.update({
      where: { userId },
      data: {
        pendingName: null,
        nameChangeRequestedAt: null,
        nameApprovedAt: null,
        nameRejectedAt: null,
        nameRejectReason: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'ยกเลิกการขอเปลี่ยนชื่อร้านอาหารสำเร็จ',
    });

  } catch (error: any) {
    console.error('Cancel name change error:', error);
    return NextResponse.json(
      { error: error.message || 'เกิดข้อผิดพลาดในการยกเลิกการขอเปลี่ยนชื่อ' },
      { status: 500 }
    );
  }
} 