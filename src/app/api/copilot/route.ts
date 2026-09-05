import { NextRequest, NextResponse } from 'next/server';
import { getSystemPromptWithContext, getOfflineFallbackResponse } from '@/lib/copilotPrompt';
import type { CopilotUserContext } from '@/lib/copilotPrompt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface CopilotRequestBody {
  messages: ChatMessage[];
  userContext?: CopilotUserContext;
}

export async function POST(request: NextRequest) {
  try {
    const body: CopilotRequestBody = await request.json();
    const { messages, userContext } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const systemPrompt = getSystemPromptWithContext(userContext);
    const apiKey = process.env.GEMINI_API_KEY || '';

    if (!apiKey) {
      // No API key — use offline fallback
      const lastUserMessage = messages.filter(m => m.role === 'user').pop();
      const fallbackResponse = getOfflineFallbackResponse(lastUserMessage?.content || '');
      return NextResponse.json({
        message: { role: 'assistant', content: fallbackResponse },
        source: 'offline-fallback',
      });
    }

    // Convert chat messages to Gemini format
    const geminiContents = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    const model = 'gemini-3.6-flash';
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/' +
      model + ':streamGenerateContent?alt=sse&key=' + apiKey;

    const geminiBody = {
      system_instruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: geminiContents,
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 1024,
        topP: 0.9,
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiBody),
    });

    if (!response.ok) {
      // Try non-streaming as fallback
      const nonStreamUrl = 'https://generativelanguage.googleapis.com/v1beta/models/' +
        model + ':generateContent?key=' + apiKey;

      const retryResponse = await fetch(nonStreamUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiBody),
      });

      if (!retryResponse.ok) {
        const lastUserMessage = messages.filter(m => m.role === 'user').pop();
        const fallbackResponse = getOfflineFallbackResponse(lastUserMessage?.content || '');
        return NextResponse.json({
          message: { role: 'assistant', content: fallbackResponse },
          source: 'offline-fallback',
        });
      }

      const data = await retryResponse.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
      return NextResponse.json({
        message: { role: 'assistant', content },
        source: 'gemini',
      });
    }

    // Stream the SSE response back to client
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        let buffer = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || !trimmed.startsWith('data: ')) continue;

              const data = trimmed.slice(6);
              if (data === '[DONE]') {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                continue;
              }

              try {
                const parsed = JSON.parse(data);
                const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                  controller.enqueue(
                    encoder.encode('data: ' + JSON.stringify({ content: text }) + '\n\n')
                  );
                }
              } catch {
                // Skip malformed chunks
              }
            }
          }

          // Send done signal
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        } catch {
          // Stream error
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
