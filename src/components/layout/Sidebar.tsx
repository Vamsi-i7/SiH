'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { KarmayogiEmblemIcon } from '@/components/auth/KarmayogiEmblem';
import { ChevronLeft, ChevronRight, ShieldCheck, CheckCircle2, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { DEMO_PERSONAS } from '@/lib/demoPersonas';
import type { DemoPersona, UserRole } from '@/lib/types';
import { OfficerDossierModal } from '@/components/dashboard/learner/modals/OfficerDossierModal';
import {
  getNavigationForRole,
  getRoleIdentity,
  getRoleFooterData,
  type RoleNavItem,
} from './roleNavigation';

function getActivePersonaFromCookie(): DemoPersona {
  if (typeof document === 'undefined') return DEMO_PERSONAS[0];
  try {
    const match = document.cookie.match(/(?:^|; )demo_user=([^;]*)/);
    if (match) {
      const decoded = JSON.parse(decodeURIComponent(match[1]));
      const found = DEMO_PERSONAS.find(
        (p) => p.email?.toLowerCase() === decoded.email?.toLowerCase()
      );
      if (found) return found;
      if (decoded.role) {
        return {
          id: decoded.id || 'custom-user',
          name: decoded.name || 'Civil Officer',
          email: decoded.email || 'user@mospi.gov.in',
          role: decoded.role as UserRole,
          designation: decoded.designation || 'Statistical Officer',
          cadre: decoded.cadre || 'MoSPI Cadre',
          organization_id: 'org-mospi',
          preferred_language: (decoded.preferred_language as 'en' | 'hi') || 'en',
          department: decoded.department || 'MoSPI Headquarters',
        };
      }
    }
  } catch {
    // fallback
  }
  return DEMO_PERSONAS[0];
}

interface SidebarProps {
  initialRole?: UserRole;
}

export function Sidebar({ initialRole }: SidebarProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [dossierOpen, setDossierOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);

  const [activePersona, setActivePersona] = useState<DemoPersona>(() => {
    const fromCookie = getActivePersonaFromCookie();
    if (initialRole && fromCookie.role !== initialRole) {
      const matched = DEMO_PERSONAS.find((p) => p.role === initialRole);
      return matched || fromCookie;
    }
    return fromCookie;
  });

  // Keep synced with cookie changes (e.g. from Topbar persona switcher)
  useEffect(() => {
    const checkCookie = () => {
      const persona = getActivePersonaFromCookie();
      setActivePersona((prev) => (prev.email !== persona.email ? persona : prev));
    };

    checkCookie();
    const interval = setInterval(checkCookie, 1000);
    return () => clearInterval(interval);
  }, []);

  const role: UserRole = initialRole || activePersona.role || 'learner';
  const navItems: RoleNavItem[] = getNavigationForRole(role);
  const identity = getRoleIdentity(role);
  const footerData = getRoleFooterData(role);

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    const cleanHref = href.split('#')[0];
    return pathname === cleanHref || pathname.startsWith(cleanHref + '/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <aside
      className={`flex flex-col bg-white border-r border-[#BF9B7A]/30 transition-all duration-200 select-none z-20 shadow-[2px_0_16px_-4px_rgba(89,62,46,0.06)] ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-[#BF9B7A]/20">
        {!collapsed ? (
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FAF6F0] border border-[#BF9B7A]/35 shadow-2xs transition-transform group-hover:scale-105 p-1 shrink-0">
              <KarmayogiEmblemIcon className="h-7 w-7" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base text-[#2d1f17] tracking-tight">
                {identity.title}
              </span>
              <span className="text-[10px] font-bold text-[#8C5B3E] uppercase tracking-wider -mt-0.5">
                {identity.subtitle}
              </span>
            </div>
          </Link>
        ) : (
          <Link
            href="/dashboard"
            className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-[#FAF6F0] border border-[#BF9B7A]/35 shadow-2xs p-1"
          >
            <KarmayogiEmblemIcon className="h-7 w-7" />
          </Link>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FAF6F0] border border-[#BF9B7A]/30 text-[#705849] hover:bg-[#FAF6F0]/80 hover:text-[#2d1f17] transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Role Profile Card at Top of Sidebar */}
      {!collapsed ? (
        <div
          onClick={() => setDossierOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') setDossierOpen(true);
          }}
          title="Click to view Official Civil Service Dossier"
          className="p-3 mx-3 mt-3 rounded-2xl bg-[#FAF6F0]/80 border border-[#BF9B7A]/30 hover:border-[#BF9B7A] hover:bg-[#FAF6F0] flex items-center gap-3 transition-all cursor-pointer shadow-2xs group"
        >
          <div
            className="h-10 w-10 rounded-xl text-white flex items-center justify-center font-bold text-xs font-serif shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
            style={{ backgroundColor: identity.themeColor }}
          >
            {getInitials(activePersona.name)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-bold text-[#2d1f17] truncate leading-tight group-hover:text-[#555934] transition-colors">
                {activePersona.name}
              </p>
            </div>
            <p className="text-[11px] font-medium text-[#705849] truncate mt-0.5">
              {activePersona.designation}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-white text-[#555934] border border-[#BF9B7A]/30">
                <ShieldCheck className="h-2.5 w-2.5" />
                {identity.roleLabel}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-3 flex justify-center">
          <button
            type="button"
            onClick={() => setDossierOpen(true)}
            className="h-9 w-9 rounded-xl text-white flex items-center justify-center font-bold text-xs shadow-2xs cursor-pointer hover:scale-105 transition-transform"
            style={{ backgroundColor: identity.themeColor }}
            title={`${activePersona.name} (${identity.roleLabel}) - Click to view Dossier`}
          >
            {getInitials(activePersona.name)}
          </button>
        </div>
      )}

      {/* Role Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        {!collapsed && (
          <div className="px-3 pb-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#705849]">
            <span>{identity.subtitle}</span>
            <span className="text-[9px] font-mono text-[#8C5B3E] font-semibold">
              {navItems.length} Tools
            </span>
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          const labelText = item.label.startsWith('nav.') ? t(item.label) : item.label;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? labelText : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-150 ${
                collapsed ? 'justify-center px-0 h-10 w-10 mx-auto' : ''
              } ${
                active
                  ? 'bg-[#555934] text-white shadow-2xs font-bold'
                  : 'text-[#593E2E] hover:bg-[#FAF6F0] hover:text-[#2d1f17]'
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 ${
                  active ? 'text-white' : 'text-[#8C5B3E]'
                }`}
              />
              {!collapsed && (
                <span className="truncate flex-1 font-medium">{labelText}</span>
              )}

              {!collapsed && item.badge && (
                <span
                  className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-md ${
                    item.badgeType === 'warning'
                      ? 'bg-amber-500/15 text-amber-700 border border-amber-500/30'
                      : item.badgeType === 'accent'
                        ? 'bg-[#F8C858]/25 text-[#8C5B3E] border border-[#F8C858]/40'
                        : 'bg-white/80 text-[#705849] border border-[#BF9B7A]/30'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Role Status Footer */}
      {!collapsed ? (
        <div className="p-3 m-3 rounded-2xl bg-[#FAF6F0]/80 border border-[#BF9B7A]/25 shadow-2xs">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="text-[11px] font-bold text-[#2d1f17] truncate">
                {footerData.title}
              </span>
            </div>
            {role === 'learner' && (
              <button
                type="button"
                onClick={() => {
                  setSyncing(true);
                  setTimeout(() => {
                    setSyncing(false);
                    setSynced(true);
                    setTimeout(() => setSynced(false), 2500);
                  }, 700);
                }}
                disabled={syncing}
                title="Force Synchronize 38 Schedules"
                className="p-1 rounded-lg bg-white border border-[#BF9B7A]/30 text-[#555934] hover:bg-[#555934] hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <RefreshCw className={`h-3 w-3 ${syncing ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>
          <p className="text-[10px] text-[#705849] mt-0.5 truncate">
            {synced ? '✓ 38 Forms Synced with MoSPI Central Node!' : footerData.subtitle}
          </p>
          <div className="mt-2 pt-2 border-t border-[#BF9B7A]/20 flex items-center justify-between text-[10px] font-medium text-[#705849]">
            <span className="font-mono text-[#8C5B3E]">{footerData.badge}</span>
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
          </div>
        </div>
      ) : (
        <div className="py-3 flex justify-center border-t border-[#BF9B7A]/20">
          <span
            className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"
            title={footerData.title}
          />
        </div>
      )}

      {/* Official Officer Dossier Modal */}
      <OfficerDossierModal
        isOpen={dossierOpen}
        onClose={() => setDossierOpen(false)}
        persona={activePersona}
      />
    </aside>
  );
}

export default Sidebar;
