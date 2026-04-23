import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toLanguagePath, useIsCzech } from "@/hooks/useLanguageRouting";

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isCz = useIsCzech();
  const isEn = !isCz;

  const switchTo = (lang: "en" | "cs") => {
    const newPath = toLanguagePath(location.pathname, lang);
    i18n.changeLanguage(lang);
    navigate(newPath + location.hash);
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
        onClick={() => switchTo("cs")}
        className={`transition-all ${!isEn ? "font-bold text-foreground" : "font-normal text-foreground/50 hover:text-foreground/70"}`}
      >
        CZ
      </button>
    </div>
  );
};

export default LanguageToggle;
