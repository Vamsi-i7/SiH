'use client';

import React, { useState } from 'react';
import {
  Search,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Download,
  Building2,
} from 'lucide-react';
import { ACTIVE_COHORTS } from '../HorizontalTrainerCarousels';
import type { CohortData, TraineeRecord } from '../modals/BatchInspectionModal';

const AT_RISK_ROSTER: TraineeRecord[] = [
  {
    id: 'tr-02',
    name: 'Sunita Devi',
    cadre: 'NSSO Field Operations Division',
    designation: 'Field Investigator',
    center: 'ZTC Kolkata',
    score: 44,
    drillsCompleted: 9,
    status: 'CRITICAL',
    weakCompetency: 'comp-capi (CAPI Tablet Operations)',
  },
  {
    id: 'tr-05',
    name: 'Rohan Mehra',
    cadre: 'NSSO Field Operations Division',
    designation: 'Field Investigator',
    center: 'ZTC Lucknow',
    score: 48,
    drillsCompleted: 11,
    status: 'CRITICAL',
    weakCompetency: 'comp-nsso (PLFS Schedule 10.4)',
  },
  {
    id: 'tr-01',
    name: 'Amit Sharma',
    cadre: 'Indian Statistical Service (ISS)',
    designation: 'Junior Statistical Officer',
    center: 'NSSTA Greater Noida',
    score: 52,
    drillsCompleted: 14,
    status: 'WATCH',
    weakCompetency: 'comp-demarcation (Census Boundary Demarcation)',
  },
  {
    id: 'tr-07',
    name: 'Manish Tiwari',
    cadre: 'Subordinate Statistical Service (SSS)',
    designation: 'Statistical Investigator Gr. II',
    center: 'ZTC Nagpur',
    score: 56,
    drillsCompleted: 12,
    status: 'WATCH',
    weakCompetency: 'comp-survey (Sampling Weights)',
  },
  {
    id: 'tr-08',
    name: 'Pooja Deshmukh',
    cadre: 'NSSO Field Operations Division',
    designation: 'Field Investigator',
    center: 'ZTC Pune',
    score: 54,
    drillsCompleted: 10,
    status: 'WATCH',
    weakCompetency: 'comp-capi (Offline Sync Conflicts)',
  },
];

interface TrainerCohortStudioProps {
  onInspectCohort: (cohort: CohortData) => void;
  onRemediateCohort: (cohort: CohortData) => void;
}

