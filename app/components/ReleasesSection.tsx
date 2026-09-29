"use client";

import { motion, type Variants } from "framer-motion";
import SectionHeading from "./SectionHeading";
import SoundCloudPlayer from "./SoundCloudPlayer";
import SpotifyPlayer from "./SpotifyPlayer";

interface Release {
  id: string;
  title: string;
  subtitle?: string;
  spotifyId?: string;
  scUrl?: string;
}

const RELEASES: Release[] = [
  {
    id: "symphony",
    title: "Symphony",
    spotifyId: "3Tm7q3TW6EsJCUZTfBi8Y8",
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

/* Upcoming release with a pre-save link — sits above the released tracks and
   mirrors the Spotify embed below it (152 px, artwork left, tinted from the
   cover). Remove, or move into RELEASES as a Spotify track, once it is out. */
const PRESAVE = {
  title: "How To Save A Life",
  artists: "DJ Tallboy, Trancemaster Krause, Softdrive",
  url: "https://hypeddit.com/tallboy-trancy-softdrive/howtosavealife",
  cover: "/covers/how-to-save-a-life.webp",
  tint: "#233a5e",
};

function PreSaveCard() {
  return (
    <a
      href={PRESAVE.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
      style={{
        height: "152px",
        padding: "16px",
        display: "flex",
        gap: "16px",
        background: PRESAVE.tint,
        color: "#ffffff",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={PRESAVE.cover}
        alt={`${PRESAVE.title} cover`}
        width={120}
        height={120}
        style={{ width: "120px", height: "120px", borderRadius: "8px", flex: "none", objectFit: "cover" }}
      />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <span
          style={{
            fontWeight: 700,
            fontSize: "16px",
            lineHeight: 1.25,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {PRESAVE.title}
        </span>
        <span
          style={{
            marginTop: "4px",
            fontSize: "13px",
            color: "rgba(255, 255, 255, 0.7)",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {PRESAVE.artists}
        </span>
        <span
          style={{
            marginTop: "auto",
            alignSelf: "flex-end",
            fontSize: "13px",
            fontWeight: 700,
            color: "#08080b",
            background: "#ffffff",
            borderRadius: "999px",
            padding: "8px 16px",
            whiteSpace: "nowrap",
          }}
        >
          Pre-Save
        </span>
      </div>
    </a>
  );
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
      style={{ paddingTop: "6rem", paddingBottom: "3rem" }}
    >

      <div
        className="px-6 md:px-8"
        style={{ maxWidth: "1000px", marginLeft: "auto", marginRight: "auto" }}
      >
        <SectionHeading>Releases</SectionHeading>

        <motion.div
          className="flex flex-col"
          style={{ gap: "16px", maxWidth: "640px", marginLeft: "auto", marginRight: "auto" }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
            <motion.div variants={itemVariants}>
              <div className="release-card-outer">
                <div className="release-card-inner">
                  <PreSaveCard />
                </div>
              </div>
            </motion.div>
            {RELEASES.map((release) => (
              <motion.div key={release.id} variants={itemVariants}>
                <div className="release-card-outer">
                  <div className="release-card-inner">
                    {release.spotifyId ? (
                      /* Symphony — Spotify embed (released) */
                      <SpotifyPlayer
                        trackId={release.spotifyId}
                        title={release.title}
                      />
                    ) : (
                      <SoundCloudPlayer
                        url={release.scUrl!}
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
