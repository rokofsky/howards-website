import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toLanguagePath, useIsCzech } from "@/hooks/useLanguageRouting";

const SITE_ORIGIN = "https://howards-website.lovable.app";
const BRAND = "Rokofsky Communication Training";

type Meta = { title: string; description: string };
type Bilingual = { en: Meta; cs: Meta };

/**
 * Map a normalized EN path (always starting with "/", no /cz prefix) to
 * bilingual title + meta description. The first matching entry wins, so
 * order more-specific paths before catch-alls.
 */
const ROUTE_META: Array<{ match: RegExp; meta: Bilingual }> = [
  {
    match: /^\/$/,
    meta: {
      en: {
        title: BRAND,
        description:
          "Communication consulting in Prague: presentation skills, storytelling, negotiation, coaching and conflict mediation that turn friction into breakthroughs.",
      },
      cs: {
        title: BRAND,
        description:
          "Komunikační poradenství v Praze: prezentační dovednosti, storytelling, vyjednávání, koučink a mediace konfliktů, které mění tření v průlomy.",
      },
    },
  },
  {
    match: /^\/bio$/,
    meta: {
      en: {
        title: `About Howard | ${BRAND}`,
        description:
          "Meet Howard Rokofsky — soft skills trainer and storytelling maestro helping leaders and teams in Prague communicate with clarity and impact.",
      },
      cs: {
        title: `O Howardovi | ${BRAND}`,
        description:
          "Seznamte se s Howardem Rokofským — trenérem soft skills a mistrem storytellingu, který pomáhá lídrům a týmům v Praze komunikovat jasně a s dopadem.",
      },
    },
  },
  {
    match: /^\/references(\/scans(\/.*)?)?$/,
    meta: {
      en: {
        title: `Clients & Projects | ${BRAND}`,
        description:
          "Real testimonials and scanned evaluation forms from Howard Rokofsky's clients and workshop participants across Prague and beyond.",
      },
      cs: {
        title: `Klienti a projekty | ${BRAND}`,
        description:
          "Skutečné reference a naskenované hodnotící formuláře od klientů a účastníků workshopů Howarda Rokofského z Prahy i odjinud.",
      },
    },
  },
  {
    match: /^\/blog$/,
    meta: {
      en: {
        title: `Insights & Tips | ${BRAND}`,
        description:
          "Articles, insights and practical tips on communication, storytelling, negotiation and leadership from Howard Rokofsky.",
      },
      cs: {
        title: `Postřehy a tipy | ${BRAND}`,
        description:
          "Články, postřehy a praktické tipy o komunikaci, storytellingu, vyjednávání a leadershipu od Howarda Rokofského.",
      },
    },
  },
  {
    match: /^\/blog\/.+$/,
    meta: {
      en: {
        title: `Blog | ${BRAND}`,
        description:
          "Read the latest article on communication, storytelling and leadership from Howard Rokofsky.",
      },
      cs: {
        title: `Blog | ${BRAND}`,
        description:
          "Přečtěte si nejnovější článek o komunikaci, storytellingu a leadershipu od Howarda Rokofského.",
      },
    },
  },
  {
    match: /^\/storytelling-workshops$/,
    meta: {
      en: {
        title: `Storytelling Workshops | ${BRAND}`,
        description:
          "Hands-on storytelling workshops in Prague — turn ideas, pitches and presentations into stories audiences remember and act on.",
      },
      cs: {
        title: `Workshopy storytellingu | ${BRAND}`,
        description:
          "Praktické workshopy storytellingu v Praze — proměňte nápady, pitche a prezentace v příběhy, které si publikum zapamatuje.",
      },
    },
  },
  {
    match: /^\/keynote-topics$/,
    meta: {
      en: {
        title: `Keynote Topics | ${BRAND}`,
        description:
          "Keynote topics by Howard Rokofsky on communication, storytelling, leadership and negotiation for conferences and corporate events.",
      },
      cs: {
        title: `Témata keynote | ${BRAND}`,
        description:
          "Témata keynote přednášek Howarda Rokofského o komunikaci, storytellingu, leadershipu a vyjednávání pro konference a firemní akce.",
      },
    },
  },
  {
    match: /^\/services\/.+$/,
    meta: {
      en: {
        title: `Services | ${BRAND}`,
        description:
          "Practical communication training and coaching services tailored to leaders, teams and organizations.",
      },
      cs: {
        title: `Služby | ${BRAND}`,
        description:
          "Praktické komunikační tréninky a koučink na míru lídrům, týmům a organizacím.",
      },
    },
  },
  {
    match: /^\/webinars\/.+$/,
    meta: {
      en: {
        title: `Webinar | ${BRAND}`,
        description:
          "Live online webinar with Howard Rokofsky on communication, storytelling and leadership skills.",
      },
      cs: {
        title: `Webinář | ${BRAND}`,
        description:
          "Živý online webinář s Howardem Rokofským o komunikaci, storytellingu a leadershipu.",
      },
    },
  },
  {
    match: /^\/privacy-policy$/,
    meta: {
      en: {
        title: `Privacy Policy | ${BRAND}`,
        description:
          "How Rokofsky Communication Training collects, uses and protects your personal data.",
      },
      cs: {
        title: `Ochrana soukromí | ${BRAND}`,
        description:
          "Jak Rokofsky Communication Training shromažďuje, používá a chrání vaše osobní údaje.",
      },
    },
  },
  {
    match: /^\/gdpr$/,
    meta: {
      en: {
        title: `GDPR | ${BRAND}`,
        description:
          "GDPR information and data protection rights for visitors and clients of Rokofsky Communication Training.",
      },
      cs: {
        title: `GDPR | ${BRAND}`,
        description:
          "Informace o GDPR a právech na ochranu osobních údajů pro návštěvníky a klienty Rokofsky Communication Training.",
      },
    },
  },
  {
    match: /^\/terms-of-service$/,
    meta: {
      en: {
        title: `Terms of Service | ${BRAND}`,
        description:
          "Terms governing the use of Rokofsky Communication Training services and website.",
      },
      cs: {
        title: `Obchodní podmínky | ${BRAND}`,
        description:
          "Podmínky upravující používání služeb a webových stránek Rokofsky Communication Training.",
      },
    },
  },
];

