'use client';

import React from 'react';
import { ProvenanceBadge } from './ProvenanceBadge';
import {
  BookOpen,
  Clock,
  Star,
  Users,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  Tablet,
  PieChart,
  FileCheck2,
} from 'lucide-react';

export interface CourseData {
  id: string;
  courseId?: string;
  title: string;
  title_hi?: string;
  provider: string;
  duration: string;
  description: string;
  description_hi?: string;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  targetCompetencies: string[];
  whyRecommended?: string;
  stage?: 'FOUNDATIONAL' | 'APPLIED' | 'CAPSTONE' | string;
  progress?: number;
  currentModule?: string;
  iGotLink?: string;
  rating?: number;
  enrolledCount?: number;
  domain?: string;
}

interface CourseCardProps {
  course: CourseData;
  variant?: 'standard' | 'compact' | 'in-progress';
  className?: string;
}

export function CourseCard({
  course,
  variant = 'standard',
  className = '',
}: CourseCardProps) {
  // Domain icon resolver
  const getDomainIcon = (title: string, domain?: string) => {
    const text = (title + ' ' + (domain || '')).toLowerCase();
    if (text.includes('capi') || text.includes('tablet') || text.includes('device')) {
      return <Tablet className="h-4 w-4 text-[#555934]" />;
    }
    if (text.includes('sample') || text.includes('sampling') || text.includes('math')) {
      return <PieChart className="h-4 w-4 text-[#BF9B7A]" />;
    }
    if (text.includes('scrutiny') || text.includes('audit') || text.includes('error')) {
      return <FileCheck2 className="h-4 w-4 text-[#8C5B3E]" />;
    }
    return <BookOpen className="h-4 w-4 text-[#555934]" />;
  };

  // Stage badge color mapping (borderless)
  const getStageBadge = (stage?: string) => {
    switch (stage) {
      case 'FOUNDATIONAL':
        return {
          label: 'Foundational',
          classes: 'bg-[#555934]/12 text-[#555934]',
        };
      case 'APPLIED':
        return {
          label: 'Applied Practice',
          classes: 'bg-[#BF9B7A]/20 text-[#593E2E]',
        };
      case 'CAPSTONE':
        return {
          label: 'Capstone Mastery',
          classes: 'bg-[#8C5B3E]/12 text-[#8C5B3E]',
        };
      default:
        return {
          label: 'Specialized',
          classes: 'bg-[#E8DACB] text-[#705849]',
        };
    }
  };

  const stageBadge = getStageBadge(course.stage);

  // In-Progress compact variant
  if (variant === 'in-progress') {
    const progress = course.progress ?? 45;
    return (
      <div
        className={`group relative rounded-2xl bg-white p-5 shadow-card transition-all duration-200 hover:shadow-card-hover ${className}`}
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#555934]/10">
              {getDomainIcon(course.title, course.domain)}
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#555934]">
                In Progress
              </span>
              <h4 className="text-sm font-semibold text-[#2d1f17] line-clamp-1 group-hover:text-[#555934] transition-colors">
                {course.title}
              </h4>
            </div>
          </div>
          <span className="font-mono text-xs font-bold text-[#2d1f17] bg-[#E8DACB]/60 px-2 py-0.5 rounded-full">
            {progress}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 mb-3.5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#E8DACB]">
            <div
              className="h-full rounded-full bg-[#555934] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#705849]">
            <span>{course.currentModule || 'Module 3 of 6: GPS & Validation'}</span>
            <span>{course.duration}</span>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="flex items-center justify-between pt-3">
          <span className="text-[11px] text-[#705849] flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#555934] animate-pulse" />
            iGOT Karmayogi
          </span>
          <a
            href={course.iGotLink || 'https://igotkarmayogi.gov.in'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#555934] hover:text-[#3e4225] transition-colors"
          >
            Resume Learning
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    );
  }

  // Standard full-fidelity card
  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl bg-white p-6 shadow-card transition-all duration-200 hover:shadow-card-hover ${className}`}
    >
      <div>
        {/* Top Badges & Stage */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${stageBadge.classes}`}
            >
              <Layers className="h-3 w-3" />
              {stageBadge.label}
            </span>
            <ProvenanceBadge provenance="SYNTHETIC_DEMO_DATA" showLabel={false} size="sm" />
          </div>

          <div className="flex items-center gap-1 text-xs text-[#705849]">
            <Clock className="h-3 w-3 text-[#705849]" />
            <span className="font-mono text-[11px]">{course.duration}</span>
          </div>
        </div>

        {/* Header & Title */}
        <div className="mb-2.5">
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#555934]/10">
              {getDomainIcon(course.title, course.domain)}
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#2d1f17] leading-snug group-hover:text-[#555934] transition-colors">
                {course.title}
              </h3>
              <p className="text-xs text-[#705849] mt-0.5">{course.provider}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-[#705849] leading-relaxed mb-3 line-clamp-2">
          {course.description}
        </p>

        {/* Explainability Callout (Why Recommended) */}
        {course.whyRecommended && (
          <div className="mb-3.5 rounded-xl bg-[#555934]/8 px-3.5 py-2.5 text-[11px] text-[#555934]">
            <div className="flex items-start gap-1.5">
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#555934] mt-0.5" />
              <p className="leading-tight">
                <span className="font-semibold">Why this course: </span>
                {course.whyRecommended}
              </p>
            </div>
          </div>
        )}

        {/* Competencies Targeted */}
        <div className="mb-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#705849] mb-1.5">
            Target Competency
          </p>
          <div className="flex flex-wrap gap-1.5">
            {course.targetCompetencies.map((comp, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 rounded-full bg-[#F2E6D8] px-2.5 py-0.5 text-[11px] font-medium text-[#2d1f17]"
              >
                <CheckCircle2 className="h-2.5 w-2.5 text-[#555934]" />
                {comp}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer / CTAs */}
      <div className="pt-3 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[11px] text-[#705849]">
          {course.rating && (
            <span className="flex items-center gap-1 font-mono font-medium text-[#2d1f17]">
              <Star className="h-3 w-3 fill-[#BF9B7A] text-[#BF9B7A]" />
              {course.rating.toFixed(1)}
            </span>
          )}
          {course.enrolledCount && (
            <span className="flex items-center gap-1 font-mono text-[#705849]">
              <Users className="h-3 w-3" />
              {course.enrolledCount.toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <a
            href={course.iGotLink || 'https://igotkarmayogi.gov.in'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#555934] px-4 py-2 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-[#3e4225] hover:shadow-sm"
          >
            Start Learning
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
