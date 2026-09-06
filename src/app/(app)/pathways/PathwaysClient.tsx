'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ProvenanceBadge } from '@/components/ProvenanceBadge';
import { rankCoursesForGaps } from '@/services/recommendationService';
import { getPersonaFRAC } from '@/data/fracCadres';
import { CompetencyService } from '@/services/competencyService';
import type { CompetencyGap } from '@/lib/types';
import type { AppUser } from '@/lib/auth';

interface RecommendedCourse {
  id: string;
  title: string;
  title_hi?: string;
  provider: string;
  duration: string;
  description: string;
  description_hi?: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  targetCompetencies: string[];
  whyRecommended: string;
  whyRecommended_hi?: string;
  competencyGaps: {
    competency: string;
    currentLevel: number;
    targetLevel: number;
    gap: number;
  }[];
  courseId?: string;
  iGotLink?: string;
}

interface PathwaysData {
  pathways: RecommendedCourse[];
  readinessIndex: number;
  totalGaps: number;
}

function CourseCard({ course }: { course: RecommendedCourse }) {
  const priorityColors = {
    HIGH: 'bg-[#8C5B3E]/12 text-[#8C5B3E]',
    MEDIUM: 'bg-[#BF9B7A]/20 text-[#593E2E]',
    LOW: 'bg-[#555934]/12 text-[#555934]',
  };

  const priorityLabels = {
    HIGH: '🔥 High Priority',
    MEDIUM: '⚡ Medium Priority',
    LOW: '✅ Low Priority',
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-card hover:shadow-card-hover transition-all group">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-[#555934] transition-colors">
              {course.title}
            </h3>
            <ProvenanceBadge provenance="SYNTHETIC_DEMO_DATA" showLabel={false} size="sm" />
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
            <span className="font-medium">{course.provider}</span>
            <span className="text-slate-400">•</span>
            <span>{course.duration}</span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColors[course.priority]}`}>
          {priorityLabels[course.priority]}
        </span>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-foreground mb-2">Why This Course</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {course.whyRecommended}
        </p>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-foreground mb-2">
          Targets {course.targetCompetencies.length} Competency {course.targetCompetencies.length === 1 ? 'Gap' : 'Gaps'}:
        </h4>
        <div className="flex flex-wrap gap-2">
          {course.targetCompetencies.map((comp, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-full bg-[#BF9B7A]/15 text-xs font-medium text-[#593E2E]"
            >
              {comp}
            </span>
          ))}
        </div>
      </div>

      {course.competencyGaps && course.competencyGaps.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-foreground mb-2">
            Specific Gaps Addressed:
          </h4>
          <div className="space-y-2">
            {course.competencyGaps.map((gap, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm bg-[#F2E6D8]/50 rounded-xl p-3">
                <span className="font-medium text-foreground">{gap.competency}</span>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Current: L{gap.currentLevel}</span>
                  <span className="text-slate-400">→</span>
                  <span className="font-bold text-[#555934]">L{gap.targetLevel}</span>
                  <span className="text-muted-foreground ml-1">({gap.gap} level{gap.gap === 1 ? '' : 's'})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-[#555934]"></span>
          <span>Live integration with iGOT Karmayogi</span>
        </div>
        <a
          href={course.iGotLink || "#"}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#555934] hover:bg-[#3e4225] text-white text-sm font-semibold rounded-xl transition-all shadow-xs active:scale-95"
        >
          View Course
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </a>
      </div>
    </div>
  );
}

function buildPersonaPathwaysData(user?: AppUser | null): PathwaysData {
  const profile = getPersonaFRAC(user);
  const isHindi = user?.user_metadata?.preferred_language === 'hi' || profile.preferredLanguage === 'hi';

  const gaps: CompetencyGap[] = profile.competencies.map((comp) => {
    const gap = Math.max(0, comp.targetLevel - comp.currentLevel);
    const severityScore = CompetencyService.computeGapSeverity(comp.currentLevel, comp.targetLevel, comp.priority);
    const severity = CompetencyService.classifySeverity(severityScore);

    return {
      competencyId: comp.id,
      competency: {
        id: comp.id,
        name: isHindi ? comp.name_hi : comp.name,
        name_hi: comp.name_hi,
        category: comp.category,
        description: isHindi ? comp.description_hi : comp.description,
        description_hi: comp.description_hi,
        levels: comp.levels,
        provenance: comp.provenance,
        created_at: new Date().toISOString(),
      },
      activity: {
        id: `act-${comp.id}`,
        name: isHindi ? comp.activityName_hi : comp.activityName,
        name_hi: comp.activityName_hi,
        description: comp.description,
        role_id: profile.personaId,
        provenance: comp.provenance,
        created_at: new Date().toISOString(),
      },
      currentLevel: comp.currentLevel,
      targetLevel: comp.targetLevel,
      gap,
      priority: comp.priority,
      severity,
      evidenceType: comp.evidenceType,
    };
  });

  const ranked = rankCoursesForGaps(gaps);

  const pathways: RecommendedCourse[] = ranked.map((r) => ({
    id: r.course.id,
    title: isHindi && r.course.title_hi ? r.course.title_hi : r.course.title,
    title_hi: r.course.title_hi,
    provider: r.course.provider,
    duration: r.course.duration,
    description: isHindi && r.course.description_hi ? r.course.description_hi : r.course.description,
    description_hi: r.course.description_hi,
    priority: r.priority,
    targetCompetencies: r.course.targetCompetencies.map(
      (cId) => gaps.find((g) => g.competencyId === cId)?.competency.name || cId
    ),
    whyRecommended: isHindi && r.whyRecommended_hi ? r.whyRecommended_hi : r.whyRecommended,
    whyRecommended_hi: r.whyRecommended_hi,
    competencyGaps: r.matchingGaps.map((mg) => ({
      competency: mg.competencyName,
      currentLevel: mg.currentLevel,
      targetLevel: mg.targetLevel,
      gap: mg.gap,
    })),
    courseId: r.course.courseId,
    iGotLink: r.course.iGotLink,
  }));

  const userRecords = new Map(profile.competencies.map((c) => [c.id, c.currentLevel]));
  const required = profile.competencies.map((c) => ({ competencyId: c.id, targetLevel: c.targetLevel }));
  const readinessIndex = CompetencyService.computeReadinessIndex(required, userRecords);

  return {
    pathways,
    readinessIndex,
    totalGaps: gaps.filter((g) => g.gap > 0).length,
  };
}

export default function PathwaysClient({ user }: { user?: AppUser | null }) {
  const t = useTranslations();
  const [data] = useState<PathwaysData>(() => buildPersonaPathwaysData(user));
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No pathways available</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          {t('pathways.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('pathways.subtitle')}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Readiness Card */}
        <div className="rounded-2xl bg-white p-6 shadow-card hover:shadow-card-hover transition-all">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Overall Readiness
          </h3>
          <div className="text-3xl font-bold text-[#555934] mb-1 font-mono">
            {data.readinessIndex}%
          </div>
          <p className="text-xs text-muted-foreground">
            {data.readinessIndex >= 80
              ? 'Excellent! Most competencies met'
              : data.readinessIndex >= 50
              ? 'Good progress, some gaps remain'
              : 'Significant gaps need attention'
            }
          </p>
        </div>

        {/* Gaps Card */}
        <div className="rounded-2xl bg-white p-6 shadow-card hover:shadow-card-hover transition-all">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Total Competency Gaps
          </h3>
          <div className="text-3xl font-bold text-[#8C5B3E] mb-1 font-mono">
            {data.totalGaps}
          </div>
          <p className="text-xs text-muted-foreground">
            {data.totalGaps === 1
              ? 'One level needs improvement'
              : data.totalGaps <= 3
              ? 'Few gaps identified'
              : 'Multiple gaps require attention'
            }
          </p>
        </div>

        {/* Priority Courses Card */}
        <div className="rounded-2xl bg-white p-6 shadow-card hover:shadow-card-hover transition-all">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Recommended Courses
          </h3>
          <div className="text-3xl font-bold text-[#593E2E] mb-1 font-mono">
            {data.pathways.filter(c => c.priority === 'HIGH').length}
          </div>
          <p className="text-xs text-muted-foreground">
            High-priority courses matching your gaps
          </p>
        </div>
      </div>

      {/* Course Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            Recommended Learning Pathways
          </h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Integration:</span>
            <ProvenanceBadge provenance="SYNTHETIC_DEMO_DATA" showLabel={true} size="sm" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data.pathways.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>

      {/* Expandable Course Details */}
      {selectedCourse && data.pathways.find(c => c.id === selectedCourse) && (
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Course Details
          </h3>
          {/* Course details would go here */}
          <button
            onClick={() => setSelectedCourse(null)}
            className="text-sm text-primary hover:underline"
          >
            Show all courses
          </button>
        </div>
      )}
    </div>
  );
}
