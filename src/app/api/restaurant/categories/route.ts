import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/restaurant/categories - ดึงรายการหมวดหมู่ของร้าน
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'กรุณาเข้าสู่ระบบ' },
        { status: 401 }
      );
    }

    // ตรวจสอบว่าเป็น restaurant หรือไม่
    const restaurant = await prisma.restaurant.findUnique({
      where: { userId: session.user.id },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลร้านอาหาร' },
        { status: 404 }
      );
    }

    // ดึงข้อมูล categories พร้อมนับจำนวนเมนูในแต่ละหมวดหมู่
    const categories = await prisma.category.findMany({
      where: {
        restaurantId: restaurant.id,
      },
      include: {
        _count: {
          select: {
            menuItems: true,
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      data: categories,
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่' },
      { status: 500 }
    );
  }
}

// POST /api/restaurant/categories - สร้างหมวดหมู่ใหม่
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'กรุณาเข้าสู่ระบบ' },
        { status: 401 }
      );
    }

    // ตรวจสอบว่าเป็น restaurant หรือไม่
    const restaurant = await prisma.restaurant.findUnique({
      where: { userId: session.user.id },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลร้านอาหาร' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, description, image, order } = body;

    // Validation
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'กรุณากรอกชื่อหมวดหมู่' },
        { status: 400 }
      );
    }

    // ตรวจสอบว่าชื่อหมวดหมู่ซ้ำหรือไม่
    const existingCategory = await prisma.category.findFirst({
      where: {
        restaurantId: restaurant.id,
        name: name.trim(),
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'มีหมวดหมู่นี้อยู่แล้ว' },
        { status: 400 }
      );
    }

    // หาลำดับถัดไป ถ้าไม่ได้ระบุ
    let nextOrder = order;
    if (nextOrder === undefined || nextOrder === null) {
      const lastCategory = await prisma.category.findFirst({
        where: {
          restaurantId: restaurant.id,
        },
        orderBy: {
          order: 'desc',
        },
      });
      nextOrder = (lastCategory?.order || 0) + 1;
    }

    // สร้างหมวดหมู่ใหม่
    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        image: image || null,
        order: nextOrder,
        restaurantId: restaurant.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        _count: {
          select: {
            menuItems: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: category,
      message: 'สร้างหมวดหมู่สำเร็จ',
    });

  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการสร้างหมวดหมู่' },
      { status: 500 }
    );
  }
} 