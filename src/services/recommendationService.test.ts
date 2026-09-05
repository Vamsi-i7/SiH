import { describe, it, expect } from 'vitest';
import { rankCoursesForGaps } from './recommendationService';
import type { CompetencyGap } from '@/lib/types';

describe('recommendationService - Course Ranking Algorithm', () => {
  it('returns empty array when no gaps are provided', () => {
    const results = rankCoursesForGaps([]);
    expect(results).toEqual([]);
  });

  it('ranks critical gap courses higher than desirable gap courses', () => {
    const mockGaps: CompetencyGap[] = [
      {
        competencyId: 'comp-capi',
        competency: {
          id: 'comp-capi',
          name: 'CAPI Tablet Operation',
          name_hi: 'कैपी टैबलेट संचालन',
          category: 'Domain',
          description: 'CAPI operations',
          levels: { L1: 'L1', L2: 'L2', L3: 'L3', L4: 'L4', L5: 'L5' },
          provenance: 'PROPOSED_FRAMEWORK',
          created_at: '2026-09-06T00:00:00Z',
        },
        activity: {
          id: 'act-1',
          name: 'Field Listing',
          name_hi: 'क्षेत्र सूचीकरण',
          description: 'Desc',
          role_id: 'role-fi',
          provenance: 'PROPOSED_FRAMEWORK',
          created_at: '2026-09-06T00:00:00Z',
        },
        currentLevel: 1,
        targetLevel: 4,
        gap: 3,
        priority: 'critical',
        severity: 'HIGH',
        evidenceType: 'assessment-verified',
      },
      {
        competencyId: 'comp-teamwork',
        competency: {
          id: 'comp-teamwork',
          name: 'Teamwork & Collaboration',
          name_hi: 'टीम वर्क और सहयोग',
          category: 'Behavioural',
          description: 'Team collaboration',
          levels: { L1: 'L1', L2: 'L2', L3: 'L3', L4: 'L4', L5: 'L5' },
          provenance: 'PROPOSED_FRAMEWORK',
          created_at: '2026-09-06T00:00:00Z',
        },
        activity: {
          id: 'act-2',
          name: 'Field Coordination',
          name_hi: 'क्षेत्र समन्वय',
          description: 'Desc',
          role_id: 'role-fi',
          provenance: 'PROPOSED_FRAMEWORK',
          created_at: '2026-09-06T00:00:00Z',
        },
        currentLevel: 2,
        targetLevel: 3,
        gap: 1,
        priority: 'desirable',
        severity: 'MODERATE',
        evidenceType: 'self-assessed',
      },
    ];

    const results = rankCoursesForGaps(mockGaps);

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].course.id).toBe('course-capi-101');
    expect(results[0].priority).toBe('HIGH');
    expect(results[0].score).toBeGreaterThan(results[results.length - 1].score);
    expect(results[0].whyRecommended).toContain('CAPI Tablet Operation');
    expect(results[0].whyRecommended_hi).toContain('कैपी टैबलेट संचालन');
  });

  it('generates transparent explainability metadata for every matched gap', () => {
    const mockGaps: CompetencyGap[] = [
      {
        competencyId: 'comp-nsso',
        competency: {
          id: 'comp-nsso',
          name: 'NSSO Protocol Mastery',
          name_hi: 'एनएसएसओ प्रोटोकॉल निपुणता',
          category: 'Domain',
          description: 'NSSO protocols',
          levels: { L1: 'L1', L2: 'L2', L3: 'L3', L4: 'L4', L5: 'L5' },
          provenance: 'PROPOSED_FRAMEWORK',
          created_at: '2026-09-06T00:00:00Z',
        },
        activity: {
          id: 'act-3',
          name: 'PLFS Surveying',
          name_hi: 'पीएलएफएस सर्वेक्षण',
          description: 'Desc',
          role_id: 'role-jso',
          provenance: 'PROPOSED_FRAMEWORK',
          created_at: '2026-09-06T00:00:00Z',
        },
        currentLevel: 1,
        targetLevel: 3,
        gap: 2,
        priority: 'important',
        severity: 'HIGH',
        evidenceType: 'self-assessed',
      },
    ];

    const results = rankCoursesForGaps(mockGaps);
    const nssoCourse = results.find((r) => r.course.id === 'course-nsso-plfs');

    expect(nssoCourse).toBeDefined();
    expect(nssoCourse?.matchingGaps[0].gap).toBe(2);
    expect(nssoCourse?.matchingGaps[0].currentLevel).toBe(1);
    expect(nssoCourse?.matchingGaps[0].targetLevel).toBe(3);
  });
});
