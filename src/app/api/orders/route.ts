import { NextRequest } from "next/server"
import { createResponse } from "@/lib/api-utils"

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  customer: string;
  items: number;
}

// GET /api/orders - List orders
export async function GET(request: NextRequest): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || "all"

    // Mock orders data
    const mockOrders: Order[] = [
      {
        id: "1",
        orderNumber: "ORD-2024-001",
        total: 129.99,
        status: "CONFIRMED",
        createdAt: "2024-09-13T10:30:00Z",
        customer: "John Smith",
        items: 3
      },
      {
        id: "2",
        orderNumber: "ORD-2024-002", 
        total: 89.50,
        status: "SHIPPED",
        createdAt: "2024-09-13T09:15:00Z",
        customer: "Sarah Johnson",
        items: 2
      },
      {
        id: "3",
        orderNumber: "ORD-2024-003",
        total: 156.75,
        status: "PENDING",
        createdAt: "2024-09-13T08:45:00Z",
        customer: "Mike Davis",
        items: 1
      },
      {
        id: "4", 
        orderNumber: "ORD-2024-004",
        total: 234.20,
        status: "DELIVERED",
        createdAt: "2024-09-12T16:20:00Z",
        customer: "Emily Wilson",
        items: 4
      },
      {
        id: "5",
        orderNumber: "ORD-2024-005",
        total: 67.99,
        status: "CANCELLED",
        createdAt: "2024-09-12T14:10:00Z", 
        customer: "Robert Brown",
        items: 1
      }
    ];

    // Filter orders based on search and status
    let filteredOrders = mockOrders;

    if (search) {
      filteredOrders = filteredOrders.filter(order => 
        order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        order.customer.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status !== "all") {
      filteredOrders = filteredOrders.filter(order => order.status === status);
    }

    // Pagination
    const total = filteredOrders.length;
    const startIndex = (page - 1) * limit;
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + limit);

    return createResponse({
      orders: paginatedOrders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Orders API error:", error);
    return createResponse(
      { error: "Failed to fetch orders" },
      "Internal Server Error",
      500
    );
  }
}