import { describe, it, expect } from 'vitest';
import {
  calculateLinearRegression,
  computeDepartmentBreakdown,
  computeWorkforceOverview,
} from './adminService';
import type { User, CompetencyRecord, ActivityCompetency, TrainingPriority } from '../lib/types';

describe('adminService - Linear Regression', () => {
  it('returns isComputable: false for 0 points', () => {
    const result = calculateLinearRegression([]);
    expect(result.isComputable).toBe(false);
    expect(result.slope).toBe(0);
    expect(result.rSquared).toBe(0);
  });

  it('returns isComputable: false for 1 point', () => {
    const result = calculateLinearRegression([{ x: 2, y: 15 }]);
    expect(result.isComputable).toBe(false);
    expect(result.slope).toBe(0);
    expect(result.rSquared).toBe(0);
  });

  it('accurately calculates slope and intercept for linear data points', () => {
    // Points on y = -3x + 20
    const points = [
      { x: 1, y: 17 },
      { x: 2, y: 14 },
      { x: 3, y: 11 },
      { x: 4, y: 8 },
      { x: 5, y: 5 },
    ];
    const result = calculateLinearRegression(points);
    expect(result.isComputable).toBe(true);
    expect(result.slope).toBeCloseTo(-3.0, 2);
    expect(result.intercept).toBeCloseTo(20.0, 2);
    expect(result.rSquared).toBeCloseTo(1.0, 2);
  });
});

describe('adminService - Workforce Aggregation', () => {
  const mockUsers: User[] = [
    {
      id: 'u1',
      name: 'Amit Sharma',
      email: 'amit@gov.in',
      role: 'learner',
      organization_id: 'org1',
      department: 'NSSO FOD UP East',
      preferred_language: 'en',
      theme_preference: 'light',
      onboarding_completed: true,
      created_at: '2026-01-01',
      last_active_at: '2026-09-01',
    },
    {
      id: 'u2',
      name: 'Sunita Devi',
      email: 'sunita@gov.in',
      role: 'learner',
      organization_id: 'org1',
      department: 'NSSO FOD UP East',
      preferred_language: 'hi',
      theme_preference: 'light',
      onboarding_completed: true,
      created_at: '2026-01-01',
      last_active_at: '2026-09-01',
    },
    {
      id: 'u3',
      name: 'Rajesh Jha',
      email: 'rajesh@gov.in',
      role: 'learner',
      organization_id: 'org1',
      department: 'NSSO FOD Bihar',
      preferred_language: 'en',
      theme_preference: 'light',
      onboarding_completed: true,
      created_at: '2026-01-01',
      last_active_at: '2026-09-01',
    },
  ];

  const mockRecords: CompetencyRecord[] = [
    { id: 'r1', user_id: 'u1', competency_id: 'c1', current_level: 3, organization_id: 'org1', updated_at: '2026-09-01' },
    { id: 'r2', user_id: 'u2', competency_id: 'c1', current_level: 1, organization_id: 'org1', updated_at: '2026-09-01' },
    { id: 'r3', user_id: 'u3', competency_id: 'c1', current_level: 2, organization_id: 'org1', updated_at: '2026-09-01' },
  ];

  const mockReqs: ActivityCompetency[] = [
    { id: 'ac1', activity_id: 'a1', competency_id: 'c1', target_level: 3, priority: 'critical', created_at: '2026-01-01' },
  ];

  it('groups departments and calculates aggregate readiness accurately', () => {
    const departments = computeDepartmentBreakdown(mockUsers, mockRecords, mockReqs, []);
    expect(departments).toHaveLength(2);

    const upEast = departments.find((d) => d.department === 'NSSO FOD UP East');
    expect(upEast).toBeDefined();
    expect(upEast?.officialCount).toBe(2);
    // u1 has level 3 >= 3 (100%), u2 has level 1 < 3 (0%) -> avg 50%
    expect(upEast?.avgReadiness).toBe(50);
  });

  it('computes overall macro readiness across all users', () => {
    const overview = computeWorkforceOverview(mockUsers, mockRecords, mockReqs, []);
    expect(overview.totalOfficials).toBe(3);
    // u1 (100%), u2 (0%), u3 (0%) -> avg 33%
    expect(overview.avgReadiness).toBe(33);
  });
});
