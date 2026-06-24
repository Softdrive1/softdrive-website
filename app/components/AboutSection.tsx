"use client";

import { motion } from "framer-motion";

const BIO =
  "Oliver and Bennet started working together in 2020 and merged into the non-divisible duo Softdrive ever since. Oliver's production skills gained over the last 10 years, combined with Bennet's fresh ideas and different approach on music making brings up a mix of Hard House, New Wave and Trance. During late-night studio sessions listening to old records, sampling, and twisting music from all kinds of genres Softdrive has developed their unique signature sound. Their release 'Nights Like This' ft. BNZN on Polyamor Records brought them spotlight and recognition in Hamburg's music scene.";

export default function AboutSection() {
  return (
    <section
      id="about"
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

      <div className="relative z-10 px-6 md:px-8" style={{ maxWidth: "1100px", marginLeft: "auto", marginRight: "auto" }}>
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
            About
          </h2>
        </motion.div>

        <motion.div
          className="max-w-2xl mx-auto"
          style={{ maxWidth: "42rem", marginLeft: "auto", marginRight: "auto" }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8 }}
        >
          <div
            className="w-10 h-0.5 mb-8 mx-auto"
            style={{ background: "#1a1a1a" }}
          />
          <p
            className="text-base md:text-lg leading-relaxed"
            style={{ color: "rgba(26,26,26,0.8)", lineHeight: 1.85 }}
          >
            {BIO}
          </p>

          <div className="mt-10 grid grid-cols-3 gap-6">
            {[
              { value: "~800K", label: "Streams on Nights Like This" },
              { value: "2020", label: "Founded in Hamburg" },
              { value: "June 26", label: "Symphony release date" },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  className="text-2xl font-bold font-picnic"
                  style={{ color: "#1a1a1a" }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-xs mt-1 leading-snug"
                  style={{ color: "rgba(26,26,26,0.5)" }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
