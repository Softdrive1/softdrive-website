"use client";

import { motion, type Variants } from "framer-motion";

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

function scSrc(url: string) {
  return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&visual=false`;
}

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
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

export default function SetsSection() {
  return (
    <section
      id="sets"
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
            Sets
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
          {SETS.map((set) => (
            <motion.div key={set.id} variants={itemVariants}>
              <div style={cardStyle}>
                <iframe
                  width="100%"
                  height="120"
                  style={{ border: "none", display: "block" }}
                  allow="autoplay"
                  src={scSrc(set.scUrl)}
                  title={set.title}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
