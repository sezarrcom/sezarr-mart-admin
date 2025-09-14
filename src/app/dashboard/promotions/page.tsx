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
import { Checkbox } from "@/components/ui/checkbox"
import { useSession } from "next-auth/react"
import {
  Search, Filter, Download, Eye, Edit, Plus, Gift, Tag, Percent,
  Users, Calendar, Clock, CheckCircle, XCircle, AlertCircle,
  Settings, Zap, Target, BarChart3, TrendingUp, Activity, Share2,
  Copy, ExternalLink, QrCode, Smartphone, Mail, MessageSquare,
  Star, Heart, Award, Trophy, Crown, Sparkles, DollarSign, 
  ShoppingBag, Package, Truck, CreditCard, RefreshCw, Trash2
} from "lucide-react"

interface Coupon {
  id: string
  code: string
  name: string
  description: string
  type: 'percentage' | 'fixed' | 'free_shipping' | 'bogo'
  value: number
  minOrderValue?: number
  maxDiscount?: number
  status: 'active' | 'inactive' | 'expired' | 'paused'
  usageLimit?: number
  usageCount: number
  userLimit?: number
  validFrom: string
  validUntil: string
  applicableFor: 'all' | 'first_time' | 'existing' | 'premium'
  categories?: string[]
  products?: string[]
  excludeCategories?: string[]
  excludeProducts?: string[]
  createdBy: string
  createdDate: string
  analytics: {
    totalUsage: number
    totalDiscount: number
    revenue: number
    conversionRate: number
  }
}

interface Deal {
  id: string
  title: string
  description: string
  type: 'flash_sale' | 'daily_deal' | 'bundle' | 'clearance' | 'festival'
  discountType: 'percentage' | 'fixed'
  discountValue: number
  status: 'active' | 'inactive' | 'upcoming' | 'expired'
  startDate: string
  endDate: string
  products: string[]
  categories?: string[]
  minQuantity?: number
  maxQuantity?: number
  stockLimit?: number
  stockSold: number
  featured: boolean
  bannerImage?: string
  createdBy: string
  createdDate: string
  analytics: {
    views: number
    clicks: number
    orders: number
    revenue: number
    conversionRate: number
  }
}

interface ReferralProgram {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive' | 'paused'
  referrerReward: {
    type: 'fixed' | 'percentage' | 'coupon' | 'points'
    value: number
    maxReward?: number
  }
  refereeReward: {
    type: 'fixed' | 'percentage' | 'coupon' | 'points'
    value: number
    maxReward?: number
  }
  conditions: {
    minOrderValue?: number
    validityDays: number
    maxReferrals?: number
  }
  channels: Array<'app' | 'web' | 'social' | 'email' | 'sms'>
  startDate: string
  endDate?: string
  createdBy: string
  createdDate: string
  analytics: {
    totalReferrals: number
    successfulReferrals: number
    totalRewards: number
    revenue: number
    conversionRate: number
  }
}

interface LoyaltyProgram {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive'
  pointSystem: {
    earnRate: number // points per rupee spent
    redemptionRate: number // rupees per point
    minRedemption: number
    maxRedemption?: number
  }
  tiers: Array<{
    name: string
    minPoints: number
    benefits: string[]
    multiplier: number
  }>
  rewards: Array<{
    id: string
    name: string
    points: number
    type: 'discount' | 'product' | 'service'
    value: number
  }>
  expiry: {
    enabled: boolean
    days: number
  }
  createdDate: string
  analytics: {
    totalMembers: number
    activeMembers: number
    pointsIssued: number
    pointsRedeemed: number
    revenue: number
  }
}

