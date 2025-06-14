import { PrismaClient } from '@prisma/client';
import { getThailandNow } from './timezone';

export function setupPrismaMiddleware(prisma: PrismaClient) {
  // Middleware สำหรับจัดการ createdAt และ updatedAt ด้วยเวลาไทย
  prisma.$use(async (params, next) => {
    const thaiNow = getThailandNow();
    
    // Debug log
    console.log(`🔧 Prisma Middleware: ${params.model}.${params.action}`);

    // สำหรับการสร้างข้อมูลใหม่ (create, createMany)
    if (params.action === 'create') {
      if (params.args.data) {
        // ใช้เวลาไทยสำหรับ createdAt เสมอ
        params.args.data.createdAt = params.args.data.createdAt || thaiNow;
        
        // ใช้เวลาไทยสำหรับ updatedAt เฉพาะ model ที่มี field นี้
        // (UserRoles ไม่มี updatedAt)
        if (params.model !== 'UserRoles') {
          params.args.data.updatedAt = params.args.data.updatedAt || thaiNow;
        }
      }
    }

    // สำหรับการสร้างหลายรายการ (createMany)
    if (params.action === 'createMany') {
      if (params.args.data && Array.isArray(params.args.data)) {
        params.args.data = params.args.data.map((item: any) => {
          const newItem = {
            ...item,
            createdAt: item.createdAt || thaiNow,
          };
          
          // เพิ่ม updatedAt เฉพาะ model ที่มี field นี้
          if (params.model !== 'UserRoles') {
            newItem.updatedAt = item.updatedAt || thaiNow;
          }
          
          return newItem;
        });
      }
    }

    // สำหรับการอัปเดต (update, updateMany, upsert)
    if (['update', 'updateMany', 'upsert'].includes(params.action)) {
      if (params.args.data) {
        // อัปเดต updatedAt เสมอ
        params.args.data.updatedAt = thaiNow;
        console.log(`📝 Setting updatedAt to Thai time: ${thaiNow.toISOString()}`);
      }
    }

    // สำหรับ upsert - จัดการ create data ด้วย
    if (params.action === 'upsert') {
      if (params.args.create) {
        params.args.create.createdAt = params.args.create.createdAt || thaiNow;
        
        // เพิ่ม updatedAt เฉพาะ model ที่มี field นี้
        if (params.model !== 'UserRoles') {
          params.args.create.updatedAt = params.args.create.updatedAt || thaiNow;
        }
      }
    }

    return next(params);
  });

  console.log('✅ Prisma middleware for Thailand timezone is set up');
} 