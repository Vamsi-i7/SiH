'use client';

import React from 'react';
import type { FRACCompetencyDef } from '@/data/fracCadres';
import { computeGapSeverity, classifySeverity } from '@/services/competencyService';
import { AlertCircle, ArrowUpRight, CheckCircle2, ShieldCheck, UserCheck } from 'lucide-react';
import Link from 'next/link';

interface PriorityGapsCardProps {
  competencies: FRACCompetencyDef[];
  isHindi?: boolean;
}

export function PriorityGapsCard({
  competencies,
  isHindi = false,
}: PriorityGapsCardProps) {
  // Sort competencies by gap severity descending
  const sortedGaps = [...competencies].sort((a, b) => {
    const scoreA = computeGapSeverity(a.currentLevel, a.targetLevel, a.priority);
    const scoreB = computeGapSeverity(b.currentLevel, b.targetLevel, b.priority);
    return scoreB - scoreA;
  });

  return (
    <div className="rounded-3xl bg-white border border-[#BF9B7A]/30 p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-[#BF9B7A]/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#8C5B3E]" />
            <h2 className="text-lg font-bold text-[#2d1f17]">
              {isHindi ? 'प्राथमिकता क्षमता अंतराल (FRAC ढांचा)' : 'Priority Competency Gaps (FRAC Framework)'}
            </h2>
          </div>
          <p className="text-xs text-[#705849] mt-0.5">
            {isHindi
              ? 'आधिकारिक कर्तव्यों और फील्ड संवीक्षा के आधार पर व्यवस्थित'
              : 'Grounded in MoSPI Cadre Rules • Severity = (Target − Current) × Priority'}
          </p>
        </div>

        <Link
          href="/skill-gap"
          className="text-xs font-bold text-[#555934] hover:text-[#434728] inline-flex items-center gap-1 shrink-0"
        >
          <span>{isHindi ? 'सभी अंतर देखें' : 'View Detailed Matrix'}</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-5 space-y-4">
        {sortedGaps.map((comp) => {
          const gapScore = computeGapSeverity(comp.currentLevel, comp.targetLevel, comp.priority);
          const severity = classifySeverity(gapScore);
          const compName = isHindi ? comp.name_hi : comp.name;
          const activityName = isHindi ? comp.activityName_hi : comp.activityName;
          const isVerified = comp.evidenceType === 'assessment-verified';

          return (
            <div
              key={comp.id}
              className="rounded-2xl border border-[#BF9B7A]/30 bg-[#FAF6F0]/60 p-4 sm:p-5 hover:border-[#BF9B7A] transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1 min-w-0">
                  {/* Category & Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#555934]/15 text-[#555934]">
                      {comp.category}
                    </span>

                    {/* Severity Pill (PRD §4.1) */}
                    {severity === 'HIGH' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-red-500/15 text-red-700 border border-red-500/30">
                        <AlertCircle className="h-3 w-3" />
                        {isHindi ? 'उच्च प्राथमिकता अंतर' : 'HIGH CRITICAL GAP'}
                      </span>
                    )}
                    {severity === 'MODERATE' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/15 text-amber-700 border border-amber-500/30">
                        <AlertCircle className="h-3 w-3" />
                        {isHindi ? 'मध्यम प्राथमिकता' : 'MODERATE GAP'}
                      </span>
                    )}
                    {severity === 'PROFICIENT' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-700 border border-emerald-500/30">
                        <CheckCircle2 className="h-3 w-3" />
                        {isHindi ? 'दक्ष' : 'PROFICIENT'}
                      </span>
                    )}

                    {/* FR-PROFILE-2 Verified vs Self-Assessed badge */}
                    {isVerified ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-600/10 text-emerald-800">
                        <ShieldCheck className="h-3 w-3" />
                        {isHindi ? '🛡️ सत्यापित' : '🛡️ Verified'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#BF9B7A]/20 text-[#593E2E]">
                        <UserCheck className="h-3 w-3" />
                        {isHindi ? '✍️ स्व-मूल्यांकित' : '✍️ Self-Assessed'}
                      </span>
                    )}
                  </div>

                  {/* Competency Name */}
                  <h3 className="text-base font-bold text-[#2d1f17]">{compName}</h3>

                  {/* FR-COMP-4 FRAC Activity Attribution */}
                  <div className="text-xs text-[#705849] flex items-center gap-1.5">
                    <span className="font-semibold text-[#8C5B3E]">
                      {isHindi ? 'संबद्ध गतिविधि:' : 'Linked Activity:'}
                    </span>
                    <span className="font-medium text-[#2d1f17]/80 truncate">
                      {activityName}
                    </span>
                  </div>
                </div>

                {/* Direct CTA */}
                <div className="shrink-0 flex items-center gap-2">
                  <Link
                    href={`/assessment/${comp.id}`}
                    className="px-3.5 py-2 rounded-xl bg-[#555934] text-white text-xs font-bold hover:bg-[#434728] transition-colors shadow-2xs inline-flex items-center gap-1"
                  >
                    <span>{isHindi ? 'मूल्यांकन दें' : 'Bridge Gap'}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Stepped Level Progression Bar (L1 to L5) */}
              <div className="mt-4 pt-3 border-t border-[#BF9B7A]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-[#705849]">
                    {isHindi ? 'वर्तमान स्तर:' : 'Current:'}{' '}
                    <strong className="text-[#2d1f17] font-bold">L{comp.currentLevel}</strong>
                  </span>
                  <span className="text-[#BF9B7A]">→</span>
                  <span className="text-[#705849]">
                    {isHindi ? 'लक्ष्य स्तर:' : 'Target:'}{' '}
                    <strong className="text-[#555934] font-bold">L{comp.targetLevel}</strong>
                  </span>
                </div>

                {/* 5-Segment Level Step Indicator */}
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((lvl) => {
                    const isPassed = lvl <= comp.currentLevel;
                    const isTarget = lvl === comp.targetLevel;
                    const isPending = lvl > comp.currentLevel && lvl <= comp.targetLevel;

                    return (
                      <div
                        key={lvl}
                        className={`h-2.5 w-7 sm:w-9 rounded-full transition-all ${
                          isPassed
                            ? 'bg-[#555934]'
                            : isTarget
                              ? 'bg-[#F8C858] ring-2 ring-[#F8C858]/40'
                              : isPending
                                ? 'bg-[#BF9B7A]/40'
                                : 'bg-[#BF9B7A]/15'
                        }`}
                        title={`Level ${lvl}`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
