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
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, var(--border), transparent)",
        }}
        aria-hidden="true"
      />

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
