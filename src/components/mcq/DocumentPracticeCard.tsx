'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { type GeneratedQuestion } from '@/services/mcqService';
import {
  CheckCircle2,
  XCircle,
  BookOpen,
  ArrowRight,
  Send,
  Check,
  RefreshCw,
  Sparkles,
  HelpCircle,
  Award,
} from 'lucide-react';

interface DocumentPracticeCardProps {
  question: GeneratedQuestion;
  docTitle: string;
  difficulty: 'easy' | 'medium' | 'hard';
  onNextQuestion: () => void;
  isGeneratingNext: boolean;
  onStageToQueue: () => void;
  stagedToQueue: boolean;
}

export function DocumentPracticeCard({
  question,
  docTitle,
  difficulty,
  onNextQuestion,
  isGeneratingNext,
  onStageToQueue,
  stagedToQueue,
}: DocumentPracticeCardProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [showExplanation, setShowExplanation] = useState(false);

  const isCorrect = selectedOption === question.correctIndex;
  const currentStem = lang === 'en' ? question.stemEn : question.stemHi;
  const currentOptions = lang === 'en' ? question.optionsEn : question.optionsHi;
  const currentRationale = lang === 'en' ? question.rationaleEn : question.rationaleHi;

  const handleSelect = (idx: number) => {
    if (!isSubmitted) {
      setSelectedOption(idx);
    }
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
    setShowExplanation(true);
  };

  return (
    <Card className="border-stone-200 bg-white shadow-md rounded-2xl overflow-hidden animate-in fade-in-50 duration-300">
      {/* Header Banner */}
      <CardHeader className="border-b border-stone-100 bg-stone-50/70 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                <Sparkles className="h-3 w-3 text-emerald-700" />
                Groq AI Practice
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-stone-200/80 text-stone-700 font-semibold uppercase tracking-wider">
                {difficulty} Calibration
              </span>
              <span className="text-xs text-stone-500 font-medium truncate max-w-xs sm:max-w-md">
                • Grounded in: <strong>{docTitle}</strong>
              </span>
            </div>
            <CardTitle className="text-lg sm:text-xl font-bold text-stone-900 pt-1">
              Self-Paced Knowledge Check
            </CardTitle>
            <CardDescription className="text-xs text-stone-600">
              Select the best answer based on the official guidelines. No timer or scoring penalties.
            </CardDescription>
          </div>

          {/* Language Switcher */}
          <div className="flex rounded-xl bg-stone-200/70 p-1 border border-stone-300/80 self-start sm:self-auto shrink-0">
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                lang === 'en'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                lang === 'hi'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-7 space-y-6">
        {/* Question Stem */}
        <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 flex items-center gap-1.5">
            <HelpCircle className="h-3.5 w-3.5 text-stone-500" />
            <span>Operational Question ({lang === 'en' ? 'English' : 'हिन्दी'})</span>
          </div>
          <h2 className="text-base sm:text-lg font-semibold text-stone-900 leading-relaxed">
            {currentStem}
          </h2>
        </div>

        {/* Options List */}
        <div className="space-y-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 flex items-center justify-between">
            <span>Select one answer choice:</span>
            {isSubmitted && (
              <span
                className={`text-xs font-bold flex items-center gap-1 ${
                  isCorrect ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> Correct Answer!
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4" /> Review Protocol Below
                  </>
                )}
              </span>
            )}
          </div>

          <div className="space-y-2.5">
            {currentOptions.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isChosen = selectedOption === idx;
              const isTargetAnswer = idx === question.correctIndex;

              let cardStyle =
                'border-stone-200 hover:border-stone-400 bg-white text-stone-800 hover:bg-stone-50/50';
              let badgeStyle = 'bg-stone-100 text-stone-700 border-stone-200';

              if (!isSubmitted) {
                if (isChosen) {
                  cardStyle =
                    'border-[#555934] ring-2 ring-[#555934]/20 bg-[#555934]/5 text-stone-950 font-medium';
                  badgeStyle = 'bg-[#555934] text-white border-[#555934]';
                }
              } else {
                if (isTargetAnswer) {
                  cardStyle =
                    'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50 text-emerald-950 font-semibold';
                  badgeStyle = 'bg-emerald-700 text-white border-emerald-700';
                } else if (isChosen && !isTargetAnswer) {
                  cardStyle =
                    'border-rose-400 ring-2 ring-rose-400/20 bg-rose-50/80 text-rose-950 font-medium';
                  badgeStyle = 'bg-rose-600 text-white border-rose-600';
                } else {
                  cardStyle = 'border-stone-200 bg-white/60 text-stone-400 opacity-70';
                }
              }

              return (
                <div
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleSelect(idx);
                  }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3.5 select-none ${cardStyle}`}
                >
                  <span
                    className={`inline-flex items-center justify-center h-6 w-6 rounded-lg text-xs font-bold shrink-0 border mt-0.5 transition ${badgeStyle}`}
                  >
                    {letter}
                  </span>

                  <span className="flex-1 text-sm sm:text-base leading-snug">{opt}</span>

                  {isSubmitted && isTargetAnswer && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0 self-center">
                      Correct Key
                    </span>
                  )}

                  {isSubmitted && isChosen && !isTargetAnswer && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-300 shrink-0 self-center">
                      Your Choice
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Controls: Check Answer vs Next Question */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          {!isSubmitted ? (
            <button
              onClick={handleCheckAnswer}
              disabled={selectedOption === null}
              className="w-full sm:w-auto px-6 py-3 bg-[#555934] hover:bg-[#3e4225] disabled:bg-stone-300 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center gap-2"
            >
              Check Answer
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onNextQuestion}
                disabled={isGeneratingNext}
                className="px-6 py-3 bg-[#555934] hover:bg-[#3e4225] text-white text-sm font-bold rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center gap-2"
              >
                {isGeneratingNext ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Generating from PDF...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Practice Next Question
                  </>
                )}
              </button>

              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition"
              >
                {showExplanation ? 'Hide Explanation' : 'View Explanation'}
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span>Powered by Groq AI</span>
            <span>•</span>
            <span>Consensus: {(question.consensusScore * 100).toFixed(0)}%</span>
          </div>
        </div>

        {/* Pedagogical Explanation Drawer / Accordion */}
        {showExplanation && (
          <div className="rounded-2xl border border-amber-200/90 bg-amber-50/70 p-5 space-y-3 animate-in fade-in-50 duration-200">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <BookOpen className="h-4 w-4 text-amber-700" />
              <span>MoSPI Protocol Explanation & Citation</span>
            </div>

            <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-normal">
              {currentRationale}
            </p>

            <div className="pt-2 border-t border-amber-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-900">
              <div>
                <strong>Citation Anchor:</strong> {question.citation}
              </div>

              {/* Staging button inside explanation */}
              <div>
                {stagedToQueue ? (
                  <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5" /> Staged into Review Queue
                  </span>
                ) : (
                  <button
                    onClick={onStageToQueue}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-200/80 hover:bg-amber-300 text-amber-950 font-bold rounded-lg text-xs transition"
                  >
                    <Send className="h-3 w-3" /> Save to Review Queue
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Staged Confirmation alert */}
        {stagedToQueue && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                Item saved to <strong>Faculty Review Queue</strong> for inclusion in formal assessments.
              </span>
            </div>
            <Link
              href="/review-queue"
              className="font-bold underline text-emerald-800 hover:text-emerald-950 shrink-0"
            >
              Open Queue →
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
