import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Sidebar } from './Sidebar';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
  useRouter: () => ({ push: vi.fn() }),
}));

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const map: Record<string, string> = {
      'nav.dashboard': 'Dashboard & Readiness',
      'nav.skillGap': 'FRAC Competency Gaps',
      'nav.assessment': 'Field & Desk Drills',
      'nav.pathways': 'Karmayogi Pathways',
      'nav.profile': 'Official Cadre Profile',
      'nav.documents': 'MoSPI Manuals & Ingestion',
      'nav.mcqGenerator': 'AI Question Studio',
      'nav.reviewQueue': 'QA Triage Queue',
    };
    return map[key] || key;
  },
  useLocale: () => 'en',
}));

describe('Sidebar Component', () => {
  it('renders default learner sidebar with cadre information and learning links', () => {
    const html = renderToString(<Sidebar initialRole="learner" />);
    expect(html).toContain('FRAC Competency Gaps');
    expect(html).toContain('Field &amp; Desk Drills');
    expect(html).toContain('Karmayogi Pathways');

    // Should NOT contain trainer-specific QA tools
    expect(html).not.toContain('QA Triage Queue');
    expect(html).not.toContain('AI Question Studio');
  });

  it('renders trainer sidebar with NSSTA Faculty identity and QA tools', () => {
    const html = renderToString(<Sidebar initialRole="trainer" />);
    expect(html).toContain('NSSTA Faculty');
    expect(html).toContain('QA Triage Queue');
    expect(html).toContain('AI Question Studio');
    expect(html).toContain('MoSPI Manuals');

    // Should NOT contain learner pathways
    expect(html).not.toContain('Karmayogi Pathways');
  });

  it('renders admin sidebar with Executive Command identity and governance tools', () => {
    const html = renderToString(<Sidebar initialRole="admin" />);
    expect(html).toContain('Executive Command');
    expect(html).toContain('Workforce Command');
    expect(html).toContain('Regional Office Health');

    // Should NOT contain trainer creation tools
    expect(html).not.toContain('AI Question Studio');
  });
});
