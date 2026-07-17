"use client";

import { useEffect } from "react";
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
  useEffect(() => {
    preloadSamples();
    installAudioUnlock();
  }, []);

  return (
    <section
      id="play"
      className="relative"
      style={{ paddingTop: "3rem", paddingBottom: "3rem" }}
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
