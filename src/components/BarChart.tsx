'use client';

import React from 'react';

interface BarChartProps {
  label: string;
  value: number; // 0 - 100
  max?: number;
  highlightThreshold?: number;
}

export function BarChart({ label, value, max = 100, highlightThreshold = 50 }: BarChartProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const barColor =
    value >= 70
      ? 'bg-emerald-500'
      : value >= highlightThreshold
        ? 'bg-amber-500'
        : 'bg-rose-500';

  return (
    <div className="w-full space-y-1">
      <div className="flex justify-between text-xs">
        <span className="font-medium text-foreground">{label}</span>
        <span className="font-bold text-muted-foreground">{value}%</span>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
