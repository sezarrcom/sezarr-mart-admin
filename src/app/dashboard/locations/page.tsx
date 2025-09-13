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
  Search, Filter, Download, Eye, Edit, Plus, MapPin, Building2,
  Phone, Mail, Clock, Users, Package, Truck, Settings,
  CheckCircle, XCircle, AlertTriangle, Activity, BarChart3,
  Store, Warehouse, Home, ExternalLink, Navigation
} from "lucide-react"

interface Location {
  id: string
  name: string
  type: 'warehouse' | 'store' | 'office' | 'fulfillment_center' | 'pickup_point'
  status: 'active' | 'inactive' | 'maintenance' | 'closed'
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  contact: {
    phone: string
    email: string
    manager: string
  }
  operatingHours: {
    monday: { open: string; close: string; isOpen: boolean }
    tuesday: { open: string; close: string; isOpen: boolean }
    wednesday: { open: string; close: string; isOpen: boolean }
    thursday: { open: string; close: string; isOpen: boolean }
    friday: { open: string; close: string; isOpen: boolean }
    saturday: { open: string; close: string; isOpen: boolean }
    sunday: { open: string; close: string; isOpen: boolean }
  }
  capacity: {
    totalArea: number // in sq ft
    storageCapacity?: number // for warehouses
    staffCount: number
    maxCustomers?: number // for stores
  }
  services: string[]
  inventory?: {
    totalProducts: number
    totalValue: number
    lowStockItems: number
  }
  performance: {
    monthlyOrders: number
    monthlyRevenue: number
    customerSatisfaction: number
    operationalEfficiency: number
  }
  features: {
    hasParking: boolean
    isAccessible: boolean
    hasSecuritySystem: boolean
    hasClimateControl: boolean
    hasLoadingDock: boolean
  }
  createdDate: string
  lastUpdated: string
}

