import { useTranslation } from "react-i18next";

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const isEn = i18n.language === "en" || i18n.language?.startsWith("en");

  return (
    <div className="flex items-center gap-1 text-sm tracking-wide">
      <button
        onClick={() => i18n.changeLanguage("en")}
        className={`transition-all ${isEn ? "font-bold text-foreground" : "font-normal text-foreground/50 hover:text-foreground/70"}`}
      >
        EN
      </button>
      <span className="text-foreground/30">|</span>
      <button
        onClick={() => i18n.changeLanguage("cs")}
        className={`transition-all ${!isEn ? "font-bold text-foreground" : "font-normal text-foreground/50 hover:text-foreground/70"}`}
      >
        CZ
      </button>
    </div>
  );
};

export default LanguageToggle;
