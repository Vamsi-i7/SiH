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
  Flag,
  Users,
} from 'lucide-react';
import { Notification } from '@/components/notifications/types';
import { getInitialNotifications } from '@/components/notifications/notification-data';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';
import { DEMO_PERSONAS } from '@/lib/demoPersonas';
import type { DemoPersona } from '@/lib/types';

function getInitialActivePersona(): DemoPersona {
  if (typeof document === 'undefined') return DEMO_PERSONAS[0];
  try {
    const match = document.cookie.match(/(?:^|;\s*)demo_user=([^;]+)/);
    if (match) {
      const parsed = JSON.parse(decodeURIComponent(match[1]));
      if (parsed?.email) {
        const found = DEMO_PERSONAS.find(
          (p) => p.email.toLowerCase() === parsed.email.toLowerCase()
        );
        if (found) return found;
      }
    }
  } catch {
    // Use default persona on cookie parse error
  }
  return DEMO_PERSONAS[0];
}

export function Topbar() {
  const router = useRouter();
  const t = useTranslations('nav');

  // Active Demo Persona
  const [activePersona, setActivePersona] = useState<DemoPersona>(getInitialActivePersona);

  // Dropdown visibility states (mutually exclusive)
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [personaOpen, setPersonaOpen] = useState(false);

  // Dropdown DOM refs for outside-click detection
  const notificationsRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const personaRef = useRef<HTMLDivElement>(null);

  // Notifications state
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    getInitialNotifications(getInitialActivePersona().role)
  );

  // Outside click & Escape key listeners
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
      if (personaRef.current && !personaRef.current.contains(target)) {
        setPersonaOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setNotificationsOpen(false);
        setMenuOpen(false);
        setPersonaOpen(false);
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
    setPersonaOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
    setNotificationsOpen(false);
    setPersonaOpen(false);
  }, []);

  const togglePersona = useCallback(() => {
    setPersonaOpen((prev) => !prev);
    setNotificationsOpen(false);
    setMenuOpen(false);
  }, []);

  // Notification action handlers
  const handleNotificationClick = useCallback(
    (notification: Notification) => {
      // Mark as read immediately
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
      );

      // Navigate if link provided
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

  // Persona switch handler
  const handleSelectPersona = useCallback((persona: DemoPersona) => {
    setPersonaOpen(false);
    setActivePersona(persona);
    setNotifications(getInitialNotifications(persona.role));

    const userObj = {
      id: persona.id,
      name: persona.name,
      email: persona.email,
      role: persona.role,
      organization_id: persona.organization_id,
      cadre: persona.cadre,
      designation: persona.designation,
      preferred_language: persona.preferred_language,
      department: persona.department,
    };
    document.cookie = `demo_user=${encodeURIComponent(
      JSON.stringify(userObj)
    )};path=/;max-age=${60 * 60 * 24 * 7};SameSite=Lax`;
    document.cookie = `locale=${persona.preferred_language || 'en'};path=/;max-age=${
      60 * 60 * 24 * 7
    };SameSite=Lax`;

    window.location.reload();
  }, []);

  // Calculate dynamic unread count
  const unreadCount = notifications.filter((n) => !n.read).length;
  const badgeLabel = unreadCount > 99 ? '99+' : unreadCount.toString();

  return (
    <header className="flex h-16 items-center justify-between border-b border-accent bg-white px-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold text-[#1a1a1a]">
          {t('dashboard')}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Persona Switcher */}
        <div className="relative" ref={personaRef}>
          <button
            type="button"
            onClick={togglePersona}
            aria-label="Switch demo persona"
            aria-expanded={personaOpen}
            className="flex items-center gap-1.5 rounded-lg border border-accent bg-white px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:bg-background transition-colors cursor-pointer"
          >
            <Users className="h-3.5 w-3.5 text-primary" />
            <span className="capitalize font-semibold text-primary-dark hidden md:inline">
              {activePersona.role}
            </span>
            <ChevronDown className="h-3 w-3 text-stone-400" />
          </button>

          {personaOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl border border-accent bg-white py-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-accent">
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Switch Demo Persona
                </p>
              </div>
              <div className="py-1">
                {DEMO_PERSONAS.map((p) => {
                  const isSelected = p.id === activePersona.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectPersona(p)}
                      className={`flex w-full items-start gap-2.5 px-3 py-2 text-left text-xs transition-colors hover:bg-background cursor-pointer ${
                        isSelected ? 'bg-[#f7f2eb]' : ''
                      }`}
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eae2d6] text-[#8b9a6e] font-bold text-xs mt-0.5">
                        {p.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-stone-900 truncate">
                            {p.name}
                          </p>
                          <span className="text-[10px] font-bold uppercase rounded px-1.5 py-0.5 bg-stone-100 text-stone-600">
                            {p.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 truncate">
                          {p.designation}
                        </p>
                        <p className="text-[10px] text-stone-400 truncate">
                          {p.cadre}
                        </p>
                      </div>
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
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eae2d6] text-[#8b9a6e] font-bold">
              <User className="h-4 w-4 text-[#8b9a6e]" />
            </div>
            <span className="text-sm font-medium text-[#1a1a1a] hidden sm:inline">
              {activePersona.name}
            </span>
            <ChevronDown className="h-4 w-4 text-stone-400" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-accent bg-white py-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-accent">
                <p className="text-sm font-semibold text-[#1a1a1a]">
                  {activePersona.name}
                </p>
                <p className="text-xs text-stone-500 truncate">
                  {activePersona.email}
                </p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase rounded px-1.5 py-0.5 bg-[#8b9a6e]/15 text-[#728056]">
                    {activePersona.role}
                  </span>
                  <span className="text-[10px] text-stone-400 truncate">
                    {activePersona.designation}
                  </span>
                </div>
              </div>

              <div className="py-1">
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-stone-700 hover:bg-background transition-colors"
                >
                  <User className="h-4 w-4 text-[#8b9a6e]" />
                  <span>{t('profile')}</span>
                </Link>

                <Link
                  href="/pathways"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-stone-700 hover:bg-background transition-colors"
                >
                  <Flag className="h-4 w-4 text-[#8b9a6e]" />
                  <span>{t('pathways')}</span>
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-stone-700 hover:bg-background transition-colors"
                >
                  <Settings className="h-4 w-4 text-[#8b9a6e]" />
                  <span>Settings</span>
                </Link>
              </div>

              <div className="border-t border-accent pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    router.push('/auth/login');
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-background transition-colors cursor-pointer"
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
