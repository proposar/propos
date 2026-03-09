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
                src="/proposar-new-logo.svg"
                alt="Proposar Professional Services"
                width={32}
                height={40}
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
              <li><Link href="/templates" className="hover:text-gold hover:translate-x-1 transition-all inline-block">Templates</Link></li>
              <li><Link href="/changelog" className="hover:text-gold hover:translate-x-1 transition-all inline-block">Changelog</Link></li>
              <li><Link href="/roadmap" className="hover:text-gold hover:translate-x-1 transition-all inline-block">Roadmap</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-[#faf8f4] mb-4">Resources</p>
            <ul className="space-y-3 text-sm text-[#888890]">
              <li><Link href="/blog" className="hover:text-gold hover:translate-x-1 transition-all inline-block">Blog</Link></li>
              <li><Link href="/help" className="hover:text-gold hover:translate-x-1 transition-all inline-block">Help Center</Link></li>
              <li><Link href="/video-tutorials" className="hover:text-gold hover:translate-x-1 transition-all inline-block">Video Tutorials</Link></li>
              <li><Link href="/api-docs" className="hover:text-gold hover:translate-x-1 transition-all inline-block">API Docs</Link></li>
              <li><Link href="/affiliate" className="hover:text-gold hover:translate-x-1 transition-all inline-block">Affiliate Program</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-[#faf8f4] mb-4">Company</p>
            <ul className="space-y-3 text-sm text-[#888890]">
              <li><Link href="/about" className="hover:text-gold hover:translate-x-1 transition-all inline-block">About</Link></li>
              <li><Link href="/careers" className="hover:text-gold hover:translate-x-1 transition-all inline-block">Careers <span className="text-xs bg-gold/20 text-gold px-2 py-1 rounded ml-1">We&apos;re hiring</span></Link></li>
              <li><Link href="/privacy" className="hover:text-gold hover:translate-x-1 transition-all inline-block">Privacy Policy</Link></li>
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
