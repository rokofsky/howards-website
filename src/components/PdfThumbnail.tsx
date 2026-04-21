import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfThumbnailProps {
  url: string;
  title: string;
  className?: string;
}

const PdfThumbnail = ({ url, title, className = "" }: PdfThumbnailProps) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [inView, setInView] = useState(false);
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
      {inView && (
        <Document
          file={url}
          onLoadSuccess={() => setLoaded(true)}
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
      )}
    </div>
  );
};

export default PdfThumbnail;
