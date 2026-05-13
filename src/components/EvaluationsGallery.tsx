import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useT } from "@/hooks/useT";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";

type Item = { src: string; key: string; num: string };
type SortOrder = "asc" | "desc";

const trackEvent = (label: string, params: Record<string, unknown> = {}) => {
  if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
    (window as any).gtag("event", "click", { event_category: "engagement", event_label: label, ...params });
  }
};


// Hard-coded allowlist generated from the files currently present in /public/evaluations/.
export const ASSET_VERSION = "202605121549";

const VALID_EVAL_FILES = [
  "eval-001.jpg",
  "eval-002.jpg",
  "eval-003.jpg",
  "eval-004.jpg",
  "eval-005.jpg",
  "eval-006.jpg",
  "eval-007.jpg",
  "eval-008.jpg",
  "eval-009.jpg",
  "eval-010.jpg",
  "eval-011.jpg",
  "eval-012.jpg",
  "eval-013.jpg",
  "eval-014.jpg",
  "eval-015.jpg",
  "eval-016.jpg",
  "eval-017.jpg",
  "eval-018.jpg",
  "eval-019.jpg",
  "eval-020.jpg",
  "eval-021.jpg",
  "eval-022.jpg",
  "eval-023.jpg",
  "eval-024.jpg",
  "eval-025.jpg",
  "eval-026.jpg",
  "eval-027.jpg",
  "eval-028.jpg",
  "eval-029.jpg",
  "eval-030.jpg",
  "eval-031.jpg",
  "eval-032.jpg",
  "eval-033.jpg",
  "eval-034.jpg",
  "eval-035.jpg",
  "eval-036.jpg",
  "eval-037.jpg",
  "eval-038.jpg",
  "eval-039.jpg",
  "eval-040.jpg",
  "eval-041.jpg",
  "eval-042.jpg",
  "eval-043.jpg",
  "eval-044.jpg",
  "eval-045.jpg",
  "eval-046.jpg",
  "eval-047.jpg",
  "eval-048.jpg",
  "eval-049.jpg",
  "eval-050.jpg",
  "eval-051.jpg",
  "eval-052.jpg",
  "eval-053.jpg",
  "eval-054.jpg",
  "eval-055.jpg",
  "eval-056.jpg",
  "eval-057.jpg",
  "eval-058.jpg",
  "eval-059.jpg",
  "eval-060.jpg",
  "eval-061.jpg",
  "eval-062.jpg",
  "eval-063.jpg",
  "eval-064.jpg",
  "eval-065.jpg",
  "eval-066.jpg",
  "eval-067.jpg",
  "eval-068.jpg",
  "eval-069.jpg",
  "eval-070.jpg",
  "eval-071.jpg",
  "eval-072.jpg",
  "eval-073.jpg",
  "eval-074.jpg",
  "eval-075.jpg",
  "eval-076.jpg",
  "eval-077.jpg",
  "eval-078.jpg",
  "eval-079.jpg",
  "eval-080.jpg",
  "eval-081.jpg",
  "eval-082.jpg",
  "eval-083.jpg",
  "eval-084.jpg",
  "eval-085.jpg",
  "eval-086.jpg",
  "eval-087.jpg",
  "eval-088.jpg",
  "eval-089.jpg",
  "eval-090.jpg",
  "eval-091.jpg",
  "eval-092.jpg",
  "eval-093.jpg",
  "eval-094.jpg",
  "eval-095.jpg",
  "eval-096.jpg",
  "eval-097.jpg",
  "eval-098.jpg",
  "eval-099.jpg",
  "eval-100.jpg",
  "eval-101.jpg",
  "eval-102.jpg",
  "eval-103.jpg",
  "eval-104.jpg",
  "eval-105.jpg",
  "eval-106.jpg",
  "eval-107.jpg",
  "eval-108.jpg",
  "eval-109.jpg",
  "eval-110.jpg",
  "eval-111.jpg",
  "eval-112.jpg",
  "eval-113.jpg",
  "eval-114.jpg",
  "eval-115.jpg",
  "eval-116.jpg",
  "eval-117.jpg",
  "eval-118.jpg",
  "eval-119.jpg",
  "eval-120.jpg",
  "eval-121.jpg",
  "eval-122.jpg",
  "eval-123.jpg",
  "eval-124.jpg",
  "eval-125.jpg",
  "eval-126.jpg",
  "eval-127.jpg",
  "eval-128.jpg",
  "eval-129.jpg",
  "eval-130.jpg",
  "eval-131.jpg",
  "eval-132.jpg",
  "eval-133.jpg",
  "eval-134.jpg",
  "eval-135.jpg",
  "eval-136.jpg",
  "eval-137.jpg",
  "eval-138.jpg",
  "eval-139.jpg",
  "eval-140.jpg",
  "eval-141.jpg",
  "eval-142.jpg",
  "eval-143.jpg",
  "eval-144.jpg",
  "eval-145.jpg",
  "eval-146.jpg",
  "eval-147.jpg",
  "eval-148.jpg",
  "eval-149.jpg",
  "eval-150.jpg",
  "eval-151.jpg",
] as const;

