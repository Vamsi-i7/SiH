'use client';

/**
 * src/app/(app)/assessment/[id]/test/TestClient.tsx
 *
 * Main assessment runner.
 * On mount: hides sidebar/topbar via AssessmentModeContext.
 * On unmount/submission: restores normal chrome.
 *
 * Manages EngineState via useReducer.
 * Timer runs in a useRef'd interval — never restarts on re-render.
 * beforeunload warning prevents accidental navigation during ACTIVE phase.
 */

import { useEffect, useReducer, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Assessment } from '@/data/assessments';
import {
  createEngine,
  engineReducer,
  getQuestionStatus,
  getAnsweredCount,
  submitAssessment,
  currentQuestion,
} from '@/services/assessmentEngine';
import offlineQueueManager from '@/services/offlineService';
import { generateUUID } from '@/services/assessmentService';
import { useAssessmentMode } from '@/contexts/AssessmentModeContext';
import TestHeader from './TestHeader';
import QuestionNavigator from './QuestionNavigator';
import QuestionPanel from './QuestionPanel';
import EndTestModal from './EndTestModal';
import ReviewPanel from './ReviewPanel';
import { ChevronLeft, ChevronRight, ClipboardList } from 'lucide-react';

interface TestClientProps {
  assessment: Assessment;
  userId: string;
}

export default function TestClient({ assessment, userId }: TestClientProps) {
  const router = useRouter();
  const { setAssessmentActive } = useAssessmentMode();

  const [state, dispatch] = useReducer(
    engineReducer,
    assessment,
    createEngine
  );

  // Interval ref — store here so it's never recreated on re-render
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Track whether the timer expired (for the review panel notice)
  const timedOutRef = useRef(false);

  // ── Mount / Unmount ────────────────────────────────────────────────────
  useEffect(() => {
    setAssessmentActive(true);
    return () => {
      setAssessmentActive(false);
    };
  }, [setAssessmentActive]);

  // ── Timer ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (state.phase !== 'ACTIVE') {
      // Stop timer when leaving ACTIVE phase
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    if (timerRef.current) return; // Already running — do NOT restart

    timerRef.current = setInterval(() => {
      dispatch({ type: 'TICK_TIMER' });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [state.phase]);

  // Detect timer-triggered auto-end (remainingSeconds hit 0 → phase moved to REVIEW)
  useEffect(() => {
    if (state.phase === 'REVIEW' && state.remainingSeconds === 0) {
      timedOutRef.current = true;
    }
  }, [state.phase, state.remainingSeconds]);

  // ── beforeunload warning ───────────────────────────────────────────────
  useEffect(() => {
    if (state.phase !== 'ACTIVE') return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [state.phase]);

  // ── Submission ─────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    const finalState = submitAssessment(state);
    dispatch({ type: 'SUBMIT_ASSESSMENT' });
    setAssessmentActive(false);

    // Queue for offline sync — mirrors existing offlineService pattern
    try {
      const local_id = generateUUID();
      await offlineQueueManager.queueAssessment({
        local_id,
        assessment_id: null,
        competency_id: assessment.id,
        user_id: userId,
        final_level: 'L1', // Scoring is shown in-app; backend can recompute
        answers: Object.fromEntries(
          Object.entries(finalState.answers).map(([k, v]) => [k, v.toString()])
        ),
        branch_path: 'L1',
        created_at: finalState.startedAt ?? new Date().toISOString(),
      });
    } catch {
      // Offline queue failure is non-fatal; result is shown in-app
    }

    router.push('/assignments');
  }, [state, assessment.id, userId, router, setAssessmentActive]);

  // ── Derived state ──────────────────────────────────────────────────────
  const question = currentQuestion(state);
  const statuses = assessment.questions.map((q) => getQuestionStatus(state, q));
  const answeredCount = getAnsweredCount(state);
  const selectedAnswer = state.answers[question?.id] ?? null;
  const isLastQuestion = state.currentIndex === assessment.questions.length - 1;

  // ── SUBMITTED — redirect is in handleSubmit, show brief loading ────────
  if (state.phase === 'SUBMITTED') {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <div className="text-5xl">✅</div>
          <h2 className="text-2xl font-bold text-foreground">Assessment Submitted</h2>
          <p className="text-muted-foreground">Your responses have been saved. Redirecting…</p>
        </div>
      </div>
    );
  }

  // ── REVIEW phase ───────────────────────────────────────────────────────
  if (state.phase === 'REVIEW') {
    return (
      <div className="flex flex-col h-full min-h-screen">
        <TestHeader
          title={assessment.title}
          currentIndex={state.currentIndex}
          totalQuestions={assessment.questions.length}
          remainingSeconds={state.remainingSeconds}
          onEndTest={() => {}} // No-op in review mode
        />
        <ReviewPanel
          state={state}
          timedOut={timedOutRef.current}
          onContinueTest={() => dispatch({ type: 'RESUME_FROM_REVIEW' })}
          onSubmit={handleSubmit}
        />
      </div>
    );
  }

  // ── ACTIVE phase ───────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full min-h-screen bg-background">
      {/* Sticky header */}
      <TestHeader
        title={assessment.title}
        currentIndex={state.currentIndex}
        totalQuestions={assessment.questions.length}
        remainingSeconds={state.remainingSeconds}
        onEndTest={() => dispatch({ type: 'OPEN_CONFIRM_MODAL' })}
      />

      {/* Question Navigator */}
      <QuestionNavigator
        totalQuestions={assessment.questions.length}
        currentIndex={state.currentIndex}
        statuses={statuses}
        onNavigate={(idx) => dispatch({ type: 'NAVIGATE_TO', index: idx })}
      />

      {/* Question Area */}
      <QuestionPanel
        questionNumber={state.currentIndex + 1}
        totalQuestions={assessment.questions.length}
        questionText={question.question}
        options={question.options}
        selectedAnswer={selectedAnswer !== undefined ? selectedAnswer : null}
        onSelectAnswer={(idx) =>
          dispatch({ type: 'SELECT_ANSWER', questionId: question.id, optionIndex: idx })
        }
      />

      {/* Bottom navigation */}
      <div className="border-t border-border bg-white px-4 sm:px-8 py-4 flex items-center justify-between gap-4 max-w-3xl mx-auto w-full">
        <button
          id="prev-question"
          onClick={() => dispatch({ type: 'NAVIGATE_TO', index: state.currentIndex - 1 })}
          disabled={state.currentIndex === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-semibold text-foreground hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <span className="text-xs text-muted-foreground hidden sm:block">
          {answeredCount} / {assessment.questions.length} answered
        </span>

        {isLastQuestion ? (
          <button
            id="review-assessment"
            onClick={() => dispatch({ type: 'OPEN_CONFIRM_MODAL' })}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#8b9a6e] hover:bg-[#6e7d56] text-white text-sm font-bold transition-colors"
          >
            <ClipboardList className="w-4 h-4" />
            Review Assessment
          </button>
        ) : (
          <button
            id="next-question"
            onClick={() => dispatch({ type: 'NAVIGATE_TO', index: state.currentIndex + 1 })}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-semibold text-foreground hover:bg-stone-50 transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* End Test confirmation modal */}
      {state.confirmModalOpen && (
        <EndTestModal
          answeredCount={answeredCount}
          totalQuestions={assessment.questions.length}
          onContinue={() => dispatch({ type: 'CLOSE_CONFIRM_MODAL' })}
          onConfirmEnd={() => dispatch({ type: 'END_ASSESSMENT' })}
        />
      )}
    </div>
  );
}
