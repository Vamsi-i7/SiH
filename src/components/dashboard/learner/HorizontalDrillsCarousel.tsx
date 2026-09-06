'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Award, Clock } from 'lucide-react';

export interface DrillCardItem {
  id: string;
  title: string;
  title_hi: string;
  tag: string;
  cadre: string;
  duration: string;
  level: 'Foundational' | 'Intermediate' | 'Advanced';
  points: string;
  status: 'In Progress' | 'Recommended' | 'Active Drill' | 'Verified';
  description: string;
  description_hi: string;
}

export const DRILL_CARD_ITEMS: DrillCardItem[] = [
  {
    id: 'drill-schedule-0',
    title: 'Schedule 0.0: Household Demarcation & Listing',
    title_hi: 'अनुसूची 0.0: परिवार सूचीकरण एवं सीमा निर्धारण',
    tag: 'FIELD DEMARCATION',
    cadre: 'NSSO FOD • PLFS',
    duration: '8 mins',
    level: 'Intermediate',
    points: '+50 KP',
    status: 'Active Drill',
    description: 'Master CEB boundary verification, physical landmark tracing, and hamlet-group subdivision rules.',
    description_hi: 'सीईबी सीमा सत्यापन, भौतिक स्थल अनुरेखण और हेमलेट-समूह उप-विभाजन नियमों में दक्षता प्राप्त करें।',
  },
  {
    id: 'drill-nic-coding',
    title: 'NIC-2008 & NCO-2015 5-Digit Coding Challenge',
    title_hi: 'एनआईसी-2008 एवं एनसीओ-2015 5-अंकीय कोडिंग चुनौती',
    tag: 'ECONOMIC CODING',
    cadre: 'SDRD • DQAD',
    duration: '10 mins',
    level: 'Advanced',
    points: '+75 KP',
    status: 'Recommended',
    description: 'Disambiguate primary vs subsidiary economic activity status across informal sector manufacturing & trade.',
    description_hi: 'अनौपचारिक क्षेत्र विनिर्माण एवं व्यापार में प्राथमिक बनाम सहायक गतिविधि स्थिति का सटीक वर्गीकरण।',
  },
  {
    id: 'drill-ashe-valuation',
    title: 'ASHE 2026: Capital Asset & Enterprise Valuation',
    title_hi: 'एएसएचई 2026: पूंजीगत संपत्ति एवं उद्यम मूल्यांकन',
    tag: 'ENTERPRISE SURVEY',
    cadre: 'DPD • CSO',
    duration: '12 mins',
    level: 'Advanced',
    points: '+100 KP',
    status: 'Recommended',
    description: 'Statutory valuation of gross fixed assets, operating surplus, and depreciation for unorganized firms.',
    description_hi: 'असंगठित उद्यमों के लिए सकल स्थाई संपत्ति, परिचालन अधिशेष और मूल्यह्रास का वैधानिक मूल्यांकन।',
  },
  {
    id: 'drill-capi-gps',
    title: 'CAPI Android Tablet: GPS Buffer & Error Handling',
    title_hi: 'कैपी एंड्रॉइड टैबलेट: जीपीएस बफर एवं त्रुटि समाधान',
    tag: 'CAPI PROTOCOL',
    cadre: 'FOD Bihar • Field Tech',
    duration: '5 mins',
    level: 'Foundational',
    points: '+35 KP',
    status: 'In Progress',
    description: 'Handling satellite geometry lock errors, offline encryption cache, and zero-coverage fallback.',
    description_hi: 'उपग्रह जियोमेट्री लॉक त्रुटि, ऑफ़लाइन एन्क्रिप्शन कैश और शून्य-कवरेज बैकअप संचालन।',
  },
  {
    id: 'drill-scrutiny-returns',
    title: 'NSSO 80th Round: Query Slip & Scrutiny Resolution',
    title_hi: 'एनएसएसओ 80वां दौर: विसंगति पर्ची एवं संवीक्षा समाधान',
    tag: 'STATISTICAL SCRUTINY',
    cadre: 'SSS Cadre • DQAD',
    duration: '7 mins',
    level: 'Intermediate',
    points: '+50 KP',
    status: 'Verified',
    description: 'Detecting outlier household consumer expenditures and resolving inter-schedule discrepancy slips.',
    description_hi: 'पारिवारिक उपभोक्ता व्यय में असंगत प्रविष्टियों की पहचान और अनुसूची विसंगति पर्चियों का त्वरित समाधान।',
  },
];

