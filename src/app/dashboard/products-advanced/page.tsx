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
import { Checkbox } from "@/components/ui/checkbox"
import { useSession } from "next-auth/react"
import { 
  Plus, Edit, Trash2, Search, Filter, Upload, Download, Copy, Eye, 
  AlertTriangle, Package, Tag, Image as ImageIcon, Settings, 
  BarChart3, TrendingUp, Star, Heart, ShoppingCart, Truck, Globe
} from "lucide-react"

interface Product {
  id: string
  name: string
  description: string
  shortDescription?: string
  price: number
  comparePrice?: number
  costPrice?: number
  stock: number
  minStock?: number
  maxStock?: number
  sku?: string
  barcode?: string
  weight?: number
  dimensions?: string
  category: {
    id: string
    name: string
  }
  status: string
  visibility: string
  featured: boolean
  tags?: string[]
  metaTitle?: string
  metaDescription?: string
  slug?: string
  images?: string[]
  variants?: ProductVariant[]
  supplier?: {
    id: string
    name: string
  }
  brand?: string
  condition?: string
  warranty?: string
  createdAt: string
  updatedAt: string
}

interface ProductVariant {
  id: string
  name: string
  price?: number
  stock?: number
  sku?: string
  image?: string
  options: Record<string, string>
}

interface Category {
  id: string
  name: string
  description?: string
}

interface Supplier {
  id: string
  name: string
  email?: string
  phone?: string
}

