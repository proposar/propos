"use client";

import Link from "next/link";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote";
import { type BlogPost } from "@/lib/blog";
import { AuthAwareLink } from "@/components/auth/AuthAwareLink";

// MDX custom components
const components = {
  h1: ({ children }: any) => (
    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 mt-8">
      {children}
    </h1>
  ),
  h2: ({ children }: any) => (
    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 mt-8">
      {children}
    </h2>
  ),
  h3: ({ children }: any) => (
    <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 mt-6">
      {children}
    </h3>
  ),
  p: ({ children }: any) => (
    <p className="text-gray-300 mb-4 leading-relaxed">{children}</p>
  ),
  a: ({ href, children }: any) => (
    <a href={href} className="text-gold hover:text-gold/80 transition">
      {children}
    </a>
  ),
  ul: ({ children }: any) => (
    <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
      {children}
    </ul>
  ),
  ol: ({ children }: any) => (
    <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2">
      {children}
    </ol>
  ),
  li: ({ children }: any) => <li>{children}</li>,
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-4 border-gold pl-4 italic text-gray-400 my-4">
      {children}
    </blockquote>
  ),
  code: ({ children }: any) => (
    <code className="bg-[#1e1e2e] px-2 py-1 rounded text-gold text-sm">
      {children}
    </code>
  ),
  pre: ({ children }: any) => (
    <pre className="bg-[#1e1e2e] p-4 rounded-lg overflow-x-auto mb-4 border border-[#2a2a3e]">
      {children}
    </pre>
  ),
  hr: () => <hr className="border-[#2a2a3e] my-8" />,
  table: ({ children }: any) => (
    <table className="w-full border-collapse my-4 border border-[#2a2a3e]">
      {children}
    </table>
  ),
  th: ({ children }: any) => (
    <th className="border border-[#2a2a3e] bg-[#1e1e2e] px-4 py-2 text-left text-white font-semibold">
      {children}
    </th>
  ),
  td: ({ children }: any) => (
    <td className="border border-[#2a2a3e] px-4 py-2 text-gray-300">
      {children}
    </td>
  ),
  img: (props: any) => (
    <span className="block my-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img {...props} alt={props.alt ?? ""} className="rounded-lg max-w-full" />
    </span>
  ),
  Image,
};

interface BlogPostContentProps {
  post: BlogPost;
  mdxSource: any;
  relatedPosts: BlogPost[];
}

export default function BlogPostContent({
  post,
  mdxSource,
  relatedPosts,
}: BlogPostContentProps) {
  return (
    <article className="max-w-4xl mx-auto px-4 py-32">
      {/* Post Header */}
      <header className="mb-12">
        <Link href="/blog" className="text-gold hover:text-gold/80 mb-6 inline-block">
          ← Back to all posts
        </Link>

        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          {post.title}
        </h1>

        <p className="text-xl text-gray-400 mb-8">{post.description}</p>

        {/* Meta info */}
        <div className="flex flex-wrap gap-6 items-center text-sm text-gray-500 border-b border-[#2a2a3e] pb-8">
          <span>{post.author}</span>
          <span>
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span>{post.readTime}</span>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${tag}`}
                className="px-3 py-1 text-sm bg-gold/10 text-gold rounded hover:bg-gold/20 transition"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <div className="prose prose-invert max-w-none mb-16 text-gray-300">
        <MDXRemote {...mdxSource} components={components} />
      </div>

      {/* CTA Section */}
      <div className="bg-[#1e1e2e] border border-gold/30 rounded-lg p-8 md:p-12 text-center mb-16">
        <h3 className="text-2xl font-bold text-white mb-4">
          Ready to win more proposals?
        </h3>
        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
          Try Proposar free for 14 days. No credit card required.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <AuthAwareLink
            unauthenticatedHref="/signup"
            className="px-8 py-3 bg-gradient-to-r from-gold to-gold/80 text-[#0f0f1e] font-semibold rounded-lg hover:shadow-[0_0_32px_rgba(217,119,6,0.3)] transition"
          >
            Start Free Trial
          </AuthAwareLink>
          <Link
            href="/blog"
            className="px-8 py-3 border border-gold/30 text-gold rounded-lg hover:bg-gold/5 transition"
          >
            More Articles
          </Link>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-[#2a2a3e] pt-16">
          <h2 className="text-2xl font-bold text-white mb-8">Related Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.slug}
                href={`/blog/${relatedPost.slug}`}
                className="group"
              >
                <div className="bg-[#1e1e2e] rounded-lg p-6 border border-[#2a2a3e] hover:border-gold/30 transition hover:shadow-[0_0_32px_rgba(217,119,6,0.15)]">
                  <h3 className="text-lg font-semibold text-white group-hover:text-gold transition mb-2">
                    {relatedPost.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {relatedPost.description}
                  </p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{relatedPost.author}</span>
                    <span>{relatedPost.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
