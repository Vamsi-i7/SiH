'use client';

import React from 'react';
import { Users, Target, AlertTriangle, Flag, Layers } from 'lucide-react';

interface AdminKpiStripProps {
  totalHeadcount?: number;
  workforceReadiness?: number;
  scrutinyErrorRate?: number;
  priorityFlaggedCount?: number;
  activeCohortsCount?: number;
}

export function AdminKpiStrip({
  totalHeadcount = 4850,
  workforceReadiness = 72.4,
  scrutinyErrorRate = 8.2,
  priorityFlaggedCount = 2,
  activeCohortsCount = 4,
}: AdminKpiStripProps) {
  const kpis = [
    {
      id: 'headcount',
      label: 'Total Headcount',
      value: totalHeadcount.toLocaleString(),
      subtext: 'MoSPI, FOD & SSS Cadres',
      icon: Users,
      bgColor: 'bg-[#555934]/15',
      textColor: 'text-[#555934]',
    },
    {
      id: 'readiness',
      label: 'Workforce Readiness',
      value: `${workforceReadiness}%`,
      subtext: 'FRAC Target: 70% Met',
      icon: Target,
      bgColor: 'bg-emerald-500/15',
      textColor: 'text-emerald-700',
    },
    {
      id: 'error_rate',
      label: 'Scrutiny Error Rate',
      value: `${scrutinyErrorRate}%`,
      subtext: '-4.1% Reduction QoQ',
      icon: AlertTriangle,
      bgColor: 'bg-[#BF9B7A]/25',
      textColor: 'text-[#593E2E]',
    },
    {
      id: 'flagged',
      label: 'Priority Flagged ROs',
      value: priorityFlaggedCount.toString(),
      subtext: 'FOD Bihar & FOD UP East',
      icon: Flag,
      bgColor: 'bg-red-500/15',
      textColor: 'text-red-700',
    },
    {
      id: 'cohorts',
      label: 'Active Cohorts',
      value: activeCohortsCount.toString(),
      subtext: 'PLFS, HCES, ASI, CAPI',
      icon: Layers,
      bgColor: 'bg-[#F8C858]/25',
      textColor: 'text-[#8C5B3E]',
    },
  ];

  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.id}
            className="rounded-2xl bg-white border border-[#BF9B7A]/30 p-4 shadow-2xs hover:shadow-xs transition-all hover:scale-101 flex items-center gap-3.5"
          >
            <div className={`h-11 w-11 rounded-2xl ${kpi.bgColor} flex items-center justify-center shrink-0`}>
              <Icon className={`h-5 w-5 ${kpi.textColor}`} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-[#705849] truncate leading-tight">
                {kpi.label}
              </p>
              <p className="text-xl sm:text-2xl font-extrabold text-[#2d1f17] tracking-tight mt-0.5 font-mono">
                {kpi.value}
              </p>
              <p className="text-[10px] font-medium text-[#705849]/80 truncate">
                {kpi.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
