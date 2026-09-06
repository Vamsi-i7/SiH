'use client';

import React from 'react';
import { FileText, CheckCircle2, Upload, Eye, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface IngestedDoc {
  id: string;
  manualId: string;
  title: string;
  division: string;
  pages: number;
  chunksCount: number;
  questionsGenerated: number;
  status: 'INDEXED' | 'SYNCED' | 'EXTRACTING';
  updatedAt: string;
}

const INGESTED_DOCUMENTS: IngestedDoc[] = [
  {
    id: 'doc-1',
    manualId: 'manual-plfs-vol1',
    title: 'PLFS 2026 Instructions Vol. 1: Field Operations',
    division: 'NSSO Field Operations Division',
    pages: 184,
    chunksCount: 412,
    questionsGenerated: 94,
    status: 'INDEXED',
    updatedAt: '2 days ago',
  },
  {
    id: 'doc-2',
    manualId: 'manual-schedule0',
    title: 'Schedule 0.0 Household Listing & Demarcation Handbook',
    division: 'Survey Design & Research Division (SDRD)',
    pages: 96,
    chunksCount: 228,
    questionsGenerated: 62,
    status: 'INDEXED',
    updatedAt: '3 days ago',
  },
  {
    id: 'doc-3',
    manualId: 'manual-capi',
    title: 'ASHE & CAPI Tablet Operational Protocol Ver 2026.2',
    division: 'Data Processing Division (DPD)',
    pages: 64,
    chunksCount: 146,
    questionsGenerated: 48,
    status: 'SYNCED',
    updatedAt: '5 days ago',
  },
  {
    id: 'doc-4',
    manualId: 'manual-plfs-vol1',
    title: 'National Industrial Classification (NIC-2008) Concordance',
    division: 'Data Quality Assurance Division (DQAD)',
    pages: 120,
    chunksCount: 310,
    questionsGenerated: 76,
    status: 'INDEXED',
    updatedAt: '1 week ago',
  },
  {
    id: 'doc-5',
    manualId: 'manual-schedule0',
    title: 'Annual Survey of Industries (ASI) Scrutiny Rules',
    division: 'Economic Statistics Division (ESD)',
    pages: 78,
    chunksCount: 180,
    questionsGenerated: 54,
    status: 'SYNCED',
    updatedAt: '2 weeks ago',
  },
];

interface IngestedDocumentsLedgerProps {
  onOpenManualReader?: (manualId: string) => void;
}

export function IngestedDocumentsLedger({ onOpenManualReader }: IngestedDocumentsLedgerProps) {
  return (
    <div className="rounded-3xl bg-white border border-[#BF9B7A]/30 p-6 shadow-xs overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#BF9B7A]/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#555934]" />
            <h2 className="text-lg font-bold text-[#2d1f17]">
              Ingested MoSPI Manuals & Chunks
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            FR-CONTENT-1..5 • Semantic vector chunks and AI question generation lineage
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/documents"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#555934] text-white text-xs font-bold hover:bg-[#434728] transition-colors shadow-2xs"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload New Manual</span>
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#BF9B7A]/20 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              <th className="pb-3 pl-2">Manual / SOP Title</th>
              <th className="pb-3 hidden md:table-cell">MoSPI Division</th>
              <th className="pb-3">Chunks</th>
              <th className="pb-3">Questions</th>
              <th className="pb-3 hidden sm:table-cell">Status</th>
              <th className="pb-3 pr-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#BF9B7A]/15 text-xs">
            {INGESTED_DOCUMENTS.map((doc) => (
              <tr key={doc.id} className="hover:bg-[#FAF6F0]/50 transition-colors">
                {/* Title */}
                <td className="py-4 pl-2 pr-4">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-xl bg-[#8C5B3E]/10 text-[#8C5B3E] flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[#2d1f17] line-clamp-1">{doc.title}</p>
                      <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                        {doc.pages} Pages • Updated {doc.updatedAt}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Division */}
                <td className="py-4 pr-4 hidden md:table-cell text-muted-foreground font-medium">
                  {doc.division}
                </td>

                {/* Chunks */}
                <td className="py-4 pr-4 font-mono font-bold text-[#2d1f17]">
                  {doc.chunksCount}
                </td>

                {/* Questions */}
                <td className="py-4 pr-4 font-mono font-bold text-[#555934]">
                  {doc.questionsGenerated}
                </td>

                {/* Status */}
                <td className="py-4 pr-4 hidden sm:table-cell">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 border border-emerald-500/30">
                    <CheckCircle2 className="h-3 w-3" />
                    {doc.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-4 pr-2 text-right">
                  {onOpenManualReader ? (
                    <button
                      type="button"
                      onClick={() => onOpenManualReader(doc.manualId)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FAF6F0] border border-[#BF9B7A]/30 text-xs font-bold text-[#555934] hover:bg-[#F2E6D8] transition-colors cursor-pointer"
                    >
                      <BookOpen className="h-3 w-3" />
                      <span>Inspect</span>
                    </button>
                  ) : (
                    <Link
                      href="/documents"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FAF6F0] border border-[#BF9B7A]/30 text-xs font-bold text-[#555934] hover:bg-[#FAF6F0]/80 transition-colors"
                    >
                      <Eye className="h-3 w-3" />
                      <span>Chunks</span>
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default IngestedDocumentsLedger;
