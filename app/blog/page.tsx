import Link from "next/link";
import Image from "next/image";
import { getAllBlogPosts, type BlogPost } from "@/lib/blog";
import { Navbar } from "@/components/landing/Navbar";
import BlogList from "./blog-list";

export const metadata = {
  title: "Blog | Proposar",
  description:
    "Insights, data, and strategies for winning more projects and growing your freelance business.",
};

export default async function BlogPage() {
  const posts = await getAllBlogPosts();
  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags)));

  return (
    <div className="min-h-screen bg-[#0f0f1e]">
      <Navbar />

      {/* Hero */}
      <div className="pt-32 pb-20 px-4 text-center border-b border-[#1e1e2e]">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Proposar Blog
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Insights, data, and strategies for winning more projects and growing
          your freelance business.
        </p>
      </div>

      {/* Blog List with Client-side filtering */}
      <BlogList posts={posts} allTags={allTags} />
    </div>
  );
}
