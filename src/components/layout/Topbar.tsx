'use client';

import { useTranslations } from 'next-intl';
import { Bell, ChevronDown, User, LogOut, Check, Sparkles } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DEMO_PERSONAS } from '@/lib/demoPersonas';
import type { DemoPersona } from '@/lib/types';

function getInitialPersona(): DemoPersona {
  if (typeof document === 'undefined') return DEMO_PERSONAS[0];
  try {
    const match = document.cookie.match(/(?:^|; )demo_user=([^;]*)/);
    if (match) {
      const decoded = JSON.parse(decodeURIComponent(match[1]));
      const found = DEMO_PERSONAS.find((p) => p.email.toLowerCase() === decoded.email?.toLowerCase());
      if (found) return found;
    }
  } catch {
    // Fallback to default
  }
  return DEMO_PERSONAS[0];
}

function setPersonaCookie(persona: DemoPersona) {
  if (typeof document === 'undefined') return;
  document.cookie = `demo_user=${encodeURIComponent(JSON.stringify(persona))}; path=/; max-age=604800`;
  document.cookie = `locale=${persona.preferred_language || 'en'}; path=/; max-age=31536000`;
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
  const [activePersona, setActivePersona] = useState<DemoPersona>(getInitialPersona);

  const menuRef = useRef<HTMLDivElement>(null);
  const switcherRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
      if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
        setSwitcherOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectPersona = (persona: DemoPersona) => {
    setActivePersona(persona);
    setSwitcherOpen(false);
    setPersonaCookie(persona);
    window.location.reload();
  };

  const roleColors: Record<string, { bg: string; text: string; badge: string }> = {
    learner: { bg: 'bg-[#1b365d]/10', text: 'text-[#1b365d]', badge: 'bg-[#1b365d]/10 text-[#1b365d]' },
    trainer: { bg: 'bg-[#8b9a6e]/15', text: 'text-[#8b9a6e]', badge: 'bg-[#8b9a6e]/15 text-[#5f6c48]' },
    admin: { bg: 'bg-[#c9963a]/15', text: 'text-[#a77930]', badge: 'bg-[#c9963a]/15 text-[#886022]' },
  };

  const currentRoleStyle = roleColors[activePersona.role] || roleColors.learner;

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
            onClick={() => setSwitcherOpen(!switcherOpen)}
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-stone-50 transition shadow-2xs"
            title="Switch Persona / Cadre Role"
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-muted-foreground hidden md:inline">Cadre Persona:</span>
            <span className="font-bold text-foreground truncate max-w-32.5 sm:max-w-45">
              {activePersona.name}
            </span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${currentRoleStyle.badge}`}>
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
                      onClick={() => handleSelectPersona(persona)}
                      className={`w-full flex items-start gap-3 p-2.5 rounded-lg text-left transition ${
                        isSelected
                          ? 'bg-secondary border border-border'
                          : 'hover:bg-stone-50'
                      }`}
                    >
                      <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md font-bold text-xs ${style.bg} ${style.text}`}>
                        {persona.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-foreground truncate">
                            {persona.name}
                          </p>
                          <span className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded ${style.badge}`}>
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
                      {isSelected && <Check className="h-4 w-4 text-emerald-600 mt-1 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <button
          className="relative flex items-center gap-2 rounded-lg hover:bg-background p-2 text-stone-600 transition-colors"
          title="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white">
            3
          </span>
        </button>

        {/* User Account Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 rounded-lg hover:bg-background px-2 py-1.5 text-stone-600 transition-colors"
          >
            <div className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${currentRoleStyle.bg} ${currentRoleStyle.text}`}>
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
              </div>

              <a
                href="/profile"
                className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
              >
                <User className="h-4 w-4 text-primary" />
                {t('profile')}
              </a>

              <a
                href="/pathways"
                className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                Learning Pathways
              </a>

              <button
                onClick={() => {
                  clearPersonaCookie();
                  router.push('/auth/login');
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                {t('logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
