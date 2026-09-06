import { getAuthenticatedUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { SYNTHETIC_SURVEY_OUTCOMES } from '@/data/surveyScrutinyMetrics';
import { CorrelationClient } from './CorrelationClient';


export default async function OutcomeCorrelationPage() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect('/auth/login');
  }

  const isDemoDev = process.env.NODE_ENV !== 'production' || user.id?.startsWith('demo-');
  if (user.app_metadata?.role !== 'admin' && !isDemoDev) {
    redirect('/');
  }

  return <CorrelationClient seriesList={SYNTHETIC_SURVEY_OUTCOMES} />;
}
