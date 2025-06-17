import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/restaurant/menus - ดึงรายการเมนูของร้าน
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

    // ดึง URL parameters สำหรับ pagination และ filtering
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId') || '';
    const isAvailable = searchParams.get('isAvailable');

    const skip = (page - 1) * limit;

    // สร้าง where condition
    const where: any = {
      restaurantId: restaurant.id,
    };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (isAvailable !== null && isAvailable !== '') {
      where.isAvailable = isAvailable === 'true';
    }

    // ดึงข้อมูล menu items
    const [menuItems, totalCount] = await Promise.all([
      prisma.menuItem.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.menuItem.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items: menuItems,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      },
    });

  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลเมนู' },
      { status: 500 }
    );
  }
}

// POST /api/restaurant/menus - สร้างเมนูใหม่
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
    const { name, description, price, categoryId, image, isAvailable = true } = body;

    // Validation
    if (!name || !description || !price) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    if (price <= 0) {
      return NextResponse.json(
        { error: 'ราคาต้องมากกว่า 0' },
        { status: 400 }
      );
    }

    // ตรวจสอบว่า category มีอยู่จริงหรือไม่ (ถ้ามี categoryId)
    if (categoryId) {
      const category = await prisma.category.findFirst({
        where: {
          id: categoryId,
          restaurantId: restaurant.id,
        },
      });

      if (!category) {
        return NextResponse.json(
          { error: 'ไม่พบหมวดหมู่ที่เลือก' },
          { status: 400 }
        );
      }
    }

    // สร้างเมนูใหม่
    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        categoryId: categoryId || null,
        image: image || null,
        isAvailable,
        restaurantId: restaurant.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: menuItem,
      message: 'สร้างเมนูสำเร็จ',
    });

  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการสร้างเมนู' },
      { status: 500 }
    );
  }
} 