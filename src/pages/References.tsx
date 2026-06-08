import { useState } from "react";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ClientLogosStrip from "@/components/ClientLogosStrip";
import EvaluationsGallery, { ASSET_VERSION } from "@/components/EvaluationsGallery";
import { useT } from "@/hooks/useT";

  return (
    <Layout>
      <ClientLogosStrip />
      <section className="section-padding pt-8">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t("References", "Reference")}
            </h1>
            <p className="text-muted-foreground font-light mb-12 max-w-2xl">
              {t(
                "Don't take Howard's word for it. Here's what people say when he's not looking.",
                "Nemusíte věřit jen Howardovi. Zde je, co o něm říkají lidé, když se nedívá."
              )}
            </p>
          </motion.div>

          {/* I removed the Testimonials */}
        
          {/* Evaluation Forms Link - always visible */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {t("Evaluation forms from participants", "Hodnotící formuláře od účastníků")}
              </h2>
            </div>
            <p className="text-muted-foreground font-light mb-8">
              {t(
                "Complete, unabridged evaluation sheet scans from past workshops. Click to view full size, and zoom in for detail!",
                "Kompletní, nezkrácené skeny hodnotících formulářů z minulých workshopů. Kliknutím zobrazíte v plné velikosti a můžete si přiblížit detaily!"
              )}
            </p>
            <EvaluationsGallery />
          </div>
        </div>
        <p className="text-center text-[10px] text-muted-foreground/40 font-light mt-8">
          v{ASSET_VERSION}
        </p>
      </section>
    </Layout>
  );
};

export default References;
