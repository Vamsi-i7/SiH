import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MinisterialBriefingModal } from './MinisterialBriefingModal';
import { NationalCadreRosterModal } from './NationalCadreRosterModal';
import { CommissionSweepModal } from './CommissionSweepModal';
import { RegionalDetailModal } from './RegionalDetailModal';
import { NationalReadinessModal } from './NationalReadinessModal';
import { FlaggedRegionsModal } from './FlaggedRegionsModal';

describe('Admin Executive Modals', () => {
  it('renders MinisterialBriefingModal when open', () => {
    const html = renderToString(
      <MinisterialBriefingModal isOpen={true} onClose={vi.fn()} />
    );
    expect(html).toContain('Secretary Briefing Memorandum');
    expect(html).toContain('CABINET LEVEL');
    expect(html).toContain('Print Memo');
    expect(html).toContain('Download Official PDF');
  });

  it('renders NationalCadreRosterModal with search and CSV export trigger', () => {
    const html = renderToString(
      <NationalCadreRosterModal isOpen={true} onClose={vi.fn()} />
    );
    expect(html).toContain('MoSPI National Cadre Competency Roster');
    expect(html).toContain('Export National Roster (CSV)');
    expect(html).toContain('Amit Sharma');
    expect(html).toContain('Sunita Devi');
  });

  it('renders CommissionSweepModal with target zones and order button', () => {
    const html = renderToString(
      <CommissionSweepModal isOpen={true} onClose={vi.fn()} />
    );
    expect(html).toContain('Commission Q3 Assessment Sweep');
    expect(html).toContain('Target Regional Zones');
    expect(html).toContain('Issue Executive Order');
  });

  it('renders RegionalDetailModal with RO metrics and dispatch triage action', () => {
    const mockRo = {
      id: 'dept-fod-br',
      name: 'FOD Bihar Regional Office',
      zone: 'Eastern Zone',
      headcount: 520,
      readinessPercent: 46,
      avgLevel: 'L1.2',
      errorRate: 19.8,
      isFlagged: true,
    };
    const html = renderToString(
      <RegionalDetailModal isOpen={true} onClose={vi.fn()} office={mockRo} />
    );
    expect(html).toContain('FOD Bihar Regional Office');
    expect(html).toContain('Eastern Zone');
    expect(html).toContain('Dominant Error Clusters');
    expect(html).toContain('Dispatch Triage');
  });

  it('renders NationalReadinessModal with cadre breakdown', () => {
    const html = renderToString(
      <NationalReadinessModal isOpen={true} onClose={vi.fn()} />
    );
    expect(html).toContain('National Cadre Readiness Index (72.4%)');
    expect(html).toContain('Indian Statistical Service (ISS Cadre)');
    expect(html).toContain('Subordinate Statistical Service (SSS Cadre)');
    expect(html).toContain('Field Operations Division (FOD Rural Cadre)');
  });

  it('renders FlaggedRegionsModal with 2 flagged ROs', () => {
    const html = renderToString(
      <FlaggedRegionsModal isOpen={true} onClose={vi.fn()} />
    );
    expect(html).toContain('Priority Flagged Regional Offices (2 ROs)');
    expect(html).toContain('FOD Bihar Regional Office (Patna)');
    expect(html).toContain('FOD UP East Regional Office (Prayagraj)');
  });
});
