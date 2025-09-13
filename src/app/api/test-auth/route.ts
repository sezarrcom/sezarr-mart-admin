import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    // Check if admin user exists
    const admin = await prisma.user.findUnique({
      where: { email: "admin@sezarrmart.com" }
    })

    if (!admin) {
      return NextResponse.json({ 
        error: "Admin user not found",
        suggestion: "Run: npm run db:seed"
      }, { status: 404 })
    }

    // Test password verification
    const isPasswordValid = await bcrypt.compare("admin123", admin.hashedPassword!)
    
    return NextResponse.json({
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        hasPassword: !!admin.hashedPassword,
        passwordValid: isPasswordValid
      }
    })
  } catch (error) {
    console.error("Test API error:", error)
    return NextResponse.json({ 
      error: "Database connection failed",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword!)
    
    return NextResponse.json({
      email: user.email,
      passwordValid: isPasswordValid,
      user: {
        id: user.id,
        name: user.name,
        role: user.role
      }
    })
  } catch (error) {
    return NextResponse.json({ 
      error: "Test failed",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}