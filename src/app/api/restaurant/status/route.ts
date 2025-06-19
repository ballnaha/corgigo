import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatThailandTime } from '@/lib/timezone';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'กรุณาเข้าสู่ระบบ' },
        { status: 401 }
      );
    }

    // ดึงข้อมูลร้านอาหารของผู้ใช้
    const restaurant = await prisma.restaurant.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        phone: true,
        status: true,
        isOpen: true,
        createdAt: true,
        approvedAt: true,
        rejectedAt: true,
        rejectReason: true,
      }
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลร้านอาหาร' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        description: restaurant.description,
        address: restaurant.address,
        phone: restaurant.phone,
        status: restaurant.status,
        isOpen: restaurant.isOpen,
        submittedAt: restaurant.createdAt.toISOString(),
        submittedAtThai: formatThailandTime(restaurant.createdAt, 'yyyy-MM-dd HH:mm:ss'),
        approvedAt: restaurant.approvedAt?.toISOString(),
        approvedAtThai: restaurant.approvedAt ? formatThailandTime(restaurant.approvedAt, 'yyyy-MM-dd HH:mm:ss') : null,
        rejectedAt: restaurant.rejectedAt?.toISOString(),
        rejectedAtThai: restaurant.rejectedAt ? formatThailandTime(restaurant.rejectedAt, 'yyyy-MM-dd HH:mm:ss') : null,
        rejectReason: restaurant.rejectReason,
      }
    });

  } catch (error: any) {
    console.error('Restaurant status error:', error);
    
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'กรุณาเข้าสู่ระบบ' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { isOpen } = body;

    if (typeof isOpen !== 'boolean') {
      return NextResponse.json(
        { error: 'ข้อมูลสถานะไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    // ตรวจสอบว่าผู้ใช้มีร้านอาหารและร้านได้รับการอนุมัติแล้ว
    const restaurant = await prisma.restaurant.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        status: true,
        isOpen: true,
      }
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลร้านอาหาร' },
        { status: 404 }
      );
    }

    if (restaurant.status !== 'APPROVED') {
      return NextResponse.json(
        { error: 'ร้านอาหารยังไม่ได้รับการอนุมัติ' },
        { status: 403 }
      );
    }

    // อัพเดตสถานะการเปิด-ปิดร้าน
    const updatedRestaurant = await prisma.restaurant.update({
      where: { userId: session.user.id },
      data: { isOpen },
      select: {
        id: true,
        name: true,
        isOpen: true,
      }
    });

    return NextResponse.json({
      success: true,
      message: `เปลี่ยนสถานะร้านเป็น${isOpen ? 'เปิด' : 'ปิด'}เรียบร้อยแล้ว`,
      restaurant: {
        id: updatedRestaurant.id,
        name: updatedRestaurant.name,
        isOpen: updatedRestaurant.isOpen,
      }
    });

  } catch (error: any) {
    console.error('Restaurant status update error:', error);
    
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอัพเดตสถานะ' },
      { status: 500 }
    );
  }
} 