"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignInPage() {
  const [email, setEmail] = useState("admin@sezarr.com")
  const [password, setPassword] = useState("admin123")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [testResult, setTestResult] = useState("")
  const router = useRouter()

  const testAuth = async () => {
    try {
      const response = await fetch('/api/test-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await response.json()
      setTestResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setTestResult("Test failed: " + error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      console.log("Attempting signin with:", { email, password: "***" })
      
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      console.log("Signin result:", result)

      if (result?.error) {
        console.error("Signin error:", result.error)
        setError(`Authentication failed: ${result.error}`)
      } else if (result?.ok) {
        console.log("Signin successful, redirecting...")
        router.push("/dashboard")
      } else {
        setError("Authentication failed - unknown error")
      }
    } catch (error) {
      console.error("Signin exception:", error)
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Sezarr Mart Admin</CardTitle>
          <CardDescription>Sign in to access your dashboard</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@sezarrmart.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            {testResult && (
              <div className="text-xs text-gray-600 bg-gray-100 p-2 rounded">
                <pre>{testResult}</pre>
              </div>
            )}
          </CardContent>
          <CardFooter className="space-y-2">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={testAuth}
            >
              Test Auth API
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}