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
} from 'lucide-react';
import { Notification } from '@/components/notifications/types';
import { getInitialNotifications } from '@/components/notifications/notification-data';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';
import { DEMO_PERSONAS } from '@/lib/demoPersonas';
import type { DemoPersona } from '@/lib/types';

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

export function Topbar() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('nav');

  const [menuOpen, setMenuOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [activePersona, setActivePersona] = useState<DemoPersona>(getInitialPersona);

  const menuRef = useRef<HTMLDivElement>(null);
  const switcherRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Notifications state initialized with active persona's role
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    getInitialNotifications(getInitialPersona().role)
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
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        router.push('/pathways');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [router]);

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
      bg: 'bg-[#BF9B7A]/20',
      text: 'text-[#593E2E]',
      badge: 'bg-[#BF9B7A]/20 text-[#593E2E]',
    },
    admin: {
      bg: 'bg-[#8C5B3E]/15',
      text: 'text-[#8C5B3E]',
      badge: 'bg-[#8C5B3E]/15 text-[#8C5B3E]',
    },
  };

  const currentRoleStyle =
    roleColors[activePersona.role] || roleColors.learner;
  const unreadCount = notifications.filter((n) => !n.read).length;
  const badgeLabel = unreadCount > 99 ? '99+' : unreadCount.toString();

  return (
    <header className="flex h-16 items-center justify-between bg-white px-4 sm:px-6 z-10 select-none shadow-[0_2px_12px_-4px_rgba(89,62,46,0.04)]">
      {/* Search / Context Area */}
      <div className="flex items-center gap-4">
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-[#705849] pointer-events-none" />
          <input
            type="text"
            placeholder="Search competencies, courses, or guides... (⌘K)"
            className="h-9 w-72 lg:w-80 rounded-xl bg-[#F2E6D8]/50 pl-9 pr-4 text-xs text-[#2d1f17] placeholder:text-[#705849] focus:bg-white focus:ring-2 focus:ring-[#555934]/20 focus:outline-none transition-all shadow-2xs"
            readOnly
            onClick={() => router.push('/pathways')}
          />
        </div>
      </div>

      {/* Action / Profile Area */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* 1-Click Official Persona Switcher */}
        <div className="relative" ref={switcherRef}>
          <button
            id="persona-switcher-button"
            type="button"
            onClick={toggleSwitcher}
            aria-label="Switch persona or cadre role"
            aria-expanded={switcherOpen}
            className="flex items-center gap-2 rounded-xl bg-[#F2E6D8]/50 px-3 py-1.5 text-xs font-semibold hover:bg-[#E8DACB] transition shadow-2xs cursor-pointer"
            title="Switch Persona / Cadre Role"
          >
            <span className="flex h-2 w-2 rounded-full bg-[#555934] animate-pulse" />
            <span className="text-[#705849] hidden lg:inline">
              Cadre Persona:
            </span>
            <span className="font-bold text-[#2d1f17] truncate max-w-28 sm:max-w-40">
              {activePersona.name}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${currentRoleStyle.badge}`}
            >
              {activePersona.role}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-[#705849]" />
          </button>

          {switcherOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white p-2 shadow-card-elevated z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-[#F2E6D8] mb-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#705849]">
                    Switch Official Cadre
                  </span>
                  <span className="text-[10px] font-bold bg-[#BF9B7A]/20 text-[#593E2E] px-2 py-0.5 rounded-full">
                    SIH Demo
                  </span>
                </div>
                <p className="text-[11px] text-[#705849] mt-1">
                  Select a role to test role-specific dashboards, Hindi CAPI, or NSSTA Faculty workflows.
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
                          ? 'bg-[#555934]/10 text-[#2d1f17]'
                          : 'hover:bg-[#F2E6D8]/50'
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
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${style.badge}`}
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
          className="flex items-center gap-1.5 rounded-xl bg-[#F2E6D8]/60 px-3 py-1.5 text-xs font-semibold text-[#2d1f17] hover:bg-[#E8DACB] transition-colors cursor-pointer"
        >
          <Globe className="h-3.5 w-3.5 text-[#555934]" />
          <span>{locale === 'en' ? 'हिन्दी' : 'English'}</span>
        </button>

        {/* Karma Points Badge */}
        <div className="hidden sm:flex items-center gap-1.5 rounded-xl bg-[#555934]/12 px-3 py-1.5 text-xs font-semibold text-[#555934]">
          <Award className="h-3.5 w-3.5 text-[#555934]" />
          <span className="font-mono">1,275</span>
          <span className="text-[10px] text-[#705849]">Karma</span>
        </div>

        {/* Functional Notification Center Bell Button */}
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            onClick={toggleNotifications}
            aria-label={`Notifications${
              unreadCount > 0 ? `, ${unreadCount} unread` : ''
            }`}
            aria-expanded={notificationsOpen}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[#F2E6D8]/50 text-[#705849] hover:bg-[#E8DACB] hover:text-[#2d1f17] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#555934] cursor-pointer"
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
            className="flex items-center gap-2 rounded-xl bg-white px-2.5 py-1 text-[#2d1f17] shadow-xs hover:bg-[#E8DACB]/50 transition-all active:scale-98 cursor-pointer"
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
            <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white p-2 shadow-card-elevated z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-[#F2E6D8]">
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
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-[#2d1f17] hover:bg-[#F2E6D8] transition-colors"
                >
                  <User className="h-3.5 w-3.5 text-[#555934]" />
                  <span>{t('profile')}</span>
                </Link>

                <Link
                  href="/pathways"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-[#2d1f17] hover:bg-[#F2E6D8] transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#BF9B7A]" />
                  <span>My Learning Pathways</span>
                </Link>

                <a
                  href="https://igotkarmayogi.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-[#705849] hover:bg-[#F2E6D8] hover:text-[#2d1f17] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <ExternalLink className="h-3.5 w-3.5 text-[#705849]" />
                    iGOT Portal
                  </span>
                  <span className="text-[9px] font-mono text-[#705849]">Gov.in</span>
                </a>
              </div>

              <div className="pt-1 border-t border-[#F2E6D8]">
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
    </header>
  );
}

export default Topbar;
