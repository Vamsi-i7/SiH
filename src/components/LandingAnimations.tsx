'use client';

import { useEffect, useRef, useState } from 'react';

/* ─── Animated Counter ─────────────────────────────────────────── */
interface CounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  target,
  suffix = '',
  prefix = '',
  duration = 1800,
  className = '',
}: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
            else setCount(target);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count}{suffix}
    </span>
  );
}

/* ─── Scroll Reveal Wrapper ────────────────────────────────────── */
interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollReveal({ children, className = '', delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
        willChange: visible ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}

/* ─── Hero Radar Visual ────────────────────────────────────────── */
export function HeroRadarVisual() {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const cx = 160;
  const cy = 160;
  const r = 110;
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];
  const axes = [
    { label: 'Domain', angle: -90 },
    { label: 'Functional', angle: -18 },
    { label: 'Survey', angle: 54 },
    { label: 'Digital', angle: 126 },
    { label: 'Behavioural', angle: 198 },
  ];

  const targetValues = [0.85, 0.7, 0.6, 0.75, 0.9];
  const currentValues = [0.6, 0.45, 0.35, 0.55, 0.7];

  const toXY = (angle: number, radius: number) => {
    const rad = (angle * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };

  const buildPath = (values: number[]) =>
    axes
      .map((axis, i) => {
        const pt = toXY(axis.angle, r * values[i]);
        return `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
      })
      .join(' ') + ' Z';

  return (
    <div className="relative w-72 h-72 md:w-80 md:h-80 mx-auto">
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(139,154,110,0.15) 0%, transparent 70%)' }}
      />
      <svg viewBox="0 0 320 320" className="w-full h-full">
        {levels.map((l, i) => (
          <circle key={i} cx={cx} cy={cy} r={r * l} fill="none" stroke="rgba(139,154,110,0.2)" strokeWidth="1" />
        ))}
        {axes.map((axis, i) => {
          const pt = toXY(axis.angle, r);
          const labelPt = toXY(axis.angle, r + 24);
          return (
            <g key={i}>
              <line x1={cx} y1={cy} x2={pt.x} y2={pt.y} stroke="rgba(139,154,110,0.2)" strokeWidth="1" />
              <text x={labelPt.x} y={labelPt.y} textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="rgba(255,255,255,0.6)" fontFamily="Inter,sans-serif" fontWeight="600">
                {axis.label}
              </text>
            </g>
          );
        })}
        <path d={buildPath(targetValues)} fill="rgba(139,154,110,0.08)" stroke="rgba(139,154,110,0.4)" strokeWidth="1.5" strokeDasharray="4 3" />
        <path
          d={buildPath(animated ? currentValues : currentValues.map(() => 0))}
          fill="rgba(139,154,110,0.3)"
          stroke="#8b9a6e"
          strokeWidth="2.5"
          style={{ transition: 'all 1.5s cubic-bezier(0.34,1.56,0.64,1)' }}
        />
        {axes.map((axis, i) => {
          const pt = toXY(axis.angle, r * (animated ? currentValues[i] : 0));
          return (
            <circle key={i} cx={pt.x} cy={pt.y} r="4.5" fill="#8b9a6e" stroke="white" strokeWidth="2"
              style={{ transition: `all 1.5s cubic-bezier(0.34,1.56,0.64,1) ${i * 80}ms` }} />
          );
        })}
        <text x={cx} y={cy - 10} textAnchor="middle" fontSize="22" fontWeight="700" fill="white" fontFamily="Inter,sans-serif">68%</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.6)" fontFamily="Inter,sans-serif" fontWeight="600" letterSpacing="1">READINESS INDEX</text>
      </svg>
    </div>
  );
}

/* ─── Animated Progress Bar ────────────────────────────────────── */
interface ProgressBarProps {
  label: string;
  value: number;
  maxValue?: number;
  color?: string;
  delay?: number;
}

export function AnimatedProgressBar({ label, value, maxValue = 5, color = '#8b9a6e', delay = 0 }: ProgressBarProps) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setWidth((value / maxValue) * 100), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, maxValue, delay]);

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-white/80">{label}</span>
        <span className="text-xs font-bold" style={{ color }}>L{value}/L5</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${width}%`, backgroundColor: color, transition: `width 1.2s ease-out ${delay}ms` }}
        />
      </div>
    </div>
  );
}
