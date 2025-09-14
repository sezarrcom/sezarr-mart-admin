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
  Search, Filter, Download, Eye, Edit, UserPlus, Store,
  Phone, Mail, MapPin, Calendar, DollarSign, Percent,
  Star, Truck, CreditCard, Clock, CheckCircle, XCircle,
  AlertCircle, FileText, Upload, Building, Users, Award,
  TrendingUp, BarChart3, Settings, Shield, Globe
} from "lucide-react"

interface Vendor {
  id: string
  name: string
  businessName: string
  businessType: 'individual' | 'partnership' | 'pvt_ltd' | 'llp' | 'proprietorship'
  email: string
  phone: string
  alternatePhone?: string
  logo?: string
  status: 'active' | 'inactive' | 'pending' | 'suspended' | 'blacklisted'
  joinDate: string
  lastActiveDate: string
  businessInfo: VendorBusinessInfo
  bankDetails: VendorBankDetails
  kycDocuments: VendorKYC
  commissionSettings: VendorCommission
  serviceRadius: number
  rating: number
  totalOrders: number
  totalRevenue: number
  address: VendorAddress
  settings: VendorSettings
  dashboard: VendorDashboard
}

interface VendorBusinessInfo {
  gstNumber?: string
  panNumber?: string
  cinNumber?: string
  businessLicense?: string
  website?: string
  yearEstablished?: number
  employeeCount: number
  businessDescription: string
}

interface VendorBankDetails {
  bankName: string
  accountNumber: string
  ifscCode: string
  accountHolderName: string
  branchName: string
  upiId?: string
  paymentCycle: 'daily' | 'weekly' | 'monthly'
  minimumPayout: number
}

interface VendorKYC {
  aadharNumber?: string
  aadharDocument?: string
  panDocument?: string
  businessLicense?: string
  gstCertificate?: string
  bankStatement?: string
  verificationStatus: 'pending' | 'approved' | 'rejected'
  verifiedBy?: string
  verifiedDate?: string
  notes?: string
}

interface VendorCommission {
  type: 'flat' | 'percentage'
  value: number
  categoryWise: boolean
  categories?: { categoryId: string; commission: number }[]
}

interface VendorAddress {
  street: string
  city: string
  state: string
  pincode: string
  country: string
  landmark?: string
  latitude?: number
  longitude?: number
}

interface VendorSettings {
  showVendorNameOnInvoice: boolean
  allowCustomerContact: boolean
  autoAcceptOrders: boolean
  workingHours: {
    startTime: string
    endTime: string
    workingDays: string[]
  }
  deliverySettings: {
    ownDelivery: boolean
    deliveryCharges: number
    freeDeliveryAbove: number
  }
}

interface VendorDashboard {
  hasAccess: boolean
  permissions: string[]
  lastLogin?: string
  loginCredentials?: {
    username: string
    password: string
  }
}

