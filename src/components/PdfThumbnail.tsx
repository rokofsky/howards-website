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
}

const PdfThumbnail = ({ url, title, className = "" }: PdfThumbnailProps) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [inView, setInView] = useState(false);
  const [webpSrc, setWebpSrc] = useState<string | null>(() => webpCache.get(url) ?? null);
  const containerRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
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

  // After react-pdf renders, grab the canvas and convert to compressed WebP
  const captureWebp = useCallback(() => {
    if (webpSrc) return; // already captured
    const el = containerRef.current;
    if (!el) return;

    // Small delay to ensure canvas is painted
    requestAnimationFrame(() => {
      const canvas = el.querySelector("canvas");
      if (!canvas) return;
      try {
        const dataUrl = canvas.toDataURL("image/webp", 0.75);
        webpCache.set(url, dataUrl);
        setWebpSrc(dataUrl);
      } catch {
        // cross-origin or other issue — keep showing the canvas
      }
    });
  }, [url, webpSrc]);

  const handleLoadSuccess = useCallback(() => {
    setLoaded(true);
    // Capture after a tick so the Page canvas is painted
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

      {/* Once we have a WebP snapshot, show the lightweight image and skip the PDF renderer */}
      {webpSrc ? (
        <img
          src={webpSrc}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        inView && (
          <div ref={containerRef}>
            <Document
              file={url}
              onLoadSuccess={handleLoadSuccess}
              onLoadError={() => setError(true)}
              loading={null}
            >
              <Page
                pageNumber={1}
                width={280}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
          </div>
        )
      )}
    </div>
  );
};

export default PdfThumbnail;
