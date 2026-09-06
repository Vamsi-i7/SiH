'use client';

import React from 'react';
import { FileText, Download, ExternalLink, ShieldCheck } from 'lucide-react';

interface MoSPIFieldManualsShelfProps {
  isHindi?: boolean;
}

export function MoSPIFieldManualsShelf({ isHindi = false }: MoSPIFieldManualsShelfProps) {
  const manuals = [
    {
      id: 'manual-plfs-vol1',
      title: isHindi
        ? 'फील्ड स्टाफ के लिए निर्देश: भाग I (PLFS)'
        : 'Instructions to Field Staff: Vol. 1 (PLFS)',
      division: 'NSSO Field Operations Division',
      pages: '184 Pages',
      version: 'Ver 2026.1',
      description: isHindi
        ? 'गतिविधि स्थिति निर्धारण, एनआईसी/एनसीओ कोडिंग और घरेलू अनुसूची सर्वेक्षण नियम।'
        : 'Statutory guidelines on activity status determination, NIC/NCO coding, and household schedule canvassing.',
      tag: 'STATUTORY SOP',
    },
    {
      id: 'manual-schedule-0',
      title: isHindi
        ? 'अनुसूची 0.0 परिवार सूचीकरण और सीमा निर्धारण हैंडबुक'
        : 'Schedule 0.0 Household Listing & Demarcation Handbook',
      division: 'Survey Design & Research Division (SDRD)',
      pages: '96 Pages',
      version: 'Ver 2025.4',
      description: isHindi
        ? 'जनगणना प्रगणना ब्लॉक सीमा पहचान और हेमलेट-समूह गठन के दिशा-निर्देश।'
        : 'Precise CEB landmark verification and hamlet-group formation rules to eliminate coverage errors.',
      tag: 'FIELD GUIDE',
    },
    {
      id: 'manual-capi-handbook',
      title: isHindi
        ? 'कैपी टैबलेट संचालन और तुल्यकालन हैंडबुक'
        : 'ASHE & CAPI Tablet Operational Protocols',
      division: 'Data Processing Division (DPD), MoSPI',
      pages: '64 Pages',
      version: 'Ver 2026.2',
      description: isHindi
        ? 'ऑफ़लाइन डेटा संग्रह, जीपीएस सत्यापन और दैनिक सर्वर तुल्यकालन प्रक्रियाएं।'
        : 'Operational protocols for Android CAPI tablets, GPS validation bypass, and daily server sync.',
      tag: 'CAPI PROTOCOL',
    },
  ];

  return (
    <div className="rounded-3xl bg-white border border-[#BF9B7A]/30 p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 pb-4 border-b border-[#BF9B7A]/20">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#8C5B3E]" />
            <h2 className="text-base font-bold text-[#2d1f17]">
              {isHindi ? 'आधिकारिक सांख्यिकी मैनुअल' : 'Official MoSPI Field Manuals'}
            </h2>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#555934]/10 text-[#555934]">
            <ShieldCheck className="h-3 w-3" />
            {isHindi ? 'वैधानिक दस्तावेज' : 'Statutory'}
          </span>
        </div>

        <p className="text-xs text-[#705849] mt-2 mb-4">
          {isHindi
            ? 'फील्ड सत्यापन और सांख्यिकीय संवीक्षा के लिए अधिकृत संदर्भ पुस्तकें'
            : 'Authoritative operational handbooks for field surveys, sampling frames, and CAPI operations.'}
        </p>

        <div className="space-y-3">
          {manuals.map((manual) => (
            <div
              key={manual.id}
              className="rounded-2xl border border-[#BF9B7A]/30 bg-[#FAF6F0]/60 p-4 hover:border-[#BF9B7A] transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#8C5B3E]/10 text-[#8C5B3E] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#8C5B3E] group-hover:text-white transition-colors">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#BF9B7A]/25 text-[#593E2E]">
                      {manual.tag}
                    </span>
                    <span className="text-[10px] font-mono text-[#705849]">
                      {manual.version}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-[#2d1f17] line-clamp-1 leading-snug">
                    {manual.title}
                  </h3>
                  <p className="text-[11px] text-[#705849] line-clamp-2 mt-1">
                    {manual.description}
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#BF9B7A]/20">
                    <span className="text-[10px] font-medium text-[#705849]">
                      {manual.division} • {manual.pages}
                    </span>
                    <button
                      type="button"
                      onClick={() => alert(`Accessing official MoSPI document: ${manual.title}`)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#555934] hover:text-[#434728]"
                    >
                      <Download className="h-3 w-3" />
                      <span>{isHindi ? 'डाउनलोड' : 'PDF'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-[#BF9B7A]/20 flex items-center justify-between">
        <span className="text-[11px] text-[#705849]">
          {isHindi ? 'राष्ट्रीय सांख्यिकी पोर्टल संदर्भ' : 'MoSPI Digital Repository'}
        </span>
        <a
          href="https://www.mospi.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-[#555934] inline-flex items-center gap-1 hover:underline"
        >
          <span>{isHindi ? 'MoSPI पोर्टल' : 'MoSPI.gov.in'}</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
