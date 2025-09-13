import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { createResponse, handleApiError } from "@/lib/api-utils"

// GET /api/test/dashboard - Test dashboard stats (no auth required)
export async function GET(request: NextRequest) {
  try {
    const [
      totalProducts,
      totalOrders,
      totalCustomers,
      categories,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.category.findMany({
        include: {
          _count: {
            select: {
              products: true,
            },
          },
        },
      }),
    ])

    const stats = {
      overview: {
        totalProducts,
        totalOrders,
        totalCustomers,
        totalCategories: categories.length,
      },
      categories: categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        productCount: cat._count.products,
      })),
      message: "Dashboard test endpoint working!",
      timestamp: new Date().toISOString(),
    }

    return createResponse(stats)
  } catch (error) {
    return handleApiError(error)
  }
}