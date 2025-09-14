"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from "next-auth/react"
import { 
  Package, AlertTriangle, TrendingUp, TrendingDown, Plus, Minus, 
  RefreshCw, Download, Upload, Search, Filter, Clock, BarChart3,
  Truck, CheckCircle, XCircle, AlertCircle
} from "lucide-react"

interface InventoryItem {
  id: string
  product: {
    id: string
    name: string
    sku: string
    category: string
  }
  currentStock: number
  minStock: number
  maxStock: number
  reservedStock: number
  availableStock: number
  incomingStock: number
  value: number
  lastUpdated: string
  movements: StockMovement[]
  status: 'ok' | 'low' | 'out' | 'overstocked'
}

interface StockMovement {
  id: string
  type: 'in' | 'out' | 'adjustment' | 'reserved' | 'unreserved'
  quantity: number
  reason: string
  reference?: string
  createdAt: string
  createdBy: string
}

interface StockAlert {
  id: string
  product: {
    name: string
    sku: string
  }
  type: 'low_stock' | 'out_of_stock' | 'overstock' | 'expiry'
  message: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  createdAt: string
  resolved: boolean
}

export default function InventoryManagementPage() {
  const { data: session } = useSession()
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [alerts, setAlerts] = useState<StockAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAdjustmentDialogOpen, setIsAdjustmentDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  
  // Stock adjustment form
  const [adjustmentForm, setAdjustmentForm] = useState({
    type: 'adjustment' as 'in' | 'out' | 'adjustment',
    quantity: 0,
    reason: '',
    reference: ''
  })

  // Mock data - in real app, fetch from API
  useEffect(() => {
    const mockInventory: InventoryItem[] = [
      {
        id: '1',
        product: { id: '1', name: 'Wireless Headphones', sku: 'WH001', category: 'Electronics' },
        currentStock: 15,
        minStock: 20,
        maxStock: 100,
        reservedStock: 5,
        availableStock: 10,
        incomingStock: 30,
        value: 1499.85,
        lastUpdated: new Date().toISOString(),
        status: 'low',
        movements: []
      },
      {
        id: '2',
        product: { id: '2', name: 'Gaming Mouse', sku: 'GM002', category: 'Electronics' },
        currentStock: 0,
        minStock: 15,
        maxStock: 80,
        reservedStock: 0,
        availableStock: 0,
        incomingStock: 50,
        value: 0,
        lastUpdated: new Date().toISOString(),
        status: 'out',
        movements: []
      },
      {
        id: '3',
        product: { id: '3', name: 'USB-C Cable', sku: 'UC003', category: 'Accessories' },
        currentStock: 150,
        minStock: 50,
        maxStock: 200,
        reservedStock: 10,
        availableStock: 140,
        incomingStock: 0,
        value: 2250,
        lastUpdated: new Date().toISOString(),
        status: 'ok',
        movements: []
      }
    ]

    const mockAlerts: StockAlert[] = [
      {
        id: '1',
        product: { name: 'Wireless Headphones', sku: 'WH001' },
        type: 'low_stock',
        message: 'Stock level below minimum threshold (15 < 20)',
        priority: 'medium',
        createdAt: new Date().toISOString(),
        resolved: false
      },
      {
        id: '2',
        product: { name: 'Gaming Mouse', sku: 'GM002' },
        type: 'out_of_stock',
        message: 'Product is completely out of stock',
        priority: 'critical',
        createdAt: new Date().toISOString(),
        resolved: false
      }
    ]

    setTimeout(() => {
      setInventory(mockInventory)
      setAlerts(mockAlerts)
      setLoading(false)
    }, 1000)
  }, [])

  // Filter inventory
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Handle stock adjustment
  const handleStockAdjustment = async () => {
    if (!selectedItem) return
    
    try {
      // In real app, make API call
      console.log('Stock adjustment:', {
        productId: selectedItem.id,
        ...adjustmentForm
      })
      
      // Update local state
      const updatedInventory = inventory.map(item => {
        if (item.id === selectedItem.id) {
          let newStock = item.currentStock
          
          if (adjustmentForm.type === 'in') {
            newStock += adjustmentForm.quantity
          } else if (adjustmentForm.type === 'out') {
            newStock -= adjustmentForm.quantity
          } else {
            newStock = adjustmentForm.quantity
          }
          
          return {
            ...item,
            currentStock: Math.max(0, newStock),
            availableStock: Math.max(0, newStock - item.reservedStock),
            lastUpdated: new Date().toISOString()
          }
        }
        return item
      })
      
      setInventory(updatedInventory)
      setIsAdjustmentDialogOpen(false)
      setAdjustmentForm({ type: 'adjustment', quantity: 0, reason: '', reference: '' })
    } catch (error) {
      console.error('Error adjusting stock:', error)
    }
  }

  // Calculate inventory stats
  const stats = {
    totalItems: inventory.length,
    lowStockItems: inventory.filter(item => item.status === 'low').length,
    outOfStockItems: inventory.filter(item => item.status === 'out').length,
    totalValue: inventory.reduce((sum, item) => sum + item.value, 0),
    activeAlerts: alerts.filter(alert => !alert.resolved).length
  }

  if (!session) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>Please sign in to access inventory management.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-gray-600">Track stock levels, movements, and alerts</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => alert("Exporting inventory data...")}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Inventory
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => alert("Syncing stock levels with suppliers...")}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync Stock
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold">{stats.totalItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold">{stats.lowStockItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold">{stats.outOfStockItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inventory Value</p>
                <p className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold">{stats.activeAlerts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventory Levels</TabsTrigger>
          <TabsTrigger value="alerts">Stock Alerts ({stats.activeAlerts})</TabsTrigger>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Inventory Levels Tab */}
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Current Inventory Levels</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="ok">In Stock</SelectItem>
                      <SelectItem value="low">Low Stock</SelectItem>
                      <SelectItem value="out">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading inventory...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Available</TableHead>
                      <TableHead>Reserved</TableHead>
                      <TableHead>Incoming</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.product.name}</div>
                            <div className="text-sm text-gray-500">
                              SKU: {item.product.sku} • {item.product.category}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.currentStock}</span>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  item.status === 'out' ? 'bg-red-500' :
                                  item.status === 'low' ? 'bg-orange-500' :
                                  'bg-green-500'
                                }`}
                                style={{
                                  width: `${Math.min(100, (item.currentStock / item.maxStock) * 100)}%`
                                }}
                              />
                            </div>
                            <span className="text-xs text-gray-500">
                              /{item.maxStock}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{item.availableStock}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-orange-600">{item.reservedStock}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-blue-600">{item.incomingStock}</span>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              item.status === 'out' ? 'destructive' :
                              item.status === 'low' ? 'secondary' :
                              'default'
                            }
                          >
                            {item.status === 'out' ? 'Out of Stock' :
                             item.status === 'low' ? 'Low Stock' :
                             'In Stock'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">${item.value.toLocaleString()}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedItem(item)
                                setIsAdjustmentDialogOpen(true)
                              }}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => alert(`Viewing transaction history for ${item.product.name}`)}
                            >
                              <Clock className="h-4 w-4" />
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
        </TabsContent>

        {/* Stock Alerts Tab */}
        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Stock Alerts</CardTitle>
              <CardDescription>Monitor and resolve inventory issues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div 
                    key={alert.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      alert.priority === 'critical' ? 'border-red-500 bg-red-50' :
                      alert.priority === 'high' ? 'border-orange-500 bg-orange-50' :
                      alert.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                      'border-blue-500 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                          alert.priority === 'critical' ? 'text-red-500' :
                          alert.priority === 'high' ? 'text-orange-500' :
                          alert.priority === 'medium' ? 'text-yellow-500' :
                          'text-blue-500'
                        }`} />
                        <div>
                          <h4 className="font-medium">
                            {alert.product.name} ({alert.product.sku})
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {alert.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(alert.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={
                          alert.priority === 'critical' ? 'destructive' :
                          alert.priority === 'high' ? 'destructive' :
                          'secondary'
                        }>
                          {alert.priority.toUpperCase()}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.alert(`Resolving alert: ${alert.type}`)}
                        >
                          Resolve
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {alerts.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No active alerts</h3>
                    <p className="text-sm">All inventory levels are within normal ranges</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stock Movements Tab */}
        <TabsContent value="movements">
          <Card>
            <CardHeader>
              <CardTitle>Recent Stock Movements</CardTitle>
              <CardDescription>Track all inventory changes and transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Truck className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">No recent movements</h3>
                <p className="text-sm">Stock movements will appear here as they occur</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Reports</CardTitle>
              <CardDescription>Generate detailed inventory analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="h-24"
                  onClick={() => alert("Generating stock levels report...")}
                >
                  <div className="text-center">
                    <BarChart3 className="mx-auto h-8 w-8 mb-2" />
                    <div className="font-medium">Stock Levels Report</div>
                    <div className="text-sm text-gray-500">Current inventory status</div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-24"
                  onClick={() => alert("Generating movement history report...")}
                >
                  <div className="text-center">
                    <TrendingUp className="mx-auto h-8 w-8 mb-2" />
                    <div className="font-medium">Movement History</div>
                    <div className="text-sm text-gray-500">Stock flow analysis</div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-24"
                  onClick={() => alert("Generating low stock report...")}
                >
                  <div className="text-center">
                    <AlertTriangle className="mx-auto h-8 w-8 mb-2" />
                    <div className="font-medium">Low Stock Report</div>
                    <div className="text-sm text-gray-500">Items needing restock</div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-24"
                  onClick={() => alert("Generating inventory valuation report...")}
                >
                  <div className="text-center">
                    <Package className="mx-auto h-8 w-8 mb-2" />
                    <div className="font-medium">Inventory Valuation</div>
                    <div className="text-sm text-gray-500">Asset value analysis</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Stock Adjustment Dialog */}
      <Dialog open={isAdjustmentDialogOpen} onOpenChange={setIsAdjustmentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Stock - {selectedItem?.product.name}</DialogTitle>
            <DialogDescription>
              Update inventory levels for {selectedItem?.product.sku}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Current Stock</Label>
                <div className="text-2xl font-bold">{selectedItem?.currentStock}</div>
              </div>
              <div>
                <Label>Available Stock</Label>
                <div className="text-2xl font-bold">{selectedItem?.availableStock}</div>
              </div>
            </div>

            <div>
              <Label htmlFor="adjustmentType">Adjustment Type</Label>
              <Select 
                value={adjustmentForm.type} 
                onValueChange={(value: 'in' | 'out' | 'adjustment') => 
                  setAdjustmentForm({ ...adjustmentForm, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in">Stock In (+)</SelectItem>
                  <SelectItem value="out">Stock Out (-)</SelectItem>
                  <SelectItem value="adjustment">Set Exact Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quantity">
                {adjustmentForm.type === 'adjustment' ? 'New Stock Level' : 'Quantity'}
              </Label>
              <Input
                id="quantity"
                type="number"
                value={adjustmentForm.quantity}
                onChange={(e) => setAdjustmentForm({ 
                  ...adjustmentForm, 
                  quantity: parseInt(e.target.value) || 0 
                })}
              />
            </div>

            <div>
              <Label htmlFor="reason">Reason *</Label>
              <Select 
                value={adjustmentForm.reason}
                onValueChange={(value) => setAdjustmentForm({ ...adjustmentForm, reason: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="restock">Restock/Purchase</SelectItem>
                  <SelectItem value="sale">Sale</SelectItem>
                  <SelectItem value="damaged">Damaged/Lost</SelectItem>
                  <SelectItem value="return">Customer Return</SelectItem>
                  <SelectItem value="correction">Stock Correction</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="reference">Reference (Optional)</Label>
              <Input
                id="reference"
                value={adjustmentForm.reference}
                onChange={(e) => setAdjustmentForm({ ...adjustmentForm, reference: e.target.value })}
                placeholder="PO number, receipt, etc."
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAdjustmentDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleStockAdjustment} disabled={!adjustmentForm.reason}>
                Apply Adjustment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}