'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Link from 'next/link';
import { PlayCircle } from 'lucide-react';
import { RadarChart, type RadarDataPoint } from '@/components/RadarChart';
import { ProvenanceBadge } from '@/components/ProvenanceBadge';
import { CompetencyService } from '@/services/competencyService';
import { getPersonaFRAC } from '@/data/fracCadres';
import type { CompetencyGap } from '@/lib/types';
import type { AppUser } from '@/lib/auth';

interface GapCardProps {
  gap: CompetencyGap;
}

function GapCard({ gap }: GapCardProps) {
  const severityColors = {
    HIGH: 'text-rose-700 text-rose-600 bg-rose-50 bg-rose-50 border-rose-200 border-rose-200',
    MODERATE: 'text-amber-700 text-amber-600 bg-amber-50 bg-amber-50 border-amber-200 border-amber-200',
    PROFICIENT: 'text-emerald-700 text-emerald-600 bg-emerald-50 bg-emerald-50 border-emerald-200 border-emerald-200',
  };

  return (
    <div className={`rounded-lg border p-5 transition-all hover:shadow-md ${severityColors[gap.severity]}`}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">
              {gap.competency.name}
            </h3>
            <ProvenanceBadge provenance={gap.competency.provenance} showLabel={false} size="sm" />
          </div>
          <p className="text-sm text-gray-500 mb-2">
            Activity: {gap.activity.name}
          </p>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-white/50">
            {gap.severity === 'HIGH' && '🔴 Critical'}
            {gap.severity === 'MODERATE' && '🟡 Moderate'}
            {gap.severity === 'PROFICIENT' && '🟢 Proficient'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
        <div>
          <p className="text-xs text-gray-9000 uppercase mb-1">Current</p>
          <p className="font-bold text-gray-900">L{gap.currentLevel}</p>
        </div>
        <div>
          <p className="text-xs text-gray-9000 uppercase mb-1">Target</p>
          <p className="font-bold text-gray-900">L{gap.targetLevel}</p>
        </div>
        <div>
          <p className="text-xs text-gray-9000 uppercase mb-1">Priority</p>
          <p className="font-semibold text-gray-900 capitalize">
            {gap.priority.charAt(0).toUpperCase() + gap.priority.slice(1)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-9000 uppercase mb-1">Gap Severity</p>
          <p className="font-mono font-bold text-gray-900">
            {CompetencyService.computeGapSeverity(gap.currentLevel, gap.targetLevel, gap.priority)}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Why This Matters</h4>
        <p className="text-sm text-gray-500 leading-relaxed">
          {gap.evidenceType === 'assessment-verified'
            ? `Your ${gap.activity.name} performance assessment showed ${gap.currentLevel}, requiring Level ${gap.targetLevel} for optimal ${gap.activity.name} effectiveness.`
            : `Based on self-assessment, you need to develop ${gap.competency.name} to meet ${gap.activity.name} requirements at Level ${gap.targetLevel}.`
          }
        </p>
        <div className="flex items-center justify-between mt-2 pt-2 border-black/5">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="px-2 py-1 rounded bg-gray-100">
              Category: {gap.competency.category}
            </span>
            {gap.evidenceType === 'assessment-verified' ? (
              <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-600">
                Verified
              </span>
            ) : (
              <span className="px-2 py-1 rounded bg-blue-50 text-blue-600">
                Self-Assessed
              </span>
            )}
          </div>
          <Link
            href={`/assessment/${gap.competencyId}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-blue-700 bg-blue-50 hover:bg-blue-100 font-semibold rounded-md transition-colors"
          >
            <PlayCircle className="h-3.5 w-3.5" />
            Take Assessment
          </Link>
        </div>
      </div>
    </div>
  );
}

function buildPersonaGapsAndRadar(user?: AppUser | null): { gaps: CompetencyGap[]; radarData: RadarDataPoint[] } {
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

  // Sort gaps by severity score descending (PRD §4.1 formula)
  const sortedGaps = [...gaps].sort((a, b) => {
    const scoreA = CompetencyService.computeGapSeverity(a.currentLevel, a.targetLevel, a.priority);
    const scoreB = CompetencyService.computeGapSeverity(b.currentLevel, b.targetLevel, b.priority);
    return scoreB - scoreA;
  });

  const radar: RadarDataPoint[] = profile.competencies.map((c) => ({
    label: (isHindi ? c.name_hi : c.name).split(' ').slice(0, 2).join(' '),
    current: c.currentLevel,
    target: c.targetLevel,
  }));

  return { gaps: sortedGaps, radarData: radar };
}

export default function SkillGapClient({ user }: { user?: AppUser | null }) {
  const t = useTranslations();
  const [{ gaps, radarData }] = useState(() => buildPersonaGapsAndRadar(user));
  const [filter, setFilter] = useState<'all' | 'HIGH' | 'MODERATE' | 'PROFICIENT'>('all');

  const filteredGaps = gaps.filter(gap => filter === 'all' || gap.severity === filter);

  const getSeverityCount = (severity: 'HIGH' | 'MODERATE' | 'PROFICIENT') => {
    return gaps.filter(g => g.severity === severity).length;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          {t('skillGap.title')}
        </h1>
        <p className="text-gray-500">
          {t('skillGap.subtitle')}
        </p>
      </div>

      {/* Radar Chart */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Competency Radar — Current vs Required Levels
        </h2>
          <div className="flex justify-center">
            <RadarChart data={radarData} size={450} showLegend />
          </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-gray-700">
            Filter by severity:
          </span>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-700 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All ({gaps.length})
          </button>
          <button
            onClick={() => setFilter('HIGH')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'HIGH'
                ? 'bg-rose-600 text-white'
                : 'bg-white text-rose-700 hover:bg-rose-50'
            }`}
          >
            🔴 High ({getSeverityCount('HIGH')})
          </button>
          <button
            onClick={() => setFilter('MODERATE')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'MODERATE'
                ? 'bg-amber-600 text-white'
                : 'bg-white text-amber-700 hover:bg-amber-50'
            }`}
          >
            🟡 Moderate ({getSeverityCount('MODERATE')})
          </button>
          <button
            onClick={() => setFilter('PROFICIENT')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'PROFICIENT'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            🟢 Proficient ({getSeverityCount('PROFICIENT')})
          </button>
        </div>
      </div>

      {/* Gap Cards */}
      <div className="space-y-4">
        {filteredGaps.map((gap) => (
          <GapCard key={gap.competencyId} gap={gap} />
        ))}
      </div>

      {/* Empty State */}
      {filteredGaps.length === 0 && (
        <div className="text-center py-12 rounded-lg border border-gray-200 bg-white">
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No gaps in this category
          </h3>
          <p className="text-gray-500">
            All competencies are at or above target level for this filter.
          </p>
        </div>
      )}
    </div>
  );
}
