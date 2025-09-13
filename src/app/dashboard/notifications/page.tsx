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
  Search, Filter, Download, Eye, Edit, Plus, Send, Bell,
  Mail, MessageSquare, Smartphone, Users, Calendar, Clock,
  CheckCircle, XCircle, AlertCircle, Settings, Zap, Target,
  BarChart3, TrendingUp, Activity, RefreshCw, Globe, User,
  FileText, Share2, Copy, Play, Pause, RotateCcw, Trash2
} from "lucide-react"

interface NotificationTemplate {
  id: string
  name: string
  type: 'email' | 'sms' | 'whatsapp' | 'push'
  category: 'transactional' | 'promotional' | 'alert' | 'reminder'
  status: 'active' | 'inactive' | 'draft'
  subject?: string
  content: string
  variables: string[]
  dltTemplateId?: string
  isDefault: boolean
  createdDate: string
  lastUsed?: string
  usage: {
    sent: number
    delivered: number
    opened?: number
    clicked?: number
  }
}

interface NotificationCampaign {
  id: string
  name: string
  type: 'immediate' | 'scheduled' | 'recurring' | 'triggered'
  channels: Array<'email' | 'sms' | 'whatsapp' | 'push'>
  status: 'draft' | 'scheduled' | 'running' | 'paused' | 'completed' | 'cancelled'
  targetAudience: {
    segmentType: 'all' | 'segment' | 'custom'
    segmentId?: string
    customFilters?: any[]
    estimatedReach: number
  }
  schedule?: {
    startDate: string
    endDate?: string
    frequency?: 'daily' | 'weekly' | 'monthly'
    timezone: string
  }
  content: {
    templateId: string
    customizations?: Record<string, any>
  }
  analytics: {
    sent: number
    delivered: number
    opened: number
    clicked: number
    conversions: number
    revenue: number
  }
  createdBy: string
  createdDate: string
}

interface NotificationProvider {
  id: string
  name: string
  type: 'email' | 'sms' | 'whatsapp' | 'push'
  status: 'active' | 'inactive' | 'testing'
  isDefault: boolean
  configuration: {
    apiKey?: string
    apiSecret?: string
    senderId?: string
    apiUrl?: string
    webhookUrl?: string
  }
  limits: {
    dailyLimit?: number
    monthlyLimit?: number
    rateLimit?: number
  }
  analytics: {
    totalSent: number
    successRate: number
    avgDeliveryTime: number
    cost: number
  }
}

interface AutomationRule {
  id: string
  name: string
  description: string
  trigger: {
    event: string
    conditions: any[]
  }
  actions: {
    type: 'send_notification' | 'add_to_segment' | 'update_customer' | 'webhook'
    configuration: any
  }[]
  status: 'active' | 'inactive'
  createdDate: string
  executions: number
  lastExecuted?: string
}

