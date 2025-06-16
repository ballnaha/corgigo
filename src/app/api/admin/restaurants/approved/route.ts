import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatThailandTime } from '@/lib/timezone';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // ตรวจสอบว่าเป็น admin หรือไม่
    if (!session?.user?.id || session.user.primaryRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'ไม่มีสิทธิ์เข้าถึง' },
        { status: 403 }
      );
    }

    // ดึงข้อมูลร้านอาหารที่ได้รับการอนุมัติ
    const restaurants = await prisma.restaurant.findMany({
      where: {
        status: 'APPROVED'
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          }
        },
        orders: {
          select: {
            id: true,
            status: true,
            total: true,
          }
        },
        menuItems: {
          select: {
            id: true,
            isAvailable: true,
          }
        },
        _count: {
          select: {
            orders: true,
            menuItems: true,
          }
        }
      },
      orderBy: {
        approvedAt: 'desc'
      }
    });

    // จัดรูปแบบข้อมูลสำหรับ frontend
    const formattedRestaurants = restaurants.map(restaurant => {
      // คำนวณสถิติ
      const totalOrders = restaurant._count.orders;
      const totalMenuItems = restaurant._count.menuItems;
      const availableMenuItems = restaurant.menuItems.filter(item => item.isAvailable).length;
      const totalRevenue = restaurant.orders
        .filter(order => !['CANCELLED'].includes(order.status))
        .reduce((sum, order) => sum + order.total, 0);

      return {
        id: restaurant.id,
        name: restaurant.name,
        description: restaurant.description,
        address: restaurant.address,
        phone: restaurant.phone,
        rating: restaurant.rating,
        isOpen: restaurant.isOpen,
        openTime: restaurant.openTime,
        closeTime: restaurant.closeTime,
        owner: `${restaurant.user.firstName} ${restaurant.user.lastName}`,
        ownerEmail: restaurant.user.email,
        ownerPhone: restaurant.user.phone,
        approvedAt: restaurant.approvedAt,
        approvedAtThai: restaurant.approvedAt 
          ? formatThailandTime(restaurant.approvedAt, 'yyyy-MM-dd HH:mm:ss')
          : null,
        stats: {
          totalOrders,
          totalMenuItems,
          availableMenuItems,
          totalRevenue,
        },
        createdAt: restaurant.createdAt,
      };
    });

    return NextResponse.json({
      success: true,
      restaurants: formattedRestaurants,
      count: formattedRestaurants.length,
    });

  } catch (error: any) {
    console.error('Approved restaurants fetch error:', error);
    
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    );
  }
} 