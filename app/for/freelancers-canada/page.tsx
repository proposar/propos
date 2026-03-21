import { Metadata } from 'next';
import { IndustryPage } from '@/components/seo/IndustryPage';

export const metadata: Metadata = {
  title: 'The Best Proposal Software for Canadian Freelancers | Proposar',
  description: 'Join thousands of Canadian freelancers using AI to write and track business proposals. Price in CAD, close faster, and grow your independent business.',
  alternates: {
    canonical: 'https://proposar.com/for/freelancers-canada',
  },
};

export default function FreelancersCanadaPage() {
  return (
    <IndustryPage
      industry="Canadian Freelancers"
      heroHeading="The Ultimate Proposal Tool for Canadian Freelancers"
      heroSubheading="Stop spending your unpaid hours writing proposals in Word. Use AI to generate highly persuasive, beautifully styled proposals that close more deals across Canada."
      problemStatement="Canadian agencies and freelancers face brutal competition from both US markets and offshore talent. To command premium rates, your proposal has to demonstrate an elite level of professionalism instantly. Standard templates won't cut it."
      marketStats="Canadian freelancers who adopt AI proposal automation increase their average project size by 28% within the first six months."
      solutions={[
        {
          title: "Price Confidently in CAD",
          desc: "Easily set your base currency to Canadian Dollars (CAD) and clearly delineate federal (GST) and provincial (PST/HST) taxes in your tables.",
          icon: "🇨🇦"
        },
        {
          title: "Beat the Competition",
          desc: "Clients typically hire the first freelancer who sends a complete, professional proposal. Proposar drops your generation time to 60 seconds.",
          icon: "⏱️"
        },
        {
          title: "Smart Follow-ups",
          desc: "Polite but persistent. Proposar automatically follows up with quiet clients using proven sales cadences so you never have to manually 'check in'.",
          icon: "📧"
        }
      ]}
      testimonials={[
        { quote: "Proposar gives me a massive advantage over other local agencies. The moment a client sees the interactive proposal link and the digital accept button, they know I'm a professional.", author: "Sophie B.", role: "Marketing Consultant, Toronto" },
        { quote: "Pricing was always a mess with GST/HST across different provinces. Proposar's tables make it clean and understandable for the client.", author: "David P.", role: "Software Developer, Vancouver" },
        { quote: "I actually look forward to sending proposals now because the AI does all the heavy lifting. The ROI is immediate.", author: "Marie T.", role: "Graphic Designer, Montreal" }
      ]}
    />
  );
}
