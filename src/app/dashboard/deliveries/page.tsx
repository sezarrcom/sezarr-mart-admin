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
  Search, Filter, Download, Eye, Edit, Plus, Truck, MapPin,
  Navigation, Clock, User, Phone, Package, CheckCircle,
  XCircle, AlertTriangle, Timer, RotateCcw, Star,
  Calendar, Route, Building2, Home, Smartphone
} from "lucide-react"

interface Delivery {
  id: string
  orderId: string
  trackingNumber: string
  customerName: string
  customerPhone: string
  deliveryAddress: {
    street: string
    landmark?: string
    city: string
    state: string
    pincode: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  status: 'pending' | 'assigned' | 'picked_up' | 'out_for_delivery' | 'delivered' | 'failed' | 'returned' | 'cancelled'
  type: 'standard' | 'express' | 'same_day' | 'next_day' | 'scheduled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  deliveryPartner: {
    id: string
    name: string
    phone: string
    vehicleType: 'bike' | 'scooter' | 'car' | 'van' | 'truck'
    vehicleNumber: string
    rating: number
  }
  timeline: {
    orderPlaced: string
    assigned?: string
    pickedUp?: string
    outForDelivery?: string
    delivered?: string
    failed?: string
    returned?: string
  }
  deliverySlot: {
    date: string
    timeSlot: string
    isFlexible: boolean
  }
  deliveryDetails: {
    attempts: number
    maxAttempts: number
    estimatedTime: string
    actualDeliveryTime?: string
    deliveryInstructions?: string
    otp?: string
    signature?: boolean
    photo?: boolean
  }
  packageInfo: {
    weight: number
    dimensions: {
      length: number
      width: number
      height: number
    }
    fragile: boolean
    codAmount?: number
    insured: boolean
    insuranceValue?: number
  }
  feedback?: {
    rating: number
    comment: string
    deliveryExperience: 'excellent' | 'good' | 'average' | 'poor'
  }
  createdDate: string
  updatedDate: string
}

