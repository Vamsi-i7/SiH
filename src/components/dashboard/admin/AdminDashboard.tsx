'use client';

import React from 'react';
import type { DashboardUserProps } from '../RoleDashboardRouter';
import { AdminKpiStrip } from './AdminKpiStrip';
import { AdminAiNarrativeBox } from './AdminAiNarrativeBox';
import { OutcomeCorrelationChart } from './OutcomeCorrelationChart';
import { DepartmentBreakdownTable } from './DepartmentBreakdownTable';
import { AdminCabinetDrawer } from './AdminCabinetDrawer';
import { ShieldCheck, MapPin } from 'lucide-react';

export default function AdminDashboard({ user }: { user: DashboardUserProps }) {
  const adminName = user.user_metadata?.name || 'Rajesh Kumar';
  const adminDesignation = user.user_metadata?.designation || 'Additional Director General';
  const adminCadre = user.user_metadata?.cadre || 'MoSPI Headquarters';

  return (
    <div data-testid="admin-dashboard" className="space-y-6 pb-12">
      {/* Top Header & Administrative Profile */}
      <div className="rounded-3xl bg-white border border-[#BF9B7A]/30 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-[#555934] text-white flex items-center justify-center text-xl font-bold font-serif shrink-0 shadow-xs">
              RK
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#555934]/15 text-[#555934] border border-[#555934]/20">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  National Executive Command
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FAF6F0] text-[#705849] border border-[#BF9B7A]/30">
                  {adminCadre}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2d1f17] tracking-tight">
                {adminName}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-[#8C5B3E] mt-0.5">
                {adminDesignation} • Workforce Strategy &amp; Statistical Governance
              </p>
              <p className="text-xs text-[#705849] flex items-center gap-1 mt-1">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-[#8C5B3E]" />
                Ministry of Statistics &amp; Programme Implementation, Sardar Patel Bhawan, New Delhi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
            <div className="p-3 rounded-2xl bg-[#FAF6F0] border border-[#BF9B7A]/30 text-right">
              <span className="text-[11px] font-bold text-[#705849] block">Statistical Authority</span>
              <span className="text-xs font-black text-[#555934]">National Sample Survey (NSS)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Card Macro KPI Strip */}
      <AdminKpiStrip />

      {/* AI Executive Intelligence Briefing (Image 1 Style High-Contrast Dark Slate) */}
      <AdminAiNarrativeBox />

      {/* Outcome Correlation Scatter Chart (PRD Lever 2 & §9.4.5) */}
      <OutcomeCorrelationChart />

      {/* Regional Office Breakdown & Ministerial Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Department Breakdown Table with Live Flag Action (8 cols) */}
        <div className="lg:col-span-8">
          <DepartmentBreakdownTable />
        </div>

        {/* Right Column: Ministerial Reports & Cabinet Drawer (4 cols) */}
        <div className="lg:col-span-4">
          <AdminCabinetDrawer />
        </div>
      </div>
    </div>
  );
}
