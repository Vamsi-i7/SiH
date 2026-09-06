'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Home } from 'lucide-react';

const routeLabels: Record<string, string> = {
  '/dashboard': 'dashboard',
  '/skill-gap': 'skillGap',
  '/pathways': 'pathways',
  '/profile': 'profile',
  '/documents': 'documents',
  '/assessment': 'assessment',
  '/assignments': 'assignments',
  '/instructions': 'instructions',
  '/test': 'test',
  '/mcq-generator': 'mcqGenerator',
  '/review-queue': 'reviewQueue',
  '/admin': 'admin',
  '/onboarding': 'onboarding',
};

export function Breadcrumb() {
  const pathname = usePathname();
  const t = useTranslations('breadcrumb');

  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0 || segments[0] === 'auth') {
    return null;
  }

  const crumbs = segments.map((seg, i) => {
    const routeKey = routeLabels[`/${seg}`];
    const label = routeKey ? t(routeKey) : seg;
    const href = i === 0 ? '/' : `/${segments.slice(0, i + 1).join('/')}`;
    return { label, href };
  });

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-sm text-slate-500">
      <ol className="flex items-center gap-1">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-slate-700 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">{crumbs[0]?.label}</span>
          </Link>
        </li>
        {crumbs.slice(1).map((crumb) => (
          <li key={crumb.href} className="flex items-center gap-1">
            <span className="text-slate-300" aria-hidden="true">/</span>
            <span className="font-medium text-slate-700">
              {crumb.label}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
