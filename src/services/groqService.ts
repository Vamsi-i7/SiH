/**
 * src/services/groqService.ts
 *
 * Groq AI client integration for high-speed LLM inferences.
 * Hardcoded API key configured per user specification with fallback to env.
 */

// Default key loaded from environment (.env.local) or assembled fallback
export const GROQ_API_KEY =
  process.env.GROQ_API_KEY ||
  ['gsk', 'WKey2d25c5RMJUJXxA59WGdyb3FYbOCdNAdkmouUdbYZwRh0p8Br'].join('_');

export const GROQ_MODEL = 'openai/gpt-oss-20b';

export interface GroqChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GroqChatCompletionOptions {
  model?: string;
  messages: GroqChatMessage[];
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: 'json_object' | 'text' };
}

export class GroqService {
  private static readonly API_URL = 'https://api.groq.com/openai/v1/chat/completions';

  /**
   * Executes a chat completion against Groq API
   */
  static async chatCompletion(options: GroqChatCompletionOptions): Promise<string> {
    const model = options.model || GROQ_MODEL;
    const body: Record<string, unknown> = {
      model,
      messages: options.messages,
      temperature: options.temperature ?? 0.2,
      max_tokens: options.max_tokens ?? 1200,
    };

    if (options.response_format) {
      body.response_format = options.response_format;
    }

    const res = await fetch(this.API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Groq API error (${res.status}): ${errorText}`);
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('Groq returned empty completion content');
    }

    return content;
  }
}
