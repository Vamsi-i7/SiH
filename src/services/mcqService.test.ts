import { describe, it, expect } from 'vitest';
import { MCQService } from './mcqService';

describe('MCQService', () => {
  it('generates standard template MCQ for competency', async () => {
    const question = await MCQService.generateMCQ({
      competencyId: 'comp-capi',
      difficulty: 'medium',
    });

    expect(question.id).toBeDefined();
    expect(question.competencyId).toBe('comp-capi');
    expect(question.stemEn).toContain('CAPI');
    expect(question.stemHi).toBeDefined();
    expect(question.optionsEn.length).toBe(4);
    expect(question.optionsHi.length).toBe(4);
    expect(question.correctIndex).toBeGreaterThanOrEqual(0);
    expect(question.consensusScore).toBeGreaterThanOrEqual(0.9);
  });

  it('grounds generated question in user uploaded document title and text', async () => {
    const question = await MCQService.generateMCQ({
      competencyId: 'comp-capi',
      difficulty: 'hard',
      docTitle: 'My_Custom_CAPI_Handbook_2025',
      docText: 'Section 4: Field supervisors must verify GPS threshold within 5 metres before submitting block clusters.',
      citationSource: 'My_Custom_CAPI_Handbook_2025, Section 4',
    });

    expect(question.stemEn).toContain('My_Custom_CAPI_Handbook_2025');
    expect(question.stemEn).toContain('GPS threshold');
    expect(question.stemHi).toContain('My_Custom_CAPI_Handbook_2025');
    expect(question.rationaleEn).toContain('My_Custom_CAPI_Handbook_2025');
    expect(question.citation).toBe('My_Custom_CAPI_Handbook_2025, Section 4');
  });
});
