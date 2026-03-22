import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Proposal Win Rate Calculator | Proposar',
  description: 'Enter proposals sent and won → see win rate, revenue lost to bad proposals per year, and how much Proposar would save. Free calculator.',
  alternates: {
    canonical: 'https://proposar.com/tools/win-rate',
  },
};

export default function WinRateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
