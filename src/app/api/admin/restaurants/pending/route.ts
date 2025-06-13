import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

    // ดึงรายการร้านอาหารที่รอการอนุมัติ
    const pendingRestaurants = await prisma.restaurant.findMany({
      where: {
        status: 'PENDING'
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          }
        },
        restaurantDocuments: {
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedRestaurants = pendingRestaurants.map(restaurant => ({
      id: restaurant.id,
      name: restaurant.name,
      owner: `${restaurant.user.firstName} ${restaurant.user.lastName}`,
      phone: restaurant.user.phone || restaurant.phone || 'ไม่ระบุ',
      email: restaurant.user.email,
      address: restaurant.address,
      description: restaurant.description || 'ไม่มีรายละเอียด',
      submittedAt: restaurant.createdAt.toISOString(),
      documents: restaurant.restaurantDocuments.map(doc => ({
        id: doc.id,
        name: doc.originalName,
        size: doc.fileSize,
        type: doc.fileType,
        url: doc.filePath,
        createdAt: doc.createdAt.toISOString(),
      }))
    }));

    return NextResponse.json({
      success: true,
      restaurants: formattedRestaurants,
      count: formattedRestaurants.length
    });

  } catch (error: any) {
    console.error('Get pending restaurants error:', error);
    
    return NextResponse.json(
      { error: error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    );
  }
} 