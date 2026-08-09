import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { PIXEL_ID, ensurePixel, trackSubscribe } from "@/lib/pixel";
import heroAsset from "@/assets/aviator-profit-king.jpg.asset.json";

const TELEGRAM_LINK = "https://t.me/+-ZHl3IMhU5JiYjk1";
const HERO_IMG = heroAsset.url;
const HERO_ABS = `https://beastavator.lovable.app${heroAsset.url}`;

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
  useEffect(() => {
    ensurePixel();
  }, []);

  const handleJoinClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    await trackSubscribe();
    window.location.href = TELEGRAM_LINK;
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-5 text-foreground">
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>

      <div className="w-full max-w-[400px] text-center">
        <h1 className="mb-5 text-[21px] leading-[1.4] font-bold text-brand-yellow sm:text-2xl">
          INDIA's MOST DEMANDING CHANNEL
        </h1>

        <img
          src={HERO_IMG}
          alt="AVIATOR KING™"
          onClick={handleJoinClick}
          className="mx-auto mb-5 h-40 w-40 max-w-full cursor-pointer rounded-full border-[3px] border-[var(--ring-soft)] object-cover sm:h-[180px] sm:w-[180px]"
        />

        <p className="mb-2 text-[15px] text-sub-text">10K+ MEMBERS ALREADY JOINED</p>
        <p className="mb-5 text-[15px] font-semibold text-foreground">DON'T WAIT, JOIN NOW</p>

        <a
          href={TELEGRAM_LINK}
          onClick={handleJoinClick}
          className="join-cta flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-blue px-4 py-[13px] text-base font-semibold text-foreground transition-colors duration-300 hover:bg-brand-blue-hover sm:py-[14px] sm:text-lg"
        >
          <i className="fab fa-telegram text-lg" aria-hidden="true" />
          JOIN NOW
        </a>
      </div>
    </main>
  );
}
