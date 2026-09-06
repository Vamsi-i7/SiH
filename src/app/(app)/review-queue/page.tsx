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
      'Record Casualty Code 4 in Schedule 0.0 and notify supervisor for replacement assignment',
      'Arbitrarily pick the next household on the lane without documentation',
      'Leave the survey incomplete and proceed to the next village',
      'Mark the household as temporarily absent and revisit 3 times',
    ],
    optionsHi: [
      'अनुसूची 0.0 में कैजुअल्टी कोड 4 रिकॉर्ड करें और प्रतिस्थापन कार्य के लिए पर्यवेक्षक को सूचित करें',
      'बिना दस्तावेज़ीकरण के लेन के अगले घर को मनमाने ढंग से चुनें',
      'सर्वेक्षण अधूरा छोड़ें और अगले गाँव की ओर बढ़ें',
      'परिवार को अस्थायी रूप से अनुपस्थित के रूप में चिह्नित करें और 3 बार दोबारा जाएँ',
    ],
    correctIndex: 0,
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
      'Schedule 1.0 (Consumer Expenditure Schedule)',
      'Schedule 10.0 (Employment-Unemployment Schedule)',
      'Schedule 2.1 (Enterprise Survey Schedule)',
      'Schedule 0.0 (List of Households and Village Demarcation)',
    ],
    optionsHi: [
      'अनुसूची 1.0 (उपभोक्ता व्यय अनुसूची)',
      'अनुसूची 10.0 (रोजगार-बेरोजगारी अनुसूची)',
      'अनुसूची 2.1 (उद्यम सर्वेक्षण अनुसूची)',
      'अनुसूची 0.0 (परिवारों की सूची और ग्राम सीमांकन)',
    ],
    correctIndex: 0,
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
    <div className="space-y-6 max-w-6xl mx-auto py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              NSSTA Faculty Portal
            </span>
            <span className="text-xs text-stone-500">• Clause 4.3 Human-in-the-Loop Verification</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Faculty Review & Calibration Queue</h1>
          <p className="text-sm text-stone-600">
            NSSTA faculty portal to audit, calibrate, and approve consensus-generated items before live deployment.
          </p>
        </div>
        <ProvenanceBadge provenance="VERIFIED_OFFICIAL" />
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-xs">
          <span className="text-[11px] font-semibold text-stone-500 block uppercase">Pending Review</span>
          <span className="text-xl font-bold text-amber-700">{pendingCount}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-xs">
          <span className="text-[11px] font-semibold text-stone-500 block uppercase">Faculty Approved</span>
          <span className="text-xl font-bold text-blue-700">{approvedCount}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-xs">
          <span className="text-[11px] font-semibold text-stone-500 block uppercase">Active In Bank</span>
          <span className="text-xl font-bold text-emerald-700">{publishedCount}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-xs">
          <span className="text-[11px] font-semibold text-stone-500 block uppercase">Avg Consensus</span>
          <span className="text-xl font-bold text-stone-900">96.4%</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3 border-b border-stone-200 pb-2">
        <div className="flex items-center gap-1.5">
          {(['ALL', 'PENDING', 'APPROVED', 'PUBLISHED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                filter === tab
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tab === 'ALL' ? 'All Items' : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <span className="text-xs text-stone-500">
          Showing {filteredItems.length} of {items.length} items
        </span>
      </div>

      {/* Toast */}
      {publishedToast && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs rounded-xl flex items-center gap-2 shadow-xs animate-in fade-in-50">
          <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{publishedToast}</span>
        </div>
      )}

      {/* Review List */}
      <div className="space-y-5">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-stone-200 text-stone-500">
            <Layers className="h-8 w-8 mx-auto mb-2 text-stone-400" />
            <p className="text-sm font-semibold">No items match the selected filter.</p>
            <p className="text-xs text-stone-400 mt-1">Generate new items from the MCQ Generator or select another tab.</p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const lang = activeLang[item.id] || 'en';
            return (
              <Card key={item.id} className="border-stone-200 bg-white shadow-xs hover:border-stone-300 transition">
                <CardHeader className="border-b border-stone-100 pb-3 bg-stone-50/40">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-800 border border-stone-200">
                          {item.competency}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                          Consensus: {(item.consensusScore * 100).toFixed(0)}%
                        </span>

                        {item.status === 'PENDING' && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-300">
                            Pending Audit
                          </span>
                        )}
                        {item.status === 'APPROVED' && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-300 flex items-center gap-1">
                            <Check className="h-3 w-3" /> Faculty Approved
                          </span>
                        )}
                        {item.status === 'PUBLISHED' && (
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                            <FileCheck className="h-3 w-3" /> Live in Question Pool
                          </span>
                        )}
                        {item.status === 'REJECTED' && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">
                            Rejected
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-400 mt-1">
                        Item ID: <strong className="font-mono text-stone-600">{item.id}</strong>
                        {item.sourceDoc && <> • Grounded in: <span className="text-stone-600">{item.sourceDoc}</span></>}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleLanguage(item.id)}
                      className="text-xs px-3 py-1 font-semibold rounded-lg border border-stone-200 bg-white hover:bg-stone-50 transition text-stone-700 self-start sm:self-auto shadow-2xs"
                    >
                      View in: <strong>{lang === 'en' ? 'हिन्दी (Hindi)' : 'English'}</strong>
                    </button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-4">
                  {/* Stem */}
                  <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
                    <h3 className="text-sm font-semibold text-stone-900 leading-relaxed">
                      {lang === 'en' ? item.stem : item.stemHi}
                    </h3>
                  </div>

                  {/* Choices */}
                  <div className="space-y-2">
                    {(lang === 'en' ? item.options : item.optionsHi).map((opt, idx) => {
                      const isCorrect = idx === item.correctIndex;
                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg border text-xs sm:text-sm flex items-center justify-between ${
                            isCorrect
                              ? 'border-emerald-300 bg-emerald-50/60 text-emerald-950 font-medium'
                              : 'border-stone-200 bg-white text-stone-700'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                              isCorrect ? 'bg-emerald-700 text-white' : 'bg-stone-100 text-stone-700'
                            }`}>
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span>{opt}</span>
                          </span>
                          {isCorrect && (
                            <span className="text-[11px] font-bold text-emerald-700 shrink-0 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-300">
                              Official Answer Key
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Grounding Reference */}
                  <div className="flex items-center gap-2 text-xs text-stone-600 bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/70">
                    <BookOpen className="h-4 w-4 text-amber-700 shrink-0" />
                    <span>
                      <strong className="text-amber-950">MoSPI Citation Grounding:</strong> {item.citation}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100">
                    <div className="text-[11px] text-stone-400">
                      Audit Trail: Multi-Model Consensus $\rightarrow$ Faculty Sign-off
                    </div>

                    <div className="flex items-center gap-2.5">
                      {item.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleAction(item.id, 'REJECTED')}
                            className="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 text-xs font-semibold hover:bg-rose-100 transition flex items-center gap-1.5"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Reject Item
                          </button>
                          <button
                            onClick={() => handleAction(item.id, 'APPROVED')}
                            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                            Approve Item
                          </button>
                        </>
                      )}

                      {item.status === 'APPROVED' && (
                        <button
                          onClick={() => handlePublish(item.id)}
                          className="px-4 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                        >
                          <UploadCloud className="h-3.5 w-3.5" />
                          Publish to Live Question Bank
                        </button>
                      )}

                      {item.status === 'PUBLISHED' && (
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-700" />
                          Active in MoSPI Assessment Engine
                        </span>
                      )}

                      {item.status === 'REJECTED' && (
                        <button
                          onClick={() => handleAction(item.id, 'PENDING')}
                          className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100 transition"
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
