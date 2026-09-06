import { describe, it, expect, vi } from 'vitest';
import { MCQService } from './mcqService';
import { GroqService } from './groqService';

describe('MCQService', () => {
  it('generates deterministic fallback template when requested', () => {
    const question = MCQService.generateTemplateFallback({
      competencyId: 'comp-capi',
      difficulty: 'medium',
      docTitle: 'My_Custom_CAPI_Handbook_2025',
      docText: 'Section 4: Field supervisors must verify GPS threshold within 5 metres.',
      citationSource: 'My_Custom_CAPI_Handbook_2025, Section 4',
    });

    expect(question.id).toBeDefined();
    expect(question.competencyId).toBe('comp-capi');
    expect(question.stemEn).toContain('My_Custom_CAPI_Handbook_2025');
    expect(question.stemEn).toContain('GPS threshold');
    expect(question.stemHi).toContain('My_Custom_CAPI_Handbook_2025');
    expect(question.optionsEn.length).toBe(4);
    expect(question.optionsHi.length).toBe(4);
    expect(question.citation).toBe('My_Custom_CAPI_Handbook_2025, Section 4');
  });

  it('generates high-quality question with Groq AI or graceful fallback', async () => {
    const question = await MCQService.generateMCQ({
      competencyId: 'comp-capi',
      difficulty: 'hard',
      questionFocus: 'protocols',
      docTitle: 'PLFS_Enumerator_Manual_2025',
      docText: 'Clause 8.1: Under no circumstance may an enumerator mark a household as non-existent without cadastral supervisor re-verification.',
    });

    expect(question.id).toBeDefined();
    expect(question.stemEn.length).toBeGreaterThan(15);
    expect(question.stemHi.length).toBeGreaterThan(15);
    expect(question.optionsEn.length).toBe(4);
    expect(question.optionsHi.length).toBe(4);
    expect(question.correctIndex).toBeGreaterThanOrEqual(0);
    expect(question.correctIndex).toBeLessThanOrEqual(3);
    expect(question.consensusScore).toBeGreaterThanOrEqual(0.9);
    expect(question.modelsEvaluated.length).toBeGreaterThanOrEqual(1);
  });

  it('falls back to template if Groq API throws an error', async () => {
    const spy = vi.spyOn(GroqService, 'chatCompletion').mockRejectedValueOnce(new Error('Network timeout'));

    const question = await MCQService.generateMCQ({
      competencyId: 'comp-survey',
      difficulty: 'medium',
      docTitle: 'Fallback_Manual',
    });

    expect(question.id).toBeDefined();
    expect(question.competencyId).toBe('comp-survey');
    expect(question.optionsEn.length).toBe(4);

    spy.mockRestore();
  });

  it('generates a batch of distinct MCQs matching requested count', async () => {
    const questions = await MCQService.generateBatchMCQ(
      {
        competencyId: 'comp-nsso',
        difficulty: 'medium',
        docTitle: 'NSSO_Operational_Guide',
        docText: 'Clause 2: Stratified multistage designs require second-stage sampling of households by monthly per-capita expenditure.',
      },
      3
    );

    expect(questions.length).toBe(3);
    questions.forEach((q) => {
      expect(q.id).toBeDefined();
      expect(q.competencyId).toBe('comp-nsso');
      expect(q.optionsEn.length).toBe(4);
      expect(q.optionsHi.length).toBe(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThanOrEqual(3);
    });
  });
});

