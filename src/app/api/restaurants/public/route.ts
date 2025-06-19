import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      status: 'APPROVED', // เฉพาะร้านที่อนุมัติแล้ว
      isOpen: true, // เฉพาะร้านที่เปิดอยู่
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get restaurants with menu items
    const restaurants = await prisma.restaurant.findMany({
      where,
      skip,
      take: limit,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          }
        },
                 menuItems: {
           where: {
             isAvailable: true
           },
           take: 3, // เอาแค่ 3 เมนูตัวอย่าง
           include: {
             category: true,
           }
         },
        categories: {
          take: 5
        }
      },
      orderBy: {
        rating: 'desc'
      }
    });

    // Transform data for frontend
    const transformedRestaurants = restaurants.map(restaurant => {
      // สุ่มข้อมูลเพิ่มเติมสำหรับ demo
      const discountPercent = Math.floor(Math.random() * 40) + 10; // 10-50%
      const deliveryTime = `${15 + Math.floor(Math.random() * 30)}-${25 + Math.floor(Math.random() * 35)} min`;
      const deliveryFee = Math.random() > 0.3 ? `฿${Math.floor(Math.random() * 30) + 10}` : 'Free';
      
      return {
        id: restaurant.id,
        name: restaurant.name,
        description: restaurant.description,
        image: restaurant.avatarUrl || restaurant.image || `https://images.unsplash.com/photo-${1565299624946 + parseInt(restaurant.id.slice(-6), 36)}?w=300&h=200&fit=crop`,
        rating: restaurant.rating,
        address: restaurant.address,
        isOpen: restaurant.isOpen,
        openTime: restaurant.openTime,
        closeTime: restaurant.closeTime,
        
        // Demo data
        discount: `${discountPercent}%`,
        deliveryTime,
        deliveryFee,
        category: restaurant.categories[0]?.name || 'ร้านอาหาร',
        
        // Menu items with add-ons
        menuItems: restaurant.menuItems.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          originalPrice: item.originalPrice,
          image: item.image,
                     calories: Math.floor(Math.random() * 400) + 200,
           protein: Math.floor(Math.random() * 20) + 15,
          tags: [item.category?.name || 'อาหาร', 'ยอดนิยม'],
          
          // สร้าง add-ons ตัวอย่าง
          addOns: [
            {
              id: `addon_extra_meat_${item.id}`,
              name: 'เนื้อเพิ่ม',
              price: 25,
              description: 'เพิ่มเนื้อพอร์ชันพิเศษ'
            },
            {
              id: `addon_extra_cheese_${item.id}`,
              name: 'ชีสเพิ่ม',
              price: 15,
              description: 'ชีสมอซซาเรลล่าเพิ่ม'
            },
            {
              id: `addon_spicy_${item.id}`,
              name: 'เผ็ดพิเศษ',
              price: 5,
              description: 'เพิ่มพริกและซอสเผ็ด'
            },
            {
              id: `addon_extra_veggies_${item.id}`,
              name: 'ผักเพิ่ม',
              price: 10,
              description: 'ผักสดหลากหลาย'
            }
          ],
          
          restaurant: {
            id: restaurant.id,
            name: restaurant.name,
            rating: restaurant.rating
          }
        }))
      };
    });

    return NextResponse.json({
      success: true,
      restaurants: transformedRestaurants,
      pagination: {
        page,
        limit,
        total: transformedRestaurants.length
      }
    });

  } catch (error) {
    console.error('Error fetching public restaurants:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการดึงข้อมูลร้านอาหาร' },
      { status: 500 }
    );
  }
} 