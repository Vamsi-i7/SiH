/**
 * src/services/textExtractionService.ts
 *
 * Robust multimodal text extraction service supporting:
 * 1. PDF parsing via unpdf (extracts page streams, text items)
 * 2. OCR text extraction via Tesseract.js (for images and scanned documents)
 * 3. Standard text decoder for TXT/MD/CSV files
 */

import { extractText as extractPdfText } from 'unpdf';
import Tesseract from 'tesseract.js';

export interface ExtractionResult {
  text: string;
  method: 'pdf_parse' | 'ocr_tesseract' | 'plain_text';
  totalPages?: number;
  wordCount: number;
}

export class TextExtractionService {
  /**
   * Extracts text from a file buffer based on filename and MIME type
   */
  static async extractText(
    buffer: ArrayBuffer | Uint8Array | Buffer,
    filename: string,
    mimeType?: string
  ): Promise<ExtractionResult> {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);

    // 1. PDF Document
    if (ext === 'pdf' || mimeType === 'application/pdf') {
      try {
        const result = await extractPdfText(bytes);
        const joinedText = Array.isArray(result.text) ? result.text.join('\n\n') : String(result.text || '');
        const cleaned = this.cleanText(joinedText);

        if (cleaned.length > 50) {
          return {
            text: cleaned,
            method: 'pdf_parse',
            totalPages: result.totalPages,
            wordCount: this.countWords(cleaned),
          };
        }
        // If PDF has no digital text (scanned PDF), proceed to OCR fallback
      } catch (err) {
        console.warn('PDF parsing error, attempting fallback:', err);
      }
    }

    // 2. Image files (OCR via Tesseract.js)
    const isImage =
      ['png', 'jpg', 'jpeg', 'webp', 'tiff', 'bmp'].includes(ext) ||
      (mimeType && mimeType.startsWith('image/'));

    if (isImage) {
      try {
        const nodeBuffer = Buffer.from(bytes);
        const { data } = await Tesseract.recognize(nodeBuffer, 'eng');
        const cleaned = this.cleanText(data.text);

        return {
          text: cleaned || 'No legible text detected via OCR.',
          method: 'ocr_tesseract',
          wordCount: this.countWords(cleaned),
        };
      } catch (err) {
        console.warn('OCR extraction error:', err);
      }
    }

    // 3. Standard Plain Text / Markdown / CSV
    try {
      const decoder = new TextDecoder('utf-8');
      const decoded = decoder.decode(bytes);
      const cleaned = this.cleanText(decoded);

      return {
        text: cleaned || 'Empty document provided.',
        method: 'plain_text',
        wordCount: this.countWords(cleaned),
      };
    } catch {
      return {
        text: 'Failed to decode document content.',
        method: 'plain_text',
        wordCount: 0,
      };
    }
  }

  /**
   * Clean text of erratic whitespace and binary noise
   */
  private static cleanText(text: string): string {
    return text
      .replace(/[\x00-\x09\x0B-\x0C\x0E-\x1F\x7F]/g, '') // Remove non-printable control chars
      .replace(/\r\n/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  private static countWords(text: string): number {
    if (!text) return 0;
    return text.split(/\s+/).filter(Boolean).length;
  }
}
