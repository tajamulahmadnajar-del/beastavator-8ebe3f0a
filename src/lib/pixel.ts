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

/**
 * Records one Subscribe conversion per session, immediately before opening Telegram.
 * Resolves once the event has actually left the browser (or after a short timeout),
 * so the redirect never cancels the request.
 */
export function trackSubscribe(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  ensurePixel();

  // Session-level guard: prevents duplicate Subscribe events on repeat clicks,
  // back-navigation or page reloads (keeps cost per result accurate).
  try {
    if (window.sessionStorage.getItem(SUBSCRIBE_KEY)) return Promise.resolve();
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

  // Fallback beacon with the SAME eventID: if fbevents.js is slow, blocked or the
  // tab unloads first, Meta still receives the event and dedupes it against the
  // browser event, so no double counting.
  return sendBeacon(eventId);
}

/**
 * Quality gate for ad cost: instead of counting every button press, the Subscribe
 * event is only sent once the visitor actually leaves this page for Telegram
 * (tab hidden or page unloading). Misclicks and visitors without Telegram never
 * produce a conversion, so Meta optimises towards people who really open the
 * channel and the cost per real subscriber drops.
 */
export function armSubscribeOnLeave(): void {
  if (typeof window === "undefined") return;
  ensurePixel();

  let fired = false;
  const fire = () => {
    if (fired) return;
    fired = true;
    cleanup();
    void trackSubscribe();
  };

  const onVisibility = () => {
    if (document.visibilityState === "hidden") fire();
  };
  const cleanup = () => {
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("pagehide", fire);
    window.removeEventListener("blur", fire);
  };

  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("pagehide", fire);
  window.addEventListener("blur", fire);

  // Safety net: if the browser never reports a leave (some in-app browsers),
  // still count the intent after 6s so real joins are not lost.
  window.setTimeout(fire, 6000);
}

function sendBeacon(eventId: string): Promise<void> {
  const params = new URLSearchParams({
    id: PIXEL_ID,
    ev: "Subscribe",
    dl: window.location.href,
    rl: document.referrer || "",
    if: "false",
    ts: String(Date.now()),
    eid: eventId,
    "cd[content_name]": "Telegram Channel Join",
    "cd[content_category]": "telegram",
    "cd[currency]": "INR",
    "cd[value]": "1",
    noscript: "1",
  });
  const url = `https://www.facebook.com/tr?${params.toString()}`;

  // sendBeacon survives page unload / app switch, so the event is never cancelled.
  try {
    if (navigator.sendBeacon?.(url)) return Promise.resolve();
  } catch {
    /* fall through to the image beacon */
  }

  return new Promise<void>((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      resolve();
    };
    window.setTimeout(finish, 700);
    try {
      const img = new Image(1, 1);
      img.onload = finish;
      img.onerror = finish;
      img.src = url;
    } catch {
      finish();
    }
  });
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

