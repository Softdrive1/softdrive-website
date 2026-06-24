"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const VIDEOS = ["/videos/video1.mp4", "/videos/video2.mp4"];
const CROSSFADE_INTERVAL = 12000;

export default function VideoHero() {
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState<boolean[]>([false, false]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([null, null]);

  const anyLoaded = loaded.some(Boolean);
  const multipleLoaded = loaded.filter(Boolean).length > 1;

  useEffect(() => {
    if (!multipleLoaded) return;
    const id = setInterval(() => {
      setActive((prev) => {
        const loadedIndexes = VIDEOS.map((_, i) => i).filter((i) => loaded[i]);
        const pos = loadedIndexes.indexOf(prev);
        return loadedIndexes[(pos + 1) % loadedIndexes.length];
      });
    }, CROSSFADE_INTERVAL);
    return () => clearInterval(id);
  }, [multipleLoaded, loaded]);

  function markLoaded(i: number) {
    setLoaded((prev) => {
      const next = [...prev];
      next[i] = true;
      return next;
    });
    videoRefs.current[i]?.play().catch(() => {});
  }

  return (
    <section
      id="visuals"
      className="relative flex items-center justify-center min-h-dvh overflow-hidden"
      style={{ background: "#06060c" }}
    >
      {/* Video layers — always rendered so browser can load them */}
      {VIDEOS.map((src, i) => (
        <motion.video
          key={src}
          ref={(el) => { videoRefs.current[i] = el; }}
          src={src}
          muted
          loop
          playsInline
          autoPlay
          onLoadedData={() => markLoaded(i)}
          onError={() => {}}
          className="absolute inset-0 w-full h-full object-cover"
          animate={{ opacity: loaded[i] && active === i ? 1 : 0 }}
          transition={{ duration: 1.4 }}
          aria-hidden="true"
        />
      ))}

      {/* Gradient fallback — shown when no videos have loaded yet */}
      <AnimatePresence>
        {!anyLoaded && (
          <motion.div
            key="gradient"
            className="absolute inset-0"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            aria-hidden="true"
          >
            <div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(ellipse 80% 60% at 30% 40%, rgba(40,60,160,0.55) 0%, transparent 60%)",
                animation: "orb-pulse-a 8s ease-in-out infinite",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(ellipse 60% 80% at 70% 60%, rgba(80,40,160,0.45) 0%, transparent 60%)",
                animation: "orb-pulse-b 11s ease-in-out infinite",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(6,6,12,0.58)" }}
        aria-hidden="true"
      />

      {/* Scan lines */}
      <div className="absolute inset-0 scanlines opacity-35" aria-hidden="true" />

      {/* CRT vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.75) 100%)" }}
        aria-hidden="true"
      />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
      >
        <p
          className="text-xs tracking-[0.4em] uppercase mb-4"
          style={{ color: "var(--accent)", opacity: 0.7 }}
        >
          Oliver & Bennet
        </p>
        <h2
          className="font-picnic leading-none"
          style={{
            fontSize: "clamp(2.5rem, 8vw, 6rem)",
            color: "var(--text)",
            textShadow: "0 0 40px rgba(126,200,227,0.3), 0 2px 20px rgba(0,0,0,0.8)",
          }}
        >
          Underground sound,
          <br />
          raw energy.
        </h2>
        <p
          className="mt-6 text-base md:text-lg max-w-md mx-auto"
          style={{ color: "rgba(232,232,232,0.5)", lineHeight: 1.7 }}
        >
          Hamburg-based. Studio-forged.
          <br />
          Built for the late-night floor.
        </p>
      </motion.div>

      {/* Dot indicators */}
      {multipleLoaded && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {VIDEOS.map((_, i) =>
            loaded[i] ? (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="rounded-full transition-all duration-300 cursor-pointer"
                style={{
                  width: active === i ? "20px" : "6px",
                  height: "6px",
                  background: active === i ? "var(--accent)" : "rgba(126,200,227,0.3)",
                }}
                aria-label={`Show video ${i + 1}`}
              />
            ) : null
          )}
        </div>
      )}
    </section>
  );
}
