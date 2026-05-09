import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useT } from "@/hooks/useT";

const MAX_PORTRAIT = 300;
const PAGE_SIZE = 20;
const INITIAL = 20;

type Item = { src: string; key: string };

const pad = (n: number) => String(n).padStart(3, "0");

// Cache-buster: bump to force browsers to drop stale cached images.
const ASSET_VERSION = "v3";

/**
 * Build candidate filenames strictly matching eval-[number].jpg.
 * Landscape (eval-land-*) files are explicitly excluded.
 */
const buildCandidates = (): Item[] => {
  const items: Item[] = [];
  for (let p = 1; p <= MAX_PORTRAIT; p++) {
    const filename = `eval-${pad(p)}.jpg`;
    // Explicit exclusion guard: never include any 'land' files.
    if (filename.includes("land")) continue;
    items.push({
      src: `/evaluations/${filename}`,
      key: `p-${p}`,
    });
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <AnimatePresence>
          {visible.map((item) => {
            if (broken[item.key]) return null;
            return (
              <motion.button
                key={item.key}
                type="button"
                onClick={() => setLightbox(item)}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="block rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:brightness-90 hover:shadow-xl bg-muted/30 aspect-[3/4]"
              >
                <img
                  src={`${item.src}?v=${ASSET_VERSION}`}
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
              src={`${lightbox.src}?v=${ASSET_VERSION}`}
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
