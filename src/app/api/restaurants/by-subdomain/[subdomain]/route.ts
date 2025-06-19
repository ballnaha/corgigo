import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { subdomain: string } }
) {
  try {
    const { subdomain } = params;

    if (!subdomain) {
      return NextResponse.json(
        { error: 'Subdomain is required' },
        { status: 400 }
      );
    }

    // Find restaurant by subdomain
    const restaurant = await prisma.restaurant.findFirst({
      where: {
        subdomain: subdomain,
        isActive: true, // Only return active restaurants
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        },
        categories: {
          where: {
            // Only include categories that have available menu items
          },
          orderBy: {
            order: 'asc'
          }
        },
        menuItems: {
          where: {
            isAvailable: true
          },
          include: {
            category: true,
            nutritionInfo: true,
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        domains: {
          where: {
            isVerified: true
          }
        }
      }
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    // Check if restaurant is suspended
    if (restaurant.isSuspended || restaurant.status === 'SUSPENDED') {
      return NextResponse.json(
        { 
          error: 'Restaurant is suspended',
          suspendReason: restaurant.suspendReason,
          suspendedAt: restaurant.suspendedAt
        },
        { status: 403 }
      );
    }

    // Check if restaurant is approved
    if (restaurant.status !== 'APPROVED') {
      return NextResponse.json(
        { 
          error: 'Restaurant is not approved yet',
          status: restaurant.status
        },
        { status: 403 }
      );
    }

    // Transform data for client
    const restaurantData = {
      id: restaurant.id,
      name: restaurant.name,
      description: restaurant.description,
      address: restaurant.address,
      phone: restaurant.phone,
      avatarUrl: restaurant.avatarUrl,
      coverUrl: restaurant.coverUrl,
      logoUrl: restaurant.logoUrl,
      bannerUrl: restaurant.bannerUrl,
      rating: restaurant.rating,
      isOpen: restaurant.isOpen,
      openTime: restaurant.openTime,
      closeTime: restaurant.closeTime,
      status: restaurant.status,
      subdomain: restaurant.subdomain,
      customDomain: restaurant.customDomain,
      isActive: restaurant.isActive,
      isSuspended: restaurant.isSuspended,
      suspendedAt: restaurant.suspendedAt,
      suspendReason: restaurant.suspendReason,
      themePrimaryColor: restaurant.themePrimaryColor,
      themeSecondaryColor: restaurant.themeSecondaryColor,
      themeAccentColor: restaurant.themeAccentColor,
      createdAt: restaurant.createdAt.toISOString(),
      updatedAt: restaurant.updatedAt.toISOString(),
      
      // Include owner info (without sensitive data)
      owner: {
        name: `${restaurant.user.firstName} ${restaurant.user.lastName}`,
        email: restaurant.user.email
      },
      
      // Categories and menu items
      categories: restaurant.categories,
      menuItems: restaurant.menuItems.map(item => ({
        ...item,
        restaurant: undefined, // Remove circular reference
        category: item.category ? {
          id: item.category.id,
          name: item.category.name,
          description: item.category.description
        } : null,
        // Add sample add-ons for demonstration
        addOns: [
          { id: 'addon-1', name: 'ข้าวเพิ่ม', price: 10 },
          { id: 'addon-2', name: 'ไข่ดาว', price: 15 },
          { id: 'addon-3', name: 'หมูหยอง', price: 20 },
        ]
      })),
      
      // Domain info
      domains: restaurant.domains
    };

    return NextResponse.json({
      success: true,
      restaurant: restaurantData
    });

  } catch (error) {
    console.error('Error fetching restaurant by subdomain:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 