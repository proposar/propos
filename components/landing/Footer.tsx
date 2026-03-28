import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-[#1e1e2e] bg-[#12121e] py-20 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image
                src="/landscape.svg"
                alt="Proposar Professional Services"
                width={100}
                height={32}
                unoptimized
              />
              <span className="font-serif text-xl font-bold text-[#faf8f4]">Proposar</span>
            </div>
            <p className="text-[#888890] text-sm mt-3 max-w-xs leading-relaxed">
              The proposal tool built for freelancers who want to win.
            </p>
            <div className="flex gap-5 mt-5">
              <a href="#" className="text-[#888890] hover:text-gold hover:scale-110 transition-all" aria-label="Twitter">𝕏</a>
              <a href="#" className="text-[#888890] hover:text-gold hover:scale-110 transition-all" aria-label="LinkedIn">in</a>
              <a href="#" className="text-[#888890] hover:text-gold hover:scale-110 transition-all" aria-label="Instagram">📷</a>
              <a href="#" className="text-[#888890] hover:text-gold hover:scale-110 transition-all" aria-label="YouTube">▶</a>
            </div>
          </div>
          <div>
            <p className="font-semibold text-[#faf8f4] mb-4">Product</p>
            <ul className="space-y-3 text-sm text-[#888890]">
              <li><Link href="/#how-it-works" className="hover:text-gold hover:translate-x-1 transition-all inline-block">Features</Link></li>
              <li><Link href="/#pricing" className="hover:text-gold hover:translate-x-1 transition-all inline-block">Pricing</Link></li>
              <li><Link href="/proposal-templates" className="hover:text-gold hover:translate-x-1 transition-all inline-block">Templates</Link></li>
              <li><Link href="/changelog" className="hover:text-gold hover:translate-x-1 transition-all inline-block">Changelog</Link></li>
              <li><Link href="/roadmap" className="hover:text-gold hover:translate-x-1 transition-all inline-block">Roadmap</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-[#faf8f4] mb-4">Resources</p>
            <ul className="space-y-3 text-sm text-[#888890]">
              <li><Link href="/blog" className="hover:text-gold hover:translate-x-1 transition-all inline-block">Blog</Link></li>
              <li><Link href="/ai-proposal-generator" className="hover:text-gold hover:translate-x-1 transition-all inline-block">AI Proposal Generator</Link></li>
              <li><Link href="/proposal-generator-for-freelancers" className="hover:text-gold hover:translate-x-1 transition-all inline-block">Proposal Generator</Link></li>
              <li><Link href="/free-proposal-template" className="hover:text-gold hover:translate-x-1 transition-all inline-block">Free Templates</Link></li>
              <li><Link href="/help" className="hover:text-gold hover:translate-x-1 transition-all inline-block">Help Center</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-[#faf8f4] mb-4">Solutions</p>
            <ul className="space-y-3 text-sm text-[#888890]">
              <li><Link href="/for/developers" className="hover:text-gold hover:translate-x-1 transition-all inline-block">For Developers</Link></li>
              <li><Link href="/for/web-designers" className="hover:text-gold hover:translate-x-1 transition-all inline-block">For Web Designers</Link></li>
              <li><Link href="/for/marketing-agencies" className="hover:text-gold hover:translate-x-1 transition-all inline-block">For Agencies</Link></li>
              <li><Link href="/for/consultants" className="hover:text-gold hover:translate-x-1 transition-all inline-block">For Consultants</Link></li>
              <li><Link href="/for/copywriters" className="hover:text-gold hover:translate-x-1 transition-all inline-block">For Copywriters</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-[#faf8f4] mb-4">Regions</p>
            <ul className="space-y-3 text-sm text-[#888890]">
              <li><Link href="/for/freelancers-usa" className="hover:text-gold hover:translate-x-1 transition-all inline-block">Freelancers in USA</Link></li>
              <li><Link href="/for/freelancers-uk" className="hover:text-gold hover:translate-x-1 transition-all inline-block">Freelancers in UK</Link></li>
              <li><Link href="/for/freelancers-australia" className="hover:text-gold hover:translate-x-1 transition-all inline-block">Australia & NZ</Link></li>
              <li><Link href="/for/freelancers-canada" className="hover:text-gold hover:translate-x-1 transition-all inline-block">Canada Hub</Link></li>
              <li><Link href="/about" className="hover:text-gold hover:translate-x-1 transition-all inline-block">Our Story</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-[#faf8f4] mb-4">Company</p>
            <ul className="space-y-3 text-sm text-[#888890]">
              <li><Link href="/privacy" className="hover:text-gold hover:translate-x-1 transition-all inline-block">Privacy Policy</Link></li>
              <li><Link href="/security" className="hover:text-gold hover:translate-x-1 transition-all inline-block">Security & Compliance</Link></li>
              <li><Link href="/terms" className="hover:text-gold hover:translate-x-1 transition-all inline-block">Terms of Service</Link></li>
              <li><Link href="/contact" className="hover:text-gold hover:translate-x-1 transition-all inline-block">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-12 border-t border-[#1e1e2e] flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-[#888890]">
            © 2026 Proposar. All rights reserved.
          </p>
          <p className="text-sm text-[#888890]">
            Made with ♥ for freelancers everywhere
          </p>
          <div className="flex items-center gap-4 text-[#888890] text-xs">
            <span className="hover:text-gold transition-colors cursor-pointer">Visa</span>
            <span className="hover:text-gold transition-colors cursor-pointer">Mastercard</span>
            <span className="hover:text-gold transition-colors cursor-pointer">PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
