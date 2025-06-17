import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import sharp from 'sharp';
import crypto from 'crypto';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's restaurant
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { restaurant: true }
    });

    if (!user?.restaurant) {
      return NextResponse.json(
        { success: false, error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const oldImageUrl: string | null = data.get('oldImageUrl') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file received' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (15MB limit)
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 15MB' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    const filename = `${timestamp}_${randomString}.webp`; // Always save as WebP

    // Create restaurant-specific directory
    const restaurantDir = join(process.cwd(), 'public', 'uploads', 'menus', user.restaurant.id);
    if (!existsSync(restaurantDir)) {
      await mkdir(restaurantDir, { recursive: true });
    }

    const filePath = join(restaurantDir, filename);

    // Process and resize image using sharp
    await sharp(buffer)
      .resize(800, 600, { 
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 85 }) // Convert to WebP with 85% quality
      .toFile(filePath);

    // Delete old image if exists
    if (oldImageUrl) {
      try {
        const oldFilePath = join(process.cwd(), 'public', oldImageUrl);
        if (existsSync(oldFilePath)) {
          await unlink(oldFilePath);
        }
      } catch (deleteError) {
        console.warn('Failed to delete old image:', deleteError);
      }
    }

    // Return the URL
    const url = `/uploads/menus/${user.restaurant.id}/${filename}`;

    return NextResponse.json({
      success: true,
      url: url,
      message: 'Upload successful'
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    );
  }
}

// DELETE endpoint for removing images
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('imageUrl');

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Delete file from filesystem
    try {
      const filePath = join(process.cwd(), 'public', imageUrl);
      if (existsSync(filePath)) {
        await unlink(filePath);
      }
    } catch (deleteError) {
      console.warn('Failed to delete image file:', deleteError);
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully'
    });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Delete failed' },
      { status: 500 }
    );
  }
} 