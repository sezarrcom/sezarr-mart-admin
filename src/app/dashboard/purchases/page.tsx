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
import { useSession } from "next-auth/react"
import {
  Search, Filter, Download, Eye, Edit, Plus, Package, DollarSign,
  Calendar, Clock, CheckCircle, XCircle, AlertTriangle, Truck,
  FileText, Store, User, CreditCard, BarChart3, TrendingUp,
  RefreshCw, ArrowUpDown, ExternalLink
} from "lucide-react"

interface Purchase {
  id: string
  purchaseNumber: string
  supplierId: string
  supplierName: string
  supplierEmail: string
  purchaseDate: string
  expectedDeliveryDate?: string
  actualDeliveryDate?: string
  status: 'draft' | 'sent' | 'approved' | 'received' | 'partially_received' | 'cancelled'
  items: PurchaseItem[]
  subtotal: number
  taxAmount: number
  discountAmount: number
  shippingAmount: number
  totalAmount: number
  currency: string
  paymentStatus: 'pending' | 'partial' | 'paid' | 'overdue'
  paymentTerms: string
  notes?: string
  attachments?: string[]
  createdBy: string
  lastModifiedDate: string
  approvedBy?: string
  approvedDate?: string
  receivedBy?: string
  warehouse: {
    id: string
    name: string
    address: string
  }
}

interface PurchaseItem {
  id: string
  productId: string
  productName: string
  sku: string
  quantity: number
  unitPrice: number
  totalPrice: number
  receivedQuantity?: number
  description?: string
}

