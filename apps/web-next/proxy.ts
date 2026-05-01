import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * NextJS Proxy - Route protection & auth handling.
 *
 * Runs on Edge Runtime (fast, global). Executes BEFORE page render.
 * Use cases:
 *  1. Protect portal routes (admin, tutor, parent, student)
 *  2. Redirect logged-in users away from auth pages
 *  3. Pass auth state to pages via headers (optional)
 */

const PUBLIC_ROUTES = ['/', '/tutor-search', '/tutor-detail'];
const AUTH_ROUTES = ['/login', '/register', '/reset-password'];
const PROTECTED_ROUTES = ['/admin-portal', '/tutor-portal', '/parent-portal', '/student-portal'];

interface JwtPayload {
  role?: string;
  exp?: number;
}

function decodeJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    return payload;
  } catch {
    return null;
  }
}

function isTokenExpired(payload: JwtPayload): boolean {
  if (!payload.exp) return true;
  return Date.now() >= payload.exp * 1000;
}

function getRoleFromPayload(payload: JwtPayload): string | null {
  const role = payload.role;
  if (!role) return null;

  // Backend uses Microsoft schema URIs
  const match = role.match(/\/role\/(\w+)$/i);
  return match ? match[1].toLowerCase() : role.toLowerCase();
}

function getPortalForRole(role: string): string {
  const roleMap: Record<string, string> = {
    admin: '/admin-portal',
    tutor: '/tutor-portal',
    parent: '/parent-portal',
    student: '/student-portal',
  };
  return roleMap[role] || '/login';
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip proxy for static files, API routes, Next internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // .ico, .png, .css, .js, etc.
  ) {
    return NextResponse.next();
  }

  // Read auth from cookie (if you store JWT in cookie) or check localStorage via header
  // Since localStorage is client-only, we check cookie here
  const userDataCookie = request.cookies.get('TUTORA_user_data');
  let accessToken: string | null = null;

  if (userDataCookie) {
    try {
      const userData = JSON.parse(userDataCookie.value);
      accessToken = userData.accessToken;
    } catch {
      // Invalid cookie
    }
  }

  const payload = accessToken ? decodeJwt(accessToken) : null;
  const isAuthenticated = payload && !isTokenExpired(payload);
  const userRole = payload ? getRoleFromPayload(payload) : null;

  // 1. Public routes - allow everyone
  if (PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    return NextResponse.next();
  }

  // 2. Auth routes (/login, /register, /reset-password)
  if (AUTH_ROUTES.some(route => pathname.startsWith(route))) {
    // If already logged in, redirect to their portal
    if (isAuthenticated && userRole) {
      const portalPath = getPortalForRole(userRole);
      return NextResponse.redirect(new URL(portalPath, request.url));
    }
    return NextResponse.next();
  }

  // 3. Protected routes (portals)
  const matchedPortal = PROTECTED_ROUTES.find(route => pathname.startsWith(route));
  if (matchedPortal) {
    // Not authenticated - redirect to login with return URL
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('returnUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Authenticated but wrong role - redirect to correct portal
    if (userRole) {
      const correctPortal = getPortalForRole(userRole);
      if (!pathname.startsWith(correctPortal)) {
        return NextResponse.redirect(new URL(correctPortal, request.url));
      }
    }

    return NextResponse.next();
  }

  // Default: allow
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, robots.txt, sitemap.xml
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
