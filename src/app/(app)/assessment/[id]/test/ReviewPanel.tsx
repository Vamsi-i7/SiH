/**
 * src/app/(app)/assessment/[id]/test/ReviewPanel.tsx
 *
 * Shown after the user ends the test (or timer auto-expires).
 * Displays summary stats and the question grid with status indicators.
 * Allows returning to the test OR final submission.
 */

import type { EngineState, QuestionStatus } from '@/services/assessmentEngine';
import { getQuestionStatus, getAnsweredCount } from '@/services/assessmentEngine';

interface ReviewPanelProps {
  state: EngineState;
  timedOut: boolean;
  onContinueTest: () => void;
  onSubmit: () => void;
}

function statusDot(status: QuestionStatus): { label: string; cls: string } {
  switch (status) {
    case 'answered':
      return { label: 'Answered', cls: 'bg-emerald-100 border-emerald-400 text-emerald-800' };
    case 'visited':
      return { label: 'Visited', cls: 'bg-rose-100 border-rose-400 text-rose-700' };
    default:
      return { label: 'Unseen', cls: 'bg-white border-stone-300 text-stone-500' };
  }
}

export default function ReviewPanel({
  state,
  timedOut,
  onContinueTest,
  onSubmit,
}: ReviewPanelProps) {
  const questions = state.assessment.questions;
  const total = questions.length;
  const answered = getAnsweredCount(state);
  const unanswered = total - answered;

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 max-w-3xl mx-auto w-full space-y-8">
      {/* Auto-submit notice */}
      {timedOut && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 font-medium text-center">
          ⏱️ Time expired — the assessment has ended automatically.
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Assessment Review</h1>
        <p className="text-muted-foreground text-sm">
          Review your progress below. {unanswered > 0 && !timedOut && 'You can still go back and answer unanswered questions.'}
        </p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: total, cls: 'text-foreground' },
          { label: 'Answered', value: answered, cls: 'text-emerald-700' },
          { label: 'Unanswered', value: unanswered, cls: unanswered > 0 ? 'text-rose-600' : 'text-emerald-700' },
        ].map(({ label, value, cls }) => (
          <div
            key={label}
            className="rounded-xl border border-border bg-white p-4 text-center shadow-sm"
          >
            <p className={`text-3xl font-bold font-mono ${cls}`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Question grid */}
      <div className="rounded-xl border border-border bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-base font-semibold text-foreground">Question Status</h2>
        <div className="flex flex-wrap gap-2" role="list" aria-label="Question statuses">
          {questions.map((q, idx) => {
            const status = getQuestionStatus(state, q);
            const { label, cls } = statusDot(status);
            return (
              <div
                key={q.id}
                role="listitem"
                title={`Q${idx + 1}: ${label}`}
                aria-label={`Question ${idx + 1}: ${label}`}
                className={`h-9 w-9 rounded-md border-2 flex items-center justify-center text-sm font-semibold ${cls}`}
              >
                {idx + 1}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground pt-1">
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

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          id="submit-assessment"
          onClick={onSubmit}
          className="flex-1 rounded-xl bg-[#8b9a6e] hover:bg-[#6e7d56] text-white font-bold py-3.5 transition-colors text-sm sm:text-base"
        >
          Submit Assessment
        </button>
        {!timedOut && (
          <button
            id="review-continue-test"
            onClick={onContinueTest}
            className="flex-1 rounded-xl border border-border hover:bg-stone-50 text-foreground font-semibold py-3.5 transition-colors text-sm sm:text-base"
          >
            Continue Test
          </button>
        )}
      </div>
    </div>
  );
}
