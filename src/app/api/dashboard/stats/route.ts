import { createResponse } from "@/lib/api-utils"

interface DashboardStats {
  overview: {
    totalProducts: number;
    totalOrders: number;
    totalCustomers: number;
    totalRevenue: number;
    monthlyOrders: number;
    monthlyRevenue: number;
  };
  charts: {
    salesByMonth: Array<{month: string; orders: number; revenue: number}>;
    ordersByStatus: Array<{status: string; count: number}>;
  };
  recentActivity: {
    recentOrders: Array<{
      id: string;
      orderNumber: string;
      customer: string;
      total: number;
      status: string;
    }>;
    topProducts: Array<{
      id: string;
      name: string;
      totalSold: number;
      revenue: number;
    }>;
  };
}

// GET /api/dashboard/stats - Dashboard statistics
export async function GET(): Promise<Response> {
  try {
    // Mock data for dashboard statistics
    const mockStats: DashboardStats = {
      overview: {
        totalProducts: 1250,
        totalOrders: 3847,
        totalCustomers: 2156,
        totalRevenue: 284750,
        monthlyOrders: 387,
        monthlyRevenue: 45890
      },
      charts: {
        salesByMonth: [
          { month: "2024-01", orders: 234, revenue: 28450 },
          { month: "2024-02", orders: 267, revenue: 32180 },
          { month: "2024-03", orders: 289, revenue: 35670 },
          { month: "2024-04", orders: 312, revenue: 38950 },
          { month: "2024-05", orders: 298, revenue: 36720 },
          { month: "2024-06", orders: 356, revenue: 42890 }
        ],
        ordersByStatus: [
          { status: "PENDING", count: 45 },
          { status: "CONFIRMED", count: 123 },
          { status: "SHIPPED", count: 87 },
          { status: "DELIVERED", count: 234 },
          { status: "CANCELLED", count: 12 }
        ]
      },
      recentActivity: {
        recentOrders: [
          {
            id: "1",
            orderNumber: "ORD-2024-001",
            customer: "John Smith",
            total: 129.99,
            status: "CONFIRMED"
          },
          {
            id: "2", 
            orderNumber: "ORD-2024-002",
            customer: "Sarah Johnson",
            total: 89.50,
            status: "SHIPPED"
          },
          {
            id: "3",
            orderNumber: "ORD-2024-003", 
            customer: "Mike Davis",
            total: 156.75,
            status: "PENDING"
          }
        ],
        topProducts: [
          {
            id: "1",
            name: "Wireless Headphones",
            totalSold: 156,
            revenue: 15600
          },
          {
            id: "2",
            name: "Smartphone Case",
            totalSold: 234,
            revenue: 7020
          },
          {
            id: "3", 
            name: "Bluetooth Speaker",
            totalSold: 89,
            revenue: 8900
          }
        ]
      }
    };

    return createResponse(mockStats);
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return createResponse(
      { error: "Failed to fetch dashboard statistics" },
      "Internal Server Error",
      500
    );
  }
}