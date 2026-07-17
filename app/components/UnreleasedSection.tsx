"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaPlay, FaPause, FaBackward, FaForward } from "react-icons/fa";
import SectionHeading from "./SectionHeading";
import {
  claimPlayback,
  loadSoundCloudApi,
  registerPlayer,
  type SoundCloudWidget,
} from "./playerBus";

/* Private playlist (soundcloud.com/softdrive/sets/demos-softdrive,
   secret token) — controlled entirely through the widget API; the iframe
   itself stays visually hidden.
   ⚠️ The widget rejects the pretty …/sets/…/s-token permalink ("not a valid
   SoundCloud URL"). It needs the api.soundcloud.com playlist id with
   secret_token as its own param — the exact form SoundCloud's oEmbed
   returns for this set. */
const IFRAME_SRC =
  `https://w.soundcloud.com/player/?url=${encodeURIComponent(
    "https://api.soundcloud.com/playlists/2030364450"
  )}&secret_token=s-xW45HI33Vux` +
  "&visual=false&sharing=false&download=false&buying=false" +
  "&show_comments=false&show_playcount=false&show_user=false" +
  "&show_teaser=false&hide_related=true&auto_play=false";

function fmt(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export default function UnreleasedSection() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const widgetRef = useRef<SoundCloudWidget | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [playing, setPlaying] = useState(false);
  const [title, setTitle] = useState("");
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let disposed = false;
    let unregister: (() => void) | undefined;
    // If READY never fires (embed blocked), fall back to "Coming soon".
    const readyTimeout = setTimeout(() => setStatus("error"), 12000);

    loadSoundCloudApi()
      .then((SC) => {
        if (disposed || !iframeRef.current) return;
        const widget = SC.Widget(iframeRef.current);
        widgetRef.current = widget;
        const me = { pause: () => widget.pause() };

        const refreshSound = () =>
          widget.getCurrentSound((sound) => {
            if (disposed) return;
            setTitle(sound?.title ?? "");
            setDuration(sound?.duration ?? 0);
          });

        widget.bind(SC.Widget.Events.READY, () => {
          if (disposed) return;
          clearTimeout(readyTimeout);
          setStatus("ready");
          unregister = registerPlayer(me);
          refreshSound();
        });
        widget.bind(SC.Widget.Events.PLAY, () => {
          if (disposed) return;
          claimPlayback(me);
          setPlaying(true);
          refreshSound(); // picks up the new title after track changes
        });
        widget.bind(SC.Widget.Events.PAUSE, () => {
          if (!disposed) setPlaying(false);
        });
        widget.bind(SC.Widget.Events.PLAY_PROGRESS, (data) => {
          if (disposed) return;
          const pos = (data as { currentPosition?: number })?.currentPosition;
          if (typeof pos === "number") setPosition(pos);
        });
        // Playlist embeds auto-advance natively; FINISH only needs to reset
        // the bar (the follow-up PLAY refreshes title + duration).
        widget.bind(SC.Widget.Events.FINISH, () => {
          if (!disposed) setPosition(0);
        });
      })
      .catch(() => {
        if (!disposed) {
          clearTimeout(readyTimeout);
          setStatus("error");
        }
      });

    return () => {
      disposed = true;
      clearTimeout(readyTimeout);
      unregister?.();
    };
  }, []);

  const onSeek = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const widget = widgetRef.current;
      if (!widget || duration <= 0) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const frac = Math.min(
        1,
        Math.max(0, (e.clientX - rect.left) / rect.width)
      );
      widget.seekTo(frac * duration);
      setPosition(frac * duration);
    },
    [duration]
  );

  const ready = status === "ready";
  const progress = duration > 0 ? Math.min(1, position / duration) : 0;

  return (
    <section
      id="unreleased"
      className="relative"
      style={{ paddingTop: "3rem", paddingBottom: "8rem" }}
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
        <SectionHeading>Unreleased</SectionHeading>

        {/* Hidden playlist iframe — must stay rendered (not display:none),
            the widget API dies without a live embed. */}
        <iframe
          ref={iframeRef}
          src={IFRAME_SRC}
          allow="autoplay"
          title="Softdrive unreleased playlist"
          aria-hidden="true"
          tabIndex={-1}
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            opacity: 0,
            border: "none",
            pointerEvents: "none",
            left: "-9999px",
          }}
        />

        {status === "error" ? (
          <p
            className="text-center"
            style={{ fontSize: "14px", color: "var(--text-muted)" }}
          >
            Coming soon.
          </p>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ maxWidth: "420px", marginLeft: "auto", marginRight: "auto" }}
          >
            <div
              style={{
                background:
                  "linear-gradient(170deg, #1c0264, #12002e 55%, #0a0118)",
                border: "1px solid rgba(134, 6, 168, 0.35)",
                borderRadius: "15px",
                padding: "26px 24px 22px",
                boxShadow: "0 8px 30px rgba(0, 0, 0, 0.5)",
                opacity: ready ? 1 : 0.6,
                transition: "opacity 0.3s ease",
              }}
            >
              {/* Title */}
              <motion.p
                key={title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35 }}
                className="font-display text-center"
                style={{
                  fontSize: "15px",
                  color: "var(--text)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  marginBottom: "18px",
                }}
              >
                {title || "—"}
              </motion.p>

              {/* Seekable progress bar */}
              <div
                role="slider"
                aria-label="Seek"
                aria-valuemin={0}
                aria-valuemax={Math.round(duration / 1000)}
                aria-valuenow={Math.round(position / 1000)}
                onPointerDown={onSeek}
                style={{
                  padding: "8px 0",
                  cursor: ready ? "pointer" : "default",
                  touchAction: "none",
                }}
              >
                <div
                  style={{
                    height: "5px",
                    borderRadius: "999px",
                    background: "rgba(255, 255, 255, 0.12)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${progress * 100}%`,
                      borderRadius: "999px",
                      background: "linear-gradient(90deg, #8606a8, #910828)",
                    }}
                  />
                </div>
              </div>

              {/* Timecodes */}
              <div
                className="font-label text-center"
                style={{
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  fontVariantNumeric: "tabular-nums",
                  marginBottom: "16px",
                }}
              >
                {fmt(position)} / {fmt(duration)}
              </div>

              {/* Controls */}
              <div
                className="flex items-center justify-center"
                style={{ gap: "18px" }}
              >
                <motion.button
                  type="button"
                  disabled={!ready}
                  aria-label="Previous track"
                  whileTap={{ scale: 0.92 }}
                  onClick={() => widgetRef.current?.prev()}
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    border: "1px solid rgba(255, 255, 255, 0.18)",
                    background: "none",
                    cursor: ready ? "pointer" : "default",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-muted)",
                    fontSize: "14px",
                  }}
                >
                  <FaBackward />
                </motion.button>

                <motion.button
                  type="button"
                  disabled={!ready}
                  aria-label={playing ? "Pause" : "Play"}
                  whileTap={{ scale: 0.92 }}
                  onClick={() =>
                    playing
                      ? widgetRef.current?.pause()
                      : widgetRef.current?.play()
                  }
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "50%",
                    border: "none",
                    cursor: ready ? "pointer" : "default",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(180deg, #8606a8, #250285)",
                    color: "#ffffff",
                    fontSize: "16px",
                    boxShadow: "0 2px 16px rgba(134, 6, 168, 0.4)",
                  }}
                >
                  {playing ? (
                    <FaPause />
                  ) : (
                    <FaPlay style={{ marginLeft: "3px" }} />
                  )}
                </motion.button>

                <motion.button
                  type="button"
                  disabled={!ready}
                  aria-label="Next track"
                  whileTap={{ scale: 0.92 }}
                  onClick={() => widgetRef.current?.next()}
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    border: "1px solid rgba(255, 255, 255, 0.18)",
                    background: "none",
                    cursor: ready ? "pointer" : "default",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-muted)",
                    fontSize: "14px",
                  }}
                >
                  <FaForward />
                </motion.button>
              </div>
            </div>

            <a
              className="font-label block text-center"
              href="https://soundcloud.com/softdrive"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginTop: "14px",
                fontSize: "11px",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--text-dim)",
              }}
            >
              on SoundCloud
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
