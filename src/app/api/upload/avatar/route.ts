import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'ไม่ได้รับการยืนยันตัวตน' }, { status: 401 });
    }

    // Get current user's avatar to delete old file
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { avatar: true }
    });

    const formData = await request.formData();
    const file = formData.get('avatar') as File;

    if (!file) {
      return NextResponse.json({ error: 'ไม่พบไฟล์' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'ไฟล์ต้องเป็นรูปภาพเท่านั้น' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'ขนาดไฟล์ต้องไม่เกิน 5MB' }, { status: 400 });
    }

    // Create unique filename
    const fileExtension = file.name.split('.').pop();
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    
    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'avatars');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, that's okay
    }

    // Convert file to buffer and save new file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = join(uploadDir, uniqueFilename);
    
    await writeFile(filePath, buffer);

    // Create avatar URL
    const avatarUrl = `/uploads/avatars/${uniqueFilename}`;

    // Update user avatar in database
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { avatar: avatarUrl },
      select: {
        id: true,
        avatar: true,
        email: true,
        firstName: true,
        lastName: true,
      }
    });

    // Delete old avatar file if exists (after successful database update)
    if (currentUser?.avatar && currentUser.avatar !== avatarUrl) {
      try {
        // Extract filename from URL (remove /uploads/avatars/ prefix)
        const oldFilename = currentUser.avatar.replace('/uploads/avatars/', '');
        const oldFilePath = join(uploadDir, oldFilename);
        
        // Check if old file exists and delete it
        if (existsSync(oldFilePath)) {
          await unlink(oldFilePath);
          console.log('🗑️ Deleted old avatar:', oldFilename);
        }
      } catch (deleteError) {
        console.error('⚠️ Could not delete old avatar file:', deleteError);
        // Don't fail the request if we can't delete the old file
      }
    }

    return NextResponse.json({
      success: true,
      message: 'อัปโหลดรูปโปรไฟล์สำเร็จ',
      avatarUrl: avatarUrl,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: `${updatedUser.firstName} ${updatedUser.lastName}`,
        avatar: updatedUser.avatar,
      }
    });

  } catch (error: any) {
    console.error('Avatar upload error:', error);
    
    return NextResponse.json({ 
      error: 'เกิดข้อผิดพลาดในการอัปโหลด', 
      details: error.message 
    }, { status: 500 });
  }
} 