"use client";

import dynamic from "next/dynamic";

const HardDriveScene = dynamic(() => import("./HardDriveScene"), {
  ssr: false,
  loading: () => <div style={{ width: "100%", height: "100%" }} />,
});

export default function HardDriveSection() {
  return (
    <section
      style={{
        position: "relative",
        height: "80vh",
      }}
    >
      {/* 3D model over the site-wide dither background */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <HardDriveScene />
      </div>
    </section>
  );
}
