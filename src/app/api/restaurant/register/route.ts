import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// GET - ดึงข้อมูลร้านอาหารเพื่อแก้ไข
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

    // ดึงข้อมูลร้านอาหาร
    const restaurant = await prisma.restaurant.findUnique({
      where: { userId },
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        phone: true,
        openTime: true,
        closeTime: true,
        latitude: true,
        longitude: true,
        status: true,
      },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลร้านอาหาร' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      restaurant,
    });

  } catch (error: any) {
    console.error('Get restaurant error:', error);
    
    return NextResponse.json(
      { error: error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลร้านอาหาร' },
      { status: 500 }
    );
  }
}

// POST - สมัครร้านอาหารใหม่
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'กรุณาเข้าสู่ระบบ' },
        { status: 401 }
      );
    }

    // รับข้อมูลจาก FormData
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const address = formData.get('address') as string;
    const phone = formData.get('phone') as string;
    const openTime = formData.get('openTime') as string;
    const closeTime = formData.get('closeTime') as string;
    const latitude = formData.get('latitude') as string;
    const longitude = formData.get('longitude') as string;
    const files = formData.getAll('files') as File[];

    // Validation
    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'กรุณากรอกชื่อร้าน' },
        { status: 400 }
      );
    }

    if (!address?.trim()) {
      return NextResponse.json(
        { error: 'กรุณากรอกที่อยู่ร้าน' },
        { status: 400 }
      );
    }

    if (!phone?.trim()) {
      return NextResponse.json(
        { error: 'กรุณากรอกเบอร์โทรศัพท์' },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // ตรวจสอบว่าผู้ใช้มี restaurant role อยู่แล้วหรือไม่
    const existingRestaurantRole = await prisma.userRoles.findFirst({
      where: {
        userId,
        role: 'RESTAURANT',
      },
    });

    if (existingRestaurantRole) {
      return NextResponse.json(
        { error: 'คุณมีร้านอาหารอยู่แล้ว' },
        { status: 400 }
      );
    }

    // สร้าง restaurant role และ restaurant profile
    const result = await prisma.$transaction(async (tx) => {
      // เพิ่ม restaurant role
      await tx.userRoles.create({
        data: {
          userId,
          role: 'RESTAURANT',
        },
      });

      // สร้าง restaurant profile with PENDING status
      const restaurant = await tx.restaurant.create({
        data: {
          userId,
          name: name.trim(),
          description: description?.trim() || null,
          address: address.trim(),
          phone: phone.trim(),
          openTime: openTime || '09:00',
          closeTime: closeTime || '21:00',
          latitude: latitude ? parseFloat(latitude) : null,
          longitude: longitude ? parseFloat(longitude) : null,
          isOpen: false, // ปิดร้านจนกว่าจะได้รับการอนุมัติ
          rating: 5.0,
          status: 'PENDING', // สถานะรอการตรวจสอบ
        },
      });

      // อัพเดท primaryRole เป็น RESTAURANT
      await tx.user.update({
        where: { id: userId },
        data: { primaryRole: 'RESTAURANT' },
      });

      return restaurant;
    });

    // อัพโหลดไฟล์ถ้ามี
    const uploadedFiles = [];
    if (files && files.length > 0) {
      // ตรวจสอบจำนวนไฟล์ที่มีอยู่แล้ว (สำหรับ POST ควรเป็น 0)
      const existingFilesCount = await prisma.restaurantDocument.count({
        where: { restaurantId: result.id },
      });

      // ตรวจสอบว่าไฟล์ใหม่รวมกับไฟล์เก่าจะเกิน 10 ไฟล์หรือไม่
      const totalFilesAfterUpload = existingFilesCount + files.length;
      if (totalFilesAfterUpload > 10) {
        const remainingSlots = 10 - existingFilesCount;
        return NextResponse.json(
          { error: `สามารถอัปโหลดได้สูงสุด 10 ไฟล์ ปัจจุบันมี ${existingFilesCount} ไฟล์แล้ว สามารถเพิ่มได้อีก ${remainingSlots} ไฟล์เท่านั้น` },
          { status: 400 }
        );
      }

      // สร้างโฟลเดอร์สำหรับร้านอาหาร
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'restaurants', result.id);
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      for (const file of files) {
        // ตรวจสอบขนาดไฟล์ (ไม่เกิน 15MB)
        if (file.size > 15 * 1024 * 1024) {
          console.warn(`File ${file.name} is too large (${file.size} bytes)`);
          continue;
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
          'application/excel',
          'application/x-excel',
          'application/x-msexcel',
          'application/vnd.ms-office'
        ];
        
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'xls', 'xlsx'];
        
        const isValidType = allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension || '');
        
        if (!isValidType) {
          console.warn(`File ${file.name} has invalid type: ${file.type}`);
          continue;
        }

        // สร้างชื่อไฟล์ใหม่
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
            restaurantId: result.id,
            fileName,
            originalName: file.name,
            fileSize: file.size,
            fileType: file.type,
            filePath: `/uploads/restaurants/${result.id}/${fileName}`,
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
    }

    return NextResponse.json({
      success: true,
      message: `สมัครเปิดร้านอาหารสำเร็จ! ${uploadedFiles.length > 0 ? `อัพโหลดไฟล์สำเร็จ ${uploadedFiles.length} ไฟล์ ` : ''}เรากำลังตรวจสอบข้อมูลร้านของคุณ จะแจ้งผลภายใน 2-3 วันทำการ`,
      restaurant: {
        id: result.id,
        name: result.name,
        address: result.address,
        phone: result.phone,
      },
      files: uploadedFiles,
    });

  } catch (error: any) {
    console.error('Restaurant registration error:', error);
    
    return NextResponse.json(
      { error: error.message || 'เกิดข้อผิดพลาดในการสมัครเปิดร้านอาหาร' },
      { status: 500 }
    );
  }
}