export default function DeliveriesPage() {
  const { data: session } = useSession()
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [partnerFilter, setPartnerFilter] = useState<string>("all")
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)

  useEffect(() => {
    fetchDeliveries()
  }, [])

  const fetchDeliveries = async () => {
    try {
      // Mock data for development
      const mockDeliveries: Delivery[] = [
        {
          id: "1",
          orderId: "ORD-001",
          trackingNumber: "SMTR001234567",
          customerName: "Rajesh Kumar",
          customerPhone: "+91 98765 43210",
          deliveryAddress: {
            street: "123, Green Valley Apartments, Sector 18",
            landmark: "Near City Mall",
            city: "Gurgaon",
            state: "Haryana",
            pincode: "122018",
            coordinates: { lat: 28.4595, lng: 77.0266 }
          },
          status: "out_for_delivery",
          type: "express",
          priority: "high",
          deliveryPartner: {
            id: "DP-001",
            name: "Rohit Sharma",
            phone: "+91 87654 32109",
            vehicleType: "bike",
            vehicleNumber: "DL-8C-AV-1234",
            rating: 4.8
          },
          timeline: {
            orderPlaced: "2025-01-19T08:00:00Z",
            assigned: "2025-01-19T09:30:00Z",
            pickedUp: "2025-01-19T10:15:00Z",
            outForDelivery: "2025-01-19T12:30:00Z"
          },
          deliverySlot: {
            date: "2025-01-19",
            timeSlot: "14:00 - 18:00",
            isFlexible: true
          },
          deliveryDetails: {
            attempts: 1,
            maxAttempts: 3,
            estimatedTime: "2025-01-19T16:00:00Z",
            deliveryInstructions: "Call before delivery, use main gate",
            otp: "5647",
            signature: true,
            photo: true
          },
          packageInfo: {
            weight: 1.5,
            dimensions: { length: 30, width: 20, height: 10 },
            fragile: false,
            codAmount: 2499,
            insured: true,
            insuranceValue: 2500
          },
          createdDate: "2025-01-19T08:00:00Z",
          updatedDate: "2025-01-19T12:30:00Z"
        },
        {
          id: "2",
          orderId: "ORD-002",
          trackingNumber: "SMTR002345678",
          customerName: "Priya Sharma",
          customerPhone: "+91 76543 21098",
          deliveryAddress: {
            street: "456, Koramangala 4th Block",
            landmark: "Opposite BDA Complex",
            city: "Bangalore",
            state: "Karnataka",
            pincode: "560034",
            coordinates: { lat: 12.9352, lng: 77.6245 }
          },
          status: "delivered",
          type: "standard",
          priority: "medium",
          deliveryPartner: {
            id: "DP-002",
            name: "Amit Singh",
            phone: "+91 65432 10987",
            vehicleType: "scooter",
            vehicleNumber: "KA-03-HY-5678",
            rating: 4.6
          },
          timeline: {
            orderPlaced: "2025-01-18T10:00:00Z",
            assigned: "2025-01-18T11:00:00Z",
            pickedUp: "2025-01-18T14:00:00Z",
            outForDelivery: "2025-01-18T16:00:00Z",
            delivered: "2025-01-18T17:45:00Z"
          },
          deliverySlot: {
            date: "2025-01-18",
            timeSlot: "16:00 - 20:00",
            isFlexible: false
          },
          deliveryDetails: {
            attempts: 1,
            maxAttempts: 3,
            estimatedTime: "2025-01-18T18:00:00Z",
            actualDeliveryTime: "2025-01-18T17:45:00Z",
            deliveryInstructions: "Ring doorbell twice",
            otp: "8921",
            signature: true,
            photo: true
          },
          packageInfo: {
            weight: 0.8,
            dimensions: { length: 25, width: 15, height: 8 },
            fragile: true,
            insured: false
          },
          feedback: {
            rating: 5,
            comment: "Quick delivery, very professional",
            deliveryExperience: "excellent"
          },
          createdDate: "2025-01-18T10:00:00Z",
          updatedDate: "2025-01-18T17:45:00Z"
        },
        {
          id: "3",
          orderId: "ORD-003",
          trackingNumber: "SMTR003456789",
          customerName: "Vikram Mehta",
          customerPhone: "+91 54321 09876",
          deliveryAddress: {
            street: "789, Marine Drive",
            landmark: "Near Chowpatty Beach",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400020",
            coordinates: { lat: 18.9544, lng: 72.8181 }
          },
          status: "failed",
          type: "same_day",
          priority: "urgent",
          deliveryPartner: {
            id: "DP-003",
            name: "Suresh Patel",
            phone: "+91 43210 98765",
            vehicleType: "bike",
            vehicleNumber: "MH-02-CT-9012",
            rating: 4.3
          },
          timeline: {
            orderPlaced: "2025-01-19T06:00:00Z",
            assigned: "2025-01-19T07:00:00Z",
            pickedUp: "2025-01-19T08:30:00Z",
            outForDelivery: "2025-01-19T11:00:00Z",
            failed: "2025-01-19T14:30:00Z"
          },
          deliverySlot: {
            date: "2025-01-19",
            timeSlot: "12:00 - 16:00",
            isFlexible: false
          },
          deliveryDetails: {
            attempts: 2,
            maxAttempts: 3,
            estimatedTime: "2025-01-19T14:00:00Z",
            deliveryInstructions: "Customer not available, will retry tomorrow",
            otp: "3456"
          },
          packageInfo: {
            weight: 2.1,
            dimensions: { length: 35, width: 25, height: 12 },
            fragile: false,
            codAmount: 899,
            insured: true,
            insuranceValue: 1000
          },
          createdDate: "2025-01-19T06:00:00Z",
          updatedDate: "2025-01-19T14:30:00Z"
        },
        {
          id: "4",
          orderId: "ORD-004",
          trackingNumber: "SMTR004567890",
          customerName: "Sunita Patel",
          customerPhone: "+91 32109 87654",
          deliveryAddress: {
            street: "321, Aundh Road",
            landmark: "Near Westend Mall",
            city: "Pune",
            state: "Maharashtra",
            pincode: "411007",
            coordinates: { lat: 18.5590, lng: 73.8074 }
          },
          status: "assigned",
          type: "scheduled",
          priority: "low",
          deliveryPartner: {
            id: "DP-004",
            name: "Ravi Kumar",
            phone: "+91 21098 76543",
            vehicleType: "car",
            vehicleNumber: "MH-12-DE-3456",
            rating: 4.7
          },
          timeline: {
            orderPlaced: "2025-01-18T15:00:00Z",
            assigned: "2025-01-19T08:00:00Z"
          },
          deliverySlot: {
            date: "2025-01-20",
            timeSlot: "10:00 - 14:00",
            isFlexible: true
          },
          deliveryDetails: {
            attempts: 0,
            maxAttempts: 3,
            estimatedTime: "2025-01-20T12:00:00Z",
            deliveryInstructions: "Handle with care - electronics",
            signature: true,
            photo: false
          },
          packageInfo: {
            weight: 3.5,
            dimensions: { length: 40, width: 30, height: 15 },
            fragile: true,
            insured: true,
            insuranceValue: 3500
          },
          createdDate: "2025-01-18T15:00:00Z",
          updatedDate: "2025-01-19T08:00:00Z"
        }
      ]

      setDeliveries(mockDeliveries)
    } catch (error) {
      console.error("Error fetching deliveries:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filter deliveries
  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = 
      delivery.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.customerPhone.includes(searchTerm) ||
      delivery.deliveryPartner.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || delivery.status === statusFilter
    const matchesType = typeFilter === "all" || delivery.type === typeFilter
    const matchesPartner = partnerFilter === "all" || delivery.deliveryPartner.id === partnerFilter
    
    return matchesSearch && matchesStatus && matchesType && matchesPartner
  })

  const getStatusBadge = (status: string) => {
    const variants = {
      'pending': 'secondary',
      'assigned': 'outline',
      'picked_up': 'default',
      'out_for_delivery': 'default',
      'delivered': 'default',
      'failed': 'destructive',
      'returned': 'secondary',
      'cancelled': 'secondary'
    }
    const colors = {
      'pending': 'bg-gray-100 text-gray-800',
      'assigned': 'bg-blue-100 text-blue-800',
      'picked_up': 'bg-yellow-100 text-yellow-800',
      'out_for_delivery': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'failed': 'bg-red-100 text-red-800',
      'returned': 'bg-orange-100 text-orange-800',
      'cancelled': 'bg-gray-100 text-gray-800'
    }
    return { variant: variants[status as keyof typeof variants] || 'secondary', color: colors[status as keyof typeof colors] }
  }

  const getTypeBadge = (type: string) => {
    const variants = {
      'standard': 'outline',
      'express': 'default',
      'same_day': 'default',
      'next_day': 'secondary',
      'scheduled': 'outline'
    }
    return variants[type as keyof typeof variants] || 'outline'
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': 'text-green-600',
      'medium': 'text-yellow-600',
      'high': 'text-orange-600',
      'urgent': 'text-red-600'
    }
    return colors[priority as keyof typeof colors] || 'text-gray-600'
  }

  const getVehicleIcon = (vehicleType: string) => {
    const icons = {
      'bike': '🏍️',
      'scooter': '🛵',
      'car': '🚗',
      'van': '🚐',
      'truck': '🚚'
    }
    return icons[vehicleType as keyof typeof icons] || '🚗'
  }

  const getTotalStats = () => {
    return deliveries.reduce((acc, delivery) => ({
      totalDeliveries: acc.totalDeliveries + 1,
      delivered: acc.delivered + (delivery.status === 'delivered' ? 1 : 0),
      outForDelivery: acc.outForDelivery + (delivery.status === 'out_for_delivery' ? 1 : 0),
      pending: acc.pending + (delivery.status === 'pending' || delivery.status === 'assigned' ? 1 : 0),
      failed: acc.failed + (delivery.status === 'failed' ? 1 : 0),
      averageRating: acc.averageRating + (delivery.feedback?.rating || 0)
    }), { totalDeliveries: 0, delivered: 0, outForDelivery: 0, pending: 0, failed: 0, averageRating: 0 })
  }

  const stats = getTotalStats()
  const deliveryRate = stats.totalDeliveries > 0 ? ((stats.delivered / stats.totalDeliveries) * 100).toFixed(1) : 0
  const avgRating = stats.totalDeliveries > 0 ? (stats.averageRating / stats.totalDeliveries).toFixed(1) : 0

  if (!session) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>Please sign in to access delivery management.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Deliveries</h1>
          <p className="text-muted-foreground text-lg">Track and manage order deliveries</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Assign Delivery
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Delivery Partner</DialogTitle>
                <DialogDescription>Assign a delivery partner to pending orders</DialogDescription>
              </DialogHeader>
              <div className="text-center py-8 text-muted-foreground">
                Assignment interface would be implemented here
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDeliveries}</div>
            <p className="text-xs text-muted-foreground">All time deliveries</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.delivered}</div>
            <p className="text-xs text-muted-foreground">{deliveryRate}% success rate</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out for Delivery</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.outForDelivery}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting assignment</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.failed}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRating}</div>
            <p className="text-xs text-muted-foreground">Customer feedback</p>
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
                  placeholder="Search deliveries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="picked_up">Picked Up</SelectItem>
                  <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[130px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="express">Express</SelectItem>
                  <SelectItem value="same_day">Same Day</SelectItem>
                  <SelectItem value="next_day">Next Day</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deliveries Table */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Tracking ({filteredDeliveries.length})</CardTitle>
          <CardDescription>
            {loading ? "Loading deliveries..." : `Showing ${filteredDeliveries.length} of ${deliveries.length} deliveries`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading deliveries...</div>
          ) : filteredDeliveries.length === 0 ? (
            <div className="text-center py-8">No deliveries found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tracking & Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Delivery Partner</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeliveries.map((delivery) => {
                  const statusBadge = getStatusBadge(delivery.status)
                  return (
                    <TableRow key={delivery.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-mono text-sm">{delivery.trackingNumber}</div>
                          <div className="text-sm text-muted-foreground">
                            Order: {delivery.orderId}
                          </div>
                          <div className="flex gap-2">
                            <Badge variant={getTypeBadge(delivery.type) as any} className="text-xs">
                              {delivery.type.replace('_', ' ')}
                            </Badge>
                            <span className={`text-xs font-medium ${getPriorityColor(delivery.priority)}`}>
                              {delivery.priority}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{delivery.customerName}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {delivery.customerPhone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 max-w-[200px]">
                          <div className="text-sm">{delivery.deliveryAddress.street}</div>
                          {delivery.deliveryAddress.landmark && (
                            <div className="text-xs text-muted-foreground">
                              {delivery.deliveryAddress.landmark}
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            {delivery.deliveryAddress.city}, {delivery.deliveryAddress.state} - {delivery.deliveryAddress.pincode}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getVehicleIcon(delivery.deliveryPartner.vehicleType)}</span>
                            <div>
                              <div className="text-sm font-medium">{delivery.deliveryPartner.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {delivery.deliveryPartner.vehicleNumber}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{delivery.deliveryPartner.rating}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            {new Date(delivery.deliverySlot.date).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {delivery.deliverySlot.timeSlot}
                          </div>
                          <div className="text-xs">
                            Attempts: {delivery.deliveryDetails.attempts}/{delivery.deliveryDetails.maxAttempts}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={statusBadge.variant as any}
                          className={statusBadge.color}
                        >
                          {delivery.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedDelivery(delivery)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`https://maps.google.com/?q=${delivery.deliveryAddress.coordinates.lat},${delivery.deliveryAddress.coordinates.lng}`, '_blank')}
                            title="View on Map"
                          >
                            <Navigation className="h-4 w-4" />
                          </Button>
                          {delivery.status === 'failed' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Retry Delivery"
                            >
                              <RotateCcw className="h-4 w-4" />
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

      {/* Delivery Details Dialog */}
      {selectedDelivery && (
        <Dialog open={!!selectedDelivery} onOpenChange={() => setSelectedDelivery(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Delivery Details</DialogTitle>
              <DialogDescription>
                {selectedDelivery.trackingNumber} • {selectedDelivery.orderId}
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="package">Package Info</TabsTrigger>
                <TabsTrigger value="feedback">Feedback</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Delivery Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <Badge variant={getStatusBadge(selectedDelivery.status).variant as any}>
                          {selectedDelivery.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Type</span>
                        <span className="text-sm capitalize">{selectedDelivery.type.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Priority</span>
                        <span className={`text-sm font-medium ${getPriorityColor(selectedDelivery.priority)}`}>
                          {selectedDelivery.priority.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Delivery Date</span>
                        <span className="text-sm">{new Date(selectedDelivery.deliverySlot.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Time Slot</span>
                        <span className="text-sm">{selectedDelivery.deliverySlot.timeSlot}</span>
                      </div>
                      {selectedDelivery.deliveryDetails.otp && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">OTP</span>
                          <span className="text-sm font-mono">{selectedDelivery.deliveryDetails.otp}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Delivery Partner</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Name</span>
                        <span className="text-sm">{selectedDelivery.deliveryPartner.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Phone</span>
                        <span className="text-sm">{selectedDelivery.deliveryPartner.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Vehicle</span>
                        <span className="text-sm capitalize">
                          {selectedDelivery.deliveryPartner.vehicleType} - {selectedDelivery.deliveryPartner.vehicleNumber}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Rating</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{selectedDelivery.deliveryPartner.rating}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Delivery Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <div>{selectedDelivery.deliveryAddress.street}</div>
                      {selectedDelivery.deliveryAddress.landmark && (
                        <div className="text-sm text-muted-foreground">
                          Landmark: {selectedDelivery.deliveryAddress.landmark}
                        </div>
                      )}
                      <div className="text-sm">
                        {selectedDelivery.deliveryAddress.city}, {selectedDelivery.deliveryAddress.state} - {selectedDelivery.deliveryAddress.pincode}
                      </div>
                    </div>
                    {selectedDelivery.deliveryDetails.deliveryInstructions && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium">Delivery Instructions</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {selectedDelivery.deliveryDetails.deliveryInstructions}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="timeline" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Delivery Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div>
                          <div className="font-medium">Order Placed</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(selectedDelivery.timeline.orderPlaced).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      {selectedDelivery.timeline.assigned && (
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div>
                            <div className="font-medium">Assigned to Partner</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(selectedDelivery.timeline.assigned).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {selectedDelivery.timeline.pickedUp && (
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <div>
                            <div className="font-medium">Picked Up</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(selectedDelivery.timeline.pickedUp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {selectedDelivery.timeline.outForDelivery && (
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <div>
                            <div className="font-medium">Out for Delivery</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(selectedDelivery.timeline.outForDelivery).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {selectedDelivery.timeline.delivered && (
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <div>
                            <div className="font-medium">Delivered</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(selectedDelivery.timeline.delivered).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {selectedDelivery.timeline.failed && (
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div>
                            <div className="font-medium">Delivery Failed</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(selectedDelivery.timeline.failed).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="package" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Package Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Weight</span>
                        <span className="text-sm">{selectedDelivery.packageInfo.weight} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Dimensions</span>
                        <span className="text-sm">
                          {selectedDelivery.packageInfo.dimensions.length} × {selectedDelivery.packageInfo.dimensions.width} × {selectedDelivery.packageInfo.dimensions.height} cm
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Fragile</span>
                        <Badge variant={selectedDelivery.packageInfo.fragile ? "destructive" : "secondary"}>
                          {selectedDelivery.packageInfo.fragile ? "Yes" : "No"}
                        </Badge>
                      </div>
                      {selectedDelivery.packageInfo.codAmount && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">COD Amount</span>
                          <span className="text-sm font-medium">₹{selectedDelivery.packageInfo.codAmount}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Insurance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Insured</span>
                        <Badge variant={selectedDelivery.packageInfo.insured ? "default" : "secondary"}>
                          {selectedDelivery.packageInfo.insured ? "Yes" : "No"}
                        </Badge>
                      </div>
                      {selectedDelivery.packageInfo.insuranceValue && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Insurance Value</span>
                          <span className="text-sm">₹{selectedDelivery.packageInfo.insuranceValue}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="feedback" className="space-y-4">
                {selectedDelivery.feedback ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Customer Feedback</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Rating</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{selectedDelivery.feedback.rating}/5</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Experience</span>
                        <span className="text-sm capitalize">{selectedDelivery.feedback.deliveryExperience}</span>
                      </div>
                      {selectedDelivery.feedback.comment && (
                        <div>
                          <span className="text-sm text-muted-foreground">Comment</span>
                          <div className="mt-1 p-3 bg-gray-50 rounded-lg text-sm">
                            {selectedDelivery.feedback.comment}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      No feedback available yet
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