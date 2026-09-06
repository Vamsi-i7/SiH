'use client';

import React, { useState } from 'react';
import type { DashboardUserProps } from '../RoleDashboardRouter';
import { getPersonaFRAC } from '@/data/fracCadres';
import { LearnerKpiStrip } from './LearnerKpiStrip';
import { LearnerHeroBento } from './LearnerHeroBento';
import { PriorityGapsCard } from './PriorityGapsCard';
import { LearnerCoursesTable } from './LearnerCoursesTable';
import { MoSPIFieldManualsShelf } from './MoSPIFieldManualsShelf';
import { HorizontalDrillsCarousel } from './HorizontalDrillsCarousel';
import { KarmayogiPathwaysTrack } from './KarmayogiPathwaysTrack';
import { CAPIFieldStationTab } from './CAPIFieldStationTab';
import { LearnerDrillModal } from './modals/LearnerDrillModal';
import { ManualReaderModal } from './modals/ManualReaderModal';
import { OfficerDossierModal } from './modals/OfficerDossierModal';
import { CAPIConnectivityModal } from './modals/CAPIConnectivityModal';
import { LearnerKarmaLedgerModal } from './modals/LearnerKarmaLedgerModal';
import { Globe2, LayoutDashboard, BookOpen, Target, GraduationCap, Wifi, Award } from 'lucide-react';
import type { DemoPersona } from '@/lib/types';

