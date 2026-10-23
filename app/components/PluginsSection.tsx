"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import SectionHeading from "./SectionHeading";

const KOFI_URL = "https://ko-fi.com/softdrive";

/* Lives in public/. Copied from MaxForLive/release/ — rebuild there, copy here. */
const DOWNLOAD_HREF = "/softdrive-rhythm.amxd";
const DOWNLOAD_NAME = "Softdrive Rhythm.amxd";

/* Demo clip: .mp4 renders as a looping video (muted autoplay + unmute
   button), .gif as an image. Set to null to show the placeholder box
   instead. Source reel is 1080×1920 — re-encode to 720×1280 before
   swapping, the original is 63 MB. */
const DEMO_SRC: string | null = "/videos/softdrive-rhythm-demo.mp4";

/* The support button is a plain download link — that path works on every
   phone. Ko-fi is opened on top of it and must NOT preventDefault, or the
   file never starts. Doing it the other way round (link to Ko-fi, download
   by script) silently loses the download on mobile: opening the new tab
   cancels the synthetic click. */
const NEVER_CHANGES = () => () => {};

function openKofi(e: React.MouseEvent<HTMLAnchorElement>) {
  if (e.defaultPrevented) return;
  const tab = window.open(KOFI_URL, "_blank", "noopener,noreferrer");
  /* Popup blocked (common on iOS): send this tab instead, with enough delay
     for the download to have started. */
  if (!tab) {
    window.setTimeout(() => {
      window.location.href = KOFI_URL;
    }, 1200);
  }
}

const BUTTON_BASE: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  padding: "12px 22px",
  borderRadius: "999px",
  fontSize: "13px",
  fontWeight: 600,
  letterSpacing: "0.01em",
  fontFamily: "var(--font-inter), system-ui, sans-serif",
  cursor: "pointer",
  textAlign: "center",
  whiteSpace: "nowrap",
  transition:
    "opacity 0.25s, transform 0.25s cubic-bezier(0.25,0.46,0.45,0.94), background 0.2s, border-color 0.2s",
};

function press(e: React.MouseEvent<HTMLElement>, on: boolean) {
  const el = e.currentTarget as HTMLElement;
  el.style.opacity = on ? "0.82" : "1";
  el.style.transform = on ? "scale(0.98)" : "scale(1)";
}

