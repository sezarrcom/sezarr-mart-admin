"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from "next-auth/react"
import { 
  Plus, Edit, Trash2, Search, Filter, Phone, Mail, MapPin, 
  Building, Star, Package, TrendingUp, AlertTriangle, 
  FileText, Calendar, DollarSign, Truck, Globe
} from "lucide-react"

interface Supplier {
  id: string
  name: string
  company: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  contactPerson: {
    name: string
    title: string
    email: string
    phone: string
  }
  businessInfo: {
    taxId: string
    website: string
    businessType: string
    yearsInBusiness: number
  }
  status: 'active' | 'inactive' | 'pending' | 'suspended'
  rating: number
  paymentTerms: string
  leadTime: number
  minimumOrder: number
  currency: string
  notes: string
  products: SupplierProduct[]
  orders: PurchaseOrder[]
  createdAt: string
  lastOrderDate?: string
}

interface SupplierProduct {
  id: string
  sku: string
  name: string
  supplierSku: string
  cost: number
  availability: 'in-stock' | 'low-stock' | 'out-of-stock' | 'discontinued'
  lastUpdated: string
}

interface PurchaseOrder {
  id: string
  orderNumber: string
  date: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  totalAmount: number
  itemCount: number
}

export default function SuppliersPage() {
  const { data: session } = useSession()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: ""
    },
    contactPerson: {
      name: "",
      title: "",
      email: "",
      phone: ""
    },
    businessInfo: {
      taxId: "",
      website: "",
      businessType: "",
      yearsInBusiness: 0
    },
    status: "active" as 'active' | 'inactive' | 'pending' | 'suspended',
    paymentTerms: "",
    leadTime: 0,
    minimumOrder: 0,
    currency: "USD",
    notes: ""
  })

  // Mock suppliers data
  useEffect(() => {
    const mockSuppliers: Supplier[] = [
      {
        id: '1',
        name: 'John Smith',
        company: 'TechGlobal Suppliers Ltd.',
        email: 'john@techglobal.com',
        phone: '+1 (555) 123-4567',
        address: {
          street: '123 Industrial Blvd',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94107',
          country: 'USA'
        },
        contactPerson: {
          name: 'John Smith',
          title: 'Sales Manager',
          email: 'john@techglobal.com',
          phone: '+1 (555) 123-4567'
        },
        businessInfo: {
          taxId: '12-3456789',
          website: 'https://techglobal.com',
          businessType: 'Wholesale',
          yearsInBusiness: 15
        },
        status: 'active',
        rating: 4.8,
        paymentTerms: 'Net 30',
        leadTime: 5,
        minimumOrder: 1000,
        currency: 'USD',
        notes: 'Reliable supplier for electronics',
        products: [],
        orders: [],
        createdAt: '2024-01-15T10:00:00Z',
        lastOrderDate: '2024-12-01T10:00:00Z'
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        company: 'Fashion Forward Inc.',
        email: 'sarah@fashionforward.com',
        phone: '+1 (555) 987-6543',
        address: {
          street: '456 Fashion Ave',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        contactPerson: {
          name: 'Sarah Johnson',
          title: 'Account Executive',
          email: 'sarah@fashionforward.com',
          phone: '+1 (555) 987-6543'
        },
        businessInfo: {
          taxId: '98-7654321',
          website: 'https://fashionforward.com',
          businessType: 'Manufacturer',
          yearsInBusiness: 8
        },
        status: 'active',
        rating: 4.5,
        paymentTerms: 'Net 15',
        leadTime: 10,
        minimumOrder: 500,
        currency: 'USD',
        notes: 'Great for clothing and accessories',
        products: [],
        orders: [],
        createdAt: '2024-03-20T10:00:00Z',
        lastOrderDate: '2024-11-15T10:00:00Z'
      },
      {
        id: '3',
        name: 'Mike Chen',
        company: 'Global Parts Co.',
        email: 'mike@globalparts.com',
        phone: '+86 138-0013-8000',
        address: {
          street: '789 Manufacturing St',
          city: 'Shenzhen',
          state: 'Guangdong',
          zipCode: '518000',
          country: 'China'
        },
        contactPerson: {
          name: 'Mike Chen',
          title: 'International Sales',
          email: 'mike@globalparts.com',
          phone: '+86 138-0013-8000'
        },
        businessInfo: {
          taxId: 'CN-123456789',
          website: 'https://globalparts.com',
          businessType: 'Manufacturer',
          yearsInBusiness: 12
        },
        status: 'pending',
        rating: 4.2,
        paymentTerms: 'T/T 50% advance',
        leadTime: 15,
        minimumOrder: 2000,
        currency: 'USD',
        notes: 'Pending compliance verification',
        products: [],
        orders: [],
        createdAt: '2024-12-01T10:00:00Z'
      }
    ]

    setTimeout(() => {
      setSuppliers(mockSuppliers)
      setLoading(false)
    }, 1000)
  }, [])

  // Filter suppliers
  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || supplier.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // In real app, make API call
      const newSupplier: Supplier = {
        ...formData,
        id: Date.now().toString(),
        rating: 0,
        products: [],
        orders: [],
        createdAt: new Date().toISOString()
      }

      if (editingSupplier) {
        setSuppliers(suppliers.map(s => s.id === editingSupplier.id ? { ...newSupplier, id: editingSupplier.id } : s))
      } else {
        setSuppliers([...suppliers, newSupplier])
      }

      resetForm()
      setIsAddDialogOpen(false)
      setEditingSupplier(null)
    } catch (error) {
      console.error("Error saving supplier:", error)
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: ""
      },
      contactPerson: {
        name: "",
        title: "",
        email: "",
        phone: ""
      },
      businessInfo: {
        taxId: "",
        website: "",
        businessType: "",
        yearsInBusiness: 0
      },
      status: "active",
      paymentTerms: "",
      leadTime: 0,
      minimumOrder: 0,
      currency: "USD",
      notes: ""
    })
  }

  // Handle edit
  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setFormData({
      name: supplier.name,
      company: supplier.company,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      contactPerson: supplier.contactPerson,
      businessInfo: supplier.businessInfo,
      status: supplier.status,
      paymentTerms: supplier.paymentTerms,
      leadTime: supplier.leadTime,
      minimumOrder: supplier.minimumOrder,
      currency: supplier.currency,
      notes: supplier.notes
    })
    setIsAddDialogOpen(true)
  }

  // Calculate stats
  const stats = {
    total: suppliers.length,
    active: suppliers.filter(s => s.status === 'active').length,
    pending: suppliers.filter(s => s.status === 'pending').length,
    averageRating: suppliers.length > 0 ? suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length : 0
  }

  if (!session) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>Please sign in to access supplier management.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Supplier Management</h1>
          <p className="text-gray-600">Manage vendor relationships and procurement</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingSupplier ? "Edit Supplier" : "Add New Supplier"}</DialogTitle>
              <DialogDescription>
                {editingSupplier ? "Update supplier information" : "Add a new supplier to your network"}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit}>
              <Tabs defaultValue="basic" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                  <TabsTrigger value="business">Business</TabsTrigger>
                  <TabsTrigger value="terms">Terms</TabsTrigger>
                </TabsList>

                {/* Basic Information Tab */}
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Contact Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Company Name *</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value: 'active' | 'inactive' | 'pending' | 'suspended') => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                {/* Contact Information Tab */}
                <TabsContent value="contact" className="space-y-4">
                  <div className="space-y-4">
                    <h4 className="font-medium">Primary Contact</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Contact Name</Label>
                        <Input
                          value={formData.contactPerson.name}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            contactPerson: { ...formData.contactPerson, name: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={formData.contactPerson.title}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            contactPerson: { ...formData.contactPerson, title: e.target.value }
                          })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Contact Email</Label>
                        <Input
                          type="email"
                          value={formData.contactPerson.email}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            contactPerson: { ...formData.contactPerson, email: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label>Contact Phone</Label>
                        <Input
                          value={formData.contactPerson.phone}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            contactPerson: { ...formData.contactPerson, phone: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Address</h4>
                    <div>
                      <Label>Street Address</Label>
                      <Input
                        value={formData.address.street}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          address: { ...formData.address, street: e.target.value }
                        })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>City</Label>
                        <Input
                          value={formData.address.city}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            address: { ...formData.address, city: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label>State/Province</Label>
                        <Input
                          value={formData.address.state}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            address: { ...formData.address, state: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>ZIP/Postal Code</Label>
                        <Input
                          value={formData.address.zipCode}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            address: { ...formData.address, zipCode: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label>Country</Label>
                        <Input
                          value={formData.address.country}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            address: { ...formData.address, country: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Business Information Tab */}
                <TabsContent value="business" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Tax ID</Label>
                      <Input
                        value={formData.businessInfo.taxId}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          businessInfo: { ...formData.businessInfo, taxId: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Website</Label>
                      <Input
                        value={formData.businessInfo.website}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          businessInfo: { ...formData.businessInfo, website: e.target.value }
                        })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Business Type</Label>
                      <Select 
                        value={formData.businessInfo.businessType}
                        onValueChange={(value) => setFormData({ 
                          ...formData, 
                          businessInfo: { ...formData.businessInfo, businessType: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manufacturer">Manufacturer</SelectItem>
                          <SelectItem value="distributor">Distributor</SelectItem>
                          <SelectItem value="wholesale">Wholesaler</SelectItem>
                          <SelectItem value="retailer">Retailer</SelectItem>
                          <SelectItem value="service">Service Provider</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Years in Business</Label>
                      <Input
                        type="number"
                        value={formData.businessInfo.yearsInBusiness}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          businessInfo: { ...formData.businessInfo, yearsInBusiness: parseInt(e.target.value) || 0 }
                        })}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Terms Tab */}
                <TabsContent value="terms" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Payment Terms</Label>
                      <Select 
                        value={formData.paymentTerms}
                        onValueChange={(value) => setFormData({ ...formData, paymentTerms: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select terms" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="net-15">Net 15</SelectItem>
                          <SelectItem value="net-30">Net 30</SelectItem>
                          <SelectItem value="net-60">Net 60</SelectItem>
                          <SelectItem value="cod">Cash on Delivery</SelectItem>
                          <SelectItem value="advance">50% Advance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Lead Time (days)</Label>
                      <Input
                        type="number"
                        value={formData.leadTime}
                        onChange={(e) => setFormData({ ...formData, leadTime: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Minimum Order ($)</Label>
                      <Input
                        type="number"
                        value={formData.minimumOrder}
                        onChange={(e) => setFormData({ ...formData, minimumOrder: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label>Currency</Label>
                      <Select 
                        value={formData.currency}
                        onValueChange={(value) => setFormData({ ...formData, currency: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="CNY">CNY</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Notes</Label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                    />
                  </div>
                </TabsContent>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingSupplier ? "Update Supplier" : "Create Supplier"}
                  </Button>
                </div>
              </Tabs>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Suppliers</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Suppliers</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                <p className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search suppliers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Suppliers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Suppliers ({filteredSuppliers.length})</CardTitle>
          <CardDescription>
            {loading ? "Loading suppliers..." : `Manage your supplier relationships`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : filteredSuppliers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Building className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">No suppliers found</h3>
              <p className="text-sm text-gray-500 mb-4">
                {suppliers.length === 0 ? "Add your first supplier" : "Try adjusting your filters"}
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Supplier
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Terms</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{supplier.company}</div>
                        <div className="text-sm text-gray-500">{supplier.name}</div>
                        {supplier.businessInfo.website && (
                          <div className="text-sm text-blue-600">
                            <Globe className="inline w-3 h-3 mr-1" />
                            <a href={supplier.businessInfo.website} target="_blank" rel="noopener noreferrer">
                              Website
                            </a>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="w-3 h-3 mr-1" />
                          {supplier.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="w-3 h-3 mr-1" />
                          {supplier.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {supplier.address.city}, {supplier.address.country}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{supplier.paymentTerms}</div>
                        <div className="text-gray-500">{supplier.leadTime} days lead</div>
                        <div className="text-gray-500">Min: ${supplier.minimumOrder.toLocaleString()}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span>{supplier.rating.toFixed(1)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        supplier.status === "active" ? "default" :
                        supplier.status === "pending" ? "secondary" :
                        "destructive"
                      }>
                        {supplier.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(supplier)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            if (confirm("Delete this supplier?")) {
                              setSuppliers(suppliers.filter(s => s.id !== supplier.id))
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
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