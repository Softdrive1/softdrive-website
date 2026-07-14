"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import SectionHeading from "./SectionHeading";
import { preloadSamples } from "./synthAudio";

const SynthScene = dynamic(() => import("./SynthScene"), {
  ssr: false,
  loading: () => null,
});

export default function SynthSection() {
  const sectionRef = useRef<HTMLElement>(null);
  // load: mount the Canvas once the section approaches (never unmounts).
  // active: drives the frameloop — paused while offscreen.
  const [load, setLoad] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad(true);
          preloadSamples();
        }
        setActive(entry.isIntersecting);
      },
      { rootMargin: "400px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="play"
      className="relative"
      style={{ paddingTop: "6rem", paddingBottom: "6rem" }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--border), transparent)",
        }}
        aria-hidden="true"
      />

      <div
        className="px-6 md:px-8"
        style={{ maxWidth: "1000px", marginLeft: "auto", marginRight: "auto" }}
      >
        <SectionHeading sub="Tap the keys. That's our sound.">
          Play
        </SectionHeading>

        <div
          aria-label="Playable synthesizer"
          style={{ height: "clamp(340px, 55vh, 520px)" }}
        >
          {load && <SynthScene active={active} />}
        </div>
      </div>
    </section>
  );
}
