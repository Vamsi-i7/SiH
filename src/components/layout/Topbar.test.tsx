import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Topbar } from './Topbar';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
  useRouter: () => ({ push: vi.fn() }),
}));

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}));

describe('Topbar Component', () => {
  it('renders learner topbar with Karma Points and CAPI status pills', () => {
    const html = renderToString(<Topbar initialRole="learner" />);
    expect(html).toContain('Karma Points');
    expect(html).toContain('CAPI');
  });

  it('renders trainer topbar with QA pending counter and faculty studio identity', () => {
    const html = renderToString(<Topbar initialRole="trainer" />);
    expect(html).toContain('NSSTA Faculty');
    expect(html).toContain('14 QA Pending');
    expect(html).toContain('Ingest Manual');
  });

  it('renders admin topbar with national readiness and flagged ROs', () => {
    const html = renderToString(<Topbar initialRole="admin" />);
    expect(html).toContain('National Readiness: 72.4%');
    expect(html).toContain('2 Flagged ROs');
    expect(html).toContain('Ministerial PDF');
  });
});
