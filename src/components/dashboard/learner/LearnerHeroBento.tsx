'use client';

import React from 'react';
import type { DashboardUserProps } from '@/components/dashboard/RoleDashboardRouter';
import type { PersonaFRACProfile } from '@/data/fracCadres';
import { ShieldCheck, Wifi, MapPin, Calendar, ArrowRight, CheckCircle, Clock } from 'lucide-react';

interface LearnerHeroBentoProps {
  user: DashboardUserProps;
  profile: PersonaFRACProfile;
  isHindi: boolean;
  readinessIndex: number;
  onOpenDossier?: () => void;
  onOpenCapiModal?: () => void;
  onStartDrill?: (drillId: string) => void;
  onViewGaps?: () => void;
}

export function LearnerHeroBento({
  user,
  profile,
  isHindi,
  readinessIndex,
  onOpenDossier,
  onOpenCapiModal,
  onStartDrill,
  onViewGaps,
}: LearnerHeroBentoProps) {
  const isFieldCadre =
    profile.cadre.toLowerCase().includes('field') ||
    profile.personaId.includes('sunita') ||
    user.id?.includes('sunita');

  const displayName = isHindi && profile.name === 'Sunita Devi' ? 'सुनीता देवी' : profile.name;
  const displayDesignation = isHindi ? profile.designation_hi : profile.designation;
  const displayDepartment = isHindi ? profile.department_hi : profile.department;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Left Bento: Officer Cadre Card (7 cols) */}
      <div className="lg:col-span-7 rounded-3xl bg-white border border-[#BF9B7A]/30 p-6 sm:p-7 shadow-xs flex flex-col justify-between relative overflow-hidden">
        {/* Subtle decorative watermark */}
        <div className="absolute right-4 top-4 opacity-5 pointer-events-none text-9xl font-black text-[#555934]">
          ISS
        </div>

        <div>
          {/* Top badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#555934]/10 text-[#555934] border border-[#555934]/20">
              <ShieldCheck className="h-3.5 w-3.5" />
              {isHindi ? 'FRAC प्रमाणित सिविल सेवक' : 'FRAC Verified Official'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#BF9B7A]/20 text-chart-5">
              {profile.cadre}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#FAF6F0] text-muted-foreground border border-[#BF9B7A]/30">
              ID: {profile.personaId.toUpperCase()}
            </span>
          </div>

          {/* Name and Designation */}
          <div
            onClick={onOpenDossier}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onOpenDossier?.();
            }}
            title="Click to view Official Civil Service Dossier"
            className="flex items-start gap-4 cursor-pointer group"
          >
            <div className="h-14 w-14 rounded-2xl bg-[#555934] text-white flex items-center justify-center text-xl font-bold font-serif shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              {profile.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2d1f17] tracking-tight group-hover:text-[#555934] transition-colors">
                {displayName}
              </h1>
              <p className="text-sm font-semibold text-[#8C5B3E] mt-0.5">
                {displayDesignation}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-[#8C5B3E]" />
                {displayDepartment}
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Cadre Feature (CAPI Field Tablet or Office Scrutiny) */}
        <div className="mt-6 pt-5 border-t border-[#BF9B7A]/20">
          {isFieldCadre ? (
            <div className="rounded-2xl bg-[#FAF6F0] border border-[#BF9B7A]/30 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center shrink-0">
                  <Wifi className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#2d1f17]">
                      {isHindi ? 'CAPI ऑफ़लाइन तुल्यकालन सक्रिय' : 'CAPI Offline Mode Active'}
                    </span>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {isHindi
                      ? 'अंतिम सिंक 14 मिनट पूर्व • 38 अनुसूचियां स्थानीय रूप से सुरक्षित'
                      : 'Last synced 14m ago • 38 field schedules encrypted in local IndexedDB'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenCapiModal}
                className="px-3.5 py-1.5 rounded-xl bg-[#555934] text-white text-xs font-bold hover:bg-[#434728] transition-colors shrink-0 cursor-pointer shadow-2xs"
              >
                {isHindi ? 'सिंक स्थिति' : 'Sync Status'}
              </button>
            </div>
          ) : (
            <div className="rounded-2xl bg-[#FAF6F0] border border-[#BF9B7A]/30 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-[#555934]/15 text-[#555934] flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#2d1f17]">
                    {isHindi ? 'सांख्यिकी संवीक्षा प्रकोष्ठ' : 'Statistical Scrutiny & DQAD Registry'}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {isHindi
                      ? 'पीएलएफएस और एनएसएसओ 80वें दौर के लिए अधिकृत संवीक्षक'
                      : 'Certified validator for PLFS & NSSO 80th Round survey returns'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onViewGaps}
                className="px-3.5 py-1.5 rounded-xl bg-[#555934] text-white text-xs font-bold hover:bg-[#434728] transition-colors shrink-0 cursor-pointer shadow-2xs"
              >
                {isHindi ? 'कौशल अंतर देखें' : 'View Gap Analysis'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Bento: High-Contrast Dark Slate Field Schedule Card (5 cols) */}
      <div className="lg:col-span-5 rounded-3xl bg-[#2d1f17] text-white p-6 sm:p-7 shadow-md flex flex-col justify-between relative overflow-hidden border border-[#BF9B7A]/20">
        <div>
          {/* Header pill */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#F8C858]/20 text-[#F8C858] border border-[#F8C858]/30">
              <Calendar className="h-3 w-3" />
              {isHindi ? 'सक्रिय परिचालन चक्र' : 'Active Operation • 2026-Q2'}
            </span>
            <span className="text-xs font-mono text-[#FAF6F0]/70">
              MoSPI FOD-PLFS
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#FAF6F0]">
            {isHindi
              ? 'आवधिक श्रम बल सर्वेक्षण (PLFS)'
              : 'Periodic Labour Force Survey (PLFS)'}
          </h2>
          <p className="text-xs text-[#FAF6F0]/80 mt-1">
            {isFieldCadre
              ? isHindi
                ? 'चरण: अनुसूची 0.0 परिवार सूचीकरण एवं सीमा निर्धारण'
                : 'Phase: Schedule 0.0 Household Listing & Demarcation'
              : isHindi
                ? 'चरण: सूक्ष्म-डेटा संवीक्षा और विसंगति पर्ची समाधान'
                : 'Phase: Microdata Scrutiny & Query Slips Resolution'}
          </p>

          {/* Stepped progress track */}
          <div className="mt-5 space-y-3">
            <div className="flex items-center gap-3 text-xs">
              <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle className="h-3.5 w-3.5" />
              </div>
              <span className="text-[#FAF6F0]/90">
                {isHindi ? 'प्रारंभिक कैडर ब्रीफिंग पूर्ण' : 'Operational Briefing & Frame Allocation'}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="h-6 w-6 rounded-full bg-[#F8C858]/20 text-[#F8C858] flex items-center justify-center shrink-0">
                <Clock className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-semibold text-[#F8C858]">
                    {isHindi ? 'फील्ड संवीक्षा प्रगति' : 'Current Milestone Progress'}
                  </span>
                  <span className="font-mono font-bold text-[#F8C858]">
                    {readinessIndex}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-[#BF9B7A] to-[#F8C858] transition-all"
                    style={{ width: `${readinessIndex}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs opacity-60">
              <div className="h-6 w-6 rounded-full bg-white/10 text-[#FAF6F0]/60 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-mono font-bold">3</span>
              </div>
              <span className="text-[#FAF6F0]/80">
                {isHindi ? 'त्रैमासिक बुलेटिन और माइक्रो-डेटा जारी' : 'Final Bulletin Tabulation & Dissemination'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-[11px] text-[#FAF6F0]/70 font-medium">
            {isHindi ? 'मानक संचालन प्रक्रिया (SOP) देखें' : 'Review Field SOP Guidelines'}
          </span>
          <button
            type="button"
            onClick={() => {
              if (onStartDrill) {
                onStartDrill('drill-schedule-0');
              }
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F8C858] text-[#2d1f17] text-xs font-bold hover:bg-[#e6b94e] transition-colors cursor-pointer shadow-2xs active:scale-95"
          >
            <span>{isHindi ? 'अभ्यास आरंभ करें' : 'Start Field Drill'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
