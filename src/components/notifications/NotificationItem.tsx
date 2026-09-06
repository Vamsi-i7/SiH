'use client';

import React from 'react';
import {
  ClipboardCheck,
  BookOpen,
  Trophy,
  Settings,
  Megaphone,
  ChevronRight,
} from 'lucide-react';
import { Notification, NotificationType } from './types';

interface NotificationItemProps {
  notification: Notification;
  onSelect: (notification: Notification) => void;
}

const typeIconMap: Record<
  NotificationType,
  {
    icon: React.ComponentType<{ className?: string }>;
    bgClass: string;
    textClass: string;
  }
> = {
  assessment: {
    icon: ClipboardCheck,
    bgClass: 'bg-[#8b9a6e]/15',
    textClass: 'text-[#728056]',
  },
  learning: {
    icon: BookOpen,
    bgClass: 'bg-[#c9963a]/15',
    textClass: 'text-[#a47524]',
  },
  achievement: {
    icon: Trophy,
    bgClass: 'bg-[#e2a829]/15',
    textClass: 'text-[#a17415]',
  },
  system: {
    icon: Settings,
    bgClass: 'bg-[#eae2d6]',
    textClass: 'text-stone-700',
  },
  announcement: {
    icon: Megaphone,
    bgClass: 'bg-[#8b9a6e]/20',
    textClass: 'text-[#8b9a6e]',
  },
};

export function NotificationItem({
  notification,
  onSelect,
}: NotificationItemProps) {
  const config = typeIconMap[notification.type] || typeIconMap.system;
  const Icon = config.icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(notification)}
      aria-label={`${notification.read ? '' : 'Unread: '}${notification.title}`}
      className={`group relative flex w-full items-start gap-3 p-3.5 text-left transition-colors cursor-pointer border-b border-accent last:border-b-0 focus:outline-none focus-visible:bg-[#f7f2eb] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary ${
        notification.read
          ? 'bg-white hover:bg-[#f7f2eb]'
          : 'bg-[#fbf9f6] hover:bg-[#f5ede2]'
      }`}
    >
      {/* Type Icon Badge */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${config.bgClass} ${config.textClass} mt-0.5 transition-transform group-hover:scale-105`}
        aria-hidden="true"
      >
        <Icon className="h-4 w-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center gap-1.5 mb-0.5">
          <p
            className={`text-xs truncate ${
              notification.read
                ? 'font-medium text-stone-800'
                : 'font-semibold text-stone-900'
            }`}
          >
            {notification.title}
          </p>
          {!notification.read && (
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
              title="Unread notification"
              aria-hidden="true"
            />
          )}
        </div>
        <p className="text-[11px] leading-relaxed text-stone-600 line-clamp-2">
          {notification.message}
        </p>
        <span className="mt-1 block text-[10px] text-stone-400 font-medium">
          {notification.timestamp}
        </span>
      </div>

      {/* Arrow Indicator if clickable href */}
      {notification.href && (
        <ChevronRight className="h-4 w-4 shrink-0 text-stone-300 opacity-0 transition-opacity group-hover:opacity-100 mt-1" />
      )}
    </button>
  );
}
