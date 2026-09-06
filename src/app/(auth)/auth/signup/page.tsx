import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import SignupForm from './SignupForm';
import { BarChart3, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SignupPage() {
  const t = await getTranslations('auth');

  return (
    <div className="flex-1 flex flex-col">
      {/* Institutional Header */}
      <header className="bg-white/95 backdrop-blur-xs sticky top-0 z-30 shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
          <a href="/auth/login" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#555934] text-white shadow-xs">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-lg text-[#2d1f17]">
                  StatVidya
                </span>
                <span className="rounded-full bg-[#BF9B7A]/25 px-2.5 py-0.5 text-xs font-semibold text-[#593E2E]">
                  MoSPI • NSSTA
                </span>
              </div>
              <p className="text-xs text-[#705849] hidden sm:block">
                National Statistical Systems Training Academy
              </p>
            </div>
          </a>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 text-xs text-[#555934] bg-[#555934]/10 px-3 py-1.5 rounded-full font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-[#555934]" />
              <span>Official Registration</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#2d1f17]">
              {t('signup')}
            </h1>
            <p className="text-sm text-[#705849]">
              Create your official StatVidya workforce competency profile
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card">
            <Suspense>
              <SignupForm />
            </Suspense>

            <p className="mt-5 text-center text-xs text-[#705849] pt-4">
              {t('hasAccount')}{' '}
              <a href="/auth/login" className="font-semibold text-[#555934] hover:underline transition-colors">
                {t('login')}
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Institutional Footer */}
      <footer className="bg-white py-4 text-center text-xs text-[#705849] shadow-[0_-2px_12px_-4px_rgba(89,62,46,0.03)]">
        <p>Ministry of Statistics and Programme Implementation (MoSPI) • National Statistical Systems Training Academy (NSSTA)</p>
      </footer>
    </div>
  );
}