const buildCandidates = (): Item[] =>
  VALID_EVAL_FILES.map((filename) => {
    const num = filename.match(/eval-(\d{3})\.jpg/i)?.[1] ?? "";
    return {
      src: `/evaluations/${filename}`,
      key: filename,
      num,
    };
  });

const EvaluationsGallery = () => {
  const t = useT();
  const candidates = useMemo(buildCandidates, []);
  const [queryInput, setQueryInput] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOrder>("asc");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const stripRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  // Per-item depth: 1 = centered, 0 = far edge
  const [depths, setDepths] = useState<Record<string, number>>({});

  // Debounce search
  useEffect(() => {
    const id = setTimeout(() => setQuery(queryInput), 200);
    return () => clearTimeout(id);
  }, [queryInput]);

  const allSorted = useMemo(
    () =>
      [...candidates].sort((a, b) =>
        sort === "asc" ? a.num.localeCompare(b.num) : b.num.localeCompare(a.num)
      ),
    [candidates, sort]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/o/g, "0");
    if (!q) return allSorted;
    return allSorted.filter((c) => c.num.includes(q) || c.key.toLowerCase().includes(q));
  }, [allSorted, query]);

  // Compute per-item depth (1 at center, 0 at edge) → V-shape recede
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const update = () => {
      const stripRect = strip.getBoundingClientRect();
      const center = stripRect.left + stripRect.width / 2;
      // Falloff distance: half viewport width works well across breakpoints
      const falloff = stripRect.width * 0.45;
      let bestKey: string | null = null;
      let bestDist = Infinity;
      const next: Record<string, number> = {};
      for (const item of filtered) {
        const el = itemRefs.current[item.key];
        if (!el) continue;
        const r = el.getBoundingClientRect();
        const c = r.left + r.width / 2;
        const d = Math.abs(c - center);
        const ratio = Math.max(0, 1 - d / falloff);
        // ease for smoother V curve
        next[item.key] = ratio * ratio * (3 - 2 * ratio);
        if (d < bestDist) {
          bestDist = d;
          bestKey = item.key;
        }
      }
      setActiveKey(bestKey);
      setDepths(next);
    };
    update();
    strip.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      strip.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [filtered]);

  // On search change, scroll first matching result to center
  useEffect(() => {
    if (!filtered.length) return;
    const first = filtered[0];
    const el = itemRefs.current[first.key];
    if (el) el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [query, sort, filtered]);

  const lightboxItem = lightboxIndex !== null ? allSorted[lightboxIndex] : null;

  const openLightbox = (item: Item) => {
    const idx = allSorted.indexOf(item);
    setLightboxIndex(idx);
    trackEvent("evaluation_open", { evaluation_number: item.num });
  };

  const navLightbox = useCallback(
    (dir: 1 | -1) => {
      setLightboxIndex((idx) => {
        if (idx === null || allSorted.length === 0) return idx;
        const next = (idx + dir + allSorted.length) % allSorted.length;
        return next;
      });
    },
    [allSorted]
  );

  // When lightbox index changes, scroll the underlying strip to that item
  useEffect(() => {
    if (lightboxIndex === null) return;
    const item = allSorted[lightboxIndex];
    const el = itemRefs.current[item?.key];
    if (el) el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [lightboxIndex, allSorted]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") navLightbox(1);
      else if (e.key === "ArrowLeft") navLightbox(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, navLightbox]);

  const scrollStrip = (dir: 1 | -1) => {
    const strip = stripRef.current;
    if (!strip) return;
    strip.scrollBy({ left: dir * strip.clientWidth * 0.6, behavior: "smooth" });
  };

  // Drag-to-scroll (mouse). Touch swipe is native.
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    let isDown = false;
    let startX = 0;
    let startScroll = 0;
    let moved = false;

    const onDown = (e: MouseEvent) => {
      // Only left button, ignore drags starting on interactive nav arrows
      if (e.button !== 0) return;
      isDown = true;
      moved = false;
      startX = e.pageX;
      startScroll = strip.scrollLeft;
      strip.classList.add("cursor-grabbing");
    };
    const onMove = (e: MouseEvent) => {
      if (!isDown) return;
      const dx = e.pageX - startX;
      if (Math.abs(dx) > 4) moved = true;
      strip.scrollLeft = startScroll - dx;
    };
    const endDrag = () => {
      isDown = false;
      strip.classList.remove("cursor-grabbing");
    };
    const onClickCapture = (e: MouseEvent) => {
      if (moved) {
        e.stopPropagation();
        e.preventDefault();
        moved = false;
      }
    };

    strip.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", endDrag);
    strip.addEventListener("mouseleave", endDrag);
    strip.addEventListener("click", onClickCapture, true);
    return () => {
      strip.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", endDrag);
      strip.removeEventListener("mouseleave", endDrag);
      strip.removeEventListener("click", onClickCapture, true);
    };
  }, []);

  return (
    <div className="mb-12">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            inputMode="numeric"
            placeholder={t("Search by number (e.g. 065)", "Hledat podle čísla (např. 065)")}
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            className="pl-9 pr-9"
          />
          {queryInput && (
            <button
              type="button"
              aria-label={t("Clear search", "Vymazat hledání")}
              onClick={() => setQueryInput("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Select value={sort} onValueChange={(v) => setSort(v as SortOrder)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">{t("Number ↑ (Ascending)", "Číslo ↑ (Vzestupně)")}</SelectItem>
            <SelectItem value="desc">{t("Number ↓ (Descending)", "Číslo ↓ (Sestupně)")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-muted-foreground font-light mb-6">
        {filtered.length === 0
          ? t("No evaluations match your search.", "Žádné formuláře neodpovídají vyhledávání.")
          : t(
              `Showing ${filtered.length} of ${candidates.length} evaluations`,
              `Zobrazeno ${filtered.length} z ${candidates.length} hodnocení`
            )}
      </p>

      {filtered.length > 0 && (
        <div className="relative">
          {/* Edge fades */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10" />

          {/* Strip nav arrows */}
          <button
            type="button"
            aria-label={t("Scroll left", "Posunout vlevo")}
            onClick={() => scrollStrip(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-background/80 backdrop-blur-sm text-foreground hover:bg-background transition-colors shadow-md"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label={t("Scroll right", "Posunout vpravo")}
            onClick={() => scrollStrip(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-background/80 backdrop-blur-sm text-foreground hover:bg-background transition-colors shadow-md"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div
            ref={stripRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth py-12 px-[40%] no-scrollbar"
            style={{ scrollbarWidth: "none" }}
          >
            {filtered.map((item, i) => {
              const isActive = activeKey === item.key;
              return (
                <motion.button
                  key={item.key}
                  ref={(el) => (itemRefs.current[item.key] = el)}
                  type="button"
                  onClick={() => openLightbox(item)}
                  initial={{ opacity: 0, x: 80 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(i * 0.05, 1.5), duration: 0.4, ease: "easeOut" }}
                  className="relative shrink-0 snap-center w-[200px] sm:w-[240px] aspect-[3/4] rounded-lg overflow-hidden bg-muted/30 group"
                  style={{
                    transform: `scale(${isActive ? 1.1 : 1})`,
                    opacity: isActive ? 1 : 0.7,
                    transition: "transform 0.4s ease, opacity 0.4s ease, box-shadow 0.4s ease",
                    boxShadow: isActive
                      ? "0 20px 60px -10px hsl(var(--primary) / 0.35), 0 0 40px -5px hsl(var(--accent) / 0.25)"
                      : "none",
                  }}
                >
                  <img
                    src={`${item.src}?v=${ASSET_VERSION}`}
                    alt={t("Evaluation form scan", "Sken hodnotícího formuláře") + ` #${item.num}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 text-xs font-medium px-2 py-0.5 rounded bg-background/80 backdrop-blur-sm text-foreground/90">
                    #{item.num}
                  </span>
                  {isActive && (
                    <span className="absolute inset-0 rounded-lg ring-1 ring-primary/20 pointer-events-none" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      <Dialog open={lightboxIndex !== null} onOpenChange={(o) => !o && setLightboxIndex(null)}>
        <DialogContent className="max-w-[95vw] md:max-w-5xl p-2 bg-background/95 border-none">
          {lightboxItem && (
            <div className="relative">
              <img
                src={`${lightboxItem.src}?v=${ASSET_VERSION}`}
                alt={t("Evaluation form scan", "Sken hodnotícího formuláře") + ` #${lightboxItem.num}`}
                className="w-full h-auto max-h-[88vh] object-contain rounded"
              />
              <span className="absolute top-3 left-3 text-sm font-medium px-3 py-1 rounded bg-background/80 backdrop-blur-sm text-foreground">
                #{lightboxItem.num}
                <span className="ml-2 text-muted-foreground font-light">
                  {(lightboxIndex ?? 0) + 1} / {allSorted.length}
                </span>
              </span>
              {allSorted.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label={t("Previous", "Předchozí")}
                    onClick={() => navLightbox(-1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm text-foreground hover:bg-background transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    aria-label={t("Next", "Další")}
                    onClick={() => navLightbox(1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm text-foreground hover:bg-background transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EvaluationsGallery;

