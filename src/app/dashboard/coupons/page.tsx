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
  Search, Filter, Download, Eye, Edit, Plus, Percent, Tag,
  Calendar, Clock, Users, TrendingUp, TrendingDown, Copy,
  BarChart3, Activity, CheckCircle, XCircle, AlertTriangle,
  Target, ShoppingCart, Gift, Zap, Timer, Globe, MapPin,
  Star, Crown, Heart, Share, Code, Settings, Trash2
} from "lucide-react"

interface Coupon {
  id: string
  code: string
  title: string
  description: string
  type: 'percentage' | 'fixed_amount' | 'free_shipping' | 'buy_x_get_y' | 'cashback'
  status: 'draft' | 'active' | 'paused' | 'expired' | 'cancelled' | 'scheduled'
  discountValue: number
  minimumOrderValue?: number
  maximumDiscount?: number
  maxUsage?: number
  currentUsage: number
  usagePerCustomer?: number
  categories?: string[]
  products?: string[]
  excludeCategories?: string[]
  excludeProducts?: string[]
  customerSegments: string[]
  newCustomersOnly: boolean
  firstTimeOnly: boolean
  schedule: {
    startDate: string
    endDate?: string
    startTime: string
    endTime?: string
    timezone: string
    validDays?: number[]
    validHours?: string[]
  }
  conditions: {
    combinableWithOther: boolean
    stackable: boolean
    applicablePaymentMethods?: string[]
    minQuantity?: number
    maxQuantity?: number
    locations?: string[]
    deviceTypes?: string[]
  }
  performance: {
    totalUsage: number
    totalDiscount: number
    totalRevenue: number
    averageOrderValue: number
    conversionRate: number
    popularProducts: string[]
    topCustomers: string[]
  }
  marketing: {
    emailCampaignSent: boolean
    pushNotificationSent: boolean
    socialMediaPromoted: boolean
    affiliatePromoted: boolean
    influencerCodes: string[]
    qrCodeGenerated: boolean
  }
  analytics: {
    impressions: number
    clicks: number
    shares: number
    clickThroughRate: number
    redemptionRate: number
    customerAcquisitionCost: number
    returnOnInvestment: number
  }
  createdBy: string
  approvedBy?: string
  createdDate: string
  updatedDate: string
  publishedDate?: string
  expiryDate?: string
}

