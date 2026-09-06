import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ManualReaderModal } from './ManualReaderModal';

describe('ManualReaderModal Component', () => {
  it('renders handbook title and chapter list when open', () => {
    const html = renderToString(
      <ManualReaderModal
        isOpen={true}
        onClose={vi.fn()}
        manualId="manual-plfs-vol1"
        isHindi={false}
      />
    );
    expect(html).toContain('Instructions to Field Staff');
    expect(html).toContain('NSSO Field Operations Division');
    expect(html).toContain('Concepts, Definitions &amp; Activity Status Codes');
    expect(html).toContain('Download Official PDF');
  });

  it('renders Hindi strings when isHindi is true', () => {
    const html = renderToString(
      <ManualReaderModal
        isOpen={true}
        onClose={vi.fn()}
        manualId="manual-plfs-vol1"
        isHindi={true}
      />
    );
    expect(html).toContain('फील्ड स्टाफ के लिए निर्देश');
    expect(html).toContain('अध्याय');
  });

  it('renders nothing when isOpen is false', () => {
    const html = renderToString(
      <ManualReaderModal
        isOpen={false}
        onClose={vi.fn()}
        manualId="manual-plfs-vol1"
      />
    );
    expect(html).toBe('');
  });
});
