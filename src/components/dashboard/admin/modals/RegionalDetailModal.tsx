'use client';

import React, { useState } from 'react';
import { X, MapPin, Users, AlertTriangle, CheckCircle2, Send } from 'lucide-react';

export interface RegionalOfficeData {
  id: string;
  name: string;
  zone: string;
  headcount: number;
  readinessPercent: number;
  avgLevel: string;
  errorRate: number;
  isFlagged: boolean;
}

interface RegionalDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  office: RegionalOfficeData | null;
  onDispatchTriage?: (roName: string) => void;
}

export function RegionalDetailModal({
  isOpen,
  onClose,
  office,
  onDispatchTriage,
}: RegionalDetailModalProps) {
  const [triageSent, setTriageSent] = useState(false);

  if (!isOpen || !office) return null;

  const isCritical = office.readinessPercent < 60 || office.errorRate > 12;

  const handleSendTriage = () => {
    setTriageSent(true);
    if (onDispatchTriage) {
      onDispatchTriage(office.name);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ro-detail-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl bg-[#FAF6F0] border-2 border-[#BF9B7A]/40 shadow-2xl overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-[#555934] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 p-1 border border-white/20">
              <MapPin className="h-6 w-6 text-[#F8C858]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-white/20 text-[#FAF6F0] border border-white/30 uppercase">
                  {office.zone}
                </span>
                {isCritical && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500 text-white uppercase">
                    Priority Attention
                  </span>
                )}
              </div>
              <h2 id="ro-detail-modal-title" className="text-sm sm:text-base font-black tracking-wide text-white mt-0.5">
                {office.name}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close regional detail modal"
            className="rounded-xl p-1.5 text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-[#2d1f17]">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-white border border-[#BF9B7A]/30 text-center">
              <span className="text-[10px] font-bold text-[#705849] block">Total Personnel</span>
              <span className="text-xl font-extrabold font-mono text-[#2d1f17]">{office.headcount}</span>
              <span className="text-[9px] text-[#705849] block">FOD &amp; SSS Cadres</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-[#BF9B7A]/30 text-center">
              <span className="text-[10px] font-bold text-[#705849] block">Workforce Readiness</span>
              <span className={`text-xl font-extrabold font-mono ${office.readinessPercent >= 70 ? 'text-emerald-700' : 'text-[#8C5B3E]'}`}>
                {office.readinessPercent}%
              </span>
              <span className="text-[9px] text-[#705849] block">Avg: {office.avgLevel}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-[#BF9B7A]/30 text-center">
              <span className="text-[10px] font-bold text-[#705849] block">Scrutiny Error Rate</span>
              <span className={`text-xl font-extrabold font-mono ${office.errorRate > 12 ? 'text-red-700' : 'text-[#2d1f17]'}`}>
                {office.errorRate}%
              </span>
              <span className="text-[9px] text-[#705849] block">NSS Returns</span>
            </div>
          </div>

          {/* Cadre Breakdown */}
          <div className="p-4 rounded-2xl bg-white border border-[#BF9B7A]/30 space-y-2">
            <h3 className="font-bold text-[#555934] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-[#555934]" />
              Cadre Headcount Breakdown
            </h3>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-[#705849]">Field Investigators (FOD Rural Cadre)</span>
                <span className="font-mono font-bold text-[#2d1f17]">{Math.round(office.headcount * 0.65)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#705849]">Junior Statistical Officers (SSS Cadre)</span>
                <span className="font-mono font-bold text-[#2d1f17]">{Math.round(office.headcount * 0.25)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#705849]">Senior Officers &amp; Directors (ISS Cadre)</span>
                <span className="font-mono font-bold text-[#2d1f17]">{Math.round(office.headcount * 0.10)}</span>
              </div>
            </div>
          </div>

          {/* Root Cause Analysis of Scrutiny Errors */}
          <div className="p-4 rounded-2xl bg-white border border-[#BF9B7A]/30 space-y-2">
            <h3 className="font-bold text-[#8C5B3E] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-[#8C5B3E]" />
              Dominant Error Clusters (Last 90 Days)
            </h3>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-[#2d1f17] font-semibold">Schedule 0.0 Household Demarcation</span>
                  <span className="font-mono text-red-700 font-bold">{isCritical ? '42%' : '14%'}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[#BF9B7A]/20">
                  <div
                    className="h-full rounded-full bg-red-600"
                    style={{ width: isCritical ? '42%' : '14%' }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-[#2d1f17] font-semibold">NIC-2008 &amp; NCO-2015 5-Digit Coding</span>
                  <span className="font-mono text-[#8C5B3E] font-bold">{isCritical ? '31%' : '18%'}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[#BF9B7A]/20">
                  <div
                    className="h-full rounded-full bg-[#8C5B3E]"
                    style={{ width: isCritical ? '31%' : '18%' }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-[#2d1f17] font-semibold">ASHE Capital Asset Enterprise Valuation</span>
                  <span className="font-mono text-[#555934] font-bold">{isCritical ? '27%' : '10%'}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[#BF9B7A]/20">
                  <div
                    className="h-full rounded-full bg-[#555934]"
                    style={{ width: isCritical ? '27%' : '10%' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Triage Dispatch Card */}
          {triageSent ? (
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between text-[11px] text-emerald-900 font-bold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                <span>NSSTA Mobile Training Unit dispatched to {office.name}!</span>
              </div>
              <span className="font-mono text-[10px]">Triage Ref: TR-Patna-0907</span>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#BF9B7A]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-[#2d1f17] text-[11px]">NSSTA Remedial Intervention</h4>
                <p className="text-[10px] text-[#705849]">
                  Deploy targeted 5-day competency booster modules and faculty mentors to this RO.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSendTriage}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#555934] text-white font-bold text-xs hover:bg-[#434728] transition-colors cursor-pointer shadow-xs shrink-0"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Dispatch Triage</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#FAF6F0] border-t border-[#BF9B7A]/30 px-6 py-3 flex items-center justify-between text-xs text-[#705849] shrink-0">
          <span className="text-[11px]">Audit Source: NSS Scrutiny System 2026</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-[#BF9B7A]/40 text-xs font-bold text-[#705849] hover:bg-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
