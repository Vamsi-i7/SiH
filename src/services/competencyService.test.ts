/**
 * Competency Service Unit Tests
 * Verifies gap severity calculations, readiness indexing, and level promotion logic
 */

import { describe, it, expect } from 'vitest';
import {
  computeGapSeverity,
  classifySeverity,
  computeReadinessIndex,
  promoteCompetencyLevel,
} from '@/services/competencyService';

// ============================================================================
// Gap Severity Calculation Tests
// ============================================================================

describe('computeGapSeverity', () => {
  it('should return 0 when current level meets or exceeds target', () => {
    expect(computeGapSeverity(3, 3, 'critical')).toBe(0);
    expect(computeGapSeverity(4, 3, 'important')).toBe(0);
  });

  it('should compute correct severity for critical gaps', () => {
    // gap=1, priority=critical(3) → 1*3=3
    expect(computeGapSeverity(2, 3, 'critical')).toBe(3);
    // gap=2, priority=critical(3) → 2*3=6
    expect(computeGapSeverity(2, 4, 'critical')).toBe(6);
  });

  it('should compute correct severity for important gaps', () => {
    // gap=1, priority=important(2) → 1*2=2
    expect(computeGapSeverity(2, 3, 'important')).toBe(2);
    // gap=2, priority=important(2) → 2*2=4
    expect(computeGapSeverity(2, 4, 'important')).toBe(4);
  });

  it('should compute correct severity for desirable gaps', () => {
    // gap=1, priority=desirable(1) → 1*1=1
    expect(computeGapSeverity(2, 3, 'desirable')).toBe(1);
    // gap=3, priority=desirable(1) → 3*1=3
    expect(computeGapSeverity(2, 5, 'desirable')).toBe(3);
  });

  it('should rank Delta=1 critical above Delta=2 desirable', () => {
    const criticalGap = computeGapSeverity(2, 3, 'critical'); // 1*3=3
    const desirableGap = computeGapSeverity(2, 4, 'desirable'); // 2*1=2
    expect(criticalGap).toBeGreaterThan(desirableGap);
  });
});

// ============================================================================
// Severity Classification Tests
// ============================================================================

describe('classifySeverity', () => {
  it('should classify HIGH severity (score >= 4)', () => {
    expect(classifySeverity(4)).toBe('HIGH');
    expect(classifySeverity(5)).toBe('HIGH');
    expect(classifySeverity(10)).toBe('HIGH');
  });

  it('should classify MODERATE severity (score 2-3)', () => {
    expect(classifySeverity(2)).toBe('MODERATE');
    expect(classifySeverity(3)).toBe('MODERATE');
  });

  it('should classify PROFICIENT severity (score <= 1)', () => {
    expect(classifySeverity(0)).toBe('PROFICIENT');
    expect(classifySeverity(1)).toBe('PROFICIENT');
  });

  it('should never classify MODERATE for 0-1', () => {
    expect(classifySeverity(0)).not.toBe('MODERATE');
    expect(classifySeverity(1)).not.toBe('MODERATE');
  });

  it('should never classify HIGH for 2-3', () => {
    expect(classifySeverity(2)).not.toBe('HIGH');
    expect(classifySeverity(3)).not.toBe('HIGH');
  });
});

// ============================================================================
// Readiness Index Tests
// ============================================================================

describe('computeReadinessIndex', () => {
  it('should return 0 for empty required competencies', () => {
    const userRecords = new Map<string, number>();
    expect(computeReadinessIndex([], userRecords)).toBe(0);
  });

  it('should return 100 when all competencies meet target', () => {
    const required = [
      { competencyId: 'c1', targetLevel: 3 },
      { competencyId: 'c2', targetLevel: 2 },
    ];
    const userRecords = new Map<string, number>([
      ['c1', 3],
      ['c2', 2],
    ]);
    expect(computeReadinessIndex(required, userRecords)).toBe(100);
  });

  it('should return 50 when half of competencies meet target', () => {
    const required = [
      { competencyId: 'c1', targetLevel: 3 },
      { competencyId: 'c2', targetLevel: 2 },
    ];
    const userRecords = new Map<string, number>([
      ['c1', 3],
      ['c2', 1], // Below target
    ]);
    expect(computeReadinessIndex(required, userRecords)).toBe(50);
  });

  it('should treat missing records as level 0', () => {
    const required = [{ competencyId: 'c1', targetLevel: 2 }];
    const userRecords = new Map<string, number>(); // c1 not in map
    expect(computeReadinessIndex(required, userRecords)).toBe(0);
  });

  it('should handle 3 out of 4 competencies', () => {
    const required = [
      { competencyId: 'c1', targetLevel: 2 },
      { competencyId: 'c2', targetLevel: 2 },
      { competencyId: 'c3', targetLevel: 2 },
      { competencyId: 'c4', targetLevel: 2 },
    ];
    const userRecords = new Map<string, number>([
      ['c1', 2],
      ['c2', 2],
      ['c3', 2],
      ['c4', 1], // Below target
    ]);
    expect(computeReadinessIndex(required, userRecords)).toBe(75);
  });

  it('should round to nearest integer', () => {
    const required = [
      { competencyId: 'c1', targetLevel: 3 },
      { competencyId: 'c2', targetLevel: 3 },
      { competencyId: 'c3', targetLevel: 3 },
    ];
    const userRecords = new Map<string, number>([
      ['c1', 3],
      ['c2', 3],
      // c3 missing (0)
    ]);
    // 2/3 = 0.6667 = 67% (rounded)
    expect(computeReadinessIndex(required, userRecords)).toBe(67);
  });
});

