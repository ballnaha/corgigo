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

    // ตรวจสอบว่าผู้ใช้มีร้านอาหารหรือไม่
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
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'กรุณาเลือกไฟล์' },
        { status: 400 }
      );
    }

    const uploadedFiles = [];
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'restaurants', restaurant.id);

    // สร้างโฟลเดอร์ถ้ายังไม่มี
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    for (const file of files) {
      // ตรวจสอบขนาดไฟล์ (ไม่เกิน 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: `ไฟล์ ${file.name} มีขนาดใหญ่เกินไป (ไม่เกิน 5MB)` },
          { status: 400 }
        );
      }

      // ตรวจสอบประเภทไฟล์
      const allowedTypes = [
        'image/jpeg', 
        'image/png', 
        'image/jpg', 
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        // เพิ่ม MIME types ที่อาจเกิดขึ้น
        'application/excel',
        'application/x-excel',
        'application/x-msexcel',
        'application/vnd.ms-office'
      ];
      
      // ตรวจสอบจากนามสกุลไฟล์เป็นทางเลือก
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'xls', 'xlsx'];
      
      const isValidType = allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension || '');
      
      if (!isValidType) {
        console.log('File validation failed:', {
          name: file.name,
          type: file.type,
          extension: fileExtension
        });
        return NextResponse.json(
          { error: `ไฟล์ ${file.name} ไม่รองรับ (รองรับเฉพาะ JPG, PNG, PDF, DOC, DOCX, XLS, XLSX) - MIME type: ${file.type}` },
          { status: 400 }
        );
      }

      // สร้างชื่อไฟล์ใหม่เพื่อป้องกันการซ้ำ
      const timestamp = Date.now();
      const originalExtension = file.name.split('.').pop();
      const fileName = `${timestamp}_${Math.random().toString(36).substring(2)}.${originalExtension}`;
      const filePath = join(uploadDir, fileName);

      // บันทึกไฟล์
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      // บันทึกข้อมูลไฟล์ในฐานข้อมูล
      const savedFile = await prisma.restaurantDocument.create({
        data: {
          restaurantId: restaurant.id,
          fileName,
          originalName: file.name,
          fileSize: file.size,
          fileType: file.type,
          filePath: `/uploads/restaurants/${restaurant.id}/${fileName}`,
        },
      });

      uploadedFiles.push({
        id: savedFile.id,
        name: savedFile.originalName,
        size: savedFile.fileSize,
        type: savedFile.fileType,
        url: savedFile.filePath,
      });
    }

    return NextResponse.json({
      success: true,
      message: `อัพโหลดไฟล์สำเร็จ ${uploadedFiles.length} ไฟล์`,
      files: uploadedFiles,
    });

  } catch (error: any) {
    console.error('File upload error:', error);
    
    return NextResponse.json(
      { error: error.message || 'เกิดข้อผิดพลาดในการอัพโหลดไฟล์' },
      { status: 500 }
    );
  }
}

// GET - ดึงรายการไฟล์ของร้านอาหาร
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'กรุณาเข้าสู่ระบบ' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // ตรวจสอบว่าผู้ใช้มีร้านอาหารหรือไม่
    const restaurant = await prisma.restaurant.findUnique({
      where: { userId },
      include: {
        restaurantDocuments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลร้านอาหาร' },
        { status: 404 }
      );
    }

    const files = restaurant.restaurantDocuments.map(doc => ({
      id: doc.id,
      name: doc.originalName,
      size: doc.fileSize,
      type: doc.fileType,
      url: doc.filePath,
      createdAt: doc.createdAt,
    }));

    return NextResponse.json({
      success: true,
      files,
    });

  } catch (error: any) {
    console.error('Get files error:', error);
    
    return NextResponse.json(
      { error: error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลไฟล์' },
      { status: 500 }
    );
  }
}

// DELETE - ลบไฟล์
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'กรุณาเข้าสู่ระบบ' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('id');

    if (!fileId) {
      return NextResponse.json(
        { error: 'กรุณาระบุ ID ไฟล์' },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // ตรวจสอบว่าไฟล์เป็นของผู้ใช้หรือไม่
    const document = await prisma.restaurantDocument.findFirst({
      where: {
        id: fileId,
        restaurant: {
          userId,
        },
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: 'ไม่พบไฟล์ที่ต้องการลบ' },
        { status: 404 }
      );
    }

    // ลบไฟล์จากระบบก่อน
    try {
      const fullPath = join(process.cwd(), 'public', document.filePath);
      if (existsSync(fullPath)) {
        await unlink(fullPath);
        console.log('✅ ลบไฟล์จากระบบสำเร็จ:', document.fileName);
      } else {
        console.log('⚠️ ไม่พบไฟล์ในระบบ:', fullPath);
      }
    } catch (fileDeleteError) {
      console.error('❌ ไม่สามารถลบไฟล์จากระบบได้:', fileDeleteError);
      // ไม่ให้ error นี้หยุดการลบจากฐานข้อมูล
    }

    // ลบไฟล์จากฐานข้อมูล
    await prisma.restaurantDocument.delete({
      where: { id: fileId },
    });

    return NextResponse.json({
      success: true,
      message: 'ลบไฟล์สำเร็จ',
    });

  } catch (error: any) {
    console.error('Delete file error:', error);
    
    return NextResponse.json(
      { error: error.message || 'เกิดข้อผิดพลาดในการลบไฟล์' },
      { status: 500 }
    );
  }
} 