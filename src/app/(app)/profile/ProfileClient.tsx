'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { RadarChart, type RadarDataPoint } from '@/components/RadarChart';
import { ProvenanceBadge } from '@/components/ProvenanceBadge';
import { ProgressRing } from '@/components/ProgressRing';
import { Award, CheckCircle2, Clock, Sparkles } from 'lucide-react';

interface CompetencyRecord {
  competencyId: string;
  competencyName: string;
  category: string;
  currentLevel: number;
  targetLevel: number;
  evidenceType: 'assessment-verified' | 'self-assessed';
  lastUpdated: string;
}

interface CompetencyHistoryEntry {
  date: string;
  level: number;
  source: 'self-assessment' | 'course-completion' | 'assessment-score';
}

interface ProfileData {
  name: string;
  email: string;
  designation: string;
  cadre: string;
  department: string;
  organization: string;
  role: string;
  karmaPoints: number;
  aparMilestone: string;
  readinessIndex: number;
  joinedDate: string;
  assessmentsCompleted: number;
  coursesCompleted: number;
  competencyRecords: CompetencyRecord[];
  competencyHistory: Record<string, CompetencyHistoryEntry[]>;
}

function getDemoProfileData(): ProfileData {
  return {
    name: 'Sunita Devi',
    email: 'sunita.devi@mospi.gov.in',
    designation: 'Field Investigator (Grade II)',
    cadre: 'FOD - NSSO',
    department: 'Field Operations Division',
    organization: 'MoSPI Demo Organization',
    role: 'Field Investigator',
    karmaPoints: 1275,
    aparMilestone: '2025-2026: Exceeded Expectations',
    readinessIndex: 67,
    joinedDate: '2023-06-15',
    assessmentsCompleted: 8,
    coursesCompleted: 4,
    competencyRecords: [
      {
        competencyId: 'comp-capi',
        competencyName: 'CAPI Tablet Operation',
        category: 'Domain',
        currentLevel: 3,
        targetLevel: 4,
        evidenceType: 'assessment-verified',
        lastUpdated: '2025-08-10',
      },
      {
        competencyId: 'comp-nsso',
        competencyName: 'NSSO Protocol Mastery',
        category: 'Domain',
        currentLevel: 3,
        targetLevel: 3,
        evidenceType: 'assessment-verified',
        lastUpdated: '2025-07-22',
      },
      {
        competencyId: 'comp-survey',
        competencyName: 'Survey Sampling & Design',
        category: 'Functional',
        currentLevel: 2,
        targetLevel: 3,
        evidenceType: 'self-assessed',
        lastUpdated: '2025-06-01',
      },
      {
        competencyId: 'comp-data',
        competencyName: 'Data Entry & Scrutiny',
        category: 'Functional',
        currentLevel: 3,
        targetLevel: 3,
        evidenceType: 'assessment-verified',
        lastUpdated: '2025-08-05',
      },
      {
        competencyId: 'comp-teamwork',
        competencyName: 'Teamwork & Collaboration',
        category: 'Behavioural',
        currentLevel: 3,
        targetLevel: 2,
        evidenceType: 'self-assessed',
        lastUpdated: '2025-05-15',
      },
      {
        competencyId: 'comp-communication',
        competencyName: 'Citizen Enumeration Ethics',
        category: 'Behavioural',
        currentLevel: 4,
        targetLevel: 3,
        evidenceType: 'assessment-verified',
        lastUpdated: '2025-07-30',
      },
    ],
    competencyHistory: {
      'comp-capi': [
        { date: '2025-08-10', level: 3, source: 'assessment-score' },
        { date: '2025-05-20', level: 2, source: 'assessment-score' },
        { date: '2025-02-15', level: 2, source: 'self-assessment' },
        { date: '2024-11-01', level: 1, source: 'self-assessment' },
      ],
      'comp-nsso': [
        { date: '2025-07-22', level: 3, source: 'assessment-score' },
        { date: '2025-04-10', level: 3, source: 'course-completion' },
        { date: '2025-01-05', level: 2, source: 'assessment-score' },
      ],
    },
  };
}

