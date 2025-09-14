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
  Search, Filter, Download, Eye, Edit, Plus, Image, Monitor,
  Smartphone, Tablet, TrendingUp, Calendar, Clock, MousePointer,
  BarChart3, Activity, CheckCircle, XCircle, AlertTriangle,
  Target, Users, ShoppingCart, ExternalLink, Copy, Pause,
  Play, RotateCcw, Settings, Zap, Globe, MapPin, Layers
} from "lucide-react"

interface Banner {
  id: string
  title: string
  description: string
  type: 'hero' | 'promotional' | 'category' | 'product' | 'announcement' | 'seasonal' | 'flash_sale'
  placement: 'home_hero' | 'home_secondary' | 'category_top' | 'product_sidebar' | 'checkout' | 'footer' | 'popup' | 'sticky'
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'expired' | 'archived'
  priority: number
  content: {
    headline: string
    subheadline?: string
    callToAction: string
    ctaUrl: string
    backgroundColor: string
    textColor: string
    buttonColor: string
    overlayOpacity?: number
  }
  media: {
    desktop: {
      image: string
      width: number
      height: number
      alt: string
    }
    mobile: {
      image: string
      width: number
      height: number
      alt: string
    }
    tablet?: {
      image: string
      width: number
      height: number
      alt: string
    }
  }
  targeting: {
    audiences: string[]
    locations?: string[]
    devices: string[]
    timeSlots?: string[]
    customerSegments?: string[]
    newCustomersOnly: boolean
    vipCustomersOnly: boolean
  }
  schedule: {
    startDate: string
    endDate?: string
    startTime: string
    endTime?: string
    timezone: string
    recurringType?: 'daily' | 'weekly' | 'monthly'
    recurringDays?: number[]
  }
  campaign: {
    name?: string
    budget?: number
    costModel: 'cpm' | 'cpc' | 'cpa' | 'flat_rate'
    maxImpressions?: number
    frequencyCap?: number
    linkedProducts?: string[]
    linkedCategories?: string[]
  }
  performance: {
    impressions: number
    clicks: number
    conversions: number
    revenue: number
    clickThroughRate: number
    conversionRate: number
    costPerClick: number
    returnOnAdSpend: number
    engagementTime: number
  }
  abTesting?: {
    isActive: boolean
    variants: {
      id: string
      name: string
      traffic: number
      performance: {
        impressions: number
        clicks: number
        conversions: number
        ctr: number
      }
    }[]
    winningVariant?: string
    confidenceLevel: number
  }
  createdBy: string
  approvedBy?: string
  createdDate: string
  updatedDate: string
  publishedDate?: string
}

