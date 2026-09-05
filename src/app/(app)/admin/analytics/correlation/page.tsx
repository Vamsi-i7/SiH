import { getAuthenticatedUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { SYNTHETIC_SURVEY_OUTCOMES } from '@/data/surveyScrutinyMetrics';
import { CorrelationClient } from './CorrelationClient';

export const dynamic = 'force-dynamic';

export default async function OutcomeCorrelationPage() {
  const user = await getAuthenticatedUser();

  if (!user || user.role !== 'admin') {
    redirect('/');
  }

  return <CorrelationClient seriesList={SYNTHETIC_SURVEY_OUTCOMES} />;
}
