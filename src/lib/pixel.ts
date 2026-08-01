export const PIXEL_ID = "1063547539604154";

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[]; loaded?: boolean; version?: string };
    _fbq?: unknown;
  }
}

/** Loads fbevents.js and inits the pixel exactly once (idempotent). */
export function ensurePixel(): void {
  if (typeof window === "undefined") return;

  if (!window.fbq) {
    const n: any = function (...args: unknown[]) {
      n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
    };
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    window.fbq = n;
    window._fbq = n;
  }

  if (!document.getElementById("fb-pixel-src")) {
    const s = document.createElement("script");
    s.id = "fb-pixel-src";
    s.async = true;
    s.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(s);
  }

  const w = window as unknown as { __fbPixelInit?: boolean };
  if (!w.__fbPixelInit) {
    w.__fbPixelInit = true;
    window.fbq?.("init", PIXEL_ID);
    window.fbq?.("track", "PageView");
  }
}

/** Fires the standard Subscribe event once, with a dedupe event id. */
export function trackSubscribe(): void {
  const w = window as unknown as { __fbSubscribed?: boolean };
  if (w.__fbSubscribed) return;
  w.__fbSubscribed = true;
  ensurePixel();
  window.fbq?.("track", "Subscribe", { content_name: "Telegram Channel Join" }, {
    eventID: `subscribe_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
  });
}
