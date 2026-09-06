/**
 * Competency Service
 * Core domain logic for gap calculation, readiness indexing, and severity computation
 * Framework-agnostic (no React dependencies)
 */

import type {
  ActivityCompetency,
  CompetencyRecord,
  CompetencyGap,
  ActivityPriority,
  SeverityBucket,
  Activity,
  Competency,
} from '@/lib/types';

// ============================================================================
// CONSTANTS
// ============================================================================

export const SEVERITY_WEIGHTS = {
  critical: 100,
  important: 50,
  desirable: 10,
};

export const GAP_PRIORITY_WEIGHTS: Record<ActivityPriority, number> = {
  critical: 3,
  important: 2,
  desirable: 1,
};

// ============================================================================
// DOMAIN LOGIC
// ============================================================================

/**
 * Compute severity score based on gap and priority weight (PRD §4.1)
 * Severity Score = max(0, targetLevel - currentLevel) * priorityWeight
 * where critical=3, important=2, desirable=1
 */
export function computeGapSeverity(
  currentLevel: number,
  targetLevel: number,
  priority: ActivityPriority
): number {
  const gap = Math.max(0, targetLevel - currentLevel);
  const weight = GAP_PRIORITY_WEIGHTS[priority] ?? 1;
  return gap * weight;
}

/**
 * Classify severity score into official FRAC severity buckets (PRD §4.1)
 * Score >= 4  → HIGH (Critical Gap)
 * Score 2-3   → MODERATE (Moderate Gap)
 * Score <= 1  → PROFICIENT (Proficient)
 */
export function classifySeverity(score: number): SeverityBucket {
  if (score >= 4) return 'HIGH';
  if (score >= 2) return 'MODERATE';
  return 'PROFICIENT';
}

/**
 * Determine promoted competency level after assessment completion (PRD §4.1, §4.3)
 * - Score < 40%: No promotion
 * - Score 40-69%: +1 level if current < L3 (capped at L3)
 * - Score >= 70%: +2 levels (or +1 level in strictMode, capped at L5)
 */
export function promoteCompetencyLevel(
  currentLevel: number,
  score: number,
  options?: { strictMode?: boolean }
): number {
  if (currentLevel >= 5) return 5;
  if (score < 40) return currentLevel;

  if (options?.strictMode) {
    if (score >= 70) {
      return Math.min(5, currentLevel + 1);
    }
    if (currentLevel < 3) {
      return Math.min(3, currentLevel + 1);
    }
    return currentLevel;
  }

  // Score > 70%: promote by up to 2 levels, cap at 5
  if (score > 70) {
    return Math.min(5, currentLevel + 2);
  }

  // Score === 70%: promote if < L3, capped at L3
  if (score === 70) {
    if (currentLevel < 3) {
      return Math.min(3, currentLevel + 2);
    }
    return currentLevel;
  }

  // Medium score: 40% - 69% (promote by 1 level if < L3, capped at L3)
  if (currentLevel < 3) {
    return Math.min(3, currentLevel + 1);
  }

  return currentLevel;
}

/**
 * Compute readiness index: % of required competencies at or above target level
 */
export function computeReadinessIndex(
  requiredCompetencies: Array<{ competencyId: string; targetLevel: number }>,
  userRecords: Map<string, number>
): number {
  if (requiredCompetencies.length === 0) return 0;

  const metCount = requiredCompetencies.filter((req) => {
    const userLevel = userRecords.get(req.competencyId) ?? 0;
    return userLevel >= req.targetLevel;
  }).length;

  return Math.round((metCount / requiredCompetencies.length) * 100);
}

/**
 * Build a CompetencyGap record with full details
 */
function buildCompetencyGap(
  competency: Competency,
  activity: Activity,
  currentLevel: number,
  targetLevel: number,
  priority: ActivityPriority,
  evidenceType: 'self-assessed' | 'assessment-verified'
): CompetencyGap | null {
  const gap = Math.max(0, targetLevel - currentLevel);
  const severityScore = computeGapSeverity(currentLevel, targetLevel, priority);
  const severity = classifySeverity(severityScore);

  return {
    competencyId: competency.id,
    competency,
    activity,
    currentLevel,
    targetLevel,
    gap,
    priority,
    severity,
    evidenceType,
  };
}

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * Analyze competency gaps for a user in a specific role
 * Called by Dashboard, Skill Gap Analysis, Pathways
 */
export async function analyzeCompetencyGaps({
  userCompetencies,
  activityCompetencies,
  competencies,
  activities,
  roleId,
  activityId,
}: {
  userCompetencies: CompetencyRecord[];
  activityCompetencies: ActivityCompetency[];
  competencies: Map<string, Competency>;
  activities: Map<string, Activity>;
  roleId?: string;
  activityId?: string;
}): Promise<{
  gaps: CompetencyGap[];
  readinessIndex: number;
  topGaps: CompetencyGap[];
}> {
  // 1. Build user record map for quick lookup
  const userRecords = new Map(userCompetencies.map((rec) => [rec.competency_id, rec.current_level]));

  // 2. Filter mappings
  const relevantMappings = activityCompetencies.filter((ac) => {
    if (activityId) return activities.get(ac.activity_id)?.id === activityId;
    if (roleId) return activities.get(ac.activity_id)?.role_id === roleId;
    return true;
  });

  // 3. Build gaps for each required competency
  const gaps: CompetencyGap[] = relevantMappings
    .map((ac) => {
      const competency = competencies.get(ac.competency_id);
      const activity = activities.get(ac.activity_id);

      if (!competency || !activity) return null;

      const userRecord = userCompetencies.find((r) => r.competency_id === ac.competency_id);
      const currentLevel = userRecord?.current_level ?? 1;
      const evidenceType: 'self-assessed' | 'assessment-verified' = userRecord?.evidence ? 'assessment-verified' : 'self-assessed';

      return buildCompetencyGap(
        competency,
        activity,
        currentLevel,
        ac.target_level,
        ac.priority,
        evidenceType
      );
    })
    .filter((g): g is CompetencyGap => g !== null);

  // 4. Sort by severity (descending)
  gaps.sort((a, b) => {
    const scoreA = computeGapSeverity(a.currentLevel, a.targetLevel, a.priority);
    const scoreB = computeGapSeverity(b.currentLevel, b.targetLevel, b.priority);
    return scoreB - scoreA;
  });

  // 5. Compute readiness index
  const requiredCompetencies = relevantMappings.map((ac) => ({
    competencyId: ac.competency_id,
    targetLevel: ac.target_level,
  }));

  const readinessIndex = computeReadinessIndex(requiredCompetencies, userRecords);

  // 6. Top 3 gaps
  const topGaps = gaps.slice(0, 3);

  return {
    gaps,
    readinessIndex,
    topGaps,
  };
}

/**
 * Compute severity label for UI display
 */
export function getSeverityLabel(severity: SeverityBucket): string {
  const labels = {
    HIGH: 'Critical Gap',
    MODERATE: 'Moderate Gap',
    PROFICIENT: 'Proficient',
  };
  return labels[severity];
}

/**
 * Export all public functions and types
 */
export const CompetencyService = {
  analyzeCompetencyGaps,
  computeGapSeverity,
  classifySeverity,
  computeReadinessIndex,
  promoteCompetencyLevel,
  getSeverityLabel,
};
