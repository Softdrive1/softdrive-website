"use client";

import dynamic from "next/dynamic";

const Dither = dynamic(() => import("./Dither/Dither"), { ssr: false });

/* Site-wide dithered wave layer: fixed behind all sections, which stay
   transparent so it shows through. Mouse tracking happens on window level
   inside Dither, so pointer-events can stay off here. */
export default function DitherBackground() {
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
      aria-hidden="true"
    >
      <Dither
        waveColors={[
          [0.145, 0.008, 0.522], // #250285 tiefes Blauviolett (Hero-Video)
          [0.569, 0.031, 0.157], // #910828 tiefes Rot
          [0.525, 0.024, 0.659], // #8606a8 Purpur
        ]}
        colorCycleSeconds={8}
        disableAnimation={false}
        enableMouseInteraction
        mouseRadius={0.5}
        colorNum={4}
        pixelSize={2}
        waveAmplitude={0.35}
        waveFrequency={3}
        waveSpeed={0.07}
      />
      {/* Scrim: dims the wave so body text stays readable everywhere.
          Tune the alpha (0 = full-strength wave). */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(8, 8, 11, 0.4)",
        }}
      />
    </div>
  );
}
