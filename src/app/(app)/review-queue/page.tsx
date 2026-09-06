'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { ProvenanceBadge } from '@/components/ProvenanceBadge';
import { CheckCircle, XCircle, BookOpen, Check, UploadCloud, FileCheck, Layers } from 'lucide-react';

interface ReviewItem {
  id: string;
  competency: string;
  stem: string;
  stemHi: string;
  options: string[];
  optionsHi: string[];
  correctIndex: number;
  citation: string;
  consensusScore: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PUBLISHED';
  sourceDoc?: string;
  createdAt?: string;
}

const DEFAULT_ITEMS: ReviewItem[] = [
  {
    id: 'rq-101',
    competency: 'CAPI Tablet Operation',
    stem: 'What is the required procedure when a sample household has permanently migrated from the sample village?',
    stemHi: 'जब कोई नमूना परिवार नमूना गांव से स्थायी रूप से स्थानांतरित हो गया हो तो आवश्यक प्रक्रिया क्या है?',
    options: [
      'Arbitrarily pick the next household on the lane without documentation',
      'Record Casualty Code 4 in Schedule 0.0 and notify supervisor for replacement assignment',
      'Leave the survey incomplete and proceed to the next village',
      'Mark the household as temporarily absent and revisit 3 times',
    ],
    optionsHi: [
      'बिना दस्तावेज़ीकरण के लेन के अगले घर को मनमाने ढंग से चुनें',
      'अनुसूची 0.0 में कैजुअल्टी कोड 4 रिकॉर्ड करें और प्रतिस्थापन कार्य के लिए पर्यवेक्षक को सूचित करें',
      'सर्वेक्षण अधूरा छोड़ें और अगले गाँव की ओर बढ़ें',
      'परिवार को अस्थायी रूप से अनुपस्थित के रूप में चिह्नित करें और 3 बार दोबारा जाएँ',
    ],
    correctIndex: 1,
    citation: 'PLFS Field Manual 2024, Section 3.2.1: Household Non-Response Coding',
    consensusScore: 0.96,
    status: 'PENDING',
    sourceDoc: 'Periodic Labour Force Survey (PLFS) — Field Staff Manual 2024-25',
  },
  {
    id: 'rq-102',
    competency: 'NSSO Protocol Mastery',
    stem: 'Which schedule is specifically utilized for recording household consumer expenditure details in the current round?',
    stemHi: 'वर्तमान दौर में घरेलू उपभोक्ता व्यय विवरण दर्ज करने के लिए विशेष रूप से किस अनुसूची का उपयोग किया जाता है?',
    options: [
      'Schedule 0.0 (List of Households and Village Demarcation)',
      'Schedule 10.0 (Employment-Unemployment Schedule)',
      'Schedule 1.0 (Consumer Expenditure Schedule)',
      'Schedule 2.1 (Enterprise Survey Schedule)',
    ],
    optionsHi: [
      'अनुसूची 0.0 (परिवारों की सूची और ग्राम सीमांकन)',
      'अनुसूची 10.0 (रोजगार-बेरोजगारी अनुसूची)',
      'अनुसूची 1.0 (उपभोक्ता व्यय अनुसूची)',
      'अनुसूची 2.1 (उद्यम सर्वेक्षण अनुसूची)',
    ],
    correctIndex: 2,
    citation: 'NSS 80th Round Reference Guide, Chapter 1: Introduction to Survey Schedules',
    consensusScore: 0.98,
    status: 'APPROVED',
    sourceDoc: 'NSSO FOD Operational Guidelines & Village Cadastral Scrutiny (Vol. 1)',
  },
];

function getInitialReviewItems(): ReviewItem[] {
  if (typeof window === 'undefined') return DEFAULT_ITEMS;
  try {
    const stored = localStorage.getItem('statvidya_review_queue');
    if (stored) {
      const parsed: ReviewItem[] = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const merged = [...parsed];
        for (const d of DEFAULT_ITEMS) {
          if (!merged.some((m) => m.id === d.id)) {
            merged.push(d);
          }
        }
        return merged;
      }
    }
    localStorage.setItem('statvidya_review_queue', JSON.stringify(DEFAULT_ITEMS));
  } catch (e) {
    console.error('Error hydrating review queue:', e);
  }
  return DEFAULT_ITEMS;
}