export default function LearnerDashboard({ user }: { user: DashboardUserProps }) {
  // Retrieve official FRAC profile
  const profile = getPersonaFRAC(user);

  // Language state: auto-detect from user profile (Sunita Devi defaults to Hindi)
  const initialIsHindi =
    user.user_metadata?.preferred_language === 'hi' ||
    profile.preferredLanguage === 'hi' ||
    user.id?.includes('sunita');

  const [isHindi, setIsHindi] = useState(initialIsHindi);
  const [activeTab, setActiveTab] = useState<'overview' | 'manuals' | 'competencies' | 'pathways' | 'capi'>('overview');

  // Interactive Modal States
  const [activeDrillId, setActiveDrillId] = useState<string | null>(null);
  const [activeManualId, setActiveManualId] = useState<string | null>(null);
  const [dossierModalOpen, setDossierModalOpen] = useState(false);
  const [capiModalOpen, setCapiModalOpen] = useState(false);
  const [karmaModalOpen, setKarmaModalOpen] = useState(false);
  const [isOfflineSimulated, setIsOfflineSimulated] = useState(false);

  // Compute readiness index & verified counts
  const totalSkills = profile.competencies.length;
  const verifiedSkills = profile.competencies.filter(
    (c) => c.evidenceType === 'assessment-verified'
  ).length;
  const metTargetCount = profile.competencies.filter(
    (c) => c.currentLevel >= c.targetLevel
  ).length;
  const readinessIndex = Math.round((metTargetCount / Math.max(1, totalSkills)) * 100);

  // Fallback persona for dossier modal
  const activePersona: DemoPersona = {
    id: user.id || 'demo-learner',
    name: (user.user_metadata?.name as string) || profile.name,
    email: user.email || 'learner@mospi.gov.in',
    role: 'learner',
    designation: (user.user_metadata?.designation as string) || profile.designation,
    cadre: (user.user_metadata?.cadre as string) || profile.cadre,
    department: profile.department,
    preferred_language: isHindi ? 'hi' : 'en',
    organization_id: 'org-mospi',
  };

  const handleStartDrill = (drillId: string) => {
    setActiveDrillId(drillId);
  };

  const handleOpenManual = (manualId: string) => {
    setActiveManualId(manualId);
  };

  const handleDrillComplete = (points: number) => {
    alert(
      isHindi
        ? `बधाई! आपके आधिकारिक कैडर प्रोफाइल में +${points} कर्म अंक जोड़ दिए गए हैं।`
        : `Congratulations! +${points} Karma Points have been credited to your official civil service dossier.`
    );
  };

  const tabs = [
    {
      id: 'overview' as const,
      label: isHindi ? 'परिचालन कार्यक्षेत्र' : 'Operational Workspace',
      icon: LayoutDashboard,
    },
    {
      id: 'manuals' as const,
      label: isHindi ? 'फील्ड मैनुअल शेल्फ' : 'Field Manuals Shelf',
      icon: BookOpen,
    },
    {
      id: 'competencies' as const,
      label: isHindi ? 'FRAC क्षमता अंतर' : 'FRAC Competency Gaps',
      icon: Target,
    },
    {
      id: 'pathways' as const,
      label: isHindi ? 'कर्मयोगी प्रगति पथ' : 'Karmayogi Pathways',
      icon: GraduationCap,
    },
    {
      id: 'capi' as const,
      label: isHindi ? 'कैपी फील्ड स्टेशन' : 'CAPI Field Station',
      icon: Wifi,
    },
  ];

  return (
    <div data-testid="learner-dashboard" className="space-y-6 pb-12">
      {/* Top Header Bar with Language Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#BF9B7A]/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#555934]" />
            <h1 className="text-xl sm:text-2xl font-black text-[#2d1f17] tracking-tight">
              {isHindi ? 'अधिकारी क्षमता एवं प्रशिक्षण कार्यक्षेत्र' : 'Officer Competency & Learning Workspace'}
            </h1>
          </div>
          <p className="text-xs text-[#705849] mt-0.5">
            {isHindi
              ? 'सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय • क्षमता विकास पोर्टल'
              : 'Ministry of Statistics & Programme Implementation • Capacity Building Ecosystem'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setKarmaModalOpen(true)}
            title="View Karma Points Ledger"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8C858]/20 border border-[#F8C858]/40 text-xs font-bold text-[#8C5B3E] hover:bg-[#F8C858]/30 transition-colors shadow-2xs cursor-pointer"
          >
            <Award className="h-3.5 w-3.5 text-[#8C5B3E]" />
            <span className="font-mono">+550 KP</span>
          </button>

          <button
            type="button"
            onClick={() => setIsHindi(!isHindi)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#BF9B7A]/40 text-xs font-bold text-[#555934] hover:bg-[#FAF6F0] transition-colors shadow-2xs cursor-pointer"
            aria-label="Toggle Hindi language"
          >
            <Globe2 className="h-3.5 w-3.5 text-[#8C5B3E]" />
            <span>{isHindi ? 'English में देखें' : 'हिन्दी में बदलें'}</span>
          </button>
        </div>
      </div>

      {/* 5-Card Pastel KPI Strip (Image 2) */}
      <LearnerKpiStrip
        readinessIndex={readinessIndex}
        activeModulesCount={2}
        verifiedSkillsCount={verifiedSkills}
        totalSkillsCount={totalSkills}
        drillsCompleted={6}
        trainingHours={24}
        isHindi={isHindi}
        onSelectTab={(tab) => {
          if (tab === 'competencies' || tab === 'pathways' || tab === 'overview') {
            setActiveTab(tab);
          }
        }}
      />

      {/* Interactive Workspace Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#BF9B7A]/25 text-xs font-bold scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-[#555934] text-white shadow-2xs font-black'
                  : 'bg-white text-[#705849] hover:bg-[#FAF6F0] hover:text-[#2d1f17] border border-[#BF9B7A]/20'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-[#F8C858]' : 'text-[#8C5B3E]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Operational Workspace (Default) */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Asymmetric Hero Bento (Image 1) */}
          <LearnerHeroBento
            user={user}
            profile={profile}
            isHindi={isHindi}
            readinessIndex={readinessIndex}
            onOpenDossier={() => setDossierModalOpen(true)}
            onOpenCapiModal={() => setCapiModalOpen(true)}
            onStartDrill={handleStartDrill}
            onViewGaps={() => setActiveTab('competencies')}
          />

          {/* Horizontal Priority Drills Carousel */}
          <HorizontalDrillsCarousel
            onStartDrill={handleStartDrill}
            isHindi={isHindi}
          />

          {/* Horizontal Official MoSPI Field Manuals Shelf */}
          <MoSPIFieldManualsShelf
            isHindi={isHindi}
            onOpenManual={handleOpenManual}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Priority Competency Gaps (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <PriorityGapsCard
                competencies={profile.competencies}
                isHindi={isHindi}
                onBridgeGap={() => handleStartDrill('drill-schedule-0')}
                onViewAllGaps={() => setActiveTab('competencies')}
              />
            </div>

            {/* Right Column: Enrolled Courses Table (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <LearnerCoursesTable isHindi={isHindi} />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Field Manuals & SOP Shelf */}
      {activeTab === 'manuals' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <MoSPIFieldManualsShelf
            isHindi={isHindi}
            onOpenManual={handleOpenManual}
          />
          <div className="rounded-3xl bg-white border border-[#BF9B7A]/30 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#2d1f17]">
              {isHindi ? 'डिजिटल मैनुअल खोज एवं वैधानिक संदर्भ' : 'Digital Manual Search & Statutory Repository'}
            </h3>
            <p className="text-xs text-[#705849]">
              {isHindi
                ? 'सभी मैनुअल एनएसएसटीए और राष्ट्रीय सांख्यिकी आयोग (NSC) द्वारा प्रमाणित हैं।'
                : 'All statutory guidelines are certified by NSSTA and the National Statistical Commission (NSC).'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleOpenManual('manual-plfs-vol1')}
                className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#BF9B7A]/30 text-left hover:border-[#555934] transition-all cursor-pointer shadow-2xs"
              >
                <span className="text-[10px] font-bold text-[#555934] uppercase tracking-wider block mb-1">
                  NSSO FOD
                </span>
                <p className="font-bold text-xs text-[#2d1f17]">PLFS Vol 1: Instructions</p>
                <p className="text-[11px] text-[#705849] mt-1">184 Pages • Ver 2026.1</p>
              </button>
              <button
                type="button"
                onClick={() => handleOpenManual('manual-schedule-0')}
                className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#BF9B7A]/30 text-left hover:border-[#555934] transition-all cursor-pointer shadow-2xs"
              >
                <span className="text-[10px] font-bold text-[#8C5B3E] uppercase tracking-wider block mb-1">
                  SDRD
                </span>
                <p className="font-bold text-xs text-[#2d1f17]">Schedule 0.0 Demarcation</p>
                <p className="text-[11px] text-[#705849] mt-1">96 Pages • Ver 2025.4</p>
              </button>
              <button
                type="button"
                onClick={() => handleOpenManual('manual-capi-handbook')}
                className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#BF9B7A]/30 text-left hover:border-[#555934] transition-all cursor-pointer shadow-2xs"
              >
                <span className="text-[10px] font-bold text-[#593E2E] uppercase tracking-wider block mb-1">
                  DPD
                </span>
                <p className="font-bold text-xs text-[#2d1f17]">ASHE & CAPI Tablet Protocol</p>
                <p className="text-[11px] text-[#705849] mt-1">64 Pages • Ver 2026.2</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: FRAC Competency Gaps */}
      {activeTab === 'competencies' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <PriorityGapsCard
            competencies={profile.competencies}
            isHindi={isHindi}
            onBridgeGap={() => handleStartDrill('drill-schedule-0')}
          />
          <HorizontalDrillsCarousel
            onStartDrill={handleStartDrill}
            isHindi={isHindi}
          />
        </div>
      )}

      {/* Tab 4: Karmayogi Pathways */}
      {activeTab === 'pathways' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <KarmayogiPathwaysTrack isHindi={isHindi} />
          <LearnerCoursesTable isHindi={isHindi} />
        </div>
      )}

      {/* Tab 5: CAPI Field Station */}
      {activeTab === 'capi' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <CAPIFieldStationTab isHindi={isHindi} />
        </div>
      )}

      {/* Active Interactive Modals */}
      <LearnerDrillModal
        isOpen={!!activeDrillId}
        onClose={() => setActiveDrillId(null)}
        drillId={activeDrillId || undefined}
        onComplete={handleDrillComplete}
        isHindi={isHindi}
      />

      <ManualReaderModal
        isOpen={!!activeManualId}
        onClose={() => setActiveManualId(null)}
        manualId={activeManualId || undefined}
        isHindi={isHindi}
      />

      <OfficerDossierModal
        isOpen={dossierModalOpen}
        onClose={() => setDossierModalOpen(false)}
        persona={activePersona}
        isHindi={isHindi}
      />

      <CAPIConnectivityModal
        isOpen={capiModalOpen}
        onClose={() => setCapiModalOpen(false)}
        isHindi={isHindi}
        isOfflineSimulated={isOfflineSimulated}
        onToggleOfflineSimulated={() => setIsOfflineSimulated(!isOfflineSimulated)}
      />

      <LearnerKarmaLedgerModal
        isOpen={karmaModalOpen}
        onClose={() => setKarmaModalOpen(false)}
        isHindi={isHindi}
      />
    </div>
  );
}
