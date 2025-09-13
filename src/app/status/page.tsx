"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function StatusPage() {
  const [status, setStatus] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)

  const checkStatus = async () => {
    setLoading(true)
    const checks = [
      { name: "Server", url: "/" },
      { name: "Auth Test", url: "/api/test-auth" },
      { name: "Dashboard Test", url: "/api/test/dashboard" },
      { name: "Products Test", url: "/api/test/products" },
      { name: "Categories", url: "/api/categories" },
    ]

    const results: Record<string, any> = {}

    for (const check of checks) {
      try {
        const response = await fetch(check.url)
        const data = await response.json()
        results[check.name] = {
          status: response.status,
          success: response.ok,
          data: data
        }
      } catch (error) {
        results[check.name] = {
          status: 0,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error"
        }
      }
    }

    setStatus(results)
    setLoading(false)
  }

  useEffect(() => {
    checkStatus()
  }, [])

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Sezarr Mart Admin - System Status</CardTitle>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-green-600">
              Server Running: http://localhost:3001
            </Badge>
            <Button onClick={checkStatus} disabled={loading}>
              {loading ? "Checking..." : "Refresh Status"}
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="status" className="space-y-4">
        <TabsList>
          <TabsTrigger value="status">System Status</TabsTrigger>
          <TabsTrigger value="links">Quick Links</TabsTrigger>
          <TabsTrigger value="api">API Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="status">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(status).map(([name, result]) => (
              <Card key={name}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{name}</CardTitle>
                    <Badge variant={result.success ? "default" : "destructive"}>
                      {result.success ? "✅ OK" : "❌ Error"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-1">
                    <div>Status: {result.status}</div>
                    {result.error && (
                      <div className="text-red-600">Error: {result.error}</div>
                    )}
                    {result.data && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-blue-600">View Response</summary>
                        <pre className="mt-2 bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="links">
          <Card>
            <CardHeader>
              <CardTitle>Quick Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">User Pages</h3>
                  <div className="space-y-1 text-sm">
                    <div><a href="/" className="text-blue-600 hover:underline">🏠 Home</a></div>
                    <div><a href="/dashboard" className="text-blue-600 hover:underline">📊 Dashboard</a></div>
                    <div><a href="/auth/signin" className="text-blue-600 hover:underline">🔐 Sign In</a></div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Test Pages</h3>
                  <div className="space-y-1 text-sm">
                    <div><a href="/test" className="text-blue-600 hover:underline">🧪 Simple Test</a></div>
                    <div><a href="/api-test" className="text-blue-600 hover:underline">⚡ API Tester</a></div>
                    <div><a href="/status" className="text-blue-600 hover:underline">📈 This Status Page</a></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Test Endpoints (No Auth)</h3>
                  <div className="space-y-1 text-sm">
                    <div><a href="/api/test-auth" className="text-blue-600 hover:underline">/api/test-auth</a></div>
                    <div><a href="/api/test/dashboard" className="text-blue-600 hover:underline">/api/test/dashboard</a></div>
                    <div><a href="/api/test/products" className="text-blue-600 hover:underline">/api/test/products</a></div>
                    <div><a href="/api/categories" className="text-blue-600 hover:underline">/api/categories</a></div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Protected Endpoints (Auth Required)</h3>
                  <div className="space-y-1 text-sm text-orange-600">
                    <div>/api/products (requires login)</div>
                    <div>/api/orders (requires login)</div>
                    <div>/api/dashboard/stats (requires login)</div>
                    <div>/api/users (admin only)</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}