export function TrainerCohortStudio({
  onInspectCohort,
  onRemediateCohort,
}: TrainerCohortStudioProps) {
  const [selectedCadre, setSelectedCadre] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const filteredCohorts = ACTIVE_COHORTS.filter((c) => {
    const matchesCadre = selectedCadre === 'ALL' || c.cadre.includes(selectedCadre);
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.center.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase());
    return matchesCadre && matchesSearch;
  });

  const handleExportRosters = () => {
    setToastMsg('All MoSPI training cohort rosters exported to CSV format.');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Filters */}
      <div className="rounded-3xl bg-white border border-[#BF9B7A]/30 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#8C5B3E]" />
              <h2 className="text-lg font-bold text-[#2d1f17] tracking-tight">
                National Academy Cohorts & Training Batches
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live roster oversight across NSSTA Greater Noida and 5 Zonal Training Centres (ZTCs)
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportRosters}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF6F0] border border-[#BF9B7A]/30 text-xs font-bold text-[#555934] hover:bg-[#F2E6D8] transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export All Rosters</span>
          </button>
        </div>

        {toastMsg && (
          <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{toastMsg}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#BF9B7A]/20">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search batch name, code or center..."
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-[#BF9B7A]/30 text-xs text-[#2d1f17] focus:outline-none focus:ring-1 focus:ring-[#8C5B3E]"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'ALL', label: 'All Cadres' },
              { id: 'ISS', label: 'ISS Officers' },
              { id: 'SSS', label: 'SSS Cadre' },
              { id: 'FOD', label: 'FOD Field Staff' },
              { id: 'DQAD', label: 'DQAD Scrutiny' },
            ].map((cd) => (
              <button
                key={cd.id}
                type="button"
                onClick={() => setSelectedCadre(cd.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                  selectedCadre === cd.id
                    ? 'bg-[#8C5B3E] text-white shadow-2xs'
                    : 'bg-[#FAF6F0] text-muted-foreground hover:bg-[#F2E6D8]'
                }`}
              >
                {cd.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cohorts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCohorts.map((cohort) => (
          <div
            key={cohort.id}
            className="rounded-3xl bg-white border border-[#BF9B7A]/30 p-5 shadow-2xs hover:shadow-xs transition-all space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider bg-[#8C5B3E]/15 text-[#8C5B3E] border border-[#8C5B3E]/30">
                  {cohort.code}
                </span>
                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5 text-[#8C5B3E]" />
                  {cohort.center}
                </span>
              </div>

              <h3 className="font-bold text-base text-[#2d1f17] tracking-tight mt-2">
                {cohort.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">{cohort.cadre}</p>

              {/* Stats Strip */}
              <div className="grid grid-cols-3 gap-2 my-3 p-3 rounded-2xl bg-[#FAF6F0]/70 border border-[#BF9B7A]/20 text-center">
                <div>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Enrolled</p>
                  <p className="text-base font-bold font-mono text-[#2d1f17] mt-0.5">
                    {cohort.enrolled}
                  </p>
                </div>
                <div className="border-x border-[#BF9B7A]/20">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Pass Rate</p>
                  <p className="text-base font-bold font-mono text-[#555934] mt-0.5">
                    {cohort.avgScore}%
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-red-700">At-Risk</p>
                  <p className="text-base font-bold font-mono text-red-600 mt-0.5">
                    {cohort.atRiskCount}
                  </p>
                </div>
              </div>

              {/* Syllabus Meter */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Syllabus Progress</span>
                  <span className="font-mono font-bold text-[#2d1f17]">{cohort.progress}%</span>
                </div>
                <div className="w-full bg-[#EAE0D0] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#8C5B3E]"
                    style={{ width: `${cohort.progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-[#BF9B7A]/20">
              <button
                type="button"
                onClick={() => onInspectCohort(cohort)}
                className="flex-1 py-2 rounded-xl bg-[#FAF6F0] hover:bg-[#F2E6D8] text-[#555934] text-xs font-bold transition-colors cursor-pointer text-center"
              >
                Inspect Batch Details
              </button>
              <button
                type="button"
                onClick={() => onRemediateCohort(cohort)}
                className="py-2 px-3.5 rounded-xl bg-[#8C5B3E] hover:bg-[#704830] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Remediate</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* At-Risk Trainee Deficit Table */}
      <div className="rounded-3xl bg-white border border-[#BF9B7A]/30 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-[#BF9B7A]/20">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <h3 className="text-base font-bold text-[#2d1f17]">
                At-Risk Trainee Intervention Queue (&lt;60% Score)
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Officers requiring targeted remediation before deployment to field operations
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/15 text-red-700 font-mono">
            {AT_RISK_ROSTER.length} Flagged
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#BF9B7A]/20">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF6F0] border-b border-[#BF9B7A]/20 text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Trainee</th>
                <th className="py-3 px-4">Cadre & Center</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Deficient Competency</th>
                <th className="py-3 px-4 text-right">Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#BF9B7A]/15">
              {AT_RISK_ROSTER.map((trainee) => (
                <tr key={trainee.id} className="hover:bg-[#FAF6F0]/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-[#2d1f17]">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-[#8C5B3E]/15 text-[#8C5B3E] flex items-center justify-center font-bold text-xs font-mono">
                        {trainee.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p>{trainee.name}</p>
                        <p className="text-[10px] text-muted-foreground font-normal">
                          {trainee.designation}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-[#2d1f17]">{trainee.cadre}</p>
                    <p className="text-[10px] text-muted-foreground">{trainee.center}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-sm text-red-600">
                      {trainee.score}%
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[#8C5B3E] font-medium">
                    {trainee.weakCompetency}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onRemediateCohort(ACTIVE_COHORTS[0])}
                      className="px-3 py-1 rounded-xl bg-[#8C5B3E] hover:bg-[#704830] text-white text-[11px] font-bold transition-all shadow-2xs cursor-pointer inline-flex items-center gap-1"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>Dispatch Drill</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TrainerCohortStudio;
