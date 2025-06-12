import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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
        status: true,
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
        status: restaurant.status,
        submittedAt: restaurant.createdAt.toISOString(),
        approvedAt: restaurant.approvedAt?.toISOString(),
        rejectedAt: restaurant.rejectedAt?.toISOString(),
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