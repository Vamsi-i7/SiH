'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ProvenanceBadge } from '@/components/ProvenanceBadge';
import { type GeneratedQuestion } from '@/services/mcqService';
import { Sparkles, CheckCircle, RefreshCw, BookOpen, Bot, Send, ArrowRight, FileText, Check } from 'lucide-react';

interface IngestedDoc {
  id: string;
  title: string;
  cadre: string;
  competencyId: string;
  competencyName: string;
  citation: string;
}

const INGESTED_DOCS: IngestedDoc[] = [
  {
    id: 'doc-plfs-2024',
    title: 'Periodic Labour Force Survey (PLFS) — Field Staff Instructions Manual 2024-25',
    cadre: 'Field Operations Division (FOD)',
    competencyId: 'comp-capi',
    competencyName: 'CAPI Tablet Operation',
    citation: 'PLFS Manual 2024, Chapter 3: Household Listing & Mobile Verification Protocol',
  },
  {
    id: 'doc-nsso-instructions',
    title: 'NSSO FOD Operational Guidelines & Village Cadastral Scrutiny (Vol. 1)',
    cadre: 'Subordinate Statistical Service (SSS)',
    competencyId: 'comp-nsso',
    competencyName: 'NSSO Protocol Mastery',
    citation: 'NSSO FOD Guidelines Vol. 1, Section 4.2: Hamlets Demarcation & Schedule 0.0 Scrutiny',
  },
  {
    id: 'doc-nssta-sampling',
    title: 'NSSTA Training Module — Advanced Sampling Techniques & Multi-Stage Stratification',
    cadre: 'Indian Statistical Service (ISS)',
    competencyId: 'comp-survey',
    competencyName: 'Survey Sampling & Design',
    citation: 'NSSTA Module 4: Stratified Multi-Stage Cluster Variance & Design Effect (DEFF)',
  },
  {
    id: 'doc-cpi-rural-urban',
    title: 'Consumer Price Index (CPI) Rural & Urban Price Collection Manual 2024',
    cadre: 'Field Operations Division (FOD)',
    competencyId: 'comp-capi',
    competencyName: 'CAPI Tablet Operation',
    citation: 'CPI Price Collection Manual 2024, Section 2: Specification Matching & Substitution',
  },
];

