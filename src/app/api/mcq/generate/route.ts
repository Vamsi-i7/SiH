import { NextResponse } from 'next/server';
import { MCQService } from '@/services/mcqService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { competencyId, difficulty, topicPrompt, citationSource, docText, docTitle, questionFocus } = body;

    if (!competencyId) {
      return NextResponse.json({ error: 'Competency ID required' }, { status: 400 });
    }

    const question = await MCQService.generateMCQ({
      competencyId,
      difficulty: difficulty || 'medium',
      topicPrompt,
      citationSource,
      docText,
      docTitle,
      questionFocus: questionFocus || 'general',
    });

    return NextResponse.json({
      success: true,
      question,
    });
  } catch (error) {
    console.error('MCQ Generation error:', error);
    return NextResponse.json({ error: 'Failed to generate MCQ' }, { status: 500 });
  }
}
