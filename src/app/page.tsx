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
  Users,
  BarChart3,
  Award,
  TrendingUp,
  Globe,
  CheckCircle2,
  Zap,
  Lock,
} from 'lucide-react';
import {
  AnimatedCounter,
  ScrollReveal,
  HeroRadarVisual,
  AnimatedProgressBar,
} from '@/components/LandingAnimations';

export const dynamic = 'force-dynamic';

export default async function LandingPage() {
  const t = await getTranslations('home');

  const cookieStore = await cookies();
  const demoCookie = cookieStore.get('demo_user')?.value;
  let activeUser: { name: string; role: string; email: string } | null = null;
  if (demoCookie) {
    try {
      const parsed = JSON.parse(decodeURIComponent(demoCookie));
      if (parsed && parsed.name) activeUser = parsed;
    } catch {
      // Ignore parse error
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-[#2d1f17] antialiased">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#555934] text-white shadow-xs">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-lg text-[#2d1f17] leading-none">StatVidya</span>
                <span className="rounded-full bg-[#BF9B7A]/25 px-2.5 py-0.5 text-[10px] font-bold text-[#593E2E] uppercase tracking-wide">
                  MoSPI · NSSTA
                </span>
              </div>
              <p className="text-[11px] text-[#705849] hidden sm:block mt-0.5">
                Ministry of Statistics & Programme Implementation · Government of India
              </p>
            </div>
          </div>

          {/* Nav */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#705849]">
            <a href="#capabilities" className="hover:text-[#2d1f17] transition-colors">
              {t('nav.capabilities')}
            </a>
            <a href="#framework" className="hover:text-[#2d1f17] transition-colors">
              {t('nav.framework')}
            </a>
            <a href="#cadres" className="hover:text-[#2d1f17] transition-colors">
              {t('nav.cadres')}
            </a>
            <a href="#about" className="hover:text-[#2d1f17] transition-colors">
              {t('nav.about')}
            </a>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            {activeUser ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-[#555934] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-[#3e4225] transition-all hover:-translate-y-0.5 active:scale-95"
              >
                <span>{t('nav.goToDashboard')}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 rounded-xl bg-[#555934] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-[#3e4225] transition-all hover:-translate-y-0.5 active:scale-95"
              >
                <span>{t('nav.officialLogin')}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section
          className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #2d1f17 0%, #3e4225 35%, #555934 70%, #20150e 100%)',
            minHeight: '92vh',
          }}
        >
          {/* Decorative blobs */}
          <div
            className="absolute top-0 right-0 w-150 h-150 rounded-full opacity-15 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #BF9B7A 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}
          />
          <div
            className="absolute bottom-0 left-0 w-100 h-100 rounded-full opacity-10 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #8C5B3E 0%, transparent 70%)', transform: 'translate(-40%, 40%)' }}
          />

          {/* Government emblem strip */}
          <div className="relative bg-white/5 backdrop-blur-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-4 text-[11px] text-white/60 font-medium">
                <span className="flex items-center gap-1.5">
                  <Lock className="h-3 w-3 text-[#BF9B7A]" />
                  Secured · NIC Infrastructure
                </span>
                <span className="h-3 w-px bg-white/20" />
                <span>National Statistical Commission Guidelines</span>
              </div>
              <div className="text-[11px] text-white/50 hidden sm:block">
                Mission Karmayogi · Competency Platform
              </div>
            </div>
          </div>

          {/* Hero Content */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left: Text */}
              <div className="space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-[#BF9B7A] animate-pulse shrink-0" />
                  <span className="text-xs font-semibold text-[#F2E6D8] tracking-wide uppercase">{t('badge')}</span>
                </div>

                {/* Headline */}
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.08] sm:leading-[1.08]">
                    {t('hero.title')}
                  </h1>
                  <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-xl">
                    {t('hero.subtitle')}
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3.5">
                  {activeUser ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-[#555934] hover:bg-[#3e4225] text-white font-bold text-sm shadow-xl hover:-translate-y-0.5 transition-all"
                      >
                        {t('cta.continueAs', { name: activeUser.name })}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <Link
                        href="/auth/login"
                        className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/10 text-white font-semibold text-sm hover:bg-white/15 transition-all"
                      >
                        {t('cta.demoPersonas')}
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/login"
                        className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-[#555934] hover:bg-[#3e4225] text-white font-bold text-sm shadow-xl hover:-translate-y-0.5 transition-all"
                      >
                        {t('cta.enterPortal')}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <a
                        href="#framework"
                        className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/10 text-white font-semibold text-sm hover:bg-white/15 transition-all"
                      >
                        {t('cta.exploreFramework')}
                        <ChevronRight className="h-4 w-4" />
                      </a>
                    </>
                  )}
                </div>

                {/* Trust signals */}
                <div className="flex flex-wrap items-center gap-5 pt-2">
                  {[
                    { icon: CheckCircle2, text: 'FRAC Aligned' },
                    { icon: ShieldCheck, text: 'NIC Secured' },
                    { icon: Globe, text: 'Bilingual' },
                    { icon: WifiOff, text: 'Offline-First' },
                  ].map(({ icon: Icon, text }, i) => (
                    <span key={i} className="flex items-center gap-1.5 text-xs text-white/60 font-medium">
                      <Icon className="h-3.5 w-3.5 text-[#BF9B7A]" />
                      {text}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right: Radar Visualization Card */}
              <div className="relative">
                <div
                  className="relative rounded-2xl overflow-hidden shadow-2xl"
                  style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}
                >
                  {/* Card header */}
                  <div className="px-6 py-4 bg-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white/90 uppercase tracking-widest mb-0.5">Competency Radar</div>
                      <div className="text-[11px] text-white/50">NSSO Field Investigator · Demo Profile</div>
                    </div>
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#555934]/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#BF9B7A] animate-pulse" />
                      <span className="text-[10px] font-bold text-[#F2E6D8]">LIVE</span>
                    </span>
                  </div>

                  {/* Radar chart */}
                  <div className="p-6">
                    <HeroRadarVisual />
                  </div>

                  {/* Competency bars */}
                  <div className="px-6 pb-6 space-y-3">
                    <AnimatedProgressBar label="Domain Competencies" value={3} delay={0} color="#555934" />
                    <AnimatedProgressBar label="Survey Methodology" value={2} delay={120} color="#BF9B7A" />
                    <AnimatedProgressBar label="Digital Literacy" value={3} delay={240} color="#8C5B3E" />
                    <AnimatedProgressBar label="Behavioural" value={4} delay={360} color="#593E2E" />
                  </div>

                  {/* Legend */}
                  <div className="px-6 pb-5 flex items-center gap-5 pt-4 bg-white/5">
                    <div className="flex items-center gap-2 text-[11px] text-white/60">
                      <div className="w-6 h-0.5 border-t border-dashed border-[#BF9B7A]" />
                      Target Level
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-white/60">
                      <div className="w-6 h-0.5 bg-[#555934]" />
                      Current Level
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-12">
              {[
                { value: 6, suffix: '', label: 'Statistical Cadres', sub: 'ISS, SSS, NSSO, NSSTA & more', icon: Users },
                { value: 24, suffix: '+', label: 'FRAC Competencies', sub: 'Domain, Functional & Behavioural', icon: Award },
                { value: 4000, suffix: '+', label: 'Personnel Covered', sub: 'Field investigators to directors', icon: BarChart3 },
                { value: 5, suffix: ' Levels', label: 'Proficiency Scale', sub: 'L1 Awareness → L5 Expert Mastery', icon: TrendingUp },
              ].map(({ value, suffix, label, sub, icon: Icon }, i) => (
                <div key={i} className="text-left space-y-1 p-5 rounded-2xl bg-white/6 hover:bg-white/10 transition-all group">
                  <Icon className="h-5 w-5 text-[#BF9B7A] mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
                    <AnimatedCounter target={value} suffix={suffix} />
                  </div>
                  <div className="text-xs font-semibold text-white/80">{label}</div>
                  <div className="text-[11px] text-white/45">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CAPABILITIES SECTION */}
        <section id="capabilities" className="px-4 sm:px-6 py-20 bg-background">
          <div className="max-w-6xl mx-auto space-y-14">
            <ScrollReveal className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="inline-block text-[11px] font-bold text-[#555934] uppercase tracking-widest px-3 py-1 rounded-full bg-[#555934]/12">
                Platform Pillars
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#2d1f17]">
                {t('pillars.title')}
              </h2>
              <p className="text-sm sm:text-base text-[#705849] leading-relaxed">
                {t('pillars.subtitle')}
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: ShieldCheck,
                  title: t('pillars.frac.title'),
                  desc: t('pillars.frac.description'),
                  accent: '#555934',
                  delay: 0,
                },
                {
                  icon: BookOpen,
                  title: t('pillars.igot.title'),
                  desc: t('pillars.igot.description'),
                  accent: '#8C5B3E',
                  delay: 80,
                },
                {
                  icon: Cpu,
                  title: t('pillars.mcq.title'),
                  desc: t('pillars.mcq.description'),
                  accent: '#BF9B7A',
                  delay: 160,
                },
                {
                  icon: WifiOff,
                  title: t('pillars.offline.title'),
                  desc: t('pillars.offline.description'),
                  accent: '#593E2E',
                  delay: 240,
                },
                {
                  icon: FileCheck,
                  title: t('pillars.provenance.title'),
                  desc: t('pillars.provenance.description'),
                  accent: '#555934',
                  delay: 320,
                  wide: true,
                },
              ].map(({ icon: Icon, title, desc, accent, delay, wide }, i) => (
                <ScrollReveal
                  key={i}
                  delay={delay}
                  className={wide ? 'md:col-span-2' : ''}
                >
                  <div className="h-full rounded-2xl bg-white p-7 space-y-4 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all group cursor-default">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-xs group-hover:scale-105 transition-transform"
                      style={{ background: accent }}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-bold text-[#2d1f17]">{title}</h3>
                    <p className="text-sm text-[#705849] leading-relaxed">{desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* FRAC FRAMEWORK SECTION */}
        <section
          id="framework"
          className="relative px-4 sm:px-6 py-20 overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #2d1f17 0%, #3e4225 50%, #20150e 100%)' }}
        >
          <div className="relative max-w-6xl mx-auto space-y-14">
            <ScrollReveal className="text-center space-y-3 max-w-3xl mx-auto">
              <span className="inline-block text-[11px] font-bold text-[#BF9B7A] uppercase tracking-widest px-3 py-1 rounded-full bg-white/10">
                Architecture
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                {t('framework.title')}
              </h2>
              <p className="text-sm sm:text-base text-white/70 leading-relaxed">
                {t('framework.subtitle')}
              </p>
            </ScrollReveal>

            {/* Three categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  cat: 'Category I',
                  title: t('framework.domain.title'),
                  desc: t('framework.domain.desc'),
                  icon: BarChart3,
                  delay: 0,
                },
                {
                  cat: 'Category II',
                  title: t('framework.functional.title'),
                  desc: t('framework.functional.desc'),
                  icon: Zap,
                  delay: 100,
                },
                {
                  cat: 'Category III',
                  title: t('framework.behavioural.title'),
                  desc: t('framework.behavioural.desc'),
                  icon: Users,
                  delay: 200,
                },
              ].map(({ cat, title, desc, icon: Icon, delay }, i) => (
                <ScrollReveal key={i} delay={delay}>
                  <div className="h-full rounded-2xl bg-white/8 backdrop-blur-sm p-6 space-y-4 hover:bg-white/12 transition-all group">
                    <div className="flex items-center justify-between">
                      <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#BF9B7A]/25 text-[#F2E6D8] uppercase tracking-wider">
                        {cat}
                      </span>
                      <Icon className="h-5 w-5 text-white/40 group-hover:text-[#BF9B7A] transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{title}</h3>
                    <p className="text-sm text-white/65 leading-relaxed">{desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Proficiency Scale */}
            <ScrollReveal delay={100}>
              <div className="rounded-2xl bg-white/6 backdrop-blur-sm p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#555934] text-white">
                    <Compass className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{t('framework.levels.title')}</h3>
                    <p className="text-xs text-white/50">Adopted from Mission Karmayogi FRAC guidelines</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  {[
                    { key: 'l1', color: '#BF9B7A', bg: 'rgba(191,155,122,0.15)' },
                    { key: 'l2', color: '#BF9B7A', bg: 'rgba(191,155,122,0.18)' },
                    { key: 'l3', color: '#F2E6D8', bg: 'rgba(242,230,216,0.15)' },
                    { key: 'l4', color: '#8C5B3E', bg: 'rgba(140,91,62,0.25)' },
                    { key: 'l5', color: '#F2E6D8', bg: 'rgba(85,89,52,0.35)' },
                  ].map(({ key, color, bg }, i) => (
                    <div
                      key={key}
                      className="p-4 rounded-xl hover:scale-105 transition-transform cursor-default"
                      style={{ backgroundColor: bg }}
                    >
                      <span
                        className="text-[10px] font-black uppercase tracking-widest block mb-2"
                        style={{ color }}
                      >
                        Level {i + 1}
                      </span>
                      <p className="text-xs text-white/80 font-medium leading-snug">
                        {t(`framework.levels.${key}` as Parameters<typeof t>[0])}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* CADRES SECTION */}
        <section id="cadres" className="px-4 sm:px-6 py-20 bg-background">
          <div className="max-w-6xl mx-auto space-y-14">
            <ScrollReveal className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="inline-block text-[11px] font-bold text-[#555934] uppercase tracking-widest px-3 py-1 rounded-full bg-[#555934]/12">
                Cadres & Roles
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#2d1f17]">
                {t('cadres.title')}
              </h2>
              <p className="text-sm sm:text-base text-[#705849] leading-relaxed">
                {t('cadres.subtitle')}
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  abbr: 'ISS',
                  title: t('cadres.iss.title'),
                  desc: t('cadres.iss.desc'),
                  level: 'Senior Leadership',
                  color: '#555934',
                  delay: 0,
                },
                {
                  abbr: 'SSS',
                  title: t('cadres.sss.title'),
                  desc: t('cadres.sss.desc'),
                  level: 'Mid-level Officers',
                  color: '#593E2E',
                  delay: 80,
                },
                {
                  abbr: 'NSSO',
                  title: t('cadres.nsso.title'),
                  desc: t('cadres.nsso.desc'),
                  level: 'Field Operations',
                  color: '#8C5B3E',
                  delay: 160,
                },
                {
                  abbr: 'NSSTA',
                  title: t('cadres.nssta.title'),
                  desc: t('cadres.nssta.desc'),
                  level: 'Training Academy',
                  color: '#BF9B7A',
                  delay: 240,
                },
              ].map(({ abbr, title, desc, level, color, delay }, i) => (
                <ScrollReveal key={i} delay={delay}>
                  <div className="h-full group rounded-2xl bg-white shadow-card overflow-hidden hover:shadow-card-hover hover:-translate-y-1 transition-all">
                    {/* Top accent */}
                    <div
                      className="px-5 py-4 flex items-center justify-between"
                      style={{ background: color }}
                    >
                      <span className="text-2xl font-black text-white tracking-tight">{abbr}</span>
                      <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                        {level}
                      </span>
                    </div>
                    <div className="p-5 space-y-2 bg-white">
                      <h3 className="text-sm font-bold text-[#2d1f17]">{title}</h3>
                      <p className="text-xs text-[#705849] leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT / GOVERNANCE */}
        <section id="about" className="px-4 sm:px-6 py-20 bg-background">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <div className="rounded-2xl bg-white overflow-hidden shadow-card">
                {/* Top bar */}
                <div
                  className="px-8 py-5"
                  style={{ background: 'linear-gradient(135deg, #2d1f17 0%, #3e4225 100%)' }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">{t('about.title')}</h2>
                      <p className="text-xs text-white/60 mt-1">Government of India · MoSPI</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-[11px] text-[#BF9B7A]">
                      <CheckCircle2 className="h-4 w-4" />
                      Verified Institutional Platform
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-8 space-y-8">
                  <p className="text-sm sm:text-base text-[#705849] leading-relaxed">
                    {t('about.body')}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-[#2d1f17] uppercase tracking-widest block">
                        {t('about.contactTitle')}
                      </span>
                      <p className="text-sm text-[#705849] leading-relaxed">{t('about.contactAddress')}</p>
                    </div>
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-[#2d1f17] uppercase tracking-widest block">
                        Official Communication
                      </span>
                      <p className="font-mono text-sm text-[#555934] font-semibold">{t('about.contactEmail')}</p>
                      <p className="text-xs text-[#705849]">Ministry of Statistics & Programme Implementation (MoSPI)</p>
                    </div>
                  </div>

                  {/* Quick links */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    {[
                      { href: '/auth/login', label: 'Enter Portal', primary: true },
                      { href: '#capabilities', label: 'Platform Capabilities', primary: false },
                      { href: '#framework', label: 'FRAC Framework', primary: false },
                    ].map(({ href, label, primary }) => (
                      <Link
                        key={label}
                        href={href}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          primary
                            ? 'bg-[#555934] text-white hover:bg-[#3e4225] shadow-xs'
                            : 'bg-[#F2E6D8]/60 text-[#2d1f17] hover:bg-[#F2E6D8]'
                        }`}
                      >
                        {label}
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer
        className="py-10 px-4 sm:px-6"
        style={{ background: 'linear-gradient(135deg, #2d1f17 0%, #20150e 100%)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-white/10">
            {/* Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-[#555934] flex items-center justify-center text-white">
                  <Building2 className="h-5 w-5" />
                </div>
                <span className="font-bold text-lg text-white">StatVidya</span>
              </div>
              <p className="text-xs text-white/50 leading-relaxed max-w-xs">
                Competency Intelligence Platform for India&apos;s Official Statistical System.
                Built under Mission Karmayogi.
              </p>
            </div>

            {/* Links */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold text-white/60 uppercase tracking-widest">Platform</h4>
              <div className="space-y-2">
                {[
                  { href: '#capabilities', label: 'Capabilities' },
                  { href: '#framework', label: 'FRAC Framework' },
                  { href: '#cadres', label: 'Cadres & Roles' },
                  { href: '/auth/login', label: 'Official Login' },
                ].map(({ href, label }) => (
                  <div key={label}>
                    <a href={href} className="text-xs text-white/50 hover:text-white/80 transition-colors">
                      {label}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Institutional */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold text-white/60 uppercase tracking-widest">Institution</h4>
              <div className="space-y-1 text-xs text-white/50">
                <div>National Statistical Systems Training Academy</div>
                <div>Plot No. 22, Knowledge Park-II</div>
                <div>Greater Noida, UP 201310</div>
                <div className="pt-2 font-mono text-[#BF9B7A]">nssta-training@mospi.gov.in</div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 text-[11px] text-white/40">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-white/60">StatVidya</span>
              <span>·</span>
              <span>MoSPI & NSSTA Competency Intelligence Platform</span>
            </div>
            <div>
              © {new Date().getFullYear()} Government of India. All Rights Reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
