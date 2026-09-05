'use client';

import { useTranslations } from 'next-intl';
import { Bell, ChevronDown, User, LogOut, Settings } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function Topbar() {
  const router = useRouter();
  const t = useTranslations('nav');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex h-16 items-center justify-between border-b border-accent bg-white px-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold text-[#1a1a1a]">
          {t('dashboard')}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative flex items-center gap-2 rounded-lg hover:bg-background px-2 py-1.5 text-stone-600 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white">
            3
          </span>
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 rounded-lg hover:bg-background px-2 py-1.5 text-stone-600 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eae2d6] text-[#8b9a6e] font-bold">
              <User className="h-4 w-4 text-[#8b9a6e]" />
            </div>
            <span className="text-sm font-medium text-[#1a1a1a] hidden sm:inline">
              Amit Sharma
            </span>
            <ChevronDown className="h-4 w-4 text-stone-400" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg border border-accent bg-white py-1 shadow-lg z-50">
              <div className="px-4 py-2 border-b border-accent">
                <p className="text-sm font-medium text-[#1a1a1a]">
                  Amit Sharma
                </p>
                <p className="text-xs text-stone-500 truncate">
                  amit.sharma@mospi.gov.in
                </p>
              </div>

              <a
                href="/profile"
                className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-background"
              >
                <User className="h-4 w-4 text-[#8b9a6e]" />
                {t('profile')}
              </a>

              <a
                href="/settings"
                className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-background"
              >
                <Settings className="h-4 w-4 text-[#8b9a6e]" />
                Settings
              </a>

              <button
                onClick={() => {
                  router.push('/auth/login');
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-background"
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
