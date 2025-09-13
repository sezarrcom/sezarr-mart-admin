'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { useSession } from "next-auth/react"
import {
  Smartphone, Upload, Image, Palette, Settings, Eye, Edit, Plus,
  Download, Save, RotateCcw, Trash2, Copy, ExternalLink, Monitor,
  Layout, Type, Circle, Square, Star, Heart, ShoppingBag, Home,
  User, Search, Menu, Bell, MapPin, CreditCard, Gift, Tag, Truck,
  Users, MessageCircle, Phone, Mail, Globe, Facebook, Instagram,
  Twitter, Youtube, Share2, QrCode, Camera, Video, Music, Play
} from "lucide-react"

interface AppTheme {
  id: string
  name: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  isDefault: boolean
  preview: string
}

interface BannerConfig {
  id: string
  title: string
  subtitle?: string
  imageUrl: string
  actionType: 'category' | 'product' | 'url' | 'none'
  actionValue?: string
  position: number
  isActive: boolean
  showOnAndroid: boolean
  showOniOS: boolean
  startDate?: string
  endDate?: string
}

interface HomePageSection {
  id: string
  type: 'banner' | 'categories' | 'featured_products' | 'deals' | 'brands' | 'testimonials' | 'blog'
  title: string
  isVisible: boolean
  position: number
  configuration: Record<string, any>
}

interface SignupOption {
  id: string
  method: 'phone' | 'email' | 'google' | 'facebook' | 'apple'
  isEnabled: boolean
  isRequired: boolean
  position: number
  configuration?: Record<string, any>
}

interface AppConfiguration {
  appName: string
  appVersion: string
  appDescription: string
  appLogo: string
  appIcon: string
  splashScreen: string
  loadingAnimation: string
  theme: string
  language: string
  currency: string
  timezone: string
  features: {
    searchEnabled: boolean
    wishlistEnabled: boolean
    reviewsEnabled: boolean
    chatEnabled: boolean
    notificationsEnabled: boolean
    locationEnabled: boolean
    offlineMode: boolean
    darkMode: boolean
  }
  navigation: {
    bottomNavItems: string[]
    showSearchInHeader: boolean
    showCartIcon: boolean
    showProfileIcon: boolean
  }
  authentication: {
    enableGuestCheckout: boolean
    enableSocialLogin: boolean
    requirePhoneVerification: boolean
    requireEmailVerification: boolean
    enableBiometric: boolean
  }
  onboarding: {
    enabled: boolean
    screens: Array<{
      title: string
      description: string
      image: string
    }>
  }
}

