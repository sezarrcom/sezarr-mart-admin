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
  Search, Filter, Download, Eye, Edit, Plus, Copy, ExternalLink,
  CreditCard, DollarSign, Link, QrCode, Share2, Calendar,
  Clock, CheckCircle, XCircle, AlertTriangle, Users, Package,
  Settings, Smartphone, Mail, MessageSquare, BarChart3, TrendingUp
} from "lucide-react"

interface PaymentLink {
  id: string
  title: string
  description?: string
  amount: number
  currency: string
  type: 'fixed' | 'flexible' | 'donation'
  minAmount?: number
  maxAmount?: number
  status: 'active' | 'inactive' | 'expired'
  url: string
  shortUrl: string
  qrCode: string
  validUntil?: string
  maxUsage?: number
  currentUsage: number
  collectShipping: boolean
  collectCustomerInfo: boolean
  successUrl?: string
  cancelUrl?: string
  webhookUrl?: string
  createdDate: string
  lastUsedDate?: string
  analytics: {
    totalViews: number
    totalClicks: number
    totalPayments: number
    totalAmount: number
    conversionRate: number
  }
  customFields?: Array<{
    id: string
    label: string
    type: 'text' | 'email' | 'phone' | 'number' | 'select'
    required: boolean
    options?: string[]
  }>
}

