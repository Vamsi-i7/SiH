'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  Bell,
  ChevronDown,
  User,
  LogOut,
  Settings,
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
        (p) => p.email.toLowerCase() === decoded.email?.toLowerCase()
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

  // Handle clicks outside dropdowns & Escape key
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
      bg: 'bg-[#1b365d]/10',
      text: 'text-[#1b365d]',
      badge: 'bg-[#1b365d]/10 text-[#1b365d]',
    },
    trainer: {
      bg: 'bg-[#8b9a6e]/15',
      text: 'text-[#8b9a6e]',
      badge: 'bg-[#8b9a6e]/15 text-[#5f6c48]',
    },
    admin: {
      bg: 'bg-[#c9963a]/15',
      text: 'text-[#a77930]',
      badge: 'bg-[#c9963a]/15 text-[#886022]',
    },
  };

  const currentRoleStyle =
    roleColors[activePersona.role] || roleColors.learner;
  const unreadCount = notifications.filter((n) => !n.read).length;
  const badgeLabel = unreadCount > 99 ? '99+' : unreadCount.toString();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <h1 className="text-base sm:text-lg font-semibold text-foreground">
          {t('dashboard')}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* 1-Click Official Persona Switcher */}
        <div className="relative" ref={switcherRef}>
          <button
            id="persona-switcher-button"
            type="button"
            onClick={toggleSwitcher}
            aria-label="Switch persona or cadre role"
            aria-expanded={switcherOpen}
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-stone-50 transition shadow-2xs cursor-pointer"
            title="Switch Persona / Cadre Role"
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-muted-foreground hidden md:inline">
              Cadre Persona:
            </span>
            <span className="font-bold text-foreground truncate max-w-32.5 sm:max-w-45">
              {activePersona.name}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${currentRoleStyle.badge}`}
            >
              {activePersona.role}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>

          {switcherOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-white p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-border/60 mb-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Switch Official Cadre
                  </span>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                    SIH Demo
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Select a role to test role-specific dashboards, Hindi CAPI, or NSSTA Trainer workflows.
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
                      className={`w-full flex items-start gap-3 p-2.5 rounded-lg text-left transition cursor-pointer ${
                        isSelected
                          ? 'bg-secondary border border-border'
                          : 'hover:bg-stone-50'
                      }`}
                    >
                      <div
                        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md font-bold text-xs ${style.bg} ${style.text}`}
                      >
                        {persona.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-foreground truncate">
                            {persona.name}
                          </p>
                          <span
                            className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded ${style.badge}`}
                          >
                            {persona.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {persona.designation} • {persona.cadre}
                        </p>
                        {persona.preferred_language === 'hi' && (
                          <span className="inline-block mt-0.5 text-[9px] font-bold text-orange-700 bg-orange-50 px-1.5 rounded">
                            🇮🇳 हिन्दी First (NSSO FOD)
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <Check className="h-4 w-4 text-emerald-600 mt-1 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
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
            className="relative flex items-center justify-center rounded-lg p-2 text-stone-600 hover:bg-background transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white shadow-sm"
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
            className="flex items-center gap-2 rounded-lg hover:bg-background px-2 py-1.5 text-stone-600 transition-colors cursor-pointer"
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${currentRoleStyle.bg} ${currentRoleStyle.text}`}
            >
              {activePersona.name.charAt(0)}
            </div>
            <span className="text-sm font-medium text-foreground hidden sm:inline">
              {activePersona.name}
            </span>
            <ChevronDown className="h-4 w-4 text-stone-400" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-white py-1 shadow-lg z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2 border-b border-border">
                <p className="text-sm font-bold text-foreground">
                  {activePersona.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {activePersona.email}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {activePersona.designation}
                </p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-bold uppercase rounded px-1.5 py-0.5 ${currentRoleStyle.badge}`}
                  >
                    {activePersona.role}
                  </span>
                  <span className="text-[10px] text-stone-400 truncate">
                    {activePersona.cadre}
                  </span>
                </div>
              </div>

              <div className="py-1">
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                >
                  <User className="h-4 w-4 text-primary" />
                  <span>{t('profile')}</span>
                </Link>

                <Link
                  href="/pathways"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                >
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>{t('pathways')}</span>
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                >
                  <Settings className="h-4 w-4 text-primary" />
                  <span>Settings</span>
                </Link>
              </div>

              <div className="border-t border-border pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    clearPersonaCookie();
                    router.push('/auth/login');
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
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
