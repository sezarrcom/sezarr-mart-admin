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
import { useSession } from "next-auth/react"
import {
  Palette, Smartphone, Monitor, Tablet, Download, Save, Eye,
  Undo, Redo, Copy, Settings, Upload, Image, Type, Layout,
  Layers, Grid, Move, RotateCcw, Zap, Star, Heart, ShoppingBag,
  Search, User, Menu, Home, CheckCircle, Play, Pause,
  Sun, Moon, Contrast, Brush, Paintbrush, Droplet, Square, Plus
} from "lucide-react"

interface Theme {
  id: string
  name: string
  description: string
  status: 'active' | 'draft' | 'archived'
  platform: 'mobile' | 'web' | 'both'
  category: 'minimal' | 'modern' | 'classic' | 'vibrant' | 'dark' | 'custom'
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textSecondary: string
    error: string
    warning: string
    success: string
  }
  typography: {
    fontFamily: string
    headingFont: string
    fontSize: {
      xs: string
      sm: string
      base: string
      lg: string
      xl: string
      '2xl': string
    }
    fontWeight: {
      normal: number
      medium: number
      semibold: number
      bold: number
    }
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  borderRadius: {
    sm: string
    md: string
    lg: string
    xl: string
  }
  shadows: {
    sm: string
    md: string
    lg: string
    xl: string
  }
  layout: {
    headerHeight: string
    sidebarWidth: string
    containerMaxWidth: string
    gridGap: string
  }
  components: {
    button: {
      borderRadius: string
      padding: string
      fontSize: string
      fontWeight: number
    }
    card: {
      borderRadius: string
      padding: string
      shadow: string
      border: string
    }
    input: {
      borderRadius: string
      padding: string
      fontSize: string
      border: string
    }
  }
  branding: {
    logo?: string
    favicon?: string
    appIcon?: string
    splashScreen?: string
    brandColors: string[]
  }
  customizations: {
    animations: boolean
    darkMode: boolean
    rtlSupport: boolean
    accessibility: boolean
    customCSS?: string
  }
  previewUrls: {
    mobile: string
    tablet: string
    desktop: string
  }
  createdBy: string
  updatedBy: string
  createdDate: string
  updatedDate: string
  publishedDate?: string
}

