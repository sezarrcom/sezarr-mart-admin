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
import { Plus, Edit, Trash2, Search, Filter, Upload, Package, TrendingUp, AlertTriangle, Eye, Copy } from "lucide-react"

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: {
    id: string
    name: string
  }
  status: string
  images?: string[]
  createdAt: string
}

interface Category {
  id: string
  name: string
  description?: string
}

export default function ProductsPage() {
  const { data: session } = useSession()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    categoryId: "",
    status: "active"
  })

  // Fetch data
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Mock data for development
      const mockCategories: Category[] = [
        { id: "1", name: "Electronics", description: "Electronic devices and accessories" },
        { id: "2", name: "Clothing", description: "Apparel and fashion items" },
        { id: "3", name: "Home & Garden", description: "Home improvement and garden supplies" },
        { id: "4", name: "Books", description: "Books and educational materials" }
      ]

      const mockProducts: Product[] = [
        {
          id: "1",
          name: "Wireless Bluetooth Headphones",
          description: "Premium wireless headphones with active noise cancellation and 30-hour battery life",
          price: 2499,
          stock: 45,
          category: { id: "1", name: "Electronics" },
          status: "active",
          images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200"],
          createdAt: new Date().toISOString()
        },
        {
          id: "2",
          name: "Cotton Premium T-Shirt",
          description: "100% organic cotton t-shirt available in multiple colors and sizes",
          price: 599,
          stock: 120,
          category: { id: "2", name: "Clothing" },
          status: "active",
          images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200"],
          createdAt: new Date().toISOString()
        },
        {
          id: "3",
          name: "Smart Watch Pro",
          description: "Advanced fitness tracking smartwatch with heart rate monitor and GPS",
          price: 12999,
          stock: 8,
          category: { id: "1", name: "Electronics" },
          status: "active",
          images: ["https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200"],
          createdAt: new Date().toISOString()
        },
        {
          id: "4",
          name: "Leather Wallet",
          description: "Genuine leather wallet with RFID blocking technology",
          price: 1299,
          stock: 75,
          category: { id: "2", name: "Clothing" },
          status: "active",
          images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=200"],
          createdAt: new Date().toISOString()
        },
        {
          id: "5",
          name: "Indoor Plant Pot Set",
          description: "Set of 3 ceramic plant pots perfect for indoor gardening",
          price: 899,
          stock: 2,
          category: { id: "3", name: "Home & Garden" },
          status: "active",
          images: ["https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=200"],
          createdAt: new Date().toISOString()
        },
        {
          id: "6",
          name: "JavaScript Programming Guide",
          description: "Complete guide to modern JavaScript programming with practical examples",
          price: 1999,
          stock: 0,
          category: { id: "4", name: "Books" },
          status: "out_of_stock",
          images: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200"],
          createdAt: new Date().toISOString()
        },
        {
          id: "7",
          name: "Wireless Mouse",
          description: "Ergonomic wireless mouse with precision tracking",
          price: 799,
          stock: 200,
          category: { id: "1", name: "Electronics" },
          status: "active",
          images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200"],
          createdAt: new Date().toISOString()
        }
      ]

      setCategories(mockCategories)
      setProducts(mockProducts)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category.id === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products"
      const method = editingProduct ? "PUT" : "POST"

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

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      stock: 0,
      categoryId: "",
      status: "active"
    })
  }

  // Handle edit
  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.category.id,
      status: product.status
    })
    setIsAddDialogOpen(true)
  }

  // Handle delete
  const handleDelete = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          await fetchData()
        }
      } catch (error) {
        console.error("Error deleting product:", error)
      }
    }
  }

  // Handle view product details
  const handleViewProduct = (product: Product) => {
    alert(`View details for: ${product.name}\nPrice: $${product.price}\nStock: ${product.stock}\nCategory: ${product.category.name}`)
  }

  // Handle duplicate product
  const handleDuplicateProduct = (product: Product) => {
    setFormData({
      name: `${product.name} (Copy)`,
      description: product.description,
      price: product.price,
      stock: 0,
      categoryId: product.category.id,
      status: "active"
    })
    setIsAddDialogOpen(true)
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
          <p className="text-muted-foreground text-lg">Manage your product inventory and details</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="shrink-0">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-xl">{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
              <DialogDescription className="text-base">
                {editingProduct ? "Update product details" : "Create a new product in your inventory"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              {/* Product Images */}
              <div className="space-y-2">
                <Label>Product Images</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => alert("Opening file picker for product images...")}
                    >
                      Upload Images
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    PNG, JPG up to 10MB each (Max 5 images)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
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
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  {editingProduct ? "Update Product" : "Add Product"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Product Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.filter(p => p.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.filter(p => p.stock <= 10).length}
            </div>
            <p className="text-xs text-muted-foreground">
              -19% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <Badge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">
              +201 since last hour
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-56 h-10">
                <Filter className="mr-2 h-4 w-4" />
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
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Products ({filteredProducts.length})</CardTitle>
          <CardDescription>
            {loading ? "Loading products..." : `Showing ${filteredProducts.length} of ${products.length} products`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8">No products found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-md border border-gray-200 bg-gray-50 flex items-center justify-center">
                          {product.images && product.images.length > 0 ? (
                            <img 
                              src={product.images[0]} 
                              alt={product.name}
                              className="h-10 w-10 rounded object-cover"
                            />
                          ) : (
                            <Package className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground max-w-xs truncate">
                            {product.description}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            SKU: {product.id.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category.name}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">₹{product.price.toFixed(2)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${product.stock <= 10 ? 'text-red-600' : product.stock <= 50 ? 'text-yellow-600' : 'text-green-600'}`}>
                          {product.stock}
                        </span>
                        {product.stock <= 10 && (
                          <Badge variant="destructive" className="text-xs">Low</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          product.status === "active" ? "default" : 
                          product.status === "inactive" ? "secondary" : 
                          "destructive"
                        }
                      >
                        {product.status === "out_of_stock" ? "Out of Stock" : product.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewProduct(product)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(product)}
                          title="Edit Product"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDuplicateProduct(product)}
                          title="Duplicate Product"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                          title="Delete Product"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
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