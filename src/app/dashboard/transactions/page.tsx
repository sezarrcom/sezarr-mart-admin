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
  Search, Filter, Download, Eye, Edit, Plus, CreditCard, ArrowUpDown,
  TrendingUp, TrendingDown, DollarSign, Calendar, Clock, User,
  CheckCircle, XCircle, AlertTriangle, RefreshCw, ExternalLink,
  Receipt, Wallet, Building2, Smartphone, Globe, ArrowRight
} from "lucide-react"

interface Transaction {
  id: string
  orderId: string
  customerName: string
  customerEmail: string
  amount: number
  currency: string
  status: 'completed' | 'pending' | 'failed' | 'refunded' | 'cancelled'
  type: 'payment' | 'refund' | 'wallet_credit' | 'wallet_debit' | 'commission' | 'withdrawal'
  paymentMethod: {
    type: 'credit_card' | 'debit_card' | 'upi' | 'net_banking' | 'wallet' | 'cod' | 'emi'
    provider: string
    last4?: string
    brand?: string
  }
  gateway: {
    name: string
    transactionId: string
    processingFee: number
    gatewayFee: number
  }
  metadata: {
    description: string
    category: string
    tags: string[]
    referenceId?: string
  }
  timeline: {
    initiated: string
    processing?: string
    completed?: string
    failed?: string
  }
  reconciliation: {
    isReconciled: boolean
    reconciledAt?: string
    settlementDate?: string
    settlementAmount?: number
  }
  customerInfo: {
    userId: string
    location: string
    device: string
    ipAddress: string
  }
  createdDate: string
  updatedDate: string
}

