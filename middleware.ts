import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth')
  
  if (authToken) {
    try {
      // Verify token with API
      
      const response = await fetch(`${request.nextUrl.origin}/api/auth/verify`, {
        headers: {
          Cookie: `auth_token=${authToken.value}`
        }
      })

      if (!response.ok) {
        throw new Error('Token verification failed')
      }
      console.log('Token verified successfully')

      if (isAuthRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    } catch {
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('auth_token')
      return response
    }
  }

  // Protect routes that require authentication
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') ||
                          request.nextUrl.pathname.startsWith('/saved')
  
  if (isProtectedRoute && !authToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*',
    '/saved/:path*',
    '/login',
    '/register'
  ]
}