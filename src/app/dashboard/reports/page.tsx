'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useSession } from "next-auth/react"
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package,
  Calendar, Download, FileText, Eye, Filter, RefreshCw, ArrowUp, ArrowDown,
  Star, Target, Activity, Percent, Clock, MapPin, Phone, Mail, Award,
  Truck, CreditCard, AlertCircle, CheckCircle, XCircle, BarChart3
} from "lucide-react"

interface SalesData {
  date: string
  revenue: number
  orders: number
  customers: number
  avgOrderValue: number
}

interface ProductPerformance {
  id: string
  name: string
  category: string
  revenue: number
  orders: number
  stock: number
  rating: number
  trend: 'up' | 'down' | 'stable'
}

interface CustomerAnalytics {
  newCustomers: number
  repeatCustomers: number
  totalCustomers: number
  lifetimeValue: number
  churnRate: number
  acquisitionCost: number
}

interface VendorPerformance {
  id: string
  name: string
  revenue: number
  orders: number
  commission: number
  rating: number
  status: 'active' | 'inactive'
}

interface TaxReport {
  period: string
  sgst: number
  cgst: number
  igst: number
  vat: number
  total: number
}

interface InventoryReport {
  productId: string
  productName: string
  category: string
  currentStock: number
  reorderLevel: number
  aging: number
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'overstock'
}

interface RefundReport {
  orderId: string
  customerName: string
  amount: number
  reason: string
  status: 'pending' | 'approved' | 'rejected' | 'processed'
  date: string
}

