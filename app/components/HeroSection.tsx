"use client";

import { motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex items-end justify-center min-h-dvh overflow-hidden"
      style={{ background: "#B8DFF0" }}
    >
      {/* Spinning logo — fullscreen background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-contain"
        aria-hidden="true"
      >
        <source src="/videos/logo-spin.mp4" type="video/mp4" />
      </video>

      {/* Buttons floating at bottom over the video */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6 pb-14 md:pb-20 w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center"
        >
          <motion.a
            href="https://open.spotify.com/intl-de/artist/5eC9mSNlCW2yvMfKyiLf6i"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full font-semibold text-sm tracking-wide cursor-pointer"
            style={{ background: "#0a0a0f", color: "#e8e8e8" }}
            whileHover={{ scale: 1.05, boxShadow: "0 6px 24px rgba(0,0,0,0.35)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <SpotifyIcon className="w-4 h-4" />
            Listen on Spotify
          </motion.a>

          <motion.a
            href="https://paradise.ffm.to/symphony"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full font-semibold text-sm tracking-wide cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.25)",
              border: "1.5px solid rgba(10,10,15,0.35)",
              color: "#0a0a0f",
              backdropFilter: "blur(8px)",
            }}
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(255,255,255,0.4)",
              boxShadow: "0 6px 24px rgba(0,0,0,0.15)",
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <span
              className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold flex-shrink-0"
              style={{ background: "var(--amber)", color: "#0a0a0f" }}
            >
              ★
            </span>
            Latest Release: Symphony
          </motion.a>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-col items-center gap-2"
          style={{ opacity: 0.35 }}
        >
          <div
            className="w-px h-8"
            style={{ background: "linear-gradient(to bottom, transparent, #0a0a0f)" }}
          />
          <span className="text-[10px] tracking-[0.3em] uppercase font-medium" style={{ color: "#0a0a0f" }}>
            Scroll
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}

function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}
