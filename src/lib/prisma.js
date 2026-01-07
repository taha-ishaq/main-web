// import { PrismaClient } from '@prisma/client';
// import { PrismaMariaDb } from '@prisma/adapter-mariadb';
// import mysql from 'mysql2/promise';

// const globalForPrisma = globalThis;

// let prisma;

// const poolConfig = {
//   host: 'localhost',
//   user: 'root',
//   password: 'talha1234D',
//   database: 'rsa',
//   port: 3306,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// };

// if (process.env.NODE_ENV === 'production') {
//   const pool = mysql.createPool(poolConfig);
//   const adapter = new PrismaMariaDb(pool);
//   prisma = new PrismaClient({ adapter });
// } else {
//   if (!globalForPrisma.prisma) {
//     const pool = mysql.createPool(poolConfig);
//     const adapter = new PrismaMariaDb(pool);
//     globalForPrisma.prisma = new PrismaClient({ adapter });
//   }
//   prisma = globalForPrisma.prisma;
// }

// export default prisma;


import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma

