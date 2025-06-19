import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - ดึงคำสั่งซื้อของร้าน
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

    // ตรวจสอบว่าร้านอาหารมีอยู่
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลร้านอาหาร' },
        { status: 404 }
      );
    }

    // Mock orders data (เนื่องจากยังไม่มี order system)
    const orders = [
      {
        id: 'order_001',
        user: {
          firstName: 'สมชาย',
          lastName: 'ใจดี',
        },
        items: [
          { name: 'ข้าวผัดกุ้ง', quantity: 2, price: 300 },
          { name: 'ต้มยำกุ้ง', quantity: 1, price: 400 },
        ],
        total: 700,
        status: 'COMPLETED',
        createdAt: new Date('2024-06-15T10:30:00Z'),
      },
      {
        id: 'order_002',
        user: {
          firstName: 'สมศรี',
          lastName: 'รักษ์ดี',
        },
        items: [
          { name: 'ผัดไทย', quantity: 1, price: 200 },
          { name: 'ส้มตำ', quantity: 1, price: 150 },
        ],
        total: 350,
        status: 'PREPARING',
        createdAt: new Date('2024-06-15T11:15:00Z'),
      },
      {
        id: 'order_003',
        user: {
          firstName: 'สมหมาย',
          lastName: 'จริงใจ',
        },
        items: [
          { name: 'ข้าวผัดหมู', quantity: 3, price: 900 },
        ],
        total: 900,
        status: 'COMPLETED',
        createdAt: new Date('2024-06-15T12:00:00Z'),
      },
    ];

    return NextResponse.json({
      success: true,
      orders,
    });

  } catch (error: any) {
    console.error('Get restaurant orders error:', error);
    return NextResponse.json(
      { error: error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ' },
      { status: 500 }
    );
  }
} 