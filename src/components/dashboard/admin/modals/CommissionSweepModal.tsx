'use client';

import React, { useState } from 'react';
import { X, Send, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { KarmayogiEmblemIcon } from '@/components/auth/KarmayogiEmblem';

interface CommissionSweepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (orderId: string) => void;
}

export function CommissionSweepModal({
  isOpen,
  onClose,
  onSuccess,
}: CommissionSweepModalProps) {
  const [targetZones, setTargetZones] = useState<string[]>([
    'Eastern Zone',
    'Central-East Zone',
    'Western Zone',
    'Southern Zone',
  ]);
  const [mandatorySurveys, setMandatorySurveys] = useState<string[]>([
    'PLFS 2026',
    'ASHE 2026',
    'Schedule 0.0 Listing',
  ]);
  const [mandateDeadline, setMandateDeadline] = useState('2026-10-15');
  const [facultyLead, setFacultyLead] = useState('Dr. Priya Verma (NSSTA)');
  const [isCommissioned, setIsCommissioned] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleZone = (zone: string) => {
    setTargetZones((prev) =>
      prev.includes(zone) ? prev.filter((z) => z !== zone) : [...prev, zone]
    );
  };

  const handleCommission = () => {
    const generatedId = `ORDER/MOSPI/2026/SWEEP-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderId(generatedId);
    setIsCommissioned(true);
    if (onSuccess) {
      onSuccess(generatedId);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sweep-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-xl rounded-3xl bg-[#FAF6F0] border-2 border-[#BF9B7A]/40 shadow-2xl overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-[#555934] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 p-1 border border-white/20">
              <KarmayogiEmblemIcon className="h-8 w-8 text-[#F8C858]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-white/20 text-[#FAF6F0] border border-white/30 uppercase">
                  Executive Order Dispatch
                </span>
              </div>
              <h2 id="sweep-modal-title" className="text-sm sm:text-base font-black tracking-wide text-white mt-0.5">
                Commission Q3 Assessment Sweep
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sweep modal"
            className="rounded-xl p-1.5 text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs text-[#2d1f17]">
          {isCommissioned ? (
            <div className="p-6 rounded-2xl bg-white border border-emerald-500/30 text-center space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h3 className="text-base font-bold text-[#2d1f17]">
                Statutory Assessment Sweep Authorized
              </h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Official dispatch notification transmitted to NSSTA Greater Noida and all participating Regional Offices.
              </p>
              <div className="p-3 rounded-xl bg-[#FAF6F0] border border-[#BF9B7A]/30 font-mono text-xs">
                <span className="text-[10px] text-muted-foreground block">EXECUTIVE ORDER ID</span>
                <span className="font-bold text-[#555934] text-sm">{orderId}</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 px-5 py-2 rounded-xl bg-[#555934] text-white text-xs font-bold hover:bg-[#434728] transition-colors cursor-pointer shadow-xs"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground leading-relaxed">
                Issue a binding statutory order under the National Statistical Commission guidelines mandating 
                comprehensive competency re-assessments across target regional zones.
              </p>

              {/* Target Regional Zones */}
              <div className="space-y-2">
                <label className="font-bold text-[#2d1f17] block">
                  1. Target Regional Zones ({targetZones.length} selected)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Eastern Zone',
                    'Central-East Zone',
                    'Western Zone',
                    'Southern Zone',
                    'Northern Zone',
                    'North-Eastern Zone',
                  ].map((zone) => {
                    const isSelected = targetZones.includes(zone);
                    return (
                      <button
                        key={zone}
                        type="button"
                        onClick={() => toggleZone(zone)}
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white border-[#555934] text-[#555934] font-bold shadow-2xs'
                            : 'bg-[#FAF6F0]/60 border-[#BF9B7A]/30 text-muted-foreground'
                        }`}
                      >
                        <span className="text-[11px] truncate">{zone}</span>
                        {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-[#555934] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Survey Cohorts */}
              <div className="space-y-2">
                <label className="font-bold text-[#2d1f17] block">
                  2. Mandatory Survey Focus Areas
                </label>
                <div className="flex flex-wrap gap-2">
                  {['PLFS 2026', 'ASHE 2026', 'Schedule 0.0 Listing', 'ASI Scrutiny'].map((survey) => {
                    const active = mandatorySurveys.includes(survey);
                    return (
                      <button
                        key={survey}
                        type="button"
                        onClick={() =>
                          setMandatorySurveys((prev) =>
                            prev.includes(survey)
                              ? prev.filter((s) => s !== survey)
                              : [...prev, survey]
                          )
                        }
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          active
                            ? 'bg-[#8C5B3E] text-white shadow-2xs'
                            : 'bg-white text-muted-foreground border border-[#BF9B7A]/30'
                        }`}
                      >
                        {survey}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Deadline & Lead Faculty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-muted-foreground text-[11px] block">
                    Mandatory Completion Deadline
                  </label>
                  <input
                    type="date"
                    value={mandateDeadline}
                    onChange={(e) => setMandateDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#BF9B7A]/30 text-xs text-[#2d1f17] focus:outline-none focus:ring-2 focus:ring-[#555934]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-muted-foreground text-[11px] block">
                    NSSTA Academic Lead
                  </label>
                  <input
                    type="text"
                    value={facultyLead}
                    onChange={(e) => setFacultyLead(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#BF9B7A]/30 text-xs text-[#2d1f17] focus:outline-none focus:ring-2 focus:ring-[#555934]"
                  />
                </div>
              </div>

              {/* Signoff Ribbon */}
              <div className="p-3 rounded-xl bg-white border border-[#BF9B7A]/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#555934]" />
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    Authorizing Officer: <strong>Rajesh Kumar (ADG)</strong>
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 font-bold">
                  Cabinet Token Ready
                </span>
              </div>
            </>
          )}
        </div>

        {/* Action Footer */}
        {!isCommissioned && (
          <div className="bg-[#FAF6F0] border-t border-[#BF9B7A]/30 px-6 py-4 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#BF9B7A]/40 text-xs font-bold text-muted-foreground hover:bg-white transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleCommission}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#555934] text-white text-xs font-bold hover:bg-[#434728] transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Issue Executive Order</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
