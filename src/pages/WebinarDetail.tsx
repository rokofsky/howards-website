import { useParams, Link } from "react-router-dom";
import { useLocalizedPath, useIsCzech } from "@/hooks/useLanguageRouting";
import { openCalendly } from "@/lib/calendly";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import ContactForm from "@/components/ContactForm";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useT } from "@/hooks/useT";

interface DbWebinar {
  id: string;
  slug: string;
  title: string;
  description: string;
}

const WebinarDetail = () => {
  const lp = useLocalizedPath();
  const isCz = useIsCzech();
  const t = useT();
  const { slug } = useParams();
  const [webinar, setWebinar] = useState<DbWebinar | null>(null);
  const [loading, setLoading] = useState(true);

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
          <h1 className="text-3xl font-bold">Webinar not found</h1>
          <Link to={lp("/services/online-webinars")} className="text-gold hover:text-gold/80 underline mt-4 inline-block">
            ← Back to Online Webinars
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
              ← Back to Online Webinars
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{webinar.title}</h1>

            <div className="rounded-lg p-8 mb-12 glass">
              <h2 className="text-xl md:text-2xl font-semibold mb-4">About This Webinar</h2>
              <p className="text-foreground/80 leading-relaxed font-normal">
                {webinar.description || "Details coming soon."}
              </p>
            </div>
          </motion.div>

          <div>
            <h2 className="text-2xl font-bold text-center mb-2">Inquire about {webinar.title}</h2>
            <p className="text-muted-foreground text-center mb-8 font-normal">
              Fill in some stuff below (mostly optional) and I'll get back to you next day.
            </p>
            <ContactForm serviceName={webinar.title} showServiceFields />
            <div className="text-center mt-8">
              <Button variant="glassPetrol" size="lg" onClick={() => openCalendly(isCz ? "cs" : "en")}>
                {t("Book a Call", "Rezervovat hovor")}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default WebinarDetail;