// PUT - อัพเดทข้อมูลร้านอาหาร
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'กรุณาเข้าสู่ระบบ' },
        { status: 401 }
      );
    }

    // รับข้อมูลจาก FormData
    const contentType = request.headers.get('content-type');
    let name, description, address, phone, openTime, closeTime, latitude, longitude, files: File[] = [];
    
    if (contentType?.includes('application/json')) {
      // รับจาก JSON (เดิม)
      const body = await request.json();
      ({ name, description, address, phone, openTime, closeTime, latitude, longitude } = body);
    } else {
      // รับจาก FormData (ใหม่)
      const formData = await request.formData();
      name = formData.get('name') as string;
      description = formData.get('description') as string;
      address = formData.get('address') as string;
      phone = formData.get('phone') as string;
      openTime = formData.get('openTime') as string;
      closeTime = formData.get('closeTime') as string;
      latitude = formData.get('latitude') as string;
      longitude = formData.get('longitude') as string;
      files = formData.getAll('files') as File[];
    }

    // Validation
    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'กรุณากรอกชื่อร้าน' },
        { status: 400 }
      );
    }

    if (!address?.trim()) {
      return NextResponse.json(
        { error: 'กรุณากรอกที่อยู่ร้าน' },
        { status: 400 }
      );
    }

    if (!phone?.trim()) {
      return NextResponse.json(
        { error: 'กรุณากรอกเบอร์โทรศัพท์' },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // ตรวจสอบว่ามีร้านอาหารอยู่หรือไม่
    const existingRestaurant = await prisma.restaurant.findUnique({
      where: { userId },
    });

    if (!existingRestaurant) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลร้านอาหาร' },
        { status: 404 }
      );
    }

    // อัพเดทข้อมูลร้านอาหาร และเปลี่ยนสถานะเป็น PENDING อีกครั้ง
    const updatedRestaurant = await prisma.restaurant.update({
      where: { userId },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        address: address.trim(),
        phone: phone.trim(),
        openTime: openTime || '09:00',
        closeTime: closeTime || '21:00',
        latitude: latitude ? (typeof latitude === 'string' ? parseFloat(latitude) : latitude) : null,
        longitude: longitude ? (typeof longitude === 'string' ? parseFloat(longitude) : longitude) : null,
        status: 'PENDING', // เปลี่ยนสถานะเป็น PENDING อีกครั้ง
        // รีเซ็ตข้อมูลการอนุมัติ/ปฏิเสธ
        approvedAt: null,
        approvedBy: null,
        rejectedAt: null,
        rejectedBy: null,
        rejectReason: null,
      },
    });

    // อัพโหลดไฟล์ใหม่ถ้ามี
    const uploadedFiles = [];
    if (files && files.length > 0) {
      // ตรวจสอบจำนวนไฟล์ที่มีอยู่แล้ว
      const existingFilesCount = await prisma.restaurantDocument.count({
        where: { restaurantId: existingRestaurant.id },
      });

      // ตรวจสอบว่าไฟล์ใหม่รวมกับไฟล์เก่าจะเกิน 10 ไฟล์หรือไม่
      const totalFilesAfterUpload = existingFilesCount + files.length;
      if (totalFilesAfterUpload > 10) {
        const remainingSlots = 10 - existingFilesCount;
        return NextResponse.json(
          { error: `สามารถอัปโหลดได้สูงสุด 10 ไฟล์ ปัจจุบันมี ${existingFilesCount} ไฟล์แล้ว สามารถเพิ่มได้อีก ${remainingSlots} ไฟล์เท่านั้น` },
          { status: 400 }
        );
      }

      // สร้างโฟลเดอร์สำหรับร้านอาหาร
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'restaurants', existingRestaurant.id);
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      for (const file of files) {
        // ตรวจสอบขนาดไฟล์ (ไม่เกิน 15MB)
        if (file.size > 15 * 1024 * 1024) {
          console.warn(`File ${file.name} is too large (${file.size} bytes)`);
          continue;
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
          'application/excel',
          'application/x-excel',
          'application/x-msexcel',
          'application/vnd.ms-office'
        ];
        
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'xls', 'xlsx'];
        
        const isValidType = allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension || '');
        
        if (!isValidType) {
          console.warn(`File ${file.name} has invalid type: ${file.type}`);
          continue;
        }

        // สร้างชื่อไฟล์ใหม่
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
            restaurantId: existingRestaurant.id,
            fileName,
            originalName: file.name,
            fileSize: file.size,
            fileType: file.type,
            filePath: `/uploads/restaurants/${existingRestaurant.id}/${fileName}`,
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
    }

    // ดึงไฟล์ทั้งหมดของร้านอาหาร (เดิม + ใหม่)
    const allFiles = await prisma.restaurantDocument.findMany({
      where: { restaurantId: existingRestaurant.id },
      orderBy: { createdAt: 'desc' },
    });

    const allFilesFormatted = allFiles.map(file => ({
      id: file.id,
      name: file.originalName,
      size: file.fileSize,
      type: file.fileType,
      url: file.filePath,
      createdAt: file.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      message: `อัพเดทข้อมูลร้านอาหารสำเร็จ! ${uploadedFiles.length > 0 ? `อัพโหลดไฟล์เพิ่มเติม ${uploadedFiles.length} ไฟล์ ` : ''}เรากำลังตรวจสอบข้อมูลใหม่ของคุณ`,
      restaurant: {
        id: updatedRestaurant.id,
        name: updatedRestaurant.name,
        description: updatedRestaurant.description,
        address: updatedRestaurant.address,
        phone: updatedRestaurant.phone,
        openTime: updatedRestaurant.openTime,
        closeTime: updatedRestaurant.closeTime,
        latitude: updatedRestaurant.latitude,
        longitude: updatedRestaurant.longitude,
        status: updatedRestaurant.status,
      },
      files: allFilesFormatted,
    });

  } catch (error: any) {
    console.error('Restaurant update error:', error);
    
    return NextResponse.json(
      { error: error.message || 'เกิดข้อผิดพลาดในการอัพเดทข้อมูลร้านอาหาร' },
      { status: 500 }
    );
  }
} 