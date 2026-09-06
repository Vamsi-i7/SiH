'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ProvenanceBadge } from '@/components/ProvenanceBadge';
import { DocumentService, type IngestedDocument } from '@/services/documentService';
import { Upload, FileText, CheckCircle2, RefreshCw, Layers } from 'lucide-react';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<IngestedDocument[]>(
    DocumentService.getSampleDocuments()
  );
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCompetency, setSelectedCompetency] = useState('comp-capi');
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

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
          <h1 className="text-2xl font-bold text-[#2d1f17]">MoSPI Document Processing Hub</h1>
          <p className="text-sm text-[#705849] mt-0.5">
            Upload statistical manuals, survey schedules, and FRAC curriculum guides for automated chunking.
          </p>
        </div>
        <ProvenanceBadge provenance="VERIFIED_OFFICIAL" />
      </div>

      {/* Upload Box */}
      <Card className="rounded-2xl bg-white shadow-card">
        <CardHeader>
          <CardTitle className="text-lg text-[#2d1f17]">Ingest New Manual or Schedule</CardTitle>
          <CardDescription className="text-[#705849]">
            Multi-modal extraction pipeline with automated semantic chunking and competency mapping.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
            <div>
              <label className="block text-xs font-semibold text-[#705849] uppercase tracking-wider mb-1.5">
                Target FRAC Competency
              </label>
              <select
                value={selectedCompetency}
                onChange={(e) => setSelectedCompetency(e.target.value)}
                className="w-full text-sm rounded-xl p-3 bg-[#F2E6D8]/40 text-[#2d1f17] focus:outline-none focus:ring-2 focus:ring-[#555934]/20 transition-all shadow-2xs"
              >
                <option value="comp-capi">CAPI Tablet Operation</option>
                <option value="comp-nsso">NSSO Protocol Mastery</option>
                <option value="comp-survey">Survey Sampling & Design</option>
                <option value="comp-data">Data Entry & Scrutiny</option>
              </select>
            </div>
          </div>

          <label className="flex flex-col items-center justify-center rounded-2xl p-8 text-center bg-[#F2E6D8]/35 hover:bg-[#F2E6D8]/65 transition cursor-pointer">
            <Upload className="h-10 w-10 text-[#555934] mb-2" />
            <p className="font-semibold text-[#2d1f17]">Click to browse or drop MoSPI documents</p>
            <p className="text-xs text-[#705849] mt-1">
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
              <div className="flex items-center gap-2 mt-4 text-xs font-semibold text-[#555934]">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Parsing document chunks and assigning competency tags...
              </div>
            )}
          </label>

          {uploadMessage && (
            <div className="p-3.5 bg-[#555934]/12 text-[#555934] text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#555934] shrink-0" />
              {uploadMessage}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Library Table */}
      <Card className="rounded-2xl bg-white shadow-card">
        <CardHeader>
          <CardTitle className="text-lg text-[#2d1f17]">Ingested Document Repository</CardTitle>
          <CardDescription className="text-[#705849]">
            Indexed reference documents available for grounding Multi-AI Question Generation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-[#F2E6D8]">
            {documents.map((doc) => (
              <div key={doc.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#555934]/10 rounded-xl text-[#555934]">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#2d1f17]">{doc.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-[#705849] mt-0.5">
                      <span className="font-mono">{doc.filename}</span>
                      <span>•</span>
                      <span>{(doc.sizeBytes / 1024 / 1024).toFixed(1)} MB</span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-[#555934]">
                        <Layers className="h-3 w-3" />
                        {doc.chunkCount} Chunks
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs px-3 py-1 font-semibold rounded-full bg-[#555934]/12 text-[#555934]">
                    {doc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
