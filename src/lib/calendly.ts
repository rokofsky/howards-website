declare global {
  interface Window {
    Cal?: any;
  }
}

// Initialize the Cal.com embed snippet globally
if (typeof window !== "undefined" && !window.Cal) {
  (function (p, z, c, a, co) {
    var b: any = (p.Cal =
      p.Cal ||
      function () {
        var g = b.q;
        b.q = b.q || [];
        g.push(arguments);
      });
    co.forEach(function (f: string) {
      b(f);
    });
    b.ns = c;
    var q = z.createElement(a) as HTMLScriptElement;
    q.async = true;
    q.src = "https://app.cal.com/embed/embed.js";
    var s = z.getElementsByTagName(a)[0];
    s.parentNode?.insertBefore(q, s);
  })(window, document, "cal", "script", ["init", "ui", "action", "on"]);

  // Set default theme styling
  window.Cal("init", { ui: { theme: "light" } });
}

// Change this string to match your exact Cal.com link (e.g., "username/15-min")
export const CAL_URL = "howardroko/15-min";

/**
 * Opens the clean Cal.com popup overlay modal.
 * Keeps the function name 'openCalendly' so existing button click handlers continue working perfectly.
 */
export function openCalendly() {
  if (window.Cal) {
    // Apply UI configurations
    window.Cal("ui", {
      styles: { branding: { brandColor: "#000000" } },
      hideEventTypeDetails: false,
      layout: "month_view",
    });

    // Trigger the popup modal
    window.Cal("modal", {
      link: CAL_URL,
    });
  }
}
