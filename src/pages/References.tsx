import { useState } from "react";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const testimonials = [
  { name: "Sarah K., VP People, TechCorp", text: "Howard completely transformed how our leadership team communicates. The storytelling framework he taught us is now embedded in our culture." },
  { name: "Marcus T., CEO, BrightPath", text: "I was skeptical about 'soft skills training' until Howard made our entire C-suite laugh, cry, and rethink everything in four hours." },
  { name: "Dr. Lena W., University of Munich", text: "Howard's approach to conflict resolution is unlike anything I've seen in 20 years of organizational psychology. Practical, humane, and surprisingly funny." },
  { name: "Anja R., Head of HR, Siemens Energy", text: "We've brought Howard back three times now. Each session builds on the last, and the team keeps asking for more." },
  { name: "Thomas B., Managing Director, Kiefel GmbH", text: "Howard's negotiation workshop saved us more in one quarter than we spent on the entire training program. No exaggeration." },
  { name: "Lisa M., L&D Manager, Allianz", text: "The brainstorming session Howard facilitated produced more actionable ideas in three hours than our team had generated in six months." },
];

const References = () => {
  const [showAllTestimonials, setShowAllTestimonials] = useState(false);
  const visibleTestimonials = showAllTestimonials ? testimonials : testimonials.slice(0, 3);

  return (
    <Layout>
      <section className="section-padding pt-24">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">References</h1>
            <p className="text-muted-foreground font-light mb-12 max-w-2xl whitespace-nowrap">
              Don't take Howard's word for it. Here's what people say when he's not looking.
            </p>
          </motion.div>

          {/* Testimonials */}
          <div className="space-y-6 mb-8">
            {visibleTestimonials.map((t, i) => (
              <motion.blockquote
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-lg p-8"
              >
                <p className="text-foreground/80 font-light leading-relaxed italic mb-4">"{t.text}"</p>
                <cite className="text-sm text-muted-foreground font-medium not-italic">— {t.name}</cite>
              </motion.blockquote>
            ))}
          </div>

          {!showAllTestimonials && (
            <div className="text-center mb-12">
              <Button variant="glass" size="lg" onClick={() => setShowAllTestimonials(true)}>
                More testimonials from clients and participants
              </Button>
            </div>
          )}

          {/* Evaluation Forms Link - always visible */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Evaluation forms from participants</h2>
            </div>
            <p className="text-muted-foreground font-light mb-8">
              Scanned evaluation sheets from past workshops. Click to view full size.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {[1, 2, 3, 4, 5, 6].map((i) => {
                // To fill: place PDF in public/scans/scan-{i}.pdf and set pdfUrl below
                const pdfUrl: string | undefined = undefined;
                const inner = (
                  <div className="aspect-[3/4] glass rounded-lg flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-shadow p-3">
                    <span className="text-sm text-muted-foreground font-light">Scan #{i}</span>
                    {!pdfUrl && (
                      <span className="text-[10px] text-muted-foreground/60 mt-1 uppercase tracking-wider">
                        Placeholder
                      </span>
                    )}
                  </div>
                );
                return pdfUrl ? (
                  <a key={i} href={pdfUrl} target="_blank" rel="noopener noreferrer">{inner}</a>
                ) : (
                  <div key={i}>{inner}</div>
                );
              })}
            </div>
            <div className="text-center">
              <Button variant="glass" size="lg" asChild>
                <a href="/references/scans">More Evaluation-forms from participants</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default References;
