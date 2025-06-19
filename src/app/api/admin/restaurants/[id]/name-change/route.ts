import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getThailandNow } from '@/lib/timezone';

// POST - อนุมัติ/ปฏิเสธการขอเปลี่ยนชื่อ
export async function POST(
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
    const { action, rejectReason } = await request.json();

    // Validation
    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'กรุณาระบุการกระทำที่ถูกต้อง (approve หรือ reject)' },
        { status: 400 }
      );
    }

    if (action === 'reject' && !rejectReason?.trim()) {
      return NextResponse.json(
        { error: 'กรุณาระบุเหตุผลในการปฏิเสธ' },
        { status: 400 }
      );
    }

    // ตรวจสอบว่าร้านอาหารมีคำขอเปลี่ยนชื่อหรือไม่
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลร้านอาหาร' },
        { status: 404 }
      );
    }

    if (!restaurant.pendingName) {
      return NextResponse.json(
        { error: 'ไม่มีคำขอเปลี่ยนชื่อที่รออนุมัติ' },
        { status: 400 }
      );
    }

    // อัพเดทสถานะการขอเปลี่ยนชื่อ
    const updateData: any = {
      nameChangeRequestedAt: null,
    };

    if (action === 'approve') {
      updateData.name = restaurant.pendingName;
      updateData.pendingName = null;
      updateData.nameApprovedAt = getThailandNow(); // ใช้เวลาไทย
      updateData.nameRejectedAt = null;
      updateData.nameRejectReason = null;
    } else {
      updateData.pendingName = null;
      updateData.nameRejectedAt = getThailandNow(); // ใช้เวลาไทย
      updateData.nameRejectReason = rejectReason.trim();
      updateData.nameApprovedAt = null;
    }

    await prisma.restaurant.update({
      where: { id: restaurantId },
      data: updateData,
    });

    const message = action === 'approve' 
      ? 'อนุมัติการเปลี่ยนชื่อร้านอาหารสำเร็จ'
      : 'ปฏิเสธการเปลี่ยนชื่อร้านอาหารสำเร็จ';

    return NextResponse.json({
      success: true,
      message,
    });

  } catch (error: any) {
    console.error('Name change action error:', error);
    return NextResponse.json(
      { error: error.message || 'เกิดข้อผิดพลาดในการดำเนินการ' },
      { status: 500 }
    );
  }
} 