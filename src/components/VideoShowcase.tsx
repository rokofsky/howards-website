import { motion } from "framer-motion";
import { useT } from "@/hooks/useT";

const VideoShowcase = () => {
  const t = useT();
  return (
    <section className="section-padding">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
          {t("See Howard in Action", "Podívejte se na Howarda v akci")}
        </h2>
        <p className="text-center mb-10 text-primary font-medium">
          {t(
            "A video we made a long time ago. More coming soon.",
            "Video, které jsme natočili před dlouhou dobou. Brzy přibudou další."
          )}
        </p>

        <div className="relative aspect-video rounded-lg overflow-hidden glass">
          <iframe
            src="https://www.youtube.com/embed/mfDvsbTwnY8?start=4"
            title="See Howard in Action"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default VideoShowcase;
