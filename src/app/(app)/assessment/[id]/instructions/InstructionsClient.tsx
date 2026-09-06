'use client';

/**
 * src/app/(app)/assessment/[id]/instructions/InstructionsClient.tsx
 *
 * Assessment instructions screen.
 * Timer has NOT started — sidebar/topbar are still visible.
 * Clicking "Start Test" navigates to the active test route.
 */

import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  CheckCircle,
  PlayCircle,
  Eye,
  XCircle,
} from 'lucide-react';

interface InstructionsClientProps {
  assessmentId: string;
  title: string;
  description: string;
  totalQuestions: number;
  durationSeconds: number;
  type: string;
}

const INSTRUCTIONS = [
  'Read each question carefully before selecting your answer.',
  'You can navigate between questions using the numbered boxes or the Previous / Next buttons.',
  'You can change your selected answer at any time before submitting.',
  'The timer begins only when you click "Start Test" and counts down continuously.',
  'The test ends automatically when the timer reaches 00:00.',
  'Click "End Test" to finish early. You will be asked to confirm.',
  'Review your answers before final submission — you can return to unanswered questions.',
];

const STATUS_LEGEND = [
  {
    label: 'Unseen',
    description: 'You have not yet visited this question.',
    colorClass: 'bg-white border-2 border-stone-300 text-stone-700',
  },
  {
    label: 'Visited',
    description: 'You viewed this question but have not answered it.',
    colorClass: 'bg-rose-100 border-2 border-rose-400 text-rose-700',
  },
  {
    label: 'Answered',
    description: 'You have selected an answer for this question.',
    colorClass: 'bg-emerald-100 border-2 border-emerald-500 text-emerald-800',
  },
];

export default function InstructionsClient({
  assessmentId,
  title,
  description,
  totalQuestions,
  durationSeconds,
  type,
}: InstructionsClientProps) {
  const router = useRouter();
  const durationMins = Math.round(durationSeconds / 60);

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      {/* Back link */}
      <button
        onClick={() => router.push('/assignments')}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        id="back-to-assignments"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Assessments
      </button>

      {/* Title block */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: BookOpen, label: 'Questions', value: totalQuestions.toString() },
          { icon: Clock, label: 'Minutes', value: durationMins.toString() },
          { icon: CheckCircle, label: 'Type', value: type },
          { icon: Eye, label: 'Attempts', value: 'Unlimited' },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex flex-col items-center justify-center gap-1 rounded-xl border border-border bg-white p-4 text-center shadow-sm"
          >
            <Icon className="w-5 h-5 text-[#8b9a6e]" />
            <p className="text-xl font-bold text-foreground font-mono">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Instructions list */}
      <div className="rounded-xl border border-border bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Before You Begin</h2>
        <ul className="space-y-3">
          {INSTRUCTIONS.map((instruction, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-foreground">
              <span className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#8b9a6e]/15 text-[#8b9a6e] font-semibold text-xs mt-0.5">
                {i + 1}
              </span>
              {instruction}
            </li>
          ))}
        </ul>
      </div>

      {/* Question status colour legend */}
      <div className="rounded-xl border border-border bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Question Status Legend</h2>
        <div className="space-y-3">
          {STATUS_LEGEND.map(({ label, description, colorClass }) => (
            <div key={label} className="flex items-center gap-4">
              <div
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md text-sm font-bold ${colorClass}`}
                aria-label={label}
              >
                7
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Important timer note */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
        <XCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-amber-800">
          <strong>Important:</strong> The timer will <em>not</em> start until you click &quot;Start Test&quot; below. You can take as long as you need on this screen.
        </p>
      </div>

      {/* Start Test CTA */}
      <button
        id={`start-test-${assessmentId}`}
        onClick={() => router.push(`/assessment/${assessmentId}/test`)}
        className="w-full flex items-center justify-center gap-3 rounded-xl bg-[#8b9a6e] hover:bg-[#6e7d56] text-white font-bold text-lg py-4 transition-colors shadow-sm"
      >
        <PlayCircle className="w-6 h-6" />
        Start Test
      </button>
    </div>
  );
}
