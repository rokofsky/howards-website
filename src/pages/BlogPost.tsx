import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { getPostBySlug, subscribe } from "@/data/blogStore";
import { motion } from "framer-motion";

const BlogPost = () => {
  const { slug } = useParams();
  const [, force] = useState(0);
  const post = getPostBySlug(slug ?? "");

  useEffect(() => {
    window.scrollTo(0, 0);
    return subscribe(() => force((n) => n + 1));
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
            <Link to="/blog" className="text-sm text-accent hover:text-foreground transition-colors mb-6 inline-block font-medium">
              ← Back to all articles
            </Link>
            <time className="text-sm text-muted-foreground font-light block mb-2">{post.date}</time>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">{post.title}</h1>
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full aspect-[16/9] object-cover rounded-lg mb-6"
              />
            )}
            {post.category && (
              <span className="inline-block bg-accent text-accent-foreground text-xs font-semibold px-2.5 py-1 rounded-full mb-6">
                {post.category}
              </span>
            )}
            <div className="glass rounded-lg p-5 sm:p-8">
              <div className="text-base sm:text-lg text-foreground/80 leading-[1.75] whitespace-pre-line font-medium">
                {post.content.split(/(\*\*.*?\*\*)/).map((part, i) => {
                  const key = `${i}-${part.length}`;
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={key} className="font-bold">{part.slice(2, -2)}</strong>;
                  }
                  return <span key={key}>{part}</span>;
                })}
              </div>
            </div>
            <div className="mt-10">
              <Link to="/blog" className="text-sm text-accent hover:text-foreground transition-colors font-medium">
                ← Back to all articles
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default BlogPost;
