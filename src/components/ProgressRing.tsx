'use client';

import React from 'react';

interface ProgressRingProps {
  value: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  showPercentage?: boolean;
  className?: string;
  color?: string;
  trendDelta?: string; // e.g. "+8% vs last"
}

export function ProgressRing({
  value,
  size = 120,
  strokeWidth = 10,
  label,
  sublabel,
  showPercentage = true,
  className = '',
  color,
  trendDelta,
}: ProgressRingProps) {
  const normalizedValue = Math.min(Math.max(value, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;

  // Determine stroke color based on value if not provided
  const getRingColor = (val: number) => {
    if (color) return color;
    if (val >= 80) return 'text-[#555934]';
    if (val >= 50) return 'text-[#BF9B7A]';
    return 'text-[#8C5B3E]';
  };

  return (
    <div className={`relative inline-flex flex-col items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        aria-valuenow={normalizedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        role="progressbar"
      >
        {/* Subtle inner background disc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          className="text-[#E8DACB]"
        />
        {/* Progress stroke */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          className={`transition-all duration-1000 ease-out ${getRingColor(normalizedValue)}`}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
        {showPercentage && (
          <span className="text-3xl font-bold tracking-tight text-[#2d1f17] font-mono leading-none">
            {Math.round(normalizedValue)}%
          </span>
        )}
        {label && (
          <span className="text-[11px] font-semibold text-[#705849] uppercase tracking-wider mt-1">
            {label}
          </span>
        )}
        {trendDelta && (
          <span className="mt-1 inline-flex items-center rounded-full bg-[#555934]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#555934] border border-[#555934]/25 font-mono">
            {trendDelta}
          </span>
        )}
      </div>

      {sublabel && (
        <span className="mt-2.5 text-xs text-muted-foreground text-center font-medium">
          {sublabel}
        </span>
      )}
    </div>
  );
}

export default ProgressRing;
