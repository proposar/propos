'use server';

import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  readTime: string;
  image?: string;
  tags: string[];
  content: string;
}

const blogDir = path.join(process.cwd(), "blog", "posts");

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const filePath = path.join(blogDir, `${slug}.mdx`);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    return {
      slug,
      title: data.title || "",
      description: data.description || "",
      author: data.author || "",
      date: data.date || "",
      readTime: data.readTime || "",
      image: data.image || "",
      tags: data.tags || [],
      content,
    };
  } catch (error) {
    return null;
  }
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const files = fs.readdirSync(blogDir);
    const posts: BlogPost[] = [];

    for (const file of files) {
      if (file.endsWith(".mdx")) {
        const slug = file.replace(".mdx", "");
        const post = await getBlogPost(slug);
        if (post) {
          posts.push(post);
        }
      }
    }

    // Sort by date descending
    return posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    return [];
  }
}

export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  return posts.filter((post) =>
    post.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
  );
}

export async function searchBlogPosts(query: string): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  const lowerQuery = query.toLowerCase();

  return posts.filter(
    (post) =>
      post.title.toLowerCase().includes(lowerQuery) ||
      post.description.toLowerCase().includes(lowerQuery) ||
      post.content.toLowerCase().includes(lowerQuery) ||
      post.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}
