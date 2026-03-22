import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Proposar',
    default: 'Free Freelance Tools | Proposar',
  },
  description: 'Free tools for freelancers: proposal word count checker, win rate calculator, and more. Improve your proposals and close more deals.',
  alternates: {
    canonical: 'https://proposar.com/tools',
  },
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
