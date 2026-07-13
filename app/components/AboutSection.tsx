"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionHeading from "./SectionHeading";

const BIO =
  "Oliver and Bennet started working together in 2020 and merged into the non-divisible duo Softdrive ever since. Oliver's production skills gained over the last 10 years, combined with Bennet's fresh ideas and different approach on music making brings up a mix of Hard House, New Wave and Trance. During late-night studio sessions listening to old records, sampling, and twisting music from all kinds of genres Softdrive has developed their unique signature sound. Their release 'Nights Like This' ft. BNZN on Polyamor Records brought them spotlight and recognition in Hamburg's music scene.";

/* ── Artist scans: tilted analog prints with scroll parallax ── */

type Scan = {
  src: string;
  w: number;
  h: number;
  rotate: number;
  /* parallax travel in px over the scroll-through */
  drift: number;
};

const SCANS_LEFT: Scan[] = [
  { src: "/photos/duo-fisheye.jpg", w: 1200, h: 800, rotate: -4.5, drift: 26 },
  { src: "/photos/duo-posters.jpg", w: 800, h: 1200, rotate: 3, drift: 44 },
];

const SCANS_RIGHT: Scan[] = [
  { src: "/photos/duo-arch.jpg", w: 1200, h: 781, rotate: 3.5, drift: 36 },
  { src: "/photos/duo-above.jpg", w: 800, h: 1200, rotate: -3, drift: 22 },
];

function ArtistScan({ scan, className }: { scan: Scan; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [scan.drift, -scan.drift]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ y, rotate: scan.rotate }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8 }}
    >
      <Image
        src={scan.src}
        alt=""
        width={scan.w}
        height={scan.h}
        className="scan-photo"
        sizes="(min-width: 768px) 300px, 44vw"
      />
    </motion.div>
  );
}

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative"
      style={{
        paddingTop: "6rem",
        paddingBottom: "6rem",
        overflowX: "clip",
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, var(--border), transparent)",
        }}
        aria-hidden="true"
      />

      <div
        className="relative z-10 px-6 md:px-8"
        style={{ maxWidth: "1240px", marginLeft: "auto", marginRight: "auto" }}
      >
        <SectionHeading>About</SectionHeading>

        <div className="flex flex-col gap-12 md:grid md:items-center md:gap-10 md:[grid-template-columns:minmax(0,1fr)_minmax(0,560px)_minmax(0,1fr)]">
          <motion.div
            className="order-first md:order-none md:col-start-2 md:row-start-1"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8 }}
          >
            <div
              className="w-10 h-0.5 mb-8 mx-auto"
              style={{ background: "var(--accent)" }}
            />
            <p
              className="text-base md:text-lg leading-relaxed"
              style={{ color: "var(--text-muted)", lineHeight: 1.85 }}
            >
              {BIO}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 items-center gap-5 md:col-start-1 md:row-start-1 md:flex md:flex-col md:items-stretch md:gap-14">
            <ArtistScan scan={SCANS_LEFT[0]} />
            <ArtistScan scan={SCANS_LEFT[1]} className="md:w-[68%] md:self-end" />
          </div>

          <div className="grid grid-cols-2 items-center gap-5 md:col-start-3 md:row-start-1 md:flex md:flex-col md:items-stretch md:gap-14">
            <ArtistScan scan={SCANS_RIGHT[1]} className="md:w-[68%] md:self-start" />
            <ArtistScan scan={SCANS_RIGHT[0]} />
          </div>
        </div>
      </div>
    </section>
  );
}
