'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { Notification } from '@/components/notifications/types';
import { getInitialNotifications } from '@/components/notifications/notification-data';
import { NotificationItem } from '@/components/notifications/NotificationItem';

function getInitialClientNotifications(): Notification[] {
  if (typeof document === 'undefined') return getInitialNotifications('learner');
  let role = 'learner';
  try {
    const match = document.cookie.match(/(?:^|;\s*)demo_user=([^;]+)/);
    if (match) {
      const parsed = JSON.parse(decodeURIComponent(match[1]));
      if (parsed?.role) {
        role = parsed.role;
      }
    }
  } catch {
    // Fallback to learner
  }
  return getInitialNotifications(role);
}

export function NotificationsClient() {
  const router = useRouter();
  const t = useTranslations('notifications');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<Notification[]>(getInitialClientNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const handleNotificationClick = (notification: Notification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
    );
    if (notification.href) {
      router.push(notification.href);
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-accent bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#8b9a6e]/15 text-[#8b9a6e]">
            <Bell className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-stone-900">
              {t('title')}
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              {unreadCount > 0
                ? t('unreadBadge', { count: unreadCount })
                : t('allCaughtUp')}
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            className="inline-flex items-center gap-2 rounded-lg border border-accent bg-white px-3.5 py-2 text-xs font-semibold text-stone-700 hover:bg-background hover:text-stone-900 transition-colors cursor-pointer"
          >
            <CheckCheck className="h-4 w-4 text-primary" />
            <span>{t('markAllAsRead')}</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-stone-600 border border-accent hover:bg-background'
            }`}
          >
            {t('filterAll')} ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('unread')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              filter === 'unread'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-stone-600 border border-accent hover:bg-background'
            }`}
          >
            {t('filterUnread')} ({unreadCount})
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-400">
          <Filter className="h-3.5 w-3.5" />
          <span>Showing {filteredNotifications.length} items</span>
        </div>
      </div>

      {/* Notifications List Card */}
      <div className="rounded-xl border border-accent bg-white shadow-sm overflow-hidden divide-y divide-accent">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#8b9a6e]/15 text-[#8b9a6e] mb-3">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <p className="text-base font-semibold text-stone-900">
              {t('allCaughtUp')}
            </p>
            <p className="text-xs text-stone-500 mt-1 max-w-sm">
              {t('noNotifications')}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onSelect={handleNotificationClick}
            />
          ))
        )}
      </div>
    </div>
  );
}
