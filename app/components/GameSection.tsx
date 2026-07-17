"use client";

import { useEffect, useRef, useState } from "react";
// aliased: plain `Image` must stay the DOM constructor for the game sprites
import NextImage from "next/image";
import SectionHeading from "./SectionHeading";
import ArcadeCabinet, {
  ASPECT,
  MARQUEE_RECT,
  SCREEN_RECT,
} from "./ArcadeCabinet";

/* "Catch the Drive" — plain 2D-canvas catch game, no libraries.
   Falling drives use /game/drive.png when present, otherwise the 💾
   emoji. One missed drive ends the run; a single highscore (name +
   score) persists in localStorage. */

const CHAR_H = 155; // sprite height on screen (source PNG is 249x747)
const CHAR_ASPECT = 249 / 747;
// Defeated sprite (237x603, arms crossed) drawn at the same source-pixel
// scale and bottom-anchored — the arms drop, the body doesn't shrink.
const LOST_H = CHAR_H * (603 / 747);
const LOST_ASPECT = 237 / 603;
const LOST_SHAKE_MS = 450; // brief shake on the swap, then it stays still
const HANDS_FRAC = 0.25; // top part of the sprite that catches
const CATCH_PAD = 12; // px of forgiveness around the hands hitbox
const DRIVE_SIZE = 42;
const BASE_FALL = 110; // px/s
const FALL_RAMP = 3.5; // px/s gained per second of play
const BASE_SPAWN = 1.15; // s between spawns
const MIN_SPAWN = 0.45;
const SPAWN_RAMP = 0.012; // s shaved off the spawn interval per second
const PULSE_RATE = 6; // 1/s catch-pulse decay

const HS_KEY = "softdrive_catchthedrive_highscore";

type Highscore = { name: string; score: number };

