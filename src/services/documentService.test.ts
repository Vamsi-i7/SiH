import { describe, it, expect } from 'vitest';
import { DocumentService } from './documentService';

describe('DocumentService', () => {
  it('returns sample documents', () => {
    const samples = DocumentService.getSampleDocuments();
    expect(samples.length).toBeGreaterThan(0);
    expect(samples[0].id).toBeDefined();
    expect(samples[0].filename).toBeDefined();
    expect(samples[0].targetCompetencies.length).toBeGreaterThan(0);
  });

  it('processes text into semantic chunks and metadata', async () => {
    const textContent = `
Chapter 1: Field Operations Overview
The primary survey data is gathered across multiple national NSSO zones.

Chapter 2: CAPI Tablet Ingestion
GPS coordinates must be captured within 10 metres accuracy.
    `;

    const result = await DocumentService.processDocument(
      'Test_Survey_Manual.txt',
      textContent,
      ['comp-capi']
    );

    expect(result.id).toBeDefined();
    expect(result.title).toBe('Test_Survey_Manual');
    expect(result.filename).toBe('Test_Survey_Manual.txt');
    expect(result.targetCompetencies).toEqual(['comp-capi']);
    expect(result.chunks).toBeDefined();
    expect(result.chunks!.length).toBe(2);
    expect(result.chunks![0].text).toContain('Chapter 1');
    expect(result.chunks![1].text).toContain('Chapter 2');
  });

  it('handles getDocuments fallback gracefully when offline', async () => {
    const docs = await DocumentService.getDocuments();
    expect(docs.length).toBeGreaterThanOrEqual(2);
  });
});
