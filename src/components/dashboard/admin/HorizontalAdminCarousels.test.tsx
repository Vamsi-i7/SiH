import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { HorizontalZonalHealthCarousel } from './HorizontalZonalHealthCarousel';
import { HorizontalPolicyDirectivesCarousel } from './HorizontalPolicyDirectivesCarousel';

describe('Admin Horizontal Carousels', () => {
  it('renders HorizontalZonalHealthCarousel with 7 zones and action buttons', () => {
    const html = renderToString(
      <HorizontalZonalHealthCarousel
        onInspectZone={vi.fn()}
        onDispatchTriage={vi.fn()}
      />
    );
    expect(html).toContain('National Zonal Health &amp; Cadre Readiness');
    expect(html).toContain('Eastern Zone');
    expect(html).toContain('Southern Zone');
    expect(html).toContain('Western Zone');
    expect(html).toContain('Inspect Zone');
  });

  it('renders HorizontalPolicyDirectivesCarousel with statutory directives', () => {
    const html = renderToString(
      <HorizontalPolicyDirectivesCarousel onReadCircular={vi.fn()} />
    );
    expect(html).toContain('National Policy Directives &amp; Cabinet Circulars');
    expect(html).toContain('Mission Karmayogi Bharat 2026 Cadre Mandate');
    expect(html).toContain('NSS 79th Round CAPI Quality Assurance Protocol');
    expect(html).toContain('Read Official Circular');
  });
});
