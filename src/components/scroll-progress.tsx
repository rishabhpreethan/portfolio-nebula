"use client";

import { useEffect, useRef } from "react";
import { scrollSlice } from "@/lib/motion-store";

// §9.4 — Top-edge 1 px progress bar. `scaleX` from 0..1 mapped to scroll
// progress, `transform-origin: left`. Color: --accent-starlight. No
// transition duration — it tracks scroll exactly. Reads scrollSlice in
// its own rAF loop and writes the DOM directly to avoid React re-renders.
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    let raf: number | null = null;
    let lastProgress = -1;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const p = scrollSlice.get().progress;
      if (Math.abs(p - lastProgress) < 0.0005) return;
      lastProgress = p;
      bar.style.transform = `scaleX(${p})`;
    };
    raf = requestAnimationFrame(tick);

    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-px origin-left"
      style={{ background: "var(--accent-starlight)", transform: "scaleX(0)" }}
      ref={barRef}
    />
  );
}
