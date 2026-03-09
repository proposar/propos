"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { type BlogPost } from "@/lib/blog";

interface BlogListProps {
  posts: BlogPost[];
  allTags: string[];
}

export default function BlogList({ posts, allTags }: BlogListProps) {
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(posts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("");

  useEffect(() => {
    let results = posts;

    // Filter by search query
    if (searchQuery) {
      results = results.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Filter by tag
    if (selectedTag) {
      results = results.filter((post) =>
        post.tags.map((t) => t.toLowerCase()).includes(selectedTag.toLowerCase())
      );
    }

    setFilteredPosts(results);
  }, [searchQuery, selectedTag, posts]);

  return (
    <>
      {/* Search & Filters */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-3 bg-[#1e1e2e] border border-[#2a2a3e] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 transition"
          />
        </div>

        {/* Tags */}
        {allTags.length > 0 && (
          <div className="mb-12">
            <p className="text-sm text-gray-400 mb-4">Filter by tag:</p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedTag("")}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedTag === ""
                    ? "bg-gold text-[#0f0f1e] font-semibold"
                    : "bg-[#1e1e2e] text-gray-300 hover:border-gold/30 border border-transparent"
                }`}
              >
                All Posts
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-lg transition border ${
                    selectedTag === tag
                      ? "bg-gold text-[#0f0f1e] font-semibold border-gold"
                      : "bg-[#1e1e2e] text-gray-300 border-[#2a2a3e] hover:border-gold/30"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12 pb-32">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No posts found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <article className="group cursor-pointer h-full">
                  {/* Card with image */}
                  <div className="bg-[#1e1e2e] rounded-lg overflow-hidden border border-[#2a2a3e] hover:border-gold/30 transition h-full flex flex-col hover:shadow-[0_0_32px_rgba(217,119,6,0.15)]">
                    {/* Image - use gradient placeholder when image path may not exist */}
                    <div className="relative w-full h-40 bg-gradient-to-br from-gold/20 via-gold/5 to-transparent overflow-hidden flex items-center justify-center">
                      {post.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : null}
                      {!post.image && (
                        <span className="text-4xl text-gold/40">📄</span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      {/* Tags */}
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-1 bg-gold/10 text-gold rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Title */}
                      <h3 className="text-lg md:text-xl font-semibold text-white mb-3 group-hover:text-gold transition line-clamp-2">
                        {post.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">
                        {post.description}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-4 border-t border-[#2a2a3e]">
                        <span>{post.author}</span>
                        <span>{post.readTime}</span>
                      </div>

                      {/* Date */}
                      <p className="text-xs text-gray-600 mt-2">
                        {new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
