import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { useLocalizedPath } from "@/hooks/useLanguageRouting";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "@/hooks/useT";
import { ChevronLeft, ChevronRight } from "lucide-react";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import hero4 from "@/assets/hero-4.jpg";
import hero5 from "@/assets/hero-5.jpg";
import hero6 from "@/assets/hero-6.png";
import hero7 from "@/assets/hero-7.jpg";
import hero8 from "@/assets/hero-8.jpg";

const slides = [
  { src: hero1, caption: "close up" },
  { src: hero2, caption: "" },
  { src: hero3, caption: "" },
  { src: hero4, caption: "move back will ya" },
  { src: hero5, caption: "" },
  { src: hero6, caption: "" },
  { src: hero7, caption: "" },
  { src: hero8, caption: "So happy to be home" },
];

// Per-slide object-position overrides (default is "center center")
const slidePositions: Record<number, string> = {
  0: "center 20%", // was "center 30%" — pull up to show more body
  2: "center center",
  3: "center 15%", // add this — show more of the frame
  7: "center center",
  5: "center 40%",
};

// Per-slide initial scale (default 1.08); higher = starts more zoomed, zooms out more

const HeroSection = () => {
  const t = useT();
  const lp = useLocalizedPath();
  const [current, setCurrent] = useState(0);
  const instantRef = useRef(false);

  const next = useCallback((isManual = false) => {
    instantRef.current = isManual;
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    instantRef.current = true;
    setCurrent((p) => (p - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => next(false), 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden">
      <div className="block w-full h-full relative">
        <AnimatePresence mode="sync">
          <motion.div
            key={current}
            className="absolute inset-0"
            exit={{ opacity: 0 }}
            transition={{ duration: instantRef.current ? 0 : 1.2 }}
          >
            <motion.img
              src={slides[current].src}
              alt="Howard - Soft Skills Consultant"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: slidePositions[current] ?? "center center" }}
              initial={{ opacity: 0, scale: instantRef.current ? 1 : 1.25 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: instantRef.current ? 0 : 1.2 }}
              width={1920}
              height={1080}
            />
            {slides[current].caption && slides[current].caption.trim() !== "" && (
              <motion.div
                className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1.5 rounded-md text-sm backdrop-blur-sm z-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {slides[current].caption}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent pointer-events-none">
          {"\n"}
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={(e) => {
          e.preventDefault();
          prev();
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-background/30 hover:bg-background/50 backdrop-blur-sm rounded-full p-3 transition-all shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/50"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-8 h-8 text-primary-foreground drop-shadow-md" />
        <span className="sr-only">Previous slide</span>
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          next(true);
        }}
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          {/* CTA button lives in SubHeroNav below the hero */}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
