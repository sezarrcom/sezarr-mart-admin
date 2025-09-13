import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { createAuthenticatedHandler } from "@/lib/auth-middleware"
import { createCategorySchema, paginationSchema } from "@/lib/validations"
import { createResponse, createPaginatedResponse, handleApiError } from "@/lib/api-utils"

// GET /api/categories - List categories
export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, search } = paginationSchema.parse({
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "20",
      search: searchParams.get("search") || undefined,
    })

    const skip = (page - 1) * limit

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          parent: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          children: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          _count: {
            select: {
              products: true,
            },
          },
        },
      }),
      prisma.category.count({ where }),
    ])

    return createPaginatedResponse(categories, { page, limit, total })
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/categories - Create category
export const POST = createAuthenticatedHandler(
  async (request: NextRequest) => {
    try {
      const body = await request.json()
      const validatedData = createCategorySchema.parse(body)

      const category = await prisma.category.create({
        data: validatedData,
        include: {
          parent: true,
          children: true,
          _count: {
            select: {
              products: true,
            },
          },
        },
      })

      return createResponse(category, "Category created successfully", 201)
    } catch (error) {
      return handleApiError(error)
    }
  },
  { requireAdmin: true }
)