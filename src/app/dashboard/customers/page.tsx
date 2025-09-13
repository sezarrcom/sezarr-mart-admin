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
import { Checkbox } from "@/components/ui/checkbox"
import { useSession } from "next-auth/react"
import {
  Search, Filter, Download, Eye, Edit, User, UserPlus,
  Phone, Mail, MapPin, Calendar, DollarSign, ShoppingBag,
  Star, Heart, MessageSquare, Gift, CreditCard, Clock,
  TrendingUp, Users, Package, Target, Award, Activity
} from "lucide-react"

interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say'
  status: 'active' | 'inactive' | 'blocked' | 'vip'
  customerType: 'retail' | 'wholesale' | 'business' | 'premium'
  registrationDate: string
  lastLoginDate?: string
  avatar?: string
  addresses: Address[]
  preferences: CustomerPreferences
  loyaltyProgram: LoyaltyProgram
  statistics: CustomerStatistics
  notes?: string
  tags: string[]
}

interface Address {
  id: string
  type: 'shipping' | 'billing' | 'home' | 'work'
  isDefault: boolean
  firstName: string
  lastName: string
  company?: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  phone?: string
}

interface CustomerPreferences {
  newsletter: boolean
  smsMarketing: boolean
  emailMarketing: boolean
  preferredLanguage: string
  preferredCurrency: string
  favoriteCategories: string[]
  communicationMethod: 'email' | 'sms' | 'phone' | 'in_app'
}

interface LoyaltyProgram {
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'
  points: number
  totalEarned: number
  totalRedeemed: number
  joinDate: string
  expirationDate?: string
}

interface CustomerStatistics {
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  lastOrderDate?: string
  favoriteProducts: string[]
  returnRate: number
  lifetimeValue: number
  acquisitionChannel: string
  referrals: number
}

interface CustomerSegment {
  id: string
  name: string
  description: string
  criteria: Record<string, any>
  customerCount: number
  color: string
}

