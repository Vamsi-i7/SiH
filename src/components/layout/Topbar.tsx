'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import {
  Bell,
  ChevronDown,
  User,
  LogOut,
  Search,
  Award,
  ExternalLink,
  Globe,
  Sparkles,
  Check,
  Wifi,
  ClipboardCheck,
  GraduationCap,
  Target,
  Flag,
  Download,
  FileUp,
} from 'lucide-react';
import { Notification } from '@/components/notifications/types';
import { getInitialNotifications } from '@/components/notifications/notification-data';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';
import { DEMO_PERSONAS } from '@/lib/demoPersonas';
import type { DemoPersona, UserRole } from '@/lib/types';
import { LearnerKarmaLedgerModal } from '@/components/dashboard/learner/modals/LearnerKarmaLedgerModal';
import { CAPIConnectivityModal } from '@/components/dashboard/learner/modals/CAPIConnectivityModal';

function getInitialPersona(): DemoPersona {
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
    // Fallback to default
  }
  return DEMO_PERSONAS[0];
}

function setPersonaCookie(persona: DemoPersona) {
  if (typeof document === 'undefined') return;
  document.cookie = `demo_user=${encodeURIComponent(
    JSON.stringify(persona)
  )}; path=/; max-age=604800`;
  document.cookie = `locale=${
    persona.preferred_language || 'en'
  }; path=/; max-age=31536000`;
}

