import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth';
import OnboardingWizard from './OnboardingWizard';

export const dynamic = 'force-dynamic';

export default async function OnboardingPage() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect('/auth/login');
  }

  const t = await getTranslations('onboarding');

  // NOTE: In production we would check if the user already has a role
  // and redirect to /dashboard if onboarding is already complete

  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="rounded-xl border border-[#e3dbcf] bg-white p-8 shadow-2xs">
        <div className="text-center mb-8">
           <h1 className="text-2xl font-bold text-[#1a1a1a]">
             {t('title')}
           </h1>
           <p className="mt-2 text-sm text-[#5a5a5a]">
             Let&apos;s build your official FRAC competency profile
           </p>
        </div>

        <OnboardingWizard
          userId={user.id}
          orgId={user.user_metadata?.organization_id || ''}
        />
      </div>
    </div>
  );
}
