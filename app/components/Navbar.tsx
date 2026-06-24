"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Releases", id: "releases" },
  { label: "Sets", id: "sets" },
  { label: "About", id: "about" },
  { label: "Connect", id: "connect" },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Always light text: dark video hero below, dark navbar background when scrolled
  const textColor = "rgba(255,255,255,0.92)";

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 h-16 flex items-center justify-between"
        style={{
          background: scrolled ? "rgba(10,10,15,0.9)" : "transparent",
          backdropFilter: scrolled ? "blur(20px) saturate(1.3)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
          transition: "background 0.35s ease, border-color 0.35s ease",
        }}
      >
        <button
          onClick={() => scrollToSection("home")}
          className="cursor-pointer select-none"
          aria-label="Scroll to top"
        >
          <span
            className="font-picnic tracking-wider"
            style={{ fontSize: "1.15rem", color: textColor }}
          >
            SOFTDRIVE
          </span>
        </button>

        <ul className="hidden md:flex items-center gap-8 list-none">
          {NAV_LINKS.map(({ label, id }) => (
            <li key={id}>
              <button
                onClick={() => scrollToSection(id)}
                className="text-xs tracking-[0.2em] uppercase font-medium cursor-pointer hover:opacity-100 transition-opacity duration-200"
                style={{ color: textColor, opacity: 0.65 }}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        <button
          className="md:hidden flex flex-col justify-center gap-1.5 w-8 h-8 cursor-pointer"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <motion.span
            className="block h-px w-6 origin-center"
            style={{ background: textColor }}
            animate={menuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block h-px w-4 origin-center"
            style={{ background: textColor }}
            animate={menuOpen ? { opacity: 0, x: -4 } : { opacity: 1, x: 0 }}
            transition={{ duration: 0.15 }}
          />
          <motion.span
            className="block h-px w-6 origin-center"
            style={{ background: textColor }}
            animate={menuOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col items-center justify-center md:hidden"
            style={{ background: "rgba(10,10,15,0.97)" }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
          >
            <ul className="flex flex-col items-center gap-10 list-none">
              {NAV_LINKS.map(({ label, id }, i) => (
                <motion.li
                  key={id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <button
                    onClick={() => { scrollToSection(id); setMenuOpen(false); }}
                    className="font-picnic cursor-pointer"
                    style={{ fontSize: "clamp(2rem, 8vw, 3rem)", color: "var(--text)" }}
                  >
                    {label}
                  </button>
                </motion.li>
              ))}
            </ul>
            <p
              className="absolute bottom-12 text-xs tracking-[0.3em] uppercase"
              style={{ color: "var(--text-muted)" }}
            >
              Hamburg · 2026
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
