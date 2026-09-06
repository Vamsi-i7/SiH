'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Download,
  Search,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  BarChart3,
  UploadCloud,
} from 'lucide-react';
import Link from 'next/link';
import type { ItemAnalysisData } from '../modals/ItemAnalysisModal';

const CURRICULUM_ITEMS: ItemAnalysisData[] = [
  {
    id: 'q-bank-01',
    stem: 'When the estimated population of an allocated rural First Stage Unit (FSU) exceeds 1,200 persons during Schedule 0.0 listing, what is the statutory minimum number of hamlet-groups to be formed?',
    options: [
      '2 equal hamlet-groups with approximately equal population',
      '3 or more hamlet-groups formed according to Annexure 2.1 population brackets',
      'Hamlet-group formation is optional if census enumeration blocks are pre-marked',
      'Subdivide the village into 4 arbitrary quadrats regardless of population',
    ],
    correctIndex: 1,
    discriminationIndex: 0.44,
    facilityIndex: 0.68,
    distractorPercentages: [14, 68, 12, 6],
    totalResponses: 420,
    competencyTag: 'comp-demarcation',
    sourceDoc: 'MoSPI Schedule 0.0 Field Handbook 2026',
    section: 'Section 4.12: Hamlet-Group Formation Rules',
    sourceSnippet: 'In cases where the estimated population of the allocated rural First Stage Unit exceeds 1,200 persons, the investigator shall divide the village into three or more hamlet-groups.',
    status: 'approved',
  },
  {
    id: 'q-bank-02',
    stem: 'Under CAPI protocol ASHE-2026, what action must an investigator take when the tablet GPS geofencing accuracy error exceeds 25 meters during household listing?',
    options: [
      'Manually override the GPS lock and proceed with immediate interview',
      'Wait for satellite lock under open sky for at least 3 minutes, then record reference landmark coordinates',
      'Skip the GPS coordinates column and complete the interview on paper schedule',
      'Re-boot the Android tablet into factory recovery mode',
    ],
    correctIndex: 1,
    discriminationIndex: 0.38,
    facilityIndex: 0.74,
    distractorPercentages: [12, 74, 10, 4],
    totalResponses: 530,
    competencyTag: 'comp-capi',
    sourceDoc: 'ASHE & CAPI Tablet Operational Manual',
    section: 'Section 2.4: GPS Precision Fallback Criteria',
    sourceSnippet: 'If the GPS accuracy radius exceeds 25 meters, the investigator must step out to clear sky for at least 3 minutes.',
    status: 'approved',
  },
  {
    id: 'q-bank-03',
    stem: 'In Periodic Labour Force Survey (PLFS) Schedule 10.4, an unpaid family member assisting in a household shop for 2 hours daily with no wages is classified under which Usual Principal Activity Status (UPAS)?',
    options: [
      'Code 11: Self-employed own account worker',
      'Code 21: Helper in household enterprise (unpaid family worker)',
      'Code 81: Out of labour force (attending domestic duties)',
      'Code 91: Unemployed seeking work',
    ],
    correctIndex: 1,
    discriminationIndex: 0.52,
    facilityIndex: 0.82,
    distractorPercentages: [8, 82, 7, 3],
    totalResponses: 610,
    competencyTag: 'comp-nsso',
    sourceDoc: 'PLFS Instructions to Field Staff Vol. 1',
    section: 'Section 3.2: UPAS & Subsidiary Activity Status Classification',
    sourceSnippet: 'Persons who engaged in their household enterprises, working full or part time without regular salary are termed unpaid helpers (Status Code 21).',
    status: 'approved',
  },
  {
    id: 'q-bank-04',
    stem: 'Under Annual Survey of Industries (ASI) Block C, how is the statutory depreciation of capitalized factory machinery calculated when actual ledger books are unavailable?',
    options: [
      'Straight-line method at standard Central Board of Direct Taxes (CBDT) statutory rates',
      'Assume zero depreciation until final physical audit inspection',
      'Deduct 50% arbitrary lump-sum allowance',
      'Omit Block C and record qualification in scrutiny notes',
    ],
    correctIndex: 0,
    discriminationIndex: 0.41,
    facilityIndex: 0.59,
    distractorPercentages: [59, 21, 14, 6],
    totalResponses: 310,
    competencyTag: 'comp-survey',
    sourceDoc: 'Annual Survey of Industries (ASI) Scrutiny Rules',
    section: 'Section 5.3: Fixed Capital Depreciation Standards',
    sourceSnippet: 'When enterprise balance sheet ledger entries are missing, statutory CBDT schedule depreciation percentages must be imputed.',
    status: 'pending',
  },
];

