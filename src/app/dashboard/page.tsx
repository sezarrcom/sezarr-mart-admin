import Link from 'next/link'
import DashboardLayout from '@/components/layout/DashboardLayout'
import DashboardStats from '@/components/dashboard/DashboardStats'
import RecentOrders from '@/components/dashboard/RecentOrders'
import SalesChart from '@/components/dashboard/SalesChart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Package, Plus, ShoppingCart, Users } from 'lucide-react'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Welcome to Sezarr Mart Ecommerce Admin Dashboard
          </p>
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
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <SalesChart />
          <RecentOrders />
        </div>
      </div>
    </DashboardLayout>
  )
}