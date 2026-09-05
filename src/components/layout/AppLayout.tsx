'use client';

import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Breadcrumb } from './Breadcrumb';
import { CopilotFAB } from '@/components/copilot/CopilotFAB';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  // Default demo context — will be replaced with live user data from Supabase
  const userContext = {
    name: 'Amit Sharma',
    role: 'learner',
    cadre: 'Indian Statistical Service (ISS)',
    designation: 'Junior Statistical Officer',
    readinessIndex: 42,
    topGaps: [
      { competency: 'Big Data Analytics', levelDelta: 2, priority: 'critical' },
      { competency: 'Machine Learning Fundamentals', levelDelta: 2, priority: 'critical' },
      { competency: 'GIS & Spatial Analysis', levelDelta: 1, priority: 'important' },
    ],
  };

  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-6 py-6">
            <Breadcrumb />
            <div className="mt-4">
              {children}
            </div>
          </div>
        </div>
      </div>
      <CopilotFAB userContext={userContext} />
    </div>
  );
}
