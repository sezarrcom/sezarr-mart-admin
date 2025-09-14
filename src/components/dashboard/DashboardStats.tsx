import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  MessageSquare,
  Info
} from 'lucide-react'

const mainStats = [
  {
    title: 'Customers',
    value: '1',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    info: 'Total registered customers'
  },
  {
    title: 'Orders',
    value: '0',
    icon: ShoppingCart,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    info: 'Total orders placed'
  },
  {
    title: 'SMS Credits',
    value: '996',
    icon: MessageSquare,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    info: 'Remaining SMS Credits',
    subtitle: 'Remaining SMS Credits'
  },
  {
    title: 'Sales - Day',
    value: '₹0.00',
    subtitle: 'Sep 14, 2025',
    icon: DollarSign,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    info: 'Today\'s total sales'
  }
]

const salesStats = [
  {
    title: 'Sales - Month',
    value: '₹0.00',
    subtitle: 'Sep, 2025',
    icon: DollarSign,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    title: 'Sales - Total',
    value: '₹0.00',
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  }
]

export default function DashboardStats() {
  return (
    <div className="space-y-6">
      {/* Main Stats - 4 Column Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mainStats.map((stat, index) => {
          const Icon = stat.icon
          
          return (
            <Card key={index} className="hover:shadow-lg transition-all duration-200 border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  {stat.subtitle && (
                    <p className="text-xs text-gray-500">{stat.subtitle}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Info className="h-3 w-3 text-gray-400" />
                  </Button>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                {stat.info && (
                  <p className="text-xs text-gray-500 mt-1">{stat.info}</p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Additional Sales Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {salesStats.map((stat, index) => {
          const Icon = stat.icon
          
          return (
            <Card key={index} className="hover:shadow-lg transition-all duration-200 border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  {stat.subtitle && (
                    <p className="text-xs text-gray-500">{stat.subtitle}</p>
                  )}
                </div>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}