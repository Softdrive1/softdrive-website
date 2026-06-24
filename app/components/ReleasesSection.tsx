"use client";

import { motion, type Variants } from "framer-motion";

interface Release {
  id: string;
  title: string;
  subtitle?: string;
  isNew?: boolean;
  presaveUrl?: string;
  scUrl?: string;
}

const RELEASES: Release[] = [
  {
    id: "symphony",
    title: "Symphony",
    subtitle: "Out June 26 via Parallel",
    isNew: true,
    presaveUrl: "https://paradise.ffm.to/symphony",
  },
  {
    id: "leichter-kalter",
    title: "Leichter // Kälter",
    scUrl: "https://soundcloud.com/polyamor-berlin/softdrive-leichter-ka-lter",
  },
  {
    id: "das-erste-mal",
    title: "Das Erste Mal",
    subtitle: "ft. Mika Heggemann",
    scUrl: "https://soundcloud.com/polyamor-berlin/softdrive-mika-heggemann-das-erste-mal",
  },
  {
    id: "nights-like-this",
    title: "Nights Like This",
    subtitle: "ft. BNZN",
    scUrl: "https://soundcloud.com/polyamor-berlin/bnzn-x-softdrive-nights-like-this2",
  },
  {
    id: "sweet-disposition",
    title: "Sweet Disposition",
    subtitle: "Softdrive Edit",
    scUrl: "https://soundcloud.com/verflixtmusic/temper-trap-sweet-disposition-softdrive-edit",
  },
  {
    id: "zoey-101",
    title: "Zoey 101",
    scUrl: "https://soundcloud.com/softdrive/zoey-101",
  },
  {
    id: "law-of-attraction",
    title: "Law Of Attraction",
    scUrl: "https://soundcloud.com/tipsy-dreamer/softdrive-law-of-attraction",
  },
];

function scSrc(url: string) {
  return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&visual=false`;
}

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const cardStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.62)",
  borderRadius: "12px",
  border: "1px solid rgba(0,0,0,0.08)",
  overflow: "hidden",
  boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
};

export default function ReleasesSection() {
  return (
    <section
      id="releases"
      className="relative"
      style={{ background: "#c5c5c5", paddingTop: "6rem", paddingBottom: "6rem" }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)",
        }}
        aria-hidden="true"
      />
      <div className="px-6 md:px-8" style={{ maxWidth: "1100px", marginLeft: "auto", marginRight: "auto" }}>
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
            Releases
          </h2>
        </motion.div>

        <motion.div
          className="flex flex-col gap-3"
          style={{ maxWidth: "48rem", marginLeft: "auto", marginRight: "auto" }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {RELEASES.map((release) => (
            <motion.div key={release.id} variants={itemVariants}>
              {release.presaveUrl ? (
                /* Symphony — presave card */
                <div
                  className="flex items-center justify-between gap-4 px-4"
                  style={{ ...cardStyle, height: "120px" }}
                >
                  <div style={{ paddingLeft: "72px" }}>
                    <div className="flex items-center gap-2">
                      <span
                        className="font-semibold"
                        style={{ color: "#1a1a1a", fontSize: "15px" }}
                      >
                        {release.title}
                      </span>
                      {release.isNew && (
                        <span
                          className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
                          style={{ background: "#E8A84C", color: "#0a0a0f" }}
                        >
                          NEW
                        </span>
                      )}
                    </div>
                    {release.subtitle && (
                      <p
                        className="text-xs mt-1"
                        style={{ color: "rgba(26,26,26,0.5)" }}
                      >
                        {release.subtitle}
                      </p>
                    )}
                  </div>
                  <a
                    href={release.presaveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-75"
                    style={{
                      background: "#1a1a1a",
                      color: "#fff",
                      textDecoration: "none",
                    }}
                  >
                    Pre-Save
                  </a>
                </div>
              ) : (
                /* SoundCloud iframe card */
                <div style={cardStyle}>
                  <iframe
                    width="100%"
                    height="120"
                    style={{ border: "none", display: "block" }}
                    allow="autoplay"
                    src={scSrc(release.scUrl!)}
                    title={release.title}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
