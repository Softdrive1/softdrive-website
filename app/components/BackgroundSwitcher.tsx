"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";

/* Vergleichs-Aufbau für den Hintergrund. Galaxy hat gewonnen; hier stehen
   jetzt vier Abstimmungen davon nebeneinander, dazu der aktuell live
   laufende Dither-Hintergrund als Referenz.

   Auswahl: ?bg=<id> in der URL, sonst zuletzt gewählte Variante aus
   localStorage, sonst DEFAULT_VARIANT. Die Umschaltleiste erscheint nur im
   Dev-Server oder wenn ?bg= in der URL steht — live läuft seit 11.11.2026
   Glut, die anderen bleiben zum Vergleichen erreichbar.
   Die nicht gewählten Varianten kosten nichts: dynamic(import) holt den
   Chunk erst, wenn die Variante wirklich gerendert wird. */

// ssr: false gilt nur innerhalb von Client Components — diese Datei ist eine.
const Dither = dynamic(() => import("./Dither/Dither"), { ssr: false });
const Galaxy = dynamic(() => import("./backgrounds/Galaxy"), { ssr: false });

const DEFAULT_VARIANT = "glut";

type VariantId = "jetzt" | "nebel" | "glut" | "tiefe" | "dither";

type Variant = {
  id: VariantId;
  label: string;
  hint: string;
  /* Abdunklung über dem Hintergrund, damit Body-Text lesbar bleibt.
     Bei allen Galaxy-Varianten gleich, sonst vergleicht man den Scrim
     statt den Hintergrund. */
  scrim: number;
  /* dpr kommt von außen, weil window auf dem Server nicht existiert und
     die Props hier schon beim Server-Render ausgewertet werden — auch
     wenn Galaxy selbst dank ssr:false dort nichts rendert. */
  render: (dpr: number | undefined) => React.ReactNode;
};

// Hero-Video-Farben, wie schon beim Dither-Hintergrund.
const VIOLET = "#250285";
const RED = "#910828";
const PURPLE = "#8606a8";

/* Dieselben drei Farbtöne, aber als abgestrahltes Licht statt als Fläche:
   Farbton und Sättigung bleiben, die Helligkeit geht hoch. Nötig, weil der
   Shader den Hexwert wörtlich als Sternfarbe nimmt — ein Stern kann nie
   heller werden als die Farbe, die man ihm gibt. */
const VIOLET_LIT = "#7850f0"; // gleicher Farbton wie #250285
const RED_LIT = "#f04c72"; // gleicher Farbton wie #910828
const PURPLE_LIT = "#cd4cf0"; // gleicher Farbton wie #8606a8

/* Der Boden zwischen den Sternen. Der Shader rechnet zum Schluss
   mix(backgroundColor, sterne, opacity) — wo kein Stern ist, bleibt also
   backgroundColor * (1 - opacity) übrig. Bei opacity 1 fällt die Farbe ganz
   raus und das Nichts ist reines Schwarz; darum hier beides zusammen.
   0.87 × kräftiges Violett ergibt rund #0d0620 als Grundton. */
const FLOOR_COLOR = "#632ff5";
const FLOOR_OPACITY = 0.87;

type Tuning = {
  starColors: string[];
  backgroundColor: string;
  opacity: number;
  glowIntensity: number;
  density: number;
  layers: number;
};

const galaxy = (tuning: Tuning, dpr: number | undefined) => (
  /* transparent={false}: im transparenten Modus rechnet der Shader die
     Deckkraft aus der Helligkeit, und bei dieser Sterndichte wird daraus
     großflächig heller Nebel statt Sternenfeld. */
  <Galaxy
    transparent={false}
    flareIntensity={1}
    starSpeed={0.5}
    mouseInteraction
    mouseRepulsion
    clickWarp
    twinkleIntensity={0.6}
    dpr={dpr}
    {...tuning}
  />
);

const GALAXY_SCRIM = 0.15;

