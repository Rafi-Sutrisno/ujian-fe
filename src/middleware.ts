import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const loginPath = '/login'

const protectedRoutes = ['/dashboard', '/admin', '/user']

export function middleware(request: NextRequest) {
  console.log('middleware active')
  const token = request.cookies.get('token')?.value

  const { pathname } = request.nextUrl
  console.log('ini pathname dan token:', pathname, token)

  if (token && pathname === loginPath) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (!token && protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL(loginPath, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/dashboard/:path*', '/admin/:path*', '/user/:path*']
}
