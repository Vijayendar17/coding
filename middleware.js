import { NextResponse } from 'next/server'

export async function middleware(request) {
  const url = request.nextUrl.clone()
  
  // Corrected the cookie name to match your login API
  const sessionToken = request.cookies.get('session_id')?.value
  
  if (url.pathname === '/login') {
    if (sessionToken) {
      url.pathname = '/home'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/login',
    '/home/:path*',
    '/api/:path*'
  ]
}
