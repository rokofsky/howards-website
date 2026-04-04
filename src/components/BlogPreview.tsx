import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { blogPosts } from "@/data/blogPosts";

const BlogPreview = () => {
  const displayPosts = blogPosts.slice(0, 6);

  return (
    <section id="blog" className="section-padding bg-secondary/50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Blog</h2>
        <p className="text-muted-foreground font-light">Thoughts on leadership, communication, and the occasional rant.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {displayPosts.map((post, i) => (
          <motion.article
            key={post.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              to={`/blog/${post.slug}`}
              className="block glass rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer group h-full"
            >
              <time className="text-xs text-muted-foreground font-light">{post.date}</time>
              <h3 className="text-lg font-semibold mt-2 mb-3 group-hover:text-gold transition-colors">{post.title}</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">{post.excerpt}</p>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default BlogPreview;
