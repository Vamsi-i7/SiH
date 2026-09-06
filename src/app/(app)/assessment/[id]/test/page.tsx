import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth';
import { getAssessment } from '@/data/assessments';
import TestClient from './TestClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TestPage({ params }: PageProps) {
  const { id } = await params;
  const user = await getAuthenticatedUser();

  const assessment = getAssessment(id);
  if (!assessment) {
    // Unknown ID — fall back to legacy adaptive engine route
    redirect(`/assessment/${id}`);
  }

  return (
    <TestClient
      assessment={assessment}
      userId={user.id}
    />
  );
}
