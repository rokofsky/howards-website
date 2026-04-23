import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./en";
import cz from "./cz";

// Custom path detector: /cz → "cs"
const pathDetector = {
  name: "pathDetector",
  lookup() {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path === "/cz" || path.startsWith("/cz/")) return "cs";
    }
    return undefined;
  },
};

const languageDetector = new LanguageDetector();
languageDetector.addDetector(pathDetector);

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      cs: { translation: cz },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "cs"],
    detection: {
      order: ["pathDetector", "localStorage", "navigator"],
      lookupLocalStorage: "i18nextLng",
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
