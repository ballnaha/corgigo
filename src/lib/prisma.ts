import { PrismaClient } from '@prisma/client'
import { setupPrismaMiddleware } from './prisma-middleware'

declare global {
  var __prisma: PrismaClient | undefined
}

const prisma = globalThis.__prisma ?? new PrismaClient()

// ตั้งค่า middleware สำหรับ Thailand timezone
if (!globalThis.__prisma) {
  setupPrismaMiddleware(prisma)
}

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}

export { prisma } 