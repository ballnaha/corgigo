import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin
    if (!session?.user || session.user.primaryRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { restaurantId, reason, suspendType = 'ADMIN_REQUEST' } = body;

    if (!restaurantId || !reason) {
      return NextResponse.json(
        { error: 'Restaurant ID and reason are required' },
        { status: 400 }
      );
    }

    // Check if restaurant exists
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      include: { user: true }
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    // Update restaurant status to suspended
    const updatedRestaurant = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        isSuspended: true,
        suspendedAt: new Date(),
        suspendedBy: session.user.id,
        suspendReason: reason,
        isActive: false, // Also set to inactive
        status: 'SUSPENDED'
      }
    });

    // Create notification for restaurant owner
    await prisma.notification.create({
      data: {
        userId: restaurant.userId,
        title: 'ร้านของคุณถูกระงับการใช้งาน',
        message: `ร้าน "${restaurant.name}" ถูกระงับการใช้งานเนื่องจาก: ${reason}`,
        type: 'SUSPENSION',
        relatedId: restaurantId,
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Restaurant suspended successfully',
      restaurant: {
        id: updatedRestaurant.id,
        name: updatedRestaurant.name,
        isSuspended: updatedRestaurant.isSuspended,
        suspendedAt: updatedRestaurant.suspendedAt,
        suspendReason: updatedRestaurant.suspendReason,
        status: updatedRestaurant.status
      }
    });

  } catch (error) {
    console.error('Error suspending restaurant:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Unsuspend restaurant
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin
    if (!session?.user || session.user.primaryRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { restaurantId, note } = body;

    if (!restaurantId) {
      return NextResponse.json(
        { error: 'Restaurant ID is required' },
        { status: 400 }
      );
    }

    // Check if restaurant exists and is suspended
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      include: { user: true }
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    if (!restaurant.isSuspended) {
      return NextResponse.json(
        { error: 'Restaurant is not suspended' },
        { status: 400 }
      );
    }

    // Update restaurant status to unsuspended
    const updatedRestaurant = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        isSuspended: false,
        suspendedAt: null,
        suspendedBy: null,
        suspendReason: null,
        isActive: true,
        status: 'APPROVED' // Restore to approved status
      }
    });

    // Create notification for restaurant owner
    await prisma.notification.create({
      data: {
        userId: restaurant.userId,
        title: 'ร้านของคุณได้รับการเปิดใช้งานแล้ว',
        message: `ร้าน "${restaurant.name}" ได้รับการเปิดใช้งานแล้ว${note ? ` - ${note}` : ''}`,
        type: 'APPROVAL',
        relatedId: restaurantId,
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Restaurant unsuspended successfully',
      restaurant: {
        id: updatedRestaurant.id,
        name: updatedRestaurant.name,
        isSuspended: updatedRestaurant.isSuspended,
        isActive: updatedRestaurant.isActive,
        status: updatedRestaurant.status
      }
    });

  } catch (error) {
    console.error('Error unsuspending restaurant:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 