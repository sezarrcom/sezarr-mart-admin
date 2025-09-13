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
  Search, Filter, Download, Eye, Edit, Plus, Zap, Calendar,
  Clock, TrendingUp, TrendingDown, Percent, Tag, Users,
  ShoppingCart, Star, Timer, Gift, Flame, Target,
  BarChart3, Activity, CheckCircle, XCircle, AlertTriangle
} from "lucide-react"

interface Deal {
  id: string
  title: string
  description: string
  type: 'flash_sale' | 'daily_deal' | 'weekly_special' | 'clearance' | 'bundle_offer' | 'buy_one_get_one' | 'seasonal_sale'
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'expired' | 'cancelled'
  discountType: 'percentage' | 'fixed_amount' | 'buy_x_get_y' | 'free_shipping'
  discountValue: number
  minimumOrderValue?: number
  maximumDiscount?: number
  products: {
    id: string
    name: string
    originalPrice: number
    dealPrice: number
    stock: number
    sold: number
  }[]
  categories?: string[]
  targetAudience: {
    customerSegments: string[]
    newCustomersOnly: boolean
    vipCustomersOnly: boolean
    locationBased: string[]
  }
  schedule: {
    startDate: string
    endDate: string
    startTime: string
    endTime: string
    timezone: string
    recurringType?: 'daily' | 'weekly' | 'monthly'
  }
  conditions: {
    usageLimit?: number
    usagePerCustomer?: number
    minQuantity?: number
    maxQuantity?: number
    applicablePaymentMethods?: string[]
  }
  marketing: {
    bannerImage?: string
    promotionalText: string
    emailCampaignSent: boolean
    pushNotificationSent: boolean
    socialMediaPromoted: boolean
    influencerPartnership: boolean
  }
  performance: {
    views: number
    clicks: number
    conversions: number
    revenue: number
    ordersGenerated: number
    averageOrderValue: number
    conversionRate: number
    returnOnInvestment: number
  }
  budget: {
    allocated: number
    spent: number
    costPerAcquisition: number
    advertisingSpend: number
  }
  createdBy: string
  approvedBy?: string
  createdDate: string
  updatedDate: string
  publishedDate?: string
}

