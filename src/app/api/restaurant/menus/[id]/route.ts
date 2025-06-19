import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/restaurant/menus/[id] - ดึงข้อมูลเมนูรายการ
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const menuItem = await prisma.menuItem.findFirst({
      where: {
        id: id,
        restaurantId: restaurant.id,
      },
      include: {
        category: true,
      },
    });

    if (!menuItem) {
      return NextResponse.json(
        { error: 'ไม่พบเมนูที่ต้องการ' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: menuItem,
    });

  } catch (error) {
    console.error('Error fetching menu item:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลเมนู' },
      { status: 500 }
    );
  }
}

// PUT /api/restaurant/menus/[id] - แก้ไขเมนู
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // ตรวจสอบว่าเมนูมีอยู่และเป็นของร้านนี้
    const existingMenuItem = await prisma.menuItem.findFirst({
      where: {
        id: id,
        restaurantId: restaurant.id,
      },
    });

    if (!existingMenuItem) {
      return NextResponse.json(
        { error: 'ไม่พบเมนูที่ต้องการแก้ไข' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, description, price, originalPrice, categoryId, image, isAvailable } = body;

    // Validation
    if (name && name.trim() === '') {
      return NextResponse.json(
        { error: 'กรุณากรอกชื่อเมนู' },
        { status: 400 }
      );
    }

    if (description && description.trim() === '') {
      return NextResponse.json(
        { error: 'กรุณากรอกคำอธิบายเมนู' },
        { status: 400 }
      );
    }

    if (price !== undefined && price <= 0) {
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

    // สร้าง update data
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (originalPrice !== undefined) updateData.originalPrice = originalPrice ? parseFloat(originalPrice) : null;
    if (categoryId !== undefined) updateData.categoryId = categoryId || null;
    if (image !== undefined) updateData.image = image || null;
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable;

    // อัพเดทเมนู
    const updatedMenuItem = await prisma.menuItem.update({
      where: {
        id: id,
      },
      data: updateData,
      include: {
        category: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedMenuItem,
      message: 'แก้ไขเมนูสำเร็จ',
    });

  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการแก้ไขเมนู' },
      { status: 500 }
    );
  }
}

// DELETE /api/restaurant/menus/[id] - ลบเมนู
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // ตรวจสอบว่าเมนูมีอยู่และเป็นของร้านนี้
    const existingMenuItem = await prisma.menuItem.findFirst({
      where: {
        id: id,
        restaurantId: restaurant.id,
      },
    });

    if (!existingMenuItem) {
      return NextResponse.json(
        { error: 'ไม่พบเมนูที่ต้องการลบ' },
        { status: 404 }
      );
    }

    // ตรวจสอบว่ามี order items ที่อ้างอิงถึงเมนูนี้หรือไม่
    const orderItemsCount = await prisma.orderItem.count({
      where: {
        menuItemId: id,
      },
    });

    if (orderItemsCount > 0) {
      return NextResponse.json(
        { error: 'ไม่สามารถลบเมนูได้ เนื่องจากมีออเดอร์ที่สั่งเมนูนี้แล้ว' },
        { status: 400 }
      );
    }

    // ลบเมนู
    await prisma.menuItem.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'ลบเมนูสำเร็จ',
    });

  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการลบเมนู' },
      { status: 500 }
    );
  }
} 