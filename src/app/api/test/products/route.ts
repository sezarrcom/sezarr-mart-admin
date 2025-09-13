import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { createResponse, handleApiError } from "@/lib/api-utils"

// GET /api/test/products - Test products endpoint (no auth required)
export async function GET(request: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      take: 5,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          select: {
            id: true,
            url: true,
            alt: true,
          },
          take: 1,
        },
        _count: {
          select: {
            orderItems: true,
            reviews: true,
          },
        },
      },
    })

    return createResponse({
      message: "Test endpoint working!",
      products,
      total: await prisma.product.count(),
    })
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/test/products - Create a test product
export async function POST(request: NextRequest) {
  try {
    const testProduct = await prisma.product.create({
      data: {
        name: "Test Product " + Date.now(),
        slug: "test-product-" + Date.now(),
        description: "This is a test product created via API",
        price: 99.99,
        inventory: 10,
        status: "ACTIVE",
        categoryId: (await prisma.category.findFirst())?.id || "temp",
      },
      include: {
        category: true,
      },
    })

    return createResponse(testProduct, "Test product created successfully", 201)
  } catch (error) {
    return handleApiError(error)
  }
}