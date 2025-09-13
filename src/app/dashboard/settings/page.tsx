'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useSession } from "next-auth/react"
import {
  Settings, Save, RotateCcw, Bell, Shield, Database, Mail, 
  Smartphone, Globe, CreditCard, Truck, Store, Users,
  Key, Lock, AlertTriangle, CheckCircle, Upload, Download,
  Palette, Layout, Zap, FileText, Calendar, Clock, Building2,
  Package, BarChart3
} from "lucide-react"

interface SystemSettings {
  general: {
    siteName: string
    siteDescription: string
    contactEmail: string
    supportPhone: string
    timezone: string
    currency: string
    language: string
    maintenanceMode: boolean
  }
  business: {
    businessName: string
    businessType: string
    gstNumber: string
    businessAddress: string
    businessPhone: string
    businessEmail: string
    operatingHours: {
      monday: { open: string; close: string; isOpen: boolean }
      tuesday: { open: string; close: string; isOpen: boolean }
      wednesday: { open: string; close: string; isOpen: boolean }
      thursday: { open: string; close: string; isOpen: boolean }
      friday: { open: string; close: string; isOpen: boolean }
      saturday: { open: string; close: string; isOpen: boolean }
      sunday: { open: string; close: string; isOpen: boolean }
    }
  }
  notifications: {
    email: {
      enabled: boolean
      smtpServer: string
      smtpPort: number
      username: string
      password: string
      fromEmail: string
      fromName: string
    }
    sms: {
      enabled: boolean
      provider: string
      apiKey: string
      senderId: string
    }
    push: {
      enabled: boolean
      firebaseServerKey: string
      apnsCertificate: string
    }
    whatsapp: {
      enabled: boolean
      businessAccountId: string
      phoneNumberId: string
      accessToken: string
    }
  }
  payments: {
    razorpay: {
      enabled: boolean
      keyId: string
      keySecret: string
      webhookSecret: string
    }
    stripe: {
      enabled: boolean
      publishableKey: string
      secretKey: string
      webhookSecret: string
    }
    payu: {
      enabled: boolean
      merchantId: string
      secretKey: string
      salt: string
    }
    cod: {
      enabled: boolean
      maxAmount: number
      areas: string[]
    }
  }
  shipping: {
    defaultProvider: string
    providers: {
      delhivery: {
        enabled: boolean
        apiKey: string
        centers: string[]
      }
      bluedart: {
        enabled: boolean
        username: string
        password: string
        licenseKey: string
      }
      ecom: {
        enabled: boolean
        username: string
        password: string
      }
    }
    charges: {
      freeShippingThreshold: number
      standardRate: number
      expressRate: number
      sameDayRate: number
    }
  }
  inventory: {
    lowStockThreshold: number
    autoReorderEnabled: boolean
    stockAlerts: boolean
    barcodeGeneration: boolean
    expiryTracking: boolean
  }
  security: {
    twoFactorAuth: boolean
    sessionTimeout: number
    passwordPolicy: {
      minLength: number
      requireUppercase: boolean
      requireNumbers: boolean
      requireSpecialChars: boolean
    }
    apiRateLimit: {
      enabled: boolean
      requestsPerMinute: number
    }
    backupFrequency: string
    backupRetention: number
  }
  analytics: {
    googleAnalytics: {
      enabled: boolean
      trackingId: string
    }
    facebookPixel: {
      enabled: boolean
      pixelId: string
    }
    mixpanel: {
      enabled: boolean
      projectToken: string
    }
  }
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const [settings, setSettings] = useState<SystemSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      // Mock data for development
      const mockSettings: SystemSettings = {
        general: {
          siteName: "Sezarr Mart",
          siteDescription: "Your trusted online shopping destination",
          contactEmail: "contact@sezarrmart.com",
          supportPhone: "+91 1800 123 4567",
          timezone: "Asia/Kolkata",
          currency: "INR",
          language: "en",
          maintenanceMode: false
        },
        business: {
          businessName: "Sezarr Mart Private Limited",
          businessType: "E-commerce",
          gstNumber: "27AABCU9603R1ZM",
          businessAddress: "123, Business Park, Sector 18, Gurgaon, Haryana - 122015",
          businessPhone: "+91 124 456 7890",
          businessEmail: "business@sezarrmart.com",
          operatingHours: {
            monday: { open: "09:00", close: "18:00", isOpen: true },
            tuesday: { open: "09:00", close: "18:00", isOpen: true },
            wednesday: { open: "09:00", close: "18:00", isOpen: true },
            thursday: { open: "09:00", close: "18:00", isOpen: true },
            friday: { open: "09:00", close: "18:00", isOpen: true },
            saturday: { open: "10:00", close: "17:00", isOpen: true },
            sunday: { open: "10:00", close: "16:00", isOpen: false }
          }
        },
        notifications: {
          email: {
            enabled: true,
            smtpServer: "smtp.gmail.com",
            smtpPort: 587,
            username: "noreply@sezarrmart.com",
            password: "••••••••••••",
            fromEmail: "noreply@sezarrmart.com",
            fromName: "Sezarr Mart"
          },
          sms: {
            enabled: true,
            provider: "Twilio",
            apiKey: "••••••••••••",
            senderId: "SEZARR"
          },
          push: {
            enabled: true,
            firebaseServerKey: "••••••••••••",
            apnsCertificate: "••••••••••••"
          },
          whatsapp: {
            enabled: false,
            businessAccountId: "",
            phoneNumberId: "",
            accessToken: ""
          }
        },
        payments: {
          razorpay: {
            enabled: true,
            keyId: "rzp_live_••••••••••••",
            keySecret: "••••••••••••",
            webhookSecret: "••••••••••••"
          },
          stripe: {
            enabled: false,
            publishableKey: "",
            secretKey: "",
            webhookSecret: ""
          },
          payu: {
            enabled: true,
            merchantId: "SEZARR001",
            secretKey: "••••••••••••",
            salt: "••••••••••••"
          },
          cod: {
            enabled: true,
            maxAmount: 5000,
            areas: ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad"]
          }
        },
        shipping: {
          defaultProvider: "delhivery",
          providers: {
            delhivery: {
              enabled: true,
              apiKey: "••••••••••••",
              centers: ["Mumbai", "Delhi", "Bangalore"]
            },
            bluedart: {
              enabled: false,
              username: "",
              password: "",
              licenseKey: ""
            },
            ecom: {
              enabled: false,
              username: "",
              password: ""
            }
          },
          charges: {
            freeShippingThreshold: 500,
            standardRate: 40,
            expressRate: 80,
            sameDayRate: 150
          }
        },
        inventory: {
          lowStockThreshold: 10,
          autoReorderEnabled: true,
          stockAlerts: true,
          barcodeGeneration: true,
          expiryTracking: true
        },
        security: {
          twoFactorAuth: true,
          sessionTimeout: 60,
          passwordPolicy: {
            minLength: 8,
            requireUppercase: true,
            requireNumbers: true,
            requireSpecialChars: true
          },
          apiRateLimit: {
            enabled: true,
            requestsPerMinute: 100
          },
          backupFrequency: "daily",
          backupRetention: 30
        },
        analytics: {
          googleAnalytics: {
            enabled: true,
            trackingId: "GA-123456789"
          },
          facebookPixel: {
            enabled: false,
            pixelId: ""
          },
          mixpanel: {
            enabled: false,
            projectToken: ""
          }
        }
      }

