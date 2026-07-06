import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // seed data here
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
