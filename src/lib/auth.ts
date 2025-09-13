import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Mock users for demo purposes (replace with real database in production)
const DEMO_USERS = [
  {
    id: "1",
    email: "admin@sezarr.com",
    password: "admin123",
    name: "Admin User",
    role: "ADMIN"
  },
  {
    id: "2", 
    email: "manager@sezarr.com",
    password: "manager123",
    name: "Manager User",
    role: "MANAGER"
  },
  {
    id: "3",
    email: "demo@sezarr.com", 
    password: "demo123",
    name: "Demo User",
    role: "USER"
  }
];

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing email or password")
          return null
        }

        try {
          // Find user in mock data
          const user = DEMO_USERS.find(u => u.email === credentials.email)

          if (!user) {
            console.log("User not found:", credentials.email)
            return null
          }

          // Simple password check (in production, use bcrypt)
          if (user.password !== credentials.password) {
            console.log("Invalid password for user:", credentials.email)
            return null
          }

          console.log("Authentication successful for:", user.email)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
}