"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

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

      {/* Rotating logo PNG */}
      <div className="relative z-20" style={{ perspective: "1000px" }}>
        <div className="logo-rotating" style={{ width: "min(420px, 82vw)" }}>
          <Image
            src="/logo.png"
            alt="Softdrive"
            width={840}
            height={473}
            priority
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 inset-x-0 z-20 flex flex-col items-center gap-2 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.65 }}
        transition={{ delay: 1.8, duration: 1.2 }}
      >
        <div
          className="w-px h-8"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.85))" }}
        />
        <span
          className="text-[10px] tracking-[0.3em] uppercase font-medium"
          style={{ color: "rgba(255,255,255,0.85)" }}
        >
          Scroll
        </span>
      </motion.div>
    </section>
  );
}
