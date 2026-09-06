'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, FileText, Calendar, CheckCircle2, Clock } from 'lucide-react';

export interface PolicyDirectiveData {
  id: string;
  circularNo: string;
  title: string;
  authority: string;
  mandateSummary: string;
  complianceDeadline: string;
  status: 'ENFORCED' | 'ACTIVE_ROLLOUT' | 'IN_REVIEW' | 'GAZETTE_PUBLISHED';
  complianceRate: number;
}

export const POLICY_DIRECTIVES_DATA: PolicyDirectiveData[] = [
  {
    id: 'pol-01',
    circularNo: 'MoSPI/GAZETTE/2026/781',
    title: 'Mission Karmayogi Bharat 2026 Cadre Mandate',
    authority: 'Cabinet Secretariat & MoSPI Joint Resolution',
    mandateSummary: 'Mandates minimum Level 3 FRAC competency certification for all JSOs and FIs prior to official survey deployment.',
    complianceDeadline: '31 Dec 2026',
    status: 'ENFORCED',
    complianceRate: 72.4,
  },
  {
    id: 'pol-02',
    circularNo: 'NSSO/SOP/2026/04',
    title: 'NSS 79th Round CAPI Quality Assurance Protocol',
    authority: 'Survey Design & Research Division (SDRD)',
    mandateSummary: 'Establishes cryptographic AES-256 local buffering, GPS precision validation bypass rules, and daily scrutiny sync.',
    complianceDeadline: '15 Oct 2026',
    status: 'ACTIVE_ROLLOUT',
    complianceRate: 88.0,
  },
  {
    id: 'pol-03',
    circularNo: 'NDGFP/MoSPI/2026/19',
    title: 'National Data Governance Framework Policy (NDGFP)',
    authority: 'Ministry of Electronics & IT (MeitY) & MoSPI',
    mandateSummary: 'Unified microdata anonymization standards, secure research lab API protocols, and statutory data disclosure norms.',
    complianceDeadline: '30 Nov 2026',
    status: 'IN_REVIEW',
    complianceRate: 64.5,
  },
  {
    id: 'pol-04',
    circularNo: 'CAB/RES/2026/PLFS-REVAMP',
    title: 'PLFS Urban & Rural Frame Stratification Revamp',
    authority: 'National Statistical Commission (NSC)',
    mandateSummary: 'Replaces obsolete 2011 Census urban frames with dynamic satellite imagery CEB demarcations and high-rise sub-strata.',
    complianceDeadline: '01 Jan 2027',
    status: 'GAZETTE_PUBLISHED',
    complianceRate: 51.0,
  },
  {
    id: 'pol-05',
    circularNo: 'ASHE/DIR/2026/CAP-VAL',
    title: 'ASHE Enterprise Sampling & Capital Valuation Standard',
    authority: 'Data Processing Division (DPD), MoSPI Kolkata',
    mandateSummary: 'Standardized gross fixed asset estimation and informal manufacturing unit identification across unorganized sectors.',
    complianceDeadline: '15 Nov 2026',
    status: 'ENFORCED',
    complianceRate: 81.2,
  },
];

interface HorizontalPolicyDirectivesCarouselProps {
  onReadCircular?: (directive: PolicyDirectiveData) => void;
}

export function HorizontalPolicyDirectivesCarousel({
  onReadCircular,
}: HorizontalPolicyDirectivesCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  return (
    <section className="space-y-3" aria-label="National Policy Directives Carousel">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#8C5B3E]" />
            <h2 className="text-sm sm:text-base font-black text-[#2d1f17] tracking-tight">
              National Policy Directives &amp; Cabinet Circulars
            </h2>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#8C5B3E]/15 text-[#8C5B3E] border border-[#8C5B3E]/30">
              5 Active Directives
            </span>
          </div>
          <p className="text-xs text-[#705849] mt-0.5">
            Statutory framework reforms, gazette notifications, and compliance schedules from the Cabinet Secretariat.
          </p>
        </div>

        {/* Arrows */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={scrollLeft}
            aria-label="Previous circulars"
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white border border-[#BF9B7A]/30 text-[#705849] hover:bg-[#FAF6F0] hover:text-[#2d1f17] transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={scrollRight}
            aria-label="Next circulars"
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white border border-[#BF9B7A]/30 text-[#705849] hover:bg-[#FAF6F0] hover:text-[#2d1f17] transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Deck */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-3 pt-1 scroll-smooth snap-x snap-mandatory focus:outline-none"
        style={{ scrollbarWidth: 'thin' }}
      >
        {POLICY_DIRECTIVES_DATA.map((item) => (
          <div
            key={item.id}
            className="min-w-[320px] max-w-[340px] shrink-0 snap-start rounded-2xl p-4.5 bg-white border border-[#BF9B7A]/30 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Circular Reference & Status Pill */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono font-bold text-[#8C5B3E] truncate">
                  {item.circularNo}
                </span>

                {item.status === 'ENFORCED' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-800 border border-emerald-500/30 shrink-0">
                    <CheckCircle2 className="h-3 w-3" />
                    Enforced
                  </span>
                ) : item.status === 'ACTIVE_ROLLOUT' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#555934]/15 text-[#555934] border border-[#555934]/30 shrink-0">
                    <Clock className="h-3 w-3" />
                    Rollout
                  </span>
                ) : item.status === 'IN_REVIEW' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-800 border border-amber-500/30 shrink-0">
                    In Review
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#8C5B3E]/15 text-[#8C5B3E] border border-[#8C5B3E]/30 shrink-0">
                    Gazette
                  </span>
                )}
              </div>

              {/* Title & Authority */}
              <div>
                <h3 className="font-bold text-sm text-[#2d1f17] leading-snug line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-[10.5px] font-semibold text-[#705849] mt-0.5 truncate">
                  {item.authority}
                </p>
              </div>

              {/* Mandate Summary */}
              <p className="text-[11px] text-[#705849] leading-relaxed line-clamp-3 bg-[#FAF6F0]/60 p-2.5 rounded-xl border border-[#BF9B7A]/20">
                {item.mandateSummary}
              </p>

              {/* Compliance & Deadline */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[10.5px]">
                  <span className="text-[#705849] flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-[#8C5B3E]" />
                    Deadline: <strong>{item.complianceDeadline}</strong>
                  </span>
                  <span className="font-mono font-bold text-[#555934]">
                    {item.complianceRate}% Comply
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[#BF9B7A]/20 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#555934]"
                    style={{ width: `${item.complianceRate}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Read Action Button */}
            <div className="pt-3.5 mt-3 border-t border-[#BF9B7A]/20">
              <button
                type="button"
                onClick={() => onReadCircular && onReadCircular(item)}
                className="w-full py-1.5 px-3 rounded-xl bg-[#FAF6F0] border border-[#BF9B7A]/40 text-xs font-bold text-[#555934] hover:bg-[#555934] hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Read Official Circular</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
