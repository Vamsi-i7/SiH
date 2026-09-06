'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Home, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { UserRole } from '@/lib/types';
import { resolveUserRole } from '@/components/dashboard/RoleDashboardRouter';

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
  const [role, setRole] = useState<UserRole>('learner');

  useEffect(() => {
    const updateRole = () => {
      setRole(resolveUserRole());
    };
    updateRole();
    const interval = setInterval(updateRole, 1000);
    return () => clearInterval(interval);
  }, []);

  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0 || segments[0] === 'auth') {
    return null;
  }

  const rootLabel =
    role === 'trainer'
      ? 'NSSTA Faculty Studio'
      : role === 'admin'
        ? 'Executive Command Desk'
        : 'Learner Workspace';

  const crumbs = segments.map((seg, i) => {
    const routeKey = routeLabels[`/${seg}`];
    let label = seg;
    try {
      label = routeKey ? t(routeKey) : seg;
    } catch {
      label = seg;
    }
    const href = i === 0 ? '/dashboard' : `/${segments.slice(0, i + 1).join('/')}`;
    return { label, href };
  });

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs text-muted-foreground select-none">
      <ol className="flex items-center gap-1.5 flex-wrap">
        <li>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 font-semibold text-[#555934] hover:text-[#434728] transition-colors"
          >
            <Home className="h-3.5 w-3.5 text-[#8C5B3E]" />
            <span>{rootLabel}</span>
          </Link>
        </li>
        {crumbs.map((crumb, idx) => (
          <li key={crumb.href + idx} className="flex items-center gap-1.5">
            <ChevronRight className="h-3 w-3 text-[#BF9B7A]" aria-hidden="true" />
            {idx === crumbs.length - 1 ? (
              <span className="font-bold text-[#2d1f17] capitalize">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="hover:text-[#555934] transition-colors capitalize"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