export default function AdvancedProductsPage() {
  const { data: session } = useSession()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [stockFilter, setStockFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")

  // Enhanced form state
  const [formData, setFormData] = useState({
    // Basic Info
    name: "",
    description: "",
    shortDescription: "",
    categoryId: "",
    status: "active",
    visibility: "visible",
    featured: false,
    
    // Pricing
    price: 0,
    comparePrice: 0,
    costPrice: 0,
    
    // Inventory
    stock: 0,
    minStock: 5,
    maxStock: 1000,
    sku: "",
    barcode: "",
    
    // Physical Properties
    weight: 0,
    dimensions: "",
    
    // Business
    supplierId: "",
    brand: "",
    condition: "new",
    warranty: "",
    
    // SEO
    metaTitle: "",
    metaDescription: "",
    slug: "",
    tags: [] as string[],
    
    // Images
    images: [] as string[]
  })

  // Fetch data
  const fetchData = async () => {
    setLoading(true)
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories")
      ])

      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setProducts(productsData.data || [])
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json()
        setCategories(categoriesData.data || [])
      }

      // Mock suppliers for now
      setSuppliers([
        { id: "1", name: "Supplier A", email: "a@supplier.com" },
        { id: "2", name: "Supplier B", email: "b@supplier.com" },
      ])
    } catch (error) {
      console.error("Error fetching data:", error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Advanced filtering
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === "all" || product.category.id === selectedCategory
    const matchesStatus = statusFilter === "all" || product.status === statusFilter
    
    let matchesStock = true
    if (stockFilter === "low") matchesStock = product.stock <= (product.minStock || 5)
    else if (stockFilter === "out") matchesStock = product.stock === 0
    else if (stockFilter === "in") matchesStock = product.stock > 0
    
    return matchesSearch && matchesCategory && matchesStatus && matchesStock
  })

  // Handle form submission with all fields
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products"
      const method = editingProduct ? "PUT" : "POST"

      // Generate slug from name if not provided
      if (!formData.slug) {
        formData.slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchData()
        resetForm()
        setIsAddDialogOpen(false)
        setEditingProduct(null)
      }
    } catch (error) {
      console.error("Error saving product:", error)
    }
  }

  // Reset enhanced form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      shortDescription: "",
      categoryId: "",
      status: "active",
      visibility: "visible",
      featured: false,
      price: 0,
      comparePrice: 0,
      costPrice: 0,
      stock: 0,
      minStock: 5,
      maxStock: 1000,
      sku: "",
      barcode: "",
      weight: 0,
      dimensions: "",
      supplierId: "",
      brand: "",
      condition: "new",
      warranty: "",
      metaTitle: "",
      metaDescription: "",
      slug: "",
      tags: [],
      images: []
    })
  }

  // Handle edit with all fields
  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      shortDescription: product.shortDescription || "",
      categoryId: product.category.id,
      status: product.status,
      visibility: product.visibility || "visible",
      featured: product.featured || false,
      price: product.price,
      comparePrice: product.comparePrice || 0,
      costPrice: product.costPrice || 0,
      stock: product.stock,
      minStock: product.minStock || 5,
      maxStock: product.maxStock || 1000,
      sku: product.sku || "",
      barcode: product.barcode || "",
      weight: product.weight || 0,
      dimensions: product.dimensions || "",
      supplierId: product.supplier?.id || "",
      brand: product.brand || "",
      condition: product.condition || "new",
      warranty: product.warranty || "",
      metaTitle: product.metaTitle || "",
      metaDescription: product.metaDescription || "",
      slug: product.slug || "",
      tags: product.tags || [],
      images: product.images || []
    })
    setIsAddDialogOpen(true)
  }

  // Bulk operations
  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return
    if (confirm(`Delete ${selectedProducts.length} products?`)) {
      try {
        await Promise.all(
          selectedProducts.map(id => 
            fetch(`/api/products/${id}`, { method: "DELETE" })
          )
        )
        await fetchData()
        setSelectedProducts([])
      } catch (error) {
        console.error("Error bulk deleting:", error)
      }
    }
  }

  const handleBulkStatusChange = async (status: string) => {
    if (selectedProducts.length === 0) return
    try {
      await Promise.all(
        selectedProducts.map(id => 
          fetch(`/api/products/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status })
          })
        )
      )
      await fetchData()
      setSelectedProducts([])
    } catch (error) {
      console.error("Error bulk updating:", error)
    }
  }

  // Product selection
  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id))
    }
  }

  if (!session) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>Please sign in to access product management.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Advanced Product Management</h1>
          <p className="text-gray-600">Complete product lifecycle management with advanced features</p>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline">{products.length} Total Products</Badge>
            <Badge variant="outline">{products.filter(p => p.stock <= (p.minStock || 5)).length} Low Stock</Badge>
            <Badge variant="outline">{products.filter(p => p.featured).length} Featured</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                <DialogDescription>
                  {editingProduct ? "Update product details" : "Create a comprehensive product listing"}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit}>
                <Tabs defaultValue="basic" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="pricing">Pricing</TabsTrigger>
                    <TabsTrigger value="inventory">Inventory</TabsTrigger>
                    <TabsTrigger value="seo">SEO & Marketing</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>

                  {/* Basic Information Tab */}
                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Product Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="brand">Brand</Label>
                        <Input
                          id="brand"
                          value={formData.brand}
                          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="shortDescription">Short Description</Label>
                      <Input
                        id="shortDescription"
                        value={formData.shortDescription}
                        onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                        placeholder="Brief product summary for listings"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Full Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="condition">Condition</Label>
                        <Select value={formData.condition} onValueChange={(value) => setFormData({ ...formData, condition: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="refurbished">Refurbished</SelectItem>
                            <SelectItem value="used">Used</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="featured" 
                        checked={formData.featured}
                        onCheckedChange={(checked: boolean) => setFormData({ ...formData, featured: !!checked })}
                      />
                      <Label htmlFor="featured">Featured Product</Label>
                    </div>
                  </TabsContent>

                  {/* Pricing Tab */}
                  <TabsContent value="pricing" className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="price">Selling Price * ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="comparePrice">Compare Price ($)</Label>
                        <Input
                          id="comparePrice"
                          type="number"
                          step="0.01"
                          value={formData.comparePrice}
                          onChange={(e) => setFormData({ ...formData, comparePrice: parseFloat(e.target.value) || 0 })}
                        />
                        <p className="text-xs text-gray-500 mt-1">Original price for discounts</p>
                      </div>
                      <div>
                        <Label htmlFor="costPrice">Cost Price ($)</Label>
                        <Input
                          id="costPrice"
                          type="number"
                          step="0.01"
                          value={formData.costPrice}
                          onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                        />
                        <p className="text-xs text-gray-500 mt-1">For profit calculations</p>
                      </div>
                    </div>

                    {formData.price > 0 && formData.costPrice > 0 && (
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-green-800">Profit Analysis</h4>
                        <p className="text-sm text-green-700">
                          Profit: ${(formData.price - formData.costPrice).toFixed(2)} 
                          ({(((formData.price - formData.costPrice) / formData.price) * 100).toFixed(1)}% margin)
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  {/* Inventory Tab */}
                  <TabsContent value="inventory" className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="stock">Current Stock *</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={formData.stock}
                          onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="minStock">Minimum Stock Alert</Label>
                        <Input
                          id="minStock"
                          type="number"
                          value={formData.minStock}
                          onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxStock">Maximum Stock</Label>
                        <Input
                          id="maxStock"
                          type="number"
                          value={formData.maxStock}
                          onChange={(e) => setFormData({ ...formData, maxStock: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="sku">SKU</Label>
                        <Input
                          id="sku"
                          value={formData.sku}
                          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                          placeholder="Stock Keeping Unit"
                        />
                      </div>
                      <div>
                        <Label htmlFor="barcode">Barcode</Label>
                        <Input
                          id="barcode"
                          value={formData.barcode}
                          onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                          placeholder="UPC/EAN/ISBN"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input
                          id="weight"
                          type="number"
                          step="0.01"
                          value={formData.weight}
                          onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="dimensions">Dimensions (L x W x H cm)</Label>
                        <Input
                          id="dimensions"
                          value={formData.dimensions}
                          onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                          placeholder="e.g., 30 x 20 x 10"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* SEO & Marketing Tab */}
                  <TabsContent value="seo" className="space-y-4">
                    <div>
                      <Label htmlFor="slug">URL Slug</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="auto-generated-from-name"
                      />
                      <p className="text-xs text-gray-500 mt-1">Leave empty to auto-generate</p>
                    </div>

                    <div>
                      <Label htmlFor="metaTitle">Meta Title</Label>
                      <Input
                        id="metaTitle"
                        value={formData.metaTitle}
                        onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                        placeholder="SEO title for search engines"
                        maxLength={60}
                      />
                      <p className="text-xs text-gray-500 mt-1">{formData.metaTitle.length}/60 characters</p>
                    </div>

                    <div>
                      <Label htmlFor="metaDescription">Meta Description</Label>
                      <Textarea
                        id="metaDescription"
                        value={formData.metaDescription}
                        onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                        placeholder="SEO description for search engines"
                        maxLength={160}
                        rows={3}
                      />
                      <p className="text-xs text-gray-500 mt-1">{formData.metaDescription.length}/160 characters</p>
                    </div>
                  </TabsContent>

                  {/* Advanced Tab */}
                  <TabsContent value="advanced" className="space-y-4">
                    <div>
                      <Label htmlFor="warranty">Warranty Information</Label>
                      <Input
                        id="warranty"
                        value={formData.warranty}
                        onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                        placeholder="e.g., 1 year manufacturer warranty"
                      />
                    </div>

                    <div>
                      <Label htmlFor="visibility">Visibility</Label>
                      <Select value={formData.visibility} onValueChange={(value) => setFormData({ ...formData, visibility: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="visible">Visible everywhere</SelectItem>
                          <SelectItem value="hidden">Hidden from catalog</SelectItem>
                          <SelectItem value="search-only">Search results only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingProduct ? "Update Product" : "Create Product"}
                    </Button>
                  </div>
                </Tabs>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Enhanced Filters & Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4 items-center flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products, SKU, tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>

              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Stock" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock</SelectItem>
                  <SelectItem value="in">In Stock</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setViewMode(viewMode === "table" ? "grid" : "table")}
              >
                {viewMode === "table" ? "Grid View" : "Table View"}
              </Button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedProducts.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
              <span className="text-sm text-blue-800">
                {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleBulkStatusChange('active')}>
                  Activate
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkStatusChange('inactive')}>
                  Deactivate
                </Button>
                <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
                  Delete
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Products Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Products ({filteredProducts.length})</span>
            {viewMode === "table" && (
              <Checkbox
                checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                onCheckedChange={handleSelectAll}
              />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-sm text-gray-500 mb-4">
                {products.length === 0 ? "Add your first product to get started" : "Try adjusting your filters"}
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>
          ) : viewMode === "table" ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedProducts.length === filteredProducts.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={() => handleSelectProduct(product.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {product.shortDescription || product.description}
                          </div>
                          {product.featured && (
                            <Badge variant="secondary" className="mt-1">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {product.sku || 'N/A'}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category.name}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">${product.price.toFixed(2)}</div>
                        {product.comparePrice && product.comparePrice > product.price && (
                          <div className="text-xs text-gray-500 line-through">
                            ${product.comparePrice.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          product.stock === 0 ? "destructive" : 
                          product.stock <= (product.minStock || 5) ? "secondary" : 
                          "default"
                        }
                      >
                        {product.stock} units
                        {product.stock <= (product.minStock || 5) && product.stock > 0 && (
                          <AlertTriangle className="w-3 h-3 ml-1" />
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.status === "active" ? "default" : "secondary"}>
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            if (confirm("Delete this product?")) {
                              fetch(`/api/products/${product.id}`, { method: "DELETE" })
                                .then(() => fetchData())
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
          ) : (
            // Grid View
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-gray-100 relative">
                    <div className="absolute top-2 left-2 z-10">
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={() => handleSelectProduct(product.id)}
                      />
                    </div>
                    <div className="absolute top-2 right-2 z-10 flex gap-1">
                      {product.featured && (
                        <Badge variant="secondary" className="text-xs">
                          <Star className="w-3 h-3" />
                        </Badge>
                      )}
                      {product.stock <= (product.minStock || 5) && (
                        <Badge variant="destructive" className="text-xs">
                          Low
                        </Badge>
                      )}
                    </div>
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-16 w-16 text-gray-400" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium truncate">{product.name}</h3>
                    <p className="text-sm text-gray-500 truncate">
                      {product.shortDescription || product.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <span className="font-bold">${product.price.toFixed(2)}</span>
                        {product.comparePrice && product.comparePrice > product.price && (
                          <span className="text-xs text-gray-500 line-through ml-2">
                            ${product.comparePrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {product.stock} in stock
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <Badge variant={product.status === "active" ? "default" : "secondary"}>
                        {product.status}
                      </Badge>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}