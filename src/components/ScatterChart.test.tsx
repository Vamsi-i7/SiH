import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ScatterChart } from './ScatterChart';

describe('ScatterChart Component', () => {
  it('renders fallback banner when data points are fewer than 2', () => {
    const html = renderToString(
      <ScatterChart
        dataPoints={[{ id: '1', departmentCode: 'D1', departmentName: 'Dept 1', competencyLevel: 3, errorRatePercent: 10, sampleSize: 100 }]}
        xAxisLabel="Competency"
        yAxisLabel="Error Rate (%)"
      />
    );
    expect(html).toContain('Insufficient data points to compute regression trendline');
  });

  it('renders SVG with data points and simulated watermark for valid data', () => {
    const points = [
      { id: '1', departmentCode: 'D1', departmentName: 'Dept 1', competencyLevel: 1, errorRatePercent: 18, sampleSize: 200 },
      { id: '2', departmentCode: 'D2', departmentName: 'Dept 2', competencyLevel: 3, errorRatePercent: 10, sampleSize: 300 },
      { id: '3', departmentCode: 'D3', departmentName: 'Dept 3', competencyLevel: 5, errorRatePercent: 2, sampleSize: 250 },
    ];
    const html = renderToString(
      <ScatterChart dataPoints={points} xAxisLabel="Competency (L1-L5)" yAxisLabel="Error Rate (%)" />
    );

    expect(html).toContain('<svg');
    expect(html).toContain('SIMULATED DEMO DATA');
  });
});
