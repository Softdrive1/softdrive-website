"use client";

import { motion, type Variants } from "framer-motion";
import { useState } from "react";

interface Track {
  title: string;
  subtitle?: string;
  platform: "spotify" | "soundcloud" | "presave";
  href: string;
  isNew?: boolean;
  isSet?: boolean;
}

const RELEASES: Track[] = [
  {
    title: "Symphony",
    subtitle: "Out June 26 via Parallel",
    platform: "presave",
    href: "https://paradise.ffm.to/symphony",
    isNew: true,
  },
  {
    title: "Nights Like This",
    subtitle: "ft. BNZN · Polyamor Records",
    platform: "soundcloud",
    href: "https://soundcloud.com/polyamor-berlin/bnzn-x-softdrive-nights-like-this2",
  },
  {
    title: "Das Erste Mal",
    subtitle: "ft. Mika Heggemann",
    platform: "soundcloud",
    href: "https://soundcloud.com/polyamor-berlin/softdrive-mika-heggemann-das-erste-mal",
  },
  {
    title: "Leichter // Kälter",
    platform: "soundcloud",
    href: "https://soundcloud.com/polyamor-berlin/softdrive-leichter-ka-lter",
  },
  {
    title: "Law Of Attraction",
    platform: "soundcloud",
    href: "https://soundcloud.com/softdrive",
  },
  {
    title: "Sweet Disposition",
    subtitle: "Softdrive Edit",
    platform: "soundcloud",
    href: "https://soundcloud.com/verflixtmusic/temper-trap-sweet-disposition-softdrive-edit",
  },
  {
    title: "Zoey 101",
    platform: "soundcloud",
    href: "https://soundcloud.com/softdrive/zoey-101",
  },
];

const SETS: Track[] = [
  {
    title: "Osterrave at Edelfettwerk 2026",
    subtitle: "Live Set",
    platform: "soundcloud",
    href: "https://soundcloud.com/softdrive/oster-version-2",
    isSet: true,
  },
];

function EqualizerBars({ active }: { active: boolean }) {
  return (
    <div className={`eq-bars${active ? " active" : ""}`} aria-hidden="true">
      <div className="eq-bar" />
      <div className="eq-bar" />
      <div className="eq-bar" />
      <div className="eq-bar" />
      <div className="eq-bar" />
    </div>
  );
}

function PlatformBadge({ platform }: { platform: Track["platform"] }) {
  const map = {
    spotify: { label: "Spotify", color: "#1DB954" },
    soundcloud: { label: "SoundCloud", color: "#FF5500" },
    presave: { label: "Pre-Save", color: "var(--amber)" },
  };
  const p = map[platform];
  return (
    <span
      className="text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded flex-shrink-0"
      style={{ background: `${p.color}22`, color: p.color, border: `1px solid ${p.color}44` }}
    >
      {p.label}
    </span>
  );
}

