"use client";

import { useEffect, useRef } from "react";
import {
  claimPlayback,
  loadSoundCloudApi,
  registerPlayer,
  setPlaying,
} from "./playerBus";

function scSrc(url: string) {
  return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&visual=false`;
}

/* While the page is scrolling, the players ignore touches: a finger that
   lands on a waveform mid-scroll would otherwise scrub the track and pin
   the page. At rest they are untouched, so a tap goes straight into the
   player like before. Only CSS pointer-events — playback is never driven
   from here (starting it from outside made iOS stutter). One listener for
   all players. */
let scrollGuardInstalled = false;
function installScrollGuard() {
  if (scrollGuardInstalled) return;
  scrollGuardInstalled = true;
  const root = document.documentElement;
  let timer: number | undefined;
  window.addEventListener(
    "scroll",
    () => {
      if (!("scrolling" in root.dataset)) root.dataset.scrolling = "";
      window.clearTimeout(timer);
      timer = window.setTimeout(() => delete root.dataset.scrolling, 250);
    },
    { passive: true }
  );
}

/* SoundCloud iframe + widget-API hookup for the shared player bus.
   If the API script is blocked the embed still works standalone —
   it just isn't coordinated. */
export default function SoundCloudPlayer({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    installScrollGuard();
    let disposed = false;
    let unregister: (() => void) | undefined;
    loadSoundCloudApi()
      .then((SC) => {
        if (disposed || !iframeRef.current) return;
        const widget = SC.Widget(iframeRef.current);
        const me = { pause: () => widget.pause() };
        unregister = registerPlayer(me);
        widget.bind(SC.Widget.Events.PLAY, () => claimPlayback(me));
        widget.bind(SC.Widget.Events.PAUSE, () => setPlaying(me, false));
        widget.bind(SC.Widget.Events.FINISH, () => setPlaying(me, false));
      })
      .catch(() => {});
    return () => {
      disposed = true;
      unregister?.();
    };
  }, []);

  return (
    <>
      <iframe
        ref={iframeRef}
        className="sc-frame"
        width="100%"
        height="120"
        style={{ border: "none", display: "block" }}
        allow="autoplay"
        src={scSrc(url)}
        title={title}
      />
      <a
        className="sc-fallback font-label"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        ▶ Listen on SoundCloud
      </a>
    </>
  );
}
