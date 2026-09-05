import Link from 'next/link';
import { cookies } from 'next/headers';
import { getTranslations } from 'next-intl/server';
import {
  Building2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Cpu,
  WifiOff,
  Compass,
  ChevronRight,
  FileCheck,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function LandingPage() {
  const t = await getTranslations('home');

  const cookieStore = await cookies();
  const demoCookie = cookieStore.get('demo_user')?.value;
  let activeUser: { name: string; role: string; email: string } | null = null;
  if (demoCookie) {
    try {
      const parsed = JSON.parse(decodeURIComponent(demoCookie));
      if (parsed && parsed.name) {
        activeUser = parsed;
      }
    } catch {
      // Ignore parse error
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-[#1a1a1a] antialiased">
      {/* Institutional Top Crest & Header */}
      <header className="sticky top-0 z-40 border-b border-[#e3dbcf] bg-white/95 backdrop-blur-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#8b9a6e] text-white shadow-xs">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-lg text-[#1a1a1a]">
                  StatVidya
                </span>
                <span className="rounded-md bg-[#eae2d6] border border-[#e3dbcf] px-2 py-0.5 text-[11px] font-semibold text-[#1a1a1a]">
                  MoSPI • NSSTA
                </span>
              </div>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Ministry of Statistics & Programme Implementation • Government of India
              </p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#capabilities" className="hover:text-[#1a1a1a] transition-colors">
              {t('nav.capabilities')}
            </a>
            <a href="#framework" className="hover:text-[#1a1a1a] transition-colors">
              {t('nav.framework')}
            </a>
            <a href="#cadres" className="hover:text-[#1a1a1a] transition-colors">
              {t('nav.cadres')}
            </a>
            <a href="#about" className="hover:text-[#1a1a1a] transition-colors">
              {t('nav.about')}
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {activeUser ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-md bg-[#8b9a6e] px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-primary-dark transition-colors"
              >
                <span>{t('nav.goToDashboard')}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 rounded-md bg-[#8b9a6e] px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-primary-dark transition-colors"
              >
                <span>{t('nav.officialLogin')}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative px-4 sm:px-6 pt-16 pb-20 max-w-5xl mx-auto text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#e3dbcf] bg-white text-xs font-semibold text-[#1a1a1a] mb-6 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#8b9a6e] animate-pulse"></span>
            <span>{t('badge')}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1a1a1a] leading-tight sm:leading-tight mb-6 max-w-4xl mx-auto">
            {t('hero.title')}
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-10">
            {t('hero.subtitle')}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
            {activeUser ? (
              <>
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md bg-[#8b9a6e] text-white font-semibold text-sm shadow-xs hover:bg-primary-dark transition-colors"
                >
                  <span>{t('cta.continueAs', { name: activeUser.name })}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/auth/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-md bg-white border border-[#e3dbcf] text-[#1a1a1a] font-medium text-sm hover:bg-[#eae2d6]/30 transition-colors"
                >
                  <span>{t('cta.demoPersonas')}</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-md bg-[#8b9a6e] text-white font-semibold text-sm shadow-xs hover:bg-primary-dark transition-colors"
                >
                  <span>{t('cta.enterPortal')}</span>
                </Link>
                <a
                  href="#framework"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md bg-white border border-[#e3dbcf] text-[#1a1a1a] font-medium text-sm hover:bg-[#eae2d6]/30 transition-colors"
                >
                  <span>{t('cta.exploreFramework')}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </a>
              </>
            )}
          </div>

          {/* Institutional Stats Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-10 border-t border-[#e3dbcf] text-left">
            <div className="p-4 rounded-xl bg-white border border-[#e3dbcf]">
              <div className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">{t('stats.cadres')}</div>
              <div className="text-xs text-muted-foreground mt-1">{t('stats.cadresDesc')}</div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#e3dbcf]">
              <div className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">{t('stats.competencies')}</div>
              <div className="text-xs text-muted-foreground mt-1">{t('stats.competenciesDesc')}</div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#e3dbcf]">
              <div className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">{t('stats.coverage')}</div>
              <div className="text-xs text-muted-foreground mt-1">{t('stats.coverageDesc')}</div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#e3dbcf]">
              <div className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">{t('stats.offline')}</div>
              <div className="text-xs text-muted-foreground mt-1">{t('stats.offlineDesc')}</div>
            </div>
          </div>
        </section>

        {/* Capabilities Section */}
        <section id="capabilities" className="px-4 sm:px-6 py-16 bg-white border-y border-[#e3dbcf]">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1a1a1a]">
                {t('pillars.title')}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                {t('pillars.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pillar 1 */}
              <div className="rounded-xl border border-[#e3dbcf] bg-background/60 p-6 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#8b9a6e] text-white">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-[#1a1a1a]">
                  {t('pillars.frac.title')}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {t('pillars.frac.description')}
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="rounded-xl border border-[#e3dbcf] bg-background/60 p-6 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#8b9a6e] text-white">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-[#1a1a1a]">
                  {t('pillars.igot.title')}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {t('pillars.igot.description')}
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="rounded-xl border border-[#e3dbcf] bg-background/60 p-6 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#8b9a6e] text-white">
                  <Cpu className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-[#1a1a1a]">
                  {t('pillars.mcq.title')}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {t('pillars.mcq.description')}
                </p>
              </div>

              {/* Pillar 4 */}
              <div className="rounded-xl border border-[#e3dbcf] bg-background/60 p-6 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#8b9a6e] text-white">
                  <WifiOff className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-[#1a1a1a]">
                  {t('pillars.offline.title')}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {t('pillars.offline.description')}
                </p>
              </div>

              {/* Pillar 5 */}
              <div className="rounded-xl border border-[#e3dbcf] bg-background/60 p-6 space-y-3 md:col-span-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#8b9a6e] text-white">
                  <FileCheck className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-[#1a1a1a]">
                  {t('pillars.provenance.title')}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {t('pillars.provenance.description')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FRAC Framework Architecture Section */}
        <section id="framework" className="px-4 sm:px-6 py-16 max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1a1a1a]">
              {t('framework.title')}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              {t('framework.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl bg-white border border-[#e3dbcf] p-6 space-y-2.5">
              <span className="inline-block px-2.5 py-1 rounded text-xs font-semibold bg-[#8b9a6e]/15 text-primary-dark">
                Category I
              </span>
              <h3 className="text-base font-bold text-[#1a1a1a]">{t('framework.domain.title')}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {t('framework.domain.desc')}
              </p>
            </div>

            <div className="rounded-xl bg-white border border-[#e3dbcf] p-6 space-y-2.5">
              <span className="inline-block px-2.5 py-1 rounded text-xs font-semibold bg-[#8b9a6e]/15 text-primary-dark">
                Category II
              </span>
              <h3 className="text-base font-bold text-[#1a1a1a]">{t('framework.functional.title')}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {t('framework.functional.desc')}
              </p>
            </div>

            <div className="rounded-xl bg-white border border-[#e3dbcf] p-6 space-y-2.5">
              <span className="inline-block px-2.5 py-1 rounded text-xs font-semibold bg-[#8b9a6e]/15 text-primary-dark">
                Category III
              </span>
              <h3 className="text-base font-bold text-[#1a1a1a]">{t('framework.behavioural.title')}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {t('framework.behavioural.desc')}
              </p>
            </div>
          </div>

          {/* L1 to L5 Proficiency Scale Card */}
          <div className="rounded-xl bg-white border border-[#e3dbcf] p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-bold text-[#1a1a1a] flex items-center gap-2">
              <Compass className="h-5 w-5 text-[#8b9a6e]" />
              <span>{t('framework.levels.title')}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
              <div className="p-3.5 rounded-lg border border-[#e3dbcf] bg-background/50">
                <span className="text-xs font-bold text-[#8b9a6e] uppercase tracking-wider block mb-1">Level 1</span>
                <p className="text-xs text-[#1a1a1a] font-medium">{t('framework.levels.l1')}</p>
              </div>
              <div className="p-3.5 rounded-lg border border-[#e3dbcf] bg-background/50">
                <span className="text-xs font-bold text-[#8b9a6e] uppercase tracking-wider block mb-1">Level 2</span>
                <p className="text-xs text-[#1a1a1a] font-medium">{t('framework.levels.l2')}</p>
              </div>
              <div className="p-3.5 rounded-lg border border-[#e3dbcf] bg-background/50">
                <span className="text-xs font-bold text-[#8b9a6e] uppercase tracking-wider block mb-1">Level 3</span>
                <p className="text-xs text-[#1a1a1a] font-medium">{t('framework.levels.l3')}</p>
              </div>
              <div className="p-3.5 rounded-lg border border-[#e3dbcf] bg-background/50">
                <span className="text-xs font-bold text-[#8b9a6e] uppercase tracking-wider block mb-1">Level 4</span>
                <p className="text-xs text-[#1a1a1a] font-medium">{t('framework.levels.l4')}</p>
              </div>
              <div className="p-3.5 rounded-lg border border-[#e3dbcf] bg-background/50">
                <span className="text-xs font-bold text-[#8b9a6e] uppercase tracking-wider block mb-1">Level 5</span>
                <p className="text-xs text-[#1a1a1a] font-medium">{t('framework.levels.l5')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistical Cadres Section */}
        <section id="cadres" className="px-4 sm:px-6 py-16 bg-white border-t border-[#e3dbcf]">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1a1a1a]">
                {t('cadres.title')}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                {t('cadres.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-5 rounded-xl border border-[#e3dbcf] bg-background/50 space-y-2">
                <h3 className="text-sm font-bold text-[#1a1a1a]">{t('cadres.iss.title')}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{t('cadres.iss.desc')}</p>
              </div>
              <div className="p-5 rounded-xl border border-[#e3dbcf] bg-background/50 space-y-2">
                <h3 className="text-sm font-bold text-[#1a1a1a]">{t('cadres.sss.title')}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{t('cadres.sss.desc')}</p>
              </div>
              <div className="p-5 rounded-xl border border-[#e3dbcf] bg-background/50 space-y-2">
                <h3 className="text-sm font-bold text-[#1a1a1a]">{t('cadres.nsso.title')}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{t('cadres.nsso.desc')}</p>
              </div>
              <div className="p-5 rounded-xl border border-[#e3dbcf] bg-background/50 space-y-2">
                <h3 className="text-sm font-bold text-[#1a1a1a]">{t('cadres.nssta.title')}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{t('cadres.nssta.desc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* About MoSPI & Governance Section */}
        <section id="about" className="px-4 sm:px-6 py-16 max-w-5xl mx-auto space-y-8">
          <div className="rounded-2xl border border-[#e3dbcf] bg-white p-6 sm:p-10 space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">
              {t('about.title')}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {t('about.body')}
            </p>

            <div className="pt-6 border-t border-[#e3dbcf] grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-muted-foreground">
              <div>
                <span className="font-semibold text-[#1a1a1a] block mb-1">
                  {t('about.contactTitle')}
                </span>
                <p className="leading-relaxed">{t('about.contactAddress')}</p>
              </div>
              <div>
                <span className="font-semibold text-[#1a1a1a] block mb-1">
                  Official Communication
                </span>
                <p className="font-mono text-[#1a1a1a]">{t('about.contactEmail')}</p>
                <p className="mt-1">Ministry of Statistics & Programme Implementation (MoSPI)</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Institutional Footer */}
      <footer className="border-t border-[#e3dbcf] bg-white py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#1a1a1a]">StatVidya</span>
            <span>•</span>
            <span>MoSPI & NSSTA Competency Intelligence Platform</span>
          </div>
          <div>
            © {new Date().getFullYear()} Government of India. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
