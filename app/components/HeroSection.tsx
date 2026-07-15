"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function HeroSection() {
  const [loaded, setLoaded] = useState<[boolean, boolean]>([false, false]);
  const [active, setActive] = useState(0);

  // Start on the PNG (matches SSR), then upgrade to the spinning logo video on
  // the client. The two engines need different transparent-video formats and
  // each mis-renders the other's as a black box, so we pick per engine rather
  // than via <source> (Chrome-on-Mac can decode HEVC but drops its alpha).
  const [useVideoLogo, setUseVideoLogo] = useState(false);
  const [logoSrc, setLogoSrc] = useState("/softdrive-logo.webm");

  useEffect(() => {
    const ua = navigator.userAgent;
    const isIOS =
      /iP(hone|od|ad)/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    // Safari (desktop) UA contains "Safari" but not Chrome/Chromium/Firefox-on-iOS.
    const isSafari = /^((?!chrome|android|crios|fxios|chromium).)*safari/i.test(ua);
    // Defer the PNG→video upgrade to a callback so the initial client render
    // still matches the server (PNG), avoiding a hydration mismatch.
    const raf = requestAnimationFrame(() => {
      // WebKit (all iOS browsers + desktop Safari) renders HEVC-with-alpha but
      // not VP9-alpha WebM; every other engine is the reverse.
      if (isIOS || isSafari) setLogoSrc("/softdrive-logo.mp4");
      setUseVideoLogo(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

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

      {/* Hero logo — spinning chrome WebM where supported, PNG fallback elsewhere */}
      <motion.div
        className="relative z-20"
        initial={{ opacity: 0, scale: 1.06, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.1, ease: [0.22, 0.61, 0.36, 1], delay: 0.15 }}
      >
        <div style={{ width: "min(504px, 98vw)" }}>
          {useVideoLogo ? (
            <video
              src={logoSrc}
              poster="/logo.png"
              autoPlay
              loop
              muted
              playsInline
              onError={() => setUseVideoLogo(false)}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                background: "transparent",
              }}
            />
          ) : (
            <Image
              src="/logo.png"
              alt="Softdrive"
              width={840}
              height={473}
              priority
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          )}
        </div>
      </motion.div>
    </section>
  );
}
