import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'ไม่ได้รับการยืนยันตัวตน' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        primaryRole: true,
        status: true,
        latitude: true,
        longitude: true,
        customer: {
          select: {
            addresses: {
              where: { isDefault: true },
              select: {
                address: true,
              },
              take: 1,
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'ไม่พบข้อมูลผู้ใช้' }, { status: 404 });
    }

    const defaultAddress = user.customer?.addresses?.[0]?.address || '';

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone || '',
        avatar: user.avatar,
        primaryRole: user.primaryRole,
        status: user.status,
        latitude: user.latitude,
        longitude: user.longitude,
        address: defaultAddress,
      }
    });

  } catch (error: any) {
    console.error('Get profile error:', error);
    return NextResponse.json({ 
      error: 'เกิดข้อผิดพลาดในการดึงข้อมูล', 
      details: error.message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'ไม่ได้รับการยืนยันตัวตน' }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, phone, address, latitude, longitude } = body;

    // Validate input
    if (!firstName || !lastName) {
      return NextResponse.json({ error: 'กรุณากรอกชื่อและนามสกุล' }, { status: 400 });
    }

    // Update user basic info
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone ? phone.trim() : null,
        latitude: latitude || null,
        longitude: longitude || null,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        primaryRole: true,
        status: true,
        latitude: true,
        longitude: true,
      }
    });

    // Update or create customer and address if exists
    if (address) {
      // First ensure customer exists
      const customer = await prisma.customer.upsert({
        where: { userId: session.user.id },
        update: {},
        create: { 
          userId: session.user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        select: { id: true }
      });

      // Then update or create default address
      const existingAddress = await prisma.customerAddress.findFirst({
        where: {
          customerId: customer.id,
          label: 'default'
        }
      });

      if (existingAddress) {
        await prisma.customerAddress.update({
          where: { id: existingAddress.id },
          data: { 
            address: address.trim(),
            isDefault: true,
          }
        });
      } else {
        await prisma.customerAddress.create({
          data: {
            customerId: customer.id,
            label: 'default',
            address: address.trim(),
            isDefault: true,
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'อัปเดตข้อมูลสำเร็จ',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phone: updatedUser.phone || '',
        avatar: updatedUser.avatar,
        primaryRole: updatedUser.primaryRole,
        status: updatedUser.status,
        latitude: updatedUser.latitude,
        longitude: updatedUser.longitude,
        address: address?.trim() || '',
      }
    });

  } catch (error: any) {
    console.error('Update profile error:', error);
    return NextResponse.json({ 
      error: 'เกิดข้อผิดพลาดในการอัปเดต', 
      details: error.message 
    }, { status: 500 });
  }
} 