export default function LocationsPage() {
  const { data: session } = useSession()
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)

  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    try {
      // Mock data for development
      const mockLocations: Location[] = [
        {
          id: "1",
          name: "Main Warehouse - Mumbai",
          type: "warehouse",
          status: "active",
          address: {
            street: "123 Industrial Area, Andheri East",
            city: "Mumbai",
            state: "Maharashtra",
            zipCode: "400069",
            country: "India",
            coordinates: { lat: 19.1136, lng: 72.8697 }
          },
          contact: {
            phone: "+91 22 2850 1234",
            email: "mumbai.warehouse@sezarrmart.com",
            manager: "Rajesh Kumar"
          },
          operatingHours: {
            monday: { open: "08:00", close: "20:00", isOpen: true },
            tuesday: { open: "08:00", close: "20:00", isOpen: true },
            wednesday: { open: "08:00", close: "20:00", isOpen: true },
            thursday: { open: "08:00", close: "20:00", isOpen: true },
            friday: { open: "08:00", close: "20:00", isOpen: true },
            saturday: { open: "09:00", close: "18:00", isOpen: true },
            sunday: { open: "10:00", close: "16:00", isOpen: true }
          },
          capacity: {
            totalArea: 50000,
            storageCapacity: 100000,
            staffCount: 45
          },
          services: ["Storage", "Order Fulfillment", "Returns Processing", "Quality Control"],
          inventory: {
            totalProducts: 15000,
            totalValue: 25000000,
            lowStockItems: 45
          },
          performance: {
            monthlyOrders: 8500,
            monthlyRevenue: 12500000,
            customerSatisfaction: 4.6,
            operationalEfficiency: 92
          },
          features: {
            hasParking: true,
            isAccessible: true,
            hasSecuritySystem: true,
            hasClimateControl: true,
            hasLoadingDock: true
          },
          createdDate: "2023-01-15T00:00:00Z",
          lastUpdated: "2025-01-19T10:30:00Z"
        },
        {
          id: "2",
          name: "Retail Store - Bangalore",
          type: "store",
          status: "active",
          address: {
            street: "456 MG Road, Koramangala",
            city: "Bangalore",
            state: "Karnataka",
            zipCode: "560034",
            country: "India",
            coordinates: { lat: 12.9279, lng: 77.6271 }
          },
          contact: {
            phone: "+91 80 4112 5678",
            email: "bangalore.store@sezarrmart.com",
            manager: "Priya Sharma"
          },
          operatingHours: {
            monday: { open: "10:00", close: "22:00", isOpen: true },
            tuesday: { open: "10:00", close: "22:00", isOpen: true },
            wednesday: { open: "10:00", close: "22:00", isOpen: true },
            thursday: { open: "10:00", close: "22:00", isOpen: true },
            friday: { open: "10:00", close: "22:00", isOpen: true },
            saturday: { open: "10:00", close: "23:00", isOpen: true },
            sunday: { open: "11:00", close: "22:00", isOpen: true }
          },
          capacity: {
            totalArea: 3000,
            staffCount: 12,
            maxCustomers: 150
          },
          services: ["Retail Sales", "Customer Pickup", "Returns & Exchanges", "Customer Support"],
          inventory: {
            totalProducts: 2500,
            totalValue: 3500000,
            lowStockItems: 8
          },
          performance: {
            monthlyOrders: 1200,
            monthlyRevenue: 1800000,
            customerSatisfaction: 4.8,
            operationalEfficiency: 88
          },
          features: {
            hasParking: true,
            isAccessible: true,
            hasSecuritySystem: true,
            hasClimateControl: true,
            hasLoadingDock: false
          },
          createdDate: "2023-06-20T00:00:00Z",
          lastUpdated: "2025-01-18T15:45:00Z"
        },
        {
          id: "3",
          name: "Fulfillment Center - Delhi",
          type: "fulfillment_center",
          status: "active",
          address: {
            street: "789 Sector 63, Noida",
            city: "Noida",
            state: "Uttar Pradesh",
            zipCode: "201301",
            country: "India",
            coordinates: { lat: 28.6139, lng: 77.2090 }
          },
          contact: {
            phone: "+91 120 4567 890",
            email: "delhi.fulfillment@sezarrmart.com",
            manager: "Amit Singh"
          },
          operatingHours: {
            monday: { open: "06:00", close: "22:00", isOpen: true },
            tuesday: { open: "06:00", close: "22:00", isOpen: true },
            wednesday: { open: "06:00", close: "22:00", isOpen: true },
            thursday: { open: "06:00", close: "22:00", isOpen: true },
            friday: { open: "06:00", close: "22:00", isOpen: true },
            saturday: { open: "08:00", close: "20:00", isOpen: true },
            sunday: { open: "08:00", close: "18:00", isOpen: true }
          },
          capacity: {
            totalArea: 75000,
            storageCapacity: 150000,
            staffCount: 85
          },
          services: ["Order Processing", "Same-day Delivery", "Express Shipping", "Bulk Orders"],
          inventory: {
            totalProducts: 25000,
            totalValue: 40000000,
            lowStockItems: 78
          },
          performance: {
            monthlyOrders: 15000,
            monthlyRevenue: 22000000,
            customerSatisfaction: 4.5,
            operationalEfficiency: 95
          },
          features: {
            hasParking: true,
            isAccessible: true,
            hasSecuritySystem: true,
            hasClimateControl: true,
            hasLoadingDock: true
          },
          createdDate: "2023-03-10T00:00:00Z",
          lastUpdated: "2025-01-19T09:20:00Z"
        },
        {
          id: "4",
          name: "Pickup Point - Pune",
          type: "pickup_point",
          status: "active",
          address: {
            street: "321 FC Road, Shivajinagar",
            city: "Pune",
            state: "Maharashtra",
            zipCode: "411005",
            country: "India",
            coordinates: { lat: 18.5204, lng: 73.8567 }
          },
          contact: {
            phone: "+91 20 2567 1234",
            email: "pune.pickup@sezarrmart.com",
            manager: "Sunita Patel"
          },
          operatingHours: {
            monday: { open: "09:00", close: "21:00", isOpen: true },
            tuesday: { open: "09:00", close: "21:00", isOpen: true },
            wednesday: { open: "09:00", close: "21:00", isOpen: true },
            thursday: { open: "09:00", close: "21:00", isOpen: true },
            friday: { open: "09:00", close: "21:00", isOpen: true },
            saturday: { open: "09:00", close: "21:00", isOpen: true },
            sunday: { open: "10:00", close: "20:00", isOpen: true }
          },
          capacity: {
            totalArea: 800,
            staffCount: 5,
            maxCustomers: 50
          },
          services: ["Order Pickup", "Returns", "Customer Support"],
          performance: {
            monthlyOrders: 850,
            monthlyRevenue: 0, // No direct revenue from pickup points
            customerSatisfaction: 4.7,
            operationalEfficiency: 90
          },
          features: {
            hasParking: true,
            isAccessible: true,
            hasSecuritySystem: true,
            hasClimateControl: false,
            hasLoadingDock: false
          },
          createdDate: "2024-01-15T00:00:00Z",
          lastUpdated: "2025-01-17T14:30:00Z"
        }
      ]

      setLocations(mockLocations)
    } catch (error) {
      console.error("Error fetching locations:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filter locations
  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.address.state.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || location.type === typeFilter
    const matchesStatus = statusFilter === "all" || location.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const variants = {
      'active': 'default',
      'inactive': 'secondary',
      'maintenance': 'outline',
      'closed': 'destructive'
    }
    return variants[status as keyof typeof variants] || 'secondary'
  }

  const getTypeBadge = (type: string) => {
    const variants = {
      'warehouse': 'default',
      'store': 'secondary',
      'office': 'outline',
      'fulfillment_center': 'default',
      'pickup_point': 'secondary'
    }
    return variants[type as keyof typeof variants] || 'secondary'
  }

  const getTypeIcon = (type: string) => {
    const icons = {
      'warehouse': Warehouse,
      'store': Store,
      'office': Building2,
      'fulfillment_center': Package,
      'pickup_point': MapPin
    }
    return icons[type as keyof typeof icons] || Building2
  }

  const getTotalStats = () => {
    return locations.reduce((acc, location) => ({
      totalLocations: acc.totalLocations + 1,
      activeLocations: acc.activeLocations + (location.status === 'active' ? 1 : 0),
      totalStaff: acc.totalStaff + location.capacity.staffCount,
      totalArea: acc.totalArea + location.capacity.totalArea,
      totalRevenue: acc.totalRevenue + location.performance.monthlyRevenue
    }), { totalLocations: 0, activeLocations: 0, totalStaff: 0, totalArea: 0, totalRevenue: 0 })
  }

  const stats = getTotalStats()

  if (!session) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>Please sign in to access location management.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Locations</h1>
          <p className="text-muted-foreground text-lg">Manage warehouses, stores, and fulfillment centers</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shrink-0">
                <Plus className="mr-2 h-4 w-4" />
                Add Location
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Location</DialogTitle>
                <DialogDescription>Create a new business location</DialogDescription>
              </DialogHeader>
              <div className="text-center py-8 text-muted-foreground">
                Location creation form would be implemented here
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLocations}</div>
            <p className="text-xs text-muted-foreground">Across multiple cities</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Locations</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeLocations}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.activeLocations / stats.totalLocations) * 100).toFixed(0)}% operational
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStaff}</div>
            <p className="text-xs text-muted-foreground">Across all locations</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Area</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats.totalArea / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Sq ft of space</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(stats.totalRevenue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Combined revenue</p>
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
                  placeholder="Search locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Location Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                  <SelectItem value="store">Store</SelectItem>
                  <SelectItem value="office">Office</SelectItem>
                  <SelectItem value="fulfillment_center">Fulfillment Center</SelectItem>
                  <SelectItem value="pickup_point">Pickup Point</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Locations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Business Locations ({filteredLocations.length})</CardTitle>
          <CardDescription>
            {loading ? "Loading locations..." : `Showing ${filteredLocations.length} of ${locations.length} locations`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading locations...</div>
          ) : filteredLocations.length === 0 ? (
            <div className="text-center py-8">No locations found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLocations.map((location) => {
                  const TypeIcon = getTypeIcon(location.type)
                  return (
                    <TableRow key={location.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-50 rounded-lg">
                            <TypeIcon className="h-5 w-5 text-gray-600" />
                          </div>
                          <div className="space-y-1">
                            <div className="font-medium">{location.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Manager: {location.contact.manager}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getTypeBadge(location.type) as any}>
                          {location.type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{location.address.city}</div>
                          <div className="text-sm text-muted-foreground">
                            {location.address.state}, {location.address.country}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {location.address.zipCode}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            {location.capacity.totalArea.toLocaleString()} sq ft
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {location.capacity.staffCount} staff
                          </div>
                          {location.capacity.storageCapacity && (
                            <div className="text-xs text-muted-foreground">
                              {location.capacity.storageCapacity.toLocaleString()} units
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">
                            {location.performance.operationalEfficiency}% efficiency
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {location.performance.monthlyOrders} orders/mo
                          </div>
                          {location.performance.monthlyRevenue > 0 && (
                            <div className="text-xs text-green-600">
                              ₹{(location.performance.monthlyRevenue / 1000000).toFixed(1)}M revenue
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadge(location.status) as any}>
                          {location.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedLocation(location)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Edit Location"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`https://maps.google.com/?q=${location.address.coordinates.lat},${location.address.coordinates.lng}`, '_blank')}
                            title="View on Map"
                          >
                            <Navigation className="h-4 w-4" />
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

      {/* Location Details Dialog */}
      {selectedLocation && (
        <Dialog open={!!selectedLocation} onOpenChange={() => setSelectedLocation(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedLocation.name}</DialogTitle>
              <DialogDescription>{selectedLocation.type.replace('_', ' ')} • {selectedLocation.address.city}</DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="operations">Operations</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Location Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">
                          {selectedLocation.address.street}, {selectedLocation.address.city}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <span className="text-sm">{selectedLocation.capacity.totalArea.toLocaleString()} sq ft</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span className="text-sm">{selectedLocation.capacity.staffCount} employees</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Features</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {Object.entries(selectedLocation.features).map(([feature, enabled]) => (
                        <div key={feature} className="flex items-center justify-between">
                          <span className="text-sm capitalize">
                            {feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </span>
                          <Badge variant={enabled ? "default" : "secondary"}>
                            {enabled ? "Yes" : "No"}
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="operations" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Operating Hours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(selectedLocation.operatingHours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between items-center">
                          <span className="capitalize font-medium">{day}</span>
                          <span className="text-sm">
                            {hours.isOpen ? `${hours.open} - ${hours.close}` : 'Closed'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedLocation.services.map((service) => (
                        <Badge key={service} variant="outline">{service}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="performance" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Monthly Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span>Orders Processed</span>
                        <span className="font-medium">{selectedLocation.performance.monthlyOrders}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Revenue Generated</span>
                        <span className="font-medium">₹{selectedLocation.performance.monthlyRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Customer Satisfaction</span>
                        <span className="font-medium">{selectedLocation.performance.customerSatisfaction}/5.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Operational Efficiency</span>
                        <span className="font-medium">{selectedLocation.performance.operationalEfficiency}%</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {selectedLocation.inventory && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Inventory Status</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span>Total Products</span>
                          <span className="font-medium">{selectedLocation.inventory.totalProducts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Inventory Value</span>
                          <span className="font-medium">₹{selectedLocation.inventory.totalValue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Low Stock Items</span>
                          <span className="font-medium text-red-600">{selectedLocation.inventory.lowStockItems}</span>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="contact" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{selectedLocation.contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{selectedLocation.contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Manager: {selectedLocation.contact.manager}</span>
                    </div>
                    <div className="pt-4">
                      <Button
                        onClick={() => window.open(`https://maps.google.com/?q=${selectedLocation.address.coordinates.lat},${selectedLocation.address.coordinates.lng}`, '_blank')}
                        className="w-full"
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        View on Google Maps
                      </Button>
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