const FALLBACK: Bilingual = {
  en: {
    title: BRAND,
    description:
      "Communication consulting: presentation skills, coaching, negotiation, storytelling and conflict mediation in Prague.",
  },
  cs: {
    title: BRAND,
    description:
      "Komunikační poradenství: prezentační dovednosti, koučink, vyjednávání, storytelling a mediace konfliktů v Praze.",
  },
};

function resolveMeta(enPath: string, isCz: boolean): Meta {
  const entry = ROUTE_META.find((r) => r.match.test(enPath));
  const bilingual = entry?.meta ?? FALLBACK;
  return isCz ? bilingual.cs : bilingual.en;
}

function upsertMeta(name: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertProperty(property: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[property="${property}"]`
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

const SeoHead = () => {
  const { pathname } = useLocation();
  const isCz = useIsCzech();

  useEffect(() => {
    const cleanPath = pathname.replace(/^\/cz(\/|$)/, "/") || "/";

    const enPath = toLanguagePath(cleanPath, "en");
    const csPath = toLanguagePath(cleanPath, "cs");

    const enUrl = `${SITE_ORIGIN}${enPath}`;
    const csUrl = `${SITE_ORIGIN}${csPath}`;
    const selfUrl = isCz ? csUrl : enUrl;

    // Social metadata fallback only. Page components own document.title and meta description.
    const meta = resolveMeta(enPath, isCz);
    upsertProperty("og:title", meta.title);
    upsertProperty("og:description", meta.description);
    upsertProperty("og:url", selfUrl);
    upsertMeta("twitter:title", meta.title);
    upsertMeta("twitter:description", meta.description);

    // Remove old canonical / hreflang tags
    document
      .querySelectorAll('link[rel="alternate"][hreflang], link[rel="canonical"]')
      .forEach((el) => el.remove());

    const head = document.head;

    const canonical = document.createElement("link");
    canonical.rel = "canonical";
    canonical.href = selfUrl;
    head.appendChild(canonical);

    const hrefEn = document.createElement("link");
    hrefEn.rel = "alternate";
    hrefEn.hreflang = "en";
    hrefEn.href = enUrl;
    head.appendChild(hrefEn);

    const hrefCs = document.createElement("link");
    hrefCs.rel = "alternate";
    hrefCs.hreflang = "cs";
    hrefCs.href = csUrl;
    head.appendChild(hrefCs);

    const hrefDefault = document.createElement("link");
    hrefDefault.rel = "alternate";
    hrefDefault.hreflang = "x-default";
    hrefDefault.href = enUrl;
    head.appendChild(hrefDefault);

    return () => {
      document
        .querySelectorAll('link[rel="alternate"][hreflang], link[rel="canonical"]')
        .forEach((el) => el.remove());
    };
  }, [pathname, isCz]);

  return null;
};

export default SeoHead;
