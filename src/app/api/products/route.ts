import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { createAuthenticatedHandler } from "@/lib/auth-middleware"
import { createProductSchema, paginationSchema } from "@/lib/validations"
import { createResponse, createErrorResponse, createPaginatedResponse, handleApiError } from "@/lib/api-utils"

// GET /api/products - List products with pagination
export const GET = createAuthenticatedHandler(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, search, sortBy, sortOrder } = paginationSchema.parse({
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "10",
      search: searchParams.get("search") || undefined,
      sortBy: searchParams.get("sortBy") || "createdAt",
      sortOrder: searchParams.get("sortOrder") || "desc",
    })

    const skip = (page - 1) * limit

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
            { sku: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy as string]: sortOrder },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          vendor: {
            select: {
              id: true,
              name: true,
            },
          },
          images: {
            select: {
              id: true,
              url: true,
              alt: true,
              position: true,
            },
            orderBy: { position: "asc" },
          },
          _count: {
            select: {
              orderItems: true,
              reviews: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ])

    return createPaginatedResponse(products, { page, limit, total })
  } catch (error) {
    return handleApiError(error)
  }
})

// POST /api/products - Create product
export const POST = createAuthenticatedHandler(
  async (request: NextRequest, user) => {
    try {
      const body = await request.json()
      const validatedData = createProductSchema.parse(body)

      // Generate slug from name if not provided
      const slug = validatedData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

      const product = await prisma.product.create({
        data: {
          ...validatedData,
          slug,
        },
        include: {
          category: true,
          vendor: true,
          images: true,
        },
      })

      return createResponse(product, "Product created successfully", 201)
    } catch (error) {
      return handleApiError(error)
    }
  },
  { requireAdmin: true }
)