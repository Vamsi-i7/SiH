import {
  type User,
  type CompetencyRecord,
  type ActivityCompetency,
  type TrainingPriority,
  type DepartmentSummary,
  type WorkforceOverview,
} from '../lib/types';
import { computeReadinessIndex, computeGapSeverity } from './competencyService';

export interface LinearRegressionResult {
  slope: number;
  intercept: number;
  rSquared: number;
  isComputable: boolean;
  points: Array<{ x: number; y: number }>;
}

/**
 * Computes least-squares linear regression line.
 * Handles edge cases: points < 2 returns isComputable: false.
 */
export function calculateLinearRegression(
  points: Array<{ x: number; y: number }>
): LinearRegressionResult {
  if (!points || points.length < 2) {
    return { slope: 0, intercept: 0, rSquared: 0, isComputable: false, points: [] };
  }

  const n = points.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  for (const p of points) {
    sumX += p.x;
    sumY += p.y;
    sumXY += p.x * p.y;
    sumXX += p.x * p.x;
  }

  const denominator = n * sumXX - sumX * sumX;
  if (denominator === 0) {
    return { slope: 0, intercept: sumY / n, rSquared: 0, isComputable: false, points };
  }

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  // Compute R-squared
  const meanY = sumY / n;
  let ssTotal = 0;
  let ssRes = 0;

  for (const p of points) {
    const yPred = slope * p.x + intercept;
    ssTotal += Math.pow(p.y - meanY, 2);
    ssRes += Math.pow(p.y - yPred, 2);
  }

  const rSquared = ssTotal === 0 ? 1 : Math.max(0, 1 - ssRes / ssTotal);

  return {
    slope,
    intercept,
    rSquared,
    isComputable: true,
    points,
  };
}

/**
 * Pure function: Computes department-level readiness breakdown
 */
export function computeDepartmentBreakdown(
  users: User[],
  records: CompetencyRecord[],
  activityCompetencies: ActivityCompetency[],
  activePriorities: TrainingPriority[]
): DepartmentSummary[] {
  const deptMap = new Map<string, User[]>();

  for (const user of users) {
    const dept = user.department || 'Unassigned';
    const list = deptMap.get(dept) || [];
    list.push(user);
    deptMap.set(dept, list);
  }

  const requiredCompetencies = activityCompetencies.map((ac) => ({
    competencyId: ac.competency_id,
    targetLevel: ac.target_level,
  }));

  const results: DepartmentSummary[] = [];

  for (const [department, deptUsers] of deptMap.entries()) {
    let totalReadiness = 0;
    let criticalGapCount = 0;

    for (const user of deptUsers) {
      const userRecords = records.filter((r) => r.user_id === user.id);
      const userRecordMap = new Map(userRecords.map((r) => [r.competency_id, r.current_level]));

      const readiness = computeReadinessIndex(requiredCompetencies, userRecordMap);
      totalReadiness += readiness;

      // Count critical gaps
      for (const ac of activityCompetencies) {
        const level = userRecordMap.get(ac.competency_id) ?? 1;
        const severity = computeGapSeverity(level, ac.target_level, ac.priority);
        if (severity === 2) {
          criticalGapCount++;
        }
      }
    }

    const avgReadiness = deptUsers.length > 0 ? Math.round(totalReadiness / deptUsers.length) : 0;
    const isPriorityFlagged = activePriorities.some(
      (p) => p.department.toLowerCase() === department.toLowerCase() && !p.resolved
    );

    results.push({
      department,
      officialCount: deptUsers.length,
      avgReadiness,
      criticalGapCount,
      trendDirection: avgReadiness >= 70 ? 'up' : avgReadiness >= 50 ? 'stable' : 'down',
      isPriorityFlagged,
    });
  }

  // Sort by readiness ascending (lowest readiness first to highlight needs)
  return results.sort((a, b) => a.avgReadiness - b.avgReadiness);
}

/**
 * Pure function: Computes organization-wide macro overview
 */
export function computeWorkforceOverview(
  users: User[],
  records: CompetencyRecord[],
  activityCompetencies: ActivityCompetency[],
  activePriorities: TrainingPriority[]
): WorkforceOverview {
  const departments = computeDepartmentBreakdown(users, records, activityCompetencies, activePriorities);

  const totalOfficials = users.length;
  const totalReadinessSum = departments.reduce((acc, d) => acc + d.avgReadiness * d.officialCount, 0);
  const avgReadiness = totalOfficials > 0 ? Math.round(totalReadinessSum / totalOfficials) : 0;
  const criticalGaps = departments.reduce((acc, d) => acc + d.criticalGapCount, 0);
  const activePrioritiesCount = activePriorities.filter((p) => !p.resolved).length;

  return {
    totalOfficials,
    avgReadiness,
    criticalGaps,
    trendDirection: avgReadiness >= 70 ? 'up' : avgReadiness >= 50 ? 'stable' : 'down',
    activePrioritiesCount,
  };
}
