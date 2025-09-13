import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  Package,
  Truck,
  CreditCard,
  AlertCircle
} from 'lucide-react'

const stats = [
  {
    title: 'Total Revenue',
    value: '₹2,45,680',
    change: '+12.5%',
    changeType: 'positive' as const,
    icon: DollarSign,
    description: 'From last month'
  },
  {
    title: 'Total Orders',
    value: '1,247',
    change: '+8.2%',
    changeType: 'positive' as const,
    icon: ShoppingCart,
    description: 'Active orders'
  },
  {
    title: 'Total Customers',
    value: '3,842',
    change: '+15.3%',
    changeType: 'positive' as const,
    icon: Users,
    description: 'Registered users'
  },
  {
    title: 'Products',
    value: '1,284',
    change: '+2.1%',
    changeType: 'positive' as const,
    icon: Package,
    description: 'In inventory'
  },
  {
    title: 'Pending Deliveries',
    value: '89',
    change: '-5.4%',
    changeType: 'negative' as const,
    icon: Truck,
    description: 'Awaiting dispatch'
  },
  {
    title: 'Payment Links',
    value: '156',
    change: '+18.7%',
    changeType: 'positive' as const,
    icon: CreditCard,
    description: 'Active links'
  },
  {
    title: 'Low Stock Items',
    value: '23',
    change: '+4',
    changeType: 'warning' as const,
    icon: AlertCircle,
    description: 'Need restocking'
  },
  {
    title: 'Growth Rate',
    value: '24.8%',
    change: '+3.2%',
    changeType: 'positive' as const,
    icon: TrendingUp,
    description: 'Monthly growth'
  }
]

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                <Badge 
                  variant={
                    stat.changeType === 'positive' ? 'default' : 
                    stat.changeType === 'negative' ? 'destructive' : 'secondary'
                  }
                  className="text-xs"
                >
                  {stat.change}
                </Badge>
                <span>{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}