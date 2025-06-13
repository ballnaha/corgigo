import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'APPROVED';
    const limit = parseInt(searchParams.get('limit') || '10');
    const featured = searchParams.get('featured') === 'true';
    
    const restaurants = await prisma.restaurant.findMany({
      where: {
        status: status as any,
        ...(featured ? { rating: { gte: 4.5 } } : {})
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        _count: {
          select: {
            menuItems: true,
            orders: true
          }
        }
      },
      orderBy: [
        { rating: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit
    });

    return NextResponse.json({
      success: true,
      data: restaurants,
      count: restaurants.length
    });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch restaurants' },
      { status: 500 }
    );
  }
} 