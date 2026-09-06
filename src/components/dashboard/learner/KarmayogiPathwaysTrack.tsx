'use client';

import React, { useRef } from 'react';
import { Award, CheckCircle2, Lock, ArrowUpRight, ChevronLeft, ChevronRight, Compass } from 'lucide-react';

export interface PathwayMilestone {
  id: string;
  stageNumber: number;
  title: string;
  title_hi: string;
  cadre: string;
  status: 'completed' | 'in-progress' | 'locked';
  progress: number;
  competenciesCovered: number;
  totalCompetencies: number;
  karmaReward: string;
  iGotCourseTitle: string;
  iGotLink: string;
}

export const PATHWAY_MILESTONES: PathwayMilestone[] = [
  {
    id: 'stage-1',
    stageNumber: 1,
    title: 'Induction & Statistical Cadre Foundations',
    title_hi: 'दीक्षा एवं सांख्यिकी कैडर बुनियादी सिद्धांत',
    cadre: 'Foundational • Level 1-2',
    status: 'completed',
    progress: 100,
    competenciesCovered: 4,
    totalCompetencies: 4,
    karmaReward: '+150 KP',
    iGotCourseTitle: 'Official Statistics & Legal Framework of NSSO',
    iGotLink: 'https://igotkarmayogi.gov.in',
  },
  {
    id: 'stage-2',
    stageNumber: 2,
    title: 'Field Operations & Demarcation Mastery',
    title_hi: 'फील्ड परिचालन एवं सीमांकन दक्षता',
    cadre: 'Applied Field • Level 3',
    status: 'in-progress',
    progress: 85,
    competenciesCovered: 5,
    totalCompetencies: 6,
    karmaReward: '+200 KP',
    iGotCourseTitle: 'Schedule 0.0 & CAPI Tablet Operational Mastery',
    iGotLink: 'https://igotkarmayogi.gov.in',
  },
  {
    id: 'stage-3',
    stageNumber: 3,
    title: 'Advanced Data Scrutiny & Microdata Validation',
    title_hi: 'उन्नत डेटा संवीक्षा एवं माइक्रो-डेटा सत्यापन',
    cadre: 'Senior Cadre • Level 4',
    status: 'locked',
    progress: 0,
    competenciesCovered: 0,
    totalCompetencies: 5,
    karmaReward: '+250 KP',
    iGotCourseTitle: 'DQAD Statistical Scrutiny & Anomaly Detection',
    iGotLink: 'https://igotkarmayogi.gov.in',
  },
  {
    id: 'stage-4',
    stageNumber: 4,
    title: 'National Accounts & Macro-Aggregation Leadership',
    title_hi: 'राष्ट्रीय लेखा एवं समष्टि-एकत्रीकरण नेतृत्व',
    cadre: 'Executive Director • Level 5',
    status: 'locked',
    progress: 0,
    competenciesCovered: 0,
    totalCompetencies: 4,
    karmaReward: '+300 KP',
    iGotCourseTitle: 'GDP Estimation & System of National Accounts (SNA)',
    iGotLink: 'https://igotkarmayogi.gov.in',
  },
];

interface KarmayogiPathwaysTrackProps {
  isHindi?: boolean;
}

