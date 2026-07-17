"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function HeroSection() {
  const [loaded, setLoaded] = useState<[boolean, boolean]>([false, false]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!loaded[0] || !loaded[1]) return;
    const id = setInterval(() => setActive((v) => (v === 0 ? 1 : 0)), 12000);
    return () => clearInterval(id);
  }, [loaded]);

  function markLoaded(i: 0 | 1) {
    setLoaded((prev) => {
      const next: [boolean, boolean] = [prev[0], prev[1]];
      next[i] = true;
      return next;
    });
  }

  return (
    <section
      id="home"
      className="relative flex items-center justify-center min-h-dvh overflow-hidden"
      style={{ background: "#000" }}
    >
      {/* Crossfading video backgrounds */}
      {(["/videos/video1.mp4", "/videos/video2.mp4"] as const).map((src, i) => (
        <motion.video
          key={src}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => markLoaded(i as 0 | 1)}
          className="absolute inset-0 w-full h-full object-cover"
          animate={{ opacity: loaded[i] && active === i ? 1 : 0 }}
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
