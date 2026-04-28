import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { getAllPosts, subscribe } from "@/data/blogStore";
import { pickL } from "@/data/blogPosts";
import { motion } from "framer-motion";
import { useT } from "@/hooks/useT";
import { useLocalizedPath, useIsCzech } from "@/hooks/useLanguageRouting";
// SEO managed centrally by GlobalSeoSync in App.tsx

const Blog = () => {
  const t = useT();
  const lp = useLocalizedPath();
  const isCz = useIsCzech();
  const lang: "en" | "cs" = isCz ? "cs" : "en";
  const [posts, setPosts] = useState(getAllPosts());


  useEffect(() => subscribe(() => setPosts(getAllPosts())), []);
  return (
    <Layout>
      <section className="section-padding pt-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-14"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("Blog", "Blog")}</h1>
            <p className="text-lg text-muted-foreground font-medium max-w-xl mx-auto">
              {t(
                "Thoughts on communication, storytelling, and the occasional rant.",
                "Úvahy o komunikaci, vyprávění příběhů a občasný výlev."
              )}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={lp(`/blog/${post.slug}`)}
                  className="group block glass rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full"
                >
                  {/* Placeholder image area */}
                  <div className="relative aspect-[16/9] bg-primary/80">
                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl}
                        alt={pickL(post.title, lang)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-primary-foreground/30 text-sm font-light tracking-widest uppercase">
                          {t("Article", "Článek")}
                        </span>
                      </div>
                    )}
                    {/* Category tag */}
                    <span className="absolute top-3 right-3 bg-accent text-accent-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
                      {pickL(post.category, lang)}
                    </span>
                  </div>

                  <div className="p-6">
                    <time className="text-xs text-muted-foreground font-light">
                      {pickL(post.date, lang)}
                    </time>
                    <h2 className="text-lg font-bold mt-2 mb-2 group-hover:text-accent transition-colors">
                      {pickL(post.title, lang)}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed font-normal">
                      {pickL(post.excerpt, lang)}
                    </p>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
