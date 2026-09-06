'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import {
  BookOpen,
  Target,
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  Sparkles,
  Flame,
  Calendar,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

import dynamic from 'next/dynamic';
import { ProgressRing } from '@/components/ProgressRing';
import type { RadarDataPoint } from '@/components/RadarChart';
import { CourseCard, type CourseData } from '@/components/CourseCard';
import { ProvenanceBadge } from '@/components/ProvenanceBadge';

const RadarChart = dynamic(
  () => import('@/components/RadarChart').then((mod) => mod.RadarChart),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-64 w-64 items-center justify-center">
        <div className="h-48 w-48 rounded-full bg-[#E8DACB]/40 animate-pulse" />
      </div>
    ),
  }
);
import { CompetencyService } from '@/services/competencyService';
import { OFFICIAL_COURSE_CATALOG } from '@/services/recommendationService';

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
    };
  };
}

interface CompetencyGapCard {
  competencyId: string;
  competencyName: string;
  category: string;
  currentLevel: number;
  targetLevel: number;
  gap: number;
  severity: 'HIGH' | 'MODERATE' | 'PROFICIENT';
  priority: 'critical' | 'important' | 'desirable';
  activity: string;
  recommendedCourseTitle: string;
  recommendedCourseLink: string;
}

// Demo competencies aligned with FRAC framework
const DEMO_COMPETENCIES = [
  { id: 'comp-capi', name: 'CAPI Tablet Operation', category: 'Functional', current: 2, target: 4, priority: 'critical' as const, activity: 'Household Listing & Census Enumeration', course: 'Advanced CAPI Tablet Operations & Synchronization' },
  { id: 'comp-nsso', name: 'NSSO Protocol Mastery', category: 'Domain', current: 3, target: 3, priority: 'critical' as const, activity: 'PLFS Schedule Canvassing', course: 'Periodic Labour Force Survey (PLFS) Concepts & Definitions' },
  { id: 'comp-survey', name: 'Survey Sampling & Design', category: 'Domain', current: 1, target: 3, priority: 'important' as const, activity: 'Sample Selection & Multiplier Verification', course: 'Multistage Stratified Sampling in Large-Scale Household Surveys' },
  { id: 'comp-data', name: 'Data Entry & Scrutiny', category: 'Functional', current: 1, target: 3, priority: 'important' as const, activity: 'Field Validation Checks', course: 'Statistical Data Scrutiny, Validation Rules & Outlier Detection' },
  { id: 'comp-teamwork', name: 'Teamwork & Collaboration', category: 'Behavioural', current: 3, target: 2, priority: 'desirable' as const, activity: 'Field Team Coordination', course: 'Effective Field Team Coordination & Informant Engagement' },
];

