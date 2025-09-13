import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { createAuthenticatedHandler } from "@/lib/auth-middleware"
import { createResponse, handleApiError } from "@/lib/api-utils"

// GET /api/dashboard/stats - Dashboard statistics
export const GET = createAuthenticatedHandler(async (request: NextRequest) => {
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfYear = new Date(now.getFullYear(), 0, 1)

    // Get overall statistics
    const [
      totalProducts,
      totalOrders,
      totalCustomers,
      totalRevenue,
      monthlyOrders,
      monthlyRevenue,
      recentOrders,
      topProducts,
      ordersByStatus,
      salesByMonth,
    ] = await Promise.all([
      // Total Products
      prisma.product.count({
        where: { status: "ACTIVE" }
      }),

      // Total Orders
      prisma.order.count(),

      // Total Customers
      prisma.user.count({
        where: { role: "CUSTOMER" }
      }),

      // Total Revenue
      prisma.order.aggregate({
        where: { 
          status: { in: ["DELIVERED", "CONFIRMED"] }
        },
        _sum: { total: true }
      }),

      // Monthly Orders
      prisma.order.count({
        where: {
          createdAt: { gte: startOfMonth }
        }
      }),

      // Monthly Revenue
      prisma.order.aggregate({
        where: {
          createdAt: { gte: startOfMonth },
          status: { in: ["DELIVERED", "CONFIRMED"] }
        },
        _sum: { total: true }
      }),

      // Recent Orders
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            }
          }
        }
      }),

      // Top Products
      prisma.product.findMany({
        take: 5,
        include: {
          _count: {
            select: {
              orderItems: true,
            }
          },
          orderItems: {
            select: {
              quantity: true,
            }
          }
        }
      }),

      // Orders by Status
      prisma.order.groupBy({
        by: ["status"],
        _count: true,
      }),

      // Recent orders for chart (simplified)
      prisma.order.findMany({
        where: {
          createdAt: { gte: new Date(now.getFullYear() - 1, now.getMonth(), 1) },
          status: { in: ["DELIVERED", "CONFIRMED"] }
        },
        select: {
          createdAt: true,
          total: true,
        },
        orderBy: { createdAt: "desc" }
      }),
    ])

    // Calculate growth percentages (simplified)
    const stats = {
      overview: {
        totalProducts,
        totalOrders,
        totalCustomers,
        totalRevenue: totalRevenue._sum.total || 0,
        monthlyOrders,
        monthlyRevenue: monthlyRevenue._sum.total || 0,
      },
      charts: {
        salesByMonth: salesByMonth.reduce((acc: any[], order) => {
          const month = order.createdAt.toISOString().slice(0, 7)
          const existing = acc.find(item => item.month === month)
          if (existing) {
            existing.orders += 1
            existing.revenue += order.total
          } else {
            acc.push({
              month,
              orders: 1,
              revenue: order.total,
            })
          }
          return acc
        }, []),
        ordersByStatus: ordersByStatus.map((item) => ({
          status: item.status,
          count: item._count,
        })),
      },
      recent: {
        orders: recentOrders.map((order) => ({
          id: order.id,
          orderNumber: order.orderNumber,
          customer: order.user.name || order.user.email,
          total: order.total,
          status: order.status,
          createdAt: order.createdAt,
        })),
        topProducts: topProducts
          .map((product) => ({
            id: product.id,
            name: product.name,
            totalSold: product.orderItems.reduce((sum, item) => sum + item.quantity, 0),
            revenue: product.orderItems.reduce((sum, item) => sum + (item.quantity * product.price), 0),
          }))
          .sort((a, b) => b.totalSold - a.totalSold)
          .slice(0, 5),
      },
    }

    return createResponse(stats)
  } catch (error) {
    return handleApiError(error)
  }
})