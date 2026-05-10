import { useMemo, useState } from "react";
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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useT } from "@/hooks/useT";
import { Search } from "lucide-react";

const PAGE_SIZE = 20;

type Item = { src: string; key: string; num: string };

// Hard-coded allowlist generated from the files currently present in /public/evaluations/.
export const ASSET_VERSION = "20260510";

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
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [lightbox, setLightbox] = useState<Item | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return candidates;
    return candidates.filter(
      (c) => c.num.includes(q) || c.key.toLowerCase().includes(q)
    );
  }, [candidates, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  const goTo = (p: number) => {
    setPage(Math.min(Math.max(1, p), totalPages));
  };

  // Build a compact page list with ellipses
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

  return (
    <div className="mb-12">
      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          inputMode="numeric"
          placeholder={t(
            "Search by number (e.g. 065)",
            "Hledat podle čísla (např. 065)"
          )}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground font-light text-sm py-8 text-center">
          {t("No evaluations match your search.", "Žádné formuláře neodpovídají vyhledávání.")}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <AnimatePresence mode="popLayout">
              {visible.map((item) => (
                <motion.button
                  key={item.key}
                  type="button"
                  onClick={() => setLightbox(item)}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="block rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:brightness-90 hover:shadow-xl bg-muted/30 aspect-[3/4]"
                >
                  <img
                    src={`${item.src}?v=${ASSET_VERSION}`}
                    alt={t("Evaluation form scan", "Sken hodnotícího formuláře")}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
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
