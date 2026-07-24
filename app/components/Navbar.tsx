"use client";

import { useState, useEffect, useRef } from "react";
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

/* ── Desktop section nav — sliding pill cursor ──────────
   White cursor slides behind the hovered tab; the labels use
   mix-blend-difference so they read dark over the pill and light
   everywhere else. */
type CursorPos = { left: number; width: number; opacity: number };

function SlidingNav() {
  const [position, setPosition] = useState<CursorPos>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <ul
      className="relative flex list-none"
      onMouseLeave={() => setPosition((p) => ({ ...p, opacity: 0 }))}
      style={{
        margin: 0,
        padding: "4px",
        borderRadius: "999px",
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(255,255,255,0.045)",
      }}
    >
      {NAV_LINKS.map(({ label, id }) => (
        <SlideTab
          key={id}
          setPosition={setPosition}
          onSelect={() => scrollToSection(id)}
        >
          {label}
        </SlideTab>
      ))}
      <SlideCursor position={position} />
    </ul>
  );
}

function SlideTab({
  children,
  setPosition,
  onSelect,
}: {
  children: React.ReactNode;
  setPosition: React.Dispatch<React.SetStateAction<CursorPos>>;
  onSelect: () => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;
        const { width } = ref.current.getBoundingClientRect();
        setPosition({ left: ref.current.offsetLeft, width, opacity: 1 });
      }}
      onClick={onSelect}
      className="relative z-10 block cursor-pointer select-none mix-blend-difference"
      style={{
        padding: "7px 18px",
        fontSize: "10px",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        fontWeight: 600,
        color: "#ffffff",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </li>
  );
}

function SlideCursor({ position }: { position: CursorPos }) {
  return (
    <motion.li
      animate={position}
      transition={{ type: "spring", stiffness: 450, damping: 36 }}
      className="absolute z-0 rounded-full"
      style={{ top: 4, bottom: 4, left: 0, background: "#ffffff" }}
    />
  );
}

/* ── Social buttons — icon collapses to a labelled pill ─
   First click reveals the name; a second click follows the link.
   Clicking elsewhere collapses it. Used on both desktop and mobile. */
const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

// A short tween (not a spring): it animates a single layout property (the
// label width) deterministically, which stays smooth even while the hero's
// three.js scene keeps the main thread busy. Springs overshoot and add
// per-frame layout jitter here.
const tabTransition = {
  duration: 0.28,
  ease: [0.25, 0.46, 0.45, 0.94],
} as const;

function ExpandableSocials({
  iconSize,
  height,
  align = "start",
}: {
  iconSize: number;
  height: number;
  align?: "start" | "center";
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selected) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setSelected(null);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [selected]);

  const idlePad = Math.round((height - iconSize) / 2);

  return (
    <div
      ref={containerRef}
      className="no-scrollbar"
      style={{ overflowX: "auto", overflowY: "hidden", maxWidth: "100%" }}
    >
      {/* Single row: stays on one line and scrolls horizontally if an
          expanded label runs wider than the screen — never wraps to a
          second row. width:max-content + minWidth:100% keeps the icons
          centred while they fit, then lets them overflow-and-scroll. */}
      <div
        className="flex items-center"
        style={{
          gap: "6px",
          flexWrap: "nowrap",
          width: "max-content",
          minWidth: "100%",
          justifyContent: align === "center" ? "center" : "flex-start",
        }}
      >
      {SOCIAL_LINKS.map((item) => {
        const isSel = selected === item.id;
        const isMail = item.href.startsWith("mailto:");
        return (
          <motion.a
            key={item.id}
            href={item.href}
            target={isMail ? undefined : "_blank"}
            rel={isMail ? undefined : "noopener noreferrer"}
            aria-label={item.label}
            onClick={(e) => {
              // First tap: just reveal the name. Second tap follows the link.
              if (!isSel) {
                e.preventDefault();
                const el = e.currentTarget;
                setSelected(item.id);
                // Once the label has finished expanding, pull the whole pill
                // into view so a right-edge item (e.g. Press Kit) can't stay
                // clipped off-screen on narrow mobile widths.
                window.setTimeout(() => {
                  el.scrollIntoView({
                    behavior: "smooth",
                    inline: "center",
                    block: "nearest",
                  });
                }, 300);
              }
            }}
            initial={false}
            animate={{
              // Only paint properties animate here — no layout. The width
              // change is carried entirely by the label wrapper below.
              backgroundColor: isSel
                ? "rgba(255,255,255,0.10)"
                : "rgba(255,255,255,0)",
              color: isSel ? "#cfe8fb" : "rgba(255,255,255,0.55)",
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            whileHover={
              isSel ? undefined : { color: "rgba(255,255,255,0.95)" }
            }
            className="relative flex items-center font-label"
            style={{
              height,
              paddingLeft: idlePad,
              paddingRight: idlePad,
              borderRadius: "999px",
              textDecoration: "none",
              overflow: "hidden",
              cursor: "pointer",
              flexShrink: 0,
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
                flexShrink: 0,
              }}
            >
              {item.id === "ra" ? <RAIcon size={iconSize} /> : item.icon}
            </span>
            <AnimatePresence initial={false}>
              {isSel && (
                <motion.span
                  variants={spanVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={tabTransition}
                  className="overflow-hidden"
                  style={{ display: "inline-flex" }}
                >
                  {/* The icon↔label spacing lives on this inner span's
                      padding, so it's clipped at width 0 and slides out
                      smoothly with the reveal — no instant margin pop. */}
                  <span
                    className="whitespace-nowrap"
                    style={{
                      paddingLeft: "11px",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    {item.label}
                  </span>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.a>
        );
      })}
      </div>
    </div>
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
        {/* Left: logo + sliding section nav */}
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
          <div className="hidden md:block">
            <SlidingNav />
          </div>
        </div>

        {/* Right: social icons (desktop) + hamburger (mobile) */}
        <div className="flex items-center">
          {/* Social buttons — desktop only */}
          <div className="hidden md:block">
            <ExpandableSocials iconSize={16} height={34} />
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

            {/* Social buttons — tap to reveal name */}
            <motion.div
              className="w-full px-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.28 }}
            >
              <ExpandableSocials iconSize={20} height={46} align="center" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
