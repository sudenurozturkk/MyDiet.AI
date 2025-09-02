import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from 'next-auth/middleware'

// Basit bellek içi rate limit (IP başına kısa pencere)
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 60
const ipStore = new Map<string, { count: number; resetAt: number }>()

function rateLimit(req: NextRequest): NextResponse | null {
  const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
  const now = Date.now()
  const rec = ipStore.get(ip as string)
  if (!rec || now > rec.resetAt) {
    ipStore.set(ip as string, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return null
  }
  if (rec.count >= RATE_LIMIT_MAX) {
    return new NextResponse(JSON.stringify({ error: 'Too Many Requests' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  rec.count += 1
  ipStore.set(ip as string, rec)
  return null
}

function addSecurityHeaders(res: NextResponse) {
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  res.headers.set('X-XSS-Protection', '1; mode=block')
  // Production'da domainlerinizi belirtin
  const csp = "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; frame-ancestors 'none'"
  res.headers.set('Content-Security-Policy', csp)
}

export default withAuth(
  function middleware(req: NextRequest) {
    // CORS whitelist (preflight)
    const origin = req.headers.get('origin') || ''
    const allowed = (process.env.CORS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean)
    const isAllowed = !origin || allowed.length === 0 || allowed.includes(origin)

    // Rate limit
    const rate = rateLimit(req)
    if (rate) return rate

    const res = NextResponse.next()
    addSecurityHeaders(res)

    // CORS headers (yalnızca izinli origin)
    if (isAllowed && origin) {
      res.headers.set('Access-Control-Allow-Origin', origin)
      res.headers.set('Vary', 'Origin')
      res.headers.set('Access-Control-Allow-Credentials', 'true')
      res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
      res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    }

    if (req.method === 'OPTIONS') {
      return res
    }

    return res
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/notes/:path*',
    '/goals/:path*',
    '/progress/:path*',
    '/recipes/:path*',
    '/meal-planning/:path*',
    '/chat/:path*',
  ],
}


