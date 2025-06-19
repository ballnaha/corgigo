import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - ดึงเมนูอาหารของร้าน
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

    // ดึงเมนูอาหาร
    const menus = await prisma.menuItem.findMany({
      where: { restaurantId },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [
        { isAvailable: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({
      success: true,
      menus,
    });

  } catch (error: any) {
    console.error('Get restaurant menus error:', error);
    return NextResponse.json(
      { error: error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลเมนู' },
      { status: 500 }
    );
  }
} 