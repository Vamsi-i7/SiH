'use client';

import React, { useState, useEffect } from 'react';
import type { UserRole } from '@/lib/types';
import LearnerDashboard from './learner/LearnerDashboard';
import TrainerDashboard from './trainer/TrainerDashboard';
import AdminDashboard from './admin/AdminDashboard';

export interface DashboardUserProps {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
    organization_id?: string;
    cadre?: string;
    designation?: string;
    preferred_language?: string;
    role?: string;
  };
  app_metadata?: {
    role?: string;
    [key: string]: unknown;
  };
}

export function resolveUserRole(user?: Partial<DashboardUserProps> | null): UserRole {
  // Check client cookie if present
  if (typeof document !== 'undefined') {
    try {
      const match = document.cookie.match(/(?:^|; )demo_user=([^;]*)/);
      if (match) {
        const decoded = JSON.parse(decodeURIComponent(match[1]));
        if (decoded?.role === 'trainer' || decoded?.role === 'admin' || decoded?.role === 'learner') {
          return decoded.role as UserRole;
        }
      }
    } catch {
      // ignore
    }
  }

  if (!user) return 'learner';

  const roleFromApp = user.app_metadata?.role;
  if (roleFromApp === 'trainer' || roleFromApp === 'admin' || roleFromApp === 'learner') {
    return roleFromApp as UserRole;
  }

  const roleFromMeta = user.user_metadata?.role;
  if (roleFromMeta === 'trainer' || roleFromMeta === 'admin' || roleFromMeta === 'learner') {
    return roleFromMeta as UserRole;
  }

  // Fallback by email heuristic
  if (user.email?.includes('priya') || user.email?.includes('nssta')) return 'trainer';
  if (user.email?.includes('rajesh')) return 'admin';

  return 'learner';
}

export function RoleDashboardRouter({ user }: { user: DashboardUserProps }) {
  const [role, setRole] = useState<UserRole>(() => resolveUserRole(user));

  // Sync role if cookie changes (e.g. via Topbar persona switcher)
  useEffect(() => {
    const handleCheckCookie = () => {
      const currentRole = resolveUserRole(user);
      setRole((prev) => (prev !== currentRole ? currentRole : prev));
    };

    handleCheckCookie();
    const interval = setInterval(handleCheckCookie, 1000);
    return () => clearInterval(interval);
  }, [user]);

  switch (role) {
    case 'trainer':
      return <TrainerDashboard user={user} />;
    case 'admin':
      return <AdminDashboard user={user} />;
    case 'learner':
    default:
      return <LearnerDashboard user={user} />;
  }
}

export default RoleDashboardRouter;
