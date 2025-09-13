import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { createAuthenticatedHandler } from "@/lib/auth-middleware"
import { paginationSchema } from "@/lib/validations"
import { createPaginatedResponse, handleApiError } from "@/lib/api-utils"

// GET /api/orders - List orders
export const GET = createAuthenticatedHandler(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, search } = paginationSchema.parse({
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "10",
      search: searchParams.get("search") || undefined,
    })

    const status = searchParams.get("status")
    const skip = (page - 1) * limit

    const where: any = {}
    
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { user: { email: { contains: search, mode: "insensitive" } } },
        { user: { name: { contains: search, mode: "insensitive" } } },
      ]
    }

    if (status && status !== "ALL") {
      where.status = status
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          orderItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  images: {
                    select: {
                      url: true,
                    },
                    take: 1,
                  },
                },
              },
            },
          },
          payments: true,
        },
      }),
      prisma.order.count({ where }),
    ])

    return createPaginatedResponse(orders, { page, limit, total })
  } catch (error) {
    return handleApiError(error)
  }
})