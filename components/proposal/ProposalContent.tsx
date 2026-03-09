"use client";

/**
 * Premium proposal content renderer.
 * Parses markdown-style content: # ## ### headings, - lists, *bold* _italic_
 */

type Block =
  | { type: "h1"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "p"; text: string };

function parseBlocks(content: string): Block[] {
  if (!content?.trim()) return [];
  const blocks: Block[] = [];
  const lines = content.split(/\r?\n/);
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("# ")) {
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
      while (i < lines.length && lines[i].trim() && !lines[i].startsWith("#") && !lines[i].match(/^[-*]\s+/) && !lines[i].match(/^\d+\.\s+/)) {
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

interface ProposalContentProps {
  content: string;
  /** Use for client/preview light mode */
  variant?: "default" | "preview" | "compact";
  className?: string;
}

export function ProposalContent({
  content,
  variant = "default",
  className = "",
}: ProposalContentProps) {
  const blocks = parseBlocks(content);

  const baseClasses =
    variant === "preview"
      ? "text-gray-800"
      : variant === "compact"
        ? "text-gray-700"
        : "text-[#c4c4cc]";

  return (
    <div className={`proposal-content space-y-5 ${baseClasses} ${className}`}>
      {blocks.map((block, idx) => {
        if (block.type === "h1") {
          return (
            <h1
              key={idx}
              className={
                variant === "preview"
                  ? "font-serif text-2xl md:text-3xl font-bold text-gray-900 tracking-tight"
                  : "text-xl font-bold text-[#faf8f4]"
              }
            >
              {block.text}
            </h1>
          );
        }
        if (block.type === "h2") {
          return (
            <h2
              key={idx}
              className={
                variant === "preview"
                  ? "font-serif text-xl font-semibold text-gray-900 mt-8 mb-2 pt-2 border-t border-gray-100 first:border-0 first:mt-0 first:pt-0"
                  : "text-base font-semibold text-[#faf8f4] mt-6 mb-2"
              }
            >
              {block.text}
            </h2>
          );
        }
        if (block.type === "h3") {
          return (
            <h3
              key={idx}
              className={
                variant === "preview"
                  ? "font-serif text-lg font-semibold text-gray-800 mt-4 mb-1"
                  : "text-sm font-semibold text-[#e0e0e8] mt-4 mb-1"
              }
            >
              {block.text}
            </h3>
          );
        }
        if (block.type === "ul") {
          return (
            <ul
              key={idx}
              className={
                variant === "preview"
                  ? "list-disc pl-5 space-y-1.5 text-gray-700 text-[15px] leading-relaxed"
                  : "list-disc pl-5 space-y-1 text-sm text-[#c4c4cc]"
              }
            >
              {block.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          );
        }
        if (block.type === "ol") {
          return (
            <ol
              key={idx}
              className={
                variant === "preview"
                  ? "list-decimal pl-5 space-y-1.5 text-gray-700 text-[15px] leading-relaxed"
                  : "list-decimal pl-5 space-y-1 text-sm text-[#c4c4cc]"
              }
            >
              {block.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ol>
          );
        }
        return (
          <p
            key={idx}
            className={
              variant === "preview"
                ? "text-[15px] leading-relaxed text-gray-700 whitespace-pre-wrap"
                : "text-sm leading-relaxed whitespace-pre-wrap"
            }
          >
            {block.text}
          </p>
        );
      })}
    </div>
  );
}