export default function VendorsPage() {
  const { data: session } = useSession()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [selectedVendors, setSelectedVendors] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [businessTypeFilter, setBusinessTypeFilter] = useState<string>("all")
  const [showVendorDetails, setShowVendorDetails] = useState(false)
  const [showAddVendor, setShowAddVendor] = useState(false)
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    businessType: "proprietorship",
    email: "",
    phone: "",
    status: "pending" as Vendor['status']
  })

  // Mock vendor data
  const mockVendors: Vendor[] = [
    {
      id: "1",
      name: "Rajesh Kumar",
      businessName: "TechSupply Solutions Pvt Ltd",
      businessType: "pvt_ltd",
      email: "rajesh@techsupply.com",
      phone: "+91 98765 43210",
      alternatePhone: "+91 98765 43211",
      logo: "/vendors/techsupply-logo.jpg",
      status: "active",
      joinDate: "2023-01-15T10:30:00Z",
      lastActiveDate: "2024-01-20T14:22:00Z",
      businessInfo: {
        gstNumber: "27ABCDE1234F1Z5",
        panNumber: "ABCDE1234F",
        website: "https://techsupply.com",
        yearEstablished: 2018,
        employeeCount: 25,
        businessDescription: "Electronics and computer accessories supplier"
      },
      bankDetails: {
        bankName: "HDFC Bank",
        accountNumber: "1234567890123456",
        ifscCode: "HDFC0001234",
        accountHolderName: "TechSupply Solutions Pvt Ltd",
        branchName: "Electronic City",
        upiId: "techsupply@hdfc",
        paymentCycle: "weekly",
        minimumPayout: 1000
      },
      kycDocuments: {
        aadharNumber: "1234 5678 9012",
        verificationStatus: "approved",
        verifiedBy: "admin@sezarrmart.com",
        verifiedDate: "2023-01-20T10:00:00Z"
      },
      commissionSettings: {
        type: "percentage",
        value: 7,
        categoryWise: false
      },
      serviceRadius: 25,
      rating: 4.6,
      totalOrders: 450,
      totalRevenue: 125000,
      address: {
        street: "123 Tech Park, Electronic City Phase 1",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560100",
        country: "India",
        latitude: 12.8456,
        longitude: 77.6632
      },
      settings: {
        showVendorNameOnInvoice: true,
        allowCustomerContact: true,
        autoAcceptOrders: false,
        workingHours: {
          startTime: "09:00",
          endTime: "18:00",
          workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
        },
        deliverySettings: {
          ownDelivery: true,
          deliveryCharges: 50,
          freeDeliveryAbove: 500
        }
      },
      dashboard: {
        hasAccess: true,
        permissions: ["view_orders", "manage_products", "view_reports"],
        lastLogin: "2024-01-20T09:15:00Z",
        loginCredentials: {
          username: "rajesh_techsupply",
          password: "***********"
        }
      }
    },
    {
      id: "2",
      name: "Priya Sharma",
      businessName: "ElectroHub India",
      businessType: "partnership",
      email: "priya@electrohub.in",
      phone: "+91 87654 32109",
      status: "active",
      joinDate: "2023-03-20T11:00:00Z",
      lastActiveDate: "2024-01-19T16:45:00Z",
      businessInfo: {
        gstNumber: "29FGHIJ5678K2L6",
        panNumber: "FGHIJ5678K",
        yearEstablished: 2020,
        employeeCount: 12,
        businessDescription: "Home appliances and electronic goods"
      },
      bankDetails: {
        bankName: "ICICI Bank",
        accountNumber: "9876543210987654",
        ifscCode: "ICIC0009876",
        accountHolderName: "ElectroHub India",
        branchName: "MG Road",
        paymentCycle: "monthly",
        minimumPayout: 2000
      },
      kycDocuments: {
        verificationStatus: "approved",
        verifiedBy: "admin@sezarrmart.com",
        verifiedDate: "2023-03-25T14:30:00Z"
      },
      commissionSettings: {
        type: "percentage",
        value: 8.5,
        categoryWise: false
      },
      serviceRadius: 15,
      rating: 4.2,
      totalOrders: 320,
      totalRevenue: 89500,
      address: {
        street: "456 Business District, Sector 12",
        city: "Gurgaon",
        state: "Haryana",
        pincode: "122001",
        country: "India"
      },
      settings: {
        showVendorNameOnInvoice: true,
        allowCustomerContact: false,
        autoAcceptOrders: true,
        workingHours: {
          startTime: "10:00",
          endTime: "19:00",
          workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
        },
        deliverySettings: {
          ownDelivery: false,
          deliveryCharges: 0,
          freeDeliveryAbove: 0
        }
      },
      dashboard: {
        hasAccess: true,
        permissions: ["view_orders", "manage_products"],
        lastLogin: "2024-01-19T10:20:00Z"
      }
    },
    {
      id: "3",
      name: "Mohammad Ali",
      businessName: "Fashion Trends",
      businessType: "proprietorship",
      email: "ali@fashiontrends.com",
      phone: "+91 76543 21098",
      status: "pending",
      joinDate: "2024-01-10T09:00:00Z",
      lastActiveDate: "2024-01-15T12:00:00Z",
      businessInfo: {
        yearEstablished: 2022,
        employeeCount: 5,
        businessDescription: "Fashion and clothing retailer"
      },
      bankDetails: {
        bankName: "SBI",
        accountNumber: "5432109876543210",
        ifscCode: "SBIN0005432",
        accountHolderName: "Mohammad Ali",
        branchName: "Commercial Street",
        paymentCycle: "weekly",
        minimumPayout: 500
      },
      kycDocuments: {
        verificationStatus: "pending"
      },
      commissionSettings: {
        type: "percentage",
        value: 10,
        categoryWise: false
      },
      serviceRadius: 10,
      rating: 0,
      totalOrders: 0,
      totalRevenue: 0,
      address: {
        street: "789 Fashion Street",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        country: "India"
      },
      settings: {
        showVendorNameOnInvoice: false,
        allowCustomerContact: true,
        autoAcceptOrders: false,
        workingHours: {
          startTime: "11:00",
          endTime: "20:00",
          workingDays: ["tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
        },
        deliverySettings: {
          ownDelivery: true,
          deliveryCharges: 30,
          freeDeliveryAbove: 300
        }
      },
      dashboard: {
        hasAccess: false,
        permissions: []
      }
    }
  ]

  useEffect(() => {
    setVendors(mockVendors)
  }, [])

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      pending: "bg-yellow-100 text-yellow-800",
      suspended: "bg-orange-100 text-orange-800",
      blacklisted: "bg-red-100 text-red-800"
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getKYCStatusColor = (status: string) => {
    const colors = {
      approved: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      rejected: "bg-red-100 text-red-800"
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const handleSelectAll = () => {
    if (selectedVendors.length === filteredVendors.length) {
      setSelectedVendors([])
    } else {
      setSelectedVendors(filteredVendors.map(vendor => vendor.id))
    }
  }

  const handleSelectVendor = (vendorId: string) => {
    if (selectedVendors.includes(vendorId)) {
      setSelectedVendors(selectedVendors.filter(id => id !== vendorId))
    } else {
      setSelectedVendors([...selectedVendors, vendorId])
    }
  }

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || vendor.status === statusFilter
    const matchesBusinessType = businessTypeFilter === "all" || vendor.businessType === businessTypeFilter
    
    return matchesSearch && matchesStatus && matchesBusinessType
  })

  const handleViewVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor)
    setShowVendorDetails(true)
  }

  const handleEditVendor = (vendor: Vendor) => {
    setEditingVendor(vendor)
    setFormData({
      name: vendor.name,
      businessName: vendor.businessName,
      businessType: vendor.businessType,
      email: vendor.email,
      phone: vendor.phone,
      status: vendor.status
    })
    setShowAddVendor(true)
  }

  const handleApproveKyc = () => {
    if (selectedVendor) {
      const updatedVendor = {
        ...selectedVendor,
        kycDocuments: {
          ...selectedVendor.kycDocuments,
          verificationStatus: 'approved' as const
        }
      }
      // Update vendor in state
      setVendors(prev => prev.map(v => v.id === selectedVendor.id ? updatedVendor : v))
      setSelectedVendor(updatedVendor)
      alert('KYC approved successfully!')
    }
  }

  const handleRejectKyc = () => {
    if (selectedVendor) {
      const reason = prompt('Please provide a reason for rejection:')
      if (reason) {
        const updatedVendor = {
          ...selectedVendor,
          kycDocuments: {
            ...selectedVendor.kycDocuments,
            verificationStatus: 'rejected' as const
          }
        }
        // Update vendor in state
        setVendors(prev => prev.map(v => v.id === selectedVendor.id ? updatedVendor : v))
        setSelectedVendor(updatedVendor)
        alert('KYC rejected. Vendor will be notified.')
      }
    }
  }

  const handleExportVendors = () => {
    console.log('Exporting vendors report...')
    // Export vendors data to CSV/PDF
  }

  const handleBulkStatusUpdate = (status: Vendor['status']) => {
    const updatedVendors = vendors.map(vendor => 
      selectedVendors.includes(vendor.id) ? { ...vendor, status } : vendor
    )
    setVendors(updatedVendors)
    setSelectedVendors([])
  }

  const handleSaveVendor = () => {
    if (editingVendor) {
      alert('Vendor updated successfully!')
    } else {
      alert('New vendor added successfully!')
    }
    setShowAddVendor(false)
    setEditingVendor(null)
  }

  const getVendorStats = () => {
    const totalVendors = vendors.length
    const activeVendors = vendors.filter(v => v.status === 'active').length
    const pendingVendors = vendors.filter(v => v.status === 'pending').length
    const totalRevenue = vendors.reduce((sum, v) => sum + v.totalRevenue, 0)
    const avgRating = vendors.reduce((sum, v) => sum + v.rating, 0) / totalVendors

    return {
      totalVendors,
      activeVendors,
      pendingVendors,
      totalRevenue,
      avgRating
    }
  }

  const stats = getVendorStats()

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Vendor Management</h1>
          <p className="text-muted-foreground text-lg">Manage vendor profiles, performance, and business relationships</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="w-full sm:w-auto" onClick={handleExportVendors}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowAddVendor(true)} className="w-full sm:w-auto">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Vendor
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Vendors</p>
                <p className="text-2xl font-bold">{stats.totalVendors}</p>
              </div>
              <Store className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Vendors</p>
                <p className="text-2xl font-bold">{stats.activeVendors}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold">{stats.pendingVendors}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold">{stats.avgRating.toFixed(1)}</p>
              </div>
              <Star className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search vendors..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="blacklisted">Blacklisted</SelectItem>
              </SelectContent>
            </Select>
            <Select value={businessTypeFilter} onValueChange={setBusinessTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Business Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="proprietorship">Proprietorship</SelectItem>
                <SelectItem value="partnership">Partnership</SelectItem>
                <SelectItem value="pvt_ltd">Private Limited</SelectItem>
                <SelectItem value="llp">LLP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedVendors.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedVendors.length} vendors selected
              </span>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => handleBulkStatusUpdate('active')}>
                  Activate
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkStatusUpdate('suspended')}>
                  Suspend
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkStatusUpdate('inactive')}>
                  Deactivate
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedVendors([])}>
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vendors Table */}
      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedVendors.length === filteredVendors.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Business Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>KYC Status</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedVendors.includes(vendor.id)}
                      onCheckedChange={() => handleSelectVendor(vendor.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <Store className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium">{vendor.name}</div>
                        <div className="text-sm text-gray-500">{vendor.businessName}</div>
                        <div className="text-sm text-gray-500">{vendor.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize">{vendor.businessType.replace('_', ' ')}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(vendor.status)}>
                      {vendor.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getKYCStatusColor(vendor.kycDocuments.verificationStatus)}>
                      {vendor.kycDocuments.verificationStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{vendor.totalOrders}</TableCell>
                  <TableCell>₹{vendor.totalRevenue.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      {vendor.rating || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(vendor.joinDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost" onClick={() => handleViewVendor(vendor)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleEditVendor(vendor)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Vendor Details Dialog */}
      <Dialog open={showVendorDetails} onOpenChange={setShowVendorDetails}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Vendor Details - {selectedVendor?.name}
            </DialogTitle>
            <DialogDescription>
              Complete vendor profile and business information
            </DialogDescription>
          </DialogHeader>
          
          {selectedVendor && (
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="business">Business</TabsTrigger>
                <TabsTrigger value="kyc">KYC</TabsTrigger>
                <TabsTrigger value="commission">Commission</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                          <Store className="w-8 h-8" />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">{selectedVendor.name}</h3>
                          <p className="text-gray-500">{selectedVendor.businessName}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span>{selectedVendor.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{selectedVendor.phone}</span>
                        </div>
                        {selectedVendor.alternatePhone && (
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{selectedVendor.alternatePhone} (Alt)</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Address</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                        <div className="text-sm">
                          <div>{selectedVendor.address.street}</div>
                          <div>{selectedVendor.address.city}, {selectedVendor.address.state}</div>
                          <div>{selectedVendor.address.pincode}, {selectedVendor.address.country}</div>
                          {selectedVendor.address.landmark && (
                            <div className="text-gray-500">Near {selectedVendor.address.landmark}</div>
                          )}
                          <div className="mt-2">
                            <span className="font-medium">Service Radius:</span> {selectedVendor.serviceRadius} km
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{selectedVendor.totalOrders}</div>
                        <div className="text-sm text-gray-500">Total Orders</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">₹{selectedVendor.totalRevenue.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">Total Revenue</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-yellow-600 flex items-center justify-center">
                          <Star className="w-5 h-5 mr-1" />
                          {selectedVendor.rating || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">Rating</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">{selectedVendor.commissionSettings.value}%</div>
                        <div className="text-sm text-gray-500">Commission</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="business" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Business Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Business Type</Label>
                        <div className="capitalize">{selectedVendor.businessType.replace('_', ' ')}</div>
                      </div>
                      <div>
                        <Label>Year Established</Label>
                        <div>{selectedVendor.businessInfo.yearEstablished || 'Not specified'}</div>
                      </div>
                      <div>
                        <Label>Employee Count</Label>
                        <div>{selectedVendor.businessInfo.employeeCount}</div>
                      </div>
                      <div>
                        <Label>Website</Label>
                        <div>{selectedVendor.businessInfo.website || 'Not provided'}</div>
                      </div>
                      <div>
                        <Label>GST Number</Label>
                        <div>{selectedVendor.businessInfo.gstNumber || 'Not provided'}</div>
                      </div>
                      <div>
                        <Label>PAN Number</Label>
                        <div>{selectedVendor.businessInfo.panNumber || 'Not provided'}</div>
                      </div>
                    </div>
                    <div>
                      <Label>Business Description</Label>
                      <div className="text-sm text-gray-700 mt-1">{selectedVendor.businessInfo.businessDescription}</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Bank Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Bank Name</Label>
                        <div>{selectedVendor.bankDetails.bankName}</div>
                      </div>
                      <div>
                        <Label>Account Holder</Label>
                        <div>{selectedVendor.bankDetails.accountHolderName}</div>
                      </div>
                      <div>
                        <Label>Account Number</Label>
                        <div>****{selectedVendor.bankDetails.accountNumber.slice(-4)}</div>
                      </div>
                      <div>
                        <Label>IFSC Code</Label>
                        <div>{selectedVendor.bankDetails.ifscCode}</div>
                      </div>
                      <div>
                        <Label>Payment Cycle</Label>
                        <div className="capitalize">{selectedVendor.bankDetails.paymentCycle}</div>
                      </div>
                      <div>
                        <Label>Minimum Payout</Label>
                        <div>₹{selectedVendor.bankDetails.minimumPayout}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="kyc" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>KYC Verification Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Verification Status</span>
                      <Badge className={getKYCStatusColor(selectedVendor.kycDocuments.verificationStatus)}>
                        {selectedVendor.kycDocuments.verificationStatus}
                      </Badge>
                    </div>
                    
                    {selectedVendor.kycDocuments.verifiedBy && (
                      <div className="flex items-center justify-between">
                        <span>Verified By</span>
                        <span>{selectedVendor.kycDocuments.verifiedBy}</span>
                      </div>
                    )}
                    
                    {selectedVendor.kycDocuments.verifiedDate && (
                      <div className="flex items-center justify-between">
                        <span>Verified Date</span>
                        <span>{new Date(selectedVendor.kycDocuments.verifiedDate).toLocaleDateString()}</span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <h4 className="font-medium">Document Checklist</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center space-x-2">
                          {selectedVendor.kycDocuments.aadharDocument ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                          <span>Aadhar Card</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {selectedVendor.kycDocuments.panDocument ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                          <span>PAN Card</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {selectedVendor.kycDocuments.businessLicense ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                          <span>Business License</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {selectedVendor.kycDocuments.gstCertificate ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                          <span>GST Certificate</span>
                        </div>
                      </div>
                    </div>

                    {selectedVendor.kycDocuments.verificationStatus === 'pending' && (
                      <div className="flex space-x-2 pt-4">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={handleApproveKyc}>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve KYC
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50" onClick={handleRejectKyc}>
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject KYC
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="commission" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Commission Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Commission Type</Label>
                        <div className="capitalize">{selectedVendor.commissionSettings.type}</div>
                      </div>
                      <div>
                        <Label>Commission Rate</Label>
                        <div>{selectedVendor.commissionSettings.value}%</div>
                      </div>
                      <div>
                        <Label>Category Wise Commission</Label>
                        <div>{selectedVendor.commissionSettings.categoryWise ? 'Enabled' : 'Disabled'}</div>
                      </div>
                    </div>

                    {selectedVendor.commissionSettings.categoryWise && selectedVendor.commissionSettings.categories && (
                      <div>
                        <Label>Category Commission Rates</Label>
                        <div className="mt-2 space-y-1">
                          {selectedVendor.commissionSettings.categories.map((cat, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{cat.categoryId}</span>
                              <span>{cat.commission}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Vendor Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Show vendor name on invoice</span>
                        <Badge variant={selectedVendor.settings.showVendorNameOnInvoice ? "default" : "secondary"}>
                          {selectedVendor.settings.showVendorNameOnInvoice ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Allow customer contact</span>
                        <Badge variant={selectedVendor.settings.allowCustomerContact ? "default" : "secondary"}>
                          {selectedVendor.settings.allowCustomerContact ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Auto accept orders</span>
                        <Badge variant={selectedVendor.settings.autoAcceptOrders ? "default" : "secondary"}>
                          {selectedVendor.settings.autoAcceptOrders ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Working Hours</h4>
                      <div className="text-sm text-gray-600">
                        <div>Time: {selectedVendor.settings.workingHours.startTime} - {selectedVendor.settings.workingHours.endTime}</div>
                        <div>Days: {selectedVendor.settings.workingHours.workingDays.join(', ')}</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Delivery Settings</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>Own Delivery: {selectedVendor.settings.deliverySettings.ownDelivery ? 'Yes' : 'No'}</div>
                        <div>Delivery Charges: ₹{selectedVendor.settings.deliverySettings.deliveryCharges}</div>
                        <div>Free Delivery Above: ₹{selectedVendor.settings.deliverySettings.freeDeliveryAbove}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="dashboard" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Dashboard Access</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Dashboard Access</span>
                      <Badge variant={selectedVendor.dashboard.hasAccess ? "default" : "secondary"}>
                        {selectedVendor.dashboard.hasAccess ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>

                    {selectedVendor.dashboard.hasAccess && (
                      <>
                        <div>
                          <Label>Permissions</Label>
                          <div className="mt-2 space-y-1">
                            {selectedVendor.dashboard.permissions.map((permission, index) => (
                              <Badge key={index} variant="outline" className="mr-2">
                                {permission.replace('_', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {selectedVendor.dashboard.lastLogin && (
                          <div>
                            <Label>Last Login</Label>
                            <div className="text-sm text-gray-600">{new Date(selectedVendor.dashboard.lastLogin).toLocaleString()}</div>
                          </div>
                        )}

                        {selectedVendor.dashboard.loginCredentials && (
                          <div>
                            <Label>Login Credentials</Label>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div>Username: {selectedVendor.dashboard.loginCredentials.username}</div>
                              <div>Password: {selectedVendor.dashboard.loginCredentials.password}</div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Add/Edit Vendor Dialog */}
      <Dialog open={showAddVendor} onOpenChange={setShowAddVendor}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
            </DialogTitle>
            <DialogDescription>
              {editingVendor ? 'Update vendor information' : 'Create a new vendor profile'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Contact Person Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter contact person name"
                />
              </div>
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="Enter business name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessType">Business Type</Label>
                <Select value={formData.businessType} onValueChange={(value: any) => setFormData({ ...formData, businessType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="proprietorship">Proprietorship</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="pvt_ltd">Private Limited</SelectItem>
                    <SelectItem value="llp">LLP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: Vendor['status']) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddVendor(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveVendor}>
                {editingVendor ? 'Update Vendor' : 'Add Vendor'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}