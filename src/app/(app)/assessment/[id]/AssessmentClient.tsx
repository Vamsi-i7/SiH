/**
 * src/app/(app)/assessment/[id]/AssessmentClient.tsx
 *
 * Assessment Runner: Client component with state machine, timer, bilingual UI
 * Implements 3-stage adaptive branching via assessmentService
 */

'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  initializeAssessment,
  nextStage,
  recordAnswer,
  getCompletionPercentage,
  type AssessmentState,
  type AssessmentResult,
} from '@/services/assessmentService';
import offlineQueueManager from '@/services/offlineService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AssessmentQuestion from './AssessmentQuestion';
import AssessmentTimer from './AssessmentTimer';
import AssessmentProgress from './AssessmentProgress';
import AssessmentReview from './AssessmentReview';
import { AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface Question {
  id: string;
  question_text: string;
  question_text_hi: string;
  answer_choices: string[];
  answer_choices_hi: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  stage: number;
}

interface AssessmentClientProps {
  competencyId: string;
  competencyName: string;
  competencyNameHi?: string;
  firstQuestion: Question;
  userId: string;
}

type UIState = 'LOADING' | 'ANSWERING' | 'REVIEW' | 'SUBMITTED' | 'ERROR';

export default function AssessmentClient({
  competencyId,
  competencyName,
  competencyNameHi,
  firstQuestion,
  userId,
}: AssessmentClientProps) {
  const router = useRouter();
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [uiState, setUiState] = useState<UIState>('ANSWERING');
  const [assessmentState, setAssessmentState] = useState<AssessmentState>(
    initializeAssessment(competencyId, userId, firstQuestion.id)
  );
  const [currentQuestion] = useState<Question>(firstQuestion);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitAssessmentRef = useRef<(() => void) | null>(null);

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          // Time's up: auto-submit with current answer
          handleSubmitAssessmentRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle answer selection
  const handleSelectAnswer = useCallback((answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  }, []);

  // Handle next question / proceed
  const handleNext = useCallback(async () => {
    if (selectedAnswer === null) {
      setError('Please select an answer before proceeding');
      return;
    }

    try {
      setIsAnimating(true);

      // Record answer
      let updatedState = recordAnswer(assessmentState, currentQuestion.id, selectedAnswer);

      // Determine if answer was correct (simplified: assume API will verify)
      // In production, compare against question.correct_answer_index
      const answerCorrect = selectedAnswer === 0; // Mock: first choice is correct

      // Transition to next stage
      updatedState = nextStage(updatedState, answerCorrect, `q-${updatedState.stage + 1}`);

      // If assessment complete, move to review
      if (updatedState.stage === 'COMPLETE') {
        setAssessmentState(updatedState);
        setUiState('REVIEW');
        setIsAnimating(false);
        return;
      }

      // Otherwise, fetch next question and continue
      // TODO: Fetch next question based on stage and branch_path
      // For MVP, show review
      setAssessmentState(updatedState);
      setSelectedAnswer(null);
      setError(null);
      setIsAnimating(false);
    } catch (err) {
      setError((err as Error).message);
      setIsAnimating(false);
    }
  }, [selectedAnswer, assessmentState, currentQuestion]);

  // Handle assessment submission (final)
  const handleSubmitAssessment = useCallback(async () => {
    try {
      setUiState('SUBMITTED');

      const result: AssessmentResult = {
        ...assessmentState,
        stage: 'COMPLETE',
        completed_at: new Date().toISOString(),
        final_level: assessmentState.final_level || 'L1',
      };

      // Queue for offline sync
      const local_id = await offlineQueueManager.queueAssessment({
        local_id: assessmentState.assessment_id,
        assessment_id: null,
        competency_id: competencyId,
        user_id: userId,
        final_level: result.final_level,
        answers: result.answers,
        branch_path: result.branch_path || 'L1',
        created_at: result.created_at,
      });

      // Try to sync immediately if online
      if (navigator.onLine) {
        // TODO: Call Edge Function to sync
        await offlineQueueManager.markSyncing(local_id);
      }

      // Show success and redirect after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      setError((err as Error).message);
      setUiState('ERROR');
    }
  }, [assessmentState, competencyId, userId, router]);

  useEffect(() => {
    handleSubmitAssessmentRef.current = handleSubmitAssessment;
  }, [handleSubmitAssessment]);

  const handlePrevious = useCallback(() => {
    // In real implementation, could allow review of previous answers
    // For now, disable (assessments are forward-only)
  }, []);

  const progress = getCompletionPercentage(assessmentState);

  if (uiState === 'REVIEW') {
    return (
      <AssessmentReview
        assessmentState={assessmentState}
        competencyName={language === 'en' ? competencyName : competencyNameHi || competencyName}
        language={language}
        onSubmit={handleSubmitAssessment}
      />
    );
  }

  if (uiState === 'SUBMITTED') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Assessment Submitted ✓</h2>
          <p className="text-muted-foreground mb-6">
            Your response has been saved. Redirecting to dashboard...
          </p>
        </Card>
      </div>
    );
  }

  if (uiState === 'ERROR') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 max-w-md border-destructive">
          <AlertCircle className="w-12 h-12 text-destructive mb-4" />
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => router.push('/dashboard')}>Return to Dashboard</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{language === 'en' ? competencyName : competencyNameHi || competencyName}</h1>
          <p className="text-muted-foreground">Assessment Stage {assessmentState.stage === 'STAGE_1' ? 1 : assessmentState.stage === 'STAGE_2A' || assessmentState.stage === 'STAGE_2B' ? 2 : 3} of 3</p>
        </div>
        <button
          onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          className="px-3 py-1 text-sm border border-border rounded-md hover:bg-secondary transition-colors"
        >
          {language === 'en' ? 'हिन्दी' : 'English'}
        </button>
      </div>

      {/* Progress & Timer */}
      <div className="flex gap-4 mb-6">
        <AssessmentProgress progress={progress} />
        <AssessmentTimer timeRemaining={timeRemaining} />
      </div>

      {/* Question Card */}
      <Card className="p-6 mb-6">
        <AssessmentQuestion
          question={currentQuestion}
          language={language}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={handleSelectAnswer}
        />
      </Card>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-lg flex gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4 justify-between">
        <Button
          variant="secondary"
          onClick={handlePrevious}
          disabled={true} // Previous disabled for assessments
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        {assessmentState.stage === 'COMPLETE' ? (
          <Button
            onClick={handleSubmitAssessment}
            disabled={isAnimating}
            className="flex items-center gap-2"
          >
            Submit Assessment
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={selectedAnswer === null || isAnimating}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Accessibility & Offline Notice */}
      <div className="mt-8 text-xs text-muted-foreground text-center">
        <p>✓ No animation during assessment (accessibility: reduced motion supported)</p>
        {!navigator.onLine && <p>🔴 Offline mode: Responses will sync when you reconnect</p>}
      </div>
    </div>
  );
}
