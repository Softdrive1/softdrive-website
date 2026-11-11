"use client";

import { useMemo, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";

/* Der Hintergrund der Seite: ein Sternenfeld in den Farben des Hero-Videos.
   Aus dem Vergleich mehrerer Abstimmungen im November 2026 ist diese hier
   übrig geblieben ("Glut"). */

// ssr: false gilt nur innerhalb von Client Components — diese Datei ist eine.
const Galaxy = dynamic(() => import("./backgrounds/Galaxy"), { ssr: false });

/* Die drei Farben des Hero-Videos, aber als abgestrahltes Licht statt als
   Fläche: Farbton und Sättigung bleiben, die Helligkeit geht hoch. Nötig,
   weil der Shader den Hexwert wörtlich als Sternfarbe nimmt — ein Stern kann
   nie heller werden als die Farbe, die man ihm gibt. */
const STARS = [
  "#7850f0", // gleicher Farbton wie #250285
  "#f04c72", // gleicher Farbton wie #910828
  "#cd4cf0", // gleicher Farbton wie #8606a8
];

/* Der Boden zwischen den Sternen. Der Shader rechnet zum Schluss
   mix(backgroundColor, sterne, opacity) — wo kein Stern ist, bleibt also
   backgroundColor * (1 - opacity) übrig. Bei opacity 1 fällt die Farbe ganz
   raus und das Nichts ist reines Schwarz; darum hier beides zusammen.
   0.87 × kräftiges Violett ergibt rund #0d0620 als Grundton. */
const FLOOR_COLOR = "#632ff5";
const FLOOR_OPACITY = 0.87;

// Abdunklung über dem Sternenfeld, damit Body-Text lesbar bleibt.
const SCRIM = 0.15;

/* Auflösung, in der das Sternenfeld gerechnet wird. Ohne diesen Deckel nimmt
   Galaxy die volle Gerätedichte: auf einem Retina-Display sind das über vier
   Millionen Pixel pro Bild für einen Shader, der jedes davon einzeln durch
   vier Sternebenen mit je neun Zellen schickt. Gemessen bei 1.5: 4,7 ms GPU
   je Bild, bei voller Dichte wären es rund 8,4 ms. 1.5 kostet 44 % weniger
   Pixel und sieht bei einem weichen Sternenfeld ohne harte Kanten gleich aus. */
function renderScale() {
  return Math.min(window.devicePixelRatio || 1, 1.5);
}

const subscribe = () => () => {};

export default function GalaxyBackground() {
  /* window gibt es auf dem Server nicht, und die Props werden schon beim
     Server-Render ausgewertet — auch wenn Galaxy selbst dank ssr:false dort
     nichts rendert. Darum erst lesen, wenn der Client übernommen hat. */
  const isClient = useSyncExternalStore(subscribe, () => true, () => false);
  const dpr = useMemo(() => (isClient ? renderScale() : undefined), [isClient]);

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
      aria-hidden="true"
    >
      <div style={{ position: "absolute", inset: 0 }}>
        <Galaxy
          /* transparent={false}: im transparenten Modus rechnet der Shader die
             Deckkraft aus der Helligkeit, und bei dieser Sterndichte wird
             daraus großflächig heller Nebel statt Sternenfeld. */
          transparent={false}
          starColors={STARS}
          backgroundColor={FLOOR_COLOR}
          opacity={FLOOR_OPACITY}
          glowIntensity={0.3}
          density={1}
          layers={4}
          flareIntensity={1}
          starSpeed={0.5}
          twinkleIntensity={0.6}
          mouseInteraction
          mouseRepulsion
          clickWarp
          dpr={dpr}
        />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `rgba(8, 8, 11, ${SCRIM})`,
        }}
      />
    </div>
  );
}