export default function ReviewQueuePage() {
  const [items, setItems] = useState<ReviewItem[]>(getInitialReviewItems);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'PUBLISHED'>('ALL');
  const [activeLang, setActiveLang] = useState<Record<string, 'en' | 'hi'>>({
    'rq-101': 'en',
    'rq-102': 'en',
  });
  const [publishedToast, setPublishedToast] = useState<string | null>(null);

  const saveItems = (updated: ReviewItem[]) => {
    setItems(updated);
    try {
      localStorage.setItem('statvidya_review_queue', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to persist review queue:', e);
    }
  };

  const handleAction = (id: string, newStatus: 'PENDING' | 'APPROVED' | 'REJECTED') => {
    const updated = items.map((item) => (item.id === id ? { ...item, status: newStatus } : item));
    saveItems(updated);
  };

  const handlePublish = (id: string) => {
    const target = items.find((i) => i.id === id);
    const updated = items.map((item) =>
      item.id === id ? { ...item, status: 'PUBLISHED' as const } : item
    );
    saveItems(updated);

    // Also persist into live question pool
    try {
      const bankRaw = localStorage.getItem('statvidya_live_question_bank');
      const bank = bankRaw ? JSON.parse(bankRaw) : [];
      if (target) {
        localStorage.setItem(
          'statvidya_live_question_bank',
          JSON.stringify([target, ...bank.filter((b: { id: string }) => b.id !== target.id)])
        );
      }
    } catch (err) {
      console.error('Failed to sync to live bank:', err);
    }

    setPublishedToast(`Item ${id} successfully published to MoSPI Live Question Pool! Candidates can now be evaluated on this item.`);
    setTimeout(() => setPublishedToast(null), 5000);
  };

  const toggleLanguage = (id: string) => {
    setActiveLang((prev) => ({
      ...prev,
      [id]: prev[id] === 'en' ? 'hi' : 'en',
    }));
  };

  const filteredItems = items.filter((item) => {
    if (filter === 'ALL') return true;
    return item.status === filter;
  });

  const pendingCount = items.filter((i) => i.status === 'PENDING').length;
  const approvedCount = items.filter((i) => i.status === 'APPROVED').length;
  const publishedCount = items.filter((i) => i.status === 'PUBLISHED').length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-4">
      {/* Header */}
      <div className="rounded-2xl bg-white p-7 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#555934]/12 text-[#555934]">
                NSSTA Faculty Portal
              </span>
              <span className="text-xs text-[#705849]">• Clause 4.3 Human-in-the-Loop Verification</span>
            </div>
            <h1 className="text-2xl font-bold text-[#2d1f17] tracking-tight">Faculty Review & Calibration Queue</h1>
            <p className="text-sm text-[#705849] mt-0.5">
              NSSTA faculty portal to audit, calibrate, and approve consensus-generated items before live deployment.
            </p>
          </div>
          <ProvenanceBadge provenance="VERIFIED_OFFICIAL" />
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white shadow-card">
          <span className="text-[11px] font-semibold text-[#705849] block uppercase tracking-wider">Pending Review</span>
          <span className="text-2xl font-bold text-[#8C5B3E] font-mono mt-1 block">{pendingCount}</span>
        </div>
        <div className="p-5 rounded-2xl bg-white shadow-card">
          <span className="text-[11px] font-semibold text-[#705849] block uppercase tracking-wider">Faculty Approved</span>
          <span className="text-2xl font-bold text-[#555934] font-mono mt-1 block">{approvedCount}</span>
        </div>
        <div className="p-5 rounded-2xl bg-white shadow-card">
          <span className="text-[11px] font-semibold text-[#705849] block uppercase tracking-wider">Active In Bank</span>
          <span className="text-2xl font-bold text-[#593E2E] font-mono mt-1 block">{publishedCount}</span>
        </div>
        <div className="p-5 rounded-2xl bg-white shadow-card">
          <span className="text-[11px] font-semibold text-[#705849] block uppercase tracking-wider">Avg Consensus</span>
          <span className="text-2xl font-bold text-[#2d1f17] font-mono mt-1 block">96.4%</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2">
          {(['ALL', 'PENDING', 'APPROVED', 'PUBLISHED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition ${
                filter === tab
                  ? 'bg-[#555934] text-white shadow-sm'
                  : 'bg-[#F2E6D8]/50 text-[#705849] hover:bg-[#F2E6D8] hover:text-[#2d1f17]'
              }`}
            >
              {tab === 'ALL' ? 'All Items' : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <span className="text-xs text-[#705849] font-medium">
          Showing {filteredItems.length} of {items.length} items
        </span>
      </div>

      {/* Toast */}
      {publishedToast && (
        <div className="p-4 bg-[#555934]/15 text-[#2d1f17] text-xs font-medium rounded-2xl flex items-center gap-2.5 shadow-sm animate-in fade-in-50">
          <CheckCircle className="h-4 w-4 text-[#555934] shrink-0" />
          <span>{publishedToast}</span>
        </div>
      )}

      {/* Review List */}
      <div className="space-y-6">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl shadow-card text-[#705849]">
            <Layers className="h-8 w-8 mx-auto mb-2 text-[#BF9B7A]" />
            <p className="text-sm font-semibold text-[#2d1f17]">No items match the selected filter.</p>
            <p className="text-xs text-[#705849] mt-1">Generate new items from the MCQ Generator or select another tab.</p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const lang = activeLang[item.id] || 'en';
            return (
              <Card key={item.id} className="rounded-2xl bg-white shadow-card transition-all">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#F2E6D8] text-[#593E2E]">
                          {item.competency}
                        </span>
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#555934]/12 text-[#555934]">
                          Consensus: {(item.consensusScore * 100).toFixed(0)}%
                        </span>

                        {item.status === 'PENDING' && (
                          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#BF9B7A]/20 text-[#593E2E]">
                            Pending Audit
                          </span>
                        )}
                        {item.status === 'APPROVED' && (
                          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#555934]/15 text-[#555934] flex items-center gap-1">
                            <Check className="h-3 w-3" /> Faculty Approved
                          </span>
                        )}
                        {item.status === 'PUBLISHED' && (
                          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#555934] text-white flex items-center gap-1 shadow-2xs">
                            <FileCheck className="h-3 w-3" /> Live in Question Pool
                          </span>
                        )}
                        {item.status === 'REJECTED' && (
                          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#8C5B3E]/20 text-[#8C5B3E]">
                            Rejected
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#705849] font-mono mt-2">
                        Item ID: <strong className="text-[#2d1f17]">{item.id}</strong>
                        {item.sourceDoc && <> • Grounded in: <span className="text-[#2d1f17] font-sans font-medium">{item.sourceDoc}</span></>}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleLanguage(item.id)}
                      className="text-xs px-3.5 py-1.5 font-semibold rounded-xl bg-[#F2E6D8]/60 hover:bg-[#E8DACB] transition text-[#2d1f17] self-start sm:self-auto"
                    >
                      View in: <strong>{lang === 'en' ? 'हिन्दी (Hindi)' : 'English'}</strong>
                    </button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-1">
                  {/* Stem */}
                  <div className="p-4 rounded-xl bg-[#F2E6D8]/30">
                    <h3 className="text-base font-semibold text-[#2d1f17] leading-relaxed">
                      {lang === 'en' ? item.stem : item.stemHi}
                    </h3>
                  </div>

                  {/* Choices */}
                  <div className="space-y-2.5">
                    {(lang === 'en' ? item.options : item.optionsHi).map((opt, idx) => {
                      const isCorrect = idx === item.correctIndex;
                      return (
                        <div
                          key={idx}
                          className={`p-4 rounded-xl text-sm flex items-center justify-between transition-all ${
                            isCorrect
                              ? 'bg-[#555934]/12 text-[#2d1f17] font-medium shadow-2xs'
                              : 'bg-[#F2E6D8]/30 hover:bg-[#F2E6D8]/60 text-[#2d1f17]'
                          }`}
                        >
                          <span className="flex items-center gap-3 pr-4 leading-snug">
                            <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                              isCorrect ? 'bg-[#555934] text-white' : 'bg-[#E8DACB] text-[#593E2E]'
                            }`}>
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span>{opt}</span>
                          </span>
                          {isCorrect && (
                            <span className="text-[11px] font-semibold text-white bg-[#555934] px-3 py-1 rounded-full shrink-0 shadow-2xs">
                              Verified Answer
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Grounding Reference */}
                  <div className="flex items-center gap-2.5 text-xs text-[#705849] bg-[#F2E6D8]/40 p-3.5 rounded-xl">
                    <BookOpen className="h-4 w-4 text-[#555934] shrink-0" />
                    <span>
                      <strong className="text-[#2d1f17]">MoSPI Citation Grounding:</strong> {item.citation}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
                    <div className="text-[11px] text-[#705849]">
                      Audit Trail: Multi-Model Consensus → Faculty Sign-off
                    </div>

                    <div className="flex items-center gap-2.5">
                      {item.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleAction(item.id, 'REJECTED')}
                            className="px-4 py-2 rounded-xl bg-[#8C5B3E]/12 text-[#8C5B3E] text-xs font-semibold hover:bg-[#8C5B3E]/20 transition flex items-center gap-1.5"
                          >
                            <XCircle className="h-4 w-4" />
                            Reject Item
                          </button>
                          <button
                            onClick={() => handleAction(item.id, 'APPROVED')}
                            className="px-5 py-2 rounded-xl bg-[#555934] hover:bg-[#3e4225] text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Approve Item
                          </button>
                        </>
                      )}

                      {item.status === 'APPROVED' && (
                        <button
                          onClick={() => handlePublish(item.id)}
                          className="px-5 py-2 rounded-xl bg-[#593E2E] hover:bg-[#452f23] text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
                        >
                          <UploadCloud className="h-4 w-4" />
                          Publish to Live Question Bank
                        </button>
                      )}

                      {item.status === 'PUBLISHED' && (
                        <span className="text-xs font-semibold text-[#555934] bg-[#555934]/15 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                          <CheckCircle className="h-4 w-4 text-[#555934]" />
                          Active in MoSPI Assessment Engine
                        </span>
                      )}

                      {item.status === 'REJECTED' && (
                        <button
                          onClick={() => handleAction(item.id, 'PENDING')}
                          className="px-4 py-2 rounded-xl bg-[#F2E6D8] text-[#2d1f17] text-xs font-semibold hover:bg-[#E8DACB] transition"
                        >
                          Reopen Audit
                        </button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
