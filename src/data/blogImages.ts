import haraImg from "@/assets/blog-hara.jpg";
import cvImg from "@/assets/blog-cv.jpg";
import storytellingImg from "@/assets/blog-storytelling.jpg";

// Map of asset URL placeholders (stored in DB) to bundled image imports.
const assetMap: Record<string, string> = {
  "@asset/blog-hara.jpg": haraImg,
  "@asset/blog-cv.jpg": cvImg,
  "@asset/blog-storytelling.jpg": storytellingImg,
};

export const resolveImageUrl = (url?: string | null): string | undefined => {
  if (!url) return undefined;
  return assetMap[url] ?? url;
};
