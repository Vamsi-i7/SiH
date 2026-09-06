'use client';

import React, { useState } from 'react';
import { Check, X, Edit3, ShieldAlert, Sparkles, BookOpen, ArrowRight, ArrowLeft, BarChart3 } from 'lucide-react';
import type { ItemAnalysisData } from './modals/ItemAnalysisModal';

interface QuestionItem {
  id: string;
  stem: string;
  options: string[];
  correctIndex: number;
  confidence: number;
  competencyTag: string;
  sourceDoc: string;
  section: string;
  status: 'pending' | 'approved' | 'rejected';
}

const INITIAL_QUEUE: QuestionItem[] = [
  {
    id: 'q-review-101',
    stem: 'When the estimated population of an allocated rural First Stage Unit (FSU) exceeds 1,200 persons during Schedule 0.0 listing, what is the statutory minimum number of hamlet-groups to be formed?',
    options: [
      '2 equal hamlet-groups with approximately equal population',
      '3 or more hamlet-groups formed according to Annexure 2.1 population brackets',
      'Hamlet-group formation is optional if census enumeration blocks are pre-marked',
      'Subdivide the village into 4 arbitrary quadrats regardless of population',
    ],
    correctIndex: 1,
    confidence: 68,
    competencyTag: 'comp-demarcation (Census Boundary Demarcation)',
    sourceDoc: 'MoSPI Schedule 0.0 Field Handbook 2026',
    section: 'Section 4.12: Hamlet-Group Formation Rules',
    status: 'pending',
  },
  {
    id: 'q-review-102',
    stem: 'Under CAPI protocol ASHE-2026, what action must an investigator take when the tablet GPS geofencing accuracy error exceeds 25 meters during household listing?',
    options: [
      'Manually override the GPS lock and proceed with immediate interview',
      'Wait for satellite lock under open sky for at least 3 minutes, then record reference landmark coordinates',
      'Skip the GPS coordinates column and complete the interview on paper schedule',
      'Re-boot the Android tablet into factory recovery mode',
    ],
    correctIndex: 1,
    confidence: 74,
    competencyTag: 'comp-capi (CAPI Tablet Operations)',
    sourceDoc: 'ASHE & CAPI Tablet Operational Manual',
    section: 'Section 2.4: GPS Precision Fallback Criteria',
    status: 'pending',
  },
  {
    id: 'q-review-103',
    stem: 'In Periodic Labour Force Survey (PLFS) Schedule 10.4, an unpaid family member assisting in a household shop for 2 hours daily with no wages is classified under which Usual Principal Activity Status (UPAS)?',
    options: [
      'Code 11: Self-employed own account worker',
      'Code 21: Helper in household enterprise (unpaid family worker)',
      'Code 81: Out of labour force (attending domestic duties)',
      'Code 91: Unemployed seeking work',
    ],
    correctIndex: 1,
    confidence: 82,
    competencyTag: 'comp-nsso (NSSO Standard Protocols & PLFS)',
    sourceDoc: 'PLFS Instructions to Field Staff Vol. 1',
    section: 'Section 3.2: UPAS & Subsidiary Activity Status Classification',
    status: 'pending',
  },
];

interface TrainerReviewTriageCardProps {
  onInspectItem?: (item: ItemAnalysisData) => void;
}

