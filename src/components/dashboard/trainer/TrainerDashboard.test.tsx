import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import TrainerDashboard from './TrainerDashboard';

describe('TrainerDashboard Component', () => {
  const mockUserTrainer = {
    id: 'demo-priya',
    email: 'priya.verma@nssta.gov.in',
    user_metadata: {
      name: 'Dr. Priya Verma',
      designation: 'Course Director',
      cadre: 'NSSTA Faculty',
      preferred_language: 'en',
    },
    app_metadata: {
      role: 'trainer',
    },
  };

  it('renders faculty header with NSSTA information', () => {
    const html = renderToString(<TrainerDashboard user={mockUserTrainer} />);
    expect(html).toContain('Dr. Priya Verma');
    expect(html).toContain('NSSTA Faculty');
    expect(html).toContain('Course Director');
  });

  it('renders trainer KPI strip with QA and ingestion metrics', () => {
    const html = renderToString(<TrainerDashboard user={mockUserTrainer} />);
    expect(html).toContain('Pending Review');
    expect(html).toContain('Approved Bank');
    expect(html).toContain('Ingested Manuals');
    expect(html).toContain('Cohort Pass Rate');
  });

  it('renders question review triage deck with confidence scores', () => {
    const html = renderToString(<TrainerDashboard user={mockUserTrainer} />);
    expect(html).toContain('QA Triage');
    expect(html).toContain('Schedule 0.0');
    expect(html).toContain('Confidence');
  });

  it('renders trainee error heatmap showing curriculum bottlenecks', () => {
    const html = renderToString(<TrainerDashboard user={mockUserTrainer} />);
    expect(html).toContain('Trainee Curriculum Error Heatmap');
    expect(html).toContain('Hamlet-Group Formation');
  });

  it('renders ingested documents ledger', () => {
    const html = renderToString(<TrainerDashboard user={mockUserTrainer} />);
    expect(html).toContain('Ingested MoSPI Manuals');
    expect(html).toContain('PLFS 2026 Instructions Vol. 1');
  });
});
