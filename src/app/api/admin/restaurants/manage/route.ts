import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { user: {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } }
          ]
        }}
      ];
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    // Get restaurants with pagination
    const [restaurants, total] = await Promise.all([
      prisma.restaurant.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              status: true
            }
          },
          menuItems: {
            select: {
              id: true,
              isAvailable: true
            }
          },
          orders: {
            select: {
              id: true,
              total: true,
              status: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.restaurant.count({ where })
    ]);

    // Transform data to include statistics
    const transformedRestaurants = restaurants.map(restaurant => ({
      ...restaurant,
      ownerName: `${restaurant.user.firstName} ${restaurant.user.lastName}`,
      stats: {
        totalMenuItems: restaurant.menuItems.length,
        availableMenuItems: restaurant.menuItems.filter(item => item.isAvailable).length,
        totalOrders: restaurant.orders.length,
        totalRevenue: restaurant.orders
          .filter(order => order.status === 'DELIVERED')
          .reduce((sum, order) => sum + order.total, 0)
      }
    }));

    return NextResponse.json({
      success: true,
      restaurants: transformedRestaurants,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการดึงข้อมูลร้านอาหาร' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { restaurantId, action, data } = await request.json();

    if (!restaurantId || !action) {
      return NextResponse.json(
        { success: false, error: 'ข้อมูลไม่ครบถ้วน' },
        { status: 400 }
      );
    }

    let updatedRestaurant;

    switch (action) {
      case 'toggle_status':
        updatedRestaurant = await prisma.restaurant.update({
          where: { id: restaurantId },
          data: { 
            isOpen: data.isOpen,
            updatedAt: new Date()
          }
        });
        break;

      case 'update_status':
        updatedRestaurant = await prisma.restaurant.update({
          where: { id: restaurantId },
          data: { 
            status: data.status,
            updatedAt: new Date(),
            ...(data.status === 'SUSPENDED' && data.reason && {
              rejectReason: data.reason,
              rejectedAt: new Date(),
              rejectedBy: data.adminId
            }),
            ...(data.status === 'APPROVED' && {
              approvedAt: new Date(),
              approvedBy: data.adminId,
              rejectReason: null,
              rejectedAt: null
            })
          }
        });
        break;

      case 'update_info':
        updatedRestaurant = await prisma.restaurant.update({
          where: { id: restaurantId },
          data: {
            name: data.name,
            description: data.description,
            address: data.address,
            phone: data.phone,
            openTime: data.openTime,
            closeTime: data.closeTime,
            updatedAt: new Date()
          }
        });
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'การดำเนินการไม่ถูกต้อง' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: 'อัปเดตข้อมูลร้านอาหารสำเร็จ',
      restaurant: updatedRestaurant
    });

  } catch (error) {
    console.error('Error updating restaurant:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลร้านอาหาร' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurantId');

    if (!restaurantId) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบ ID ร้านอาหาร' },
        { status: 400 }
      );
    }

    // Check if restaurant has any active orders
    const activeOrders = await prisma.order.findMany({
      where: {
        restaurantId,
        status: {
          in: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'PICKED_UP']
        }
      }
    });

    if (activeOrders.length > 0) {
      return NextResponse.json(
        { success: false, error: 'ไม่สามารถลบร้านอาหารที่มีออเดอร์ที่ยังไม่เสร็จสิ้น' },
        { status: 400 }
      );
    }

    // Soft delete by changing status to suspended
    await prisma.restaurant.update({
      where: { id: restaurantId },
      data: { 
        status: 'SUSPENDED',
        isOpen: false,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'ระงับการใช้งานร้านอาหารสำเร็จ'
    });

  } catch (error) {
    console.error('Error deleting restaurant:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการลบร้านอาหาร' },
      { status: 500 }
    );
  }
} 