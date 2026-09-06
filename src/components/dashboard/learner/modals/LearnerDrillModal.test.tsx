import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { LearnerDrillModal } from './LearnerDrillModal';

describe('LearnerDrillModal Component', () => {
  it('renders drill title and question scenario when open', () => {
    const html = renderToString(
      <LearnerDrillModal
        isOpen={true}
        onClose={vi.fn()}
        drillId="drill-schedule-0"
        isHindi={false}
      />
    );
    expect(html).toContain('Schedule 0.0');
    expect(html).toContain('Census Enumeration Block');
    expect(html).toContain('Verify Answer');
  });

  it('renders Hindi strings when isHindi is true', () => {
    const html = renderToString(
      <LearnerDrillModal
        isOpen={true}
        onClose={vi.fn()}
        drillId="drill-schedule-0"
        isHindi={true}
      />
    );
    expect(html).toContain('अनुसूची 0.0');
    expect(html).toContain('उत्तर जांचें');
  });

  it('renders nothing when isOpen is false', () => {
    const html = renderToString(
      <LearnerDrillModal
        isOpen={false}
        onClose={vi.fn()}
        drillId="drill-schedule-0"
      />
    );
    expect(html).toBe('');
  });
});