export default function TransactionsPage() {
  const { data: session } = useSession()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [methodFilter, setMethodFilter] = useState<string>("all")
  const [dateRange, setDateRange] = useState<string>("30")
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false)

  useEffect(() => {
    fetchTransactions()
  }, [dateRange])

  const fetchTransactions = async () => {
    try {
      // Mock data for development
      const mockTransactions: Transaction[] = [
        {
          id: "1",
          orderId: "ORD-001",
          customerName: "Rajesh Kumar",
          customerEmail: "rajesh@example.com",
          amount: 2499.00,
          currency: "INR",
          status: "completed",
          type: "payment",
          paymentMethod: {
            type: "upi",
            provider: "PhonePe",
            last4: "9876"
          },
          gateway: {
            name: "Razorpay",
            transactionId: "pay_MjQxNDM2NzY5MDI0",
            processingFee: 49.98,
            gatewayFee: 24.99
          },
          metadata: {
            description: "Payment for Order #ORD-001",
            category: "Product Purchase",
            tags: ["electronics", "mobile"],
            referenceId: "REF-001-2025"
          },
          timeline: {
            initiated: "2025-01-19T10:30:00Z",
            processing: "2025-01-19T10:30:15Z",
            completed: "2025-01-19T10:30:45Z"
          },
          reconciliation: {
            isReconciled: true,
            reconciledAt: "2025-01-19T12:00:00Z",
            settlementDate: "2025-01-20T00:00:00Z",
            settlementAmount: 2424.03
          },
          customerInfo: {
            userId: "USR-001",
            location: "Mumbai, Maharashtra",
            device: "Mobile App - Android",
            ipAddress: "103.21.58.xxx"
          },
          createdDate: "2025-01-19T10:30:00Z",
          updatedDate: "2025-01-19T10:30:45Z"
        },
        {
          id: "2",
          orderId: "ORD-002",
          customerName: "Priya Sharma",
          customerEmail: "priya@example.com",
          amount: 1299.00,
          currency: "INR",
          status: "pending",
          type: "payment",
          paymentMethod: {
            type: "credit_card",
            provider: "Visa",
            last4: "4532",
            brand: "HDFC Bank"
          },
          gateway: {
            name: "Stripe",
            transactionId: "pi_3MtwBwLkdIwHu7ix28a3tqPa",
            processingFee: 31.18,
            gatewayFee: 12.99
          },
          metadata: {
            description: "Payment for Order #ORD-002",
            category: "Product Purchase",
            tags: ["fashion", "clothing"]
          },
          timeline: {
            initiated: "2025-01-19T14:45:00Z",
            processing: "2025-01-19T14:45:30Z"
          },
          reconciliation: {
            isReconciled: false
          },
          customerInfo: {
            userId: "USR-002",
            location: "Bangalore, Karnataka",
            device: "Desktop - Chrome",
            ipAddress: "106.51.75.xxx"
          },
          createdDate: "2025-01-19T14:45:00Z",
          updatedDate: "2025-01-19T14:45:30Z"
        },
        {
          id: "3",
          orderId: "ORD-003",
          customerName: "Amit Singh",
          customerEmail: "amit@example.com",
          amount: 750.00,
          currency: "INR",
          status: "failed",
          type: "payment",
          paymentMethod: {
            type: "net_banking",
            provider: "SBI Net Banking"
          },
          gateway: {
            name: "PayU",
            transactionId: "403993715525911192",
            processingFee: 0,
            gatewayFee: 0
          },
          metadata: {
            description: "Payment for Order #ORD-003",
            category: "Product Purchase",
            tags: ["books", "education"]
          },
          timeline: {
            initiated: "2025-01-19T16:20:00Z",
            processing: "2025-01-19T16:20:20Z",
            failed: "2025-01-19T16:22:15Z"
          },
          reconciliation: {
            isReconciled: false
          },
          customerInfo: {
            userId: "USR-003",
            location: "Delhi, Delhi",
            device: "Mobile App - iOS",
            ipAddress: "117.97.120.xxx"
          },
          createdDate: "2025-01-19T16:20:00Z",
          updatedDate: "2025-01-19T16:22:15Z"
        },
        {
          id: "4",
          orderId: "ORD-004",
          customerName: "Sunita Patel",
          customerEmail: "sunita@example.com",
          amount: 3500.00,
          currency: "INR",
          status: "refunded",
          type: "refund",
          paymentMethod: {
            type: "wallet",
            provider: "Sezarr Wallet"
          },
          gateway: {
            name: "Internal",
            transactionId: "REFUND-004-2025",
            processingFee: 0,
            gatewayFee: 0
          },
          metadata: {
            description: "Refund for Order #ORD-004",
            category: "Refund Processing",
            tags: ["refund", "customer_support"],
            referenceId: "ORIGINAL-TXN-004"
          },
          timeline: {
            initiated: "2025-01-18T09:15:00Z",
            processing: "2025-01-18T09:15:30Z",
            completed: "2025-01-18T09:16:00Z"
          },
          reconciliation: {
            isReconciled: true,
            reconciledAt: "2025-01-18T10:00:00Z"
          },
          customerInfo: {
            userId: "USR-004",
            location: "Pune, Maharashtra",
            device: "Mobile Web - Safari",
            ipAddress: "152.58.96.xxx"
          },
          createdDate: "2025-01-18T09:15:00Z",
          updatedDate: "2025-01-18T09:16:00Z"
        },
        {
          id: "5",
          orderId: "ORD-005",
          customerName: "Vikram Mehta",
          customerEmail: "vikram@example.com",
          amount: 899.00,
          currency: "INR",
          status: "completed",
          type: "payment",
          paymentMethod: {
            type: "cod",
            provider: "Cash on Delivery"
          },
          gateway: {
            name: "COD",
            transactionId: "COD-005-2025",
            processingFee: 0,
            gatewayFee: 25.00
          },
          metadata: {
            description: "COD Collection for Order #ORD-005",
            category: "COD Payment",
            tags: ["cod", "home_delivery"]
          },
          timeline: {
            initiated: "2025-01-17T11:30:00Z",
            processing: "2025-01-17T11:30:00Z",
            completed: "2025-01-17T15:45:00Z"
          },
          reconciliation: {
            isReconciled: true,
            reconciledAt: "2025-01-17T18:00:00Z",
            settlementDate: "2025-01-18T00:00:00Z",
            settlementAmount: 874.00
          },
          customerInfo: {
            userId: "USR-005",
            location: "Chennai, Tamil Nadu",
            device: "Mobile App - Android",
            ipAddress: "117.192.11.xxx"
          },
          createdDate: "2025-01-17T11:30:00Z",
          updatedDate: "2025-01-17T15:45:00Z"
        }
      ]

      setTransactions(mockTransactions)
    } catch (error) {
      console.error("Error fetching transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  // Handler function for export
  const handleExportTransactions = () => {
    console.log('Exporting transactions report...')
    // Export transactions data to CSV/PDF
  }

  const handleReconcile = () => {
    alert('Starting transaction reconciliation process...\n• Verifying payments\n• Checking discrepancies\n• Updating records')
  }

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.gateway.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter
    const matchesType = typeFilter === "all" || transaction.type === typeFilter
    const matchesMethod = methodFilter === "all" || transaction.paymentMethod.type === methodFilter
    
    return matchesSearch && matchesStatus && matchesType && matchesMethod
  })

  const getStatusBadge = (status: string) => {
    const variants = {
      'completed': 'default',
      'pending': 'secondary',
      'failed': 'destructive',
      'refunded': 'outline',
      'cancelled': 'secondary'
    }
    return variants[status as keyof typeof variants] || 'secondary'
  }

  const getTypeBadge = (type: string) => {
    const variants = {
      'payment': 'default',
      'refund': 'secondary',
      'wallet_credit': 'default',
      'wallet_debit': 'outline',
      'commission': 'secondary',
      'withdrawal': 'outline'
    }
    return variants[type as keyof typeof variants] || 'secondary'
  }

  const getMethodIcon = (type: string) => {
    const icons = {
      'credit_card': CreditCard,
      'debit_card': CreditCard,
      'upi': Smartphone,
      'net_banking': Building2,
      'wallet': Wallet,
      'cod': Receipt,
      'emi': CreditCard
    }
    return icons[type as keyof typeof icons] || CreditCard
  }

  const getTotalStats = () => {
    return transactions.reduce((acc, transaction) => {
      const amount = transaction.type === 'refund' ? -transaction.amount : transaction.amount
      return {
        totalTransactions: acc.totalTransactions + 1,
        totalVolume: acc.totalVolume + amount,
        completedTransactions: acc.completedTransactions + (transaction.status === 'completed' ? 1 : 0),
        pendingTransactions: acc.pendingTransactions + (transaction.status === 'pending' ? 1 : 0),
        failedTransactions: acc.failedTransactions + (transaction.status === 'failed' ? 1 : 0),
        totalFees: acc.totalFees + transaction.gateway.processingFee + transaction.gateway.gatewayFee
      }
    }, { 
      totalTransactions: 0, 
      totalVolume: 0, 
      completedTransactions: 0, 
      pendingTransactions: 0, 
      failedTransactions: 0,
      totalFees: 0
    })
  }

  const stats = getTotalStats()
  const successRate = stats.totalTransactions > 0 ? ((stats.completedTransactions / stats.totalTransactions) * 100).toFixed(1) : 0

  if (!session) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>Please sign in to access transaction management.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground text-lg">Monitor and manage payment transactions</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExportTransactions}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" onClick={handleReconcile}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reconcile
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(stats.totalVolume / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Net transaction volume</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Count</CardTitle>
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">All transactions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedTransactions} of {stats.totalTransactions}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingTransactions}</div>
            <p className="text-xs text-muted-foreground">Awaiting completion</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.failedTransactions}</div>
            <p className="text-xs text-muted-foreground">Failed payments</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalFees.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">Gateway + processing</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-full sm:w-[120px]">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="refund">Refund</SelectItem>
                  <SelectItem value="wallet_credit">Wallet Credit</SelectItem>
                  <SelectItem value="wallet_debit">Wallet Debit</SelectItem>
                  <SelectItem value="commission">Commission</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="debit_card">Debit Card</SelectItem>
                  <SelectItem value="net_banking">Net Banking</SelectItem>
                  <SelectItem value="wallet">Wallet</SelectItem>
                  <SelectItem value="cod">Cash on Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History ({filteredTransactions.length})</CardTitle>
          <CardDescription>
            {loading ? "Loading transactions..." : `Showing ${filteredTransactions.length} of ${transactions.length} transactions`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading transactions...</div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-8">No transactions found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Gateway</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => {
                  const MethodIcon = getMethodIcon(transaction.paymentMethod.type)
                  return (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{transaction.gateway.transactionId}</div>
                          <div className="text-sm text-muted-foreground">
                            Order: {transaction.orderId}
                          </div>
                          <Badge variant={getTypeBadge(transaction.type) as any} className="text-xs">
                            {transaction.type.replace('_', ' ')}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{transaction.customerName}</div>
                          <div className="text-sm text-muted-foreground">
                            {transaction.customerEmail}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {transaction.customerInfo.device}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className={`font-medium ${transaction.type === 'refund' ? 'text-red-600' : 'text-green-600'}`}>
                            {transaction.type === 'refund' ? '-' : '+'}₹{transaction.amount.toLocaleString()}
                          </div>
                          {(transaction.gateway.processingFee > 0 || transaction.gateway.gatewayFee > 0) && (
                            <div className="text-xs text-muted-foreground">
                              Fee: ₹{(transaction.gateway.processingFee + transaction.gateway.gatewayFee).toFixed(2)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MethodIcon className="h-4 w-4" />
                          <div className="space-y-1">
                            <div className="text-sm font-medium">
                              {transaction.paymentMethod.provider}
                            </div>
                            {transaction.paymentMethod.last4 && (
                              <div className="text-xs text-muted-foreground">
                                ****{transaction.paymentMethod.last4}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {transaction.gateway.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadge(transaction.status) as any}>
                          {transaction.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            {new Date(transaction.createdDate).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(transaction.createdDate).toLocaleTimeString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedTransaction(transaction)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {transaction.status === 'completed' && transaction.type === 'payment' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedTransaction(transaction)
                                setIsRefundDialogOpen(true)
                              }}
                              title="Initiate Refund"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`#/receipts/${transaction.id}`, '_blank')}
                            title="View Receipt"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Transaction Details Dialog */}
      {selectedTransaction && !isRefundDialogOpen && (
        <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Transaction Details</DialogTitle>
              <DialogDescription>
                {selectedTransaction.gateway.transactionId} • {selectedTransaction.orderId}
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
                <TabsTrigger value="customer">Customer Info</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Transaction Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Amount</span>
                        <span className="font-medium">₹{selectedTransaction.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Gateway Fee</span>
                        <span className="text-sm">₹{selectedTransaction.gateway.gatewayFee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Processing Fee</span>
                        <span className="text-sm">₹{selectedTransaction.gateway.processingFee}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between">
                        <span className="text-sm font-medium">Net Amount</span>
                        <span className="font-medium">
                          ₹{(selectedTransaction.amount - selectedTransaction.gateway.gatewayFee - selectedTransaction.gateway.processingFee).toFixed(2)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Payment Method</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Type</span>
                        <span className="text-sm capitalize">
                          {selectedTransaction.paymentMethod.type.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Provider</span>
                        <span className="text-sm">{selectedTransaction.paymentMethod.provider}</span>
                      </div>
                      {selectedTransaction.paymentMethod.last4 && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Card Number</span>
                          <span className="text-sm">****{selectedTransaction.paymentMethod.last4}</span>
                        </div>
                      )}
                      {selectedTransaction.paymentMethod.brand && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Bank</span>
                          <span className="text-sm">{selectedTransaction.paymentMethod.brand}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Metadata</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Description: </span>
                      <span className="text-sm">{selectedTransaction.metadata.description}</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Category: </span>
                      <span className="text-sm">{selectedTransaction.metadata.category}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="text-sm text-muted-foreground">Tags: </span>
                      <div className="flex gap-1">
                        {selectedTransaction.metadata.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="timeline" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Transaction Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div>
                          <div className="font-medium">Transaction Initiated</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(selectedTransaction.timeline.initiated).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      {selectedTransaction.timeline.processing && (
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div>
                            <div className="font-medium">Processing Started</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(selectedTransaction.timeline.processing).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {selectedTransaction.timeline.completed && (
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <div>
                            <div className="font-medium">Transaction Completed</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(selectedTransaction.timeline.completed).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {selectedTransaction.timeline.failed && (
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div>
                            <div className="font-medium">Transaction Failed</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(selectedTransaction.timeline.failed).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reconciliation" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Reconciliation Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Reconciled</span>
                      <Badge variant={selectedTransaction.reconciliation.isReconciled ? "default" : "secondary"}>
                        {selectedTransaction.reconciliation.isReconciled ? "Yes" : "No"}
                      </Badge>
                    </div>
                    
                    {selectedTransaction.reconciliation.reconciledAt && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Reconciled At</span>
                        <span className="text-sm">
                          {new Date(selectedTransaction.reconciliation.reconciledAt).toLocaleString()}
                        </span>
                      </div>
                    )}
                    
                    {selectedTransaction.reconciliation.settlementDate && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Settlement Date</span>
                        <span className="text-sm">
                          {new Date(selectedTransaction.reconciliation.settlementDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    
                    {selectedTransaction.reconciliation.settlementAmount && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Settlement Amount</span>
                        <span className="text-sm font-medium">
                          ₹{selectedTransaction.reconciliation.settlementAmount}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="customer" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Customer ID</span>
                      <span className="text-sm">{selectedTransaction.customerInfo.userId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Location</span>
                      <span className="text-sm">{selectedTransaction.customerInfo.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Device</span>
                      <span className="text-sm">{selectedTransaction.customerInfo.device}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">IP Address</span>
                      <span className="text-sm">{selectedTransaction.customerInfo.ipAddress}</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}

      {/* Refund Dialog */}
      {isRefundDialogOpen && selectedTransaction && (
        <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Initiate Refund</DialogTitle>
              <DialogDescription>
                Refund for transaction {selectedTransaction.gateway.transactionId}
              </DialogDescription>
            </DialogHeader>
            <div className="text-center py-8 text-muted-foreground">
              Refund processing form would be implemented here
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}