interface HorizontalDrillsCarouselProps {
  onStartDrill: (drillId: string) => void;
  isHindi?: boolean;
}

export function HorizontalDrillsCarousel({
  onStartDrill,
  isHindi = false,
}: HorizontalDrillsCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="rounded-3xl bg-white border border-[#BF9B7A]/30 p-5 sm:p-6 shadow-xs space-y-4">
      {/* Header & Controls */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#BF9B7A]/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#8C5B3E]" />
            <h2 className="text-base sm:text-lg font-bold text-[#2d1f17]">
              {isHindi ? 'प्राथमिकता फील्ड एवं डेस्क अभ्यास' : 'Priority Field & Desk Drills'}
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#F8C858]/20 text-[#8C5B3E] hidden sm:inline">
              5 Available
            </span>
          </div>
          <p className="text-xs text-[#705849] mt-0.5">
            {isHindi
              ? 'आधिकारिक परिदृश्यों पर आधारित छोटे अभ्यास • तत्काल अंक और वैधानिक नियम व्याख्या'
              : 'Micro-simulations on authentic MoSPI scenarios • Instant feedback and manual citations'}
          </p>
        </div>

        {/* Carousel Slide Arrows */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Scroll drills carousel left"
            className="h-8 w-8 rounded-xl bg-[#FAF6F0] border border-[#BF9B7A]/35 flex items-center justify-center text-[#705849] hover:bg-[#F2E6D8] hover:text-[#2d1f17] transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Scroll drills carousel right"
            className="h-8 w-8 rounded-xl bg-[#FAF6F0] border border-[#BF9B7A]/35 flex items-center justify-center text-[#705849] hover:bg-[#F2E6D8] hover:text-[#2d1f17] transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Deck */}
      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {DRILL_CARD_ITEMS.map((drill) => {
          const title = isHindi ? drill.title_hi : drill.title;
          const description = isHindi ? drill.description_hi : drill.description;

          return (
            <div
              key={drill.id}
              className="min-w-[280px] sm:min-w-[320px] max-w-[320px] rounded-2xl border border-[#BF9B7A]/30 bg-[#FAF6F0]/60 p-4 sm:p-5 flex flex-col justify-between hover:border-[#BF9B7A] hover:bg-[#FAF6F0] transition-all snap-start shadow-2xs group"
            >
              <div>
                {/* Top badges */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[#BF9B7A]/25 text-[#593E2E]">
                    {drill.tag}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[#8C5B3E] bg-[#F8C858]/25 px-2 py-0.5 rounded-full border border-[#F8C858]/40">
                    <Award className="h-3 w-3" />
                    {drill.points}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-black text-[#2d1f17] group-hover:text-[#555934] transition-colors line-clamp-2 leading-snug">
                  {title}
                </h3>

                {/* Subtitle / Cadre */}
                <p className="text-[11px] font-medium text-[#705849] mt-1 truncate">
                  {drill.cadre}
                </p>

                {/* Description */}
                <p className="text-xs text-[#705849] mt-2 line-clamp-2 leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Card Footer & Action */}
              <div className="mt-4 pt-3 border-t border-[#BF9B7A]/20">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#705849] mb-3">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-[#8C5B3E]" />
                    {drill.duration}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md font-sans text-[10px] font-bold ${
                      drill.level === 'Foundational'
                        ? 'bg-blue-500/15 text-blue-700'
                        : drill.level === 'Intermediate'
                          ? 'bg-amber-500/15 text-amber-800'
                          : 'bg-purple-500/15 text-purple-700'
                    }`}
                  >
                    {drill.level}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onStartDrill(drill.id)}
                  className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-[#555934] text-white text-xs font-bold hover:bg-[#434728] transition-colors shadow-2xs cursor-pointer group-hover:shadow-xs active:scale-[0.98]"
                >
                  <Play className="h-3 w-3 fill-current text-[#F8C858]" />
                  <span>{isHindi ? 'अभ्यास प्रारंभ' : 'Start Drill'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
