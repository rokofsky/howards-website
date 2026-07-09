import { blogPosts as staticPosts, type BlogPost } from "./blogPosts";

// In-memory session store for newly created (not-yet-permanent) posts.
// Lives only for the current page session — refresh clears it.
let sessionPosts: BlogPost[] = [];
const listeners = new Set<() => void>();

export const getAllPosts = (): BlogPost[] => [...sessionPosts, ...staticPosts];

export const addSessionPost = (post: BlogPost) => {
  // Avoid duplicate slugs in the session list
  sessionPosts = [post, ...sessionPosts.filter((p) => p.slug !== post.slug)];
  listeners.forEach((l) => l());
};

export const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};

export const getPostBySlug = (slug: string): BlogPost | undefined =>
  getAllPosts().find((p) => p.slug === slug);
