import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import {
  HorizontalTrainerCarousels,
  ACTIVE_COHORTS,
  QUESTION_DECKS,
} from './HorizontalTrainerCarousels';

describe('HorizontalTrainerCarousels Component', () => {
  const defaultProps = {
    onInspectCohort: vi.fn(),
    onRemediateCohort: vi.fn(),
    onInspectItem: vi.fn(),
    onOpenDeckStudio: vi.fn(),
  };

  it('renders all active training cohorts with their metadata', () => {
    const html = renderToString(<HorizontalTrainerCarousels {...defaultProps} />);
    expect(html).toContain('Active Training Cohorts &amp; Academy Batches');
    expect(html).toContain('JSO Induction 2026 (Batch 44)');
    expect(html).toContain('FOD Field Staff Refresher (Batch IV)');
    expect(html).toContain('DQAD Scrutiny Officers Certification');
    expect(html).toContain('CAPI Geotagging &amp; Offline Sync Workshop');
    expect(html).toContain('Enrolled');
    expect(html).toContain('Inspect Batch');
    expect(html).toContain('Remediate');
  });

  it('renders curated MoSPI question bank decks with psychometrics', () => {
    const html = renderToString(<HorizontalTrainerCarousels {...defaultProps} />);
    expect(html).toContain('Curated MoSPI Question Bank Decks');
    expect(html).toContain('Schedule 0.0 Demarcation &amp; Listing Deck');
    expect(html).toContain('CAPI Offline Protocols &amp; GPS Errors Deck');
    expect(html).toContain('PLFS Schedule 10.4 Labour Activity Matrices');
    expect(html).toContain('Item Analysis');
    expect(html).toContain('MCQ Studio');
  });

  it('exports valid mock cohorts and question decks', () => {
    expect(ACTIVE_COHORTS.length).toBeGreaterThanOrEqual(4);
    expect(QUESTION_DECKS.length).toBeGreaterThanOrEqual(4);
    expect(ACTIVE_COHORTS[0].avgScore).toBeGreaterThan(0);
    expect(QUESTION_DECKS[0].sampleItem.distractorPercentages.length).toBe(4);
  });
});
