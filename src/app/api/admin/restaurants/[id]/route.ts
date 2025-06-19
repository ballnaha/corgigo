import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - ดึงข้อมูลร้านอาหารแต่ละร้าน
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'กรุณาเข้าสู่ระบบ' },
        { status: 401 }
      );
    }

    // ตรวจสอบสิทธิ์ admin
    const adminRole = await prisma.userRoles.findFirst({
      where: {
        userId: session.user.id,
        role: 'ADMIN',
      },
    });

    if (!adminRole) {
      return NextResponse.json(
        { error: 'ไม่มีสิทธิ์เข้าถึง' },
        { status: 403 }
      );
    }

    const { id: restaurantId } = await params;

    // ดึงข้อมูลร้านอาหาร
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
            createdAt: true,
          },
        },
      },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลร้านอาหาร' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      restaurant,
    });

  } catch (error: any) {
    console.error('Get restaurant details error:', error);
    return NextResponse.json(
      { error: error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลร้านอาหาร' },
      { status: 500 }
    );
  }
} 