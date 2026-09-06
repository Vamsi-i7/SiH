'use client';

import React, { useState } from 'react';
import type { DashboardUserProps } from '../RoleDashboardRouter';
import { AdminKpiStrip } from './AdminKpiStrip';
import { AdminAiNarrativeBox } from './AdminAiNarrativeBox';
import { OutcomeCorrelationChart } from './OutcomeCorrelationChart';
import { DepartmentBreakdownTable } from './DepartmentBreakdownTable';
import type { DepartmentRow } from './DepartmentBreakdownTable';
import { AdminCabinetDrawer } from './AdminCabinetDrawer';
import { HorizontalZonalHealthCarousel } from './HorizontalZonalHealthCarousel';
import { HorizontalPolicyDirectivesCarousel } from './HorizontalPolicyDirectivesCarousel';
import type { PolicyDirectiveData } from './HorizontalPolicyDirectivesCarousel';
import { MinisterialBriefingModal } from './modals/MinisterialBriefingModal';
import { NationalCadreRosterModal } from './modals/NationalCadreRosterModal';
import { CommissionSweepModal } from './modals/CommissionSweepModal';
import { RegionalDetailModal } from './modals/RegionalDetailModal';
import type { RegionalOfficeData } from './modals/RegionalDetailModal';
import { NationalReadinessModal } from './modals/NationalReadinessModal';
import { FlaggedRegionsModal } from './modals/FlaggedRegionsModal';
import {
  ShieldCheck,
  MapPin,
  LayoutGrid,
  Map,
  TrendingDown,
  FileText,
  Send,
  Download,
  Users,
  CheckCircle2,
} from 'lucide-react';

export type AdminWorkspaceTab =
  | 'overview'
  | 'zonal_ro'
  | 'scrutiny_correlation'
  | 'policy_circulars'
  | 'governance_orders';

