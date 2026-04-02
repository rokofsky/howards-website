import { motion } from "framer-motion";

const VideoShowcase = () => {
  return (
    <section className="section-padding">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">See Howard in Action</h2>
        <p className="text-muted-foreground font-light text-center mb-10">
          A two-minute preview of what happens when you stop managing and start storytelling.
        </p>

        <div className="relative aspect-video rounded-lg overflow-hidden glass">
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4 glass-button cursor-pointer">
                <svg className="w-6 h-6 text-gold ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground font-light">Video placeholder — coming soon</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default VideoShowcase;
