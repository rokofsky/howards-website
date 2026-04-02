import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const testimonials = [
  { name: "Sarah K., VP People, TechCorp", text: "Howard completely transformed how our leadership team communicates. The storytelling framework he taught us is now embedded in our culture." },
  { name: "Marcus T., CEO, BrightPath", text: "I was skeptical about 'soft skills training' until Howard made our entire C-suite laugh, cry, and rethink everything in four hours." },
  { name: "Dr. Lena W., University of Munich", text: "Howard's approach to conflict resolution is unlike anything I've seen in 20 years of organizational psychology. Practical, humane, and surprisingly funny." },
];

const References = () => {
  return (
    <Layout>
      <section className="section-padding pt-24">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">References</h1>
            <p className="text-muted-foreground font-light mb-12 max-w-lg">
              Don't take Howard's word for it. Here's what people say when he's not in the room.
            </p>
          </motion.div>

          {/* Testimonials */}
          <div className="space-y-6 mb-16">
            {testimonials.map((t, i) => (
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

          {/* Evaluation Scans Placeholder */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Evaluation Sheets</h2>
            <p className="text-muted-foreground font-light mb-8">
              Scanned evaluation sheets from past workshops. Click to view full size.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="aspect-[3/4] glass rounded-lg flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <span className="text-sm text-muted-foreground font-light">Scan #{i}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default References;
