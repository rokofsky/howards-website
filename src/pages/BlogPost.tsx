import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import { blogPosts } from "@/data/blogPosts";
import { motion } from "framer-motion";

const BlogPost = () => {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return (
      <Layout>
        <div className="section-padding pt-24 text-center">
          <h1 className="text-3xl font-bold">Post not found</h1>
          <Link to="/" className="text-accent hover:underline mt-4 inline-block">Back to home</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="section-padding pt-24">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/#blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 inline-block">
              ← Back to Blog
            </Link>
            <time className="text-sm text-muted-foreground font-light block mb-2">{post.date}</time>
            <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>
            <div className="glass rounded-lg p-8">
              <p className="text-foreground/80 font-light leading-relaxed whitespace-pre-line">{post.content}</p>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default BlogPost;
