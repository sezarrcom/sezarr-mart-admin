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
  // Combine all stats for 2x3 grid layout
  const allStats = [...mainStats, ...salesStats]
  
  return (
    <div>
      {/* Stats Grid - 2 rows x 3 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {allStats.map((stat, index) => {
          const Icon = stat.icon
          
          return (
            <Card key={index} className="hover:shadow-md transition-all duration-200 border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-0">
                  <CardTitle className="text-xs font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  {stat.subtitle && (
                    <p className="text-xs text-gray-400 mt-0.5">{stat.subtitle}</p>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  {(stat as any).info && (
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0" title={(stat as any).info}>
                      <Info className="h-3 w-3 text-gray-400" />
                    </Button>
                  )}
                  <div className={`p-1.5 rounded ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 pb-3">
                <div className="text-lg font-bold text-gray-900">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}