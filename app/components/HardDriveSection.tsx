"use client";

import dynamic from "next/dynamic";

const HardDriveScene = dynamic(() => import("./HardDriveScene"), {
  ssr: false,
  loading: () => <div style={{ width: "100%", height: "100%", background: "var(--bg)" }} />,
});

const Dither = dynamic(() => import("./Dither/Dither"), { ssr: false });

export default function HardDriveSection() {
  return (
    <section
      style={{
        position: "relative",
        background: "var(--bg)",
        height: "80vh",
      }}
    >
      {/* Dithered wave background (React Bits) */}
      <div style={{ position: "absolute", inset: 0 }}>
        <Dither
          waveColor={[0.32, 0.15, 1]}
          disableAnimation={false}
          enableMouseInteraction
          mouseRadius={0.5}
          colorNum={4}
          pixelSize={2}
          waveAmplitude={0.35}
          waveFrequency={3}
          waveSpeed={0.07}
        />
      </div>
      {/* 3D model on top — pointer events off so the shader gets the mouse */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <HardDriveScene />
      </div>
    </section>
  );
}
