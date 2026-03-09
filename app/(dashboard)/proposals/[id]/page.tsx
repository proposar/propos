import { ProposalPreview } from "@/components/proposal/ProposalPreview";

export default async function ProposalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <ProposalPreview proposalId={id} />
    </div>
  );
}
