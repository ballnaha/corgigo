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
    const file = formData.get('cover') as File;

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

    // ตรวจสอบขนาดไฟล์ (ไม่เกิน 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'ขนาดไฟล์ต้องไม่เกิน 10MB' },
        { status: 400 }
      );
    }

    // สร้างโฟลเดอร์สำหรับร้านอาหาร
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'restaurants', restaurant.id, 'cover');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // ลบไฟล์ cover เดิมถ้ามี
    if (restaurant.coverUrl) {
      try {
        const oldFilePath = join(process.cwd(), 'public', restaurant.coverUrl);
        if (existsSync(oldFilePath)) {
          await unlink(oldFilePath);
        }
      } catch (error) {
        console.warn('Could not delete old cover:', error);
      }
    }

    // สร้างชื่อไฟล์ใหม่
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `cover_${timestamp}.${fileExtension}`;
    const filePath = join(uploadDir, fileName);

    // บันทึกไฟล์
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // อัพเดท coverUrl ในฐานข้อมูล
    const coverUrl = `/uploads/restaurants/${restaurant.id}/cover/${fileName}`;
    const updatedRestaurant = await prisma.restaurant.update({
      where: { id: restaurant.id },
      data: { coverUrl },
    });

    return NextResponse.json({
      success: true,
      message: 'อัพโหลด Cover สำเร็จ',
      coverUrl,
    });

  } catch (error: any) {
    console.error('Cover upload error:', error);
    return NextResponse.json(
      { error: error.message || 'เกิดข้อผิดพลาดในการอัพโหลด Cover' },
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

    // ลบไฟล์ cover ถ้ามี
    if (restaurant.coverUrl) {
      try {
        const filePath = join(process.cwd(), 'public', restaurant.coverUrl);
        if (existsSync(filePath)) {
          await unlink(filePath);
        }
      } catch (error) {
        console.warn('Could not delete cover file:', error);
      }
    }

    // อัพเดทฐานข้อมูล
    await prisma.restaurant.update({
      where: { id: restaurant.id },
      data: { coverUrl: null },
    });

    return NextResponse.json({
      success: true,
      message: 'ลบ Cover สำเร็จ',
    });

  } catch (error: any) {
    console.error('Delete cover error:', error);
    return NextResponse.json(
      { error: error.message || 'เกิดข้อผิดพลาดในการลบ Cover' },
      { status: 500 }
    );
  }
} 