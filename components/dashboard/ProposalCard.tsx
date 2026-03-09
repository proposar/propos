import Link from "next/link";

interface ProposalCardProps {
  id: string;
  title: string;
  clientName: string;
  status: string;
  value?: string;
}

export function ProposalCard({ id, title, clientName, status, value }: ProposalCardProps) {
  return (
    <Link
      href={`/proposals/${id}`}
      className="block rounded-lg border border-border bg-surface p-4 hover:border-gold/50 transition-colors"
    >
      <h3 className="font-medium text-foreground">{title}</h3>
      <p className="text-sm text-muted">{clientName}</p>
      <div className="mt-2 flex items-center gap-2">
        <span className="rounded-full bg-background px-2 py-0.5 text-xs text-muted">
          {status}
        </span>
        {value && <span className="text-sm text-gold">{value}</span>}
      </div>
    </Link>
  );
}
