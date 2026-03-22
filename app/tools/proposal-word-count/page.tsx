import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Free Proposal Word Count Checker | Proposar',
  description: 'Paste your proposal → AI tells you: word count, reading time, key sections missing, tone score, readability grade. Free, no signup.',
};

export default function ProposalWordCountPage() {
  redirect('/tools/word-count');
}
