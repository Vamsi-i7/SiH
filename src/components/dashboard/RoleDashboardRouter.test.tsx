import { describe, it, expect } from 'vitest';
import { resolveUserRole } from './RoleDashboardRouter';

describe('RoleDashboardRouter role resolution', () => {
  it('resolves trainer role from app_metadata', () => {
    const user = {
      id: 'demo-priya',
      email: 'priya.verma@nssta.gov.in',
      app_metadata: { role: 'trainer' },
    };
    expect(resolveUserRole(user)).toBe('trainer');
  });

  it('resolves admin role from app_metadata', () => {
    const user = {
      id: 'demo-rajesh',
      email: 'rajesh.kumar@mospi.gov.in',
      app_metadata: { role: 'admin' },
    };
    expect(resolveUserRole(user)).toBe('admin');
  });

  it('resolves learner role for desk officer and field investigator', () => {
    const user = {
      id: 'demo-sunita',
      email: 'sunita.devi@nsso.gov.in',
      app_metadata: { role: 'learner' },
    };
    expect(resolveUserRole(user)).toBe('learner');
  });

  it('defaults to learner role when metadata is empty', () => {
    const user = {
      id: 'unknown-user',
      email: 'user@mospi.gov.in',
    };
    expect(resolveUserRole(user)).toBe('learner');
  });
});