export default function NotificationsPage() {
  const { data: session } = useSession()
  const [templates, setTemplates] = useState<NotificationTemplate[]>([])
  const [campaigns, setCampaigns] = useState<NotificationCampaign[]>([])
  const [providers, setProviders] = useState<NotificationProvider[]>([])
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null)
  const [selectedCampaign, setSelectedCampaign] = useState<NotificationCampaign | null>(null)
  const [showTemplateDialog, setShowTemplateDialog] = useState(false)
  const [showCampaignDialog, setShowCampaignDialog] = useState(false)
  const [showProviderDialog, setShowProviderDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("templates")

  // Mock data
  const mockTemplates: NotificationTemplate[] = [
    {
      id: "1",
      name: "Order Confirmation",
      type: "email",
      category: "transactional",
      status: "active",
      subject: "Your Order #{order_number} has been confirmed",
      content: `Dear {customer_name},

Thank you for your order! Your order #{order_number} has been confirmed and is being prepared for shipment.

Order Details:
- Order Number: {order_number}
- Total Amount: ₹{order_total}
- Expected Delivery: {delivery_date}

You can track your order using the link below:
{tracking_link}

Best regards,
Sezarr Mart Team`,
      variables: ["customer_name", "order_number", "order_total", "delivery_date", "tracking_link"],
      isDefault: true,
      createdDate: "2024-01-01T10:00:00Z",
      lastUsed: "2024-01-20T14:30:00Z",
      usage: {
        sent: 2540,
        delivered: 2498,
        opened: 1876,
        clicked: 456
      }
    },
    {
      id: "2",
      name: "OTP Verification",
      type: "sms",
      category: "transactional",
      status: "active",
      content: "Your OTP for Sezarr Mart is: {otp}. Valid for 5 minutes. Do not share with anyone.",
      variables: ["otp"],
      dltTemplateId: "1207162142858923671",
      isDefault: true,
      createdDate: "2024-01-01T10:00:00Z",
      lastUsed: "2024-01-20T16:45:00Z",
      usage: {
        sent: 8945,
        delivered: 8901
      }
    },
    {
      id: "3",
      name: "Flash Sale Alert",
      type: "whatsapp",
      category: "promotional",
      status: "active",
      content: `🔥 *Flash Sale Alert!* 

Hi {customer_name}! 

Don't miss our exclusive flash sale with up to {discount_percent}% OFF on {category_name}!

⏰ Limited time offer ends in {time_remaining}

Shop now: {sale_link}

Happy Shopping! 🛍️`,
      variables: ["customer_name", "discount_percent", "category_name", "time_remaining", "sale_link"],
      isDefault: false,
      createdDate: "2024-01-10T15:00:00Z",
      usage: {
        sent: 1245,
        delivered: 1198,
        opened: 897,
        clicked: 234
      }
    }
  ]

  const mockCampaigns: NotificationCampaign[] = [
    {
      id: "1",
      name: "New Year Sale Campaign",
      type: "scheduled",
      channels: ["email", "sms", "whatsapp"],
      status: "completed",
      targetAudience: {
        segmentType: "segment",
        segmentId: "active_customers",
        estimatedReach: 15420
      },
      schedule: {
        startDate: "2024-01-01T10:00:00Z",
        endDate: "2024-01-07T23:59:59Z",
        timezone: "Asia/Kolkata"
      },
      content: {
        templateId: "3"
      },
      analytics: {
        sent: 15420,
        delivered: 14987,
        opened: 8456,
        clicked: 2134,
        conversions: 567,
        revenue: 2340000
      },
      createdBy: "admin@sezarrmart.com",
      createdDate: "2023-12-25T14:00:00Z"
    },
    {
      id: "2",
      name: "Cart Abandonment Recovery",
      type: "triggered",
      channels: ["email", "push"],
      status: "running",
      targetAudience: {
        segmentType: "custom",
        estimatedReach: 2456
      },
      content: {
        templateId: "4"
      },
      analytics: {
        sent: 8945,
        delivered: 8756,
        opened: 3421,
        clicked: 876,
        conversions: 234,
        revenue: 156000
      },
      createdBy: "marketing@sezarrmart.com",
      createdDate: "2024-01-15T11:30:00Z"
    }
  ]

  const mockProviders: NotificationProvider[] = [
    {
      id: "1",
      name: "Amazon SES",
      type: "email",
      status: "active",
      isDefault: true,
      configuration: {
        apiKey: "AKIA***************",
        apiSecret: "***************",
        apiUrl: "https://email.us-east-1.amazonaws.com"
      },
      limits: {
        dailyLimit: 50000,
        rateLimit: 14
      },
      analytics: {
        totalSent: 125420,
        successRate: 98.5,
        avgDeliveryTime: 2.3,
        cost: 15642
      }
    },
    {
      id: "2",
      name: "Twilio SMS",
      type: "sms",
      status: "active",
      isDefault: true,
      configuration: {
        apiKey: "AC***************",
        apiSecret: "***************",
        senderId: "SEZARR"
      },
      limits: {
        dailyLimit: 10000,
        rateLimit: 100
      },
      analytics: {
        totalSent: 78945,
        successRate: 96.2,
        avgDeliveryTime: 1.8,
        cost: 23674
      }
    },
    {
      id: "3",
      name: "WhatsApp Business API",
      type: "whatsapp",
      status: "testing",
      isDefault: false,
      configuration: {
        apiKey: "EAAG***************",
        webhookUrl: "https://api.sezarrmart.com/webhooks/whatsapp"
      },
      limits: {
        dailyLimit: 1000,
        monthlyLimit: 30000
      },
      analytics: {
        totalSent: 2340,
        successRate: 94.7,
        avgDeliveryTime: 3.1,
        cost: 4680
      }
    }
  ]

  const mockAutomationRules: AutomationRule[] = [
    {
      id: "1",
      name: "Welcome Series",
      description: "Send welcome email series to new customers",
      trigger: {
        event: "customer_registered",
        conditions: []
      },
      actions: [
        {
          type: "send_notification",
          configuration: {
            templateId: "welcome_email_1",
            delay: 0
          }
        },
        {
          type: "send_notification",
          configuration: {
            templateId: "welcome_email_2",
            delay: 86400 // 24 hours
          }
        }
      ],
      status: "active",
      createdDate: "2024-01-01T10:00:00Z",
      executions: 1245,
      lastExecuted: "2024-01-20T15:30:00Z"
    },
    {
      id: "2",
      name: "Low Stock Alert",
      description: "Alert admin when product stock is low",
      trigger: {
        event: "stock_low",
        conditions: [
          { field: "stock_quantity", operator: "less_than", value: 10 }
        ]
      },
      actions: [
        {
          type: "send_notification",
          configuration: {
            recipients: ["inventory@sezarrmart.com"],
            templateId: "low_stock_alert"
          }
        }
      ],
      status: "active",
      createdDate: "2024-01-05T14:00:00Z",
      executions: 234,
      lastExecuted: "2024-01-19T09:15:00Z"
    }
  ]

  useEffect(() => {
    setTemplates(mockTemplates)
    setCampaigns(mockCampaigns)
    setProviders(mockProviders)
    setAutomationRules(mockAutomationRules)
  }, [])

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      draft: "bg-yellow-100 text-yellow-800",
      scheduled: "bg-blue-100 text-blue-800",
      running: "bg-purple-100 text-purple-800",
      paused: "bg-orange-100 text-orange-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      testing: "bg-yellow-100 text-yellow-800"
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getTypeIcon = (type: string) => {
    const icons = {
      email: <Mail className="w-4 h-4" />,
      sms: <MessageSquare className="w-4 h-4" />,
      whatsapp: <MessageSquare className="w-4 h-4 text-green-600" />,
      push: <Bell className="w-4 h-4" />
    }
    return icons[type as keyof typeof icons] || <Bell className="w-4 h-4" />
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      transactional: "bg-blue-100 text-blue-800",
      promotional: "bg-purple-100 text-purple-800",
      alert: "bg-red-100 text-red-800",
      reminder: "bg-yellow-100 text-yellow-800"
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getNotificationStats = () => {
    const totalTemplates = templates.length
    const activeTemplates = templates.filter(t => t.status === 'active').length
    const totalCampaigns = campaigns.length
    const activeCampaigns = campaigns.filter(c => c.status === 'running').length
    const totalSent = templates.reduce((sum, t) => sum + t.usage.sent, 0)
    const totalDelivered = templates.reduce((sum, t) => sum + t.usage.delivered, 0)
    const deliveryRate = totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0

    return {
      totalTemplates,
      activeTemplates,
      totalCampaigns,
      activeCampaigns,
      totalSent,
      deliveryRate
    }
  }

  const stats = getNotificationStats()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Notification Engine</h1>
          <p className="text-gray-600">Manage multi-channel notification templates, campaigns, and automation</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={() => setShowCampaignDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Templates</p>
                <p className="text-2xl font-bold">{stats.totalTemplates}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Templates</p>
                <p className="text-2xl font-bold">{stats.activeTemplates}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Campaigns</p>
                <p className="text-2xl font-bold">{stats.totalCampaigns}</p>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold">{stats.activeCampaigns}</p>
              </div>
              <Activity className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sent</p>
                <p className="text-2xl font-bold">{stats.totalSent.toLocaleString()}</p>
              </div>
              <Send className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delivery Rate</p>
                <p className="text-2xl font-bold">{stats.deliveryRate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Notification Templates</CardTitle>
                  <CardDescription>Manage email, SMS, WhatsApp, and push notification templates</CardDescription>
                </div>
                <Button onClick={() => setShowTemplateDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Delivery Rate</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(template.type)}
                          <div>
                            <div className="font-medium">{template.name}</div>
                            {template.isDefault && (
                              <Badge variant="outline" className="text-xs">Default</Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{template.type}</TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(template.category)}>
                          {template.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(template.status)}>
                          {template.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{template.usage.sent} sent</div>
                          <div className="text-gray-500">{template.usage.delivered} delivered</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {template.usage.sent > 0 
                          ? `${((template.usage.delivered / template.usage.sent) * 100).toFixed(1)}%`
                          : 'N/A'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => setSelectedTemplate(template)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
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

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Notification Campaigns</CardTitle>
                  <CardDescription>Manage targeted notification campaigns and scheduling</CardDescription>
                </div>
                <Button onClick={() => setShowCampaignDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Campaign
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Channels</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reach</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{campaign.name}</div>
                          <div className="text-sm text-gray-500">
                            Created {new Date(campaign.createdDate).toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{campaign.type}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          {campaign.channels.map((channel) => (
                            <div key={channel} className="flex items-center">
                              {getTypeIcon(channel)}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{campaign.targetAudience.estimatedReach.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{campaign.analytics.sent} sent</div>
                          <div className="text-gray-500">
                            {campaign.analytics.sent > 0 
                              ? `${((campaign.analytics.delivered / campaign.analytics.sent) * 100).toFixed(1)}% delivered`
                              : 'No data'
                            }
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => setSelectedCampaign(campaign)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          {campaign.status === 'running' ? (
                            <Button size="sm" variant="ghost">
                              <Pause className="w-4 h-4" />
                            </Button>
                          ) : campaign.status === 'paused' ? (
                            <Button size="sm" variant="ghost">
                              <Play className="w-4 h-4" />
                            </Button>
                          ) : null}
                          <Button size="sm" variant="ghost">
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

        <TabsContent value="providers" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Notification Providers</CardTitle>
                  <CardDescription>Configure email, SMS, WhatsApp, and push notification providers</CardDescription>
                </div>
                <Button onClick={() => setShowProviderDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Provider
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {providers.map((provider) => (
                  <div key={provider.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getTypeIcon(provider.type)}
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{provider.name}</h3>
                            {provider.isDefault && (
                              <Badge variant="outline">Default</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 capitalize">{provider.type} provider</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={getStatusColor(provider.status)}>
                          {provider.status}
                        </Badge>
                        <div className="text-right text-sm">
                          <div className="font-medium">{provider.analytics.totalSent.toLocaleString()}</div>
                          <div className="text-gray-500">messages sent</div>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Success Rate:</span> {provider.analytics.successRate}%
                      </div>
                      <div>
                        <span className="text-gray-500">Avg Delivery:</span> {provider.analytics.avgDeliveryTime}s
                      </div>
                      <div>
                        <span className="text-gray-500">Total Cost:</span> ₹{provider.analytics.cost.toLocaleString()}
                      </div>
                      <div>
                        <span className="text-gray-500">Daily Limit:</span> {provider.limits.dailyLimit?.toLocaleString() || 'Unlimited'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Automation Rules</CardTitle>
                  <CardDescription>Set up automated notification workflows and triggers</CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rule Name</TableHead>
                    <TableHead>Trigger</TableHead>
                    <TableHead>Actions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Executions</TableHead>
                    <TableHead>Last Executed</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {automationRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{rule.name}</div>
                          <div className="text-sm text-gray-500">{rule.description}</div>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{rule.trigger.event.replace('_', ' ')}</TableCell>
                      <TableCell>{rule.actions.length} actions</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(rule.status)}>
                          {rule.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{rule.executions.toLocaleString()}</TableCell>
                      <TableCell>
                        {rule.lastExecuted 
                          ? new Date(rule.lastExecuted).toLocaleDateString()
                          : 'Never'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Play className="w-4 h-4" />
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

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Channel Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['email', 'sms', 'whatsapp', 'push'].map((channel) => {
                    const channelTemplates = templates.filter(t => t.type === channel)
                    const totalSent = channelTemplates.reduce((sum, t) => sum + t.usage.sent, 0)
                    const totalDelivered = channelTemplates.reduce((sum, t) => sum + t.usage.delivered, 0)
                    const deliveryRate = totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0
                    
                    return (
                      <div key={channel} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center space-x-3">
                          {getTypeIcon(channel)}
                          <div>
                            <div className="font-medium capitalize">{channel}</div>
                            <div className="text-sm text-gray-500">{totalSent.toLocaleString()} sent</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{deliveryRate.toFixed(1)}%</div>
                          <div className="text-sm text-gray-500">delivery rate</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-500">2 hours ago</span>
                    <span>Campaign "Flash Sale Alert" completed successfully</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-500">4 hours ago</span>
                    <span>New template "Order Shipped" created</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-500">6 hours ago</span>
                    <span>Automation rule "Welcome Series" executed 45 times</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-500">8 hours ago</span>
                    <span>WhatsApp provider configured successfully</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}