"use client";

import { motion, type Variants } from "framer-motion";
import SectionHeading from "./SectionHeading";

type Gig = {
  date: string;
  event?: string;
  venue: string;
  link?: string; // ticket / event page (e.g. Resident Advisor)
};

const GIGS: Gig[] = [
  { date: "25.07.2026", event: "Die Blaue Stunde", venue: "Uebel & Gefährlich, Hamburg", link: "https://ra.co/events/2490690" },
  { date: "15.08.2026", event: "Clubnacht", venue: "Fundbureau, Hamburg" },
  { date: "21.08.2026", event: "Polyamor x Goatball", venue: "Lokschuppen, Berlin", link: "https://ra.co/events/2332863" },
  { date: "22.08.2026", event: "Sachsentrance", venue: "Südpol, Hamburg", link: "https://sachsentrance.com/events/event/sachsentrance-sommerfest-suedpol/" },
  { date: "17.10.2026", event: "Dualism", venue: "About Blank, Berlin", link: "https://ra.co/events/2477619" },
];

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

function GigCard({ gig }: { gig: Gig }) {
  const inner = (
    <div
      className="date-card flex flex-col sm:flex-row sm:items-center"
      style={{ padding: "18px 22px", gap: "10px 24px" }}
    >
      <span
        className="font-label"
        style={{
          fontSize: "15px",
          fontWeight: 700,
          letterSpacing: "0.02em",
          whiteSpace: "nowrap",
          minWidth: "110px",
          color: "#08080b",
        }}
      >
        {gig.date}
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            display: "block",
            fontWeight: 600,
            fontSize: "15px",
            color: "#08080b",
          }}
        >
          {gig.event ?? gig.venue}
        </span>
        {gig.event && (
          <span
            style={{
              display: "block",
              marginTop: "2px",
              fontSize: "14px",
              color: "rgba(8, 8, 11, 0.55)",
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
            color: "#2b6a93",
            whiteSpace: "nowrap",
          }}
        >
          Tickets ↗
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

export default function DatesSection() {
  return (
    <section
      id="dates"
      className="relative"
      style={{ paddingTop: "3rem", paddingBottom: "6rem" }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, var(--border), transparent)",
        }}
        aria-hidden="true"
      />
      <div className="px-6 md:px-8" style={{ maxWidth: "1000px", marginLeft: "auto", marginRight: "auto" }}>
        <SectionHeading>Dates</SectionHeading>

        <motion.div
          className="flex flex-col"
          style={{ gap: "16px", maxWidth: "640px", marginLeft: "auto", marginRight: "auto" }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {GIGS.map((gig) => (
            <motion.div key={gig.date + gig.venue} variants={itemVariants}>
              <GigCard gig={gig} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
