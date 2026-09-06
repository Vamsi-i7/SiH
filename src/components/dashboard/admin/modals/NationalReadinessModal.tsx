'use client';

import React from 'react';
import { X, Target, TrendingUp, AlertTriangle } from 'lucide-react';
import { KarmayogiEmblemIcon } from '@/components/auth/KarmayogiEmblem';

interface NationalReadinessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NationalReadinessModal({ isOpen, onClose }: NationalReadinessModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="readiness-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl bg-[#FAF6F0] border-2 border-[#BF9B7A]/40 shadow-2xl overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-[#555934] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 p-1 border border-white/20">
              <KarmayogiEmblemIcon className="h-8 w-8 text-[#F8C858]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-white/20 text-[#FAF6F0] border border-white/30 uppercase">
                  FRAC Strategic KPI • 2026 Mandate
                </span>
              </div>
              <h2 id="readiness-modal-title" className="text-sm sm:text-base font-black tracking-wide text-white mt-0.5">
                National Cadre Readiness Index (72.4%)
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close readiness modal"
            className="rounded-xl p-1.5 text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-[#2d1f17]">
          {/* Top Macro Banner */}
          <div className="p-4 rounded-2xl bg-white border border-[#BF9B7A]/30 flex items-center justify-between gap-4 shadow-2xs">
            <div>
              <span className="text-[10px] font-bold text-[#705849] uppercase tracking-wider block">
                Aggregated National Readiness
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-black font-mono text-[#555934]">72.4%</span>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-0.5">
                  <TrendingUp className="h-3.5 w-3.5" /> +4.2% QoQ
                </span>
              </div>
              <p className="text-[11px] text-[#705849] mt-1">
                Target: <strong>75.0%</strong> by end of Q3 2026 (Mission Karmayogi Bharat)
              </p>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/15 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-500/25">
              <Target className="h-8 w-8 text-emerald-700" />
            </div>
          </div>

          {/* Cadre by Cadre Breakdown */}
          <div className="space-y-3">
            <h3 className="font-bold text-[#555934] uppercase tracking-wider text-[11px]">
              Cadre-Wise FRAC Competency Baseline
            </h3>

            {/* ISS */}
            <div className="p-3.5 rounded-2xl bg-white border border-[#BF9B7A]/30 space-y-1.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-bold text-[#2d1f17]">Indian Statistical Service (ISS Cadre)</span>
                <span className="font-mono font-bold text-emerald-700">84.2% (Target Met)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#BF9B7A]/20 overflow-hidden">
                <div className="h-full rounded-full bg-emerald-600" style={{ width: '84.2%' }} />
              </div>
              <p className="text-[10px] text-[#705849]">820 Senior Officers • Level 4-5 Macro Scrutiny Qualified</p>
            </div>

            {/* SSS */}
            <div className="p-3.5 rounded-2xl bg-white border border-[#BF9B7A]/30 space-y-1.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-bold text-[#2d1f17]">Subordinate Statistical Service (SSS Cadre)</span>
                <span className="font-mono font-bold text-[#8C5B3E]">71.8% (Target 75%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#BF9B7A]/20 overflow-hidden">
                <div className="h-full rounded-full bg-[#8C5B3E]" style={{ width: '71.8%' }} />
              </div>
              <p className="text-[10px] text-[#705849]">2,150 JSOs and SSOs • Level 3 Demarcation &amp; Scrutiny</p>
            </div>

            {/* FOD */}
            <div className="p-3.5 rounded-2xl bg-white border border-[#BF9B7A]/30 space-y-1.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-bold text-[#2d1f17]">Field Operations Division (FOD Rural Cadre)</span>
                <span className="font-mono font-bold text-red-700">58.4% (Needs Focus)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#BF9B7A]/20 overflow-hidden">
                <div className="h-full rounded-full bg-red-600" style={{ width: '58.4%' }} />
              </div>
              <p className="text-[10px] text-[#705849]">1,880 Field Investigators • Primary bottleneck in Schedule 0.0 CEB listing</p>
            </div>
          </div>

          {/* Strategic Insight Box */}
          <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#BF9B7A]/30 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-[#8C5B3E] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-[#2d1f17] text-[11px]">Executive Recommendation</h4>
              <p className="text-[10.5px] text-[#705849] leading-relaxed mt-0.5">
                Reallocating 15 faculty trainers from Headquarters to Patna and Prayagraj ROs will close the 
                16.6% competency deficit in the FOD Rural Cadre within 4 weeks.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#FAF6F0] border-t border-[#BF9B7A]/30 px-6 py-3 flex items-center justify-between text-xs text-[#705849] shrink-0">
          <span className="text-[11px]">Registry Timestamp: 07 Sep 2026</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#555934] text-white text-xs font-bold hover:bg-[#434728] transition-colors cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