      setSettings(mockSettings)
    } catch (error) {
      console.error("Error fetching settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log("Settings saved:", settings)
    } catch (error) {
      console.error("Error saving settings:", error)
    } finally {
      setSaving(false)
    }
  }

  if (!session) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>Please sign in to access system settings.</p>
        </CardContent>
      </Card>
    )
  }

  if (loading || !settings) {
    return (
      <div className="space-y-8">
        <div className="text-center py-8">Loading settings...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground text-lg">Configure system-wide settings and preferences</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchSettings}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={saveSettings} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Configuration
              </CardTitle>
              <CardDescription>Basic system settings and information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.general.siteName}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, siteName: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.general.contactEmail}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, contactEmail: e.target.value }
                    })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.general.siteDescription}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, siteDescription: e.target.value }
                  })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.general.timezone} onValueChange={(value) => setSettings({
                    ...settings,
                    general: { ...settings.general, timezone: value }
                  })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
                      <SelectItem value="America/New_York">America/New_York</SelectItem>
                      <SelectItem value="Europe/London">Europe/London</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={settings.general.currency} onValueChange={(value) => setSettings({
                    ...settings,
                    general: { ...settings.general, currency: value }
                  })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={settings.general.language} onValueChange={(value) => setSettings({
                    ...settings,
                    general: { ...settings.general, language: value }
                  })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable maintenance mode to prevent customer access
                  </p>
                </div>
                <Switch
                  checked={settings.general.maintenanceMode}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    general: { ...settings.general, maintenanceMode: checked }
                  })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Settings */}
        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Business Information
              </CardTitle>
              <CardDescription>Company and business details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={settings.business.businessName}
                    onChange={(e) => setSettings({
                      ...settings,
                      business: { ...settings.business, businessName: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gstNumber">GST Number</Label>
                  <Input
                    id="gstNumber"
                    value={settings.business.gstNumber}
                    onChange={(e) => setSettings({
                      ...settings,
                      business: { ...settings.business, gstNumber: e.target.value }
                    })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessAddress">Business Address</Label>
                <Textarea
                  id="businessAddress"
                  value={settings.business.businessAddress}
                  onChange={(e) => setSettings({
                    ...settings,
                    business: { ...settings.business, businessAddress: e.target.value }
                  })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessPhone">Business Phone</Label>
                  <Input
                    id="businessPhone"
                    value={settings.business.businessPhone}
                    onChange={(e) => setSettings({
                      ...settings,
                      business: { ...settings.business, businessPhone: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessEmail">Business Email</Label>
                  <Input
                    id="businessEmail"
                    type="email"
                    value={settings.business.businessEmail}
                    onChange={(e) => setSettings({
                      ...settings,
                      business: { ...settings.business, businessEmail: e.target.value }
                    })}
                  />
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-base font-medium">Operating Hours</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure business operating hours for customer support
                </p>
                <div className="space-y-3">
                  {Object.entries(settings.business.operatingHours).map(([day, hours]) => (
                    <div key={day} className="flex items-center gap-4">
                      <div className="w-20">
                        <Label className="capitalize">{day}</Label>
                      </div>
                      <Switch
                        checked={hours.isOpen}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          business: {
                            ...settings.business,
                            operatingHours: {
                              ...settings.business.operatingHours,
                              [day]: { ...hours, isOpen: checked }
                            }
                          }
                        })}
                      />
                      {hours.isOpen && (
                        <div className="flex items-center gap-2">
                          <Input
                            type="time"
                            value={hours.open}
                            onChange={(e) => setSettings({
                              ...settings,
                              business: {
                                ...settings.business,
                                operatingHours: {
                                  ...settings.business.operatingHours,
                                  [day]: { ...hours, open: e.target.value }
                                }
                              }
                            })}
                            className="w-24"
                          />
                          <span>to</span>
                          <Input
                            type="time"
                            value={hours.close}
                            onChange={(e) => setSettings({
                              ...settings,
                              business: {
                                ...settings.business,
                                operatingHours: {
                                  ...settings.business.operatingHours,
                                  [day]: { ...hours, close: e.target.value }
                                }
                              }
                            })}
                            className="w-24"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Configuration
              </CardTitle>
              <CardDescription>Setup email, SMS, and push notification services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Settings */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <Label className="text-base font-medium">Email Notifications</Label>
                  </div>
                  <Switch
                    checked={settings.notifications.email.enabled}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        email: { ...settings.notifications.email, enabled: checked }
                      }
                    })}
                  />
                </div>
                {settings.notifications.email.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                    <div className="space-y-2">
                      <Label>SMTP Server</Label>
                      <Input
                        value={settings.notifications.email.smtpServer}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: {
                            ...settings.notifications,
                            email: { ...settings.notifications.email, smtpServer: e.target.value }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>SMTP Port</Label>
                      <Input
                        type="number"
                        value={settings.notifications.email.smtpPort}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: {
                            ...settings.notifications,
                            email: { ...settings.notifications.email, smtpPort: parseInt(e.target.value) }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Username</Label>
                      <Input
                        value={settings.notifications.email.username}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: {
                            ...settings.notifications,
                            email: { ...settings.notifications.email, username: e.target.value }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input
                        type="password"
                        value={settings.notifications.email.password}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: {
                            ...settings.notifications,
                            email: { ...settings.notifications.email, password: e.target.value }
                          }
                        })}
                      />
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* SMS Settings */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    <Label className="text-base font-medium">SMS Notifications</Label>
                  </div>
                  <Switch
                    checked={settings.notifications.sms.enabled}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        sms: { ...settings.notifications.sms, enabled: checked }
                      }
                    })}
                  />
                </div>
                {settings.notifications.sms.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                    <div className="space-y-2">
                      <Label>Provider</Label>
                      <Select 
                        value={settings.notifications.sms.provider}
                        onValueChange={(value) => setSettings({
                          ...settings,
                          notifications: {
                            ...settings.notifications,
                            sms: { ...settings.notifications.sms, provider: value }
                          }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Twilio">Twilio</SelectItem>
                          <SelectItem value="MSG91">MSG91</SelectItem>
                          <SelectItem value="TextLocal">TextLocal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>API Key</Label>
                      <Input
                        type="password"
                        value={settings.notifications.sms.apiKey}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: {
                            ...settings.notifications,
                            sms: { ...settings.notifications.sms, apiKey: e.target.value }
                          }
                        })}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Gateway Configuration
              </CardTitle>
              <CardDescription>Setup payment processors and COD settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Razorpay */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Label className="text-base font-medium">Razorpay</Label>
                    <Badge className="ml-2" variant={settings.payments.razorpay.enabled ? "default" : "secondary"}>
                      {settings.payments.razorpay.enabled ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <Switch
                    checked={settings.payments.razorpay.enabled}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      payments: {
                        ...settings.payments,
                        razorpay: { ...settings.payments.razorpay, enabled: checked }
                      }
                    })}
                  />
                </div>
                {settings.payments.razorpay.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                    <div className="space-y-2">
                      <Label>Key ID</Label>
                      <Input
                        value={settings.payments.razorpay.keyId}
                        onChange={(e) => setSettings({
                          ...settings,
                          payments: {
                            ...settings.payments,
                            razorpay: { ...settings.payments.razorpay, keyId: e.target.value }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Key Secret</Label>
                      <Input
                        type="password"
                        value={settings.payments.razorpay.keySecret}
                        onChange={(e) => setSettings({
                          ...settings,
                          payments: {
                            ...settings.payments,
                            razorpay: { ...settings.payments.razorpay, keySecret: e.target.value }
                          }
                        })}
                      />
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* COD Settings */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Label className="text-base font-medium">Cash on Delivery</Label>
                    <Badge className="ml-2" variant={settings.payments.cod.enabled ? "default" : "secondary"}>
                      {settings.payments.cod.enabled ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <Switch
                    checked={settings.payments.cod.enabled}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      payments: {
                        ...settings.payments,
                        cod: { ...settings.payments.cod, enabled: checked }
                      }
                    })}
                  />
                </div>
                {settings.payments.cod.enabled && (
                  <div className="ml-6 space-y-4">
                    <div className="space-y-2">
                      <Label>Maximum COD Amount (₹)</Label>
                      <Input
                        type="number"
                        value={settings.payments.cod.maxAmount}
                        onChange={(e) => setSettings({
                          ...settings,
                          payments: {
                            ...settings.payments,
                            cod: { ...settings.payments.cod, maxAmount: parseInt(e.target.value) }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Available Areas</Label>
                      <div className="flex flex-wrap gap-2">
                        {settings.payments.cod.areas.map((area) => (
                          <Badge key={area} variant="outline">{area}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping Settings */}
        <TabsContent value="shipping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Shipping Configuration
              </CardTitle>
              <CardDescription>Setup shipping providers and rates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Default Shipping Provider</Label>
                <Select 
                  value={settings.shipping.defaultProvider}
                  onValueChange={(value) => setSettings({
                    ...settings,
                    shipping: { ...settings.shipping, defaultProvider: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delhivery">Delhivery</SelectItem>
                    <SelectItem value="bluedart">Blue Dart</SelectItem>
                    <SelectItem value="ecom">Ecom Express</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div>
                <Label className="text-base font-medium">Shipping Charges</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label>Free Shipping Threshold (₹)</Label>
                    <Input
                      type="number"
                      value={settings.shipping.charges.freeShippingThreshold}
                      onChange={(e) => setSettings({
                        ...settings,
                        shipping: {
                          ...settings.shipping,
                          charges: {
                            ...settings.shipping.charges,
                            freeShippingThreshold: parseInt(e.target.value)
                          }
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Standard Rate (₹)</Label>
                    <Input
                      type="number"
                      value={settings.shipping.charges.standardRate}
                      onChange={(e) => setSettings({
                        ...settings,
                        shipping: {
                          ...settings.shipping,
                          charges: {
                            ...settings.shipping.charges,
                            standardRate: parseInt(e.target.value)
                          }
                        }
                      })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory Settings */}
        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Inventory Management
              </CardTitle>
              <CardDescription>Configure inventory tracking and alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Low Stock Threshold</Label>
                <Input
                  type="number"
                  value={settings.inventory.lowStockThreshold}
                  onChange={(e) => setSettings({
                    ...settings,
                    inventory: { ...settings.inventory, lowStockThreshold: parseInt(e.target.value) }
                  })}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Reorder</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically reorder when stock is low
                    </p>
                  </div>
                  <Switch
                    checked={settings.inventory.autoReorderEnabled}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      inventory: { ...settings.inventory, autoReorderEnabled: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Stock Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Send notifications for low stock items
                    </p>
                  </div>
                  <Switch
                    checked={settings.inventory.stockAlerts}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      inventory: { ...settings.inventory, stockAlerts: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Barcode Generation</Label>
                    <p className="text-sm text-muted-foreground">
                      Auto-generate barcodes for new products
                    </p>
                  </div>
                  <Switch
                    checked={settings.inventory.barcodeGeneration}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      inventory: { ...settings.inventory, barcodeGeneration: checked }
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Configuration
              </CardTitle>
              <CardDescription>Manage security policies and authentication settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for admin accounts
                  </p>
                </div>
                <Switch
                  checked={settings.security.twoFactorAuth}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    security: { ...settings.security, twoFactorAuth: checked }
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label>Session Timeout (minutes)</Label>
                <Input
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => setSettings({
                    ...settings,
                    security: { ...settings.security, sessionTimeout: parseInt(e.target.value) }
                  })}
                />
              </div>

              <div>
                <Label className="text-base font-medium">Password Policy</Label>
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Minimum Length</Label>
                    <Input
                      type="number"
                      value={settings.security.passwordPolicy.minLength}
                      onChange={(e) => setSettings({
                        ...settings,
                        security: {
                          ...settings.security,
                          passwordPolicy: {
                            ...settings.security.passwordPolicy,
                            minLength: parseInt(e.target.value)
                          }
                        }
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Require Uppercase</Label>
                    <Switch
                      checked={settings.security.passwordPolicy.requireUppercase}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        security: {
                          ...settings.security,
                          passwordPolicy: {
                            ...settings.security.passwordPolicy,
                            requireUppercase: checked
                          }
                        }
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Require Numbers</Label>
                    <Switch
                      checked={settings.security.passwordPolicy.requireNumbers}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        security: {
                          ...settings.security,
                          passwordPolicy: {
                            ...settings.security.passwordPolicy,
                            requireNumbers: checked
                          }
                        }
                      })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Settings */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analytics Integration
              </CardTitle>
              <CardDescription>Configure analytics and tracking services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Label className="text-base font-medium">Google Analytics</Label>
                    <Badge className="ml-2" variant={settings.analytics.googleAnalytics.enabled ? "default" : "secondary"}>
                      {settings.analytics.googleAnalytics.enabled ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <Switch
                    checked={settings.analytics.googleAnalytics.enabled}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      analytics: {
                        ...settings.analytics,
                        googleAnalytics: { ...settings.analytics.googleAnalytics, enabled: checked }
                      }
                    })}
                  />
                </div>
                {settings.analytics.googleAnalytics.enabled && (
                  <div className="ml-6">
                    <div className="space-y-2">
                      <Label>Tracking ID</Label>
                      <Input
                        value={settings.analytics.googleAnalytics.trackingId}
                        onChange={(e) => setSettings({
                          ...settings,
                          analytics: {
                            ...settings.analytics,
                            googleAnalytics: { ...settings.analytics.googleAnalytics, trackingId: e.target.value }
                          }
                        })}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}