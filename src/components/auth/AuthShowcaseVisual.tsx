'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar as CalendarIcon, X } from 'lucide-react';
import { KarmayogiEmblemIcon } from './KarmayogiEmblem';

export function AuthShowcaseVisual() {
  const router = useRouter();

  const handleClose = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="relative w-full h-full min-h-[540px] lg:min-h-[640px] rounded-[28px] sm:rounded-[32px] overflow-hidden shadow-2xl flex flex-col justify-between p-6 sm:p-8 select-none">
      {/* Background Photography Asset */}
      <div className="absolute inset-0">
        <Image
          src="/images/auth-showcase.jpg"
          alt="MoSPI Statistical Officers Collaborating"
          fill
          priority
          className="object-cover object-center transform scale-105 transition-transform duration-1000 hover:scale-100"
        />
        {/* Warm photographic grading & vignette overlay matching StatVidya palette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2d1f17]/85 via-[#2d1f17]/35 to-[#2d1f17]/25" />
        <div className="absolute inset-0 bg-[#555934]/15 mix-blend-multiply" />
      </div>

      {/* Top Header Row with Floating Amber Pill and Close / Home Link */}
      <div className="relative z-10 flex items-start justify-between gap-3">
        {/* Floating Golden/Amber Notification Card (Matching Reference Image) */}
        <div className="bg-[#F8C858] text-[#2d1f17] rounded-2xl px-3.5 py-2 shadow-xl border border-white/40 flex items-center gap-2.5 max-w-[260px] animate-in fade-in slide-in-from-top-2">
          <div className="h-8 w-8 rounded-full bg-white/90 p-1 flex items-center justify-center shrink-0 shadow-xs">
            <KarmayogiEmblemIcon className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold leading-tight truncate">
              Task Review With Team
            </p>
            <p className="text-[10px] font-medium text-[#593E2E] mt-0.5">
              09:30am - 10:00am • NSSO FOD
            </p>
          </div>
        </div>

        {/* Home / Return and Close Buttons */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/90 hover:bg-white text-[#2d1f17] text-xs font-bold shadow-lg backdrop-blur-md transition-all hover:scale-105 active:scale-95 group cursor-pointer"
            title="Return to StatVidya Home"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform text-[#555934]" />
            <span>Home</span>
          </Link>
          <button
            type="button"
            onClick={handleClose}
            className="h-8.5 w-8.5 rounded-full bg-white/90 hover:bg-white text-[#2d1f17] shadow-lg backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer group"
            title="Close and go back"
            aria-label="Close and go back"
          >
            <X className="h-4 w-4 text-[#593E2E] group-hover:rotate-90 transition-transform" />
          </button>
        </div>
      </div>

      {/* Floating Cadre Officer Avatar Circles (Right Margin, matching reference) */}
      <div className="relative z-10 flex justify-end pr-2 -my-2">
        <div className="flex flex-col -space-y-3 items-center">
          <div className="h-11 w-11 rounded-full border-2 border-white shadow-lg overflow-hidden bg-amber-100 flex items-center justify-center text-xs font-bold text-[#593E2E]" title="Sunita Devi (NSSO FOD)">
            SD
          </div>
          <div className="h-11 w-11 rounded-full border-2 border-white shadow-lg overflow-hidden bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-900" title="Amit Sharma (SSS JSO)">
            AS
          </div>
          <div className="h-10 w-10 rounded-full border-2 border-white shadow-lg overflow-hidden bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-900" title="Dr. Priya Verma (NSSTA)">
            PV
          </div>
        </div>
      </div>

      {/* Floating Middle Glassmorphic Calendar & Verification Card (Matching Reference Image) */}
      <div className="relative z-10 space-y-4">
        <div className="backdrop-blur-md bg-white/20 border border-white/35 text-white rounded-2xl p-4 shadow-2xl max-w-sm ml-auto">
          <div className="flex items-center justify-between text-xs font-medium text-white/90 mb-2.5">
            <span className="flex items-center gap-1.5">
              <CalendarIcon className="h-3.5 w-3.5 text-[#F8C858]" />
              <span>Schedule 0.0 Scrutiny</span>
            </span>
            <span className="text-[10px] font-bold bg-[#F8C858] text-[#2d1f17] px-2 py-0.5 rounded-full">
              94.8% Accuracy
            </span>
          </div>

          {/* Calendar Strip */}
          <div className="grid grid-cols-7 gap-1 text-center font-sans">
            {[
              { day: 'Sun', date: '22', active: false },
              { day: 'Mon', date: '23', active: false },
              { day: 'Tue', date: '24', active: false },
              { day: 'Wed', date: '25', active: true },
              { day: 'Thu', date: '26', active: false },
              { day: 'Fri', date: '27', active: false },
              { day: 'Sat', date: '28', active: false },
            ].map((item) => (
              <div
                key={item.date}
                className={`py-1.5 rounded-xl transition-all ${
                  item.active
                    ? 'bg-[#F8C858] text-[#2d1f17] font-bold shadow-md'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                <span className="block text-[9px] uppercase tracking-wider">{item.day}</span>
                <span className="block text-xs font-bold mt-0.5">{item.date}</span>
              </div>
            ))}
          </div>

          {/* Diagonal hatch / pattern strip */}
          <div className="h-4 mt-2.5 rounded-md bg-white/10 border border-white/20 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[size:10px_10px]" />
        </div>

        {/* Floating Bottom Card: Daily Cadre Meeting with Avatars (Matching Reference Image) */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/60 text-[#2d1f17] max-w-xs animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#2d1f17]">
              Daily Meeting
            </span>
            <span className="h-2 w-2 rounded-full bg-[#F8C858]" />
          </div>
          <p className="text-[11px] text-[#705849] mt-0.5 font-medium">
            12:00pm - 01:00pm • FRAC Calibration
          </p>

          <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
            {/* Avatar Stack */}
            <div className="flex items-center -space-x-2">
              <div className="h-7 w-7 rounded-full bg-[#555934] text-white flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-xs">
                SD
              </div>
              <div className="h-7 w-7 rounded-full bg-[#BF9B7A] text-white flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-xs">
                AS
              </div>
              <div className="h-7 w-7 rounded-full bg-[#8C5B3E] text-white flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-xs">
                PV
              </div>
              <div className="h-7 w-7 rounded-full bg-[#593E2E] text-white flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-xs">
                RK
              </div>
            </div>

            <span className="text-[10px] font-semibold text-[#555934] bg-[#555934]/10 px-2 py-0.5 rounded-full">
              4 Cadres Synced
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
