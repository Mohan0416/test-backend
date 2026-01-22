import {PrismaClient} from '@prisma/client'

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_POOLER + "?schema=public&pgbouncer=true",
    },
  },
});

