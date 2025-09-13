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
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useSession } from "next-auth/react"
import {
  Search, Filter, Download, Eye, Edit, Package,
  Truck, CreditCard, MessageSquare, Phone, Mail,
  Calendar, MapPin, DollarSign, Clock, CheckCircle,
  XCircle, AlertCircle, RefreshCw, Star, ShoppingBag
} from "lucide-react"

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'partial'
  shippingStatus: 'not_shipped' | 'processing' | 'shipped' | 'in_transit' | 'delivered' | 'returned'
  total: number
  subtotal: number
  tax: number
  shipping: number
  discount: number
  items: OrderItem[]
  shippingAddress: Address
  billingAddress: Address
  paymentMethod: string
  trackingNumber?: string
  createdAt: string
  updatedAt: string
  notes?: string
}

interface OrderItem {
  id: string
  productId: string
  productName: string
  productImage: string
  quantity: number
  price: number
  total: number
  variant?: string
}

interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  lastOrderDate: string
}

export default function OrdersPage() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [paymentFilter, setPaymentFilter] = useState<string>("all")
  const [dateRange, setDateRange] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [activeTab, setActiveTab] = useState("overview")
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [showEditOrder, setShowEditOrder] = useState(false)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [customerDetails, setCustomerDetails] = useState<Customer | null>(null)

  // Mock data
  const mockOrders: Order[] = [
    {
      id: "1",
      orderNumber: "ORD-2024-001",
      customerName: "John Smith",
      customerEmail: "john.smith@email.com",
      customerPhone: "+1 (555) 123-4567",
      status: "processing",
      paymentStatus: "paid",
      shippingStatus: "processing",
      total: 299.97,
      subtotal: 249.98,
      tax: 24.99,
      shipping: 24.99,
      discount: 0,
      items: [
        {
          id: "1",
          productId: "p1",
          productName: "Wireless Bluetooth Headphones",
          productImage: "/products/headphones.jpg",
          quantity: 2,
          price: 124.99,
          total: 249.98
        }
      ],
      shippingAddress: {
        street: "123 Main St, Apt 4B",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA"
      },
      billingAddress: {
        street: "123 Main St, Apt 4B",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA"
      },
      paymentMethod: "Credit Card ****1234",
      trackingNumber: "1Z999AA1234567890",
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T14:22:00Z",
      notes: "Customer requested expedited shipping"
    },
    {
      id: "2",
      orderNumber: "ORD-2024-002",
      customerName: "Sarah Johnson",
      customerEmail: "sarah.j@email.com",
      customerPhone: "+1 (555) 987-6543",
      status: "shipped",
      paymentStatus: "paid",
      shippingStatus: "in_transit",
      total: 189.95,
      subtotal: 159.96,
      tax: 15.99,
      shipping: 13.99,
      discount: 0,
      items: [
        {
          id: "2",
          productId: "p2",
          productName: "Smart Fitness Watch",
          productImage: "/products/watch.jpg",
          quantity: 1,
          price: 159.96,
          total: 159.96
        }
      ],
      shippingAddress: {
        street: "456 Oak Avenue",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        country: "USA"
      },
      billingAddress: {
        street: "456 Oak Avenue",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        country: "USA"
      },
      paymentMethod: "PayPal",
      trackingNumber: "1Z999BB9876543210",
      createdAt: "2024-01-14T09:15:00Z",
      updatedAt: "2024-01-16T11:45:00Z"
    },
    {
      id: "3",
      orderNumber: "ORD-2024-003",
      customerName: "Mike Davis",
      customerEmail: "mike.davis@company.com",
      customerPhone: "+1 (555) 456-7890",
      status: "delivered",
      paymentStatus: "paid",
      shippingStatus: "delivered",
      total: 449.92,
      subtotal: 399.96,
      tax: 39.96,
      shipping: 9.99,
      discount: 0,
      items: [
        {
          id: "3",
          productId: "p3",
          productName: "Gaming Mechanical Keyboard",
          productImage: "/products/keyboard.jpg",
          quantity: 2,
          price: 199.98,
          total: 399.96
        }
      ],
      shippingAddress: {
        street: "789 Tech Boulevard, Suite 200",
        city: "San Francisco",
        state: "CA",
        zipCode: "94105",
        country: "USA"
      },
      billingAddress: {
        street: "789 Tech Boulevard, Suite 200",
        city: "San Francisco",
        state: "CA",
        zipCode: "94105",
        country: "USA"
      },
      paymentMethod: "Credit Card ****5678",
      trackingNumber: "1Z999CC1122334455",
      createdAt: "2024-01-10T16:20:00Z",
      updatedAt: "2024-01-18T10:30:00Z"
    }
  ]

  useEffect(() => {
    setOrders(mockOrders)
  }, [])

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      returned: "bg-gray-100 text-gray-800"
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getPaymentStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800",
      partial: "bg-orange-100 text-orange-800"
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getShippingStatusColor = (status: string) => {
    const colors = {
      not_shipped: "bg-gray-100 text-gray-800",
      processing: "bg-yellow-100 text-yellow-800",
      shipped: "bg-blue-100 text-blue-800",
      in_transit: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      returned: "bg-red-100 text-red-800"
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id))
    }
  }

  const handleSelectOrder = (orderId: string) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId))
    } else {
      setSelectedOrders([...selectedOrders, orderId])
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter
    
    return matchesSearch && matchesStatus && matchesPayment
  })

  const handleOrderUpdate = (orderId: string, updates: Partial<Order>) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, ...updates } : order
    ))
  }

  const handleBulkStatusUpdate = (status: Order['status']) => {
    const updatedOrders = orders.map(order => 
      selectedOrders.includes(order.id) ? { ...order, status } : order
    )
    setOrders(updatedOrders)
    setSelectedOrders([])
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setShowOrderDetails(true)
    
    // Mock customer data
    const mockCustomer: Customer = {
      id: "1",
      name: order.customerName,
      email: order.customerEmail,
      phone: order.customerPhone,
      totalOrders: 12,
      totalSpent: 2847.50,
      averageOrderValue: 237.29,
      lastOrderDate: order.createdAt
    }
    setCustomerDetails(mockCustomer)
  }

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order)
    setShowEditOrder(true)
  }

  const handleExportOrders = () => {
    console.log('Exporting orders report...')
    // Export orders data to CSV/PDF
  }

  const getOrderStats = () => {
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
    const pendingOrders = orders.filter(order => order.status === 'pending').length
    const completedOrders = orders.filter(order => order.status === 'delivered').length
    
    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
      averageOrderValue: totalRevenue / totalOrders || 0
    }
  }

  const stats = getOrderStats()

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
          <p className="text-muted-foreground text-lg">Manage orders, track shipments, and handle customer requests</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="w-full sm:w-auto" onClick={handleExportOrders}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="w-full sm:w-auto">
            <Package className="w-4 h-4 mr-2" />
            Create Order
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Pending Orders</p>
                <p className="text-2xl font-bold">{stats.pendingOrders}</p>
              </div>
              <div className="p-2 bg-yellow-50 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
                <p className="text-2xl font-bold">${stats.averageOrderValue.toFixed(2)}</p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search orders..."
                  className="pl-10 h-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px] h-10">
                  <SelectValue placeholder="Order Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                </SelectContent>
              </Select>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedOrders.length} orders selected
              </span>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => handleBulkStatusUpdate('confirmed')}>
                  Mark as Confirmed
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkStatusUpdate('processing')}>
                  Mark as Processing
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkStatusUpdate('shipped')}>
                  Mark as Shipped
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedOrders([])}>
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Orders Table */}
      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedOrders.length === filteredOrders.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Shipping</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedOrders.includes(order.id)}
                      onCheckedChange={() => handleSelectOrder(order.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.orderNumber}</div>
                      <div className="text-sm text-gray-500">{order.items.length} items</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getShippingStatusColor(order.shippingStatus)}>
                      {order.shippingStatus.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost" onClick={() => handleViewOrder(order)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleEditOrder(order)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.orderNumber}</DialogTitle>
            <DialogDescription>
              Complete order information and management
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="items">Items</TabsTrigger>
                <TabsTrigger value="customer">Customer</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Order Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span>Order Status:</span>
                          <Badge className={getStatusColor(selectedOrder.status)}>
                            {selectedOrder.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Payment:</span>
                          <Badge className={getPaymentStatusColor(selectedOrder.paymentStatus)}>
                            {selectedOrder.paymentStatus}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Shipping:</span>
                          <Badge className={getShippingStatusColor(selectedOrder.shippingStatus)}>
                            {selectedOrder.shippingStatus.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>${selectedOrder.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax:</span>
                          <span>${selectedOrder.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping:</span>
                          <span>${selectedOrder.shipping.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold border-t pt-2">
                          <span>Total:</span>
                          <span>${selectedOrder.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Button className="w-full" size="sm">
                          <Package className="w-4 h-4 mr-2" />
                          Process Order
                        </Button>
                        <Button variant="outline" className="w-full" size="sm">
                          <Truck className="w-4 h-4 mr-2" />
                          Track Shipment
                        </Button>
                        <Button variant="outline" className="w-full" size="sm">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Contact Customer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="items" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gray-200 rounded"></div>
                                <div>
                                  <div className="font-medium">{item.productName}</div>
                                  {item.variant && (
                                    <div className="text-sm text-gray-500">{item.variant}</div>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>${item.price.toFixed(2)}</TableCell>
                            <TableCell>${item.total.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="customer" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Customer Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {customerDetails && (
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                            <div>
                              <div className="font-medium">{customerDetails.name}</div>
                              <div className="text-sm text-gray-500">{customerDetails.email}</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Total Orders:</span>
                              <div className="font-medium">{customerDetails.totalOrders}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Total Spent:</span>
                              <div className="font-medium">${customerDetails.totalSpent.toFixed(2)}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Avg Order Value:</span>
                              <div className="font-medium">${customerDetails.averageOrderValue.toFixed(2)}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Last Order:</span>
                              <div className="font-medium">{new Date(customerDetails.lastOrderDate).toLocaleDateString()}</div>
                            </div>
                          </div>
                          <div className="flex space-x-2 pt-3">
                            <Button size="sm" variant="outline">
                              <Phone className="w-4 h-4 mr-2" />
                              Call
                            </Button>
                            <Button size="sm" variant="outline">
                              <Mail className="w-4 h-4 mr-2" />
                              Email
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Addresses</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Shipping Address</h4>
                        <div className="text-sm text-gray-600">
                          <div>{selectedOrder.shippingAddress.street}</div>
                          <div>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</div>
                          <div>{selectedOrder.shippingAddress.country}</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Billing Address</h4>
                        <div className="text-sm text-gray-600">
                          <div>{selectedOrder.billingAddress.street}</div>
                          <div>{selectedOrder.billingAddress.city}, {selectedOrder.billingAddress.state} {selectedOrder.billingAddress.zipCode}</div>
                          <div>{selectedOrder.billingAddress.country}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="shipping" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="shippingStatus">Shipping Status</Label>
                        <Select value={selectedOrder.shippingStatus}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="not_shipped">Not Shipped</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="in_transit">In Transit</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="returned">Returned</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="trackingNumber">Tracking Number</Label>
                        <Input 
                          value={selectedOrder.trackingNumber || ''} 
                          placeholder="Enter tracking number"
                        />
                      </div>
                    </div>
                    {selectedOrder.trackingNumber && (
                      <div className="border rounded-lg p-4 bg-gray-50">
                        <h4 className="font-medium mb-2">Tracking Information</h4>
                        <div className="text-sm text-gray-600">
                          <div>Tracking Number: {selectedOrder.trackingNumber}</div>
                          <div>Status: {selectedOrder.shippingStatus.replace('_', ' ')}</div>
                          <div>Estimated Delivery: 2-3 business days</div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="timeline" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div>
                          <div className="font-medium">Order Placed</div>
                          <div className="text-sm text-gray-500">{new Date(selectedOrder.createdAt).toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div>
                          <div className="font-medium">Payment Confirmed</div>
                          <div className="text-sm text-gray-500">{new Date(selectedOrder.updatedAt).toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RefreshCw className="w-5 h-5 text-blue-500" />
                        <div>
                          <div className="font-medium">Processing</div>
                          <div className="text-sm text-gray-500">Order is being prepared for shipment</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <AlertCircle className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-400">Shipped</div>
                          <div className="text-sm text-gray-400">Pending</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}