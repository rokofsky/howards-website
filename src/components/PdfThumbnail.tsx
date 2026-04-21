import { useState, useRef, useEffect, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Global cache so re-renders / re-mounts don't re-process the same PDF
const webpCache = new Map<string, string>();

interface PdfThumbnailProps {
  url: string;
  title: string;
  className?: string;
  thumbnailUrl?: string;
}

const PdfThumbnail = ({ url, title, className = "", thumbnailUrl }: PdfThumbnailProps) => {
  // If a pre-rendered thumbnail exists, skip all PDF processing
  if (thumbnailUrl) {
    return (
      <div className={`aspect-[3/4] rounded-lg overflow-hidden bg-white relative ${className}`}>
        <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" loading="lazy" />
      </div>
    );
  }

  return <PdfFallbackThumbnail url={url} title={title} className={className} />;
};

/** Fallback: render PDF client-side, capture canvas as WebP */
const PdfFallbackThumbnail = ({ url, title, className }: { url: string; title: string; className: string }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [inView, setInView] = useState(false);
  const [webpSrc, setWebpSrc] = useState<string | null>(() => webpCache.get(url) ?? null);
  const containerRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const captureWebp = useCallback(() => {
    if (webpSrc) return;
    const el = containerRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      const canvas = el.querySelector("canvas");
      if (!canvas) return;
      try {
        const dataUrl = canvas.toDataURL("image/webp", 0.75);
        webpCache.set(url, dataUrl);
        setWebpSrc(dataUrl);
      } catch {
        // cross-origin — keep showing the canvas
      }
    });
  }, [url, webpSrc]);

  const handleLoadSuccess = useCallback(() => {
    setLoaded(true);
    setTimeout(captureWebp, 150);
  }, [captureWebp]);

  return (
    <div
      ref={ref}
      className={`aspect-[3/4] rounded-lg overflow-hidden bg-white relative ${className}`}
    >
      {!inView && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
          <span className="text-xs text-muted-foreground">{title}</span>
        </div>
      )}
      {inView && !loaded && !error && (
        <div className="absolute inset-0 bg-muted/30 animate-pulse">
          <div className="h-full w-full flex flex-col items-center justify-center gap-2 p-4">
            <div className="w-3/4 h-2 bg-muted-foreground/10 rounded" />
            <div className="w-1/2 h-2 bg-muted-foreground/10 rounded" />
            <div className="w-2/3 h-2 bg-muted-foreground/10 rounded" />
            <div className="w-1/2 h-2 bg-muted-foreground/10 rounded" />
          </div>
        </div>
      )}
      {inView && error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
          <span className="text-xs text-muted-foreground">{title}</span>
        </div>
      )}
      {webpSrc ? (
        <img src={webpSrc} alt={title} className="w-full h-full object-cover" loading="lazy" />
      ) : (
        inView && (
          <div ref={containerRef}>
            <Document
              file={url}
              onLoadSuccess={handleLoadSuccess}
              onLoadError={() => setError(true)}
              loading={null}
            >
              <Page pageNumber={1} width={280} renderTextLayer={false} renderAnnotationLayer={false} />
            </Document>
          </div>
        )
      )}
    </div>
  );
};

export default PdfThumbnail;
