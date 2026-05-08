import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useT } from "@/hooks/useT";

const MAX_PORTRAIT = 300;
const MAX_LANDSCAPE = 50;
const PAGE_SIZE = 20;
const INITIAL = 20;

type Item = { src: string; orientation: "portrait" | "landscape"; key: string };

const pad = (n: number) => String(n).padStart(3, "0");

// Cache-buster: bump when files are replaced on disk so browsers re-fetch
// the rotated/updated versions instead of serving stale cached images.
const ASSET_VERSION = "v2";

/**
 * Build a deterministic, interleaved list of candidate filenames.
 * Landscape images are sprinkled in every ~5th slot so the dense grid
 * tiles them naturally between portraits.
 */
const buildCandidates = (): Item[] => {
  const items: Item[] = [];
  let p = 1;
  let l = 1;
  let i = 0;
  while (p <= MAX_PORTRAIT || l <= MAX_LANDSCAPE) {
    // Insert a landscape every 5th slot when available
    if (i > 0 && i % 5 === 0 && l <= MAX_LANDSCAPE) {
      items.push({
        src: `/evaluations/eval-land-${pad(l)}.jpg`,
        orientation: "landscape",
        key: `l-${l}`,
      });
      l++;
    } else if (p <= MAX_PORTRAIT) {
      items.push({
        src: `/evaluations/eval-${pad(p)}.jpg`,
        orientation: "portrait",
        key: `p-${p}`,
      });
      p++;
    } else if (l <= MAX_LANDSCAPE) {
      items.push({
        src: `/evaluations/eval-land-${pad(l)}.jpg`,
        orientation: "landscape",
        key: `l-${l}`,
      });
      l++;
    }
    i++;
  }
  return items;
};

const EvaluationsGallery = () => {
  const t = useT();
  const candidates = useMemo(buildCandidates, []);
  const [visibleCount, setVisibleCount] = useState(INITIAL);
  const [broken, setBroken] = useState<Record<string, true>>({});
  const [lightbox, setLightbox] = useState<Item | null>(null);

  const visible = candidates.slice(0, visibleCount);
  const allShown = visibleCount >= candidates.length;

  return (
    <div className="mb-12">
      <div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8"
        style={{ gridAutoFlow: "dense" }}
      >
        <AnimatePresence>
          {visible.map((item) => {
            if (broken[item.key]) return null;
            const isLandscape = item.orientation === "landscape";
            return (
              <motion.button
                key={item.key}
                type="button"
                onClick={() => setLightbox(item)}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`block rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:brightness-90 hover:shadow-xl bg-muted/30 ${
                  isLandscape ? "col-span-2 aspect-[4/3]" : "aspect-[3/4]"
                }`}
              >
                <img
                  src={item.src}
                  alt={t("Evaluation form scan", "Sken hodnotícího formuláře")}
                  loading="lazy"
                  onError={() =>
                    setBroken((prev) => ({ ...prev, [item.key]: true }))
                  }
                  className="w-full h-full object-cover"
                />
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {!allShown && (
        <div className="text-center">
          <Button
            variant="glass"
            size="lg"
            onClick={() =>
              setVisibleCount((c) => Math.min(c + PAGE_SIZE, candidates.length))
            }
          >
            {t(
              "More Evaluation-forms from participants",
              "Více hodnotících formulářů od účastníků"
            )}
          </Button>
        </div>
      )}

      <Dialog open={!!lightbox} onOpenChange={(o) => !o && setLightbox(null)}>
        <DialogContent className="max-w-[95vw] md:max-w-5xl p-2 bg-background/95 border-none">
          {lightbox && (
            <img
              src={lightbox.src}
              alt={t("Evaluation form scan", "Sken hodnotícího formuláře")}
              className="w-full h-auto max-h-[88vh] object-contain rounded"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EvaluationsGallery;
