'use client';

import { X, ShieldCheck, Download, MapPin, Building, UserCheck, Hash } from 'lucide-react';
import { KarmayogiEmblemIcon } from '@/components/auth/KarmayogiEmblem';
import type { DemoPersona } from '@/lib/types';

interface OfficerDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  persona: DemoPersona;
  isHindi?: boolean;
}

export function OfficerDossierModal({
  isOpen,
  onClose,
  persona,
  isHindi = false,
}: OfficerDossierModalProps) {
  if (!isOpen) return null;

  const isSunita = persona.id.includes('sunita');
  const isAdmin = persona.role === 'admin' || persona.id.includes('rajesh');
  const isTrainer = persona.role === 'trainer' || persona.id.includes('priya');

  const employeeCode = isSunita
    ? 'MOSPI-FOD-2021-4921'
    : isAdmin
    ? 'MOSPI-ISS-1998-0042'
    : isTrainer
    ? 'MOSPI-NSSTA-2012-3081'
    : 'MOSPI-SSS-2022-8419';

  const cadreBatch = isSunita
    ? '2021 Cadre Batch'
    : isAdmin
    ? '1998 Cadre Batch (Senior SAG)'
    : isTrainer
    ? '2012 Faculty Batch'
    : '2022 Cadre Batch';

  const payMatrix = isSunita
    ? 'Level 5 (FOD)'
    : isAdmin
    ? 'Level 14 (Executive SAG)'
    : isTrainer
    ? 'Level 12 (Course Director)'
    : 'Level 7 (JSO Pay Band)';

  const postingStation = isSunita
    ? 'Regional Office, Patna (Field Operations Division)'
    : isAdmin
    ? 'Ministry Headquarters, Sardar Patel Bhawan, New Delhi'
    : isTrainer
    ? 'National Statistical Systems Training Academy (NSSTA), Greater Noida'
    : 'Survey Design & Research Division (SDRD), New Delhi';

  const fracBaseline = isAdmin
    ? '92% Executive Qualified (Level 4-5)'
    : isTrainer
    ? '88% Faculty Certified (Master Trainer)'
    : '71% Qualified (Level 3-4)';

  const handleDownloadPDF = () => {
    alert(
      isHindi
        ? `आधिकारिक सेवा पहचान पत्र डाउनलोड हो रहा है: ${persona.name} (${employeeCode})`
        : `Downloading Official Civil Service Dossier Card for ${persona.name} (${employeeCode})...`
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dossier-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-xl rounded-3xl bg-[#FAF6F0] border-2 border-[#BF9B7A]/40 shadow-2xl overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-[#555934] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 p-1 border border-white/20">
              <KarmayogiEmblemIcon className="h-7 w-7 text-[#F8C858]" />
            </div>
            <div>
              <h2 id="dossier-modal-title" className="text-sm font-black tracking-wide uppercase text-[#F8C858]">
                {isHindi ? 'भारत सरकार • आधिकारिक कैडर अभिलेख' : 'Government of India • Civil Service Dossier'}
              </h2>
              <p className="text-[11px] text-white/80">
                {isHindi
                  ? 'सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय'
                  : 'Ministry of Statistics & Programme Implementation (MoSPI)'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dossier modal"
            className="rounded-xl p-1.5 text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Identity Body */}
        <div className="p-6 space-y-5">
          {/* Top Officer Row */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#BF9B7A]/30 shadow-xs">
            <div className="h-16 w-16 rounded-2xl bg-[#555934] text-white flex items-center justify-center font-serif text-2xl font-black shadow-xs shrink-0">
              {persona.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-black text-[#2d1f17] truncate">
                  {persona.name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#555934]/15 text-[#555934] border border-[#555934]/30 shrink-0">
                  {persona.role.toUpperCase()}
                </span>
              </div>
              <p className="text-xs font-semibold text-[#8C5B3E] mt-0.5">
                {persona.designation}
              </p>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                <span className="font-mono font-bold text-[#555934]">{employeeCode}</span>
                <span>•</span>
                <span>{cadreBatch}</span>
              </div>
            </div>
          </div>

          {/* Dossier Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white border border-[#BF9B7A]/20 space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-bold">
                <Building className="h-3.5 w-3.5 text-[#8C5B3E]" />
                <span>{isHindi ? 'कैडर एवं सेवा' : 'Cadre & Service'}</span>
              </div>
              <p className="font-bold text-[#2d1f17]">{persona.cadre}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-[#BF9B7A]/20 space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-bold">
                <MapPin className="h-3.5 w-3.5 text-[#8C5B3E]" />
                <span>{isHindi ? 'वर्तमान पदस्थापना' : 'Current Posting'}</span>
              </div>
              <p className="font-bold text-[#2d1f17] truncate">{postingStation}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-[#BF9B7A]/20 space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-bold">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>{isHindi ? 'FRAC योग्यता आधार' : 'FRAC Competency Baseline'}</span>
              </div>
              <p className="font-bold text-emerald-700">{fracBaseline}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-[#BF9B7A]/20 space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-bold">
                <Hash className="h-3.5 w-3.5 text-[#8C5B3E]" />
                <span>{isHindi ? 'वेतन मैट्रिक्स स्तर' : 'Pay Matrix Band'}</span>
              </div>
              <p className="font-bold text-[#2d1f17]">{payMatrix}</p>
            </div>
          </div>

          {/* Verification Seal */}
          <div className="p-3.5 rounded-2xl bg-[#F8C858]/15 border border-[#F8C858]/35 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <UserCheck className="h-5 w-5 text-[#8C5B3E]" />
              <div>
                <p className="font-bold text-[#2d1f17]">
                  {isHindi ? 'iGOT कर्मयोगी सत्यापित अधिकारी' : 'iGOT Karmayogi Verified Officer'}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {isHindi ? 'केंद्रीय सांख्यिकी संगठन द्वारा प्रमाणित' : 'Statutory Central Statistical Registry Verified'}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold bg-white text-[#555934] px-2 py-1 rounded-md border border-[#BF9B7A]/30">
              VERIFIED
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#F2E6D8]/50 border-t border-[#BF9B7A]/25 flex items-center justify-between">
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#555934] text-white text-xs font-bold hover:bg-[#434728] transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-[#F8C858]" />
            <span>{isHindi ? 'पहचान पत्र डाउनलोड करें' : 'Download Service Card'}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-[#BF9B7A]/40 text-xs font-bold text-muted-foreground hover:bg-[#FAF6F0] transition-colors cursor-pointer"
          >
            {isHindi ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
