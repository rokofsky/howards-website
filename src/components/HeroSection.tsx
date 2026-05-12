import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useLocalizedPath } from "@/hooks/useLanguageRouting";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "@/hooks/useT";
import { ChevronLeft, ChevronRight } from "lucide-react";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import hero4 from "@/assets/hero-4.png";
import hero5 from "@/assets/hero-5.jpg";
import hero6 from "@/assets/hero-6.jpg";
import hero7 from "@/assets/hero-7.jpg";
import hero8 from "@/assets/hero-8.jpg";
import hero9b from "@/assets/hero-9b.png";

const slides = [hero9b, hero5, hero2, hero6, hero3, hero4, hero7, hero8];

// Per-slide object-position overrides (default is "center center")
const slidePositions: Record<number, string> = {
  0: "center 30%",
  2: "center center",
  7: "center center",
};

// Per-slide initial scale (default 1.08); higher = starts more zoomed, zooms out more

const HeroSection = () => {
  const t = useT();
  const lp = useLocalizedPath();
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden">
      <Link to={lp("/bio")} className="block w-full h-full relative">
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={slides[current]}
            alt="Howard - Soft Skills Consultant"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: slidePositions[current] ?? "center center" }}
            initial={{ opacity: 0, scale: 1.25 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            width={1920}
            height={1080}
          />
        </AnimatePresence>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent">{"\n"}</div>
      </Link>

      {/* Navigation arrows */}
      <button
        onClick={(e) => { e.preventDefault(); prev(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-background/30 hover:bg-background/50 backdrop-blur-sm rounded-full p-3 transition-all shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/50"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-8 h-8 text-primary-foreground drop-shadow-md" />
        <span className="sr-only">Previous slide</span>
      </button>
      <button
        onClick={(e) => { e.preventDefault(); next(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-background/30 hover:bg-background/50 backdrop-blur-sm rounded-full p-3 transition-all shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/50"
        aria-label="Next slide"
      >
        <ChevronRight className="w-8 h-8 text-primary-foreground drop-shadow-md" />
        <span className="sr-only">Next slide</span>
      </button>

      {/* CTA */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none px-16 sm:px-20">
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-4 text-center tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Howard
        </motion.h1>
        <motion.p
          className="text-base sm:text-lg md:text-xl text-primary-foreground/80 font-light mb-8 text-center max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {t("Soft skills trainer & storytelling maestro", "Trenér měkkých dovedností a mistr vyprávění příběhů")}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {/* CTA button lives in SubHeroNav below the hero */}
        </motion.div>
      </div>

    </section>
  );
};

export default HeroSection;
