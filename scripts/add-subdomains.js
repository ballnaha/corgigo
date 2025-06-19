const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addSubdomains() {
  console.log('🔄 Adding subdomains to existing restaurants...');

  try {
    // Get all restaurants without subdomains
    const restaurants = await prisma.restaurant.findMany({
      where: {
        subdomain: null
      },
      include: {
        user: true
      }
    });

    console.log(`Found ${restaurants.length} restaurants without subdomains`);

    for (let i = 0; i < restaurants.length; i++) {
      const restaurant = restaurants[i];
      
      // Generate subdomain from restaurant name
      let subdomain = restaurant.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '') // Remove non-alphanumeric characters
        .substring(0, 20); // Limit length
      
      // Ensure uniqueness
      let baseSubdomain = subdomain;
      let counter = 1;
      
      while (true) {
        const existingSubdomain = await prisma.restaurant.findFirst({
          where: { subdomain: subdomain }
        });
        
        if (!existingSubdomain) break;
        
        subdomain = `${baseSubdomain}${counter}`;
        counter++;
      }

      // Update restaurant with subdomain
      await prisma.restaurant.update({
        where: { id: restaurant.id },
        data: { 
          subdomain: subdomain,
          // Set default values for new fields if they don't exist
          isActive: true,
          isSuspended: false,
          themePrimaryColor: '#10B981',
          themeSecondaryColor: '#F59E0B',
          themeAccentColor: '#EF4444'
        }
      });

      console.log(`✅ Added subdomain "${subdomain}" to restaurant "${restaurant.name}"`);
    }

    console.log('🎉 Successfully added subdomains to all restaurants!');

  } catch (error) {
    console.error('❌ Error adding subdomains:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addSubdomains(); 