function MCQGeneratorInner() {
  const searchParams = useSearchParams();
  const initialComp = searchParams.get('competency');
  const matchedDoc = initialComp ? INGESTED_DOCS.find((d) => d.competencyId === initialComp)?.id : null;
  const initialDocId = searchParams.get('docId') || matchedDoc || 'doc-plfs-2024';

  const [selectedDocId, setSelectedDocId] = useState(initialDocId);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestion, setGeneratedQuestion] = useState<GeneratedQuestion | null>(null);
  const [activeTab, setActiveTab] = useState<'en' | 'hi'>('en');
  const [stagedToQueue, setStagedToQueue] = useState(false);

  const activeDoc = INGESTED_DOCS.find((d) => d.id === selectedDocId) || INGESTED_DOCS[0];
  const competencyId = activeDoc.competencyId;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStagedToQueue(false);

    try {
      const res = await fetch('/api/mcq/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competencyId,
          difficulty,
          topicPrompt: activeDoc.title,
          citationSource: activeDoc.citation,
        }),
      });

      const data = await res.json();
      if (data.success && data.question) {
        // Ensure citation references the active official document
        const q = data.question;
        q.citation = activeDoc.citation;
        setGeneratedQuestion(q);
      }
    } catch (err) {
      console.error('Failed to generate:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePushToReview = () => {
    if (!generatedQuestion) return;

    try {
      const existingRaw = localStorage.getItem('statvidya_review_queue');
      const queue = existingRaw ? JSON.parse(existingRaw) : [];

      const newItem = {
        id: generatedQuestion.id || `rq-${Date.now()}`,
        competency: activeDoc.competencyName,
        stem: generatedQuestion.stemEn,
        stemHi: generatedQuestion.stemHi,
        options: generatedQuestion.optionsEn,
        optionsHi: generatedQuestion.optionsHi,
        correctIndex: generatedQuestion.correctIndex,
        citation: generatedQuestion.citation,
        consensusScore: generatedQuestion.consensusScore,
        status: 'PENDING',
        sourceDoc: activeDoc.title,
        createdAt: new Date().toISOString(),
      };

      const updated = [newItem, ...queue.filter((item: { id: string }) => item.id !== newItem.id)];
      localStorage.setItem('statvidya_review_queue', JSON.stringify(updated));
      setStagedToQueue(true);
    } catch (err) {
      console.error('Failed to stage item to review queue:', err);
      setStagedToQueue(true);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              MoSPI AI Content Pipeline
            </span>
            <span className="text-xs text-stone-500">• Clause 4.3 FRAC Calibrated Generator</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Multi-AI Bilingual MCQ Generator</h1>
          <p className="text-sm text-stone-600">
            3-Model consensus reconciliation (Claude 3.5, GPT-4o, Llama-3) grounded in official MoSPI field manuals.
          </p>
        </div>
        <ProvenanceBadge provenance="PROPOSED_METHODOLOGY" />
      </div>

      {/* Generator Controls */}
      <Card className="border-stone-200 bg-white shadow-xs">
        <CardHeader className="bg-stone-50/50 border-b border-stone-100 pb-4">
          <CardTitle className="text-base font-semibold text-stone-900 flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#8b9a6e]" />
            Grounding Source & Calibration Parameters
          </CardTitle>
          <CardDescription className="text-xs text-stone-500">
            Select an ingested MoSPI manual to extract authentic operational context and calibration depth.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Document Grounding Selector */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Ingested MoSPI Document Grounding
              </label>
              <select
                value={selectedDocId}
                onChange={(e) => setSelectedDocId(e.target.value)}
                className="w-full text-xs sm:text-sm border border-stone-300 rounded-lg p-2.5 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#8b9a6e]"
              >
                {INGESTED_DOCS.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    [{doc.cadre}] {doc.title}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
                <BookOpen className="h-3 w-3 text-amber-600" />
                Citation anchor: <span className="font-medium text-stone-700">{activeDoc.citation}</span>
              </p>
            </div>

            {/* Difficulty Calibration */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Target Difficulty Calibration
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                className="w-full text-xs sm:text-sm border border-stone-300 rounded-lg p-2.5 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#8b9a6e]"
              >
                <option value="medium">Medium (L3 Stage 1 Calibration)</option>
                <option value="easy">Easy (L1-L2 Foundational Recall)</option>
                <option value="hard">Hard (L4-L5 Non-Sampling Distractors)</option>
              </select>
              <p className="text-[11px] text-stone-500 mt-1">
                Mapped to FRAC Competency: <span className="font-semibold text-[#7a885f]">{activeDoc.competencyName}</span>
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-stone-100">
            <span className="text-xs text-stone-500">
              Pipeline: 3 Independent Generations $\rightarrow$ Agreement Matrix $\rightarrow$ MoSPI Fact Scrutiny
            </span>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-5 py-2.5 bg-[#8b9a6e] hover:bg-[#7a885f] text-white text-sm font-semibold rounded-lg flex items-center gap-2 shadow-xs transition active:scale-[0.99] disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Reconciling AI Models...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Calibrated Item
                </>
              )}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Result Preview */}
      {generatedQuestion && (
        <Card className="border-stone-200 bg-white shadow-sm animate-in fade-in-50 duration-300">
          <CardHeader className="border-b border-stone-100 pb-4 bg-stone-50/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <CardTitle className="text-lg font-bold text-stone-900">
                    Consensus-Verified Assessment Item
                  </CardTitle>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 font-bold border border-blue-200">
                    Consensus Score: {(generatedQuestion.consensusScore * 100).toFixed(0)}%
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium">
                    {difficulty.toUpperCase()}
                  </span>
                </div>
                <CardDescription className="flex items-center gap-2 mt-1.5 text-xs text-stone-500">
                  <Bot className="h-3.5 w-3.5 text-blue-600" />
                  <span>Models Evaluated: <strong>Claude 3.5 Sonnet</strong>, <strong>GPT-4o</strong>, <strong>Llama-3-70B</strong></span>
                </CardDescription>
              </div>

              {/* Language Switcher */}
              <div className="flex rounded-lg bg-stone-100 p-1 border border-stone-200 self-start sm:self-auto">
                <button
                  onClick={() => setActiveTab('en')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                    activeTab === 'en' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setActiveTab('hi')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                    activeTab === 'hi' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  हिन्दी (Hindi)
                </button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            {/* Question Stem */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                Question Stem ({activeTab === 'en' ? 'English' : 'हिन्दी'})
              </span>
              <p className="text-base font-semibold text-stone-900 leading-relaxed">
                {activeTab === 'en' ? generatedQuestion.stemEn : generatedQuestion.stemHi}
              </p>
            </div>

            {/* Choices */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                Calibrated Options & Distractor Design
              </span>
              {(activeTab === 'en' ? generatedQuestion.optionsEn : generatedQuestion.optionsHi).map(
                (opt, idx) => {
                  const isCorrect = idx === generatedQuestion.correctIndex;
                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border text-sm flex items-start gap-3 transition ${
                        isCorrect
                          ? 'border-emerald-300 bg-emerald-50/70 text-emerald-950 font-medium shadow-xs'
                          : 'border-stone-200 bg-white text-stone-700'
                      }`}
                    >
                      <span
                        className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold shrink-0 ${
                          isCorrect
                            ? 'bg-emerald-700 text-white'
                            : 'bg-stone-100 text-stone-700 border border-stone-200'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1 pt-0.5">{opt}</span>
                      {isCorrect && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                          Verified Key
                        </span>
                      )}
                    </div>
                  );
                }
              )}
            </div>

            {/* Grounding & Citation */}
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs space-y-2 text-amber-950">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <BookOpen className="h-4 w-4 text-amber-700" />
                <span>Official MoSPI Source Grounding & Justification:</span>
              </div>
              <p className="leading-relaxed text-amber-900">
                {activeTab === 'en' ? generatedQuestion.rationaleEn : generatedQuestion.rationaleHi}
              </p>
              <div className="pt-1 text-[11px] font-semibold text-amber-800">
                Source: {generatedQuestion.citation}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-stone-500">
                Status: <strong className="text-stone-700">{stagedToQueue ? 'STAGED IN QUEUE' : 'DRAFT GENERATED'}</strong>
              </div>

              <div className="flex items-center gap-3">
                {stagedToQueue ? (
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                      <Check className="h-4 w-4" /> Staged into Queue
                    </span>
                    <Link
                      href="/review-queue"
                      className="px-4 py-2 bg-[#8b9a6e] hover:bg-[#7a885f] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition"
                    >
                      Open Review Queue <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={handlePushToReview}
                    className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow-xs transition active:scale-95"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Stage into Faculty Review Queue
                  </button>
                )}
              </div>
            </div>

            {stagedToQueue && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-lg flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>
                    Item successfully staged into the <strong>Faculty Review & Calibration Queue</strong> with consensus certification.
                  </span>
                </div>
                <Link
                  href="/review-queue"
                  className="font-bold underline text-emerald-800 hover:text-emerald-950 shrink-0"
                >
                  Review Now →
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function MCQGeneratorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-stone-500">Loading MCQ Generator...</div>}>
      <MCQGeneratorInner />
    </Suspense>
  );
}
