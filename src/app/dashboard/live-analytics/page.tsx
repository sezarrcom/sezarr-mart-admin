'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Clock,
  Activity,
  Eye,
  RefreshCw
} from 'lucide-react'

interface LiveMetric {
  label: string
  value: string | number
  change: string
  trend: 'up' | 'down' | 'stable'
  icon: any
}

interface ChartData {
  name: string
  value: number
  revenue?: number
  orders?: number
  visitors?: number
}

export default function LiveAnalyticsDashboard() {
  const [isLive, setIsLive] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [activeTab, setActiveTab] = useState('overview')

  // Mock real-time data
  const [liveMetrics, setLiveMetrics] = useState<LiveMetric[]>([
    {
      label: 'Revenue Today',
      value: '₹1,24,587',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign
    },
    {
      label: 'Orders Today',
      value: 287,
      change: '+8.3%',
      trend: 'up',
      icon: ShoppingCart
    },
    {
      label: 'Active Users',
      value: 1429,
      change: '+24.7%',
      trend: 'up',
      icon: Users
    },
    {
      label: 'Conversion Rate',
      value: '3.24%',
      change: '-0.5%',
      trend: 'down',
      icon: TrendingUp
    },
    {
      label: 'Avg Order Value',
      value: '₹434',
      change: '+5.2%',
      trend: 'up',
      icon: Package
    },
    {
      label: 'Page Views',
      value: '45.2K',
      change: '+18.9%',
      trend: 'up',
      icon: Eye
    }
  ])

  // Real-time sales data
  const salesData = [
    { time: '00:00', revenue: 12000, orders: 45 },
    { time: '04:00', revenue: 8500, orders: 32 },
    { time: '08:00', revenue: 25000, orders: 89 },
    { time: '12:00', revenue: 35000, orders: 124 },
    { time: '16:00', revenue: 28000, orders: 98 },
    { time: '20:00', revenue: 18000, orders: 67 },
    { time: '23:59', revenue: 15000, orders: 58 }
  ]

  // Traffic sources
  const trafficData = [
    { name: 'Direct', value: 4000, color: '#3B82F6' },
    { name: 'Google', value: 3000, color: '#10B981' },
    { name: 'Social Media', value: 2000, color: '#F59E0B' },
    { name: 'Email', value: 1500, color: '#EF4444' },
    { name: 'Referral', value: 1000, color: '#8B5CF6' }
  ]

  // Product performance
  const topProducts = [
    { name: 'Wireless Headphones', sales: 245, revenue: 612750, trend: 'up' },
    { name: 'Smart Watch Pro', sales: 189, revenue: 2456811, trend: 'up' },
    { name: 'Cotton T-Shirt', sales: 156, revenue: 93444, trend: 'down' },
    { name: 'Leather Wallet', sales: 134, revenue: 174066, trend: 'up' },
    { name: 'Wireless Mouse', sales: 98, revenue: 78302, trend: 'stable' }
  ]

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setLiveMetrics(prev => prev.map(metric => ({
        ...metric,
        value: typeof metric.value === 'number' 
          ? metric.value + Math.floor(Math.random() * 5) - 2
          : metric.value
      })))
      setLastUpdate(new Date())
    }, 3000) // Update every 3 seconds

    return () => clearInterval(interval)
  }, [isLive])

  const toggleLiveMode = () => {
    setIsLive(!isLive)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Live Analytics</h1>
          <p className="text-muted-foreground text-lg">
            Real-time business metrics and insights
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <Badge variant={isLive ? 'default' : 'secondary'} className="px-3 py-1">
            <div className={`w-2 h-2 rounded-full mr-2 ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            {isLive ? 'Live' : 'Paused'}
          </Badge>
          <Button variant="outline" size="sm" onClick={toggleLiveMode}>
            {isLive ? 'Pause' : 'Resume'} Updates
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Live Status */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-500" />
              <span className="text-muted-foreground">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </span>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span>Auto-refresh: {isLive ? 'ON' : 'OFF'}</span>
              <span>Update interval: 3s</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {liveMetrics.map((metric, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <div className="flex items-center gap-1">
                    {metric.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : metric.trend === 'down' ? (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    ) : (
                      <div className="h-4 w-4" />
                    )}
                    <span className={`text-sm font-medium ${
                      metric.trend === 'up' ? 'text-green-500' : 
                      metric.trend === 'down' ? 'text-red-500' : 
                      'text-muted-foreground'
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${
                  metric.trend === 'up' ? 'bg-green-50' : 
                  metric.trend === 'down' ? 'bg-red-50' : 
                  'bg-gray-50'
                }`}>
                  <metric.icon className={`h-6 w-6 ${
                    metric.trend === 'up' ? 'text-green-600' : 
                    metric.trend === 'down' ? 'text-red-600' : 
                    'text-gray-600'
                  }`} />
                </div>
              </div>
              {isLive && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Today</CardTitle>
                <CardDescription>Hourly revenue breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Orders Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Orders Today</CardTitle>
                <CardDescription>Hourly order volume</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#10B981" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales Performance</CardTitle>
              <CardDescription>Real-time sales metrics and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} />
                  <Line type="monotone" dataKey="orders" stroke="#10B981" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>Where your visitors are coming from</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={trafficData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {trafficData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>Best selling products today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {product.sales} sales • ₹{product.revenue.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {product.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : product.trend === 'down' ? (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      ) : (
                        <div className="h-4 w-4" />
                      )}
                      <Badge variant={
                        product.trend === 'up' ? 'default' :
                        product.trend === 'down' ? 'destructive' :
                        'secondary'
                      }>
                        {product.trend}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}