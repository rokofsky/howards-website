import { useIsCzech } from "./useLanguageRouting";

/**
 * Returns a function that picks between English and Czech literal strings inline.
 *
 * Usage:
 *   const t = useT();
 *   <h2>{t("Investment", "Investice")}</h2>
 *
 * Both strings live directly in the JSX so Lovable's Visual Editor can detect
 * and edit them on either /‑prefixed or /cz‑prefixed pages.
 */
export const useT = () => {
  const isCz = useIsCzech();
  return (en: string, cs: string) => (isCz ? cs : en);
};
