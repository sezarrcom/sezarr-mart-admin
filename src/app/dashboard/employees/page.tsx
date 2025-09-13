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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession } from "next-auth/react"
import {
  Search, Filter, Download, Eye, Edit, Plus, UserPlus, Users,
  Mail, Phone, MapPin, Calendar, DollarSign, Clock, Award,
  CheckCircle, XCircle, AlertTriangle, Settings, Key, Shield,
  Building2, Briefcase, GraduationCap, Star, Activity, MoreHorizontal
} from "lucide-react"

interface Employee {
  id: string
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  avatar?: string
  position: string
  department: string
  manager?: string
  hireDate: string
  status: 'active' | 'inactive' | 'on_leave' | 'terminated'
  salary: number
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  emergencyContact: {
    name: string
    relationship: string
    phone: string
  }
  permissions: {
    role: 'admin' | 'manager' | 'staff' | 'viewer'
    modules: string[]
    canApprove: boolean
    maxApprovalAmount?: number
  }
  performance: {
    rating: number
    lastReview: string
    nextReview: string
    goals: string[]
  }
  attendance: {
    totalDays: number
    presentDays: number
    absentDays: number
    lateCount: number
  }
  benefits: {
    healthInsurance: boolean
    paidTimeOff: number
    usedTimeOff: number
    retirement: boolean
  }
}

