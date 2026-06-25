"use client";

import dynamic from "next/dynamic";

const HardDriveScene = dynamic(() => import("./HardDriveScene"), {
  ssr: false,
  loading: () => <div style={{ width: "100%", height: "100%", background: "#c3bfb9" }} />,
});

export default function HardDriveSection() {
  return (
    <section
      style={{
        position: "relative",
        background: "#c3bfb9",
        height: "80vh",
      }}
    >
      <div style={{ position: "absolute", inset: 0 }}>
        <HardDriveScene />
      </div>
    </section>
  );
}
