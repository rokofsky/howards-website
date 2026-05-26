declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (opts: { url: string }) => void;
    };
  }
}

export const CALENDLY_URL = "https://calendly.com/howardroko";

export function openCalendly() {
  if (window.Calendly) {
    // 1. Capture the exact current scroll position of the background page
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    // 2. Lock the background window at those coordinates during focus changes
    const lockScroll = () => {
      window.scrollTo(scrollX, scrollY);
    };

    window.addEventListener("scroll", lockScroll);

    // 3. Open the Calendly Popup
    window.Calendly.initPopupWidget({ url: CALENDLY_URL });

    // 4. Safely stop locking the scroll after the user has had time to click through
    // (Cleans up the listener after 30 seconds so normal scrolling works after closing)
    setTimeout(() => {
      window.removeEventListener("scroll", lockScroll);
    }, 30000);
  }
}
