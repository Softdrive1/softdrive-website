"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import SectionHeading from "./SectionHeading";

type Gig = {
  date: string;
  event?: string;
  venue: string;
  link?: string; // ticket / event page (e.g. Resident Advisor)
};

// Single source of truth: every gig, past and upcoming. The lists below are
// derived by date, so a gig moves from "upcoming" to "Past Events" on its own.
const GIGS: Gig[] = [
  { date: "25.07.2026", event: "Die Blaue Stunde", venue: "Uebel & Gefährlich, Hamburg", link: "https://ra.co/events/2490690" },
  { date: "15.08.2026", event: "Clubnacht", venue: "Fundbureau, Hamburg", link: "https://ra.co/events/2498116" },
  { date: "23.08.2026", event: "Polyamor x Goatball", venue: "Lokschuppen, Berlin", link: "https://ra.co/events/2332863" },
  { date: "22.08.2026", event: "Sachsentrance", venue: "Südpol, Hamburg", link: "https://sachsentrance.com/events/event/sachsentrance-sommerfest-suedpol/" },
  { date: "05.09.2026", event: "Trybe Summer Closing", venue: "Fundbureau, Hamburg", link: "https://ra.co/events/2498107" },
  { date: "03.10.2026", event: "Clubnacht", venue: "Fundbureau, Hamburg", link: "https://ra.co/events/2540867" },
  { date: "17.10.2026", event: "Dualism", venue: "About Blank, Berlin", link: "https://ra.co/events/2477619" },
  { date: "31.10.2026", event: "G Spot", venue: "Fundbureau, Hamburg" }, // link pending
  { date: "07.11.2026", event: "Trance for Friends", venue: "La Cova, Hamburg" }, // link pending
  { date: "31.12.2026", event: "NYE", venue: "Edelfettwerk, Hamburg" }, // link pending

  // ── Past-event highlights (from Notion + RA, cross-checked) ──
  { date: "20.06.2026", event: "Trance with Friends", venue: "La Cova, Hamburg" }, // link pending — 2436932 turned out to be G Spot
  { date: "16.05.2026", event: "G Spot", venue: "Uebel & Gefährlich, Hamburg", link: "https://ra.co/events/2436932" },
  { date: "04.04.2026", event: "Oster Rave", venue: "Edelfettwerk, Hamburg", link: "https://ra.co/events/2394775" },
  { date: "19.04.2025", event: "Entrance", venue: "Tranzit, Hamburg", link: "https://ra.co/events/2150286" },
  { date: "28.03.2026", event: "WyldHearts", venue: "Schrotty, Köln", link: "https://ra.co/events/2389279" },
  { date: "15.02.2026", event: "La Cova B-Day", venue: "La Cova, Hamburg", link: "https://ra.co/events/2362597" },
  { date: "15.11.2025", event: "Teletech", venue: "Edelfettwerk, Hamburg", link: "https://ra.co/events/2211880" },
  { date: "03.03.2025", event: "WyldHearts", venue: "Reinecke Fuchs, Köln", link: "https://ra.co/events/2104469" },
  { date: "14.12.2024", event: "Trance Rave XXL", venue: "Edelfettwerk, Hamburg", link: "https://ra.co/events/2047906" },
  { date: "19.07.2024", event: "TOOLOUDFORTHEROOM", venue: "Café Schöne Aussichten, Hamburg", link: "https://ra.co/events/1962745" },
  { date: "23.03.2024", event: "Trance Rave XXL", venue: "Edelfettwerk, Hamburg", link: "https://ra.co/events/1869299" },
];

// "DD.MM.YYYY" → Date at local midnight (so a gig stays listed through its own day).
function parseGigDate(date: string): Date {
  const [d, m, y] = date.split(".").map(Number);
  return new Date(y, m - 1, d);
}

function todayStart(): Date {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
}

function upcomingGigs(): Gig[] {
  const today = todayStart();
  return GIGS
    .filter((gig) => parseGigDate(gig.date) >= today)
    .sort((a, b) => parseGigDate(a.date).getTime() - parseGigDate(b.date).getTime());
}

function pastGigs(): Gig[] {
  const today = todayStart();
  return GIGS
    .filter((gig) => parseGigDate(gig.date) < today)
    .sort((a, b) => parseGigDate(b.date).getTime() - parseGigDate(a.date).getTime()); // newest first
}

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