export function KarmayogiPathwaysTrack({ isHindi = false }: KarmayogiPathwaysTrackProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -330 : 330;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleLaunchModule = (milestone: PathwayMilestone) => {
    if (milestone.status === 'locked') {
      alert(
        isHindi
          ? `यह चरण लॉक है! कृपया पहले चरण ${milestone.stageNumber - 1} की योग्यताएं पूर्ण करें।`
          : `This stage is locked! Complete all prerequisite competencies in Stage ${milestone.stageNumber - 1} to unlock.`
      );
      return;
    }
    window.open(milestone.iGotLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="rounded-3xl bg-white border border-[#BF9B7A]/30 p-5 sm:p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#BF9B7A]/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#555934]" />
            <h2 className="text-base sm:text-lg font-bold text-[#2d1f17]">
              {isHindi ? 'iGOT कर्मयोगी एकीकृत प्रगति पथ' : 'Karmayogi Bharat Integrated Progression Track'}
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#555934]/15 text-[#555934] hidden sm:inline">
              4 Stages
            </span>
          </div>
          <p className="text-xs text-[#705849] mt-0.5">
            {isHindi
              ? 'अन्वेषक से सांख्यिकी अधिकारी तक राष्ट्रीय क्षमता विकास का क्रमबद्ध मार्ग'
              : 'Sequential civil service competency ladder from Field Demarcation to National Accounts'}
          </p>
        </div>

        {/* Scroll Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Scroll pathways left"
            className="h-8 w-8 rounded-xl bg-[#FAF6F0] border border-[#BF9B7A]/35 flex items-center justify-center text-[#705849] hover:bg-[#F2E6D8] hover:text-[#2d1f17] transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Scroll pathways right"
            className="h-8 w-8 rounded-xl bg-[#FAF6F0] border border-[#BF9B7A]/35 flex items-center justify-center text-[#705849] hover:bg-[#F2E6D8] hover:text-[#2d1f17] transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Milestone Cards */}
      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {PATHWAY_MILESTONES.map((m) => {
          const title = isHindi ? m.title_hi : m.title;

          return (
            <div
              key={m.id}
              className={`min-w-[280px] sm:min-w-[320px] max-w-[320px] rounded-2xl border p-4 sm:p-5 flex flex-col justify-between snap-start shadow-2xs transition-all ${
                m.status === 'in-progress'
                  ? 'bg-white border-[#555934] ring-2 ring-[#555934]/15'
                  : m.status === 'completed'
                    ? 'bg-[#FAF6F0]/80 border-[#BF9B7A]/30 hover:border-[#BF9B7A]'
                    : 'bg-stone-50 border-stone-200 opacity-70'
              }`}
            >
              <div>
                {/* Stage Pill & Reward */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      m.status === 'completed'
                        ? 'bg-emerald-500/15 text-emerald-800 border border-emerald-500/30'
                        : m.status === 'in-progress'
                          ? 'bg-[#555934]/15 text-[#555934] border border-[#555934]/30'
                          : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {isHindi ? `चरण ${m.stageNumber}` : `Stage ${m.stageNumber}`}
                  </span>

                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[#8C5B3E] bg-[#F8C858]/25 px-2 py-0.5 rounded-full border border-[#F8C858]/40">
                    <Award className="h-3 w-3" />
                    {m.karmaReward}
                  </span>
                </div>

                {/* Milestone Title */}
                <h3 className="text-sm font-black text-[#2d1f17] line-clamp-2 leading-snug">
                  {title}
                </h3>
                <p className="text-[11px] font-medium text-[#705849] mt-1 truncate">
                  {m.cadre}
                </p>

                {/* Course preview */}
                <div className="mt-3 p-3 rounded-xl bg-[#FAF6F0] border border-[#BF9B7A]/25 space-y-1">
                  <span className="text-[10px] font-bold text-[#8C5B3E] uppercase tracking-wider block">
                    {isHindi ? 'संबद्ध कर्मयोगी मॉड्यूल' : 'Core iGOT Course'}
                  </span>
                  <p className="text-xs font-bold text-[#2d1f17] line-clamp-1">
                    {m.iGotCourseTitle}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#705849]">
                      {m.competenciesCovered}/{m.totalCompetencies} {isHindi ? 'कौशल' : 'Skills'}
                    </span>
                    <span className="font-bold text-[#555934]">{m.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#BF9B7A]/20 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        m.status === 'completed' ? 'bg-emerald-600' : 'bg-[#555934]'
                      }`}
                      style={{ width: `${m.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-[#BF9B7A]/20">
                <button
                  type="button"
                  onClick={() => handleLaunchModule(m)}
                  className={`w-full flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs ${
                    m.status === 'completed'
                      ? 'bg-emerald-500/15 text-emerald-800 border border-emerald-500/30 hover:bg-emerald-500/25'
                      : m.status === 'in-progress'
                        ? 'bg-[#555934] text-white hover:bg-[#434728]'
                        : 'bg-stone-200 text-stone-600 cursor-not-allowed'
                  }`}
                >
                  {m.status === 'completed' ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{isHindi ? 'सत्यापित एवं उत्तीर्ण' : 'Verified & Completed'}</span>
                    </>
                  ) : m.status === 'in-progress' ? (
                    <>
                      <Compass className="h-3.5 w-3.5 text-[#F8C858]" />
                      <span>{isHindi ? 'मॉड्यूल जारी रखें' : 'Resume Module'}</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </>
                  ) : (
                    <>
                      <Lock className="h-3.5 w-3.5" />
                      <span>{isHindi ? 'तालाबंद (प्रगति आवश्यक)' : 'Locked (Prerequisite)'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
