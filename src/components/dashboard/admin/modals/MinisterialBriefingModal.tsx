'use client';

import React, { useState } from 'react';
import { X, Download, Printer, ShieldCheck, FileCheck, CheckCircle2 } from 'lucide-react';
import { KarmayogiEmblemIcon } from '@/components/auth/KarmayogiEmblem';

interface MinisterialBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MinisterialBriefingModal({ isOpen, onClose }: MinisterialBriefingModalProps) {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleDownloadPdf = () => {
    setDownloadSuccess(true);
    setTimeout(() => {
      // Create and trigger download of an official text document representing the confidential memo
      const memoContent = `GOVERNMENT OF INDIA
MINISTRY OF STATISTICS AND PROGRAMME IMPLEMENTATION
SARDAR PATEL BHAWAN, SANSAD MARG, NEW DELHI - 110001
NATIONAL STATISTICAL COMMISSION (CABINET PROTOCOL SECRETARIAT)

MEMORANDUM REF: MoSPI/HQ/ADG/2026/MEMO-8821
DATE: 07 SEPTEMBER 2026
CLASSIFICATION: CONFIDENTIAL // CABINET BRIEFING

TO: SECRETARY, MINISTRY OF STATISTICS & PROGRAMME IMPLEMENTATION
FROM: RAJESH KUMAR, ADDITIONAL DIRECTOR GENERAL (DATA QUALITY & CADRE GOVERNANCE)

SUBJECT: STATUTORY CADRE COMPETENCY AUDIT & ECONOMETRIC SCRUTINY ERROR CORRELATION (Q2 2026)

1. EXECUTIVE SUMMARY:
   The national statistical workforce comprises 4,850 active personnel across ISS, SSS, and FOD cadres.
   National aggregate FRAC competency readiness stands at 72.4%, advancing towards the 75.0% Cabinet benchmark.
   Linear econometric regression demonstrates a strong inverse relationship (r = -0.84, R² = 0.706, p = 0.004)
   between verified competency levels and subsequent schedule scrutiny error rates.

2. REGIONAL OFFICE READINESS:
   - Western Zone (FOD Maharashtra): 76.0% Readiness (L3.6) | 6.8% Error Rate [OPTIMAL]
   - Southern Zone (FOD Kerala): 94.0% Readiness (L4.8) | 1.9% Error Rate [EXEMPLARY]
   - Eastern Zone (FOD West Bengal): 68.0% Readiness (L3.1) | 9.5% Error Rate [MONITORING]
   - Central-East (FOD UP East): 54.0% Readiness (L2.1) | 15.4% Error Rate [FLAGGED // INTERVENTION REQUIRED]
   - Eastern Zone (FOD Bihar): 46.0% Readiness (L1.2) | 19.8% Error Rate [FLAGGED // CRITICAL DEFICIT]

3. DIRECTIVES FOR CABINET APPROVAL:
   (a) Direct NSSTA Greater Noida to deploy emergency 5-day on-site demarcation bootcamps to Patna and Varanasi ROs.
   (b) Mandate CAPI offline cache cryptographic verification prior to Schedule 0.0 transmission.
   (c) Commission Q3 2026 National Assessment Sweep with biometric Karmayogi Bharat integration.

DIGITALLY SIGNED & VERIFIED:
Rajesh Kumar, ISS
Additional Director General, MoSPI Headquarters
National Statistical Commission Registry Node: NSC-DEL-2026-0907`;

      const blob = new Blob([memoContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'MoSPI_Ministerial_Briefing_Memo_Q2_2026.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 400);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="briefing-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-[#FAF6F0] border-2 border-[#BF9B7A]/40 shadow-2xl overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-[#2d1f17] text-[#FAF6F0] px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 p-1 border border-[#F8C858]/30">
              <KarmayogiEmblemIcon className="h-8 w-8 text-[#F8C858]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-[#F8C858]/20 text-[#F8C858] border border-[#F8C858]/30 uppercase">
                  CONFIDENTIAL // CABINET LEVEL
                </span>
                <span className="text-[10px] text-white/60 font-mono">Ref: MoSPI/HQ/ADG/2026/8821</span>
              </div>
              <h2 id="briefing-modal-title" className="text-sm sm:text-base font-black tracking-wide text-white mt-0.5">
                Secretary Briefing Memorandum (PDF Preview)
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close briefing modal"
            className="rounded-xl p-1.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Document Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-[#2d1f17] text-xs">
          {/* Official Letterhead */}
          <div className="text-center pb-4 border-b border-[#BF9B7A]/30 space-y-1">
            <div className="flex justify-center mb-1">
              <KarmayogiEmblemIcon className="h-10 w-10 text-[#555934]" />
            </div>
            <p className="font-serif font-black text-sm text-[#2d1f17] tracking-wider uppercase">
              Government of India • Ministry of Statistics &amp; Programme Implementation
            </p>
            <p className="text-[11px] font-semibold text-[#8C5B3E]">
              National Statistical Commission (NSC) • Workforce Quality Triage Directorate
            </p>
            <p className="text-[10px] text-muted-foreground font-mono">
              Sardar Patel Bhawan, Sansad Marg, New Delhi — 110001
            </p>
          </div>

          {/* Memorandum Meta Table */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#BF9B7A]/30 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
            <div>
              <span className="text-muted-foreground font-semibold block text-[10px]">Addressed To:</span>
              <span className="font-bold text-[#2d1f17]">Secretary (MoSPI)</span>
            </div>
            <div>
              <span className="text-muted-foreground font-semibold block text-[10px]">Originating Officer:</span>
              <span className="font-bold text-[#2d1f17]">Rajesh Kumar, ADG</span>
            </div>
            <div>
              <span className="text-muted-foreground font-semibold block text-[10px]">Date of Audit:</span>
              <span className="font-bold font-mono text-[#2d1f17]">07 Sep 2026</span>
            </div>
            <div>
              <span className="text-muted-foreground font-semibold block text-[10px]">Security Clearance:</span>
              <span className="font-bold text-emerald-700">NSC Certified</span>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-[#555934] uppercase tracking-wide flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[#555934]" />
              1. Executive Summary &amp; Empirical Findings
            </h3>
            <p className="leading-relaxed text-muted-foreground text-[11.5px]">
              A rigorous econometric regression of the 4,850 active statistical workforce records against 
              subsequent NSS Schedule scrutiny returns validates the core hypothesis of the National Capacity Building Commission:
              <strong> higher verified competency levels systematically drive down field scrutiny error rates</strong>.
            </p>
            <div className="p-3 rounded-xl bg-[#FAF6F0] border border-[#BF9B7A]/30 grid grid-cols-3 gap-2 font-mono text-center">
              <div>
                <span className="text-[9px] text-muted-foreground block">Regression Pearson r</span>
                <span className="text-sm font-black text-[#8C5B3E]">-0.84</span>
              </div>
              <div>
                <span className="text-[9px] text-muted-foreground block">Coefficient of Det. (R²)</span>
                <span className="text-sm font-black text-[#2d1f17]">0.706</span>
              </div>
              <div>
                <span className="text-[9px] text-muted-foreground block">Statistical Significance</span>
                <span className="text-sm font-black text-emerald-700">p = 0.004</span>
              </div>
            </div>
          </div>

          {/* Regional Office Status */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-[#555934] uppercase tracking-wide flex items-center gap-1.5">
              <FileCheck className="h-4 w-4 text-[#555934]" />
              2. Zonal Office Triage Matrix
            </h3>
            <div className="overflow-x-auto rounded-xl border border-[#BF9B7A]/30">
              <table className="w-full text-left text-[11px] bg-white">
                <thead className="bg-[#FAF6F0] border-b border-[#BF9B7A]/30 font-bold text-muted-foreground">
                  <tr>
                    <th className="p-2.5">Regional Office</th>
                    <th className="p-2.5">Headcount</th>
                    <th className="p-2.5">Readiness</th>
                    <th className="p-2.5">Error Rate</th>
                    <th className="p-2.5 text-right">Cadre Health</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#BF9B7A]/15 font-mono">
                  <tr>
                    <td className="p-2.5 font-sans font-bold">FOD Bihar RO (Patna)</td>
                    <td className="p-2.5">520</td>
                    <td className="p-2.5 text-red-700 font-bold">46% (L1.2)</td>
                    <td className="p-2.5 text-red-700 font-bold">19.8%</td>
                    <td className="p-2.5 text-right font-sans text-red-700 font-bold">CRITICAL FLAG</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans font-bold">FOD UP East RO (Prayagraj)</td>
                    <td className="p-2.5">610</td>
                    <td className="p-2.5 text-amber-700 font-bold">54% (L2.1)</td>
                    <td className="p-2.5 text-amber-700 font-bold">15.4%</td>
                    <td className="p-2.5 text-right font-sans text-amber-700 font-bold">HIGH RISK</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans font-bold">FOD Maharashtra RO</td>
                    <td className="p-2.5">740</td>
                    <td className="p-2.5 text-emerald-700 font-bold">76% (L3.6)</td>
                    <td className="p-2.5 text-emerald-700 font-bold">6.8%</td>
                    <td className="p-2.5 text-right font-sans text-emerald-700 font-bold">OPTIMAL</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans font-bold">FOD Kerala RO</td>
                    <td className="p-2.5">580</td>
                    <td className="p-2.5 text-emerald-700 font-bold">94% (L4.8)</td>
                    <td className="p-2.5 text-emerald-700 font-bold">1.9%</td>
                    <td className="p-2.5 text-right font-sans text-emerald-700 font-bold">EXEMPLARY</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Statutory Signoff */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#BF9B7A]/30 flex items-center justify-between text-[11px]">
            <div>
              <p className="font-bold text-[#2d1f17]">Rajesh Kumar, ISS</p>
              <p className="text-muted-foreground">Additional Director General, MoSPI</p>
              <p className="text-[10px] font-mono text-[#555934]">Digital Certificate Hash: SHA256:7f4a...91b8</p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="h-3 w-3" />
                Cabinet Verified
              </span>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="bg-[#FAF6F0] border-t border-[#BF9B7A]/30 px-6 py-4 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#BF9B7A]/40 text-xs font-bold text-muted-foreground hover:bg-white transition-colors cursor-pointer"
          >
            Close Document
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#BF9B7A]/40 text-xs font-bold text-[#555934] hover:bg-[#FAF6F0] transition-colors cursor-pointer shadow-2xs"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Memo</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#555934] text-white text-xs font-bold hover:bg-[#434728] transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Download className="h-3.5 w-3.5 text-[#F8C858]" />
              <span>{downloadSuccess ? 'Downloaded!' : 'Download Official PDF'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
