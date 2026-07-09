import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useT } from "@/hooks/useT";
import { useLocalizedPath, useIsCzech } from "@/hooks/useLanguageRouting";
import { supabase } from "@/integrations/supabase/client";

interface PreviewRow {
  slug: string;
  title_en: string;
  title_cs: string;
  excerpt_en: string;
  excerpt_cs: string;
  date_en: string;
  date_cs: string;
}

const BlogPreview = () => {
  const t = useT();
  const lp = useLocalizedPath();
  const isCz = useIsCzech();
  const lang: "en" | "cs" = isCz ? "cs" : "en";
  const [displayPosts, setDisplayPosts] = useState<PreviewRow[]>([]);

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("slug,title_en,title_cs,excerpt_en,excerpt_cs,date_en,date_cs")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => setDisplayPosts((data as PreviewRow[]) ?? []));
  }, []);

  return (
    <section id="blog" className="section-padding bg-sidebar">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-3">{t("Does Howard blog?", "Píše Howard blog?")}</h2>
        <p className="font-medium text-primary">{t("Thoughts on communication and the occasional rant", "Úvahy o komunikaci a občasný výlev")}</p>
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
              to={lp(`/blog/${post.slug}`)}
              className="block glass rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer group h-full"
            >
              <time className="text-xs text-muted-foreground font-light">{lang === "cs" ? (post.date_cs || post.date_en) : post.date_en}</time>
              <h3 className="text-lg font-semibold mt-2 mb-3 group-hover:text-gold transition-colors">{lang === "cs" ? (post.title_cs || post.title_en) : post.title_en}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-normal">{lang === "cs" ? (post.excerpt_cs || post.excerpt_en) : post.excerpt_en}</p>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default BlogPreview;
