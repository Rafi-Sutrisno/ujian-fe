import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const loginPath = '/login'

// Define protected routes (excluding '/login')
const protectedRoutes = ['/', '/account_settings', '/admin', '/user']

export function middleware(request: NextRequest) {
  // console.log('middleware active')
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl
  // console.log('ini pathname dan token:', pathname, token)

  // If already logged in and trying to access login page, redirect to home
  if (token && pathname === loginPath) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If not logged in and accessing a protected route (excluding /login)
  if (!token && pathname !== loginPath && protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL(loginPath, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/', '/account_settings', '/admin/:path*', '/user/:path*']
}
