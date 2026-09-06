'use client';

import React, { useState } from 'react';
import { X, BookOpen, Download, Search, CheckCircle2, ShieldCheck, Copy } from 'lucide-react';

export interface ManualChapter {
  id: string;
  number: number;
  title: string;
  title_hi: string;
  content: string;
  content_hi: string;
  statutoryRule: string;
  statutoryRule_hi: string;
}

export interface ManualContentConfig {
  id: string;
  title: string;
  title_hi: string;
  division: string;
  pages: string;
  version: string;
  chapters: ManualChapter[];
}

const MANUAL_REGISTRY: Record<string, ManualContentConfig> = {
  'manual-plfs-vol1': {
    id: 'manual-plfs-vol1',
    title: 'Instructions to Field Staff: Vol. 1 (PLFS 2026)',
    title_hi: 'फील्ड स्टाफ के लिए निर्देश: भाग I (PLFS 2026)',
    division: 'NSSO Field Operations Division',
    pages: '184 Pages',
    version: 'Ver 2026.1',
    chapters: [
      {
        id: 'c1',
        number: 1,
        title: 'Introduction, Objectives & Sampling Design of PLFS',
        title_hi: 'परिचय, उद्देश्य एवं पीएलएफएस की प्रतिचयन रूपरेखा',
        content:
          'The Periodic Labour Force Survey (PLFS) is designed to estimate key employment and unemployment indicators (viz. Worker Population Ratio, Labour Force Participation Rate, Unemployment Rate) in both rural and urban areas. A rotational panel sampling design is adopted for urban areas to measure short-term quarterly changes, while rural areas follow an annual survey cycle.',
        content_hi:
          'आवधिक श्रम बल सर्वेक्षण (PLFS) का उद्देश्य ग्रामीण और शहरी दोनों क्षेत्रों में प्रमुख रोजगार और बेरोजगारी संकेतकों का अनुमान लगाना है। अल्पकालिक त्रैमासिक परिवर्तनों को मापने के लिए शहरी क्षेत्रों में एक घूर्णी पैनल प्रतिचयन डिजाइन अपनाया गया है।',
        statutoryRule:
          'Rule 1.4: Strict adherence to rotational visit schedules (Visit 1 to Visit 4) is mandatory to ensure panel integrity and zero attrition bias.',
        statutoryRule_hi:
          'नियम 1.4: पैनल अखंडता सुनिश्चित करने के लिए घूर्णी यात्रा कार्यक्रम (यात्रा 1 से 4) का कड़ाई से पालन अनिवार्य है।',
      },
      {
        id: 'c2',
        number: 2,
        title: 'Concepts, Definitions & Activity Status Codes',
        title_hi: 'अवधारणाएं, परिभाषाएं एवं गतिविधि स्थिति कोड',
        content:
          'Activity status of a person is the activity situation in which the person was found during the reference period. Major classifications include Usual Principal Activity Status (UPS), Usual Subsidiary Economic Activity Status (UPSS), and Current Weekly Status (CWS). Economic activities are classified using 5-digit National Industrial Classification (NIC-2008) and 3-digit National Classification of Occupations (NCO-2015).',
        content_hi:
          'व्यक्ति की गतिविधि स्थिति वह स्थिति है जिसमें संदर्भ अवधि के दौरान व्यक्ति को पाया गया था। प्रमुख वर्गीकरण में सामान्य मुख्य गतिविधि स्थिति (UPS), सामान्य सहायक आर्थिक गतिविधि स्थिति (UPSS) और वर्तमान साप्ताहिक स्थिति (CWS) शामिल हैं।',
        statutoryRule:
          'Rule 2.2: An activity is recognized as economic if it involves production of goods or services for market sale or own-account capital formation.',
        statutoryRule_hi:
          'नियम 2.2: किसी गतिविधि को आर्थिक तभी माना जाता है जब उसमें बाजार में बिक्री या स्वयं के पूंजी निर्माण के लिए वस्तुओं या सेवाओं का उत्पादन शामिल हो।',
      },
      {
        id: 'c3',
        number: 3,
        title: 'Canvassing Schedule 10.4: Household & Employment Particulars',
        title_hi: 'अनुसूची 10.4 का सर्वेक्षण: पारिवारिक एवं रोजगार विवरण',
        content:
          'Schedule 10.4 consists of 12 distinct blocks. Block 3 captures household characteristics such as household size, religion, social group, and monthly consumer expenditure. Block 4 records demographic particulars of members, and Block 5 captures detailed daily time disposition for each day of the preceding 7 days.',
        content_hi:
          'अनुसूची 10.4 में 12 खंड होते हैं। खंड 3 में परिवार की विशेषताएं दर्ज की जाती हैं। खंड 4 में जनसांख्यिकीय विवरण और खंड 5 में पिछले 7 दिनों के प्रत्येक दिन का विस्तृत समय विवरण दर्ज किया जाता है।',
        statutoryRule:
          'Rule 3.7: In Block 5, total hours worked per day must not exceed 24 hours and daily wage earnings must match reported enterprise activity codes.',
        statutoryRule_hi:
          'नियम 3.7: खंड 5 में प्रतिदिन काम के घंटे 24 घंटे से अधिक नहीं हो सकते और दैनिक मजदूरी दर्ज उद्यम कोड से मेल खानी चाहिए।',
      },
    ],
  },
  'manual-schedule-0': {
    id: 'manual-schedule-0',
    title: 'Schedule 0.0 Household Listing & Demarcation Handbook',
    title_hi: 'अनुसूची 0.0 परिवार सूचीकरण और सीमा निर्धारण हैंडबुक',
    division: 'Survey Design & Research Division (SDRD)',
    pages: '96 Pages',
    version: 'Ver 2025.4',
    chapters: [
      {
        id: 'c1',
        number: 1,
        title: 'Preparation of Demarcation Sketch & Physical Boundary Verification',
        title_hi: 'सीमांकन रेखाचित्र तैयार करना एवं भौतिक सीमाओं का सत्यापन',
        content:
          'The investigator must physically trace the outer boundaries of the Census Enumeration Block (CEB) starting from the north-western corner. Every permanent physical landmark (e.g. roads, railway lines, canals, temple walls) must be marked on the layout sketch to prevent boundary overlap with adjacent blocks.',
        content_hi:
          'अन्वेषक को उत्तर-पश्चिमी कोने से शुरू करके जनगणना ब्लॉक की बाहरी सीमाओं का भौतिक रूप से सत्यापन करना होगा। आसन्न ब्लॉकों के साथ सीमा अतिव्यापन को रोकने के लिए प्रत्येक स्थाई स्थल को रेखाचित्र पर चिह्नित किया जाना चाहिए।',
        statutoryRule:
          'Rule 1.1: Never commence household listing without completing the outer boundary walk and obtaining sign-off from the local revenue official.',
        statutoryRule_hi:
          'नियम 1.1: बाहरी सीमा का चक्कर लगाए बिना और स्थानीय राजस्व अधिकारी से पुष्टि प्राप्त किए बिना परिवार सूचीकरण कभी शुरू न करें।',
      },
    ],
  },
  'manual-capi-handbook': {
    id: 'manual-capi-handbook',
    title: 'ASHE & CAPI Tablet Operational Protocols',
    title_hi: 'कैपी टैबलेट संचालन और तुल्यकालन हैंडबुक',
    division: 'Data Processing Division (DPD), MoSPI',
    pages: '64 Pages',
    version: 'Ver 2026.2',
    chapters: [
      {
        id: 'c1',
        number: 1,
        title: 'Tablet Initialization, Hardware Security & Keystore Encryption',
        title_hi: 'टैबलेट प्रारंभ, हार्डवेयर सुरक्षा एवं कीस्टोर एन्क्रिप्शन',
        content:
          'Official survey tablets must remain locked to the MoSPI Mobile Device Management (MDM) profile. All survey returns are encrypted at rest using AES-256 GCM backed by the Android Hardware Security Module (HSM). Direct USB data extraction is strictly prohibited.',
        content_hi:
          'सर्वेक्षण टैबलेट एमडीएम प्रोफाइल पर लॉक रहना चाहिए। सभी डेटा एईएस-256 जीसीएम का उपयोग करके स्थानीय रूप से एन्क्रिप्ट किए जाते हैं। सीधा यूएसबी डेटा निष्कर्षण सख्त वर्जित है।',
        statutoryRule:
          'Rule 1.2: Investigators must synchronize biometric authentication tokens every 7 days; failing which the local keystore transitions to read-only lock.',
        statutoryRule_hi:
          'नियम 1.2: अन्वेषकों को हर 7 दिन में बायोमेट्रिक टोकन सिंक्रनाइज़ करना होगा अन्यथा स्थानीय कीस्टोर लॉक हो जाएगा।',
      },
    ],
  },
};

