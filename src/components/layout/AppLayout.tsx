'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Breadcrumb } from './Breadcrumb';
import { CopilotFAB } from '@/components/copilot/CopilotFAB';
import {
  AssessmentModeProvider,
  useAssessmentMode,
} from '@/contexts/AssessmentModeContext';
import type { UserRole } from '@/lib/types';
import { resolveUserRole } from '@/components/dashboard/RoleDashboardRouter';

interface AppLayoutProps {
  children: React.ReactNode;
}

/** Inner component — reads context after provider has been mounted. */
function AppLayoutInner({ children }: AppLayoutProps) {
  const { isAssessmentActive } = useAssessmentMode();
  const [role, setRole] = useState<UserRole>('learner');

  useEffect(() => {
    const updateRole = () => {
      setRole(resolveUserRole());
    };
    updateRole();
    const interval = setInterval(updateRole, 1000);
    return () => clearInterval(interval);
  }, []);

  const userContext = {
    name:
      role === 'trainer'
        ? 'Dr. Priya Verma'
        : role === 'admin'
          ? 'Rajesh Kumar'
          : 'Amit Sharma',
    role,
    cadre:
      role === 'trainer'
        ? 'NSSTA Faculty'
        : role === 'admin'
          ? 'MoSPI Headquarters'
          : 'Subordinate Statistical Service (SSS)',
    designation:
      role === 'trainer'
        ? 'Course Director'
        : role === 'admin'
          ? 'Additional Director General'
          : 'Junior Statistical Officer',
    readinessIndex: role === 'admin' ? 72 : 42,
    topGaps: [
      { competency: 'CAPI Tablet Operations', levelDelta: 2, priority: 'critical' },
      { competency: 'Census Boundary Demarcation', levelDelta: 2, priority: 'critical' },
      { competency: 'Household Listing & Stratification', levelDelta: 1, priority: 'important' },
    ],
  };

  if (isAssessmentActive) {
    // Full-screen assessment mode: no sidebar, no topbar, no max-width padding
    return (
      <div className="flex h-full flex-col bg-[#FAF6F0]">
        {children}
        <CopilotFAB userContext={userContext} />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAF6F0]/40">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-[#FAF6F0]/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
            <div className="mb-4">
              <Breadcrumb />
            </div>
            <div>{children}</div>
          </div>
        </main>
      </div>
      <CopilotFAB userContext={userContext} />
    </div>
  );
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <AssessmentModeProvider>
      <AppLayoutInner>{children}</AppLayoutInner>
    </AssessmentModeProvider>
  );
}

export default AppLayout;
