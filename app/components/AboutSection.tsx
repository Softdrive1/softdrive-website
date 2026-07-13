"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

const BIO =
  "Oliver and Bennet started working together in 2020 and merged into the non-divisible duo Softdrive ever since. Oliver's production skills gained over the last 10 years, combined with Bennet's fresh ideas and different approach on music making brings up a mix of Hard House, New Wave and Trance. During late-night studio sessions listening to old records, sampling, and twisting music from all kinds of genres Softdrive has developed their unique signature sound. Their release 'Nights Like This' ft. BNZN on Polyamor Records brought them spotlight and recognition in Hamburg's music scene.";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative"
      style={{ background: "var(--bg)", paddingTop: "6rem", paddingBottom: "6rem" }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, var(--border), transparent)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 px-6 md:px-8" style={{ maxWidth: "1000px", marginLeft: "auto", marginRight: "auto" }}>
        <SectionHeading>About</SectionHeading>

        <motion.div
          style={{ maxWidth: "640px", marginLeft: "auto", marginRight: "auto" }}
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
      </div>
    </section>
  );
}