export default function DesignStudioPage() {
  const { data: session } = useSession()
  const [themes, setThemes] = useState<Theme[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null)
  const [activeDevice, setActiveDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile')
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Color picker states
  const [selectedColorProperty, setSelectedColorProperty] = useState<keyof Theme['colors'] | null>(null)
  const [customColor, setCustomColor] = useState('#000000')

  useEffect(() => {
    fetchThemes()
  }, [])

  const fetchThemes = async () => {
    try {
      // Mock data for development
      const mockThemes: Theme[] = [
        {
          id: "1",
          name: "Sezarr Modern",
          description: "Clean, modern design with vibrant accents and smooth animations. Perfect for contemporary ecommerce experience.",
          status: "active",
          platform: "both",
          category: "modern",
          colors: {
            primary: "#3B82F6",
            secondary: "#8B5CF6", 
            accent: "#F59E0B",
            background: "#FFFFFF",
            surface: "#F8FAFC",
            text: "#1F2937",
            textSecondary: "#6B7280",
            error: "#EF4444",
            warning: "#F59E0B",
            success: "#10B981"
          },
          typography: {
            fontFamily: "Inter",
            headingFont: "Inter",
            fontSize: {
              xs: "12px",
              sm: "14px",
              base: "16px",
              lg: "18px",
              xl: "20px",
              "2xl": "24px"
            },
            fontWeight: {
              normal: 400,
              medium: 500,
              semibold: 600,
              bold: 700
            }
          },
          spacing: {
            xs: "4px",
            sm: "8px",
            md: "16px",
            lg: "24px",
            xl: "32px"
          },
          borderRadius: {
            sm: "4px",
            md: "8px", 
            lg: "12px",
            xl: "16px"
          },
          shadows: {
            sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
            md: "0 4px 6px rgba(0, 0, 0, 0.1)",
            lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
            xl: "0 20px 25px rgba(0, 0, 0, 0.1)"
          },
          layout: {
            headerHeight: "64px",
            sidebarWidth: "256px", 
            containerMaxWidth: "1200px",
            gridGap: "24px"
          },
          components: {
            button: {
              borderRadius: "8px",
              padding: "12px 24px",
              fontSize: "14px",
              fontWeight: 600
            },
            card: {
              borderRadius: "12px",
              padding: "24px",
              shadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              border: "1px solid #E5E7EB"
            },
            input: {
              borderRadius: "8px",
              padding: "12px 16px",
              fontSize: "14px", 
              border: "2px solid #E5E7EB"
            }
          },
          branding: {
            logo: "/logo-modern.svg",
            favicon: "/favicon-modern.ico",
            appIcon: "/app-icon-modern.png",
            splashScreen: "/splash-modern.png",
            brandColors: ["#3B82F6", "#8B5CF6", "#F59E0B"]
          },
          customizations: {
            animations: true,
            darkMode: true,
            rtlSupport: false,
            accessibility: true
          },
          previewUrls: {
            mobile: "/preview/mobile/modern",
            tablet: "/preview/tablet/modern", 
            desktop: "/preview/desktop/modern"
          },
          createdBy: "Design Team",
          updatedBy: "UI Designer",
          createdDate: "2024-12-01T10:00:00Z",
          updatedDate: "2025-01-19T14:30:00Z",
          publishedDate: "2025-01-01T00:00:00Z"
        },
        {
          id: "2", 
          name: "Minimalist Pro",
          description: "Ultra-clean minimalist design focusing on content and usability. Reduced visual clutter with elegant typography.",
          status: "draft",
          platform: "both",
          category: "minimal",
          colors: {
            primary: "#000000",
            secondary: "#666666",
            accent: "#2563EB", 
            background: "#FFFFFF",
            surface: "#FAFAFA",
            text: "#000000",
            textSecondary: "#666666", 
            error: "#DC2626",
            warning: "#D97706",
            success: "#059669"
          },
          typography: {
            fontFamily: "Helvetica Neue",
            headingFont: "Helvetica Neue", 
            fontSize: {
              xs: "11px",
              sm: "13px", 
              base: "15px",
              lg: "17px",
              xl: "19px",
              "2xl": "22px"
            },
            fontWeight: {
              normal: 300,
              medium: 400,
              semibold: 500, 
              bold: 600
            }
          },
          spacing: {
            xs: "2px", 
            sm: "6px",
            md: "12px",
            lg: "20px",
            xl: "28px"
          },
          borderRadius: {
            sm: "2px",
            md: "4px",
            lg: "6px", 
            xl: "8px"
          },
          shadows: {
            sm: "0 1px 1px rgba(0, 0, 0, 0.03)",
            md: "0 2px 4px rgba(0, 0, 0, 0.05)", 
            lg: "0 4px 8px rgba(0, 0, 0, 0.08)",
            xl: "0 8px 16px rgba(0, 0, 0, 0.1)"
          },
          layout: {
            headerHeight: "56px",
            sidebarWidth: "240px",
            containerMaxWidth: "1100px", 
            gridGap: "20px"
          },
          components: {
            button: {
              borderRadius: "4px",
              padding: "10px 20px",
              fontSize: "13px",
              fontWeight: 500
            },
            card: {
              borderRadius: "6px", 
              padding: "20px",
              shadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
              border: "1px solid #F0F0F0"
            },
            input: {
              borderRadius: "4px",
              padding: "10px 14px",
              fontSize: "13px",
              border: "1px solid #E0E0E0" 
            }
          },
          branding: {
            logo: "/logo-minimal.svg", 
            favicon: "/favicon-minimal.ico",
            appIcon: "/app-icon-minimal.png",
            splashScreen: "/splash-minimal.png",
            brandColors: ["#000000", "#666666", "#2563EB"]
          },
          customizations: {
            animations: false,
            darkMode: false,
            rtlSupport: false,
            accessibility: true
          },
          previewUrls: {
            mobile: "/preview/mobile/minimal",
            tablet: "/preview/tablet/minimal",
            desktop: "/preview/desktop/minimal"
          },
          createdBy: "Senior Designer",
          updatedBy: "Senior Designer", 
          createdDate: "2025-01-10T11:00:00Z",
          updatedDate: "2025-01-18T16:45:00Z"
        },
        {
          id: "3",
          name: "Dark Mode Elite", 
          description: "Sophisticated dark theme with purple accents. Optimized for reduced eye strain and premium user experience.",
          status: "active",
          platform: "mobile",
          category: "dark",
          colors: {
            primary: "#8B5CF6",
            secondary: "#A78BFA", 
            accent: "#F59E0B",
            background: "#0F172A",
            surface: "#1E293B", 
            text: "#F8FAFC",
            textSecondary: "#94A3B8",
            error: "#F87171",
            warning: "#FBBF24",
            success: "#34D399"
          },
          typography: {
            fontFamily: "Poppins",
            headingFont: "Poppins",
            fontSize: {
              xs: "12px",
              sm: "14px", 
              base: "16px",
              lg: "18px", 
              xl: "20px",
              "2xl": "24px"
            },
            fontWeight: {
              normal: 400,
              medium: 500,
              semibold: 600,
              bold: 700
            }
          },
          spacing: {
            xs: "4px",
            sm: "8px", 
            md: "16px",
            lg: "24px",
            xl: "32px"
          },
          borderRadius: {
            sm: "6px",
            md: "10px",
            lg: "14px", 
            xl: "18px"
          },
          shadows: {
            sm: "0 2px 4px rgba(0, 0, 0, 0.2)",
            md: "0 6px 12px rgba(0, 0, 0, 0.3)",
            lg: "0 12px 24px rgba(0, 0, 0, 0.4)", 
            xl: "0 24px 48px rgba(0, 0, 0, 0.5)"
          },
          layout: {
            headerHeight: "68px",
            sidebarWidth: "260px",
            containerMaxWidth: "1240px",
            gridGap: "26px"
          },
          components: {
            button: {
              borderRadius: "10px", 
              padding: "14px 26px",
              fontSize: "15px",
              fontWeight: 600
            },
            card: {
              borderRadius: "14px",
              padding: "26px",
              shadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
              border: "1px solid #374151"
            },
            input: {
              borderRadius: "10px", 
              padding: "14px 18px",
              fontSize: "15px",
              border: "2px solid #374151"
            }
          },
          branding: {
            logo: "/logo-dark.svg",
            favicon: "/favicon-dark.ico", 
            appIcon: "/app-icon-dark.png",
            splashScreen: "/splash-dark.png",
            brandColors: ["#8B5CF6", "#A78BFA", "#F59E0B"]
          },
          customizations: {
            animations: true,
            darkMode: true,
            rtlSupport: false,
            accessibility: true,
            customCSS: ".glow { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }"
          },
          previewUrls: {
            mobile: "/preview/mobile/dark",
            tablet: "/preview/tablet/dark", 
            desktop: "/preview/desktop/dark"
          },
          createdBy: "Dark Mode Specialist",
          updatedBy: "UI/UX Designer",
          createdDate: "2025-01-05T09:00:00Z",
          updatedDate: "2025-01-19T11:20:00Z",
          publishedDate: "2025-01-15T00:00:00Z"
        }
      ]

      setThemes(mockThemes)
      setSelectedTheme(mockThemes[0]) // Set first theme as selected
    } catch (error) {
      console.error("Error fetching themes:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateThemeColor = (property: keyof Theme['colors'], value: string) => {
    if (!selectedTheme) return
    
    const updatedTheme = {
      ...selectedTheme,
      colors: {
        ...selectedTheme.colors,
        [property]: value
      },
      updatedDate: new Date().toISOString()
    }
    
    setSelectedTheme(updatedTheme)
    // Update in themes list
    setThemes(themes.map(theme => 
      theme.id === selectedTheme.id ? updatedTheme : theme
    ))
  }

  const getDeviceIcon = (device: string) => {
    const icons = {
      mobile: Smartphone,
      tablet: Tablet, 
      desktop: Monitor
    }
    return icons[device as keyof typeof icons] || Smartphone
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      'active': 'bg-green-100 text-green-800',
      'draft': 'bg-gray-100 text-gray-800', 
      'archived': 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      'minimal': Square,
      'modern': Zap,
      'classic': Star,
      'vibrant': Sun,
      'dark': Moon,
      'custom': Settings
    }
    return icons[category as keyof typeof icons] || Square
  }

  if (!session) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>Please sign in to access design studio.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Design Studio</h1>
            {selectedTheme && (
              <Badge variant="outline" className="text-sm">
                Editing: {selectedTheme.name}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {/* Device Preview Toggle */}
            <div className="flex border rounded-lg p-1">
              {(['mobile', 'tablet', 'desktop'] as const).map((device) => {
                const DeviceIcon = getDeviceIcon(device)
                return (
                  <Button
                    key={device}
                    variant={activeDevice === device ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveDevice(device)}
                    className="px-3"
                  >
                    <DeviceIcon className="h-4 w-4" />
                  </Button>
                )
              })}
            </div>
            
            <Button variant="outline" size="sm">
              <Undo className="mr-2 h-4 w-4" />
              Undo
            </Button>
            
            <Button variant="outline" size="sm">
              <Redo className="mr-2 h-4 w-4" />
              Redo
            </Button>
            
            <Button variant="outline" size="sm" onClick={() => setIsPreviewMode(!isPreviewMode)}>
              <Eye className="mr-2 h-4 w-4" />
              {isPreviewMode ? 'Exit Preview' : 'Preview'}
            </Button>
            
            <Button size="sm">
              <Save className="mr-2 h-4 w-4" />
              Save Theme
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Theme Selection & Properties */}
        {!isPreviewMode && (
          <div className="w-80 border-r bg-white overflow-y-auto">
            <Tabs defaultValue="themes" className="w-full">
              <TabsList className="grid w-full grid-cols-3 m-4">
                <TabsTrigger value="themes">Themes</TabsTrigger>
                <TabsTrigger value="colors">Colors</TabsTrigger>
                <TabsTrigger value="layout">Layout</TabsTrigger>
              </TabsList>
              
              <TabsContent value="themes" className="px-4 pb-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Available Themes</h3>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {themes.map((theme) => {
                    const CategoryIcon = getCategoryIcon(theme.category)
                    return (
                      <Card 
                        key={theme.id} 
                        className={`cursor-pointer transition-all ${
                          selectedTheme?.id === theme.id ? 'ring-2 ring-blue-500' : ''
                        }`}
                        onClick={() => setSelectedTheme(theme)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <CategoryIcon className="h-4 w-4" />
                              <div className="font-medium text-sm">{theme.name}</div>
                            </div>
                            <Badge variant="outline" className={`text-xs ${getStatusBadge(theme.status)}`}>
                              {theme.status}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mb-2">
                            {theme.description}
                          </div>
                          <div className="flex gap-1">
                            {Object.values(theme.colors).slice(0, 4).map((color, index) => (
                              <div
                                key={index}
                                className="w-4 h-4 rounded-full border border-gray-200"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>
              
              <TabsContent value="colors" className="px-4 pb-4">
                {selectedTheme && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Color Palette</h3>
                    
                    <div className="space-y-3">
                      {Object.entries(selectedTheme.colors).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <Label className="text-sm capitalize">
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </Label>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-8 h-8 rounded border border-gray-200 cursor-pointer"
                              style={{ backgroundColor: value }}
                              onClick={() => setSelectedColorProperty(key as keyof Theme['colors'])}
                            />
                            <Input
                              type="text"
                              value={value}
                              onChange={(e) => updateThemeColor(key as keyof Theme['colors'], e.target.value)}
                              className="w-20 text-xs font-mono"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t pt-4">
                      <Label className="text-sm">Quick Colors</Label>
                      <div className="grid grid-cols-8 gap-1 mt-2">
                        {[
                          '#000000', '#FFFFFF', '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
                          '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#84CC16'
                        ].map((color) => (
                          <div
                            key={color}
                            className="w-6 h-6 rounded border border-gray-200 cursor-pointer"
                            style={{ backgroundColor: color }}
                            onClick={() => {
                              if (selectedColorProperty) {
                                updateThemeColor(selectedColorProperty, color)
                              }
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="layout" className="px-4 pb-4">
                {selectedTheme && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Layout Properties</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm">Border Radius</Label>
                        <Select defaultValue={selectedTheme.borderRadius.md}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2px">Sharp (2px)</SelectItem>
                            <SelectItem value="4px">Small (4px)</SelectItem>
                            <SelectItem value="8px">Medium (8px)</SelectItem>
                            <SelectItem value="12px">Large (12px)</SelectItem>
                            <SelectItem value="16px">Extra Large (16px)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-sm">Spacing Scale</Label>
                        <Select defaultValue="16px">
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="12px">Compact (12px)</SelectItem>
                            <SelectItem value="16px">Normal (16px)</SelectItem>
                            <SelectItem value="20px">Comfortable (20px)</SelectItem>
                            <SelectItem value="24px">Spacious (24px)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-sm">Typography</Label>
                        <Select defaultValue={selectedTheme.typography.fontFamily}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Inter">Inter</SelectItem>
                            <SelectItem value="Roboto">Roboto</SelectItem>
                            <SelectItem value="Poppins">Poppins</SelectItem>
                            <SelectItem value="Helvetica Neue">Helvetica Neue</SelectItem>
                            <SelectItem value="System UI">System UI</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Animations</Label>
                          <Switch defaultChecked={selectedTheme.customizations.animations} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Dark Mode</Label>
                          <Switch 
                            defaultChecked={selectedTheme.customizations.darkMode}
                            onCheckedChange={setIsDarkMode}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">RTL Support</Label>
                          <Switch defaultChecked={selectedTheme.customizations.rtlSupport} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Accessibility</Label>
                          <Switch defaultChecked={selectedTheme.customizations.accessibility} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Main Preview Area */}
        <div className="flex-1 bg-gray-50 flex items-center justify-center p-8">
          {selectedTheme ? (
            <div className="relative">
              {/* Device Frame */}
              <div 
                className={`
                  ${activeDevice === 'mobile' ? 'w-[375px] h-[812px]' : ''}
                  ${activeDevice === 'tablet' ? 'w-[768px] h-[1024px]' : ''}
                  ${activeDevice === 'desktop' ? 'w-[1200px] h-[800px]' : ''}
                  bg-white rounded-lg shadow-2xl overflow-hidden border-4
                `}
                style={{ 
                  borderColor: activeDevice === 'mobile' ? '#000' : '#E5E7EB',
                  backgroundColor: selectedTheme.colors.background 
                }}
              >
                {/* Mock App Interface */}
                <div 
                  className="h-full flex flex-col"
                  style={{ 
                    fontFamily: selectedTheme.typography.fontFamily,
                    color: selectedTheme.colors.text
                  }}
                >
                  {/* Header */}
                  <div 
                    className="flex items-center justify-between px-4 py-3 border-b"
                    style={{ 
                      height: selectedTheme.layout.headerHeight,
                      backgroundColor: selectedTheme.colors.surface,
                      borderColor: selectedTheme.colors.text + '20'
                    }}
                  >
                    <Menu className="h-6 w-6" style={{ color: selectedTheme.colors.text }} />
                    <div className="text-lg font-semibold">Sezarr Mart</div>
                    <ShoppingBag className="h-6 w-6" style={{ color: selectedTheme.colors.text }} />
                  </div>
                  
                  {/* Search Bar */}
                  <div className="p-4">
                    <div 
                      className="flex items-center gap-2 px-3 py-2 border"
                      style={{ 
                        borderRadius: selectedTheme.borderRadius.md,
                        backgroundColor: selectedTheme.colors.surface,
                        borderColor: selectedTheme.colors.text + '30'
                      }}
                    >
                      <Search className="h-5 w-5" style={{ color: selectedTheme.colors.textSecondary }} />
                      <span style={{ color: selectedTheme.colors.textSecondary }}>Search products...</span>
                    </div>
                  </div>
                  
                  {/* Categories */}
                  <div className="px-4">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {['Electronics', 'Fashion', 'Home', 'Books'].map((category) => (
                        <div
                          key={category}
                          className="px-3 py-1 text-sm whitespace-nowrap"
                          style={{ 
                            borderRadius: selectedTheme.borderRadius.sm,
                            backgroundColor: selectedTheme.colors.primary,
                            color: selectedTheme.colors.background
                          }}
                        >
                          {category}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Product Cards */}
                  <div className="flex-1 p-4">
                    <div className="grid grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map((item) => (
                        <div
                          key={item}
                          className="aspect-square"
                          style={{ 
                            borderRadius: selectedTheme.borderRadius.lg,
                            backgroundColor: selectedTheme.colors.surface,
                            boxShadow: selectedTheme.shadows.md
                          }}
                        >
                          <div className="p-3 h-full flex flex-col">
                            <div 
                              className="flex-1 mb-2"
                              style={{ 
                                borderRadius: selectedTheme.borderRadius.md,
                                backgroundColor: selectedTheme.colors.background
                              }}
                            />
                            <div className="text-sm font-medium mb-1">Product {item}</div>
                            <div 
                              className="text-sm"
                              style={{ color: selectedTheme.colors.textSecondary }}
                            >
                              ₹999
                            </div>
                            <div
                              className="mt-2 px-2 py-1 text-xs text-center"
                              style={{ 
                                borderRadius: selectedTheme.borderRadius.sm,
                                backgroundColor: selectedTheme.colors.primary,
                                color: selectedTheme.colors.background
                              }}
                            >
                              Add to Cart
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Bottom Navigation */}
                  <div 
                    className="flex items-center justify-around py-3 border-t"
                    style={{ 
                      backgroundColor: selectedTheme.colors.surface,
                      borderColor: selectedTheme.colors.text + '20'
                    }}
                  >
                    <Home className="h-6 w-6" style={{ color: selectedTheme.colors.primary }} />
                    <Search className="h-6 w-6" style={{ color: selectedTheme.colors.textSecondary }} />
                    <Heart className="h-6 w-6" style={{ color: selectedTheme.colors.textSecondary }} />
                    <User className="h-6 w-6" style={{ color: selectedTheme.colors.textSecondary }} />
                  </div>
                </div>
              </div>
              
              {/* Device Label */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                <Badge variant="outline" className="capitalize">
                  {activeDevice} Preview
                </Badge>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <Palette className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Select a Theme</h3>
              <p className="text-muted-foreground">Choose a theme from the sidebar to start customizing</p>
            </div>
          )}
        </div>

        {/* Right Sidebar - Properties & Code */}
        {!isPreviewMode && selectedTheme && (
          <div className="w-80 border-l bg-white overflow-y-auto">
            <Tabs defaultValue="properties" className="w-full">
              <TabsList className="grid w-full grid-cols-2 m-4">
                <TabsTrigger value="properties">Properties</TabsTrigger>
                <TabsTrigger value="code">Export</TabsTrigger>
              </TabsList>
              
              <TabsContent value="properties" className="px-4 pb-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Component Styles</h3>
                    
                    <div className="space-y-3">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Button</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span>Border Radius</span>
                            <span>{selectedTheme.components.button.borderRadius}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span>Padding</span>
                            <span>{selectedTheme.components.button.padding}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span>Font Weight</span>
                            <span>{selectedTheme.components.button.fontWeight}</span>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Card</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span>Border Radius</span>
                            <span>{selectedTheme.components.card.borderRadius}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span>Padding</span>
                            <span>{selectedTheme.components.card.padding}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span>Shadow</span>
                            <span className="truncate">{selectedTheme.components.card.shadow}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="code" className="px-4 pb-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Export Theme</h3>
                    
                    <div className="space-y-3">
                      <Button className="w-full" variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download CSS
                      </Button>
                      
                      <Button className="w-full" variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download JSON
                      </Button>
                      
                      <Button className="w-full" variant="outline">
                        <Copy className="mr-2 h-4 w-4" />
                        Copy CSS Variables
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">CSS Variables</h4>
                    <div className="p-3 bg-gray-50 rounded text-xs font-mono overflow-auto max-h-60">
                      <pre>
{`:root {
  --primary: ${selectedTheme.colors.primary};
  --secondary: ${selectedTheme.colors.secondary};
  --accent: ${selectedTheme.colors.accent};
  --background: ${selectedTheme.colors.background};
  --surface: ${selectedTheme.colors.surface};
  --text: ${selectedTheme.colors.text};
  --text-secondary: ${selectedTheme.colors.textSecondary};
  --border-radius-sm: ${selectedTheme.borderRadius.sm};
  --border-radius-md: ${selectedTheme.borderRadius.md};
  --border-radius-lg: ${selectedTheme.borderRadius.lg};
  --font-family: ${selectedTheme.typography.fontFamily};
  --spacing-md: ${selectedTheme.spacing.md};
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}