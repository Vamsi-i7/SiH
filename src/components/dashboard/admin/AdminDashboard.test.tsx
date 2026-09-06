import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import AdminDashboard from './AdminDashboard';

describe('AdminDashboard Component', () => {
  const mockUserAdmin = {
    id: 'demo-rajesh',
    email: 'rajesh.kumar@mospi.gov.in',
    user_metadata: {
      name: 'Rajesh Kumar',
      designation: 'Additional Director General',
      cadre: 'MoSPI Headquarters',
      preferred_language: 'en',
    },
    app_metadata: {
      role: 'admin',
    },
  };

  it('renders ADG administrative header and MoSPI command details', () => {
    const html = renderToString(<AdminDashboard user={mockUserAdmin} />);
    expect(html).toContain('Rajesh Kumar');
    expect(html).toContain('Additional Director General');
    expect(html).toContain('MoSPI Headquarters');
    expect(html).toContain('Secretary Memo (PDF)');
    expect(html).toContain('Cadre Roster');
  });

  it('renders national workforce governance KPI strip', () => {
    const html = renderToString(<AdminDashboard user={mockUserAdmin} />);
    expect(html).toContain('Total Headcount');
    expect(html).toContain('Workforce Readiness');
    expect(html).toContain('Scrutiny Error Rate');
    expect(html).toContain('Priority Flagged ROs');
  });

  it('renders AI executive narrative intelligence card', () => {
    const html = renderToString(<AdminDashboard user={mockUserAdmin} />);
    expect(html).toContain('AI Executive Intelligence Briefing');
    expect(html).toContain('Boundary Demarcation');
    expect(html).toContain('Schedule 0.0');
  });

  it('renders PRD Lever 2 outcome correlation chart with synthetic demo watermark', () => {
    const html = renderToString(<AdminDashboard user={mockUserAdmin} />);
    expect(html).toContain('Survey Scrutiny Outcome Correlation');
    expect(html).toContain('SYNTHETIC DEMO DATA');
    expect(html).toContain('Listing Scrutiny Error Rate');
  });

  it('renders regional office breakdown table with inspect and flag priority training buttons', () => {
    const html = renderToString(<AdminDashboard user={mockUserAdmin} />);
    expect(html).toContain('Regional Offices &amp; Division Readiness');
    expect(html).toContain('FOD Bihar');
    expect(html).toContain('Inspect');
    expect(html).toContain('Flag Priority Training');
  });

  it('renders multi-deck workspace tabs and horizontal carousels', () => {
    const html = renderToString(<AdminDashboard user={mockUserAdmin} />);
    expect(html).toContain('Executive Command');
    expect(html).toContain('Regional Cadre Health');
    expect(html).toContain('Outcome Regression');
    expect(html).toContain('Policy Directives');
    expect(html).toContain('Cabinet Drawer');
    expect(html).toContain('National Zonal Health &amp; Cadre Readiness');
    expect(html).toContain('National Policy Directives &amp; Cabinet Circulars');
  });
});
