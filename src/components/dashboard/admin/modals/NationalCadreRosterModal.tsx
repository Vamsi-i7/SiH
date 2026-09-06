'use client';

import React, { useState } from 'react';
import { X, Download, Search, Users, CheckCircle2 } from 'lucide-react';

interface NationalCadreRosterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CadreOfficer {
  id: string;
  name: string;
  cadre: string;
  station: string;
  fracLevel: string;
  readiness: number;
  errorRate: number;
  status: 'OPTIMAL' | 'COMPETENT' | 'NEEDS_TRIAGE';
}

const SAMPLE_CADRE_ROSTER: CadreOfficer[] = [
  {
    id: 'OFF-01',
    name: 'Amit Sharma',
    cadre: 'SSS (JSO)',
    station: 'SDRD New Delhi',
    fracLevel: 'Level 2.4',
    readiness: 68,
    errorRate: 8.4,
    status: 'COMPETENT',
  },
  {
    id: 'OFF-02',
    name: 'Sunita Devi',
    cadre: 'FOD (FI)',
    station: 'RO Patna (Bihar)',
    fracLevel: 'Level 1.8',
    readiness: 42,
    errorRate: 21.2,
    status: 'NEEDS_TRIAGE',
  },
  {
    id: 'OFF-03',
    name: 'Vikramaditya Rao',
    cadre: 'ISS (Director)',
    station: 'FOD RO Mumbai',
    fracLevel: 'Level 4.6',
    readiness: 91,
    errorRate: 3.1,
    status: 'OPTIMAL',
  },
  {
    id: 'OFF-04',
    name: 'Ananya Sen',
    cadre: 'SSS (SSO)',
    station: 'DQAD Kolkata',
    fracLevel: 'Level 3.8',
    readiness: 84,
    errorRate: 4.5,
    status: 'OPTIMAL',
  },
  {
    id: 'OFF-05',
    name: 'Manoj Tripathi',
    cadre: 'FOD (FI)',
    station: 'RO Varanasi (UP)',
    fracLevel: 'Level 2.1',
    readiness: 51,
    errorRate: 16.8,
    status: 'NEEDS_TRIAGE',
  },
  {
    id: 'OFF-06',
    name: 'Kavitha Pillai',
    cadre: 'SSS (JSO)',
    station: 'RO Thiruvananthapuram',
    fracLevel: 'Level 4.2',
    readiness: 89,
    errorRate: 2.4,
    status: 'OPTIMAL',
  },
  {
    id: 'OFF-07',
    name: 'Deepak Choudhury',
    cadre: 'FOD (FI)',
    station: 'RO Bhubaneswar',
    fracLevel: 'Level 2.9',
    readiness: 64,
    errorRate: 10.5,
    status: 'COMPETENT',
  },
  {
    id: 'OFF-08',
    name: 'Zameer Ahmed',
    cadre: 'SSS (JSO)',
    station: 'RO Bengaluru',
    fracLevel: 'Level 3.4',
    readiness: 76,
    errorRate: 6.2,
    status: 'COMPETENT',
  },
];

