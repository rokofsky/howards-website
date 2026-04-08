import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileTruncatedTextProps {
  paragraphs: string[];
  className?: string;
}

const MobileTruncatedText = ({ paragraphs, className = "" }: MobileTruncatedTextProps) => {
  const [expanded, setExpanded] = useState(false);
  const isMobile = useIsMobile();

  if (!paragraphs.length) return null;

  const showTruncated = isMobile && paragraphs.length > 1 && !expanded;

  return (
    <div className="space-y-4">
      {(showTruncated ? [paragraphs[0]] : paragraphs).map((paragraph) => (
        <p key={paragraph} className={className}>
          {paragraph}
        </p>
      ))}
      {isMobile && paragraphs.length > 1 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-gold hover:text-gold/80 underline underline-offset-2 transition-colors font-medium"
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
};

export default MobileTruncatedText;
