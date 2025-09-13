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
import { Switch } from "@/components/ui/switch"
import { useSession } from "next-auth/react"
import {
  Search, Filter, Download, Eye, Edit, Plus, CreditCard,
  DollarSign, Percent, CheckCircle, XCircle, Clock, AlertCircle,
  Settings, Shield, Globe, Key, Smartphone, Wallet, QrCode,
  FileText, Mail, Printer, Share2, Copy, ExternalLink, Zap,
  Building2, Users, TrendingUp, BarChart3, Activity, RefreshCw
} from "lucide-react"

interface PaymentGateway {
  id: string
  name: string
  type: 'razorpay' | 'stripe' | 'payu' | 'paypal' | 'phonepe' | 'googlepay'
  status: 'active' | 'inactive' | 'testing'
  isDefault: boolean
  apiCredentials: {
    publicKey?: string
    secretKey?: string
    webhookSecret?: string
    merchantId?: string
    environment: 'live' | 'sandbox'
  }
  configuration: PaymentGatewayConfig
  transactionFee: {
    type: 'percentage' | 'flat'
    value: number
    gstRate: number
  }
  supportedMethods: string[]
  lastSyncDate?: string
  totalTransactions: number
  totalAmount: number
  successRate: number
}

interface PaymentGatewayConfig {
  autoCapture: boolean
  maxAmount?: number
  minAmount?: number
  allowedCurrencies: string[]
  webhookUrl?: string
  returnUrl?: string
  failureUrl?: string
  customBranding: boolean
  saveCards: boolean
  emiOptions: boolean
}

interface PaymentLink {
  id: string
  title: string
  description: string
  amount: number
  type: 'fixed' | 'flexible'
  maxAmount?: number
  currency: string
  status: 'active' | 'inactive' | 'expired'
  createdBy: string
  createdDate: string
  expiryDate?: string
  shortUrl: string
  qrCode?: string
  customizations: {
    logo?: string
    theme: string
    showDescription: boolean
    collectCustomerInfo: boolean
    sendSMS: boolean
    sendEmail: boolean
  }
  analytics: {
    views: number
    payments: number
    totalAmount: number
    conversionRate: number
  }
}

interface Invoice {
  id: string
  number: string
  customerName: string
  customerEmail: string
  customerPhone: string
  amount: number
  taxAmount: number
  totalAmount: number
  currency: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  dueDate: string
  createdDate: string
  paidDate?: string
  items: InvoiceItem[]
  paymentLink?: string
  qrCode?: string
  notes?: string
}

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
  taxRate: number
}

interface WalletSettings {
  enabled: boolean
  cashbackEnabled: boolean
  cashbackRate: number
  maxCashback: number
  minTopupAmount: number
  maxTopupAmount: number
  autoDebitEnabled: boolean
  lowBalanceAlert: boolean
  lowBalanceThreshold: number
}