export default function ProfileClient() {
  const t = useTranslations();
  const [data] = useState<ProfileData>(getDemoProfileData);
  const [activeTab, setActiveTab] = useState<'overview' | 'competencies' | 'history'>('overview');

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-[#705849]">Profile data unavailable</p>
      </div>
    );
  }

  // Build radar data from competency records
  const radarData: RadarDataPoint[] = data.competencyRecords.map((record) => ({
    label: record.competencyName.split(' ').slice(0, 2).join(' '),
    current: record.currentLevel,
    target: record.targetLevel,
  }));

  // Group competencies by category
  const byCategory = data.competencyRecords.reduce((acc, record) => {
    if (!acc[record.category]) acc[record.category] = [];
    acc[record.category].push(record);
    return acc;
  }, {} as Record<string, CompetencyRecord[]>);

  const categoryStyles: Record<string, { bg: string; dot: string }> = {
    Behavioural: {
      bg: 'bg-white',
      dot: 'bg-[#BF9B7A]',
    },
    Functional: {
      bg: 'bg-white',
      dot: 'bg-[#8C5B3E]',
    },
    Domain: {
      bg: 'bg-white',
      dot: 'bg-[#555934]',
    },
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* Header Profile Card */}
      <div className="rounded-2xl bg-white p-7 sm:p-8 shadow-card">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="w-18 h-18 rounded-2xl bg-[#555934] flex items-center justify-center text-white text-2xl font-bold shadow-sm ring-4 ring-[#555934]/10">
              {data.name.split(' ').map((n) => n[0]).join('')}
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-[#2d1f17] tracking-tight">{data.name}</h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#555934]/12 px-3 py-0.5 text-xs font-semibold text-[#555934]">
                  <Sparkles className="h-3 w-3" />
                  {data.role}
                </span>
              </div>
              <p className="text-sm text-[#705849] mt-0.5">{data.designation}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-[#705849]">
                <span className="font-medium text-[#2d1f17]">{data.department}</span>
                <span>•</span>
                <span>{data.cadre}</span>
                <span>•</span>
                <span>{data.organization}</span>
              </div>
            </div>
          </div>

          {/* Key Metric Stats */}
          <div className="flex items-center gap-6 sm:gap-8 bg-[#F2E6D8]/50 rounded-2xl px-6 py-4">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-[#555934] font-mono">
                {data.karmaPoints.toLocaleString()}
              </div>
              <p className="text-[11px] font-semibold text-[#705849] uppercase tracking-wider mt-0.5">Karma Points</p>
            </div>
            <div className="h-8 w-px bg-[#E8DACB]" />
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-[#593E2E] font-mono">
                {data.assessmentsCompleted}
              </div>
              <p className="text-[11px] font-semibold text-[#705849] uppercase tracking-wider mt-0.5">Assessments</p>
            </div>
            <div className="h-8 w-px bg-[#E8DACB]" />
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-[#BF9B7A] font-mono">
                {data.coursesCompleted}
              </div>
              <p className="text-[11px] font-semibold text-[#705849] uppercase tracking-wider mt-0.5">Courses</p>
            </div>
          </div>
        </div>

        {/* APAR Milestone Banner */}
        <div className="mt-6 p-4 rounded-xl bg-[#F2E6D8]/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#555934]/15 text-[#555934]">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#705849]">{t('profile.aparMilestone')}</p>
              <p className="text-base font-bold text-[#2d1f17] mt-0.5">{data.aparMilestone}</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#555934] text-white shadow-2xs">
            Official Rating
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-[#F2E6D8] gap-2">
        {(['overview', 'competencies', 'history'] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 -mb-px ${
                isActive
                  ? 'border-[#555934] text-[#555934]'
                  : 'border-transparent text-[#705849] hover:text-[#2d1f17]'
              }`}
            >
              {tab === 'overview' ? 'Overview' : tab === 'competencies' ? 'FRAC Competencies' : 'Growth History'}
            </button>
          );
        })}
      </div>

      {/* Tab Content: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Readiness Ring Card */}
          <div className="rounded-2xl bg-white p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-[#2d1f17]">
                  {t('dashboard.readinessIndex')}
                </h3>
                <p className="text-xs text-[#705849]">Composite official evaluation</p>
              </div>
              <span className="text-xs font-mono font-bold text-[#555934] bg-[#555934]/12 px-3 py-1 rounded-full">
                {data.readinessIndex}%
              </span>
            </div>
            <div className="flex justify-center py-4">
              <ProgressRing
                value={data.readinessIndex}
                size={180}
                label="Readiness"
                sublabel={`${data.competencyRecords.filter((c) => c.currentLevel >= c.targetLevel).length}/${data.competencyRecords.length} at target`}
              />
            </div>
          </div>

          {/* Competency Radar Card */}
          <div className="rounded-2xl bg-white p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-[#2d1f17]">
                  {t('profile.competencyRadar')}
                </h3>
                <p className="text-xs text-[#705849]">Current versus role benchmark</p>
              </div>
            </div>
            <div className="flex justify-center py-2">
              <RadarChart data={radarData} size={290} showLegend />
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Competencies */}
      {activeTab === 'competencies' && (
        <div className="space-y-6">
          {Object.entries(byCategory).map(([category, records]) => {
            const style = categoryStyles[category] || categoryStyles.Domain;
            return (
              <div
                key={category}
                className={`rounded-2xl ${style.bg} p-6 shadow-card`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-[#2d1f17] flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
                    {category} Competencies
                  </h3>
                  <span className="text-xs font-semibold text-[#705849]">
                    {records.length} Tracked
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {records.map((record) => {
                    const isTargetMet = record.currentLevel >= record.targetLevel;
                    const isNearTarget = record.currentLevel === record.targetLevel - 1;

                    return (
                      <div
                        key={record.competencyId}
                        className="bg-[#F2E6D8]/30 rounded-2xl p-4.5 transition-all hover:bg-[#F2E6D8]/50"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <h4 className="text-sm font-semibold text-[#2d1f17]">
                              {record.competencyName}
                            </h4>
                            <div className="flex items-center gap-2 mt-1.5">
                              <ProvenanceBadge provenance="PROPOSED_FRAMEWORK" showLabel={false} size="sm" />
                              {record.evidenceType === 'assessment-verified' ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#555934]/12 text-[#555934]">
                                  <CheckCircle2 className="h-3 w-3" /> Verified
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#BF9B7A]/20 text-[#593E2E]">
                                  Self-Assessed
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="text-[11px] text-[#705849] font-mono">
                            {record.lastUpdated}
                          </span>
                        </div>

                        {/* Level Progress */}
                        <div className="space-y-1.5 mt-3 pt-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-[#705849]">Current Level</span>
                            <span className="font-bold font-mono text-[#2d1f17]">
                              L{record.currentLevel} / L{record.targetLevel}
                            </span>
                          </div>

                          <div className="h-2 bg-[#E8DACB] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isTargetMet
                                  ? 'bg-[#555934]'
                                  : isNearTarget
                                  ? 'bg-[#BF9B7A]'
                                  : 'bg-[#8C5B3E]'
                              }`}
                              style={{ width: `${(record.currentLevel / 5) * 100}%` }}
                            />
                          </div>

                          <div className="flex justify-between text-[11px] text-[#705849] pt-0.5">
                            <span>Benchmark: L{record.targetLevel}</span>
                            {isTargetMet ? (
                              <span className="text-[#555934] font-semibold">✓ Target Achieved</span>
                            ) : (
                              <span className="text-[#8C5B3E] font-semibold">
                                {record.targetLevel - record.currentLevel} Level Needed
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab Content: Growth History */}
      {activeTab === 'history' && (
        <div className="rounded-2xl bg-white p-6 sm:p-7 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-[#2d1f17]">
                {t('profile.growthHistory')}
              </h3>
              <p className="text-xs text-[#705849]">Audit trail of validated assessments and self-ratings</p>
            </div>
          </div>

          <div className="space-y-8">
            {Object.entries(data.competencyHistory).map(([competencyId, history]) => {
              const record = data.competencyRecords.find((r) => r.competencyId === competencyId);
              if (!record) return null;

              return (
                <div key={competencyId} className="space-y-3">
                  <h4 className="text-sm font-bold text-[#2d1f17] flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#555934]" />
                    {record.competencyName}
                  </h4>
                  <div className="relative pl-6 space-y-3">
                    {history.map((entry, idx) => (
                      <div key={idx} className="relative">
                        <div className="bg-[#F2E6D8]/35 rounded-2xl p-4 transition-all">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#2d1f17]">
                              Achieved Level {entry.level}
                            </span>
                            <span className="text-[11px] text-[#705849] font-mono flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(entry.date).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="mt-2">
                            <span
                              className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                                entry.source === 'assessment-score'
                                  ? 'bg-[#555934]/15 text-[#555934]'
                                  : entry.source === 'course-completion'
                                  ? 'bg-[#BF9B7A]/20 text-[#593E2E]'
                                  : 'bg-[#F2E6D8] text-[#705849]'
                              }`}
                            >
                              {entry.source === 'assessment-score'
                                ? '📝 Proctored Assessment Score'
                                : entry.source === 'course-completion'
                                ? '📚 iGOT Karmayogi Course Completion'
                                : '✍️ Officer Self-Rating'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Data Provenance Footer */}
      <div className="rounded-2xl bg-white/70 p-4 flex items-start gap-3 shadow-card">
        <span className="text-lg">ℹ️</span>
        <div className="text-xs text-[#705849] space-y-1">
          <p>
            <strong className="text-[#2d1f17]">Official Record:</strong> This profile displays verified FRAC competency records and evaluation histories for MoSPI personnel.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <span>Framework:</span>
            <ProvenanceBadge provenance="SYNTHETIC_DEMO_DATA" showLabel={true} size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