interface TrainerCurriculumStudioProps {
  onOpenManualReader: (manualId: string) => void;
  onInspectItem: (item: ItemAnalysisData) => void;
}

export function TrainerCurriculumStudio({
  onOpenManualReader,
  onInspectItem,
}: TrainerCurriculumStudioProps) {
  const [search, setSearch] = useState('');
  const [selectedCompetency, setSelectedCompetency] = useState('ALL');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const filteredItems = CURRICULUM_ITEMS.filter((item) => {
    const matchesComp = selectedCompetency === 'ALL' || item.competencyTag === selectedCompetency;
    const matchesSearch =
      item.stem.toLowerCase().includes(search.toLowerCase()) ||
      item.sourceDoc.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase());
    return matchesComp && matchesSearch;
  });

  const handleExportBank = () => {
    setToastMsg('Exported 342 verified questions to MoSPI Official Examination JSON/CSV.');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Stats */}
      <div className="rounded-3xl bg-white border border-[#BF9B7A]/30 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#555934]" />
              <h2 className="text-lg font-bold text-[#2d1f17] tracking-tight">
                Curriculum Studio & Vector Knowledge Base
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage ingested MoSPI statutory handbooks, chunk indexes, and verified question banks
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/documents"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF6F0] border border-[#BF9B7A]/30 text-xs font-bold text-[#555934] hover:bg-[#F2E6D8] transition-colors"
            >
              <UploadCloud className="h-3.5 w-3.5" />
              <span>Upload Manual</span>
            </Link>
            <button
              type="button"
              onClick={handleExportBank}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#555934] text-white text-xs font-bold hover:bg-[#434728] transition-colors cursor-pointer shadow-2xs"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Question Bank</span>
            </button>
          </div>
        </div>

        {toastMsg && (
          <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Vector Engine KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[#BF9B7A]/20 text-center">
          <div className="p-3 rounded-2xl bg-[#FAF6F0]/60 border border-[#BF9B7A]/20">
            <p className="text-[10px] font-bold uppercase text-muted-foreground">Manuals Ingested</p>
            <p className="text-xl font-extrabold text-[#2d1f17] font-mono mt-0.5">6 Books</p>
          </div>
          <div className="p-3 rounded-2xl bg-[#FAF6F0]/60 border border-[#BF9B7A]/20">
            <p className="text-[10px] font-bold uppercase text-muted-foreground">Vector Chunks</p>
            <p className="text-xl font-extrabold text-[#555934] font-mono mt-0.5">1,276 Chunks</p>
          </div>
          <div className="p-3 rounded-2xl bg-[#FAF6F0]/60 border border-[#BF9B7A]/20">
            <p className="text-[10px] font-bold uppercase text-muted-foreground">Active Pool</p>
            <p className="text-xl font-extrabold text-[#8C5B3E] font-mono mt-0.5">342 MCQs</p>
          </div>
          <div className="p-3 rounded-2xl bg-[#FAF6F0]/60 border border-[#BF9B7A]/20">
            <p className="text-[10px] font-bold uppercase text-emerald-700">RAG Alignment</p>
            <p className="text-xl font-extrabold text-emerald-600 font-mono mt-0.5">99.4%</p>
          </div>
        </div>
      </div>

      {/* Ingested Handbooks Quick Shelf */}
      <div className="rounded-3xl bg-white border border-[#BF9B7A]/30 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#BF9B7A]/20">
          <div>
            <h3 className="text-base font-bold text-[#2d1f17]">Ingested MoSPI Handbooks</h3>
            <p className="text-xs text-muted-foreground">
              Click on any manual to inspect official chapters and vector extracts
            </p>
          </div>
          <Link
            href="/documents"
            className="text-xs font-bold text-[#555934] hover:text-[#434728] inline-flex items-center gap-1"
          >
            <span>All Documents</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: 'manual-plfs-vol1',
              title: 'Instructions to Field Staff: Vol. 1 (PLFS 2026)',
              division: 'NSSO Field Operations Division',
              pages: '184 Pages • 412 Chunks',
              badge: 'Statutory Core',
            },
            {
              id: 'manual-schedule0',
              title: 'Schedule 0.0 Household Listing & Demarcation Handbook',
              division: 'Survey Design & Research Division (SDRD)',
              pages: '96 Pages • 228 Chunks',
              badge: 'Census Fieldwork',
            },
            {
              id: 'manual-capi',
              title: 'ASHE & CAPI Tablet Operational Manual Ver 2026',
              division: 'Data Processing Division (DPD)',
              pages: '64 Pages • 146 Chunks',
              badge: 'Digital CAPI',
            },
          ].map((m) => (
            <div
              key={m.id}
              onClick={() => onOpenManualReader(m.id)}
              className="p-4 rounded-2xl bg-[#FAF6F0]/60 border border-[#BF9B7A]/30 hover:border-[#BF9B7A] hover:bg-[#FAF6F0] transition-all cursor-pointer space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-white text-[#8C5B3E] border border-[#BF9B7A]/25">
                    {m.badge}
                  </span>
                  <BookOpen className="h-4 w-4 text-[#555934]" />
                </div>
                <h4 className="font-bold text-xs text-[#2d1f17] mt-2 line-clamp-2">
                  {m.title}
                </h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">{m.division}</p>
              </div>

              <div className="pt-2 border-t border-[#BF9B7A]/20 flex items-center justify-between text-[10px] text-muted-foreground">
                <span>{m.pages}</span>
                <span className="font-bold text-[#555934]">Inspect Chapters →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filterable Question Bank Browser */}
      <div className="rounded-3xl bg-white border border-[#BF9B7A]/30 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-[#BF9B7A]/20">
          <div>
            <h3 className="text-base font-bold text-[#2d1f17]">
              Curated Question Bank Explorer
            </h3>
            <p className="text-xs text-muted-foreground">
              Filter by competency, Bloom&apos;s level, or examine psychometric properties
            </p>
          </div>

          <Link
            href="/mcq-generator"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8C5B3E] text-white text-xs font-bold hover:bg-[#704830] transition-colors shadow-2xs self-start sm:self-auto"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Generate New MCQs with AI</span>
          </Link>
        </div>

        {/* Search & Competency Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search question stem, source manual..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#BF9B7A]/30 text-xs text-[#2d1f17] focus:outline-none focus:ring-1 focus:ring-[#555934]"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'ALL', label: 'All Competencies' },
              { id: 'comp-demarcation', label: 'Demarcation' },
              { id: 'comp-capi', label: 'CAPI Tablet' },
              { id: 'comp-nsso', label: 'PLFS Labour' },
              { id: 'comp-survey', label: 'Sampling' },
            ].map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCompetency(c.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                  selectedCompetency === c.id
                    ? 'bg-[#555934] text-white'
                    : 'bg-[#FAF6F0] text-muted-foreground hover:bg-[#F2E6D8]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl border border-[#BF9B7A]/25 bg-[#FAF6F0]/50 hover:bg-white hover:shadow-2xs transition-all space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-white text-[#8C5B3E] border border-[#BF9B7A]/25">
                    {item.id}
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#555934]/15 text-[#555934]">
                    {item.competencyTag}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    Discrimination D={item.discriminationIndex.toFixed(2)}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    item.status === 'approved'
                      ? 'bg-emerald-500/15 text-emerald-700'
                      : 'bg-amber-500/15 text-amber-700'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <p className="text-xs font-semibold text-[#2d1f17] leading-relaxed">
                {item.stem}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#BF9B7A]/15 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1.5 font-serif truncate">
                  <BookOpen className="h-3.5 w-3.5 text-[#8C5B3E] shrink-0" />
                  <span className="truncate">{item.sourceDoc} ({item.section})</span>
                </div>

                <button
                  type="button"
                  onClick={() => onInspectItem(item)}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white border border-[#BF9B7A]/30 text-xs font-bold text-[#555934] hover:bg-[#555934] hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  <BarChart3 className="h-3.5 w-3.5" />
                  <span>Item Psychometrics</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TrainerCurriculumStudio;
