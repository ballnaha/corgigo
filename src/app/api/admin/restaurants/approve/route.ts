import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getThailandNow } from '@/lib/timezone';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // ตรวจสอบว่าเป็น admin หรือไม่
    if (!session?.user?.id || session.user.primaryRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'ไม่มีสิทธิ์เข้าถึง' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { restaurantId, action, rejectReason } = body;

    if (!restaurantId || !action) {
      return NextResponse.json(
        { error: 'กรุณาระบุข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    if (!['APPROVED', 'REJECTED'].includes(action)) {
      return NextResponse.json(
        { error: 'การดำเนินการไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    if (action === 'REJECTED' && !rejectReason?.trim()) {
      return NextResponse.json(
        { error: 'กรุณาระบุเหตุผลในการปฏิเสธ' },
        { status: 400 }
      );
    }

    // ดึงข้อมูลร้านอาหาร
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      include: { user: true }
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: 'ไม่พบร้านอาหาร' },
        { status: 404 }
      );
    }

    if (restaurant.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'ร้านอาหารนี้ได้รับการดำเนินการแล้ว' },
        { status: 400 }
      );
    }

    // อัพเดทสถานะร้านอาหาร
    const updateData: any = {
      status: action,
    };

    if (action === 'APPROVED') {
      updateData.approvedAt = getThailandNow();
      updateData.approvedBy = session.user.id;
      updateData.isOpen = true; // เปิดร้านเมื่ออนุมัติ
      updateData.rejectedAt = null;
      updateData.rejectedBy = null;
      updateData.rejectReason = null;
    } else {
      updateData.rejectedAt = getThailandNow();
      updateData.rejectedBy = session.user.id;
      updateData.rejectReason = rejectReason?.trim();
      updateData.isOpen = false;
    }

    const updatedRestaurant = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: updateData,
      include: { user: true }
    });

    // สร้างการแจ้งเตือนให้เจ้าของร้าน
    await prisma.notification.create({
      data: {
        userId: restaurant.userId,
        title: action === 'APPROVED' ? 'ร้านของคุณได้รับการอนุมัติ!' : 'ร้านของคุณไม่ผ่านการตรวจสอบ',
        message: action === 'APPROVED' 
          ? `ยินดีด้วย! ร้าน "${restaurant.name}" ได้รับการอนุมัติแล้ว สามารถเริ่มรับออเดอร์ได้เลย`
          : `ขออภัย ร้าน "${restaurant.name}" ไม่ผ่านการตรวจสอบ เหตุผล: ${rejectReason}`,
        type: 'RESTAURANT_APPROVAL',
        data: {
          restaurantId: restaurant.id,
          status: action,
          rejectReason: action === 'REJECTED' ? rejectReason : null
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: action === 'APPROVED' ? 'อนุมัติร้านอาหารสำเร็จ' : 'ปฏิเสธร้านอาหารสำเร็จ',
      restaurant: {
        id: updatedRestaurant.id,
        name: updatedRestaurant.name,
        status: updatedRestaurant.status,
        owner: `${updatedRestaurant.user.firstName} ${updatedRestaurant.user.lastName}`,
      }
    });

  } catch (error: any) {
    console.error('Restaurant approval error:', error);
    
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดำเนินการ' },
      { status: 500 }
    );
  }
} 