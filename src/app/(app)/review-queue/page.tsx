'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { ProvenanceBadge } from '@/components/ProvenanceBadge';
import { CheckCircle, XCircle, BookOpen, Check } from 'lucide-react';

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
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export default function ReviewQueuePage() {
  const [items, setItems] = useState<ReviewItem[]>([
    {
      id: 'rq-101',
      competency: 'CAPI Tablet Operation',
      stem: 'What is the required procedure when a sample household has permanently migrated?',
      stemHi: 'जब कोई नमूना परिवार स्थायी रूप से स्थानांतरित हो गया हो तो आवश्यक प्रक्रिया क्या है?',
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
      citation: 'PLFS Field Manual 2024, Section 3.2.1',
      consensusScore: 0.96,
      status: 'PENDING',
    },
    {
      id: 'rq-102',
      competency: 'NSSO Protocol Mastery',
      stem: 'Which schedule is specifically utilized for recording household consumer expenditure details?',
      stemHi: 'घरेलू उपभोक्ता व्यय विवरण दर्ज करने के लिए विशेष रूप से किस अनुसूची का उपयोग किया जाता है?',
      options: [
        'Schedule 1.0',
        'Schedule 10.0',
        'Schedule 2.1',
        'Schedule 0.0',
      ],
      optionsHi: [
        'अनुसूची 1.0',
        'अनुसूची 10.0',
        'अनुसूची 2.1',
        'अनुसूची 0.0',
      ],
      correctIndex: 0,
      citation: 'NSS 80th Round Reference Guide',
      consensusScore: 0.98,
      status: 'PENDING',
    },
  ]);

  const [activeLang, setActiveLang] = useState<Record<string, 'en' | 'hi'>>({
    'rq-101': 'en',
    'rq-102': 'en',
  });

  const handleAction = (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const toggleLanguage = (id: string) => {
    setActiveLang((prev) => ({
      ...prev,
      [id]: prev[id] === 'en' ? 'hi' : 'en',
    }));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2d1f17]">Faculty Review & Calibration Queue</h1>
          <p className="text-sm text-[#705849] mt-0.5">
            NSSTA faculty portal to audit, edit, and approve consensus-generated assessment questions.
          </p>
        </div>
        <ProvenanceBadge provenance="VERIFIED_OFFICIAL" />
      </div>

      {/* Review List */}
      <div className="space-y-6">
        {items.map((item) => {
          const lang = activeLang[item.id] || 'en';
          return (
            <Card key={item.id} className="rounded-2xl bg-white shadow-card transition-all">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F2E6D8] text-[#593E2E]">
                        {item.competency}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#555934]/12 text-[#555934]">
                        Consensus: {(item.consensusScore * 100).toFixed(0)}%
                      </span>
                      {item.status === 'APPROVED' && (
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#555934] text-white flex items-center gap-1 shadow-2xs">
                          <Check className="h-3 w-3" /> Approved
                        </span>
                      )}
                      {item.status === 'REJECTED' && (
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#8C5B3E] text-white shadow-2xs">
                          Rejected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#705849] font-mono mt-1.5">Item ID: {item.id}</p>
                  </div>

                  <button
                    onClick={() => toggleLanguage(item.id)}
                    className="text-xs px-3.5 py-1.5 font-semibold rounded-xl bg-[#F2E6D8]/60 hover:bg-[#E8DACB] transition text-[#2d1f17] self-start sm:self-auto"
                  >
                    View in: {lang === 'en' ? 'हिन्दी (Hindi)' : 'English'}
                  </button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-1">
                {/* Stem */}
                <div>
                  <h3 className="text-base font-semibold text-[#2d1f17] leading-relaxed">
                    {lang === 'en' ? item.stem : item.stemHi}
                  </h3>
                </div>

                {/* Choices */}
                <div className="space-y-2.5">
                  {(lang === 'en' ? item.options : item.optionsHi).map((opt, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl text-sm flex items-center justify-between transition-all ${
                        idx === item.correctIndex
                          ? 'bg-[#555934]/12 text-[#2d1f17] font-medium shadow-2xs'
                          : 'bg-[#F2E6D8]/30 hover:bg-[#F2E6D8]/60 text-[#2d1f17]'
                      }`}
                    >
                      <span className="pr-4 leading-snug">
                        {String.fromCharCode(65 + idx)}. {opt}
                      </span>
                      {idx === item.correctIndex && (
                        <span className="text-[11px] font-semibold text-white bg-[#555934] px-2.5 py-0.5 rounded-full shrink-0 shadow-2xs">
                          Verified Answer
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Grounding Reference */}
                <div className="flex items-center gap-2.5 text-xs text-[#705849] bg-[#F2E6D8]/40 p-3.5 rounded-xl">
                  <BookOpen className="h-4 w-4 text-[#555934] shrink-0" />
                  <span>
                    <strong className="text-[#2d1f17]">Citation Grounding:</strong> {item.citation}
                  </span>
                </div>

                {/* Action Buttons */}
                {item.status === 'PENDING' && (
                  <div className="flex items-center justify-end gap-3 pt-3">
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
                      Approve for Active Question Pool
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
