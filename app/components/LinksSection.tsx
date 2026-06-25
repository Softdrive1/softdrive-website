"use client";

import { motion, type Variants } from "framer-motion";
import { useState } from "react";
import { FaSoundcloud } from "react-icons/fa";

interface LinkItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  external?: boolean;
}

const LINKS: LinkItem[] = [
  {
    label: "Spotify",
    href: "https://open.spotify.com/intl-de/artist/5eC9mSNlCW2yvMfKyiLf6i",
    icon: <SpotifyIcon />,
    external: true,
  },
  {
    label: "SoundCloud",
    href: "https://soundcloud.com/softdrive",
    icon: <FaSoundcloud className="w-full h-full" />,
    external: true,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/s0ftdrive/",
    icon: <InstagramIcon />,
    external: true,
  },
  {
    label: "RA",
    href: "https://ra.co/dj/softdrive",
    icon: <RAIcon />,
    external: true,
  },
  {
    label: "Booking",
    href: "mailto:softdrive@outlook.de",
    icon: <MailIcon />,
  },
  {
    label: "Press Kit",
    href: "https://drive.google.com/file/d/15v1x5lOi8_TrimtHHf0zExtK1VDu9EDa/view?usp=sharing",
    icon: <DownloadIcon />,
    external: true,
  },
  {
    label: "Call",
    href: "tel:+4917639974493",
    icon: <PhoneIcon />,
  },
];

function LinkCard({ link }: { link: LinkItem }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={link.href}
      target={link.external ? "_blank" : undefined}
      rel={link.external ? "noopener noreferrer" : undefined}
      className="relative flex flex-col items-center justify-center gap-3 rounded-2xl cursor-pointer select-none"
      style={{
        background: hovered ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.62)",
        border: `1px solid ${hovered ? "rgba(0,0,0,0.18)" : "rgba(0,0,0,0.08)"}`,
        boxShadow: hovered ? "0 4px 20px rgba(0,0,0,0.1)" : "0 1px 4px rgba(0,0,0,0.05)",
        textDecoration: "none",
        color: "inherit",
        aspectRatio: "1",
        minHeight: "90px",
        transition: "background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease",
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.06, transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.94, transition: { duration: 0.06 } }}
    >
      <motion.div
        className="w-6 h-6"
        animate={{ scale: hovered ? 1.12 : 1 }}
        transition={{ duration: 0.15 }}
        style={{ color: hovered ? "#0a0a0f" : "rgba(26,26,26,0.7)" }}
      >
        {link.icon}
      </motion.div>
      <span
        className="text-[10px] font-semibold tracking-widest uppercase"
        style={{ color: hovered ? "#0a0a0f" : "rgba(26,26,26,0.5)" }}
      >
        {link.label}
      </span>
    </motion.a>
  );
}

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45 } },
};

export default function LinksSection() {
  return (
    <section
      id="connect"
      className="relative"
      style={{ background: "#c3bfb9", paddingTop: "6rem", paddingBottom: "6rem" }}
    >
      <div
        className="absolute left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 px-6 md:px-8" style={{ maxWidth: "1000px", marginLeft: "auto", marginRight: "auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65 }}
          className="mb-10 md:mb-12 text-center"
        >
          <h2
            className="font-picnic leading-none"
            style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", color: "#1a1a1a" }}
          >
            Connect
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-4 md:grid-cols-7 gap-3"
          style={{ maxWidth: "640px", marginLeft: "auto", marginRight: "auto" }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {LINKS.map((link) => (
            <motion.div key={link.label} variants={itemVariants}>
              <LinkCard link={link} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ── Icons ─────────────────────────────────────────── */

function SpotifyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function RAIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 5a5 5 0 100 10A5 5 0 0012 7zm0 3a2 2 0 100 4 2 2 0 000-4z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M12 15V3m0 12-4-4m4 4 4-4" />
      <path d="M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 5.55 5.55l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16.92z" />
    </svg>
  );
}
