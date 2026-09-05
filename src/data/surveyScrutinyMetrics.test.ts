import { describe, it, expect } from 'vitest';
import { SYNTHETIC_SURVEY_OUTCOMES } from './surveyScrutinyMetrics';

describe('surveyScrutinyMetrics', () => {
  it('contains 3 MoSPI scrutiny outcome series', () => {
    expect(SYNTHETIC_SURVEY_OUTCOMES).toHaveLength(3);
  });

  it('tags every series with SYNTHETIC_DEMO_DATA provenance', () => {
    SYNTHETIC_SURVEY_OUTCOMES.forEach((series) => {
      expect(series.provenance).toBe('SYNTHETIC_DEMO_DATA');
      expect(series.methodologyNote).toBeDefined();
      expect(series.methodologyNote.length).toBeGreaterThan(10);
      expect(series.dataPoints.length).toBeGreaterThanOrEqual(4);
    });
  });

  it('has bilingual labels for all series', () => {
    SYNTHETIC_SURVEY_OUTCOMES.forEach((series) => {
      expect(series.metricName).toBeTruthy();
      expect(series.metricNameHi).toBeTruthy();
      expect(series.narrativeInsight).toBeTruthy();
      expect(series.narrativeInsightHi).toBeTruthy();
    });
  });
});
