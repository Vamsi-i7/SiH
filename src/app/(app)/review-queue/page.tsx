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
          <h1 className="text-2xl font-bold text-slate-900">Faculty Review & Calibration Queue</h1>
          <p className="text-sm text-slate-500">
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
            <Card key={item.id} className="border-slate-200">
              <CardHeader className="border-b border-slate-100 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {item.competency}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        Consensus: {(item.consensusScore * 100).toFixed(0)}%
                      </span>
                      {item.status === 'APPROVED' && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <Check className="h-3 w-3" /> Approved
                        </span>
                      )}
                      {item.status === 'REJECTED' && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                          Rejected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Item ID: {item.id}</p>
                  </div>

                  <button
                    onClick={() => toggleLanguage(item.id)}
                    className="text-xs px-2.5 py-1 font-semibold rounded border border-slate-200 bg-white hover:bg-slate-50 transition text-slate-700 self-start sm:self-auto"
                  >
                    View in: {lang === 'en' ? 'हिन्दी (Hindi)' : 'English'}
                  </button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-4">
                {/* Stem */}
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    {lang === 'en' ? item.stem : item.stemHi}
                  </h3>
                </div>

                {/* Choices */}
                <div className="space-y-2">
                  {(lang === 'en' ? item.options : item.optionsHi).map((opt, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border text-sm flex items-center justify-between ${
                        idx === item.correctIndex
                          ? 'border-emerald-300 bg-emerald-50/50 text-emerald-900 font-medium'
                          : 'border-slate-200 bg-slate-50/30 text-slate-700'
                      }`}
                    >
                      <span>
                        {String.fromCharCode(65 + idx)}. {opt}
                      </span>
                      {idx === item.correctIndex && (
                        <span className="text-xs font-semibold text-emerald-700">Verified Answer</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Grounding Reference */}
                <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-md border border-slate-200">
                  <BookOpen className="h-4 w-4 text-slate-500 shrink-0" />
                  <span>
                    <strong>Citation Grounding:</strong> {item.citation}
                  </span>
                </div>

                {/* Action Buttons */}
                {item.status === 'PENDING' && (
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => handleAction(item.id, 'REJECTED')}
                      className="px-3 py-1.5 rounded-md border border-rose-200 bg-rose-50 text-rose-700 text-xs font-semibold hover:bg-rose-100 transition flex items-center gap-1.5"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Reject Item
                    </button>
                    <button
                      onClick={() => handleAction(item.id, 'APPROVED')}
                      className="px-4 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
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
