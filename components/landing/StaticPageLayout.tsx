import Link from "next/link";

interface StaticPageLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function StaticPageLayout({ title, description, children }: StaticPageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0a0a14] text-[#faf8f4]">
      <header className="border-b border-[#1e1e2e] py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-serif text-xl font-bold text-gold hover:text-[#e8c76a]">
            Proposar
          </Link>
          <Link href="/" className="text-sm text-[#888890] hover:text-gold">
            ← Home
          </Link>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#faf8f4] mb-2">{title}</h1>
        {description && <p className="text-[#888890] mb-8">{description}</p>}
        <div className="prose prose-invert prose-sm max-w-none text-[#c4c4cc]">
          {children}
        </div>
      </main>
    </div>
  );
}