interface ManualReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  manualId?: string;
  isHindi?: boolean;
}

export function ManualReaderModal({
  isOpen,
  onClose,
  manualId = 'manual-plfs-vol1',
  isHindi = false,
}: ManualReaderModalProps) {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [readChapters, setReadChapters] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const manual = MANUAL_REGISTRY[manualId] || MANUAL_REGISTRY['manual-plfs-vol1'];
  const chapters = manual.chapters;
  const currentChapter = chapters[activeChapterIndex] || chapters[0];

  const handleToggleRead = (chapterId: string) => {
    setReadChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  const handleCopyCitation = () => {
    const citation = `MoSPI. (${manual.version}). ${manual.title} - Chapter ${currentChapter.number}: ${currentChapter.title}. Government of India.`;
    navigator.clipboard?.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    alert(
      isHindi
        ? `आधिकारिक MoSPI पीडीएफ डाउनलोड हो रहा है: ${manual.title_hi} (${manual.pages})`
        : `Downloading Official MoSPI PDF publication: ${manual.title} (${manual.pages})...`
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reader-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#FAF6F0] border-2 border-[#BF9B7A]/40 shadow-2xl overflow-hidden flex flex-col h-[85vh]">
        {/* Header */}
        <div className="bg-[#555934] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 p-1 border border-white/20 shrink-0">
              <BookOpen className="h-5 w-5 text-[#F8C858]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold bg-white/20 text-[#F8C858] px-2 py-0.5 rounded-full shrink-0">
                  {manual.version}
                </span>
                <span className="text-xs text-white/70 hidden sm:inline">{manual.division}</span>
              </div>
              <h2 id="reader-modal-title" className="text-sm sm:text-base font-black tracking-tight text-[#FAF6F0] truncate mt-0.5">
                {isHindi ? manual.title_hi : manual.title}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close manual reader modal"
            className="rounded-xl p-1.5 text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search & Actions Bar */}
        <div className="px-6 py-2.5 bg-white border-b border-[#BF9B7A]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shrink-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHindi ? 'अध्याय या नियम खोजें...' : 'Search handbook sections or rules...'}
              className="w-full h-8 rounded-xl bg-[#FAF6F0] border border-[#BF9B7A]/25 pl-8 pr-3 text-xs text-[#2d1f17] placeholder:text-muted-foreground focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#555934]"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0 text-xs">
            <button
              type="button"
              onClick={handleCopyCitation}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF6F0] border border-[#BF9B7A]/30 font-semibold text-muted-foreground hover:text-[#2d1f17] hover:bg-[#F2E6D8] transition-colors cursor-pointer"
            >
              <Copy className="h-3 w-3" />
              <span>{copied ? (isHindi ? 'कॉपी हो गया!' : 'Copied!') : (isHindi ? 'उद्धरण कॉपी करें' : 'Copy Citation')}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#555934] font-bold text-white hover:bg-[#434728] transition-colors shadow-2xs cursor-pointer"
            >
              <Download className="h-3 w-3 text-[#F8C858]" />
              <span>{isHindi ? 'पीडीएफ डाउनलोड' : 'Download Official PDF'}</span>
            </button>
          </div>
        </div>

        {/* 2-Column Reader Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column: Chapter Navigation (hidden on mobile, visible sm+) */}
          <div className="w-64 border-r border-[#BF9B7A]/25 bg-[#FAF6F0]/60 overflow-y-auto p-3 space-y-1.5 shrink-0 hidden sm:block">
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {isHindi ? 'अध्याय सूची' : 'Table of Contents'}
            </div>
            {chapters.map((ch, idx) => {
              const isSelected = idx === activeChapterIndex;
              const isRead = !!readChapters[ch.id];
              const titleText = isHindi ? ch.title_hi : ch.title;

              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => setActiveChapterIndex(idx)}
                  className={`w-full p-2.5 rounded-xl text-left transition-all text-xs flex items-start gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-[#555934] text-white font-bold shadow-2xs'
                      : 'hover:bg-white text-[#2d1f17]'
                  }`}
                >
                  <span
                    className={`h-5 w-5 rounded-md flex items-center justify-center font-mono text-[10px] shrink-0 font-bold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-[#BF9B7A]/20 text-chart-5'
                    }`}
                  >
                    {ch.number}
                  </span>
                  <span className="flex-1 min-w-0 line-clamp-2 leading-tight">
                    {titleText}
                  </span>
                  {isRead && (
                    <CheckCircle2
                      className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${
                        isSelected ? 'text-[#F8C858]' : 'text-emerald-600'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Column: Reading Canvas */}
          <div className="flex-1 bg-white p-6 sm:p-8 overflow-y-auto space-y-6">
            <div className="space-y-2 pb-4 border-b border-[#BF9B7A]/20">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-[#555934]/15 text-[#555934] text-[10px] font-bold uppercase tracking-wider">
                  {isHindi ? `अध्याय ${currentChapter.number}` : `Chapter ${currentChapter.number}`}
                </span>
                <span className="text-[11px] text-muted-foreground font-mono">{manual.pages}</span>
              </div>
              <h3 className="text-xl font-black text-[#2d1f17] tracking-tight">
                {isHindi ? currentChapter.title_hi : currentChapter.title}
              </h3>
            </div>

            {/* Chapter Text */}
            <div className="prose prose-sm max-w-none text-[#2d1f17] leading-relaxed space-y-4">
              <p className="text-sm leading-relaxed text-[#2d1f17]/90 font-sans">
                {isHindi ? currentChapter.content_hi : currentChapter.content}
              </p>
            </div>

            {/* Statutory Rule Callout */}
            <div className="rounded-2xl bg-[#F8C858]/15 border-2 border-[#F8C858]/35 p-4 space-y-1.5 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-[#8C5B3E] uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4" />
                <span>{isHindi ? 'वैधानिक फील्ड नियम' : 'Statutory Field Directive'}</span>
              </div>
              <p className="text-xs font-bold text-[#2d1f17] leading-normal">
                {isHindi ? currentChapter.statutoryRule_hi : currentChapter.statutoryRule}
              </p>
            </div>

            {/* Bottom Actions inside Reader */}
            <div className="pt-4 border-t border-[#BF9B7A]/20 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleToggleRead(currentChapter.id)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  readChapters[currentChapter.id]
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-800'
                    : 'bg-[#FAF6F0] border border-[#BF9B7A]/40 text-[#555934] hover:bg-[#F2E6D8]'
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>
                  {readChapters[currentChapter.id]
                    ? isHindi
                      ? '✓ अध्याय पूर्ण'
                      : '✓ Completed'
                    : isHindi
                      ? 'अध्याय पूर्ण चिह्नित करें'
                      : 'Mark Chapter as Completed'}
                </span>
              </button>

              <span className="text-[11px] text-muted-foreground">
                MoSPI Civil Cadre Repository
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