export default function PluginsSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  /* Instagram's in-app browser is a WebView without a download manager:
     tapping either button does nothing at all. Nothing on our side can
     force the download, so we say so. Checked after mount, never during
     SSR — a server/client difference here would be a hydration error. */
  const inInstagram = useSyncExternalStore(
    NEVER_CHANGES,
    () => /Instagram/i.test(navigator.userAgent),
    () => false
  );

  function toggleSound() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    /* Autoplay may have been blocked; unmuting is a user gesture, so this
       is the moment playback is allowed to start. */
    if (!v.muted) void v.play().catch(() => {});
  }

  return (
    <section
      id="plugins"
      className="relative"
      style={{ paddingTop: "6rem", paddingBottom: "9rem" }}
    >
      <div
        className="px-6 md:px-8"
        style={{ maxWidth: "1000px", marginLeft: "auto", marginRight: "auto" }}
      >
        <SectionHeading>Plugins</SectionHeading>

        <motion.div
          style={{ maxWidth: "920px", marginLeft: "auto", marginRight: "auto" }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="demo-card" style={{ padding: "28px" }}>
            {/* Two columns from md up, stacked below */}
            <div
              className="flex flex-col md:flex-row"
              style={{ gap: "26px", alignItems: "center" }}
            >
              {/* ── Demo clip ── */}
              <div
                className="w-full md:w-auto"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "185px",
                    maxWidth: "100%",
                    aspectRatio: "720 / 1130",
                    flexShrink: 0,
                    borderRadius: "10px",
                    overflow: "hidden",
                    background: "rgba(8, 8, 11, 0.05)",
                    border: "1px solid #e6e9ee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {DEMO_SRC === null ? (
                    <span
                      className="font-label"
                      style={{
                        fontSize: "11px",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "rgba(8, 8, 11, 0.4)",
                      }}
                    >
                      Demo soon
                    </span>
                  ) : DEMO_SRC.endsWith(".gif") ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={DEMO_SRC}
                      alt="Softdrive Rhythm running in Ableton Live"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        aria-label="Softdrive Rhythm running in Ableton Live"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      >
                        <source src={DEMO_SRC} type="video/mp4" />
                      </video>

                      {/* Autoplay has to be muted — this is how you hear it. */}
                      <button
                        type="button"
                        onClick={toggleSound}
                        aria-label={muted ? "Unmute demo" : "Mute demo"}
                        aria-pressed={!muted}
                        style={{
                          position: "absolute",
                          right: "8px",
                          bottom: "8px",
                          width: "30px",
                          height: "30px",
                          borderRadius: "999px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          color: "#ffffff",
                          background: "rgba(8, 8, 11, 0.6)",
                          border: "1px solid rgba(255, 255, 255, 0.25)",
                          backdropFilter: "blur(6px)",
                          cursor: "pointer",
                          transition:
                            "opacity 0.25s, transform 0.25s cubic-bezier(0.25,0.46,0.45,0.94)",
                        }}
                        onMouseEnter={(e) => press(e, true)}
                        onMouseLeave={(e) => press(e, false)}
                      >
                        {muted ? <FaVolumeMute /> : <FaVolumeUp />}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* ── Copy + buttons ── */}
              <div
                className="text-center md:text-left"
                style={{ flex: 1, minWidth: 0 }}
              >
                {/* Name — deliberately not the display font: the chrome
                    section heading right above already carries that weight. */}
                <h3
                  className="font-label"
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    color: "#08080b",
                    marginBottom: "6px",
                  }}
                >
                  Softdrive Rhythm
                </h3>

                <p
                  className="font-label"
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "rgba(8, 8, 11, 0.45)",
                    marginBottom: "16px",
                  }}
                >
                  Max for Live · Ableton Live 10+
                </p>

                <p
                  style={{
                    fontSize: "15px",
                    lineHeight: 1.55,
                    color: "rgba(8, 8, 11, 0.62)",
                    textWrap: "balance",
                    marginBottom: "22px",
                  }}
                >
                  A Max for Live MIDI device with 20 rhythm presets that turn
                  any sound into an idea.
                </p>

                <div
                  className="flex flex-col md:flex-row justify-center md:justify-start"
                  style={{ gap: "12px" }}
                >
                  {/* Opens Ko-fi in a new tab (real anchor, so no popup
                      blocker) and starts the same download on click. */}
                  <a
                    href={DOWNLOAD_HREF}
                    download={DOWNLOAD_NAME}
                    onClick={openKofi}
                    className="w-full md:w-auto"
                    style={{
                      ...BUTTON_BASE,
                      background: "#08080b",
                      color: "#ffffff",
                      border: "1px solid #08080b",
                      boxShadow: "0 2px 14px rgba(8,8,11,0.25)",
                    }}
                    onMouseEnter={(e) => press(e, true)}
                    onMouseLeave={(e) => press(e, false)}
                  >
                    Support us &amp; download ♥
                  </a>

                  <a
                    href={DOWNLOAD_HREF}
                    download={DOWNLOAD_NAME}
                    className="w-full md:w-auto"
                    style={{
                      ...BUTTON_BASE,
                      background: "transparent",
                      color: "#08080b",
                      border: "1px solid #c4c9d2",
                    }}
                    onMouseEnter={(e) => press(e, true)}
                    onMouseLeave={(e) => press(e, false)}
                  >
                    Just the download
                  </a>
                </div>

                {inInstagram && (
                  <p
                    style={{
                      marginTop: "14px",
                      fontSize: "13px",
                      lineHeight: 1.5,
                      color: "rgba(8, 8, 11, 0.55)",
                    }}
                  >
                    Instagram&rsquo;s browser can&rsquo;t save files. Tap
                    &nbsp;⋯&nbsp; at the top right and choose &ldquo;Open in
                    browser&rdquo;.
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
