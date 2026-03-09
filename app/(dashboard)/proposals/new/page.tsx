import { ProposalForm } from "@/components/proposal/ProposalForm";

export default function NewProposalPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="font-serif text-2xl font-bold text-[#faf8f4] mb-6">
        New Proposal
      </h1>
      <ProposalForm />
    </div>
  );
}