export default function PaymentsPage() {
  const { data: session } = useSession()
  const [paymentGateways, setPaymentGateways] = useState<PaymentGateway[]>([])
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [walletSettings, setWalletSettings] = useState<WalletSettings | null>(null)
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway | null>(null)
  const [selectedLink, setSelectedLink] = useState<PaymentLink | null>(null)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [showGatewayDialog, setShowGatewayDialog] = useState(false)
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("gateways")

  // Mock data
  const mockGateways: PaymentGateway[] = [
    {
      id: "1",
      name: "Razorpay",
      type: "razorpay",
      status: "active",
      isDefault: true,
      apiCredentials: {
        publicKey: "rzp_live_***************",
        secretKey: "***************",
        webhookSecret: "***************",
        environment: "live"
      },
      configuration: {
        autoCapture: true,
        maxAmount: 500000,
        minAmount: 100,
        allowedCurrencies: ["INR"],
        webhookUrl: "https://api.sezarrmart.com/webhooks/razorpay",
        customBranding: true,
        saveCards: true,
        emiOptions: true
      },
      transactionFee: {
        type: "percentage",
        value: 2.0,
        gstRate: 18
      },
      supportedMethods: ["card", "netbanking", "upi", "wallet", "emi"],
      lastSyncDate: "2024-01-20T10:30:00Z",
      totalTransactions: 15420,
      totalAmount: 25680000,
      successRate: 96.5
    },
    {
      id: "2",
      name: "Stripe",
      type: "stripe",
      status: "inactive",
      isDefault: false,
      apiCredentials: {
        publicKey: "pk_live_***************",
        secretKey: "sk_live_***************",
        webhookSecret: "whsec_***************",
        environment: "live"
      },
      configuration: {
        autoCapture: false,
        maxAmount: 1000000,
        minAmount: 50,
        allowedCurrencies: ["INR", "USD", "EUR"],
        customBranding: false,
        saveCards: true,
        emiOptions: false
      },
      transactionFee: {
        type: "percentage",
        value: 2.9,
        gstRate: 18
      },
      supportedMethods: ["card", "wallet"],
      totalTransactions: 2340,
      totalAmount: 4560000,
      successRate: 94.2
    },
    {
      id: "3",
      name: "PayU",
      type: "payu",
      status: "testing",
      isDefault: false,
      apiCredentials: {
        merchantId: "MERCHANT123",
        secretKey: "***************",
        environment: "sandbox"
      },
      configuration: {
        autoCapture: true,
        maxAmount: 300000,
        minAmount: 100,
        allowedCurrencies: ["INR"],
        customBranding: true,
        saveCards: false,
        emiOptions: true
      },
      transactionFee: {
        type: "percentage",
        value: 1.9,
        gstRate: 18
      },
      supportedMethods: ["card", "netbanking", "upi", "wallet"],
      totalTransactions: 0,
      totalAmount: 0,
      successRate: 0
    }
  ]

  const mockPaymentLinks: PaymentLink[] = [
    {
      id: "1",
      title: "Product Purchase - Electronics",
      description: "Payment for electronic items from Sezarr Mart",
      amount: 15000,
      type: "fixed",
      currency: "INR",
      status: "active",
      createdBy: "admin@sezarrmart.com",
      createdDate: "2024-01-15T10:00:00Z",
      expiryDate: "2024-02-15T10:00:00Z",
      shortUrl: "https://pay.sezarr.com/pl_abc123",
      qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
      customizations: {
        theme: "blue",
        showDescription: true,
        collectCustomerInfo: true,
        sendSMS: true,
        sendEmail: true
      },
      analytics: {
        views: 245,
        payments: 23,
        totalAmount: 345000,
        conversionRate: 9.4
      }
    },
    {
      id: "2",
      title: "Service Payment - Consultation",
      description: "Professional consultation service payment",
      amount: 0,
      type: "flexible",
      maxAmount: 50000,
      currency: "INR",
      status: "active",
      createdBy: "admin@sezarrmart.com",
      createdDate: "2024-01-10T14:30:00Z",
      shortUrl: "https://pay.sezarr.com/pl_def456",
      customizations: {
        theme: "green",
        showDescription: true,
        collectCustomerInfo: false,
        sendSMS: false,
        sendEmail: true
      },
      analytics: {
        views: 89,
        payments: 12,
        totalAmount: 156000,
        conversionRate: 13.5
      }
    }
  ]

  const mockInvoices: Invoice[] = [
    {
      id: "1",
      number: "INV-2024-001",
      customerName: "Rajesh Kumar",
      customerEmail: "rajesh@example.com",
      customerPhone: "+91 98765 43210",
      amount: 25000,
      taxAmount: 4500,
      totalAmount: 29500,
      currency: "INR",
      status: "paid",
      dueDate: "2024-01-25T23:59:59Z",
      createdDate: "2024-01-15T10:00:00Z",
      paidDate: "2024-01-18T15:30:00Z",
      items: [
        {
          id: "1",
          description: "Laptop - Dell Inspiron 15",
          quantity: 1,
          rate: 45000,
          amount: 45000,
          taxRate: 18
        }
      ],
      paymentLink: "https://pay.sezarr.com/inv_abc123",
      qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
      notes: "Payment for bulk order - corporate client"
    }
  ]

  const mockWalletSettings: WalletSettings = {
    enabled: true,
    cashbackEnabled: true,
    cashbackRate: 2.5,
    maxCashback: 500,
    minTopupAmount: 100,
    maxTopupAmount: 50000,
    autoDebitEnabled: false,
    lowBalanceAlert: true,
    lowBalanceThreshold: 100
  }

  useEffect(() => {
    setPaymentGateways(mockGateways)
    setPaymentLinks(mockPaymentLinks)
    setInvoices(mockInvoices)
    setWalletSettings(mockWalletSettings)
  }, [])

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      testing: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
      expired: "bg-orange-100 text-orange-800",
      draft: "bg-gray-100 text-gray-800",
      sent: "bg-blue-100 text-blue-800",
      overdue: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-800"
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getGatewayIcon = (type: string) => {
    const icons = {
      razorpay: <CreditCard className="w-5 h-5 text-blue-600" />,
      stripe: <CreditCard className="w-5 h-5 text-purple-600" />,
      payu: <CreditCard className="w-5 h-5 text-green-600" />,
      paypal: <CreditCard className="w-5 h-5 text-blue-500" />,
      phonepe: <Smartphone className="w-5 h-5 text-purple-500" />,
      googlepay: <Smartphone className="w-5 h-5 text-blue-500" />
    }
    return icons[type as keyof typeof icons] || <CreditCard className="w-5 h-5" />
  }

  const getPaymentStats = () => {
    const totalGateways = paymentGateways.length
    const activeGateways = paymentGateways.filter(g => g.status === 'active').length
    const totalTransactions = paymentGateways.reduce((sum, g) => sum + g.totalTransactions, 0)
    const totalRevenue = paymentGateways.reduce((sum, g) => sum + g.totalAmount, 0)
    const avgSuccessRate = paymentGateways.reduce((sum, g) => sum + g.successRate, 0) / totalGateways

    return {
      totalGateways,
      activeGateways,
      totalTransactions,
      totalRevenue,
      avgSuccessRate
    }
  }

  const stats = getPaymentStats()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Payment Management</h1>
          <p className="text-gray-600">Manage payment gateways, links, invoices, and wallet settings</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={() => setShowGatewayDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Gateway
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Gateways</p>
                <p className="text-2xl font-bold">{stats.totalGateways}</p>
              </div>
              <CreditCard className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Gateways</p>
                <p className="text-2xl font-bold">{stats.activeGateways}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold">{stats.totalTransactions.toLocaleString()}</p>
              </div>
              <Activity className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">₹{(stats.totalRevenue / 100000).toFixed(1)}L</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold">{stats.avgSuccessRate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="gateways">Payment Gateways</TabsTrigger>
          <TabsTrigger value="links">Payment Links</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="wallet">Wallet Settings</TabsTrigger>
          <TabsTrigger value="cod">COD Management</TabsTrigger>
        </TabsList>

        <TabsContent value="gateways" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Gateways</CardTitle>
              <CardDescription>Configure and manage payment gateway integrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentGateways.map((gateway) => (
                  <div key={gateway.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getGatewayIcon(gateway.type)}
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{gateway.name}</h3>
                            {gateway.isDefault && (
                              <Badge variant="outline">Default</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 capitalize">{gateway.type} • {gateway.apiCredentials.environment}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={getStatusColor(gateway.status)}>
                          {gateway.status}
                        </Badge>
                        <div className="text-right text-sm">
                          <div className="font-medium">₹{gateway.totalAmount.toLocaleString()}</div>
                          <div className="text-gray-500">{gateway.totalTransactions} transactions</div>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => setSelectedGateway(gateway)}>
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Success Rate:</span> {gateway.successRate}%
                      </div>
                      <div>
                        <span className="text-gray-500">Fee:</span> {gateway.transactionFee.value}%
                      </div>
                      <div>
                        <span className="text-gray-500">Methods:</span> {gateway.supportedMethods.length}
                      </div>
                      <div>
                        <span className="text-gray-500">Last Sync:</span> {gateway.lastSyncDate ? new Date(gateway.lastSyncDate).toLocaleDateString() : 'Never'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="links" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Payment Links</CardTitle>
                  <CardDescription>Create and manage payment links for easy collections</CardDescription>
                </div>
                <Button onClick={() => setShowLinkDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Link
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Views/Payments</TableHead>
                    <TableHead>Conversion</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentLinks.map((link) => (
                    <TableRow key={link.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{link.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{link.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {link.type === 'fixed' ? (
                          <span>₹{link.amount.toLocaleString()}</span>
                        ) : (
                          <span>Flexible (max ₹{link.maxAmount?.toLocaleString()})</span>
                        )}
                      </TableCell>
                      <TableCell className="capitalize">{link.type}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(link.status)}>
                          {link.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{link.analytics.views} views</div>
                          <div>{link.analytics.payments} payments</div>
                        </div>
                      </TableCell>
                      <TableCell>{link.analytics.conversionRate}%</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => setSelectedLink(link)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Invoices</CardTitle>
                  <CardDescription>Generate and manage invoices with QR codes</CardDescription>
                </div>
                <Button onClick={() => setShowInvoiceDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Invoice
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.number}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{invoice.customerName}</div>
                          <div className="text-sm text-gray-500">{invoice.customerEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>₹{invoice.totalAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => setSelectedInvoice(invoice)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Printer className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Mail className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <QrCode className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wallet" className="space-y-4">
          {walletSettings && (
            <Card>
              <CardHeader>
                <CardTitle>Wallet Configuration</CardTitle>
                <CardDescription>Configure wallet system and cashback settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="wallet-enabled">Enable Wallet System</Label>
                    <p className="text-sm text-gray-500">Allow customers to use wallet for payments</p>
                  </div>
                  <Switch
                    id="wallet-enabled"
                    checked={walletSettings.enabled}
                    onCheckedChange={(checked: boolean) => 
                      setWalletSettings({ ...walletSettings, enabled: checked })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="min-topup">Minimum Top-up Amount</Label>
                    <Input
                      id="min-topup"
                      type="number"
                      value={walletSettings.minTopupAmount}
                      onChange={(e) => 
                        setWalletSettings({ ...walletSettings, minTopupAmount: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="max-topup">Maximum Top-up Amount</Label>
                    <Input
                      id="max-topup"
                      type="number"
                      value={walletSettings.maxTopupAmount}
                      onChange={(e) => 
                        setWalletSettings({ ...walletSettings, maxTopupAmount: Number(e.target.value) })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="cashback-enabled">Enable Cashback</Label>
                      <p className="text-sm text-gray-500">Provide cashback on transactions</p>
                    </div>
                    <Switch
                      id="cashback-enabled"
                      checked={walletSettings.cashbackEnabled}
                      onCheckedChange={(checked: boolean) => 
                        setWalletSettings({ ...walletSettings, cashbackEnabled: checked })
                      }
                    />
                  </div>

                  {walletSettings.cashbackEnabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cashback-rate">Cashback Rate (%)</Label>
                        <Input
                          id="cashback-rate"
                          type="number"
                          step="0.1"
                          value={walletSettings.cashbackRate}
                          onChange={(e) => 
                            setWalletSettings({ ...walletSettings, cashbackRate: Number(e.target.value) })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="max-cashback">Maximum Cashback (₹)</Label>
                        <Input
                          id="max-cashback"
                          type="number"
                          value={walletSettings.maxCashback}
                          onChange={(e) => 
                            setWalletSettings({ ...walletSettings, maxCashback: Number(e.target.value) })
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="low-balance-alert">Low Balance Alerts</Label>
                    <p className="text-sm text-gray-500">Notify customers when wallet balance is low</p>
                  </div>
                  <Switch
                    id="low-balance-alert"
                    checked={walletSettings.lowBalanceAlert}
                    onCheckedChange={(checked: boolean) => 
                      setWalletSettings({ ...walletSettings, lowBalanceAlert: checked })
                    }
                  />
                </div>

                {walletSettings.lowBalanceAlert && (
                  <div>
                    <Label htmlFor="low-balance-threshold">Low Balance Threshold (₹)</Label>
                    <Input
                      id="low-balance-threshold"
                      type="number"
                      value={walletSettings.lowBalanceThreshold}
                      onChange={(e) => 
                        setWalletSettings({ ...walletSettings, lowBalanceThreshold: Number(e.target.value) })
                      }
                    />
                  </div>
                )}

                <div className="pt-4">
                  <Button className="w-full">
                    Save Wallet Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="cod" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cash on Delivery (COD) Settings</CardTitle>
              <CardDescription>Configure COD limits and restrictions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cod-limit">COD Amount Limit (₹)</Label>
                  <Input
                    id="cod-limit"
                    type="number"
                    placeholder="50000"
                    defaultValue="50000"
                  />
                </div>
                <div>
                  <Label htmlFor="cod-fee">COD Handling Fee (₹)</Label>
                  <Input
                    id="cod-fee"
                    type="number"
                    placeholder="50"
                    defaultValue="50"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable COD Verification</Label>
                    <p className="text-sm text-gray-500">Call customer before delivery for COD orders</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>COD Available for New Customers</Label>
                    <p className="text-sm text-gray-500">Allow COD for first-time customers</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>COD Blacklist Management</Label>
                    <p className="text-sm text-gray-500">Automatically blacklist customers who reject COD orders frequently</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div>
                <Label htmlFor="cod-rejection-limit">COD Rejection Limit</Label>
                <p className="text-sm text-gray-500 mb-2">Number of COD rejections before blacklisting</p>
                <Select defaultValue="3">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 rejections</SelectItem>
                    <SelectItem value="3">3 rejections</SelectItem>
                    <SelectItem value="5">5 rejections</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}