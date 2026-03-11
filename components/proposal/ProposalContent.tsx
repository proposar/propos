"use client";

import React from "react";

/**
 * Premium proposal content renderer.
 * Parses markdown: # ## ### headings, - lists, **bold**, *italic*, inline formatting.
 */

type Block =
  | { type: "h1"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "p"; text: string }
  | { type: "hr" };

function parseBlocks(content: string): Block[] {
  if (!content?.trim()) return [];
  const blocks: Block[] = [];
  const lines = content.split(/\r?\n/);
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (line.match(/^---+$/)) {
      blocks.push({ type: "hr" });
      i++;
    } else if (line.startsWith("# ")) {
      blocks.push({ type: "h1", text: line.replace(/^#\s+/, "").trim() });
      i++;
    } else if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: line.replace(/^##\s+/, "").trim() });
      i++;
    } else if (line.startsWith("### ")) {
      blocks.push({ type: "h3", text: line.replace(/^###\s+/, "").trim() });
      i++;
    } else if (line.match(/^[-*]\s+/)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^[-*]\s+/)) {
        items.push(lines[i].replace(/^[-*]\s+/, "").trim());
        i++;
      }
      blocks.push({ type: "ul", items });
    } else if (line.match(/^\d+\.\s+/)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^\d+\.\s+/)) {
        items.push(lines[i].replace(/^\d+\.\s+/, "").trim());
        i++;
      }
      blocks.push({ type: "ol", items });
    } else if (line.trim()) {
      const para: string[] = [line.trim()];
      i++;
      while (
        i < lines.length &&
        lines[i].trim() &&
        !lines[i].startsWith("#") &&
        !lines[i].match(/^[-*]\s+/) &&
        !lines[i].match(/^\d+\.\s+/) &&
        !lines[i].match(/^---+$/)
      ) {
        para.push(lines[i].trim());
        i++;
      }
      blocks.push({ type: "p", text: para.join(" ") });
    } else {
      i++;
    }
  }
  return blocks;
}

/** Render inline bold (**text**) and italic (*text*) */
function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Match **bold** first, then *italic*
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      parts.push(<strong key={key++} className="font-semibold">{match[2]}</strong>);
    } else if (match[3]) {
      parts.push(<em key={key++}>{match[3]}</em>);
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts.length ? parts : [text];
}

interface ProposalContentProps {
  content: string;
  variant?: "default" | "preview" | "compact";
  brandColor?: string;
  className?: string;
}

export function ProposalContent({
  content,
  variant = "default",
  brandColor,
  className = "",
}: ProposalContentProps) {
  const blocks = parseBlocks(content);
  const isPreview = variant === "preview" || variant === "compact";
  const accent = brandColor || "#D4AF37";

  const baseClasses =
    variant === "preview"
      ? "text-gray-800"
      : variant === "compact"
        ? "text-gray-700"
        : "text-[#c4c4cc]";

  // Track h2 sections for numbering
  let sectionNum = 0;

  return (
    <div className={`proposal-content space-y-6 ${baseClasses} ${className}`}>
      {blocks.map((block, idx) => {
        if (block.type === "hr") {
          return (
            <div key={idx} className="flex items-center gap-4 py-2">
              <div className="flex-1 h-px" style={{ backgroundColor: isPreview ? accent + "30" : "#1e1e2e" }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isPreview ? accent : "#333" }} />
              <div className="flex-1 h-px" style={{ backgroundColor: isPreview ? accent + "30" : "#1e1e2e" }} />
            </div>
          );
        }
        if (block.type === "h1") {
          return (
            <h1
              key={idx}
              className={
                isPreview
                  ? "font-serif text-2xl md:text-3xl font-bold text-gray-900 tracking-tight leading-tight"
                  : "text-xl font-bold text-[#faf8f4]"
              }
            >
              {renderInline(block.text)}
            </h1>
          );
        }
        if (block.type === "h2") {
          sectionNum++;
          return (
            <div key={idx} className={isPreview ? "mt-10 mb-3 first:mt-0" : "mt-6 mb-2"}>
              {isPreview && (
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-bold shrink-0"
                    style={{ backgroundColor: accent }}
                  >
                    {sectionNum}
                  </span>
                  <div className="flex-1 h-px" style={{ backgroundColor: accent + "25" }} />
                </div>
              )}
              <h2
                className={
                  isPreview
                    ? "font-serif text-xl md:text-2xl font-bold text-gray-900 tracking-tight"
                    : "text-base font-semibold text-[#faf8f4]"
                }
              >
                {renderInline(block.text)}
              </h2>
            </div>
          );
        }
        if (block.type === "h3") {
          return (
            <h3
              key={idx}
              className={
                isPreview
                  ? "font-serif text-lg font-semibold text-gray-800 mt-5 mb-1"
                  : "text-sm font-semibold text-[#e0e0e8] mt-4 mb-1"
              }
            >
              {renderInline(block.text)}
            </h3>
          );
        }
        if (block.type === "ul") {
          return (
            <ul
              key={idx}
              className={
                isPreview
                  ? "space-y-2.5 text-gray-700 text-[15px] leading-relaxed pl-1"
                  : "list-disc pl-5 space-y-1 text-sm text-[#c4c4cc]"
              }
            >
              {block.items.map((item, j) =>
                isPreview ? (
                  <li key={j} className="flex items-start gap-3">
                    <span
                      className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: accent }}
                    />
                    <span>{renderInline(item)}</span>
                  </li>
                ) : (
                  <li key={j}>{renderInline(item)}</li>
                )
              )}
            </ul>
          );
        }
        if (block.type === "ol") {
          return (
            <ol
              key={idx}
              className={
                isPreview
                  ? "space-y-2.5 text-gray-700 text-[15px] leading-relaxed pl-1 counter-reset-list"
                  : "list-decimal pl-5 space-y-1 text-sm text-[#c4c4cc]"
              }
            >
              {block.items.map((item, j) =>
                isPreview ? (
                  <li key={j} className="flex items-start gap-3">
                    <span
                      className="mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 text-white"
                      style={{ backgroundColor: accent + "cc" }}
                    >
                      {j + 1}
                    </span>
                    <span className="pt-0.5">{renderInline(item)}</span>
                  </li>
                ) : (
                  <li key={j}>{renderInline(item)}</li>
                )
              )}
            </ol>
          );
        }
        return (
          <p
            key={idx}
            className={
              isPreview
                ? "text-[15px] leading-[1.8] text-gray-600 whitespace-pre-wrap"
                : "text-sm leading-relaxed whitespace-pre-wrap"
            }
          >
            {renderInline(block.text)}
          </p>
        );
      })}
    </div>
  );
}
