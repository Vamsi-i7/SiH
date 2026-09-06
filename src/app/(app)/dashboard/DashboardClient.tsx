'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ProgressRing } from '@/components/ProgressRing';
import { RadarChart, type RadarDataPoint } from '@/components/RadarChart';
import { ProvenanceBadge } from '@/components/ProvenanceBadge';
import { useEffect, useState } from 'react';
import { CompetencyService } from '@/services/competencyService';
import { getPersonaFRAC } from '@/data/fracCadres';
import { PlayCircle } from 'lucide-react';

interface DashboardProps {
  user: {
    id: string;
    email: string;
    user_metadata?: {
      name?: string;
      organization_id?: string;
      cadre?: string;
      designation?: string;
      preferred_language?: string;
    };
    app_metadata?: {
      role?: string;
      [key: string]: unknown;
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

  const fallbackRole =
    user.user_metadata?.designation ||
    (user.app_metadata?.role
      ? user.app_metadata.role.charAt(0).toUpperCase() + user.app_metadata.role.slice(1)
      : 'Learner');

  const [readinessIndex, setReadinessIndex] = useState<number | null>(40);
  const [topGaps, setTopGaps] = useState<CompetencyGapCard[]>([]);
  const [radarData, setRadarData] = useState<RadarDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<string>(fallbackRole);

  useEffect(() => {
    const loadDashboard = () => {
      try {
        const profile = getPersonaFRAC(user);
        const isHindi = user.user_metadata?.preferred_language === 'hi' || profile.preferredLanguage === 'hi';

        setUserRole(isHindi ? profile.designation_hi : profile.designation);

        // Calculate readiness with PRD mathematical engine
        const userRecords = new Map(profile.competencies.map((c) => [c.id, c.currentLevel]));
        const required = profile.competencies.map((c) => ({
          competencyId: c.id,
          targetLevel: c.targetLevel,
        }));
        const readiness = CompetencyService.computeReadinessIndex(required, userRecords);
        setReadinessIndex(readiness);

        // Build gaps with official PRD severity formulas
        const gaps: CompetencyGapCard[] = profile.competencies
          .map((comp) => {
            const severityScore = CompetencyService.computeGapSeverity(
              comp.currentLevel,
              comp.targetLevel,
              comp.priority
            );
            const severity = CompetencyService.classifySeverity(severityScore);
            return {
              competencyId: comp.id,
              competencyName: isHindi ? comp.name_hi : comp.name,
              currentLevel: comp.currentLevel,
              targetLevel: comp.targetLevel,
              gap: Math.max(0, comp.targetLevel - comp.currentLevel),
              severity,
              priority: comp.priority,
              activity: isHindi ? comp.activityName_hi : comp.activityName,
            };
          })
          .filter((g) => g.gap > 0)
          .sort((a, b) => {
            const scoreA = CompetencyService.computeGapSeverity(a.currentLevel, a.targetLevel, a.priority);
            const scoreB = CompetencyService.computeGapSeverity(b.currentLevel, b.targetLevel, b.priority);
            return scoreB - scoreA;
          })
          .slice(0, 3);

        setTopGaps(gaps);

        // Build radar data
        const radar = profile.competencies.map((c) => ({
          label: (isHindi ? c.name_hi : c.name).split(' ').slice(0, 2).join(' '),
          current: c.currentLevel,
          target: c.targetLevel,
        }));
        setRadarData(radar);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load dashboard:', error);
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user.id, user.email, user.user_metadata?.preferred_language]);

  const severityColors = {
    HIGH: 'text-[#c0574a] bg-[#c0574a]/10 border-[#c0574a]/25',
    MODERATE: 'text-[#c9963a] bg-[#c9963a]/10 border-[#c9963a]/25',
    PROFICIENT: 'text-[#8b9a6e] bg-[#8b9a6e]/10 border-[#8b9a6e]/25',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-3 border-[#8b9a6e]/30 border-t-[#8b9a6e] rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a]">
          {t('dashboard.readinessIndex')}
        </h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, {user.user_metadata?.name || user.email}. {userRole && `Role: ${userRole}`}
        </p>
      </div>

      {/* Main Readiness Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Readiness Ring */}
        <div className="lg:col-span-1 rounded-xl border border-[#e3dbcf] bg-white p-6 shadow-2xs">
          <h2 className="text-base font-semibold text-[#1a1a1a] mb-6 text-center">
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
                    ? 'text-[#8b9a6e]'
                    : readinessIndex >= 50
                    ? 'text-[#c9963a]'
                    : 'text-[#c0574a]'
                }
              />
            </div>
          )}
        </div>

        {/* Radar Chart */}
        <div className="lg:col-span-2 rounded-xl border border-[#e3dbcf] bg-white p-6 shadow-2xs">
          <h2 className="text-base font-semibold text-[#1a1a1a] mb-6">
            {t('profile.competencyRadar')}
          </h2>
          {radarData.length > 0 && <RadarChart data={radarData} size={300} showLegend />}
        </div>
      </div>

      {/* Top Gaps Section */}
      <div className="rounded-xl border border-[#e3dbcf] bg-white p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-[#1a1a1a]">
            {t('dashboard.topGaps')}
          </h2>
          <a
            href="/skill-gap"
            className="text-sm font-medium text-[#8b9a6e] hover:text-primary-dark"
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
                      <h3 className="font-semibold text-[#1a1a1a]">{gap.competencyName}</h3>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/70 border border-[#e3dbcf]">
                        {gap.priority.charAt(0).toUpperCase() + gap.priority.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm opacity-80 mb-2">Activity: {gap.activity}</p>
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
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#8b9a6e] bg-white border border-[#e3dbcf] px-2.5 py-1 rounded-md hover:bg-background"
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
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">🎉 All competencies are at or above target levels!</p>
          </div>
        )}
      </div>

      {/* Recommended Actions */}
      <div className="rounded-xl border border-[#e3dbcf] bg-white p-6 shadow-2xs">
        <h2 className="text-base font-semibold text-[#1a1a1a] mb-4">
          {t('dashboard.nextActions')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/pathways"
            className="rounded-lg border border-[#e3dbcf] bg-background/60 p-4 transition-colors hover:bg-[#eae2d6]/40"
          >
            <h3 className="font-semibold text-[#1a1a1a] mb-1.5">📚 {t('dashboard.viewPathways')}</h3>
            <p className="text-xs text-muted-foreground">Discover recommended courses</p>
          </a>

          <a
            href="/skill-gap"
            className="rounded-lg border border-[#e3dbcf] bg-background/60 p-4 transition-colors hover:bg-[#eae2d6]/40"
          >
            <h3 className="font-semibold text-[#1a1a1a] mb-1.5">📊 {t('skillGap.title')}</h3>
            <p className="text-xs text-muted-foreground">View detailed gap analysis</p>
          </a>

          <a
            href="/profile"
            className="rounded-lg border border-[#e3dbcf] bg-background/60 p-4 transition-colors hover:bg-[#eae2d6]/40"
          >
            <h3 className="font-semibold text-[#1a1a1a] mb-1.5">👤 {t('profile.title')}</h3>
            <p className="text-xs text-muted-foreground">View your progress</p>
          </a>

          <Link
            href="/assessment/comp-capi"
            className="rounded-lg border border-[#e3dbcf] bg-background/60 p-4 transition-colors hover:bg-[#eae2d6]/40"
          >
            <h3 className="font-semibold text-[#1a1a1a] mb-1.5">🎯 {t('nav.assessment')}</h3>
            <p className="text-xs text-muted-foreground">Take a new assessment</p>
          </Link>
        </div>
      </div>

      {/* Data Provenance Footer */}
      <div className="rounded-lg bg-background/70 border border-[#e3dbcf] p-4 flex items-start gap-3">
        <span className="text-lg">ℹ️</span>
        <div className="text-xs text-muted-foreground space-y-1">
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

