'use client';

import React, { useRef } from 'react';
import { Download, ExternalLink, ShieldCheck, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

interface MoSPIFieldManualsShelfProps {
  isHindi?: boolean;
  onOpenManual?: (manualId: string) => void;
}

export function MoSPIFieldManualsShelf({
  isHindi = false,
  onOpenManual,
}: MoSPIFieldManualsShelfProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const manuals = [
    {
      id: 'manual-plfs-vol1',
      title: isHindi
        ? 'फील्ड स्टाफ के लिए निर्देश: भाग I (PLFS)'
        : 'Instructions to Field Staff: Vol. 1 (PLFS)',
      division: 'NSSO Field Operations Division',
      pages: '184 Pages',
      version: 'Ver 2026.1',
      progress: 68,
      description: isHindi
        ? 'गतिविधि स्थिति निर्धारण, एनआईसी/एनसीओ कोडिंग और घरेलू अनुसूची सर्वेक्षण नियम।'
        : 'Statutory guidelines on activity status determination, NIC/NCO coding, and household schedule canvassing.',
      tag: 'STATUTORY SOP',
      color: '#555934',
    },
    {
      id: 'manual-schedule-0',
      title: isHindi
        ? 'अनुसूची 0.0 परिवार सूचीकरण और सीमा निर्धारण हैंडबुक'
        : 'Schedule 0.0 Household Listing & Demarcation Handbook',
      division: 'Survey Design & Research Division (SDRD)',
      pages: '96 Pages',
      version: 'Ver 2025.4',
      progress: 100,
      description: isHindi
        ? 'जनगणना प्रगणना ब्लॉक सीमा पहचान और हेमलेट-समूह गठन के दिशा-निर्देश।'
        : 'Precise CEB landmark verification and hamlet-group formation rules to eliminate coverage errors.',
      tag: 'FIELD GUIDE',
      color: '#8C5B3E',
    },
    {
      id: 'manual-capi-handbook',
      title: isHindi
        ? 'कैपी टैबलेट संचालन और तुल्यकालन हैंडबुक'
        : 'ASHE & CAPI Tablet Operational Protocols',
      division: 'Data Processing Division (DPD), MoSPI',
      pages: '64 Pages',
      version: 'Ver 2026.2',
      progress: 45,
      description: isHindi
        ? 'ऑफ़लाइन डेटा संग्रह, जीपीएस सत्यापन और दैनिक सर्वर तुल्यकालन प्रक्रियाएं।'
        : 'Operational protocols for Android CAPI tablets, GPS validation bypass, and daily server sync.',
      tag: 'CAPI PROTOCOL',
      color: '#2d1f17',
    },
    {
      id: 'manual-nic-compendium',
      title: isHindi
        ? 'राष्ट्रीय औद्योगिक वर्गीकरण (NIC-2008) संग्रह'
        : 'National Industrial Classification (NIC-2008) Compendium',
      division: 'Central Statistics Office (CSO)',
      pages: '240 Pages',
      version: 'Ver 2024.1',
      progress: 30,
      description: isHindi
        ? 'असंगठित और संगठित विनिर्माण, व्यापार एवं सेवा गतिविधियों की 5-अंकीय संरचना।'
        : 'Comprehensive 5-digit hierarchy for industrial and informal manufacturing classifications.',
      tag: 'CLASSIFICATION',
      color: '#593E2E',
    },
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleOpen = (id: string) => {
    if (onOpenManual) {
      onOpenManual(id);
    } else {
      alert(`Accessing official MoSPI document: ${id}`);
    }
  };

  const handleDownload = (title: string, pages: string) => {
    alert(
      isHindi
        ? `आधिकारिक MoSPI पीडीएफ डाउनलोड हो रहा है: ${title} (${pages})`
        : `Downloading official MoSPI statutory manual: ${title} (${pages})...`
    );
  };

  return (
    <div className="rounded-3xl bg-white border border-[#BF9B7A]/30 p-5 sm:p-6 shadow-xs space-y-4">
      {/* Header & Controls */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#BF9B7A]/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#8C5B3E]" />
            <h2 className="text-base sm:text-lg font-bold text-[#2d1f17]">
              {isHindi ? 'आधिकारिक सांख्यिकी मैनुअल' : 'Official MoSPI Field Manuals'}
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#555934]/10 text-[#555934]">
              <ShieldCheck className="h-3 w-3" />
              {isHindi ? 'वैधानिक दस्तावेज' : 'Statutory'}
            </span>
          </div>
          <p className="text-xs text-[#705849] mt-0.5">
            {isHindi
              ? 'फील्ड सत्यापन और सांख्यिकीय संवीक्षा के लिए अधिकृत संदर्भ पुस्तकें'
              : 'Authoritative operational handbooks for field surveys, sampling frames, and CAPI operations.'}
          </p>
        </div>

        {/* Carousel slide controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Scroll manuals left"
            className="h-8 w-8 rounded-xl bg-[#FAF6F0] border border-[#BF9B7A]/35 flex items-center justify-center text-[#705849] hover:bg-[#F2E6D8] hover:text-[#2d1f17] transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Scroll manuals right"
            className="h-8 w-8 rounded-xl bg-[#FAF6F0] border border-[#BF9B7A]/35 flex items-center justify-center text-[#705849] hover:bg-[#F2E6D8] hover:text-[#2d1f17] transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel of Book Cards */}
      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {manuals.map((manual) => (
          <div
            key={manual.id}
            className="min-w-[280px] sm:min-w-[310px] max-w-[310px] rounded-2xl border border-[#BF9B7A]/30 bg-[#FAF6F0]/60 p-4 sm:p-5 flex flex-col justify-between hover:border-[#BF9B7A] hover:bg-[#FAF6F0] transition-all snap-start shadow-2xs group"
          >
            <div>
              {/* Hardcover Spine Accent */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#BF9B7A]/25 text-[#593E2E]">
                  {manual.tag}
                </span>
                <span className="text-[10px] font-mono text-[#705849]">
                  {manual.version}
                </span>
              </div>

              {/* Title & Icon */}
              <div className="flex items-start gap-3">
                <div
                  className="h-11 w-11 rounded-xl text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: manual.color }}
                >
                  <BookOpen className="h-5 w-5 text-[#F8C858]" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs sm:text-sm font-black text-[#2d1f17] group-hover:text-[#555934] transition-colors line-clamp-2 leading-snug">
                    {manual.title}
                  </h3>
                  <p className="text-[11px] text-[#705849] mt-0.5 truncate">
                    {manual.division}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-[#705849] mt-3 line-clamp-2 leading-relaxed">
                {manual.description}
              </p>

              {/* Reading Progress */}
              <div className="mt-4 pt-3 border-t border-[#BF9B7A]/20 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#705849]">{manual.pages}</span>
                  <span className="font-bold text-[#555934]">{manual.progress}% read</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[#BF9B7A]/20 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#555934] transition-all"
                    style={{ width: `${manual.progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-3 border-t border-[#BF9B7A]/20 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpen(manual.id)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#555934] text-white text-xs font-bold hover:bg-[#434728] transition-colors shadow-2xs cursor-pointer active:scale-[0.98]"
              >
                <BookOpen className="h-3.5 w-3.5 text-[#F8C858]" />
                <span>{isHindi ? 'पढ़ें (SOP)' : 'Read Online'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleDownload(manual.title, manual.pages)}
                title="Download Official PDF"
                className="p-2 rounded-xl bg-white border border-[#BF9B7A]/30 text-[#705849] hover:text-[#2d1f17] hover:bg-[#FAF6F0] transition-colors cursor-pointer shrink-0 active:scale-95"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer link */}
      <div className="pt-2 border-t border-[#BF9B7A]/20 flex items-center justify-between text-xs">
        <span className="text-[11px] text-[#705849]">
          {isHindi ? 'राष्ट्रीय सांख्यिकी पोर्टल संदर्भ' : 'MoSPI Digital Repository'}
        </span>
        <a
          href="https://www.mospi.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-[#555934] inline-flex items-center gap-1 hover:underline cursor-pointer"
        >
          <span>{isHindi ? 'MoSPI पोर्टल' : 'MoSPI.gov.in'}</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}

export default MoSPIFieldManualsShelf;
