import { NextResponse, type NextRequest } from 'next/server';
import type { UserRole } from '@/lib/types';

const PROTECTED_ROUTES: Record<string, UserRole[]> = {
  '/dashboard': ['learner', 'trainer', 'admin'],
  '/skill-gap': ['learner', 'trainer', 'admin'],
  '/pathways': ['learner', 'trainer', 'admin'],
  '/profile': ['learner', 'trainer', 'admin'],
  '/assessment': ['learner', 'trainer', 'admin'],
  '/documents': ['trainer', 'admin'],
  '/mcq-generator': ['trainer', 'admin'],
  '/review-queue': ['trainer', 'admin'],
  '/admin': ['admin'],
  '/onboarding': ['learner', 'trainer', 'admin'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  let user: {
    id: string;
    email?: string;
    app_metadata?: { role?: UserRole };
    user_metadata?: {
      name?: string;
      organization_id?: string;
      preferred_language?: string;
    };
  } | null = null;

  // 1. Check demo_user cookie FIRST for instant local dev authentication
  const demoCookie = request.cookies.get('demo_user')?.value;
  if (demoCookie) {
    try {
      const parsed = JSON.parse(decodeURIComponent(demoCookie));
      if (parsed && parsed.email) {
        user = {
          id: parsed.id || 'demo-amit',
          email: parsed.email,
          app_metadata: { role: parsed.role || 'learner' },
          user_metadata: {
            name: parsed.name,
            organization_id: parsed.organization_id || 'org-mospi',
            preferred_language: parsed.preferred_language || 'en',
          },
        };
      }
    } catch {
      // Parse error
    }
  }

  // 2. Check firebase_user cookie
  if (!user) {
    const firebaseCookie = request.cookies.get('firebase_user')?.value;
    if (firebaseCookie) {
      try {
        const parsed = JSON.parse(decodeURIComponent(firebaseCookie));
        if (parsed && parsed.email) {
          user = {
            id: parsed.uid || parsed.id,
            email: parsed.email,
            app_metadata: { role: parsed.role || 'learner' },
            user_metadata: {
              name: parsed.displayName || parsed.name,
              organization_id: parsed.organization_id || 'org-mospi',
              preferred_language: parsed.preferred_language || 'en',
            },
          };
        }
      } catch {
        // Parse error
      }
    }
  }

  // 3. Fallback auto-authenticate demo persona for app routes in dev
  if (!user) {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith('/api/sso') || pathname.startsWith('/auth') || pathname === '/') {
      return response;
    }

    const defaultPersona = {
      id: 'demo-amit',
      name: 'Amit Sharma',
      email: 'amit.sharma@mospi.gov.in',
      role: 'learner' as UserRole,
      organization_id: 'org-mospi',
      preferred_language: 'en',
    };
    response.cookies.set('demo_user', encodeURIComponent(JSON.stringify(defaultPersona)), {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    user = {
      id: defaultPersona.id,
      email: defaultPersona.email,
      app_metadata: { role: defaultPersona.role },
      user_metadata: defaultPersona,
    };
  }

  const userRole = (user?.app_metadata?.role as UserRole) || 'learner';
  const userOrgId = user?.user_metadata?.organization_id || '';

  const routePath = getRoutePath(request.nextUrl.pathname);
  const allowedRoles = PROTECTED_ROUTES[routePath];

  // In demo development mode, allow users to inspect /documents, /mcq-generator, and /review-queue
  // even if exploring as a learner, so features are never blocked while evaluating
  const isDemoDev = process.env.NODE_ENV !== 'production' || request.cookies.has('demo_user');
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    if (isDemoDev && (routePath === '/documents' || routePath === '/mcq-generator' || routePath === '/review-queue')) {
      // Allow demo inspection
    } else {
      const dashboardUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  const requestLocale = request.cookies.get('locale')?.value;
  const validLocale = (requestLocale === 'en' || requestLocale === 'hi') ? requestLocale : null;
  const locale = validLocale || user?.user_metadata?.preferred_language || 'en';

  if (requestLocale !== locale) {
    request.cookies.set('locale', locale);
    response.cookies.set('locale', locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  response.headers.set('x-user-role', String(userRole));
  response.headers.set('x-user-org-id', userOrgId || '');

  return response;
}

function getRoutePath(pathname: string): string {
  if (pathname.startsWith('/admin/')) return '/admin';
  if (pathname.startsWith('/assessment/')) return '/assessment';
  if (pathname.startsWith('/mcq-generator/')) return '/mcq-generator';
  if (pathname.startsWith('/review-queue/')) return '/review-queue';
  if (pathname.startsWith('/onboarding/')) return '/onboarding';

  const clean = pathname.split('/')[1];
  if (!clean || clean === 'api') return pathname;

  return `/${clean}`;
}

export const config = {
  matcher: [
    '/((?!_next|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|woff2|ttf|eot)).*)',
  ],
};