function clearPersonaCookie() {
  if (typeof document === 'undefined') return;
  document.cookie = 'demo_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

interface TopbarProps {
  initialRole?: UserRole;
}

export function Topbar({ initialRole }: TopbarProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('nav');

  const [menuOpen, setMenuOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [karmaModalOpen, setKarmaModalOpen] = useState(false);
  const [capiModalOpen, setCapiModalOpen] = useState(false);
  const [isOfflineSimulated, setIsOfflineSimulated] = useState(false);

  const [activePersona, setActivePersona] = useState<DemoPersona>(() => {
    const fromCookie = getInitialPersona();
    if (initialRole && fromCookie.role !== initialRole) {
      const matched = DEMO_PERSONAS.find((p) => p.role === initialRole);
      return matched || fromCookie;
    }
    return fromCookie;
  });

  const menuRef = useRef<HTMLDivElement>(null);
  const switcherRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Sync with cookie changes
  useEffect(() => {
    const checkCookie = () => {
      const persona = getInitialPersona();
      setActivePersona((prev) => (prev.email !== persona.email ? persona : prev));
    };

    checkCookie();
    const interval = setInterval(checkCookie, 1000);
    return () => clearInterval(interval);
  }, []);

  const role: UserRole = initialRole || activePersona.role || 'learner';

  // Notifications state initialized with active persona's role
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    getInitialNotifications(role)
  );

  // Close menus on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(target)
      ) {
        setNotificationsOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(target)) {
        setMenuOpen(false);
      }
      if (switcherRef.current && !switcherRef.current.contains(target)) {
        setSwitcherOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setNotificationsOpen(false);
        setMenuOpen(false);
        setSwitcherOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Dropdown toggle handlers with mutual exclusivity
  const toggleNotifications = useCallback(() => {
    setNotificationsOpen((prev) => !prev);
    setMenuOpen(false);
    setSwitcherOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
    setNotificationsOpen(false);
    setSwitcherOpen(false);
  }, []);

  const toggleSwitcher = useCallback(() => {
    setSwitcherOpen((prev) => !prev);
    setNotificationsOpen(false);
    setMenuOpen(false);
  }, []);

  // Notification action handlers
  const handleNotificationClick = useCallback(
    (notification: Notification) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
      );
      if (notification.href) {
        setNotificationsOpen(false);
        router.push(notification.href);
      }
    },
    [router]
  );

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const handleLanguageToggle = useCallback(() => {
    const nextLang = locale === 'en' ? 'hi' : 'en';
    document.cookie = `locale=${nextLang};path=/;max-age=31536000;SameSite=Lax`;
    window.location.reload();
  }, [locale]);

  const handleSelectPersona = (persona: DemoPersona) => {
    setActivePersona(persona);
    setSwitcherOpen(false);
    setNotifications(getInitialNotifications(persona.role));
    setPersonaCookie(persona);
    window.location.reload();
  };

  const roleColors: Record<
    string,
    { bg: string; text: string; badge: string }
  > = {
    learner: {
      bg: 'bg-[#555934]/15',
      text: 'text-[#555934]',
      badge: 'bg-[#555934]/12 text-[#555934]',
    },
    trainer: {
      bg: 'bg-[#8C5B3E]/15',
      text: 'text-[#8C5B3E]',
      badge: 'bg-[#8C5B3E]/15 text-[#8C5B3E]',
    },
    admin: {
      bg: 'bg-[#2d1f17]/15',
      text: 'text-[#2d1f17]',
      badge: 'bg-[#F8C858]/25 text-[#8C5B3E]',
    },
  };

  const currentRoleStyle = roleColors[role] || roleColors.learner;
  const unreadCount = notifications.filter((n) => !n.read).length;
  const badgeLabel = unreadCount > 99 ? '99+' : unreadCount.toString();

  return (
    <header className="flex h-16 items-center justify-between bg-white border-b border-[#BF9B7A]/30 px-4 sm:px-6 z-10 select-none shadow-2xs">
      {/* Search / Context Area */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="relative hidden xl:flex items-center">
          <Search className="absolute left-3 h-3.5 w-3.5 text-[#705849] pointer-events-none" />
          <input
            type="text"
            placeholder="Search competencies, manuals, or metrics... (⌘K)"
            className="h-9 w-64 lg:w-72 rounded-xl bg-[#FAF6F0] border border-[#BF9B7A]/25 pl-9 pr-4 text-xs text-[#2d1f17] placeholder:text-[#705849] focus:bg-white focus:ring-2 focus:ring-[#555934]/20 focus:outline-none transition-all shadow-2xs"
            readOnly
            onClick={() => router.push(role === 'trainer' ? '/documents' : '/skill-gap')}
          />
        </div>

        {/* Role-Specific Context Badge Strip */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {role === 'learner' && (
            <>
              {/* Interactive Karma Points Counter */}
              <button
                type="button"
                onClick={() => setKarmaModalOpen(true)}
                title="View Karma Points Ledger & Badges"
                className="flex items-center gap-1.5 rounded-xl bg-[#F8C858]/20 border border-[#F8C858]/35 px-3 py-1.5 text-xs font-bold text-[#8C5B3E] hover:bg-[#F8C858]/30 transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                <Award className="h-3.5 w-3.5 text-[#8C5B3E]" />
                <span className="font-mono">+550</span>
                <span className="text-[10px] text-[#705849]">Karma Points</span>
              </button>

              {/* Interactive CAPI Offline Engine */}
              <button
                type="button"
                onClick={() => setCapiModalOpen(true)}
                title="Inspect CAPI Storage & Field Connectivity"
                className={`hidden sm:flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95 ${
                  isOfflineSimulated
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-800 hover:bg-amber-500/25'
                    : 'bg-emerald-500/12 border-emerald-500/25 text-emerald-800 hover:bg-emerald-500/20'
                }`}
              >
                <Wifi
                  className={`h-3.5 w-3.5 ${
                    isOfflineSimulated ? 'text-amber-600' : 'text-emerald-600 animate-pulse'
                  }`}
                />
                <span>{isOfflineSimulated ? 'CAPI Offline' : 'CAPI Active'}</span>
                <span className="text-[10px] font-mono text-emerald-700 hidden md:inline">
                  (38 Cached)
                </span>
              </button>
            </>
          )}

          {role === 'trainer' && (
            <>
              {/* NSSTA Faculty Studio Badge */}
              <div className="flex items-center gap-1.5 rounded-xl bg-[#8C5B3E]/12 border border-[#8C5B3E]/25 px-3 py-1.5 text-xs font-bold text-[#8C5B3E]">
                <GraduationCap className="h-3.5 w-3.5 text-[#8C5B3E]" />
                <span>NSSTA Faculty Studio</span>
              </div>

              {/* Pending QA Counter */}
              <Link
                href="/review-queue"
                className="hidden sm:flex items-center gap-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 px-3 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-500/25 transition-colors"
              >
                <ClipboardCheck className="h-3.5 w-3.5 text-amber-700" />
                <span>14 QA Pending</span>
              </Link>

              {/* Ingest Manual Quick CTA */}
              <Link
                href="/documents"
                className="hidden lg:flex items-center gap-1.5 rounded-xl bg-[#555934] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#434728] transition-colors shadow-2xs"
              >
                <FileUp className="h-3.5 w-3.5" />
                <span>Ingest Manual</span>
              </Link>
            </>
          )}

          {role === 'admin' && (
            <>
              {/* National Readiness Index */}
              <div className="flex items-center gap-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-3 py-1.5 text-xs font-bold text-emerald-800">
                <Target className="h-3.5 w-3.5 text-emerald-700" />
                <span>National Readiness: 72.4%</span>
              </div>

              {/* Priority Flagged ROs */}
              <div className="hidden sm:flex items-center gap-1.5 rounded-xl bg-red-500/15 border border-red-500/30 px-3 py-1.5 text-xs font-bold text-red-800">
                <Flag className="h-3.5 w-3.5 text-red-600" />
                <span>2 Flagged ROs</span>
              </div>

              {/* Ministerial Briefing CTA */}
              <button
                type="button"
                onClick={() => alert('Generating Confidential Secretary Briefing Memo (PDF)...')}
                className="hidden lg:flex items-center gap-1.5 rounded-xl bg-[#2d1f17] px-3 py-1.5 text-xs font-bold text-[#FAF6F0] hover:bg-black transition-colors shadow-2xs"
              >
                <Download className="h-3.5 w-3.5 text-[#F8C858]" />
                <span>Ministerial PDF</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Action / Profile Area */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* 1-Click Official Persona Switcher */}
        <div className="relative" ref={switcherRef}>
          <button
            id="persona-switcher-button"
            type="button"
            onClick={toggleSwitcher}
            aria-label="Switch persona or cadre role"
            aria-expanded={switcherOpen}
            className="flex items-center gap-2 rounded-xl bg-[#FAF6F0] border border-[#BF9B7A]/30 px-3 py-1.5 text-xs font-semibold hover:bg-[#FAF6F0]/80 transition shadow-2xs cursor-pointer"
            title="Switch Persona / Cadre Role"
          >
            <span className="flex h-2 w-2 rounded-full bg-[#555934] animate-pulse" />
            <span className="text-[#705849] hidden lg:inline">
              Active Persona:
            </span>
            <span className="font-bold text-[#2d1f17] truncate max-w-28 sm:max-w-40">
              {activePersona.name}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${currentRoleStyle.badge}`}
            >
              {role}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-[#705849]" />
          </button>

          {switcherOpen && (
            <div className="absolute right-0 mt-2 w-84 rounded-2xl bg-white border border-[#BF9B7A]/30 p-2 shadow-card-elevated z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-[#BF9B7A]/20 mb-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2d1f17]">
                    Switch Official Cadre
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-[#BF9B7A]/20 text-[#593E2E] px-2 py-0.5 rounded-full">
                    Role-Gated
                  </span>
                </div>
                <p className="text-[11px] text-[#705849] mt-1">
                  Select a persona to immediately adapt the dashboard, sidebar, topbar, and tools to that role.
                </p>
              </div>

              <div className="space-y-1">
                {DEMO_PERSONAS.map((persona) => {
                  const isSelected = persona.id === activePersona.id;
                  const style = roleColors[persona.role] || roleColors.learner;

                  return (
                    <button
                      key={persona.id}
                      type="button"
                      onClick={() => handleSelectPersona(persona)}
                      className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#555934]/10 text-[#2d1f17] border border-[#555934]/20'
                          : 'hover:bg-[#FAF6F0]'
                      }`}
                    >
                      <div
                        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-bold text-xs ${style.bg} ${style.text}`}
                      >
                        {persona.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-[#2d1f17] truncate">
                            {persona.name}
                          </p>
                          <span
                            className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${style.badge}`}
                          >
                            {persona.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#705849] truncate mt-0.5">
                          {persona.designation} • {persona.cadre}
                        </p>
                        {persona.preferred_language === 'hi' && (
                          <span className="inline-block mt-1 text-[9px] font-bold text-[#8C5B3E] bg-[#8C5B3E]/12 px-2 py-0.5 rounded-full">
                            🇮🇳 हिन्दी First (NSSO FOD)
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <Check className="h-4 w-4 text-[#555934] mt-1 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Language Switch Button */}
        <button
          type="button"
          onClick={handleLanguageToggle}
          aria-label="Switch Language"
          className="flex items-center gap-1.5 rounded-xl bg-[#FAF6F0] border border-[#BF9B7A]/30 px-3 py-1.5 text-xs font-semibold text-[#2d1f17] hover:bg-[#FAF6F0]/80 transition-colors cursor-pointer"
        >
          <Globe className="h-3.5 w-3.5 text-[#555934]" />
          <span>{locale === 'en' ? 'हिन्दी' : 'English'}</span>
        </button>

        {/* Functional Notification Center Bell Button */}
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            onClick={toggleNotifications}
            aria-label={`Notifications${
              unreadCount > 0 ? `, ${unreadCount} unread` : ''
            }`}
            aria-expanded={notificationsOpen}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[#FAF6F0] border border-[#BF9B7A]/30 text-[#705849] hover:bg-[#FAF6F0]/80 hover:text-[#2d1f17] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#555934] cursor-pointer"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span
                className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#8C5B3E] px-1 text-[9px] font-bold text-white shadow-2xs"
                aria-hidden="true"
              >
                {badgeLabel}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <NotificationDropdown
              notifications={notifications}
              unreadCount={unreadCount}
              onNotificationClick={handleNotificationClick}
              onMarkAllAsRead={handleMarkAllAsRead}
              onClose={() => setNotificationsOpen(false)}
            />
          )}
        </div>

        {/* User Account Menu */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={toggleMenu}
            aria-label="User account menu"
            aria-expanded={menuOpen}
            className="flex items-center gap-2 rounded-xl bg-white border border-[#BF9B7A]/30 px-2.5 py-1 text-[#2d1f17] shadow-2xs hover:bg-[#FAF6F0] transition-all active:scale-98 cursor-pointer"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#555934] text-white text-xs font-bold shadow-2xs">
              {activePersona.name.charAt(0)}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-[#2d1f17] leading-tight truncate max-w-28">
                {activePersona.name}
              </span>
              <span className="text-[10px] text-[#705849] -mt-0.5 truncate max-w-28">
                {activePersona.designation}
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-[#705849]" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-[#BF9B7A]/30 p-2 shadow-card-elevated z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-[#BF9B7A]/20">
                <p className="text-xs font-bold text-[#2d1f17]">
                  {activePersona.name}
                </p>
                <p className="text-[11px] text-[#705849] truncate">
                  {activePersona.email}
                </p>
                <p className="text-[10px] text-[#705849] mt-0.5">
                  {activePersona.designation}
                </p>
                <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#555934]/12 px-2.5 py-0.5 text-[9px] font-semibold text-[#555934]">
                  {activePersona.cadre} • L1-L5 Track
                </div>
              </div>

              <div className="py-1">
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-[#2d1f17] hover:bg-[#FAF6F0] transition-colors"
                >
                  <User className="h-3.5 w-3.5 text-[#555934]" />
                  <span>{t('profile')}</span>
                </Link>

                {role === 'learner' && (
                  <Link
                    href="/pathways"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-[#2d1f17] hover:bg-[#FAF6F0] transition-colors"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-[#BF9B7A]" />
                    <span>My Learning Pathways</span>
                  </Link>
                )}

                {role === 'trainer' && (
                  <Link
                    href="/documents"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-[#2d1f17] hover:bg-[#FAF6F0] transition-colors"
                  >
                    <FileUp className="h-3.5 w-3.5 text-[#8C5B3E]" />
                    <span>Faculty Documents Repository</span>
                  </Link>
                )}

                <a
                  href="https://igotkarmayogi.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-[#705849] hover:bg-[#FAF6F0] hover:text-[#2d1f17] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <ExternalLink className="h-3.5 w-3.5 text-[#705849]" />
                    iGOT Portal
                  </span>
                  <span className="text-[9px] font-mono text-[#705849]">Gov.in</span>
                </a>
              </div>

              <div className="pt-1 border-t border-[#BF9B7A]/20">
                <button
                  type="button"
                  onClick={() => {
                    clearPersonaCookie();
                    setMenuOpen(false);
                    router.push('/auth/login');
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-[#8C5B3E] hover:bg-[#8C5B3E]/10 transition-colors cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>{t('logout')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Learner Modals */}
      {role === 'learner' && (
        <>
          <LearnerKarmaLedgerModal
            isOpen={karmaModalOpen}
            onClose={() => setKarmaModalOpen(false)}
            isHindi={locale === 'hi'}
          />
          <CAPIConnectivityModal
            isOpen={capiModalOpen}
            onClose={() => setCapiModalOpen(false)}
            isHindi={locale === 'hi'}
            isOfflineSimulated={isOfflineSimulated}
            onToggleOfflineSimulated={() => setIsOfflineSimulated((prev) => !prev)}
          />
        </>
      )}
    </header>
  );
}

export default Topbar;
