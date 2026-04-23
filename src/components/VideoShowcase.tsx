import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const VideoShowcase = () => {
  const { t } = useTranslation();
  return (
    <section className="section-padding">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">{t("video.heading")}</h2>
        <p className="text-center mb-10 text-primary font-medium">
          {t("video.subheading")}
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
