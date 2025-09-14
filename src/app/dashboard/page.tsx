import Link from 'next/link'
import DashboardStats from '@/components/dashboard/DashboardStats'
import RecentOrders from '@/components/dashboard/RecentOrders'
import SalesChart from '@/components/dashboard/SalesChart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Package, Plus, ShoppingCart, Users, Maximize2, RotateCcw, Monitor } from 'lucide-react'

export default function DashboardPage() {
  // Get current time for personalized greeting
  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 17 ? 'Good Afternoon' : 'Good Evening'
  const userName = 'Admin User'
  
  return (
      <div className="space-y-8">
        {/* Enhanced Header with Personalized Greeting */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12 border-2 border-blue-200">
                <AvatarImage src="/avatar.png" alt={userName} />
                <AvatarFallback className="bg-blue-500 text-white font-semibold">AU</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Hello, {userName}!</h1>
                <p className="text-blue-600 font-medium">{greeting}! Have a great time!</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="hover:bg-blue-50">
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2">
                <Monitor className="h-4 w-4 mr-2" />
                POS
              </Button>
              <Button variant="outline" size="sm" className="hover:bg-blue-50">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <DashboardStats />
        
        {/* Quick Actions */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Quick Actions</CardTitle>
            <CardDescription>Common tasks to manage your store efficiently</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/dashboard/products">
                <Button variant="outline" className="h-24 w-full hover:shadow-md transition-all duration-200">
                  <div className="flex flex-col items-center gap-3">
                    <Package className="h-6 w-6" />
                    <span className="text-sm font-medium">Manage Products</span>
                  </div>
                </Button>
              </Link>
              <Link href="/dashboard/categories">
                <Button variant="outline" className="h-24 w-full hover:shadow-md transition-all duration-200">
                  <div className="flex flex-col items-center gap-3">
                    <Package className="h-6 w-6" />
                    <span className="text-sm font-medium">Manage Categories</span>
                  </div>
                </Button>
              </Link>
              <Link href="/dashboard/orders">
                <Button variant="outline" className="h-24 w-full hover:shadow-md transition-all duration-200">
                  <div className="flex flex-col items-center gap-3">
                    <ShoppingCart className="h-6 w-6" />
                    <span className="text-sm font-medium">View Orders</span>
                  </div>
                </Button>
              </Link>
              <Link href="/dashboard/customers">
                <Button variant="outline" className="h-24 w-full hover:shadow-md transition-all duration-200">
                  <div className="flex flex-col items-center gap-3">
                    <Users className="h-6 w-6" />
                    <span className="text-sm font-medium">Manage Customers</span>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <SalesChart />
        
        <RecentOrders />
      </div>
  )
}