import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { PIXEL_ID, ensurePixel, trackSubscribe } from "@/lib/pixel";

const TELEGRAM_LINK = "https://t.me/+Oaihgt0GAvgxMTA1";
const HERO_IMG =
  "https://d1yei2z3i6k35z.cloudfront.net/16218780/697d038dcd182_photo_2025-10-1510.05.14.jpeg";

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
      { property: "og:image", content: HERO_IMG },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: HERO_IMG },
    ],
    links: [
      { rel: "canonical", href: "https://beastavator.lovable.app/" },
      {
        rel: "stylesheet",
        href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css",
      },
    ],
    scripts: [
      {
        children: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');fbq('track','PageView');`,
      },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    ensurePixel();
  }, []);

  const handleJoinClick = (e: React.MouseEvent) => {
    e.preventDefault();
    trackSubscribe();
    setTimeout(() => {
      window.location.href = TELEGRAM_LINK;
    }, 500);
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
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-blue px-4 py-[13px] text-base font-semibold text-foreground shadow-[0_4px_10px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-[1.03] hover:bg-brand-blue-hover sm:py-[14px] sm:text-lg"
        >
          <i className="fab fa-telegram text-lg" aria-hidden="true" />
          JOIN NOW
        </a>
      </div>
    </main>
  );
}
