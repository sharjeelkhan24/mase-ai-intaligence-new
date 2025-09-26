import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define role-to-dashboard mapping
const ROLE_DASHBOARD_MAP: Record<string, string[]> = {
  'agency': ['/agency-dashboard'],
  'clinical-director': ['/clinical-director-dashboard'],
  'nurse-manager': ['/nurse-manager-dashboard'],
  'staff-nurse': ['/staff-nurse-dashboard'],
  'hr-director': ['/hr-director-dashboard'],
  'hr-specialist': ['/hr-specialist-dashboard'],
  'marketing-manager': ['/marketing-manager-dashboard'],
  'marketing-specialist': ['/marketing-specialist-dashboard'],
  'qa-director': ['/qa-director-dashboard'],
  'qa-nurse': ['/qa-nurse-dashboard'],
  'survey-user': ['/survey-user-dashboard']
}

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If user is not signed in and the current path is protected, redirect to sign in
  if (!session && req.nextUrl.pathname.startsWith('/protected')) {
    return NextResponse.redirect(new URL('/signin', req.url))
  }

  // Check for role-based access control on dashboard routes
  const pathname = req.nextUrl.pathname
  
  // Check if this is a dashboard route that needs role validation
  const isDashboardRoute = Object.values(ROLE_DASHBOARD_MAP).some(dashboards => 
    dashboards.some(dashboard => pathname.startsWith(dashboard))
  )

  if (isDashboardRoute) {
    // Get role from localStorage (we'll need to pass this through headers or cookies)
    // For now, we'll handle this in the client-side components
    // This middleware will be enhanced to work with server-side role checking
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
