import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import LoginForm from './LoginForm';
import { Building2, Search, GraduationCap, BarChart3, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  const t = await getTranslations('auth');

  return (
    <div className="flex-1 flex flex-col">
      {/* Institutional Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-30 shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white shadow-sm">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-lg text-gray-900">
                  StatVidya
                </span>
                <span className="rounded-md bg-blue-50 border border-blue-200 px-2 py-0.5 text-xs font-semibold text-blue-800">
                  MoSPI • NSSTA
                </span>
              </div>
              <p className="text-xs text-gray-500 hidden sm:block">
                National Statistical Systems Training Academy
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-600 bg-white px-3 py-1.5 rounded-full">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Mission Karmayogi FRAC Aligned</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-6xl mx-auto space-y-8">
          {/* Hero Heading */}
          <div className="text-center space-y-2.5 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Official Statistical Workforce Competency Platform</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              StatVidya Portal Login
            </h1>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Role-based competency mapping, localized training recommendations, and continuous assessment for ISS Officers, SSS personnel, and Field Investigators.
            </p>
          </div>

          {/* 2-Column Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Official Login Form */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-sm">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-gray-900">
                  {t('login')}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Sign in with your official government email address or Parichay SSO.
                </p>
              </div>
              <Suspense>
                <LoginForm />
              </Suspense>
            </div>

            {/* Right Column: Demo Persona Evaluation Grid */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-sm space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">
                    {t('demoPersona')}
                  </h2>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    1-Click Simulation
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Click any official cadre persona to evaluate role-specific competencies, adaptive assessments, and learning pathways:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <DemoPersonaCard
                  icon="building"
                  badge="SSS Cadre"
                  badgeColor="blue"
                  name="Amit Sharma"
                  role="Junior Statistical Officer (SSS)"
                  dept="MoSPI Headquarters, New Delhi"
                  email="amit.sharma@mospi.gov.in"
                  lang="en"
                />
                <DemoPersonaCard
                  icon="search"
                  badge="FOD Cadre"
                  badgeColor="emerald"
                  name="Sunita Devi"
                  role="Field Investigator (NSSO FOD)"
                  dept="Field Operations Division, Bihar"
                  email="sunita.devi@nsso.gov.in"
                  lang="hi"
                />
                <DemoPersonaCard
                  icon="graduation-cap"
                  badge="Trainer / Faculty"
                  badgeColor="purple"
                  name="Dr. Priya Verma"
                  role="NSSTA Faculty (Trainer)"
                  dept="NSSTA, Greater Noida"
                  email="priya.verma@nssta.gov.in"
                  lang="en"
                />
                <DemoPersonaCard
                  icon="bar-chart"
                  badge="Administration"
                  badgeColor="amber"
                  name="Rajesh Kumar"
                  role="Additional Director General (Admin)"
                  dept="MoSPI Executive Leadership"
                  email="rajesh.kumar@mospi.gov.in"
                  lang="en"
                />
              </div>

              <div className="pt-2 text-xs text-gray-500 flex items-center gap-1.5 border-t border-gray-200">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                <span>Simulated sessions load realistic FRAC competency records and assessment histories.</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Institutional Footer */}
      <footer className="border-t border-gray-200 bg-white py-4 text-center text-xs text-gray-500">
        <p>Ministry of Statistics and Programme Implementation (MoSPI) • National Statistical Systems Training Academy (NSSTA)</p>
      </footer>
    </div>
  );
}

function DemoPersonaCard({
  icon,
  badge,
  badgeColor,
  name,
  role,
  dept,
  email,
  lang,
}: {
  icon: 'building' | 'search' | 'graduation-cap' | 'bar-chart';
  badge: string;
  badgeColor: 'blue' | 'emerald' | 'purple' | 'amber';
  name: string;
  role: string;
  dept: string;
  email: string;
  lang: 'en' | 'hi';
}) {
  const badgeStyles = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
  };

  const iconStyles = {
    blue: 'bg-blue-50 text-blue-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    purple: 'bg-purple-100 text-purple-700',
    amber: 'bg-amber-50 text-amber-700',
  };

  return (
    <a
      href={`/api/sso/demo-persona?email=${encodeURIComponent(email)}&lang=${lang}`}
      className="group flex flex-col justify-between p-4 rounded-xl border border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-300 transition-all text-left"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconStyles[badgeColor]}`}>
            {icon === 'building' && <Building2 className="h-4 w-4" />}
            {icon === 'search' && <Search className="h-4 w-4" />}
            {icon === 'graduation-cap' && <GraduationCap className="h-4 w-4" />}
            {icon === 'bar-chart' && <BarChart3 className="h-4 w-4" />}
          </div>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${badgeStyles[badgeColor]}`}>
            {badge}
          </span>
        </div>

        <div>
          <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors text-sm">
            {name}
          </p>
          <p className="text-xs font-medium text-gray-700 mt-0.5 line-clamp-1">
            {role}
          </p>
          <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
            {dept}
          </p>
        </div>
      </div>

      <div className="pt-3 mt-3 border-t border-gray-200 flex items-center justify-between text-xs text-blue-700 font-medium">
        <span className="text-[11px] font-mono text-gray-400 truncate max-w-32.5">
          {email}
        </span>
        <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform shrink-0">
          <span>Enter</span>
          <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </a>
  );
}
