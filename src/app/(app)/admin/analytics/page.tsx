import { getAuthenticatedUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminOverviewClient } from './AdminOverviewClient';
import { type WorkforceOverview, type DepartmentSummary, type TrainingPriority } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function AdminAnalyticsPage() {
  const user = await getAuthenticatedUser();

  if (!user || user.app_metadata?.role !== 'admin') {
    redirect('/dashboard');
  }

  // Pre-seeded high-fidelity demonstration datasets
  const demoOverview: WorkforceOverview = {
    totalOfficials: 1420,
    avgReadiness: 68,
    criticalGaps: 312,
    trendDirection: 'up',
    activePrioritiesCount: 2,
  };

  const demoDepartments: DepartmentSummary[] = [
    {
      department: 'NSSO FOD UP East',
      officialCount: 420,
      avgReadiness: 48,
      criticalGapCount: 112,
      trendDirection: 'down',
      isPriorityFlagged: true,
    },
    {
      department: 'NSSO FOD Bihar Regional',
      officialCount: 380,
      avgReadiness: 54,
      criticalGapCount: 94,
      trendDirection: 'stable',
      isPriorityFlagged: true,
    },
    {
      department: 'SSS Data Supervision Wing',
      officialCount: 340,
      avgReadiness: 74,
      criticalGapCount: 62,
      trendDirection: 'up',
      isPriorityFlagged: false,
    },
    {
      department: 'ISS Macroeconomic Aggregate Wing',
      officialCount: 280,
      avgReadiness: 88,
      criticalGapCount: 44,
      trendDirection: 'up',
      isPriorityFlagged: false,
    },
  ];

  // Static demo timestamps (avoids Date.now() purity lint in server component)
  const oneDayAgo = '2026-09-05T12:00:00.000Z';
  const twoDaysAgo = '2026-09-04T12:00:00.000Z';

  const demoPriorities: TrainingPriority[] = [
    {
      id: 'tp-1',
      organization_id: user.user_metadata?.organization_id || 'org-mospi',
      department: 'NSSO FOD UP East',
      reason: '15.4% listing error rate in Schedule 0.0 scrutiny audit.',
      flagged_by: user.id,
      flagged_at: oneDayAgo,
      resolved: false,
    },
    {
      id: 'tp-2',
      organization_id: user.user_metadata?.organization_id || 'org-mospi',
      department: 'NSSO FOD Bihar Regional',
      reason: 'Urgent refresh needed for CAPI tablet synchronization protocol.',
      flagged_by: user.id,
      flagged_at: twoDaysAgo,
      resolved: false,
    },
  ];

  return (
    <AdminOverviewClient
      initialOverview={demoOverview}
      initialDepartments={demoDepartments}
      initialPriorities={demoPriorities}
    />
  );
}
