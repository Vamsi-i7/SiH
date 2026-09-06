'use client';

import React, { useState } from 'react';
import { SYNTHETIC_SURVEY_OUTCOMES } from '@/data/surveyScrutinyMetrics';
import { calculateLinearRegression } from '@/services/adminService';
import { ShieldAlert, Info } from 'lucide-react';

export function OutcomeCorrelationChart() {
  const [activeMetricId, setActiveMetricId] = useState(SYNTHETIC_SURVEY_OUTCOMES[0].id);

  const selectedSeries =
    SYNTHETIC_SURVEY_OUTCOMES.find((s) => s.id === activeMetricId) ||
    SYNTHETIC_SURVEY_OUTCOMES[0];

  // Convert data points to {x, y} for regression
  const regressionPoints = selectedSeries.dataPoints.map((p) => ({
    x: p.competencyLevel,
    y: p.errorRatePercent,
  }));

  const regression = calculateLinearRegression(regressionPoints);

  // SVG Chart dimensions
  const svgWidth = 560;
  const svgHeight = 240;
  const padding = { top: 25, right: 35, bottom: 40, left: 45 };

  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  // Domain & Range
  const minX = 1;
  const maxX = 5;
  const minY = 0;
  const maxY = 25;

  const scaleX = (x: number) => padding.left + ((x - minX) / (maxX - minX)) * plotWidth;
  const scaleY = (y: number) => padding.top + plotHeight - ((y - minY) / (maxY - minY)) * plotHeight;

  // Compute trendline coordinates
  const lineX1 = 1;
  const lineY1 = regression.isComputable ? regression.slope * lineX1 + regression.intercept : 20;
  const lineX2 = 5;
  const lineY2 = regression.isComputable ? regression.slope * lineX2 + regression.intercept : 2;

  return (
    <div className="rounded-3xl bg-white border border-[#BF9B7A]/30 p-6 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header & Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#BF9B7A]/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#555934]" />
              <h2 className="text-base sm:text-lg font-bold text-[#2d1f17]">
                Survey Scrutiny Outcome Correlation (PRD §9.4.5)
              </h2>
            </div>
            <p className="text-xs text-[#705849] mt-0.5">
              Empirical correlation between field competency levels and subsequent schedule scrutiny error rates
            </p>
          </div>

          {/* FR-TRUST-1 Synthetic Demo Data Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <span
              title="Simulated benchmark based on NSS 78th Round Scrutiny Guidelines (PRD §9.4.5)"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-[#BF9B7A]/20 text-[#593E2E] border border-[#BF9B7A]/30"
            >
              <ShieldAlert className="h-3 w-3 text-[#8C5B3E]" />
              SYNTHETIC DEMO DATA
            </span>
          </div>
        </div>

        {/* Series Selector Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          {SYNTHETIC_SURVEY_OUTCOMES.map((series) => (
            <button
              key={series.id}
              type="button"
              onClick={() => setActiveMetricId(series.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeMetricId === series.id
                  ? 'bg-[#555934] text-white shadow-2xs'
                  : 'bg-[#FAF6F0] text-[#705849] border border-[#BF9B7A]/30 hover:bg-[#FAF6F0]/80'
              }`}
            >
              {series.metricName}
            </button>
          ))}
        </div>

        {/* Regression Fit Summary Pill Banner */}
        <div className="grid grid-cols-3 gap-2.5 mt-4 p-3 rounded-2xl bg-[#FAF6F0]/80 border border-[#BF9B7A]/25 text-xs font-mono">
          <div>
            <span className="text-[10px] font-sans font-bold text-[#705849] block">R² Goodness of Fit</span>
            <span className="text-sm font-black text-[#2d1f17]">{selectedSeries.rSquared}</span>
          </div>
          <div>
            <span className="text-[10px] font-sans font-bold text-[#705849] block">Regression Slope</span>
            <span className="text-sm font-black text-[#8C5B3E]">{selectedSeries.regressionSlope}% / level</span>
          </div>
          <div>
            <span className="text-[10px] font-sans font-bold text-[#705849] block">Significance (p-value)</span>
            <span className="text-sm font-black text-emerald-700">p = {selectedSeries.pValue}</span>
          </div>
        </div>

        {/* SVG Scatter Chart */}
        <div className="mt-4 w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto max-w-[560px] mx-auto overflow-visible select-none"
          >
            {/* Grid lines */}
            {[5, 10, 15, 20].map((yVal) => (
              <g key={yVal}>
                <line
                  x1={padding.left}
                  y1={scaleY(yVal)}
                  x2={svgWidth - padding.right}
                  y2={scaleY(yVal)}
                  stroke="#BF9B7A"
                  strokeOpacity="0.2"
                  strokeDasharray="3 3"
                />
                <text
                  x={padding.left - 8}
                  y={scaleY(yVal) + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="#705849"
                  fontFamily="monospace"
                >
                  {yVal}%
                </text>
              </g>
            ))}

            {/* X-axis levels */}
            {[1, 2, 3, 4, 5].map((xVal) => (
              <g key={xVal}>
                <line
                  x1={scaleX(xVal)}
                  y1={padding.top}
                  x2={scaleX(xVal)}
                  y2={scaleY(0)}
                  stroke="#BF9B7A"
                  strokeOpacity="0.15"
                />
                <text
                  x={scaleX(xVal)}
                  y={scaleY(0) + 16}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#705849"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  L{xVal}
                </text>
              </g>
            ))}

            {/* Axes Lines */}
            <line
              x1={padding.left}
              y1={scaleY(0)}
              x2={svgWidth - padding.right}
              y2={scaleY(0)}
              stroke="#BF9B7A"
              strokeWidth="1.5"
            />
            <line
              x1={padding.left}
              y1={padding.top}
              x2={padding.left}
              y2={scaleY(0)}
              stroke="#BF9B7A"
              strokeWidth="1.5"
            />

            {/* Linear Regression Trendline */}
            <line
              x1={scaleX(lineX1)}
              y1={scaleY(Math.min(maxY, Math.max(minY, lineY1)))}
              x2={scaleX(lineX2)}
              y2={scaleY(Math.min(maxY, Math.max(minY, lineY2)))}
              stroke="#8C5B3E"
              strokeWidth="2.5"
              strokeDasharray="4 2"
            />

            {/* Data Points */}
            {selectedSeries.dataPoints.map((dp) => {
              const cx = scaleX(dp.competencyLevel);
              const cy = scaleY(dp.errorRatePercent);
              return (
                <g key={dp.id} className="cursor-pointer group">
                  <circle
                    cx={cx}
                    cy={cy}
                    r="6"
                    fill="#555934"
                    stroke="#FAF6F0"
                    strokeWidth="2"
                    className="transition-transform group-hover:scale-125"
                  />
                  {/* Point Label */}
                  <text
                    x={cx}
                    y={cy - 9}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="bold"
                    fill="#2d1f17"
                    className="select-none pointer-events-none"
                  >
                    {dp.departmentCode.replace('FOD-', '')}
                  </text>
                </g>
              );
            })}

            {/* X-axis title */}
            <text
              x={padding.left + plotWidth / 2}
              y={svgHeight - 6}
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill="#705849"
            >
              {selectedSeries.xAxisLabel}
            </text>

            {/* Y-axis title */}
            <text
              x={-(padding.top + plotHeight / 2)}
              y="14"
              textAnchor="middle"
              transform="rotate(-90)"
              fontSize="10"
              fontWeight="bold"
              fill="#705849"
            >
              {selectedSeries.yAxisLabel}
            </text>
          </svg>
        </div>

        {/* Narrative Insight Footer */}
        <p className="text-xs text-[#705849] italic bg-[#FAF6F0]/50 p-3 rounded-xl border border-[#BF9B7A]/20 mt-3">
          <Info className="h-3.5 w-3.5 inline mr-1 text-[#8C5B3E]" />
          {selectedSeries.narrativeInsight}
        </p>
      </div>
    </div>
  );
}
