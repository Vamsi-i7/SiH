'use client';

import React, { useState } from 'react';
import { type SurveyScrutinyDataPoint } from '@/lib/types';
import { calculateLinearRegression } from '@/services/adminService';

interface ScatterChartProps {
  dataPoints: SurveyScrutinyDataPoint[];
  xAxisLabel: string;
  yAxisLabel: string;
  height?: number;
}

export function ScatterChart({
  dataPoints,
  xAxisLabel,
  yAxisLabel,
  height = 360,
}: ScatterChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<SurveyScrutinyDataPoint | null>(null);

  if (!dataPoints || dataPoints.length < 2) {
    return (
      <div className="w-full flex items-center justify-center p-8 bg-[--color-severity-moderate]/5 border border-[--color-severity-moderate]/20 rounded-xl text-[--color-severity-moderate] text-sm">
        ⚠️ Insufficient data points to compute regression trendline (minimum 2 required).
      </div>
    );
  }

  // Regression line calculation
  const mathPoints = dataPoints.map((p) => ({ x: p.competencyLevel, y: p.errorRatePercent }));
  const regression = calculateLinearRegression(mathPoints);

  // SVG Coordinates mapping
  const width = 640;
  const padding = { top: 30, right: 40, bottom: 50, left: 60 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // X range: 1 to 5
  const minX = 1;
  const maxX = 5;

  // Y range: 0 to max error rate + 5
  const maxYValue = Math.max(...dataPoints.map((p) => p.errorRatePercent), 25);
  const minY = 0;
  const maxY = Math.ceil(maxYValue / 5) * 5;

  const scaleX = (x: number) => padding.left + ((x - minX) / (maxX - minX)) * chartW;
  const scaleY = (y: number) => padding.top + chartH - ((y - minY) / (maxY - minY)) * chartH;

  // Trendline endpoints
  const lineX1 = scaleX(1);
  const lineY1 = scaleY(regression.slope * 1 + regression.intercept);
  const lineX2 = scaleX(5);
  const lineY2 = scaleY(regression.slope * 5 + regression.intercept);

  return (
    <div className="relative w-full overflow-hidden bg-card rounded-2xl p-4 shadow-card">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto select-none"
        role="img"
        aria-label={`${yAxisLabel} versus ${xAxisLabel} scatter plot`}
      >
        {/* SIMULATED WATERMARK OVERLAY */}
        <text
          x={width / 2}
          y={height / 2}
          textAnchor="middle"
          transform={`rotate(-25, ${width / 2}, ${height / 2})`}
          className="fill-foreground/5 font-black text-3xl tracking-widest pointer-events-none"
        >
          SIMULATED DEMO DATA — NOT REAL OUTCOMES
        </text>

        {/* Grid Lines & Y-Axis Labels */}
        {[0, 5, 10, 15, 20, 25].map((val) => {
          if (val > maxY) return null;
          const y = scaleY(val);
          return (
            <g key={`grid-y-${val}`}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                className="stroke-border stroke-1 stroke-dashed"
              />
              <text
                x={padding.left - 10}
                y={y + 4}
                textAnchor="end"
                className="fill-muted-foreground text-[10px]"
              >
                {val}%
              </text>
            </g>
          );
        })}

        {/* X-Axis Grid & Labels */}
        {[1, 2, 3, 4, 5].map((lvl) => {
          const x = scaleX(lvl);
          return (
            <g key={`grid-x-${lvl}`}>
              <line
                x1={x}
                y1={padding.top}
                x2={x}
                y2={padding.top + chartH}
                className="stroke-border stroke-1 stroke-dashed"
              />
              <text
                x={x}
                y={padding.top + chartH + 20}
                textAnchor="middle"
                className="fill-muted-foreground text-[11px] font-medium"
              >
                L{lvl}
              </text>
            </g>
          );
        })}

        {/* Axes */}
        <line
          x1={padding.left}
          y1={padding.top + chartH}
          x2={width - padding.right}
          y2={padding.top + chartH}
          className="stroke-foreground/30 stroke-1"
        />
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={padding.top + chartH}
          className="stroke-foreground/30 stroke-1"
        />

        {/* Axis Titles */}
        <text
          x={width / 2}
          y={height - 10}
          textAnchor="middle"
          className="fill-foreground text-[11px] font-semibold"
        >
          {xAxisLabel}
        </text>
        <text
          x={-height / 2}
          y={18}
          transform="rotate(-90)"
          textAnchor="middle"
          className="fill-foreground text-[11px] font-semibold"
        >
          {yAxisLabel}
        </text>

        {/* Linear Regression Trendline */}
        {regression.isComputable && (
          <g>
            <line
              x1={lineX1}
              y1={lineY1}
              x2={lineX2}
              y2={lineY2}
              className="stroke-[--color-destructive] stroke-2"
              strokeDasharray="4 4"
            />
          </g>
        )}

        {/* Data Points */}
        {dataPoints.map((point) => {
          const cx = scaleX(point.competencyLevel);
          const cy = scaleY(point.errorRatePercent);
          const isHovered = hoveredPoint?.id === point.id;

          return (
            <g
              key={point.id}
              className="cursor-pointer transition-transform"
              onMouseEnter={() => setHoveredPoint(point)}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <circle
                cx={cx}
                cy={cy}
                r={isHovered ? 8 : 6}
                className={`transition-all ${
                  isHovered
                    ? 'fill-[--color-destructive-dark] stroke-background stroke-2 shadow-lg'
                    : 'fill-primary stroke-background stroke-1.5 hover:fill-[--color-destructive]'
                }`}
              />
            </g>
          );
        })}
      </svg>

      {/* Hover Tooltip Overlay */}
      {hoveredPoint && (
        <div className="absolute top-6 right-6 bg-popover text-popover-foreground px-3 py-2 rounded-xl shadow-lg text-xs pointer-events-none transition-all">
          <p className="font-bold text-foreground">{hoveredPoint.departmentName}</p>
          <div className="mt-1 space-y-0.5 text-muted-foreground">
            <p>
              Competency Level: <span className="font-medium text-foreground">L{hoveredPoint.competencyLevel}</span>
            </p>
            <p>
              Scrutiny Error Rate: <span className="font-bold text-[--color-destructive]">{hoveredPoint.errorRatePercent}%</span>
            </p>
            <p>
              Audited Schedules: <span className="text-foreground">{hoveredPoint.sampleSize}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
