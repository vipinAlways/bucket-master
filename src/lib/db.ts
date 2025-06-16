
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  cachedPrisma?: PrismaClient
}

const prisma =
  globalForPrisma.cachedPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : [],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.cachedPrisma = prisma
}

export const db = prisma
