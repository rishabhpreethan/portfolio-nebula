"use client";

import { motion } from "framer-motion";
import { fadeRiseVariants, viewportOnce } from "@/lib/motion";
import type { ReactNode } from "react";

// Wrapper that mounts each section with a scroll-triggered fade+rise.
// See EVENT_MODEL SECTION_ENTER / SECTION_EXIT (fade-in is one-shot).
//
// Why not a Server Component: Framer Motion's whileInView needs client JS.
// The children themselves can remain server-rendered, they're just composed here.
export function Section({
  id,
  eyebrow,
  heading,
  children,
  className = "",
}: {
  id: string;
  eyebrow?: string;
  heading?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeRiseVariants}
      className={[
        "mx-auto max-w-6xl scroll-mt-24 px-6 py-24 md:py-32 lg:py-40",
        className,
      ].join(" ")}
    >
      {eyebrow && (
        <p className="text-ink-muted mb-4 text-xs uppercase tracking-[0.18em]">
          {eyebrow}
        </p>
      )}
      {heading && (
        <h2 className="font-display text-ink mb-10 text-4xl md:text-5xl">
          {heading}
        </h2>
      )}
      {children}
    </motion.section>
  );
}
