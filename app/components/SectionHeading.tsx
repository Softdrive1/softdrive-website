"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

/**
 * Centered chrome display heading. Fires a one-shot chrome glare
 * sweep the first time it scrolls into view.
 */
export default function SectionHeading({
  children,
  sub,
}: {
  children: React.ReactNode;
  sub?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className="mb-10 md:mb-12 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <h2
        className={`font-display chrome-text leading-none${inView ? " chrome-sweep" : ""}`}
        style={{ fontSize: "clamp(2.25rem, 7vw, 4rem)" }}
      >
        {children}
      </h2>
      {sub && (
        <p
          style={{
            marginTop: "16px",
            fontSize: "15px",
            color: "var(--text-muted)",
            lineHeight: 1.5,
          }}
        >
          {sub}
        </p>
      )}
    </motion.div>
  );
}
