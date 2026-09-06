/**
 * src/app/(app)/assessment/[id]/test/QuestionNavigator.tsx
 *
 * Numbered question navigator with paginated windows of 10.
 * Status colours:
 *   unseen   → white  (not yet visited)
 *   visited  → red    (seen but not answered)
 *   answered → green  (has a selected answer)
 * Current question gets an accent ring on top of its status colour.
 */

import type { QuestionStatus } from '@/services/assessmentEngine';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const PAGE_SIZE = 10;

interface QuestionNavigatorProps {
  totalQuestions: number;
  currentIndex: number;
  statuses: QuestionStatus[]; // index-aligned
  onNavigate: (index: number) => void;
}

function statusClass(status: QuestionStatus, isCurrent: boolean): string {
  const ring = isCurrent ? ' ring-2 ring-offset-1 ring-[#555934]' : '';
  switch (status) {
    case 'answered':
      return `bg-emerald-100 border-emerald-400 text-emerald-800 hover:bg-emerald-200${ring}`;
    case 'visited':
      return `bg-rose-100 border-rose-400 text-rose-700 hover:bg-rose-200${ring}`;
    default:
      return `bg-white border-stone-300 text-stone-700 hover:bg-stone-50${ring}`;
  }
}

function statusLabel(status: QuestionStatus): string {
  switch (status) {
    case 'answered':
      return 'Answered';
    case 'visited':
      return 'Visited, not answered';
    default:
      return 'Not yet visited';
  }
}

export default function QuestionNavigator({
  totalQuestions,
  currentIndex,
  statuses,
  onNavigate,
}: QuestionNavigatorProps) {
  const totalPages = Math.ceil(totalQuestions / PAGE_SIZE);
  const [page, setPage] = useState(() => Math.floor(currentIndex / PAGE_SIZE));

  // Keep page in sync when currentIndex moves outside current page window
  const targetPage = Math.floor(currentIndex / PAGE_SIZE);
  if (targetPage !== page) {
    setPage(targetPage);
  }

  const startIdx = page * PAGE_SIZE;
  const endIdx = Math.min(startIdx + PAGE_SIZE, totalQuestions);
  const indices = Array.from({ length: endIdx - startIdx }, (_, i) => startIdx + i);

  return (
    <div className="border-b border-border bg-stone-50 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Questions
        </p>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1 rounded hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page of questions"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-muted-foreground px-1">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="p-1 rounded hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page of questions"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Number grid */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Question navigation">
        {indices.map((qIdx) => {
          const status = statuses[qIdx] ?? 'unseen';
          const isCurrent = qIdx === currentIndex;
          return (
            <button
              key={qIdx}
              id={`q-nav-${qIdx + 1}`}
              onClick={() => onNavigate(qIdx)}
              aria-label={`Question ${qIdx + 1}: ${statusLabel(status)}${isCurrent ? ' (current)' : ''}`}
              aria-current={isCurrent ? 'true' : undefined}
              className={`h-9 w-9 rounded-md border-2 text-sm font-semibold transition-all ${statusClass(status, isCurrent)}`}
            >
              {qIdx + 1}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        {[
          { label: 'Unseen', cls: 'bg-white border-stone-300 border-2' },
          { label: 'Visited', cls: 'bg-rose-100 border-rose-400 border-2' },
          { label: 'Answered', cls: 'bg-emerald-100 border-emerald-400 border-2' },
        ].map(({ label, cls }) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className={`inline-block h-3.5 w-3.5 rounded-sm ${cls}`} aria-hidden="true" />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
