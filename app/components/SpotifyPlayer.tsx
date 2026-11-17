"use client";

import { useEffect, useRef, useState } from "react";
import {
  claimPlayback,
  loadSpotifyApi,
  registerPlayer,
  setPlaying,
  type SpotifyController,
} from "./playerBus";

/* Spotify embed via the official iFrame API so the shared player bus can
   pause it / get told when it starts. Renders the same player as the plain
   embed iframe; if the API script fails to load we fall back to that plain
   iframe (then without coordination). */
export default function SpotifyPlayer({
  trackId,
  title,
}: {
  trackId: string;
  title: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [apiFailed, setApiFailed] = useState(false);

  useEffect(() => {
    if (apiFailed) return;
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let controller: SpotifyController | undefined;
    let unregister: (() => void) | undefined;

    // createController swaps the passed element for the embed iframe, so
    // hand it a throwaway child instead of the React-managed host div.
    const mount = document.createElement("div");
    host.appendChild(mount);

    loadSpotifyApi()
      .then((api) => {
        if (disposed) return;
        api.createController(
          mount,
          { uri: `spotify:track:${trackId}`, width: "100%", height: 152 },
          (c) => {
            if (disposed) {
              c.destroy();
              return;
            }
            controller = c;
            const me = { pause: () => c.pause() };
            unregister = registerPlayer(me);
            // Spotify sends a status update right on the tap, but reports
            // "playing" only ~1 s later — claiming then let it play over the
            // previous track. So any update counts as "starting", except the
            // one confirming a pause the bus itself just sent.
            let busPausedAt = -Infinity;
            let claimed = false;
            let wasPlaying = false;
            me.pause = () => {
              busPausedAt = performance.now();
              claimed = false;
              wasPlaying = false;
              c.pause();
            };
            c.addListener("playback_update", (e) => {
              const { isPaused } = e.data;
              if (!isPaused) {
                if (!claimed) claimPlayback(me);
                claimed = true;
                wasPlaying = true;
                return;
              }
              if (wasPlaying) {
                // Paused by the visitor, or the preview ran out.
                wasPlaying = false;
                claimed = false;
                setPlaying(me, false);
                return;
              }
              if (performance.now() - busPausedAt < 1500) return;
              // Not playing yet and not our own pause: the tap that starts it.
              if (!claimed) claimPlayback(me);
              claimed = true;
            });
          }
        );
      })
      .catch(() => {
        if (!disposed) setApiFailed(true);
      });

    return () => {
      disposed = true;
      unregister?.();
      controller?.destroy();
      mount.remove();
    };
  }, [trackId, apiFailed]);

  if (apiFailed) {
    return (
      <iframe
        width="100%"
        height="152"
        style={{ borderRadius: "12px", border: "none", display: "block" }}
        src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator`}
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title={title}
      />
    );
  }

  return <div ref={hostRef} style={{ height: "152px" }} aria-label={title} />;
}
