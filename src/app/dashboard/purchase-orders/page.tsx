"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from "next-auth/react"
import { 
  Plus, Edit, Eye, Download, Search, Filter, Calendar, 
  ShoppingCart, Truck, CheckCircle, XCircle, Clock,
  Package, DollarSign, AlertTriangle, FileText, Send
} from "lucide-react"

interface PurchaseOrder {
  id: string
  orderNumber: string
  supplier: {
    id: string
    name: string
    company: string
    email: string
  }
  status: 'draft' | 'sent' | 'confirmed' | 'partial' | 'received' | 'cancelled'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  orderDate: string
  expectedDate: string
  receivedDate?: string
  items: PurchaseOrderItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  notes: string
  createdBy: string
  approvedBy?: string
  createdAt: string
  updatedAt: string
}

interface PurchaseOrderItem {
  id: string
  product: {
    id: string
    name: string
    sku: string
  }
  quantity: number
  unitPrice: number
  receivedQuantity: number
  total: number
}

export default function PurchaseOrdersPage() {
  const { data: session } = useSession()
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  // Mock data
  useEffect(() => {
    const mockPOs: PurchaseOrder[] = [
      {
        id: '1',
        orderNumber: 'PO-2024-001',
        supplier: {
          id: '1',
          name: 'John Smith',
          company: 'TechGlobal Suppliers Ltd.',
          email: 'john@techglobal.com'
        },
        status: 'confirmed',
        priority: 'normal',
        orderDate: '2024-12-10T10:00:00Z',
        expectedDate: '2024-12-20T10:00:00Z',
        items: [
          {
            id: '1',
            product: { id: '1', name: 'Wireless Headphones', sku: 'WH001' },
            quantity: 50,
            unitPrice: 75.00,
            receivedQuantity: 0,
            total: 3750.00
          },
          {
            id: '2',
            product: { id: '2', name: 'Gaming Mouse', sku: 'GM002' },
            quantity: 100,
            unitPrice: 35.00,
            receivedQuantity: 0,
            total: 3500.00
          }
        ],
        subtotal: 7250.00,
        tax: 725.00,
        shipping: 150.00,
        total: 8125.00,
        notes: 'Rush order for holiday season',
        createdBy: 'Admin',
        approvedBy: 'Manager',
        createdAt: '2024-12-10T09:00:00Z',
        updatedAt: '2024-12-10T11:00:00Z'
      },
      {
        id: '2',
        orderNumber: 'PO-2024-002',
        supplier: {
          id: '2',
          name: 'Sarah Johnson',
          company: 'Fashion Forward Inc.',
          email: 'sarah@fashionforward.com'
        },
        status: 'partial',
        priority: 'high',
        orderDate: '2024-12-08T10:00:00Z',
        expectedDate: '2024-12-18T10:00:00Z',
        receivedDate: '2024-12-15T14:30:00Z',
        items: [
          {
            id: '3',
            product: { id: '3', name: 'USB-C Cable', sku: 'UC003' },
            quantity: 200,
            unitPrice: 15.00,
            receivedQuantity: 150,
            total: 3000.00
          }
        ],
        subtotal: 3000.00,
        tax: 300.00,
        shipping: 75.00,
        total: 3375.00,
        notes: 'Partial delivery received',
        createdBy: 'Admin',
        createdAt: '2024-12-08T09:00:00Z',
        updatedAt: '2024-12-15T14:30:00Z'
      },
      {
        id: '3',
        orderNumber: 'PO-2024-003',
        supplier: {
          id: '3',
          name: 'Mike Chen',
          company: 'Global Parts Co.',
          email: 'mike@globalparts.com'
        },
        status: 'draft',
        priority: 'low',
        orderDate: '2024-12-13T10:00:00Z',
        expectedDate: '2024-12-28T10:00:00Z',
        items: [
          {
            id: '4',
            product: { id: '4', name: 'Phone Case', sku: 'PC004' },
            quantity: 300,
            unitPrice: 12.50,
            receivedQuantity: 0,
            total: 3750.00
          }
        ],
        subtotal: 3750.00,
        tax: 375.00,
        shipping: 100.00,
        total: 4225.00,
        notes: 'Draft order - pending approval',
        createdBy: 'Admin',
        createdAt: '2024-12-13T09:00:00Z',
        updatedAt: '2024-12-13T09:00:00Z'
      }
    ]

    setTimeout(() => {
      setPurchaseOrders(mockPOs)
      setLoading(false)
    }, 1000)
  }, [])

  // Filter purchase orders
  const filteredPOs = purchaseOrders.filter(po => {
    const matchesSearch = po.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         po.supplier.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         po.supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || po.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Calculate stats
  const stats = {
    total: purchaseOrders.length,
    draft: purchaseOrders.filter(po => po.status === 'draft').length,
    pending: purchaseOrders.filter(po => ['sent', 'confirmed'].includes(po.status)).length,
    received: purchaseOrders.filter(po => po.status === 'received').length,
    totalValue: purchaseOrders.reduce((sum, po) => sum + po.total, 0)
  }

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary'
      case 'sent': return 'default'
      case 'confirmed': return 'default'
      case 'partial': return 'secondary'
      case 'received': return 'default'
      case 'cancelled': return 'destructive'
      default: return 'secondary'
    }
  }

  // Priority color mapping
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'secondary'
      case 'normal': return 'default'
      case 'high': return 'destructive'
      case 'urgent': return 'destructive'
      default: return 'default'
    }
  }

  if (!session) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>Please sign in to access purchase order management.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Purchase Orders</h1>
          <p className="text-gray-600">Manage procurement and supplier orders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create PO
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Create Purchase Order</DialogTitle>
                <DialogDescription>
                  Create a new purchase order for supplier procurement
                </DialogDescription>
              </DialogHeader>
              <div className="text-center py-8 text-gray-500">
                <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">PO Creation Form</h3>
                <p className="text-sm">Full purchase order creation form would be implemented here</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Draft Orders</p>
                <p className="text-2xl font-bold">{stats.draft}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Received</p>
                <p className="text-2xl font-bold">{stats.received}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search purchase orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="partial">Partially Received</SelectItem>
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders ({filteredPOs.length})</CardTitle>
          <CardDescription>
            {loading ? "Loading purchase orders..." : `Manage supplier procurement orders`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : filteredPOs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">No purchase orders found</h3>
              <p className="text-sm text-gray-500 mb-4">
                {purchaseOrders.length === 0 ? "Create your first purchase order" : "Try adjusting your filters"}
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Purchase Order
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Expected Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPOs.map((po) => (
                  <TableRow key={po.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{po.orderNumber}</div>
                        <div className="text-sm text-gray-500">
                          By {po.createdBy}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{po.supplier.company}</div>
                        <div className="text-sm text-gray-500">{po.supplier.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(po.orderDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(po.expectedDate).toLocaleDateString()}
                        {new Date(po.expectedDate) < new Date() && po.status !== 'received' && (
                          <div className="text-red-500 text-xs flex items-center mt-1">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Overdue
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {po.items.length} items
                        {po.status === 'partial' && (
                          <div className="text-orange-600 text-xs">
                            {po.items.reduce((sum, item) => sum + item.receivedQuantity, 0)} / {po.items.reduce((sum, item) => sum + item.quantity, 0)} received
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">${po.total.toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPriorityColor(po.priority)}>
                        {po.priority.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(po.status)}>
                        {po.status === 'draft' && <FileText className="w-3 h-3 mr-1" />}
                        {po.status === 'sent' && <Send className="w-3 h-3 mr-1" />}
                        {po.status === 'confirmed' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {po.status === 'partial' && <Package className="w-3 h-3 mr-1" />}
                        {po.status === 'received' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {po.status === 'cancelled' && <XCircle className="w-3 h-3 mr-1" />}
                        {po.status.charAt(0).toUpperCase() + po.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedPO(po)
                            setIsViewDialogOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Purchase Order Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Purchase Order - {selectedPO?.orderNumber}</DialogTitle>
            <DialogDescription>
              Order details and item information
            </DialogDescription>
          </DialogHeader>
          
          {selectedPO && (
            <Tabs defaultValue="details" className="space-y-4">
              <TabsList>
                <TabsTrigger value="details">Order Details</TabsTrigger>
                <TabsTrigger value="items">Items ({selectedPO.items.length})</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Order Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Order Number:</strong> {selectedPO.orderNumber}</div>
                      <div><strong>Status:</strong> 
                        <Badge variant={getStatusColor(selectedPO.status)} className="ml-2">
                          {selectedPO.status.charAt(0).toUpperCase() + selectedPO.status.slice(1)}
                        </Badge>
                      </div>
                      <div><strong>Priority:</strong> 
                        <Badge variant={getPriorityColor(selectedPO.priority)} className="ml-2">
                          {selectedPO.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <div><strong>Order Date:</strong> {new Date(selectedPO.orderDate).toLocaleDateString()}</div>
                      <div><strong>Expected Date:</strong> {new Date(selectedPO.expectedDate).toLocaleDateString()}</div>
                      {selectedPO.receivedDate && (
                        <div><strong>Received Date:</strong> {new Date(selectedPO.receivedDate).toLocaleDateString()}</div>
                      )}
                      <div><strong>Created By:</strong> {selectedPO.createdBy}</div>
                      {selectedPO.approvedBy && (
                        <div><strong>Approved By:</strong> {selectedPO.approvedBy}</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Supplier Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Company:</strong> {selectedPO.supplier.company}</div>
                      <div><strong>Contact:</strong> {selectedPO.supplier.name}</div>
                      <div><strong>Email:</strong> {selectedPO.supplier.email}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Order Summary</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Subtotal:</span>
                      <span>${selectedPO.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Tax:</span>
                      <span>${selectedPO.tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Shipping:</span>
                      <span>${selectedPO.shipping.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-medium">
                      <span>Total:</span>
                      <span>${selectedPO.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {selectedPO.notes && (
                  <div>
                    <h4 className="font-medium mb-3">Notes</h4>
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {selectedPO.notes}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="items" className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Qty Ordered</TableHead>
                      <TableHead>Qty Received</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedPO.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.product.name}</TableCell>
                        <TableCell>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {item.product.sku}
                          </code>
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          <span className={item.receivedQuantity < item.quantity ? 'text-orange-600' : 'text-green-600'}>
                            {item.receivedQuantity}
                          </span>
                        </TableCell>
                        <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                        <TableCell>${item.total.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <div className="text-center py-8 text-gray-500">
                  <Clock className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Order History</h3>
                  <p className="text-sm">Order status changes and updates would appear here</p>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}