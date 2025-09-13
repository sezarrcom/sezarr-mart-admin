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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession } from "next-auth/react"
import {
  Search, Filter, Download, Eye, Edit, Plus, MessageSquare, Clock,
  User, AlertCircle, CheckCircle, XCircle, Star, Phone, Mail,
  Calendar, Tag, ArrowRight, Send, Paperclip, Flag, RotateCcw,
  Users, Headphones, Bug, Lightbulb, ShoppingCart, RefreshCw
} from "lucide-react"

interface CustomerRequest {
  id: string
  ticketId: string
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  type: 'support' | 'complaint' | 'feature_request' | 'bug_report' | 'return_refund' | 'general_inquiry'
  category: 'order_issue' | 'payment_issue' | 'product_inquiry' | 'technical_support' | 'account_help' | 'shipping_issue' | 'other'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'waiting_customer' | 'escalated' | 'resolved' | 'closed'
  subject: string
  description: string
  orderId?: string
  productId?: string
  assignedTo?: {
    id: string
    name: string
    avatar?: string
  }
  communications: {
    id: string
    from: 'customer' | 'agent' | 'system'
    fromName: string
    message: string
    timestamp: string
    attachments?: string[]
    isInternal: boolean
  }[]
  resolution?: {
    resolvedBy: string
    resolutionDate: string
    resolutionNotes: string
    customerSatisfaction?: number
    followUpRequired: boolean
  }
  metadata: {
    source: 'website' | 'mobile_app' | 'phone' | 'email' | 'chat'
    device?: string
    browser?: string
    ipAddress?: string
    userAgent?: string
  }
  tags: string[]
  slaMetrics: {
    firstResponseTime?: number // minutes
    resolutionTime?: number // minutes
    escalationTime?: number // minutes
  }
  createdDate: string
  updatedDate: string
  dueDate?: string
}

