import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { HorizontalDrillsCarousel } from './HorizontalDrillsCarousel';

describe('HorizontalDrillsCarousel Component', () => {
  it('renders carousel header and all drill cards', () => {
    const html = renderToString(
      <HorizontalDrillsCarousel onStartDrill={vi.fn()} isHindi={false} />
    );
    expect(html).toContain('Priority Field &amp; Desk Drills');
    expect(html).toContain('Schedule 0.0: Household Demarcation');
    expect(html).toContain('NIC-2008 &amp; NCO-2015 5-Digit Coding');
    expect(html).toContain('Start Drill');
  });

  it('renders Hindi strings when isHindi is true', () => {
    const html = renderToString(
      <HorizontalDrillsCarousel onStartDrill={vi.fn()} isHindi={true} />
    );
    expect(html).toContain('प्राथमिकता फील्ड एवं डेस्क अभ्यास');
    expect(html).toContain('अभ्यास प्रारंभ');
  });
});
