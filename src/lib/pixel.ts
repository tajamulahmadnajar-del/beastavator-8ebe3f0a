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
    const pvId = `pv_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    window.fbq?.("track", "PageView", {}, { eventID: pvId });
    // Guaranteed fallback so PageView lands even if fbevents.js is blocked/slow.
    beacon("PageView", pvId);

    // Quality signal for cheaper optimisation: who actually saw the offer.
    const vcId = `vc_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    window.fbq?.("track", "ViewContent", {
      content_name: "Telegram Channel Join",
      content_category: "telegram",
    }, { eventID: vcId });
    beacon("ViewContent", vcId, { content_name: "Telegram Channel Join" });
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

/**
 * Fires the standard Subscribe event once (dedupe eventID), and resolves once
 * fbevents.js has actually flushed the queue — so a redirect can't cancel it.
 */
export function trackSubscribe(): Promise<void> {
  const w = window as unknown as { __fbSubscribed?: boolean };
  if (w.__fbSubscribed) return Promise.resolve();
  w.__fbSubscribed = true;

  ensurePixel();
  const eventId = `subscribe_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

  const payload = {
    content_name: "Telegram Channel Join",
    content_category: "telegram",
    currency: "INR",
    value: 1,
    predicted_ltv: 1,
  };
  window.fbq?.("track", "Subscribe", payload, { eventID: eventId });
  // Also a Lead signal — gives Meta a second, cheaper optimisation target.
  window.fbq?.("track", "Lead", payload, { eventID: `lead_${eventId}` });

  // Guaranteed fallback hits (deduped by eventID on Meta's side).
  beacon("Subscribe", eventId, { content_name: "Telegram Channel Join", currency: "INR", value: "1" });
  beacon("Lead", `lead_${eventId}`, { content_name: "Telegram Channel Join", currency: "INR", value: "1" });

  // Wait until fbevents.js is loaded and the queue is drained (max ~1.5s).
  return new Promise<void>((resolve) => {
    const start = Date.now();
    const check = () => {
      const fbq = window.fbq as unknown as { callMethod?: unknown; queue?: unknown[] } | undefined;
      const flushed = !!fbq?.callMethod && (fbq.queue?.length ?? 0) === 0;
      if (flushed || Date.now() - start > 1500) {
        resolve();
        return;
      }
      setTimeout(check, 100);
    };
    check();
  });
}
