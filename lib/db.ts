import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// const prismaClientWithLogs = new PrismaClient({
//   log:
//     process.env.NODE_ENV === 'development'
//       ? ['query', 'error', 'warn']
//       : ['error'],
// });

const prismaClientWithoutLogs = new PrismaClient();

export const prisma = globalForPrisma.prisma ?? prismaClientWithoutLogs;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
