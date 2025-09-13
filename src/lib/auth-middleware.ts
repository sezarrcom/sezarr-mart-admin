import { NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return null
  }
  
  return session.user
}

export function createAuthenticatedHandler<T = any>(
  handler: (request: NextRequest, user: any, context?: any) => Promise<Response>,
  options: { requireAdmin?: boolean } = {}
) {
  return async (request: NextRequest, context?: T) => {
    try {
      const user = await getAuthenticatedUser()
      
      if (!user) {
        return Response.json(
          { error: "Authentication required" },
          { status: 401 }
        )
      }

      if (options.requireAdmin && user.role !== 'ADMIN') {
        return Response.json(
          { error: "Admin access required" },
          { status: 403 }
        )
      }

      return await handler(request, user, context)
    } catch (error) {
      console.error("API Handler Error:", error)
      return Response.json(
        { error: "Internal server error" },
        { status: 500 }
      )
    }
  }
}