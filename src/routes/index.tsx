import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PIXEL_ID, armSubscribeOnLeave, ensurePixel } from "@/lib/pixel";
import { TELEGRAM_LINK } from "@/lib/pixel-config";

const HERO_IMG = "/aviator-telegram.png";
const HERO_ABS = "https://beastavator.lovable.app/aviator-telegram.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AVIATOR KING ™ — India's Most Demanding Telegram Channel" },
      {
        name: "description",
        content:
          "Join AVIATOR KING™ on Telegram — 10K+ members already joined. Get daily signals and updates from India's most demanding channel.",
      },
      { property: "og:title", content: "AVIATOR KING ™ — Join the Telegram Channel" },
      {
        property: "og:description",
        content: "10K+ members already joined. Don't wait, join AVIATOR KING™ now.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://beastavator.lovable.app/" },
      { property: "og:image", content: HERO_ABS },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: HERO_ABS },
    ],
    links: [
      { rel: "canonical", href: "https://beastavator.lovable.app/" },
      {
        rel: "stylesheet",
        href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const leaving = useRef(false);
  const [secondsLeft, setSecondsLeft] = useState(120);

  useEffect(() => {
    ensurePixel();
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSecondsLeft((s) => (s <= 0 ? 120 : s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  const handleJoinClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (leaving.current) return;
    leaving.current = true;
    // Conversion is counted only when the visitor really leaves for Telegram,
    // so misclicks don't inflate cost. Redirect happens instantly.
    armSubscribeOnLeave();
    window.location.href = TELEGRAM_LINK;
  };

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>

      <section className="hero-band flex min-h-[41vh] items-center justify-center px-5 pb-8 pt-7">
        <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-hero-line bg-hero-chip px-3 py-1.5 text-[11px] font-bold uppercase text-foreground">
            <span className="live-dot h-2 w-2 rounded-full bg-success" />
            Live Telegram Channel
          </div>
          <div className="logo-shell mb-5 h-36 w-36 overflow-hidden rounded-3xl border-2 border-hero-line bg-surface shadow-2xl sm:h-40 sm:w-40">
            <img src={HERO_IMG} alt="Aviator Telegram channel" className="h-full w-full object-cover" />
          </div>
          <p className="mb-2 text-xs font-bold uppercase text-sky-soft">Official Telegram Access</p>
          <h1 className="font-heading text-4xl font-extrabold leading-none sm:text-5xl">
            AVIATOR <span className="text-primary">KING</span>
          </h1>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-md px-5 pb-8 pt-7 text-center">
        <div className="mb-7 grid grid-cols-2 gap-3">
          <div className="proof-item flex min-h-20 items-center gap-3 rounded-lg border border-border bg-surface px-3 text-left">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 13 4 4L19 7" /></svg>
            </span>
            <span><strong className="block text-sm">Free Access</strong><small className="text-[11px] text-muted-foreground">No subscription</small></span>
          </div>
          <div className="proof-item flex min-h-20 items-center gap-3 rounded-lg border border-border bg-surface px-3 text-left">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
            </span>
            <span><strong className="block text-sm">Instant Alerts</strong><small className="text-[11px] text-muted-foreground">Direct updates</small></span>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-3">
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
          <span className="text-xs font-bold uppercase text-muted-foreground">Offer expires in</span>
          <span className="countdown font-heading text-lg font-extrabold tabular-nums text-primary">{mm}:{ss}</span>
        </div>

        <a href={TELEGRAM_LINK} onClick={handleJoinClick} className="join-cta group flex w-full items-center justify-center gap-3 rounded-lg bg-primary px-5 py-4 text-lg font-extrabold text-primary-foreground shadow-cta transition-colors hover:bg-primary-hover active:scale-[0.98]">
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true"><path d="M21.9 3.2 18.7 19c-.2 1.1-.9 1.4-1.8.9l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9-8.1c.4-.4-.1-.6-.6-.2L6.3 12.7 1.5 11.2c-1-.3-1.1-1 .2-1.5L20.5 2.5c.9-.3 1.7.2 1.4.7Z" /></svg>
          JOIN TELEGRAM NOW
          <svg viewBox="0 0 24 24" className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
        </a>
        <p className="mt-4 text-[10px] font-bold uppercase text-muted-foreground">Secure direct link • Opens in Telegram</p>
      </section>
    </main>
  );
}
