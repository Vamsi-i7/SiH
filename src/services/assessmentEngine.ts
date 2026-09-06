/**
 * src/services/assessmentEngine.ts
 *
 * Fixed-question-set Assessment Engine for StatVidya.
 *
 * This is a SEPARATE engine from assessmentService.ts (adaptive branching).
 * It drives the 4-assessment UI with full bidirectional navigation,
 * question status tracking, timer management, and scoring.
 *
 * Designed to be used with the new assessment/[id]/test flow.
 * Can be replaced with a backend-driven version without UI changes.
 */

import type { Assessment, AssessmentQuestion } from '@/data/assessments';
import { generateUUID } from './assessmentService';

// ============================================================
// TYPES
// ============================================================

export type QuestionStatus = 'unseen' | 'visited' | 'answered';

export type EnginePhase = 'INSTRUCTIONS' | 'ACTIVE' | 'REVIEW' | 'SUBMITTED';

export interface EngineState {
  sessionId: string;
  assessment: Assessment;
  currentIndex: number;
  /** Map of questionId → selected option index (0-based) */
  answers: Record<string, number>;
  /** Set of question IDs the user has visited (navigated to) */
  visited: Set<string>;
  /** Seconds remaining — counts down during ACTIVE phase */
  remainingSeconds: number;
  phase: EnginePhase;
  /** ISO string, set when phase transitions from INSTRUCTIONS → ACTIVE */
  startedAt: string | null;
  /** ISO string, set when phase transitions to SUBMITTED */
  endedAt: string | null;
  /** Whether the end-test confirmation modal is open */
  confirmModalOpen: boolean;
}

export interface ScoreResult {
  total: number;
  answered: number;
  correct: number;
  unanswered: number;
  percentageCorrect: number;
}

// ============================================================
// FACTORY
// ============================================================

/**
 * createEngine — Initialise a fresh engine state for an assessment.
 * Timer starts at the assessment's configured duration.
 * Phase starts at ACTIVE (caller is responsible for showing instructions before calling this).
 */
export function createEngine(assessment: Assessment): EngineState {
  return {
    sessionId: generateUUID(),
    assessment,
    currentIndex: 0,
    answers: {},
    visited: new Set<string>([assessment.questions[0]?.id ?? '']),
    remainingSeconds: assessment.durationSeconds,
    phase: 'ACTIVE',
    startedAt: new Date().toISOString(),
    endedAt: null,
    confirmModalOpen: false,
  };
}

// ============================================================
// STATE TRANSITIONS (pure functions — safe for useReducer)
// ============================================================

/**
 * selectAnswer — Record the user's answer for a question.
 * Idempotent: calling again with a different index updates the answer.
 */
export function selectAnswer(
  state: EngineState,
  questionId: string,
  optionIndex: number
): EngineState {
  if (state.phase !== 'ACTIVE') return state;
  return {
    ...state,
    answers: { ...state.answers, [questionId]: optionIndex },
  };
}

/**
 * navigateTo — Move to a question by 0-based index.
 * Marks the destination question as visited.
 */
export function navigateTo(state: EngineState, index: number): EngineState {
  if (state.phase !== 'ACTIVE' && state.phase !== 'REVIEW') return state;
  if (index < 0 || index >= state.assessment.questions.length) return state;
  const destId = state.assessment.questions[index].id;
  const newVisited = new Set(state.visited);
  newVisited.add(destId);
  return {
    ...state,
    currentIndex: index,
    visited: newVisited,
  };
}

/**
 * tickTimer — Decrement remaining time by 1 second.
 * If time reaches 0, automatically transitions to REVIEW phase (auto-submit path).
 */
export function tickTimer(state: EngineState): EngineState {
  if (state.phase !== 'ACTIVE') return state;
  const next = state.remainingSeconds - 1;
  if (next <= 0) {
    return {
      ...state,
      remainingSeconds: 0,
      phase: 'REVIEW',
      endedAt: new Date().toISOString(),
      confirmModalOpen: false,
    };
  }
  return { ...state, remainingSeconds: next };
}

/**
 * openConfirmModal — Show the End Test confirmation dialog.
 */
