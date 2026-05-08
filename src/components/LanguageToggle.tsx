import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toLanguagePath, useIsCzech } from "@/hooks/useLanguageRouting";

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isCz = useIsCzech();
  const isEn = !isCz;

  const switchTo = (lang: "en" | "cz") => {
    const newPath = toLanguagePath(location.pathname, lang);
    // Preserve exact scroll position across the language toggle. Re-navigating
    // with a hash causes the browser to jump to that section, and even without
    // a hash some layout shifts can nudge the viewport. Snapshot scrollY now
    // and restore it on the next frames until the DOM settles.
    const scrollY = window.scrollY;
    const hash = window.location.hash;
    const restore = () => window.scrollTo({ top: scrollY, left: 0, behavior: "instant" as ScrollBehavior });

    i18n.changeLanguage(lang);
    // Navigate without the hash to avoid the browser auto-scrolling to #section.
    navigate(newPath, { replace: false });

    // Re-attach the hash silently via replaceState so title logic (which keys
    // off location.hash) stays in sync with the active section. replaceState
    // does not trigger a scroll, but does fire our patched locationchange.
    if (hash) {
      requestAnimationFrame(() => {
        window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search + hash);
        restore();
      });
    }

    // Restore across a few frames to beat any post-navigation scroll handlers.
    requestAnimationFrame(restore);
    requestAnimationFrame(() => requestAnimationFrame(restore));
    setTimeout(restore, 0);
    setTimeout(restore, 50);
  };

  return (
    <div className="flex items-center gap-1 text-sm tracking-wide">
      <button
        onClick={() => switchTo("en")}
        className={`transition-all ${isEn ? "font-bold text-foreground" : "font-normal text-foreground/50 hover:text-foreground/70"}`}
      >
        EN
      </button>
      <span className="text-foreground/30">|</span>
      <button
        onClick={() => switchTo("cz")}
        className={`transition-all ${!isEn ? "font-bold text-foreground" : "font-normal text-foreground/50 hover:text-foreground/70"}`}
      >
        CZ
      </button>
    </div>
  );
};

export default LanguageToggle;