function loadHighscore(): Highscore | null {
  try {
    const raw = localStorage.getItem(HS_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as Partial<Highscore> | null;
    if (typeof v?.name === "string" && typeof v?.score === "number") {
      return { name: v.name, score: v.score };
    }
  } catch {
    // corrupt storage → treat as no highscore
  }
  return null;
}

export default function GameSection() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resetRef = useRef<() => void>(() => {});
  const highRef = useRef<Highscore | null>(null);
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [coarse, setCoarse] = useState(false);
  const [high, setHigh] = useState<Highscore | null>(null);
  const [pendingHigh, setPendingHigh] = useState(false);
  const [nameInput, setNameInput] = useState("");
  // Wide screens get the 3D arcade cabinet around the playfield. Below the
  // breakpoint the cabinet would shrink the playfield to unplayable, so
  // narrow screens keep the plain framing (and never fetch the 4.5MB GLB).
  const [arcade, setArcade] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const apply = () => setArcade(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    highRef.current = high;
  }, [high]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !wrap || !ctx) return;

    setCoarse(window.matchMedia("(pointer: coarse)").matches);
    setHigh(loadHighscore());

    let bgImg: HTMLImageElement | null = null;
    let charImg: HTMLImageElement | null = null;
    let lostImg: HTMLImageElement | null = null;
    let driveImg: HTMLImageElement | null = null;
    let lost = false;
    let lostAnim = 1; // shake progress 0→1; 1 = settled
    let W = 0;
    let H = 0;
    let charX = 0;
    let pulse = 0;
    let drives: { x: number; y: number }[] = [];
    let elapsed = 0;
    let spawnIn = BASE_SPAWN;
    let score = 0;
    let playing = false;
    let inView = false;
    let raf = 0;
    let last: number | null = null;

    const charW = CHAR_H * CHAR_ASPECT;

    const bg = new Image();
    bg.src = "/game/game-bg.png";
    bg.onload = () => {
      bgImg = bg;
      draw();
    };
    const char = new Image();
    char.src = "/game/character.png";
    char.onload = () => {
      charImg = char;
      draw();
    };
    const lostChar = new Image();
    lostChar.src = "/game/character-lost.png";
    lostChar.onload = () => {
      lostImg = lostChar;
    };
    const drv = new Image();
    drv.src = "/game/drive.png";
    drv.onload = () => {
      driveImg = drv;
    };

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      // Background, cover-fit (fill, crop overflow, never distort), then a
      // darkening wash so drives and character stay readable in front.
      if (bgImg) {
        const s = Math.max(W / bgImg.width, H / bgImg.height);
        const bw = bgImg.width * s;
        const bh = bgImg.height * s;
        ctx.drawImage(bgImg, (W - bw) / 2, (H - bh) / 2, bw, bh);
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.fillRect(0, 0, W, H);
      }
      for (const d of drives) {
        if (driveImg) {
          ctx.drawImage(
            driveImg,
            d.x - DRIVE_SIZE / 2,
            d.y - DRIVE_SIZE / 2,
            DRIVE_SIZE,
            DRIVE_SIZE
          );
        } else {
          // Full alpha — color-emoji glyphs multiply with the fillStyle
          // alpha, and it still holds the 0.3 from the darkening wash.
          ctx.fillStyle = "#fff";
          ctx.font = `${DRIVE_SIZE - 6}px system-ui, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("💾", d.x, d.y);
        }
      }
      // Character anchored bottom-center; a catch pulses its scale briefly.
      // On game over the defeated sprite takes its place (same bottom edge),
      // with a decaying horizontal shake while it settles.
      if (lost && lostImg) {
        const lostW = LOST_H * LOST_ASPECT;
        const dx = Math.sin(lostAnim * Math.PI * 5) * 6 * (1 - lostAnim);
        ctx.drawImage(lostImg, charX - lostW / 2 + dx, H - LOST_H, lostW, LOST_H);
      } else if (charImg) {
        const s = 1 + 0.15 * pulse;
        ctx.save();
        ctx.translate(charX, H);
        ctx.scale(s, s);
        ctx.drawImage(charImg, -charW / 2, -CHAR_H, charW, CHAR_H);
        ctx.restore();
      }
    }

    // Internal resolution follows the displayed size at devicePixelRatio
    // (capped at 2) so nothing renders blurry or distorted.
    function resize() {
      if (!canvas || !wrap || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = wrap.clientWidth;
      H = wrap.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      charX = Math.min(Math.max(charX || W / 2, charW / 2), W - charW / 2);
      draw();
    }

    function endGame() {
      if (!playing) return;
      playing = false;
      lost = true;
      lostAnim = 0;
      sync();
      setPhase("over");
      setPendingHigh(score > (highRef.current?.score ?? 0));
      // The main loop is stopped now — run the short settle animation on
      // its own rAF, then leave the sprite defeated until reset.
      const start = performance.now();
      const settle = (t: number) => {
        if (!lost) return;
        lostAnim = Math.min(1, (t - start) / LOST_SHAKE_MS);
        draw();
        if (lostAnim < 1) requestAnimationFrame(settle);
      };
      requestAnimationFrame(settle);
    }

    function step(dt: number) {
      elapsed += dt;
      pulse = pulse < 0.01 ? 0 : pulse * Math.exp(-PULSE_RATE * dt);

      spawnIn -= dt;
      if (spawnIn <= 0) {
        spawnIn = Math.max(MIN_SPAWN, BASE_SPAWN - SPAWN_RAMP * elapsed);
        drives.push({
          x: DRIVE_SIZE / 2 + Math.random() * (W - DRIVE_SIZE),
          y: -DRIVE_SIZE / 2,
        });
      }

      const fall = BASE_FALL + FALL_RAMP * elapsed;
      const handsTop = H - CHAR_H - CATCH_PAD;
      const handsBottom = H - CHAR_H + CHAR_H * HANDS_FRAC;
      const reachX = charW / 2 + CATCH_PAD;
      let missed = false;
      drives = drives.filter((d) => {
        d.y += fall * dt;
        const bottom = d.y + DRIVE_SIZE / 2;
        if (
          bottom >= handsTop &&
          bottom <= handsBottom &&
          Math.abs(d.x - charX) <= reachX
        ) {
          pulse = 1;
          score += 1;
          setCount(score);
          return false;
        }
        if (d.y - DRIVE_SIZE / 2 > H) {
          missed = true;
          return false;
        }
        return true;
      });
      if (missed) endGame();
    }

    const active = () => playing && inView && !document.hidden;

    function tick(t: number) {
      if (!active()) {
        raf = 0;
        return;
      }
      const dt = last === null ? 0 : Math.min((t - last) / 1000, 0.05);
      last = t;
      step(dt);
      draw();
      raf = requestAnimationFrame(tick);
    }

    // Start/stop the rAF loop when playing, visibility, or viewport change.
    function sync() {
      if (active() && raf === 0) {
        last = null;
        raf = requestAnimationFrame(tick);
      } else if (!active() && raf !== 0) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    }

    const onVis = () => sync();
    document.addEventListener("visibilitychange", onVis);
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { rootMargin: "250px" }
    );
    io.observe(wrap);

    const ro = new ResizeObserver(() => resize());
    ro.observe(wrap);
    resize();

    // Direct 1:1 pointer control, mouse and touch alike (touch-action:
    // none on the canvas keeps the page from scrolling mid-game).
    const moveTo = (clientX: number) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      charX = Math.min(
        Math.max(clientX - rect.left, charW / 2),
        W - charW / 2
      );
      if (!active()) draw();
    };
    const onPointerMove = (e: PointerEvent) => moveTo(e.clientX);
    const onPointerDown = (e: PointerEvent) => {
      moveTo(e.clientX);
      if (!playing) {
        playing = true;
        setPhase("playing");
        sync();
      }
    };
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerdown", onPointerDown);

    resetRef.current = () => {
      drives = [];
      elapsed = 0;
      spawnIn = BASE_SPAWN;
      pulse = 0;
      score = 0;
      playing = false;
      lost = false;
      lostAnim = 1;
      setCount(0);
      setPendingHigh(false);
      setNameInput("");
      setPhase("idle");
      sync();
      draw();
    };

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerdown", onPointerDown);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  function saveHighscore() {
    const entry: Highscore = {
      name: nameInput.trim().slice(0, 12) || "???",
      score: count,
    };
    setHigh(entry);
    setPendingHigh(false);
    try {
      localStorage.setItem(HS_KEY, JSON.stringify(entry));
    } catch {
      // storage unavailable (private mode) — highscore stays for the session
    }
  }

  const highText = high ? `${high.score} — ${high.name}` : "—";

  const resetButton = (
    <button
      type="button"
      aria-label="Reset game"
      onClick={() => resetRef.current()}
      style={{
        fontSize: "20px",
        color: "var(--text-muted)",
        lineHeight: 1,
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
      }}
    >
      ↺
    </button>
  );

  return (
    <section
      id="game"
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
        <SectionHeading>Catch the Drive</SectionHeading>

        <div className="flex flex-col items-center gap-3">
          {/* Counter centered above the playfield */}
          <div
            className="font-display text-center"
            style={{
              fontSize: "clamp(1.3rem, 4vw, 1.8rem)",
              color: "var(--text-muted)",
              letterSpacing: "0.04em",
            }}
          >
            DRIVES: {count}
          </div>

          {/* Explicit CSS size before the canvas mounts (never the 300x150
              default) + svh so the mobile URL bar can't resize the canvas.
              In arcade mode the outer div is sized by aspect-ratio (which
              SCREEN_RECT's math depends on) and the game wrap sits on the
              cabinet's screen. The wrap/canvas nodes must stay the same
              elements across the mode switch — the game effect binds its
              listeners and observers only once. */}
          <div
            className="relative"
            style={
              arcade
                ? { width: "min(900px, 100%)", aspectRatio: String(ASPECT) }
                : {
                    width: "min(560px, 100%)",
                    height: "clamp(340px, 62svh, 600px)",
                  }
            }
          >
            {arcade && (
              <>
                <div className="absolute" style={{ inset: 0 }}>
                  <ArcadeCabinet />
                </div>
                {/* SOFTDRIVE logo on the marquee panel */}
                <div
                  className="absolute"
                  style={{ ...MARQUEE_RECT, pointerEvents: "none" }}
                  aria-hidden="true"
                >
                  <NextImage
                    src="/logo.png"
                    alt=""
                    fill
                    sizes="650px"
                    style={{ objectFit: "contain" }}
                  />
                </div>
              </>
            )}
            <div
              ref={wrapRef}
              className="absolute"
              style={
                arcade
                  ? { ...SCREEN_RECT, background: "#000" }
                  : {
                      inset: 0,
                      // Thin frame in the palette purple — same tone as the
                      // Unreleased card border, deliberately understated.
                      border: "1px solid rgba(134, 6, 168, 0.35)",
                    }
              }
            >
            <canvas
              ref={canvasRef}
              aria-label="Catch the Drive minigame"
              style={{
                width: "100%",
                height: "100%",
                display: "block",
                touchAction: "none",
              }}
            />
            {phase === "idle" && (
              <div
                className="font-display absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                style={{
                  fontSize: "clamp(1.1rem, 3.5vw, 1.5rem)",
                  letterSpacing: "0.08em",
                  textShadow: "0 2px 12px rgba(0,0,0,0.8)",
                }}
              >
                {coarse ? "TAP TO START" : "CLICK TO START"}
              </div>
            )}
            {phase === "over" && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center select-none"
                style={{ background: "rgba(0, 0, 0, 0.55)" }}
              >
                <div
                  className="font-display"
                  style={{
                    fontSize: "clamp(1.5rem, 5vw, 2.2rem)",
                    letterSpacing: "0.06em",
                  }}
                >
                  GAME OVER
                </div>
                <div
                  className="font-display"
                  style={{ fontSize: "1.1rem", color: "var(--text-muted)" }}
                >
                  DRIVES: {count}
                </div>
                {pendingHigh && (
                  <>
                    <div
                      className="font-display"
                      style={{ fontSize: "0.95rem", letterSpacing: "0.08em" }}
                    >
                      NEW HIGHSCORE!
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        value={nameInput}
                        onChange={(e) =>
                          setNameInput(e.target.value.slice(0, 12))
                        }
                        maxLength={12}
                        placeholder="NAME"
                        aria-label="Highscore name"
                        style={{
                          width: "9rem",
                          padding: "6px 10px",
                          background: "rgba(0, 0, 0, 0.5)",
                          border: "1px solid var(--border-hover)",
                          color: "inherit",
                          fontSize: "0.95rem",
                        }}
                      />
                      <button
                        type="button"
                        onClick={saveHighscore}
                        className="font-display"
                        style={{
                          padding: "6px 14px",
                          border: "1px solid var(--border-hover)",
                          background: "rgba(0, 0, 0, 0.4)",
                          cursor: "pointer",
                          letterSpacing: "0.06em",
                        }}
                      >
                        SAVE
                      </button>
                    </div>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => resetRef.current()}
                  className="font-display"
                  style={{
                    marginTop: "4px",
                    padding: "8px 18px",
                    border: "1px solid var(--border-hover)",
                    background: "rgba(0, 0, 0, 0.4)",
                    cursor: "pointer",
                    letterSpacing: "0.06em",
                  }}
                >
                  PLAY AGAIN
                </button>
              </div>
            )}
            </div>
          </div>

          {/* Highscore centered below the playfield */}
          <div
            className="flex items-center justify-center gap-3"
            style={{
              fontFamily: "var(--font-space), sans-serif",
              fontSize: "0.95rem",
              color: "var(--text-muted)",
              letterSpacing: "0.05em",
            }}
          >
            HIGHSCORE: {highText}
            {resetButton}
          </div>
        </div>
      </div>
    </section>
  );
}
