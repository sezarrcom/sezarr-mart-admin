import { NextResponse } from "next/server"

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export function createResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status }
  )
}

export function createErrorResponse(
  error: string,
  status: number = 400
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status }
  )
}

export function createPaginatedResponse<T>(
  data: T[],
  pagination: {
    page: number
    limit: number
    total: number
  },
  message?: string
): NextResponse<ApiResponse<T[]>> {
  const pages = Math.ceil(pagination.total / pagination.limit)
  
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      pagination: {
        ...pagination,
        pages,
      },
    },
    { status: 200 }
  )
}

export function handleApiError(error: unknown): NextResponse<ApiResponse> {
  console.error("API Error:", error)
  
  if (error instanceof Error) {
    return createErrorResponse(error.message, 500)
  }
  
  return createErrorResponse("An unexpected error occurred", 500)
}