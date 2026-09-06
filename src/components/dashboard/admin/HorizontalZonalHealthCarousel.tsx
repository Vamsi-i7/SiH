'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Users, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import type { RegionalOfficeData } from './modals/RegionalDetailModal';

export interface ZonalHealthData {
  id: string;
  zoneName: string;
  regionalOffices: string;
  headcount: number;
  readinessPercent: number;
  avgLevel: string;
  errorRate: number;
  status: 'EXEMPLARY' | 'OPTIMAL' | 'MONITORING' | 'HIGH_RISK' | 'CRITICAL';
}

export const ZONAL_HEALTH_DATA: ZonalHealthData[] = [
  {
    id: 'zone-east',
    zoneName: 'Eastern Zone',
    regionalOffices: 'RO Patna, Kolkata, Bhubaneswar',
    headcount: 1550,
    readinessPercent: 58,
    avgLevel: 'L2.2',
    errorRate: 16.2,
    status: 'CRITICAL',
  },
  {
    id: 'zone-ce',
    zoneName: 'Central-East Zone',
    regionalOffices: 'RO Prayagraj, Lucknow, Varanasi',
    headcount: 940,
    readinessPercent: 62,
    avgLevel: 'L2.6',
    errorRate: 13.5,
    status: 'HIGH_RISK',
  },
  {
    id: 'zone-west',
    zoneName: 'Western Zone',
    regionalOffices: 'RO Mumbai, Pune, Nagpur, Ahmedabad',
    headcount: 890,
    readinessPercent: 76,
    avgLevel: 'L3.6',
    errorRate: 6.8,
    status: 'OPTIMAL',
  },
  {
    id: 'zone-south',
    zoneName: 'Southern Zone',
    regionalOffices: 'RO Thiruvananthapuram, Bengaluru, Chennai',
    headcount: 780,
    readinessPercent: 91,
    avgLevel: 'L4.6',
    errorRate: 2.4,
    status: 'EXEMPLARY',
  },
  {
    id: 'zone-north',
    zoneName: 'Northern Zone',
    regionalOffices: 'RO Chandigarh, Shimla, Jammu, Jaipur',
    headcount: 620,
    readinessPercent: 78,
    avgLevel: 'L3.8',
    errorRate: 5.9,
    status: 'OPTIMAL',
  },
  {
    id: 'zone-ne',
    zoneName: 'North-Eastern Zone',
    regionalOffices: 'RO Guwahati, Shillong, Imphal, Agartala',
    headcount: 380,
    readinessPercent: 69,
    avgLevel: 'L3.0',
    errorRate: 9.8,
    status: 'MONITORING',
  },
  {
    id: 'zone-hq',
    zoneName: 'HQ & National Accounts',
    regionalOffices: 'Sardar Patel Bhawan, CSO New Delhi',
    headcount: 340,
    readinessPercent: 86,
    avgLevel: 'L4.2',
    errorRate: 3.2,
    status: 'EXEMPLARY',
  },
];

interface HorizontalZonalHealthCarouselProps {
  onInspectZone?: (zone: RegionalOfficeData) => void;
  onDispatchTriage?: (zoneName: string) => void;
}

