import { motion } from "framer-motion";

const blogPosts = [
  {
    title: "Why Your Team Meetings Feel Like Hostage Situations",
    excerpt: "The three invisible dynamics killing your team's energy — and the surprisingly simple fix.",
    date: "Mar 28, 2026",
  },
  {
    title: "The Art of Saying Nothing (Productively)",
    excerpt: "How strategic silence became my most powerful consulting tool.",
    date: "Mar 15, 2026",
  },
  {
    title: "Storytelling Is Not Optional Anymore",
    excerpt: "In a world of AI-generated everything, your story is the last unfakeable asset.",
    date: "Feb 28, 2026",
  },
];

const BlogPreview = () => {
  return (
    <section className="section-padding bg-secondary/50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Latest Insights</h2>
        <p className="text-muted-foreground font-light">Thoughts on leadership, communication, and the occasional rant.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {blogPosts.map((post, i) => (
          <motion.article
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
          >
            <time className="text-xs text-muted-foreground font-light">{post.date}</time>
            <h3 className="text-lg font-semibold mt-2 mb-3 group-hover:text-gold transition-colors">{post.title}</h3>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">{post.excerpt}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default BlogPreview;
