/**
 * src/app/(app)/assessment/[id]/test/EndTestModal.tsx
 *
 * Confirmation dialog shown when the user clicks "End Test".
 * Shows answered/unanswered counts.
 * "Continue Test" dismisses; "End Test" confirms.
 */

interface EndTestModalProps {
  answeredCount: number;
  totalQuestions: number;
  onContinue: () => void;
  onConfirmEnd: () => void;
}

export default function EndTestModal({
  answeredCount,
  totalQuestions,
  onContinue,
  onConfirmEnd,
}: EndTestModalProps) {
  const unanswered = totalQuestions - answeredCount;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="end-modal-title"
      aria-describedby="end-modal-desc"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 space-y-6">
        {/* Icon + Title */}
        <div className="text-center space-y-3">
          <div className="mx-auto h-14 w-14 rounded-full bg-rose-100 flex items-center justify-center text-2xl">
            ⏹️
          </div>
          <h2
            id="end-modal-title"
            className="text-xl font-bold text-foreground"
          >
            End Assessment?
          </h2>
        </div>

        {/* Stats */}
        <div
          id="end-modal-desc"
          className="rounded-2xl bg-[#F2E6D8]/50 p-4 space-y-2 text-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total questions</span>
            <span className="font-semibold text-foreground">{totalQuestions}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-emerald-700">Answered</span>
            <span className="font-bold text-emerald-700">{answeredCount}</span>
          </div>
          {unanswered > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-rose-700">Unanswered</span>
              <span className="font-bold text-rose-700">{unanswered}</span>
            </div>
          )}
        </div>

        {unanswered > 0 && (
          <p className="text-sm text-muted-foreground text-center">
            You have <strong>{unanswered} unanswered</strong>{' '}
            {unanswered === 1 ? 'question' : 'questions'}. You can still go back and answer them.
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            id="confirm-end-test"
            onClick={onConfirmEnd}
            className="w-full rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 transition-colors"
          >
            End Test
          </button>
          <button
            id="continue-test"
            onClick={onContinue}
            className="w-full rounded-xl border border-border hover:bg-stone-50 text-foreground font-semibold py-3 transition-colors"
          >
            Continue Test
          </button>
        </div>
      </div>
    </div>
  );
}
