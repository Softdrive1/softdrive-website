"use client";

import { useSyncExternalStore } from "react";
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
    id: "how-to-save-a-life",
    title: "How To Save A Life",
    subtitle: "with DJ Tallboy & Trancemaster Krause",
    spotifyId: "5WGE2ypSrpjoV9YNzqFNUN",
  },
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

/* Upcoming single — pre-save card, laid out like the Spotify embed below it
   (152 px, cover top-left, title / artists / third row, action bottom-right)
   so the list reads as one set. Reuse it for every release in the weeks
   before it comes out. The Ditto link is a pre-save page until release day and
   turns into the smart link on its own afterwards, so only the wording flips.
   Once the track is on Spotify, move it into RELEASES with its spotifyId and
   drop this block. */
const UPCOMING = {
  title: "Dreamworld",
  artists: "Softdrive, Senna",
  cover: "/releases/dreamworld.webp",
  url: "https://ditto.fm/dreamworld-softdrive",
  releaseDate: "2026-11-20",
  releaseLabel: "20.11.2026",
};

const NEVER_CHANGES = () => () => {};

function UpcomingCard() {
  /* Compared in the visitor's local time; server snapshot = not out yet,
     so SSR and first paint always agree. */
  const isOut = useSyncExternalStore(
    NEVER_CHANGES,
    () => new Date() >= new Date(`${UPCOMING.releaseDate}T00:00:00`),
    () => false
  );

  return (
    <a
      href={UPCOMING.url}
      target="_blank"
      rel="noopener noreferrer"
      className="upcoming-card"
      aria-label={`${UPCOMING.title} – ${isOut ? "listen now" : "pre-save"}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={UPCOMING.cover}
        alt={`${UPCOMING.title} cover`}
        width={120}
        height={120}
        className="upcoming-cover"
      />
      <div className="upcoming-body">
        <span className="upcoming-title">{UPCOMING.title}</span>
        <span className="upcoming-artists">{UPCOMING.artists}</span>
        <span className="upcoming-meta">
          {isOut ? "Out now" : `Out ${UPCOMING.releaseLabel}`}
        </span>
      </div>
      <span className="upcoming-button">{isOut ? "Listen now" : "Pre-save"}</span>
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
                  <UpcomingCard />
                </div>
              </div>
            </motion.div>
            {RELEASES.map((release) => (
              <motion.div key={release.id} variants={itemVariants}>
                <div className="release-card-outer">
                  <div className="release-card-inner">
                    {release.spotifyId ? (
                      /* Released on Spotify — official embed */
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
