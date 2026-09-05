'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

interface FlagDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  departments: string[];
  initialDepartment?: string;
  onSuccess: (priority: unknown) => void;
}

export function FlagDepartmentModal({
  isOpen,
  onClose,
  departments,
  initialDepartment = '',
  onSuccess,
}: FlagDepartmentModalProps) {
  const [department, setDepartment] = useState(initialDepartment);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/flag-department', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ department: department || departments[0], reason }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to flag department');
      }

      const data = await res.json();
      onSuccess(data.priority);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to submit flag');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <Card className="w-full max-w-lg bg-card border-border shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-foreground">
            🚩 Flag Department for Priority Training
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            This administrative write-back alerts trainers and triggers iGOT cohort scheduling.
          </p>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs rounded-lg">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Select Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Justification / Scrutiny Evidence</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Schedule 0.0 listing error rate exceeds 15% threshold in Q1 inspection."
                rows={3}
                required
                className="w-full p-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Flag Department'}
            </button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
