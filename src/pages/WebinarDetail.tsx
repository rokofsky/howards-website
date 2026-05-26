import { useParams, Link } from "react-router-dom";
import { useLocalizedPath } from "@/hooks/useLanguageRouting";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { WebinarOrderForm } from "@/components/WebinarOrderForm";
import { WebinarInquiryModal } from "@/components/WebinarInquiryModal";
import { useT } from "@/hooks/useT";

interface DbWebinar {
  id: string;
  slug: string;
  title: string;
  description: string;
}

const WebinarDetail = () => {
  const lp = useLocalizedPath();
  const t = useT();
  const { slug } = useParams();
  const [webinar, setWebinar] = useState<DbWebinar | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInquiry, setShowInquiry] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);

  useEffect(() => {
    supabase.from("webinars").select("*").eq("slug", slug).maybeSingle().then(({ data }) => {
      if (data) setWebinar(data as DbWebinar);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return <Layout><div className="section-padding pt-24 text-center text-muted-foreground">Loading...</div></Layout>;
  }

  if (!webinar) {
    return (
      <Layout>
        <div className="section-padding pt-24 text-center">
          <h1 className="text-3xl font-bold">{t("Webinar not found", "Webinář nenalezen")}</h1>
          <Link to={lp("/services/online-webinars")} className="text-gold hover:text-gold/80 underline mt-4 inline-block">
            ← {t("Back to Online Webinars", "Zpět na online webináře")}
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="section-padding pt-24">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link to={lp("/services/online-webinars")} className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 inline-block">
              ← {t("Back to Online Webinars", "Zpět na online webináře")}
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{webinar.title}</h1>

            <div className="rounded-lg p-8 mb-12 glass">
              <h2 className="text-xl md:text-2xl font-semibold mb-4">{t("About This Webinar", "O tomto webináři")}</h2>
              <p className="text-foreground/80 leading-relaxed font-normal">
                {webinar.description || t("Details coming soon.", "Podrobnosti brzy.")}
              </p>
            </div>
          </motion.div>

          <div className="text-center">
            <Button variant="glassPetrol" size="lg" onClick={() => setShowInquiry(true)}>
              {t("Inquire", "Poptat")}
            </Button>
          </div>
        </div>
      </section>

      <WebinarInquiryModal
        open={showInquiry}
        onOpenChange={setShowInquiry}
        webinarTitle={webinar.title}
        onOrderNow={() => {
          setShowInquiry(false);
          setShowOrderForm(true);
        }}
      />

      <WebinarOrderForm
        open={showOrderForm}
        onOpenChange={setShowOrderForm}
        initialWebinarSlug={webinar.slug}
      />
    </Layout>
  );
};

export default WebinarDetail;
