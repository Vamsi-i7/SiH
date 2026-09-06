'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Building2,
  CheckCircle2,
  ShieldAlert,
  BarChart3,
} from 'lucide-react';
import { ACTIVE_COHORTS } from '../HorizontalTrainerCarousels';
import type { CohortData } from '../modals/BatchInspectionModal';
import type { ItemAnalysisData } from '../modals/ItemAnalysisModal';

const REGIONAL_ERROR_DISPARITIES = [
  {
    center: 'ZTC Kolkata (Eastern Zone)',
    cadreCount: 140,
    topDeficit: 'CAPI GPS Lock & Offline Sync',
    errorRate: 36,
    trend: '+4% vs Q1',
    status: 'CRITICAL',
  },
  {
    center: 'ZTC Lucknow (Central Zone)',
    cadreCount: 110,
    topDeficit: 'Hamlet-Group Demarcation (Sched 0.0)',
    errorRate: 42,
    trend: '+8% vs Q1',
    status: 'CRITICAL',
  },
  {
    center: 'ZTC Nagpur (Western Zone)',
    cadreCount: 95,
    topDeficit: 'Sampling Multiplier Weights',
    errorRate: 28,
    trend: '-2% vs Q1',
    status: 'WATCH',
  },
  {
    center: 'ZTC Chennai (Southern Zone)',
    cadreCount: 125,
    topDeficit: 'PLFS UPAS Code 11 vs 21',
    errorRate: 22,
    trend: '-5% vs Q1',
    status: 'SAFE',
  },
  {
    center: 'NSSTA Greater Noida (HQ Induction)',
    cadreCount: 85,
    topDeficit: 'ASI Capital Depreciation Block C',
    errorRate: 18,
    trend: '-6% vs Q1',
    status: 'SAFE',
  },
];

const SAMPLE_DIAGNOSTIC_ITEMS: Record<number, ItemAnalysisData> = {
  0: {
    id: 'diag-01',
    stem: 'When the estimated population of an allocated rural First Stage Unit (FSU) exceeds 1,200 persons during Schedule 0.0 listing, what is the statutory minimum number of hamlet-groups to be formed?',
    options: [
      '2 equal hamlet-groups with approximately equal population',
      '3 or more hamlet-groups formed according to Annexure 2.1 population brackets',
      'Hamlet-group formation is optional if census enumeration blocks are pre-marked',
      'Subdivide the village into 4 arbitrary quadrats regardless of population',
    ],
    correctIndex: 1,
    discriminationIndex: 0.44,
    facilityIndex: 0.58,
    distractorPercentages: [28, 58, 10, 4],
    totalResponses: 420,
    competencyTag: 'comp-demarcation',
    sourceDoc: 'MoSPI Schedule 0.0 Field Handbook 2026',
    section: 'Section 4.12: Hamlet-Group Formation Rules',
    sourceSnippet: 'In cases where the estimated population of the allocated rural First Stage Unit exceeds 1,200 persons, the investigator shall divide the village into three or more hamlet-groups.',
    status: 'approved',
  },
  1: {
    id: 'diag-02',
    stem: 'What is the sampling multiplier formula for estimating state-level aggregate totals from rural sample hamlet-groups in NSS 79th Round?',
    options: [
      'Inverse probability of selection multiplied by village allocation factor',
      'Simple arithmetic mean of sample households multiplied by 1,000',
      'Census population divided by total enumerated households only',
      'Unweighted sample sum with standard deviation rounding',
    ],
    correctIndex: 0,
    discriminationIndex: 0.46,
    facilityIndex: 0.62,
    distractorPercentages: [62, 18, 12, 8],
    totalResponses: 390,
    competencyTag: 'comp-survey',
    sourceDoc: 'SDRD Survey Sampling Design Manual',
    section: 'Annexure 5: Estimation Procedures & Multiplier Formulas',
    sourceSnippet: 'The estimation of population aggregates utilizes the inverse probability of selection weight at both First Stage Unit and Second Stage Unit levels.',
    status: 'approved',
  },
  2: {
    id: 'diag-03',
    stem: 'Under CAPI protocol ASHE-2026, what action must an investigator take when the tablet GPS geofencing accuracy error exceeds 25 meters during household listing?',
    options: [
      'Manually override the GPS lock and proceed with immediate interview',
      'Wait for satellite lock under open sky for at least 3 minutes, then record reference landmark coordinates',
      'Skip the GPS coordinates column and complete the interview on paper schedule',
      'Re-boot the Android tablet into factory recovery mode',
    ],
    correctIndex: 1,
    discriminationIndex: 0.38,
    facilityIndex: 0.71,
    distractorPercentages: [15, 71, 10, 4],
    totalResponses: 530,
    competencyTag: 'comp-capi',
    sourceDoc: 'ASHE & CAPI Tablet Operational Manual',
    section: 'Section 2.4: GPS Precision Fallback Criteria',
    sourceSnippet: 'If the GPS accuracy radius exceeds 25 meters, the investigator must step out to clear sky for at least 3 minutes.',
    status: 'approved',
  },
  3: {
    id: 'diag-04',
    stem: 'In Periodic Labour Force Survey (PLFS) Schedule 10.4, an unpaid family member assisting in a household shop for 2 hours daily with no wages is classified under which Usual Principal Activity Status (UPAS)?',
    options: [
      'Code 11: Self-employed own account worker',
      'Code 21: Helper in household enterprise (unpaid family worker)',
      'Code 81: Out of labour force (attending domestic duties)',
      'Code 91: Unemployed seeking work',
    ],
    correctIndex: 1,
    discriminationIndex: 0.52,
    facilityIndex: 0.76,
    distractorPercentages: [16, 76, 5, 3],
    totalResponses: 610,
    competencyTag: 'comp-nsso',
    sourceDoc: 'PLFS Instructions to Field Staff Vol. 1',
    section: 'Section 3.2: UPAS & Subsidiary Activity Status Classification',
    sourceSnippet: 'Persons who engaged in their household enterprises without regular salary are termed unpaid helpers (Status Code 21).',
    status: 'approved',
  },
};