export default function DashboardClient({ user }: DashboardProps) {
  const t = useTranslations();
  const locale = useLocale();

  const [selectedCourseTab, setSelectedCourseTab] = useState<'all' | 'critical' | 'applied' | 'foundational'>('all');

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('dashboard.greetingMorning');
    if (hour < 17) return t('dashboard.greetingAfternoon');
    return t('dashboard.greetingEvening');
  };

  const userName = user.user_metadata?.name || 'Amit Sharma';
  const userDesignation = user.user_metadata?.designation || 'Junior Statistical Officer';
  const userCadre = user.user_metadata?.cadre || 'Subordinate Statistical Service (SSS)';

  // Calculate readiness index (% of target competencies met)
  const readinessIndex = useMemo(() => {
    const met = DEMO_COMPETENCIES.filter((c) => c.current >= c.target).length;
    return Math.round((met / DEMO_COMPETENCIES.length) * 100);
  }, []);

  // Build actionable gap list
  const topGaps = useMemo<CompetencyGapCard[]>(() => {
    const SEVERITY_MAP = { 0: 'PROFICIENT' as const, 1: 'MODERATE' as const, 2: 'HIGH' as const };
    return DEMO_COMPETENCIES
      .map((comp) => {
        const severityScore = CompetencyService.computeGapSeverity(comp.current, comp.target, comp.priority);
        const severity = SEVERITY_MAP[severityScore as keyof typeof SEVERITY_MAP] || 'PROFICIENT';
        return {
          competencyId: comp.id,
          competencyName: comp.name,
          category: comp.category,
          currentLevel: comp.current,
          targetLevel: comp.target,
          gap: Math.max(0, comp.target - comp.current),
          severity,
          priority: comp.priority,
          activity: comp.activity,
          recommendedCourseTitle: comp.course,
          recommendedCourseLink: '/pathways',
        };
      })
      .filter((g) => g.gap > 0)
      .sort((a, b) => b.gap - a.gap);
  }, []);

  // Build radar data
  const radarData = useMemo<RadarDataPoint[]>(() => {
    return DEMO_COMPETENCIES.map((c) => ({
      label: c.name.split(' ').slice(0, 2).join(' '),
      current: c.current,
      target: c.target,
    }));
  }, []);
  // Format catalog courses for the CourseCard component
  const recommendedCourses: CourseData[] = OFFICIAL_COURSE_CATALOG.map((course) => {
    let whyRec = 'Recommended by statistical training council to build institutional competency.';
    let pri: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';

    if (course.targetCompetencies.includes('comp-capi')) {
      whyRec = 'Directly addresses your CAPI Tablet competency gap (L2 → L4) for upcoming census enumeration.';
      pri = 'HIGH';
    } else if (course.targetCompetencies.includes('comp-survey')) {
      whyRec = 'Closes high-priority Survey Sampling & Design gap (L1 → L3) required for field investigation.';
      pri = 'HIGH';
    } else if (course.targetCompetencies.includes('comp-data')) {
      whyRec = 'Targeted to eliminate data entry scrutiny errors in Schedule 0.0 listings.';
      pri = 'MEDIUM';
    } else if (course.targetCompetencies.includes('comp-nsso')) {
      whyRec = 'Refreshes foundational NSSO protocols and PLFS schedule canvassing guidelines.';
      pri = 'LOW';
    }

    return {
      id: course.id,
      courseId: course.courseId,
      title: course.title,
      title_hi: course.title_hi,
      provider: course.provider,
      duration: course.duration,
      description: course.description,
      description_hi: course.description_hi,
      priority: pri,
      targetCompetencies: course.targetCompetencies.map((id) => {
        if (id === 'comp-capi') return 'CAPI Tablet Operation';
        if (id === 'comp-survey') return 'Survey Sampling & Design';
        if (id === 'comp-data') return 'Data Entry & Scrutiny';
        if (id === 'comp-nsso') return 'NSSO Protocol Mastery';
        return 'Statistical Operations';
      }),
      whyRecommended: whyRec,
      stage: course.stage,
      iGotLink: course.iGotLink,
      rating: course.rating,
      enrolledCount: course.enrolledCount,
    };
  });

  // Filter courses based on active tab
  const filteredCourses = recommendedCourses.filter((course) => {
    if (selectedCourseTab === 'critical') return course.priority === 'HIGH';
    if (selectedCourseTab === 'applied') return course.stage === 'APPLIED';
    if (selectedCourseTab === 'foundational') return course.stage === 'FOUNDATIONAL';
    return true;
  });

  // Active in-progress course
  const activeCourse: CourseData = {
    id: 'active-capi',
    title: 'Advanced CAPI Tablet Operations & Synchronization',
    provider: 'NSSTA & MoSPI Digital Training Cell',
    duration: '45 mins remaining',
    description: 'Master offline listing, error-checking, GPS tagging, and daily data synchronization protocols on CAPI tablets.',
    targetCompetencies: ['CAPI Tablet Operation'],
    stage: 'APPLIED',
    progress: 66,
    currentModule: 'Module 4 of 6: GPS Coordinate Scrutiny & Daily Sync',
    iGotLink: 'https://igotkarmayogi.gov.in/app/toc/do_1138472910_capi_advanced/overview',
  };

  return (
    <div className="space-y-8 pb-12">
      {/* ════════════════════════════════════════════════════════════════
          1. PREMIUM DASHBOARD HEADER
          ════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden rounded-2xl bg-white p-6 sm:p-8 shadow-card">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#555934]/12 px-3 py-1 text-xs font-semibold text-[#555934]">
                <Sparkles className="h-3.5 w-3.5 text-[#555934]" />
                National Statistical Workforce Portal
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#E8DACB] px-3 py-1 text-xs font-medium text-[#705849]">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                Cycle 2025–26
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2d1f17]">
              {getGreeting()}, {userName}
            </h1>

            <p className="text-sm text-[#705849] max-w-2xl leading-relaxed">
              Here is your workforce readiness overview. You are currently at{' '}
              <strong className="text-[#2d1f17] font-mono">{readinessIndex}% readiness</strong> for your role as{' '}
              <span className="font-semibold text-[#2d1f17]">{userDesignation}</span> ({userCadre}).{' '}
              <span className="text-[#8C5B3E] font-semibold">{topGaps.length} priority skill gaps</span> require your attention to reach target proficiency.
            </p>
          </div>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <Link
              href="/pathways"
              className="inline-flex items-center gap-2 rounded-xl bg-[#555934] px-4 py-2 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-[#3e4225] hover:shadow-sm"
            >
              <BookOpen className="h-4 w-4" />
              {t('dashboard.viewPathways')}
            </Link>

            <Link
              href="/assessment/problem-solving/instructions"
              className="inline-flex items-center gap-2 rounded-xl bg-[#F2E6D8]/80 px-4 py-2 text-xs font-semibold text-[#2d1f17] transition-all hover:bg-[#E8DACB] hover:text-black"
            >
              <PlayCircle className="h-4 w-4 text-[#555934]" />
              Quick Assessment
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          2. KEY METRIC OVERVIEW STRIP (4 Compact Metric Cards)
          ════════════════════════════════════════════════════════════════ */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Readiness Index */}
        <div className="rounded-2xl bg-white p-5 shadow-card transition-all hover:shadow-card-hover">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Readiness Score</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#BF9B7A]/20 px-2 py-0.5 text-[10px] font-bold text-[#593E2E]">
              Needs Improvement
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-[#2d1f17]">{readinessIndex}%</span>
            <span className="text-xs font-bold text-[#555934] font-mono">+8% vs Q1</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            2 of 5 competencies at role target
          </p>
        </div>

        {/* Card 2: Active Competency Gaps */}
        <div className="rounded-2xl bg-white p-5 shadow-card transition-all hover:shadow-card-hover">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Skill Gaps</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#8C5B3E]/12 px-2 py-0.5 text-[10px] font-bold text-[#8C5B3E]">
              3 Critical
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-[#2d1f17]">{topGaps.length}</span>
            <span className="text-xs text-muted-foreground">priority targets</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Max gap: 2 levels (CAPI Operation)
          </p>
        </div>

        {/* Card 3: Learning In-Progress */}
        <div className="rounded-2xl bg-white p-5 shadow-card transition-all hover:shadow-card-hover">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Learning Progress</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#555934]/12 px-2 py-0.5 text-[10px] font-bold text-[#555934]">
              <Flame className="h-3 w-3 fill-[#555934] text-[#555934]" />
              5-Day Streak
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-[#2d1f17]">18.5</span>
            <span className="text-xs text-muted-foreground">hours logged</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            1 active course • 66% completed
          </p>
        </div>

        {/* Card 4: Assessment & Karma */}
        <div className="rounded-2xl bg-white p-5 shadow-card transition-all hover:shadow-card-hover">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">APAR Milestone</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#BF9B7A]/20 px-2 py-0.5 text-[10px] font-bold text-[#593E2E]">
              On Track
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-[#2d1f17]">1,275</span>
            <span className="text-xs text-muted-foreground">Karma Points</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            6 of 8 assessments completed
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          3. WORKFORCE READINESS & COMPETENCY INTELLIGENCE (RADAR + DIAGNOSTICS)
          ════════════════════════════════════════════════════════════════ */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col (4 cols): Workforce Readiness Deep-Dive */}
        <div className="lg:col-span-4 flex flex-col justify-between rounded-2xl bg-white p-6 shadow-card">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-[#2d1f17]">
                {t('dashboard.workforceOverview')}
              </h2>
              <ProvenanceBadge provenance="PROPOSED_FRAMEWORK" showLabel={false} size="sm" />
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed mb-6">
              Computed by comparing your assessment-verified proficiency against mandated Subordinate Statistical Service standards.
            </p>

            <div className="flex justify-center my-4">
              <ProgressRing
                value={readinessIndex}
                size={160}
                strokeWidth={12}
                label="Readiness"
                sublabel="2 of 5 competencies met"
                trendDelta="+8% vs last cycle"
                color={
                  readinessIndex >= 80
                    ? 'text-[#555934]'
                    : readinessIndex >= 50
                    ? 'text-[#BF9B7A]'
                    : 'text-[#8C5B3E]'
                }
              />
            </div>
          </div>

          <div className="pt-4 space-y-2 text-xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span>National Cadre Average</span>
              <span className="font-mono font-semibold text-[#2d1f17]">68%</span>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Next Threshold Target</span>
              <span className="font-mono font-semibold text-[#555934]">60% (Moderate)</span>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>APAR Verification Status</span>
              <span className="font-semibold text-[#555934]">Self + Test Verified</span>
            </div>
          </div>
        </div>

        {/* Right Col (8 cols): Competency Radar & Diagnostics */}
        <div className="lg:col-span-8 rounded-2xl bg-white p-6 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
            <div>
              <h2 className="text-base font-bold text-[#2d1f17]">
                {t('dashboard.competencyDiagnostics')}
              </h2>
              <p className="text-xs text-muted-foreground">
                Current proficiency (olive solid) vs. Role target requirement (tan dashed)
              </p>
            </div>
            <Link
              href="/skill-gap"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#555934] hover:text-[#3e4225] transition-colors"
            >
              {t('dashboard.viewAllGaps')}
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Interactive Radar */}
            <div className="md:col-span-7 flex justify-center">
              {radarData.length > 0 && (
                <RadarChart data={radarData} size={310} showLegend={true} />
              )}
            </div>

            {/* Diagnostic Highlights */}
            <div className="md:col-span-5 space-y-4 pt-4 md:pt-0 md:pl-6">
              {/* Strongest Skills */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#555934] flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-[#555934]" />
                  {t('dashboard.strongestSkills')}
                </span>
                <div className="rounded-xl bg-[#555934]/10 p-3 text-xs space-y-1">
                  <div className="flex items-center justify-between font-semibold text-[#2d1f17]">
                    <span>NSSO Protocol Mastery</span>
                    <span className="font-mono text-[#555934]">L3 / L3 ✓</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Fully satisfies autonomous execution standards for PLFS.
                  </p>
                </div>
              </div>

              {/* Critical Attention Required */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C5B3E] flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-[#8C5B3E]" />
                  {t('dashboard.criticalAttention')}
                </span>
                <div className="rounded-xl bg-[#8C5B3E]/12 p-3 text-xs space-y-1">
                  <div className="flex items-center justify-between font-semibold text-[#2d1f17]">
                    <span>CAPI Tablet Operation</span>
                    <span className="font-mono text-[#8C5B3E]">L2 → L4 (Gap: 2)</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Direct impact on schedule submission latency and GPS scrutiny.
                  </p>
                </div>
              </div>

              {/* Learning Next Step */}
              <div className="rounded-xl bg-[#F2E6D8]/60 p-3 text-xs">
                <p className="text-[11px] font-medium text-[#2d1f17]">
                  💡 <strong>Next Recommended Step:</strong> Complete Module 4 of your active CAPI course to close 50% of this gap.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          4. ACTIONABLE TOP COMPETENCY GAPS + CONTINUE LEARNING ROW
          ════════════════════════════════════════════════════════════════ */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col (8 cols): Top Actionable Skill Gaps */}
        <div className="lg:col-span-8 rounded-2xl bg-white p-6 shadow-card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-[#2d1f17]">
                {t('dashboard.topGaps')}
              </h2>
              <p className="text-xs text-muted-foreground">
                Ranked by institutional severity and impact on field survey reliability
              </p>
            </div>
            <Link
              href="/skill-gap"
              className="text-xs font-semibold text-[#555934] hover:underline"
            >
              {t('dashboard.viewAllGaps')} →
            </Link>
          </div>

          <div className="space-y-3.5">
            {topGaps.map((gap) => {
              const isHigh = gap.severity === 'HIGH';
              return (
                <div
                  key={gap.competencyId}
                  className="rounded-xl bg-[#F2E6D8]/25 p-4.5 transition-all duration-200 hover:bg-[#F2E6D8]/45 hover:shadow-subtle"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-bold text-[#2d1f17]">
                          {gap.competencyName}
                        </h3>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            isHigh
                              ? 'bg-[#8C5B3E]/12 text-[#8C5B3E]'
                              : 'bg-[#BF9B7A]/20 text-[#593E2E]'
                          }`}
                        >
                          {gap.priority}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Activity: <span className="text-[#2d1f17] font-medium">{gap.activity}</span>
                      </p>
                    </div>

                    {/* Level Stepper Representation */}
                    <div className="flex items-center gap-1.5 bg-[#F2E6D8]/60 px-3 py-1.5 rounded-full text-xs font-mono shrink-0">
                      <span className="text-muted-foreground">Current:</span>
                      <span className="font-bold text-[#2d1f17] bg-white px-2 py-0.5 rounded-full shadow-2xs">
                        L{gap.currentLevel}
                      </span>
                      <span className="text-muted-foreground">→</span>
                      <span className="text-muted-foreground">Target:</span>
                      <span className="font-bold text-[#555934] bg-white px-2 py-0.5 rounded-full shadow-2xs">
                        L{gap.targetLevel}
                      </span>
                      <span className="ml-1 text-[11px] font-bold text-[#8C5B3E]">
                        (-{gap.gap} lvls)
                      </span>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <BookOpen className="h-3 w-3 text-[#555934]" />
                      Course:{' '}
                      <span className="font-medium text-[#2d1f17] truncate max-w-xs sm:max-w-md">
                        {gap.recommendedCourseTitle}
                      </span>
                    </p>

                    <div className="flex items-center gap-2">
                      <Link
                        href="/pathways"
                        className="inline-flex items-center gap-1 rounded-lg bg-[#555934] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#3e4225] transition-colors shadow-2xs"
                      >
                        Learn Path
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                      <Link
                        href="/assessment/problem-solving/instructions"
                        className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-[#2d1f17] hover:bg-[#F2E6D8] transition-colors shadow-2xs"
                      >
                        <PlayCircle className="h-3 w-3 text-[#555934]" />
                        Assess
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col (4 cols): Continue Learning & Streak Widget */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="rounded-2xl bg-white p-6 shadow-card flex-1">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#555934] flex items-center gap-1.5">
                <PlayCircle className="h-4 w-4 text-[#555934]" />
                {t('dashboard.continueLearning')}
              </span>
              <span className="text-[10px] font-mono font-semibold text-muted-foreground">
                In Progress
              </span>
            </div>

            <CourseCard course={activeCourse} variant="in-progress" />

            <div className="mt-4 pt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Next Milestone</span>
              <span className="font-semibold text-[#2d1f17]">Module 4 Quiz</span>
            </div>
          </div>

          {/* Quick Assessment Launchpad */}
          <div className="rounded-2xl bg-[#555934]/8 p-6 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-[#555934]" />
              <h3 className="text-sm font-bold text-[#2d1f17]">
                Role Readiness Assessment
              </h3>
            </div>
            <p className="text-xs text-[#705849] leading-relaxed mb-4">
              Validate your recent learning gains in Problem Solving & CAPI Scrutiny. Completing this unlocks Level 3 certification.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-mono">10 Questions • 5 Mins</span>
              <Link
                href="/assessment/problem-solving/instructions"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#555934] px-3.5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#3e4225] transition-colors"
              >
                Take Assessment
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          5. DEDICATED PROFESSIONAL LEARNING SECTION ("RECOMMENDED FOR YOU")
          ════════════════════════════════════════════════════════════════ */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-[#2d1f17]">
                {t('dashboard.recommendedCourses')}
              </h2>
              <span className="rounded-full bg-[#555934]/12 px-3 py-0.5 text-xs font-bold text-[#555934] font-mono">
                {filteredCourses.length} Courses
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('dashboard.recommendedCoursesDesc')}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#F2E6D8]/50 p-1.5 rounded-2xl shadow-2xs">
            <button
              onClick={() => setSelectedCourseTab('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-xl transition-all ${
                selectedCourseTab === 'all'
                  ? 'bg-[#555934] text-white shadow-2xs'
                  : 'text-muted-foreground hover:text-[#2d1f17]'
              }`}
            >
              {t('dashboard.allRecommended')}
            </button>
            <button
              onClick={() => setSelectedCourseTab('critical')}
              className={`px-3 py-1 text-xs font-semibold rounded-xl transition-all ${
                selectedCourseTab === 'critical'
                  ? 'bg-[#555934] text-white shadow-2xs'
                  : 'text-muted-foreground hover:text-[#2d1f17]'
              }`}
            >
              {t('dashboard.criticalGapsOnly')}
            </button>
            <button
              onClick={() => setSelectedCourseTab('applied')}
              className={`px-3 py-1 text-xs font-semibold rounded-xl transition-all ${
                selectedCourseTab === 'applied'
                  ? 'bg-[#555934] text-white shadow-2xs'
                  : 'text-muted-foreground hover:text-[#2d1f17]'
              }`}
            >
              {t('dashboard.applied')}
            </button>
            <button
              onClick={() => setSelectedCourseTab('foundational')}
              className={`px-3 py-1 text-xs font-semibold rounded-xl transition-all ${
                selectedCourseTab === 'foundational'
                  ? 'bg-[#555934] text-white shadow-2xs'
                  : 'text-muted-foreground hover:text-[#2d1f17]'
              }`}
            >
              {t('dashboard.foundational')}
            </button>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} variant="standard" />
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          6. PERSONALIZED UPSKILLING PIPELINE (HOW IT CONNECTS)
          ════════════════════════════════════════════════════════════════ */}
      <section className="rounded-2xl bg-white p-6 sm:p-8 shadow-card">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-[#555934]" />
            <h2 className="text-base font-bold text-[#2d1f17]">
              {t('dashboard.learningPipeline')} — How Competency Gaps Close
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">
            The end-to-end pathway from diagnosed field deficiency to official APAR verification
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative">
          {[
            {
              step: '01',
              title: 'Gap Diagnosis',
              desc: 'Identified CAPI Operation gap (-2 levels) from self & supervisor rating.',
              color: 'bg-[#8C5B3E]/12 text-[#8C5B3E]',
            },
            {
              step: '02',
              title: 'Targeted Course',
              desc: 'Matched with official iGOT Karmayogi Advanced CAPI module (4 hours).',
              color: 'bg-[#F2E6D8]/60 text-[#2d1f17]',
            },
            {
              step: '03',
              title: 'Module Execution',
              desc: 'Active progress at 66% with real CAPI simulator GPS scenarios.',
              color: 'bg-[#555934]/12 text-[#555934]',
            },
            {
              step: '04',
              title: 'Micro-Assessment',
              desc: '10-question standardized MCQ test evaluated by consensus engine.',
              color: 'bg-[#F2E6D8]/60 text-[#2d1f17]',
            },
            {
              step: '05',
              title: 'Verified Readiness',
              desc: 'Score updates to Level 4; readiness index rises from 40% to 52%.',
              color: 'bg-[#555934]/18 text-[#555934]',
            },
          ].map((item) => (
            <div
              key={item.step}
              className={`rounded-2xl p-4 text-xs transition-all hover:shadow-subtle ${item.color}`}
            >
              <span className="font-mono text-[10px] font-bold opacity-60">STEP {item.step}</span>
              <h3 className="font-bold text-sm mt-1 mb-1.5">{item.title}</h3>
              <p className="text-[11px] leading-relaxed opacity-80">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          7. RECENT ACTIVITY & RECOMMENDED ACTIONS
          ════════════════════════════════════════════════════════════════ */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col (7 cols): Recent Activity Feed */}
        <div className="lg:col-span-7 rounded-2xl bg-white p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-[#2d1f17]">
              {t('dashboard.recentActivity')}
            </h2>
            <span className="text-xs text-muted-foreground font-mono">Last 7 days</span>
          </div>

          <div className="divide-y divide-[#F2E6D8]">
            {[
              {
                title: 'Completed Module 3: GPS Tagging in CAPI',
                time: 'Yesterday at 4:30 PM',
                badge: '+50 Karma',
                icon: <CheckCircle2 className="h-4 w-4 text-[#555934]" />,
              },
              {
                title: 'Scored 80% on Problem Solving Assessment',
                time: '2 days ago',
                badge: 'Proficient',
                icon: <Award className="h-4 w-4 text-[#BF9B7A]" />,
              },
              {
                title: 'Competency "NSSO Protocol Mastery" advanced to Level 3',
                time: '4 days ago',
                badge: 'Verified',
                icon: <TrendingUp className="h-4 w-4 text-[#555934]" />,
              },
              {
                title: 'Assigned Priority Training: CAPI Synchronization',
                time: '6 days ago',
                badge: 'Institutional Flag',
                icon: <AlertTriangle className="h-4 w-4 text-[#8C5B3E]" />,
              },
            ].map((activity, idx) => (
              <div key={idx} className="py-3 flex items-start justify-between gap-3 first:pt-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">{activity.icon}</div>
                  <div>
                    <p className="text-xs font-semibold text-[#2d1f17]">{activity.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{activity.time}</p>
                  </div>
                </div>
                <span className="rounded-full bg-[#F2E6D8] px-2.5 py-0.5 text-[10px] font-mono font-semibold text-[#2d1f17] shrink-0">
                  {activity.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col (5 cols): Quick Action Shortcuts */}
        <div className="lg:col-span-5 rounded-2xl bg-white p-6 shadow-card flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-[#2d1f17] mb-4">
              {t('dashboard.nextActions')}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/pathways"
                className="rounded-xl bg-[#F2E6D8]/45 p-4 transition-all hover:bg-[#F2E6D8]/75 hover:shadow-2xs"
              >
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="h-4 w-4 text-[#555934]" />
                  <span className="font-semibold text-xs text-[#2d1f17]">Explore Courses</span>
                </div>
                <p className="text-[11px] text-muted-foreground">Browse all verified pathways</p>
              </Link>

              <Link
                href="/skill-gap"
                className="rounded-xl bg-[#F2E6D8]/45 p-4 transition-all hover:bg-[#F2E6D8]/75 hover:shadow-2xs"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-4 w-4 text-[#BF9B7A]" />
                  <span className="font-semibold text-xs text-[#2d1f17]">Skill Gaps</span>
                </div>
                <p className="text-[11px] text-muted-foreground">In-depth delta analysis</p>
              </Link>

              <Link
                href="/assignments"
                className="rounded-xl bg-[#F2E6D8]/45 p-4 transition-all hover:bg-[#F2E6D8]/75 hover:shadow-2xs"
              >
                <div className="flex items-center gap-2 mb-1">
                  <PlayCircle className="h-4 w-4 text-[#555934]" />
                  <span className="font-semibold text-xs text-[#2d1f17]">All Assessments</span>
                </div>
                <p className="text-[11px] text-muted-foreground">4 standardized evaluations</p>
              </Link>

              <Link
                href="/profile"
                className="rounded-xl bg-[#F2E6D8]/45 p-4 transition-all hover:bg-[#F2E6D8]/75 hover:shadow-2xs"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Award className="h-4 w-4 text-[#BF9B7A]" />
                  <span className="font-semibold text-xs text-[#2d1f17]">APAR Profile</span>
                </div>
                <p className="text-[11px] text-muted-foreground">Karma points & records</p>
              </Link>
            </div>
          </div>

          {/* Institutional Trust Notice */}
          <div className="mt-4 pt-3 flex items-start gap-2.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-[#555934] shrink-0 mt-0.5" />
            <p className="leading-tight">
              Grounded in the National Statistical Commission guidelines and Mission Karmayogi FRAC standards.
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          8. DATA PROVENANCE FOOTER
          ════════════════════════════════════════════════════════════════ */}
      <div className="rounded-2xl bg-white/70 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-muted-foreground shadow-card">
        <div className="flex items-center gap-2">
          <ProvenanceBadge provenance="SYNTHETIC_DEMO_DATA" showLabel={true} size="sm" />
          <span>
            Demonstration environment calibrated with NSS 79th Round benchmark data.
          </span>
        </div>
        <span className="font-mono text-[11px]">
          {t('dashboard.lastUpdated')}: {new Date().toLocaleDateString(locale === 'hi' ? 'hi-IN' : 'en-IN')}
        </span>
      </div>
    </div>
  );
}