export function openConfirmModal(state: EngineState): EngineState {
  if (state.phase !== 'ACTIVE') return state;
  return { ...state, confirmModalOpen: true };
}

/**
 * closeConfirmModal — Dismiss the dialog and return to the active test.
 */
export function closeConfirmModal(state: EngineState): EngineState {
  return { ...state, confirmModalOpen: false };
}

/**
 * endAssessment — Transition from ACTIVE → REVIEW.
 * Used by both the "End Test" confirmation and the timer auto-end.
 */
export function endAssessment(state: EngineState): EngineState {
  if (state.phase !== 'ACTIVE') return state;
  return {
    ...state,
    phase: 'REVIEW',
    confirmModalOpen: false,
    endedAt: new Date().toISOString(),
  };
}

/**
 * resumeFromReview — Allow the user to go back to the active test from the review panel.
 */
export function resumeFromReview(state: EngineState): EngineState {
  if (state.phase !== 'REVIEW') return state;
  return { ...state, phase: 'ACTIVE', endedAt: null };
}

/**
 * submitAssessment — Final submission. Transitions REVIEW → SUBMITTED.
 */
export function submitAssessment(state: EngineState): EngineState {
  if (state.phase !== 'REVIEW') return state;
  return {
    ...state,
    phase: 'SUBMITTED',
    endedAt: state.endedAt ?? new Date().toISOString(),
  };
}

// ============================================================
// DERIVED SELECTORS
// ============================================================

/**
 * getQuestionStatus — Returns the display status of a question.
 * unseen  = never navigated to
 * visited = navigated to but no answer selected
 * answered = has a selected answer
 */
export function getQuestionStatus(
  state: EngineState,
  question: AssessmentQuestion
): QuestionStatus {
  if (state.answers[question.id] !== undefined) return 'answered';
  if (state.visited.has(question.id)) return 'visited';
  return 'unseen';
}

/**
 * getScore — Calculate the score after submission.
 */
export function getScore(state: EngineState): ScoreResult {
  const questions = state.assessment.questions;
  const total = questions.length;
  const answered = Object.keys(state.answers).length;
  const correct = questions.filter(
    (q) => state.answers[q.id] === q.correctAnswer
  ).length;
  return {
    total,
    answered,
    correct,
    unanswered: total - answered,
    percentageCorrect: total > 0 ? Math.round((correct / total) * 100) : 0,
  };
}

/**
 * getAnsweredCount — Quick count of answered questions.
 */
export function getAnsweredCount(state: EngineState): number {
  return Object.keys(state.answers).length;
}

/**
 * currentQuestion — Convenience getter.
 */
export function currentQuestion(state: EngineState): AssessmentQuestion {
  return state.assessment.questions[state.currentIndex];
}

// ============================================================
// REDUCER (for use with React useReducer)
// ============================================================

export type EngineAction =
  | { type: 'SELECT_ANSWER'; questionId: string; optionIndex: number }
  | { type: 'NAVIGATE_TO'; index: number }
  | { type: 'TICK_TIMER' }
  | { type: 'OPEN_CONFIRM_MODAL' }
  | { type: 'CLOSE_CONFIRM_MODAL' }
  | { type: 'END_ASSESSMENT' }
  | { type: 'RESUME_FROM_REVIEW' }
  | { type: 'SUBMIT_ASSESSMENT' };

export function engineReducer(state: EngineState, action: EngineAction): EngineState {
  switch (action.type) {
    case 'SELECT_ANSWER':
      return selectAnswer(state, action.questionId, action.optionIndex);
    case 'NAVIGATE_TO':
      return navigateTo(state, action.index);
    case 'TICK_TIMER':
      return tickTimer(state);
    case 'OPEN_CONFIRM_MODAL':
      return openConfirmModal(state);
    case 'CLOSE_CONFIRM_MODAL':
      return closeConfirmModal(state);
    case 'END_ASSESSMENT':
      return endAssessment(state);
    case 'RESUME_FROM_REVIEW':
      return resumeFromReview(state);
    case 'SUBMIT_ASSESSMENT':
      return submitAssessment(state);
    default:
      return state;
  }
}
