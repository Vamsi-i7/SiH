'use client';

import React, { useState } from 'react';
import type { DashboardUserProps } from '@/components/dashboard/RoleDashboardRouter';
import { TrainerKpiStrip } from './TrainerKpiStrip';
import { TrainerReviewTriageCard } from './TrainerReviewTriageCard';
import { TraineeErrorHeatmap } from './TraineeErrorHeatmap';
import { IngestedDocumentsLedger } from './IngestedDocumentsLedger';
import { HorizontalTrainerCarousels } from './HorizontalTrainerCarousels';
import { TrainerCohortStudio } from './tabs/TrainerCohortStudio';
import { TrainerCurriculumStudio } from './tabs/TrainerCurriculumStudio';
import { TrainerDiagnosticsStudio } from './tabs/TrainerDiagnosticsStudio';
import { BatchInspectionModal, type CohortData } from './modals/BatchInspectionModal';
import { CohortRemediationModal } from './modals/CohortRemediationModal';
import { ItemAnalysisModal, type ItemAnalysisData } from './modals/ItemAnalysisModal';
import { ManualReaderModal } from '../learner/modals/ManualReaderModal';
import { OfficerDossierModal } from '../learner/modals/OfficerDossierModal';
import { DEMO_PERSONAS } from '@/lib/demoPersonas';
import {
  BookOpen,
  GraduationCap,
  MapPin,
  Sparkles,
  LayoutDashboard,
  Users,
  Brain,
  BarChart3,
  UserCheck,
} from 'lucide-react';
import Link from 'next/link';

