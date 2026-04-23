import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toLanguagePath, useIsCzech } from "@/hooks/useLanguageRouting";

const SITE_ORIGIN = "https://howards-website.lovable.app";

const SeoHead = () => {
  const { pathname, hash } = useLocation();
  const isCz = useIsCzech();

  useEffect(() => {
    const cleanPath = pathname.replace(/^\/cz(\/|$)/, "/");

    const enPath = toLanguagePath(cleanPath, "en");
    const csPath = toLanguagePath(cleanPath, "cs");

    const enUrl = `${SITE_ORIGIN}${enPath}`;
    const csUrl = `${SITE_ORIGIN}${csPath}`;
    const selfUrl = isCz ? csUrl : enUrl;

    // Remove old tags
    document.querySelectorAll('link[rel="alternate"][hreflang], link[rel="canonical"]').forEach((el) => el.remove());

    const head = document.head;

    // Canonical
    const canonical = document.createElement("link");
    canonical.rel = "canonical";
    canonical.href = selfUrl;
    head.appendChild(canonical);

    // hreflang="en"
    const hrefEn = document.createElement("link");
    hrefEn.rel = "alternate";
    hrefEn.hreflang = "en";
    hrefEn.href = enUrl;
    head.appendChild(hrefEn);

    // hreflang="cs"
    const hrefCs = document.createElement("link");
    hrefCs.rel = "alternate";
    hrefCs.hreflang = "cs";
    hrefCs.href = csUrl;
    head.appendChild(hrefCs);

    // hreflang="x-default"
    const hrefDefault = document.createElement("link");
    hrefDefault.rel = "alternate";
    hrefDefault.hreflang = "x-default";
    hrefDefault.href = enUrl;
    head.appendChild(hrefDefault);

    return () => {
      document.querySelectorAll('link[rel="alternate"][hreflang], link[rel="canonical"]').forEach((el) => el.remove());
    };
  }, [pathname, isCz]);

  return null;
};

export default SeoHead;
