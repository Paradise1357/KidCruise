import { PrismaClient } from '@prisma/client'

// PrismaClient is the object we use to talk to the database.
// We create it once here and export it so every file in the project
// uses the same single connection — not a new one every time.
const prisma = new PrismaClient()

export default prisma
