'use client';

import React from 'react';
import { Target, BookOpen, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

interface LearnerKpiStripProps {
  readinessIndex: number;
  activeModulesCount: number;
  verifiedSkillsCount: number;
  totalSkillsCount: number;
  drillsCompleted: number;
  trainingHours: number;
  isHindi?: boolean;
  onSelectTab?: (tab: string) => void;
}

export function LearnerKpiStrip({
  readinessIndex,
  activeModulesCount,
  verifiedSkillsCount,
  totalSkillsCount,
  drillsCompleted,
  trainingHours,
  isHindi = false,
  onSelectTab,
}: LearnerKpiStripProps) {
  const kpis = [
    {
      id: 'readiness',
      label: isHindi ? 'तैयारी स्कोर' : 'Readiness Score',
      value: `${readinessIndex}%`,
      subtext: readinessIndex >= 70 ? (isHindi ? 'लक्ष्य पर' : 'On Target') : (isHindi ? 'प्रगति आवश्यक' : 'Needs Focus'),
      icon: Target,
      bgColor: 'bg-[#555934]/10',
      textColor: 'text-[#555934]',
    },
    {
      id: 'active',
      label: isHindi ? 'सक्रिय मॉड्यूल' : 'Active Modules',
      value: activeModulesCount.toString(),
      subtext: isHindi ? 'iGOT कर्मयोगी' : 'iGOT In-Progress',
      icon: BookOpen,
      bgColor: 'bg-[#F8C858]/20',
      textColor: 'text-[#8C5B3E]',
    },
    {
      id: 'verified',
      label: isHindi ? 'सत्यापित कौशल' : 'Verified Skills',
      value: `${verifiedSkillsCount}/${totalSkillsCount}`,
      subtext: isHindi ? 'FRAC प्रमाणित' : 'FRAC Certified',
      icon: ShieldCheck,
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-700',
    },
    {
      id: 'drills',
      label: isHindi ? 'फील्ड संवीक्षा अभ्यास' : 'Field Drills',
      value: drillsCompleted.toString(),
      subtext: isHindi ? 'सफल मूल्यांकन' : 'Passed Quizzes',
      icon: CheckCircle2,
      bgColor: 'bg-[#BF9B7A]/20',
      textColor: 'text-chart-5',
    },
    {
      id: 'hours',
      label: isHindi ? 'प्रशिक्षण घंटे' : 'Training Hours',
      value: `${trainingHours}h`,
      subtext: isHindi ? 'संचयी समय' : 'Logged Time',
      icon: Clock,
      bgColor: 'bg-[#8C5B3E]/15',
      textColor: 'text-chart-5',
    },
  ];

  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        const targetTab =
          kpi.id === 'readiness' || kpi.id === 'verified'
            ? 'competencies'
            : kpi.id === 'active' || kpi.id === 'hours'
              ? 'pathways'
              : 'overview';

        return (
          <div
            key={kpi.id}
            onClick={() => onSelectTab?.(targetTab)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onSelectTab?.(targetTab);
            }}
            title={`View ${kpi.label} breakdown`}
            className="rounded-2xl bg-white border border-[#BF9B7A]/30 p-4 shadow-2xs hover:shadow-xs transition-all hover:scale-101 hover:border-[#BF9B7A] flex items-center gap-3.5 cursor-pointer active:scale-95 group"
          >
            <div className={`h-11 w-11 rounded-2xl ${kpi.bgColor} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
              <Icon className={`h-5 w-5 ${kpi.textColor}`} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-muted-foreground truncate leading-tight group-hover:text-[#555934] transition-colors">
                {kpi.label}
              </p>
              <p className="text-xl sm:text-2xl font-extrabold text-[#2d1f17] tracking-tight mt-0.5 font-mono">
                {kpi.value}
              </p>
              <p className="text-[10px] font-medium text-muted-foreground/80 truncate">
                {kpi.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
