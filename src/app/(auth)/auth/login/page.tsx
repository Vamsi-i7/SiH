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
      <header className="bg-white/95 backdrop-blur-xs sticky top-0 z-30 shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
          <div className="flex items-center gap-3">
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
              <p className="text-xs text-muted-foreground hidden sm:block">
                National Statistical Systems Training Academy
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 text-xs text-[#555934] bg-[#555934]/10 px-3 py-1.5 rounded-full font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-[#555934]" />
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
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-xs font-semibold text-[#2d1f17] shadow-card">
              <Sparkles className="h-3.5 w-3.5 text-[#555934]" />
              <span>Official Statistical Workforce Competency Platform</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              StatVidya Portal Login
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Role-based competency mapping, localized training recommendations, and continuous assessment for ISS Officers, SSS personnel, and Field Investigators.
            </p>
          </div>

          {/* 2-Column Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Official Login Form */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-7 shadow-card">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-foreground">
                  {t('login')}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Sign in with your official government email address or Parichay SSO.
                </p>
              </div>
              <Suspense>
                <LoginForm />
              </Suspense>
            </div>

            {/* Right Column: Demo Persona Evaluation Grid */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-7 shadow-card space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-foreground">
                    {t('demoPersona')}
                  </h2>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#555934]/12 text-[#555934]">
                    1-Click Simulation
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Click any official cadre persona to evaluate role-specific competencies, adaptive assessments, and learning pathways:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <DemoPersonaCard
                  icon="building"
                  badge="SSS Cadre"
                  badgeColor="primary"
                  name="Amit Sharma"
                  role="Junior Statistical Officer (SSS)"
                  dept="MoSPI Headquarters, New Delhi"
                  email="amit.sharma@mospi.gov.in"
                  lang="en"
                />
                <DemoPersonaCard
                  icon="search"
                  badge="FOD Cadre"
                  badgeColor="primary"
                  name="Sunita Devi"
                  role="Field Investigator (NSSO FOD)"
                  dept="Field Operations Division, Bihar"
                  email="sunita.devi@nsso.gov.in"
                  lang="hi"
                />
                <DemoPersonaCard
                  icon="graduation-cap"
                  badge="Trainer / Faculty"
                  badgeColor="primary"
                  name="Dr. Priya Verma"
                  role="NSSTA Faculty (Trainer)"
                  dept="NSSTA, Greater Noida"
                  email="priya.verma@nssta.gov.in"
                  lang="en"
                />
                <DemoPersonaCard
                  icon="bar-chart"
                  badge="Administration"
                  badgeColor="secondary"
                  name="Rajesh Kumar"
                  role="Additional Director General (Admin)"
                  dept="MoSPI Executive Leadership"
                  email="rajesh.kumar@mospi.gov.in"
                  lang="en"
                />
              </div>

              <div className="pt-2 text-xs text-muted-foreground flex items-center gap-1.5 border-t border-accent">
                <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Simulated sessions load realistic FRAC competency records and assessment histories.</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Institutional Footer */}
      <footer className="bg-white py-4 text-center text-xs text-muted-foreground shadow-[0_-2px_12px_-4px_rgba(89,62,46,0.03)]">
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
  badgeColor: 'primary' | 'secondary' | 'destructive';
  name: string;
  role: string;
  dept: string;
  email: string;
  lang: 'en' | 'hi';
}) {
  const badgeStyles = {
    primary: 'bg-[#555934]/12 text-[#555934]',
    secondary: 'bg-[#BF9B7A]/25 text-[#593E2E]',
    destructive: 'bg-[#8C5B3E]/15 text-[#8C5B3E]',
  };

  const iconStyles = {
    primary: 'bg-[#555934]/12 text-[#555934]',
    secondary: 'bg-[#BF9B7A]/25 text-[#593E2E]',
    destructive: 'bg-[#8C5B3E]/15 text-[#8C5B3E]',
  };

  return (
    <a
      href={`/api/sso/demo-persona?email=${encodeURIComponent(email)}&lang=${lang}`}
      className="group flex flex-col justify-between p-4 rounded-2xl bg-[#F2E6D8]/40 hover:bg-[#F2E6D8]/75 hover:shadow-xs transition-all text-left"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className={`flex h-8 w-8 items-center justify-center rounded-md ${iconStyles[badgeColor]}`}>
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
          <p className="font-semibold text-foreground group-hover:text-primary-dark transition-colors text-sm">
            {name}
          </p>
          <p className="text-xs font-medium text-foreground mt-0.5 line-clamp-1">
            {role}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
            {dept}
          </p>
        </div>
      </div>

      <div className="pt-3 mt-3 border-t border-accent flex items-center justify-between text-xs text-primary-dark font-medium">
        <span className="text-[11px] font-mono text-muted-foreground truncate max-w-32.5">
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
