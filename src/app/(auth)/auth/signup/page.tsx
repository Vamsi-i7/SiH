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
      <header className="border-b border-border bg-card sticky top-0 z-30 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
          <a href="/auth/login" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-lg text-foreground">
                  StatVidya
                </span>
                <span className="rounded-md bg-secondary border border-border px-2 py-0.5 text-xs font-semibold text-primary">
                  MoSPI • NSSTA
                </span>
              </div>
              <p className="text-xs text-muted-foreground hidden sm:block">
                National Statistical Systems Training Academy
              </p>
            </div>
          </a>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              <span>Official Registration</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {t('signup')}
            </h1>
            <p className="text-sm text-muted-foreground">
              Create your official StatVidya workforce competency profile
            </p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 sm:p-8 shadow-card">
            <Suspense>
              <SignupForm />
            </Suspense>

            <p className="mt-5 text-center text-xs text-muted-foreground border-t border-accent pt-4">
              {t('hasAccount')}{' '}
              <a href="/auth/login" className="font-semibold text-primary hover:text-primary-dark transition-colors">
                {t('login')}
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Institutional Footer */}
      <footer className="border-t border-border bg-card py-4 text-center text-xs text-muted-foreground">
        <p>Ministry of Statistics and Programme Implementation (MoSPI) • National Statistical Systems Training Academy (NSSTA)</p>
      </footer>
    </div>
  );
}
