'use client';

import { memo } from 'react';
import { Bot, User, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface CopilotMessageProps {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  timestamp?: Date;
}

/**
 * Render inline text elements: bold, italic, code, route links, and priority badges.
 */
function renderInlineContent(text: string) {
  // Clean up orphan trailing asterisks like "gap)*" -> "gap)"
  const cleaned = text.replace(/(\w|\))[\*]+(?=$|\s)/g, '$1');

  // Split on bold, code/route pills, or priority badges
  const segments = cleaned.split(
    /(\*\*[^*]+\*\*|`[^`]+`|\((?:Critical|Important|Desirable)(?:\s+gap)?\))/gi
  );

  return segments.map((seg, idx) => {
    if (!seg) return null;

    // Bold
    if (seg.startsWith('**') && seg.endsWith('**')) {
      return (
        <strong key={idx} className="font-semibold text-[#2d1f17]">
          {seg.slice(2, -2)}
        </strong>
      );
    }

    // Code / Route pills
    if (seg.startsWith('`') && seg.endsWith('`')) {
      const codeVal = seg.slice(1, -1);

      // Interactive platform route link
      if (codeVal.startsWith('/')) {
        return (
          <Link
            key={idx}
            href={codeVal}
            className="inline-flex items-center gap-0.5 rounded-md bg-[--color-primary]/15 border border-[--color-primary]/30 px-1.5 py-0.5 text-[11px] font-mono font-semibold text-[#555934] hover:bg-[#555934] hover:text-white transition-all shadow-2xs mx-0.5"
          >
            {codeVal}
            <ArrowUpRight className="h-3 w-3 opacity-70" />
          </Link>
        );
      }

      return (
        <code
          key={idx}
          className="rounded bg-[#E8DACB]/60 px-1.5 py-0.5 text-xs font-mono text-[#2d1f17]"
        >
          {codeVal}
        </code>
      );
    }

    // Priority badges (Critical gap / Important gap)
    if (/^\((?:Critical|Important|Desirable)(?:\s+gap)?\)$/i.test(seg)) {
      const isCritical = /critical/i.test(seg);
      const isImportant = /important/i.test(seg);
      const label = isCritical ? 'Critical' : isImportant ? 'Important' : 'Desirable';

      return (
        <span
          key={idx}
          className={`ml-1.5 inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
            isCritical
              ? 'bg-[#8C5B3E]/15 text-[#8C5B3E]'
              : isImportant
              ? 'bg-[#BF9B7A]/25 text-[#593E2E]'
              : 'bg-[#F2E6D8] text-[#2d1f17]'
          }`}
        >
          {label}
        </span>
      );
    }

    // Plain text segment (also render simple italic if present)
    const italicSegments = seg.split(/(\*[^*]+\*)/g);
    if (italicSegments.length > 1) {
      return italicSegments.map((iSeg, iIdx) => {
        if (iSeg.startsWith('*') && iSeg.endsWith('*') && iSeg.length > 2) {
          return <em key={`${idx}-${iIdx}`} className="italic">{iSeg.slice(1, -1)}</em>;
        }
        return <span key={`${idx}-${iIdx}`}>{iSeg}</span>;
      });
    }

    return <span key={idx}>{seg}</span>;
  });
}

/**
 * Render structured message blocks (headings, lists, HR, paragraphs)
 */
function renderStructuredMessage(content: string) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="my-1.5 space-y-1.5 pl-0.5">
          {currentList}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, lineIdx) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      return;
    }

    // Horizontal Rule (--- or ***)
    if (/^(---|\*\*\*|___)$/.test(trimmed)) {
      flushList();
      elements.push(<hr key={`hr-${lineIdx}`} className="my-2 border-0 h-px bg-[#BF9B7A]/30" />);
      return;
    }

    // Headings (### Header, ## Header, # Header)
    if (/^#{1,4}\s+/.test(trimmed)) {
      flushList();
      const headerText = trimmed.replace(/^#{1,4}\s+/, '');
      elements.push(
        <h4
          key={`h-${lineIdx}`}
          className="mt-3 mb-1 text-[11px] font-bold uppercase tracking-wider text-[#555934] flex items-center gap-1.5"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#555934]" />
          {headerText}
        </h4>
      );
      return;
    }

    // Bullet list items (- Item, * Item, • Item)
    if (/^[-*•]\s+/.test(trimmed)) {
      const itemText = trimmed.replace(/^[-*•]\s+/, '');
      currentList.push(
        <li key={`li-${lineIdx}`} className="flex items-start gap-2 text-[13px] leading-relaxed">
          <span className="h-1.5 w-1.5 rounded-full bg-[#555934] shrink-0 mt-2" />
          <div className="flex-1">{renderInlineContent(itemText)}</div>
        </li>
      );
      return;
    }

    // Numbered list items (1. Item, 2. Item)
    if (/^\d+\.\s+/.test(trimmed)) {
      const match = trimmed.match(/^(\d+)\.\s+(.*)/);
      if (match) {
        const num = match[1];
        const itemText = match[2];
        currentList.push(
          <li key={`nli-${lineIdx}`} className="flex items-start gap-2 text-[13px] leading-relaxed">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#555934]/15 text-[10px] font-bold text-[#555934] shrink-0 mt-0.5">
              {num}
            </span>
            <div className="flex-1">{renderInlineContent(itemText)}</div>
          </li>
        );
        return;
      }
    }

    // Regular Paragraph
    flushList();
    elements.push(
      <p key={`p-${lineIdx}`} className="my-1 text-[13px] leading-relaxed text-[#2d1f17]">
        {renderInlineContent(trimmed)}
      </p>
    );
  });

  flushList();
  return elements;
}

function CopilotMessageInner({ role, content, timestamp }: CopilotMessageProps) {
  const isBot = role === 'assistant';

  return (
    <div
      className={`flex gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
      style={{ animation: 'copilot-msg-in 0.25s ease-out' }}
    >
      {/* Bot Avatar */}
      {isBot && (
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#555934] shadow-xs">
          <Bot className="h-3.5 w-3.5 text-white" />
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={`group relative max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
          isBot
            ? 'rounded-tl-md bg-white text-[#2d1f17] shadow-xs'
            : 'rounded-tr-md bg-[#555934] text-white'
        }`}
      >
        {isBot ? (
          <div className="space-y-0.5">
            {!content.trim() ? (
              <div className="flex items-center gap-1.5 py-1 px-0.5">
                <span className="h-2 w-2 rounded-full bg-[#555934] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 rounded-full bg-[#555934] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 rounded-full bg-[#555934] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            ) : (
              renderStructuredMessage(content)
            )}
          </div>
        ) : (
          <div className="whitespace-pre-wrap break-words">{content}</div>
        )}

        {/* Hover Timestamp */}
        {timestamp && (
          <div className="absolute -bottom-4 left-1 hidden text-[10px] text-stone-400 group-hover:block">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>

      {/* User Avatar */}
      {!isBot && (
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E8DACB] shadow-xs">
          <User className="h-3.5 w-3.5 text-[#555934]" />
        </div>
      )}
    </div>
  );
}

export const CopilotMessage = memo(CopilotMessageInner);
