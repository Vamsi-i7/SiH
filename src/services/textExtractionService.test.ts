import { describe, it, expect } from 'vitest';
import { TextExtractionService } from './textExtractionService';

describe('TextExtractionService', () => {
  it('extracts and cleans plain text files', async () => {
    const textContent = `
      MoSPI NSSO Operational Guidelines
      
      Section 1: Field verification protocols must be adhered to.
      
      
      Section 2: Zero omission tolerance.
    `;
    const encoder = new TextEncoder();
    const buffer = encoder.encode(textContent);

    const result = await TextExtractionService.extractText(buffer, 'test_manual.txt', 'text/plain');

    expect(result.method).toBe('plain_text');
    expect(result.wordCount).toBeGreaterThan(10);
    expect(result.text).toContain('MoSPI NSSO Operational Guidelines');
    expect(result.text).toContain('Zero omission tolerance');
    // Ensure excessive line breaks were normalized
    expect(result.text).not.toContain('\n\n\n');
  });

  it('handles empty document gracefully with fallback text', async () => {
    const emptyBuffer = new Uint8Array(0);
    const result = await TextExtractionService.extractText(emptyBuffer, 'empty.txt');

    expect(result.method).toBe('plain_text');
    expect(result.text).toBe('Empty document provided.');
    expect(result.wordCount).toBe(3);
  });

  it('detects and classifies PDF files', async () => {
    // Minimal PDF header
    const mockPdfBytes = new TextEncoder().encode('%PDF-1.4 mock pdf data');
    const result = await TextExtractionService.extractText(mockPdfBytes, 'sample.pdf', 'application/pdf');

    expect(result).toBeDefined();
    expect(['pdf_parse', 'plain_text']).toContain(result.method);
  });
});
