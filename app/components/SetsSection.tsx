"use client";

import { motion, type Variants } from "framer-motion";
import SectionHeading from "./SectionHeading";
import SoundCloudPlayer from "./SoundCloudPlayer";

const SETS = [
  {
    id: "ver-x-teletech",
    title: "VER X TELETECH",
    scUrl: "https://soundcloud.com/softdrive/ver-x-teletech-2",
  },
  {
    id: "osterrave-2026",
    title: "Osterrave at Edelfettwerk 2026",
    scUrl: "https://soundcloud.com/softdrive/oster-version-2",
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

export default function SetsSection() {
  return (
    <section
      id="sets"
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
        <SectionHeading>Sets</SectionHeading>

        <motion.div
          className="flex flex-col"
          style={{ gap: "16px", maxWidth: "640px", marginLeft: "auto", marginRight: "auto" }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {SETS.map((set) => (
            <motion.div key={set.id} variants={itemVariants}>
              <div className="release-card-outer">
                <div className="release-card-inner">
                  <SoundCloudPlayer url={set.scUrl} title={set.title} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
