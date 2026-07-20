"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSpotify,
  FaSoundcloud,
  FaInstagram,
  FaEnvelope,
  FaDownload,
} from "react-icons/fa";

const NAV_LINKS = [
  { label: "About", id: "about" },
  { label: "Releases", id: "releases" },
  { label: "Sets", id: "sets" },
  { label: "Dates", id: "dates" },
];

type SocialItem = {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
};

const SOCIAL_LINKS: SocialItem[] = [
  {
    id: "spotify",
    label: "Spotify",
    href: "https://open.spotify.com/intl-de/artist/5eC9mSNlCW2yvMfKyiLf6i",
    icon: <FaSpotify />,
  },
  {
    id: "soundcloud",
    label: "SoundCloud",
    href: "https://soundcloud.com/softdrive",
    icon: <FaSoundcloud />,
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/s0ftdrive/",
    icon: <FaInstagram />,
  },
  {
    id: "ra",
    label: "Resident Advisor",
    href: "https://ra.co/dj/softdrive",
    icon: null, // uses RAIcon
  },
  {
    id: "booking",
    label: "Booking",
    href: "mailto:softdrive@outlook.de",
    icon: <FaEnvelope />,
  },
  {
    id: "presskit",
    label: "Press Kit",
    href: "https://drive.google.com/file/d/15v1x5lOi8_TrimtHHf0zExtK1VDu9EDa/view?usp=sharing",
    icon: <FaDownload />,
  },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

/* Resident Advisor — crisp text monogram (no bitmap, inherits currentColor) */
function RAIcon({ size }: { size: number }) {
  return (
    <span
      className="font-label"
      aria-hidden="true"
      style={{
        fontSize: size * 0.82,
        fontWeight: 700,
        letterSpacing: "-0.03em",
        lineHeight: 1,
        display: "block",
        color: "currentColor",
      }}
    >
      RA
    </span>
  );
}

function SocialIconLink({
  item,
  iconSize,
  baseColor = "rgba(255,255,255,0.55)",
}: {
  item: SocialItem;
  iconSize: number;
  baseColor?: string;
}) {
  const isMail = item.href.startsWith("mailto:");
  return (
    <a
      href={item.href}
      target={isMail ? undefined : "_blank"}
      rel={isMail ? undefined : "noopener noreferrer"}
      aria-label={item.label}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: iconSize + 18,
        height: iconSize + 18,
        color: baseColor,
        textDecoration: "none",
        flexShrink: 0,
        transition: "color 0.16s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.color =
          "rgba(255,255,255,0.95)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.color = baseColor;
      }}
    >
      <span
        style={{
          width: iconSize,
          height: iconSize,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: iconSize,
          lineHeight: 1,
        }}
      >
        {item.id === "ra" ? <RAIcon size={iconSize} /> : item.icon}
      </span>
    </a>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      {/* ── Main bar ──────────────────────────────────── */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-8"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        style={{
          height: "60px",
          background: scrolled ? "rgba(10,10,15,0.5)" : "transparent",
          backdropFilter: scrolled ? "blur(20px) saturate(1.3)" : "none",
          WebkitBackdropFilter: scrolled
            ? "blur(20px) saturate(1.3)"
            : "none",
          borderBottom: scrolled
            ? "1px solid rgba(255,255,255,0.06)"
            : "none",
          transition: "background 0.35s ease, border-color 0.35s ease",
        }}
      >
        {/* Left: logo + nav links */}
        <div className="flex items-center" style={{ gap: "32px" }}>
          <button
            onClick={() => scrollToSection("home")}
            aria-label="Softdrive — scroll to top"
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          >
            {/* logo-nav.png used as alpha mask so the wordmark renders in the
                same muted tone as the nav links (marginally brighter, so it
                still leads the bar). */}
            <span
              aria-hidden="true"
              className="select-none"
              style={{
                display: "block",
                height: "28px",
                aspectRatio: "353 / 120",
                background: "rgba(255,255,255,0.72)",
                WebkitMaskImage: "url(/logo-nav.png)",
                maskImage: "url(/logo-nav.png)",
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            />
          </button>

          {/* Section links — desktop only */}
          <ul
            className="hidden md:flex items-center list-none"
            style={{ margin: 0, padding: 0, gap: "26px" }}
          >
            {NAV_LINKS.map(({ label, id }) => (
              <li key={id}>
                <button
                  onClick={() => scrollToSection(id)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    fontSize: "10px",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.58)",
                    cursor: "pointer",
                    transition: "color 0.16s ease",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "rgba(255,255,255,0.95)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "rgba(255,255,255,0.58)";
                  }}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: social icons (desktop) + hamburger (mobile) */}
        <div className="flex items-center">
          {/* Social icons — desktop only */}
          <div className="hidden md:flex items-center">
            {SOCIAL_LINKS.map((item) => (
              <SocialIconLink key={item.id} item={item} iconSize={16} />
            ))}
          </div>

          {/* Hamburger — mobile only */}
          <button
            className="flex md:hidden flex-col items-end justify-center cursor-pointer"
            style={{
              width: "40px",
              height: "40px",
              background: "none",
              border: "none",
              padding: "8px",
              gap: "5px",
            }}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <motion.span
              style={{
                display: "block",
                height: "1px",
                width: "22px",
                background: "rgba(255,255,255,0.85)",
                transformOrigin: "center",
              }}
              animate={
                menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }
              }
              transition={{ duration: 0.22 }}
            />
            <motion.span
              style={{
                display: "block",
                height: "1px",
                width: "15px",
                background: "rgba(255,255,255,0.85)",
              }}
              animate={
                menuOpen ? { opacity: 0, x: -4 } : { opacity: 1, x: 0 }
              }
              transition={{ duration: 0.15 }}
            />
            <motion.span
              style={{
                display: "block",
                height: "1px",
                width: "22px",
                background: "rgba(255,255,255,0.85)",
                transformOrigin: "center",
              }}
              animate={
                menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }
              }
              transition={{ duration: 0.22 }}
            />
          </button>
        </div>
      </motion.nav>

      {/* ── Mobile overlay menu ──────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col items-center justify-center md:hidden"
            style={{ background: "rgba(10,10,15,0.97)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Nav links */}
            <ul
              className="flex flex-col items-center list-none"
              style={{ margin: 0, padding: 0, gap: "28px", marginBottom: "52px" }}
            >
              {NAV_LINKS.map(({ label, id }, i) => (
                <motion.li
                  key={id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 + 0.04, duration: 0.28 }}
                >
                  <button
                    className="font-display cursor-pointer"
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      fontSize: "clamp(2rem, 8vw, 3rem)",
                      color: "rgba(255,255,255,0.9)",
                    }}
                    onClick={() => {
                      scrollToSection(id);
                      setMenuOpen(false);
                    }}
                  >
                    {label}
                  </button>
                </motion.li>
              ))}
            </ul>

            {/* Social icon row */}
            <motion.div
              className="flex items-center justify-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.28 }}
            >
              {SOCIAL_LINKS.map((item) => (
                <SocialIconLink
                  key={item.id}
                  item={item}
                  iconSize={18}
                  baseColor="rgba(255,255,255,0.48)"
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
