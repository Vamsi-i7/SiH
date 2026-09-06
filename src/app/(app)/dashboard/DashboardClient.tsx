'use client';

import React from 'react';
import { RoleDashboardRouter, type DashboardUserProps } from '@/components/dashboard/RoleDashboardRouter';

interface DashboardProps {
  user: DashboardUserProps;
}

export default function DashboardClient({ user }: DashboardProps) {
  return <RoleDashboardRouter user={user} />;
}
