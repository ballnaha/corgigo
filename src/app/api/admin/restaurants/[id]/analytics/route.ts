import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - ดึงข้อมูลวิเคราะห์ยอดขายร้านอาหาร
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

    // ตรวจสอบว่าร้านอาหารมีอยู่และดึงจำนวนเมนู
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      include: {
        _count: {
          select: {
            menuItems: true,
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

    // ดึงข้อมูลสถิติ (Mock data สำหรับตอนนี้ เนื่องจากยังไม่มี order system)
    const analytics = {
      totalRevenue: 125000,
      totalOrders: 89,
      totalMenus: restaurant._count?.menuItems || 0,
      commission: 3750, // 3% ของ totalRevenue
      averageOrderValue: 1404, // totalRevenue / totalOrders
      bestSellingItem: 'ข้าวผัดกุ้ง',
      monthlyRevenue: [
        { month: 'ม.ค.', revenue: 15000 },
        { month: 'ก.พ.', revenue: 18000 },
        { month: 'มี.ค.', revenue: 22000 },
        { month: 'เม.ย.', revenue: 25000 },
        { month: 'พ.ค.', revenue: 28000 },
        { month: 'มิ.ย.', revenue: 17000 },
      ],
      topSellingItems: [
        { name: 'ข้าวผัดกุ้ง', quantity: 45, revenue: 13500 },
        { name: 'ผัดไทย', quantity: 38, revenue: 11400 },
        { name: 'ต้มยำกุ้ง', quantity: 32, revenue: 12800 },
        { name: 'ส้มตำ', quantity: 28, revenue: 8400 },
        { name: 'ข้าวผัดหมู', quantity: 25, revenue: 7500 },
      ],
    };

    return NextResponse.json({
      success: true,
      analytics,
    });

  } catch (error: any) {
    console.error('Get restaurant analytics error:', error);
    return NextResponse.json(
      { error: error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลวิเคราะห์' },
      { status: 500 }
    );
  }
} 