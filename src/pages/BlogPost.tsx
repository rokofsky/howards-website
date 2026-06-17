import { useParams, Link } from "react-router-dom";
import { useLocalizedPath, useIsCzech } from "@/hooks/useLanguageRouting";
import { useT } from "@/hooks/useT";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { resolveImageUrl } from "@/data/blogImages";

interface BlogPostRow {
  id: string;
  slug: string;
  title_en: string;
  title_cs: string;
  excerpt_en: string;
  excerpt_cs: string;
  content_en: string;
  content_cs: string;
  category_en: string;
  category_cs: string;
  date_en: string;
  date_cs: string;
  image_url: string | null;
  published: boolean;
}

const BlogPost = () => {
  const lp = useLocalizedPath();
  const t = useT();
  const isCz = useIsCzech();
  const lang: "en" | "cs" = isCz ? "cs" : "en";
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPostRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!slug) return;
    setLoading(true);
    supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle()
      .then(({ data }) => {
        setPost((data as BlogPostRow | null) ?? null);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="section-padding pt-24 text-center text-muted-foreground">
          {t("Loading…", "Načítání…")}
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="section-padding pt-24 text-center">
          <h1 className="text-3xl font-bold">{t("Post not found", "Příspěvek nenalezen")}</h1>
          <Link to={lp("/")} className="text-accent hover:underline mt-4 inline-block">
            {t("Back to home", "Zpět na úvod")}
          </Link>
        </div>
      </Layout>
    );
  }

  const title = lang === "cs" ? post.title_cs : post.title_en;
  const date = lang === "cs" ? post.date_cs : post.date_en;
  const category = lang === "cs" ? post.category_cs : post.category_en;
  const content = lang === "cs" ? post.content_cs : post.content_en;
  const excerpt = lang === "cs" ? post.excerpt_cs : post.excerpt_en;
  const image = resolveImageUrl(post.image_url);

  const description = excerpt && excerpt.length > 160 ? excerpt.slice(0, 157) + "…" : excerpt || `${title} — Rokofsky Communication`;
  const canonical = `https://howards-website.lovable.app${isCz ? "/cz" : ""}/blog/${post.slug}`;
  const fullTitle = `${title} | Rokofsky`;

  return (
    <Layout>
      <Helmet>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        {image && <meta property="og:image" content={image} />}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: title,
            description,
            datePublished: post.date_en,
            author: { "@type": "Person", name: "Howard Rokofsky" },
            publisher: { "@type": "Organization", name: "Rokofsky Communication" },
            image: image ? [image] : undefined,
            mainEntityOfPage: canonical,
          })}
        </script>
      </Helmet>
      <section className="section-padding pt-24">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link to={lp("/blog")} className="text-sm text-accent hover:text-foreground transition-colors mb-6 inline-block font-medium">
              ← {t("Back to all articles", "Zpět na všechny články")}
            </Link>
            <time className="text-sm text-muted-foreground font-light block mb-2">{date}</time>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">{title}</h1>
            {image && (
              <img src={image} alt={title} className="w-full h-auto aspect-[16/9] object-cover rounded-lg mb-6" />
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
