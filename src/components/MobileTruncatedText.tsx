import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileTruncatedTextProps {
  paragraphs: string[];
  className?: string;
}

const renderParagraph = (paragraph: string, className: string) => {
  // Two-column bullet list
  if (paragraph.startsWith("{{COLUMNS}}") && paragraph.endsWith("{{/COLUMNS}}")) {
    const inner = paragraph.slice(11, -12);
    const [leftRaw, rightRaw] = inner.split("||");
    const leftParts = leftRaw.split("|");
    const rightParts = rightRaw.split("|");
    const leftTitle = leftParts[0];
    const leftBullets = leftParts.slice(1);
    const rightTitle = rightParts[0];
    const rightBullets = rightParts.slice(1);

    return (
      <div key={paragraph} className="grid grid-cols-2 gap-4 md:gap-8">
        <div>
          <h4 className="font-semibold text-foreground mb-2">{leftTitle}</h4>
          <ul className="space-y-1">
            {leftBullets.map((b) => (
              <li key={b} className="flex gap-2 text-foreground/80 font-normal">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-2">{rightTitle}</h4>
          <ul className="space-y-1">
            {rightBullets.map((b) => (
              <li key={b} className="flex gap-2 text-foreground/80 font-normal">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  // Intro text + bullet list
  if (paragraph.startsWith("{{BULLET_LIST}}") && paragraph.endsWith("{{/BULLET_LIST}}")) {
    const inner = paragraph.slice(15, -16);
    const parts = inner.split("|");
    const intro = parts[0];
    const bullets = parts.slice(1);

    return (
      <div key={paragraph} className="space-y-2">
        <p className={className}>{intro}</p>
        <ul className="space-y-1 pl-1">
          {bullets.map((b) => (
            <li key={b} className="flex gap-2 text-foreground/80 font-normal">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <p key={paragraph} className={className}>
      {paragraph}
    </p>
  );
};

const MobileTruncatedText = ({ paragraphs, className = "" }: MobileTruncatedTextProps) => {
  const [expanded, setExpanded] = useState(false);
  const isMobile = useIsMobile();

  if (!paragraphs.length) return null;

  const showTruncated = isMobile && paragraphs.length > 1 && !expanded;

  return (
    <div className="space-y-4">
      {(showTruncated ? [paragraphs[0]] : paragraphs).map((paragraph) =>
        renderParagraph(paragraph, className)
      )}
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
