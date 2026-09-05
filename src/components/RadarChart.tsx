'use client';

import React, { useState } from 'react';

export interface RadarDataPoint {
  label: string;
  labelHi?: string;
  current: number; // 0 to 5
  target: number;  // 0 to 5
}

interface RadarChartProps {
  data: RadarDataPoint[];
  size?: number;
  maxLevel?: number;
  className?: string;
  showLegend?: boolean;
}

export function RadarChart({
  data,
  size = 380,
  maxLevel = 5,
  className = '',
  showLegend = true,
}: RadarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length < 3) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-400">
        Radar chart requires at least 3 competencies
      </div>
    );
  }

  const center = size / 2;
  const radius = (size - 90) / 2; // Leave padding for labels
  const totalPoints = data.length;
  const angleStep = (Math.PI * 2) / totalPoints;

  // Function to calculate Cartesian coordinates from polar
  const getCoordinates = (value: number, index: number, maxVal = maxLevel) => {
    const angle = index * angleStep - Math.PI / 2; // Start from top (-90 deg)
    const normalizedDist = (Math.min(Math.max(value, 0), maxVal) / maxVal) * radius;
    const x = center + normalizedDist * Math.cos(angle);
    const y = center + normalizedDist * Math.sin(angle);
    return { x, y };
  };

  // Generate background concentric polygons (L1 to L5)
  const gridLevels = Array.from({ length: maxLevel }, (_, i) => i + 1);

  // Generate SVG path for a polygon given a set of values
  const generatePolygonPath = (values: number[]) => {
    const points = values.map((val, idx) => {
      const { x, y } = getCoordinates(val, idx);
      return `${x},${y}`;
    });
    return points.join(' ');
  };

  const targetPath = generatePolygonPath(data.map((d) => d.target));
  const currentPath = generatePolygonPath(data.map((d) => d.current));

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      <svg
        width={size}
        height={size}
        className="overflow-visible"
        aria-label="Competency Radar Chart"
      >
        {/* Background Grid Polygons & Axis Rays */}
        {gridLevels.map((lvl) => {
          const points = data.map((_, idx) => {
            const { x, y } = getCoordinates(lvl, idx);
            return `${x},${y}`;
          }).join(' ');

          return (
            <polygon
              key={`grid-${lvl}`}
              points={points}
              fill={lvl === maxLevel ? '#f7f2eb' : 'none'}
              stroke="#e3dbcf"
              strokeWidth={1}
            />
          );
        })}

        {/* Axis Rays */}
        {data.map((_, idx) => {
          const { x, y } = getCoordinates(maxLevel, idx);
          return (
            <line
              key={`ray-${idx}`}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#e3dbcf"
              strokeWidth={1}
              strokeDasharray="2,2"
            />
          );
        })}

        {/* Target Level Polygon (Dashed / Ochre tint) */}
        <polygon
          points={targetPath}
          fill="rgba(201, 150, 58, 0.12)"
          stroke="#c9963a"
          strokeWidth={2}
          strokeDasharray="4,4"
          className="transition-all duration-300"
        />

        {/* Current Level Polygon (Solid Sage Green) */}
        <polygon
          points={currentPath}
          fill="rgba(139, 154, 110, 0.22)"
          stroke="#8b9a6e"
          strokeWidth={2.5}
          className="transition-all duration-300"
        />

        {/* Data points (dots) on vertices */}
        {data.map((item, idx) => {
          const currentCoord = getCoordinates(item.current, idx);
          const targetCoord = getCoordinates(item.target, idx);
          const isHovered = hoveredIndex === idx;

          return (
            <g key={`points-${idx}`}>
              {/* Target point */}
              <circle
                cx={targetCoord.x}
                cy={targetCoord.y}
                r={3.5}
                fill="#c9963a"
                className="transition-transform duration-200"
              />
              {/* Current point */}
              <circle
                cx={currentCoord.x}
                cy={currentCoord.y}
                r={isHovered ? 6 : 4.5}
                fill="#8b9a6e"
                stroke="#ffffff"
                strokeWidth={2}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            </g>
          );
        })}

        {/* Vertex Labels */}
        {data.map((item, idx) => {
          const angle = idx * angleStep - Math.PI / 2;
          const labelDist = radius + 24;
          const x = center + labelDist * Math.cos(angle);
          const y = center + labelDist * Math.sin(angle);

          // Alignment adjustments based on quadrant
          let textAnchor: 'start' | 'middle' | 'end' = 'middle';
          if (Math.cos(angle) > 0.3) textAnchor = 'start';
          else if (Math.cos(angle) < -0.3) textAnchor = 'end';

          const isHovered = hoveredIndex === idx;

          return (
            <text
              key={`label-${idx}`}
              x={x}
              y={y + 4}
              textAnchor={textAnchor}
              className={`text-xs font-medium cursor-pointer transition-colors ${
                isHovered
                  ? 'fill-[#728056] font-semibold'
                  : 'fill-[#5a5a5a]'
              }`}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {item.label}
            </text>
          );
        })}
      </svg>

      {/* Tooltip Overlay */}
      {hoveredIndex !== null && data[hoveredIndex] && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[#1a1a1a] text-white px-3 py-1.5 rounded-md text-xs shadow-md pointer-events-none z-10 flex items-center gap-2 font-mono">
          <span className="font-sans font-medium">{data[hoveredIndex].label}:</span>
          <span>Current: L{data[hoveredIndex].current}</span>
          <span>/</span>
          <span className="text-[#c9963a]">Target: L{data[hoveredIndex].target}</span>
        </div>
      )}

      {/* Legend */}
      {showLegend && (
        <div className="mt-4 flex items-center justify-center gap-6 text-xs text-[#5a5a5a]">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#8b9a6e]"></span>
            <span>Current Proficiency</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full border border-dashed border-[#c9963a] bg-[#c9963a]/20"></span>
            <span>Role Target Level</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default RadarChart;
