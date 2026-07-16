"use client";

import { useEffect, useRef, useState } from "react";
import SectionHeading from "./SectionHeading";

/* "Catch the Drive" — plain 2D-canvas endless catch game, no libraries.
   The 12 falling drives use /game/drive.png when present, otherwise the
   💾 emoji. Missed drives just vanish — no lives, chill endless mode. */

const CHAR_H = 155; // sprite height on screen (source PNG is 249x747)
const CHAR_ASPECT = 249 / 747;
const HANDS_FRAC = 0.25; // top part of the sprite that catches
const CATCH_PAD = 12; // px of forgiveness around the hands hitbox
const DRIVE_SIZE = 42;
const BASE_FALL = 110; // px/s
const FALL_RAMP = 3.5; // px/s gained per second of play
const BASE_SPAWN = 1.15; // s between spawns
const MIN_SPAWN = 0.45;
const SPAWN_RAMP = 0.012; // s shaved off the spawn interval per second
const PULSE_RATE = 6; // 1/s catch-pulse decay

export default function GameSection() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resetRef = useRef<() => void>(() => {});
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !wrap || !ctx) return;

    setCoarse(window.matchMedia("(pointer: coarse)").matches);

    let charImg: HTMLImageElement | null = null;
    let driveImg: HTMLImageElement | null = null;
    let W = 0;
    let H = 0;
    let charX = 0;
    let pulse = 0;
    let drives: { x: number; y: number }[] = [];
    let elapsed = 0;
    let spawnIn = BASE_SPAWN;
    let playing = false;
    let inView = false;
    let raf = 0;
    let last: number | null = null;

    const charW = CHAR_H * CHAR_ASPECT;

    const char = new Image();
    char.src = "/game/character.png";
    char.onload = () => {
      charImg = char;
      draw();
    };
    const drv = new Image();
    drv.src = "/game/drive.png";
    drv.onload = () => {
      driveImg = drv;
    };

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
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
          ctx.font = `${DRIVE_SIZE - 6}px system-ui, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("💾", d.x, d.y);
        }
      }
      // Character anchored bottom-center; a catch pulses its scale briefly.
      if (charImg) {
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
      drives = drives.filter((d) => {
        d.y += fall * dt;
        const bottom = d.y + DRIVE_SIZE / 2;
        if (
          bottom >= handsTop &&
          bottom <= handsBottom &&
          Math.abs(d.x - charX) <= reachX
        ) {
          pulse = 1;
          setCount((c) => c + 1);
          return false;
        }
        return d.y - DRIVE_SIZE / 2 <= H;
      });
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
        setStarted(true);
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
      playing = false;
      setCount(0);
      setStarted(false);
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

        {/* Explicit CSS size before the canvas mounts (never the 300x150
            default) + svh so the mobile URL bar can't resize the canvas. */}
        <div
          ref={wrapRef}
          className="relative mx-auto"
          style={{
            width: "min(560px, 100%)",
            height: "clamp(340px, 62svh, 600px)",
            border: "1px solid var(--border)",
          }}
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
          <div
            className="font-display absolute top-3 left-0 right-0 text-center pointer-events-none select-none"
            style={{
              fontSize: "clamp(1.3rem, 4vw, 1.8rem)",
              color: "var(--text-muted)",
              letterSpacing: "0.04em",
            }}
          >
            DRIVES: {count}
          </div>
          {!started && (
            <div
              className="font-display absolute inset-0 flex items-center justify-center pointer-events-none select-none"
              style={{
                fontSize: "clamp(1.1rem, 3.5vw, 1.5rem)",
                letterSpacing: "0.08em",
              }}
            >
              {coarse ? "TAP TO START" : "CLICK TO START"}
            </div>
          )}
          <button
            type="button"
            aria-label="Reset game"
            onClick={() => resetRef.current()}
            className="absolute top-3 right-3"
            style={{
              fontSize: "20px",
              color: "var(--text-muted)",
              lineHeight: 1,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            ↺
          </button>
        </div>
      </div>
    </section>
  );
}
