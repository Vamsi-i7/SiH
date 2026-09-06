'use client';

import React from 'react';
import type { DashboardUserProps } from '../RoleDashboardRouter';
import { TrainerKpiStrip } from './TrainerKpiStrip';
import { TrainerReviewTriageCard } from './TrainerReviewTriageCard';
import { TraineeErrorHeatmap } from './TraineeErrorHeatmap';
import { IngestedDocumentsLedger } from './IngestedDocumentsLedger';
import { BookOpen, GraduationCap, MapPin, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function TrainerDashboard({ user }: { user: DashboardUserProps }) {
  const facultyName = user.user_metadata?.name || 'Dr. Priya Verma';
  const facultyDesignation = user.user_metadata?.designation || 'Course Director';
  const facultyCadre = user.user_metadata?.cadre || 'NSSTA Faculty';

  return (
    <div data-testid="trainer-dashboard" className="space-y-6 pb-12">
      {/* Top Header & Faculty Profile */}
      <div className="rounded-3xl bg-white border border-[#BF9B7A]/30 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-[#8C5B3E] text-white flex items-center justify-center text-xl font-bold font-serif shrink-0 shadow-xs">
              PV
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#8C5B3E]/15 text-[#8C5B3E] border border-[#8C5B3E]/20">
                  <GraduationCap className="h-3.5 w-3.5" />
                  {facultyCadre}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FAF6F0] text-[#705849] border border-[#BF9B7A]/30">
                  National Statistical Systems Training Academy (NSSTA)
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2d1f17] tracking-tight">
                {facultyName}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-[#8C5B3E] mt-0.5">
                {facultyDesignation} • MoSPI Capacity Building & Examination Board
              </p>
              <p className="text-xs text-[#705849] flex items-center gap-1 mt-1">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-[#8C5B3E]" />
                NSSTA Campus, Plot No. 22, Knowledge Park II, Greater Noida, UP
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 pt-2 md:pt-0">
            <Link
              href="/documents"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#BF9B7A]/40 text-xs font-bold text-[#555934] hover:bg-[#FAF6F0]/80 transition-colors"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>MoSPI Manuals Repository</span>
            </Link>
            <Link
              href="/assignments"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#555934] text-white text-xs font-bold hover:bg-[#434728] transition-colors shadow-2xs"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Publish Assessment</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 5-Card KPI Strip */}
      <TrainerKpiStrip
        pendingReviewCount={14}
        approvedCount={342}
        ingestedManualsCount={6}
        assessedOfficersCount={1420}
        avgPassRate={68}
      />

      {/* High-Contrast Focused Triage Deck (Image 1 Style) */}
      <TrainerReviewTriageCard />

      {/* Diagnostic & Content Management Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Trainee Error Heatmap (6 cols) */}
        <div className="lg:col-span-6">
          <TraineeErrorHeatmap />
        </div>

        {/* Right Column: Ingested Documents Ledger (6 cols) */}
        <div className="lg:col-span-6">
          <IngestedDocumentsLedger />
        </div>
      </div>
    </div>
  );
}
