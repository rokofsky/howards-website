export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "why-your-team-meetings-feel-like-hostage-situations",
    title: "Are Czechs getting even more polite?",
    excerpt: "Politeness is a hallmark of Czech culture, though friendliness not so much. Is empathy growing? ",
    date: "Mar 28, 2026",
    content: "Content coming soon. Check back later for the full article.",
  },
  {
    slug: "the-art-of-saying-nothing-productively",
    title: "Former jobs you won’t find on my CV",
    excerpt: "10 jobs that led me to where I am today",
    date: "Mar 15, 2026",
    content: "Content coming soon. Check back later for the full article.",
  },
  {
    slug: "storytelling-is-not-optional-anymore",
    title: "Storytelling Is Not Optional Anymore",
    excerpt: "In a world of AI-generated everything, your story is the last unfakeable asset.",
    date: "Feb 28, 2026",
    content: "Content coming soon. Check back later for the full article.",
  },
];