export default function RequestsPage() {
  const { data: session } = useSession()
  const [requests, setRequests] = useState<CustomerRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [selectedRequest, setSelectedRequest] = useState<CustomerRequest | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newMessage, setNewMessage] = useState("")

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      // Mock data for development
      const mockRequests: CustomerRequest[] = [
        {
          id: "1",
          ticketId: "REQ-2025-001",
          customerId: "CUST-001",
          customerName: "Rajesh Kumar",
          customerEmail: "rajesh@example.com",
          customerPhone: "+91 98765 43210",
          type: "complaint",
          category: "order_issue",
          priority: "high",
          status: "open",
          subject: "Order not delivered on time",
          description: "I placed an order (ORD-001) on January 15th with express delivery, but it's already been 3 days and I haven't received it. This is very disappointing as I needed the items urgently.",
          orderId: "ORD-001",
          assignedTo: {
            id: "AGENT-001",
            name: "Priya Sharma",
            avatar: "/avatars/priya.jpg"
          },
          communications: [
            {
              id: "1",
              from: "customer",
              fromName: "Rajesh Kumar",
              message: "I placed an order on January 15th with express delivery, but it's already been 3 days and I haven't received it. This is very disappointing as I needed the items urgently.",
              timestamp: "2025-01-19T09:30:00Z",
              isInternal: false
            },
            {
              id: "2",
              from: "agent",
              fromName: "Priya Sharma",
              message: "Hi Rajesh, I sincerely apologize for the delay. I've immediately escalated your order to our fulfillment team. You should receive a tracking update within 2 hours. As compensation, I'm adding a 10% discount to your next order.",
              timestamp: "2025-01-19T10:15:00Z",
              isInternal: false
            }
          ],
          metadata: {
            source: "website",
            device: "Desktop",
            browser: "Chrome 120.0",
            ipAddress: "103.21.58.xxx"
          },
          tags: ["urgent", "delivery_delay", "vip_customer"],
          slaMetrics: {
            firstResponseTime: 45
          },
          createdDate: "2025-01-19T09:30:00Z",
          updatedDate: "2025-01-19T10:15:00Z",
          dueDate: "2025-01-19T17:30:00Z"
        },
        {
          id: "2",
          ticketId: "REQ-2025-002",
          customerId: "CUST-002",
          customerName: "Sunita Patel",
          customerEmail: "sunita@example.com",
          customerPhone: "+91 87654 32109",
          type: "return_refund",
          category: "product_inquiry",
          priority: "medium",
          status: "resolved",
          subject: "Product return request - wrong size delivered",
          description: "I ordered a medium size t-shirt but received a large size. I would like to return it and get the correct size.",
          orderId: "ORD-004",
          productId: "PROD-TS-001",
          assignedTo: {
            id: "AGENT-002",
            name: "Amit Singh",
            avatar: "/avatars/amit.jpg"
          },
          communications: [
            {
              id: "1",
              from: "customer",
              fromName: "Sunita Patel",
              message: "I ordered a medium size t-shirt but received a large size. I would like to return it and get the correct size.",
              timestamp: "2025-01-18T14:20:00Z",
              isInternal: false
            },
            {
              id: "2",
              from: "agent",
              fromName: "Amit Singh",
              message: "Hi Sunita, I understand your concern. I've initiated a return pickup for tomorrow. Once we receive the item, we'll immediately ship the correct size. No additional charges.",
              timestamp: "2025-01-18T14:45:00Z",
              isInternal: false
            },
            {
              id: "3",
              from: "system",
              fromName: "System",
              message: "Return pickup scheduled for January 19th, 2025 between 10:00 AM - 2:00 PM",
              timestamp: "2025-01-18T14:46:00Z",
              isInternal: false
            }
          ],
          resolution: {
            resolvedBy: "Amit Singh",
            resolutionDate: "2025-01-19T16:30:00Z",
            resolutionNotes: "Return pickup completed successfully. Correct size dispatched with express delivery. Customer satisfied with resolution.",
            customerSatisfaction: 5,
            followUpRequired: false
          },
          metadata: {
            source: "mobile_app",
            device: "iPhone 15",
            ipAddress: "117.97.120.xxx"
          },
          tags: ["size_exchange", "quick_resolution"],
          slaMetrics: {
            firstResponseTime: 25,
            resolutionTime: 1500 // 25 hours
          },
          createdDate: "2025-01-18T14:20:00Z",
          updatedDate: "2025-01-19T16:30:00Z"
        },
        {
          id: "3",
          ticketId: "REQ-2025-003",
          customerId: "CUST-003",
          customerName: "Vikram Mehta",
          customerEmail: "vikram@example.com",
          customerPhone: "+91 76543 21098",
          type: "feature_request",
          category: "technical_support",
          priority: "low",
          status: "in_progress",
          subject: "Request for wishlist sharing feature",
          description: "It would be great if I could share my wishlist with family members so they can see what I'm interested in buying. This would be especially useful during festivals and birthdays.",
          assignedTo: {
            id: "AGENT-003",
            name: "Neha Gupta",
            avatar: "/avatars/neha.jpg"
          },
          communications: [
            {
              id: "1",
              from: "customer",
              fromName: "Vikram Mehta",
              message: "It would be great if I could share my wishlist with family members so they can see what I'm interested in buying. This would be especially useful during festivals and birthdays.",
              timestamp: "2025-01-17T11:15:00Z",
              isInternal: false
            },
            {
              id: "2",
              from: "agent",
              fromName: "Neha Gupta",
              message: "That's an excellent suggestion, Vikram! I've forwarded your request to our product development team. They'll evaluate this for inclusion in our upcoming features roadmap.",
              timestamp: "2025-01-17T12:30:00Z",
              isInternal: false
            },
            {
              id: "3",
              from: "agent",
              fromName: "Neha Gupta",
              message: "[Internal] Feature request logged in JIRA ticket DEV-1245. Product team confirmed it aligns with Q2 social commerce initiatives.",
              timestamp: "2025-01-17T12:35:00Z",
              isInternal: true
            }
          ],
          metadata: {
            source: "email",
            ipAddress: "152.58.96.xxx"
          },
          tags: ["feature_request", "product_enhancement", "social_commerce"],
          slaMetrics: {
            firstResponseTime: 75
          },
          createdDate: "2025-01-17T11:15:00Z",
          updatedDate: "2025-01-17T12:35:00Z"
        },
        {
          id: "4",
          ticketId: "REQ-2025-004",
          customerId: "CUST-004",
          customerName: "Anita Reddy",
          customerEmail: "anita@example.com",
          customerPhone: "+91 65432 10987",
          type: "bug_report",
          category: "technical_support",
          priority: "urgent",
          status: "escalated",
          subject: "Payment page not loading on mobile app",
          description: "When I try to checkout and proceed to payment, the payment page just shows a blank screen. I've tried multiple times but can't complete my purchase. This is happening on Android app version 2.1.5.",
          assignedTo: {
            id: "AGENT-004",
            name: "Rohit Sharma",
            avatar: "/avatars/rohit.jpg"
          },
          communications: [
            {
              id: "1",
              from: "customer",
              fromName: "Anita Reddy",
              message: "When I try to checkout and proceed to payment, the payment page just shows a blank screen. I've tried multiple times but can't complete my purchase. This is happening on Android app version 2.1.5.",
              timestamp: "2025-01-19T08:45:00Z",
              isInternal: false
            },
            {
              id: "2",
              from: "agent",
              fromName: "Rohit Sharma",
              message: "Hi Anita, this seems like a technical issue. I'm immediately escalating this to our technical team. In the meantime, please try using our website for checkout. I'll also reserve your cart items.",
              timestamp: "2025-01-19T09:00:00Z",
              isInternal: false
            },
            {
              id: "3",
              from: "system",
              fromName: "System",
              message: "Ticket escalated to Technical Team - Level 2 Support",
              timestamp: "2025-01-19T09:01:00Z",
              isInternal: false
            }
          ],
          metadata: {
            source: "mobile_app",
            device: "Samsung Galaxy S23",
            userAgent: "SezarrMart/2.1.5 Android/13",
            ipAddress: "106.51.75.xxx"
          },
          tags: ["critical_bug", "payment_issue", "mobile_app", "escalated"],
          slaMetrics: {
            firstResponseTime: 15,
            escalationTime: 16
          },
          createdDate: "2025-01-19T08:45:00Z",
          updatedDate: "2025-01-19T09:01:00Z",
          dueDate: "2025-01-19T12:45:00Z"
        }
      ]

      setRequests(mockRequests)
    } catch (error) {
      console.error("Error fetching requests:", error)
    } finally {
      setLoading(false)
    }
  }

  // Handler functions for request actions
  const handleEditRequest = (request: CustomerRequest) => {
    console.log('Edit request:', request)
    // Open edit dialog or navigate to edit page
  }

  const handleExportRequests = () => {
    console.log('Exporting requests report...')
    // Export requests data to CSV/PDF
  }

  // Filter requests
  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    const matchesType = typeFilter === "all" || request.type === typeFilter
    const matchesPriority = priorityFilter === "all" || request.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesType && matchesPriority
  })

  const getStatusBadge = (status: string) => {
    const variants = {
      'open': 'destructive',
      'in_progress': 'default',
      'waiting_customer': 'secondary',
      'escalated': 'destructive',
      'resolved': 'default',
      'closed': 'outline'
    }
    const colors = {
      'open': 'bg-red-100 text-red-800',
      'in_progress': 'bg-blue-100 text-blue-800',
      'waiting_customer': 'bg-yellow-100 text-yellow-800',
      'escalated': 'bg-purple-100 text-purple-800',
      'resolved': 'bg-green-100 text-green-800',
      'closed': 'bg-gray-100 text-gray-800'
    }
    return { variant: variants[status as keyof typeof variants] || 'secondary', color: colors[status as keyof typeof colors] }
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

  const getTypeIcon = (type: string) => {
    const icons = {
      'support': Headphones,
      'complaint': AlertCircle,
      'feature_request': Lightbulb,
      'bug_report': Bug,
      'return_refund': RotateCcw,
      'general_inquiry': MessageSquare
    }
    return icons[type as keyof typeof icons] || MessageSquare
  }

  const getTotalStats = () => {
    return requests.reduce((acc, request) => ({
      totalRequests: acc.totalRequests + 1,
      open: acc.open + (request.status === 'open' ? 1 : 0),
      inProgress: acc.inProgress + (request.status === 'in_progress' ? 1 : 0),
      escalated: acc.escalated + (request.status === 'escalated' ? 1 : 0),
      resolved: acc.resolved + (request.status === 'resolved' ? 1 : 0),
      avgResponseTime: acc.avgResponseTime + (request.slaMetrics.firstResponseTime || 0)
    }), { totalRequests: 0, open: 0, inProgress: 0, escalated: 0, resolved: 0, avgResponseTime: 0 })
  }

  const stats = getTotalStats()
  const resolutionRate = stats.totalRequests > 0 ? ((stats.resolved / stats.totalRequests) * 100).toFixed(1) : 0
  const avgResponseTime = stats.totalRequests > 0 ? Math.round(stats.avgResponseTime / stats.totalRequests) : 0

  if (!session) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>Please sign in to access customer requests.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Customer Requests</h1>
          <p className="text-muted-foreground text-lg">Manage support tickets and customer inquiries</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExportRequests}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Request</DialogTitle>
                <DialogDescription>Create a new customer support request</DialogDescription>
              </DialogHeader>
              <div className="text-center py-8 text-muted-foreground">
                Request creation form would be implemented here
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRequests}</div>
            <p className="text-xs text-muted-foreground">All time requests</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.open}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Being worked on</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escalated</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.escalated}</div>
            <p className="text-xs text-muted-foreground">Escalated to L2</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolved}</div>
            <p className="text-xs text-muted-foreground">{resolutionRate}% success rate</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgResponseTime}m</div>
            <p className="text-xs text-muted-foreground">First response time</p>
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
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="waiting_customer">Waiting Customer</SelectItem>
                  <SelectItem value="escalated">Escalated</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="complaint">Complaint</SelectItem>
                  <SelectItem value="feature_request">Feature Request</SelectItem>
                  <SelectItem value="bug_report">Bug Report</SelectItem>
                  <SelectItem value="return_refund">Return/Refund</SelectItem>
                  <SelectItem value="general_inquiry">General Inquiry</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full sm:w-[120px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Support Requests ({filteredRequests.length})</CardTitle>
          <CardDescription>
            {loading ? "Loading requests..." : `Showing ${filteredRequests.length} of ${requests.length} requests`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading requests...</div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-8">No requests found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request Details</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type & Priority</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>SLA</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => {
                  const statusBadge = getStatusBadge(request.status)
                  const TypeIcon = getTypeIcon(request.type)
                  const isOverdue = request.dueDate && new Date(request.dueDate) < new Date()
                  
                  return (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{request.ticketId}</div>
                          <div className="text-sm text-gray-900 max-w-[200px] truncate">
                            {request.subject}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Created: {new Date(request.createdDate).toLocaleDateString()}
                          </div>
                          {request.orderId && (
                            <div className="text-xs text-blue-600">
                              Order: {request.orderId}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{request.customerName}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {request.customerEmail}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {request.customerPhone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <TypeIcon className="h-4 w-4" />
                            <Badge variant="outline" className="text-xs">
                              {request.type.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className={`text-sm font-medium ${getPriorityColor(request.priority)}`}>
                            {request.priority.toUpperCase()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {request.category.replace('_', ' ')}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {request.assignedTo ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={request.assignedTo.avatar} />
                              <AvatarFallback>
                                {request.assignedTo.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-sm">{request.assignedTo.name}</div>
                          </div>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            Unassigned
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge 
                            variant={statusBadge.variant as any}
                            className={statusBadge.color}
                          >
                            {request.status.replace('_', ' ')}
                          </Badge>
                          {isOverdue && (
                            <div className="text-xs text-red-600 font-medium">
                              Overdue
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {request.slaMetrics.firstResponseTime && (
                            <div className="text-xs">
                              Response: {request.slaMetrics.firstResponseTime}m
                            </div>
                          )}
                          {request.slaMetrics.resolutionTime && (
                            <div className="text-xs">
                              Resolution: {Math.round(request.slaMetrics.resolutionTime / 60)}h
                            </div>
                          )}
                          {request.dueDate && (
                            <div className={`text-xs ${isOverdue ? 'text-red-600' : 'text-muted-foreground'}`}>
                              Due: {new Date(request.dueDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedRequest(request)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Reply"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditRequest(request)}
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
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

      {/* Request Details Dialog */}
      {selectedRequest && (
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedRequest.ticketId} - {selectedRequest.subject}</span>
                <Badge variant={getStatusBadge(selectedRequest.status).variant as any}>
                  {selectedRequest.status.replace('_', ' ')}
                </Badge>
              </DialogTitle>
              <DialogDescription>
                Customer: {selectedRequest.customerName} • Created: {new Date(selectedRequest.createdDate).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="conversation" className="space-y-4">
              <TabsList>
                <TabsTrigger value="conversation">Conversation</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="resolution">Resolution</TabsTrigger>
              </TabsList>
              
              <TabsContent value="conversation" className="space-y-4">
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {selectedRequest.communications.map((comm) => (
                    <div 
                      key={comm.id} 
                      className={`p-4 rounded-lg ${
                        comm.from === 'customer' ? 'bg-blue-50 ml-8' : 
                        comm.from === 'agent' ? 'bg-green-50 mr-8' : 
                        'bg-gray-50'
                      } ${comm.isInternal ? 'border-l-4 border-orange-400' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{comm.fromName}</span>
                          {comm.isInternal && <Badge variant="outline" className="text-xs">Internal</Badge>}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comm.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">{comm.message}</p>
                      {comm.attachments && comm.attachments.length > 0 && (
                        <div className="mt-2 flex gap-2">
                          {comm.attachments.map((attachment, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <Paperclip className="h-3 w-3 mr-1" />
                              {attachment}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4">
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      rows={3}
                    />
                    <div className="flex justify-between">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Paperclip className="h-4 w-4 mr-2" />
                          Attach
                        </Button>
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" className="rounded" />
                          Internal note
                        </label>
                      </div>
                      <Button size="sm" disabled={!newMessage.trim()}>
                        <Send className="h-4 w-4 mr-2" />
                        Send Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Request Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Type</span>
                        <span className="text-sm capitalize">{selectedRequest.type.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Category</span>
                        <span className="text-sm capitalize">{selectedRequest.category.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Priority</span>
                        <span className={`text-sm font-medium ${getPriorityColor(selectedRequest.priority)}`}>
                          {selectedRequest.priority.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Source</span>
                        <span className="text-sm capitalize">{selectedRequest.metadata.source.replace('_', ' ')}</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Customer Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Name</span>
                        <span className="text-sm">{selectedRequest.customerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Email</span>
                        <span className="text-sm">{selectedRequest.customerEmail}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Phone</span>
                        <span className="text-sm">{selectedRequest.customerPhone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Customer ID</span>
                        <span className="text-sm">{selectedRequest.customerId}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {selectedRequest.tags.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Tags</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedRequest.tags.map((tag) => (
                          <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="resolution" className="space-y-4">
                {selectedRequest.resolution ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Resolution Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Resolved By</span>
                        <span className="text-sm">{selectedRequest.resolution.resolvedBy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Resolution Date</span>
                        <span className="text-sm">
                          {new Date(selectedRequest.resolution.resolutionDate).toLocaleString()}
                        </span>
                      </div>
                      {selectedRequest.resolution.customerSatisfaction && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Customer Rating</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{selectedRequest.resolution.customerSatisfaction}/5</span>
                          </div>
                        </div>
                      )}
                      <div>
                        <span className="text-sm text-muted-foreground">Resolution Notes</span>
                        <div className="mt-1 p-3 bg-gray-50 rounded-lg text-sm">
                          {selectedRequest.resolution.resolutionNotes}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      Request not yet resolved
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