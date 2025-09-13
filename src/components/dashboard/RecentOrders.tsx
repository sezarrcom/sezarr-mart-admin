'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const recentOrders = [
  {
    id: '#ORD-001',
    customer: 'Rajesh Kumar',
    product: 'Samsung Galaxy S24',
    amount: '₹45,999',
    status: 'delivered',
    date: '2025-09-12'
  },
  {
    id: '#ORD-002',
    customer: 'Priya Sharma',
    product: 'iPhone 15 Pro',
    amount: '₹89,999',
    status: 'shipped',
    date: '2025-09-11'
  },
  {
    id: '#ORD-003',
    customer: 'Amit Patel',
    product: 'OnePlus 12',
    amount: '₹54,999',
    status: 'processing',
    date: '2025-09-11'
  },
  {
    id: '#ORD-004',
    customer: 'Sneha Reddy',
    product: 'Nothing Phone 2',
    amount: '₹32,999',
    status: 'pending',
    date: '2025-09-10'
  },
  {
    id: '#ORD-005',
    customer: 'Vikram Singh',
    product: 'Realme GT 3',
    amount: '₹28,999',
    status: 'cancelled',
    date: '2025-09-10'
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'delivered':
      return 'bg-green-100 text-green-800'
    case 'shipped':
      return 'bg-blue-100 text-blue-800'
    case 'processing':
      return 'bg-yellow-100 text-yellow-800'
    case 'pending':
      return 'bg-gray-100 text-gray-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function RecentOrders() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Orders</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-sm">{order.id}</span>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{order.customer}</p>
                <p className="text-xs text-muted-foreground">{order.product}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="font-semibold">{order.amount}</p>
                <p className="text-xs text-muted-foreground">{order.date}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem>Edit Order</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    Cancel Order
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}