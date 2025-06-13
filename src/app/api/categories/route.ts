import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get unique category names with menu item counts
    const categoriesWithItems = await prisma.category.findMany({
      select: {
        name: true,
        _count: {
          select: {
            menuItems: true
          }
        }
      }
    });

    // Group by name and sum menu items
    const categoryMap = new Map<string, number>();
    categoriesWithItems.forEach(cat => {
      const count = categoryMap.get(cat.name) || 0;
      categoryMap.set(cat.name, count + cat._count.menuItems);
    });

    // Transform to match expected format
    const transformedCategories = Array.from(categoryMap.entries()).map(([name, count], index) => ({
      id: `category-${index}`,
      name: name,
      description: `หมวดหมู่ ${name}`,
      _count: {
        menuItems: count
      }
    }));

    return NextResponse.json({
      success: true,
      data: transformedCategories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
} 