'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { KarmayogiEmblemIcon } from '@/components/auth/KarmayogiEmblem';
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
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'nav.dashboard' },
  { href: '/skill-gap', icon: Target, label: 'nav.skillGap' },
  { href: '/assignments', icon: ClipboardCheck, label: 'nav.assessment' },
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
      className={`flex flex-col bg-white transition-all duration-200 select-none z-20 shadow-[2px_0_16px_-4px_rgba(89,62,46,0.04)] ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4">
        {!collapsed ? (
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FAF6F0] border border-[#BF9B7A]/35 shadow-xs transition-transform group-hover:scale-105 p-1 shrink-0">
              <KarmayogiEmblemIcon className="h-7 w-7" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base text-[#2d1f17] tracking-tight">
                StatVidya
              </span>
              <span className="text-[10px] font-medium text-[#705849] uppercase tracking-widest -mt-0.5">
                MoSPI • NSSTA
              </span>
            </div>
          </Link>
        ) : (
          <Link href="/dashboard" className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-[#FAF6F0] border border-[#BF9B7A]/35 shadow-xs p-1">
            <KarmayogiEmblemIcon className="h-7 w-7" />
          </Link>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F2E6D8]/50 text-[#705849] hover:bg-[#E8DACB] hover:text-[#2d1f17] transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Main Section */}
        <div>
          {!collapsed ? (
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#705849] mb-2">
              Main Platform
            </p>
          ) : (
            <div className="h-px bg-[#F2E6D8] my-2 mx-1" />
          )}
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? t(item.label) : undefined}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${
                    collapsed ? 'justify-center px-0 h-10 w-10 mx-auto' : ''
                  } ${
                    active
                      ? 'bg-[#555934] text-white shadow-xs font-semibold'
                      : 'text-[#593E2E] hover:bg-[#EAE0D0]/60 hover:text-[#2d1f17]'
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-white' : 'text-[#705849]'}`} />
                  {!collapsed && <span className="truncate">{t(item.label)}</span>}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Content & Curation */}
        <div>
          {!collapsed ? (
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#705849] mb-2">
              Curriculum & AI
            </p>
          ) : (
            <div className="h-px bg-[#F2E6D8] my-2 mx-1" />
          )}
          <div className="space-y-1">
            {trainerItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? t(item.label) : undefined}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${
                    collapsed ? 'justify-center px-0 h-10 w-10 mx-auto' : ''
                  } ${
                    active
                      ? 'bg-[#555934] text-white shadow-xs font-semibold'
                      : 'text-[#593E2E] hover:bg-[#EAE0D0]/60 hover:text-[#2d1f17]'
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-white' : 'text-[#705849]'}`} />
                  {!collapsed && <span className="truncate">{t(item.label)}</span>}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Governance & Admin */}
        <div>
          {!collapsed ? (
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#705849] mb-2">
              Workforce Governance
            </p>
          ) : (
            <div className="h-px bg-[#F2E6D8] my-2 mx-1" />
          )}
          <div className="space-y-1">
            {adminItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? t(item.label) : undefined}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${
                    collapsed ? 'justify-center px-0 h-10 w-10 mx-auto' : ''
                  } ${
                    active
                      ? 'bg-[#555934] text-white shadow-xs font-semibold'
                      : 'text-[#593E2E] hover:bg-[#EAE0D0]/60 hover:text-[#2d1f17]'
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-white' : 'text-[#705849]'}`} />
                  {!collapsed && <span className="truncate">{t(item.label)}</span>}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Cadre Status Footer */}
      {!collapsed && (
        <div className="p-3 bg-[#F2E6D8]/40">
          <div className="rounded-xl bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#705849]">
                Active Cadre
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#555934]/12 px-2 py-0.5 text-[9px] font-bold text-[#555934]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#555934] animate-pulse" />
                FRAC L1-L5
              </span>
            </div>
            <p className="text-xs font-semibold text-[#2d1f17] truncate">
              Subordinate Statistical Service
            </p>
            <p className="text-[10px] text-[#705849] truncate">
              Junior Statistical Officer (JSO)
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
