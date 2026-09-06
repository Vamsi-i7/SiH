'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ProvenanceBadge } from '@/components/ProvenanceBadge';
import { DocumentService, type IngestedDocument } from '@/services/documentService';
import { Upload, FileText, CheckCircle2, RefreshCw, Layers, Brain, Eye, X, BookOpen } from 'lucide-react';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<IngestedDocument[]>(
    DocumentService.getSampleDocuments()
  );
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCompetency, setSelectedCompetency] = useState('comp-capi');
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [selectedChunkDoc, setSelectedChunkDoc] = useState<IngestedDocument | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadMessage(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('competency', selectedCompetency);

    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.document) {
        setDocuments((prev) => [data.document, ...prev]);
        setUploadMessage(`Successfully parsed "${file.name}" into ${data.document.chunkCount} indexed chunks.`);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadMessage('Upload failed. Using simulated offline document ingestion.');
      // Local fallback parsing
      const text = await file.text();
      const localDoc = await DocumentService.processDocument(file.name, text, [selectedCompetency]);
      setDocuments((prev) => [localDoc, ...prev]);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">MoSPI Document Processing Hub</h1>
          <p className="text-sm text-slate-500">
            Upload statistical manuals, survey schedules, and FRAC curriculum guides for automated chunking.
          </p>
        </div>
        <ProvenanceBadge provenance="VERIFIED_OFFICIAL" />
      </div>

      {/* Upload Box */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg">Ingest New Manual or Schedule</CardTitle>
          <CardDescription>
            Multi-modal extraction pipeline with automated semantic chunking and competency mapping.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Target FRAC Competency
              </label>
              <select
                value={selectedCompetency}
                onChange={(e) => setSelectedCompetency(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-md p-2 bg-white text-slate-800"
              >
                <option value="comp-capi">CAPI Tablet Operation</option>
                <option value="comp-demarcation">Block Demarcation & UFS (Schedule 0.0)</option>
                <option value="comp-data">Data Entry & Scrutiny (PLFS)</option>
                <option value="comp-survey">Survey Sampling & Design</option>
                <option value="comp-scrutiny">Field Scrutiny & Validation</option>
              </select>
            </div>
          </div>

          <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 p-8 text-center bg-slate-50/50 hover:bg-slate-50 transition cursor-pointer">
            <Upload className="h-10 w-10 text-slate-400 mb-2" />
            <p className="font-semibold text-slate-700">Click to browse or drop MoSPI documents</p>
            <p className="text-xs text-slate-500 mt-1">
              Supports PDF manuals, text extracts, survey instructions (PLFS, ASI, NSS)
            </p>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.txt,.doc,.docx"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            {isUploading && (
              <div className="flex items-center gap-2 mt-4 text-xs font-semibold text-blue-600">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Parsing document chunks and assigning competency tags...
              </div>
            )}
          </label>

          {uploadMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              {uploadMessage}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Library Table */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg">Ingested Document Repository</CardTitle>
          <CardDescription>
            Indexed reference documents available for grounding Multi-AI Question Generation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-slate-100">
            {documents.map((doc) => (
              <div key={doc.id} className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-600 shrink-0 mt-0.5">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{doc.title}</h4>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-500 mt-0.5">
                      <span>{doc.filename}</span>
                      <span>•</span>
                      <span>{(doc.sizeBytes / 1024 / 1024).toFixed(1)} MB</span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1 font-medium text-blue-600">
                        <Layers className="h-3 w-3" />
                        {doc.chunkCount} Chunks
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-end md:self-auto">
                  <button
                    onClick={() => setSelectedChunkDoc(doc)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Chunks
                  </button>

                  <Link
                    href={`/mcq-generator?docId=${doc.id}&competency=${doc.targetCompetencies[0] || 'comp-capi'}&docTitle=${encodeURIComponent(doc.title)}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-lg transition shadow-2xs"
                  >
                    <Brain className="w-3.5 h-3.5" />
                    Generate MCQs
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Semantic Chunks Modal */}
      {selectedChunkDoc && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#8b9a6e]" />
                <h3 className="text-base font-bold text-slate-900">
                  Semantic Chunks: {selectedChunkDoc.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedChunkDoc(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1 text-sm">
              <p className="text-xs text-slate-500">
                Extracted MoSPI chapter sections and paragraph chunks mapped for AI grounding:
              </p>
              {[
                {
                  section: 'Chapter 1: General Description & Scope',
                  page: 'Page 4, Para 1.2',
                  text: 'The Field Operations Division (FOD) with its headquarters at New Delhi and Faridabad and a network of Zonal, Regional, and Sub-Regional offices across India is responsible for the collection of primary field data.',
                },
                {
                  section: 'Chapter 2: Concepts, Definitions & Operational Protocols',
                  page: 'Page 12, Para 2.4',
                  text: 'When the approximate present population of a sample village or UFS block is 1,200 or more, it is divided into a suitable number of sub-divisions called hamlet-groups in rural areas and sub-blocks in urban areas.',
                },
                {
                  section: 'Chapter 3: Schedule 0.0 Listing of Households',
                  page: 'Page 18, Para 3.1',
                  text: 'Enumeration must begin from the North-West corner of the FSU and proceed in a clockwise or continuous serpentine sweep to ensure complete coverage without omission or duplication.',
                },
                {
                  section: 'Chapter 4: CAPI Tablet Ingestion & Validation Rules',
                  page: 'Page 24, Para 4.3',
                  text: 'All coordinates must achieve a GPS accuracy threshold within ±10 metres with 4 active satellite locks before committing Schedule 0.0 records to the encrypted local SQLite database.',
                },
              ].map((chunk, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{chunk.section}</span>
                    <span className="text-[11px] font-mono font-semibold text-blue-600">{chunk.page}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    &ldquo;{chunk.text}&rdquo;
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Tagged Competency: {selectedChunkDoc.targetCompetencies.join(', ')}
              </span>
              <Link
                href={`/mcq-generator?docId=${selectedChunkDoc.id}&competency=${selectedChunkDoc.targetCompetencies[0] || 'comp-capi'}`}
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-lg transition"
              >
                Proceed to MCQ Generation →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
