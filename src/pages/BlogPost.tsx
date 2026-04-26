import { useParams, Link } from "react-router-dom";
import { useLocalizedPath, useIsCzech } from "@/hooks/useLanguageRouting";
import { useT } from "@/hooks/useT";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { getPostBySlug, subscribe } from "@/data/blogStore";
import { pickL } from "@/data/blogPosts";
import { motion } from "framer-motion";

const BlogPost = () => {
  const lp = useLocalizedPath();
  const t = useT();
  const isCz = useIsCzech();
  const lang: "en" | "cs" = isCz ? "cs" : "en";
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
          <h1 className="text-3xl font-bold">{t("Post not found", "Příspěvek nenalezen")}</h1>
          <Link to={lp("/")} className="text-accent hover:underline mt-4 inline-block">{t("Back to home", "Zpět na úvod")}</Link>
        </div>
      </Layout>
    );
  }

  const title = pickL(post.title, lang);
  const date = pickL(post.date, lang);
  const category = pickL(post.category, lang);
  const content = pickL(post.content, lang);

  return (
    <Layout>
      <section className="section-padding pt-24">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link to={lp("/blog")} className="text-sm text-accent hover:text-foreground transition-colors mb-6 inline-block font-medium">
              ← {t("Back to all articles", "Zpět na všechny články")}
            </Link>
            <time className="text-sm text-muted-foreground font-light block mb-2">{date}</time>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">{title}</h1>
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt={title}
                className="w-full aspect-[16/9] object-cover rounded-lg mb-6"
              />
            )}
            {category && (
              <span className="inline-block bg-accent text-accent-foreground text-xs font-semibold px-2.5 py-1 rounded-full mb-6">
                {category}
              </span>
            )}
            <div className="glass rounded-lg p-5 sm:p-8">
              <div
                key={post.slug + lang}
                className="text-base sm:text-lg text-foreground/80 leading-[1.75] whitespace-pre-line font-light"
              >
                {content.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
                  }
                  return <span key={i}>{part}</span>;
                })}
              </div>
            </div>
            <div className="mt-10">
              <Link to={lp("/blog")} className="text-sm text-accent hover:text-foreground transition-colors font-medium">
                ← {t("Back to all articles", "Zpět na všechny články")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default BlogPost;
