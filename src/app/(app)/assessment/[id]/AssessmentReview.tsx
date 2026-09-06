/**
 * src/app/(app)/assessment/[id]/AssessmentReview.tsx
 *
 * Review page: Shows final proficiency level and submitted answers
 */

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { AssessmentState } from '@/services/assessmentService';

interface AssessmentReviewProps {
  assessmentState: AssessmentState;
  competencyName: string;
  language: 'en' | 'hi';
  onSubmit: () => void;
}

const levelLabels: Record<string, { label: string; description: string; color: string }> = {
  L1: {
    label: 'Awareness',
    description: 'You have basic knowledge of this competency',
    color: 'bg-red-100 text-red-800',
  },
  L2: {
    label: 'Understanding',
    description: 'You demonstrate understanding with guidance',
    color: 'bg-orange-100 text-orange-800',
  },
  L3: {
    label: 'Proficiency',
    description: 'You can apply this competency independently',
    color: 'bg-yellow-100 text-yellow-800',
  },
  L4: {
    label: 'Advanced',
    description: 'You demonstrate advanced expertise',
    color: 'bg-lime-100 text-lime-800',
  },
  L5: {
    label: 'Mastery',
    description: 'You have mastery and can mentor others',
    color: 'bg-green-100 text-green-800',
  },
};

export default function AssessmentReview({
  assessmentState,
  competencyName,
  language,
  onSubmit,
}: AssessmentReviewProps) {
  if (!assessmentState.final_level || assessmentState.stage !== 'COMPLETE') {
    return null;
  }

  const finalLevelStr = assessmentState.final_level || 'L1';
  const levelKey = (finalLevelStr.startsWith('L') ? finalLevelStr : `L${finalLevelStr}`) as keyof typeof levelLabels;
  const levelInfo = levelLabels[levelKey] || levelLabels['L1'];

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Assessment Complete</h1>
        <p className="text-muted-foreground">Review your proficiency level before submitting</p>
      </div>

      {/* Result Card */}
      <Card className="p-8 space-y-6">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Competency</p>
          <h2 className="text-2xl font-semibold mb-4">{competencyName}</h2>
        </div>

        {/* Proficiency Level */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-muted-foreground">Your Proficiency Level</p>
          <div className={`p-4 rounded-lg ${levelInfo.color}`}>
            <p className="text-2xl font-bold">{levelInfo.label}</p>
            <p className="text-sm mt-2">{levelInfo.description}</p>
          </div>
        </div>

        {/* Assessment Details */}
        <div className="space-y-2 border-t pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Assessment Type</span>
            <span className="font-medium">Adaptive (3-Stage Branching)</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Branch Path</span>
            <Badge variant="outline">{assessmentState.branch_path}</Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Answers Submitted</span>
            <span className="font-medium">{Object.keys(assessmentState.answers).length} of 3</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Submitted</span>
            <span className="font-medium text-xs">
              {new Date(assessmentState.completed_at || new Date().toISOString()).toLocaleString(
                language === 'en' ? 'en-US' : 'hi-IN'
              )}
            </span>
          </div>
        </div>
      </Card>

      {/* Submission Note */}
      <div className="p-4 bg-secondary rounded-lg text-sm">
        <p className="font-semibold mb-2">What Happens Next?</p>
        <ul className="space-y-1 text-muted-foreground">
          <li>✓ Your proficiency level will be recorded in your profile</li>
          <li>✓ Recommended learning pathways will be updated</li>
          <li>✓ Your progress will be visible to your organization</li>
          {!navigator.onLine && <li>⚠️ This assessment will sync once you&apos;re online</li>}
        </ul>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <button
          onClick={onSubmit}
          className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          Submit & Continue
        </button>
      </div>
    </div>
  );
}
