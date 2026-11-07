"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const VIDEO_SRCS = ["/videos/video1.mp4", "/videos/video2.mp4"] as const;

export default function HeroSection() {
  const [loaded, setLoaded] = useState<[boolean, boolean]>([false, false]);
  const [active, setActive] = useState(0);
  // video2 (~8 MB) isn't visible until the first crossfade at 12s, so we don't
  // give it a src — and thus don't fetch it — until video1 is up and the main
  // thread is idle. Keeps ~8 MB off the critical initial load.
  const [loadSecond, setLoadSecond] = useState(false);
  const videos = useRef<[HTMLVideoElement | null, HTMLVideoElement | null]>([null, null]);

  const markLoaded = useCallback((i: 0 | 1) => {
    setLoaded((prev) =>
      prev[i] ? prev : i === 0 ? [true, prev[1]] : [prev[0], true]
    );
  }, []);

  // The element is in the server HTML, so the browser may finish decoding
  // BEFORE React hydrates and attaches onLoadedData — typically on a reload,
  // when the file comes from cache. That event is then gone for good, and
  // waiting for it left the hero permanently black. So don't trust the event
  // alone: read the element's own readyState until both videos report data.
  // Self-cancelling, and it also recovers a bfcache restore.
  useEffect(() => {
    if (loaded[0] && loaded[1]) return;
    const check = () => {
      videos.current.forEach((v, i) => {
        if (v && v.readyState >= 2) markLoaded(i as 0 | 1);
      });
    };
    check();
    const id = window.setInterval(check, 400);
    return () => window.clearInterval(id);
  }, [loaded, loadSecond, markLoaded]);

  // Autoplay can be dropped when the element is hydrated rather than parsed.
  // Rejection is expected and harmless (e.g. iOS Low Power Mode).
  useEffect(() => {
    videos.current.forEach((v) => void v?.play().catch(() => {}));
  }, [loadSecond]);

  useEffect(() => {
    if (!loaded[0] || loadSecond) return;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const start = w.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 400));
    const cancel = w.cancelIdleCallback ?? window.clearTimeout;
    const id = start(() => setLoadSecond(true));
    return () => cancel(id);
  }, [loaded, loadSecond]);

  useEffect(() => {
    if (!loaded[0] || !loaded[1]) return;
    const id = setInterval(() => setActive((v) => (v === 0 ? 1 : 0)), 12000);
    return () => clearInterval(id);
  }, [loaded]);

  return (
    <section
      id="home"
      className="relative flex items-center justify-center min-h-dvh overflow-hidden"
      style={{ background: "#000" }}
    >
      {/* Crossfading video backgrounds. video2's src stays empty until video1
          has loaded (see loadSecond) so the browser doesn't fetch both ~13 MB
          up front. */}
      {VIDEO_SRCS.map((src, i) => (
        <motion.video
          key={src}
          ref={(el) => {
            videos.current[i as 0 | 1] = el;
          }}
          src={i === 0 || loadSecond ? src : undefined}
          preload={i === 0 ? "auto" : "none"}
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => markLoaded(i as 0 | 1)}
          onCanPlay={() => markLoaded(i as 0 | 1)}
          // If video1 can't be fetched at all, release video2 anyway instead of
          // leaving the whole hero black behind a dependency that never resolves.
          onError={() => i === 0 && setLoadSecond(true)}
          className="absolute inset-0 w-full h-full object-cover"
          // video1 is the base layer and stays opaque once loaded; only video2
          // on top animates. Fading BOTH at once put each at 0.5 over black
          // mid-crossfade (0.5*V2 + 0.25*V1), a 25% dip every 12s. With a solid
          // base the sum stays at full brightness: a*V2 + (1-a)*V1.
          // video2 also shows when video1 never loaded, so one working file is
          // enough to fill the hero.
          animate={{
            opacity:
              i === 0
                ? loaded[0]
                  ? 1
                  : 0
                : loaded[1] && (active === 1 || !loaded[0])
                  ? 1
                  : 0,
          }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      ))}

      {/* Gradient overlay — vignette + darken top/bottom */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.48) 100%)",
        }}
      />

      {/* Hero logo — spinning chrome video. HEVC-alpha source FIRST so
          Safari/iOS picks it (Safari composites the VP9-alpha WebM with
          blown-out glow / white edge fringes); other engines fall through
          to the WebM. No poster, no fallback image: if nothing plays,
          showing nothing is preferred over the wrong logo. */}
      <motion.div
        className="relative z-20"
        initial={{ opacity: 0, scale: 1.06, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.1, ease: [0.22, 0.61, 0.36, 1], delay: 0.15 }}
      >
        {/* aspect-ratio reserves the logo's box so the video doesn't shift
            layout when it mounts — must match the video files (v2: 540x960) */}
        <div style={{ width: "min(504px, 98vw)", aspectRatio: "540 / 960" }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              background: "transparent",
            }}
          >
            <source src="/softdrive-logo.mp4" type="video/mp4; codecs=hvc1" />
            <source src="/softdrive-logo.webm" type="video/webm" />
          </video>
        </div>
      </motion.div>
    </section>
  );
}
