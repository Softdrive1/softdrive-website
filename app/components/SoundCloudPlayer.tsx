"use client";

import { useEffect, useRef } from "react";
import { claimPlayback, loadSoundCloudApi, registerPlayer } from "./playerBus";

function scSrc(url: string) {
  return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&visual=false`;
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
    let disposed = false;
    let unregister: (() => void) | undefined;
    loadSoundCloudApi()
      .then((SC) => {
        if (disposed || !iframeRef.current) return;
        const widget = SC.Widget(iframeRef.current);
        const me = { pause: () => widget.pause() };
        unregister = registerPlayer(me);
        widget.bind(SC.Widget.Events.PLAY, () => claimPlayback(me));
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
