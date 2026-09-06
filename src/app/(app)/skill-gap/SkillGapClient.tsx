'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Link from 'next/link';
import { PlayCircle } from 'lucide-react';
import { RadarChart, type RadarDataPoint } from '@/components/RadarChart';
import { ProvenanceBadge } from '@/components/ProvenanceBadge';
import { CompetencyService } from '@/services/competencyService';
import type { CompetencyGap } from '@/lib/types';

interface GapCardProps {
  gap: CompetencyGap;
}

function GapCard({ gap }: GapCardProps) {
  const severityPillColors = {
    HIGH: 'text-[#8C5B3E] bg-[#8C5B3E]/12',
    MODERATE: 'text-[#593E2E] bg-[#BF9B7A]/20',
    PROFICIENT: 'text-[#555934] bg-[#555934]/12',
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-card transition-all hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-[#2d1f17]">
              {gap.competency.name}
            </h3>
            <ProvenanceBadge provenance={gap.competency.provenance} showLabel={false} size="sm" />
          </div>
          <p className="text-sm text-[#705849] mb-2">
            Activity: {gap.activity.name}
          </p>
        </div>
        <div className="text-right">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${severityPillColors[gap.severity]}`}>
            {gap.severity === 'HIGH' && '🔴 Critical'}
            {gap.severity === 'MODERATE' && '🟡 Moderate'}
            {gap.severity === 'PROFICIENT' && '🟢 Proficient'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm bg-[#F2E6D8]/30 p-4 rounded-xl">
        <div>
          <p className="text-xs text-[#705849] uppercase mb-1">Current</p>
          <p className="font-bold text-[#2d1f17]">L{gap.currentLevel}</p>
        </div>
        <div>
          <p className="text-xs text-[#705849] uppercase mb-1">Target</p>
          <p className="font-bold text-[#2d1f17]">L{gap.targetLevel}</p>
        </div>
        <div>
          <p className="text-xs text-[#705849] uppercase mb-1">Priority</p>
          <p className="font-semibold text-[#2d1f17] capitalize">
            {gap.priority.charAt(0).toUpperCase() + gap.priority.slice(1)}
          </p>
        </div>
        <div>
          <p className="text-xs text-[#705849] uppercase mb-1">Gap Severity</p>
          <p className="font-mono font-bold text-[#2d1f17]">
            {CompetencyService.computeGapSeverity(gap.currentLevel, gap.targetLevel, gap.priority)}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-[#2d1f17]">Why This Matters</h4>
        <p className="text-sm text-[#705849] leading-relaxed">
          {gap.evidenceType === 'assessment-verified'
            ? `Your ${gap.activity.name} performance assessment showed ${gap.currentLevel}, requiring Level ${gap.targetLevel} for optimal ${gap.activity.name} effectiveness.`
            : `Based on self-assessment, you need to develop ${gap.competency.name} to meet ${gap.activity.name} requirements at Level ${gap.targetLevel}.`
          }
        </p>
        <div className="flex items-center justify-between mt-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-[#705849]">
            <span className="px-2.5 py-1 rounded-full bg-[#F2E6D8] text-[#2d1f17]">
              Category: {gap.competency.category}
            </span>
            {gap.evidenceType === 'assessment-verified' ? (
              <span className="px-2.5 py-1 rounded-full bg-[#555934]/12 text-[#555934] font-medium">
                Verified
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-[#BF9B7A]/20 text-[#593E2E] font-medium">
                Self-Assessed
              </span>
            )}
          </div>
          <Link
            href={`/assessment/${gap.competencyId}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs text-white bg-[#555934] hover:bg-[#3e4225] font-semibold rounded-xl transition-colors shadow-2xs"
          >
            <PlayCircle className="h-3.5 w-3.5" />
            Take Assessment
          </Link>
        </div>
      </div>
    </div>
  );
}

function getDemoGapsAndRadar(): { gaps: CompetencyGap[]; radarData: RadarDataPoint[] } {
  // Demo data that matches the FRAC domain model and CompetencyService logic
  const demoGaps: CompetencyGap[] = [
    {
      competencyId: 'comp-capi',
      competency: {
        id: 'comp-capi',
        name: 'CAPI Tablet Operation',
        name_hi: 'कैपी टैबलेट संचालन',
        category: 'Domain',
        levels: { L1: '', L2: '', L3: '', L4: '', L5: '' },
        provenance: 'PROPOSED_FRAMEWORK',
        created_at: new Date().toISOString(),
      },
      activity: {
        id: 'act-fh',
        name: 'Household Listing & Census Enumeration',
        name_hi: 'परिवार सूचीकरण & जनगणना गणना',
        role_id: 'role-field-investigator',
        provenance: 'PROPOSED_FRAMEWORK',
        created_at: new Date().toISOString(),
      },
      currentLevel: 2,
      targetLevel: 4,
      gap: 2,
      priority: 'critical',
      severity: 'HIGH',
      evidenceType: 'assessment-verified',
    },
    {
      competencyId: 'comp-survey',
      competency: {
        id: 'comp-survey',
        name: 'Survey Sampling & Design',
        name_hi: 'सर्वेक्षण नमूनाकरण & डिजाइन',
        category: 'Functional',
        levels: { L1: '', L2: '', L3: '', L4: '', L5: '' },
        provenance: 'PROPOSED_FRAMEWORK',
        created_at: new Date().toISOString(),
      },
      activity: {
        id: 'act-fh',
        name: 'Household Listing & Census Enumeration',
        name_hi: 'परिवार सूचीकरण & जनगणना गणना',
        role_id: 'role-field-investigator',
        provenance: 'PROPOSED_FRAMEWORK',
        created_at: new Date().toISOString(),
      },
      currentLevel: 1,
      targetLevel: 3,
      gap: 2,
      priority: 'important',
      severity: 'HIGH',
      evidenceType: 'self-assessed',
    },
    {
      competencyId: 'comp-data',
      competency: {
        id: 'comp-data',
        name: 'Data Entry & Scrutiny',
        name_hi: 'डेटा प्रविष्टि & संवीक्षा',
        category: 'Functional',
        levels: { L1: '', L2: '', L3: '', L4: '', L5: '' },
        provenance: 'PROPOSED_FRAMEWORK',
        created_at: new Date().toISOString(),
      },
      activity: {
        id: 'act-se',
        name: 'Socio-Economic Survey Execution',
        name_hi: 'सामाजिक-आर्थिक सर्वेक्षण निष्पादन',
        role_id: 'role-field-investigator',
        provenance: 'PROPOSED_FRAMEWORK',
        created_at: new Date().toISOString(),
      },
      currentLevel: 1,
      targetLevel: 3,
      gap: 2,
      priority: 'important',
      severity: 'HIGH',
      evidenceType: 'assessment-verified',
    },
    {
      competencyId: 'comp-nsso',
      competency: {
        id: 'comp-nsso',
        name: 'NSSO Protocol Mastery',
        name_hi: 'एनएसएसओ प्रोटोकॉल में दक्षता',
        category: 'Domain',
        levels: { L1: '', L2: '', L3: '', L4: '', L5: '' },
        provenance: 'PROPOSED_FRAMEWORK',
        created_at: new Date().toISOString(),
      },
      activity: {
        id: 'act-se',
        name: 'Socio-Economic Survey Execution',
        name_hi: 'सामाजिक-आर्थिक सर्वेक्षण निष्पादन',
        role_id: 'role-field-investigator',
        provenance: 'PROPOSED_FRAMEWORK',
        created_at: new Date().toISOString(),
      },
      currentLevel: 3,
      targetLevel: 3,
      gap: 0,
      priority: 'critical',
      severity: 'PROFICIENT',
      evidenceType: 'assessment-verified',
    },
    {
      competencyId: 'comp-ethics',
      competency: {
        id: 'comp-ethics',
        name: 'Statistical Ethics & Integrity',
        name_hi: 'सांख्यिकीय नैतिकता & अखंडता',
        category: 'Behavioural',
        levels: { L1: '', L2: '', L3: '', L4: '', L5: '' },
        provenance: 'PROPOSED_FRAMEWORK',
        created_at: new Date().toISOString(),
      },
      activity: {
        id: 'act-se',
        name: 'Socio-Economic Survey Execution',
        name_hi: 'सामाजिक-आर्थिक सर्वेक्षण निष्पादन',
        role_id: 'role-field-investigator',
        provenance: 'PROPOSED_FRAMEWORK',
        created_at: new Date().toISOString(),
      },
      currentLevel: 4,
      targetLevel: 2,
      gap: 0,
      priority: 'important',
      severity: 'PROFICIENT',
      evidenceType: 'assessment-verified',
    },
    {
      competencyId: 'comp-teamwork',
      competency: {
        id: 'comp-teamwork',
        name: 'Teamwork & Collaboration',
        name_hi: 'टीमवर्क & सहयोग',
        category: 'Behavioural',
        levels: { L1: '', L2: '', L3: '', L4: '', L5: '' },
        provenance: 'PROPOSED_FRAMEWORK',
        created_at: new Date().toISOString(),
      },
      activity: {
        id: 'act-fh',
        name: 'Household Listing & Census Enumeration',
        name_hi: 'परिवार सूचीकरण & जनगणना गणना',
        role_id: 'role-field-investigator',
        provenance: 'PROPOSED_FRAMEWORK',
        created_at: new Date().toISOString(),
      },
      currentLevel: 1,
      targetLevel: 4,
      gap: 3,
      priority: 'desirable',
      severity: 'MODERATE',
      evidenceType: 'self-assessed',
    },
    {
      competencyId: 'comp-estimation',
      competency: {
        id: 'comp-estimation',
        name: 'Statistical Estimation & Analysis',
        name_hi: 'सांख्यिकीय अनुमान & विश्लेषण',
        category: 'Domain',
        levels: { L1: '', L2: '', L3: '', L4: '', L5: '' },
        provenance: 'PROPOSED_FRAMEWORK',
        created_at: new Date().toISOString(),
      },
      activity: {
        id: 'act-se',
        name: 'Socio-Economic Survey Execution',
        name_hi: 'सामाजिक-आर्थिक सर्वेक्षण निष्पादन',
        role_id: 'role-field-investigator',
        provenance: 'PROPOSED_FRAMEWORK',
        created_at: new Date().toISOString(),
      },
      currentLevel: 1,
      targetLevel: 4,
      gap: 3,
      priority: 'desirable',
      severity: 'MODERATE',
      evidenceType: 'self-assessed',
    },
  ];

  // Sort gaps by severity (HIGH > MODERATE > PROFICIENT) and priority
  const severityOrder = { HIGH: 0, MODERATE: 1, PROFICIENT: 2 };
  const sortedGaps = [...demoGaps].sort((a, b) => {
    const severityA = severityOrder[a.severity];
    const severityB = severityOrder[b.severity];

    if (severityA !== severityB) {
      return severityA - severityB;
    }

    const priorityOrder = { critical: 0, important: 1, desirable: 2 };
    const priorityA = priorityOrder[a.priority];
    const priorityB = priorityOrder[b.priority];

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    return b.gap - a.gap;
  });

  // Build radar data for the most relevant activities
  const relevantActivities = [...new Set(sortedGaps.map(g => g.activity.name))];
  const radar: RadarDataPoint[] = relevantActivities.map(activity => {
    const gapForActivity = sortedGaps.find(g => g.activity.name === activity);
    return {
      label: activity.split(' ')[0] + ' ' + activity.split(' ')[1],
      current: gapForActivity?.currentLevel || 1,
      target: gapForActivity?.targetLevel || 3,
    };
  });

  return { gaps: sortedGaps, radarData: radar };
}

export default function SkillGapClient() {
  const t = useTranslations();
  const [{ gaps, radarData }] = useState(getDemoGapsAndRadar);
  const [filter, setFilter] = useState<'all' | 'HIGH' | 'MODERATE' | 'PROFICIENT'>('all');

  const filteredGaps = gaps.filter(gap => filter === 'all' || gap.severity === filter);

  const getSeverityCount = (severity: 'HIGH' | 'MODERATE' | 'PROFICIENT') => {
    return gaps.filter(g => g.severity === severity).length;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-[#2d1f17]">
          {t('skillGap.title')}
        </h1>
        <p className="text-[#705849]">
          {t('skillGap.subtitle')}
        </p>
      </div>

      {/* Radar Chart */}
      <div className="rounded-2xl bg-white p-8 shadow-card">
        <h2 className="text-lg font-semibold text-[#2d1f17] mb-6">
          Competency Radar — Current vs Required Levels
        </h2>
        <div className="flex justify-center">
          <RadarChart data={radarData} size={450} showLegend />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl bg-white p-4 shadow-card">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-[#705849]">
            Filter by severity:
          </span>
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-[#555934] text-white shadow-2xs'
                : 'bg-[#F2E6D8]/50 text-[#2d1f17] hover:bg-[#F2E6D8]'
            }`}
          >
            All ({gaps.length})
          </button>
          <button
            onClick={() => setFilter('HIGH')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === 'HIGH'
                ? 'bg-[#8C5B3E] text-white shadow-2xs'
                : 'bg-[#8C5B3E]/10 text-[#8C5B3E] hover:bg-[#8C5B3E]/20'
            }`}
          >
            🔴 High ({getSeverityCount('HIGH')})
          </button>
          <button
            onClick={() => setFilter('MODERATE')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === 'MODERATE'
                ? 'bg-[#BF9B7A] text-[#2d1f17] shadow-2xs font-semibold'
                : 'bg-[#BF9B7A]/15 text-[#593E2E] hover:bg-[#BF9B7A]/25'
            }`}
          >
            🟡 Moderate ({getSeverityCount('MODERATE')})
          </button>
          <button
            onClick={() => setFilter('PROFICIENT')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === 'PROFICIENT'
                ? 'bg-[#555934] text-white shadow-2xs'
                : 'bg-[#555934]/10 text-[#555934] hover:bg-[#555934]/20'
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
        <div className="text-center py-12 rounded-2xl bg-white shadow-card">
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="text-lg font-medium text-[#2d1f17] mb-2">
            No gaps in this category
          </h3>
          <p className="text-[#705849]">
            All competencies are at or above target level for this filter.
          </p>
        </div>
      )}
    </div>
  );
}
