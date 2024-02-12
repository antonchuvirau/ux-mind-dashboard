import { PrismaClient } from '@prisma/client';

// const prismaClientWithLogs = new PrismaClient({
//   log:
//     process.env.NODE_ENV === 'development'
//       ? ['query', 'error', 'warn']
//       : ['error'],
// });

declare global {
  var cachedPrisma: PrismaClient; // eslint-disable-line
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient();
  }

  prisma = global.cachedPrisma;
}

export const db = prisma;