export default function CustomersPage() {
  const { data: session } = useSession()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [segmentFilter, setSegmentFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [showCustomerDetails, setShowCustomerDetails] = useState(false)
  const [showEditCustomer, setShowEditCustomer] = useState(false)
  const [showAddCustomer, setShowAddCustomer] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [customerSegments, setCustomerSegments] = useState<CustomerSegment[]>([])
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')

  // Mock customer data
  const mockCustomers: Customer[] = [
    {
      id: "1",
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@email.com",
      phone: "+1 (555) 123-4567",
      dateOfBirth: "1985-03-15",
      gender: "male",
      status: "active",
      customerType: "retail",
      registrationDate: "2023-01-15T10:30:00Z",
      lastLoginDate: "2024-01-20T14:22:00Z",
      avatar: "/avatars/john-smith.jpg",
      addresses: [
        {
          id: "a1",
          type: "home",
          isDefault: true,
          firstName: "John",
          lastName: "Smith",
          street: "123 Main St, Apt 4B",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "USA",
          phone: "+1 (555) 123-4567"
        }
      ],
      preferences: {
        newsletter: true,
        smsMarketing: false,
        emailMarketing: true,
        preferredLanguage: "en",
        preferredCurrency: "USD",
        favoriteCategories: ["electronics", "books"],
        communicationMethod: "email"
      },
      loyaltyProgram: {
        tier: "gold",
        points: 2450,
        totalEarned: 5670,
        totalRedeemed: 3220,
        joinDate: "2023-01-15T10:30:00Z"
      },
      statistics: {
        totalOrders: 24,
        totalSpent: 2847.50,
        averageOrderValue: 118.65,
        lastOrderDate: "2024-01-18T16:45:00Z",
        favoriteProducts: ["Wireless Headphones", "Smart Watch"],
        returnRate: 0.08,
        lifetimeValue: 3200.00,
        acquisitionChannel: "google_ads",
        referrals: 3
      },
      notes: "Premium customer, prefers express shipping",
      tags: ["premium", "tech-enthusiast", "loyal"]
    },
    {
      id: "2",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.j@email.com",
      phone: "+1 (555) 987-6543",
      dateOfBirth: "1992-07-22",
      gender: "female",
      status: "active",
      customerType: "business",
      registrationDate: "2023-05-20T09:15:00Z",
      lastLoginDate: "2024-01-19T11:30:00Z",
      addresses: [
        {
          id: "a2",
          type: "work",
          isDefault: true,
          firstName: "Sarah",
          lastName: "Johnson",
          company: "Tech Solutions Inc",
          street: "456 Business Plaza, Suite 200",
          city: "Los Angeles",
          state: "CA",
          zipCode: "90210",
          country: "USA",
          phone: "+1 (555) 987-6543"
        }
      ],
      preferences: {
        newsletter: true,
        smsMarketing: true,
        emailMarketing: true,
        preferredLanguage: "en",
        preferredCurrency: "USD",
        favoriteCategories: ["office-supplies", "software"],
        communicationMethod: "email"
      },
      loyaltyProgram: {
        tier: "platinum",
        points: 4850,
        totalEarned: 8940,
        totalRedeemed: 4090,
        joinDate: "2023-05-20T09:15:00Z"
      },
      statistics: {
        totalOrders: 42,
        totalSpent: 8950.75,
        averageOrderValue: 213.11,
        lastOrderDate: "2024-01-17T14:20:00Z",
        favoriteProducts: ["Office Chair", "Laptop Stand"],
        returnRate: 0.05,
        lifetimeValue: 12000.00,
        acquisitionChannel: "referral",
        referrals: 8
      },
      notes: "Business account, bulk orders, net 30 payment terms",
      tags: ["business", "bulk-buyer", "platinum"]
    },
    {
      id: "3",
      firstName: "Mike",
      lastName: "Davis",
      email: "mike.davis@company.com",
      phone: "+1 (555) 456-7890",
      dateOfBirth: "1988-11-03",
      gender: "male",
      status: "vip",
      customerType: "premium",
      registrationDate: "2022-08-10T16:20:00Z",
      lastLoginDate: "2024-01-21T09:15:00Z",
      addresses: [
        {
          id: "a3",
          type: "home",
          isDefault: true,
          firstName: "Mike",
          lastName: "Davis",
          street: "789 Premium Avenue",
          city: "San Francisco",
          state: "CA",
          zipCode: "94105",
          country: "USA",
          phone: "+1 (555) 456-7890"
        }
      ],
      preferences: {
        newsletter: true,
        smsMarketing: true,
        emailMarketing: true,
        preferredLanguage: "en",
        preferredCurrency: "USD",
        favoriteCategories: ["luxury", "electronics", "fashion"],
        communicationMethod: "phone"
      },
      loyaltyProgram: {
        tier: "diamond",
        points: 12450,
        totalEarned: 25670,
        totalRedeemed: 13220,
        joinDate: "2022-08-10T16:20:00Z"
      },
      statistics: {
        totalOrders: 156,
        totalSpent: 45680.25,
        averageOrderValue: 292.82,
        lastOrderDate: "2024-01-20T18:30:00Z",
        favoriteProducts: ["Premium Headphones", "Luxury Watch"],
        returnRate: 0.02,
        lifetimeValue: 75000.00,
        acquisitionChannel: "direct",
        referrals: 15
      },
      notes: "VIP customer, priority support, exclusive access to new products",
      tags: ["vip", "high-value", "diamond", "luxury"]
    }
  ]

  const mockSegments: CustomerSegment[] = [
    {
      id: "1",
      name: "High Value Customers",
      description: "Customers with lifetime value > $5,000",
      criteria: { lifetimeValue: { gte: 5000 } },
      customerCount: 45,
      color: "bg-green-100 text-green-800"
    },
    {
      id: "2", 
      name: "Frequent Buyers",
      description: "Customers with 20+ orders",
      criteria: { totalOrders: { gte: 20 } },
      customerCount: 89,
      color: "bg-blue-100 text-blue-800"
    },
    {
      id: "3",
      name: "At Risk",
      description: "No orders in last 90 days",
      criteria: { lastOrderDays: { gte: 90 } },
      customerCount: 156,
      color: "bg-red-100 text-red-800"
    },
    {
      id: "4",
      name: "New Customers",
      description: "Registered in last 30 days",
      criteria: { registrationDays: { lte: 30 } },
      customerCount: 23,
      color: "bg-purple-100 text-purple-800"
    }
  ]

  useEffect(() => {
    setCustomers(mockCustomers)
    setCustomerSegments(mockSegments)
  }, [])

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      blocked: "bg-red-100 text-red-800",
      vip: "bg-purple-100 text-purple-800"
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getTierColor = (tier: string) => {
    const colors = {
      bronze: "bg-orange-100 text-orange-800",
      silver: "bg-gray-100 text-gray-800",
      gold: "bg-yellow-100 text-yellow-800",
      platinum: "bg-blue-100 text-blue-800",
      diamond: "bg-purple-100 text-purple-800"
    }
    return colors[tier as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const handleSelectAll = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([])
    } else {
      setSelectedCustomers(filteredCustomers.map(customer => customer.id))
    }
  }

  const handleSelectCustomer = (customerId: string) => {
    if (selectedCustomers.includes(customerId)) {
      setSelectedCustomers(selectedCustomers.filter(id => id !== customerId))
    } else {
      setSelectedCustomers([...selectedCustomers, customerId])
    }
  }

  const filteredCustomers = customers.filter(customer => {
    const searchString = `${customer.firstName} ${customer.lastName} ${customer.email}`.toLowerCase()
    const matchesSearch = searchString.includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter
    const matchesType = typeFilter === "all" || customer.customerType === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setShowCustomerDetails(true)
  }

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer)
    setShowEditCustomer(true)
  }

  const handleExportCustomers = () => {
    // Create CSV content
    const headers = ['Name', 'Email', 'Phone', 'Status', 'Total Orders', 'Total Spent', 'Joined']
    const csvData = [
      headers.join(','),
      ...filteredCustomers.map(customer => [
        `"${customer.firstName} ${customer.lastName}"`,
        customer.email,
        customer.phone || '',
        customer.status,
        customer.statistics.totalOrders,
        `$${customer.statistics.totalSpent.toFixed(2)}`,
        new Date(customer.registrationDate).toLocaleDateString()
      ].join(','))
    ].join('\n')
    
    // Download CSV file
    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `customers-export-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const handleAddCustomer = () => {
    setShowAddCustomer(true)
  }

  const handleAddToSegment = () => {
    if (selectedCustomers.length === 0) return
    alert(`Adding ${selectedCustomers.length} customers to segment`)
  }

  const handleSendCampaign = () => {
    if (selectedCustomers.length === 0) return
    alert(`Sending campaign to ${selectedCustomers.length} customers`)
  }

  const handleExportSelected = () => {
    if (selectedCustomers.length === 0) return
    const selectedData = customers.filter(c => selectedCustomers.includes(c.id))
    
    const headers = ['Name', 'Email', 'Phone', 'Status', 'Total Orders', 'Total Spent']
    const csvData = [
      headers.join(','),
      ...selectedData.map(customer => [
        `"${customer.firstName} ${customer.lastName}"`,
        customer.email,
        customer.phone || '',
        customer.status,
        customer.statistics.totalOrders,
        `$${customer.statistics.totalSpent.toFixed(2)}`
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `selected-customers-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const getCustomerStats = () => {
    const totalCustomers = customers.length
    const activeCustomers = customers.filter(c => c.status === 'active').length
    const vipCustomers = customers.filter(c => c.status === 'vip').length
    const totalRevenue = customers.reduce((sum, c) => sum + c.statistics.totalSpent, 0)
    const avgLifetimeValue = customers.reduce((sum, c) => sum + c.statistics.lifetimeValue, 0) / totalCustomers

    return {
      totalCustomers,
      activeCustomers,
      vipCustomers,
      totalRevenue,
      avgLifetimeValue
    }
  }

  const stats = getCustomerStats()

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Customer Management</h1>
          <p className="text-muted-foreground text-lg">Manage customer profiles, analytics, and engagement</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="w-full sm:w-auto" onClick={handleExportCustomers}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')} className="w-full sm:w-auto">
            {viewMode === 'table' ? 'Card View' : 'Table View'}
          </Button>
          <Button className="w-full sm:w-auto" onClick={handleAddCustomer}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold">{stats.totalCustomers}</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold">{stats.activeCustomers}</p>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">VIP Customers</p>
                <p className="text-2xl font-bold">{stats.vipCustomers}</p>
              </div>
              <Award className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Lifetime Value</p>
                <p className="text-2xl font-bold">${stats.avgLifetimeValue.toFixed(0)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Segments */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Segments</CardTitle>
          <CardDescription>Predefined customer groups for targeted marketing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {customerSegments.map((segment) => (
              <div key={segment.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{segment.name}</h3>
                  <Badge className={segment.color}>{segment.customerCount}</Badge>
                </div>
                <p className="text-sm text-gray-600">{segment.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search customers..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="wholesale">Wholesale</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
            <Select value={segmentFilter} onValueChange={setSegmentFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Segment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Segments</SelectItem>
                {customerSegments.map((segment) => (
                  <SelectItem key={segment.id} value={segment.id}>{segment.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedCustomers.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedCustomers.length} customers selected
              </span>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={handleAddToSegment}>
                  Add to Segment
                </Button>
                <Button size="sm" variant="outline" onClick={handleSendCampaign}>
                  Send Campaign
                </Button>
                <Button size="sm" variant="outline" onClick={handleExportSelected}>
                  Export Selected
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedCustomers([])}>
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Customers Table/Cards */}
      <Card>
        <CardContent className="p-6">
          {viewMode === 'table' ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedCustomers.length === filteredCustomers.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Loyalty Tier</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Last Order</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedCustomers.includes(customer.id)}
                        onCheckedChange={() => handleSelectCustomer(customer.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-medium">{customer.firstName} {customer.lastName}</div>
                          <div className="text-sm text-gray-500">{customer.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(customer.status)}>
                        {customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize">{customer.customerType}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTierColor(customer.loyaltyProgram.tier)}>
                        {customer.loyaltyProgram.tier}
                      </Badge>
                    </TableCell>
                    <TableCell>{customer.statistics.totalOrders}</TableCell>
                    <TableCell>${customer.statistics.totalSpent.toFixed(2)}</TableCell>
                    <TableCell>
                      {customer.statistics.lastOrderDate 
                        ? new Date(customer.statistics.lastOrderDate).toLocaleDateString()
                        : 'Never'
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost" onClick={() => handleViewCustomer(customer)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleEditCustomer(customer)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCustomers.map((customer) => (
                <Card key={customer.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{customer.firstName} {customer.lastName}</h3>
                        <p className="text-sm text-gray-500">{customer.email}</p>
                      </div>
                      <Checkbox 
                        checked={selectedCustomers.includes(customer.id)}
                        onCheckedChange={() => handleSelectCustomer(customer.id)}
                      />
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Status:</span>
                        <Badge className={getStatusColor(customer.status)}>{customer.status}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Tier:</span>
                        <Badge className={getTierColor(customer.loyaltyProgram.tier)}>
                          {customer.loyaltyProgram.tier}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Orders:</span>
                        <span className="font-medium">{customer.statistics.totalOrders}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Spent:</span>
                        <span className="font-medium">${customer.statistics.totalSpent.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => handleViewCustomer(customer)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEditCustomer(customer)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Details Dialog */}
      <Dialog open={showCustomerDetails} onOpenChange={setShowCustomerDetails}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Customer Details - {selectedCustomer?.firstName} {selectedCustomer?.lastName}
            </DialogTitle>
            <DialogDescription>
              Complete customer profile and engagement history
            </DialogDescription>
          </DialogHeader>
          
          {selectedCustomer && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="addresses">Addresses</TabsTrigger>
                <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="w-8 h-8" />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">{selectedCustomer.firstName} {selectedCustomer.lastName}</h3>
                          <p className="text-gray-500">{selectedCustomer.email}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Phone:</span>
                          <div>{selectedCustomer.phone}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Status:</span>
                          <div>
                            <Badge className={getStatusColor(selectedCustomer.status)}>
                              {selectedCustomer.status}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">Type:</span>
                          <div className="capitalize">{selectedCustomer.customerType}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Member Since:</span>
                          <div>{new Date(selectedCustomer.registrationDate).toLocaleDateString()}</div>
                        </div>
                      </div>
                      {selectedCustomer.tags.length > 0 && (
                        <div>
                          <span className="text-gray-500 text-sm">Tags:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedCustomer.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Order Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Total Orders:</span>
                          <div className="text-lg font-semibold">{selectedCustomer.statistics.totalOrders}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Total Spent:</span>
                          <div className="text-lg font-semibold">${selectedCustomer.statistics.totalSpent.toFixed(2)}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Avg Order Value:</span>
                          <div className="font-medium">${selectedCustomer.statistics.averageOrderValue.toFixed(2)}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Return Rate:</span>
                          <div className="font-medium">{(selectedCustomer.statistics.returnRate * 100).toFixed(1)}%</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Lifetime Value:</span>
                          <div className="font-medium">${selectedCustomer.statistics.lifetimeValue.toFixed(2)}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Referrals:</span>
                          <div className="font-medium">{selectedCustomer.statistics.referrals}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button className="w-full" size="sm">
                        <Phone className="w-4 h-4 mr-2" />
                        Call Customer
                      </Button>
                      <Button variant="outline" className="w-full" size="sm">
                        <Mail className="w-4 h-4 mr-2" />
                        Send Email
                      </Button>
                      <Button variant="outline" className="w-full" size="sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Start Chat
                      </Button>
                      <Button variant="outline" className="w-full" size="sm">
                        <Gift className="w-4 h-4 mr-2" />
                        Send Offer
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {selectedCustomer.notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{selectedCustomer.notes}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="loyalty" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Loyalty Program</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{selectedCustomer.loyaltyProgram.points.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">Current Points</div>
                      </div>
                      <div className="text-center">
                        <Badge className={getTierColor(selectedCustomer.loyaltyProgram.tier)} variant="outline">
                          {selectedCustomer.loyaltyProgram.tier.toUpperCase()}
                        </Badge>
                        <div className="text-sm text-gray-500 mt-1">Current Tier</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold">{selectedCustomer.loyaltyProgram.totalEarned.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">Total Earned</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold">{selectedCustomer.loyaltyProgram.totalRedeemed.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">Total Redeemed</div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Points History</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Order #ORD-2024-001</span>
                          <span className="text-green-600">+125 points</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Redeemed for discount</span>
                          <span className="text-red-600">-500 points</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Birthday bonus</span>
                          <span className="text-green-600">+200 points</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}