export default function MobileAppSettingsPage() {
  const { data: session } = useSession()
  const [appConfig, setAppConfig] = useState<AppConfiguration | null>(null)
  const [themes, setThemes] = useState<AppTheme[]>([])
  const [banners, setBanners] = useState<BannerConfig[]>([])
  const [homePageSections, setHomePageSections] = useState<HomePageSection[]>([])
  const [signupOptions, setSignupOptions] = useState<SignupOption[]>([])
  const [selectedTheme, setSelectedTheme] = useState<AppTheme | null>(null)
  const [selectedBanner, setSelectedBanner] = useState<BannerConfig | null>(null)
  const [showThemeDialog, setShowThemeDialog] = useState(false)
  const [showBannerDialog, setShowBannerDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const [previewMode, setPreviewMode] = useState<'android' | 'ios'>('android')

  // Mock data
  const mockAppConfig: AppConfiguration = {
    appName: "Sezarr Mart",
    appVersion: "2.1.0",
    appDescription: "Your trusted ecommerce companion",
    appLogo: "/images/logo.png",
    appIcon: "/images/icon.png",
    splashScreen: "/images/splash.png",
    loadingAnimation: "pulse",
    theme: "default",
    language: "en",
    currency: "INR",
    timezone: "Asia/Kolkata",
    features: {
      searchEnabled: true,
      wishlistEnabled: true,
      reviewsEnabled: true,
      chatEnabled: true,
      notificationsEnabled: true,
      locationEnabled: true,
      offlineMode: false,
      darkMode: true
    },
    navigation: {
      bottomNavItems: ["Home", "Categories", "Cart", "Account"],
      showSearchInHeader: true,
      showCartIcon: true,
      showProfileIcon: true
    },
    authentication: {
      enableGuestCheckout: true,
      enableSocialLogin: true,
      requirePhoneVerification: true,
      requireEmailVerification: false,
      enableBiometric: true
    },
    onboarding: {
      enabled: true,
      screens: [
        {
          title: "Welcome to Sezarr Mart",
          description: "Discover amazing products at great prices",
          image: "/images/onboarding1.png"
        },
        {
          title: "Fast & Secure Delivery",
          description: "Get your orders delivered safely to your doorstep",
          image: "/images/onboarding2.png"
        },
        {
          title: "Easy Returns",
          description: "Hassle-free returns within 30 days",
          image: "/images/onboarding3.png"
        }
      ]
    }
  }

  const mockThemes: AppTheme[] = [
    {
      id: "1",
      name: "Default Blue",
      primaryColor: "#3B82F6",
      secondaryColor: "#1E40AF",
      accentColor: "#F59E0B",
      backgroundColor: "#FFFFFF",
      textColor: "#1F2937",
      isDefault: true,
      preview: "/images/theme-blue.png"
    },
    {
      id: "2",
      name: "Modern Purple",
      primaryColor: "#8B5CF6",
      secondaryColor: "#7C3AED",
      accentColor: "#10B981",
      backgroundColor: "#FFFFFF",
      textColor: "#1F2937",
      isDefault: false,
      preview: "/images/theme-purple.png"
    },
    {
      id: "3",
      name: "Dark Mode",
      primaryColor: "#3B82F6",
      secondaryColor: "#1E40AF",
      accentColor: "#F59E0B",
      backgroundColor: "#1F2937",
      textColor: "#FFFFFF",
      isDefault: false,
      preview: "/images/theme-dark.png"
    },
    {
      id: "4",
      name: "Green Fresh",
      primaryColor: "#10B981",
      secondaryColor: "#059669",
      accentColor: "#F59E0B",
      backgroundColor: "#FFFFFF",
      textColor: "#1F2937",
      isDefault: false,
      preview: "/images/theme-green.png"
    }
  ]

  const mockBanners: BannerConfig[] = [
    {
      id: "1",
      title: "New Year Sale",
      subtitle: "Up to 70% OFF",
      imageUrl: "/images/banner1.jpg",
      actionType: "category",
      actionValue: "electronics",
      position: 1,
      isActive: true,
      showOnAndroid: true,
      showOniOS: true,
      startDate: "2024-01-01T00:00:00Z",
      endDate: "2024-01-31T23:59:59Z"
    },
    {
      id: "2",
      title: "Free Delivery",
      subtitle: "On orders above ₹999",
      imageUrl: "/images/banner2.jpg",
      actionType: "none",
      position: 2,
      isActive: true,
      showOnAndroid: true,
      showOniOS: true
    },
    {
      id: "3",
      title: "Latest Fashion",
      subtitle: "Trending styles",
      imageUrl: "/images/banner3.jpg",
      actionType: "category",
      actionValue: "fashion",
      position: 3,
      isActive: false,
      showOnAndroid: true,
      showOniOS: false
    }
  ]

  const mockHomePageSections: HomePageSection[] = [
    {
      id: "1",
      type: "banner",
      title: "Hero Banners",
      isVisible: true,
      position: 1,
      configuration: {
        autoScroll: true,
        scrollInterval: 5000,
        showDots: true
      }
    },
    {
      id: "2",
      type: "categories",
      title: "Shop by Category",
      isVisible: true,
      position: 2,
      configuration: {
        layout: "grid",
        itemsPerRow: 4,
        showTitle: true
      }
    },
    {
      id: "3",
      type: "featured_products",
      title: "Featured Products",
      isVisible: true,
      position: 3,
      configuration: {
        limit: 10,
        layout: "horizontal_scroll"
      }
    },
    {
      id: "4",
      type: "deals",
      title: "Today's Deals",
      isVisible: true,
      position: 4,
      configuration: {
        showTimer: true,
        layout: "grid"
      }
    },
    {
      id: "5",
      type: "brands",
      title: "Popular Brands",
      isVisible: false,
      position: 5,
      configuration: {
        layout: "horizontal_scroll",
        showTitle: false
      }
    }
  ]

  const mockSignupOptions: SignupOption[] = [
    {
      id: "1",
      method: "phone",
      isEnabled: true,
      isRequired: true,
      position: 1
    },
    {
      id: "2",
      method: "email",
      isEnabled: true,
      isRequired: false,
      position: 2
    },
    {
      id: "3",
      method: "google",
      isEnabled: true,
      isRequired: false,
      position: 3,
      configuration: {
        clientId: "google_client_id"
      }
    },
    {
      id: "4",
      method: "facebook",
      isEnabled: false,
      isRequired: false,
      position: 4,
      configuration: {
        appId: "facebook_app_id"
      }
    },
    {
      id: "5",
      method: "apple",
      isEnabled: false,
      isRequired: false,
      position: 5,
      configuration: {
        teamId: "apple_team_id"
      }
    }
  ]

  useEffect(() => {
    setAppConfig(mockAppConfig)
    setThemes(mockThemes)
    setBanners(mockBanners)
    setHomePageSections(mockHomePageSections)
    setSignupOptions(mockSignupOptions)
  }, [])

  const getMethodIcon = (method: string) => {
    const icons = {
      phone: <Phone className="w-4 h-4" />,
      email: <Mail className="w-4 h-4" />,
      google: <Globe className="w-4 h-4 text-red-500" />,
      facebook: <Facebook className="w-4 h-4 text-blue-600" />,
      apple: <Smartphone className="w-4 h-4 text-gray-800" />
    }
    return icons[method as keyof typeof icons] || <User className="w-4 h-4" />
  }

  const getSectionIcon = (type: string) => {
    const icons = {
      banner: <Image className="w-4 h-4" />,
      categories: <Layout className="w-4 h-4" />,
      featured_products: <Star className="w-4 h-4" />,
      deals: <Gift className="w-4 h-4" />,
      brands: <Tag className="w-4 h-4" />,
      testimonials: <MessageCircle className="w-4 h-4" />,
      blog: <Type className="w-4 h-4" />
    }
    return icons[type as keyof typeof icons] || <Layout className="w-4 h-4" />
  }

  const updateAppConfig = (key: string, value: any) => {
    if (appConfig) {
      setAppConfig({ ...appConfig, [key]: value })
    }
  }

  const updateFeature = (feature: string, value: boolean) => {
    if (appConfig) {
      setAppConfig({
        ...appConfig,
        features: { ...appConfig.features, [feature]: value }
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Mobile App Settings</h1>
          <p className="text-gray-600">Customize mobile app interface, themes, and user experience</p>
        </div>
        <div className="flex space-x-3">
          <Select value={previewMode} onValueChange={(value: 'android' | 'ios') => setPreviewMode(value)}>
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="android">Android</SelectItem>
              <SelectItem value="ios">iOS</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Preview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">App Version</p>
                <p className="text-2xl font-bold">{appConfig?.appVersion}</p>
              </div>
              <Smartphone className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Theme</p>
                <p className="text-2xl font-bold">{themes.find(t => t.isDefault)?.name}</p>
              </div>
              <Palette className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Banners</p>
                <p className="text-2xl font-bold">{banners.filter(b => b.isActive).length}</p>
              </div>
              <Image className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Home Sections</p>
                <p className="text-2xl font-bold">{homePageSections.filter(s => s.isVisible).length}</p>
              </div>
              <Layout className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="themes">Themes</TabsTrigger>
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="homepage">Home Page</TabsTrigger>
          <TabsTrigger value="signup">Signup</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          {appConfig && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>App Information</CardTitle>
                  <CardDescription>Basic app details and metadata</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="app-name">App Name</Label>
                    <Input
                      id="app-name"
                      value={appConfig.appName}
                      onChange={(e) => updateAppConfig('appName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="app-version">App Version</Label>
                    <Input
                      id="app-version"
                      value={appConfig.appVersion}
                      onChange={(e) => updateAppConfig('appVersion', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="app-description">App Description</Label>
                    <Textarea
                      id="app-description"
                      value={appConfig.appDescription}
                      onChange={(e) => updateAppConfig('appDescription', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="language">Default Language</Label>
                    <Select value={appConfig.language} onValueChange={(value) => updateAppConfig('language', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                        <SelectItem value="bn">Bengali</SelectItem>
                        <SelectItem value="te">Telugu</SelectItem>
                        <SelectItem value="mr">Marathi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>App Assets</CardTitle>
                  <CardDescription>Upload app icons, logos, and splash screens</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>App Logo</Label>
                    <div className="flex items-center space-x-3 mt-2">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Smartphone className="w-8 h-8 text-gray-400" />
                      </div>
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Logo
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>App Icon</Label>
                    <div className="flex items-center space-x-3 mt-2">
                      <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center">
                        <Circle className="w-8 h-8 text-gray-400" />
                      </div>
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Icon
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>Splash Screen</Label>
                    <div className="flex items-center space-x-3 mt-2">
                      <div className="w-16 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Monitor className="w-8 h-8 text-gray-400" />
                      </div>
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Splash
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="themes" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>App Themes</CardTitle>
                  <CardDescription>Customize the visual appearance of your mobile app</CardDescription>
                </div>
                <Button onClick={() => setShowThemeDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Theme
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {themes.map((theme) => (
                  <div key={theme.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">{theme.name}</h3>
                      {theme.isDefault && (
                        <Badge variant="outline">Current</Badge>
                      )}
                    </div>
                    
                    <div className="flex space-x-2 mb-3">
                      <div 
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: theme.primaryColor }}
                        title="Primary Color"
                      ></div>
                      <div 
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: theme.secondaryColor }}
                        title="Secondary Color"
                      ></div>
                      <div 
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: theme.accentColor }}
                        title="Accent Color"
                      ></div>
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant={theme.isDefault ? "default" : "outline"}
                        className="flex-1"
                      >
                        {theme.isDefault ? "Current" : "Apply"}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setSelectedTheme(theme)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banners" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Home Page Banners</CardTitle>
                  <CardDescription>Manage promotional banners for the app home screen</CardDescription>
                </div>
                <Button onClick={() => setShowBannerDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Banner
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {banners.map((banner) => (
                  <div key={banner.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-10 bg-gray-200 rounded flex items-center justify-center">
                          <Image className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="font-medium">{banner.title}</h3>
                          <p className="text-sm text-gray-500">{banner.subtitle}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={banner.isActive ? "default" : "secondary"}>
                              {banner.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <Badge variant="outline">Position {banner.position}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            {banner.showOnAndroid && <span>Android</span>}
                            {banner.showOnAndroid && banner.showOniOS && <span>•</span>}
                            {banner.showOniOS && <span>iOS</span>}
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => setSelectedBanner(banner)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="homepage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Home Page Layout</CardTitle>
              <CardDescription>Customize the layout and sections of your app's home page</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {homePageSections.map((section) => (
                  <div key={section.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                            {getSectionIcon(section.type)}
                          </div>
                          <span className="font-medium">{section.title}</span>
                        </div>
                        <Badge variant="outline">Position {section.position}</Badge>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Switch
                          checked={section.isVisible}
                          onCheckedChange={(checked) => {
                            const updatedSections = homePageSections.map(s =>
                              s.id === section.id ? { ...s, isVisible: checked } : s
                            )
                            setHomePageSections(updatedSections)
                          }}
                        />
                        <Button size="sm" variant="ghost">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {section.type === 'categories' && section.isVisible && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div>
                            <Label>Layout</Label>
                            <Select value={section.configuration.layout}>
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="grid">Grid</SelectItem>
                                <SelectItem value="list">List</SelectItem>
                                <SelectItem value="horizontal_scroll">Horizontal Scroll</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Items per Row</Label>
                            <Select value={section.configuration.itemsPerRow.toString()}>
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="3">3</SelectItem>
                                <SelectItem value="4">4</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id={`show-title-${section.id}`}
                              checked={section.configuration.showTitle}
                            />
                            <Label htmlFor={`show-title-${section.id}`}>Show Title</Label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Signup Options</CardTitle>
              <CardDescription>Configure available signup methods and their order</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {signupOptions.map((option) => (
                  <div key={option.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getMethodIcon(option.method)}
                        <div>
                          <span className="font-medium capitalize">{option.method} Signup</span>
                          {option.isRequired && (
                            <Badge variant="outline" className="ml-2">Required</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor={`required-${option.id}`}>Required</Label>
                          <Checkbox
                            id={`required-${option.id}`}
                            checked={option.isRequired}
                            disabled={option.method === 'phone'} // Phone is always required
                          />
                        </div>
                        <Switch
                          checked={option.isEnabled}
                          onCheckedChange={(checked) => {
                            const updatedOptions = signupOptions.map(o =>
                              o.id === option.id ? { ...o, isEnabled: checked } : o
                            )
                            setSignupOptions(updatedOptions)
                          }}
                          disabled={option.method === 'phone'} // Phone is always enabled
                        />
                        <Button size="sm" variant="ghost">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          {appConfig && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Core Features</CardTitle>
                  <CardDescription>Enable or disable core app functionality</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Search Functionality</Label>
                      <p className="text-sm text-gray-500">Allow users to search for products</p>
                    </div>
                    <Switch
                      checked={appConfig.features.searchEnabled}
                      onCheckedChange={(checked) => updateFeature('searchEnabled', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Wishlist</Label>
                      <p className="text-sm text-gray-500">Let users save favorite products</p>
                    </div>
                    <Switch
                      checked={appConfig.features.wishlistEnabled}
                      onCheckedChange={(checked) => updateFeature('wishlistEnabled', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Product Reviews</Label>
                      <p className="text-sm text-gray-500">Allow customers to review products</p>
                    </div>
                    <Switch
                      checked={appConfig.features.reviewsEnabled}
                      onCheckedChange={(checked) => updateFeature('reviewsEnabled', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Live Chat</Label>
                      <p className="text-sm text-gray-500">Customer support chat feature</p>
                    </div>
                    <Switch
                      checked={appConfig.features.chatEnabled}
                      onCheckedChange={(checked) => updateFeature('chatEnabled', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Advanced Features</CardTitle>
                  <CardDescription>Configure advanced app capabilities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-gray-500">Send notifications to users</p>
                    </div>
                    <Switch
                      checked={appConfig.features.notificationsEnabled}
                      onCheckedChange={(checked) => updateFeature('notificationsEnabled', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Location Services</Label>
                      <p className="text-sm text-gray-500">Access user location for delivery</p>
                    </div>
                    <Switch
                      checked={appConfig.features.locationEnabled}
                      onCheckedChange={(checked) => updateFeature('locationEnabled', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Offline Mode</Label>
                      <p className="text-sm text-gray-500">Allow app usage without internet</p>
                    </div>
                    <Switch
                      checked={appConfig.features.offlineMode}
                      onCheckedChange={(checked) => updateFeature('offlineMode', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Dark Mode</Label>
                      <p className="text-sm text-gray-500">Support dark theme</p>
                    </div>
                    <Switch
                      checked={appConfig.features.darkMode}
                      onCheckedChange={(checked) => updateFeature('darkMode', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}