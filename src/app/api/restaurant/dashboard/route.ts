import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'กรุณาเข้าสู่ระบบ' },
        { status: 401 }
      );
    }

    // ตรวจสอบว่าผู้ใช้มี restaurant หรือไม่
    if (!session.user.restaurant) {
      return NextResponse.json(
        { error: 'ไม่พบร้านอาหาร' },
        { status: 404 }
      );
    }

    const restaurantId = session.user.restaurant.id;

    // ดึงข้อมูลร้านอาหาร
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      include: {
        menuItems: {
          include: {
            category: true,
          },
        },
        orders: {
          include: {
            customer: {
              include: {
                user: true,
              },
            },
            orderItems: {
              include: {
                menuItem: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: 'ไม่พบร้านอาหาร' },
        { status: 404 }
      );
    }

    // คำนวณสถิติ
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // ออเดอร์วันนี้
    const todayOrders = restaurant.orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= today && orderDate < tomorrow;
    });

    // ออเดอร์ที่รอดำเนินการ
    const pendingOrders = restaurant.orders.filter(order => 
      ['PENDING', 'CONFIRMED'].includes(order.status)
    );

    // รายได้วันนี้
    const todayRevenue = todayOrders
      .filter(order => !['CANCELLED'].includes(order.status))
      .reduce((sum, order) => sum + order.total, 0);

    // รายได้เดือนนี้
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    const monthlyRevenue = restaurant.orders
      .filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= thisMonth && !['CANCELLED'].includes(order.status);
      })
      .reduce((sum, order) => sum + order.total, 0);

    // จัดกลุ่มเมนูตาม category
    const menuByCategory = restaurant.menuItems.reduce((acc, item) => {
      const categoryName = item.category?.name || 'ไม่ระบุหมวดหมู่';
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(item);
      return acc;
    }, {} as Record<string, any[]>);

    // สถิติ
    const stats = {
      rating: restaurant.rating,
      totalOrders: restaurant.orders.length,
      todayOrders: todayOrders.length,
      todayRevenue,
      monthlyRevenue,
      pendingOrders: pendingOrders.length,
    };

    return NextResponse.json({
      success: true,
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        description: restaurant.description,
        address: restaurant.address,
        phone: restaurant.phone,
        isOpen: restaurant.isOpen,
        openTime: restaurant.openTime,
        closeTime: restaurant.closeTime,
        rating: restaurant.rating,
      },
      stats,
      pendingOrders: pendingOrders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: `${order.customer.user.firstName} ${order.customer.user.lastName}`,
        items: order.orderItems.map(item => `${item.menuItem.name} (${item.quantity})`),
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
        estimatedDelivery: order.estimatedDelivery,
      })),
      menuItems: restaurant.menuItems.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        isAvailable: item.isAvailable,
        category: item.category?.name || 'ไม่ระบุหมวดหมู่',
        image: item.image,
      })),
      menuByCategory,
    });

  } catch (error: any) {
    console.error('Restaurant dashboard error:', error);
    
    return NextResponse.json(
      { error: error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    );
  }
} 