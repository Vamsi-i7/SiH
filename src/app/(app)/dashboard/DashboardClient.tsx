'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import { ProgressRing } from '@/components/ProgressRing';
import { RadarChart, type RadarDataPoint } from '@/components/RadarChart';
import { ProvenanceBadge } from '@/components/ProvenanceBadge';
import { useEffect, useState } from 'react';
import { CompetencyService } from '@/services/competencyService';
import { PlayCircle } from 'lucide-react';

interface DashboardProps {
  user: {
    id: string;
    email: string;
    user_metadata?: {
      name?: string;
      organization_id?: string;
    };
  };
}

interface CompetencyGapCard {
  competencyId: string;
  competencyName: string;
  currentLevel: number;
  targetLevel: number;
  gap: number;
  severity: 'HIGH' | 'MODERATE' | 'PROFICIENT';
  priority: 'critical' | 'important' | 'desirable';
  activity: string;
}

export default function DashboardPage({ user }: DashboardProps) {
  const t = useTranslations();
  const supabase = getSupabaseBrowserClient();

  const [readinessIndex, setReadinessIndex] = useState<number | null>(null);
  const [topGaps, setTopGaps] = useState<CompetencyGapCard[]>([]);
  const [radarData, setRadarData] = useState<RadarDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // Fetch user's role assignment
        const { data: roleData, error: roleError } = await supabase
          .from('users')
          .select('role_id, role:roles(id, name, name_hi)')
          .eq('id', user.id)
          .single();

        if (roleError) throw roleError;
        setUserRole(roleData?.role?.name || 'Learner');

        // Fetch competency records
        const { error: recordsError } = await supabase
          .from('competency_records')
          .select('*')
          .eq('user_id', user.id)
          .eq('organization_id', user.user_metadata?.organization_id || '');

        if (recordsError) throw recordsError;

        // Build readiness and gap data from demo competencies
        // In production: fetch from activity_competencies joined with role requirements
        const demoCompetencies = [
          { id: 'comp-capi', name: 'CAPI Tablet Operation', current: 2, target: 4, priority: 'critical' as const },
          { id: 'comp-nsso', name: 'NSSO Protocol Mastery', current: 3, target: 3, priority: 'critical' as const },
          { id: 'comp-survey', name: 'Survey Sampling & Design', current: 1, target: 2, priority: 'important' as const },
          { id: 'comp-data', name: 'Data Entry & Scrutiny', current: 2, target: 3, priority: 'important' as const },
          { id: 'comp-teamwork', name: 'Teamwork & Collaboration', current: 3, target: 2, priority: 'desirable' as const },
        ];

        // Calculate readiness
        const met = demoCompetencies.filter(c => c.current >= c.target).length;
        const readiness = Math.round((met / demoCompetencies.length) * 100);
        setReadinessIndex(readiness);

        // Build gaps
        const SEVERITY_MAP = { 0: 'PROFICIENT' as const, 1: 'MODERATE' as const, 2: 'HIGH' as const };
        const gaps: CompetencyGapCard[] = demoCompetencies
          .map(comp => {
            const severityScore = CompetencyService.computeGapSeverity(comp.current, comp.target, comp.priority);
            const severity = SEVERITY_MAP[severityScore as keyof typeof SEVERITY_MAP] || 'PROFICIENT';
            return {
              competencyId: comp.id,
              competencyName: comp.name,
              currentLevel: comp.current,
              targetLevel: comp.target,
              gap: comp.target - comp.current,
              severity,
              priority: comp.priority,
              activity: 'Household Listing & Enumeration',
            };
          })
          .filter(g => g.gap > 0)
          .sort((a, b) => {
            const scoreA = CompetencyService.computeGapSeverity(a.currentLevel, a.targetLevel, a.priority);
            const scoreB = CompetencyService.computeGapSeverity(b.currentLevel, b.targetLevel, b.priority);
            return scoreB - scoreA;
          })
          .slice(0, 3);

        setTopGaps(gaps);

        // Build radar data
        const radar = demoCompetencies.map(c => ({
          label: c.name.split(' ').slice(0, 2).join(' '),
          current: c.current,
          target: c.target,
        }));
        setRadarData(radar);

        setLoading(false);
      } catch (error) {
        console.error('Failed to load dashboard:', error);
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user.id, user.user_metadata?.organization_id, supabase]);

  const severityColors = {
    HIGH: 'text-rose-700 bg-rose-50 border-rose-200 dark:text-rose-300 dark:bg-rose-950/40 dark:border-rose-900',
    MODERATE: 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-950/40 dark:border-amber-900',
    PROFICIENT: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-900',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-3 border-blue-700/30 border-t-blue-700 rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-slate-500 dark:text-zinc-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-zinc-100">
          {t('dashboard.readinessIndex')}
        </h1>
        <p className="text-slate-600 dark:text-zinc-400">
          Welcome back, {user.user_metadata?.name || user.email}. {userRole && `Role: ${userRole}`}
        </p>
      </div>

      {/* Main Readiness Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Readiness Ring */}
        <div className="lg:col-span-1 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-zinc-100 mb-6 text-center">
            {t('dashboard.readinessIndex')}
          </h2>
          {readinessIndex !== null && (
            <div className="flex justify-center">
              <ProgressRing
                value={readinessIndex}
                size={140}
                label="Overall"
                sublabel="Competencies at target"
                color={
                  readinessIndex >= 80
                    ? 'text-emerald-600'
                    : readinessIndex >= 50
                    ? 'text-amber-500'
                    : 'text-rose-600'
                }
              />
            </div>
          )}
        </div>

        {/* Radar Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-zinc-100 mb-6">
            {t('profile.competencyRadar')}
          </h2>
          {radarData.length > 0 && <RadarChart data={radarData} size={300} showLegend />}
        </div>
      </div>

      {/* Top Gaps Section */}
      <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-zinc-100">
            {t('dashboard.topGaps')}
          </h2>
          <a
            href="/skill-gap"
            className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {t('dashboard.viewAllGaps')} →
          </a>
        </div>

        {topGaps.length > 0 ? (
          <div className="space-y-4">
            {topGaps.map((gap) => (
              <div
                key={gap.competencyId}
                className={`rounded-lg border p-4 transition-colors ${severityColors[gap.severity]}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{gap.competencyName}</h3>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/30">
                        {gap.priority.charAt(0).toUpperCase() + gap.priority.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm opacity-75 mb-2">Activity: {gap.activity}</p>
                    <div className="flex items-center gap-3 text-sm">
                      <span>Current: <strong>L{gap.currentLevel}</strong></span>
                      <span>→</span>
                      <span>Target: <strong>L{gap.targetLevel}</strong></span>
                    </div>
                  </div>
                  <div className="text-right text-sm font-semibold flex flex-col items-end gap-2">
                    <span>{gap.gap} {gap.gap === 1 ? 'level' : 'levels'}</span>
                    <Link
                      href={`/assessment/${gap.competencyId}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-white/50 px-2 py-1 rounded-md hover:bg-white"
                    >
                      <PlayCircle className="h-3 w-3" />
                      Assess
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500 dark:text-zinc-400">
            <p className="text-sm">🎉 All competencies are at or above target levels!</p>
          </div>
        )}
      </div>

      {/* Recommended Actions */}
      <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-linear-to-br from-blue-50 to-indigo-50 dark:from-zinc-900 dark:to-zinc-800 p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-zinc-100 mb-4">
          {t('dashboard.nextActions')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/pathways"
            className="rounded-lg border border-blue-200 dark:border-blue-900 bg-white dark:bg-zinc-800 p-4 transition-colors hover:bg-blue-50 dark:hover:bg-zinc-700"
          >
            <h3 className="font-semibold text-slate-900 dark:text-zinc-100 mb-2">📚 {t('dashboard.viewPathways')}</h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400">Discover recommended courses</p>
          </a>

          <a
            href="/skill-gap"
            className="rounded-lg border border-blue-200 dark:border-blue-900 bg-white dark:bg-zinc-800 p-4 transition-colors hover:bg-blue-50 dark:hover:bg-zinc-700"
          >
            <h3 className="font-semibold text-slate-900 dark:text-zinc-100 mb-2">📊 {t('skillGap.title')}</h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400">View detailed gap analysis</p>
          </a>

          <a
            href="/profile"
            className="rounded-lg border border-blue-200 dark:border-blue-900 bg-white dark:bg-zinc-800 p-4 transition-colors hover:bg-blue-50 dark:hover:bg-zinc-700"
          >
            <h3 className="font-semibold text-slate-900 dark:text-zinc-100 mb-2">👤 {t('profile.title')}</h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400">View your progress</p>
          </a>

          <Link
            href="/assessment/comp-capi"
            className="rounded-lg border border-purple-200 dark:border-purple-900 bg-white dark:bg-zinc-800 p-4 transition-colors hover:bg-purple-50 dark:hover:bg-zinc-700"
          >
            <h3 className="font-semibold text-slate-900 dark:text-zinc-100 mb-2">🎯 {t('nav.assessment')}</h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400">Take a new assessment</p>
          </Link>
        </div>
      </div>

      {/* Data Provenance Footer */}
      <div className="rounded-lg bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-800 p-4 flex items-start gap-3">
        <span className="text-lg">ℹ️</span>
        <div className="text-xs text-slate-600 dark:text-zinc-400 space-y-1">
          <p>
            <strong>Demo Data:</strong> This dashboard displays synthetic competency records for demonstration.
            In production, data is tied to real assessment results and marked with{' '}
            <ProvenanceBadge provenance="SYNTHETIC_DEMO_DATA" showLabel={false} size="sm" /> badges.
          </p>
        </div>
      </div>
    </div>
  );
}
