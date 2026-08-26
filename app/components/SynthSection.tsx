"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import SectionHeading from "./SectionHeading";
import { installAudioUnlock, preloadSamples } from "./synthAudio";

// Always mounted, exactly like HardDriveSection — no lazy-load or
// IntersectionObserver pause. That "protection" caused the stripe/flicker
// bugs (canvas mounting into an unmeasured container, janky visibility
// events during momentum scrolling) and the model is small enough not to
// need it.
const SynthScene = dynamic(() => import("./SynthScene"), {
  ssr: false,
  loading: () => null,
});

export default function SynthSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    installAudioUnlock();
    // Defer the ~3 MB of synth samples until the section nears the viewport,
    // rather than fetching them on initial page load. The canvas/GLB is left
    // mounted on load on purpose (see the note above).
    const el = sectionRef.current;
    if (!el) return;
    let done = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !done) {
          done = true;
          preloadSamples();
          io.disconnect();
        }
      },
      { rootMargin: "400px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="play"
      className="relative"
      style={{ paddingTop: "3rem", paddingBottom: "3rem" }}
    >

      <div
        className="px-6 md:px-8"
        style={{ maxWidth: "1000px", marginLeft: "auto", marginRight: "auto" }}
      >
        <SectionHeading>Play the synth</SectionHeading>

        <div
          aria-label="Playable synthesizer"
          // Fixed height, independent of canvas content, so the canvas never
          // measures at the 300x150 default. svh (not vh): stable while the
          // mobile URL bar shows/hides, so scrolling never resizes the canvas.
          // Mobile gets a much shorter frame: the synth is a flat keyboard
          // that fills the WIDTH, so extra height is just empty space.
          className="h-[clamp(220px,32svh,300px)] md:h-[clamp(340px,55svh,520px)]"
        >
          <SynthScene />
        </div>
      </div>
    </section>
  );
}
