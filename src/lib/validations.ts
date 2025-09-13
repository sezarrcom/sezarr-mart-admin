import { z } from "zod"

// Product Schemas
export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  comparePrice: z.number().positive().optional(),
  sku: z.string().optional(),
  inventory: z.number().int().min(0, "Inventory cannot be negative"),
  categoryId: z.string().min(1, "Category is required"),
  vendorId: z.string().optional(),
  featured: z.boolean().default(false),
  status: z.enum(["DRAFT", "ACTIVE", "INACTIVE", "ARCHIVED"]).default("DRAFT"),
})

export const updateProductSchema = createProductSchema.partial()

// Category Schemas
export const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  image: z.string().url().optional(),
  parentId: z.string().optional(),
})

export const updateCategorySchema = createCategorySchema.partial()

// Order Schemas
export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"]),
  notes: z.string().optional(),
})

// User Schemas
export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["CUSTOMER", "ADMIN", "VENDOR", "MANAGER"]).default("CUSTOMER"),
})

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  role: z.enum(["CUSTOMER", "ADMIN", "VENDOR", "MANAGER"]).optional(),
})

// Vendor Schemas
export const createVendorSchema = z.object({
  name: z.string().min(1, "Vendor name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  address: z.string().optional(),
  commission: z.number().min(0).max(100, "Commission must be between 0-100%"),
})

export const updateVendorSchema = createVendorSchema.partial()

// Coupon Schemas
export const createCouponSchema = z.object({
  code: z.string().min(1, "Coupon code is required").toUpperCase(),
  description: z.string().optional(),
  type: z.enum(["PERCENTAGE", "FIXED_AMOUNT", "FREE_SHIPPING"]),
  value: z.number().positive("Value must be positive"),
  minimumAmount: z.number().positive().optional(),
  maximumDiscount: z.number().positive().optional(),
  usageLimit: z.number().int().positive().optional(),
  validFrom: z.string().transform((str) => new Date(str)),
  validTo: z.string().transform((str) => new Date(str)),
  isActive: z.boolean().default(true),
})

export const updateCouponSchema = createCouponSchema.partial()

// Query Schemas
export const paginationSchema = z.object({
  page: z.string().transform((val) => Math.max(1, parseInt(val) || 1)),
  limit: z.string().transform((val) => Math.min(100, Math.max(1, parseInt(val) || 10))),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
})

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
export type PaginationInput = z.infer<typeof paginationSchema>