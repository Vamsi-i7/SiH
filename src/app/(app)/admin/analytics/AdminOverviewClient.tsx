'use client';

import React, { useState, useEffect } from 'react';
import { type WorkforceOverview, type DepartmentSummary, type TrainingPriority } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ProvenanceBadge } from '@/components/ProvenanceBadge';
import { BarChart } from '@/components/BarChart';
import { SparkLine } from '@/components/SparkLine';
import { FlagDepartmentModal } from '@/components/FlagDepartmentModal';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import Link from 'next/link';

interface AdminOverviewClientProps {
  initialOverview: WorkforceOverview;
  initialDepartments: DepartmentSummary[];
  initialPriorities: TrainingPriority[];
}

export function AdminOverviewClient({
  initialOverview,
  initialDepartments,
  initialPriorities,
}: AdminOverviewClientProps) {
  const [departments, setDepartments] = useState<DepartmentSummary[]>(initialDepartments);
  const [priorities, setPriorities] = useState<TrainingPriority[]>(initialPriorities);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeptForModal, setSelectedDeptForModal] = useState<string>('');
  const [deptSearch, setDeptSearch] = useState<string>('');

  // Firestore Realtime Subscription
  useEffect(() => {
    try {
      const q = query(collection(db, 'department_flags'), orderBy('flagged_at', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const livePriorities: TrainingPriority[] = snapshot.docs.map((docSnap) => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            department: d.department || 'NSSO (FOD)',
            organization_id: d.organization_id || 'org-mospi',
            reason: d.reason || '',
            flagged_by: d.flagged_by || 'admin',
            flagged_at: d.flagged_at || new Date().toISOString(),
            resolved: d.resolved || false,
          };
        });
        if (livePriorities.length > 0) {
          setPriorities(livePriorities);
        }
      });

      return () => unsubscribe();
    } catch {
      // Local fallback mode
    }
  }, []);

  const handleFlagSuccess = (newPriority: unknown) => {
    const pri = newPriority as TrainingPriority;
    setPriorities((prev) => [pri, ...prev.filter((p) => p.id !== pri.id)]);
    setDepartments((prev) =>
      prev.map((d) =>
        d.department.toLowerCase() === pri.department.toLowerCase()
          ? { ...d, isPriorityFlagged: true }
          : d
      )
    );
  };

  const handleResolveFlag = (id: string, departmentName: string) => {
    setPriorities((prev) => prev.filter((p) => p.id !== id));
    setDepartments((prev) => {
      const remainingForDept = priorities.filter(
        (p) => p.id !== id && p.department.toLowerCase() === departmentName.toLowerCase()
      );
      if (remainingForDept.length === 0) {
        return prev.map((d) =>
          d.department.toLowerCase() === departmentName.toLowerCase()
            ? { ...d, isPriorityFlagged: false }
            : d
        );
      }
      return prev;
    });
  };

  const filteredDepartments = departments.filter((d) =>
    d.department.toLowerCase().includes(deptSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Workforce Intelligence & Analytics</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Macro statistical readiness indices, department capability drill-downs, and regulatory write-backs.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/analytics/correlation"
            prefetch={true}
            className="px-4 py-2 bg-primary text-primary-foreground font-semibold text-xs rounded-lg hover:opacity-90 transition-opacity shadow-sm flex items-center gap-1.5"
          >
            📊 View Outcome Correlation →
          </Link>
          <ProvenanceBadge provenance="VERIFIED_OFFICIAL" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-semibold text-muted-foreground">Total Survey Workforce</CardTitle>
            <div className="text-3xl font-black text-foreground mt-1">
              {initialOverview.totalOfficials.toLocaleString()}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
              <SparkLine data={[1200, 1310, 1380, 1420]} width={60} height={16} />
              <span>Across 6 Cadres</span>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-semibold text-muted-foreground">Average Readiness Index</CardTitle>
            <div className="text-3xl font-black text-foreground mt-1">{initialOverview.avgReadiness}%</div>
            <div className="text-[11px] text-[--color-primary] mt-1 font-semibold">
              ↗ +4.2% from baseline
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-semibold text-muted-foreground">Critical Gaps Identified</CardTitle>
            <div className="text-3xl font-black text-[--color-destructive] mt-1">{initialOverview.criticalGaps}</div>
            <div className="text-[11px] text-[--color-destructive] mt-1 font-semibold">Requires immediate training</div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-semibold text-muted-foreground">Priority Training Flags</CardTitle>
            <div className="text-3xl font-black text-amber-600 mt-1">{priorities.length}</div>
            <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Realtime Broadcast Active</span>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Department Breakdown & Priority Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Department Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  Cadre & Department Breakdown
                </CardTitle>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Showing {filteredDepartments.length} of {departments.length} regional wings
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Filter departments..."
                  value={deptSearch}
                  onChange={(e) => setDeptSearch(e.target.value)}
                  className="px-2.5 py-1 text-xs border border-border rounded-lg bg-card focus:outline-none focus:ring-1 focus:ring-primary w-36 sm:w-44"
                />
                <button
                  onClick={() => {
                    setSelectedDeptForModal(departments[0]?.department || '');
                    setIsModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-xs shrink-0"
                >
                  🚩 Flag Department
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border">
                {filteredDepartments.map((dept) => (
                  <div key={dept.department} className="py-3.5 first:pt-0 last:pb-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/admin/analytics/departments/${encodeURIComponent(dept.department)}`}
                        prefetch={true}
                        className="font-bold text-sm text-foreground hover:text-primary transition-colors flex items-center gap-2"
                      >
                        <span>{dept.department}</span>
                        {dept.isPriorityFlagged && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                            🚩 FLAGGED
                          </span>
                        )}
                      </Link>
                      <span className="text-xs font-medium text-muted-foreground">
                        {dept.officialCount} officials • {dept.criticalGapCount} critical gaps
                      </span>
                    </div>
                    <BarChart label="Readiness Index" value={dept.avgReadiness} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Active Training Priorities (Realtime) */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold text-foreground flex items-center justify-between">
                <span>Active Priority Flags</span>
                <span className="text-[10px] font-normal text-muted-foreground">Live Feed</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {priorities.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">
                  No active priority training flags.
                </p>
              ) : (
                <div className="space-y-3">
                  {priorities.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg border border-border bg-card space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">{item.department}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(item.flagged_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{item.reason}</p>
                      <div className="pt-1 flex justify-end">
                        <button
                          onClick={() => handleResolveFlag(item.id, item.department)}
                          className="text-[10px] font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 transition"
                        >
                          Mark Resolved ✓
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Flag Department Modal */}
      <FlagDepartmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        departments={departments.map((d) => d.department)}
        initialDepartment={selectedDeptForModal}
        onSuccess={handleFlagSuccess}
      />
    </div>
  );
}
