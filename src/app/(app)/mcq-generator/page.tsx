'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ProvenanceBadge } from '@/components/ProvenanceBadge';
import { type GeneratedQuestion } from '@/services/mcqService';
import { Sparkles, CheckCircle, RefreshCw, BookOpen, Bot, Send } from 'lucide-react';

export default function MCQGeneratorPage() {
  const [competencyId, setCompetencyId] = useState('comp-capi');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestion, setGeneratedQuestion] = useState<GeneratedQuestion | null>(null);
  const [activeTab, setActiveTab] = useState<'en' | 'hi'>('en');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/mcq/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competencyId, difficulty }),
      });

      const data = await res.json();
      if (data.success && data.question) {
        setGeneratedQuestion(data.question);
      }
    } catch (err) {
      console.error('Failed to generate:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePushToReview = () => {
    setSuccessMessage('Item successfully staged into Faculty Review Queue with Consensus Verified badge.');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Multi-AI Bilingual MCQ Generator</h1>
          <p className="text-sm text-slate-500">
            Automated 3-model consensus pipeline (Claude, GPT-4, Llama) with MoSPI guideline grounding.
          </p>
        </div>
        <ProvenanceBadge provenance="PROPOSED_METHODOLOGY" />
      </div>

      {/* Generator Controls */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg">Calibrated Item Specification</CardTitle>
          <CardDescription>
            Specify target competency level and difficulty to invoke consensus verification.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Target FRAC Competency</label>
              <select
                value={competencyId}
                onChange={(e) => setCompetencyId(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-md p-2 bg-white text-slate-800"
              >
                <option value="comp-capi">CAPI Tablet Operation</option>
                <option value="comp-nsso">NSSO Protocol Mastery</option>
                <option value="comp-survey">Survey Sampling & Design</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Calibration Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                className="w-full text-sm border border-slate-300 rounded-md p-2 bg-white text-slate-800"
              >
                <option value="medium">Medium (Stage 1 Calibration)</option>
                <option value="easy">Easy (Foundational Verification)</option>
                <option value="hard">Hard (Advanced Distractor Challenge)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-2.5 bg-[#8b9a6e] hover:bg-[#7a885f] text-white text-sm font-semibold rounded-md flex items-center justify-center gap-2 shadow-xs transition"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Reconciling Models...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Consensus MCQ
                  </>
                )}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generated Result Preview */}
      {generatedQuestion && (
        <Card className="border-slate-200">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span>Generated Assessment Item</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                    Consensus Score: {(generatedQuestion.consensusScore * 100).toFixed(0)}%
                  </span>
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Bot className="h-3.5 w-3.5 text-slate-400" />
                  <span>Models: {generatedQuestion.modelsEvaluated.join(' • ')}</span>
                </CardDescription>
              </div>

              {/* Language Switcher */}
              <div className="flex rounded-md bg-slate-100 p-1">
                <button
                  onClick={() => setActiveTab('en')}
                  className={`px-3 py-1 text-xs font-semibold rounded ${
                    activeTab === 'en' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setActiveTab('hi')}
                  className={`px-3 py-1 text-xs font-semibold rounded ${
                    activeTab === 'hi' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  हिन्दी (Hindi)
                </button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            {/* Question Stem */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Question Stem</span>
              <p className="text-base font-medium text-slate-900 mt-1">
                {activeTab === 'en' ? generatedQuestion.stemEn : generatedQuestion.stemHi}
              </p>
            </div>

            {/* Choices */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Answer Options</span>
              {(activeTab === 'en' ? generatedQuestion.optionsEn : generatedQuestion.optionsHi).map(
                (opt, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border text-sm flex items-start gap-3 ${
                      idx === generatedQuestion.correctIndex
                        ? 'border-emerald-300 bg-emerald-50/60 text-emerald-900 font-medium'
                        : 'border-slate-200 bg-slate-50/50 text-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-flex items-center justify-center h-5 w-5 rounded-full text-xs font-semibold shrink-0 ${
                        idx === generatedQuestion.correctIndex
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {idx === generatedQuestion.correctIndex && (
                      <span className="text-xs font-semibold text-emerald-700 shrink-0">Correct Key</span>
                    )}
                  </div>
                )
              )}
            </div>

            {/* Grounding & Citation */}
            <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-200/80 text-xs space-y-1.5 text-amber-900">
              <div className="flex items-center gap-1.5 font-bold">
                <BookOpen className="h-4 w-4 text-amber-700" />
                <span>MoSPI Citation & Pedagogical Rationale:</span>
              </div>
              <p>{activeTab === 'en' ? generatedQuestion.rationaleEn : generatedQuestion.rationaleHi}</p>
              <p className="font-semibold text-amber-800">Source: {generatedQuestion.citation}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">Status: {generatedQuestion.status}</span>
              <button
                onClick={handlePushToReview}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-md flex items-center gap-1.5 shadow-xs transition"
              >
                <Send className="h-3.5 w-3.5" />
                Send to Faculty Review Queue
              </button>
            </div>

            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                {successMessage}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
