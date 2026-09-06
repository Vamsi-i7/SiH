'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flag } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4">
      <Card className="w-full max-w-lg bg-card border-border shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
            <Flag className="h-5 w-5 text-destructive" />
            Flag Department for Priority Training
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            This administrative write-back alerts trainers and triggers iGOT cohort scheduling.
          </p>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Select Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
                className="w-full p-3 rounded-md border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t border-border pt-4">
            <Button
              type="button"
              variant="ghost"
              size="default"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              size="default"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Flag Department'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