export function NationalCadreRosterModal({ isOpen, onClose }: NationalCadreRosterModalProps) {
  const [search, setSearch] = useState('');
  const [selectedCadre, setSelectedCadre] = useState<'ALL' | 'ISS' | 'SSS' | 'FOD'>('ALL');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const filtered = SAMPLE_CADRE_ROSTER.filter((o) => {
    const matchesSearch =
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.station.toLowerCase().includes(search.toLowerCase()) ||
      o.cadre.toLowerCase().includes(search.toLowerCase());
    const matchesCadre = selectedCadre === 'ALL' || o.cadre.includes(selectedCadre);
    return matchesSearch && matchesCadre;
  });

  const handleExportCSV = () => {
    setDownloadSuccess(true);
    setTimeout(() => {
      const headers = ['Officer ID', 'Officer Name', 'Cadre & Rank', 'Posting Station', 'FRAC Competency Level', 'Workforce Readiness %', 'Scrutiny Error Rate %', 'Cadre Status'];
      const rows = SAMPLE_CADRE_ROSTER.map((o) => [
        o.id,
        `"${o.name}"`,
        `"${o.cadre}"`,
        `"${o.station}"`,
        `"${o.fracLevel}"`,
        o.readiness,
        o.errorRate,
        o.status,
      ]);
      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'National_Cadre_Competency_Roster_MoSPI_2026.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 400);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="roster-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-[#FAF6F0] border-2 border-[#BF9B7A]/40 shadow-2xl overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-[#555934] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 p-1 border border-white/20">
              <Users className="h-6 w-6 text-[#F8C858]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-white/20 text-[#FAF6F0] border border-white/30 uppercase">
                  National Cadre Registry • 4,850 Personnel
                </span>
              </div>
              <h2 id="roster-modal-title" className="text-sm sm:text-base font-black tracking-wide text-white mt-0.5">
                MoSPI National Cadre Competency Roster
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close roster modal"
            className="rounded-xl p-1.5 text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Toolbar & Filter Bar */}
        <div className="p-4 sm:p-6 pb-2 border-b border-[#BF9B7A]/20 bg-white/60 shrink-0 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#705849]" />
              <input
                type="text"
                placeholder="Search by officer, station, cadre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#BF9B7A]/30 text-xs text-[#2d1f17] focus:outline-none focus:ring-2 focus:ring-[#555934]"
              />
            </div>

            {/* CSV Download Trigger */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#555934] text-white text-xs font-bold hover:bg-[#434728] transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
            >
              <Download className="h-3.5 w-3.5 text-[#F8C858]" />
              <span>{downloadSuccess ? 'CSV Generated!' : 'Export National Roster (CSV)'}</span>
            </button>
          </div>

          {/* Cadre Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {(['ALL', 'ISS', 'SSS', 'FOD'] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCadre(c)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCadre === c
                    ? 'bg-[#555934] text-white shadow-2xs'
                    : 'bg-[#FAF6F0] text-[#705849] border border-[#BF9B7A]/30 hover:bg-[#FAF6F0]/80'
                }`}
              >
                {c === 'ALL' ? 'All Cadres (4,850)' : `${c} Cadre`}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Table */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="overflow-x-auto rounded-2xl border border-[#BF9B7A]/30 bg-white shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF6F0] border-b border-[#BF9B7A]/20 text-[11px] font-bold text-[#705849] uppercase tracking-wider">
                  <th className="py-3 px-4">Officer Name</th>
                  <th className="py-3 px-3">Cadre &amp; Rank</th>
                  <th className="py-3 px-3">Posting Station</th>
                  <th className="py-3 px-3">FRAC Level</th>
                  <th className="py-3 px-3">Readiness</th>
                  <th className="py-3 px-3">Error Rate</th>
                  <th className="py-3 px-4 text-right">Cadre Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#BF9B7A]/15 font-mono">
                {filtered.map((officer) => (
                  <tr key={officer.id} className="hover:bg-[#FAF6F0]/50 transition-colors">
                    <td className="py-3.5 px-4 font-sans font-bold text-[#2d1f17]">
                      {officer.name}
                    </td>
                    <td className="py-3.5 px-3 font-sans text-[#705849]">
                      {officer.cadre}
                    </td>
                    <td className="py-3.5 px-3 font-sans text-[#705849]">
                      {officer.station}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-[#555934]">
                      {officer.fracLevel}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="space-y-1 min-w-[70px]">
                        <span className="font-bold text-[#2d1f17]">{officer.readiness}%</span>
                        <div className="h-1.5 w-full rounded-full bg-[#BF9B7A]/20 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              officer.readiness >= 75 ? 'bg-emerald-600' : 'bg-[#8C5B3E]'
                            }`}
                            style={{ width: `${officer.readiness}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-[#8C5B3E]">
                      {officer.errorRate}%
                    </td>
                    <td className="py-3.5 px-4 text-right font-sans">
                      {officer.status === 'OPTIMAL' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-800 border border-emerald-500/30">
                          <CheckCircle2 className="h-3 w-3" />
                          Optimal
                        </span>
                      ) : officer.status === 'COMPETENT' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF6F0] text-[#705849] border border-[#BF9B7A]/40">
                          Competent
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-800 border border-red-500/30">
                          Needs Triage
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#FAF6F0] border-t border-[#BF9B7A]/30 px-6 py-3 flex items-center justify-between text-xs text-[#705849] shrink-0">
          <span>Showing {filtered.length} of 4,850 officers across 7 zones</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-[#BF9B7A]/40 text-xs font-bold text-[#705849] hover:bg-white transition-colors cursor-pointer"
          >
            Close Roster
          </button>
        </div>
      </div>
    </div>
  );
}
