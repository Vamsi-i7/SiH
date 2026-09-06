'use client';

import React, { useState } from 'react';
import type { DashboardUserProps } from '../RoleDashboardRouter';
import { getPersonaFRAC } from '@/data/fracCadres';
import { LearnerKpiStrip } from './LearnerKpiStrip';
import { LearnerHeroBento } from './LearnerHeroBento';
import { PriorityGapsCard } from './PriorityGapsCard';
import { LearnerCoursesTable } from './LearnerCoursesTable';
import { MoSPIFieldManualsShelf } from './MoSPIFieldManualsShelf';
import { Globe2 } from 'lucide-react';

export default function LearnerDashboard({ user }: { user: DashboardUserProps }) {
  // Retrieve official FRAC profile
  const profile = getPersonaFRAC(user);

  // Language state: auto-detect from user profile (Sunita Devi defaults to Hindi)
  const initialIsHindi =
    user.user_metadata?.preferred_language === 'hi' ||
    profile.preferredLanguage === 'hi' ||
    user.id?.includes('sunita');

  const [isHindi, setIsHindi] = useState(initialIsHindi);

  // Compute readiness index & verified counts
  const totalSkills = profile.competencies.length;
  const verifiedSkills = profile.competencies.filter(
    (c) => c.evidenceType === 'assessment-verified'
  ).length;
  const metTargetCount = profile.competencies.filter(
    (c) => c.currentLevel >= c.targetLevel
  ).length;
  const readinessIndex = Math.round((metTargetCount / Math.max(1, totalSkills)) * 100);

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

        {/* PRD Lever 1: Language Toggle for Rural & FOD Staff */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsHindi(!isHindi)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#BF9B7A]/40 text-xs font-bold text-[#555934] hover:bg-[#FAF6F0] transition-colors shadow-2xs"
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
      />

      {/* Asymmetric Hero Bento (Image 1) */}
      <LearnerHeroBento
        user={user}
        profile={profile}
        isHindi={isHindi}
        readinessIndex={readinessIndex}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Priority Competency Gaps & Course Table (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <PriorityGapsCard
            competencies={profile.competencies}
            isHindi={isHindi}
          />
          <LearnerCoursesTable isHindi={isHindi} />
        </div>

        {/* Right Column: Official Field Manuals Shelf (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <MoSPIFieldManualsShelf isHindi={isHindi} />
        </div>
      </div>
    </div>
  );
}
