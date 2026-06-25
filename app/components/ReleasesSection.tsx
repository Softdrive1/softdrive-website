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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function ReleasesSection() {
  return (
    <section
      id="releases"
      className="relative"
      style={{ background: "#c3bfb9", paddingTop: "6rem", paddingBottom: "6rem" }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.13), transparent)",
        }}
        aria-hidden="true"
      />

      <div
        className="px-6 md:px-8"
        style={{ maxWidth: "1000px", marginLeft: "auto", marginRight: "auto" }}
      >
        <motion.div
          className="mb-10 md:mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2
            className="font-picnic leading-none"
            style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", color: "#1a1a1a" }}
          >
            Releases
          </h2>
        </motion.div>

        <motion.div
          className="flex flex-col"
          style={{ gap: "16px", maxWidth: "640px", marginLeft: "auto", marginRight: "auto" }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
            {RELEASES.map((release) => (
              <motion.div key={release.id} variants={itemVariants}>
                <div className="release-card-outer">
                  <div className="release-card-inner">
                    {release.presaveUrl ? (
                      /* Symphony — presave card */
                      <div
                        className="flex items-center justify-between"
                        style={{ height: "120px", paddingLeft: "20px", paddingRight: "16px" }}
                      >
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span
                              style={{
                                color: "#1a1a1a",
                                fontSize: "15px",
                                fontWeight: 600,
                                letterSpacing: "-0.01em",
                              }}
                            >
                              {release.title}
                            </span>
                            {release.isNew && (
                              <span
                                style={{
                                  fontSize: "8px",
                                  fontWeight: 700,
                                  letterSpacing: "0.22em",
                                  textTransform: "uppercase",
                                  background: "#E8A84C",
                                  color: "#0a0a0f",
                                  padding: "2px 8px",
                                  borderRadius: "999px",
                                }}
                              >
                                NEW
                              </span>
                            )}
                          </div>
                          {release.subtitle && (
                            <p
                              style={{
                                fontSize: "12px",
                                marginTop: "6px",
                                color: "rgba(26,20,14,0.42)",
                                letterSpacing: "0.01em",
                              }}
                            >
                              {release.subtitle}
                            </p>
                          )}
                        </div>
                        <a
                          href={release.presaveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            flexShrink: 0,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "10px 20px",
                            borderRadius: "999px",
                            fontSize: "13px",
                            fontWeight: 600,
                            letterSpacing: "0.01em",
                            background: "#1a1a1a",
                            color: "#fff",
                            textDecoration: "none",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
                            transition:
                              "opacity 0.25s, transform 0.25s cubic-bezier(0.25,0.46,0.45,0.94)",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.opacity = "0.82";
                            (e.currentTarget as HTMLElement).style.transform = "scale(0.98)";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.opacity = "1";
                            (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                          }}
                        >
                          Pre-Save
                          <span
                            style={{
                              width: "20px",
                              height: "20px",
                              borderRadius: "50%",
                              background: "rgba(255,255,255,0.14)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "11px",
                              lineHeight: 1,
                            }}
                          >
                            ↗
                          </span>
                        </a>
                      </div>
                    ) : (
                      /* SoundCloud iframe */
                      <iframe
                        width="100%"
                        height="120"
                        style={{ border: "none", display: "block" }}
                        allow="autoplay"
                        src={scSrc(release.scUrl!)}
                        title={release.title}
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
      </div>
    </section>
  );
}
