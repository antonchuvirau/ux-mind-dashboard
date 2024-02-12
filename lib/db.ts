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

let p: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  p = new PrismaClient();
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient();
  }

  p = global.cachedPrisma;
}

export const prisma = p;
