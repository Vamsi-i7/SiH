'use client';

import { X, Award, Flame, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface LearnerKarmaLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  points?: number;
  isHindi?: boolean;
}

export function LearnerKarmaLedgerModal({
  isOpen,
  onClose,
  points = 550,
  isHindi = false,
}: LearnerKarmaLedgerModalProps) {
  if (!isOpen) return null;

  const activities = [
    {
      id: 'act-1',
      title: isHindi
        ? 'अनुसूची 0.0 परिवार सूचीकरण एवं सीमा निर्धारण सिमुलेशन'
        : 'Schedule 0.0 Household Demarcation & Listing Drill',
      date: 'Today, 10:24 AM',
      points: '+150 KP',
      category: 'Field Drill',
    },
    {
      id: 'act-2',
      title: isHindi
        ? 'पीएलएफएस 5-अंकीय एनआईसी/एनसीओ कोडिंग मूल्यांकन'
        : 'PLFS 5-Digit NIC/NCO Coding Challenge',
      date: 'Yesterday, 04:15 PM',
      points: '+200 KP',
      category: 'Assessment',
    },
    {
      id: 'act-3',
      title: isHindi
        ? 'सांख्यिकी संवीक्षा विसंगति पर्ची समाधान'
        : 'Statistical Scrutiny Query Resolution Drill',
      date: '04 Sep 2026',
      points: '+200 KP',
      category: 'Validation',
    },
  ];

  const badges = [
    {
      name: isHindi ? 'फील्ड सीमांकन विशेषज्ञ' : 'Field Demarcation Ace',
      desc: isHindi ? 'सीईबी सीमाओं का सही मानचित्रण' : 'Verified CEB Boundary Mapper',
      icon: ShieldCheck,
      color: 'text-emerald-700 bg-emerald-500/15 border-emerald-500/30',
    },
    {
      name: isHindi ? 'जीपीएस सटीकता बाज' : 'GPS Accuracy Hawk',
      desc: isHindi ? '100% मान्य निर्देशांक' : '100% Valid CAPI Coordinates',
      icon: Sparkles,
      color: 'text-[#8C5B3E] bg-[#8C5B3E]/15 border-[#8C5B3E]/30',
    },
    {
      name: isHindi ? 'शून्य-त्रुटि विवरणी' : 'Zero Query Return',
      desc: isHindi ? 'दोषरहित अनुसूची संवीक्षा' : 'Flawless Schedule 10.4 Return',
      icon: CheckCircle2,
      color: 'text-[#555934] bg-[#555934]/15 border-[#555934]/30',
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="karma-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-[#FAF6F0] border-2 border-[#BF9B7A]/40 shadow-2xl overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-[#8C5B3E] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 p-1 border border-white/20">
              <Award className="h-6 w-6 text-[#F8C858]" />
            </div>
            <div>
              <h2 id="karma-modal-title" className="text-sm font-black tracking-wide uppercase text-[#F8C858]">
                {isHindi ? 'कर्मयोगी भारत • क्षमता प्रोत्साहन लेजर' : 'Karmayogi Bharat • Karma Ledger'}
              </h2>
              <p className="text-[11px] text-white/80">
                {isHindi ? 'अधिकारी अंक, स्तर एवं उपलब्धि बैज' : 'Officer Competency Points, Tier & Badges'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close karma modal"
            className="rounded-xl p-1.5 text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Top Score Bento */}
          <div className="rounded-2xl bg-white border border-[#BF9B7A]/30 p-5 shadow-xs flex items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#705849]">
                {isHindi ? 'कुल संचित कर्म अंक' : 'Total Accumulated Karma Points'}
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-black font-mono text-[#8C5B3E]">+{points}</span>
                <span className="text-xs font-bold text-[#555934]">KP</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F8C858]/25 text-[#8C5B3E] border border-[#F8C858]/40">
                  {isHindi ? 'स्तर 3 • वरिष्ठ संवीक्षा सहयोगी' : 'Level 3 • Senior Scrutiny Associate'}
                </span>
              </div>
            </div>

            {/* Learning Streak */}
            <div className="rounded-2xl bg-[#FAF6F0] border border-[#BF9B7A]/30 p-3.5 text-center shrink-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-amber-500/20 text-amber-600 mx-auto mb-1">
                <Flame className="h-5 w-5 fill-amber-500 text-amber-600" />
              </div>
              <span className="text-sm font-black text-[#2d1f17]">4 Days</span>
              <p className="text-[9px] font-bold text-[#705849] uppercase tracking-wider">
                {isHindi ? 'सक्रिय स्ट्रीक' : 'Active Streak'}
              </p>
            </div>
          </div>

          {/* Badges Showcase */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#705849] mb-2.5">
              {isHindi ? 'अर्जित कैडर बैज' : 'Earned Cadre Badges'}
            </h3>
            <div className="grid grid-cols-3 gap-2.5">
              {badges.map((b, i) => {
                const Icon = b.icon;
                return (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-white border border-[#BF9B7A]/20 flex flex-col items-center text-center space-y-1.5 shadow-2xs"
                  >
                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center border ${b.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-[11px] font-bold text-[#2d1f17] leading-tight line-clamp-1">
                      {b.name}
                    </span>
                    <span className="text-[9px] text-[#705849] line-clamp-1">{b.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Ledger History */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#705849]">
                {isHindi ? 'हालिया अंक इतिहास' : 'Recent Points Ledger'}
              </h3>
              <span className="text-[10px] text-[#555934] font-bold">iGOT Synced</span>
            </div>
            <div className="space-y-2">
              {activities.map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-xl bg-white border border-[#BF9B7A]/20 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <p className="font-bold text-[#2d1f17] truncate">{act.title}</p>
                    <p className="text-[10px] text-[#705849] mt-0.5">
                      {act.category} • {act.date}
                    </p>
                  </div>
                  <span className="font-mono font-bold text-[#8C5B3E] shrink-0 bg-[#F8C858]/20 px-2 py-0.5 rounded-md text-[11px]">
                    {act.points}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#F2E6D8]/50 border-t border-[#BF9B7A]/25 flex items-center justify-between">
          <span className="text-[11px] text-[#705849]">
            {isHindi
              ? 'अंक राष्ट्रीय सिविल सेवा पोर्टल पर सिंक किए जाते हैं'
              : 'Points sync to National Civil Service Profile (iGOT)'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#555934] text-white text-xs font-bold hover:bg-[#434728] transition-colors cursor-pointer"
          >
            {isHindi ? 'ठीक है' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
