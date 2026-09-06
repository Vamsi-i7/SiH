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
    <div className="min-h-screen flex flex-col bg-background text-[#1a1a1a] antialiased">

      {/* ══════════════════════════════════════════════════
          STICKY HEADER
      ══════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 border-b border-[#e3dbcf]/80 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-[#8b9a6e] to-primary-dark text-white shadow-md">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-lg text-[#1a1a1a] leading-none">StatVidya</span>
                <span className="rounded-md bg-[#8b9a6e]/10 border border-[#8b9a6e]/25 px-2 py-0.5 text-[10px] font-bold text-primary-dark uppercase tracking-wide">
                  MoSPI · NSSTA
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground hidden sm:block mt-0.5">
                Ministry of Statistics & Programme Implementation · Government of India
              </p>
            </div>
          </div>

          {/* Nav */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-muted-foreground">
            <a href="#capabilities" className="hover:text-[#1a1a1a] transition-colors hover:border-b hover:border-[#8b9a6e]">
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

          {/* CTA */}
          <div className="flex items-center gap-3">
            {activeUser ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-[#8b9a6e] to-primary-dark px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                <span>{t('nav.goToDashboard')}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-[#8b9a6e] to-primary-dark px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                <span>{t('nav.officialLogin')}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* ══════════════════════════════════════════════════
            HERO SECTION — Dark, immersive
        ══════════════════════════════════════════════════ */}
        <section
          className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1a2210 0%, #2a3520 35%, #1c2818 70%, #0f1a0c 100%)',
            minHeight: '92vh',
          }}
        >
          {/* Decorative grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'linear-gradient(rgba(139,154,110,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(139,154,110,0.8) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />

          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-150 h-150 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #8b9a6e 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
          <div className="absolute bottom-0 left-0 w-100 h-100 rounded-full opacity-8"
            style={{ background: 'radial-gradient(circle, #c9963a 0%, transparent 70%)', transform: 'translate(-40%, 40%)' }} />

          {/* Government emblem strip */}
          <div className="relative border-b border-white/5 bg-white/3 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-4 text-[11px] text-white/40 font-medium">
                <span className="flex items-center gap-1.5">
                  <Lock className="h-3 w-3" />
                  Secured · NIC Infrastructure
                </span>
                <span className="h-3 w-px bg-white/20" />
                <span>National Statistical Commission Guidelines</span>
              </div>
              <div className="text-[11px] text-white/30 hidden sm:block">
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
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#8b9a6e]/30 bg-[#8b9a6e]/10 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-[#8b9a6e] animate-pulse shrink-0" />
                  <span className="text-xs font-semibold text-[#a3b580] tracking-wide uppercase">{t('badge')}</span>
                </div>

                {/* Headline */}
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.05] sm:leading-[1.05]">
                    {t('hero.title')}
                  </h1>
                  <p className="text-base sm:text-lg text-white/60 leading-relaxed max-w-xl">
                    {t('hero.subtitle')}
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {activeUser ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-linear-to-r from-[#8b9a6e] to-primary-dark text-white font-bold text-sm shadow-xl shadow-[#8b9a6e]/25 hover:shadow-2xl hover:-translate-y-0.5 transition-all"
                      >
                        {t('cta.continueAs', { name: activeUser.name })}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <Link
                        href="/auth/login"
                        className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-white/15 text-white/80 font-semibold text-sm hover:bg-white/8 hover:border-white/25 transition-all"
                      >
                        {t('cta.demoPersonas')}
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/login"
                        className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-linear-to-r from-[#8b9a6e] to-primary-dark text-white font-bold text-sm shadow-xl shadow-[#8b9a6e]/25 hover:shadow-2xl hover:-translate-y-0.5 transition-all"
                      >
                        {t('cta.enterPortal')}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <a
                        href="#framework"
                        className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-white/15 text-white/80 font-semibold text-sm hover:bg-white/8 hover:border-white/25 transition-all"
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
                    <span key={i} className="flex items-center gap-1.5 text-xs text-white/45 font-medium">
                      <Icon className="h-3.5 w-3.5 text-[#8b9a6e]" />
                      {text}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right: Radar Visualization Card */}
              <div className="relative">
                <div
                  className="relative rounded-2xl border border-white/10 overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)' }}
                >
                  {/* Card header */}
                  <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white/80 uppercase tracking-widest mb-0.5">Competency Radar</div>
                      <div className="text-[11px] text-white/40">NSSO Field Investigator · Demo Profile</div>
                    </div>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#8b9a6e]/15 border border-[#8b9a6e]/25">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8b9a6e] animate-pulse" />
                      <span className="text-[10px] font-bold text-[#8b9a6e]">LIVE</span>
                    </span>
                  </div>

                  {/* Radar chart */}
                  <div className="p-6">
                    <HeroRadarVisual />
                  </div>

                  {/* Competency bars */}
                  <div className="px-6 pb-6 space-y-3">
                    <AnimatedProgressBar label="Domain Competencies" value={3} delay={0} />
                    <AnimatedProgressBar label="Survey Methodology" value={2} delay={120} color="#c9963a" />
                    <AnimatedProgressBar label="Digital Literacy" value={3} delay={240} />
                    <AnimatedProgressBar label="Behavioural" value={4} delay={360} color="#8b9a6e" />
                  </div>

                  {/* Legend */}
                  <div className="px-6 pb-5 flex items-center gap-5 border-t border-white/8 pt-4">
                    <div className="flex items-center gap-2 text-[11px] text-white/50">
                      <div className="w-6 h-0.5 border-t border-dashed border-[#8b9a6e]/60" />
                      Target Level
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-white/50">
                      <div className="w-6 h-0.5 bg-[#8b9a6e]" />
                      Current Level
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-12 border-t border-white/8">
              {[
                { value: 6, suffix: '', label: 'Statistical Cadres', sub: 'ISS, SSS, NSSO, NSSTA & more', icon: Users },
                { value: 24, suffix: '+', label: 'FRAC Competencies', sub: 'Domain, Functional & Behavioural', icon: Award },
                { value: 4000, suffix: '+', label: 'Personnel Covered', sub: 'Field investigators to directors', icon: BarChart3 },
                { value: 5, suffix: ' Levels', label: 'Proficiency Scale', sub: 'L1 Awareness → L5 Expert Mastery', icon: TrendingUp },
              ].map(({ value, suffix, label, sub, icon: Icon }, i) => (
                <div key={i} className="text-left space-y-1 p-5 rounded-xl border border-white/8 bg-white/3 hover:bg-white/6 transition-all group">
                  <Icon className="h-5 w-5 text-[#8b9a6e] mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
                    <AnimatedCounter target={value} suffix={suffix} />
                  </div>
                  <div className="text-xs font-semibold text-white/70">{label}</div>
                  <div className="text-[11px] text-white/35">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            CAPABILITIES SECTION
        ══════════════════════════════════════════════════ */}
        <section id="capabilities" className="px-4 sm:px-6 py-20 bg-background border-b border-[#e3dbcf]">
          <div className="max-w-6xl mx-auto space-y-14">
            <ScrollReveal className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="inline-block text-[11px] font-bold text-[#8b9a6e] uppercase tracking-widest border border-[#8b9a6e]/30 px-3 py-1 rounded-full bg-[#8b9a6e]/5">
                Platform Pillars
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1a1a1a]">
                {t('pillars.title')}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {t('pillars.subtitle')}
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pillar cards */}
              {[
                {
                  icon: ShieldCheck,
                  title: t('pillars.frac.title'),
                  desc: t('pillars.frac.description'),
                  accent: '#8b9a6e',
                  delay: 0,
                },
                {
                  icon: BookOpen,
                  title: t('pillars.igot.title'),
                  desc: t('pillars.igot.description'),
                  accent: '#c9963a',
                  delay: 80,
                },
                {
                  icon: Cpu,
                  title: t('pillars.mcq.title'),
                  desc: t('pillars.mcq.description'),
                  accent: '#8b9a6e',
                  delay: 160,
                },
                {
                  icon: WifiOff,
                  title: t('pillars.offline.title'),
                  desc: t('pillars.offline.description'),
                  accent: '#c9963a',
                  delay: 240,
                },
                {
                  icon: FileCheck,
                  title: t('pillars.provenance.title'),
                  desc: t('pillars.provenance.description'),
                  accent: '#8b9a6e',
                  delay: 320,
                  wide: true,
                },
              ].map(({ icon: Icon, title, desc, accent, delay, wide }, i) => (
                <ScrollReveal
                  key={i}
                  delay={delay}
                  className={wide ? 'md:col-span-2' : ''}
                >
                  <div
                    className="h-full rounded-2xl border border-[#e3dbcf] bg-white p-6 space-y-4 hover:shadow-lg hover:-translate-y-1 transition-all group cursor-default"
                    style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                  >
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-md group-hover:scale-105 transition-transform"
                      style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-bold text-[#1a1a1a]">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            FRAC FRAMEWORK SECTION — Dark accent
        ══════════════════════════════════════════════════ */}
        <section
          id="framework"
          className="relative px-4 sm:px-6 py-20 overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #1e2a14 0%, #2d3d1e 50%, #1a2410 100%)' }}
        >
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(139,154,110,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,154,110,1) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative max-w-6xl mx-auto space-y-14">
            <ScrollReveal className="text-center space-y-3 max-w-3xl mx-auto">
              <span className="inline-block text-[11px] font-bold text-[#8b9a6e] uppercase tracking-widest border border-[#8b9a6e]/30 px-3 py-1 rounded-full bg-[#8b9a6e]/10">
                Architecture
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                {t('framework.title')}
              </h2>
              <p className="text-sm sm:text-base text-white/55 leading-relaxed">
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
                  <div className="h-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 space-y-4 hover:bg-white/8 hover:border-white/20 transition-all group">
                    <div className="flex items-center justify-between">
                      <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#8b9a6e]/20 text-[#8b9a6e] uppercase tracking-wider border border-[#8b9a6e]/25">
                        {cat}
                      </span>
                      <Icon className="h-5 w-5 text-white/25 group-hover:text-[#8b9a6e] transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{title}</h3>
                    <p className="text-sm text-white/55 leading-relaxed">{desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Proficiency Scale */}
            <ScrollReveal delay={100}>
              <div className="rounded-2xl border border-white/10 bg-white/4 backdrop-blur-sm p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8b9a6e]/20 border border-[#8b9a6e]/30">
                    <Compass className="h-5 w-5 text-[#8b9a6e]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{t('framework.levels.title')}</h3>
                    <p className="text-xs text-white/40">Adopted from Mission Karmayogi FRAC guidelines</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  {[
                    { key: 'l1', color: '#5a7a3a', bg: 'rgba(90,122,58,0.12)' },
                    { key: 'l2', color: '#728056', bg: 'rgba(114,128,86,0.14)' },
                    { key: 'l3', color: '#8b9a6e', bg: 'rgba(139,154,110,0.16)' },
                    { key: 'l4', color: '#c9963a', bg: 'rgba(201,150,58,0.14)' },
                    { key: 'l5', color: '#e8a83a', bg: 'rgba(232,168,58,0.12)' },
                  ].map(({ key, color, bg }, i) => (
                    <div
                      key={key}
                      className="p-4 rounded-xl border hover:scale-105 transition-transform cursor-default"
                      style={{ borderColor: `${color}30`, backgroundColor: bg }}
                    >
                      <span
                        className="text-[10px] font-black uppercase tracking-widest block mb-2"
                        style={{ color }}
                      >
                        Level {i + 1}
                      </span>
                      <p className="text-xs text-white/65 font-medium leading-snug">
                        {t(`framework.levels.${key}` as Parameters<typeof t>[0])}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            CADRES SECTION — Light
        ══════════════════════════════════════════════════ */}
        <section id="cadres" className="px-4 sm:px-6 py-20 bg-white border-b border-[#e3dbcf]">
          <div className="max-w-6xl mx-auto space-y-14">
            <ScrollReveal className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="inline-block text-[11px] font-bold text-[#8b9a6e] uppercase tracking-widest border border-[#8b9a6e]/30 px-3 py-1 rounded-full bg-[#8b9a6e]/5">
                Cadres & Roles
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1a1a1a]">
                {t('cadres.title')}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
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
                  color: '#1a2a10',
                  delay: 0,
                },
                {
                  abbr: 'SSS',
                  title: t('cadres.sss.title'),
                  desc: t('cadres.sss.desc'),
                  level: 'Mid-level Officers',
                  color: '#2a3d15',
                  delay: 80,
                },
                {
                  abbr: 'NSSO',
                  title: t('cadres.nsso.title'),
                  desc: t('cadres.nsso.desc'),
                  level: 'Field Operations',
                  color: '#3a3010',
                  delay: 160,
                },
                {
                  abbr: 'NSSTA',
                  title: t('cadres.nssta.title'),
                  desc: t('cadres.nssta.desc'),
                  level: 'Training Academy',
                  color: '#1a2a10',
                  delay: 240,
                },
              ].map(({ abbr, title, desc, level, color, delay }, i) => (
                <ScrollReveal key={i} delay={delay}>
                  <div className="h-full group rounded-2xl border border-[#e3dbcf] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all">
                    {/* Top accent */}
                    <div
                      className="px-5 py-4 flex items-center justify-between"
                      style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)` }}
                    >
                      <span className="text-2xl font-black text-white/90 tracking-tight">{abbr}</span>
                      <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider border border-white/15 px-2 py-0.5 rounded">{level}</span>
                    </div>
                    <div className="p-5 space-y-2 bg-white">
                      <h3 className="text-sm font-bold text-[#1a1a1a]">{title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            ABOUT / GOVERNANCE — Warm cream
        ══════════════════════════════════════════════════ */}
        <section id="about" className="px-4 sm:px-6 py-20 bg-background">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <div className="rounded-2xl border border-[#e3dbcf] bg-white overflow-hidden shadow-md">
                {/* Top bar */}
                <div
                  className="px-8 py-5 border-b border-[#e3dbcf]"
                  style={{ background: 'linear-gradient(135deg, #1a2210 0%, #2a3520 100%)' }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">{t('about.title')}</h2>
                      <p className="text-xs text-white/50 mt-1">Government of India · MoSPI</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-[11px] text-white/40">
                      <CheckCircle2 className="h-4 w-4 text-[#8b9a6e]" />
                      Verified Institutional Platform
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-8 space-y-8">
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {t('about.body')}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-[#e3dbcf]">
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-[#1a1a1a] uppercase tracking-widest block">
                        {t('about.contactTitle')}
                      </span>
                      <p className="text-sm text-muted-foreground leading-relaxed">{t('about.contactAddress')}</p>
                    </div>
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-[#1a1a1a] uppercase tracking-widest block">
                        Official Communication
                      </span>
                      <p className="font-mono text-sm text-[#8b9a6e] font-semibold">{t('about.contactEmail')}</p>
                      <p className="text-xs text-muted-foreground">Ministry of Statistics & Programme Implementation (MoSPI)</p>
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
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          primary
                            ? 'bg-[#8b9a6e] text-white hover:bg-primary-dark shadow-md hover:-translate-y-0.5'
                            : 'border border-[#e3dbcf] text-[#1a1a1a] hover:bg-background hover:border-[#8b9a6e]/30'
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

      {/* ══════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════ */}
      <footer
        className="border-t border-white/10 py-10 px-4 sm:px-6"
        style={{ background: 'linear-gradient(135deg, #1a2210 0%, #2a3520 100%)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-white/10">
            {/* Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-[#8b9a6e]/20 border border-[#8b9a6e]/30 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-[#8b9a6e]" />
                </div>
                <span className="font-bold text-lg text-white">StatVidya</span>
              </div>
              <p className="text-xs text-white/40 leading-relaxed max-w-xs">
                Competency Intelligence Platform for India&apos;s Official Statistical System.
                Built under Mission Karmayogi.
              </p>
            </div>

            {/* Links */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold text-white/50 uppercase tracking-widest">Platform</h4>
              <div className="space-y-2">
                {[
                  { href: '#capabilities', label: 'Capabilities' },
                  { href: '#framework', label: 'FRAC Framework' },
                  { href: '#cadres', label: 'Cadres & Roles' },
                  { href: '/auth/login', label: 'Official Login' },
                ].map(({ href, label }) => (
                  <div key={label}>
                    <a href={href} className="text-xs text-white/45 hover:text-white/75 transition-colors border-b-0 hover:border-b-0">
                      {label}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Institutional */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold text-white/50 uppercase tracking-widest">Institution</h4>
              <div className="space-y-1 text-xs text-white/40">
                <div>National Statistical Systems Training Academy</div>
                <div>Plot No. 22, Knowledge Park-II</div>
                <div>Greater Noida, UP 201310</div>
                <div className="pt-2 font-mono text-[#8b9a6e]/70">nssta-training@mospi.gov.in</div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 text-[11px] text-white/30">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-white/50">StatVidya</span>
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