const VARIANTS: Variant[] = [
  {
    id: "jetzt",
    label: "Jetzt",
    hint: "unverändert — der Stand, den du gesehen hast",
    scrim: GALAXY_SCRIM,
    render: (dpr) =>
      galaxy({
        starColors: [VIOLET, RED, PURPLE],
        backgroundColor: "#08080b",
        opacity: 1,
        glowIntensity: 0.3,
        density: 1,
        layers: 4,
      }, dpr),
  },
  {
    id: "nebel",
    label: "Nebel",
    hint: "gleiche Sterne, aber das Nichts dazwischen ist violett statt schwarz",
    scrim: GALAXY_SCRIM,
    render: (dpr) =>
      galaxy({
        starColors: [VIOLET, RED, PURPLE],
        backgroundColor: FLOOR_COLOR,
        opacity: FLOOR_OPACITY,
        glowIntensity: 0.3,
        density: 1,
        layers: 4,
      }, dpr),
  },
  {
    id: "glut",
    label: "Glut",
    hint: "live · violetter Boden + Sterne leuchten in denselben Farbtönen",
    scrim: GALAXY_SCRIM,
    render: (dpr) =>
      galaxy({
        starColors: [VIOLET_LIT, RED_LIT, PURPLE_LIT],
        backgroundColor: FLOOR_COLOR,
        opacity: FLOOR_OPACITY,
        glowIntensity: 0.3,
        density: 1,
        layers: 4,
      }, dpr),
  },
  {
    id: "tiefe",
    label: "Tiefe",
    hint: "wie Glut, dazu etwas mehr Sterne und eine Ebene mehr",
    scrim: GALAXY_SCRIM,
    render: (dpr) =>
      galaxy({
        starColors: [VIOLET_LIT, RED_LIT, PURPLE_LIT],
        backgroundColor: FLOOR_COLOR,
        opacity: FLOOR_OPACITY,
        glowIntensity: 0.35,
        density: 1.15,
        layers: 5,
      }, dpr),
  },
  {
    id: "dither",
    label: "Dither",
    hint: "alter Hintergrund · dunkle Delle folgt dem Cursor",
    scrim: 0.4,
    render: () => (
      <Dither
        waveColors={[
          [0.145, 0.008, 0.522], // #250285
          [0.569, 0.031, 0.157], // #910828
          [0.525, 0.024, 0.659], // #8606a8
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
    ),
  },
];

const isVariantId = (value: string | null): value is VariantId =>
  VARIANTS.some((v) => v.id === value);

const STORAGE_KEY = "softdrive-bg";

function readEnvironment() {
  const fromUrl = new URLSearchParams(window.location.search).get("bg");
  let stored: string | null = null;
  try {
    stored = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // Private-Mode / blockierte Site-Daten: Default genügt.
  }
  const picker = process.env.NODE_ENV === "development" || fromUrl !== null;
  return {
    /* Der gespeicherte Wert gilt nur dort, wo auch die Umschaltleiste ist.
       Sonst würde ein Besucher, der irgendwann einmal ?bg=dither geöffnet
       hat, für immer den alten Hintergrund sehen. */
    initial: isVariantId(fromUrl)
      ? fromUrl
      : picker && isVariantId(stored)
        ? stored
        : DEFAULT_VARIANT,
    picker,
    dpr: renderScale(),
  };
}

/* Auflösung, in der das Sternenfeld gerechnet wird. Ohne diesen Deckel nimmt
   Galaxy die volle Gerätedichte: auf einem Retina-Display sind das über vier
   Millionen Pixel pro Bild für einen Shader, der jedes davon einzeln durch
   mehrere Sternebenen schickt — gemessen 29 fps, auf Telefonen entsprechend
   weniger. 1.5 statt 2 kostet 44 % der Pixel und sieht bei einem weichen
   Sternenfeld ohne harte Kanten gleich aus. */
function renderScale() {
  const device = window.devicePixelRatio || 1;
  return Math.min(device, 1.5);
}

const subscribe = () => () => {};

export default function BackgroundSwitcher() {
  // URL und localStorage gibt es auf dem Server nicht. Gleiche Lösung wie in
  // DatesSection: Der Server-Snapshot ist false, gelesen wird erst, wenn der
  // Client übernimmt — so bleibt der erste Render auf beiden Seiten gleich.
  const isClient = useSyncExternalStore(subscribe, () => true, () => false);
  const environment = useMemo(() => (isClient ? readEnvironment() : null), [isClient]);

  const [chosen, setChosen] = useState<VariantId | null>(null);
  const variantId = chosen ?? environment?.initial ?? DEFAULT_VARIANT;
  const pickerVisible = environment?.picker ?? false;

  const choose = useCallback((id: VariantId) => {
    setChosen(id);
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // Nicht schlimm — die Wahl gilt dann nur für diese Sitzung.
    }
  }, []);

  // Tasten 1–5, damit man beim Vergleichen nicht zur Leiste muss.
  useEffect(() => {
    if (!pickerVisible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      const index = Number(e.key) - 1;
      if (index >= 0 && index < VARIANTS.length) choose(VARIANTS[index].id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pickerVisible, choose]);

  const variant =
    VARIANTS.find((v) => v.id === variantId) ??
    VARIANTS.find((v) => v.id === DEFAULT_VARIANT)!;

  return (
    <>
      <div
        style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
        aria-hidden="true"
      >
        {/* key: beim Wechsel wird der alte WebGL-Kontext wirklich abgebaut,
            statt dass React die Instanz weiterverwendet. */}
        <div key={variant.id} style={{ position: "absolute", inset: 0 }}>
          {variant.render(environment?.dpr)}
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `rgba(8, 8, 11, ${variant.scrim})`,
          }}
        />
      </div>

      {pickerVisible && (
        <div
          style={{
            // rechts, weil der Dev-Indikator von Next unten links sitzt
            position: "fixed",
            right: "16px",
            bottom: "16px",
            zIndex: 50,
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            padding: "12px 14px",
            maxWidth: "min(320px, calc(100vw - 32px))",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            background: "rgba(8, 8, 11, 0.82)",
            backdropFilter: "blur(10px)",
            color: "#f4f4f4",
            fontSize: "12px",
            lineHeight: 1.4,
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {VARIANTS.map((v, i) => {
              const active = v.id === variant.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => choose(v.id)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: `1px solid ${active ? "#f4f4f4" : "rgba(255, 255, 255, 0.2)"}`,
                    background: active ? "#f4f4f4" : "transparent",
                    color: active ? "#08080b" : "#f4f4f4",
                    fontWeight: active ? 700 : 500,
                    cursor: "pointer",
                  }}
                >
                  {i + 1} {v.label}
                </button>
              );
            })}
          </div>
          <span style={{ color: "rgba(244, 244, 244, 0.6)" }}>{variant.hint}</span>
        </div>
      )}
    </>
  );
}
