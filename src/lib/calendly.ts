declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (opts: { url: string }) => void;
    };
  }
}

export const CALENDLY_URL = "https://calendly.com/howardroko/zoom-with-howard";

export function openCalendly() {
  document.body.style.overflow = "hidden";

  if (window.Calendly) {
    window.Calendly.initPopupWidget({
      url: CALENDLY_URL,
    });
  }

  const observer = new MutationObserver(() => {
    const popup = document.querySelector(".calendly-popup");

    if (!popup) {
      document.body.style.overflow = "";
      observer.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}