export default function ReportsPage() {
  const { data: session } = useSession()
  const [selectedDateRange, setSelectedDateRange] = useState("7days")
  const [selectedReportType, setSelectedReportType] = useState("sales")
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [productPerformance, setProductPerformance] = useState<ProductPerformance[]>([])
  const [customerAnalytics, setCustomerAnalytics] = useState<CustomerAnalytics>({
    newCustomers: 0,
    repeatCustomers: 0,
    totalCustomers: 0,
    lifetimeValue: 0,
    churnRate: 0,
    acquisitionCost: 0
  })
  const [vendorPerformance, setVendorPerformance] = useState<VendorPerformance[]>([])
  const [taxReports, setTaxReports] = useState<TaxReport[]>([])
  const [inventoryReports, setInventoryReports] = useState<InventoryReport[]>([])
  const [refundReports, setRefundReports] = useState<RefundReport[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Mock data
  const mockSalesData: SalesData[] = [
    { date: '2024-01-15', revenue: 12500, orders: 45, customers: 32, avgOrderValue: 277.78 },
    { date: '2024-01-16', revenue: 15800, orders: 52, customers: 41, avgOrderValue: 303.85 },
    { date: '2024-01-17', revenue: 18200, orders: 58, customers: 45, avgOrderValue: 313.79 },
    { date: '2024-01-18', revenue: 16500, orders: 49, customers: 38, avgOrderValue: 336.73 },
    { date: '2024-01-19', revenue: 21300, orders: 67, customers: 52, avgOrderValue: 317.91 },
    { date: '2024-01-20', revenue: 19800, orders: 61, customers: 48, avgOrderValue: 324.59 },
    { date: '2024-01-21', revenue: 22400, orders: 71, customers: 55, avgOrderValue: 315.49 }
  ]

  const mockProductPerformance: ProductPerformance[] = [
    {
      id: "1",
      name: "Wireless Bluetooth Headphones",
      category: "Electronics",
      revenue: 45680,
      orders: 234,
      stock: 45,
      rating: 4.5,
      trend: 'up'
    },
    {
      id: "2",
      name: "Smart Fitness Watch",
      category: "Wearables",
      revenue: 32450,
      orders: 156,
      stock: 23,
      rating: 4.2,
      trend: 'up'
    },
    {
      id: "3",
      name: "Gaming Mechanical Keyboard",
      category: "Gaming",
      revenue: 28900,
      orders: 89,
      stock: 67,
      rating: 4.7,
      trend: 'stable'
    }
  ]

  const mockVendorPerformance: VendorPerformance[] = [
    {
      id: "1",
      name: "TechSupply Co",
      revenue: 125000,
      orders: 450,
      commission: 8750,
      rating: 4.6,
      status: 'active'
    },
    {
      id: "2",
      name: "ElectroHub",
      revenue: 89500,
      orders: 320,
      commission: 6265,
      rating: 4.2,
      status: 'active'
    }
  ]

  const mockTaxReports: TaxReport[] = [
    {
      period: "January 2024",
      sgst: 12500,
      cgst: 12500,
      igst: 8900,
      vat: 5600,
      total: 39500
    },
    {
      period: "February 2024",
      sgst: 15600,
      cgst: 15600,
      igst: 10200,
      vat: 6800,
      total: 48200
    }
  ]

  const mockInventoryReports: InventoryReport[] = [
    {
      productId: "P001",
      productName: "Wireless Headphones",
      category: "Electronics",
      currentStock: 45,
      reorderLevel: 20,
      aging: 15,
      status: 'in_stock'
    },
    {
      productId: "P002",
      productName: "Smart Watch",
      category: "Wearables",
      currentStock: 8,
      reorderLevel: 15,
      aging: 25,
      status: 'low_stock'
    },
    {
      productId: "P003",
      productName: "Bluetooth Speaker",
      category: "Audio",
      currentStock: 0,
      reorderLevel: 10,
      aging: 45,
      status: 'out_of_stock'
    }
  ]

  const mockRefundReports: RefundReport[] = [
    {
      orderId: "ORD-2024-001",
      customerName: "John Smith",
      amount: 299.99,
      reason: "Defective product",
      status: 'processed',
      date: "2024-01-20"
    },
    {
      orderId: "ORD-2024-002",
      customerName: "Sarah Johnson",
      amount: 159.95,
      reason: "Wrong size",
      status: 'pending',
      date: "2024-01-21"
    }
  ]

  useEffect(() => {
    setSalesData(mockSalesData)
    setProductPerformance(mockProductPerformance)
    setVendorPerformance(mockVendorPerformance)
    setTaxReports(mockTaxReports)
    setInventoryReports(mockInventoryReports)
    setRefundReports(mockRefundReports)
    setCustomerAnalytics({
      newCustomers: 245,
      repeatCustomers: 189,
      totalCustomers: 434,
      lifetimeValue: 1250.75,
      churnRate: 12.5,
      acquisitionCost: 45.30
    })
  }, [])

  const getStatusColor = (status: string) => {
    const colors = {
      in_stock: "bg-green-100 text-green-800",
      low_stock: "bg-yellow-100 text-yellow-800",
      out_of_stock: "bg-red-100 text-red-800",
      overstock: "bg-blue-100 text-blue-800",
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-blue-100 text-blue-800",
      rejected: "bg-red-100 text-red-800",
      processed: "bg-green-100 text-green-800",
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800"
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />
      default:
        return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  const exportReport = (format: 'pdf' | 'excel' | 'csv') => {
    setIsLoading(true)
    // Simulate export
    setTimeout(() => {
      setIsLoading(false)
      // In real implementation, this would trigger the actual export
      console.log(`Exporting ${selectedReportType} report as ${format}`)
    }, 2000)
  }

  const totalRevenue = salesData.reduce((sum, day) => sum + day.revenue, 0)
  const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0)
  const avgOrderValue = totalRevenue / totalOrders || 0

  const pieData = [
    { name: 'New Customers', value: customerAnalytics.newCustomers, fill: '#3B82F6' },
    { name: 'Repeat Customers', value: customerAnalytics.repeatCustomers, fill: '#10B981' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Reports</h1>
          <p className="text-gray-600">Comprehensive business insights and data analytics</p>
        </div>
        <div className="flex space-x-3">
          <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => exportReport('excel')}>
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button variant="outline" onClick={() => exportReport('pdf')}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <ArrowUp className="w-4 h-4 mr-1" />
                  +12.5% vs last period
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{totalOrders}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <ArrowUp className="w-4 h-4 mr-1" />
                  +8.3% vs last period
                </p>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <ArrowUp className="w-4 h-4 mr-1" />
                  +3.8% vs last period
                </p>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold">{customerAnalytics.totalCustomers}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <ArrowUp className="w-4 h-4 mr-1" />
                  +15.2% vs last period
                </p>
              </div>
              <Users className="w-8 h-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Daily revenue over the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Distribution</CardTitle>
            <CardDescription>New vs Repeat customers</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Reports Tabs */}
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="sales" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="vendors">Vendors</TabsTrigger>
              <TabsTrigger value="tax">Tax</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="refunds">Refunds</TabsTrigger>
            </TabsList>

            <TabsContent value="sales" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Sales Report</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => exportReport('csv')}>
                    <Download className="w-4 h-4 mr-2" />
                    CSV
                  </Button>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Customers</TableHead>
                    <TableHead>Avg Order Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesData.map((day, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(day.date).toLocaleDateString()}</TableCell>
                      <TableCell>${day.revenue.toLocaleString()}</TableCell>
                      <TableCell>{day.orders}</TableCell>
                      <TableCell>{day.customers}</TableCell>
                      <TableCell>${day.avgOrderValue.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="products" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Product Performance</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => exportReport('csv')}>
                    <Download className="w-4 h-4 mr-2" />
                    CSV
                  </Button>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productPerformance.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>${product.revenue.toLocaleString()}</TableCell>
                      <TableCell>{product.orders}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        {product.rating}
                      </TableCell>
                      <TableCell>{getTrendIcon(product.trend)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="vendors" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Vendor Performance</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => exportReport('csv')}>
                    <Download className="w-4 h-4 mr-2" />
                    CSV
                  </Button>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendorPerformance.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell className="font-medium">{vendor.name}</TableCell>
                      <TableCell>${vendor.revenue.toLocaleString()}</TableCell>
                      <TableCell>{vendor.orders}</TableCell>
                      <TableCell>${vendor.commission.toLocaleString()}</TableCell>
                      <TableCell className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        {vendor.rating}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(vendor.status)}>
                          {vendor.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="tax" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Tax Reports (SGST/CGST/VAT)</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => exportReport('csv')}>
                    <Download className="w-4 h-4 mr-2" />
                    CSV
                  </Button>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>SGST</TableHead>
                    <TableHead>CGST</TableHead>
                    <TableHead>IGST</TableHead>
                    <TableHead>VAT</TableHead>
                    <TableHead>Total Tax</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taxReports.map((report, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{report.period}</TableCell>
                      <TableCell>₹{report.sgst.toLocaleString()}</TableCell>
                      <TableCell>₹{report.cgst.toLocaleString()}</TableCell>
                      <TableCell>₹{report.igst.toLocaleString()}</TableCell>
                      <TableCell>₹{report.vat.toLocaleString()}</TableCell>
                      <TableCell className="font-semibold">₹{report.total.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="inventory" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Inventory Report (Stock Levels & Aging)</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => exportReport('csv')}>
                    <Download className="w-4 h-4 mr-2" />
                    CSV
                  </Button>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product ID</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Reorder Level</TableHead>
                    <TableHead>Aging (Days)</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryReports.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.productId}</TableCell>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.currentStock}</TableCell>
                      <TableCell>{item.reorderLevel}</TableCell>
                      <TableCell>{item.aging}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="refunds" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Refund/Return Reports</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => exportReport('csv')}>
                    <Download className="w-4 h-4 mr-2" />
                    CSV
                  </Button>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {refundReports.map((refund, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{refund.orderId}</TableCell>
                      <TableCell>{refund.customerName}</TableCell>
                      <TableCell>${refund.amount}</TableCell>
                      <TableCell>{refund.reason}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(refund.status)}>
                          {refund.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(refund.date).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}