export default function BannersPage() {
  const { data: session } = useSession()
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [placementFilter, setPlacementFilter] = useState<string>("all")
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      // Mock data for development
      const mockBanners: Banner[] = [
        {
          id: "1",
          title: "New Year Mega Sale Hero Banner",
          description: "Main homepage hero banner promoting the New Year sale with up to 70% discounts across all categories.",
          type: "hero",
          placement: "home_hero",
          status: "active",
          priority: 1,
          content: {
            headline: "New Year Mega Sale",
            subheadline: "Up to 70% OFF on Everything",
            callToAction: "Shop Now",
            ctaUrl: "/sale/new-year",
            backgroundColor: "#FF6B6B",
            textColor: "#FFFFFF",
            buttonColor: "#FFD93D",
            overlayOpacity: 0.6
          },
          media: {
            desktop: {
              image: "/banners/new-year-sale-desktop.jpg",
              width: 1920,
              height: 600,
              alt: "New Year Mega Sale Banner"
            },
            mobile: {
              image: "/banners/new-year-sale-mobile.jpg",
              width: 375,
              height: 300,
              alt: "New Year Mega Sale Mobile Banner"
            },
            tablet: {
              image: "/banners/new-year-sale-tablet.jpg",
              width: 768,
              height: 400,
              alt: "New Year Mega Sale Tablet Banner"
            }
          },
          targeting: {
            audiences: ["All Users"],
            locations: ["India", "USA", "UK"],
            devices: ["desktop", "mobile", "tablet"],
            timeSlots: ["00:00-23:59"],
            customerSegments: ["All Customers"],
            newCustomersOnly: false,
            vipCustomersOnly: false
          },
          schedule: {
            startDate: "2025-01-01",
            endDate: "2025-01-31",
            startTime: "00:00",
            endTime: "23:59",
            timezone: "Asia/Kolkata"
          },
          campaign: {
            name: "New Year 2025 Campaign",
            budget: 500000,
            costModel: "cpm",
            maxImpressions: 1000000,
            frequencyCap: 3,
            linkedProducts: ["PROD-001", "PROD-002", "PROD-003"],
            linkedCategories: ["Electronics", "Fashion", "Home"]
          },
          performance: {
            impressions: 456789,
            clicks: 23456,
            conversions: 1234,
            revenue: 2345678,
            clickThroughRate: 5.14,
            conversionRate: 5.26,
            costPerClick: 12.50,
            returnOnAdSpend: 4.7,
            engagementTime: 45.6
          },
          abTesting: {
            isActive: true,
            variants: [
              {
                id: "A",
                name: "Original Red Theme",
                traffic: 50,
                performance: {
                  impressions: 228394,
                  clicks: 11728,
                  conversions: 617,
                  ctr: 5.14
                }
              },
              {
                id: "B",
                name: "Blue Theme Variant",
                traffic: 50,
                performance: {
                  impressions: 228395,
                  clicks: 11728,
                  conversions: 617,
                  ctr: 5.14
                }
              }
            ],
            winningVariant: "A",
            confidenceLevel: 95.2
          },
          createdBy: "Marketing Team",
          approvedBy: "Creative Director",
          createdDate: "2024-12-15T10:00:00Z",
          updatedDate: "2025-01-19T08:30:00Z",
          publishedDate: "2025-01-01T00:00:00Z"
        },
        {
          id: "2",
          title: "Electronics Category Promotion",
          description: "Category page banner highlighting latest electronics with special financing offers and warranty extensions.",
          type: "promotional",
          placement: "category_top",
          status: "active",
          priority: 2,
          content: {
            headline: "Latest Electronics",
            subheadline: "0% EMI + Extended Warranty",
            callToAction: "Explore Deals",
            ctaUrl: "/category/electronics",
            backgroundColor: "#4A90E2",
            textColor: "#FFFFFF",
            buttonColor: "#50E3C2"
          },
          media: {
            desktop: {
              image: "/banners/electronics-promo-desktop.jpg",
              width: 1200,
              height: 300,
              alt: "Electronics Promotion Banner"
            },
            mobile: {
              image: "/banners/electronics-promo-mobile.jpg",
              width: 375,
              height: 200,
              alt: "Electronics Promotion Mobile Banner"
            }
          },
          targeting: {
            audiences: ["Tech Enthusiasts", "Electronics Shoppers"],
            devices: ["desktop", "mobile"],
            customerSegments: ["Premium Buyers", "Frequent Shoppers"],
            newCustomersOnly: false,
            vipCustomersOnly: false
          },
          schedule: {
            startDate: "2025-01-15",
            endDate: "2025-02-15",
            startTime: "08:00",
            endTime: "22:00",
            timezone: "Asia/Kolkata"
          },
          campaign: {
            name: "Electronics Push Q1",
            budget: 200000,
            costModel: "cpc",
            maxImpressions: 500000,
            frequencyCap: 5,
            linkedCategories: ["Electronics", "Smartphones", "Laptops"]
          },
          performance: {
            impressions: 234567,
            clicks: 15678,
            conversions: 789,
            revenue: 1234567,
            clickThroughRate: 6.69,
            conversionRate: 5.03,
            costPerClick: 8.75,
            returnOnAdSpend: 6.2,
            engagementTime: 32.4
          },
          createdBy: "Electronics Team",
          approvedBy: "Category Manager",
          createdDate: "2025-01-10T14:00:00Z",
          updatedDate: "2025-01-19T10:00:00Z",
          publishedDate: "2025-01-15T08:00:00Z"
        },
        {
          id: "3",
          title: "Fashion Week Announcement",
          description: "Announcement banner for upcoming fashion week collection launch with early bird access for VIP customers.",
          type: "announcement",
          placement: "home_secondary",
          status: "scheduled",
          priority: 3,
          content: {
            headline: "Fashion Week Collection",
            subheadline: "Early Access for VIP Members",
            callToAction: "Get Notified",
            ctaUrl: "/fashion-week/notify",
            backgroundColor: "#9013FE",
            textColor: "#FFFFFF",
            buttonColor: "#FF4081"
          },
          media: {
            desktop: {
              image: "/banners/fashion-week-desktop.jpg",
              width: 800,
              height: 400,
              alt: "Fashion Week Announcement"
            },
            mobile: {
              image: "/banners/fashion-week-mobile.jpg",
              width: 375,
              height: 250,
              alt: "Fashion Week Mobile Announcement"
            }
          },
          targeting: {
            audiences: ["Fashion Enthusiasts", "Trendsetters"],
            devices: ["desktop", "mobile", "tablet"],
            customerSegments: ["VIP Customers", "Fashion Lovers"],
            newCustomersOnly: false,
            vipCustomersOnly: true
          },
          schedule: {
            startDate: "2025-02-01",
            endDate: "2025-02-28",
            startTime: "00:00",
            endTime: "23:59",
            timezone: "Asia/Kolkata"
          },
          campaign: {
            name: "Fashion Week Launch",
            budget: 300000,
            costModel: "cpm",
            maxImpressions: 750000,
            frequencyCap: 2,
            linkedCategories: ["Fashion", "Designer Wear", "Accessories"]
          },
          performance: {
            impressions: 0,
            clicks: 0,
            conversions: 0,
            revenue: 0,
            clickThroughRate: 0,
            conversionRate: 0,
            costPerClick: 0,
            returnOnAdSpend: 0,
            engagementTime: 0
          },
          createdBy: "Fashion Team",
          createdDate: "2025-01-18T16:00:00Z",
          updatedDate: "2025-01-18T16:00:00Z"
        },
        {
          id: "4",
          title: "Flash Sale Popup Banner",
          description: "Urgent flash sale popup banner with countdown timer to create urgency and drive immediate purchases.",
          type: "flash_sale",
          placement: "popup",
          status: "active",
          priority: 5,
          content: {
            headline: "⚡ Flash Sale Alert!",
            subheadline: "24 Hours Only - Don't Miss Out!",
            callToAction: "Shop Flash Sale",
            ctaUrl: "/flash-sale",
            backgroundColor: "#FF5722",
            textColor: "#FFFFFF",
            buttonColor: "#FFC107"
          },
          media: {
            desktop: {
              image: "/banners/flash-sale-popup.jpg",
              width: 600,
              height: 400,
              alt: "Flash Sale Popup"
            },
            mobile: {
              image: "/banners/flash-sale-popup-mobile.jpg",
              width: 320,
              height: 240,
              alt: "Flash Sale Mobile Popup"
            }
          },
          targeting: {
            audiences: ["Bargain Hunters", "Deal Seekers"],
            devices: ["desktop", "mobile"],
            timeSlots: ["10:00-22:00"],
            customerSegments: ["Active Shoppers"],
            newCustomersOnly: false,
            vipCustomersOnly: false
          },
          schedule: {
            startDate: "2025-01-20",
            endDate: "2025-01-20",
            startTime: "10:00",
            endTime: "22:00",
            timezone: "Asia/Kolkata"
          },
          campaign: {
            name: "Flash Sale Burst",
            budget: 50000,
            costModel: "cpa",
            maxImpressions: 200000,
            frequencyCap: 1,
            linkedProducts: ["PROD-004", "PROD-005"]
          },
          performance: {
            impressions: 89456,
            clicks: 8945,
            conversions: 447,
            revenue: 223500,
            clickThroughRate: 10.0,
            conversionRate: 5.0,
            costPerClick: 5.59,
            returnOnAdSpend: 4.47,
            engagementTime: 15.3
          },
          createdBy: "Promotions Team",
          approvedBy: "Marketing Director",
          createdDate: "2025-01-19T09:00:00Z",
          updatedDate: "2025-01-19T12:00:00Z",
          publishedDate: "2025-01-20T10:00:00Z"
        }
      ]

      setBanners(mockBanners)
    } catch (error) {
      console.error("Error fetching banners:", error)
    } finally {
      setLoading(false)
    }
  }

  // Handler functions for banner actions
  const handleEditBanner = (banner: Banner) => {
    console.log("Editing banner:", banner.title)
    // TODO: Implement edit functionality
    alert(`Edit banner: ${banner.title}`)
  }

  const handleToggleBannerStatus = (banner: Banner) => {
    const newStatus = banner.status === 'active' ? 'paused' : 'active'
    setBanners(prev => prev.map(b => 
      b.id === banner.id ? { ...b, status: newStatus } : b
    ))
    console.log(`Banner ${banner.title} ${newStatus}`)
  }

  const handleDuplicateBanner = (banner: Banner) => {
    const duplicatedBanner: Banner = {
      ...banner,
      id: Math.random().toString(36).substr(2, 9),
      title: `${banner.title} (Copy)`,
      status: 'draft'
    }
    setBanners(prev => [duplicatedBanner, ...prev])
    console.log("Banner duplicated:", duplicatedBanner.title)
  }

  const handleExportAnalytics = () => {
    console.log("Exporting banner analytics...")
    // TODO: Implement actual export functionality
    alert("Banner analytics export started! Check your downloads folder.")
  }

  // Filter banners
  const filteredBanners = banners.filter(banner => {
    const matchesSearch = 
      banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      banner.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      banner.content.headline.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || banner.status === statusFilter
    const matchesType = typeFilter === "all" || banner.type === typeFilter
    const matchesPlacement = placementFilter === "all" || banner.placement === placementFilter
    
    return matchesSearch && matchesStatus && matchesType && matchesPlacement
  })

  const getStatusBadge = (status: string) => {
    const colors = {
      'draft': 'bg-gray-100 text-gray-800',
      'scheduled': 'bg-blue-100 text-blue-800',
      'active': 'bg-green-100 text-green-800',
      'paused': 'bg-yellow-100 text-yellow-800',
      'expired': 'bg-red-100 text-red-800',
      'archived': 'bg-gray-100 text-gray-600'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getTypeIcon = (type: string) => {
    const icons = {
      'hero': Monitor,
      'promotional': Target,
      'category': Layers,
      'product': ShoppingCart,
      'announcement': AlertTriangle,
      'seasonal': Calendar,
      'flash_sale': Zap
    }
    return icons[type as keyof typeof icons] || Image
  }

  const getPlacementIcon = (placement: string) => {
    const icons = {
      'home_hero': Monitor,
      'home_secondary': Layers,
      'category_top': Target,
      'product_sidebar': ShoppingCart,
      'checkout': CheckCircle,
      'footer': Globe,
      'popup': ExternalLink,
      'sticky': Pin
    }
    return icons[placement as keyof typeof icons] || MapPin
  }

  const getTotalStats = () => {
    return banners.reduce((acc, banner) => ({
      totalBanners: acc.totalBanners + 1,
      activeBanners: acc.activeBanners + (banner.status === 'active' ? 1 : 0),
      totalImpressions: acc.totalImpressions + banner.performance.impressions,
      totalClicks: acc.totalClicks + banner.performance.clicks,
      totalConversions: acc.totalConversions + banner.performance.conversions,
      totalRevenue: acc.totalRevenue + banner.performance.revenue
    }), { 
      totalBanners: 0, 
      activeBanners: 0, 
      totalImpressions: 0, 
      totalClicks: 0, 
      totalConversions: 0, 
      totalRevenue: 0 
    })
  }

  const stats = getTotalStats()
  const avgCTR = stats.totalImpressions > 0 ? ((stats.totalClicks / stats.totalImpressions) * 100).toFixed(2) : 0
  const avgConversionRate = stats.totalClicks > 0 ? ((stats.totalConversions / stats.totalClicks) * 100).toFixed(2) : 0

  if (!session) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>Please sign in to access banner management.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Banner Management</h1>
          <p className="text-muted-foreground text-lg">Create and manage marketing banners across all platforms</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExportAnalytics}>
            <Download className="mr-2 h-4 w-4" />
            Export Analytics
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Banner
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create New Banner</DialogTitle>
                <DialogDescription>Design and configure a new marketing banner</DialogDescription>
              </DialogHeader>
              <div className="text-center py-8 text-muted-foreground">
                Banner creation wizard would be implemented here
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Banners</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBanners}</div>
            <p className="text-xs text-muted-foreground">All campaigns</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Banners</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeBanners}</div>
            <p className="text-xs text-muted-foreground">Currently live</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impressions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats.totalImpressions / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Total views</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCTR}%</div>
            <p className="text-xs text-muted-foreground">Average CTR</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalConversions}</div>
            <p className="text-xs text-muted-foreground">{avgConversionRate}% rate</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(stats.totalRevenue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Generated</p>
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
                  placeholder="Search banners..."
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
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="hero">Hero Banner</SelectItem>
                  <SelectItem value="promotional">Promotional</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                  <SelectItem value="seasonal">Seasonal</SelectItem>
                  <SelectItem value="flash_sale">Flash Sale</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={placementFilter} onValueChange={setPlacementFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Placement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Placements</SelectItem>
                  <SelectItem value="home_hero">Home Hero</SelectItem>
                  <SelectItem value="home_secondary">Home Secondary</SelectItem>
                  <SelectItem value="category_top">Category Top</SelectItem>
                  <SelectItem value="product_sidebar">Product Sidebar</SelectItem>
                  <SelectItem value="checkout">Checkout</SelectItem>
                  <SelectItem value="footer">Footer</SelectItem>
                  <SelectItem value="popup">Popup</SelectItem>
                  <SelectItem value="sticky">Sticky</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Banners Table */}
      <Card>
        <CardHeader>
          <CardTitle>Marketing Banners ({filteredBanners.length})</CardTitle>
          <CardDescription>
            {loading ? "Loading banners..." : `Showing ${filteredBanners.length} of ${banners.length} banners`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading banners...</div>
          ) : filteredBanners.length === 0 ? (
            <div className="text-center py-8">No banners found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Banner Details</TableHead>
                  <TableHead>Type & Placement</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>A/B Testing</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBanners.map((banner) => {
                  const TypeIcon = getTypeIcon(banner.type)
                  const PlacementIcon = getPlacementIcon(banner.placement)
                  const isActive = banner.status === 'active'
                  
                  return (
                    <TableRow key={banner.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{banner.title}</div>
                          <div className="text-sm text-muted-foreground max-w-[200px] truncate">
                            {banner.description}
                          </div>
                          <div className="text-sm font-medium text-blue-600">
                            {banner.content.headline}
                          </div>
                          {banner.content.subheadline && (
                            <div className="text-xs text-muted-foreground">
                              {banner.content.subheadline}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <TypeIcon className="h-4 w-4" />
                            <Badge variant="outline" className="text-xs">
                              {banner.type.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <PlacementIcon className="h-4 w-4" />
                            <Badge variant="secondary" className="text-xs">
                              {banner.placement.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Priority: {banner.priority}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            {new Date(banner.schedule.startDate).toLocaleDateString()}
                            {banner.schedule.endDate && (
                              <span> - {new Date(banner.schedule.endDate).toLocaleDateString()}</span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {banner.schedule.startTime}
                            {banner.schedule.endTime && ` - ${banner.schedule.endTime}`}
                          </div>
                          {banner.schedule.recurringType && (
                            <Badge variant="outline" className="text-xs">
                              {banner.schedule.recurringType}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            {(banner.performance.impressions / 1000).toFixed(0)}K views
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {banner.performance.clicks} clicks
                          </div>
                          <div className="text-xs font-medium text-green-600">
                            {banner.performance.clickThroughRate.toFixed(2)}% CTR
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ₹{(banner.performance.revenue / 1000).toFixed(0)}K revenue
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {banner.abTesting?.isActive ? (
                            <>
                              <Badge variant="default" className="text-xs">
                                Testing Active
                              </Badge>
                              <div className="text-xs text-muted-foreground">
                                {banner.abTesting.variants.length} variants
                              </div>
                              {banner.abTesting.winningVariant && (
                                <div className="text-xs font-medium text-green-600">
                                  Winner: {banner.abTesting.winningVariant}
                                </div>
                              )}
                              <div className="text-xs text-muted-foreground">
                                {banner.abTesting.confidenceLevel}% confidence
                              </div>
                            </>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              No Testing
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge 
                            variant="outline"
                            className={getStatusBadge(banner.status)}
                          >
                            {banner.status.replace('_', ' ')}
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
                            onClick={() => setSelectedBanner(banner)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditBanner(banner)}
                            title="Edit Banner"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {isActive ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleBannerStatus(banner)}
                              title="Pause Banner"
                            >
                              <Pause className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleBannerStatus(banner)}
                              title="Activate Banner"
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDuplicateBanner(banner)}
                            title="Duplicate Banner"
                          >
                            <Copy className="h-4 w-4" />
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

      {/* Banner Details Dialog */}
      {selectedBanner && (
        <Dialog open={!!selectedBanner} onOpenChange={() => setSelectedBanner(null)}>
          <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedBanner.title}</span>
                <Badge variant="outline" className={getStatusBadge(selectedBanner.status)}>
                  {selectedBanner.status.replace('_', ' ')}
                </Badge>
              </DialogTitle>
              <DialogDescription>{selectedBanner.description}</DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="design">Design</TabsTrigger>
                <TabsTrigger value="targeting">Targeting</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="testing">A/B Testing</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Banner Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Type</span>
                        <span className="text-sm capitalize">{selectedBanner.type.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Placement</span>
                        <span className="text-sm capitalize">{selectedBanner.placement.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Priority</span>
                        <span className="text-sm">{selectedBanner.priority}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Created By</span>
                        <span className="text-sm">{selectedBanner.createdBy}</span>
                      </div>
                      {selectedBanner.approvedBy && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Approved By</span>
                          <span className="text-sm">{selectedBanner.approvedBy}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Campaign Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {selectedBanner.campaign.name && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Campaign</span>
                          <span className="text-sm">{selectedBanner.campaign.name}</span>
                        </div>
                      )}
                      {selectedBanner.campaign.budget && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Budget</span>
                          <span className="text-sm">₹{selectedBanner.campaign.budget.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Cost Model</span>
                        <span className="text-sm uppercase">{selectedBanner.campaign.costModel}</span>
                      </div>
                      {selectedBanner.campaign.maxImpressions && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Max Impressions</span>
                          <span className="text-sm">{selectedBanner.campaign.maxImpressions.toLocaleString()}</span>
                        </div>
                      )}
                      {selectedBanner.campaign.frequencyCap && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Frequency Cap</span>
                          <span className="text-sm">{selectedBanner.campaign.frequencyCap} per user</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="design" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Content</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Headline</Label>
                        <div className="text-lg font-bold" style={{ color: selectedBanner.content.textColor }}>
                          {selectedBanner.content.headline}
                        </div>
                      </div>
                      {selectedBanner.content.subheadline && (
                        <div>
                          <Label className="text-sm font-medium">Subheadline</Label>
                          <div className="text-sm" style={{ color: selectedBanner.content.textColor }}>
                            {selectedBanner.content.subheadline}
                          </div>
                        </div>
                      )}
                      <div>
                        <Label className="text-sm font-medium">Call to Action</Label>
                        <div className="inline-block px-4 py-2 rounded-md text-sm font-medium"
                             style={{ 
                               backgroundColor: selectedBanner.content.buttonColor,
                               color: '#000'
                             }}>
                          {selectedBanner.content.callToAction}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">CTA URL</Label>
                        <div className="text-sm font-mono bg-gray-100 p-2 rounded">
                          {selectedBanner.content.ctaUrl}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Design Properties</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-sm font-medium">Background</Label>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded border"
                              style={{ backgroundColor: selectedBanner.content.backgroundColor }}
                            />
                            <span className="text-sm">{selectedBanner.content.backgroundColor}</span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Text Color</Label>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded border"
                              style={{ backgroundColor: selectedBanner.content.textColor }}
                            />
                            <span className="text-sm">{selectedBanner.content.textColor}</span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Button Color</Label>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded border"
                              style={{ backgroundColor: selectedBanner.content.buttonColor }}
                            />
                            <span className="text-sm">{selectedBanner.content.buttonColor}</span>
                          </div>
                        </div>
                        {selectedBanner.content.overlayOpacity && (
                          <div>
                            <Label className="text-sm font-medium">Overlay Opacity</Label>
                            <span className="text-sm">{(selectedBanner.content.overlayOpacity * 100).toFixed(0)}%</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Media Assets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Desktop</Label>
                        <div className="mt-1 p-3 border rounded-lg">
                          <div className="text-xs text-muted-foreground">
                            {selectedBanner.media.desktop.width} × {selectedBanner.media.desktop.height}
                          </div>
                          <div className="text-sm truncate">{selectedBanner.media.desktop.image}</div>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Mobile</Label>
                        <div className="mt-1 p-3 border rounded-lg">
                          <div className="text-xs text-muted-foreground">
                            {selectedBanner.media.mobile.width} × {selectedBanner.media.mobile.height}
                          </div>
                          <div className="text-sm truncate">{selectedBanner.media.mobile.image}</div>
                        </div>
                      </div>
                      {selectedBanner.media.tablet && (
                        <div>
                          <Label className="text-sm font-medium">Tablet</Label>
                          <div className="mt-1 p-3 border rounded-lg">
                            <div className="text-xs text-muted-foreground">
                              {selectedBanner.media.tablet.width} × {selectedBanner.media.tablet.height}
                            </div>
                            <div className="text-sm truncate">{selectedBanner.media.tablet.image}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="targeting" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Audience Targeting</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Target Audiences</Label>
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {selectedBanner.targeting.audiences.map(audience => (
                            <Badge key={audience} variant="outline">{audience}</Badge>
                          ))}
                        </div>
                      </div>
                      {selectedBanner.targeting.customerSegments && (
                        <div>
                          <Label className="text-sm font-medium">Customer Segments</Label>
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {selectedBanner.targeting.customerSegments.map(segment => (
                              <Badge key={segment} variant="secondary">{segment}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">New Customers Only</span>
                          <Badge variant={selectedBanner.targeting.newCustomersOnly ? "default" : "secondary"}>
                            {selectedBanner.targeting.newCustomersOnly ? "Yes" : "No"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">VIP Customers Only</span>
                          <Badge variant={selectedBanner.targeting.vipCustomersOnly ? "default" : "secondary"}>
                            {selectedBanner.targeting.vipCustomersOnly ? "Yes" : "No"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Technical Targeting</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Devices</Label>
                        <div className="flex gap-1 mt-1">
                          {selectedBanner.targeting.devices.map(device => (
                            <Badge key={device} variant="outline" className="capitalize">{device}</Badge>
                          ))}
                        </div>
                      </div>
                      {selectedBanner.targeting.locations && selectedBanner.targeting.locations.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium">Locations</Label>
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {selectedBanner.targeting.locations.map(location => (
                              <Badge key={location} variant="secondary">{location}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedBanner.targeting.timeSlots && (
                        <div>
                          <Label className="text-sm font-medium">Time Slots</Label>
                          <div className="flex gap-1 mt-1">
                            {selectedBanner.targeting.timeSlots.map(slot => (
                              <Badge key={slot} variant="outline">{slot}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="performance" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Impressions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedBanner.performance.impressions.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">Total views</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Clicks</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedBanner.performance.clicks.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">{selectedBanner.performance.clickThroughRate.toFixed(2)}% CTR</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Conversions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedBanner.performance.conversions.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">{selectedBanner.performance.conversionRate.toFixed(2)}% rate</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₹{(selectedBanner.performance.revenue / 1000).toFixed(0)}K</div>
                      <p className="text-xs text-muted-foreground">{selectedBanner.performance.returnOnAdSpend.toFixed(1)}x ROAS</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Cost Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Cost per Click</span>
                        <span className="text-sm font-medium">₹{selectedBanner.performance.costPerClick}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Return on Ad Spend</span>
                        <span className="text-sm font-medium">{selectedBanner.performance.returnOnAdSpend.toFixed(2)}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Avg Engagement Time</span>
                        <span className="text-sm font-medium">{selectedBanner.performance.engagementTime}s</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Schedule & Budget</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Start Date</span>
                        <span className="text-sm">{new Date(selectedBanner.schedule.startDate).toLocaleDateString()}</span>
                      </div>
                      {selectedBanner.schedule.endDate && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">End Date</span>
                          <span className="text-sm">{new Date(selectedBanner.schedule.endDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {selectedBanner.campaign.budget && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Budget</span>
                          <span className="text-sm font-medium">₹{selectedBanner.campaign.budget.toLocaleString()}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="testing" className="space-y-4">
                {selectedBanner.abTesting?.isActive ? (
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">A/B Test Results</CardTitle>
                        <CardDescription>
                          Confidence Level: {selectedBanner.abTesting.confidenceLevel}%
                          {selectedBanner.abTesting.winningVariant && (
                            <span className="ml-2 text-green-600 font-medium">
                              Winner: Variant {selectedBanner.abTesting.winningVariant}
                            </span>
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Variant</TableHead>
                              <TableHead>Traffic %</TableHead>
                              <TableHead>Impressions</TableHead>
                              <TableHead>Clicks</TableHead>
                              <TableHead>CTR</TableHead>
                              <TableHead>Conversions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedBanner.abTesting.variants.map((variant) => (
                              <TableRow 
                                key={variant.id}
                                className={variant.id === selectedBanner.abTesting?.winningVariant ? 'bg-green-50' : ''}
                              >
                                <TableCell className="font-medium">
                                  {variant.name}
                                  {variant.id === selectedBanner.abTesting?.winningVariant && (
                                    <Badge className="ml-2" variant="default">Winner</Badge>
                                  )}
                                </TableCell>
                                <TableCell>{variant.traffic}%</TableCell>
                                <TableCell>{variant.performance.impressions.toLocaleString()}</TableCell>
                                <TableCell>{variant.performance.clicks.toLocaleString()}</TableCell>
                                <TableCell>{variant.performance.ctr.toFixed(2)}%</TableCell>
                                <TableCell>{variant.performance.conversions.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-8">
                        <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No A/B Testing Active</h3>
                        <p className="text-muted-foreground">
                          This banner is not currently running any A/B tests.
                        </p>
                        <Button 
                          className="mt-4" 
                          variant="outline"
                          onClick={() => alert("Opening A/B test configuration...")}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Set Up A/B Test
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function Pin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="17" x2="12" y2="22" />
      <path d="m5 17 7-7 7 7" />
      <path d="m12 3 0 14" />
    </svg>
  )
}