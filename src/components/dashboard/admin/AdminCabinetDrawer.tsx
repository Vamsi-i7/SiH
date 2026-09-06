'use client';

import React from 'react';
import { Download, FileText, Send, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AdminCabinetDrawerProps {
  onOpenBriefingModal?: () => void;
  onOpenRosterModal?: () => void;
  onOpenSweepModal?: () => void;
}

export function AdminCabinetDrawer({
  onOpenBriefingModal,
  onOpenRosterModal,
  onOpenSweepModal,
}: AdminCabinetDrawerProps = {}) {
  const handleExportPDF = () => {
    if (onOpenBriefingModal) {
      onOpenBriefingModal();
    } else {
      alert('Generating Official MoSPI Ministerial Briefing PDF (Confidential)...');
    }
  };

  const handleExportCSV = () => {
    if (onOpenRosterModal) {
      onOpenRosterModal();
    } else {
      alert('Downloading National Cadre Competency Matrix CSV (4,850 rows)...');
    }
  };

  const handleCommissionRound = () => {
    if (onOpenSweepModal) {
      onOpenSweepModal();
    } else {
      alert('National Statistical Capacity Building Round commissioned for Q3 2026.');
    }
  };

  return (
    <div className="rounded-3xl bg-white border border-[#BF9B7A]/30 p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 pb-4 border-b border-[#BF9B7A]/20">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#555934]" />
            <h2 className="text-base font-bold text-[#2d1f17]">
              Ministerial Governance &amp; Reports
            </h2>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#555934]/10 text-[#555934]">
            <ShieldCheck className="h-3 w-3" />
            Cabinet Level
          </span>
        </div>

        <p className="text-xs text-muted-foreground mt-2 mb-4">
          Statutory reporting exports and executive orders for Secretary (Statistics) and National Statistical Commission (NSC).
        </p>

        <div className="space-y-3">
          {/* Export PDF */}
          <div className="p-4 rounded-2xl bg-[#FAF6F0]/60 border border-[#BF9B7A]/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#8C5B3E]/10 text-[#8C5B3E] flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#2d1f17]">Secretary Briefing Memo (PDF)</h3>
                <p className="text-[11px] text-muted-foreground">Includes econometric regression &amp; regional gap charts</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleExportPDF}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-[#BF9B7A]/40 text-xs font-bold text-[#555934] hover:bg-[#FAF6F0] transition-colors shadow-2xs"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export</span>
            </button>
          </div>

          {/* Download CSV */}
          <div className="p-4 rounded-2xl bg-[#FAF6F0]/60 border border-[#BF9B7A]/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#555934]/10 text-[#555934] flex items-center justify-center shrink-0">
                <Download className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#2d1f17]">National Cadre Roster (CSV)</h3>
                <p className="text-[11px] text-muted-foreground">Complete 4,850 official competency levels and scores</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-[#BF9B7A]/40 text-xs font-bold text-[#555934] hover:bg-[#FAF6F0] transition-colors shadow-2xs"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download</span>
            </button>
          </div>

          {/* Commission Round */}
          <div className="p-4 rounded-2xl bg-[#555934]/10 border border-[#555934]/20 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#555934] text-white flex items-center justify-center shrink-0">
                <Send className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#2d1f17]">Commission Q3 Assessment Sweep</h3>
                <p className="text-[11px] text-muted-foreground">Authorize mandatory verification across all 7 regional zones</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCommissionRound}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-[#555934] text-white text-xs font-bold hover:bg-[#434728] transition-colors shadow-xs"
            >
              <span>Order</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-[#BF9B7A]/20 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Digital Governance Protocol 2026</span>
        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Cabinet Synchronized
        </span>
      </div>
    </div>
  );
}
