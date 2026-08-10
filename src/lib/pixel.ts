import { PIXEL_ID } from "./pixel-config";

export { PIXEL_ID };

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
    const pvId = `pv_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    window.fbq?.("track", "PageView", {}, { eventID: pvId });
    beacon("PageView", pvId);

    const vcId = `vc_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    window.fbq?.("track", "ViewContent", {
      content_name: "Telegram Channel Join",
      content_category: "telegram",
    }, { eventID: vcId });
    beacon("ViewContent", vcId, { content_name: "Telegram Channel Join" });

    captureFbclid();
  }
}

/** Fires an image beacon straight to Meta so the event lands even if fbevents.js is slow/blocked. */
function beacon(eventName: string, eventId: string, custom?: Record<string, string>): void {
  const params = new URLSearchParams({
    id: PIXEL_ID,
    ev: eventName,
    dl: window.location.href,
    rl: document.referrer || "",
    if: "false",
    ts: String(Date.now()),
    eid: eventId,
    noscript: "1",
  });
  if (custom) for (const [k, v] of Object.entries(custom)) params.set(`cd[${k}]`, v);
  const img = new Image(1, 1);
  img.src = `https://www.facebook.com/tr?${params.toString()}`;
}

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]!) : null;
}

/** Builds an _fbc value from the ad click id if fbevents.js hasn't written the cookie yet. */
function captureFbclid(): void {
  const fbclid = new URLSearchParams(window.location.search).get("fbclid");
  if (!fbclid || readCookie("_fbc")) return;
  const value = `fb.1.${Date.now()}.${fbclid}`;
  document.cookie = `_fbc=${value}; path=/; max-age=${60 * 60 * 24 * 90}`;
}

/** Stable per-browser id used as an extra Meta match key. */
function getExternalId(): string {
  const key = "ak_ext_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = `ext_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

/** Browser-side Meta match keys, sent to the server so the real join can be attributed. */
export function getMetaMatchKeys() {
  if (typeof window === "undefined") return {};
  return {
    fbp: readCookie("_fbp"),
    fbc: readCookie("_fbc"),
    externalId: getExternalId(),
    eventSourceUrl: window.location.href,
  };
}
