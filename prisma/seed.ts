import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Create default categories
    const categories = [
      { name: 'Meats' },
      { name: 'Spices' },
      { name: 'Add-ons' },
      { name: 'Fruits' },
      { name: 'Vegetables' },
    ]

    for (const category of categories) {
      const result = await prisma.category.upsert({
        where: { name: category.name },
        update: {},
        create: { name: category.name },
      })
      console.log(`Upserted category: ${result.name}`)
    }

    console.log('Categories seeded successfully')
  } catch (error) {
    console.error('Error seeding categories:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('Error in seed script:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })