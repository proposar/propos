import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getBlogPost, getAllBlogPosts, type BlogPost } from "@/lib/blog";
import { Navbar } from "@/components/landing/Navbar";
import { AuthAwareLink } from "@/components/auth/AuthAwareLink";

const mdxComponents = {
  h1: ({ children }: React.PropsWithChildren) => <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 mt-8">{children}</h1>,
  h2: ({ children }: React.PropsWithChildren) => <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 mt-8">{children}</h2>,
  h3: ({ children }: React.PropsWithChildren) => <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 mt-6">{children}</h3>,
  p: ({ children }: React.PropsWithChildren) => <p className="text-gray-300 mb-4 leading-relaxed">{children}</p>,
  a: ({ href, children }: React.PropsWithChildren<{ href?: string }>) => <Link href={href ?? "#"} className="text-gold hover:text-gold/80">{children}</Link>,
  // eslint-disable-next-line @next/next/no-img-element
  img: ({ src, alt }: { src?: string; alt?: string }) => <img src={src ?? ""} alt={alt ?? ""} className="rounded-lg max-w-full h-auto my-4 border border-[#2a2a3e]" referrerPolicy="no-referrer" />,
  ul: ({ children }: React.PropsWithChildren) => <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">{children}</ul>,
  ol: ({ children }: React.PropsWithChildren) => <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2">{children}</ol>,
  li: ({ children }: React.PropsWithChildren) => <li>{children}</li>,
  blockquote: ({ children }: React.PropsWithChildren) => <blockquote className="border-l-4 border-gold pl-4 italic text-gray-400 my-4">{children}</blockquote>,
  code: ({ children }: React.PropsWithChildren) => <code className="bg-[#1e1e2e] px-2 py-1 rounded text-gold text-sm">{children}</code>,
  pre: ({ children }: React.PropsWithChildren) => <pre className="bg-[#1e1e2e] p-4 rounded-lg overflow-x-auto mb-4 border border-[#2a2a3e]">{children}</pre>,
  hr: () => <hr className="border-[#2a2a3e] my-8" />,
};

interface BlogPostPageProps {
  params: { slug: string };
}

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = await getBlogPost(params.slug);
  if (!post) return { title: "Post not found", description: "This blog post could not be found." };
  const baseUrl = "https://proposar.com";
  const url = `${baseUrl}/blog/${params.slug}`;
  return {
    title: `${post.title} | Proposar Blog`,
    description: post.description,
    alternates: { canonical: url },
    openGraph: { title: post.title, description: post.description, url, images: post.image ? [post.image] : [] },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0f0f1e]">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-32 text-center">
          <p className="text-gray-400 mb-6">Post not found.</p>
          <Link href="/blog" className="text-gold hover:text-gold/80">← Back to all posts</Link>
        </div>
      </div>
    );
  }

  const allPosts = await getAllBlogPosts();
  const relatedPosts = allPosts
    .filter((p) => p.slug !== params.slug && p.tags.some((tag) => post.tags.includes(tag)))
    .slice(0, 3);

  const baseUrl = "https://proposar.com";
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    author: { "@type": "Organization", name: post.author || "Proposar Team" },
    datePublished: post.date,
    url: `${baseUrl}/blog/${params.slug}`,
  };

  return (
    <div className="min-h-screen bg-[#0f0f1e]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Navbar />
      <article className="max-w-4xl mx-auto px-4 py-32">
        <Link href="/blog" className="text-gold hover:text-gold/80 mb-6 inline-block">← Back to all posts</Link>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">{post.title}</h1>
        <p className="text-xl text-gray-400 mb-8">{post.description}</p>
        <div className="flex flex-wrap gap-6 items-center text-sm text-gray-500 border-b border-[#2a2a3e] pb-8">
          <span>{post.author}</span>
          <span>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
          <span>{post.readTime}</span>
        </div>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8">
            {post.tags.map((tag) => (
              <Link key={tag} href={`/blog?tag=${tag}`} className="px-3 py-1 text-sm bg-gold/10 text-gold rounded hover:bg-gold/20">
                #{tag}
              </Link>
            ))}
          </div>
        )}
        <div className="prose prose-invert max-w-none mb-16 mt-8">
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>
        <div className="bg-[#1e1e2e] border border-gold/30 rounded-lg p-8 md:p-12 text-center mb-16">
          <h3 className="text-2xl font-bold text-white mb-4">Create proposals like this — Try Proposar Free</h3>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">Generate winning proposals in 60 seconds with AI. No credit card required.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AuthAwareLink
              unauthenticatedHref="/signup"
              className="px-8 py-3 bg-gradient-to-r from-gold to-gold/80 text-[#0f0f1e] font-semibold rounded-lg"
            >
              Try Proposar Free →
            </AuthAwareLink>
            <Link href="/blog" className="px-8 py-3 border border-gold/30 text-gold rounded-lg hover:bg-gold/5">More Articles</Link>
          </div>
        </div>
        {relatedPosts.length > 0 && (
          <section className="border-t border-[#2a2a3e] pt-16">
            <h2 className="text-2xl font-bold text-white mb-8">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((rp) => (
                <Link key={rp.slug} href={`/blog/${rp.slug}`} className="group">
                  <div className="bg-[#1e1e2e] rounded-lg p-6 border border-[#2a2a3e] hover:border-gold/30">
                    <h3 className="text-lg font-semibold text-white group-hover:text-gold mb-2">{rp.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{rp.description}</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{rp.author}</span>
                      <span>{rp.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
