'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { CheckCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { Notification } from './types';
import { NotificationItem } from './NotificationItem';

interface NotificationDropdownProps {
  notifications: Notification[];
  unreadCount: number;
  onNotificationClick: (notification: Notification) => void;
  onMarkAllAsRead: () => void;
  onClose: () => void;
}

export function NotificationDropdown({
  notifications,
  unreadCount,
  onNotificationClick,
  onMarkAllAsRead,
  onClose,
}: NotificationDropdownProps) {
  const t = useTranslations('notifications');

  return (
    <div
      role="region"
      aria-label={t('title')}
      className="absolute right-0 mt-2 w-80 sm:w-96 max-w-[calc(100vw-2rem)] rounded-xl border border-accent bg-white shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-accent px-4 py-3 bg-white">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-stone-900">
            {t('title')}
          </h2>
          {unreadCount > 0 && (
            <span className="inline-flex items-center rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-bold text-[#728056]">
              {unreadCount}
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllAsRead}
            className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-dark transition-colors cursor-pointer"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            <span>{t('markAllAsRead')}</span>
          </button>
        )}
      </div>

      {/* Body: Scrollable Notification List or Empty State */}
      <div className="max-h-[380px] overflow-y-auto divide-y divide-accent">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8b9a6e]/15 text-[#8b9a6e] mb-3">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-stone-900">
              {t('allCaughtUp')}
            </p>
            <p className="text-xs text-stone-500 mt-1 max-w-[240px]">
              {t('noNotifications')}
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onSelect={onNotificationClick}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-accent bg-[#fbf9f6] p-2">
        <Link
          href="/notifications"
          onClick={onClose}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-medium text-stone-700 hover:bg-background hover:text-stone-900 transition-colors"
        >
          <span>{t('viewAll')}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