export function TrainerReviewTriageCard({ onInspectItem }: TrainerReviewTriageCardProps) {
  const [queue, setQueue] = useState<QuestionItem[]>(INITIAL_QUEUE);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedStem, setEditedStem] = useState('');

  const currentItem = queue[currentIndex];
  const pendingCount = queue.filter((q) => q.status === 'pending').length;

  const handleApprove = (id: string) => {
    setQueue((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: 'approved' } : q))
    );
    if (currentIndex < queue.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleReject = (id: string) => {
    setQueue((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: 'rejected' } : q))
    );
    if (currentIndex < queue.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleStartEdit = () => {
    if (!currentItem) return;
    setEditedStem(currentItem.stem);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!currentItem) return;
    setQueue((prev) =>
      prev.map((q) => (q.id === currentItem.id ? { ...q, stem: editedStem } : q))
    );
    setIsEditing(false);
  };

  const currentAnalysisData: ItemAnalysisData | null = currentItem
    ? {
        id: currentItem.id,
        stem: currentItem.stem,
        options: currentItem.options,
        correctIndex: currentItem.correctIndex,
        discriminationIndex: 0.44,
        facilityIndex: currentItem.confidence / 100,
        distractorPercentages: [14, 68, 12, 6],
        totalResponses: 420,
        competencyTag: currentItem.competencyTag,
        sourceDoc: currentItem.sourceDoc,
        section: currentItem.section,
        sourceSnippet: `Statutory operational instructions from ${currentItem.sourceDoc} governing ${currentItem.competencyTag}.`,
        status: currentItem.status,
      }
    : null;

  return (
    <div className="rounded-3xl bg-[#2d1f17] text-white p-6 sm:p-7 shadow-md border border-[#BF9B7A]/20 flex flex-col justify-between">
      <div>
        {/* Top Header Pill & Counter */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F8C858]/20 text-[#F8C858] border border-[#F8C858]/30">
              <Sparkles className="h-3.5 w-3.5" />
              Question Review & QA Triage
            </span>
            <span className="text-xs font-mono text-[#FAF6F0]/70">
              ({currentIndex + 1} of {queue.length})
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold">
              {pendingCount} Pending QA
            </span>
          </div>
        </div>

        {/* Card Content */}
        {currentItem ? (
          <div className="mt-5 space-y-4">
            {/* Metadata Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold font-mono ${
                  currentItem.confidence < 70
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                <ShieldAlert className="h-3 w-3" />
                Confidence: {currentItem.confidence}%
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-white/10 text-[#FAF6F0]/80">
                {currentItem.competencyTag}
              </span>
              <span className="text-[11px] text-[#FAF6F0]/60 flex items-center gap-1 ml-auto">
                <BookOpen className="h-3 w-3" />
                {currentItem.sourceDoc} • {currentItem.section}
              </span>
            </div>

            {/* Question Stem */}
            <div className="mt-3">
              {isEditing ? (
                <div className="space-y-2">
                  <textarea
                    value={editedStem}
                    onChange={(e) => setEditedStem(e.target.value)}
                    className="w-full h-24 p-3 rounded-xl bg-white/10 border border-white/20 text-sm text-[#FAF6F0] font-medium focus:outline-none focus:ring-2 focus:ring-[#F8C858]"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1 rounded-lg bg-white/10 text-xs font-semibold hover:bg-white/20 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveEdit}
                      className="px-3 py-1 rounded-lg bg-[#F8C858] text-[#2d1f17] text-xs font-bold hover:bg-[#e6b94e] cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative group">
                  <p className="text-sm sm:text-base font-medium text-[#FAF6F0] leading-relaxed">
                    {currentItem.stem}
                  </p>
                  <button
                    type="button"
                    onClick={handleStartEdit}
                    className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-white/10 text-xs text-[#FAF6F0] hover:bg-white/20 transition-opacity cursor-pointer"
                    title="Edit question text"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Options List */}
            <div className="mt-4 space-y-2">
              {currentItem.options.map((option, optIdx) => {
                const isCorrect = optIdx === currentItem.correctIndex;
                return (
                  <div
                    key={optIdx}
                    className={`p-3 rounded-xl border text-xs font-medium flex items-start gap-2.5 transition-all ${
                      isCorrect
                        ? 'bg-emerald-900/30 border-emerald-500/40 text-emerald-200'
                        : 'bg-white/5 border-white/10 text-[#FAF6F0]/80'
                    }`}
                  >
                    <span
                      className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold font-mono ${
                        isCorrect
                          ? 'bg-emerald-500 text-[#2d1f17]'
                          : 'bg-white/10 text-[#FAF6F0]/70'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="flex-1 leading-snug">{option}</span>
                    {isCorrect && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 shrink-0">
                        AI Target Answer
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>

      {/* Action Bar & Deck Controls */}
      <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Pagination Prev/Next */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            title="Previous question"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={currentIndex === queue.length - 1}
            onClick={() => setCurrentIndex((prev) => Math.min(queue.length - 1, prev + 1))}
            className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            title="Next question"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
          <span className="text-xs text-[#FAF6F0]/70 font-mono ml-2">
            Status:{' '}
            <strong
              className={`uppercase ${
                currentItem?.status === 'approved'
                  ? 'text-emerald-400'
                  : currentItem?.status === 'rejected'
                    ? 'text-red-400'
                    : 'text-amber-400'
              }`}
            >
              {currentItem?.status}
            </strong>
          </span>
        </div>

        {/* Triage Buttons: Reject vs Approve */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {onInspectItem && currentAnalysisData && (
            <button
              type="button"
              onClick={() => onInspectItem(currentAnalysisData)}
              className="px-3.5 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <BarChart3 className="h-3.5 w-3.5 text-[#F8C858]" />
              <span>Psychometrics</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => currentItem && handleReject(currentItem.id)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold hover:bg-red-500/30 transition-colors cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
            <span>Reject</span>
          </button>
          <button
            type="button"
            onClick={() => currentItem && handleApprove(currentItem.id)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-colors shadow-xs cursor-pointer"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Approve for Bank</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TrainerReviewTriageCard;