export default function DealsPage() {
  const { data: session } = useSession()
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  useEffect(() => {
    fetchDeals()
  }, [])

  const fetchDeals = async () => {
    try {
      // Mock data for development
      const mockDeals: Deal[] = [
        {
          id: "1",
          title: "Flash Sale - Electronics Bonanza",
          description: "Massive discounts on smartphones, laptops, and accessories. Limited time offer with up to 50% off on selected items.",
          type: "flash_sale",
          status: "active",
          discountType: "percentage",
          discountValue: 35,
          minimumOrderValue: 5000,
          maximumDiscount: 10000,
          products: [
            {
              id: "PROD-001",
              name: "Samsung Galaxy S24",
              originalPrice: 79999,
              dealPrice: 51999,
              stock: 50,
              sold: 23
            },
            {
              id: "PROD-002", 
              name: "Apple iPhone 15",
              originalPrice: 89999,
              dealPrice: 58499,
              stock: 30,
              sold: 18
            },
            {
              id: "PROD-003",
              name: "MacBook Air M2",
              originalPrice: 119999,
              dealPrice: 77999,
              stock: 25,
              sold: 12
            }
          ],
          categories: ["Electronics", "Smartphones", "Laptops"],
          targetAudience: {
            customerSegments: ["Tech Enthusiasts", "Premium Buyers"],
            newCustomersOnly: false,
            vipCustomersOnly: false,
            locationBased: ["Mumbai", "Delhi", "Bangalore"]
          },
          schedule: {
            startDate: "2025-01-19",
            endDate: "2025-01-21",
            startTime: "00:00",
            endTime: "23:59",
            timezone: "Asia/Kolkata"
          },
          conditions: {
            usageLimit: 1000,
            usagePerCustomer: 1,
            minQuantity: 1,
            applicablePaymentMethods: ["Credit Card", "UPI", "Net Banking"]
          },
          marketing: {
            bannerImage: "/deals/flash-sale-electronics.jpg",
            promotionalText: "🔥 FLASH SALE: Up to 50% OFF on Electronics! Limited Stock!",
            emailCampaignSent: true,
            pushNotificationSent: true,
            socialMediaPromoted: true,
            influencerPartnership: false
          },
          performance: {
            views: 45678,
            clicks: 8934,
            conversions: 532,
            revenue: 2458000,
            ordersGenerated: 367,
            averageOrderValue: 6699,
            conversionRate: 5.96,
            returnOnInvestment: 8.7
          },
          budget: {
            allocated: 500000,
            spent: 287500,
            costPerAcquisition: 784,
            advertisingSpend: 125000
          },
          createdBy: "Priya Sharma",
          approvedBy: "Rohit Kumar",
          createdDate: "2025-01-15T10:00:00Z",
          updatedDate: "2025-01-19T08:30:00Z",
          publishedDate: "2025-01-19T00:00:00Z"
        },
        {
          id: "2",
          title: "Weekend Fashion Fiesta",
          description: "Trendy collection of clothing and accessories for men and women. Special weekend prices with additional benefits for members.",
          type: "weekly_special",
          status: "scheduled",
          discountType: "percentage",
          discountValue: 25,
          minimumOrderValue: 2000,
          maximumDiscount: 5000,
          products: [
            {
              id: "PROD-004",
              name: "Designer Kurta Set",
              originalPrice: 3999,
              dealPrice: 2999,
              stock: 100,
              sold: 0
            },
            {
              id: "PROD-005",
              name: "Casual Jeans",
              originalPrice: 2499,
              dealPrice: 1874,
              stock: 150,
              sold: 0
            },
            {
              id: "PROD-006",
              name: "Ethnic Dress",
              originalPrice: 4599,
              dealPrice: 3449,
              stock: 80,
              sold: 0
            }
          ],
          categories: ["Fashion", "Clothing", "Ethnic Wear"],
          targetAudience: {
            customerSegments: ["Fashion Lovers", "Young Adults"],
            newCustomersOnly: false,
            vipCustomersOnly: false,
            locationBased: []
          },
          schedule: {
            startDate: "2025-01-25",
            endDate: "2025-01-26",
            startTime: "08:00",
            endTime: "22:00",
            timezone: "Asia/Kolkata",
            recurringType: "weekly"
          },
          conditions: {
            usageLimit: 500,
            usagePerCustomer: 2,
            minQuantity: 1
          },
          marketing: {
            bannerImage: "/deals/fashion-fiesta.jpg",
            promotionalText: "✨ Weekend Fashion Sale: 25% OFF + Free Shipping!",
            emailCampaignSent: false,
            pushNotificationSent: false,
            socialMediaPromoted: false,
            influencerPartnership: true
          },
          performance: {
            views: 0,
            clicks: 0,
            conversions: 0,
            revenue: 0,
            ordersGenerated: 0,
            averageOrderValue: 0,
            conversionRate: 0,
            returnOnInvestment: 0
          },
          budget: {
            allocated: 200000,
            spent: 0,
            costPerAcquisition: 0,
            advertisingSpend: 0
          },
          createdBy: "Neha Gupta",
          createdDate: "2025-01-18T14:00:00Z",
          updatedDate: "2025-01-18T14:00:00Z"
        },
        {
          id: "3",
          title: "Home & Kitchen Clearance",
          description: "Clear out inventory with massive discounts on home appliances, kitchenware, and furniture. Stock must go!",
          type: "clearance",
          status: "active",
          discountType: "percentage",
          discountValue: 40,
          minimumOrderValue: 1500,
          products: [
            {
              id: "PROD-007",
              name: "Mixer Grinder",
              originalPrice: 4999,
              dealPrice: 2999,
              stock: 45,
              sold: 32
            },
            {
              id: "PROD-008",
              name: "Pressure Cooker",
              originalPrice: 2999,
              dealPrice: 1799,
              stock: 60,
              sold: 41
            },
            {
              id: "PROD-009",
              name: "Study Table",
              originalPrice: 8999,
              dealPrice: 5399,
              stock: 20,
              sold: 15
            }
          ],
          categories: ["Home & Kitchen", "Appliances", "Furniture"],
          targetAudience: {
            customerSegments: ["Home Makers", "Budget Conscious"],
            newCustomersOnly: false,
            vipCustomersOnly: false,
            locationBased: []
          },
          schedule: {
            startDate: "2025-01-10",
            endDate: "2025-01-25",
            startTime: "00:00",
            endTime: "23:59",
            timezone: "Asia/Kolkata"
          },
          conditions: {
            usagePerCustomer: 3
          },
          marketing: {
            bannerImage: "/deals/home-clearance.jpg",
            promotionalText: "🏠 CLEARANCE SALE: 40% OFF Home & Kitchen Items!",
            emailCampaignSent: true,
            pushNotificationSent: true,
            socialMediaPromoted: false,
            influencerPartnership: false
          },
          performance: {
            views: 23456,
            clicks: 4567,
            conversions: 298,
            revenue: 892000,
            ordersGenerated: 223,
            averageOrderValue: 4000,
            conversionRate: 6.53,
            returnOnInvestment: 4.2
          },
          budget: {
            allocated: 150000,
            spent: 95000,
            costPerAcquisition: 319,
            advertisingSpend: 45000
          },
          createdBy: "Amit Singh",
          approvedBy: "Sunita Patel",
          createdDate: "2025-01-08T09:00:00Z",
          updatedDate: "2025-01-19T11:00:00Z",
          publishedDate: "2025-01-10T00:00:00Z"
        },
        {
          id: "4",
          title: "Buy 2 Get 1 Free - Books Special",
          description: "Perfect deal for book lovers! Buy any 2 books and get the cheapest one absolutely free. Valid on all genres.",
          type: "buy_one_get_one",
          status: "active",
          discountType: "buy_x_get_y",
          discountValue: 1, // Get 1 free
          products: [
            {
              id: "PROD-010",
              name: "Fiction Bestsellers",
              originalPrice: 599,
              dealPrice: 399, // Effective after discount
              stock: 200,
              sold: 89
            },
            {
              id: "PROD-011",
              name: "Self Help Books",
              originalPrice: 799,
              dealPrice: 533, // Effective after discount
              stock: 150,
              sold: 67
            },
            {
              id: "PROD-012",
              name: "Technical Books",
              originalPrice: 1299,
              dealPrice: 866, // Effective after discount
              stock: 100,
              sold: 34
            }
          ],
          categories: ["Books", "Education", "Entertainment"],
          targetAudience: {
            customerSegments: ["Students", "Book Lovers", "Professionals"],
            newCustomersOnly: false,
            vipCustomersOnly: false,
            locationBased: []
          },
          schedule: {
            startDate: "2025-01-15",
            endDate: "2025-01-30",
            startTime: "00:00",
            endTime: "23:59",
            timezone: "Asia/Kolkata"
          },
          conditions: {
            minQuantity: 2,
            maxQuantity: 10,
            usagePerCustomer: 1
          },
          marketing: {
            bannerImage: "/deals/books-bogo.jpg",
            promotionalText: "📚 Buy 2 Get 1 FREE on All Books! Limited Time!",
            emailCampaignSent: true,
            pushNotificationSent: false,
            socialMediaPromoted: true,
            influencerPartnership: false
          },
          performance: {
            views: 18934,
            clicks: 2847,
            conversions: 156,
            revenue: 234567,
            ordersGenerated: 104,
            averageOrderValue: 2255,
            conversionRate: 5.48,
            returnOnInvestment: 3.8
          },
          budget: {
            allocated: 80000,
            spent: 62000,
            costPerAcquisition: 397,
            advertisingSpend: 25000
          },
          createdBy: "Vikram Mehta",
          approvedBy: "Priya Sharma",
          createdDate: "2025-01-12T16:00:00Z",
          updatedDate: "2025-01-19T09:00:00Z",
          publishedDate: "2025-01-15T00:00:00Z"
        }
      ]

      setDeals(mockDeals)
    } catch (error) {
      console.error("Error fetching deals:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filter deals
  const filteredDeals = deals.filter(deal => {
    const matchesSearch = 
      deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.categories?.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === "all" || deal.status === statusFilter
    const matchesType = typeFilter === "all" || deal.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusBadge = (status: string) => {
    const variants = {
      'draft': 'secondary',
      'scheduled': 'outline',
      'active': 'default',
      'paused': 'secondary',
      'expired': 'destructive',
      'cancelled': 'destructive'
    }
    const colors = {
      'draft': 'bg-gray-100 text-gray-800',
      'scheduled': 'bg-blue-100 text-blue-800',
      'active': 'bg-green-100 text-green-800',
      'paused': 'bg-yellow-100 text-yellow-800',
      'expired': 'bg-red-100 text-red-800',
      'cancelled': 'bg-red-100 text-red-800'
    }
    return { variant: variants[status as keyof typeof variants] || 'secondary', color: colors[status as keyof typeof colors] }
  }

  const getTypeIcon = (type: string) => {
    const icons = {
      'flash_sale': Zap,
      'daily_deal': Calendar,
      'weekly_special': Star,
      'clearance': Tag,
      'bundle_offer': Gift,
      'buy_one_get_one': Users,
      'seasonal_sale': Flame
    }
    return icons[type as keyof typeof icons] || Tag
  }

  const getTotalStats = () => {
    return deals.reduce((acc, deal) => ({
      totalDeals: acc.totalDeals + 1,
      activeDeals: acc.activeDeals + (deal.status === 'active' ? 1 : 0),
      totalRevenue: acc.totalRevenue + deal.performance.revenue,
      totalOrders: acc.totalOrders + deal.performance.ordersGenerated,
      averageROI: acc.averageROI + deal.performance.returnOnInvestment,
      totalBudgetSpent: acc.totalBudgetSpent + deal.budget.spent
    }), { totalDeals: 0, activeDeals: 0, totalRevenue: 0, totalOrders: 0, averageROI: 0, totalBudgetSpent: 0 })
  }

  const stats = getTotalStats()
  const avgROI = stats.totalDeals > 0 ? (stats.averageROI / stats.totalDeals).toFixed(1) : 0
  const avgConversionRate = deals.length > 0 ? 
    (deals.reduce((sum, deal) => sum + deal.performance.conversionRate, 0) / deals.length).toFixed(2) : 0

  if (!session) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>Please sign in to access deals management.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Deals & Promotions</h1>
          <p className="text-muted-foreground text-lg">Create and manage promotional campaigns</p>
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
                Create Deal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Deal</DialogTitle>
                <DialogDescription>Set up a new promotional campaign</DialogDescription>
              </DialogHeader>
              <div className="text-center py-8 text-muted-foreground">
                Deal creation form would be implemented here
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDeals}</div>
            <p className="text-xs text-muted-foreground">All campaigns</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeDeals}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(stats.totalRevenue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">From all deals</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders Generated</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Total conversions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg ROI</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgROI}x</div>
            <p className="text-xs text-muted-foreground">Return on investment</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgConversionRate}%</div>
            <p className="text-xs text-muted-foreground">Average across deals</p>
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
                  placeholder="Search deals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="flash_sale">Flash Sale</SelectItem>
                  <SelectItem value="daily_deal">Daily Deal</SelectItem>
                  <SelectItem value="weekly_special">Weekly Special</SelectItem>
                  <SelectItem value="clearance">Clearance</SelectItem>
                  <SelectItem value="bundle_offer">Bundle Offer</SelectItem>
                  <SelectItem value="buy_one_get_one">BOGO</SelectItem>
                  <SelectItem value="seasonal_sale">Seasonal Sale</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Promotional Campaigns ({filteredDeals.length})</CardTitle>
          <CardDescription>
            {loading ? "Loading deals..." : `Showing ${filteredDeals.length} of ${deals.length} deals`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading deals...</div>
          ) : filteredDeals.length === 0 ? (
            <div className="text-center py-8">No deals found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Deal Details</TableHead>
                  <TableHead>Type & Schedule</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeals.map((deal) => {
                  const statusBadge = getStatusBadge(deal.status)
                  const TypeIcon = getTypeIcon(deal.type)
                  const isActive = deal.status === 'active'
                  const roi = deal.performance.returnOnInvestment
                  
                  return (
                    <TableRow key={deal.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{deal.title}</div>
                          <div className="text-sm text-muted-foreground max-w-[200px] truncate">
                            {deal.description}
                          </div>
                          <div className="flex gap-1">
                            {deal.categories?.slice(0, 2).map((category) => (
                              <Badge key={category} variant="outline" className="text-xs">
                                {category}
                              </Badge>
                            ))}
                            {deal.categories && deal.categories.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{deal.categories.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <TypeIcon className="h-4 w-4" />
                            <Badge variant="outline" className="text-xs">
                              {deal.type.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="text-sm">
                            {new Date(deal.schedule.startDate).toLocaleDateString()} - {new Date(deal.schedule.endDate).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {deal.schedule.startTime} - {deal.schedule.endTime}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <Percent className="h-3 w-3" />
                            <span className="font-medium">
                              {deal.discountType === 'percentage' && `${deal.discountValue}%`}
                              {deal.discountType === 'fixed_amount' && `₹${deal.discountValue}`}
                              {deal.discountType === 'buy_x_get_y' && `Buy 2 Get ${deal.discountValue} Free`}
                              {deal.discountType === 'free_shipping' && 'Free Shipping'}
                            </span>
                          </div>
                          {deal.minimumOrderValue && (
                            <div className="text-xs text-muted-foreground">
                              Min: ₹{deal.minimumOrderValue}
                            </div>
                          )}
                          {deal.maximumDiscount && (
                            <div className="text-xs text-muted-foreground">
                              Max: ₹{deal.maximumDiscount}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">
                            ₹{(deal.performance.revenue / 1000).toFixed(0)}K revenue
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {deal.performance.ordersGenerated} orders
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {deal.performance.conversionRate.toFixed(2)}% conversion
                          </div>
                          <div className={`text-xs font-medium ${roi > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {roi > 0 ? '+' : ''}{roi.toFixed(1)}x ROI
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            ₹{(deal.budget.spent / 1000).toFixed(0)}K / ₹{(deal.budget.allocated / 1000).toFixed(0)}K
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${Math.min((deal.budget.spent / deal.budget.allocated) * 100, 100)}%` }}
                            />
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {((deal.budget.spent / deal.budget.allocated) * 100).toFixed(0)}% spent
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge 
                            variant={statusBadge.variant as any}
                            className={statusBadge.color}
                          >
                            {deal.status.replace('_', ' ')}
                          </Badge>
                          {isActive && (
                            <div className="flex items-center gap-1 text-green-600">
                              <Activity className="h-3 w-3" />
                              <span className="text-xs">Live</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedDeal(deal)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Edit Deal"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {deal.status === 'active' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Analytics"
                            >
                              <BarChart3 className="h-4 w-4" />
                            </Button>
                          )}
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

      {/* Deal Details Dialog */}
      {selectedDeal && (
        <Dialog open={!!selectedDeal} onOpenChange={() => setSelectedDeal(null)}>
          <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedDeal.title}</span>
                <Badge variant={getStatusBadge(selectedDeal.status).variant as any}>
                  {selectedDeal.status.replace('_', ' ')}
                </Badge>
              </DialogTitle>
              <DialogDescription>{selectedDeal.description}</DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="marketing">Marketing</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Deal Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Type</span>
                        <span className="text-sm capitalize">{selectedDeal.type.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Discount</span>
                        <span className="text-sm font-medium">
                          {selectedDeal.discountType === 'percentage' && `${selectedDeal.discountValue}%`}
                          {selectedDeal.discountType === 'fixed_amount' && `₹${selectedDeal.discountValue}`}
                          {selectedDeal.discountType === 'buy_x_get_y' && `Buy 2 Get ${selectedDeal.discountValue} Free`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Min Order Value</span>
                        <span className="text-sm">₹{selectedDeal.minimumOrderValue || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Max Discount</span>
                        <span className="text-sm">₹{selectedDeal.maximumDiscount || 'No limit'}</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Schedule</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Start Date</span>
                        <span className="text-sm">{new Date(selectedDeal.schedule.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">End Date</span>
                        <span className="text-sm">{new Date(selectedDeal.schedule.endDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Time</span>
                        <span className="text-sm">{selectedDeal.schedule.startTime} - {selectedDeal.schedule.endTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Timezone</span>
                        <span className="text-sm">{selectedDeal.schedule.timezone}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Target Audience</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-muted-foreground">Customer Segments: </span>
                        <div className="flex gap-2 mt-1">
                          {selectedDeal.targetAudience.customerSegments.map(segment => (
                            <Badge key={segment} variant="outline">{segment}</Badge>
                          ))}
                        </div>
                      </div>
                      {selectedDeal.targetAudience.locationBased.length > 0 && (
                        <div>
                          <span className="text-sm text-muted-foreground">Locations: </span>
                          <div className="flex gap-2 mt-1">
                            {selectedDeal.targetAudience.locationBased.map(location => (
                              <Badge key={location} variant="outline">{location}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="products" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Deal Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Original Price</TableHead>
                          <TableHead>Deal Price</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Sold</TableHead>
                          <TableHead>Performance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedDeal.products.map((product) => {
                          const sellThrough = product.stock > 0 ? ((product.sold / product.stock) * 100).toFixed(1) : "0"
                          return (
                            <TableRow key={product.id}>
                              <TableCell className="font-medium">{product.name}</TableCell>
                              <TableCell>₹{product.originalPrice.toLocaleString()}</TableCell>
                              <TableCell className="font-medium text-green-600">
                                ₹{product.dealPrice.toLocaleString()}
                              </TableCell>
                              <TableCell>{product.stock}</TableCell>
                              <TableCell>{product.sold}</TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="text-sm">{sellThrough}% sold</div>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div 
                                      className="bg-green-600 h-1.5 rounded-full" 
                                      style={{ width: `${Math.min(parseFloat(sellThrough), 100)}%` }}
                                    />
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="performance" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Engagement Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Views</span>
                        <span className="text-sm font-medium">{selectedDeal.performance.views.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Clicks</span>
                        <span className="text-sm font-medium">{selectedDeal.performance.clicks.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Conversions</span>
                        <span className="text-sm font-medium">{selectedDeal.performance.conversions.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Conversion Rate</span>
                        <span className="text-sm font-medium">{selectedDeal.performance.conversionRate.toFixed(2)}%</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Revenue Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Revenue</span>
                        <span className="text-sm font-medium">₹{selectedDeal.performance.revenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Orders</span>
                        <span className="text-sm font-medium">{selectedDeal.performance.ordersGenerated.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Avg Order Value</span>
                        <span className="text-sm font-medium">₹{selectedDeal.performance.averageOrderValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">ROI</span>
                        <span className={`text-sm font-medium ${selectedDeal.performance.returnOnInvestment > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedDeal.performance.returnOnInvestment.toFixed(2)}x
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Budget Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Allocated</span>
                        <span className="text-sm">₹{selectedDeal.budget.allocated.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Spent</span>
                        <span className="text-sm font-medium">₹{selectedDeal.budget.spent.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Remaining</span>
                        <span className="text-sm">₹{(selectedDeal.budget.allocated - selectedDeal.budget.spent).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Cost per Acquisition</span>
                        <span className="text-sm">₹{selectedDeal.budget.costPerAcquisition}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="marketing" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Marketing Channels</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email Campaign</span>
                      <Badge variant={selectedDeal.marketing.emailCampaignSent ? "default" : "secondary"}>
                        {selectedDeal.marketing.emailCampaignSent ? "Sent" : "Not Sent"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Push Notifications</span>
                      <Badge variant={selectedDeal.marketing.pushNotificationSent ? "default" : "secondary"}>
                        {selectedDeal.marketing.pushNotificationSent ? "Sent" : "Not Sent"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Social Media Promotion</span>
                      <Badge variant={selectedDeal.marketing.socialMediaPromoted ? "default" : "secondary"}>
                        {selectedDeal.marketing.socialMediaPromoted ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Influencer Partnership</span>
                      <Badge variant={selectedDeal.marketing.influencerPartnership ? "default" : "secondary"}>
                        {selectedDeal.marketing.influencerPartnership ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Promotional Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label>Promotional Text</Label>
                      <div className="p-3 bg-gray-50 rounded-lg text-sm">
                        {selectedDeal.marketing.promotionalText}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}