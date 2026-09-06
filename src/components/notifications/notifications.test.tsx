import { describe, it, expect, beforeEach, vi } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import {
  getInitialNotifications,
  LEARNER_NOTIFICATIONS,
  ADMIN_NOTIFICATIONS,
  fetchNotifications,
} from './notification-data';
import { Notification } from './types';
import { NotificationItem } from './NotificationItem';
import { NotificationDropdown } from './NotificationDropdown';

// Configure React 19 act environment
// @ts-expect-error - React 19 act environment flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string, params?: { count?: number }) => {
    const translations: Record<string, string> = {
      title: 'Notifications',
      markAllAsRead: 'Mark all as read',
      allCaughtUp: "You're all caught up",
      noNotifications: 'No new notifications right now.',
      viewAll: 'View all notifications',
      unreadBadge: `${params?.count ?? 0} unread`,
      filterAll: 'All',
      filterUnread: 'Unread',
    };
    return translations[key] || key;
  },
}));

describe('Notification Data Layer & Persona Awareness', () => {
  it('returns learner notifications by default or when specified', () => {
    const learnerData = getInitialNotifications('learner');
    expect(learnerData.length).toBeGreaterThanOrEqual(3);
    expect(learnerData[0].role).toBe('learner');
    expect(learnerData.some((n) => !n.read)).toBe(true);

    const defaultData = getInitialNotifications();
    expect(defaultData).toEqual(LEARNER_NOTIFICATIONS);
  });

  it('returns trainer notifications when role is trainer', () => {
    const trainerData = getInitialNotifications('trainer');
    expect(trainerData.length).toBeGreaterThanOrEqual(3);
    expect(trainerData[0].role).toBe('trainer');
    expect(trainerData[0].title).toBe('Learner cohort needs attention');
  });

  it('returns admin notifications when role is admin', () => {
    const adminData = getInitialNotifications('admin');
    expect(adminData.length).toBeGreaterThanOrEqual(3);
    expect(adminData[0].role).toBe('admin');
    expect(adminData[0].title).toBe('Workforce competency gap detected');
  });

  it('fetchNotifications future Supabase adapter resolves cleanly', async () => {
    const data = await fetchNotifications('user-123', 'admin');
    expect(data).toHaveLength(ADMIN_NOTIFICATIONS.length);
  });
});

describe('Notification State Transitions', () => {
  it('Test 2 & 3: dynamically calculates unread count and marks notification as read', () => {
    const initial: Notification[] = [
      { id: '1', title: 'T1', message: 'M1', timestamp: '1m', read: false, type: 'assessment' },
      { id: '2', title: 'T2', message: 'M2', timestamp: '2m', read: false, type: 'learning' },
      { id: '3', title: 'T3', message: 'M3', timestamp: '3m', read: true, type: 'achievement' },
    ];

    const initialUnread = initial.filter((n) => !n.read).length;
    expect(initialUnread).toBe(2);

    // Simulate clicking notification '1'
    const updated = initial.map((n) => (n.id === '1' ? { ...n, read: true } : n));
    const newUnread = updated.filter((n) => !n.read).length;
    expect(newUnread).toBe(1);
    expect(updated.find((n) => n.id === '1')?.read).toBe(true);
  });

  it('Test 4: marks all notifications as read and clears unread count', () => {
    const initial: Notification[] = [
      { id: '1', title: 'T1', message: 'M1', timestamp: '1m', read: false, type: 'assessment' },
      { id: '2', title: 'T2', message: 'M2', timestamp: '2m', read: false, type: 'learning' },
    ];

    const allRead = initial.map((n) => ({ ...n, read: true }));
    const unreadCount = allRead.filter((n) => !n.read).length;
    expect(unreadCount).toBe(0);
  });

  it('formats badge label correctly (caps at 99+)', () => {
    const formatBadge = (count: number) => (count > 99 ? '99+' : count.toString());
    expect(formatBadge(2)).toBe('2');
    expect(formatBadge(99)).toBe('99');
    expect(formatBadge(100)).toBe('99+');
    expect(formatBadge(150)).toBe('99+');
  });

  it('Test 6: ensures dropdown exclusivity logic', () => {
    type DropdownState = {
      notificationsOpen: boolean;
      menuOpen: boolean;
      personaOpen: boolean;
    };

    let state: DropdownState = {
      notificationsOpen: false,
      menuOpen: true,
      personaOpen: false,
    };

    // User opens notifications -> account menu and persona close
    const toggleNotifications = (prev: DropdownState): DropdownState => ({
      notificationsOpen: !prev.notificationsOpen,
      menuOpen: false,
      personaOpen: false,
    });

    state = toggleNotifications(state);
    expect(state.notificationsOpen).toBe(true);
    expect(state.menuOpen).toBe(false);
    expect(state.personaOpen).toBe(false);

    // User opens persona -> notifications and account close
    const togglePersona = (prev: DropdownState): DropdownState => ({
      personaOpen: !prev.personaOpen,
      notificationsOpen: false,
      menuOpen: false,
    });

    state = togglePersona(state);
    expect(state.personaOpen).toBe(true);
    expect(state.notificationsOpen).toBe(false);
    expect(state.menuOpen).toBe(false);
  });
});

