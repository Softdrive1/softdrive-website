"use client";

import ScrollVelocity from "./ScrollVelocity/ScrollVelocity";

export default function SoftdriveMarquee() {
  return (
    <section
      aria-hidden="true"
      style={{
        position: "relative",
        background: "rgba(255, 255, 255, 0.5)",
        padding: "0.75rem 0",
        overflow: "hidden",
      }}
    >
      <ScrollVelocity
        texts={["Softdrive"]}
        velocity={80}
        numCopies={20}
        className="softdrive-marquee-text"
        scrollerStyle={{ fontSize: "clamp(1.5rem, 2.8vw, 2.25rem)", lineHeight: 1 }}
      />
    </section>
  );
}
