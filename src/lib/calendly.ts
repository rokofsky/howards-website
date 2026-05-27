declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (opts: { url: string }) => void;
    };
  }
}

export const CALENDLY_URL =
  "https://calendly.com/howardroko/zoom-with-howard?hide_event_type_details=1&hide_gdpr_banner=1";

export function openCalendly() {
  if (window.Calendly) {
    window.Calendly.initPopupWidget({
      url: CALENDLY_URL,
    });
  }
}