function TrackCard({ track }: { track: Track }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={track.href}
      target="_blank"
      rel="noopener noreferrer"
      className="reactive-card group relative flex items-center gap-4 w-full rounded-xl p-4 md:p-5 cursor-pointer select-none"
      style={{
        background: "var(--bg-card)",
        border: `1px solid ${hovered ? "var(--accent)" : "var(--accent-dim)"}`,
        textDecoration: "none",
        color: "inherit",
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{
        scale: 1.025,
        boxShadow: "0 0 25px rgba(126,200,227,0.35), 0 0 50px rgba(126,200,227,0.15)",
        backgroundColor: "rgba(20,20,35,0.95)",
        transition: { duration: 0.18 },
      }}
      whileTap={{ scale: 0.975, transition: { duration: 0.08 } }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        style={{
          background: "linear-gradient(135deg, rgba(126,200,227,0.05) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 flex-shrink-0">
        <EqualizerBars active={hovered} />
      </div>

      <div className="relative z-10 flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="font-semibold text-sm md:text-base truncate"
            style={{ color: "var(--text)" }}
          >
            {track.title}
          </span>
          {track.isNew && (
            <span
              className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full flex-shrink-0"
              style={{
                background: "var(--amber)",
                color: "#0a0a0f",
                animation: "badge-pulse 2s ease-in-out infinite",
              }}
            >
              NEW
            </span>
          )}
          {track.isSet && (
            <span
              className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full flex-shrink-0"
              style={{
                background: "rgba(126,200,227,0.15)",
                color: "var(--accent)",
                border: "1px solid rgba(126,200,227,0.3)",
              }}
            >
              SET
            </span>
          )}
        </div>
        {track.subtitle && (
          <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-muted)" }}>
            {track.subtitle}
          </p>
        )}
      </div>

      <div className="relative z-10 flex items-center gap-3 flex-shrink-0">
        <PlatformBadge platform={track.platform} />
        <motion.div
          animate={{ x: hovered ? 4 : 0, opacity: hovered ? 1 : 0.4 }}
          transition={{ duration: 0.2 }}
          style={{ color: "var(--accent)" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </div>
    </motion.a>
  );
}

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function TrackGroup({ title, tracks }: { title: string; tracks: Track[] }) {
  return (
    <div className="mb-10">
      <motion.p
        className="text-[10px] tracking-[0.3em] uppercase mb-4"
        style={{ color: "var(--accent)" }}
        initial={{ opacity: 0, x: -8 }}
        whileInView={{ opacity: 0.6, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {title}
      </motion.p>
      <motion.div
        className="flex flex-col gap-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        {tracks.map((track) => (
          <motion.div key={track.title} variants={itemVariants}>
            <TrackCard track={track} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default function TracksSection() {
  return (
    <section
      id="tracks"
      className="relative py-20 md:py-28"
      style={{ background: "linear-gradient(180deg, #0a0a0f 0%, #080812 50%, #0a0a0f 100%)" }}
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: "60vw",
          height: "60vw",
          background: "radial-gradient(circle, rgba(126,200,227,0.05) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1100px] mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mb-10 md:mb-12 text-center"
        >
          <h2
            className="font-picnic leading-none"
            style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", color: "var(--text)" }}
          >
            Tracks & Sets
          </h2>
        </motion.div>

        <TrackGroup title="Releases" tracks={RELEASES} />
        <TrackGroup title="Sets" tracks={SETS} />

        <motion.a
          href="https://soundcloud.com/softdrive"
          target="_blank"
          rel="noopener noreferrer"
          className="reactive-card flex items-center justify-center gap-3 w-full rounded-xl p-4 cursor-pointer mt-2"
          style={{
            background: "transparent",
            border: "1px dashed rgba(126,200,227,0.25)",
            textDecoration: "none",
            color: "var(--text-muted)",
          }}
          whileHover={{
            scale: 1.02,
            borderColor: "rgba(126,200,227,0.6)",
            color: "var(--accent)",
            boxShadow: "0 0 20px rgba(126,200,227,0.2)",
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <SoundCloudIcon className="w-5 h-5" />
          <span className="text-sm font-medium tracking-wide">More on SoundCloud</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.a>
      </div>
    </section>
  );
}

function SoundCloudIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c-.009-.058-.05-.1-.1-.1zm-.899.828c-.06 0-.091.037-.104.094L0 14.479l.172 1.308c.013.06.045.094.09.094.052 0 .089-.04.104-.09l.2-1.312-.2-1.334c-.015-.06-.052-.09-.09-.09zm1.83-1.229c-.063 0-.114.055-.12.132l-.213 2.523.213 2.465c.005.078.057.131.12.131s.114-.053.122-.131l.24-2.465-.24-2.523c-.008-.077-.059-.132-.122-.132zm.84-.414c-.073 0-.132.065-.137.155l-.193 2.938.193 2.853c.005.089.064.15.137.15.074 0 .131-.061.139-.15l.218-2.853-.218-2.938c-.008-.09-.065-.155-.139-.155zm.84-.293c-.083 0-.15.074-.154.176l-.176 3.231.176 3.138c.004.1.071.174.154.174.082 0 .149-.074.155-.174l.2-3.138-.2-3.231c-.006-.102-.073-.176-.155-.176zm.84-.18c-.091 0-.168.084-.172.197l-.159 3.41.159 3.322c.004.112.081.197.172.197s.167-.085.174-.197l.178-3.322-.178-3.41c-.007-.113-.083-.197-.174-.197zm.84-.147c-.101 0-.184.094-.19.219l-.14 3.557.14 3.467c.006.123.089.217.19.217.1 0 .183-.094.191-.217l.157-3.467-.157-3.557c-.008-.125-.091-.219-.191-.219zm.84-.061c-.111 0-.2.104-.207.24l-.123 3.618.123 3.555c.007.135.096.24.207.24.111 0 .2-.105.209-.24l.139-3.555-.139-3.618c-.009-.136-.098-.24-.209-.24zm.84.054c-.12 0-.217.114-.223.262l-.106 3.564.106 3.5c.006.147.103.26.223.26.119 0 .217-.113.225-.26l.119-3.5-.119-3.564c-.008-.148-.106-.262-.225-.262zm.84.11c-.13 0-.233.124-.24.283l-.089 3.454.089 3.393c.007.158.11.28.24.28.129 0 .232-.122.241-.28l.1-3.393-.1-3.454c-.009-.159-.112-.283-.241-.283zm1.71-.186c-.043-.005-.084-.008-.128-.008-.152 0-.292.06-.396.162-.093-.186-.282-.312-.498-.312-.15 0-.286.068-.378.175-.028.032-.043.074-.043.117l-.072 3.345.072 3.283c.007.18.125.32.271.32h.003c.146 0 .265-.14.273-.32l.081-3.283-.081-3.345zm10.67-4.962c-.229-2.559-2.381-4.563-5.004-4.563-.553 0-1.096.097-1.614.281-.212.075-.345.249-.345.47V20.7c.004.228.188.421.417.428h6.546c1.328 0 2.401-1.074 2.401-2.4 0-1.328-1.073-2.401-2.401-2.401-.231 0-.455.033-.668.095.201-.644.312-1.332.312-2.048 0-.383-.03-.764-.089-1.14z" />
    </svg>
  );
}
