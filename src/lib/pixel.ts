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

    captureFbclid();
  }
}

const SUBSCRIBE_KEY = "av_subscribe_fired";

/** Records one Subscribe conversion per session, immediately before opening Telegram. */
export function trackSubscribe(): void {
  if (typeof window === "undefined") return;
  ensurePixel();

  // Session-level guard: prevents duplicate Subscribe events on repeat clicks,
  // back-navigation or page reloads (keeps cost per result accurate).
  try {
    if (window.sessionStorage.getItem(SUBSCRIBE_KEY)) return;
    window.sessionStorage.setItem(SUBSCRIBE_KEY, "1");
  } catch {
    /* storage blocked — fall through and fire once */
  }

  const eventId = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  window.fbq?.(
    "track",
    "Subscribe",
    {
      content_name: "Telegram Channel Join",
      content_category: "telegram",
      currency: "INR",
      value: 1,
    },
    { eventID: eventId },
  );
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