function GigCard({ gig, past = false }: { gig: Gig; past?: boolean }) {
  // Upcoming = bright #f4f4f4 hero cards. Past = dark glass so they read as
  // secondary/archival while staying in the same design language.
  const c = past
    ? { date: "var(--text)", title: "var(--text)", venue: "var(--text-muted)", link: "var(--accent)" }
    : { date: "#08080b", title: "#08080b", venue: "rgba(8, 8, 11, 0.55)", link: "#2b6a93" };

  const inner = (
    <div
      className={`date-card${past ? " date-card--past" : ""} flex flex-col sm:flex-row sm:items-center`}
      style={{ padding: past ? "14px 20px" : "18px 22px", gap: "10px 24px" }}
    >
      <span
        className="font-label"
        style={{
          fontSize: past ? "14px" : "15px",
          fontWeight: 700,
          letterSpacing: "0.02em",
          whiteSpace: "nowrap",
          minWidth: "110px",
          color: c.date,
        }}
      >
        {gig.date}
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            display: "block",
            fontWeight: 600,
            fontSize: past ? "14px" : "15px",
            color: c.title,
          }}
        >
          {gig.event ?? gig.venue}
        </span>
        {gig.event && (
          <span
            style={{
              display: "block",
              marginTop: "2px",
              fontSize: past ? "13px" : "14px",
              color: c.venue,
            }}
          >
            {gig.venue}
          </span>
        )}
      </span>
      {gig.link && (
        <span
          className="font-label"
          style={{
            fontSize: "13px",
            color: c.link,
            whiteSpace: "nowrap",
          }}
        >
          {past ? "Event ↗" : "Tickets ↗"}
        </span>
      )}
    </div>
  );

  return gig.link ? (
    <a href={gig.link} target="_blank" rel="noopener noreferrer" className="block">
      {inner}
    </a>
  ) : (
    inner
  );
}

function PastEvents({ gigs }: { gigs: Gig[] }) {
  const [open, setOpen] = useState(false);
  if (gigs.length === 0) return null;

  return (
    <div style={{ maxWidth: "640px", margin: "34px auto 0" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          type="button"
          className="past-toggle"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span>Past Events</span>
          <span className="past-count">{gigs.length}</span>
          <svg
            className="past-chevron"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
          >
            <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="past-list"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ overflow: "hidden" }}
          >
            <div className="flex flex-col" style={{ gap: "12px", paddingTop: "18px" }}>
              {gigs.map((gig) => (
                <GigCard key={gig.date + gig.venue} gig={gig} past />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const subscribe = () => () => {};

export default function DatesSection() {
  // Filter client-side only: server (UTC) and visitor clocks can disagree on
  // "upcoming" near midnight, which would cause a hydration mismatch. The server
  // snapshot is false, so the section renders nothing until hydrated.
  const isClient = useSyncExternalStore(subscribe, () => true, () => false);

  // Re-render right after the next local midnight so a gig moves into "Past
  // Events" the day after it happened — even in a tab left open overnight, with
  // no reload. (On a normal page load the split is already correct.)
  const [, setDayTick] = useState(0);
  useEffect(() => {
    let cancelled = false;
    let id = 0;
    const scheduleMidnight = () => {
      if (cancelled) return;
      const now = new Date();
      const nextMidnight = new Date(now);
      nextMidnight.setHours(24, 0, 0, 200); // a hair past 00:00 local
      id = window.setTimeout(() => {
        setDayTick((v) => v + 1);
        scheduleMidnight();
      }, nextMidnight.getTime() - now.getTime());
    };
    scheduleMidnight();
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, []);

  const upcoming = isClient ? upcomingGigs() : [];
  const past = isClient ? pastGigs() : [];

  if (upcoming.length === 0 && past.length === 0) return null;

  return (
    <section
      id="dates"
      className="relative"
      style={{ paddingTop: "3rem", paddingBottom: "6rem" }}
    >
      <div className="px-6 md:px-8" style={{ maxWidth: "1000px", marginLeft: "auto", marginRight: "auto" }}>
        <SectionHeading>Dates</SectionHeading>

        {upcoming.length > 0 && (
          <motion.div
            className="flex flex-col"
            style={{ gap: "16px", maxWidth: "640px", marginLeft: "auto", marginRight: "auto" }}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {upcoming.map((gig) => (
              <motion.div key={gig.date + gig.venue} variants={itemVariants}>
                <GigCard gig={gig} />
              </motion.div>
            ))}
          </motion.div>
        )}

        <PastEvents gigs={past} />
      </div>
    </section>
  );
}
