'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Sparkles, Zap, RotateCcw, WifiOff } from 'lucide-react';
import { CopilotMessage } from './CopilotMessage';
import type { CopilotUserContext } from '@/lib/copilotPrompt';

// ============================================================================
// TYPES
// ============================================================================

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface CopilotPanelProps {
  isOpen: boolean;
  onClose: () => void;
  userContext?: CopilotUserContext;
}

// ============================================================================
// QUICK ACTION CHIPS
// ============================================================================

const QUICK_ACTIONS = [
  { label: '📊 My Readiness', prompt: 'What is my readiness index and how can I improve it?' },
  { label: '🎯 Skill Gaps', prompt: 'Show me my top competency gaps and what to do about them' },
  { label: '📝 Take Assessment', prompt: 'How do I start an assessment?' },
  { label: '🛤️ Recommend Courses', prompt: 'Recommend iGOT courses for my skill gaps' },
  { label: '🏛️ FRAC Levels', prompt: 'Explain the FRAC competency levels L1 to L5' },
  { label: '🧭 Platform Guide', prompt: 'Give me a quick overview of all platform features' },
];

// ============================================================================
// COMPONENT
// ============================================================================

export function CopilotPanel({ isOpen, onClose, userContext }: CopilotPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Keyboard: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Online/offline detection
  useEffect(() => {
    const goOnline = () => setIsOffline(false);
    const goOffline = () => setIsOffline(true);
    setIsOffline(!navigator.onLine);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  // Welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = userContext?.name
        ? `🙏 Namaste, **${userContext.name}**! I'm your StatVidya Copilot.\n\nAs a **${userContext.designation || userContext.role || 'learner'}** in ${userContext.cadre || 'the Official Statistical System'}, I can help you navigate the platform, understand your competency gaps, and find relevant iGOT courses.\n\nWhat would you like to explore?`
        : `🙏 **Namaste!** I'm your StatVidya Copilot.\n\nI can help you with FRAC competency tracking, iGOT learning pathways, and platform navigation.\n\nWhat would you like to explore?`;

      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: greeting,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length, userContext]);

  // ─── Send Message ───
  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    const assistantId = `assistant-${Date.now()}`;
    const assistantMsg: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation history (last 6 messages for ultra-fast prompt processing)
      const history = [...messages, userMsg]
        .filter((m) => m.id !== 'welcome')
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          userContext,
        }),
      });

      if (!response.ok) throw new Error('API error');

      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('text/event-stream')) {
        // ─── High-Performance Stream Renderer ───
        const reader = response.body?.getReader();
        if (!reader) throw new Error('No reader');

        const decoder = new TextDecoder();
        let buffer = '';
        let accumulated = '';
        let renderPending = false;

        const scheduleRender = () => {
          if (renderPending) return;
          renderPending = true;
          requestAnimationFrame(() => {
            renderPending = false;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, content: accumulated, isStreaming: true }
                  : m
              )
            );
          });
        };

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
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                accumulated += parsed.content;
                scheduleRender();
              }
            } catch {
              // Skip malformed chunks
            }
          }
        }

        // Finalize
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: accumulated, isStreaming: false } : m
          )
        );
      } else {
        // ─── JSON (fallback) Response ───
        const data = await response.json();
        const content = data.message?.content || data.content || 'I couldn\'t process that. Try rephrasing your question.';

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content, isStreaming: false }
              : m
          )
        );
      }
    } catch {
      // Error fallback
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content: '⚠️ I\'m having trouble connecting right now. You can still navigate using the sidebar, or try again in a moment.',
                isStreaming: false,
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickAction = (prompt: string) => {
    sendMessage(prompt);
  };

  const clearChat = () => {
    setMessages([]);
  };

  if (!isOpen) return null;

  const showQuickActions = messages.length <= 1;

  return (
    <>
      {/* Backdrop (mobile) */}
      <div
        className="fixed inset-0 z-[998] bg-black/20 backdrop-blur-[2px] sm:hidden"
        onClick={onClose}
        aria-hidden
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-label="StatVidya Copilot"
        className="fixed bottom-20 right-4 z-[999] flex flex-col overflow-hidden rounded-2xl border border-[#e3dbcf] bg-white shadow-2xl sm:right-6 sm:bottom-24"
        style={{
          width: 'min(400px, calc(100vw - 2rem))',
          height: 'min(560px, calc(100vh - 10rem))',
          animation: 'copilot-panel-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* ─── Header ─── */}
        <div className="flex items-center justify-between border-b border-[#e3dbcf] bg-gradient-to-r from-[#8b9a6e] to-[#728056] px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">
                StatVidya Copilot
              </h2>
              <p className="text-[10px] text-white/70 font-medium">
                {isOffline ? '⚡ Offline Mode' : '● AI-Powered Assistant'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 1 && (
              <button
                onClick={clearChat}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-white/70 hover:bg-white/15 hover:text-white transition-colors"
                title="Clear chat"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white/70 hover:bg-white/15 hover:text-white transition-colors"
              title="Close (Esc)"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ─── Offline Banner ─── */}
        {isOffline && (
          <div className="flex items-center gap-2 bg-[--color-severity-moderate]/10 border-b border-[--color-severity-moderate]/20 px-3 py-1.5 text-[11px] text-[--color-severity-moderate]">
            <WifiOff className="h-3 w-3 shrink-0" />
            <span>Offline — using built-in navigation assistance</span>
          </div>
        )}

        {/* ─── Messages ─── */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3" id="copilot-messages">
          {messages.map((msg) => (
            <CopilotMessage
              key={msg.id}
              role={msg.role}
              content={msg.content}
              isStreaming={msg.isStreaming}
              timestamp={msg.timestamp}
            />
          ))}

          {/* Typing indicator */}
          {isLoading && messages[messages.length - 1]?.content === '' && (
            <div className="flex items-center gap-2 px-1">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#8b9a6e]">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-[#8b9a6e] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 rounded-full bg-[#8b9a6e] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 rounded-full bg-[#8b9a6e] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ─── Quick Actions ─── */}
        {showQuickActions && (
          <div className="border-t border-[#eeeeee] px-3 py-2">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-1">
              <Zap className="h-3 w-3" /> Quick Actions
            </p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action.prompt)}
                  disabled={isLoading}
                  className="rounded-full border border-[#e3dbcf] bg-[#f7f2eb] px-2.5 py-1 text-[11px] font-medium text-[#1a1a1a] transition-all hover:border-[#8b9a6e] hover:bg-[#d6ddc9] hover:shadow-sm active:scale-95 disabled:opacity-50"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ─── Input ─── */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 border-t border-[#e3dbcf] bg-[#f7f2eb] px-3 py-2.5"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about FRAC, pathways, navigation..."
            disabled={isLoading}
            className="flex-1 rounded-xl border border-[#e3dbcf] bg-white px-3 py-2 text-[13px] text-[#1a1a1a] placeholder:text-stone-400 focus:border-[#8b9a6e] focus:outline-none focus:ring-2 focus:ring-[#8b9a6e]/20 disabled:opacity-50"
            style={{ minHeight: '36px' }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#8b9a6e] text-white shadow-sm transition-all hover:bg-[#728056] hover:shadow-md active:scale-95 disabled:opacity-40 disabled:hover:bg-[#8b9a6e] disabled:hover:shadow-sm"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </>
  );
}
