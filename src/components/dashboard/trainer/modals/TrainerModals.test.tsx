import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { BatchInspectionModal } from './BatchInspectionModal';
import { CohortRemediationModal } from './CohortRemediationModal';
import { ItemAnalysisModal } from './ItemAnalysisModal';
import { ACTIVE_COHORTS, QUESTION_DECKS } from '../HorizontalTrainerCarousels';

describe('Trainer Modals', () => {
  describe('BatchInspectionModal', () => {
    it('returns null when closed', () => {
      const html = renderToString(
        <BatchInspectionModal
          isOpen={false}
          onClose={vi.fn()}
          cohort={ACTIVE_COHORTS[0]}
        />
      );
      expect(html).toBe('');
    });

    it('renders cohort details, stats, and trainee roster when open', () => {
      const html = renderToString(
        <BatchInspectionModal
          isOpen={true}
          onClose={vi.fn()}
          cohort={ACTIVE_COHORTS[0]}
        />
      );
      expect(html).toContain('JSO Induction 2026 (Batch 44)');
      expect(html).toContain('Enrolled Cadre');
      expect(html).toContain('Cohort Mean Score');
      expect(html).toContain('Syllabus Progress');
      expect(html).toContain('At-Risk Deficit');
      expect(html).toContain('Officer Roster');
      expect(html).toContain('Amit Sharma');
    });
  });

  describe('CohortRemediationModal', () => {
    it('returns null when closed', () => {
      const html = renderToString(
        <CohortRemediationModal
          isOpen={false}
          onClose={vi.fn()}
          targetCohort={ACTIVE_COHORTS[0]}
        />
      );
      expect(html).toBe('');
    });

    it('renders remediation form options when open', () => {
      const html = renderToString(
        <CohortRemediationModal
          isOpen={true}
          onClose={vi.fn()}
          targetCohort={ACTIVE_COHORTS[0]}
        />
      );
      expect(html).toContain('Curate Remedial Drill');
      expect(html).toContain('Target Recipients');
      expect(html).toContain('At-Risk Officers Only');
      expect(html).toContain('Schedule 0.0 Hamlet-Group Demarcation');
      expect(html).toContain('Dispatch Remediation Drill');
    });
  });

  describe('ItemAnalysisModal', () => {
    it('returns null when closed', () => {
      const html = renderToString(
        <ItemAnalysisModal
          isOpen={false}
          onClose={vi.fn()}
          item={QUESTION_DECKS[0].sampleItem}
        />
      );
      expect(html).toBe('');
    });

    it('renders psychometric properties and distractor spread when open', () => {
      const html = renderToString(
        <ItemAnalysisModal
          isOpen={true}
          onClose={vi.fn()}
          item={QUESTION_DECKS[0].sampleItem}
        />
      );
      expect(html).toContain('Psychometric Item Analysis');
      expect(html).toContain('Discriminator');
      expect(html).toContain('Distractor Frequency &amp; Selection Spread');
      expect(html).toContain('Official MoSPI Manual Citation');
      expect(html).toContain('Flag for Revision');
      expect(html).toContain('Approve for Exam Pool');
    });
  });
});
