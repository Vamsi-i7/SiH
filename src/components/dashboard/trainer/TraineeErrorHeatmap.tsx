'use client';

import React from 'react';
import { Flame, AlertTriangle, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface ErrorPoint {
  id: string;
  topic: string;
  cadre: string;
  competencyId: string;
  errorRatePercent: number;
  sampleCount: number;
  criticality: 'CRITICAL' | 'WARNING' | 'MODERATE';
}

const CURRICULUM_ERROR_POINTS: ErrorPoint[] = [
  {
    id: 'err-1',
    topic: 'Hamlet-Group Formation & Schedule 0.0 Listing Rules',
    cadre: 'FOD Field Investigators (Rural Sectors)',
    competencyId: 'comp-demarcation',
    errorRatePercent: 42,
    sampleCount: 680,
    criticality: 'CRITICAL',
  },
  {
    id: 'err-2',
    topic: 'Multi-Stage Sampling & Multiplier (Weight) Estimations',
    cadre: 'SSS Junior Statistical Officers (CSO/DQAD)',
    competencyId: 'comp-survey',
    errorRatePercent: 38,
    sampleCount: 420,
    criticality: 'CRITICAL',
  },
  {
    id: 'err-3',
    topic: 'CAPI GPS Geofencing Offset & Resynchronization Protocols',
    cadre: 'NSSO FOD Field Investigators',
    competencyId: 'comp-capi',
    errorRatePercent: 29,
    sampleCount: 750,
    criticality: 'WARNING',
  },
  {
    id: 'err-4',
    topic: 'NSSO UPAS vs Current Weekly Status (CWS) Borderline Codes',
    cadre: 'PLFS Enumeration & Scrutiny Cadres',
    competencyId: 'comp-nsso',
    errorRatePercent: 24,
    sampleCount: 530,
    criticality: 'WARNING',
  },
  {
    id: 'err-5',
    topic: 'Inter-Round Computerized Scrutiny Consistency Checks',
    cadre: 'Subordinate Statistical Service (SSS)',
    competencyId: 'comp-data',
    errorRatePercent: 16,
    sampleCount: 390,
    criticality: 'MODERATE',
  },
];

export function TraineeErrorHeatmap() {
  return (
    <div className="rounded-3xl bg-white border border-[#BF9B7A]/30 p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-[#BF9B7A]/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-600" />
            <h2 className="text-lg font-bold text-[#2d1f17]">
              Trainee Curriculum Error Heatmap
            </h2>
          </div>
          <p className="text-xs text-[#705849] mt-0.5">
            FR-CONTENT-11 • Diagnostic failure rates aggregated across recent cohort assessments
          </p>
        </div>

        <Link
          href="/assignments"
          className="text-xs font-bold text-[#555934] hover:text-[#434728] inline-flex items-center gap-1 shrink-0"
        >
          <span>Curate Targeted Drill</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-5 space-y-4">
        {CURRICULUM_ERROR_POINTS.map((point) => {
          return (
            <div
              key={point.id}
              className="rounded-2xl border border-[#BF9B7A]/30 bg-[#FAF6F0]/60 p-4 hover:border-[#BF9B7A] transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                      point.criticality === 'CRITICAL'
                        ? 'bg-red-500/15 text-red-700 border border-red-500/30'
                        : point.criticality === 'WARNING'
                          ? 'bg-amber-500/15 text-amber-700 border border-amber-500/30'
                          : 'bg-blue-500/15 text-blue-700 border border-blue-500/30'
                    }`}>
                      {point.criticality === 'CRITICAL' ? (
                        <Flame className="h-3 w-3" />
                      ) : (
                        <AlertTriangle className="h-3 w-3" />
                      )}
                      {point.errorRatePercent}% Error Rate
                    </span>
                    <span className="text-[11px] text-[#705849] font-medium truncate">
                      {point.cadre}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#2d1f17]">{point.topic}</h3>
                </div>

                <div className="shrink-0 text-right">
                  <span className="text-xs font-mono font-bold text-[#705849]">
                    N = {point.sampleCount} trainees
                  </span>
                </div>
              </div>

              {/* Progress bar visual */}
              <div className="mt-3">
                <div className="h-2 w-full rounded-full bg-[#BF9B7A]/20 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      point.criticality === 'CRITICAL'
                        ? 'bg-red-600'
                        : point.criticality === 'WARNING'
                          ? 'bg-amber-500'
                          : 'bg-blue-600'
                    }`}
                    style={{ width: `${point.errorRatePercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
