import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth';
import { getAssessment } from '@/data/assessments';
import InstructionsClient from './InstructionsClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function InstructionsPage({ params }: PageProps) {
  const { id } = await params;
  await getAuthenticatedUser();

  const assessment = getAssessment(id);
  if (!assessment) {
    // Not a dummy assessment — redirect to legacy adaptive flow
    redirect(`/assessment/${id}`);
  }

  return (
    <InstructionsClient
      assessmentId={assessment.id}
      title={assessment.title}
      description={assessment.description}
      totalQuestions={assessment.totalQuestions}
      durationSeconds={assessment.durationSeconds}
      type={assessment.type}
    />
  );
}
