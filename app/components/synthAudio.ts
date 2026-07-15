"use client";

/**
 * Web Audio manager for the playable synth section.
 * Keys map left-to-right to /sounds/key1.mp3 … key12.mp3. Files may be
 * missing while the sample set is incomplete — pressing an unmapped key
 * logs a warning instead of throwing. Once the files exist, everything
 * works without code changes.
 *
 * iOS: the AudioContext is created/resumed inside `playKey`, which must
 * only be called from a user-gesture handler.
 */

export const NUM_KEYS = 12;

let ctx: AudioContext | null = null;

function ensureCtx(): AudioContext | null {
  if (!ctx) {
    // iOS routes Web Audio through the "ambient" session by default, which
    // the hardware mute switch silences entirely. Declaring the session as
    // "playback" (iOS 17+) exempts it, like a music player.
    const nav = navigator as Navigator & { audioSession?: { type: string } };
    if (nav.audioSession) nav.audioSession.type = "playback";
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  // iOS also parks the context in a non-standard "interrupted" state
  // (phone call, Siri) — resume on anything that isn't running.
  if (ctx.state !== "running") void ctx.resume();
  return ctx;
}

let unlockInstalled = false;

/** iOS Safari counts touchend — not touchstart, which pointerdown maps to
 *  on touch devices — as the user gesture that may start audio, so the
 *  resume inside `playKey` never unlocks the context on iPhone. Unlock on
 *  the first touchend/pointerup instead (playing a silent buffer is what
 *  actually flips iOS into the running state) and keep retrying until the
 *  context runs. */
export function installAudioUnlock() {
  if (unlockInstalled || typeof window === "undefined") return;
  unlockInstalled = true;
  const cleanup = () => {
    window.removeEventListener("touchend", unlock);
    window.removeEventListener("pointerup", unlock);
  };
  const unlock = () => {
    const c = ensureCtx();
    if (!c) {
      cleanup();
      return;
    }
    const src = c.createBufferSource();
    src.buffer = c.createBuffer(1, 1, c.sampleRate);
    src.connect(c.destination);
    src.start();
    if (c.state === "running") cleanup();
  };
  window.addEventListener("touchend", unlock, { passive: true });
  window.addEventListener("pointerup", unlock, { passive: true });
}

// Peak-normalize playback so the sample set has a consistent level.
const TARGET_PEAK = 0.9;
const MAX_GAIN = 3;

type Sample = { buffer: AudioBuffer; gain: number };

const fetches = new Map<number, Promise<ArrayBuffer | null>>();
const decodes = new Map<number, Promise<Sample | null>>();

function peakOf(buffer: AudioBuffer): number {
  let peak = 0;
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const data = buffer.getChannelData(c);
    for (let i = 0; i < data.length; i++) {
      const v = Math.abs(data[i]);
      if (v > peak) peak = v;
    }
  }
  return peak;
}

// Monophonic: only one sample plays at a time.
const activeSources = new Set<AudioBufferSourceNode>();

function stopAll() {
  activeSources.forEach((src) => {
    try {
      src.stop();
    } catch {
      // already stopped/ended
    }
  });
  activeSources.clear();
}

function fetchSample(key: number): Promise<ArrayBuffer | null> {
  let p = fetches.get(key);
  if (!p) {
    p = fetch(`/sounds/key${key}.mp3`)
      .then((res) => (res.ok ? res.arrayBuffer() : null))
      .catch(() => null);
    fetches.set(key, p);
  }
  return p;
}

/** Kick off sample downloads when the section nears the viewport.
 *  Decoding waits until an AudioContext exists (first tap). */
export function preloadSamples() {
  if (typeof window === "undefined") return;
  for (let key = 1; key <= NUM_KEYS; key++) void fetchSample(key);
}

function ensureBuffer(key: number): Promise<Sample | null> {
  let p = decodes.get(key);
  if (!p) {
    p = fetchSample(key).then((raw) => {
      if (!raw || !ctx) return null;
      // slice() — decodeAudioData detaches the buffer it receives
      return ctx
        .decodeAudioData(raw.slice(0))
        .then((buffer) => {
          const peak = peakOf(buffer);
          const gain = peak > 0 ? Math.min(TARGET_PEAK / peak, MAX_GAIN) : 1;
          return { buffer, gain };
        })
        .catch(() => null);
    });
    decodes.set(key, p);
  }
  return p;
}

/** Play the sample for a key (1-based). Call from a pointer event only. */
export function playKey(key: number) {
  if (!ensureCtx()) return;

  void ensureBuffer(key).then((sample) => {
    if (!sample) {
      console.warn(`sample key${key}.mp3 not found`);
      return;
    }
    if (!ctx) return;
    stopAll();
    const src = ctx.createBufferSource();
    src.buffer = sample.buffer;
    const g = ctx.createGain();
    g.gain.value = sample.gain;
    src.connect(g);
    g.connect(ctx.destination);
    src.onended = () => activeSources.delete(src);
    activeSources.add(src);
    src.start();
  });
}
