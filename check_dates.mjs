import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
try {
  const gifts = await prisma.gift.findMany({ take: 5, select: { id: true, specialDate: true, dayCountStart: true } })
  for (const g of gifts) {
    console.log(g.id, JSON.stringify(g.specialDate), JSON.stringify(g.dayCountStart))
  }
} finally {
  await prisma.$disconnect()
}
