'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const recentCustomers = [
  {
    id: 1,
    name: 'Mirza Seraj Baig',
    mobile: '+91 9798191810',
    email: 'msbaig1984@gmail.com',
    status: 'Active',
    orders: 0,
    createdDate: 'Jul 27, 2025 8:55 AM'
  }
]

export default function RecentOrders() {
  return (
    <div className="space-y-6">
      {/* Recent Orders Table */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">#</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Mobile</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Payment Method</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Order Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Date & Time</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-500">
                    No data available
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Rows per page:</span>
              <select className="border border-gray-200 rounded px-2 py-1 text-sm">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-600">-</span>
              <Button variant="ghost" size="sm" disabled>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Customers Table */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold">Recent Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">#</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Mobile</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Orders</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Created Date</th>
                </tr>
              </thead>
              <tbody>
                {recentCustomers.map((customer, index) => (
                  <tr key={customer.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">{customer.id}.</td>
                    <td className="py-3 px-4">
                      <span className="text-blue-600 hover:text-blue-800 cursor-pointer text-sm font-medium">
                        {customer.name}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{customer.mobile}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{customer.email}</td>
                    <td className="py-3 px-4">
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        {customer.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{customer.orders}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{customer.createdDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Rows per page:</span>
              <select className="border border-gray-200 rounded px-2 py-1 text-sm">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">1-1 of 1</span>
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" disabled>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" disabled>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}