'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  LayoutDashboard,
  Target,
  Flag,
  UserCircle,
  FileText,
  Brain,
  ClipboardCheck,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Building2,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'nav.dashboard' },
  { href: '/skill-gap', icon: Target, label: 'nav.skillGap' },
  { href: '/assessment/comp-capi', icon: ClipboardCheck, label: 'nav.assessment' },
  { href: '/pathways', icon: Flag, label: 'nav.pathways' },
  { href: '/profile', icon: UserCircle, label: 'nav.profile' },
];

const trainerItems = [
  { href: '/documents', icon: FileText, label: 'nav.documents' },
  { href: '/mcq-generator', icon: Brain, label: 'nav.mcqGenerator' },
  { href: '/review-queue', icon: ClipboardCheck, label: 'nav.reviewQueue' },
];

const adminItems = [
  { href: '/admin/analytics', icon: BarChart3, label: 'nav.adminAnalytics' },
];

export function Sidebar() {
  const t = useTranslations();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <aside
      className={`flex flex-col border-r border-border bg-card transition-all duration-200 ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      <div className="flex h-14 items-center border-b border-border px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white shadow-sm">
              <Building2 className="h-4 w-4" />
            </div>
            <span className="font-bold text-sm text-foreground">StatVidya</span>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white shadow-sm">
            <Building2 className="h-4 w-4" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        <div className="mb-2">
          <p className={`text-[10px] font-semibold uppercase tracking-wider text-muted-foreground pb-1 ${collapsed ? 'text-center' : ''}`}>
            Main
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  collapsed ? 'justify-center px-0' : ''
                } ${
                  isActive(item.href)
                    ? 'bg-primary text-white'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="truncate">{t(item.label)}</span>}
              </Link>
            );
          })}
        </div>

        <div className="mb-2">
          <p className={`text-[10px] font-semibold uppercase tracking-wider text-muted-foreground pb-1 ${collapsed ? 'text-center' : ''}`}>
            Content
          </p>
          {trainerItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  collapsed ? 'justify-center px-0' : ''
                } ${
                  isActive(item.href)
                    ? 'bg-primary text-white'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="truncate">{t(item.label)}</span>}
              </Link>
            );
          })}
        </div>

        <div className="mb-2">
          <p className={`text-[10px] font-semibold uppercase tracking-wider text-muted-foreground pb-1 ${collapsed ? 'text-center' : ''}`}>
            Admin
          </p>
          {adminItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  collapsed ? 'justify-center px-0' : ''
                } ${
                  isActive(item.href)
                    ? 'bg-primary text-white'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="truncate">{t(item.label)}</span>}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
