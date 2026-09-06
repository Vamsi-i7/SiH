'use client';

import React, { useState } from 'react';
import { Flag, CheckCircle2, AlertTriangle, Search } from 'lucide-react';

export interface DepartmentRow {
  id: string;
  name: string;
  zone: string;
  headcount: number;
  readinessPercent: number;
  avgLevel: string;
  errorRate: number;
  isFlagged: boolean;
}

const INITIAL_DEPARTMENTS: DepartmentRow[] = [
  {
    id: 'dept-fod-br',
    name: 'FOD Bihar Regional Office',
    zone: 'Eastern Zone',
    headcount: 520,
    readinessPercent: 46,
    avgLevel: 'L1.2',
    errorRate: 19.8,
    isFlagged: true,
  },
  {
    id: 'dept-fod-upe',
    name: 'FOD UP East Regional Office',
    zone: 'Central-East Zone',
    headcount: 610,
    readinessPercent: 54,
    avgLevel: 'L2.1',
    errorRate: 15.4,
    isFlagged: true,
  },
  {
    id: 'dept-fod-od',
    name: 'FOD Odisha Regional Office',
    zone: 'Eastern Zone',
    headcount: 480,
    readinessPercent: 62,
    avgLevel: 'L2.8',
    errorRate: 11.2,
    isFlagged: false,
  },
  {
    id: 'dept-fod-wb',
    name: 'FOD West Bengal Regional Office',
    zone: 'Eastern Zone',
    headcount: 550,
    readinessPercent: 68,
    avgLevel: 'L3.1',
    errorRate: 9.5,
    isFlagged: false,
  },
  {
    id: 'dept-fod-mh',
    name: 'FOD Maharashtra Regional Office',
    zone: 'Western Zone',
    headcount: 740,
    readinessPercent: 76,
    avgLevel: 'L3.6',
    errorRate: 6.8,
    isFlagged: false,
  },
  {
    id: 'dept-cso-delhi',
    name: 'Central Statistics Office (CSO) New Delhi',
    zone: 'Headquarters',
    headcount: 340,
    readinessPercent: 82,
    avgLevel: 'L3.8',
    errorRate: 5.2,
    isFlagged: false,
  },
  {
    id: 'dept-dqad-kolkata',
    name: 'Data Quality Assurance Division (DQAD) Kolkata',
    zone: 'Statistical Audit',
    headcount: 290,
    readinessPercent: 86,
    avgLevel: 'L4.1',
    errorRate: 3.8,
    isFlagged: false,
  },
  {
    id: 'dept-fod-kl',
    name: 'FOD Kerala Regional Office',
    zone: 'Southern Zone',
    headcount: 580,
    readinessPercent: 94,
    avgLevel: 'L4.8',
    errorRate: 1.9,
    isFlagged: false,
  },
];

interface DepartmentBreakdownTableProps {
  onInspectOffice?: (office: DepartmentRow) => void;
}

export function DepartmentBreakdownTable({ onInspectOffice }: DepartmentBreakdownTableProps = {}) {
  const [departments, setDepartments] = useState<DepartmentRow[]>(INITIAL_DEPARTMENTS);
  const [search, setSearch] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleFlag = (id: string, deptName: string) => {
    setDepartments((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const nextState = !d.isFlagged;
          setToastMessage(
            nextState
              ? `🚩 ${deptName} flagged for Priority NSSTA Training.`
              : `Flag removed for ${deptName}.`
          );
          setTimeout(() => setToastMessage(null), 3000);
          return { ...d, isFlagged: nextState };
        }
        return d;
      })
    );
  };

  const filtered = departments.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.zone.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rounded-3xl bg-white border border-[#BF9B7A]/30 p-6 shadow-xs overflow-hidden">
      {/* Toast alert banner */}
      {toastMessage && (
        <div className="mb-4 p-3 rounded-2xl bg-[#555934] text-white text-xs font-bold flex items-center justify-between shadow-xs">
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-white/70 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#BF9B7A]/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#8C5B3E]" />
            <h2 className="text-lg font-bold text-[#2d1f17]">
              Regional Offices &amp; Division Readiness
            </h2>
          </div>
          <p className="text-xs text-[#705849] mt-0.5">
            FR-ADMIN-4 • Live cadre capacity monitoring and ministerial priority assignment
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#705849]" />
          <input
            type="text"
            placeholder="Filter by RO or zone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#FAF6F0] border border-[#BF9B7A]/30 text-xs text-[#2d1f17] focus:outline-none focus:ring-2 focus:ring-[#555934]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#BF9B7A]/20 text-[11px] font-bold text-[#705849] uppercase tracking-wider">
              <th className="pb-3 pl-2">Regional Office / Division</th>
              <th className="pb-3">Officers</th>
              <th className="pb-3">Readiness</th>
              <th className="pb-3">Error Rate</th>
              <th className="pb-3 hidden sm:table-cell">Status</th>
              <th className="pb-3 pr-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#BF9B7A]/15 text-xs">
            {filtered.map((dept) => {
              const isCritical = dept.readinessPercent < 60 || dept.errorRate > 12;
              const isOptimal = dept.readinessPercent >= 80;

              return (
                <tr key={dept.id} className="hover:bg-[#FAF6F0]/50 transition-colors">
                  {/* Name & Zone */}
                  <td className="py-4 pl-2 pr-4">
                    <p className="font-bold text-[#2d1f17]">{dept.name}</p>
                    <p className="text-[11px] text-[#705849]">{dept.zone}</p>
                  </td>

                  {/* Officers */}
                  <td className="py-4 pr-4 font-mono font-bold text-[#2d1f17]">
                    {dept.headcount}
                  </td>

                  {/* Readiness */}
                  <td className="py-4 pr-4">
                    <div className="space-y-1 min-w-[100px]">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="font-bold text-[#2d1f17]">{dept.readinessPercent}%</span>
                        <span className="text-[#705849]">{dept.avgLevel}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[#BF9B7A]/20 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            dept.readinessPercent >= 70 ? 'bg-emerald-600' : 'bg-[#8C5B3E]'
                          }`}
                          style={{ width: `${dept.readinessPercent}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Error Rate */}
                  <td className="py-4 pr-4 font-mono font-bold text-[#8C5B3E]">
                    {dept.errorRate}%
                  </td>

                  {/* Status */}
                  <td className="py-4 pr-4 hidden sm:table-cell">
                    {isCritical ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-700 border border-red-500/30">
                        <AlertTriangle className="h-3 w-3" />
                        CRITICAL GAP
                      </span>
                    ) : isOptimal ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 border border-emerald-500/30">
                        <CheckCircle2 className="h-3 w-3" />
                        OPTIMAL
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 border border-amber-500/30">
                        MONITORING
                      </span>
                    )}
                  </td>

                  {/* Action: Inspect & Flag Priority Training */}
                  <td className="py-4 pr-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onInspectOffice && onInspectOffice(dept)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-[#FAF6F0] text-[#555934] border border-[#BF9B7A]/40 hover:bg-white transition-all cursor-pointer shadow-2xs"
                      >
                        <span>Inspect</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleFlag(dept.id, dept.name)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          dept.isFlagged
                            ? 'bg-red-500/15 text-red-700 border border-red-500/40 hover:bg-red-500/25'
                            : 'bg-[#FAF6F0] text-[#555934] border border-[#BF9B7A]/40 hover:bg-[#555934] hover:text-white'
                        }`}
                      >
                        <Flag className="h-3 w-3" />
                        <span>{dept.isFlagged ? 'Flagged 🚩' : 'Flag Priority Training'}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
