import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { createAuthenticatedHandler } from "@/lib/auth-middleware"
import { updateProductSchema } from "@/lib/validations"
import { createResponse, createErrorResponse, handleApiError } from "@/lib/api-utils"

// GET /api/products/[id] - Get single product
export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        vendor: true,
        images: {
          orderBy: { position: "asc" },
        },
        variants: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: {
          select: {
            orderItems: true,
            reviews: true,
          },
        },
      },
    })

    if (!product) {
      return createErrorResponse("Product not found", 404)
    }

    return createResponse(product)
  } catch (error) {
    return handleApiError(error)
  }
}

// PUT /api/products/[id] - Update product
export const PUT = createAuthenticatedHandler(
  async (request: NextRequest, user, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id } = await params
      const body = await request.json()
      const validatedData = updateProductSchema.parse(body)

      const existingProduct = await prisma.product.findUnique({
        where: { id },
      })

      if (!existingProduct) {
        return createErrorResponse("Product not found", 404)
      }

      const product = await prisma.product.update({
        where: { id },
        data: validatedData,
        include: {
          category: true,
          vendor: true,
          images: true,
        },
      })

      return createResponse(product, "Product updated successfully")
    } catch (error) {
      return handleApiError(error)
    }
  },
  { requireAdmin: true }
)

// DELETE /api/products/[id] - Delete product
export const DELETE = createAuthenticatedHandler(
  async (request: NextRequest, user, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id } = await params
      const existingProduct = await prisma.product.findUnique({
        where: { id },
      })

      if (!existingProduct) {
        return createErrorResponse("Product not found", 404)
      }

      await prisma.product.delete({
        where: { id },
      })

      return createResponse({ id }, "Product deleted successfully")
    } catch (error) {
      return handleApiError(error)
    }
  },
  { requireAdmin: true }
)