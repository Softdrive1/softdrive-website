/* Keeps the Spotify + SoundCloud embeds from playing over each other:
   every player registers a pause() handle, and whoever starts playing
   claims playback, pausing all the others. */

type Player = { pause: () => void };

const players = new Set<Player>();

export function registerPlayer(player: Player): () => void {
  players.add(player);
  return () => players.delete(player);
}

export function claimPlayback(current: Player) {
  players.forEach((p) => {
    if (p !== current) p.pause();
  });
}

/* ── Embed-API script loaders (one shared load per API) ─────────── */

export interface SoundCloudSound {
  title?: string;
  duration?: number;
}

export interface SoundCloudWidget {
  bind(event: string, cb: (data?: unknown) => void): void;
  play(): void;
  pause(): void;
  prev(): void;
  next(): void;
  seekTo(ms: number): void;
  getPosition(cb: (ms: number) => void): void;
  getDuration(cb: (ms: number) => void): void;
  getCurrentSound(cb: (sound: SoundCloudSound | null) => void): void;
}

interface SoundCloudApi {
  Widget: {
    (el: HTMLIFrameElement): SoundCloudWidget;
    Events: {
      READY: string;
      PLAY: string;
      PAUSE: string;
      PLAY_PROGRESS: string;
      FINISH: string;
    };
  };
}

export interface SpotifyController {
  addListener(
    event: "playback_update",
    cb: (e: { data: { isPaused: boolean } }) => void
  ): void;
  pause(): void;
  destroy(): void;
}

interface SpotifyIframeApi {
  createController(
    el: HTMLElement,
    options: { uri: string; width?: string | number; height?: string | number },
    cb: (controller: SpotifyController) => void
  ): void;
}

declare global {
  interface Window {
    SC?: SoundCloudApi;
    onSpotifyIframeApiReady?: (api: SpotifyIframeApi) => void;
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`failed to load ${src}`));
    document.head.appendChild(script);
  });
}

let scApiPromise: Promise<SoundCloudApi> | null = null;

export function loadSoundCloudApi(): Promise<SoundCloudApi> {
  scApiPromise ??= loadScript("https://w.soundcloud.com/player/api.js").then(
    () => {
      if (!window.SC) throw new Error("SoundCloud widget API missing");
      return window.SC;
    }
  );
  return scApiPromise;
}

let spotifyApiPromise: Promise<SpotifyIframeApi> | null = null;

export function loadSpotifyApi(): Promise<SpotifyIframeApi> {
  // The script does not expose the API directly — it calls the
  // window.onSpotifyIframeApiReady hook once ready.
  spotifyApiPromise ??= new Promise<SpotifyIframeApi>((resolve, reject) => {
    window.onSpotifyIframeApiReady = (api) => resolve(api);
    loadScript("https://open.spotify.com/embed/iframe-api/v1").catch(reject);
  });
  return spotifyApiPromise;
}