export default function PaymentLinksPage() {
  const { data: session } = useSession()
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<PaymentLink | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: 0,
    type: "fixed" as "fixed" | "flexible" | "donation",
    minAmount: 0,
    maxAmount: 0,
    validUntil: "",
    maxUsage: 0,
    collectShipping: false,
    collectCustomerInfo: true,
    successUrl: "",
    cancelUrl: ""
  })

  useEffect(() => {
    fetchPaymentLinks()
  }, [])

  const fetchPaymentLinks = async () => {
    try {
      // Mock data for development
      const mockLinks: PaymentLink[] = [
        {
          id: "1",
          title: "Product Purchase - Premium Plan",
          description: "Monthly subscription for premium features",
          amount: 2999,
          currency: "INR",
          type: "fixed",
          status: "active",
          url: "https://pay.sezarrmart.com/premium-plan",
          shortUrl: "https://pay.sm/p1",
          qrCode: "data:image/png;base64,qr-code-data",
          validUntil: "2025-12-31T23:59:59Z",
          maxUsage: 1000,
          currentUsage: 234,
          collectShipping: false,
          collectCustomerInfo: true,
          successUrl: "https://sezarrmart.com/success",
          createdDate: "2024-01-15T10:30:00Z",
          lastUsedDate: "2025-01-19T14:25:00Z",
          analytics: {
            totalViews: 1250,
            totalClicks: 456,
            totalPayments: 234,
            totalAmount: 701766,
            conversionRate: 51.3
          }
        },
        {
          id: "2", 
          title: "Event Registration - Tech Conference",
          description: "Early bird registration for annual tech conference",
          amount: 5999,
          currency: "INR",
          type: "fixed",
          status: "active",
          url: "https://pay.sezarrmart.com/tech-conference",
          shortUrl: "https://pay.sm/tc2025",
          qrCode: "data:image/png;base64,qr-code-data-2",
          validUntil: "2025-03-15T23:59:59Z",
          maxUsage: 500,
          currentUsage: 89,
          collectShipping: true,
          collectCustomerInfo: true,
          createdDate: "2024-12-01T09:00:00Z",
          lastUsedDate: "2025-01-18T16:40:00Z",
          analytics: {
            totalViews: 2100,
            totalClicks: 312,
            totalPayments: 89,
            totalAmount: 534011,
            conversionRate: 28.5
          }
        },
        {
          id: "3",
          title: "Donation - Charity Drive",
          description: "Support our community charity initiative",
          amount: 0,
          currency: "INR",
          type: "donation",
          minAmount: 100,
          maxAmount: 50000,
          status: "active",
          url: "https://pay.sezarrmart.com/charity-drive",
          shortUrl: "https://pay.sm/donate",
          qrCode: "data:image/png;base64,qr-code-data-3",
          currentUsage: 156,
          collectShipping: false,
          collectCustomerInfo: false,
          createdDate: "2024-11-20T12:00:00Z",
          lastUsedDate: "2025-01-19T11:15:00Z",
          analytics: {
            totalViews: 3400,
            totalClicks: 890,
            totalPayments: 156,
            totalAmount: 78900,
            conversionRate: 17.5
          }
        }
      ]

      setPaymentLinks(mockLinks)
    } catch (error) {
      console.error("Error fetching payment links:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filter links
  const filteredLinks = paymentLinks.filter(link => {
    const matchesSearch = link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || link.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Creating payment link:", formData)
    setIsCreateDialogOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      amount: 0,
      type: "fixed",
      minAmount: 0,
      maxAmount: 0,
      validUntil: "",
      maxUsage: 0,
      collectShipping: false,
      collectCustomerInfo: true,
      successUrl: "",
      cancelUrl: ""
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Show toast notification
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      'active': 'default',
      'inactive': 'secondary', 
      'expired': 'destructive'
    }
    return variants[status as keyof typeof variants] || 'default'
  }

  const getTotalStats = () => {
    return paymentLinks.reduce((acc, link) => ({
      totalLinks: acc.totalLinks + 1,
      activeLinks: acc.activeLinks + (link.status === 'active' ? 1 : 0),
      totalRevenue: acc.totalRevenue + link.analytics.totalAmount,
      totalPayments: acc.totalPayments + link.analytics.totalPayments
    }), { totalLinks: 0, activeLinks: 0, totalRevenue: 0, totalPayments: 0 })
  }

  const stats = getTotalStats()

  if (!session) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>Please sign in to access payment links management.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Payment Links</h1>
          <p className="text-muted-foreground text-lg">Create and manage payment links for products, services, and donations</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="shrink-0">
              <Plus className="mr-2 h-4 w-4" />
              Create Payment Link
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Payment Link</DialogTitle>
              <DialogDescription>
                Generate a secure payment link that you can share with customers
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2 space-y-2">
                  <Label htmlFor="title">Link Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Premium Subscription Payment"
                    required
                  />
                </div>
                
                <div className="sm:col-span-2 space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of what this payment is for"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Payment Type</Label>
                  <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="flexible">Flexible Amount</SelectItem>
                      <SelectItem value="donation">Donation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">
                    {formData.type === 'fixed' ? 'Amount (₹)' : 'Default Amount (₹)'}
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                    required={formData.type === 'fixed'}
                  />
                </div>

                {formData.type !== 'fixed' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="minAmount">Minimum Amount (₹)</Label>
                      <Input
                        id="minAmount"
                        type="number"
                        value={formData.minAmount}
                        onChange={(e) => setFormData({ ...formData, minAmount: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxAmount">Maximum Amount (₹)</Label>
                      <Input
                        id="maxAmount"
                        type="number"
                        value={formData.maxAmount}
                        onChange={(e) => setFormData({ ...formData, maxAmount: parseFloat(e.target.value) })}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="validUntil">Valid Until (Optional)</Label>
                  <Input
                    id="validUntil"
                    type="datetime-local"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxUsage">Max Usage (Optional)</Label>
                  <Input
                    id="maxUsage"
                    type="number"
                    value={formData.maxUsage || ''}
                    onChange={(e) => setFormData({ ...formData, maxUsage: parseInt(e.target.value) || 0 })}
                    placeholder="Leave empty for unlimited"
                  />
                </div>

                <div className="sm:col-span-2 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="collectShipping"
                      checked={formData.collectShipping}
                      onCheckedChange={(checked) => setFormData({ ...formData, collectShipping: checked })}
                    />
                    <Label htmlFor="collectShipping">Collect shipping address</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="collectCustomerInfo"
                      checked={formData.collectCustomerInfo}
                      onCheckedChange={(checked) => setFormData({ ...formData, collectCustomerInfo: checked })}
                    />
                    <Label htmlFor="collectCustomerInfo">Collect customer information</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="successUrl">Success URL (Optional)</Label>
                  <Input
                    id="successUrl"
                    type="url"
                    value={formData.successUrl}
                    onChange={(e) => setFormData({ ...formData, successUrl: e.target.value })}
                    placeholder="https://yoursite.com/success"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cancelUrl">Cancel URL (Optional)</Label>
                  <Input
                    id="cancelUrl"
                    type="url"
                    value={formData.cancelUrl}
                    onChange={(e) => setFormData({ ...formData, cancelUrl: e.target.value })}
                    placeholder="https://yoursite.com/cancel"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  Create Payment Link
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Links</CardTitle>
            <Link className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLinks}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Links</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeLinks}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.activeLinks / stats.totalLinks) * 100).toFixed(0)}% of total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPayments}</div>
            <p className="text-xs text-muted-foreground">+18.3% from last month</p>
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
                  placeholder="Search payment links..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Links Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Links ({filteredLinks.length})</CardTitle>
          <CardDescription>
            {loading ? "Loading payment links..." : `Showing ${filteredLinks.length} of ${paymentLinks.length} payment links`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading payment links...</div>
          ) : filteredLinks.length === 0 ? (
            <div className="text-center py-8">No payment links found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Link Details</TableHead>
                  <TableHead>Type & Amount</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLinks.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{link.title}</div>
                        <div className="text-sm text-muted-foreground">{link.description}</div>
                        <div className="text-xs text-muted-foreground">
                          Created: {new Date(link.createdDate).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant="outline" className="text-xs">
                          {link.type.charAt(0).toUpperCase() + link.type.slice(1)}
                        </Badge>
                        <div className="font-medium">
                          {link.type === 'donation' ? 
                            `₹${link.minAmount}-${link.maxAmount}` : 
                            `₹${link.amount}`
                          }
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          {link.currentUsage} {link.maxUsage ? `/ ${link.maxUsage}` : 'uses'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {link.validUntil ? `Expires: ${new Date(link.validUntil).toLocaleDateString()}` : 'No expiry'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">₹{link.analytics.totalAmount.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">
                          {link.analytics.totalPayments} payments
                        </div>
                        <div className="text-xs text-green-600">
                          {link.analytics.conversionRate.toFixed(1)}% conversion
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadge(link.status) as any}>
                        {link.status.charAt(0).toUpperCase() + link.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(link.shortUrl)}
                          title="Copy Link"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(link.url, '_blank')}
                          title="Open Link"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="View Analytics"
                        >
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Edit Link"
                        >
                          <Edit className="h-4 w-4" />
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