export function HorizontalZonalHealthCarousel({
  onInspectZone,
  onDispatchTriage,
}: HorizontalZonalHealthCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  const handleInspect = (zone: ZonalHealthData) => {
    if (onInspectZone) {
      onInspectZone({
        id: zone.id,
        name: `${zone.zoneName} (${zone.regionalOffices})`,
        zone: zone.zoneName,
        headcount: zone.headcount,
        readinessPercent: zone.readinessPercent,
        avgLevel: zone.avgLevel,
        errorRate: zone.errorRate,
        isFlagged: zone.status === 'CRITICAL' || zone.status === 'HIGH_RISK',
      });
    }
  };

  return (
    <section className="space-y-3" aria-label="Zonal Cadre Readiness Carousel">
      {/* Header with Navigation Controls */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#555934]" />
            <h2 className="text-sm sm:text-base font-black text-[#2d1f17] tracking-tight">
              National Zonal Health &amp; Cadre Readiness
            </h2>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#555934]/15 text-[#555934] border border-[#555934]/30">
              7 Zones Monitored
            </span>
          </div>
          <p className="text-xs text-[#705849] mt-0.5">
            Cross-zonal statistical capacity, scrutiny error rates, and rapid remedial intervention routing.
          </p>
        </div>

        {/* Carousel Navigation Arrows */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={scrollLeft}
            aria-label="Previous zones"
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white border border-[#BF9B7A]/30 text-[#705849] hover:bg-[#FAF6F0] hover:text-[#2d1f17] transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={scrollRight}
            aria-label="Next zones"
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white border border-[#BF9B7A]/30 text-[#705849] hover:bg-[#FAF6F0] hover:text-[#2d1f17] transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrolling Deck */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-3 pt-1 scroll-smooth snap-x snap-mandatory focus:outline-none"
        style={{ scrollbarWidth: 'thin' }}
      >
        {ZONAL_HEALTH_DATA.map((zone) => {
          const isCritical = zone.status === 'CRITICAL';
          const isHighRisk = zone.status === 'HIGH_RISK';
          const isOptimal = zone.status === 'OPTIMAL' || zone.status === 'EXEMPLARY';

          return (
            <div
              key={zone.id}
              className={`min-w-[310px] max-w-[320px] shrink-0 snap-start rounded-2xl p-4.5 bg-white border transition-all duration-150 hover:shadow-md flex flex-col justify-between ${
                isCritical
                  ? 'border-red-500/40 bg-gradient-to-b from-red-500/[0.03] to-white shadow-2xs'
                  : isHighRisk
                  ? 'border-amber-500/40 bg-gradient-to-b from-amber-500/[0.03] to-white shadow-2xs'
                  : 'border-[#BF9B7A]/30 shadow-2xs'
              }`}
            >
              <div className="space-y-3">
                {/* Zone Tag & Status Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold tracking-wider uppercase text-[#705849]">
                    <MapPin className="h-3 w-3 text-[#8C5B3E]" />
                    {zone.zoneName}
                  </span>

                  {isCritical ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-700 border border-red-500/30">
                      <AlertTriangle className="h-3 w-3" />
                      Critical Triage
                    </span>
                  ) : isHighRisk ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-800 border border-amber-500/30">
                      <ShieldAlert className="h-3 w-3" />
                      High Risk
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-800 border border-emerald-500/30">
                      <CheckCircle2 className="h-3 w-3" />
                      {zone.status === 'EXEMPLARY' ? 'Exemplary' : 'Optimal'}
                    </span>
                  )}
                </div>

                {/* Subtitle & Headcount */}
                <div>
                  <h3 className="font-bold text-sm text-[#2d1f17] truncate">
                    {zone.regionalOffices}
                  </h3>
                  <p className="text-[11px] text-[#705849] flex items-center gap-1.5 mt-0.5 font-mono">
                    <Users className="h-3.5 w-3.5 text-[#8C5B3E]" />
                    <span>{zone.headcount.toLocaleString()} Cadre Officers</span>
                    <span>•</span>
                    <span className="font-bold text-[#555934]">{zone.avgLevel}</span>
                  </p>
                </div>

                {/* Readiness Gauge & Error Rate */}
                <div className="space-y-1.5 p-3 rounded-xl bg-[#FAF6F0]/70 border border-[#BF9B7A]/20">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#705849] font-medium">Readiness Index</span>
                    <span className="font-mono font-bold text-[#2d1f17]">
                      {zone.readinessPercent}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#BF9B7A]/20 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isOptimal
                          ? 'bg-emerald-600'
                          : isHighRisk
                          ? 'bg-[#8C5B3E]'
                          : 'bg-red-600'
                      }`}
                      style={{ width: `${zone.readinessPercent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] pt-1">
                    <span className="text-[#705849]">Scrutiny Error Rate:</span>
                    <span
                      className={`font-mono font-bold ${
                        zone.errorRate > 12 ? 'text-red-700' : 'text-[#555934]'
                      }`}
                    >
                      {zone.errorRate}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#BF9B7A]/20">
                <button
                  type="button"
                  onClick={() => handleInspect(zone)}
                  className="flex-1 py-1.5 px-3 rounded-xl bg-[#FAF6F0] border border-[#BF9B7A]/40 text-xs font-bold text-[#555934] hover:bg-[#555934] hover:text-white transition-all cursor-pointer text-center"
                >
                  Inspect Zone
                </button>

                {(isCritical || isHighRisk) && (
                  <button
                    type="button"
                    onClick={() => onDispatchTriage && onDispatchTriage(zone.zoneName)}
                    className="py-1.5 px-3 rounded-xl bg-red-700 text-white text-xs font-bold hover:bg-red-800 transition-colors cursor-pointer shadow-2xs"
                  >
                    Triage
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
