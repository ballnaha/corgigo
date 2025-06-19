import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'กรุณาเข้าสู่ระบบ' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // ตรวจสอบว่ามีร้านอาหารหรือไม่
    const restaurant = await prisma.restaurant.findUnique({
      where: { userId },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลร้านอาหาร' },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('avatar') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'กรุณาเลือกไฟล์รูปภาพ' },
        { status: 400 }
      );
    }

    // ตรวจสอบประเภทไฟล์
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'รองรับเฉพาะไฟล์รูปภาพ (JPEG, PNG, WebP)' },
        { status: 400 }
      );
    }

    // ตรวจสอบขนาดไฟล์ (ไม่เกิน 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'ขนาดไฟล์ต้องไม่เกิน 5MB' },
        { status: 400 }
      );
    }

    // สร้างโฟลเดอร์สำหรับร้านอาหาร
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'restaurants', restaurant.id, 'avatar');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // ลบไฟล์ avatar เดิมถ้ามี
    if (restaurant.avatarUrl) {
      try {
        const oldFilePath = join(process.cwd(), 'public', restaurant.avatarUrl);
        if (existsSync(oldFilePath)) {
          await unlink(oldFilePath);
        }
      } catch (error) {
        console.warn('Could not delete old avatar:', error);
      }
    }

    // สร้างชื่อไฟล์ใหม่
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `avatar_${timestamp}.${fileExtension}`;
    const filePath = join(uploadDir, fileName);

    // บันทึกไฟล์
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // อัพเดท avatarUrl ในฐานข้อมูล
    const avatarUrl = `/uploads/restaurants/${restaurant.id}/avatar/${fileName}`;
    const updatedRestaurant = await prisma.restaurant.update({
      where: { id: restaurant.id },
      data: { avatarUrl },
    });

    return NextResponse.json({
      success: true,
      message: 'อัพโหลด Avatar สำเร็จ',
      avatarUrl,
    });

  } catch (error: any) {
    console.error('Avatar upload error:', error);
    return NextResponse.json(
      { error: error.message || 'เกิดข้อผิดพลาดในการอัพโหลด Avatar' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'กรุณาเข้าสู่ระบบ' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // ตรวจสอบว่ามีร้านอาหารหรือไม่
    const restaurant = await prisma.restaurant.findUnique({
      where: { userId },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลร้านอาหาร' },
        { status: 404 }
      );
    }

    // ลบไฟล์ avatar ถ้ามี
    if (restaurant.avatarUrl) {
      try {
        const filePath = join(process.cwd(), 'public', restaurant.avatarUrl);
        if (existsSync(filePath)) {
          await unlink(filePath);
        }
      } catch (error) {
        console.warn('Could not delete avatar file:', error);
      }
    }

    // อัพเดทฐานข้อมูล
    await prisma.restaurant.update({
      where: { id: restaurant.id },
      data: { avatarUrl: null },
    });

    return NextResponse.json({
      success: true,
      message: 'ลบ Avatar สำเร็จ',
    });

  } catch (error: any) {
    console.error('Delete avatar error:', error);
    return NextResponse.json(
      { error: error.message || 'เกิดข้อผิดพลาดในการลบ Avatar' },
      { status: 500 }
    );
  }
} 