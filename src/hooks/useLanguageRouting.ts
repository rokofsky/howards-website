import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo } from "react";

/** Czech slug overrides — EN path segment → CZ path segment */
const czSlugs: Record<string, string> = {
  references: "reference",
  bio: "bio",
  blog: "blog",
  "storytelling-workshops": "storytelling-workshops",
  "keynote-topics": "keynote-topics",
  "privacy-policy": "ochrana-soukromi",
  gdpr: "gdpr",
  "terms-of-service": "obchodni-podminky",
};

const enSlugs: Record<string, string> = Object.fromEntries(
  Object.entries(czSlugs).map(([en, cz]) => [cz, en])
);

/**
 * Convert an English path to its Czech equivalent and vice-versa.
 */
export function toLanguagePath(path: string, targetLang: "en" | "cz"): string {
  // Strip existing /cz prefix
  const cleanPath = path.replace(/^\/cz(\/|$)/, "/");

  if (targetLang === "en") {
    // Convert any CZ slugs back to EN
    const segments = cleanPath.split("/");
    const mapped = segments.map((s) => enSlugs[s] || s);
    return mapped.join("/") || "/";
  }

  // targetLang === "cz"
  const segments = cleanPath.split("/");
  const mapped = segments.map((s) => czSlugs[s] || s);
  const czPath = mapped.join("/") || "/";
  return `/cz${czPath === "/" ? "" : czPath}`;
}

/**
 * Returns whether the current route is Czech (has /cz prefix).
 */
export function useIsCzech(): boolean {
  const { pathname } = useLocation();
  return pathname.startsWith("/cz/") || pathname === "/cz";
}

/**
 * Syncs i18n language with the URL prefix.
 * Call this once in a layout wrapper.
 */
export function useLanguageSync() {
  const { i18n } = useTranslation();
  const isCz = useIsCzech();

  useEffect(() => {
    const target = isCz ? "cz" : "en";
    if (i18n.language !== target) {
      i18n.changeLanguage(target);
    }
  }, [isCz, i18n]);

  useEffect(() => {
    document.documentElement.lang = isCz ? "cs" : "en";
  }, [isCz]);
}

/**
 * Returns a function that prefixes paths with /cz when in Czech mode.
 */
export function useLocalizedPath() {
  const isCz = useIsCzech();

  return useMemo(
    () => (path: string) => {
      if (!isCz) return path;
      // Don't prefix external, hash-only, or already-prefixed paths
      if (path.startsWith("http") || path.startsWith("#")) return path;
      if (path.startsWith("/cz")) return path;

      // Handle hash routes like /#services
      if (path.startsWith("/#")) {
        return `/cz${path.slice(1)}`; // /cz#services — keep hash on /cz root
      }

      if (path === "/") return "/cz";
      return `/cz${path}`;
    },
    [isCz]
  );
}