// ============================================================================
// Competency Level Promotion Tests
// ============================================================================

describe('promoteCompetencyLevel', () => {
  it('should not promote at maximum level 5', () => {
    expect(promoteCompetencyLevel(5, 75)).toBe(5);
    expect(promoteCompetencyLevel(5, 95)).toBe(5);
  });

  it('should not promote for low scores (< 40%)', () => {
    expect(promoteCompetencyLevel(1, 0)).toBe(1);
    expect(promoteCompetencyLevel(2, 30)).toBe(2);
    expect(promoteCompetencyLevel(3, 39)).toBe(3);
  });

  it('should promote by 1 level for medium scores (40-70%) when below L3', () => {
    expect(promoteCompetencyLevel(1, 40)).toBe(2);
    expect(promoteCompetencyLevel(1, 50)).toBe(2);
    expect(promoteCompetencyLevel(2, 70)).toBe(3);
  });

  it('should not promote beyond L3 for medium scores', () => {
    expect(promoteCompetencyLevel(3, 50)).toBe(3);
    expect(promoteCompetencyLevel(4, 50)).toBe(4);
  });

  it('should promote by up to 2 levels for high scores (>= 70%)', () => {
    expect(promoteCompetencyLevel(1, 70)).toBe(3);
    expect(promoteCompetencyLevel(1, 95)).toBe(3);
    expect(promoteCompetencyLevel(2, 75)).toBe(4);
    expect(promoteCompetencyLevel(3, 85)).toBe(5);
  });

  it('should cap at level 5 with high scores', () => {
    expect(promoteCompetencyLevel(4, 95)).toBe(5);
    expect(promoteCompetencyLevel(5, 100)).toBe(5);
  });

  it('should respect strict mode (max +1 per assessment)', () => {
    expect(promoteCompetencyLevel(1, 95, { strictMode: true })).toBe(2);
    expect(promoteCompetencyLevel(2, 95, { strictMode: true })).toBe(3);
    expect(promoteCompetencyLevel(3, 95, { strictMode: true })).toBe(4);
  });

  it('should handle boundary case: exactly 40% (should promote)', () => {
    expect(promoteCompetencyLevel(1, 40)).toBe(2);
  });

  it('should handle boundary case: exactly 70% (should promote if < L3)', () => {
    expect(promoteCompetencyLevel(2, 70)).toBe(3);
    expect(promoteCompetencyLevel(3, 70)).toBe(3); // At L3, no promotion
  });
});

// ============================================================================
// Integration Tests (Real-World Scenarios)
// ============================================================================

describe('Competency Service - Integration Scenarios', () => {
  it('should correctly process a realistic assessment outcome', () => {
    // Scenario: Field Investigator takes CAPI assessment
    // Current: L2, Target: L4, Priority: critical
    // Score: 85% → should promote to L4
    const currentLevel = 2;
    const assessmentScore = 85;
    const newLevel = promoteCompetencyLevel(currentLevel, assessmentScore);

    expect(newLevel).toBe(4); // Promoted by 2 levels

    // Gap severity should change after promotion
    const gapBefore = computeGapSeverity(2, 4, 'critical'); // 2*3=6 → HIGH
    const gapAfter = computeGapSeverity(newLevel, 4, 'critical'); // 0*3=0 → PROFICIENT

    expect(classifySeverity(gapBefore)).toBe('HIGH');
    expect(classifySeverity(gapAfter)).toBe('PROFICIENT');
  });

  it('should distinguish between critical and desirable gaps', () => {
    // Two gaps with same delta=2, different priorities
    const criticalGap = computeGapSeverity(1, 3, 'critical'); // 2*3=6
    const desirableGap = computeGapSeverity(1, 3, 'desirable'); // 2*1=2

    expect(classifySeverity(criticalGap)).toBe('HIGH');
    expect(classifySeverity(desirableGap)).toBe('MODERATE');
  });

  it('should compute realistic readiness for role', () => {
    // Field Investigator role requires 4 competencies
    // User meets 1 out of 4 targets
    const required = [
      { competencyId: 'capi', targetLevel: 4 },
      { competencyId: 'protocols', targetLevel: 3 },
      { competencyId: 'teamwork', targetLevel: 2 },
      { competencyId: 'ethics', targetLevel: 1 },
    ];

    const userRecords = new Map<string, number>([
      ['capi', 2], // Below target
      ['protocols', 3], // Meets target ✓
      ['teamwork', 1], // Below target
      ['ethics', 1], // Meets target ✓
    ]);

    const readiness = computeReadinessIndex(required, userRecords);
    expect(readiness).toBe(50); // 2 out of 4
  });
});