export default function AdminDashboard({ user }: { user: DashboardUserProps }) {
  const adminName = user.user_metadata?.name || 'Rajesh Kumar';
  const adminDesignation = user.user_metadata?.designation || 'Additional Director General';
  const adminCadre = user.user_metadata?.cadre || 'MoSPI Headquarters';

  // Workspace tab state
  const [activeTab, setActiveTab] = useState<AdminWorkspaceTab>('overview');

  // Executive Modals state
  const [briefingModalOpen, setBriefingModalOpen] = useState(false);
  const [rosterModalOpen, setRosterModalOpen] = useState(false);
  const [sweepModalOpen, setSweepModalOpen] = useState(false);
  const [readinessModalOpen, setReadinessModalOpen] = useState(false);
  const [flaggedModalOpen, setFlaggedModalOpen] = useState(false);

  // Regional Detail Deep-Dive Modal
  const [selectedOffice, setSelectedOffice] = useState<RegionalOfficeData | null>(null);
  const [officeModalOpen, setOfficeModalOpen] = useState(false);

  // Toast alert
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleInspectOffice = (office: DepartmentRow | RegionalOfficeData) => {
    setSelectedOffice({
      id: office.id,
      name: office.name,
      zone: office.zone,
      headcount: office.headcount,
      readinessPercent: office.readinessPercent,
      avgLevel: office.avgLevel,
      errorRate: office.errorRate,
      isFlagged: office.isFlagged,
    });
    setOfficeModalOpen(true);
  };

  const handleReadCircular = (directive: PolicyDirectiveData) => {
    showToast(`Opening Official Circular: ${directive.circularNo} (${directive.title})`);
    setBriefingModalOpen(true);
  };

  const handleKpiClick = (kpiId: string) => {
    if (kpiId === 'headcount') {
      setRosterModalOpen(true);
    } else if (kpiId === 'readiness') {
      setReadinessModalOpen(true);
    } else if (kpiId === 'error_rate') {
      setActiveTab('scrutiny_correlation');
    } else if (kpiId === 'flagged') {
      setFlaggedModalOpen(true);
    } else if (kpiId === 'cohorts') {
      setActiveTab('policy_circulars');
    }
  };

  return (
    <div data-testid="admin-dashboard" className="space-y-6 pb-16">
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-[#555934] text-white text-xs font-bold flex items-center justify-between shadow-md animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#F8C858]" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-white/70 hover:text-white cursor-pointer px-2"
          >
            ✕
          </button>
        </div>
      )}

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
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#F8C858]/20 text-[#8C5B3E] border border-[#F8C858]/35">
                  ISS Senior SAG
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

          {/* Quick Action Pills in Header */}
          <div className="flex flex-wrap md:flex-col items-end gap-2 shrink-0 pt-2 md:pt-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setBriefingModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2d1f17] text-[#FAF6F0] text-xs font-bold hover:bg-black transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                <Download className="h-3.5 w-3.5 text-[#F8C858]" />
                <span>Secretary Memo (PDF)</span>
              </button>

              <button
                type="button"
                onClick={() => setRosterModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#BF9B7A]/40 text-xs font-bold text-[#555934] hover:bg-[#FAF6F0] transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                <Users className="h-3.5 w-3.5" />
                <span>Cadre Roster</span>
              </button>
            </div>

            <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#BF9B7A]/30 text-right hidden sm:block">
              <span className="text-[10px] font-bold text-[#705849] block">Statistical Authority</span>
              <span className="text-xs font-black text-[#555934]">National Sample Survey (NSS)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Card Macro KPI Strip with interactive onKpiClick */}
      <AdminKpiStrip onKpiClick={handleKpiClick} />

      {/* Multi-Deck Workspace Tab Navigation (Eliminating continuous single scroll) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'overview'}
          onClick={() => setActiveTab('overview')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'overview'
              ? 'bg-[#555934] text-white shadow-xs'
              : 'bg-white text-[#705849] border border-[#BF9B7A]/30 hover:bg-[#FAF6F0]'
          }`}
        >
          <LayoutGrid className="h-3.5 w-3.5" />
          <span>Executive Command</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'zonal_ro'}
          onClick={() => setActiveTab('zonal_ro')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'zonal_ro'
              ? 'bg-[#555934] text-white shadow-xs'
              : 'bg-white text-[#705849] border border-[#BF9B7A]/30 hover:bg-[#FAF6F0]'
          }`}
        >
          <Map className="h-3.5 w-3.5" />
          <span>Regional Cadre Health</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'scrutiny_correlation'}
          onClick={() => setActiveTab('scrutiny_correlation')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'scrutiny_correlation'
              ? 'bg-[#555934] text-white shadow-xs'
              : 'bg-white text-[#705849] border border-[#BF9B7A]/30 hover:bg-[#FAF6F0]'
          }`}
        >
          <TrendingDown className="h-3.5 w-3.5" />
          <span>Outcome Regression</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'policy_circulars'}
          onClick={() => setActiveTab('policy_circulars')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'policy_circulars'
              ? 'bg-[#555934] text-white shadow-xs'
              : 'bg-white text-[#705849] border border-[#BF9B7A]/30 hover:bg-[#FAF6F0]'
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          <span>Policy Directives</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'governance_orders'}
          onClick={() => setActiveTab('governance_orders')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'governance_orders'
              ? 'bg-[#555934] text-white shadow-xs'
              : 'bg-white text-[#705849] border border-[#BF9B7A]/30 hover:bg-[#FAF6F0]'
          }`}
        >
          <Send className="h-3.5 w-3.5" />
          <span>Cabinet Drawer</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW (EXECUTIVE COMMAND CENTER) */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Horizontal Zonal Health Deck */}
          <HorizontalZonalHealthCarousel
            onInspectZone={handleInspectOffice}
            onDispatchTriage={(zone) => {
              showToast(`NSSTA Triage team dispatched to ${zone}!`);
              setFlaggedModalOpen(true);
            }}
          />

          {/* AI Executive Intelligence Briefing */}
          <AdminAiNarrativeBox />

          {/* Horizontal Policy Directives & Cabinet Circulars Deck */}
          <HorizontalPolicyDirectivesCarousel onReadCircular={handleReadCircular} />

          {/* Outcome Correlation Scatter Chart (PRD Lever 2 & §9.4.5) */}
          <OutcomeCorrelationChart />

          {/* Regional Office Breakdown & Ministerial Actions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8">
              <DepartmentBreakdownTable onInspectOffice={handleInspectOffice} />
            </div>
            <div className="lg:col-span-4">
              <AdminCabinetDrawer
                onOpenBriefingModal={() => setBriefingModalOpen(true)}
                onOpenRosterModal={() => setRosterModalOpen(true)}
                onOpenSweepModal={() => setSweepModalOpen(true)}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ZONAL & REGIONAL HEALTH */}
      {activeTab === 'zonal_ro' && (
        <div className="space-y-6">
          <HorizontalZonalHealthCarousel
            onInspectZone={handleInspectOffice}
            onDispatchTriage={(zone) => {
              showToast(`NSSTA Triage team dispatched to ${zone}!`);
              setFlaggedModalOpen(true);
            }}
          />
          <DepartmentBreakdownTable onInspectOffice={handleInspectOffice} />
        </div>
      )}

      {/* TAB 3: OUTCOME REGRESSION (PRD §9.4.5) */}
      {activeTab === 'scrutiny_correlation' && (
        <div className="space-y-6">
          <OutcomeCorrelationChart />
          <AdminAiNarrativeBox />
        </div>
      )}

      {/* TAB 4: POLICY DIRECTIVES & CABINET CIRCULARS */}
      {activeTab === 'policy_circulars' && (
        <div className="space-y-6">
          <HorizontalPolicyDirectivesCarousel onReadCircular={handleReadCircular} />
          <div className="p-6 rounded-3xl bg-white border border-[#BF9B7A]/30 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-[#BF9B7A]/20">
              <ShieldCheck className="h-4 w-4 text-[#555934]" />
              <h3 className="font-bold text-[#2d1f17] text-sm">
                National Data Governance &amp; Cadre Compliance Overview
              </h3>
            </div>
            <p className="text-xs text-[#705849] leading-relaxed">
              All 5 statutory policy circulars are issued under the joint authority of the Cabinet Secretariat, 
              Ministry of Statistics &amp; Programme Implementation, and National Statistical Commission (NSC).
              Mandated compliance milestones are audited bi-weekly through the automated CAPI scrutiny pipeline.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-[#FAF6F0] border border-[#BF9B7A]/20 text-center">
                <span className="text-[10px] text-[#705849] block">Mandated Surveys</span>
                <span className="text-lg font-black font-mono text-[#555934]">PLFS, ASHE, HCES</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#FAF6F0] border border-[#BF9B7A]/20 text-center">
                <span className="text-[10px] text-[#705849] block">Average Compliance</span>
                <span className="text-lg font-black font-mono text-emerald-700">71.5%</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#FAF6F0] border border-[#BF9B7A]/20 text-center">
                <span className="text-[10px] text-[#705849] block">Next Enforcement Audit</span>
                <span className="text-lg font-black font-mono text-[#8C5B3E]">15 Oct 2026</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: GOVERNANCE ORDERS & CABINET DRAWER */}
      {activeTab === 'governance_orders' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-6">
              <AdminCabinetDrawer
                onOpenBriefingModal={() => setBriefingModalOpen(true)}
                onOpenRosterModal={() => setRosterModalOpen(true)}
                onOpenSweepModal={() => setSweepModalOpen(true)}
              />
            </div>
            <div className="lg:col-span-6 space-y-4">
              <div className="p-6 rounded-3xl bg-white border border-[#BF9B7A]/30 shadow-xs space-y-4">
                <h3 className="font-bold text-sm text-[#2d1f17]">
                  Statutory Ministerial Instruments
                </h3>
                <p className="text-xs text-[#705849] leading-relaxed">
                  Generate executive legal briefing instruments and deploy nationwide assessment sweeps 
                  for the National Statistical Systems Training Academy (NSSTA).
                </p>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setSweepModalOpen(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#555934] text-white text-xs font-bold hover:bg-[#434728] transition-all cursor-pointer shadow-xs flex items-center justify-between"
                  >
                    <span>Authorize Q3 National Assessment Sweep</span>
                    <Send className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setRosterModalOpen(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#FAF6F0] border border-[#BF9B7A]/40 text-[#555934] text-xs font-bold hover:bg-white transition-all cursor-pointer shadow-2xs flex items-center justify-between"
                  >
                    <span>Inspect Complete 4,850 Officer Registry</span>
                    <Users className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setBriefingModalOpen(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#2d1f17] text-[#FAF6F0] text-xs font-bold hover:bg-black transition-all cursor-pointer shadow-2xs flex items-center justify-between"
                  >
                    <span>Open Confidential Secretary Briefing Memo</span>
                    <Download className="h-3.5 w-3.5 text-[#F8C858]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MOUNTED EXECUTIVE MODALS */}
      <MinisterialBriefingModal
        isOpen={briefingModalOpen}
        onClose={() => setBriefingModalOpen(false)}
      />

      <NationalCadreRosterModal
        isOpen={rosterModalOpen}
        onClose={() => setRosterModalOpen(false)}
      />

      <CommissionSweepModal
        isOpen={sweepModalOpen}
        onClose={() => setSweepModalOpen(false)}
        onSuccess={(id) => showToast(`Executive Order ${id} successfully authorized!`)}
      />

      <RegionalDetailModal
        isOpen={officeModalOpen}
        onClose={() => setOfficeModalOpen(false)}
        office={selectedOffice}
        onDispatchTriage={(name) => showToast(`NSSTA Triage dispatched to ${name}!`)}
      />

      <NationalReadinessModal
        isOpen={readinessModalOpen}
        onClose={() => setReadinessModalOpen(false)}
      />

      <FlaggedRegionsModal
        isOpen={flaggedModalOpen}
        onClose={() => setFlaggedModalOpen(false)}
        onDispatchIntervention={(name) => showToast(`Intervention ordered for ${name}!`)}
      />
    </div>
  );
}