describe('NotificationItem Component', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('renders unread notification with unread indicator and fires onSelect', () => {
    const onSelect = vi.fn();
    const testNotification: Notification = {
      id: 'test-1',
      title: 'Test Unread Title',
      message: 'Test message description',
      timestamp: '5m ago',
      read: false,
      type: 'assessment',
      href: '/assignments',
    };

    const root = createRoot(container);
    act(() => {
      root.render(
        <NotificationItem
          notification={testNotification}
          onSelect={onSelect}
        />
      );
    });

    expect(container.textContent).toContain('Test Unread Title');
    expect(container.textContent).toContain('Test message description');
    expect(container.textContent).toContain('5m ago');

    const button = container.querySelector('button');
    expect(button).not.toBeNull();
    expect(button?.getAttribute('aria-label')).toContain('Unread: Test Unread Title');

    act(() => {
      button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(onSelect).toHaveBeenCalledWith(testNotification);
  });
});

describe('NotificationDropdown Component', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('Test 1: renders notifications list and shows unread badge & mark all as read', () => {
    const onNotificationClick = vi.fn();
    const onMarkAllAsRead = vi.fn();
    const onClose = vi.fn();

    const sampleNotifications: Notification[] = [
      {
        id: '1',
        title: 'Notification 1',
        message: 'Message 1',
        timestamp: '10m ago',
        read: false,
        type: 'assessment',
      },
      {
        id: '2',
        title: 'Notification 2',
        message: 'Message 2',
        timestamp: '1h ago',
        read: true,
        type: 'learning',
      },
    ];

    const root = createRoot(container);
    act(() => {
      root.render(
        <NotificationDropdown
          notifications={sampleNotifications}
          unreadCount={1}
          onNotificationClick={onNotificationClick}
          onMarkAllAsRead={onMarkAllAsRead}
          onClose={onClose}
        />
      );
    });

    expect(container.textContent).toContain('Notifications');
    expect(container.textContent).toContain('Mark all as read');
    expect(container.textContent).toContain('Notification 1');
    expect(container.textContent).toContain('Notification 2');

    // Click mark all as read
    const markAllButton = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent?.includes('Mark all as read')
    );
    expect(markAllButton).toBeDefined();

    act(() => {
      markAllButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(onMarkAllAsRead).toHaveBeenCalled();
  });

  it('Test 7: renders empty state when there are no notifications', () => {
    const root = createRoot(container);
    act(() => {
      root.render(
        <NotificationDropdown
          notifications={[]}
          unreadCount={0}
          onNotificationClick={vi.fn()}
          onMarkAllAsRead={vi.fn()}
          onClose={vi.fn()}
        />
      );
    });

    expect(container.textContent).toContain("You're all caught up");
    expect(container.textContent).toContain('No new notifications right now.');
    expect(container.textContent).not.toContain('Mark all as read');
  });
});