export default function TrainerDashboard({ user }: { user: DashboardUserProps }) {
  const facultyName = user.user_metadata?.name || 'Dr. Priya Verma';
  const facultyDesignation = user.user_metadata?.designation || 'Course Director';
  const facultyCadre = user.user_metadata?.cadre || 'NSSTA Faculty';

  const [activeTab, setActiveTab] = useState<'command' | 'cohorts' | 'curriculum' | 'diagnostics'>('command');

  // Modals state
  const [selectedCohortForInspection, setSelectedCohortForInspection] = useState<CohortData | null>(null);
  const [selectedCohortForRemediation, setSelectedCohortForRemediation] = useState<CohortData | null>(null);
  const [selectedItemForAnalysis, setSelectedItemForAnalysis] = useState<ItemAnalysisData | null>(null);
  const [selectedManualId, setSelectedManualId] = useState<string | null>(null);
  const [dossierOpen, setDossierOpen] = useState(false);

  const trainerPersona = DEMO_PERSONAS.find((p) => p.role === 'trainer') || {
    id: 'demo-priya',
    name: facultyName,
    email: user.email || 'priya.verma@nssta.gov.in',
    role: 'trainer',
    organization_id: 'org-nssta',
    cadre: facultyCadre,
    designation: facultyDesignation,
    preferred_language: 'en' as const,
    department: 'NSSTA',
  };

  return (
    <div data-testid="trainer-dashboard" className="space-y-6 pb-12">
      {/* ════════════════════════════════════════════════════════════════
          1. HERO FACULTY HEADER & PROFILE
          ════════════════════════════════════════════════════════════════ */}
      <div className="rounded-3xl bg-white border border-[#BF9B7A]/30 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <button
              type="button"
              onClick={() => setDossierOpen(true)}
              className="h-14 w-14 rounded-2xl bg-[#8C5B3E] text-white flex items-center justify-center text-xl font-bold font-serif shrink-0 shadow-xs hover:scale-105 transition-transform cursor-pointer"
              title="Click to view Official Faculty Dossier"
            >
              PV
            </button>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#8C5B3E]/15 text-[#8C5B3E] border border-[#8C5B3E]/20">
                  <GraduationCap className="h-3.5 w-3.5" />
                  {facultyCadre}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FAF6F0] text-muted-foreground border border-[#BF9B7A]/30">
                  National Statistical Systems Training Academy (NSSTA)
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2d1f17] tracking-tight">
                {facultyName}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-[#8C5B3E] mt-0.5">
                {facultyDesignation} • MoSPI Capacity Building & Examination Board
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-[#8C5B3E]" />
                NSSTA Campus, Plot No. 22, Knowledge Park II, Greater Noida, UP
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 md:pt-0">
            <button
              type="button"
              onClick={() => setDossierOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#BF9B7A]/40 text-xs font-bold text-[#8C5B3E] hover:bg-[#FAF6F0]/80 transition-colors cursor-pointer"
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>Faculty Dossier</span>
            </button>

            <Link
              href="/documents"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#BF9B7A]/40 text-xs font-bold text-[#555934] hover:bg-[#FAF6F0]/80 transition-colors"
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

      {/* ════════════════════════════════════════════════════════════════
          2. MULTI-DECK TABS SWITCHER
          ════════════════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          {
            id: 'command',
            label: 'Faculty Command Desk',
            icon: LayoutDashboard,
            badge: '14 QA',
          },
          {
            id: 'cohorts',
            label: 'Academy Cohorts & Progression',
            icon: Users,
            badge: '4 Batches',
          },
          {
            id: 'curriculum',
            label: 'Curriculum & Question Studio',
            icon: Brain,
            badge: '342 Items',
          },
          {
            id: 'diagnostics',
            label: 'Item Diagnostics & Zonal Disparities',
            icon: BarChart3,
            badge: '5 ZTCs',
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as 'command' | 'cohorts' | 'curriculum' | 'diagnostics')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-2xs ${
                isActive
                  ? 'bg-[#8C5B3E] text-white shadow-xs'
                  : 'bg-white border border-[#BF9B7A]/30 text-muted-foreground hover:bg-[#FAF6F0] hover:text-[#2d1f17]'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-[#FAF6F0] text-[#8C5B3E] border border-[#BF9B7A]/25'
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* ════════════════════════════════════════════════════════════════
          3. TAB 1: FACULTY COMMAND & QA TRIAGE
          ════════════════════════════════════════════════════════════════ */}
      {activeTab === 'command' && (
        <div className="space-y-6">
          {/* 5-Card KPI Strip */}
          <TrainerKpiStrip
            pendingReviewCount={14}
            approvedCount={342}
            ingestedManualsCount={6}
            assessedOfficersCount={1420}
            avgPassRate={68}
          />

          {/* High-Contrast Focused Triage Deck */}
          <TrainerReviewTriageCard
            onInspectItem={(item) => setSelectedItemForAnalysis(item)}
          />

          {/* Dual Horizontal Carousels */}
          <HorizontalTrainerCarousels
            onInspectCohort={(cohort) => setSelectedCohortForInspection(cohort)}
            onRemediateCohort={(cohort) => setSelectedCohortForRemediation(cohort)}
            onInspectItem={(item) => setSelectedItemForAnalysis(item)}
            onOpenDeckStudio={() => setActiveTab('curriculum')}
          />

          {/* Diagnostic & Content Management Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Trainee Error Heatmap (6 cols) */}
            <div className="lg:col-span-6">
              <TraineeErrorHeatmap />
            </div>

            {/* Right Column: Ingested Documents Ledger (6 cols) */}
            <div className="lg:col-span-6">
              <IngestedDocumentsLedger
                onOpenManualReader={(manualId) => setSelectedManualId(manualId)}
              />
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          4. TAB 2: COHORTS & REMEDIATION STUDIO
          ════════════════════════════════════════════════════════════════ */}
      {activeTab === 'cohorts' && (
        <TrainerCohortStudio
          onInspectCohort={(cohort) => setSelectedCohortForInspection(cohort)}
          onRemediateCohort={(cohort) => setSelectedCohortForRemediation(cohort)}
        />
      )}

      {/* ════════════════════════════════════════════════════════════════
          5. TAB 3: CURRICULUM & QUESTION STUDIO
          ════════════════════════════════════════════════════════════════ */}
      {activeTab === 'curriculum' && (
        <TrainerCurriculumStudio
          onOpenManualReader={(manualId) => setSelectedManualId(manualId)}
          onInspectItem={(item) => setSelectedItemForAnalysis(item)}
        />
      )}

      {/* ════════════════════════════════════════════════════════════════
          6. TAB 4: DIAGNOSTICS & PSYCHOMETRICS
          ════════════════════════════════════════════════════════════════ */}
      {activeTab === 'diagnostics' && (
        <TrainerDiagnosticsStudio
          onInspectItem={(item) => setSelectedItemForAnalysis(item)}
          onRemediateCohort={(cohort) => setSelectedCohortForRemediation(cohort)}
        />
      )}

      {/* ════════════════════════════════════════════════════════════════
          INTERACTIVE MODALS
          ════════════════════════════════════════════════════════════════ */}
      <BatchInspectionModal
        isOpen={Boolean(selectedCohortForInspection)}
        onClose={() => setSelectedCohortForInspection(null)}
        cohort={selectedCohortForInspection}
        onOpenRemediation={(cohort) => {
          setSelectedCohortForInspection(null);
          setSelectedCohortForRemediation(cohort);
        }}
      />

      <CohortRemediationModal
        isOpen={Boolean(selectedCohortForRemediation)}
        onClose={() => setSelectedCohortForRemediation(null)}
        targetCohort={selectedCohortForRemediation}
      />

      <ItemAnalysisModal
        isOpen={Boolean(selectedItemForAnalysis)}
        onClose={() => setSelectedItemForAnalysis(null)}
        item={selectedItemForAnalysis}
      />

      {selectedManualId && (
        <ManualReaderModal
          isOpen={Boolean(selectedManualId)}
          onClose={() => setSelectedManualId(null)}
          manualId={selectedManualId}
        />
      )}

      <OfficerDossierModal
        isOpen={dossierOpen}
        onClose={() => setDossierOpen(false)}
        persona={trainerPersona}
      />
    </div>
  );
}
