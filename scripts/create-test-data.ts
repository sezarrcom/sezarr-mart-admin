import { PrismaClient, ProductStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function createTestData() {
  // Create some test products if categories exist
  const categories = await prisma.category.findMany()
  
  if (categories.length > 0) {
    const testProducts = [
      {
        name: "iPhone 15 Pro",
        slug: "iphone-15-pro",
        description: "Latest Apple smartphone with advanced features",
        price: 999.99,
        comparePrice: 1099.99,
        sku: "IP15PRO001",
        inventory: 25,
        status: ProductStatus.ACTIVE,
        featured: true,
        categoryId: categories[0].id,
      },
      {
        name: "Samsung Galaxy S24",
        slug: "samsung-galaxy-s24",
        description: "Flagship Android smartphone",
        price: 899.99,
        sku: "SGS24001",
        inventory: 30,
        status: ProductStatus.ACTIVE,
        categoryId: categories[0].id,
      },
      {
        name: "MacBook Pro M3",
        slug: "macbook-pro-m3",
        description: "Professional laptop with M3 chip",
        price: 1999.99,
        sku: "MBPM3001",
        inventory: 15,
        status: ProductStatus.ACTIVE,
        categoryId: categories[0].id,
      },
    ]

    for (const productData of testProducts) {
      try {
        await prisma.product.upsert({
          where: { slug: productData.slug },
          update: {},
          create: productData,
        })
        console.log(`Created product: ${productData.name}`)
      } catch (error) {
        console.log(`Product ${productData.name} already exists or error occurred`)
      }
    }

    console.log('Test products created successfully!')
  } else {
    console.log('No categories found. Please run db:seed first.')
  }
}

createTestData()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })