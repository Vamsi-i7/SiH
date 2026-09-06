'use client';

import React, { useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  BarChart3,
} from 'lucide-react';
import type { CohortData } from './modals/BatchInspectionModal';
import type { ItemAnalysisData } from './modals/ItemAnalysisModal';

export const ACTIVE_COHORTS: CohortData[] = [
  {
    id: 'cohort-1',
    code: 'JSO-IND-44',
    name: 'JSO Induction 2026 (Batch 44)',
    cadre: 'Indian Statistical Service / SSS',
    center: 'NSSTA Greater Noida',
    enrolled: 48,
    avgScore: 74,
    progress: 82,
    atRiskCount: 6,
    director: 'Dr. Priya Verma',
    startDate: '10 Aug 2026',
    endDate: '10 Nov 2026',
  },
  {
    id: 'cohort-2',
    code: 'FOD-REF-04',
    name: 'FOD Field Staff Refresher (Batch IV)',
    cadre: 'NSSO Field Operations Division',
    center: 'ZTC Kolkata & Lucknow',
    enrolled: 120,
    avgScore: 62,
    progress: 68,
    atRiskCount: 18,
    director: 'Dr. Priya Verma',
    startDate: '01 Jul 2026',
    endDate: '30 Sep 2026',
  },
  {
    id: 'cohort-3',
    code: 'DQAD-SCR-02',
    name: 'DQAD Scrutiny Officers Certification',
    cadre: 'Data Quality Assurance Division',
    center: 'MoSPI HQ Delhi',
    enrolled: 36,
    avgScore: 86,
    progress: 94,
    atRiskCount: 2,
    director: 'Dr. Priya Verma',
    startDate: '15 Jul 2026',
    endDate: '15 Oct 2026',
  },
  {
    id: 'cohort-4',
    code: 'CAPI-GEO-01',
    name: 'CAPI Geotagging & Offline Sync Workshop',
    cadre: 'NSSO Zonal Centers Cadre',
    center: 'ZTC Nagpur',
    enrolled: 84,
    avgScore: 58,
    progress: 50,
    atRiskCount: 22,
    director: 'Dr. Priya Verma',
    startDate: '18 Aug 2026',
    endDate: '18 Sep 2026',
  },
];

export const QUESTION_DECKS = [
  {
    id: 'deck-demarcation',
    code: 'Q-DECK-01',
    title: 'Schedule 0.0 Demarcation & Listing Deck',
    questionsCount: 48,
    verifiedPercent: 94,
    sourceManual: 'MoSPI Schedule 0.0 Field Handbook 2026',
    bloomsLevel: 'Apply (50%) • Analyze (30%)',
    tags: ['Hamlet-Groups', 'Census Blocks', 'Listing'],
    criticalCompetency: 'comp-demarcation',
    sampleItem: {
      id: 'q-review-101',
      stem: 'When the estimated population of an allocated rural First Stage Unit (FSU) exceeds 1,200 persons during Schedule 0.0 listing, what is the statutory minimum number of hamlet-groups to be formed?',
      options: [
        '2 equal hamlet-groups with approximately equal population',
        '3 or more hamlet-groups formed according to Annexure 2.1 population brackets',
        'Hamlet-group formation is optional if census enumeration blocks are pre-marked',
        'Subdivide the village into 4 arbitrary quadrats regardless of population',
      ],
      correctIndex: 1,
      discriminationIndex: 0.44,
      facilityIndex: 0.68,
      distractorPercentages: [14, 68, 12, 6],
      totalResponses: 420,
      competencyTag: 'comp-demarcation',
      sourceDoc: 'MoSPI Schedule 0.0 Field Handbook 2026',
      section: 'Section 4.12: Hamlet-Group Formation Rules',
      sourceSnippet: 'In cases where the estimated population of the allocated rural First Stage Unit exceeds 1,200 persons, the investigator shall divide the village into three or more hamlet-groups of approximately equal population size.',
    },
  },
  {
    id: 'deck-capi',
    code: 'Q-DECK-02',
    title: 'CAPI Offline Protocols & GPS Errors Deck',
    questionsCount: 36,
    verifiedPercent: 88,
    sourceManual: 'ASHE & CAPI Tablet Operational Manual',
    bloomsLevel: 'Apply (60%) • Understand (30%)',
    tags: ['GPS Geofencing', 'Offline Sync', 'Android CAPI'],
    criticalCompetency: 'comp-capi',
    sampleItem: {
      id: 'q-review-102',
      stem: 'Under CAPI protocol ASHE-2026, what action must an investigator take when the tablet GPS geofencing accuracy error exceeds 25 meters during household listing?',
      options: [
        'Manually override the GPS lock and proceed with immediate interview',
        'Wait for satellite lock under open sky for at least 3 minutes, then record reference landmark coordinates',
        'Skip the GPS coordinates column and complete the interview on paper schedule',
        'Re-boot the Android tablet into factory recovery mode',
      ],
      correctIndex: 1,
      discriminationIndex: 0.38,
      facilityIndex: 0.74,
      distractorPercentages: [12, 74, 10, 4],
      totalResponses: 530,
      competencyTag: 'comp-capi',
      sourceDoc: 'ASHE & CAPI Tablet Operational Manual',
      section: 'Section 2.4: GPS Precision Fallback Criteria',
      sourceSnippet: 'If the GPS accuracy radius exceeds 25 meters, the investigator must step out to clear sky for at least 3 minutes. If still unresolved, landmark triangulation coordinates must be entered manually with supervisor concurrence.',
    },
  },
  {
    id: 'deck-plfs',
    code: 'Q-DECK-03',
    title: 'PLFS Schedule 10.4 Labour Activity Matrices',
    questionsCount: 54,
    verifiedPercent: 98,
    sourceManual: 'PLFS Instructions to Field Staff Vol. 1',
    bloomsLevel: 'Apply (45%) • Analyze (30%)',
    tags: ['UPAS Status', 'CWS Activity', 'NIC-2008'],
    criticalCompetency: 'comp-nsso',
    sampleItem: {
      id: 'q-review-103',
      stem: 'In Periodic Labour Force Survey (PLFS) Schedule 10.4, an unpaid family member assisting in a household shop for 2 hours daily with no wages is classified under which Usual Principal Activity Status (UPAS)?',
      options: [
        'Code 11: Self-employed own account worker',
        'Code 21: Helper in household enterprise (unpaid family worker)',
        'Code 81: Out of labour force (attending domestic duties)',
        'Code 91: Unemployed seeking work',
      ],
      correctIndex: 1,
      discriminationIndex: 0.52,
      facilityIndex: 0.82,
      distractorPercentages: [8, 82, 7, 3],
      totalResponses: 610,
      competencyTag: 'comp-nsso',
      sourceDoc: 'PLFS Instructions to Field Staff Vol. 1',
      section: 'Section 3.2: UPAS & Subsidiary Activity Status Classification',
      sourceSnippet: 'Persons who engaged in their household enterprises, working full or part time and did not receive any regular salary or wages in return for the work to the enterprise are termed as unpaid helpers in household enterprises (Status Code 21).',
    },
  },
  {
    id: 'deck-weights',
    code: 'Q-DECK-04',
    title: 'Multi-Stage Sampling & Multipliers Deck',
    questionsCount: 32,
    verifiedPercent: 91,
    sourceManual: 'SDRD Survey Sampling Design Manual',
    bloomsLevel: 'Understand (20%) • Apply (60%)',
    tags: ['Stratification', 'Multiplier Weights', 'FSU Allocation'],
    criticalCompetency: 'comp-survey',
    sampleItem: {
      id: 'q-review-104',
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
    },
  },
];

interface HorizontalTrainerCarouselsProps {
  onInspectCohort: (cohort: CohortData) => void;
  onRemediateCohort: (cohort: CohortData) => void;
  onInspectItem: (item: ItemAnalysisData) => void;
  onOpenDeckStudio?: (deckId: string) => void;
}

export function HorizontalTrainerCarousels({
  onInspectCohort,
  onRemediateCohort,
  onInspectItem,
  onOpenDeckStudio,
}: HorizontalTrainerCarouselsProps) {
  const cohortsRef = useRef<HTMLDivElement>(null);
  const decksRef = useRef<HTMLDivElement>(null);

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 340;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* ════════════════════════════════════════════════════════════════
          CAROUSEL 1: ACTIVE TRAINING COHORTS & ACADEMY BATCHES
          ════════════════════════════════════════════════════════════════ */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#8C5B3E]" />
              <h2 className="text-base sm:text-lg font-bold text-[#2d1f17] tracking-tight">
                Active Training Cohorts & Academy Batches
              </h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Real-time progress meters, competency mastery, and remediation triggers across NSSTA and ZTCs
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scroll(cohortsRef, 'left')}
              aria-label="Previous cohorts"
              className="p-1.5 rounded-xl bg-white border border-[#BF9B7A]/30 text-muted-foreground hover:bg-[#FAF6F0] hover:text-[#2d1f17] transition-colors cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll(cohortsRef, 'right')}
              aria-label="Next cohorts"
              className="p-1.5 rounded-xl bg-white border border-[#BF9B7A]/30 text-muted-foreground hover:bg-[#FAF6F0] hover:text-[#2d1f17] transition-colors cursor-pointer shadow-2xs"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Row */}
        <div
          ref={cohortsRef}
          className="flex items-stretch gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {ACTIVE_COHORTS.map((cohort) => {
            const isAtRiskHigh = cohort.atRiskCount >= 10;
            return (
              <div
                key={cohort.id}
                className="w-77.5 sm:w-82.5 shrink-0 snap-start rounded-3xl bg-white border border-[#BF9B7A]/30 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group hover:border-[#BF9B7A]"
              >
                <div>
                  {/* Top Bar: Code & Center */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider bg-[#8C5B3E]/15 text-[#8C5B3E] border border-[#8C5B3E]/30">
                      {cohort.code}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium truncate max-w-35">
                      {cohort.center}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-[#2d1f17] tracking-tight line-clamp-1 group-hover:text-[#8C5B3E] transition-colors">
                    {cohort.name}
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{cohort.cadre}</p>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-2 my-3.5 p-2.5 rounded-2xl bg-[#FAF6F0]/70 border border-[#BF9B7A]/20">
                    <div className="text-center">
                      <p className="text-[9px] font-bold uppercase text-muted-foreground">Enrolled</p>
                      <p className="text-sm font-bold font-mono text-[#2d1f17] mt-0.5">
                        {cohort.enrolled}
                      </p>
                    </div>
                    <div className="text-center border-x border-[#BF9B7A]/20">
                      <p className="text-[9px] font-bold uppercase text-muted-foreground">Avg Score</p>
                      <p className="text-sm font-bold font-mono text-[#555934] mt-0.5">
                        {cohort.avgScore}%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] font-bold uppercase text-muted-foreground">At-Risk</p>
                      <p
                        className={`text-sm font-bold font-mono mt-0.5 ${
                          isAtRiskHigh ? 'text-red-600' : 'text-[#8C5B3E]'
                        }`}
                      >
                        {cohort.atRiskCount}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground font-medium">Syllabus Completion</span>
                      <span className="font-mono font-bold text-[#2d1f17]">{cohort.progress}%</span>
                    </div>
                    <div className="w-full bg-[#EAE0D0] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#8C5B3E]"
                        style={{ width: `${cohort.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#BF9B7A]/20">
                  <button
                    type="button"
                    onClick={() => onInspectCohort(cohort)}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#FAF6F0] hover:bg-[#F2E6D8] text-[#555934] text-xs font-bold transition-colors cursor-pointer text-center"
                  >
                    Inspect Batch
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemediateCohort(cohort)}
                    className="py-2 px-3 rounded-xl bg-[#8C5B3E] hover:bg-[#704830] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs shrink-0"
                    title="Dispatch Emergency Remedial Drill"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>Remediate</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          CAROUSEL 2: CURATED MOSPI QUESTION BANK DECKS
          ════════════════════════════════════════════════════════════════ */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#555934]" />
              <h2 className="text-base sm:text-lg font-bold text-[#2d1f17] tracking-tight">
                Curated MoSPI Question Bank Decks
              </h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Verified statutory question pools with source RAG citations, Bloom&apos;s levels, and item psychometrics
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scroll(decksRef, 'left')}
              aria-label="Previous question decks"
              className="p-1.5 rounded-xl bg-white border border-[#BF9B7A]/30 text-muted-foreground hover:bg-[#FAF6F0] hover:text-[#2d1f17] transition-colors cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll(decksRef, 'right')}
              aria-label="Next question decks"
              className="p-1.5 rounded-xl bg-white border border-[#BF9B7A]/30 text-muted-foreground hover:bg-[#FAF6F0] hover:text-[#2d1f17] transition-colors cursor-pointer shadow-2xs"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Row */}
        <div
          ref={decksRef}
          className="flex items-stretch gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {QUESTION_DECKS.map((deck) => (
            <div
              key={deck.id}
              className="w-77.5 sm:w-82.5 shrink-0 snap-start rounded-3xl bg-white border border-[#BF9B7A]/30 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group hover:border-[#BF9B7A]"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider bg-[#555934]/15 text-[#555934] border border-[#555934]/30">
                    {deck.code}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-500/15 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="h-3 w-3" />
                    {deck.verifiedPercent}% Verified
                  </span>
                </div>

                <h3 className="font-bold text-sm text-[#2d1f17] tracking-tight line-clamp-1 group-hover:text-[#555934] transition-colors">
                  {deck.title}
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5 truncate font-serif">
                  {deck.sourceManual}
                </p>

                {/* Deck Metadata Pill */}
                <div className="my-3 p-2.5 rounded-2xl bg-[#FAF6F0]/70 border border-[#BF9B7A]/20 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-medium text-[11px]">Item Count</span>
                    <span className="font-mono font-bold text-[#2d1f17] text-xs">
                      {deck.questionsCount} MCQs
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-medium text-[11px]">Cognitive Target</span>
                    <span className="text-[10px] font-mono text-[#8C5B3E] font-semibold">
                      {deck.bloomsLevel}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {deck.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[9px] font-semibold bg-[#FAF6F0] text-muted-foreground border border-[#BF9B7A]/25"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#BF9B7A]/20">
                <button
                  type="button"
                  onClick={() => onInspectItem(deck.sampleItem)}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#FAF6F0] hover:bg-[#F2E6D8] text-[#555934] text-xs font-bold transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
                >
                  <BarChart3 className="h-3.5 w-3.5" />
                  <span>Item Analysis</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenDeckStudio?.(deck.id)}
                  className="py-2 px-3 rounded-xl bg-[#555934] hover:bg-[#434728] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs shrink-0"
                >
                  <span>MCQ Studio</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HorizontalTrainerCarousels;