export default function CouponsPage() {
  const { data: session } = useSession()
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [segmentFilter, setSegmentFilter] = useState<string>("all")
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    try {
      // Mock data for development
      const mockCoupons: Coupon[] = [
        {
          id: "1",
          code: "WELCOME25",
          title: "Welcome New Customer Offer",
          description: "Special 25% discount for new customers on their first purchase. Valid on all categories except electronics.",
          type: "percentage",
          status: "active",
          discountValue: 25,
          minimumOrderValue: 1000,
          maximumDiscount: 5000,
          maxUsage: 1000,
          currentUsage: 247,
          usagePerCustomer: 1,
          categories: ["Fashion", "Home & Kitchen", "Books", "Sports"],
          excludeCategories: ["Electronics"],
          customerSegments: ["New Customers"],
          newCustomersOnly: true,
          firstTimeOnly: true,
          schedule: {
            startDate: "2025-01-01",
            endDate: "2025-12-31",
            startTime: "00:00",
            endTime: "23:59",
            timezone: "Asia/Kolkata"
          },
          conditions: {
            combinableWithOther: false,
            stackable: false,
            applicablePaymentMethods: ["Credit Card", "Debit Card", "UPI", "Net Banking"],
            minQuantity: 1,
            deviceTypes: ["mobile", "desktop", "tablet"]
          },
          performance: {
            totalUsage: 247,
            totalDiscount: 298750,
            totalRevenue: 4567800,
            averageOrderValue: 1849,
            conversionRate: 24.7,
            popularProducts: ["Casual Jeans", "Ethnic Dress", "Running Shoes"],
            topCustomers: ["USER001", "USER089", "USER156"]
          },
          marketing: {
            emailCampaignSent: true,
            pushNotificationSent: true,
            socialMediaPromoted: true,
            affiliatePromoted: false,
            influencerCodes: [],
            qrCodeGenerated: true
          },
          analytics: {
            impressions: 15678,
            clicks: 3456,
            shares: 234,
            clickThroughRate: 22.05,
            redemptionRate: 7.14,
            customerAcquisitionCost: 125,
            returnOnInvestment: 15.3
          },
          createdBy: "Marketing Team",
          approvedBy: "Marketing Director",
          createdDate: "2024-12-15T10:00:00Z",
          updatedDate: "2025-01-19T08:30:00Z",
          publishedDate: "2025-01-01T00:00:00Z"
        },
        {
          id: "2",
          code: "FLASHSALE50",
          title: "Flash Sale Weekend Special",
          description: "Limited time 50% discount on selected electronics. Valid only for weekend flash sale event.",
          type: "percentage",
          status: "active",
          discountValue: 50,
          minimumOrderValue: 5000,
          maximumDiscount: 15000,
          maxUsage: 500,
          currentUsage: 342,
          usagePerCustomer: 1,
          categories: ["Electronics", "Smartphones", "Laptops"],
          customerSegments: ["All Customers", "Premium Buyers"],
          newCustomersOnly: false,
          firstTimeOnly: false,
          schedule: {
            startDate: "2025-01-18",
            endDate: "2025-01-20",
            startTime: "00:00",
            endTime: "23:59",
            timezone: "Asia/Kolkata",
            validDays: [6, 0], // Saturday, Sunday
            validHours: ["10:00-22:00"]
          },
          conditions: {
            combinableWithOther: false,
            stackable: false,
            applicablePaymentMethods: ["Credit Card", "UPI"],
            minQuantity: 1,
            maxQuantity: 3
          },
          performance: {
            totalUsage: 342,
            totalDiscount: 2567800,
            totalRevenue: 8945600,
            averageOrderValue: 2615,
            conversionRate: 68.4,
            popularProducts: ["Samsung Galaxy S24", "MacBook Air M2", "iPad Pro"],
            topCustomers: ["USER023", "USER087", "USER234"]
          },
          marketing: {
            emailCampaignSent: true,
            pushNotificationSent: true,
            socialMediaPromoted: true,
            affiliatePromoted: true,
            influencerCodes: ["TECH50", "GADGET50"],
            qrCodeGenerated: true
          },
          analytics: {
            impressions: 45678,
            clicks: 15678,
            shares: 1234,
            clickThroughRate: 34.33,
            redemptionRate: 2.18,
            customerAcquisitionCost: 89,
            returnOnInvestment: 28.7
          },
          createdBy: "Electronics Team",
          approvedBy: "Category Manager",
          createdDate: "2025-01-15T14:00:00Z",
          updatedDate: "2025-01-19T10:00:00Z",
          publishedDate: "2025-01-18T00:00:00Z"
        },
        {
          id: "3",
          code: "FREESHIP99",
          title: "Free Shipping on Orders Above ₹99",
          description: "Enjoy free shipping on all orders above ₹99. No minimum order value, valid across all categories.",
          type: "free_shipping",
          status: "active",
          discountValue: 0, // Free shipping
          minimumOrderValue: 99,
          currentUsage: 1567,
          customerSegments: ["All Customers"],
          newCustomersOnly: false,
          firstTimeOnly: false,
          schedule: {
            startDate: "2025-01-01",
            startTime: "00:00",
            timezone: "Asia/Kolkata"
          },
          conditions: {
            combinableWithOther: true,
            stackable: true,
            applicablePaymentMethods: ["All Payment Methods"]
          },
          performance: {
            totalUsage: 1567,
            totalDiscount: 94020, // Shipping charges saved
            totalRevenue: 2345678,
            averageOrderValue: 1496,
            conversionRate: 78.4,
            popularProducts: ["Books", "Stationery", "Accessories"],
            topCustomers: ["USER045", "USER123", "USER278"]
          },
          marketing: {
            emailCampaignSent: true,
            pushNotificationSent: false,
            socialMediaPromoted: true,
            affiliatePromoted: true,
            influencerCodes: [],
            qrCodeGenerated: false
          },
          analytics: {
            impressions: 89456,
            clicks: 23456,
            shares: 567,
            clickThroughRate: 26.22,
            redemptionRate: 6.68,
            customerAcquisitionCost: 45,
            returnOnInvestment: 24.9
          },
          createdBy: "Operations Team",
          approvedBy: "COO",
          createdDate: "2024-12-20T09:00:00Z",
          updatedDate: "2025-01-19T11:00:00Z",
          publishedDate: "2025-01-01T00:00:00Z"
        },
        {
          id: "4",
          code: "BOGO2025",
          title: "Buy One Get One Free - Fashion",
          description: "Buy any 2 fashion items and get the cheaper one absolutely free. Valid on all clothing and accessories.",
          type: "buy_x_get_y",
          status: "scheduled",
          discountValue: 1, // Get 1 free
          minimumOrderValue: 500,
          maxUsage: 1000,
          currentUsage: 0,
          usagePerCustomer: 2,
          categories: ["Fashion", "Clothing", "Accessories"],
          customerSegments: ["Fashion Lovers", "Frequent Shoppers"],
          newCustomersOnly: false,
          firstTimeOnly: false,
          schedule: {
            startDate: "2025-02-01",
            endDate: "2025-02-14",
            startTime: "08:00",
            endTime: "22:00",
            timezone: "Asia/Kolkata"
          },
          conditions: {
            combinableWithOther: false,
            stackable: false,
            minQuantity: 2,
            maxQuantity: 10
          },
          performance: {
            totalUsage: 0,
            totalDiscount: 0,
            totalRevenue: 0,
            averageOrderValue: 0,
            conversionRate: 0,
            popularProducts: [],
            topCustomers: []
          },
          marketing: {
            emailCampaignSent: false,
            pushNotificationSent: false,
            socialMediaPromoted: false,
            affiliatePromoted: false,
            influencerCodes: ["FASHION2025", "STYLE2025"],
            qrCodeGenerated: true
          },
          analytics: {
            impressions: 0,
            clicks: 0,
            shares: 0,
            clickThroughRate: 0,
            redemptionRate: 0,
            customerAcquisitionCost: 0,
            returnOnInvestment: 0
          },
          createdBy: "Fashion Team",
          createdDate: "2025-01-18T16:00:00Z",
          updatedDate: "2025-01-18T16:00:00Z"
        },
        {
          id: "5",
          code: "CASHBACK10",
          title: "10% Cashback on Premium Purchases",
          description: "Earn 10% cashback on all premium category purchases. Cashback will be credited to your wallet within 24 hours.",
          type: "cashback",
          status: "active",
          discountValue: 10,
          minimumOrderValue: 2000,
          maximumDiscount: 2000,
          maxUsage: 2000,
          currentUsage: 123,
          usagePerCustomer: 3,
          categories: ["Premium Electronics", "Designer Fashion", "Luxury Home"],
          customerSegments: ["VIP Customers", "Premium Buyers"],
          newCustomersOnly: false,
          firstTimeOnly: false,
          schedule: {
            startDate: "2025-01-10",
            endDate: "2025-03-31",
            startTime: "00:00",
            endTime: "23:59",
            timezone: "Asia/Kolkata"
          },
          conditions: {
            combinableWithOther: true,
            stackable: false,
            applicablePaymentMethods: ["Credit Card", "Net Banking"],
            minQuantity: 1
          },
          performance: {
            totalUsage: 123,
            totalDiscount: 234567, // Cashback amount
            totalRevenue: 5678900,
            averageOrderValue: 4617,
            conversionRate: 61.5,
            popularProducts: ["Premium Smartphone", "Designer Watch", "Luxury Sofa"],
            topCustomers: ["VIP001", "VIP023", "VIP089"]
          },
          marketing: {
            emailCampaignSent: true,
            pushNotificationSent: true,
            socialMediaPromoted: false,
            affiliatePromoted: true,
            influencerCodes: ["PREMIUM10"],
            qrCodeGenerated: false
          },
          analytics: {
            impressions: 12345,
            clicks: 2345,
            shares: 89,
            clickThroughRate: 19.01,
            redemptionRate: 5.24,
            customerAcquisitionCost: 180,
            returnOnInvestment: 24.2
          },
          createdBy: "VIP Team",
          approvedBy: "Premium Manager",
          createdDate: "2025-01-08T11:00:00Z",
          updatedDate: "2025-01-19T09:00:00Z",
          publishedDate: "2025-01-10T00:00:00Z"
        }
      ]

      setCoupons(mockCoupons)
    } catch (error) {
      console.error("Error fetching coupons:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filter coupons
  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = 
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || coupon.status === statusFilter
    const matchesType = typeFilter === "all" || coupon.type === typeFilter
    const matchesSegment = segmentFilter === "all" || 
      coupon.customerSegments.some(segment => segment.toLowerCase().includes(segmentFilter.toLowerCase()))
    
    return matchesSearch && matchesStatus && matchesType && matchesSegment
  })

  const getStatusBadge = (status: string) => {
    const colors = {
      'draft': 'bg-gray-100 text-gray-800',
      'active': 'bg-green-100 text-green-800',
      'paused': 'bg-yellow-100 text-yellow-800',
      'expired': 'bg-red-100 text-red-800',
      'cancelled': 'bg-red-100 text-red-800',
      'scheduled': 'bg-blue-100 text-blue-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getTypeIcon = (type: string) => {
    const icons = {
      'percentage': Percent,
      'fixed_amount': Tag,
      'free_shipping': Globe,
      'buy_x_get_y': Gift,
      'cashback': Star
    }
    return icons[type as keyof typeof icons] || Tag
  }

  const formatDiscountValue = (coupon: Coupon) => {
    switch (coupon.type) {
      case 'percentage':
        return `${coupon.discountValue}%`
      case 'fixed_amount':
        return `₹${coupon.discountValue}`
      case 'free_shipping':
        return 'Free Shipping'
      case 'buy_x_get_y':
        return `Buy 2 Get ${coupon.discountValue} Free`
      case 'cashback':
        return `${coupon.discountValue}% Cashback`
      default:
        return coupon.discountValue.toString()
    }
  }

  const getTotalStats = () => {
    return coupons.reduce((acc, coupon) => ({
      totalCoupons: acc.totalCoupons + 1,
      activeCoupons: acc.activeCoupons + (coupon.status === 'active' ? 1 : 0),
      totalUsage: acc.totalUsage + coupon.performance.totalUsage,
      totalDiscount: acc.totalDiscount + coupon.performance.totalDiscount,
      totalRevenue: acc.totalRevenue + coupon.performance.totalRevenue,
      avgROI: acc.avgROI + coupon.analytics.returnOnInvestment
    }), { 
      totalCoupons: 0, 
      activeCoupons: 0, 
      totalUsage: 0, 
      totalDiscount: 0, 
      totalRevenue: 0, 
      avgROI: 0 
    })
  }

  const stats = getTotalStats()
  const avgROI = stats.totalCoupons > 0 ? (stats.avgROI / stats.totalCoupons).toFixed(1) : 0
  const avgRedemptionRate = coupons.length > 0 ? 
    (coupons.reduce((sum, coupon) => sum + coupon.analytics.redemptionRate, 0) / coupons.length).toFixed(2) : 0

  if (!session) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>Please sign in to access coupon management.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Coupon Management</h1>
          <p className="text-muted-foreground text-lg">Create and manage discount codes and promotional offers</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Coupon
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create New Coupon</DialogTitle>
                <DialogDescription>Set up a new discount code or promotional offer</DialogDescription>
              </DialogHeader>
              <div className="text-center py-8 text-muted-foreground">
                Coupon creation form would be implemented here
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coupons</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCoupons}</div>
            <p className="text-xs text-muted-foreground">All codes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Coupons</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCoupons}</div>
            <p className="text-xs text-muted-foreground">Currently valid</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsage}</div>
            <p className="text-xs text-muted-foreground">Redemptions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Discount</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(stats.totalDiscount / 100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">Given away</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Impact</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(stats.totalRevenue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Generated</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg ROI</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgROI}x</div>
            <p className="text-xs text-muted-foreground">{avgRedemptionRate}% redemption</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center">
            <div className="flex-1 w-full xl:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search coupons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 w-full xl:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                  <SelectItem value="free_shipping">Free Shipping</SelectItem>
                  <SelectItem value="buy_x_get_y">BOGO</SelectItem>
                  <SelectItem value="cashback">Cashback</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={segmentFilter} onValueChange={setSegmentFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Segment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Segments</SelectItem>
                  <SelectItem value="new">New Customers</SelectItem>
                  <SelectItem value="vip">VIP Customers</SelectItem>
                  <SelectItem value="premium">Premium Buyers</SelectItem>
                  <SelectItem value="frequent">Frequent Shoppers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coupons Table */}
      <Card>
        <CardHeader>
          <CardTitle>Discount Coupons ({filteredCoupons.length})</CardTitle>
          <CardDescription>
            {loading ? "Loading coupons..." : `Showing ${filteredCoupons.length} of ${coupons.length} coupons`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading coupons...</div>
          ) : filteredCoupons.length === 0 ? (
            <div className="text-center py-8">No coupons found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Coupon Details</TableHead>
                  <TableHead>Discount & Limits</TableHead>
                  <TableHead>Usage Stats</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Validity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCoupons.map((coupon) => {
                  const TypeIcon = getTypeIcon(coupon.type)
                  const isActive = coupon.status === 'active'
                  const usagePercent = coupon.maxUsage ? ((coupon.currentUsage / coupon.maxUsage) * 100).toFixed(1) : "0"
                  
                  return (
                    <TableRow key={coupon.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <TypeIcon className="h-4 w-4" />
                            <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono font-semibold">
                              {coupon.code}
                            </code>
                          </div>
                          <div className="font-medium">{coupon.title}</div>
                          <div className="text-sm text-muted-foreground max-w-[200px] truncate">
                            {coupon.description}
                          </div>
                          <div className="flex gap-1 mt-1">
                            {coupon.customerSegments.slice(0, 2).map((segment) => (
                              <Badge key={segment} variant="outline" className="text-xs">
                                {segment}
                              </Badge>
                            ))}
                            {coupon.customerSegments.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{coupon.customerSegments.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-lg font-bold text-green-600">
                            {formatDiscountValue(coupon)}
                          </div>
                          {coupon.minimumOrderValue && (
                            <div className="text-xs text-muted-foreground">
                              Min: ₹{coupon.minimumOrderValue}
                            </div>
                          )}
                          {coupon.maximumDiscount && (
                            <div className="text-xs text-muted-foreground">
                              Max: ₹{coupon.maximumDiscount}
                            </div>
                          )}
                          {coupon.usagePerCustomer && (
                            <div className="text-xs text-muted-foreground">
                              {coupon.usagePerCustomer} per customer
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">
                            {coupon.currentUsage}
                            {coupon.maxUsage && <span className="text-muted-foreground"> / {coupon.maxUsage}</span>}
                          </div>
                          {coupon.maxUsage && (
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${Math.min(parseFloat(usagePercent), 100)}%` }}
                              />
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            {coupon.maxUsage ? `${usagePercent}% used` : 'No limit'}
                          </div>
                          <div className="text-xs font-medium text-green-600">
                            ₹{(coupon.performance.totalRevenue / 1000).toFixed(0)}K revenue
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            {coupon.analytics.redemptionRate.toFixed(2)}% redemption
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {coupon.analytics.clickThroughRate.toFixed(2)}% CTR
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ₹{coupon.performance.averageOrderValue} avg order
                          </div>
                          <div className={`text-xs font-medium ${coupon.analytics.returnOnInvestment > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {coupon.analytics.returnOnInvestment.toFixed(1)}x ROI
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            {new Date(coupon.schedule.startDate).toLocaleDateString()}
                          </div>
                          {coupon.schedule.endDate && (
                            <div className="text-sm text-muted-foreground">
                              to {new Date(coupon.schedule.endDate).toLocaleDateString()}
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            {coupon.schedule.startTime}
                            {coupon.schedule.endTime && ` - ${coupon.schedule.endTime}`}
                          </div>
                          {coupon.newCustomersOnly && (
                            <Badge variant="secondary" className="text-xs">
                              New Only
                            </Badge>
                          )}
                          {coupon.firstTimeOnly && (
                            <Badge variant="secondary" className="text-xs">
                              First Time
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge 
                            variant="outline"
                            className={getStatusBadge(coupon.status)}
                          >
                            {coupon.status.replace('_', ' ')}
                          </Badge>
                          {isActive && (
                            <div className="flex items-center gap-1 text-green-600">
                              <Activity className="h-3 w-3" />
                              <span className="text-xs">Live</span>
                            </div>
                          )}
                          {coupon.marketing.qrCodeGenerated && (
                            <div className="flex items-center gap-1 text-blue-600">
                              <Code className="h-3 w-3" />
                              <span className="text-xs">QR</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedCoupon(coupon)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Edit Coupon"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Copy Code"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Share Coupon"
                          >
                            <Share className="h-4 w-4" />
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

      {/* Coupon Details Dialog */}
      {selectedCoupon && (
        <Dialog open={!!selectedCoupon} onOpenChange={() => setSelectedCoupon(null)}>
          <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <code className="px-2 py-1 bg-gray-100 rounded font-mono font-semibold">
                    {selectedCoupon.code}
                  </code>
                  <span>{selectedCoupon.title}</span>
                </div>
                <Badge variant="outline" className={getStatusBadge(selectedCoupon.status)}>
                  {selectedCoupon.status.replace('_', ' ')}
                </Badge>
              </DialogTitle>
              <DialogDescription>{selectedCoupon.description}</DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="conditions">Conditions</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="marketing">Marketing</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Discount Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Type</span>
                        <span className="text-sm capitalize">{selectedCoupon.type.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Discount Value</span>
                        <span className="text-sm font-medium text-green-600">
                          {formatDiscountValue(selectedCoupon)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Min Order</span>
                        <span className="text-sm">₹{selectedCoupon.minimumOrderValue || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Max Discount</span>
                        <span className="text-sm">₹{selectedCoupon.maximumDiscount || 'No limit'}</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Usage Limits</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Usage Limit</span>
                        <span className="text-sm">{selectedCoupon.maxUsage || 'Unlimited'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Current Usage</span>
                        <span className="text-sm font-medium">{selectedCoupon.currentUsage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Per Customer</span>
                        <span className="text-sm">{selectedCoupon.usagePerCustomer || 'No limit'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Remaining</span>
                        <span className="text-sm">
                          {selectedCoupon.maxUsage ? 
                            selectedCoupon.maxUsage - selectedCoupon.currentUsage : 
                            'Unlimited'
                          }
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Validity Period</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Start Date</span>
                        <span className="text-sm">{new Date(selectedCoupon.schedule.startDate).toLocaleDateString()}</span>
                      </div>
                      {selectedCoupon.schedule.endDate && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">End Date</span>
                          <span className="text-sm">{new Date(selectedCoupon.schedule.endDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Time</span>
                        <span className="text-sm">
                          {selectedCoupon.schedule.startTime}
                          {selectedCoupon.schedule.endTime && ` - ${selectedCoupon.schedule.endTime}`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Timezone</span>
                        <span className="text-sm">{selectedCoupon.schedule.timezone}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Target Audience</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-muted-foreground">Customer Segments</span>
                          <div className="flex gap-2 mt-1 flex-wrap">
                            {selectedCoupon.customerSegments.map(segment => (
                              <Badge key={segment} variant="outline">{segment}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">New Customers Only</span>
                            <Badge variant={selectedCoupon.newCustomersOnly ? "default" : "secondary"}>
                              {selectedCoupon.newCustomersOnly ? "Yes" : "No"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">First Time Purchase Only</span>
                            <Badge variant={selectedCoupon.firstTimeOnly ? "default" : "secondary"}>
                              {selectedCoupon.firstTimeOnly ? "Yes" : "No"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Applicable Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedCoupon.categories && selectedCoupon.categories.length > 0 && (
                          <div>
                            <span className="text-sm text-muted-foreground">Included Categories</span>
                            <div className="flex gap-1 mt-1 flex-wrap">
                              {selectedCoupon.categories.map(category => (
                                <Badge key={category} variant="outline" className="text-xs">
                                  {category}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {selectedCoupon.excludeCategories && selectedCoupon.excludeCategories.length > 0 && (
                          <div>
                            <span className="text-sm text-muted-foreground">Excluded Categories</span>
                            <div className="flex gap-1 mt-1 flex-wrap">
                              {selectedCoupon.excludeCategories.map(category => (
                                <Badge key={category} variant="destructive" className="text-xs">
                                  {category}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="conditions" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Stacking & Combination</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Combinable with Other Coupons</span>
                        <Badge variant={selectedCoupon.conditions.combinableWithOther ? "default" : "secondary"}>
                          {selectedCoupon.conditions.combinableWithOther ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Stackable</span>
                        <Badge variant={selectedCoupon.conditions.stackable ? "default" : "secondary"}>
                          {selectedCoupon.conditions.stackable ? "Yes" : "No"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quantity Restrictions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {selectedCoupon.conditions.minQuantity && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Minimum Quantity</span>
                          <span className="text-sm">{selectedCoupon.conditions.minQuantity}</span>
                        </div>
                      )}
                      {selectedCoupon.conditions.maxQuantity && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Maximum Quantity</span>
                          <span className="text-sm">{selectedCoupon.conditions.maxQuantity}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Payment & Device Restrictions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedCoupon.conditions.applicablePaymentMethods && (
                        <div>
                          <span className="text-sm text-muted-foreground">Applicable Payment Methods</span>
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {selectedCoupon.conditions.applicablePaymentMethods.map(method => (
                              <Badge key={method} variant="outline" className="text-xs">
                                {method}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedCoupon.conditions.deviceTypes && (
                        <div>
                          <span className="text-sm text-muted-foreground">Applicable Devices</span>
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {selectedCoupon.conditions.deviceTypes.map(device => (
                              <Badge key={device} variant="outline" className="text-xs capitalize">
                                {device}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedCoupon.conditions.locations && (
                        <div>
                          <span className="text-sm text-muted-foreground">Applicable Locations</span>
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {selectedCoupon.conditions.locations.map(location => (
                              <Badge key={location} variant="outline" className="text-xs">
                                {location}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="performance" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Usage Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedCoupon.performance.totalUsage}</div>
                      <p className="text-xs text-muted-foreground">Total redemptions</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Revenue Generated</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₹{(selectedCoupon.performance.totalRevenue / 1000).toFixed(0)}K</div>
                      <p className="text-xs text-muted-foreground">Total sales</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Discount Given</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₹{(selectedCoupon.performance.totalDiscount / 1000).toFixed(0)}K</div>
                      <p className="text-xs text-muted-foreground">Total discount</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Avg Order Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₹{selectedCoupon.performance.averageOrderValue}</div>
                      <p className="text-xs text-muted-foreground">With coupon</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Engagement Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Impressions</span>
                        <span className="text-sm font-medium">{selectedCoupon.analytics.impressions.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Clicks</span>
                        <span className="text-sm font-medium">{selectedCoupon.analytics.clicks.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Shares</span>
                        <span className="text-sm font-medium">{selectedCoupon.analytics.shares.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Click Through Rate</span>
                        <span className="text-sm font-medium">{selectedCoupon.analytics.clickThroughRate.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Redemption Rate</span>
                        <span className="text-sm font-medium">{selectedCoupon.analytics.redemptionRate.toFixed(2)}%</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Business Impact</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Customer Acquisition Cost</span>
                        <span className="text-sm">₹{selectedCoupon.analytics.customerAcquisitionCost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Return on Investment</span>
                        <span className="text-sm font-medium text-green-600">{selectedCoupon.analytics.returnOnInvestment.toFixed(1)}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Conversion Rate</span>
                        <span className="text-sm font-medium">{selectedCoupon.performance.conversionRate.toFixed(2)}%</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Top Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Popular Products</span>
                        <div className="mt-1 space-y-1">
                          {selectedCoupon.performance.popularProducts.map(product => (
                            <div key={product} className="text-sm">{product}</div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Top Customers</span>
                        <div className="mt-1 space-y-1">
                          {selectedCoupon.performance.topCustomers.map(customer => (
                            <code key={customer} className="text-xs px-1 py-0.5 bg-gray-100 rounded">
                              {customer}
                            </code>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="marketing" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Marketing Channels</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Email Campaign</span>
                        <Badge variant={selectedCoupon.marketing.emailCampaignSent ? "default" : "secondary"}>
                          {selectedCoupon.marketing.emailCampaignSent ? "Sent" : "Not Sent"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Push Notifications</span>
                        <Badge variant={selectedCoupon.marketing.pushNotificationSent ? "default" : "secondary"}>
                          {selectedCoupon.marketing.pushNotificationSent ? "Sent" : "Not Sent"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Social Media Promotion</span>
                        <Badge variant={selectedCoupon.marketing.socialMediaPromoted ? "default" : "secondary"}>
                          {selectedCoupon.marketing.socialMediaPromoted ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Affiliate Marketing</span>
                        <Badge variant={selectedCoupon.marketing.affiliatePromoted ? "default" : "secondary"}>
                          {selectedCoupon.marketing.affiliatePromoted ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">QR Code Generated</span>
                        <Badge variant={selectedCoupon.marketing.qrCodeGenerated ? "default" : "secondary"}>
                          {selectedCoupon.marketing.qrCodeGenerated ? "Yes" : "No"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Influencer Codes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedCoupon.marketing.influencerCodes.length > 0 ? (
                        <div className="space-y-2">
                          {selectedCoupon.marketing.influencerCodes.map(code => (
                            <code key={code} className="block px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                              {code}
                            </code>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          No influencer codes created
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}