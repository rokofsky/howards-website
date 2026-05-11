import { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
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

const PAGE_SIZE = 20;

type Item = { src: string; key: string; num: string };
type SortOrder = "asc" | "desc";

// Hard-coded allowlist generated from the files currently present in /public/evaluations/.
export const ASSET_VERSION = "202605101455";

const VALID_EVAL_FILES = [
  "eval-001.jpg","eval-002.jpg","eval-003.jpg","eval-004.jpg","eval-005.jpg",
  "eval-006.jpg","eval-007.jpg","eval-008.jpg","eval-009.jpg","eval-010.jpg",
  "eval-011.jpg","eval-012.jpg","eval-013.jpg","eval-014.jpg","eval-015.jpg",
  "eval-016.jpg","eval-017.jpg","eval-018.jpg","eval-019.jpg","eval-020.jpg",
  "eval-021.jpg","eval-022.jpg","eval-023.jpg","eval-024.jpg","eval-025.jpg",
  "eval-026.jpg","eval-027.jpg","eval-028.jpg","eval-029.jpg","eval-030.jpg",
  "eval-031.jpg","eval-032.jpg","eval-033.jpg","eval-034.jpg","eval-035.jpg",
  "eval-036.jpg","eval-037.jpg","eval-038.jpg","eval-039.jpg","eval-040.jpg",
  "eval-041.jpg","eval-042.jpg","eval-043.jpg","eval-044.jpg","eval-045.jpg",
  "eval-046.jpg","eval-047.jpg","eval-048.jpg","eval-049.jpg","eval-050.jpg",
  "eval-051.jpg","eval-052.jpg","eval-053.jpg","eval-054.jpg","eval-055.jpg",
  "eval-056.jpg","eval-057.jpg","eval-058.jpg","eval-059.jpg","eval-060.jpg",
  "eval-061.jpg","eval-062.jpg","eval-063.jpg","eval-064.jpg","eval-069.jpg",
  "eval-070.jpg","eval-071.jpg","eval-072.jpg","eval-073.jpg","eval-074.jpg",
  "eval-075.jpg","eval-076.jpg","eval-077.jpg","eval-078.jpg","eval-079.jpg",
  "eval-080.jpg","eval-081.jpg","eval-082.jpg","eval-083.jpg","eval-084.jpg",
  "eval-085.jpg","eval-086.jpg","eval-087.jpg","eval-088.jpg","eval-089.jpg",
  "eval-090.jpg","eval-091.jpg","eval-092.jpg","eval-093.jpg","eval-094.jpg",
  "eval-095.jpg","eval-096.jpg","eval-097.jpg","eval-098.jpg","eval-099.jpg",
  "eval-100.jpg","eval-101.jpg","eval-102.jpg","eval-103.jpg","eval-104.jpg",
  "eval-105.jpg","eval-106.jpg","eval-107.jpg","eval-108.jpg","eval-109.jpg",
  "eval-110.jpg","eval-111.jpg","eval-112.jpg","eval-113.jpg","eval-114.jpg",
  "eval-115.jpg","eval-116.jpg","eval-117.jpg","eval-118.jpg","eval-119.jpg",
  "eval-120.jpg","eval-121.jpg","eval-122.jpg","eval-123.jpg","eval-124.jpg",
  "eval-125.jpg","eval-126.jpg","eval-127.jpg","eval-128.jpg","eval-129.jpg",
  "eval-130.jpg","eval-131.jpg","eval-132.jpg","eval-133.jpg","eval-134.jpg",
  "eval-135.jpg","eval-136.jpg","eval-137.jpg","eval-138.jpg","eval-139.jpg",
  "eval-140.jpg","eval-141.jpg","eval-142.jpg","eval-143.jpg","eval-144.jpg",
  "eval-145.jpg","eval-146.jpg","eval-147.jpg","eval-148.jpg","eval-150.jpg",
  "eval-151.jpg","eval-152.jpg","eval-153.jpg","eval-154.jpg","eval-155.jpg",
  "eval-156.jpg",
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
  const [page, setPage] = useState(1);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Debounce search input
  useEffect(() => {
    const id = setTimeout(() => {
      setQuery(queryInput);
      setPage(1);
    }, 200);
    return () => clearTimeout(id);
  }, [queryInput]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = !q
      ? candidates
      : candidates.filter(
          (c) => c.num.includes(q) || c.key.toLowerCase().includes(q)
        );
    const sorted = [...base].sort((a, b) =>
      sort === "asc" ? a.num.localeCompare(b.num) : b.num.localeCompare(a.num)
    );
    return sorted;
  }, [candidates, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);
  const showingTo = Math.min(start + PAGE_SIZE, filtered.length);

  const goTo = (p: number) => {
    setPage(Math.min(Math.max(1, p), totalPages));
  };

  const pageNumbers: (number | "ellipsis")[] = useMemo(() => {
    const pages: (number | "ellipsis")[] = [];
    const window = 1;
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - window && i <= currentPage + window)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "ellipsis") {
        pages.push("ellipsis");
      }
    }
    return pages;
  }, [totalPages, currentPage]);

  const lightboxItem = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  const navLightbox = useCallback(
    (dir: 1 | -1) => {
      setLightboxIndex((idx) => {
        if (idx === null || filtered.length === 0) return idx;
        return (idx + dir + filtered.length) % filtered.length;
      });
    },
    [filtered.length]
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") navLightbox(1);
      else if (e.key === "ArrowLeft") navLightbox(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, navLightbox]);

  return (
    <div className="mb-12">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            inputMode="numeric"
            placeholder={t(
              "Search by number (e.g. 065)",
              "Hledat podle čísla (např. 065)"
            )}
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
            <SelectItem value="asc">
              {t("Number ↑ (Ascending)", "Číslo ↑ (Vzestupně)")}
            </SelectItem>
            <SelectItem value="desc">
              {t("Number ↓ (Descending)", "Číslo ↓ (Sestupně)")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results summary */}
      <p className="text-sm text-muted-foreground font-light mb-6">
        {filtered.length === 0
          ? t("No evaluations match your search.", "Žádné formuláře neodpovídají vyhledávání.")
          : t(
              `Showing ${start + 1}–${showingTo} of ${filtered.length}${
                filtered.length !== candidates.length ? ` (of ${candidates.length})` : ""
              } evaluations`,
              `Zobrazeno ${start + 1}–${showingTo} z ${filtered.length}${
                filtered.length !== candidates.length ? ` (z ${candidates.length})` : ""
              } hodnocení`
            )}
      </p>

      {filtered.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <AnimatePresence mode="popLayout">
              {visible.map((item) => {
                const globalIdx = filtered.indexOf(item);
                return (
                  <motion.button
                    key={item.key}
                    type="button"
                    onClick={() => setLightboxIndex(globalIdx)}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative block rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:brightness-90 hover:shadow-xl bg-muted/30 aspect-[3/4] group"
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
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      goTo(currentPage - 1);
                    }}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                {pageNumbers.map((p, i) =>
                  p === "ellipsis" ? (
                    <PaginationItem key={`e-${i}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={p}>
                      <PaginationLink
                        href="#"
                        isActive={p === currentPage}
                        onClick={(e) => {
                          e.preventDefault();
                          goTo(p);
                        }}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      goTo(currentPage + 1);
                    }}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}

      <Dialog
        open={lightboxIndex !== null}
        onOpenChange={(o) => !o && setLightboxIndex(null)}
      >
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
                  {(lightboxIndex ?? 0) + 1} / {filtered.length}
                </span>
              </span>
              {filtered.length > 1 && (
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
