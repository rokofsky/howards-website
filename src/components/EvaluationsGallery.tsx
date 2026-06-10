import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useT } from "@/hooks/useT";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

type Item = { src: string; key: string; num: string };
type SortOrder = "asc" | "desc";

const trackEvent = (label: string, params: Record<string, unknown> = {}) => {
  if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
    (window as any).gtag("event", "click", { event_category: "engagement", event_label: label, ...params });
  }
};

export const ASSET_VERSION = "202606080007";

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
    return { src: `/evaluations/${filename}`, key: filename, num };
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
  const [depths, setDepths] = useState<Record<string, number>>({});

  useEffect(() => {
    const id = setTimeout(() => setQuery(queryInput), 200);
    return () => clearTimeout(id);
  }, [queryInput]);

  const allSorted = useMemo(
    () => [...candidates].sort((a, b) => (sort === "asc" ? a.num.localeCompare(b.num) : b.num.localeCompare(a.num))),
    [candidates, sort],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/o/g, "0");
    if (!q) return allSorted;
    return allSorted.filter((c) => c.num.includes(q) || c.key.toLowerCase().includes(q));
  }, [allSorted, query]);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const update = () => {
      const stripRect = strip.getBoundingClientRect();
      const center = stripRect.left + stripRect.width / 2;
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

  useEffect(() => {
    if (!filtered.length) return;
    const first = filtered[0];
    const el = itemRefs.current[first.key];
    if (el) el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [query, sort, filtered]);

  const openLightbox = (item: Item) => {
    const idx = allSorted.indexOf(item);
    setLightboxIndex(idx);
    trackEvent("evaluation_open", { evaluation_number: item.num });
  };

  const navLightbox = useCallback(
    (dir: 1 | -1) => {
      setLightboxIndex((idx) => {
        if (idx === null || allSorted.length === 0) return idx;
        return (idx + dir + allSorted.length) % allSorted.length;
      });
    },
    [allSorted],
  );

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

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    let isDown = false,
      startX = 0,
      startScroll = 0,
      lastX = 0,
      lastT = 0;
    let velocity = 0,
      moved = false,
      rafId: number | null = null;
    const cancelMomentum = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };
    const snapToNearest = () => {
      const stripRect = strip.getBoundingClientRect();
      const center = stripRect.left + stripRect.width / 2;
      let bestEl: HTMLElement | null = null,
        bestDist = Infinity;
      for (const key in itemRefs.current) {
        const el = itemRefs.current[key];
        if (!el) continue;
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - center);
        if (d < bestDist) {
          bestDist = d;
          bestEl = el;
        }
      }
      if (bestEl) bestEl.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    };
    const momentum = () => {
      const friction = 0.94;
      const step = () => {
        velocity *= friction;
        strip.scrollLeft -= velocity * 16;
        if (Math.abs(velocity) > 0.05) {
          rafId = requestAnimationFrame(step);
        } else {
          rafId = null;
          snapToNearest();
        }
      };
      rafId = requestAnimationFrame(step);
    };
    const onDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      cancelMomentum();
      isDown = true;
      moved = false;
      startX = e.pageX;
      lastX = e.pageX;
      lastT = performance.now();
      velocity = 0;
      startScroll = strip.scrollLeft;
      strip.classList.add("cursor-grabbing");
    };
    const onMove = (e: MouseEvent) => {
      if (!isDown) return;
      const dx = e.pageX - startX;
      if (Math.abs(dx) > 4) moved = true;
      strip.scrollLeft = startScroll - dx;
      const now = performance.now(),
        dt = now - lastT;
      if (dt > 0) velocity = velocity * 0.6 + ((e.pageX - lastX) / dt) * 0.4;
      lastX = e.pageX;
      lastT = now;
    };
    const endDrag = () => {
      if (!isDown) return;
      isDown = false;
      strip.classList.remove("cursor-grabbing");
      if (Math.abs(velocity) > 0.05) momentum();
      else if (moved) snapToNearest();
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
    strip.addEventListener("wheel", cancelMomentum, { passive: true });
    return () => {
      cancelMomentum();
      strip.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", endDrag);
      strip.removeEventListener("mouseleave", endDrag);
      strip.removeEventListener("click", onClickCapture, true);
      strip.removeEventListener("wheel", cancelMomentum);
    };
  }, []);

  return (
    <div className="mb-12">
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

      {filtered.length > 0 && (
        <div className="relative">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10" />
          <button
            type="button"
            aria-label={t("Scroll left", "Posunout vlevo")}
            onClick={() => scrollStrip(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 backdrop-blur-xl text-white border-0 portrait:scale-[1.3] landscape:scale-[1.7] shadow-[0_0_30px_rgba(99,179,255,0.45)] hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label={t("Scroll right", "Posunout vpravo")}
            onClick={() => scrollStrip(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 backdrop-blur-xl text-white border-0 portrait:scale-[1.3] landscape:scale-[1.7] shadow-[0_0_30px_rgba(99,179,255,0.45)] hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div
            ref={stripRef}
            className="flex gap-4 sm:gap-5 lg:gap-6 overflow-x-auto snap-x snap-proximity py-12 px-[40%] sm:px-[35%] lg:px-[30%] no-scrollbar cursor-grab select-none"
            style={{ scrollbarWidth: "none" }}
          >
            {filtered.map((item, i) => {
              const isActive = activeKey === item.key;
              const depth = depths[item.key] ?? 0;
              const scale = 0.75 + depth * 0.35;
              const opacity = 0.5 + depth * 0.5;
              const translateY = (1 - depth) * 18;
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
                    transform: `translateY(${translateY}px) scale(${scale})`,
                    opacity,
                    transition: "transform 0.35s ease, opacity 0.35s ease, box-shadow 0.35s ease",
                    boxShadow: isActive
                      ? "0 20px 60px -10px hsl(var(--primary) / 0.35), 0 0 40px -5px hsl(var(--accent) / 0.25)"
                      : "none",
                  }}
                >
                  <img
                    src={`${item.src}?v=${ASSET_VERSION}`}
                    alt={t("Evaluation form scan", "Sken hodnotícího formuláře") + ` #${item.num}`}
                    loading="lazy"
                    className="w-full h-full object-cover pointer-events-none"
                    draggable={false}
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

      {lightboxIndex !== null && (
        <IsolatedView
          items={allSorted}
          startIndex={lightboxIndex}
          onIndexChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
          alt={t("Evaluation form scan", "Sken hodnotícího formuláře")}
          prevLabel={t("Previous", "Předchozí")}
          nextLabel={t("Next", "Další")}
          closeLabel={t("Close", "Zavřít")}
        />
      )}
    </div>
  );
};

type IsolatedViewProps = {
  items: Item[];
  startIndex: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
  alt: string;
  prevLabel: string;
  nextLabel: string;
  closeLabel: string;
};

const IsolatedView = ({
  items,
  startIndex,
  onIndexChange,
  onClose,
  alt,
  prevLabel,
  nextLabel,
  closeLabel,
}: IsolatedViewProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    startIndex,
    dragFree: false,
    containScroll: false,
  });

  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [selectedIdx, setSelectedIdx] = useState(startIndex);
  // Focus index — the zoom/pan target, decoupled from Embla position.
  // Neighbor clicks shift this without moving the carousel.
  const [focusIdx, setFocusIdx] = useState(startIndex);
  // Deferred centering offset (%) applied to the focused slide so it visually
  // sits at viewport center after a zoom or focus switch settles.
  const [centerShift, setCenterShift] = useState(0);

  const pointerStartX = useRef<number>(0);
  const pointerStartY = useRef<number>(0);
  const pointerDownPos = useRef({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const panStartX = useRef(0);
  const panStartY = useRef(0);
  const imageBounds = useRef({ width: 0, height: 0 });
  const containerBounds = useRef({ width: 0, height: 0 });
  const activeImgRef = useRef<HTMLImageElement | null>(null);

  // Pinch gesture refs
  const pinchStartDist = useRef<number | null>(null);
  const pinchStartScale = useRef(1);

  const getPinchDist = (touches: TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Compute the actual rendered size of an object-fit: contain image inside its container,
  // derived from naturalWidth/naturalHeight. The <img> element itself fills the container,
  // but the visible image content is letterboxed/pillarboxed.
  const getRenderedImageSize = (img: HTMLImageElement | null, container: { width: number; height: number }) => {
    if (!img || !img.naturalWidth || !img.naturalHeight) return container;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const contRatio = container.width / container.height;
    if (imgRatio > contRatio) {
      return { width: container.width, height: container.width / imgRatio };
    }
    return { width: container.height * imgRatio, height: container.height };
  };

  // Reset offset when scale returns to 1
  useEffect(() => {
    if (scale === 1) setOffset({ x: 0, y: 0 });
  }, [scale]);

  // Lock body scroll while the lightbox is mounted.
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Deferred centering transform — runs after focus/scale/selected settles,
  // bails out while the user is actively swiping/panning/pinching so it
  // never fights live gesture state.
  useEffect(() => {
    if (isPanning.current || pinchStartDist.current !== null) return;
    const raf = requestAnimationFrame(() => {
      if (isPanning.current || pinchStartDist.current !== null) return;
      const shift = focusIdx !== selectedIdx && scale > 1 ? -(focusIdx - selectedIdx) * 100 : 0;
      setCenterShift(shift);
    });
    return () => cancelAnimationFrame(raf);
  }, [focusIdx, scale, selectedIdx]);



  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.scrollTo(startIndex, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      const idx = emblaApi.selectedScrollSnap();
      onIndexChange(idx);
      setSelectedIdx(idx);
      // Swipe/scroll keeps focus in sync with the centered card.
      setFocusIdx(idx);
      setScale(1);
      setOffset({ x: 0, y: 0 });
    };
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onIndexChange]);

  // Wheel zoom — attached to the focused image only, with { passive: false }
  useEffect(() => {
    const img = activeImgRef.current;
    if (!img) return;
    const onWheel = (e: WheelEvent) => {
      if (e.shiftKey) return;
      e.preventDefault();
      e.stopPropagation();
      const precise = e.ctrlKey || e.metaKey;
      const step = precise ? 0.3 : 0.15;
      const max = precise ? 5 : 3;
      const dir = e.deltaY < 0 ? 1 : -1;
      setScale((s) => {
        const next = s + dir * step;
        if (next <= 1) return 1;
        if (next >= max) return max;
        return next;
      });
    };
    img.addEventListener("wheel", onWheel, { passive: false });
    return () => img.removeEventListener("wheel", onWheel);
  }, [focusIdx, emblaApi]);

  // Keyboard nav + lock body scroll
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") emblaApi?.scrollNext();
      else if (e.key === "ArrowLeft") emblaApi?.scrollPrev();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "clip";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [emblaApi, onClose]);

  // Disable Embla's drag/swipe when zoomed in so pan gestures don't get hijacked.
  useEffect(() => {
    if (!emblaApi) return;
    const maxX = Math.max(0, (imageBounds.current.width * scale - window.innerWidth) / 2);
    const clampX = maxX * scale;

    // 5px leeway buffer to prevent pixel-skipping deadlocks during fast swipes
    const atEdge = offset.x <= -clampX + 5 || offset.x >= clampX - 5;

    emblaApi.reInit({ watchDrag: scale <= 1 || atEdge });
  }, [scale, offset.x, emblaApi]);
  // Native touch listeners — handles pan, swipe-to-navigate, and pinch
  useEffect(() => {
    const img = activeImgRef.current;
    const emblaNode = emblaApi?.rootNode() as HTMLElement | null;
    if (!img || !emblaNode) return;

    // Swipe tracking
    const swipeStartX = { val: 0 };
    const swipeStartY = { val: 0 };
    const swipeStartTime = { val: 0 };

    const onTouchStart = (e: TouchEvent) => {
      // Two-finger pinch
      if (e.touches.length === 2) {
        pinchStartDist.current = getPinchDist(e.touches);
        pinchStartScale.current = scale;
        isPanning.current = false;
        return;
      }
      if (e.touches.length !== 1) return;

      const touch = e.touches[0];
      swipeStartX.val = touch.clientX;
      swipeStartY.val = touch.clientY;
      swipeStartTime.val = performance.now();
      panStartX.current = touch.clientX;
      panStartY.current = touch.clientY;

      if (scale > 1) {
        e.stopPropagation();
        // Use window dimensions as container — img.parentElement rect is unreliable
        // because the slide is positioned off-screen in Embla's flex track
        containerBounds.current = {
          width: window.innerWidth,
          height: window.innerHeight,
        };
        imageBounds.current = getRenderedImageSize(img, containerBounds.current);
        isPanning.current = true;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      // Two-finger pinch
      if (e.touches.length === 2 && pinchStartDist.current !== null) {
        e.preventDefault();
        const dist = getPinchDist(e.touches);
        const ratio = dist / pinchStartDist.current;
        setScale(Math.min(4, Math.max(1, pinchStartScale.current * ratio)));
        return;
      }

      if (!isPanning.current || e.touches.length !== 1) return;
      e.stopPropagation();
      e.preventDefault();

      const touch = e.touches[0];
      const dx = touch.clientX - panStartX.current;
      const dy = touch.clientY - panStartY.current;
      panStartX.current = touch.clientX;
      panStartY.current = touch.clientY;

      setOffset((o) => {
        const maxX = Math.max(0, (imageBounds.current.width * scale - containerBounds.current.width) / 2);
        const maxY = Math.max(0, (imageBounds.current.height * scale - containerBounds.current.height) / 2);
        // Multiply by scale because offset is applied as translate(offset/scale)
        // so raw offset must be scale times larger than visual pixel distance
        const clampX = maxX * scale;
        const clampY = maxY * scale;
        return {
          x: Math.max(-clampX, Math.min(clampX, o.x + dx)),
          y: Math.max(-clampY, Math.min(clampY, o.y + dy)),
        };
      });
    };

    const onTouchEnd = (e: TouchEvent) => {
      pinchStartDist.current = null;

      isPanning.current = false;

      // Detect fast horizontal swipe → navigate to next/prev and reset zoom
      const dt = performance.now() - swipeStartTime.val;
      const changedTouch = e.changedTouches[0];
      if (!changedTouch || dt <= 0) return;
      const dx = changedTouch.clientX - swipeStartX.val;
      const dy = Math.abs(changedTouch.clientY - swipeStartY.val);
      const velocityX = Math.abs(dx) / dt; // px/ms

      const isFastSwipe = velocityX > 0.3 && Math.abs(dx) > 40 && Math.abs(dx) > dy;
      if (isFastSwipe) {
        setScale(1);
        setOffset({ x: 0, y: 0 });
        if (dx < 0) {
          emblaApi?.scrollNext();
        } else {
          emblaApi?.scrollPrev();
        }
      }
    };

    // Attach to both img (for pan) and emblaNode (for pinch on empty area)
    img.addEventListener("touchstart", onTouchStart, { passive: false });
    img.addEventListener("touchmove", onTouchMove, { passive: false });
    img.addEventListener("touchend", onTouchEnd);
    emblaNode.addEventListener("touchstart", onTouchStart, { passive: false });
    emblaNode.addEventListener("touchmove", onTouchMove, { passive: false });
    emblaNode.addEventListener("touchend", onTouchEnd);

    return () => {
      img.removeEventListener("touchstart", onTouchStart);
      img.removeEventListener("touchmove", onTouchMove);
      img.removeEventListener("touchend", onTouchEnd);
      emblaNode.removeEventListener("touchstart", onTouchStart);
      emblaNode.removeEventListener("touchmove", onTouchMove);
      emblaNode.removeEventListener("touchend", onTouchEnd);
    };
  }, [scale, emblaApi]);

  const current = selectedIdx;
  // Zoom/pan target — independent of carousel position.
  const focused = focusIdx;

  const btnStyle: React.CSSProperties = {
    position: "fixed",
    zIndex: 45,
    background: "rgba(10,25,47,0.7)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "2px solid rgba(255,255,255,0.4)",
    WebkitTapHighlightColor: "transparent",
    outline: "none",
  };

  return (
    <div className="fixed inset-0 z-30 bg-background/95 pointer-events-none">
      {/* BACKDROP: catches taps on orange padding to close */}
      <div
        className="absolute inset-0 z-0 pointer-events-auto"
        onPointerDown={(e) => {
          pointerStartX.current = e.clientX;
          pointerStartY.current = e.clientY;
        }}
        onPointerUp={(e) => {
          const dx = Math.abs(e.clientX - pointerStartX.current);
          const dy = Math.abs(e.clientY - pointerStartY.current);
          if (dx < 10 && dy < 10) onClose();
        }}
      />

      {/* EMBLA CAROUSEL */}
      <div
        className="absolute inset-0 z-10"
        ref={emblaRef}
        style={{
          touchAction: "none",
          overflow: scale > 1 ? "visible" : "hidden",
        }}
        onTouchStart={(e) => {
          if (scale > 1) return;
          (e.currentTarget as any)._touchStartX = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (scale > 1) return;
          const startX = (e.currentTarget as any)._touchStartX;
          if (startX === undefined) return;
          const diff = startX - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 50) {
            if (diff > 0) emblaApi?.scrollNext();
            else emblaApi?.scrollPrev();
          }
        }}
      >
        <div className="flex h-full" style={{ overflow: "visible" }}>
          {items.map((it, idx) => {
            const isCurrent = idx === current;
            const isFocused = idx === focused;
            // Neighbors are relative to the FOCUSED card, not the embla current.
            const isPrev = idx === focused - 1;
            const isNext = idx === focused + 1;
            const isNeighbor = isPrev || isNext;
            // Outline focused side-card (focused but not the embla-current slide)
            const isFocusedSide = isFocused && !isCurrent;
            // Isolated centering shift: when zoomed, translate the focused
            // slide wrapper toward viewport center without touching the track.
            const centerShiftPct = isFocused && scale > 1 ? -(focused - current) * 100 : 0;
            return (
              <div
                key={it.key}
                className={`relative flex-[0_0_33.333%] min-w-0 h-full flex items-center justify-center p-1 ${isNeighbor ? "cursor-pointer" : ""} ${isFocusedSide ? "ring-2 ring-white/60 shadow-xl" : ""} transition-all`}
                style={{
                  overflow: "visible",
                  pointerEvents: "auto",
                  zIndex: isFocused ? (scale > 1 ? 10 : 2) : 1,
                  visibility: !isFocused && scale > 1 ? "hidden" : "visible",
                  transform: centerShiftPct ? `translateX(${centerShiftPct}%)` : undefined,
                  transition: isPanning.current ? "none" : "transform 0.2s ease",
                }}
                onClick={
                  !isFocused
                    ? () => {
                        setScale(1);
                        setOffset({ x: 0, y: 0 });
                        setFocusIdx(idx);
                      }
                    : undefined
                }
              >
                <img
                  src={`${it.src}?v=${ASSET_VERSION}`}
                  alt={`${alt} #${it.num}`}
                  draggable={false}
                  ref={(el) => {
                    // activeImgRef tracks the FOCUSED image (zoom/pan target).
                    if (idx === focused) {
                      activeImgRef.current = el;
                    }
                  }}
                  style={{
                    pointerEvents: isFocused ? "auto" : "none",
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    touchAction: "none",
                    transform: isFocused
                      ? `scale(${scale}) translate(${offset.x / scale}px, ${offset.y / scale}px)`
                      : undefined,
                    transformOrigin: "center",
                    transition: isPanning.current ? "none" : "transform 0.1s ease",
                  }}
                  className="select-none"
                  onPointerDown={(e) => {
                    if (scale <= 1) return;

                    const maxX = Math.max(0, (imageBounds.current.width * scale - window.innerWidth) / 2);
                    const clampX = maxX * scale;

                    // ADDED: Match the 5px leeway buffer here so the image releases the event tracking system
                    const isAtLeftEdge = offset.x >= clampX - 5;
                    const isAtRightEdge = offset.x <= -clampX + 5;

                    if (!isAtLeftEdge && !isAtRightEdge) {
                      e.stopPropagation();
                    }

                    e.currentTarget.setPointerCapture(e.pointerId);
                    panStartX.current = e.clientX;
                    panStartY.current = e.clientY;

                    containerBounds.current = {
                      width: window.innerWidth,
                      height: window.innerHeight,
                    };
                    imageBounds.current = getRenderedImageSize(e.currentTarget, containerBounds.current);
                    isPanning.current = true;
                  }}
                  onPointerMove={(e) => {
                    if (!isPanning.current) return;
                    e.stopPropagation();
                    const dx = e.clientX - panStartX.current;
                    const dy = e.clientY - panStartY.current;
                    panStartX.current = e.clientX;
                    panStartY.current = e.clientY;
                    setOffset((o) => {
                      const maxX = Math.max(0, (imageBounds.current.width * scale - containerBounds.current.width) / 2);
                      const maxY = Math.max(
                        0,
                        (imageBounds.current.height * scale - containerBounds.current.height) / 2,
                      );
                      // Multiply by scale because offset is applied as translate(offset/scale)
                      const clampX = maxX * scale;
                      const clampY = maxY * scale;
                      return {
                        x: Math.max(-clampX, Math.min(clampX, o.x + dx)),
                        y: Math.max(-clampY, Math.min(clampY, o.y + dy)),
                      };
                    });
                  }}
                  onPointerUp={(e) => {
                    isPanning.current = false;
                    try {
                      e.currentTarget.releasePointerCapture(e.pointerId);
                    } catch {}
                  }}
                  onPointerCancel={(e) => {
                    isPanning.current = false;
                    try {
                      e.currentTarget.releasePointerCapture(e.pointerId);
                    } catch {}
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    bottom: "8px",
                    left: "8px",
                    fontSize: "11px",
                    fontWeight: 500,
                    padding: "2px 6px",
                    borderRadius: "4px",
                    background: "rgba(255,255,255,0.8)",
                    color: "#333",
                    pointerEvents: "none",
                    zIndex: 10,
                  }}
                >
                  #{it.num}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* CONTROLS */}

      {/* Counter */}
      <span
        style={{ position: "fixed", top: "8px", left: "12px", zIndex: 99999 }}
        className="text-sm font-medium px-3 py-1 rounded bg-black/60 backdrop-blur-sm text-white pointer-events-none"
      >
        {current + 1} / {items.length}
      </span>

      {/* Close button */}
      <button
        type="button"
        aria-label={closeLabel}
        onClick={onClose}
        style={{ ...btnStyle, top: "52px", right: "8px" }}
        className="inline-flex items-center justify-center w-12 h-12 rounded-full text-white"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Prev / Next arrows */}
      {items.length > 1 && (
        <>
          <button
            type="button"
            aria-label={prevLabel}
            onClick={() => emblaApi?.scrollPrev()}
            style={{ ...btnStyle, top: "50%", left: "8px", transform: "translateY(-50%)" }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-full text-white portrait:scale-[1.3] landscape:scale-[1.7]"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
          <button
            type="button"
            aria-label={nextLabel}
            onClick={() => emblaApi?.scrollNext()}
            style={{ ...btnStyle, top: "50%", right: "8px", transform: "translateY(-50%)" }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-full text-white portrait:scale-[1.3] landscape:scale-[1.7]"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </>
      )}
    </div>
  );
};

export default EvaluationsGallery;
