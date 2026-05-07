declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (opts: { url: string }) => void;
    };
  }
}

export const CALENDLY_URL = "https://calendly.com/howardroko/zoom-with-howard";

export function getCalendlyUrl(locale?: "cs" | "en") {
  const url = new URL(CALENDLY_URL);
  if (locale) url.searchParams.set("locale", locale);
  return url.toString();
}

export function openCalendly(locale?: "cs" | "en") {
  if (window.Calendly) {
    window.Calendly.initPopupWidget({ url: getCalendlyUrl(locale) });
  }
}