export default function EmployeesPage() {
  const { data: session } = useSession()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    salary: 0,
    hireDate: "",
    role: "staff" as "admin" | "manager" | "staff" | "viewer"
  })

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      // Mock data for development
      const mockEmployees: Employee[] = [
        {
          id: "1",
          employeeId: "EMP-001",
          firstName: "Rajesh",
          lastName: "Kumar",
          email: "rajesh.kumar@sezarrmart.com",
          phone: "+91 98765 43210",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
          position: "Senior Manager",
          department: "Operations", 
          manager: "CEO",
          hireDate: "2023-01-15T00:00:00Z",
          status: "active",
          salary: 150000,
          address: {
            street: "123 MG Road",
            city: "Mumbai",
            state: "Maharashtra",
            zipCode: "400001",
            country: "India"
          },
          emergencyContact: {
            name: "Priya Kumar",
            relationship: "Spouse",
            phone: "+91 98765 43211"
          },
          permissions: {
            role: "manager",
            modules: ["orders", "products", "customers", "reports"],
            canApprove: true,
            maxApprovalAmount: 100000
          },
          performance: {
            rating: 4.5,
            lastReview: "2024-12-15T00:00:00Z",
            nextReview: "2025-06-15T00:00:00Z",
            goals: ["Improve team productivity", "Reduce order processing time", "Increase customer satisfaction"]
          },
          attendance: {
            totalDays: 250,
            presentDays: 242,
            absentDays: 8,
            lateCount: 3
          },
          benefits: {
            healthInsurance: true,
            paidTimeOff: 25,
            usedTimeOff: 8,
            retirement: true
          }
        },
        {
          id: "2",
          employeeId: "EMP-002", 
          firstName: "Priya",
          lastName: "Sharma",
          email: "priya.sharma@sezarrmart.com",
          phone: "+91 98765 43212",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
          position: "Product Manager",
          department: "Product",
          manager: "Rajesh Kumar",
          hireDate: "2023-03-20T00:00:00Z",
          status: "active",
          salary: 120000,
          address: {
            street: "456 Park Avenue",
            city: "Bangalore",
            state: "Karnataka", 
            zipCode: "560001",
            country: "India"
          },
          emergencyContact: {
            name: "Amit Sharma",
            relationship: "Brother",
            phone: "+91 98765 43213"
          },
          permissions: {
            role: "staff",
            modules: ["products", "inventory", "suppliers"],
            canApprove: true,
            maxApprovalAmount: 50000
          },
          performance: {
            rating: 4.8,
            lastReview: "2024-11-20T00:00:00Z",
            nextReview: "2025-05-20T00:00:00Z",
            goals: ["Launch new product lines", "Improve inventory accuracy", "Enhance supplier relationships"]
          },
          attendance: {
            totalDays: 240,
            presentDays: 236,
            absentDays: 4,
            lateCount: 1
          },
          benefits: {
            healthInsurance: true,
            paidTimeOff: 20,
            usedTimeOff: 5,
            retirement: true
          }
        },
        {
          id: "3",
          employeeId: "EMP-003",
          firstName: "Arjun",
          lastName: "Patel",
          email: "arjun.patel@sezarrmart.com",
          phone: "+91 98765 43214",
          position: "Customer Support Executive",
          department: "Customer Service",
          manager: "Priya Sharma",
          hireDate: "2024-01-10T00:00:00Z",
          status: "active", 
          salary: 45000,
          address: {
            street: "789 Commercial Street",
            city: "Pune",
            state: "Maharashtra",
            zipCode: "411001",
            country: "India"
          },
          emergencyContact: {
            name: "Neeta Patel", 
            relationship: "Mother",
            phone: "+91 98765 43215"
          },
          permissions: {
            role: "staff",
            modules: ["customers", "orders"],
            canApprove: false
          },
          performance: {
            rating: 4.2,
            lastReview: "2024-10-10T00:00:00Z",
            nextReview: "2025-04-10T00:00:00Z",
            goals: ["Improve response time", "Increase customer satisfaction", "Learn new support tools"]
          },
          attendance: {
            totalDays: 200,
            presentDays: 195,
            absentDays: 5,
            lateCount: 2
          },
          benefits: {
            healthInsurance: true,
            paidTimeOff: 15,
            usedTimeOff: 3,
            retirement: false
          }
        }
      ]

      setEmployees(mockEmployees)
    } catch (error) {
      console.error("Error fetching employees:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filter employees
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter
    const matchesStatus = statusFilter === "all" || employee.status === statusFilter
    return matchesSearch && matchesDepartment && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const variants = {
      'active': 'default',
      'inactive': 'secondary',
      'on_leave': 'outline',
      'terminated': 'destructive'
    }
    return variants[status as keyof typeof variants] || 'secondary'
  }

  const getRoleBadge = (role: string) => {
    const variants = {
      'admin': 'destructive',
      'manager': 'default',
      'staff': 'secondary', 
      'viewer': 'outline'
    }
    return variants[role as keyof typeof variants] || 'secondary'
  }

  const getDepartments = () => {
    const departments = Array.from(new Set(employees.map(emp => emp.department)))
    return departments.sort()
  }

  const getTotalStats = () => {
    return employees.reduce((acc, employee) => ({
      totalEmployees: acc.totalEmployees + 1,
      activeEmployees: acc.activeEmployees + (employee.status === 'active' ? 1 : 0),
      totalSalary: acc.totalSalary + employee.salary,
      avgRating: acc.avgRating + employee.performance.rating
    }), { totalEmployees: 0, activeEmployees: 0, totalSalary: 0, avgRating: 0 })
  }

  const stats = getTotalStats()
  stats.avgRating = stats.totalEmployees > 0 ? stats.avgRating / stats.totalEmployees : 0

  if (!session) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>Please sign in to access employee management.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Employee Management</h1>
          <p className="text-muted-foreground text-lg">Manage team members, roles, and performance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shrink-0">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogDescription>Create a new employee profile and set permissions</DialogDescription>
              </DialogHeader>
              {/* Form content would go here */}
              <div className="text-center py-8 text-muted-foreground">
                Employee creation form would be implemented here
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeEmployees}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.activeEmployees / stats.totalEmployees) * 100).toFixed(0)}% of total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalSalary.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Monthly cost</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgRating.toFixed(1)}/5</div>
            <p className="text-xs text-muted-foreground">Based on reviews</p>
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
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {getDepartments().map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
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
                  <SelectItem value="on_leave">On Leave</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employees Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employees ({filteredEmployees.length})</CardTitle>
          <CardDescription>
            {loading ? "Loading employees..." : `Showing ${filteredEmployees.length} of ${employees.length} employees`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading employees...</div>
          ) : filteredEmployees.length === 0 ? (
            <div className="text-center py-8">No employees found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={employee.avatar} />
                          <AvatarFallback>
                            {employee.firstName[0]}{employee.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <div className="font-medium">
                            {employee.firstName} {employee.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {employee.employeeId} • {employee.email}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Hired: {new Date(employee.hireDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{employee.position}</div>
                        <div className="text-sm text-muted-foreground">
                          ₹{employee.salary.toLocaleString()}/month
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{employee.department}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadge(employee.permissions.role) as any}>
                        {employee.permissions.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{employee.performance.rating}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Attendance: {((employee.attendance.presentDays / employee.attendance.totalDays) * 100).toFixed(0)}%
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadge(employee.status) as any}>
                        {employee.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedEmployee(employee)}
                          title="View Profile"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Edit Employee"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Permissions"
                        >
                          <Key className="h-4 w-4" />
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

      {/* Employee Details Dialog */}
      {selectedEmployee && (
        <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedEmployee.firstName} {selectedEmployee.lastName}
              </DialogTitle>
              <DialogDescription>
                Employee ID: {selectedEmployee.employeeId}
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
                <TabsTrigger value="benefits">Benefits</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{selectedEmployee.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{selectedEmployee.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {selectedEmployee.address.street}, {selectedEmployee.address.city}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Job Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        <span>{selectedEmployee.position}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <span>{selectedEmployee.department}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>₹{selectedEmployee.salary.toLocaleString()}/month</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="performance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Performance Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Current Rating</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{selectedEmployee.performance.rating}/5</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <span className="font-medium">Goals</span>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          {selectedEmployee.performance.goals.map((goal, index) => (
                            <li key={index}>{goal}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="attendance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Attendance Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {selectedEmployee.attendance.presentDays}
                        </div>
                        <div className="text-sm text-muted-foreground">Present</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {selectedEmployee.attendance.absentDays}
                        </div>
                        <div className="text-sm text-muted-foreground">Absent</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          {selectedEmployee.attendance.lateCount}
                        </div>
                        <div className="text-sm text-muted-foreground">Late</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {((selectedEmployee.attendance.presentDays / selectedEmployee.attendance.totalDays) * 100).toFixed(0)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Rate</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="benefits" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Benefits & Leave</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Health Insurance</span>
                          <Badge variant={selectedEmployee.benefits.healthInsurance ? "default" : "secondary"}>
                            {selectedEmployee.benefits.healthInsurance ? "Enrolled" : "Not Enrolled"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Retirement Plan</span>
                          <Badge variant={selectedEmployee.benefits.retirement ? "default" : "secondary"}>
                            {selectedEmployee.benefits.retirement ? "Enrolled" : "Not Enrolled"}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>PTO Available</span>
                          <span className="font-medium">
                            {selectedEmployee.benefits.paidTimeOff - selectedEmployee.benefits.usedTimeOff} days
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>PTO Used</span>
                          <span className="font-medium">{selectedEmployee.benefits.usedTimeOff} days</span>
                        </div>
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