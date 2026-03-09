"use client";

interface ProposalEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function ProposalEditor({ content, onChange }: ProposalEditorProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-h-[400px] bg-transparent text-foreground resize-none focus:outline-none"
        placeholder="Proposal content..."
      />
    </div>
  );
}
