import { describe, it, expect, vi } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

vi.mock('@/lib/auth', () => ({
  getAuthenticatedUser: vi.fn(),
}));

import { getAuthenticatedUser } from '@/lib/auth';

describe('POST /api/admin/flag-department', () => {
  it('returns 401 if user is unauthenticated', async () => {
    vi.mocked(getAuthenticatedUser).mockResolvedValue(null as never);

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
      email: 'sunita@gov.in',
      user_metadata: {
        name: 'Sunita Devi',
        organization_id: 'org1',
      },
      app_metadata: {
        role: 'learner',
      },
    });

    const req = new NextRequest('http://localhost:3000/api/admin/flag-department', {
      method: 'POST',
      body: JSON.stringify({ department: 'FOD UP East', reason: 'High error rate' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(403);
  });
});
