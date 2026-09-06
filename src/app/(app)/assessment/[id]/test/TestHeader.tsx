/**
 * src/app/(app)/assessment/[id]/test/TestHeader.tsx
 *
 * Sticky header displayed during an active assessment.
 * Shows: assessment name | question counter | timer | End Test button.
 */

import { Clock, AlertTriangle, StopCircle } from 'lucide-react';

interface TestHeaderProps {
  title: string;
  currentIndex: number;
  totalQuestions: number;
  remainingSeconds: number;
  onEndTest: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function TestHeader({
  title,
  currentIndex,
  totalQuestions,
  remainingSeconds,
  onEndTest,
}: TestHeaderProps) {
  const isWarning = remainingSeconds <= 60 && remainingSeconds > 0;
  const isCritical = remainingSeconds <= 30 && remainingSeconds > 0;

  return (
    <header className="flex items-center justify-between gap-4 border-b border-border bg-white px-4 sm:px-6 py-3 shadow-sm sticky top-0 z-30">
      {/* Left: Assessment title + question counter */}
      <div className="flex flex-col min-w-0">
        <h1 className="text-base sm:text-lg font-bold text-foreground truncate leading-tight">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Question {currentIndex + 1} of {totalQuestions}
        </p>
      </div>

      {/* Centre-right: Timer */}
      <div
        className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border font-mono font-bold text-base sm:text-xl transition-colors flex-shrink-0 ${
          isCritical
            ? 'border-red-500 bg-red-500/10 text-red-600 animate-pulse'
            : isWarning
            ? 'border-amber-400 bg-amber-50 text-amber-700'
            : 'border-border bg-secondary text-foreground'
        }`}
        role="timer"
        aria-label={`Time remaining: ${formatTime(remainingSeconds)}`}
        aria-live="off"
      >
        {isCritical || isWarning ? (
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        ) : (
          <Clock className="w-4 h-4 flex-shrink-0" />
        )}
        <span>{formatTime(remainingSeconds)}</span>
      </div>

      {/* Right: End Test */}
      <button
        id="end-test-button"
        onClick={onEndTest}
        className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 text-sm font-semibold hover:bg-rose-100 transition-colors flex-shrink-0"
      >
        <StopCircle className="w-4 h-4 flex-shrink-0" />
        <span className="hidden sm:inline">End Test</span>
        <span className="sm:hidden">End</span>
      </button>
    </header>
  );
}
