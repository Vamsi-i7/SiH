'use client';

import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Breadcrumb } from './Breadcrumb';
import { CopilotFAB } from '@/components/copilot/CopilotFAB';
import {
  AssessmentModeProvider,
  useAssessmentMode,
} from '@/contexts/AssessmentModeContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

/** Inner component — reads context after provider has been mounted. */
function AppLayoutInner({ children }: AppLayoutProps) {
  const { isAssessmentActive } = useAssessmentMode();

  // Default demo context — will be replaced with live user data from Firebase
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

  if (isAssessmentActive) {
    // Full-screen assessment mode: no sidebar, no topbar, no max-width padding
    return (
      <div className="flex h-full flex-col">
        {children}
        <CopilotFAB userContext={userContext} />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <Breadcrumb />
            <div className="mt-4">{children}</div>
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
