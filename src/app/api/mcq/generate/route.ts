import { NextResponse } from 'next/server';
import { MCQService } from '@/services/mcqService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { competencyId, difficulty, topicPrompt, citationSource, docText, docTitle, questionFocus, count } = body;

    if (!competencyId) {
      return NextResponse.json({ error: 'Competency ID required' }, { status: 400 });
    }

    const requestedCount = Math.max(1, Math.min(25, Number(count) || 1));

    const questions = await MCQService.generateBatchMCQ(
      {
        competencyId,
        difficulty: difficulty || 'medium',
        topicPrompt,
        citationSource,
        docText,
        docTitle,
        questionFocus: questionFocus || 'general',
      },
      requestedCount
    );

    return NextResponse.json({
      success: true,
      question: questions[0] || null,
      questions,
      count: questions.length,
    });
  } catch (error) {
    console.error('MCQ Generation error:', error);
    return NextResponse.json({ error: 'Failed to generate MCQ' }, { status: 500 });
  }
}
