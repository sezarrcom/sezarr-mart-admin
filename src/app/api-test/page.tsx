"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ApiTestPage() {
  const [results, setResults] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  const testEndpoint = async (name: string, url: string) => {
    setLoading(prev => ({ ...prev, [name]: true }))
    try {
      const response = await fetch(url)
      const data = await response.json()
      setResults(prev => ({ 
        ...prev, 
        [name]: { 
          status: response.status, 
          success: response.ok, 
          data 
        } 
      }))
    } catch (error) {
      setResults(prev => ({ 
        ...prev, 
        [name]: { 
          status: 0, 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        } 
      }))
    }
    setLoading(prev => ({ ...prev, [name]: false }))
  }

  const endpoints = [
    { name: "Dashboard Stats", url: "/api/dashboard/stats", protected: true },
    { name: "Products List", url: "/api/products", protected: true },
    { name: "Categories List", url: "/api/categories", protected: false },
    { name: "Orders List", url: "/api/orders", protected: true },
    { name: "Test Dashboard", url: "/api/test/dashboard", protected: false },
    { name: "Test Products", url: "/api/test/products", protected: false },
  ]

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">API Endpoint Tester</h1>
        <p className="text-gray-600">Test all API endpoints to verify functionality</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {endpoints.map((endpoint) => (
          <Card key={endpoint.name}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {endpoint.name}
                {endpoint.protected && <Badge variant="destructive">Protected</Badge>}
                {!endpoint.protected && <Badge variant="secondary">Public</Badge>}
              </CardTitle>
              <CardDescription>{endpoint.url}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => testEndpoint(endpoint.name, endpoint.url)}
                disabled={loading[endpoint.name]}
                className="w-full mb-3"
              >
                {loading[endpoint.name] ? "Testing..." : "Test Endpoint"}
              </Button>
              
              {results[endpoint.name] && (
                <div className="text-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge 
                      variant={results[endpoint.name].success ? "default" : "destructive"}
                    >
                      Status: {results[endpoint.name].status}
                    </Badge>
                  </div>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">
                    {JSON.stringify(results[endpoint.name].data || results[endpoint.name].error, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Button
          onClick={() => {
            endpoints.forEach(endpoint => {
              setTimeout(() => testEndpoint(endpoint.name, endpoint.url), 100)
            })
          }}
          size="lg"
        >
          Test All Endpoints
        </Button>
      </div>
    </div>
  )
}