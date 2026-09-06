'use client';

import React, { useState } from 'react';
import {
  X,
  Send,
  AlertTriangle,
  CheckCircle2,
  Target,
  ShieldCheck,
} from 'lucide-react';
import type { CohortData } from './BatchInspectionModal';

interface CohortRemediationModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetCohort: CohortData | null;
  onDispatched?: (details: { cohortName: string; competency: string; count: number }) => void;
}

export function CohortRemediationModal({
  isOpen,
  onClose,
  targetCohort,
  onDispatched,
}: CohortRemediationModalProps) {
  const [recipientScope, setRecipientScope] = useState<'AT_RISK' | 'ALL'>('AT_RISK');
  const [competency, setCompetency] = useState('comp-demarcation');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [passThreshold, setPassThreshold] = useState<number>(75);
  const [deadlineHours, setDeadlineHours] = useState<number>(48);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchedSuccess, setDispatchedSuccess] = useState(false);

  if (!isOpen) return null;

  const cohortName = targetCohort?.name || 'Selected Cohort';
  const atRiskCount = targetCohort?.atRiskCount || 6;
  const totalEnrolled = targetCohort?.enrolled || 48;

  const handleDispatch = () => {
    setIsDispatching(true);
    setTimeout(() => {
      setIsDispatching(false);
      setDispatchedSuccess(true);
      onDispatched?.({
        cohortName,
        competency,
        count: questionCount,
      });
      setTimeout(() => {
        setDispatchedSuccess(false);
        onClose();
      }, 2000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#BF9B7A]/40 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[#BF9B7A]/20 bg-[#FAF6F0]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#8C5B3E]/15 text-[#8C5B3E] border border-[#8C5B3E]/30">
                NSSTA Faculty Intervention
              </span>
              <span className="text-[10px] font-mono text-[#705849]">
                Rule FR-CONTENT-11
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#2d1f17] tracking-tight">
              Curate Remedial Drill
            </h2>
            <p className="text-xs text-[#705849]">
              Target: <span className="font-semibold text-[#2d1f17]">{cohortName}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white border border-[#BF9B7A]/30 text-[#705849] hover:bg-[#F2E6D8] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body Form */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
          {dispatchedSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="h-16 w-16 mx-auto rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center animate-bounce">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h3 className="text-lg font-bold text-[#2d1f17]">
                Remedial Drill Dispatched!
              </h3>
              <p className="text-xs text-[#705849] max-w-xs mx-auto">
                {questionCount} diagnostic questions have been assigned to {recipientScope === 'AT_RISK' ? `${atRiskCount} at-risk officers` : `all ${totalEnrolled} trainees`}. Offline sync activated.
              </p>
            </div>
          ) : (
            <>
              {/* Recipient Scope */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#2d1f17] flex items-center justify-between">
                  <span>Target Recipients</span>
                  <span className="text-[10px] text-[#705849] font-mono font-normal">
                    Select delivery scope
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRecipientScope('AT_RISK')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      recipientScope === 'AT_RISK'
                        ? 'bg-[#8C5B3E]/10 border-[#8C5B3E] text-[#8C5B3E]'
                        : 'bg-white border-[#BF9B7A]/30 text-[#705849] hover:bg-[#FAF6F0]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                      <span>At-Risk Officers Only</span>
                    </div>
                    <p className="text-[11px] text-[#705849] mt-0.5">
                      {atRiskCount} officers with score &lt; 60%
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRecipientScope('ALL')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      recipientScope === 'ALL'
                        ? 'bg-[#8C5B3E]/10 border-[#8C5B3E] text-[#8C5B3E]'
                        : 'bg-white border-[#BF9B7A]/30 text-[#705849] hover:bg-[#FAF6F0]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Target className="h-3.5 w-3.5 text-[#555934]" />
                      <span>Entire Cohort</span>
                    </div>
                    <p className="text-[11px] text-[#705849] mt-0.5">
                      All {totalEnrolled} trainees
                    </p>
                  </button>
                </div>
              </div>

              {/* Competency Focus */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#2d1f17]">
                  Deficient Competency Focus
                </label>
                <div className="space-y-1.5">
                  {[
                    {
                      id: 'comp-demarcation',
                      title: 'Schedule 0.0 Hamlet-Group Demarcation',
                      desc: 'Population bracket rules & boundary delineation (42% cohort error)',
                    },
                    {
                      id: 'comp-capi',
                      title: 'CAPI Tablet GPS Offset & Resync',
                      desc: 'Geofencing error protocol and fallback landmarks (29% cohort error)',
                    },
                    {
                      id: 'comp-nsso',
                      title: 'PLFS Schedule 10.4 UPAS vs CWS Activity Status',
                      desc: 'Borderline unpaid family helper coding (24% cohort error)',
                    },
                    {
                      id: 'comp-survey',
                      title: 'First Stage Unit Sampling Multipliers',
                      desc: 'Weight computation formula under NSS 79th Round (38% cohort error)',
                    },
                  ].map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setCompetency(c.id)}
                      className={`p-2.5 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between ${
                        competency === c.id
                          ? 'bg-[#555934]/10 border-[#555934] text-[#2d1f17]'
                          : 'bg-white border-[#BF9B7A]/25 text-[#705849] hover:bg-[#FAF6F0]'
                      }`}
                    >
                      <div>
                        <p className="font-bold text-xs">{c.title}</p>
                        <p className="text-[10px] text-[#705849]">{c.desc}</p>
                      </div>
                      <div
                        className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                          competency === c.id
                            ? 'border-[#555934] bg-[#555934] text-white'
                            : 'border-[#BF9B7A]'
                        }`}
                      >
                        {competency === c.id && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Drill Parameters (Questions, Benchmark, Deadline) */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#2d1f17]">Questions</label>
                  <select
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-[#BF9B7A]/30 text-xs text-[#2d1f17] bg-white focus:ring-1 focus:ring-[#8C5B3E]"
                  >
                    <option value={5}>5 Questions</option>
                    <option value={10}>10 Questions</option>
                    <option value={15}>15 Questions</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#2d1f17]">Passing %</label>
                  <select
                    value={passThreshold}
                    onChange={(e) => setPassThreshold(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-[#BF9B7A]/30 text-xs text-[#2d1f17] bg-white focus:ring-1 focus:ring-[#8C5B3E]"
                  >
                    <option value={70}>70% (Standard)</option>
                    <option value={75}>75% (Target)</option>
                    <option value={80}>80% (Mastery)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#2d1f17]">Deadline</label>
                  <select
                    value={deadlineHours}
                    onChange={(e) => setDeadlineHours(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-[#BF9B7A]/30 text-xs text-[#2d1f17] bg-white focus:ring-1 focus:ring-[#8C5B3E]"
                  >
                    <option value={24}>24 Hours</option>
                    <option value={48}>48 Hours</option>
                    <option value={72}>72 Hours</option>
                  </select>
                </div>
              </div>

              {/* Institutional Notice */}
              <div className="p-3 rounded-2xl bg-[#FAF6F0] border border-[#BF9B7A]/25 flex items-start gap-2.5 text-xs text-[#705849]">
                <ShieldCheck className="h-4 w-4 text-[#555934] shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  Remedial test items are extracted directly from the verified MoSPI question bank with statutory citation feedback upon trainee submission.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!dispatchedSuccess && (
          <div className="p-4 border-t border-[#BF9B7A]/20 bg-[#FAF6F0]/80 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white border border-[#BF9B7A]/30 text-xs font-bold text-[#705849] hover:bg-[#F2E6D8] transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDispatch}
              disabled={isDispatching}
              className="px-5 py-2.5 rounded-xl bg-[#8C5B3E] text-white text-xs font-bold hover:bg-[#704830] transition-colors shadow-2xs flex items-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isDispatching ? (
                <>
                  <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Packaging & Dispatching...</span>
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  <span>Dispatch Remediation Drill</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CohortRemediationModal;
