'use client';

import React from 'react';
import Image from 'next/image';

/**
 * Official Karmayogi Bharat Horizontal Wordmark + Emblem
 * Used prominently on Login, Registration, and Landing navigation
 */
export function KarmayogiHorizontalLogo({ className = 'h-12 w-auto' }: { className?: string }) {
  return (
    <div className="inline-flex items-center">
      <Image
        src="/images/karmayogi-logo-horizontal.jpg"
        alt="कर्मयोगी भारत — लोकहितं मम करणीयम्"
        width={260}
        height={65}
        className={`object-contain mix-blend-multiply ${className}`}
        priority
      />
    </div>
  );
}

/**
 * Official Karmayogi Bharat Icon / Pen-Nib Emblem
 * Used in compact avatars, pills, badges, and sidebar headers
 */
export function KarmayogiEmblemIcon({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <div className="inline-flex items-center justify-center shrink-0">
      <Image
        src="/images/karmayogi-emblem.jpg"
        alt="Karmayogi Bharat Emblem"
        width={80}
        height={80}
        className={`object-contain mix-blend-multiply ${className}`}
        priority
      />
    </div>
  );
}

/**
 * Backwards-compatible KarmayogiBharatLogo rendering the official horizontal lockup
 */
export function KarmayogiBharatLogo({ className = 'h-14 w-auto' }: { className?: string }) {
  return <KarmayogiHorizontalLogo className={className} />;
}

/**
 * Official Parichay Key Emblem (National Single Sign-On - NIC)
 */
export function ParichayKeyLogo({ className = 'h-12 w-12' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center rounded-full bg-[#EA892B] p-2 text-white shadow-md ${className}`}>
      <div className="flex flex-col items-center justify-center text-center">
        <div className="flex items-center">
          <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          <span className="font-extrabold text-xs tracking-tighter ml-0.5">ARICHAY</span>
        </div>
        <span className="text-[6px] font-medium tracking-wide text-white/90">
          Simple. Simplified. Safe
        </span>
      </div>
    </div>
  );
}

/**
 * Geometric Hexagonal Network Grid Pattern for Infographic / Visual Backgrounds
 */
export function HexagonalNetworkPattern() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hex-grid" width="60" height="103.923" patternUnits="userSpaceOnUse">
            <path
              d="M30 0 L60 17.32 L60 51.96 L30 69.28 L0 51.96 L0 17.32 Z M30 103.92 L60 86.6 L60 51.96 L30 69.28 L0 51.96 L0 86.6 Z"
              fill="none"
              stroke="#60A5FA"
              strokeWidth="0.75"
              strokeOpacity="0.4"
            />
            <circle cx="30" cy="0" r="2" fill="#93C5FD" fillOpacity="0.7" />
            <circle cx="60" cy="17.32" r="1.5" fill="#93C5FD" fillOpacity="0.5" />
            <circle cx="0" cy="17.32" r="1.5" fill="#93C5FD" fillOpacity="0.5" />
            <circle cx="30" cy="69.28" r="2" fill="#93C5FD" fillOpacity="0.7" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex-grid)" />
      </svg>
    </div>
  );
}
