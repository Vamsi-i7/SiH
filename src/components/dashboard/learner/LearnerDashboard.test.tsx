import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import LearnerDashboard from './LearnerDashboard';

describe('LearnerDashboard Component', () => {
  const mockUserAmit = {
    id: 'demo-amit',
    email: 'amit.sharma@mospi.gov.in',
    user_metadata: {
      name: 'Amit Sharma',
      designation: 'Junior Statistical Officer',
      cadre: 'Subordinate Statistical Service (SSS)',
      preferred_language: 'en',
    },
    app_metadata: {
      role: 'learner',
    },
  };

  const mockUserSunita = {
    id: 'demo-sunita',
    email: 'sunita.devi@nsso.gov.in',
    user_metadata: {
      name: 'Sunita Devi',
      designation: 'Field Investigator',
      cadre: 'NSSO Field Operations Division',
      preferred_language: 'hi',
    },
    app_metadata: {
      role: 'learner',
    },
  };

  it('renders learner greeting and cadre information for Amit Sharma', () => {
    const html = renderToString(<LearnerDashboard user={mockUserAmit} />);
    expect(html).toContain('Amit Sharma');
    expect(html).toContain('Subordinate Statistical Service');
    expect(html).toContain('Junior Statistical Officer');
  });

  it('renders the 5 KPI metrics strip', () => {
    const html = renderToString(<LearnerDashboard user={mockUserAmit} />);
    expect(html).toContain('Readiness Score');
    expect(html).toContain('Active Modules');
    expect(html).toContain('Verified Skills');
    expect(html).toContain('Field Drills');
    expect(html).toContain('Training Hours');
  });

  it('renders FRAC priority competency gaps with activities and provenance', () => {
    const html = renderToString(<LearnerDashboard user={mockUserAmit} />);
    expect(html).toContain('Statistical Scrutiny');
    expect(html).toContain('Field Schedule Scrutiny');
    expect(html).toContain('Multi-Stage Sampling');
  });

  it('renders Hindi strings and CAPI offline status for Sunita Devi', () => {
    const html = renderToString(<LearnerDashboard user={mockUserSunita} />);
    expect(html).toContain('सुनीता देवी');
    expect(html).toContain('तैयारी स्कोर');
    expect(html).toContain('CAPI');
  });

  it('renders the official MoSPI field manuals shelf and courses table', () => {
    const html = renderToString(<LearnerDashboard user={mockUserAmit} />);
    expect(html).toContain('Official MoSPI Field Manuals');
    expect(html).toContain('Recommended Modules');
    expect(html).toContain('Advanced CAPI Tablet Operations');
  });

  it('renders workspace navigation tabs and priority horizontal drills deck', () => {
    const html = renderToString(<LearnerDashboard user={mockUserAmit} />);
    expect(html).toContain('Operational Workspace');
    expect(html).toContain('Field Manuals Shelf');
    expect(html).toContain('FRAC Competency Gaps');
    expect(html).toContain('Karmayogi Pathways');
    expect(html).toContain('CAPI Field Station');
    expect(html).toContain('Priority Field &amp; Desk Drills');
    expect(html).toContain('Start Drill');
  });
});
