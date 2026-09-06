'use client';

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { ProvenanceBadge } from '@/components/ProvenanceBadge';
import {
  CheckCircle2,
  XCircle,
  BookOpen,
  Check,
  UploadCloud,
  FileCheck,
  Layers,
  Search,
  ChevronLeft,
  ChevronRight,
  Edit3,
  RotateCcw,
  ShieldCheck,
  Clock,
  Save,
} from 'lucide-react';

export interface ReviewItem {
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
    createdAt: '2026-03-01T10:00:00Z',
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
    createdAt: '2026-03-02T11:30:00Z',
  },
  {
    id: 'rq-103',
    competency: 'Cadastral Mapping & Listing',
    stem: 'When demarcating a hamlet group in a large sample village with over 1,200 population, what is the maximum permissible variation in estimated population across formed groups?',
    stemHi: '1,200 से अधिक आबादी वाले एक बड़े नमूना गांव में हेमलेट समूह का सीमांकन करते समय, गठित समूहों में अनुमानित जनसंख्या में अधिकतम अनुमेय अंतर क्या है?',
    options: [
      'Population across formed hamlet groups should be approximately equal and not differ by more than 20%',
      'Any random boundary demarcation is acceptable as long as physical roads separate them',
      'Hamlet groups can have arbitrary sizes ranging from 50 to 800 individuals without restriction',
      'Only households of agricultural landowners should be counted in group formation',
    ],
    optionsHi: [
      'गठित हेमलेट समूहों में जनसंख्या लगभग समान होनी चाहिए और 20% से अधिक भिन्न नहीं होनी चाहिए',
      'कोई भी मनमाना सीमा सीमांकन स्वीकार्य है जब तक कि भौतिक सड़कें उन्हें अलग करती हैं',
      'हेमलेट समूहों का आकार बिना किसी प्रतिबंध के 50 से 800 व्यक्तियों तक मनमाना हो सकता है',
      'समूह गठन में केवल कृषि भूमि स्वामियों के परिवारों की गणना की जानी चाहिए',
    ],
    correctIndex: 0,
    citation: 'NSS FOD Cadastral Demarcation Guidelines, Rule 4.2: Equal Probability Sub-sampling',
    consensusScore: 0.95,
    status: 'PENDING',
    sourceDoc: 'NSSO FOD Operational Guidelines & Village Cadastral Scrutiny (Vol. 1)',
    createdAt: '2026-03-03T14:15:00Z',
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
  const [selectedId, setSelectedId] = useState<string>(() => items[0]?.id || 'rq-101');
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'PUBLISHED' | 'REJECTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLang, setActiveLang] = useState<'en' | 'hi'>('en');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editDraft, setEditDraft] = useState<ReviewItem | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warn' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'warn' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const saveItems = (updated: ReviewItem[]) => {
    setItems(updated);
    try {
      localStorage.setItem('statvidya_review_queue', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to persist review queue:', e);
    }
  };

  // Filtered & Searched List
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesFilter = filter === 'ALL' ? true : item.status === filter;
      if (!matchesFilter) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.stem.toLowerCase().includes(q) ||
        (item.stemHi && item.stemHi.toLowerCase().includes(q)) ||
        item.competency.toLowerCase().includes(q) ||
        (item.sourceDoc && item.sourceDoc.toLowerCase().includes(q)) ||
        item.citation.toLowerCase().includes(q)
      );
    });
  }, [items, filter, searchQuery]);

  // Active Item
  const activeItem = useMemo(() => {
    return items.find((i) => i.id === selectedId) || filteredItems[0] || items[0];
  }, [items, selectedId, filteredItems]);

  const activeIndexInFiltered = filteredItems.findIndex((i) => i.id === (activeItem?.id || ''));

  // Metrics
  const pendingCount = items.filter((i) => i.status === 'PENDING').length;
  const approvedCount = items.filter((i) => i.status === 'APPROVED').length;
  const publishedCount = items.filter((i) => i.status === 'PUBLISHED').length;
  const rejectedCount = items.filter((i) => i.status === 'REJECTED').length;

  // Actions
  const handleStatusChange = (id: string, newStatus: 'PENDING' | 'APPROVED' | 'REJECTED') => {
    const updated = items.map((item) => (item.id === id ? { ...item, status: newStatus } : item));
    saveItems(updated);

    if (newStatus === 'APPROVED') {
      showToast(`Item ${id} certified and marked Approved. Ready to publish.`, 'success');
    } else if (newStatus === 'REJECTED') {
      showToast(`Item ${id} marked as Rejected.`, 'warn');
    } else {
      showToast(`Item ${id} status reset to Pending.`, 'info');
    }

    // Auto-advance to next pending item if available
    const nextPending = updated.find((i) => i.id !== id && i.status === 'PENDING');
    if (nextPending) {
      setSelectedId(nextPending.id);
    }
  };

  const handlePublish = (id: string) => {
    const target = items.find((i) => i.id === id);
    if (!target) return;

    const updated = items.map((item) =>
      item.id === id ? { ...item, status: 'PUBLISHED' as const } : item
    );
    saveItems(updated);

    // Sync to live question bank
    try {
      const bankRaw = localStorage.getItem('statvidya_live_question_bank');
      const bank = bankRaw ? JSON.parse(bankRaw) : [];
      localStorage.setItem(
        'statvidya_live_question_bank',
        JSON.stringify([target, ...bank.filter((b: { id: string }) => b.id !== target.id)])
      );
    } catch (err) {
      console.error('Failed to sync to live bank:', err);
    }

    showToast(`Published ${id} to Live Question Pool for candidate assessments.`, 'success');
  };

  const handleStartEdit = () => {
    if (!activeItem) return;
    setEditDraft({ ...activeItem, options: [...activeItem.options], optionsHi: [...activeItem.optionsHi] });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!editDraft) return;
    const updated = items.map((item) => (item.id === editDraft.id ? editDraft : item));
    saveItems(updated);
    setIsEditing(false);
    setEditDraft(null);
    showToast('Question details and citation updated successfully.', 'success');
  };

  const handleNavigateNext = () => {
    if (activeIndexInFiltered < filteredItems.length - 1) {
      setSelectedId(filteredItems[activeIndexInFiltered + 1].id);
      setIsEditing(false);
    }
  };

  const handleNavigatePrevious = () => {
    if (activeIndexInFiltered > 0) {
      setSelectedId(filteredItems[activeIndexInFiltered - 1].id);
      setIsEditing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-5 px-3 sm:px-4">
      {/* Top Executive Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#555934]/15 text-[#555934] flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              Faculty Quality Assurance
            </span>
            <span className="text-xs text-stone-500">• Question Certification Station</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Item Review & Calibration Queue
          </h1>
          <p className="text-sm text-stone-600 mt-0.5">
            Audit, refine, and certify generated question items grounded in official manuals before publishing to live evaluations.
          </p>
        </div>
        <ProvenanceBadge provenance="VERIFIED_OFFICIAL" />
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-stone-500 block uppercase tracking-wider">Pending Audit</span>
            <span className="text-2xl font-bold text-amber-700 font-mono mt-0.5 block">{pendingCount}</span>
          </div>
          <Clock className="h-6 w-6 text-amber-500/70" />
        </div>
        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-stone-500 block uppercase tracking-wider">Certified Approved</span>
            <span className="text-2xl font-bold text-[#555934] font-mono mt-0.5 block">{approvedCount}</span>
          </div>
          <CheckCircle2 className="h-6 w-6 text-[#555934]/70" />
        </div>
        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-stone-500 block uppercase tracking-wider">Live in Question Pool</span>
            <span className="text-2xl font-bold text-emerald-800 font-mono mt-0.5 block">{publishedCount}</span>
          </div>
          <UploadCloud className="h-6 w-6 text-emerald-600/70" />
        </div>
        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-stone-500 block uppercase tracking-wider">Total Items</span>
            <span className="text-2xl font-bold text-stone-900 font-mono mt-0.5 block">{items.length}</span>
          </div>
          <Layers className="h-6 w-6 text-stone-400" />
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`p-3.5 text-xs font-medium rounded-xl flex items-center gap-2.5 shadow-xs transition-all animate-in fade-in-50 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : toastMessage.type === 'warn'
              ? 'bg-amber-50 text-amber-900 border border-amber-200'
              : 'bg-stone-100 text-stone-900 border border-stone-300'
          }`}
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700" />
          <span className="flex-1">{toastMessage.text}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-stone-200 shadow-2xs">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { key: 'ALL', label: 'All', count: items.length },
              { key: 'PENDING', label: 'Pending', count: pendingCount },
              { key: 'APPROVED', label: 'Approved', count: approvedCount },
              { key: 'PUBLISHED', label: 'Live Pool', count: publishedCount },
              { key: 'REJECTED', label: 'Rejected', count: rejectedCount },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setFilter(tab.key);
                setIsEditing(false);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                filter === tab.key
                  ? 'bg-[#555934] text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  filter === tab.key ? 'bg-white/20 text-white' : 'bg-stone-200/80 text-stone-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
          <input
            type="text"
            placeholder="Search by topic, manual, or text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#555934]"
          />
        </div>
      </div>

      {/* Main Dual-Pane Triage Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Triage List (4 columns) */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-medium text-stone-500 px-1">
            <span>Question Queue ({filteredItems.length})</span>
            <span>Select item to review</span>
          </div>

          <div className="space-y-2 max-h-[720px] overflow-y-auto pr-1">
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl border border-stone-200 text-stone-500">
                <Layers className="h-6 w-6 mx-auto mb-2 text-stone-400" />
                <p className="text-xs font-semibold text-stone-800">No items match current filter</p>
                <p className="text-[11px] text-stone-500 mt-0.5">Try resetting search or switching status tabs.</p>
              </div>
            ) : (
              filteredItems.map((item) => {
                const isSelected = item.id === activeItem?.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedId(item.id);
                      setIsEditing(false);
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#555934] bg-stone-50/90 ring-1 ring-[#555934] shadow-xs'
                        : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/50 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 truncate max-w-[170px]">
                        {item.competency}
                      </span>
                      {item.status === 'PENDING' && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          Pending
                        </span>
                      )}
                      {item.status === 'APPROVED' && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <Check className="h-2.5 w-2.5" /> Approved
                        </span>
                      )}
                      {item.status === 'PUBLISHED' && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#555934] text-white flex items-center gap-1">
                          <FileCheck className="h-2.5 w-2.5" /> Live
                        </span>
                      )}
                      {item.status === 'REJECTED' && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                          Rejected
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-medium text-stone-900 line-clamp-2 leading-relaxed">
                      {item.stem}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-stone-400 mt-2.5 pt-2 border-t border-stone-100">
                      <span className="truncate max-w-[180px] text-stone-500 font-sans">
                        {item.sourceDoc || 'Official MoSPI Manual'}
                      </span>
                      <span className="font-mono text-stone-400 font-medium">
                        {(item.consensusScore * 100).toFixed(0)}% score
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Item Review & Calibration Studio (8 columns) */}
        <div className="lg:col-span-8">
          {activeItem ? (
            <Card className="border-stone-200 bg-white shadow-xs rounded-2xl overflow-hidden">
              {/* Studio Header Toolbar */}
              <CardHeader className="border-b border-stone-100 bg-stone-50/70 p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#555934]/15 text-[#555934]">
                        {activeItem.competency}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-stone-200 text-stone-700 font-mono">
                        {activeItem.id}
                      </span>
                      <span className="text-xs text-stone-500">
                        • Multi-Model Consensus: <strong>{(activeItem.consensusScore * 100).toFixed(0)}%</strong>
                      </span>
                    </div>
                    <div className="text-xs text-stone-600 font-medium truncate max-w-lg">
                      Source: {activeItem.sourceDoc || 'Official Guidelines'}
                    </div>
                  </div>

                  {/* Navigation Stepper & Language / Edit controls */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {/* Stepper counter */}
                    <div className="flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200">
                      <button
                        onClick={handleNavigatePrevious}
                        disabled={activeIndexInFiltered <= 0}
                        aria-label="Previous item"
                        className="p-1 rounded text-stone-600 hover:text-stone-900 disabled:opacity-30"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <span className="text-[11px] font-mono px-2 text-stone-600">
                        {activeIndexInFiltered + 1} of {filteredItems.length || 1}
                      </span>
                      <button
                        onClick={handleNavigateNext}
                        disabled={activeIndexInFiltered >= filteredItems.length - 1}
                        aria-label="Next item"
                        className="p-1 rounded text-stone-600 hover:text-stone-900 disabled:opacity-30"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Language Switch */}
                    <div className="flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200">
                      <button
                        onClick={() => setActiveLang('en')}
                        className={`text-[11px] font-semibold px-2 py-1 rounded transition ${
                          activeLang === 'en' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
                        }`}
                      >
                        EN
                      </button>
                      <button
                        onClick={() => setActiveLang('hi')}
                        className={`text-[11px] font-semibold px-2 py-1 rounded transition ${
                          activeLang === 'hi' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
                        }`}
                      >
                        HI
                      </button>
                    </div>

                    {/* Edit mode toggle */}
                    <button
                      onClick={() => (isEditing ? handleSaveEdit() : handleStartEdit())}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 ${
                        isEditing
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-2xs'
                          : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-300'
                      }`}
                    >
                      {isEditing ? (
                        <>
                          <Save className="h-3.5 w-3.5" /> Save Changes
                        </>
                      ) : (
                        <>
                          <Edit3 className="h-3.5 w-3.5" /> Refine Text
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </CardHeader>

              {/* Question Content Studio */}
              <CardContent className="p-5 sm:p-6 space-y-5">
                {/* Stem Section */}
                <div>
                  <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
                    Question Stem ({activeLang === 'en' ? 'English' : 'हिन्दी'})
                  </label>
                  {isEditing && editDraft ? (
                    <textarea
                      rows={3}
                      value={activeLang === 'en' ? editDraft.stem : editDraft.stemHi}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditDraft((prev) =>
                          prev
                            ? activeLang === 'en'
                              ? { ...prev, stem: val }
                              : { ...prev, stemHi: val }
                            : null
                        );
                      }}
                      className="w-full p-3 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#555934] font-medium"
                    />
                  ) : (
                    <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80">
                      <p className="text-base font-semibold text-stone-900 leading-relaxed">
                        {activeLang === 'en' ? activeItem.stem : activeItem.stemHi || activeItem.stem}
                      </p>
                    </div>
                  )}
                </div>

                {/* Multiple Choice Options */}
                <div className="space-y-2.5">
                  <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                    Response Options & Verified Answer Key
                  </label>

                  {(activeLang === 'en'
                    ? (isEditing && editDraft ? editDraft.options : activeItem.options)
                    : (isEditing && editDraft ? editDraft.optionsHi : activeItem.optionsHi || activeItem.options)
                  ).map((opt, idx) => {
                    const isCorrect = idx === (isEditing && editDraft ? editDraft.correctIndex : activeItem.correctIndex);
                    return (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border text-sm flex items-center justify-between gap-3 transition-all ${
                          isCorrect
                            ? 'border-emerald-300 bg-emerald-50/80 text-emerald-950 font-medium'
                            : 'border-stone-200 bg-white text-stone-800'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <span
                            className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                              isCorrect
                                ? 'bg-emerald-700 text-white'
                                : 'bg-stone-100 text-stone-600 border border-stone-300'
                            }`}
                          >
                            {String.fromCharCode(65 + idx)}
                          </span>

                          {isEditing && editDraft ? (
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const val = e.target.value;
                                setEditDraft((prev) => {
                                  if (!prev) return null;
                                  if (activeLang === 'en') {
                                    const nextOpts = [...prev.options];
                                    nextOpts[idx] = val;
                                    return { ...prev, options: nextOpts };
                                  } else {
                                    const nextOptsHi = [...prev.optionsHi];
                                    nextOptsHi[idx] = val;
                                    return { ...prev, optionsHi: nextOptsHi };
                                  }
                                });
                              }}
                              className="flex-1 p-1 text-sm border-b border-stone-300 focus:outline-none focus:border-[#555934] bg-transparent"
                            />
                          ) : (
                            <span className="leading-snug">{opt}</span>
                          )}
                        </div>

                        {isEditing ? (
                          <button
                            type="button"
                            onClick={() =>
                              setEditDraft((prev) => (prev ? { ...prev, correctIndex: idx } : null))
                            }
                            className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition ${
                              isCorrect
                                ? 'bg-emerald-700 text-white'
                                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                            }`}
                          >
                            {isCorrect ? 'Key Selected' : 'Set as Key'}
                          </button>
                        ) : isCorrect ? (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                            Verified Key
                          </span>
                        ) : null}
                      </div>
                    );
                  })}
                </div>

                {/* Grounding Citation Box */}
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/90 text-xs text-amber-950 flex items-start gap-2.5">
                  <BookOpen className="h-4 w-4 text-amber-700 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <span className="font-bold text-amber-900">MoSPI Citation Grounding:</span>{' '}
                    {isEditing && editDraft ? (
                      <input
                        type="text"
                        value={editDraft.citation}
                        onChange={(e) =>
                          setEditDraft((prev) => (prev ? { ...prev, citation: e.target.value } : null))
                        }
                        className="w-full mt-1 p-1 text-xs border border-amber-300 rounded bg-white text-amber-950 focus:outline-none"
                      />
                    ) : (
                      <span>{activeItem.citation}</span>
                    )}
                  </div>
                </div>

                {/* Decisive Action Bar */}
                <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <span>Audit Status:</span>
                    {activeItem.status === 'PENDING' && (
                      <span className="font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        Requires Review
                      </span>
                    )}
                    {activeItem.status === 'APPROVED' && (
                      <span className="font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        Certified Approved
                      </span>
                    )}
                    {activeItem.status === 'PUBLISHED' && (
                      <span className="font-semibold text-[#555934] bg-[#555934]/15 px-2 py-0.5 rounded">
                        Active in Assessment Pool
                      </span>
                    )}
                    {activeItem.status === 'REJECTED' && (
                      <span className="font-semibold text-red-800 bg-red-100 px-2 py-0.5 rounded">
                        Rejected
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                    {activeItem.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(activeItem.id, 'REJECTED')}
                          className="px-4 py-2 rounded-xl bg-red-50 text-red-800 hover:bg-red-100 text-xs font-semibold transition flex items-center gap-1.5"
                        >
                          <XCircle className="h-4 w-4" /> Reject Item
                        </button>
                        <button
                          onClick={() => handleStatusChange(activeItem.id, 'APPROVED')}
                          className="px-5 py-2 rounded-xl bg-[#555934] hover:bg-[#3e4225] text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
                        >
                          <CheckCircle2 className="h-4 w-4" /> Certify & Approve
                        </button>
                      </>
                    )}

                    {activeItem.status === 'APPROVED' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(activeItem.id, 'PENDING')}
                          className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition"
                        >
                          Reopen Audit
                        </button>
                        <button
                          onClick={() => handlePublish(activeItem.id)}
                          className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
                        >
                          <UploadCloud className="h-4 w-4" /> Publish to Live Bank
                        </button>
                      </>
                    )}

                    {activeItem.status === 'PUBLISHED' && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                          <Check className="h-3.5 w-3.5" /> Published in Exam Bank
                        </span>
                        <button
                          onClick={() => handleStatusChange(activeItem.id, 'APPROVED')}
                          className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-medium transition"
                        >
                          Retract
                        </button>
                      </div>
                    )}

                    {activeItem.status === 'REJECTED' && (
                      <button
                        onClick={() => handleStatusChange(activeItem.id, 'PENDING')}
                        className="px-4 py-2 rounded-xl bg-stone-100 text-stone-800 text-xs font-semibold hover:bg-stone-200 transition flex items-center gap-1.5"
                      >
                        <RotateCcw className="h-3.5 w-3.5" /> Restore to Pending
                      </button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 text-stone-500">
              <Layers className="h-8 w-8 mx-auto mb-2 text-stone-400" />
              <p className="text-sm font-semibold text-stone-800">No question selected</p>
              <p className="text-xs text-stone-500 mt-1">Pick an item from the queue list on the left to inspect.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
