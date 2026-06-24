"use client";

import { motion, type Variants } from "framer-motion";
import { useState } from "react";

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
    icon: <SoundCloudIcon />,
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
];

function LinkCard({ link }: { link: LinkItem }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={link.href}
      target={link.external ? "_blank" : undefined}
      rel={link.external ? "noopener noreferrer" : undefined}
      className="reactive-card relative flex flex-col items-center justify-center gap-3 rounded-2xl p-5 md:p-6 cursor-pointer select-none"
      style={{
        background: "var(--bg-card)",
        border: `1px solid ${hovered ? "var(--accent)" : "var(--accent-dim)"}`,
        textDecoration: "none",
        color: "inherit",
        aspectRatio: "1",
        minHeight: "90px",
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{
        scale: 1.06,
        boxShadow: "0 0 30px rgba(126,200,227,0.4), 0 0 60px rgba(126,200,227,0.18)",
        backgroundColor: "rgba(20,20,40,0.95)",
        transition: { duration: 0.18 },
      }}
      whileTap={{ scale: 0.94, transition: { duration: 0.06 } }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
    >
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.18 }}
        style={{
          background: "radial-gradient(circle at 50% 30%, rgba(126,200,227,0.1) 0%, transparent 70%)",
        }}
      />
      <motion.div
        className="relative z-10 w-6 h-6"
        animate={{
          color: hovered ? "var(--accent-bright)" : "var(--accent)",
          scale: hovered ? 1.15 : 1,
        }}
        transition={{ duration: 0.18 }}
      >
        {link.icon}
      </motion.div>
      <motion.span
        className="relative z-10 text-[10px] font-semibold tracking-widest uppercase"
        animate={{ color: hovered ? "var(--accent-bright)" : "var(--text-muted)" }}
        transition={{ duration: 0.18 }}
      >
        {link.label}
      </motion.span>
    </motion.a>
  );
}

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
};

export default function LinksSection() {
  return (
    <section
      id="links"
      className="relative py-20 md:py-28 px-6"
      style={{ background: "#08080f" }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(126,200,227,0.2), transparent)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mb-10 md:mb-14 text-center"
        >
          <p
            className="text-xs tracking-[0.35em] uppercase mb-3"
            style={{ color: "var(--accent)", opacity: 0.7 }}
          >
            Find us
          </p>
          <h2
            className="font-picnic leading-none"
            style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", color: "var(--text)" }}
          >
            Links
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-3 md:grid-cols-6 gap-3"
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

function SoundCloudIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c-.009-.058-.05-.1-.1-.1zm-.899.828c-.06 0-.091.037-.104.094L0 14.479l.172 1.308c.013.06.045.094.09.094.052 0 .089-.04.104-.09l.2-1.312-.2-1.334c-.015-.06-.052-.09-.09-.09zm1.83-1.229c-.063 0-.114.055-.12.132l-.213 2.523.213 2.465c.005.078.057.131.12.131s.114-.053.122-.131l.24-2.465-.24-2.523c-.008-.077-.059-.132-.122-.132zm.84-.414c-.073 0-.132.065-.137.155l-.193 2.938.193 2.853c.005.089.064.15.137.15.074 0 .131-.061.139-.15l.218-2.853-.218-2.938c-.008-.09-.065-.155-.139-.155zm.84-.293c-.083 0-.15.074-.154.176l-.176 3.231.176 3.138c.004.1.071.174.154.174.082 0 .149-.074.155-.174l.2-3.138-.2-3.231c-.006-.102-.073-.176-.155-.176zm.84-.18c-.091 0-.168.084-.172.197l-.159 3.41.159 3.322c.004.112.081.197.172.197s.167-.085.174-.197l.178-3.322-.178-3.41c-.007-.113-.083-.197-.174-.197zm.84-.147c-.101 0-.184.094-.19.219l-.14 3.557.14 3.467c.006.123.089.217.19.217.1 0 .183-.094.191-.217l.157-3.467-.157-3.557c-.008-.125-.091-.219-.191-.219zm.84-.061c-.111 0-.2.104-.207.24l-.123 3.618.123 3.555c.007.135.096.24.207.24.111 0 .2-.105.209-.24l.139-3.555-.139-3.618c-.009-.136-.098-.24-.209-.24zm.84.054c-.12 0-.217.114-.223.262l-.106 3.564.106 3.5c.006.147.103.26.223.26.119 0 .217-.113.225-.26l.119-3.5-.119-3.564c-.008-.148-.106-.262-.225-.262zm.84.11c-.13 0-.233.124-.24.283l-.089 3.454.089 3.393c.007.158.11.28.24.28.129 0 .232-.122.241-.28l.1-3.393-.1-3.454c-.009-.159-.112-.283-.241-.283zm1.71-.186c-.043-.005-.084-.008-.128-.008-.152 0-.292.06-.396.162-.093-.186-.282-.312-.498-.312-.15 0-.286.068-.378.175-.028.032-.043.074-.043.117l-.072 3.345.072 3.283c.007.18.125.32.271.32h.003c.146 0 .265-.14.273-.32l.081-3.283-.081-3.345zm10.67-4.962c-.229-2.559-2.381-4.563-5.004-4.563-.553 0-1.096.097-1.614.281-.212.075-.345.249-.345.47V20.7c.004.228.188.421.417.428h6.546c1.328 0 2.401-1.074 2.401-2.4 0-1.328-1.073-2.401-2.401-2.401-.231 0-.455.033-.668.095.201-.644.312-1.332.312-2.048 0-.383-.03-.764-.089-1.14z" />
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
    <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
      <text
        x="50%"
        y="54%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="46"
        fontWeight="700"
        fontFamily="Arial, Helvetica, sans-serif"
        letterSpacing="2"
      >
        RA
      </text>
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
