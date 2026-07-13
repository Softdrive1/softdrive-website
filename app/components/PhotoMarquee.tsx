"use client";

import Image from "next/image";

/* ── Analog film photos, endless two-row marquee ─────── */

type Photo = { src: string; w: number; h: number };

const ROW_A: Photo[] = [
  { src: "/photos/crowd-smoke.jpg", w: 1200, h: 796 },
  { src: "/photos/crowd-openair.jpg", w: 796, h: 1200 },
  { src: "/photos/bw-decks.jpg", w: 1200, h: 796 },
  { src: "/photos/duo-caps.jpg", w: 1200, h: 796 },
  { src: "/photos/crowd-night-bar.jpg", w: 1200, h: 796 },
  { src: "/photos/bar-two.jpg", w: 795, h: 1200 },
  { src: "/photos/bw-crowd.jpg", w: 1200, h: 796 },
  { src: "/photos/crowd-night-floor.jpg", w: 1200, h: 796 },
  { src: "/photos/club-decks.jpg", w: 1200, h: 796 },
];

const ROW_B: Photo[] = [
  { src: "/photos/crowd-night-floor.jpg", w: 1200, h: 796 },
  { src: "/photos/club-decks.jpg", w: 1200, h: 796 },
  { src: "/photos/bw-crowd.jpg", w: 1200, h: 796 },
  { src: "/photos/crowd-smoke.jpg", w: 1200, h: 796 },
  { src: "/photos/bar-two.jpg", w: 795, h: 1200 },
  { src: "/photos/crowd-openair.jpg", w: 796, h: 1200 },
  { src: "/photos/duo-caps.jpg", w: 1200, h: 796 },
  { src: "/photos/crowd-night-bar.jpg", w: 1200, h: 796 },
  { src: "/photos/bw-decks.jpg", w: 1200, h: 796 },
];

function Strip({
  photos,
  duration,
  reverse = false,
}: {
  photos: Photo[];
  duration: number;
  reverse?: boolean;
}) {
  // Track holds the list twice; the keyframe slides it by -50% for a seamless loop.
  const doubled = [...photos, ...photos];
  return (
    <div className="marquee-row">
      <div
        className="marquee-track"
        style={{
          animationDuration: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {doubled.map((p, i) => (
          <Image
            key={`${p.src}-${i}`}
            src={p.src}
            alt=""
            width={p.w}
            height={p.h}
            aria-hidden={i >= photos.length}
            className="marquee-photo"
            sizes="400px"
          />
        ))}
      </div>
    </div>
  );
}

export default function PhotoMarquee() {
  return (
    <section
      aria-label="Analog photos"
      style={{
        background: "var(--bg)",
        paddingTop: "72px",
        paddingBottom: "72px",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
      }}
    >
      <Strip photos={ROW_A} duration={70} />
      <Strip photos={ROW_B} duration={88} reverse />
    </section>
  );
}