interface TrainerDiagnosticsStudioProps {
  onInspectItem: (item: ItemAnalysisData) => void;
  onRemediateCohort: (cohort: CohortData) => void;
}

export function TrainerDiagnosticsStudio({
  onInspectItem,
  onRemediateCohort,
}: TrainerDiagnosticsStudioProps) {
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleDispatchZtc = (center: string) => {
    setToastMsg(`Targeted remedial drill scheduled for all officers enrolled at ${center}.`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-white border border-[#BF9B7A]/30 p-6 shadow-2xs space-y-2">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-600" />
          <h2 className="text-lg font-bold text-[#2d1f17] tracking-tight">
            Item Diagnostics & Zonal Error Disparities
          </h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Psychometric verification of question items, distractor effectiveness, and geographical failure patterns across MoSPI Zonal Training Centres
        </p>

        {toastMsg && (
          <div className="mt-3 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{toastMsg}</span>
          </div>
        )}
      </div>

      {/* Regional Error Disparities Matrix */}
      <div className="rounded-3xl bg-white border border-[#BF9B7A]/30 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#BF9B7A]/20">
          <div>
            <h3 className="text-base font-bold text-[#2d1f17]">
              Regional Zonal Center Deficit Comparison
            </h3>
            <p className="text-xs text-muted-foreground">
              Cross-zonal performance on NSS 79th Round benchmark competencies
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#8C5B3E] bg-[#FAF6F0] px-2.5 py-1 rounded-lg border border-[#BF9B7A]/25">
            5 ZTC Centers Audited
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#BF9B7A]/20">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF6F0] border-b border-[#BF9B7A]/20 text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Zonal Center</th>
                <th className="py-3 px-4">Trainees</th>
                <th className="py-3 px-4">Primary Curriculum Deficit</th>
                <th className="py-3 px-4">Cohort Error Rate</th>
                <th className="py-3 px-4">Trend vs Q1</th>
                <th className="py-3 px-4 text-right">Faculty Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#BF9B7A]/15">
              {REGIONAL_ERROR_DISPARITIES.map((reg, idx) => (
                <tr key={idx} className="hover:bg-[#FAF6F0]/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-[#2d1f17]">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-[#8C5B3E]" />
                      <span>{reg.center}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-muted-foreground">
                    {reg.cadreCount} Officers
                  </td>
                  <td className="py-3 px-4 font-medium text-[#2d1f17]">
                    {reg.topDeficit}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono text-sm text-[#2d1f17]">
                        {reg.errorRate}%
                      </span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                          reg.status === 'CRITICAL'
                            ? 'bg-red-500/15 text-red-700'
                            : reg.status === 'WATCH'
                              ? 'bg-amber-500/15 text-amber-700'
                              : 'bg-emerald-500/15 text-emerald-700'
                        }`}
                      >
                        {reg.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-muted-foreground">
                    {reg.trend}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleDispatchZtc(reg.center)}
                      className="px-3 py-1 rounded-xl bg-[#8C5B3E] hover:bg-[#704830] text-white text-[11px] font-bold transition-all shadow-2xs cursor-pointer inline-flex items-center gap-1"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>Dispatch Remediation</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top 5 Most Confused Concepts & Remediation Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Most Confused Concepts */}
        <div className="rounded-3xl bg-white border border-[#BF9B7A]/30 p-6 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#BF9B7A]/20">
            <h4 className="font-bold text-sm text-[#2d1f17]">
              Top 4 Most Confused MoSPI Concepts
            </h4>
            <span className="text-[10px] font-bold uppercase text-red-700 bg-red-500/15 px-2 py-0.5 rounded-full">
              High Deficit
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {[
              {
                concept: 'Hamlet-Group Formation Thresholds (Sched 0.0)',
                pct: '42% Error',
                detail: 'Confusion between >600 vs >1200 population brackets for 2 vs 3 hamlet-groups.',
              },
              {
                concept: 'Multi-Stage Sampling Multipliers & Weights',
                pct: '38% Error',
                detail: 'Failure to invert selection probability for second-stage rural sampling units.',
              },
              {
                concept: 'CAPI Offline GPS Coordinate Fallback',
                pct: '29% Error',
                detail: 'Investigators recording 0.0 lat/long instead of 3-minute open-sky satellite lock.',
              },
              {
                concept: 'PLFS UPAS Code 11 vs 21 Classification',
                pct: '24% Error',
                detail: 'Misclassifying unpaid family helpers as own-account self-employed workers.',
              },
            ].map((item, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-[#FAF6F0]/60 border border-[#BF9B7A]/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#2d1f17]">{item.concept}</span>
                  <span className="font-mono font-bold text-red-600 text-[11px]">{item.pct}</span>
                </div>
                <p className="text-[11px] text-muted-foreground">{item.detail}</p>
                <div className="pt-1.5 flex justify-end">
                  <button
                    type="button"
                    onClick={() => onInspectItem(SAMPLE_DIAGNOSTIC_ITEMS[idx] || SAMPLE_DIAGNOSTIC_ITEMS[0])}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-[#555934] hover:text-[#2d1f17] cursor-pointer"
                  >
                    <BarChart3 className="h-3 w-3" />
                    <span>Inspect Distractors</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Faculty Action Protocol */}
        <div className="rounded-3xl bg-[#2d1f17] text-white p-6 shadow-2xs space-y-3 border border-[#BF9B7A]/20 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <ShieldAlert className="h-4 w-4 text-[#F8C858]" />
              <h4 className="font-bold text-sm text-[#F8C858]">
                NSSTA Faculty Remediation Guidance
              </h4>
            </div>

            <p className="text-xs text-[#FAF6F0]/80 leading-relaxed">
              Based on empirical psychometric responses, automated drills with statutory citations should be dispatched at least 7 days prior to national survey rollouts.
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
                <p className="font-bold text-[#F8C858]">Prescription 1: CAPI Field Simulation</p>
                <p className="text-[11px] text-[#FAF6F0]/70">
                  Mandate 3 interactive practice trials on Android emulator for all ZTC Kolkata & Lucknow trainees.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
                <p className="font-bold text-[#F8C858]">Prescription 2: Schedule 0.0 Diagnostic</p>
                <p className="text-[11px] text-[#FAF6F0]/70">
                  Dispatch 5-question targeted drill with population threshold examples.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onRemediateCohort(ACTIVE_COHORTS[0])}
            className="w-full py-2.5 rounded-xl bg-[#8C5B3E] hover:bg-[#704830] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 mt-4"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Open Global Remediation Dispatcher</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TrainerDiagnosticsStudio;
