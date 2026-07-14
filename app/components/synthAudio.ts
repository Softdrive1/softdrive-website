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

const fetches = new Map<number, Promise<ArrayBuffer | null>>();
const decodes = new Map<number, Promise<AudioBuffer | null>>();

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

function ensureBuffer(key: number): Promise<AudioBuffer | null> {
  let p = decodes.get(key);
  if (!p) {
    p = fetchSample(key).then((raw) => {
      if (!raw || !ctx) return null;
      // slice() — decodeAudioData detaches the buffer it receives
      return ctx.decodeAudioData(raw.slice(0)).catch(() => null);
    });
    decodes.set(key, p);
  }
  return p;
}

/** Play the sample for a key (1-based). Call from a pointer event only. */
export function playKey(key: number) {
  if (!ctx) {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();

  void ensureBuffer(key).then((buffer) => {
    if (!buffer) {
      console.warn(`sample key${key}.mp3 not found`);
      return;
    }
    if (!ctx) return;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(ctx.destination);
    src.start();
  });
}
