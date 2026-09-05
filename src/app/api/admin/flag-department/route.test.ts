import { describe, it, expect, vi } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

vi.mock('@/lib/auth', () => ({
  getAuthenticatedUser: vi.fn(),
}));

import { getAuthenticatedUser } from '@/lib/auth';

describe('POST /api/admin/flag-department', () => {
  it('returns 401 if user is unauthenticated', async () => {
    vi.mocked(getAuthenticatedUser).mockResolvedValue(null);

    const req = new NextRequest('http://localhost:3000/api/admin/flag-department', {
      method: 'POST',
      body: JSON.stringify({ department: 'FOD UP East', reason: 'High error rate' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('returns 403 if user is authenticated but not an admin', async () => {
    vi.mocked(getAuthenticatedUser).mockResolvedValue({
      id: 'u1',
      name: 'Sunita Devi',
      email: 'sunita@gov.in',
      role: 'learner',
      organization_id: 'org1',
      preferred_language: 'hi',
      theme_preference: 'light',
      onboarding_completed: true,
      created_at: '2026-01-01',
      last_active_at: '2026-09-01',
    });

    const req = new NextRequest('http://localhost:3000/api/admin/flag-department', {
      method: 'POST',
      body: JSON.stringify({ department: 'FOD UP East', reason: 'High error rate' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(403);
  });
});
