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
    title: "Why Your Team Meetings Feel Like Hostage Situations",
    excerpt: "The three invisible dynamics killing your team's energy — and the surprisingly simple fix.",
    date: "Mar 28, 2026",
    content: "Content coming soon. Check back later for the full article.",
  },
  {
    slug: "the-art-of-saying-nothing-productively",
    title: "The Art of Saying Nothing (Productively)",
    excerpt: "How strategic silence became my most powerful consulting tool.",
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
