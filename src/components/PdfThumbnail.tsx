import { useState } from "react";
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

  return (
    <div
      className={`aspect-[3/4] rounded-lg overflow-hidden bg-white relative ${className}`}
    >
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/30 animate-pulse">
          <span className="text-xs text-muted-foreground">Loading…</span>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
          <span className="text-xs text-muted-foreground">{title}</span>
        </div>
      )}
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
    </div>
  );
};

export default PdfThumbnail;
