"use client";

import { useEffect, useRef } from "react";
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
  { src: "/photos/duo-daylight.jpg", w: 1200, h: 796 },
  { src: "/photos/container-openair.jpg", w: 1200, h: 796 },
  { src: "/photos/bw-warehouse.jpg", w: 1200, h: 796 },
  { src: "/photos/tiki-club.jpg", w: 1200, h: 796 },
  { src: "/photos/openair-umbrellas.jpg", w: 796, h: 1200 },
  { src: "/photos/tent-crowd.jpg", w: 1200, h: 796 },
  { src: "/photos/bw-openair-decks.jpg", w: 1200, h: 796 },
  { src: "/photos/duo-closeup.jpg", w: 1080, h: 1080 },
  { src: "/photos/openair-jungle.jpg", w: 1200, h: 796 },
  { src: "/photos/booth-crowd.jpg", w: 1200, h: 796 },
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
  const rowRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  // Track holds the list twice so the transform can wrap seamlessly.
  const doubled = [...photos, ...photos];

  // JS-driven auto-scroll that also takes manual drag (like the hero model).
  // touch-action: pan-y lets vertical swipes scroll the page; horizontal drags
  // pan the strip. Auto-scroll pauses while hovering or dragging.
  useEffect(() => {
    const row = rowRef.current;
    const track = trackRef.current;
    if (!row || !track) return;

    let copyW = track.scrollWidth / 2; // width of one photo set
    let speed = copyW > 0 ? copyW / (duration * 60) : 0; // px/frame ≈ old timing
    const ro = new ResizeObserver(() => {
      copyW = track.scrollWidth / 2;
      speed = copyW > 0 ? copyW / (duration * 60) : 0;
    });
    ro.observe(track);

    let offset = 0;
    let dragging = false;
    let hovering = false;
    let lastX = 0;
    let raf = 0;

    const wrap = () => {
      if (copyW > 0) offset = ((offset % copyW) + copyW) % copyW;
    };
    const apply = () => {
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
    };

    const tick = () => {
      if (!dragging && !hovering) {
        offset += reverse ? -speed : speed;
        wrap();
        apply();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onEnter = () => {
      hovering = true;
    };
    const onLeave = () => {
      hovering = false;
    };
    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      row.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      offset -= dx;
      wrap();
      apply();
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      row.style.cursor = "grab";
    };

    row.addEventListener("mouseenter", onEnter);
    row.addEventListener("mouseleave", onLeave);
    row.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      row.removeEventListener("mouseenter", onEnter);
      row.removeEventListener("mouseleave", onLeave);
      row.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [duration, reverse]);

  return (
    <div
      ref={rowRef}
      className="marquee-row"
      style={{ cursor: "grab", touchAction: "pan-y" }}
    >
      <div ref={trackRef} className="marquee-track">
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
            draggable={false}
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
