"use client";

import { motion } from "framer-motion";

const BIO =
  "Oliver and Bennet started working together in 2020 and merged into the non-divisible duo Softdrive ever since. Oliver's production skills gained over the last 10 years, combined with Bennet's fresh ideas and different approach on music making brings up a mix of Hard House, New Wave and Trance. During late-night studio sessions listening to old records, sampling, and twisting music from all kinds of genres Softdrive has developed their unique signature sound.";

function PhotoPlaceholder({ label }: { label: string }) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden aspect-[3/4]"
      style={{
        background:
          "linear-gradient(135deg, rgba(20,20,40,0.9) 0%, rgba(10,10,25,0.95) 100%)",
        border: "1px solid rgba(126,200,227,0.12)",
      }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(126,200,227,0.08)",
            border: "1px solid rgba(126,200,227,0.2)",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(126,200,227,0.5)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
          </svg>
        </div>
        <span
          className="text-xs tracking-[0.25em] uppercase"
          style={{ color: "rgba(136,136,136,0.5)" }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative py-20 md:py-28 px-6"
      style={{
        background:
          "linear-gradient(180deg, #08080f 0%, #0a0a0f 100%)",
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(126,200,227,0.15), transparent)",
        }}
        aria-hidden="true"
      />

      {/* Ambient orb */}
      <div
        className="absolute top-1/2 right-0 -translate-y-1/2 pointer-events-none"
        style={{
          width: "40vw",
          height: "40vw",
          background:
            "radial-gradient(circle, rgba(60, 80, 180, 0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mb-12 md:mb-16 text-center"
        >
          <p
            className="text-xs tracking-[0.35em] uppercase mb-3"
            style={{ color: "var(--accent)", opacity: 0.7 }}
          >
            Who we are
          </p>
          <h2
            className="font-picnic leading-none"
            style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", color: "var(--text)" }}
          >
            About
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-start">
          {/* Bio */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div
              className="w-10 h-0.5 mb-8"
              style={{ background: "var(--accent)" }}
            />
            <p
              className="text-base md:text-lg leading-relaxed"
              style={{ color: "rgba(232,232,232,0.8)", lineHeight: 1.85 }}
            >
              {BIO}
            </p>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-6">
              {[
                { value: "~800K", label: "Streams on Nights Like This" },
                { value: "2020", label: "Founded in Hamburg" },
                { value: "June 26", label: "Symphony release date" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div
                    className="text-2xl font-bold font-picnic"
                    style={{ color: "var(--accent)" }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-xs mt-1 leading-snug"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Photos */}
          <motion.div
            className="lg:col-span-2 grid grid-cols-2 gap-3"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          >
            <PhotoPlaceholder label="Photo 1" />
            <div className="mt-6">
              <PhotoPlaceholder label="Photo 2" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
