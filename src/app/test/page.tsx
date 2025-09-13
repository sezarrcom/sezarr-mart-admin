"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function SimpleApiTest() {
  const [status, setStatus] = useState<string>("Not tested")
  const [results, setResults] = useState<any>(null)

  const testSimpleEndpoint = async () => {
    setStatus("Testing...")
    try {
      // Test basic server connection
      const response = await fetch("/api/test-auth")
      const data = await response.json()
      setResults({ status: response.status, data })
      setStatus(response.ok ? "✅ Server Working" : "❌ Server Error")
    } catch (error) {
      setResults({ error: error instanceof Error ? error.message : "Unknown error" })
      setStatus("❌ Connection Failed")
    }
  }

  useEffect(() => {
    testSimpleEndpoint()
  }, [])

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>API Connection Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Server Status:</span>
              <Badge>{status}</Badge>
            </div>
            
            <Button onClick={testSimpleEndpoint} className="w-full">
              Test Connection
            </Button>

            {results && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Response:</h3>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </div>
            )}

            <div className="mt-6 space-y-2">
              <h3 className="font-semibold">Available Test URLs:</h3>
              <div className="text-sm space-y-1">
                <div>• <a href="/api/test-auth" className="text-blue-600 hover:underline">/api/test-auth</a> - Auth test endpoint</div>
                <div>• <a href="/api/test/dashboard" className="text-blue-600 hover:underline">/api/test/dashboard</a> - Dashboard test</div>
                <div>• <a href="/api/test/products" className="text-blue-600 hover:underline">/api/test/products</a> - Products test</div>
                <div>• <a href="/auth/signin" className="text-blue-600 hover:underline">/auth/signin</a> - Sign in page</div>
                <div>• <a href="/dashboard" className="text-blue-600 hover:underline">/dashboard</a> - Main dashboard</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}