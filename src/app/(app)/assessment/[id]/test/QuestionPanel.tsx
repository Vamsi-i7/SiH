/**
 * src/app/(app)/assessment/[id]/test/QuestionPanel.tsx
 *
 * Displays the current question and its answer options.
 * Uses radio-style interaction matching the existing AssessmentQuestion aesthetic.
 */

interface QuestionPanelProps {
  questionNumber: number;
  totalQuestions: number;
  questionText: string;
  options: string[];
  selectedAnswer: number | null;
  onSelectAnswer: (index: number) => void;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E'];

export default function QuestionPanel({
  questionNumber,
  totalQuestions,
  questionText,
  options,
  selectedAnswer,
  onSelectAnswer,
}: QuestionPanelProps) {
  return (
    <div className="flex-1 px-4 sm:px-8 py-6 max-w-3xl mx-auto w-full">
      {/* Question heading */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
          Question {questionNumber} of {totalQuestions}
        </p>
        <h2 className="text-lg sm:text-xl font-semibold text-foreground leading-relaxed">
          {questionText}
        </h2>
      </div>

      {/* Answer options */}
      <fieldset>
        <legend className="sr-only">Select your answer for question {questionNumber}</legend>
        <div className="space-y-3">
          {options.map((option, idx) => {
            const isSelected = selectedAnswer === idx;
            return (
              <label
                key={idx}
                htmlFor={`option-${idx}`}
                className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all min-h-14 ${
                  isSelected
                    ? 'border-[#8b9a6e] bg-[#8b9a6e]/8'
                    : 'border-border bg-white hover:border-stone-400 hover:bg-stone-50'
                }`}
              >
                {/* Option letter circle */}
                <span
                  className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold border-2 transition-colors mt-0.5 ${
                    isSelected
                      ? 'border-[#8b9a6e] bg-[#8b9a6e] text-white'
                      : 'border-stone-300 bg-white text-stone-500'
                  }`}
                  aria-hidden="true"
                >
                  {OPTION_LABELS[idx] ?? idx + 1}
                </span>

                {/* Hidden native radio for accessibility */}
                <input
                  type="radio"
                  id={`option-${idx}`}
                  name="question-option"
                  value={idx}
                  checked={isSelected}
                  onChange={() => onSelectAnswer(idx)}
                  className="sr-only"
                />

                <span className="flex-1 text-sm sm:text-base font-medium text-foreground leading-relaxed">
                  {option}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
