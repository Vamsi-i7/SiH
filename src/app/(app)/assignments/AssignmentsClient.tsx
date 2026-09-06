'use client';

/**
 * src/app/(app)/assignments/AssignmentsClient.tsx
 *
 * Lists all available assessments as cards.
 * Visual language mirrors PathwaysClient card grid.
 */

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { getAssessmentMetas } from '@/data/assessments';
import { ClipboardCheck, Clock, BookOpen, ChevronRight } from 'lucide-react';

const iconByIndex = [
  '📱', // CAPI Operations
  '🗺️', // Schedule 0.0 & UFS Demarcation
  '📊', // PLFS Survey
  '📋', // Statistical Scrutiny
  '🧩', // Problem Solving
  '🔍', // Critical Thinking
  '💬', // Communication
  '⚖️', // Decision Making
];

const accentByIndex = [
  { border: 'border-[#1b365d]/30', bg: 'bg-[#1b365d]/5', badge: 'bg-[#1b365d]/10 text-[#1b365d]', btn: 'bg-[#1b365d] hover:bg-[#132742]' },
  { border: 'border-[#c9963a]/30', bg: 'bg-[#c9963a]/5', badge: 'bg-[#c9963a]/10 text-[#c9963a]', btn: 'bg-[#c9963a] hover:bg-[#a77930]' },
  { border: 'border-[#5b7fa6]/30', bg: 'bg-[#5b7fa6]/5', badge: 'bg-[#5b7fa6]/10 text-[#5b7fa6]', btn: 'bg-[#5b7fa6] hover:bg-[#486786]' },
  { border: 'border-[#8b9a6e]/30', bg: 'bg-[#8b9a6e]/5', badge: 'bg-[#8b9a6e]/10 text-[#8b9a6e]', btn: 'bg-[#8b9a6e] hover:bg-[#6e7d56]' },
  { border: 'border-[#a05c9a]/30', bg: 'bg-[#a05c9a]/5', badge: 'bg-[#a05c9a]/10 text-[#a05c9a]', btn: 'bg-[#a05c9a] hover:bg-[#7d477a]' },
];

export default function AssignmentsClient() {
  const router = useRouter();
  const t = useTranslations();
  const metas = getAssessmentMetas();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          {t('nav.assessment')}
        </h1>
        <p className="text-muted-foreground">
          Select an assessment below. Each test has its own timer that begins only after you click &quot;Start Test&quot;.
        </p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Available Tests', value: metas.length.toString() },
          { label: 'Questions Each', value: '10' },
          { label: 'Time Limit', value: '5-10 min' },
          { label: 'Question Type', value: 'MCQ' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-white p-4 shadow-sm text-center"
          >
            <p className="text-2xl font-bold text-foreground font-mono">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Assessment Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Available Assessments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {metas.map((meta, idx) => {
            const accent = accentByIndex[idx % accentByIndex.length];
            const durationMins = Math.round(meta.durationSeconds / 60);

            return (
              <div
                key={meta.id}
                className={`rounded-xl border p-6 transition-all hover:shadow-md group ${accent.border} ${accent.bg}`}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl" role="img" aria-label={meta.title}>
                        {iconByIndex[idx % iconByIndex.length]}
                      </span>
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {meta.title}
                      </h3>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${accent.badge}`}>
                      <ClipboardCheck className="w-3 h-3" />
                      {meta.type}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  {meta.description}
                </p>

                {/* Meta Pills */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    <span className="font-medium text-foreground">{meta.totalQuestions}</span> Questions
                  </span>
                  <span className="text-border">•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium text-foreground">{durationMins}</span> Minutes
                  </span>
                </div>

                {/* CTA */}
                <button
                  id={`take-assessment-${meta.id}`}
                  onClick={() => router.push(`/assessment/${meta.id}/instructions`)}
                  className={`w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-semibold transition-colors ${accent.btn}`}
                >
                  Take Assessment
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer note */}
      <div className="rounded-lg border border-border bg-secondary/40 px-5 py-4 text-sm text-muted-foreground">
        <p>
          <strong className="text-foreground">Note:</strong> The timer for each assessment begins only after you read the instructions and click <em>Start Test</em>. You can review your answers before final submission.
        </p>
      </div>
    </div>
  );
}
