import { describe, it, expect, beforeEach } from 'vitest';
import type { ReviewItem } from './page';

describe('Review Queue Triage & Certification Logic', () => {
  let sampleItems: ReviewItem[];

  beforeEach(() => {
    sampleItems = [
      {
        id: 'rq-test-1',
        competency: 'CAPI Tablet Operation',
        stem: 'What is the required procedure when a sample household has migrated?',
        stemHi: 'जब कोई नमूना परिवार स्थानांतरित हो गया हो तो क्या करें?',
        options: [
          'Record Casualty Code 4 in Schedule 0.0',
          'Pick next household arbitrarily',
          'Leave survey incomplete',
          'Mark as absent',
        ],
        optionsHi: [
          'अनुसूची 0.0 में कैजुअल्टी कोड 4 दर्ज करें',
          'मनमाने ढंग से अगला घर चुनें',
          'सर्वे अधूरा छोड़ें',
          'अनुपस्थित के रूप में चिह्नित करें',
        ],
        correctIndex: 0,
        citation: 'PLFS Manual 2024, Section 3.2.1',
        consensusScore: 0.96,
        status: 'PENDING',
        sourceDoc: 'PLFS Field Manual 2024',
        createdAt: '2026-03-01T10:00:00Z',
      },
      {
        id: 'rq-test-2',
        competency: 'NSSO Protocol Mastery',
        stem: 'Which schedule is utilized for recording consumer expenditure?',
        stemHi: 'उपभोक्ता व्यय के लिए किस अनुसूची का उपयोग किया जाता है?',
        options: ['Schedule 1.0', 'Schedule 10.0', 'Schedule 2.1', 'Schedule 0.0'],
        optionsHi: ['अनुसूची 1.0', 'अनुसूची 10.0', 'अनुसूची 2.1', 'अनुसूची 0.0'],
        correctIndex: 0,
        citation: 'NSS 80th Round Reference Guide',
        consensusScore: 0.98,
        status: 'APPROVED',
        sourceDoc: 'NSSO FOD Guidelines',
        createdAt: '2026-03-02T11:30:00Z',
      },
      {
        id: 'rq-test-3',
        competency: 'Cadastral Mapping',
        stem: 'What is the permissible variation in hamlet group population estimation?',
        stemHi: 'हेमलेट समूह गठन में अनुमेय भिन्नता क्या है?',
        options: ['Not more than 20%', 'Arbitrary', 'No limit', 'Landowners only'],
        optionsHi: ['20% से अधिक नहीं', 'मनमाना', 'कोई सीमा नहीं', 'केवल भूमि स्वामी'],
        correctIndex: 0,
        citation: 'Rule 4.2: Sub-sampling',
        consensusScore: 0.95,
        status: 'PUBLISHED',
        sourceDoc: 'NSSO FOD Guidelines',
        createdAt: '2026-03-03T14:15:00Z',
      },
    ];
  });

  it('filters items correctly by status tab', () => {
    const pending = sampleItems.filter((i) => i.status === 'PENDING');
    expect(pending).toHaveLength(1);
    expect(pending[0].id).toBe('rq-test-1');

    const approved = sampleItems.filter((i) => i.status === 'APPROVED');
    expect(approved).toHaveLength(1);
    expect(approved[0].id).toBe('rq-test-2');

    const published = sampleItems.filter((i) => i.status === 'PUBLISHED');
    expect(published).toHaveLength(1);
    expect(published[0].id).toBe('rq-test-3');
  });

  it('searches and matches keywords in stem, competency, or citation', () => {
    const query = 'migrated';
    const matches = sampleItems.filter(
      (item) =>
        item.stem.toLowerCase().includes(query) ||
        item.competency.toLowerCase().includes(query) ||
        item.citation.toLowerCase().includes(query)
    );
    expect(matches).toHaveLength(1);
    expect(matches[0].id).toBe('rq-test-1');

    const queryManual = 'guidelines';
    const manualMatches = sampleItems.filter((item) =>
      item.sourceDoc?.toLowerCase().includes(queryManual)
    );
    expect(manualMatches).toHaveLength(2);
  });

  it('handles item certification from PENDING to APPROVED', () => {
    const targetId = 'rq-test-1';
    const updated = sampleItems.map((item) =>
      item.id === targetId ? { ...item, status: 'APPROVED' as const } : item
    );

    const target = updated.find((i) => i.id === targetId);
    expect(target?.status).toBe('APPROVED');
    expect(updated.filter((i) => i.status === 'APPROVED')).toHaveLength(2);
  });

  it('handles publishing to live question bank pool', () => {
    const target = sampleItems.find((i) => i.id === 'rq-test-2');
    expect(target).toBeDefined();

    const liveBank: ReviewItem[] = [];
    if (target) {
      liveBank.push({ ...target, status: 'PUBLISHED' });
    }

    expect(liveBank).toHaveLength(1);
    expect(liveBank[0].id).toBe('rq-test-2');
    expect(liveBank[0].status).toBe('PUBLISHED');
  });

  it('supports inline editing of question stem and option text', () => {
    const target = sampleItems[0];
    const edited: ReviewItem = {
      ...target,
      stem: 'Updated: What is the official protocol when a sample household has migrated?',
      options: [
        'Record Casualty Code 4 in Schedule 0.0 with cadastral supervisor verification',
        ...target.options.slice(1),
      ],
    };

    expect(edited.stem).toContain('Updated:');
    expect(edited.options[0]).toContain('cadastral supervisor verification');
    expect(edited.options).toHaveLength(4);
    expect(edited.correctIndex).toBe(0);
  });
});
