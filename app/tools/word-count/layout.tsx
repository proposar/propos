import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Proposal Word Count Checker | Proposar',
  description: 'Paste your proposal → see word count, reading time, key sections missing, and readability grade. Free, no signup. Optimize proposals that win.',
  alternates: {
    canonical: 'https://proposar.com/tools/word-count',
  },
};

export default function WordCountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
