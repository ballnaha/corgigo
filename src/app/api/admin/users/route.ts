import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (role && role !== 'all') {
      where.primaryRole = role;
    }

    // Get users with pagination
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          primaryRole: true,
          status: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
          customer: {
            select: {
              orders: {
                select: { id: true }
              }
            }
          },
          restaurant: {
            select: {
              id: true,
              name: true,
              status: true
            }
          },
          rider: {
            select: {
              id: true,
              status: true,
              rating: true,
              totalRides: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.user.count({ where })
    ]);

    // Transform data to include counts
    const transformedUsers = users.map(user => ({
      ...user,
      fullName: `${user.firstName} ${user.lastName}`,
      orderCount: user.customer?.orders?.length || 0,
      restaurantInfo: user.restaurant,
      riderInfo: user.rider
    }));

    return NextResponse.json({
      success: true,
      users: transformedUsers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId, action, data } = await request.json();

    if (!userId || !action) {
      return NextResponse.json(
        { success: false, error: 'ข้อมูลไม่ครบถ้วน' },
        { status: 400 }
      );
    }

    let updatedUser;

    switch (action) {
      case 'toggle_status':
        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { 
            status: data.status,
            updatedAt: new Date()
          }
        });
        break;

      case 'update_role':
        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { 
            primaryRole: data.primaryRole,
            updatedAt: new Date()
          }
        });
        break;

      case 'update_info':
        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
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
      message: 'อัปเดตข้อมูลผู้ใช้สำเร็จ',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลผู้ใช้' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบ ID ผู้ใช้' },
        { status: 400 }
      );
    }

    // Check if user has any active orders or restaurants
    const userRelations = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        customer: {
          include: {
            orders: {
              where: {
                status: {
                  in: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'PICKED_UP']
                }
              }
            }
          }
        },
        restaurant: {
          where: {
            isOpen: true
          }
        }
      }
    });

    if (!userRelations) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบผู้ใช้' },
        { status: 404 }
      );
    }

    if (userRelations.customer?.orders && userRelations.customer.orders.length > 0) {
      return NextResponse.json(
        { success: false, error: 'ไม่สามารถลบผู้ใช้ที่มีออเดอร์ที่ยังไม่เสร็จสิ้น' },
        { status: 400 }
      );
    }

    if (userRelations.restaurant && userRelations.restaurant.isOpen) {
      return NextResponse.json(
        { success: false, error: 'ไม่สามารถลบผู้ใช้ที่มีร้านอาหารที่เปิดให้บริการ' },
        { status: 400 }
      );
    }

    // Soft delete by deactivating
    await prisma.user.update({
      where: { id: userId },
      data: { 
        status: 'INACTIVE',
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'ปิดการใช้งานผู้ใช้สำเร็จ'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการลบผู้ใช้' },
      { status: 500 }
    );
  }
} 