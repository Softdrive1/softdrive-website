"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import type { DragControl } from "./HardDriveScene";

const HardDriveScene = dynamic(() => import("./HardDriveScene"), {
  ssr: false,
  loading: () => <div style={{ width: "100%", height: "100%" }} />,
});

export default function HardDriveSection() {
  // Shared with the scene: DOM pointer handlers write drag intent here, the
  // r3f frame loop reads it. Kept in the DOM layer so the scene never touches
  // the canvas element directly.
  const controlRef = useRef<DragControl>({
    dragging: false,
    pendingY: 0,
    manualX: 0,
  });
  const posRef = useRef({ x: 0, y: 0 });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    controlRef.current.dragging = true;
    posRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.style.cursor = "grabbing";
    // Mouse/pen: capture so a drag continues outside the canvas. Skip for touch
    // so touch-action: pan-y can still scroll the page on a vertical swipe.
    if (e.pointerType !== "touch") {
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!controlRef.current.dragging) return;
    const dx = e.clientX - posRef.current.x;
    const dy = e.clientY - posRef.current.y;
    posRef.current = { x: e.clientX, y: e.clientY };
    controlRef.current.pendingY += dx * 0.006;
    controlRef.current.manualX = Math.min(
      Math.max(controlRef.current.manualX + dy * 0.005, -0.7),
      0.7
    );
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!controlRef.current.dragging) return;
    controlRef.current.dragging = false;
    e.currentTarget.style.cursor = "grab";
  };

  return (
    <section style={{ position: "relative", height: "80vh" }}>
      {/* 3D model over the site-wide dither background. Drag to rotate; the
          div's touch-action: pan-y lets vertical swipes still scroll the page
          on mobile, so only horizontal drags spin the model there. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "auto",
          cursor: "grab",
          touchAction: "pan-y",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
      >
        <HardDriveScene controlRef={controlRef} />
      </div>
    </section>
  );
}