export default function PurchasesPage() {
  const { data: session } = useSession()
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [paymentFilter, setPaymentFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Form state for creating new purchase
  const [formData, setFormData] = useState({
    supplierId: "",
    expectedDeliveryDate: "",
    paymentTerms: "net_30",
    notes: "",
    warehouseId: "1"
  })

  useEffect(() => {
    fetchPurchases()
  }, [])

  const fetchPurchases = async () => {
    try {
      // Mock data for development
      const mockPurchases: Purchase[] = [
        {
          id: "1",
          purchaseNumber: "PO-2025-001",
          supplierId: "sup_001",
          supplierName: "Tech Components Ltd",
          supplierEmail: "orders@techcomponents.com",
          purchaseDate: "2025-01-15T10:30:00Z",
          expectedDeliveryDate: "2025-01-22T10:30:00Z",
          actualDeliveryDate: "2025-01-21T14:20:00Z",
          status: "received",
          items: [
            {
              id: "1",
              productId: "prod_1", 
              productName: "Wireless Headphones",
              sku: "WH-001",
              quantity: 50,
              unitPrice: 1500,
              totalPrice: 75000,
              receivedQuantity: 50,
              description: "Premium wireless headphones with noise cancellation"
            },
            {
              id: "2",
              productId: "prod_2",
              productName: "Smart Watches",
              sku: "SW-002", 
              quantity: 25,
              unitPrice: 8000,
              totalPrice: 200000,
              receivedQuantity: 25
            }
          ],
          subtotal: 275000,
          taxAmount: 49500,
          discountAmount: 5000,
          shippingAmount: 2000,
          totalAmount: 321500,
          currency: "INR",
          paymentStatus: "paid",
          paymentTerms: "net_30",
          notes: "Rush order for premium products",
          createdBy: "admin@sezarr.com",
          lastModifiedDate: "2025-01-21T14:20:00Z",
          approvedBy: "manager@sezarr.com",
          approvedDate: "2025-01-15T11:45:00Z",
          receivedBy: "warehouse@sezarr.com",
          warehouse: {
            id: "1",
            name: "Main Warehouse",
            address: "123 Industrial Area, Mumbai"
          }
        },
        {
          id: "2",
          purchaseNumber: "PO-2025-002",
          supplierId: "sup_002",
          supplierName: "Fashion World Suppliers",
          supplierEmail: "procurement@fashionworld.com",
          purchaseDate: "2025-01-18T09:15:00Z",
          expectedDeliveryDate: "2025-01-25T09:15:00Z",
          status: "approved",
          items: [
            {
              id: "3",
              productId: "prod_3",
              productName: "Cotton T-Shirts",
              sku: "CT-001",
              quantity: 100,
              unitPrice: 300,
              totalPrice: 30000
            },
            {
              id: "4",
              productId: "prod_4",
              productName: "Leather Wallets",
              sku: "LW-001",
              quantity: 50,
              unitPrice: 800,
              totalPrice: 40000
            }
          ],
          subtotal: 70000,
          taxAmount: 12600,
          discountAmount: 1000,
          shippingAmount: 1500,
          totalAmount: 83100,
          currency: "INR",
          paymentStatus: "pending",
          paymentTerms: "net_15",
          createdBy: "admin@sezarr.com",
          lastModifiedDate: "2025-01-18T10:30:00Z",
          approvedBy: "manager@sezarr.com",
          approvedDate: "2025-01-18T10:30:00Z",
          warehouse: {
            id: "1", 
            name: "Main Warehouse",
            address: "123 Industrial Area, Mumbai"
          }
        },
        {
          id: "3",
          purchaseNumber: "PO-2025-003",
          supplierId: "sup_003",
          supplierName: "Home & Garden Co",
          supplierEmail: "sales@homegardenco.com",
          purchaseDate: "2025-01-19T14:00:00Z",
          expectedDeliveryDate: "2025-01-28T14:00:00Z",
          status: "sent",
          items: [
            {
              id: "5",
              productId: "prod_5",
              productName: "Plant Pots Set",
              sku: "PP-001",
              quantity: 75,
              unitPrice: 450,
              totalPrice: 33750
            }
          ],
          subtotal: 33750,
          taxAmount: 6075,
          discountAmount: 0,
          shippingAmount: 800,
          totalAmount: 40625,
          currency: "INR",
          paymentStatus: "pending",
          paymentTerms: "net_30",
          createdBy: "admin@sezarr.com",
          lastModifiedDate: "2025-01-19T14:00:00Z",
          warehouse: {
            id: "2",
            name: "Secondary Warehouse", 
            address: "456 Commerce Street, Delhi"
          }
        }
      ]

      setPurchases(mockPurchases)
    } catch (error) {
      console.error("Error fetching purchases:", error)
    } finally {
      setLoading(false)
    }
  }

  // Handler functions for purchase actions
  const handleEditPurchase = (purchase: Purchase) => {
    console.log('Edit purchase:', purchase)
    // Open edit dialog or navigate to edit page
  }

  const handleExportPurchases = () => {
    console.log('Exporting purchases report...')
    // Export purchases data to CSV/PDF
  }

  // Filter purchases
  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = purchase.purchaseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || purchase.status === statusFilter
    const matchesPayment = paymentFilter === "all" || purchase.paymentStatus === paymentFilter
    return matchesSearch && matchesStatus && matchesPayment
  })

  const getStatusBadge = (status: string) => {
    const variants = {
      'draft': 'secondary',
      'sent': 'outline', 
      'approved': 'default',
      'received': 'default',
      'partially_received': 'secondary',
      'cancelled': 'destructive'
    }
    return variants[status as keyof typeof variants] || 'secondary'
  }

  const getPaymentBadge = (status: string) => {
    const variants = {
      'pending': 'secondary',
      'partial': 'outline',
      'paid': 'default', 
      'overdue': 'destructive'
    }
    return variants[status as keyof typeof variants] || 'secondary'
  }

  const getTotalStats = () => {
    return purchases.reduce((acc, purchase) => ({
      totalPurchases: acc.totalPurchases + 1,
      totalValue: acc.totalValue + purchase.totalAmount,
      pendingApproval: acc.pendingApproval + (purchase.status === 'sent' ? 1 : 0),
      pendingDelivery: acc.pendingDelivery + (['approved', 'sent'].includes(purchase.status) ? 1 : 0)
    }), { totalPurchases: 0, totalValue: 0, pendingApproval: 0, pendingDelivery: 0 })
  }

  const stats = getTotalStats()

  if (!session) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>Please sign in to access purchases management.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Purchases</h1>
          <p className="text-muted-foreground text-lg">Manage purchase orders and supplier relationships</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExportPurchases}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shrink-0">
                <Plus className="mr-2 h-4 w-4" />
                Create Purchase Order
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Purchase Order</DialogTitle>
                <DialogDescription>Create a new purchase order for suppliers</DialogDescription>
              </DialogHeader>
              {/* Form content would go here */}
              <div className="text-center py-4 text-muted-foreground">
                Purchase order creation form would be implemented here
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPurchases}</div>
            <p className="text-xs text-muted-foreground">+3 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+15.2% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApproval}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Delivery</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingDelivery}</div>
            <p className="text-xs text-muted-foreground">Expected this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by PO number or supplier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchases Table */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders ({filteredPurchases.length})</CardTitle>
          <CardDescription>
            {loading ? "Loading purchases..." : `Showing ${filteredPurchases.length} of ${purchases.length} purchase orders`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading purchases...</div>
          ) : filteredPurchases.length === 0 ? (
            <div className="text-center py-8">No purchases found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Purchase Order</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Delivery</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPurchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{purchase.purchaseNumber}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(purchase.purchaseDate).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{purchase.supplierName}</div>
                        <div className="text-sm text-muted-foreground">{purchase.supplierEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{purchase.items.length} items</div>
                        <div className="text-sm text-muted-foreground">
                          {purchase.items.reduce((sum, item) => sum + item.quantity, 0)} units
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">₹{purchase.totalAmount.toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadge(purchase.status) as any}>
                        {purchase.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPaymentBadge(purchase.paymentStatus) as any}>
                        {purchase.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {purchase.expectedDeliveryDate ? 
                          new Date(purchase.expectedDeliveryDate).toLocaleDateString() : 
                          'TBD'
                        }
                      </div>
                      {purchase.actualDeliveryDate && (
                        <div className="text-xs text-green-600">
                          Delivered: {new Date(purchase.actualDeliveryDate).toLocaleDateString()}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditPurchase(purchase)}
                          title="Edit Purchase"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Download PDF"
                        >
                          <FileText className="h-4 w-4" />
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
    </div>
  )
}