export default function PromotionsPage() {
  const { data: session } = useSession()
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  const [referralPrograms, setReferralPrograms] = useState<ReferralProgram[]>([])
  const [loyaltyPrograms, setLoyaltyPrograms] = useState<LoyaltyProgram[]>([])
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [showCouponDialog, setShowCouponDialog] = useState(false)
  const [showDealDialog, setShowDealDialog] = useState(false)
  const [showReferralDialog, setShowReferralDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("coupons")

  // Mock data
  const mockCoupons: Coupon[] = [
    {
      id: "1",
      code: "WELCOME20",
      name: "Welcome Discount",
      description: "20% off on first order for new customers",
      type: "percentage",
      value: 20,
      minOrderValue: 500,
      maxDiscount: 200,
      status: "active",
      usageLimit: 1000,
      usageCount: 456,
      userLimit: 1,
      validFrom: "2024-01-01T00:00:00Z",
      validUntil: "2024-12-31T23:59:59Z",
      applicableFor: "first_time",
      createdBy: "admin@sezarrmart.com",
      createdDate: "2024-01-01T10:00:00Z",
      analytics: {
        totalUsage: 456,
        totalDiscount: 45600,
        revenue: 228000,
        conversionRate: 15.2
      }
    },
    {
      id: "2",
      code: "SAVE50",
      name: "Flat ₹50 Off",
      description: "Flat ₹50 discount on orders above ₹999",
      type: "fixed",
      value: 50,
      minOrderValue: 999,
      status: "active",
      usageLimit: 2000,
      usageCount: 1234,
      validFrom: "2024-01-15T00:00:00Z",
      validUntil: "2024-03-15T23:59:59Z",
      applicableFor: "all",
      createdBy: "admin@sezarrmart.com",
      createdDate: "2024-01-15T14:30:00Z",
      analytics: {
        totalUsage: 1234,
        totalDiscount: 61700,
        revenue: 1851000,
        conversionRate: 8.7
      }
    },
    {
      id: "3",
      code: "FREESHIP",
      name: "Free Shipping",
      description: "Free delivery on all orders",
      type: "free_shipping",
      value: 0,
      status: "active",
      usageCount: 3456,
      validFrom: "2024-01-01T00:00:00Z",
      validUntil: "2024-06-30T23:59:59Z",
      applicableFor: "all",
      createdBy: "marketing@sezarrmart.com",
      createdDate: "2024-01-01T15:00:00Z",
      analytics: {
        totalUsage: 3456,
        totalDiscount: 172800,
        revenue: 1728000,
        conversionRate: 12.4
      }
    }
  ]

  const mockDeals: Deal[] = [
    {
      id: "1",
      title: "Flash Sale - Electronics",
      description: "Up to 50% off on all electronic items",
      type: "flash_sale",
      discountType: "percentage",
      discountValue: 50,
      status: "active",
      startDate: "2024-01-20T10:00:00Z",
      endDate: "2024-01-22T23:59:59Z",
      products: ["laptop-123", "phone-456", "tablet-789"],
      categories: ["electronics"],
      stockLimit: 100,
      stockSold: 67,
      featured: true,
      bannerImage: "/images/flash-sale-banner.jpg",
      createdBy: "admin@sezarrmart.com",
      createdDate: "2024-01-18T11:00:00Z",
      analytics: {
        views: 15420,
        clicks: 2340,
        orders: 234,
        revenue: 1170000,
        conversionRate: 10.0
      }
    },
    {
      id: "2",
      title: "Bundle Deal - Fashion Combo",
      description: "Buy 2 Get 1 Free on all fashion items",
      type: "bundle",
      discountType: "percentage",
      discountValue: 33,
      status: "active",
      startDate: "2024-01-15T00:00:00Z",
      endDate: "2024-01-31T23:59:59Z",
      products: ["shirt-123", "jeans-456"],
      categories: ["fashion", "clothing"],
      minQuantity: 2,
      stockSold: 89,
      featured: false,
      createdBy: "marketing@sezarrmart.com",
      createdDate: "2024-01-12T16:30:00Z",
      analytics: {
        views: 8790,
        clicks: 1234,
        orders: 156,
        revenue: 468000,
        conversionRate: 12.6
      }
    }
  ]

  const mockReferralPrograms: ReferralProgram[] = [
    {
      id: "1",
      name: "Refer & Earn",
      description: "Refer friends and earn rewards for both of you",
      status: "active",
      referrerReward: {
        type: "fixed",
        value: 100,
        maxReward: 1000
      },
      refereeReward: {
        type: "percentage",
        value: 10,
        maxReward: 200
      },
      conditions: {
        minOrderValue: 500,
        validityDays: 30,
        maxReferrals: 10
      },
      channels: ["app", "web", "social"],
      startDate: "2024-01-01T00:00:00Z",
      createdBy: "admin@sezarrmart.com",
      createdDate: "2024-01-01T12:00:00Z",
      analytics: {
        totalReferrals: 2456,
        successfulReferrals: 1234,
        totalRewards: 246800,
        revenue: 1234000,
        conversionRate: 50.2
      }
    }
  ]

  const mockLoyaltyPrograms: LoyaltyProgram[] = [
    {
      id: "1",
      name: "Sezarr Points",
      description: "Earn points on every purchase and redeem for rewards",
      status: "active",
      pointSystem: {
        earnRate: 1, // 1 point per rupee
        redemptionRate: 1, // 1 rupee per point
        minRedemption: 100,
        maxRedemption: 5000
      },
      tiers: [
        {
          name: "Bronze",
          minPoints: 0,
          benefits: ["1x points", "Free shipping on orders above ₹999"],
          multiplier: 1
        },
        {
          name: "Silver",
          minPoints: 5000,
          benefits: ["1.5x points", "Free shipping on orders above ₹499", "Priority support"],
          multiplier: 1.5
        },
        {
          name: "Gold",
          minPoints: 15000,
          benefits: ["2x points", "Free shipping on all orders", "Exclusive deals", "Birthday rewards"],
          multiplier: 2
        }
      ],
      rewards: [
        {
          id: "1",
          name: "₹100 Discount",
          points: 100,
          type: "discount",
          value: 100
        },
        {
          id: "2",
          name: "₹500 Discount",
          points: 500,
          type: "discount",
          value: 500
        }
      ],
      expiry: {
        enabled: true,
        days: 365
      },
      createdDate: "2024-01-01T10:00:00Z",
      analytics: {
        totalMembers: 15420,
        activeMembers: 8956,
        pointsIssued: 2456780,
        pointsRedeemed: 456789,
        revenue: 12340000
      }
    }
  ]

  useEffect(() => {
    setCoupons(mockCoupons)
    setDeals(mockDeals)
    setReferralPrograms(mockReferralPrograms)
    setLoyaltyPrograms(mockLoyaltyPrograms)
  }, [])

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      expired: "bg-red-100 text-red-800",
      paused: "bg-yellow-100 text-yellow-800",
      upcoming: "bg-blue-100 text-blue-800"
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getTypeIcon = (type: string) => {
    const icons = {
      percentage: <Percent className="w-4 h-4" />,
      fixed: <DollarSign className="w-4 h-4" />,
      free_shipping: <Truck className="w-4 h-4" />,
      bogo: <Gift className="w-4 h-4" />,
      flash_sale: <Zap className="w-4 h-4" />,
      daily_deal: <Clock className="w-4 h-4" />,
      bundle: <Package className="w-4 h-4" />,
      clearance: <Tag className="w-4 h-4" />,
      festival: <Sparkles className="w-4 h-4" />
    }
    return icons[type as keyof typeof icons] || <Gift className="w-4 h-4" />
  }

  const getPromotionStats = () => {
    const totalCoupons = coupons.length
    const activeCoupons = coupons.filter(c => c.status === 'active').length
    const totalDeals = deals.length
    const activeDeals = deals.filter(d => d.status === 'active').length
    const totalRevenue = coupons.reduce((sum, c) => sum + c.analytics.revenue, 0) +
                        deals.reduce((sum, d) => sum + d.analytics.revenue, 0)
    const totalSavings = coupons.reduce((sum, c) => sum + c.analytics.totalDiscount, 0)

    return {
      totalCoupons,
      activeCoupons,
      totalDeals,
      activeDeals,
      totalRevenue,
      totalSavings
    }
  }

  const stats = getPromotionStats()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Promotions & Offers</h1>
          <p className="text-gray-600">Manage coupons, deals, referral programs, and loyalty rewards</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline"
            onClick={() => alert("Exporting promotions report...")}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={() => setShowCouponDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Promotion
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Coupons</p>
                <p className="text-2xl font-bold">{stats.activeCoupons}</p>
              </div>
              <Tag className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Deals</p>
                <p className="text-2xl font-bold">{stats.activeDeals}</p>
              </div>
              <Gift className="w-8 h-8 text-purple-600" />
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
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Savings</p>
                <p className="text-2xl font-bold">₹{(stats.totalSavings / 1000).toFixed(0)}K</p>
              </div>
              <DollarSign className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Referrals</p>
                <p className="text-2xl font-bold">{referralPrograms[0]?.analytics.totalReferrals || 0}</p>
              </div>
              <Users className="w-8 h-8 text-pink-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Loyalty Members</p>
                <p className="text-2xl font-bold">{loyaltyPrograms[0]?.analytics.totalMembers || 0}</p>
              </div>
              <Award className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
          <TabsTrigger value="deals">Deals & Sales</TabsTrigger>
          <TabsTrigger value="referral">Referral Program</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty Program</TabsTrigger>
        </TabsList>

        <TabsContent value="coupons" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Discount Coupons</CardTitle>
                  <CardDescription>Create and manage discount coupons for customers</CardDescription>
                </div>
                <Button onClick={() => setShowCouponDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Coupon
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Coupon Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell>
                        <div>
                          <div className="font-mono font-bold">{coupon.code}</div>
                          <div className="text-sm text-gray-500">{coupon.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(coupon.type)}
                          <span className="capitalize">{coupon.type.replace('_', ' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {coupon.type === 'percentage' ? (
                          <span>{coupon.value}% off</span>
                        ) : coupon.type === 'fixed' ? (
                          <span>₹{coupon.value} off</span>
                        ) : (
                          <span>Free shipping</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(coupon.status)}>
                          {coupon.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{coupon.usageCount} used</div>
                          {coupon.usageLimit && (
                            <div className="text-gray-500">of {coupon.usageLimit}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>₹{coupon.analytics.revenue.toLocaleString()}</TableCell>
                      <TableCell>{new Date(coupon.validUntil).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => setSelectedCoupon(coupon)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => alert(`Editing coupon: ${coupon.code}`)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => {
                              navigator.clipboard.writeText(coupon.code)
                              alert(`Coupon code ${coupon.code} copied to clipboard!`)
                            }}
                          >
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

        <TabsContent value="deals" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Deals & Flash Sales</CardTitle>
                  <CardDescription>Create time-limited deals and promotional campaigns</CardDescription>
                </div>
                <Button onClick={() => setShowDealDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Deal
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Deal</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deals.map((deal) => (
                    <TableRow key={deal.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {deal.featured && <Star className="w-4 h-4 text-yellow-500" />}
                          <div>
                            <div className="font-medium">{deal.title}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {deal.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(deal.type)}
                          <span className="capitalize">{deal.type.replace('_', ' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {deal.discountType === 'percentage' ? (
                          <span>{deal.discountValue}% off</span>
                        ) : (
                          <span>₹{deal.discountValue} off</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(deal.status)}>
                          {deal.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{deal.analytics.orders} orders</div>
                          <div className="text-gray-500">₹{deal.analytics.revenue.toLocaleString()}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{new Date(deal.startDate).toLocaleDateString()}</div>
                          <div className="text-gray-500">to {new Date(deal.endDate).toLocaleDateString()}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => setSelectedDeal(deal)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => alert(`Editing deal: ${deal.title}`)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => alert(`Viewing analytics for: ${deal.title}`)}
                          >
                            <BarChart3 className="w-4 h-4" />
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

        <TabsContent value="referral" className="space-y-4">
          {referralPrograms.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Referral Program</CardTitle>
                    <CardDescription>Manage customer referral campaigns and rewards</CardDescription>
                  </div>
                  <Button onClick={() => setShowReferralDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Program
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {referralPrograms.map((program) => (
                  <div key={program.id} className="border rounded-lg p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{program.name}</h3>
                        <p className="text-gray-600">{program.description}</p>
                      </div>
                      <Badge className={getStatusColor(program.status)}>
                        {program.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {program.analytics.totalReferrals}
                            </div>
                            <div className="text-sm text-gray-500">Total Referrals</div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {program.analytics.successfulReferrals}
                            </div>
                            <div className="text-sm text-gray-500">Successful</div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                              ₹{program.analytics.totalRewards.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">Total Rewards</div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">
                              {program.analytics.conversionRate}%
                            </div>
                            <div className="text-sm text-gray-500">Conversion Rate</div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">Referrer Rewards</h4>
                          <div className="text-2xl font-bold text-green-600">
                            {program.referrerReward.type === 'fixed' ? '₹' : ''}{program.referrerReward.value}{program.referrerReward.type === 'percentage' ? '%' : ''}
                          </div>
                          <div className="text-sm text-gray-500">
                            {program.referrerReward.type === 'fixed' ? 'Per successful referral' : 'Off on next order'}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">Referee Rewards</h4>
                          <div className="text-2xl font-bold text-blue-600">
                            {program.refereeReward.type === 'fixed' ? '₹' : ''}{program.refereeReward.value}{program.refereeReward.type === 'percentage' ? '%' : ''}
                          </div>
                          <div className="text-sm text-gray-500">
                            {program.refereeReward.type === 'fixed' ? 'On first order' : 'Off on first order'}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="loyalty" className="space-y-4">
          {loyaltyPrograms.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Loyalty Program</CardTitle>
                <CardDescription>Manage customer loyalty points and tier benefits</CardDescription>
              </CardHeader>
              <CardContent>
                {loyaltyPrograms.map((program) => (
                  <div key={program.id} className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{program.name}</h3>
                        <p className="text-gray-600">{program.description}</p>
                      </div>
                      <Badge className={getStatusColor(program.status)}>
                        {program.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {program.analytics.totalMembers.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">Total Members</div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {program.analytics.activeMembers.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">Active Members</div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                              {(program.analytics.pointsIssued / 1000).toFixed(0)}K
                            </div>
                            <div className="text-sm text-gray-500">Points Issued</div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">
                              {(program.analytics.pointsRedeemed / 1000).toFixed(0)}K
                            </div>
                            <div className="text-sm text-gray-500">Points Redeemed</div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">
                              ₹{(program.analytics.revenue / 100000).toFixed(1)}L
                            </div>
                            <div className="text-sm text-gray-500">Revenue</div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <h4 className="font-medium mb-4">Loyalty Tiers</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {program.tiers.map((tier, index) => (
                          <Card key={index}>
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-2 mb-2">
                                {index === 0 ? (
                                  <Award className="w-5 h-5 text-amber-600" />
                                ) : index === 1 ? (
                                  <Trophy className="w-5 h-5 text-gray-400" />
                                ) : (
                                  <Crown className="w-5 h-5 text-yellow-500" />
                                )}
                                <h5 className="font-medium">{tier.name}</h5>
                              </div>
                              <div className="text-sm text-gray-600 mb-2">
                                {tier.minPoints.toLocaleString()}+ points
                              </div>
                              <div className="text-xs space-y-1">
                                {tier.benefits.map((benefit, idx) => (
                                  <div key={idx} className="flex items-center space-x-1">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    <span>{benefit}</span>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}